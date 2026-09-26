import type { Source } from "../game/source";

export function SourceReference({ source }: { source?: Source }) {
  if (!source) return null;
  const url = `https://media.dndbeyond.com/compendium-images/srd/5.2/SP_SRD_CC_v5.2.1.pdf#page=${source.page}`;
  return <details className="fine"><summary>Referencia original · {source.document}, p. {source.page}</summary>
    <p>Estos valores pertenecen al sistema original; la ficha utiliza una adaptación de Alfa Lumin. Los efectos especiales los resuelve el master.</p>
    {source.text && <p style={{ whiteSpace: "pre-wrap" }}>{source.text}</p>}
    <a href={url} target="_blank" rel="noreferrer">Consultar {source.name} en el SRD</a>
  </details>;
}
