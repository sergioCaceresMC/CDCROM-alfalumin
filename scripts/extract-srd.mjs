// Input: PDF.js text items from the official Spanish SRD 5.2.1.
// This extraction step is separate from the dependency-free catalog builder.
import fs from "node:fs";
const pages = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const clean = s => s.replace(/\s*[‑-]\s*\n\s*/g, "").replace(/\n/g, " ").replace(/\s+/g, " ").replace(/\s+([,.;:)])/g, "$1").trim();
function lines(items) {
  const rows = new Map();
  for (const i of items.filter(i => i.y > 40)) {
    const key = Math.round(i.y * 10);
    if (!rows.has(key)) rows.set(key, []);
    rows.get(key).push(i);
  }
  return [...rows.values()].sort((a,b) => b[0].y-a[0].y).map(row => {
    row.sort((a,b) => a.x-b.x);
    return { text: row.map(i=>i.text).join(" "), size: Math.max(...row.map(i=>i.size)), x: row[0].x };
  });
}
function blocks(start, end, heading, accept = () => true) {
  const entries=[]; let current;
  for(let p=start;p<=end;p++) for(const side of [0,1]) {
    const column=pages[p-1].filter(i => side === 0 ? i.x < 300 : i.x >= 300);
    for(const line of lines(column)) {
      if(heading(line)) {
        if(current && current.lines.length === 0) { current.name += " " + clean(line.text); continue; }
        if(current) entries.push(current);
        current={name:clean(line.text),page:p,lines:[]};
      } else if(current) current.lines.push(line.text);
    }
  }
  if(current) entries.push(current);
  return entries.map(e=>({name:e.name,page:e.page,text:clean(e.lines.join("\n"))})).filter(accept);
}
const spells=blocks(118,193,l=>l.size===12,e=>/^(?:Truco|[\p{L}]+ de nivel)/u.test(e.text));
const monsters=blocks(283,398,l=>l.size===15,e=>/CA:\s*\d+/.test(e.text)&&/PG:\s*\d+/.test(e.text));
const magic=blocks(228,277,l=>l.size===12,e=>/^(?:Objeto maravilloso|Arma|Armadura|Anillo|Bastón|Vara|Varita|Poción|Pergamino)/.test(e.text));
const gear=blocks(101,109,l=>l.size===12,e=>/\(/.test(e.name)&&e.text.length>10);
const weapons=[];
let current;
for(const row of lines(pages[98])) {
  // Row starts in the name column; wrapped property rows append to the same weapon.
  if(row.x>58&&row.x<80&&row.size===9.5) { if(current) weapons.push(current); current={name:row.text.split(/ (?=\d+d\d+|1 perforante)/)[0],page:99,text:row.text}; }
  else if(current&&row.size===9.5&&row.x>140) current.text+=" "+row.text;
}
if(current) weapons.push(current);
const armor=[]; current=undefined;
for(const row of lines(pages[99])) {
  if(row.x>=74&&row.x<80&&row.size===9.5&&/\d|\+/.test(row.text)) {
    if(current) armor.push(current);
    const match=row.text.match(/^(.+?) (?=\d|\+)/);
    current={name:match?.[1]??row.text,page:100,text:row.text};
  } else if(current&&row.size===9.5&&row.x>=74&&row.x<80) { current.name+=" "+row.text; current.text+=" "+row.text; }
}
if(current) armor.push(current);
const classes = [["barbaro",32,34],["bardo",35,39],["brujo",40,46],["clerigo",47,51],["druida",52,57],["explorador",58,61],["guerrero",62,64],["hechicero",64,70],["mago",71,76],["monje",77,80],["paladin",81,85],["picaro",86,88]].map(([id,start,end])=>({id,page:start,text:Array.from({length:end-start+1},(_,i)=>[0,1].map(side=>clean(lines(pages[start+i-1].filter(j=>side===0?j.x<300:j.x>=300)).map(j=>j.text).join("\n"))).join("\n")).join("\n")}));
const output={version:1,document:"SRD 5.2.1",language:"es",url:"https://media.dndbeyond.com/compendium-images/srd/5.2/SP_SRD_CC_v5.2.1.pdf",spells,monsters,magic,gear,weapons,armor,classes};
fs.mkdirSync("docs/srd",{recursive:true});
fs.writeFileSync("docs/srd/reference.json",JSON.stringify(output,null,2)+"\n");
console.log(Object.fromEntries(Object.entries(output).filter(([,v])=>Array.isArray(v)).map(([k,v])=>[k,v.length])));
