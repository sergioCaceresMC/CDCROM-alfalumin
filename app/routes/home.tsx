import { useState } from "react";
import { useSearchParams } from "react-router";
import type { Route } from "./+types/home";
import { loadClasses, loadRules } from "../game/catalog";
import { useLibrary } from "../game/use-library";
import type { Character, Library } from "../game/schema";
import { Creation } from "../components/creation";
import { Sheet } from "../components/sheet";
import { Transfers } from "../components/transfers";
import { Portrait, download, errorMessage } from "../components/shared";
import { GameIcon } from "../components/game-icon";

export async function clientLoader() {
  const [classes, rules] = await Promise.all([loadClasses(), loadRules()]);
  return { classes, rules };
}
export function meta({}: Route.MetaArgs) {
  return [{ title: "Alfa Lumin · Tu próxima aventura" }, { name: "description", content: "Crea personajes, conserva sus historias y llévalos a tu mesa de rol." }];
}
const sections = ["resumen", "inventario", "habilidades", "guardado"] as const;
const labels = { resumen: "Ficha", inventario: "Mochila", habilidades: "Habilidades", guardado: "Guardar" };
const icons = { resumen: "shield", inventario: "bag", habilidades: "sword", guardado: "save" } as const;

export default function Home({ loaderData: { classes, rules } }: Route.ComponentProps) {
  const { library, ready, warning, raw, commit, retry } = useLibrary();
  const [params, setParams] = useSearchParams();
  const [error, setError] = useState("");
  const id = params.get("personaje");
  const character = library.characters.find(c => c.id === id);
  const requested = params.get("seccion");
  const section = sections.find(s => s === requested) ?? "resumen";
  const creating = !id && requested === "crear";
  function safely(update: (l: Library) => Library) { commit(update); setError(""); }
  function openCharacter(characterId: string) {
    safely(l => ({ ...l, activeId: characterId }));
    setParams({ personaje: characterId, seccion: "resumen" });
  }
  function updateCharacter(change: (c: Character) => Character) {
    safely(l => ({ ...l, characters: l.characters.map(c => c.id === id ? change(c) : c) }));
  }
  function remove(characterId: string) {
    if (!window.confirm("¿Eliminar esta ficha del navegador? Exporta una copia si quieres conservarla.")) return;
    try { safely(l => ({ ...l, characters: l.characters.filter(c => c.id !== characterId), activeId: l.activeId === characterId ? null : l.activeId })); }
    catch (e) { setError(errorMessage(e)); }
  }
  if (!ready) return <main className="loading" role="status">Abriendo tu biblioteca…</main>;
  return <div className="app-shell">
    <header className="site-header"><button className="brand" onClick={() => setParams({})} aria-label="Alfa Lumin, abrir biblioteca"><span className="brand-symbol"><GameIcon name="book" /></span><span>ALFA LUMIN<small>Cuaderno de aventuras</small></span></button><span className="offline-badge">Solo en tu dispositivo</span></header>
    <main className="main-content">
      {warning && <aside className="notice error stack" role="alert"><p>{warning}</p><div className="button-row"><button onClick={retry}>Reintentar guardado</button>{raw && <button onClick={() => download("alfa-lumin-guardado-original.json", raw)}>Descargar datos originales</button>}</div></aside>}
      {error && <p className="notice error" role="alert">{error}</p>}
      {(creating || character) && <button className="text-button back" onClick={() => setParams({})}>← Biblioteca de personajes</button>}
      {id && !character && <p className="notice" role="status">Este personaje no está en tu biblioteca. Importa su archivo o código para recuperarlo.</p>}
      {creating ? <Creation library={library} classes={classes} rules={rules} commit={safely} onCreated={openCharacter} /> : character ? <>
        <nav className="sheet-nav" aria-label="Secciones del personaje">{sections.map(s => <button key={s} aria-current={section === s ? "page" : undefined} onClick={() => setParams({ personaje: character.id, seccion: s })}><GameIcon name={icons[s]} />{labels[s]}</button>)}</nav>
        <Sheet key={character.id} character={character} section={section} update={updateCharacter} />
        {section === "guardado" && <Transfers library={library} character={character} commit={safely} />}
      </> : <div className="stack library">
        <div className="library-heading"><h1>Tu biblioteca</h1><button className="primary" onClick={() => setParams({ seccion: "crear" })}>{library.draft ? "Continuar borrador →" : "+ Crear personaje"}</button></div>
        <p className="fine">{library.characters.length} personajes</p>
        {!library.characters.length && <section className="panel empty"><span><GameIcon name="book" /></span><h3>Aún no hay una historia escrita</h3><p className="muted">Crea tu primer personaje o recupera una ficha guardada.</p></section>}
        <div className="library-grid">{library.characters.map(c => <article className="panel library-card" key={c.id}>
          <Portrait image={c.catalog.classes[0].image} name={c.catalog.classes[0].name} classId={c.classId} gender={c.gender} small /><div className="stack"><div><p className="eyebrow">{c.catalog.classes[0].name} · Nivel {c.level}</p><h3>{c.name}</h3></div><p className="muted">{c.hp} / {c.catalog.classes[0].baseHp + c.attributes.constitucion} vida · {c.xp} XP</p>{c.id === library.activeId && <span className="badge">Último personaje activo</span>}<button className="secondary" onClick={() => openCharacter(c.id)}>Abrir ficha →</button><button className="text-button danger" onClick={() => remove(c.id)}>Eliminar ficha</button></div>
        </article>)}</div>
        <Transfers library={library} commit={safely} />
      </div>}
    </main><footer className="site-footer">ALFA LUMIN <span>Motor de prueba · Reglas provisionales · Nivel 1–3</span></footer>
  </div>;
}

