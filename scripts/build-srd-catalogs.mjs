import fs from "node:fs";
import path from "node:path";

// Offline, repeatable build. Only owns srd-5.2.json; never rewrites example catalogs.
const srd = JSON.parse(fs.readFileSync("docs/srd/reference.json", "utf8"));
const cardImages = JSON.parse(fs.readFileSync("docs/card-images.json", "utf8")).entries;
const cardArt = (id, fallback) => ({ image: cardImages[id]?.image ?? fallback,
  ...(cardImages[id]?.credit ? { imageCredit: cardImages[id].credit } : {}) });
const slug = s => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const source = (e, full = true) => ({ document: srd.document, page: e.page, name: e.name, ...(full ? { text: e.text } : {}) });
const existing = folder => fs.readdirSync(folder).filter(f=>f.endsWith(".json")&&f!=="srd-5.2.json").flatMap(f=>JSON.parse(fs.readFileSync(path.join(folder,f),"utf8").replace(/^\uFEFF/, "")).entries);
const write = (folder, entries) => { fs.mkdirSync(folder,{recursive:true}); fs.writeFileSync(path.join(folder,"srd-5.2.json"),JSON.stringify({version:1,entries},null,2)+"\n"); };
const clamp = (n,a,b) => Math.min(b,Math.max(a,n));
const ref = "Efectos especiales y restricciones: resolución manual del master; consulta la referencia original.";
const description = e => {
  let text=e.text.replace(/^.*?Duración: (?:Concentración, hasta |Hasta )?(?:Instantáneo|Especial|\d+ (?:minuto|hora|día|asalto)s?)\s*/u,"");
  if(text===e.text) text=e.text.replace(/^.*?Duración: /,"");
  const first=text.match(/^.*?[.!?](?:\s|$)/)?.[0]??text;
  return first.replace(/\b\d+d\d+(?:\s*[+−-]\s*\d+)?/g,"el daño adaptado").slice(0,600).trim();
};

