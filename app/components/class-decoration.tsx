const motifs: Record<string, { theme: string; drawing: React.ReactNode }> = {
  mago: { theme: "mago", drawing: <><path d="m24 6 4 12 12 4-12 4-4 12-4-12-12-4 12-4Z" /><circle cx="24" cy="22" r="18" /><path d="m42 39 3 5m-39-5-3 5" /></> },
  guerrero: { theme: "guerrero", drawing: <><path d="m24 5 15 6-2 20-13 12-13-12-2-20Z" /><path d="M24 12v23M15 20h18m-18 8h18" /></> },
  druida: { theme: "druida", drawing: <><path d="M24 44V22C9 25 4 17 5 7c15-1 22 7 19 15 0-13 9-20 20-17 1 12-6 21-20 17M24 35 11 28m13 10 13-8" /><path d="m10 12 14 10L38 10" /></> },
  paladin: { theme: "paladin", drawing: <><path d="m24 9 15 6-2 15-13 13-13-13-2-15Z" /><circle cx="24" cy="24" r="7" /><path d="M24 1v4M7 7l4 4m30-4-4 4M1 23h4m38 0h4M24 14v20m-10-10h20" /></> },
  picaro: { theme: "picaro", drawing: <><path d="m13 32 23-26 5-2-1 7-24 24ZM7 29l13 11-3 3L4 32Zm3 8-7 9m12-6-6 8" /><path d="M12 6a12 12 0 0 0 0 19A10 10 0 0 1 12 6Z" /></> },
  brujo: { theme: "brujo", drawing: <><path d="M5 25s8-12 19-12 19 12 19 12-8 12-19 12S5 25 5 25Z" /><circle cx="24" cy="25" r="7" /><path d="M24 18v14M24 3v5m-13-3 3 5m23-5-3 5M24 42v4" /></> },
  artificiero: { theme: "artificiero", drawing: <><path d="m20 5 8 0 2 7 6-2 5 7-5 5 5 5-5 7-6-2-2 7h-8l-2-7-6 2-5-7 5-5-5-5 5-7 6 2Z" /><circle cx="24" cy="22" r="8" /><path d="m20 22 4-4 4 4-4 4Z" /></> },
};

export function classTheme(classId: string): string {
  const legacy: Record<string, string> = { mistico: "mago", explorador: "picaro" };
  return motifs[classId]?.theme ?? legacy[classId] ?? "guerrero";
}

export function ClassDecoration({ classId }: { classId: string }) {
  return <svg className="class-decoration" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{motifs[classTheme(classId)].drawing}</svg>;
}
