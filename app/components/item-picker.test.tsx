// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { loadItems } from "../game/catalog";
import { ItemPicker } from "./item-picker";

vi.mock("../game/catalog", () => ({ loadItems: vi.fn() }));
afterEach(cleanup);
it("pagina miles de objetos y encuentra resultados por descripción sin montar todo el catálogo", async () => {
  const items = Array.from({ length: 5000 }, (_, n) => ({ id: `objeto-${n}`, name: `Objeto ${String(n).padStart(4, "0")}`, description: n === 2442 ? "Reliquia secreta" : "Objeto corriente", kind: "misc" as const, usable: false, consumable: false }));
  vi.mocked(loadItems).mockResolvedValue(items);
  const onAdd = vi.fn(); const user = userEvent.setup();
  render(<ItemPicker savedItems={[]} onAdd={onAdd} />);
  const disclosure = screen.getByText("Añadir equipo").closest("details")!;
  expect(disclosure.open).toBe(false);
  await user.click(screen.getByText("Añadir equipo"));
  expect(disclosure.open).toBe(true);
  await screen.findByRole("button", { name: "Seleccionar Objeto 0000" });
  expect(screen.getAllByRole("button", { name: /^Seleccionar / })).toHaveLength(20);
  await user.click(screen.getByRole("button", { name: "Mostrar 20 más" }));
  expect(screen.getAllByRole("button", { name: /^Seleccionar / })).toHaveLength(40);
  await user.type(screen.getByLabelText("Buscar objetos"), "reliquia SECRETA");
  expect(screen.getAllByRole("button", { name: /^Seleccionar / })).toHaveLength(1);
  await user.click(screen.getByRole("button", { name: "Seleccionar Objeto 2442" }));
  await user.click(screen.getByRole("button", { name: /Añadir una unidad/ }));
  expect(onAdd).toHaveBeenCalledWith(items[2442]);
});
