import { useId, useState } from "react";
import type { ReactNode } from "react";
import type { Item } from "../game/schema";

export function ItemDisclosure({ item, children }: { item: Item; children?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const label = `${open ? "Ocultar" : "Mostrar"} descripción de ${item.name}`;
  return <div className="item-disclosure">
    <button type="button" className="eye-toggle" aria-label={label} title={label} aria-expanded={open} aria-controls={id} onClick={() => setOpen(value => !value)}>
      <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" />{open && <path d="m4 3 16 18" />}
      </svg>
    </button>
    {open && <div id={id} role="region" aria-label={`Detalles de ${item.name}`} className="item-details stack"><p>{item.description}</p>{children}</div>}
  </div>;
}
