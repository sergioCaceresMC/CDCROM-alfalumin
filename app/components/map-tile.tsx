export function MapTile({ terrain, variant }: { terrain: string; variant: number }) {
  const detail = (variant * 17 + Math.floor(variant / 7)) % 4;
  const drawing = terrain === "wall" ? <>
    <path d="M-2 8Q13 5 31 9l-1 19Q16 30-2 27M35 8q19-3 37 0v20q-18 3-37-1ZM-2 34l16-1 1 21-17 2M20 34q16-3 32 0l-1 21q-15 2-32-1Zm37 0 15-1v22l-16 1ZM-2 61q18-3 33 0v12M36 61q17-3 36 0" />
    <path d="m3 10 4 5m1-6 4 5m-8 8 7 1m27-11 5 4m-2-6 6 5m-23 22 5 5m-2-6 5 5m-4 7 6 1M58 39l5 5" opacity=".65" />
  </> : terrain === "water" ? <>
    <path d="M-3 16c10-8 16-7 26-2s17 8 26 1 16-4 24 0M-3 45c9-7 17-9 28-3s18 7 27 0 17-5 24-1" />
    <path d="M5 22q9-6 16-3m18 4q8 2 13-3M8 50q9-5 15-2m17 4q10 1 16-4M15 8l5-2m40 27 5-2M6 64l10-3" opacity=".7" />
  </> : terrain === "grass" ? <>
    <path d="M18 10c-6-5-13 1-10 7-10 2-8 12 0 13-3 8 6 14 12 8 4 8 14 6 15-2 10 0 13-10 6-15 2-8-6-14-12-9-3-7-9-7-11-2Z" fill="#b0b59b70" />
    <path d="M16 16q-6-2-5 5m1 9q5 3 8-1m7-12q6-2 7 4m-9 13q5 4 8-2M5 40l-2 4m5-2-1 4m35-34 3-3m-1 7 4-1M44 54q-5-7-11-2c-5 6 0 12 6 10 5 6 13 1 10-5Z" />
    <path d="m12 59 3-6 1 6m6-11 2-4m34-14 2-5 2 4m-7 13 2 2" opacity=".7" />
  </> : terrain === "path" ? <>
    <path d="M-2 15q15-9 28-3M44 13q14 3 29-5M-2 57q14 5 25 0m24-3q15-6 25-2" opacity=".6" />
    <path d="m12 30 3-2 5 2-1 4-5 1Zm32 14 5-3 4 3-2 4-5 1M33 22l4-1m-9 27 3 1m28-27 3 2m-39 13 2-1" />
  </> : detail === 0 ? <>
    <path d="M-3 23q8-15 22-12t18 17M2 28q7-12 17-10t11 10M40 48q11-11 21-5t12 16m-30-5q10-8 19-3" />
    <path d="m9 47 3-4m3 1 2-2m-3 7 2-2M44 14l3 2m-1 3 4 1M32 60l2-3" />
  </> : detail === 1 ? <>
    <path d="M8 20q-4-7 4-12l12-2 6 8-4 9-12 3Zm33 25q-6-6 1-12l13 2 6 8-5 9-12-1Z" fill="#bbb5a450" />
    <path d="m9 28 3 3m3-3 2 3M39 55l-3 2m9-2-1 4M50 9q8 0 12 6M8 56q10-4 16 0" />
  </> : detail === 2 ? <>
    <path d="M-3 55q9 5 18-4t10-22Q30 10 45 9m-21 45q7-9 5-22Q36 14 47 16M60 56q5-5 13-3" />
    <path d="m5 13 3 2m4-3 2 1M39 45l3-3m1 6 3-3m1 8 3-3M18 62l2 1" />
  </> : <>
    <path d="M-3 12q12 9 25 2m-13 5q8 3 14 0M35 40q2-8 10-7l6 5-3 9-9 1Zm22 20q7-8 16-4" />
    <path d="m9 47 2-3m2 6 2-3m4 6 2-3M50 12l3 2m1-4 2 2M29 62l2-1" />
  </>;
  return <svg viewBox="0 0 70 70" className={`terrain-art terrain-${terrain}`} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
    <g transform={terrain === "grass" ? `rotate(${detail * 90} 35 35)` : undefined}>
      {drawing}
      <g transform="translate(.4 .3)" opacity=".2" strokeWidth=".65">{drawing}</g>
      <g fill="currentColor" stroke="none" opacity=".45"><circle cx={7 + detail * 11} cy="39" r=".7" /><circle cx="58" cy={8 + detail * 14} r=".8" /><circle cx="32" cy="58" r=".6" /></g>
    </g>
  </svg>;
}
