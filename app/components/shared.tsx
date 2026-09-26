import type { ReactNode } from "react";
import type { Gender, Skill } from "../game/schema";
import { attributeLabels } from "../game/schema";
import { SourceReference } from "./source-reference";

const portraits = import.meta.glob<string>("../data/classes/images/*.{webp,png,jpg,jpeg}", { eager: true, query: "?url", import: "default" });
export function portraitSource(classId: string, gender: Gender): string | undefined {
  const filename = `${classId}-${gender}`;
  return Object.entries(portraits).find(([path]) => path.split("/").pop()?.replace(/\.[^.]+$/, "") === filename)?.[1];
}
export function Portrait({ image, name, classId, gender = "m", small = false }: { image: string; name: string; classId: string; gender?: Gender; small?: boolean }) {
  const src = portraitSource(classId, gender) ?? `${import.meta.env.BASE_URL}${image}`;
  return <img className={small ? "portrait small" : "portrait"} src={src} alt={`${name} · ${gender === "f" ? "Femenino" : "Masculino"}`} width="160" height="160" onError={e => {
    const fallback = new URL(`${import.meta.env.BASE_URL}images/mistico.svg`, window.location.href).href;
    if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
  }} />;
}
export function SkillCard({ skill, action }: { skill: Skill; action?: ReactNode }) {
  return <article className="entry">
    <div className="entry-heading"><h3>{skill.name}</h3><span className="badge">Nivel {skill.level}</span></div>
    <p>{skill.description}</p>
    <SourceReference source={skill.source} />
    <div className="tags">{skill.attribute && <span>Chequeo · {attributeLabels[skill.attribute]}</span>}{skill.damage && <span>Daño · {skill.damage}</span>}</div>
    {action}
  </article>;
}
export function download(name: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "application/json;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url; link.download = name; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function errorMessage(error: unknown): string {
  if (error instanceof Error && error.name === "ZodError") return "Datos inválidos: revisa los límites, las referencias y las opciones elegidas.";
  return error instanceof Error ? error.message : "No se pudo completar la operación";
}
