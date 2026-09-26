// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CardLibrary } from "./card-library";
import { loadCards } from "../master/catalog";

vi.mock("../master/catalog", () => ({ loadCards: vi.fn() }));
afterEach(cleanup);
it("busca por nombre y categoría y carga imágenes solo al desplegar", async () => {
  vi.mocked(loadCards).mockImplementation(async kind => kind === "terrain" ? [
    { id: "luz", kind, name: "Lúz del bosque", description: "Una torre oculta", image: "images/cards/terrain.png", abilities: [], instructions: [] },
    { id: "torre", kind, name: "La torre", description: "El bosque", abilities: [], instructions: [] },
  ] : [{ id: "orco", kind, name: "Orco", description: "Un adversario", maxHp: 5, abilities: [], instructions: [] }]);
  const user = userEvent.setup(); render(<CardLibrary />);
  await screen.findByText("Lúz del bosque");
  expect(screen.queryByRole("img")).toBeNull();
  await user.type(screen.getByLabelText("Buscar por nombre"), "LUZ");
  expect(screen.queryByText("La torre")).toBeNull();
  await user.click(screen.getByText("Lúz del bosque"));
  expect(await screen.findByRole("img")).toBeTruthy();
  expect(screen.getByText("Una torre oculta")).toBeTruthy();
  await user.click(screen.getByText("Lúz del bosque"));
  await waitFor(() => expect(screen.queryByRole("img")).toBeNull());
  await user.clear(screen.getByLabelText("Buscar por nombre"));
  await user.click(screen.getByRole("button", { name: "Enemigos" }));
  await screen.findByText("Orco");
  expect(screen.queryByText("Lúz del bosque")).toBeNull();
  expect(screen.queryByRole("img")).toBeNull();
});
