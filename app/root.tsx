import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "@fontsource/patrick-hand/latin-400.css";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "icon", type: "image/svg+xml", href: `${import.meta.env.BASE_URL}images/mistico.svg` },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <footer className="main-content fine"><details><summary>Fuentes y licencia del contenido</summary>
          <p>Esta obra incluye material procedente del documento de referencia del sistema 5.2.1 (“SRD 5.2.1”) de Wizards of the Coast LLC, disponible en <a href="https://www.dndbeyond.com/srd">https://www.dndbeyond.com/srd</a>. La licencia sobre el SRD 5.2.1 se concede de acuerdo con la licencia internacional de atribución/reconocimiento 4.0 de Creative Commons, disponible en <a href="https://creativecommons.org/licenses/by/4.0/legalcode">https://creativecommons.org/licenses/by/4.0/legalcode</a>.</p>
          <p>Alfa Lumin adapta y resume este material para sus reglas propias. El artificiero y el contenido previo son creaciones del proyecto.</p>
        </details></footer>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function HydrateFallback() {
  return <main className="loading" role="status">Preparando tu próxima aventura…</main>;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "No se pudo abrir la aventura";
  let details = "Revisa tu conexión y los archivos del catálogo, e inténtalo de nuevo.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "Página no encontrada" : "Error";
    details =
      error.status === 404
        ? "Esta página no existe. Vuelve a la biblioteca de personajes."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="main-content stack">
      <h1>{message}</h1>
      <p>{details}</p>
      <a className="primary" href={import.meta.env.BASE_URL}>Volver a abrir la biblioteca</a>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
