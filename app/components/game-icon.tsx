export type GameIconName = "heart" | "shield" | "sword" | "bag" | "book" | "save";

const drawings: Record<GameIconName, React.ReactNode> = {
  heart: <path fill="#b75e50" d="M12 21 3.5 12C-2 5 7 0 12 7c5-7 14-2 8.5 5Z" />,
  shield: <><path fill="#a99571" d="m12 2 9 4-1 9-8 7-8-7-1-9Z" /><path d="m12 5 6 3-1 6-5 5-5-5-1-6Z M12 6v12" /></>,
  sword: <><path fill="#d6d3bd" d="m10 15 9-12 3-1-1 5-9 10Z" /><path fill="#a99571" d="m5 12 10 8-2 2-10-8Z M7 17l-5 5 2 1 5-5" /></>,
  bag: <><path fill="#a99571" d="M8 3h8l-2 5c8 5 9 13-2 14C1 21 2 13 10 8Z" /><path d="m8 8 8 1 M10 14h4m-2-2v6" /></>,
  book: <><path fill="#bdad83" d="m5 2 15 1-2 19-15-2Z" /><path d="m8 3-2 16 12 1 M10 8l6 1m-7 3 6 1" /></>,
  save: <><path fill="#84905d" d="M3 3h15l3 3-1 15H3Z" /><path fill="#e2cea3" d="M7 3v7h10V3 M7 15h10v6H7Z" /><path d="M14 4v4" /></>,
};

export function GameIcon({ name }: { name: GameIconName }) {
  return <svg className="game-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{drawings[name]}</svg>;
}
