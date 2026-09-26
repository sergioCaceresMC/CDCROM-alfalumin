import { useState } from "react";
import type { Character, Gender } from "../game/schema";
import { attributeLabels, attributeNames } from "../game/schema";
import { addItem, addXp, armorClass, chooseLevelSkill, equipItem, maxHp, rename, setGender, setHp, setItemQuantity, toggleSkill, useItem } from "../game/engine";
import { Portrait, SkillCard, errorMessage } from "./shared";
import { ItemPicker } from "./item-picker";
import { ItemDisclosure } from "./item-disclosure";
import { GameIcon } from "./game-icon";
import { ClassDecoration, classTheme } from "./class-decoration";
import { SourceReference } from "./source-reference";

export function Sheet({ character: c, section, update }: {
  character: Character; section: string; update: (change: (c: Character) => Character) => void;
}) {
  const [error, setError] = useState("");
  const [xp, setXp] = useState("1");
  const [editingSkills, setEditingSkills] = useState(false);
  const cls = c.catalog.classes[0];
  function act(change: (c: Character) => Character) {
    try { update(change); setError(""); } catch (e) { setError(errorMessage(e)); }
  }
  const nextThreshold = c.rules.xpThresholds[c.level];
  return <div className="stack">
    <div className="panel hero class-card" data-class-theme={classTheme(c.classId)}><ClassDecoration classId={c.classId} /><Portrait image={cls.image} name={cls.name} classId={c.classId} gender={c.gender} /><div>
      <p className="eyebrow">{cls.name} · Nivel {c.level}</p><h1>{c.name}</h1><p className="muted">{cls.description}</p><SourceReference source={cls.source} />
      <div className="tags"><span>Semilla {c.seed}</span><span>{c.xp} XP</span></div>
    </div></div>
    {error && <p role="alert" className="notice error">{error}</p>}
    {c.pending && <section className="panel pending stack" aria-labelledby="level-title">
      <p className="eyebrow">Tu historia continúa</p><h2 id="level-title">Elige una habilidad para el nivel {c.pending.level}</h2>
      <p className="muted">La vida máxima no cambia al subir. Estas opciones se conservan hasta que elijas.</p>
      {!c.pending.options.length && <p role="alert" className="notice error">No quedan habilidades elegibles en este catálogo. La subida está bloqueada; conserva tu ficha y amplía sus datos antes de continuar.</p>}
      <div className="entry-grid">{c.pending.options.map(id => <SkillCard key={id} skill={c.catalog.skills.find(s => s.id === id)!} action={<button className="primary" onClick={() => act(current => chooseLevelSkill(current, id))}>Aprender y subir de nivel</button>} />)}</div>
    </section>}
    {section === "resumen" && <>
      <div className="stats-grid"><section className="panel vitality"><p className="eyebrow"><GameIcon name="heart" />Vida actual</p><p className="big-number">{c.hp}<span> / {maxHp(c)}</span></p><progress value={c.hp} max={maxHp(c)} aria-label="Vida actual" /><div className="button-row"><button aria-label="Recibir un punto de daño" onClick={() => act(current => setHp(current, current.hp - 1))}>− Daño</button><button aria-label="Curar un punto de vida" onClick={() => act(current => setHp(current, current.hp + 1))}>+ Curar</button></div><label className="inline-label">Ajustar vida<input type="number" min={0} max={maxHp(c)} value={c.hp} onChange={e => act(current => setHp(current, e.target.valueAsNumber))} /></label></section>
      <section className="panel armor"><p className="eyebrow"><GameIcon name="shield" />Clase de armadura</p><p className="big-number">{armorClass(c)}</p><p className="muted">Según la armadura equipada. Sin armadura: 10.</p></section></div>
      <section className="panel stack"><div className="section-heading"><h2>Atributos</h2><span className="badge">0 a +3</span></div><dl className="attribute-grid">{attributeNames.map(key => <div className="attribute" key={key}><dt>{attributeLabels[key]}</dt><dd>{c.attributes[key] === 0 ? "0" : `+${c.attributes[key]}`}</dd></div>)}</dl><p className="fine">Constitución determina tu vida máxima. Los atributos se conservan desde la creación del personaje.</p></section>
      <section className="panel stack"><h2>Progresión</h2><p>{c.xp} XP acumulados · {nextThreshold === undefined ? `Nivel máximo de esta fase: ${c.rules.maxLevel}` : `Próximo nivel: ${nextThreshold} XP`}</p>
        <form className="button-row" onSubmit={e => { e.preventDefault(); act(current => addXp(current, Number(xp))); }}><label>XP que añadir<input type="number" min="0" max="1000000000" step="1" value={xp} onChange={e => setXp(e.target.value)} required /></label><button className="primary">Añadir XP</button></form><p className="fine">Los niveles se resuelven en orden. La XP adicional se conserva incluso al llegar al nivel máximo.</p>
      </section>
      <section className="panel stack"><h2>Identidad</h2><form className="button-row" onSubmit={e => {
        e.preventDefault(); const data = new FormData(e.currentTarget); act(current => rename(current, String(data.get("name"))));
      }}><label>Nombre<input key={c.name} name="name" maxLength={60} defaultValue={c.name} required /></label><button className="secondary">Guardar nombre</button></form><label>Apariencia<select value={c.gender} onChange={e => act(current => setGender(current, e.target.value as Gender))}><option value="m">Masculino</option><option value="f">Femenino</option></select></label></section>
    </>}
    {section === "inventario" && <>
      <div className="section-heading"><h2>Inventario</h2><span className="badge">{c.inventory.length} objetos</span></div>
      {!c.inventory.length && <p className="panel muted">Tu mochila está vacía. Añade un objeto del catálogo.</p>}
      <div className="inventory-list">{c.inventory.map(entry => {
        const item = c.catalog.items.find(i => i.id === entry.itemId)!;
        return <article key={item.id} className="inventory-item" aria-label={`Objeto ${item.name}`}>
          <div className="item-summary"><div className="item-summary-title"><h3>{item.name}</h3><div className="tags"><span className={entry.equipped ? "equipment-state equipped" : "equipment-state"}>{entry.equipped ? "Equipado" : "No equipado"}</span>{item.damage && <span>Daño {item.damage}</span>}</div></div>
            <label className="item-quantity">Cantidad<input aria-label={`Cantidad de ${item.name}`} type="number" min={0} max={9999} value={entry.quantity} onChange={e => act(current => setItemQuantity(current, item.id, e.target.valueAsNumber))} /></label>
          </div>
          <ItemDisclosure item={item}>
            <div className="tags">{item.armor && <span>Armadura {item.armor}</span>}<span>{item.consumable ? "Consumible" : item.usable ? "Usable" : "Equipo"}</span></div>
            <div className="button-row">{["weapon", "armor"].includes(item.kind) && <button className="secondary" onClick={() => act(current => equipItem(current, item.id))}>{entry.equipped ? "Desequipar" : "Equipar"}</button>}{item.usable && <button className="secondary" onClick={() => act(current => useItem(current, item.id))}>{item.consumable ? "Consumir una unidad" : "Usar objeto"}</button>}</div>
            {item.usable && !item.effect && <p className="fine">Su efecto lo resuelve el master; {item.consumable ? "se resta una unidad al usarlo" : "no modifica automáticamente la ficha"}.</p>}
            <button className="text-button danger" onClick={() => act(current => setItemQuantity(current, item.id, 0))}>Quitar objeto</button>
          </ItemDisclosure>
        </article>;
      })}</div>
      <ItemPicker savedItems={c.catalog.items} onAdd={item => act(current => addItem(current, item))} />
    </>}
    {section === "habilidades" && <>
      <div className="section-heading"><h2>Habilidades</h2><span className="badge">{c.skillIds.length} conocidas</span></div>
      <p className="muted">Los chequeos y el daño los resuelves en la mesa. Solo se muestran habilidades de tu clase y nivel.</p>
      {!c.skillIds.length && <p className="panel muted">No tienes habilidades. Puedes añadirlas desde la edición manual.</p>}
      <div className="entry-grid">{c.skillIds.map(id => <SkillCard key={id} skill={c.catalog.skills.find(s => s.id === id)!} />)}</div>
      <button className="secondary" aria-expanded={editingSkills} disabled={!!c.pending} onClick={() => setEditingSkills(!editingSkills)}>{editingSkills ? "Cerrar edición" : "Editar habilidades manualmente"}</button>
      {c.pending && <p className="fine">Resuelve primero la elección pendiente para editar habilidades.</p>}
      {editingSkills && !c.pending && <div className="entry-grid">{c.catalog.skills.filter(s => s.classId === c.classId && s.level <= c.level).map(skill => <SkillCard key={skill.id} skill={skill} action={<button className="secondary" aria-pressed={c.skillIds.includes(skill.id)} onClick={() => act(current => toggleSkill(current, skill.id))}>{c.skillIds.includes(skill.id) ? "Quitar habilidad" : "Añadir habilidad"}</button>} />)}</div>}
    </>}
  </div>;
}


