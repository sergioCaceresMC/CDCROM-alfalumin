// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { afterEach, expect, it } from "vitest";
import { GameLibrary } from "./game-library";
import { loadClasses } from "../game/catalog";

afterEach(cleanup);
it("consulta categorías, filtra habilidades y mantiene los retratos plegados", async () => {
  const user = userEvent.setup();
  render(<MemoryRouter initialEntries={["/?modo=biblioteca"]}><GameLibrary classes={await loadClasses()} /></MemoryRouter>);
  const classEntry = await screen.findByText("Artificiero", { selector: "summary" });
  expect(screen.queryByRole("img")).toBeNull();
  await user.click(classEntry);
  expect(await screen.findAllByRole("img")).toHaveLength(2);
  await user.click(screen.getByRole("button", { name: "Habilidades" }));
  await user.selectOptions(await screen.findByLabelText("Filtrar habilidades por clase"), "artificiero");
  await user.type(screen.getByLabelText("Buscar en la biblioteca"), "ESCRIBIENTE");
  expect(await screen.findByText(/Autómata escribiente/, { selector: "summary" })).toBeTruthy();
  expect(screen.queryByText("Chispa arcana", { selector: "summary" })).toBeNull();
  await user.click(screen.getByRole("button", { name: "Armaduras" }));
  await user.type(screen.getByLabelText("Buscar en la biblioteca"), "placas");
  expect(await screen.findByText("Armadura de placas", { selector: "summary" })).toBeTruthy();
});

it("recupera la búsqueda y la categoría desde una URL directa", async () => {
  render(<MemoryRouter initialEntries={["/?modo=biblioteca&categoria=weapon&buscar=mosquete"]}><GameLibrary classes={await loadClasses()} /></MemoryRouter>);
  expect(await screen.findByText("Mosquete", { selector: "summary" })).toBeTruthy();
  expect((screen.getByLabelText("Buscar en la biblioteca") as HTMLInputElement).value).toBe("mosquete");
});
