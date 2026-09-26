import { useState } from "react";
import type { CardDefinition } from "../master/table-engine";

const placeholders: Record<string, string> = {
  terrain: "images/cards/terrain.png", enemy: "images/cards/enemy.svg", npc: "images/cards/character.webp",
};
export function cardImageSource(image: string): string {
  return /^https?:\/\//.test(image) ? image : `${import.meta.env.BASE_URL}${image}`;
}
export function CardArt({ definition }: { definition: CardDefinition }) {
  const [failed, setFailed] = useState(false);
  const placeholder = placeholders[definition.kind];
  const source = failed ? placeholder : definition.image ?? placeholder;
  if (!source) return null;
  return <img className={`card-art art-${definition.kind}`} src={cardImageSource(source)} alt={`Ilustración de ${definition.name}`} draggable={false} loading="lazy" referrerPolicy="no-referrer" onError={() => setFailed(true)} />;
}
