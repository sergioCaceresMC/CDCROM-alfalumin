import type { Item } from "../game/schema";

const labels = { weapon: "Arma", armor: "Armadura", consumable: "Consumible", misc: "Objeto" };
export function CardItemProperties({ item }: { item?: Item }) {
  if (!item) return null;
  return <div className="tags" aria-label="Propiedades del equipo">
    <span>{labels[item.kind]}</span>
    {item.damage && <span>Daño · {item.damage}</span>}
    {item.armor !== undefined && <span>Armadura · {item.armor}</span>}
    {item.consumable && <span>Consumible · una unidad por uso</span>}
    {item.effect?.type === "heal" && <span>Curación · {item.effect.amount} vida</span>}
  </div>;
}
