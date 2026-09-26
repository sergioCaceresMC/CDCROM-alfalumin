import { z } from "zod";
import { characterSchema } from "../game/schema";
import type { Character } from "../game/schema";
import { maxHp } from "../game/engine";
import { emptyTable, tableSchema } from "./table-engine";

const identifier = z.string().min(1).max(100);
const name = z.string().trim().min(1).max(60);
const memberSchema = z.object({ id: identifier, character: characterSchema }).strict();
const combatantSchema = z.object({
  id: identifier, name, kind: z.enum(["player", "enemy"]),
  memberId: identifier.optional(), initiative: z.number().int().min(-100).max(100),
  maxHp: z.number().int().min(1).max(999), hp: z.number().int().min(0).max(999),
}).strict().refine(c => c.hp <= c.maxHp && (c.kind !== "player" || !!c.memberId), "Combatiente inválido");
export const encounterSchema = z.object({
  id: identifier, name, combatants: z.array(combatantSchema).max(100),
  round: z.number().int().min(1).max(1_000_000), activeId: identifier.nullable(),
  status: z.enum(["preparing", "active", "finished"]),
}).strict().superRefine((e, ctx) => {
  if (new Set(e.combatants.map(c => c.id)).size !== e.combatants.length ||
    (e.activeId !== null && !e.combatants.some(c => c.id === e.activeId)) ||
    (e.status === "active" ? e.activeId === null : e.activeId !== null)) {
    ctx.addIssue({ code: "custom", message: "Orden de turnos inválido" });
  }
});
export const campaignSchema = z.object({
  id: identifier, name, notes: z.string().max(20_000),
  table: tableSchema.default(emptyTable),
  members: z.array(memberSchema).max(100), encounters: z.array(encounterSchema).max(100),
}).strict().superRefine((c, ctx) => {
  if (new Set(c.members.map(m => m.id)).size !== c.members.length ||
    new Set(c.encounters.map(e => e.id)).size !== c.encounters.length ||
    c.members.some(m => m.character.status !== "ready") ||
    c.encounters.some(e => e.combatants.some(p => p.memberId && !c.members.some(m => m.id === p.memberId)))) {
    ctx.addIssue({ code: "custom", message: "Referencias de campaña inválidas" });
  }
});
export const masterSchema = z.object({ version: z.literal(1), campaigns: z.array(campaignSchema).max(50) }).strict()
  .refine(s => new Set(s.campaigns.map(c => c.id)).size === s.campaigns.length, "Campañas duplicadas");
