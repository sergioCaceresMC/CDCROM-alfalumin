import type { CardDefinition } from "../master/table-engine";

export function CardImageCredit({ card }: { card: CardDefinition }) {
  if (!card.imageCredit) return null;
  return <p className="fine">Imagen: <a href={card.imageCredit.url} target="_blank" rel="noreferrer">{card.imageCredit.text}</a></p>;
}