// Complete mundane equipment tables and described tools / adventuring gear.
const items=[];
for(const e of srd.weapons) {
  const die=Number(e.text.match(/\d+d(\d+)/)?.[1]??4);
  const damage=die<=4?"1d4":"1d6";
  items.push({id:`srd-${slug(e.name)}`,name:e.name,kind:"weapon",usable:true,consumable:false,damage,
    description:`Arma adaptada: ${damage}. ${ref}`,source:source(e)});
}
for(const e of srd.armor) {
  if(e.name==="Escudo") {
    items.push({id:"srd-escudo",name:e.name,kind:"misc",usable:false,consumable:false,description:"Escudo de protección. En esta fase no hay ranura de escudo ni bonificación automática; el master decide su uso defensivo.",source:source(e)});
    continue;
  }
  const heavy=["Cota guarnecida","Cota de malla","Armadura de bandas","Armadura de placas"].includes(e.name);
  items.push({id:`srd-${slug(e.name)}`,name:e.name,kind:"armor",usable:false,consumable:false,armor:heavy?14:12,
    description:`Protección adaptada: armadura ${heavy?14:12}, sin modificador de atributo. ${ref}`,source:source(e)});
}
for(const e of srd.gear) {
  const name=e.name.replace(/\s*\(.*$/,"").trim();
  const consumable=/^(Aceite|Ácido|Agua bendita|Antitoxina|Fuego de alquimista|Papel|Pergamino|Poción|Raciones|Tinta|Veneno)/.test(name);
  const heal=name==="Poción de curación";
  items.push({id:`srd-${slug(name)}`,name,kind:consumable?"consumable":"misc",usable:consumable,consumable,
    description:heal?"Consume una dosis para recuperar 3 puntos de vida, sin superar tu máximo.":`${description(e)} ${ref}`,
    ...(heal?{effect:{type:"heal",amount:3}}:{}),source:source(e)});
}
for(const e of srd.magic) {
  const mundane=items.find(item=>item.name===e.name);
  if(mundane) { mundane.source=source(e); continue; }
  const consumable=/^(?:Poción|Pergamino)/.test(e.text)||/^(Aceite|Elixir|Abalorio de nutrición)/.test(e.name);
  items.push({id:`srd-magico-${slug(e.name)}`,name:e.name,kind:consumable?"consumable":"misc",usable:consumable,consumable,
    description:`Objeto mágico de referencia. ${ref} ${consumable?"Consumir retira una unidad; no aplica por sí solo el efecto mágico.":"Sin bonificaciones automáticas ni ranura de equipo mágico."}`,source:source(e)});
}
const unique = entries => {
  const ids=new Set();
  for(const e of entries) { if(ids.has(e.id)) throw new Error(`Duplicate generated ID: ${e.id}`); ids.add(e.id); }
  return entries;
};
const oldItems=existing("app/data/items");
for(const item of items) if(oldItems.some(old=>slug(old.name)===slug(item.name))) item.name += " (SRD)";
unique(items);
for(const kind of ["weapon","armor","consumable","misc"]) write(`app/data/items/srd-${kind}`,items.filter(i=>i.kind===kind&&!oldItems.some(o=>o.id===i.id)));

// Entire SRD bestiary, including animals and high-threat creatures for the DM.
// Numeric conversion is a starting point for playtesting, not encounter balance.
const monsters=srd.monsters.map(e=>{
  const hp=Number(e.text.match(/PG:\s*(\d+)/)[1]);
  const ac=Number(e.text.match(/CA:\s*(\d+)/)[1]);
  const cr=e.text.match(/VD:\s*([\d/]+)/)?.[1]??"?";
  const type=e.text.split(" CA:")[0];
  const dangerous=hp>=80;
  return {id:`srd-enemy-${slug(e.name)}`,kind:"enemy",name:e.name,...cardArt(`srd-enemy-${slug(e.name)}`,"images/cards/enemy.svg"),
    description:`${type}. VD original ${cr}. Perfil adaptado de Alfa Lumin${dangerous?"; amenaza elevada para personajes de nivel 1–3":""}.`,
    maxHp:clamp(Math.ceil(hp/10),2,60),armor:clamp(ac,10,18),damage:hp<=15?"1d2":hp<80?"1d4":"2d4",
    abilities:["Realiza una acción principal por turno. El dado mostrado representa un ataque básico, no cada ataque del perfil original.",
      "Rasgos, movimiento especial, resistencias, estados y magia se consultan en la referencia; el master los adapta manualmente.",
      ...(dangerous?["No usar su VD original para equilibrar combates del sistema adaptado. Puede servir como peligro narrativo."]:[])],instructions:[],source:source(e)};
});
write("app/data/master/enemy",unique(monsters));
const npcs=monsters.filter(card=>card.description.startsWith("Humanoide ")).map(card=>({
  ...card,id:card.id.replace("srd-enemy-","srd-npc-"),kind:"npc",...cardArt(card.id.replace("srd-enemy-","srd-npc-"),card.image),
  description:`Personaje de referencia: ${card.description} Su actitud y papel en la historia los decide el master.`,
}));
write("app/data/master/npc",unique(npcs));

// Original class features condensed into selectable abilities for this game's rules.
// Format: level | name | attribute | description | optional damage.
const features={
  guerrero:[
    [1,"Segundo aliento","constitucion","Una vez por escena, usa tu acción para recuperar 2 puntos de vida. Ajusta la vida manualmente."],
    [1,"Defensa","valor","Adopta una guardia defensiva: renuncia a atacar para protegerte de un adversario durante un turno. El master resuelve la protección."],
    [1,"Tiro con arco","tiros","Apunta antes de disparar; usa Tiros para el chequeo. No suma daño adicional automático.","1d6"],
    [1,"Combate con dos armas","golpes","Ataca con dos armas ligeras como una sola acción y una sola tirada de daño.","1d4"],
    [1,"Derribar","golpes","Si aciertas con un arma adecuada, puedes intentar derribar a un enemigo de tamaño similar en vez de causar daño."],
    [1,"Empujar","golpes","Una acción permite intentar desplazar un adversario una celda; el master decide el chequeo opuesto."],
    [2,"Acción súbita","valor","Una vez por escena realiza una acción adicional que no sea un segundo ataque."],
    [2,"Mente táctica","inteligencia","Una vez por escena analiza la defensa o el terreno y pide al master una pista táctica."],
    [3,"Campeón","golpes","Si el master declara un golpe crítico, repite el dado de daño y conserva el mejor resultado.","1d6"],
  ],
  picaro:[
    [1,"Ataque furtivo","golpes","Una vez por turno, si un aliado amenaza al objetivo o atacas desde ocultación, usa 1d6 en lugar del daño de un arma ligera. No se suman dados.","1d6"],
    [1,"Pericia en sigilo","percepcion","Intenta ocultarte usando cobertura y describe cómo evitas ser descubierto."],
    [1,"Herramientas de ladrón","inteligencia","Con herramientas adecuadas puedes intentar abrir cerraduras y desactivar trampas no mágicas."],
    [1,"Jerga de ladrones","carisma","Reconoce mensajes y señales de comunidades de ladrones; no proporciona acceso automático a secretos."],
    [1,"Maestría con daga","golpes","Usa una daga en combate cercano o arrojada según la distancia que permita el master.","1d4"],
    [1,"Pericia en investigación","inteligencia","Examina mecanismos y rastros para descubrir una pista; requiere una acción y acceso al lugar."],
    [2,"Acción astuta","percepcion","Una vez por turno puedes desplazarte una celda adicional u ocultarte, además de tu acción principal."],
    [3,"Manos rápidas","inteligencia","Manipula un objeto pequeño o utiliza herramientas de ladrón con rapidez. No concede un ataque adicional."],
    [3,"Trabajo en las alturas","percepcion","Puedes intentar trepar sin herramientas en superficies con apoyos y reconocer rutas seguras por tejados."],
  ],
  mago:[
    [1,"Libro de conjuros","inteligencia","Identifica una inscripción arcana consultando tu libro durante unos minutos."],
    [1,"Recuperación arcana","inteligencia","Tras una pausa segura puedes volver a utilizar una habilidad mágica limitada que ya conoces, una vez por sesión y con acuerdo del master."],
    [2,"Erudito arcano","inteligencia","Consulta tus apuntes para reconocer una tradición mágica o un fenómeno sobrenatural."],
    [3,"Evocación cuidadosa","inteligencia","Antes de lanzar una habilidad de área, elige un aliado al que evitarás dañar; no cambia el daño."],
  ],
  druida:[
    [1,"Druídico","inteligencia","Comprende mensajes secretos druídicos y puede dejar señales para otros iniciados."],
    [1,"Orden primigenia","empatia","Reconoce rastros de animales y el estado de una planta mediante observación cercana."],
    [2,"Forma salvaje","empatia","Una vez por escena adopta la forma de una bestia pequeña para explorar. Conserva tu vida; no copia sus ataques ni permite lanzar conjuros."],
    [2,"Compañero salvaje","empatia","Invoca un compañero animal narrativo que explora o transmite una señal; no tiene un turno de ataque independiente."],
    [3,"Círculo de la tierra","empatia","Durante una pausa en un entorno natural descubre un refugio o recurso cercano, si lo hay."],
  ],
  paladin:[
    [1,"Imposición de manos","empatia","Una vez por escena, toca a un aliado y usa tu acción para curar 2 puntos de vida. Ajusta su vida manualmente."],
    [1,"Sentido divino","valor","Dedica una acción a percibir una presencia celestial, infernal o no muerta cercana; el master describe lo que detectas."],
    [2,"Castigo divino","golpes","Una vez por escena convierte el daño de tu ataque cuerpo a cuerpo en 1d6 radiante; no suma dados.","1d6"],
    [2,"Estilo protector","valor","Usa tu acción para cubrir a un aliado adyacente; acuerda la protección con el master."],
    [3,"Arma sagrada","valor","Una vez por escena tu arma puede afectar criaturas que requieran daño mágico, durante un turno."],
    [3,"Juramento de entrega","carisma","Pronuncia tu juramento para intentar inspirar valor a un aliado afectado por miedo; requiere un chequeo decidido por el master."],
  ],
  brujo:[
    [1,"Pacto de la hoja","golpes","Manifiesta un arma vinculada a tu pacto. Desaparece al terminar la escena y no se añade al inventario.","1d4"],
    [1,"Pacto de la cadena","carisma","Un familiar narrativo puede explorar o entregar un mensaje; no realiza ataques independientes."],
    [1,"Pacto del tomo","inteligencia","Tu tomo permite interpretar símbolos de pactos y tradiciones sobrenaturales."],
    [2,"Visión del diablo","percepcion","Puedes distinguir formas en oscuridad sobrenatural durante una escena; no revela criaturas invisibles."],
    [2,"Descarga repelente","carisma","Si aciertas con tu descarga, puedes empujar una celda en lugar de causar daño."],
    [2,"Astucia mágica","carisma","Durante una pausa segura renueva una habilidad del pacto con uso limitado, una vez por sesión y con acuerdo del master."],
    [3,"Bendición del infernal","constitucion","Una vez por escena, al derrotar a un enemigo recupera 1 punto de vida. No supera el máximo; ajusta manualmente."],
  ],
  explorador:[
    [1,"Enemigo predilecto","percepcion","Observa o rastrea una criatura marcada narrativamente; no añade daño automático."],
    [1,"Explorador diestro","percepcion","Reconoce huellas y rutas seguras en un entorno que conoces."],
    [2,"Estilo de combate a distancia","tiros","Dispara desde una posición preparada usando Tiros.","1d6"],
    [3,"Cazador","inteligencia","Tras observar un turno a una criatura, pregunta al master por una defensa o debilidad visible."],
  ],
  artificiero:[
    [1,"Reparación de campo","inteligencia","Con herramientas, usa una acción para intentar reparar un arma atascada o un mecanismo pequeño. El master decide el chequeo; no recupera vida ni crea equipo."],
    [1,"Munición alquímica","tiros","Prepara un disparo incendiario contra un objetivo visible. Causa 1d4 de fuego en lugar del daño normal del arma; no suma dados ni ataques.","1d4"],
    [1,"Lente de precisión","percepcion","Dedica una acción a observar un objetivo y preguntar por un detalle visible de su equipo o posición. No revela invisibilidad ni aumenta el daño."],
    [1,"Garra mecánica","golpes","Manipula con una pinza de taller un objeto a una celda de distancia. Puede apartar un cable o recoger una pieza, sin atacar ni desactivar trampas automáticamente."],
    [1,"Burbuja de humo","inteligencia","Una vez por escena, usa una acción para cubrir una celda con humo durante un turno. El master resuelve la visibilidad; no causa daño."],
    [1,"Analizador de materiales","inteligencia","Examina una muestra con tu equipo de alquimia para reconocer su material o un riesgo evidente. Necesita contacto y una acción; no identifica maldiciones."],
    [2,"Disparo desarmante","tiros","Una vez por escena, intenta hacer soltar un objeto sostenido por un enemigo visible. Usa una acción y un chequeo de Tiros decidido por el master, en lugar de causar daño.",undefined,"artificiero-alfa-revestimiento-protector"],
    [2,"Autómata escribiente","inteligencia","Construye un ayudante que registra mensajes o lleva un objeto pequeño dentro de la escena. Darle una orden emplea tu acción; no tiene turnos ni ataques propios.",undefined,"artificiero-alfa-dron-explorador"],
    [2,"Preparado restaurador","inteligencia","Una vez por escena, usa una acción para administrar un preparado a un aliado adyacente y curar 2 puntos de vida. Ajusta la vida manualmente sin superar el máximo; no añade una poción al inventario.",undefined,"artificiero-alfa-catalizador-curativo"],
    [3,"Disparo de largo alcance","tiros","Usa una acción para disparar a un objetivo visible más allá del alcance habitual si el master permite la línea de tiro. Causa 1d6 en lugar del daño del arma; no añade ataques.","1d6","artificiero-alfa-torreta-portatil"],
    [3,"Infusión protectora","constitucion","Una vez por escena, dedica una acción a activar una protección de taller que reduce en 1 el daño del siguiente impacto recibido antes de tu próximo turno. Ajusta el daño manualmente; no cambia la armadura ni se acumula.",undefined,"artificiero-alfa-armadura-modular"],
    [3,"Autómata asistente","inteligencia","Mejora tu ayudante para que sostenga una herramienta o ayude en una reparación cercana. Ordenarlo consume tu acción y sustituye cualquier otra orden al ayudante ese turno. No crea otro autómata ni concede ataques adicionales.",undefined,"artificiero-alfa-desactivador-arcano"],
  ],
};
const attributes={mago:"inteligencia",druida:"empatia",paladin:"valor",brujo:"carisma",explorador:"percepcion"};
const byClass={};
for(const [classId,list] of Object.entries(features)) {
  const cls=srd.classes.find(c=>c.id===classId);
  const entries=list.map(([level,name,attribute,description,damage,stableId])=>({id:stableId??`${classId}-${cls?"srd":"alfa"}-${slug(name)}`,classId,level,name,attribute,description,...(damage?{damage}:{}),...(cls?{source:{document:srd.document,page:cls.page,name}}:{})}));
  for(const e of srd.spells) {
    const metadata=e.text.split("Tiempo de lanzamiento:")[0];
    const spellLevel=/^Truco/.test(metadata)?0:Number(metadata.match(/de nivel (\d)/)?.[1]??99);
    const className=classId==="paladin"?"paladín":classId;
    if(spellLevel>2||!metadata.match(/\(([^)]+)\)/)?.[1].split(/,\s*/).includes(className)) continue;
    if(entries.some(skill=>skill.id===`${classId}-srd-${slug(e.name)}`)) continue;
    const offensive=/\d+d\d+[^.]{0,60}de daño/.test(e.text);
    const healing=/recupera[^.]{0,100}puntos de golpe/.test(e.text);
    const damage=spellLevel===2?"1d6":"1d4";
    entries.push({id:`${classId}-srd-${slug(e.name)}`,classId,name:e.name,level:spellLevel===0?1:spellLevel===1?2:3,attribute:attributes[classId],
      description:`Inspiración: ${description(e).replace(/\b\d+(?:[,.]\d+)?\b/g,"una cantidad acordada")} Adaptación: una acción, un objetivo${offensive?`, daño ${damage}`:""}${healing?`, cura ${spellLevel===2?3:2} puntos de vida manualmente sin superar el máximo`:""}. Los efectos de control duran como máximo un turno y los de utilidad una escena; una invocación no añade ataques. ${ref}`,
      ...(offensive?{damage}:{}),source:source(e)});
  }
  const old=existing(`app/data/skills/${classId}`);
  // Avoid offering two selectable skills with the same name as existing examples.
  const generated=unique(entries).filter(e=>!old.some(o=>slug(o.name)===slug(e.name)));
  write(`app/data/skills/${classId}`,generated); byClass[classId]=generated.length;
}
const manifest={version:1,document:srd.document,items:items.length,enemies:monsters.length,npcs:npcs.length,skills:byClass,referenceSpells:srd.spells.length};
fs.writeFileSync("docs/srd/manifest.json",JSON.stringify(manifest,null,2)+"\n");
console.log(manifest);