export type MasterState = z.infer<typeof masterSchema>;
export type Campaign = z.infer<typeof campaignSchema>;
export type Encounter = z.infer<typeof encounterSchema>;
export type Combatant = z.infer<typeof combatantSchema>;
export const emptyMaster = (): MasterState => ({ version: 1, campaigns: [] });
export function createCampaign(title: string, id: string): Campaign {
  return campaignSchema.parse({ id, name: title, notes: "", members: [], encounters: [] });
}
export function addParticipant(campaign: Campaign, character: Character, id: string): Campaign {
  const copy = characterSchema.parse(structuredClone(character));
  if (copy.status !== "ready") throw new Error("Completa la ficha antes de añadirla a una campaña.");
  return campaignSchema.parse({ ...campaign, members: [...campaign.members, { id, character: copy }] });
}
export function createEncounter(campaign: Campaign, title: string, id: string, newId: () => string): Encounter {
  return encounterSchema.parse({ id, name: title, round: 1, activeId: null, status: "preparing",
    combatants: campaign.members.map(m => ({ id: newId(), memberId: m.id, kind: "player", name: m.character.name,
      hp: m.character.hp, maxHp: maxHp(m.character), initiative: 0 })),
  });
}
export function turnOrder(encounter: Encounter): Combatant[] {
  // Stable array position breaks initiative ties, including after reload or import.
  return encounter.combatants.map((c, index) => ({ c, index })).sort((a, b) => b.c.initiative - a.c.initiative || a.index - b.index).map(entry => entry.c);
}
export function startEncounter(encounter: Encounter): Encounter {
  if (encounter.status !== "preparing") throw new Error("Este encuentro ya ha comenzado.");
  const first = turnOrder(encounter)[0];
  if (!first) throw new Error("Añade al menos un participante o adversario.");
  return encounterSchema.parse({ ...encounter, status: "active", round: 1, activeId: first.id });
}
export function nextTurn(encounter: Encounter): Encounter {
  if (encounter.status !== "active") throw new Error("El encuentro no está en curso.");
  const order = turnOrder(encounter);
  const next = (order.findIndex(c => c.id === encounter.activeId) + 1) % order.length;
  if (next === 0 && encounter.round === 1_000_000) throw new Error("Se ha alcanzado el límite de rondas.");
  return encounterSchema.parse({ ...encounter, activeId: order[next].id, round: encounter.round + (next === 0 ? 1 : 0) });
}
export function setCombatantHp(encounter: Encounter, id: string, hp: number): Encounter {
  if (!Number.isFinite(hp)) throw new Error("Introduce una vida válida.");
  return encounterSchema.parse({ ...encounter, combatants: encounter.combatants.map(c => c.id === id ? { ...c, hp: Math.max(0, Math.min(c.maxHp, Math.trunc(hp))) } : c) });
}
export function setInitiative(encounter: Encounter, id: string, initiative: number): Encounter {
  if (encounter.status !== "preparing") throw new Error("La iniciativa queda fijada al comenzar el encuentro.");
  return encounterSchema.parse({ ...encounter, combatants: encounter.combatants.map(c => c.id === id ? { ...c, initiative } : c) });
}
export function addEnemy(encounter: Encounter, enemy: { id: string; name: string; maxHp: number; initiative: number }): Encounter {
  if (encounter.status !== "preparing") throw new Error("Añade adversarios antes de comenzar.");
  return encounterSchema.parse({ ...encounter, combatants: [...encounter.combatants, { ...enemy, kind: "enemy", hp: enemy.maxHp }] });
}

const transferSchema = z.object({ format: z.literal("alfa-lumin-master"), version: z.literal(1), data: masterSchema }).strict();
export function exportMaster(state: MasterState): string {
  const json = JSON.stringify(transferSchema.parse({ format: "alfa-lumin-master", version: 1, data: state }), null, 2);
  if (new TextEncoder().encode(json).length > 10_000_000) throw new Error("La copia supera 10 MB. Exporta las campañas por separado.");
  return json;
}
export function importMaster(current: MasterState, json: string, newId: () => string): MasterState {
  if (new TextEncoder().encode(json).length > 10_000_000) throw new Error("El archivo supera 10 MB.");
  const imported = transferSchema.parse(JSON.parse(json)).data;
  const copies = imported.campaigns.map(c => {
    const members = new Map(c.members.map(m => [m.id, newId()]));
    return { ...c, id: newId(), table: { ...c.table, imageMaps: c.table.imageMaps.map(m => ({ ...m, id: newId() })), cards: c.table.cards.map(p => ({ ...p, id: newId() })), storedCards: c.table.storedCards.map(p => ({ ...p, id: newId() })), tokens: c.table.tokens.map(p => ({ ...p, id: newId() })) }, members: c.members.map(m => ({ id: members.get(m.id)!, character: { ...m.character, id: newId() } })),
      encounters: c.encounters.map(e => {
        const combatants = new Map(e.combatants.map(p => [p.id, newId()]));
        return { ...e, id: newId(), activeId: e.activeId === null ? null : combatants.get(e.activeId)!,
          combatants: e.combatants.map(p => ({ ...p, id: combatants.get(p.id)!, ...(p.memberId ? { memberId: members.get(p.memberId)! } : {}) })),
        };
      }),
    };
  });
  return masterSchema.parse({ ...current, campaigns: [...current.campaigns, ...copies] });
}
