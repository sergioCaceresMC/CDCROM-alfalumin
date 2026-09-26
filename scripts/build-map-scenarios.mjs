import { writeFile } from "node:fs/promises";
import { scenarios } from "./map-scenarios-data.mjs";

const markerTypes = {
  table: { name: "Mesa o banco sugerido", symbol: "▤" },
  barrel: { name: "Provisiones o barriles sugeridos", symbol: "◉" },
  stairs: { name: "Escalera o acceso sugerido", symbol: "↧" },
  chest: { name: "Contenedor o punto de interés sugerido", symbol: "◇" },
  altar: { name: "Altar o pedestal sugerido", symbol: "✧" },
  fire: { name: "Hoguera o reunión sugerida", symbol: "♨" },
};
const terrainTypes = { wall: ["Muro, roca o barrera", "▥"], floor: ["Suelo", "·"], water: ["Agua", "≈"], grass: ["Vegetación o terreno abierto", "♧"], path: ["Camino, puerta o puente", "·"] };
function build(s) {
  const [width, height] = s.size;
  const inside = s.kind === "interior" || s.kind === "cave";
  const cells = Array(width * height).fill(inside ? "wall" : s.kind === "island" ? "water" : "grass");
  const suggestions = [];
  const set = (x,y,tile) => { if (x < 0 || y < 0 || x >= width || y >= height) throw Error(`${s.id}: coordenada fuera de mapa`); cells[y * width + x] = tile; };
  const rect = ([x,y,w,h],tile) => { for(let py=y;py<y+h;py++)for(let px=x;px<x+w;px++)set(px,py,tile); };
  const center = ([x,y,w,h]) => [x+Math.floor(w/2),y+Math.floor(h/2)];
  const connect = ([x,y],[tx,ty], tile="path") => {
    while (x !== tx) { set(x,y,tile); x += Math.sign(tx-x); }
    while (y !== ty) { set(x,y,tile); y += Math.sign(ty-y); }
    set(tx,ty,tile);
  };
  const mark = ([x,y],id) => { if (cells[y*width+x] === "wall" || cells[y*width+x] === "water") throw Error(`${s.id}: marcador inaccesible`); suggestions.push({x,y,id}); };
  const middle = [Math.floor(width/2),Math.floor(height/2)];
  if (inside) {
    for (const room of s.rooms) {
      if (s.kind === "interior") rect(room,"floor");
      else {
        const [x,y,w,h] = room;
        for(let py=y;py<y+h;py++)for(let px=x;px<x+w;px++) {
          if (((px-x-(w-1)/2)/(w/2))**2 + ((py-y-(h-1)/2)/(h/2))**2 <= 1) set(px,py,"floor");
        }
      }
    }
    const centers = s.rooms.map(center);
    for(let i=1;i<centers.length;i++)connect(centers[i-1],centers[i]);
    if (s.loop) connect(centers.at(-1),centers[0]);
    connect([centers[0][0],0],centers[0]);
    if (s.pool) {
      // Small pools sit away from the connected central passage.
      for(const [x,y,w,h] of s.rooms)if(w>=7&&h>=5)set(x+Math.floor(w/2),y+1,"water");
    }
    centers.forEach((point,index)=>mark(point,s.markers[index%s.markers.length]));
  } else if (s.kind === "river") {
    rect([middle[0]-1,0,3,height],"water");
    for(const y of s.bridges)connect([0,y],[width-1,y]);
    connect([2,0],[2,height-1]); connect([width-3,0],[width-3,height-1]);
    mark([2,s.bridges[0]],"fire"); mark([width-3,s.bridges.at(-1)],"chest");
  } else if (s.kind === "island") {
    for(let y=1;y<height-1;y++)for(let x=2;x<width-2;x++)if(((x-middle[0])/(width/2-3))**2+((y-middle[1])/(height/2-2))**2<=1)set(x,y,"grass");
    connect([0,middle[1]],middle);
    mark(middle,"fire"); mark([middle[0]+2,middle[1]],"chest");
  } else {
    for (const obstacle of s.obstacles??[])rect(obstacle,"wall");
    connect([0,middle[1]],[width-1,middle[1]]);
    connect([middle[0],0],[middle[0],height-1]);
    for(const [index,room]of(s.buildings??[]).entries()) {
      rect(room,"wall");
      const [x,y,w,h]=room;
      rect([x+1,y+1,w-2,h-2],"floor");
      const door=[x+Math.floor(w/2),y+h-1];
      connect(door,[door[0],middle[1]]);
      mark(center(room),index%2?"barrel":"table");
    }
    mark(middle,s.kind==="settlement"?"table":"fire");
  }
  const used = new Set(cells);
  const legend = Object.entries(terrainTypes).filter(([id])=>used.has(id)).map(([id,[name,symbol]])=>({id,name,symbol,kind:"structure",terrain:id}));
  for(const id of new Set(suggestions.map(m=>m.id)))legend.push({id,kind:"object",...markerTypes[id]});
  return {version:1,id:`map-escenario-${s.id}`,name:s.name,description:`${s.description} Cuadrícula de ${width} × ${height}; una ficha ocupa una celda. Los símbolos son referencias opcionales, no colocan cartas ni aplican reglas de movimiento.`,width,height,legend,cells,suggestions};
}
if(scenarios.length!==40||new Set(scenarios.map(s=>s.id)).size!==40)throw Error("Se requieren 40 escenarios distintos.");
const entries=scenarios.map(build);
await writeFile(new URL("../app/data/master/maps/scenarios.json",import.meta.url),JSON.stringify({version:1,entries},null,2)+"\n","utf8");
console.log("40 escenarios de 8 × 8 a 32 × 24, con referencias opcionales.");
