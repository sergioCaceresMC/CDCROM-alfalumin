// @vitest-environment jsdom
import { afterEach, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ItemDisclosure } from "./item-disclosure";

afterEach(cleanup);
it("abre y cierra la descripción completa con el ojo y el teclado", async () => {
  const user = userEvent.setup();
  const item = { id: "reliquia", name: "Reliquia", description: "Primera línea.\nSegunda línea con todos los detalles.", kind: "misc" as const, usable: false, consumable: false };
  render(<ItemDisclosure item={item}><button>Acción del objeto</button></ItemDisclosure>);
  const toggle = screen.getByRole("button", { name: "Mostrar descripción de Reliquia" });
  expect(toggle.getAttribute("aria-expanded")).toBe("false");
  expect(screen.queryByRole("region")).toBeNull();
  expect(screen.queryByRole("button", { name: "Acción del objeto" })).toBeNull();
  await user.tab(); await user.keyboard(" ");
  const details = screen.getByRole("region", { name: "Detalles de Reliquia" });
  expect(details.textContent).toContain(item.description);
  expect(toggle.getAttribute("aria-expanded")).toBe("true");
  expect(details.id).toBe(toggle.getAttribute("aria-controls"));
  await user.keyboard("{Enter}");
  expect(screen.queryByRole("region")).toBeNull();
});
