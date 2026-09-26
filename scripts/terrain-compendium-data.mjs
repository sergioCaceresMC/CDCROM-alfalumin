// Original locations for Alfa Lumin. Each line is a distinct place and its visible premise.
export const observations = [
  "Las marcas del paso de otros viajeros se interrumpen en un punto concreto. Una señal reciente se superpone a otra mucho más antigua; las dos parecen señalar destinos distintos, aunque ninguna ofrece una explicación.",
  "Un objeto cotidiano descansa donde nadie esperaría encontrarlo. Está limpio por un lado y gastado por el otro, como si hubiera pasado mucho tiempo protegido antes de quedar expuesto de nuevo.",
  "Desde un extremo se distingue un segundo acceso, estrecho y parcialmente oculto. La ruta principal invita a continuar, pero el desvío conserva señales de uso que no encajan con su aspecto abandonado.",
  "Hay una pequeña zona resguardada del entorno, suficiente para detenerse y observar sin estorbar el paso. Desde allí se aprecia un detalle que, visto de frente, quedaba escondido detrás de los demás.",
  "La distribución del lugar parece responder a una costumbre olvidada. Quien lo preparó dejó espacio alrededor de un punto central; nadie ha ocupado ese hueco, aunque todo lo demás muestra rastros de uso.",
  "Algo aquí ha sido reparado con materiales distintos de los originales. El arreglo resulta modesto y cuidadoso. Junto a él permanece la pieza rota, guardada como si todavía pudiera servir para otra cosa.",
  "Una línea de pequeñas señales recorre el límite del lugar. Algunas están casi borradas y otras parecen recientes. Su separación es regular hasta el último tramo, donde falta una y las restantes se acumulan.",
  "Al prestar atención se descubren dos sonidos que no siguen el mismo ritmo. Uno pertenece claramente al entorno; el otro aparece y desaparece sin que sea posible localizar su origen desde la entrada.",
  "Un rastro del mismo color se repite sobre superficies diferentes. No parece una decoración, porque cada marca queda a una altura distinta. La última está junto a algo que nadie ha movido recientemente.",
  "Existe un pequeño espacio de tránsito entre el exterior y la parte más protegida. Allí se acumulan señales de espera, como si quienes llegaron antes hubieran tenido que detenerse antes de recibir permiso para continuar.",
  "En un rincón se conserva algo que el resto del lugar ha perdido: una forma intacta, una superficie limpia o un color más vivo. La diferencia llama la atención precisamente porque no se repite en ninguna otra parte.",
  "La vista cambia al dar unos pasos hacia un lateral. Lo que desde la entrada parecía un obstáculo se convierte en una referencia útil, y detrás aparece una continuidad que no resultaba evidente a primera vista.",
  "Varias señales apuntan a una ocupación reciente, pero ninguna permite saber cuántas personas estuvieron aquí. Los rastros más pequeños se cruzan con los mayores y luego se separan, siguiendo direcciones diferentes.",
  "Se advierte una elección deliberada entre dos recorridos. Uno es sencillo y muy visible; el otro exige acercarse para reconocerlo. Ambos desembocan fuera de la vista, sin revelar todavía qué los distingue al final.",
  "Una marca antigua se ha respetado a pesar de los cambios del entorno. Las reparaciones y el tránsito la rodean en lugar de cubrirla. Parece importar a alguien, aunque su significado no se reconoce de inmediato.",
  "Un detalle aparece repetido tres veces, con ligeras diferencias. La primera versión está gastada, la segunda incompleta y la tercera apenas alterada. Entre ellas queda espacio suficiente para imaginar una secuencia que todavía no termina.",
  "Algo ha dejado una sombra o una huella sin permanecer en su sitio. El contorno resulta más claro que el resto de las señales cercanas. Alrededor, nada indica si fue retirado con cuidado o llevado apresuradamente.",
  "El camino de entrada no ofrece la mejor vista del lugar. Un giro descubre un espacio menor, protegido por las formas del entorno. Allí los rastros se ordenan de manera diferente y parecen corresponder a otra actividad.",
  "Hay un elemento desplazado respecto a todos los demás. No está roto ni parece a punto de caer; sencillamente apunta hacia otro lado. Su posición permite ver un tramo del lugar que las otras referencias ocultan.",
  "En el límite entre dos superficies queda una acumulación fina de materiales. Las capas más antiguas son oscuras y compactas; por encima descansa una franja clara, todavía suelta, que deja ver el cambio reciente.",
  "Un espacio pequeño ha quedado deliberadamente vacío. A su alrededor se reconocen señales de actividad, pero ninguna lo atraviesa. La ausencia no demuestra peligro: también podría tratarse de una reserva, una costumbre o una simple espera.",
  "Al detenerse, el entorno revela movimientos discretos que pasan inadvertidos al caminar. Ninguno parece acercarse directamente. Sin embargo, todos evitan el mismo punto, situado un poco más allá del acceso principal.",
  "Una señal visible desde lejos tiene otra cara que solo se descubre al acercarse. Ambas están trabajadas de manera distinta. La parte oculta conserva un detalle que parece haber sido añadido después de terminar la primera.",
  "Las huellas de desgaste dibujan un recorrido más estrecho que el espacio disponible. Durante mucho tiempo, quienes pasaron eligieron el mismo trayecto. Fuera de él quedan detalles intactos que apenas han recibido atención.",
  "Entre los restos del uso cotidiano hay una interrupción clara. Algo ocurrió aquí antes de que la actividad se reanudara. Las señales posteriores atraviesan las anteriores, pero no llegan a borrarlas por completo.",
];
export const endings = [
  "Más allá del punto de entrada queda una perspectiva por descubrir. Desde aquí solo se percibe una parte del lugar; para conocer el resto habría que acercarse y cambiar el ángulo de observación.",
  "El lugar no revela de inmediato si espera visitantes o si intenta mantenerlos a distancia. Sus señales admiten ambas lecturas, y el siguiente paso puede aclarar cuál resulta más convincente.",
  "La primera impresión invita a seguir, pero un examen pausado ofrece otra posibilidad: detenerse, comparar los rastros y decidir qué detalle merece atención antes de abandonar el sitio.",
  "Desde esta posición se puede distinguir por dónde llegó la última presencia conocida. Su destino, en cambio, permanece fuera de la vista y no coincide necesariamente con la salida más evidente.",
  "El entorno guarda suficiente silencio entre sus sonidos para escuchar lo que ocurra después. Ninguna señal obliga a intervenir; aun así, cuesta ignorar el detalle que se aparta de todos los demás.",
];
export const regions = [];
const add = (id, label, opening, atmosphere, hook, enemy, npc, object, music, sites) => regions.push({ id, label, opening, atmosphere, hook, enemy, npc, object, music, sites: sites.trim().split("\n").map(line => line.split("|")) });

add("refugios", "Descanso y refugios",
  "El paso encuentra por fin un lugar pensado para detenerse. La disposición del refugio separa el espacio de llegada de una zona más tranquila, donde el viaje parece quedar a cierta distancia.",
  "Hay señales de cuidados modestos y repetidos: un acceso despejado, materiales guardados bajo protección y un espacio reservado para quienes aún no han llegado. El refugio no promete comodidad absoluta, pero permite observar los alrededores sin exponerse por completo. Desde su interior se distinguen las rutas por las que alguien podría acercarse.",
  "Una persona necesita relevo para mantener el refugio abierto; puede ofrecer información en lugar de dinero. Descansar aquí es posible si se acuerdan sus condiciones, sin imponer un combate.", "srd-enemy-bandido", "srd-npc-plebeyo", "srd-manta", "peaceful campsite fantasy ambient",
  `Posada del Último Farol|Una posada mantiene encendida una lámpara sobre una puerta que nunca termina de cerrar.
Campamento de los Tres Robles|Tres árboles grandes rodean una explanada con bancos hechos de troncos caídos.
Hospicio de la Campana Baja|Un edificio austero recibe caminantes bajo una campana que se toca a mano.
Cobertizo del Carretero|Un tejado inclinado protege carros vacíos y un espacio limpio para tender mantas.
Casa del Pan Compartido|El olor a masa caliente sale de una casa cuyas mesas tienen asientos desiguales.
Refugio del Paso Azul|Una pequeña construcción de piedra se apoya contra la pendiente, junto a un mojón azul.
Jardín de las Hamacas|Cuerdas sujetas a postes permiten descansar sobre un patio protegido por vegetación espesa.
Estación de Mulas Viejas|Un establo ventilado conserva comederos, agua limpia y un altillo despejado.
Termas de la Piedra Tibia|El vapor asciende de una poza donde escalones gastados descienden hasta agua templada.
Albergue de la Aguja|Una casa larga destaca por la aguja de hierro que corona su tejado.
Santuario del Viajero Descalzo|Un pórtico contiene sandalias abandonadas y una fuente baja, accesible desde el camino.
Cueva del Fuego Seco|Una cavidad poco profunda conserva un hogar protegido de las corrientes de aire.
Mesón de las Dos Hermanas|Dos mostradores opuestos atienden una sala donde los viajeros dejan sus bastones alineados.
Patio de las Caravanas|Una cerca baja delimita parcelas numeradas alrededor de un depósito de agua.
Torre del Vigía Dormido|La planta inferior de una antigua torre tiene jergones y una ventana orientada al camino.
Rincón de la Costurera|Una habitación común conserva remiendos, hilo y prendas colgadas para secarse.
Granja del Arroyo Manso|Un granero abierto mira hacia un arroyo cuyo sonido apenas supera el murmullo de las hojas.
Barcaza del Descanso|Una barcaza amarrada ofrece literas bajo una cubierta que cruje al ritmo del agua.
Venta de los Cinco Puentes|Una venta recoge viajeros de varias rutas, señaladas por cinco tablillas de colores.
Pabellón de la Lluvia|Un pabellón de madera canaliza el agua hacia pequeñas cisternas junto a sus columnas.
Claustro de los Huéspedes|Un corredor cerrado rodea un patio donde se han preparado habitaciones sin insignias.
Hogar del Herrero Retirado|Las herramientas del antiguo taller cuelgan sobre una mesa usada ahora para servir comida.
Huerto del Buen Sueño|Un cobertizo entre árboles frutales conserva un catre, un cubo y una puerta reparada.
Cabaña de la Piedra Blanca|Una piedra encalada marca una cabaña con provisiones ordenadas en estantes abiertos.
Mirador del Regreso|Un mirador cubierto permite seguir el camino hasta donde se pierde entre las colinas.`);

add("ciudades", "Ciudades y barrios",
  "La ciudad se anuncia antes de mostrar su centro: voces superpuestas, pasos que cambian de ritmo y señales colocadas para competir entre sí. Cada acceso parece conducir a una versión distinta del mismo asentamiento.",
  "Los edificios conservan reformas de varias épocas. Unas fachadas intentan parecer nuevas, mientras otras exhiben deliberadamente su antigüedad. Las rutas de trabajo se cruzan con las de quienes solo pasan por aquí, y pequeños acuerdos cotidianos mantienen el movimiento sin que haga falta una autoridad visible en cada esquina.",
  "Dos grupos reclaman el mismo espacio o recurso. Un mediador pide testigos; elegir a quién escuchar abre rutas diferentes, sin convertir a toda la ciudad en enemiga.", "srd-enemy-espia", "srd-npc-noble", "srd-mapa", "medieval city market ambient",
  `Barrio de las Veletas|Las veletas de una calle apuntan en direcciones distintas pese a recibir el mismo viento.
Plaza del Reloj Prestado|Un reloj público permanece desmontado sobre una mesa custodiada por vecinos.
Distrito de los Tintoreros|Canales estrechos llevan agua teñida entre patios donde cuelgan telas de muchos colores.
Ciudad de los Puentes Altos|Pasarelas enlazan las plantas superiores de casas separadas por calles profundas.
Mercado del Mediodía|Los puestos se organizan alrededor de una sombra circular que se desplaza lentamente.
Barrio de las Escaleras|Cada calle termina en escalones, y las puertas se abren a distintas alturas.
Puerto de las Mil Ventanas|Las casas del muelle conservan ventanas pequeñas, orientadas hacia lugares de atraque concretos.
Plaza del Juramento Roto|Una estatua sin mano alza el brazo sobre un pavimento lleno de inscripciones.
Ciudadela de la Sal|Costras blancas cubren almacenes y muros próximos a grandes depósitos sellados.
Barrio del Vidrio Verde|Cristales verdosos transforman la luz que cae sobre talleres y patios interiores.
Avenida de los Estandartes Vacíos|Astas sin banderas flanquean una avenida cuyos balcones permanecen abiertos.
Calle de los Escribanos|Atriles y tablillas ocupan portales donde se copian mensajes a la vista de todos.
Ciudad del Canal Circular|Un canal rodea el centro urbano y divide las entradas por pequeños embarcaderos.
Barrio de las Cocinas Comunes|Varias casas comparten hornos abiertos a un patio lleno de mesas estrechas.
Plaza de los Monumentos Menores|Pequeñas estatuas recuerdan oficios y sucesos que no aparecen en los grandes edificios.
Distrito de las Cuerdas|Madejas, poleas y puentes de cuerda cuelgan entre almacenes de fachadas austeras.
Ciudad de las Dos Murallas|Una muralla antigua quedó encerrada entre viviendas y una defensa exterior más reciente.
Barrio de la Moneda Ligera|Balanza tras balanza ocupa una calle donde cada mostrador tiene pesas diferentes.
Jardines del Consejo|Senderos muy cuidados rodean bancos cuya orientación impide que todos miren al mismo lugar.
Callejón de las Puertas Pintadas|Cada puerta presenta un símbolo distinto, recién retocado sobre capas de pintura antigua.
Ciudad del Campanario Inclinado|La torre central se inclina sobre tejados que han sido reforzados en su lado más cercano.
Barrio de los Tejados Bajos|Las cubiertas casi se tocan y dejan patios ocultos a quienes transitan por la calle.
Mercado de las Cosas Perdidas|Los puestos muestran objetos usados acompañados por descripciones de dónde fueron encontrados.
Distrito del Teatro Cerrado|Carteles recientes rodean un teatro con las entradas cubiertas por tablones viejos.
Plaza de la Fuente Ausente|Una depresión circular conserva conducciones y bancos, pero ninguna fuente ocupa su centro.`);

add("aldeas", "Aldeas y vida rural",
  "El asentamiento se organiza alrededor de tareas compartidas. Antes de llegar a las primeras puertas se distinguen zonas de cultivo, cercas remendadas y senderos que no necesitan grandes señales para orientar a sus habitantes.",
  "Aquí las distancias se miden por relaciones conocidas: el terreno que trabaja una familia, el sitio donde se recoge agua y el lugar donde alguien puede dar noticias. Los límites entre vivienda, taller y almacén son discretos. Varias miradas advierten la llegada, aunque no todas interrumpen lo que estaban haciendo.",
  "Una tarea comunitaria necesita ayuda antes de que cambie el tiempo. Colaborar permite descubrir un desacuerdo local; el problema puede resolverse negociando, reparando o buscando otro recurso.", "srd-enemy-lobo", "srd-npc-plebeyo", "srd-herramientas-de-carpintero", "quiet medieval village ambient",
  `Aldea del Molino Quieto|La rueda del molino está detenida, pero los sacos siguen llegando a su puerta.
Caserío de las Colmenas|Cajas de madera pintadas rodean viviendas cuyos habitantes caminan despacio entre ellas.
Pueblo del Pozo Gemelo|Dos pozos próximos tienen cubos distintos y caminos de acceso igualmente gastados.
Aldea de las Tejas Azules|Los tejados azules contrastan con paredes de tierra y montones de leña cuidadosamente cubiertos.
Granja de los Espantapájaros Nuevos|Figuras recién vestidas miran hacia el camino en lugar de hacia los cultivos.
Pueblo de los Tres Apellidos|Tres grandes portones llevan nombres repetidos en casi todos los pequeños edificios.
Caserío de las Campanas de Barro|Pequeñas campanas de cerámica cuelgan sobre corrales y entradas de establos.
Aldea del Huerto Cercado|Un huerto central tiene una cerca más alta que la que protege las viviendas.
Pueblo de la Lana Roja|La lana puesta a secar tiñe de rojo los patios y los tendederos comunes.
Granjas del Camino Hundido|Las puertas de las granjas quedan por encima de un camino erosionado por generaciones.
Aldea de los Bancos Vacíos|Bancos orientados hacia una plaza conservan marcas de uso pese a estar desocupados.
Caserío del Olmo Partido|Las dos mitades de un árbol antiguo han sido unidas con vigas y abrazaderas.
Pueblo de la Cosecha Guardada|Los graneros están sellados y los campos exteriores conservan surcos recién abiertos.
Aldea del Puente de Mimbre|Un puente trenzado conecta viviendas cuyos materiales repiten el mismo dibujo vegetal.
Granja de las Herraduras Colgadas|Herraduras de muchos tamaños rodean la entrada de una casa de piedra.
Caserío de los Patos Errantes|Pequeños cercados vacíos separan un estanque de puertas abiertas hacia el agua.
Pueblo del Horno Sin Dueño|El horno común tiene una mesa de turnos, pero ninguna casa reclama su cuidado.
Aldea del Cercado Circular|Una cerca redonda engloba cultivos, animales y una única construcción central.
Caserío de los Cestos Marcados|Cada cesta apilada junto al camino lleva una señal hecha con hilo de distinto color.
Granja del Manzano Hueco|Una escalera baja hasta una abertura en el tronco de un manzano enorme.
Pueblo de los Caminos Barridos|Incluso los senderos de tierra muestran bordes limpios y pequeñas herramientas de limpieza.
Aldea de las Puertas Dobles|Las viviendas tienen dos puertas contiguas, pero solo una de cada pareja está gastada.
Caserío del Rebaño Ausente|Los pastos están abiertos y los comederos llenos, sin animales a la vista.
Pueblo de las Semillas Selladas|Jarras cerradas con cera ocupan los estantes visibles a través de un almacén abierto.
Granja del Último Surco|Un surco aislado cruza terreno sin cultivar y termina junto a una piedra hincada.`);

add("caminos", "Caminos y cruces",
  "La ruta cambia de carácter en este tramo. El firme, la anchura y las referencias del paisaje obligan a ajustar el paso; lo que parecía un simple camino empieza a mostrar decisiones tomadas por quienes lo trazaron.",
  "Las señales más antiguas no siempre coinciden con el tránsito actual. Algunos viajeros han preferido acortar y otros han dejado rodeos cuidadosamente marcados. Desde el punto de llegada pueden compararse varias direcciones, pero los accidentes del terreno ocultan sus destinos. Incluso una pausa breve permite reconocer qué trayectos se usan con más frecuencia.",
  "Una señal de ruta fue movida para beneficiar a alguien. Un viajero conoce parte del cambio; devolverla a su sitio, seguir el desvío o preguntar por su autor ofrece alternativas.", "srd-enemy-bandido", "npc-cartografa", "srd-cuerda", "fantasy road journey ambient",
  `Cruce de los Cuatro Hitos|Cuatro piedras señalan rutas diferentes y una quinta yace tumbada entre ellas.
Calzada de las Lajas Sueltas|Las lajas se levantan ligeramente al pisarlas y dejan ver tierra oscura debajo.
Camino de los Carros Quemados|Restos de ruedas ennegrecidas forman una hilera junto a una vía todavía transitada.
Sendero del Peaje Abandonado|Una barrera levantada conserva un cuenco de monedas y una caseta sin techo.
Paso de las Marcas Blancas|Manchas blancas señalan un recorrido que se separa de las huellas más profundas.
Puente de las Cadenas Flojas|Las cadenas del puente cuelgan más de un lado y hacen sonar sus anillas.
Desvío de los Dos Mojones|Dos mojones idénticos se ven desde el mismo lugar, a ambos lados de una curva.
Camino del Árbol Señalado|Un árbol contiene tantas señales clavadas que apenas se distingue su corteza.
Calzada del Carro Detenido|Un carro sin tiro ocupa media calzada y conserva sus cargas bien sujetas.
Paso de la Zanja Nueva|Una zanja reciente cruza la ruta y termina de forma abrupta antes del borde.
Ruta de las Piedras Numeradas|Números tallados en piedras bajas no mantienen el orden que sugieren las distancias.
Camino del Talud Desprendido|Un derrumbe parcial ha dejado visible una capa de piedra trabajada dentro del talud.
Cruce del Poste Torcido|El poste central se ha girado y muestra manchas donde antes apoyaba sus letreros.
Puente del Cobrador Ausente|Una mesa de cobro conserva fichas ordenadas y una campanilla sujeta con cuerda.
Sendero de las Linternas Apagadas|Ganchos regulares sostienen linternas cerradas cuyas mechas parecen nuevas.
Calzada de los Pasos Laterales|El centro de la vía está limpio, mientras ambos bordes muestran huellas continuas.
Camino de la Carga Derramada|Pequeños granos y fragmentos de tela marcan una ruta que se pierde fuera del firme.
Paso de las Dos Sombras|Dos elevaciones cercanas cubren el camino en momentos distintos y ocultan sendas separadas.
Cruce del Refugio Cerrado|Una pequeña caseta tiene el cerrojo puesto desde fuera y una ventana sin cristal.
Ruta de los Muretes Bajos|Muretes delimitan un paso estrecho y ofrecen aberturas orientadas hacia caminos secundarios.
Camino del Arroyo Desviado|Un cauce reciente corre junto a la ruta y conserva restos de un antiguo puente.
Calzada de las Flechas Borradas|Las flechas pintadas fueron raspadas, pero sus contornos sobreviven en las zonas protegidas.
Paso del Carillón de Viento|Piezas metálicas cuelgan sobre la ruta y suenan de forma distinta según el acceso.
Cruce de las Mantas Tendidas|Mantas secándose sobre cuerdas atraviesan un cruce cuya salida permanece despejada.
Camino de las Botas Colgadas|Pares de botas cuelgan de postes bajos, ordenados por tamaños a lo largo del sendero.`);

add("bosques", "Bosques y arboledas",
  "El follaje cierra la vista del horizonte. Entre los troncos se abren corredores de luz y sombra, y la distancia resulta difícil de medir porque cada perspectiva termina en otra capa de ramas.",
  "El suelo conserva hojas de distintas estaciones, raíces descubiertas y claros de tierra oscura. El aire huele a corteza húmeda; un rumor de copas acompaña los sonidos más próximos. Algunos senderos pasan bajo las ramas sin dañarlas, mientras otros cortan directamente entre los árboles. La diferencia permite reconocer usos distintos del mismo bosque.",
  "Alguien altera los límites de una arboleda protegida. El master puede ofrecer una investigación, una negociación con sus cuidadores o la búsqueda de un paso alternativo.", "srd-enemy-lobo", "npc-vigilia", "srd-cuerda", "enchanted woodland ambient",
`Claro de los Ciervos Blancos|Huellas de pezuñas rodean un tocón blanco que permanece libre de musgo.
Robledal de las Campanas|Campanas de barro cuelgan de las ramas bajas sin llegar a tocarse.
Bosque de los Troncos Huecos|Los troncos más gruesos tienen aberturas que miran todas hacia el mismo claro.
Arboleda de las Cintas Azules|Cintas desteñidas unen árboles jóvenes y delimitan un corredor sinuoso.
Hayedo del Arroyo Oculto|El agua se oye bajo las raíces, pero no aparece en la superficie.
Pinar de las Agujas Rojas|Una franja de agujas rojizas cruza el suelo entre pinos todavía verdes.
Sendero del Zorro Tallado|Pequeños zorros tallados en cortezas antiguas señalan desvíos casi cerrados.
Claro de la Mesa de Piedra|Una losa horizontal conserva marcas de platos y un hueco sin ocupar.
Bosque de los Nidos Bajos|Nidos vacíos descansan a la altura de la cintura sobre ramas entrelazadas.
Alameda de las Sombras Dobles|Un canal refleja la luz sobre los troncos y duplica sus sombras.
Arboleda del Pozo de Hojas|Las hojas caídas forman un embudo alrededor de un brocal apenas visible.
Bosque del Puente Vivo|Dos árboles inclinados enlazan sus raíces sobre una zanja profunda.
Claro de las Setas Doradas|Setas amarillas crecen en círculo alrededor de una tierra recién removida.
Saucedal de las Redes Rotas|Retazos de redes se enredan en ramas que rozan un estanque inmóvil.
Bosque del Carbonero Ausente|Una carbonera apagada conserva herramientas ordenadas y un saco abierto.
Roble de los Juramentos|Cientos de pequeños clavos sujetan tablillas sin firma a la corteza.
Bosque de las Sendas Gemelas|Dos sendas paralelas quedan separadas por árboles unidos mediante raíces gruesas.
Claro del Último Rayo|Una abertura estrecha entre las copas ilumina una piedra al fondo.
Castañar de las Cestas Vacías|Cestas de mimbre cuelgan de postes bajos junto a los árboles.
Bosque del Tocón Quemado|Un único tocón está carbonizado dentro de una extensión sin señales de incendio.
Arboleda de los Susurros Secos|Hojas secas permanecen prendidas a ramas verdes y rozan unas con otras.
Bosque de las Escaleras de Raíz|Raíces expuestas forman escalones hasta una plataforma natural entre troncos.
Claro del Espantapájaros Verde|Un espantapájaros cubierto de enredaderas sostiene un cuenco lleno de lluvia.
Bosque de la Cerca Hundida|Una cerca antigua desaparece bajo árboles crecidos en ambos lados.
Arboleda de las Piedras Sembradas|Piedras planas surgen entre las raíces siguiendo filas demasiado regulares.`);

add("selvas", "Selvas y junglas",
  "La vegetación se superpone en capas tan densas que apenas deja ver el terreno siguiente. Grandes hojas recogen gotas de agua y las dejan caer con un ritmo diferente al de la lluvia.",
  "El aire es cálido y lleva olor a frutas maduras, barro y madera mojada. Lianas, tallos y raíces obligan a elegir dónde apoyar cada paso. Sobre la altura de los ojos, los movimientos del follaje revelan otra circulación que nunca llega del todo al suelo. Los claros parecen islas dentro de una extensión verde sin horizonte.",
  "Una ruta de recolección ha quedado interrumpida. Sus usuarios pueden pedir ayuda para averiguar la causa y ofrecer un guía o un recurso local a cambio.", "srd-enemy-serpiente-venenosa", "npc-cartografa", "srd-antitoxina", "tropical jungle exploration ambient",
`Jungla de las Flores Gigantes|Flores del tamaño de escudos inclinan sus pétalos hacia una senda despejada.
Pasarela de los Bejucos|Lianas trenzadas forman una pasarela estrecha sobre un cauce turbio.
Claro del Ídolo Cubierto|Una figura de piedra asoma entre raíces que rodean sus manos abiertas.
Selva de los Frutos Azules|Frutos azules cuelgan sobre cestas abandonadas que conservan manchas del mismo color.
Barranco de las Mariposas|Nubes de mariposas se reúnen en una pared húmeda llena de pequeñas grietas.
Dosel de los Nidos Tejidos|Nidos alargados cuelgan del dosel sobre un espacio sin plantas bajas.
Terraza del Ceibo Partido|Un ceibo caído sostiene una terraza natural cubierta de brotes nuevos.
Jungla de las Piedras Calientes|Piedras oscuras desprenden calor dentro de un arroyo poco profundo.
Claro de las Huellas Redondas|Huellas redondas atraviesan el barro y terminan bajo un helecho gigantesco.
Selva de los Puentes de Hormigas|Filas de hormigas enlazan troncos mediante hojas sujetas por sus cuerpos.
Laguna de las Flores Cerradas|Las flores flotantes permanecen cerradas alrededor de un pequeño embarcadero.
Ladera de las Escamas Verdes|Fragmentos de corteza brillante cubren una pendiente con marcas de arrastre.
Corredor de los Helechos Altos|Helechos más altos que una persona delimitan un pasillo casi recto.
Claro del Tambor Hundido|Un tambor de madera sobresale del fango bajo un techo de hojas.
Selva de los Árboles Escalera|Cortes antiguos forman peldaños en varios troncos de gran altura.
Poza de las Raíces Rojas|Raíces rojizas penetran en una poza cuya orilla conserva piedras apiladas.
Jardín de las Orquídeas Salvajes|Orquídeas de distintos colores crecen sobre restos de muros bajos.
Jungla del Sol Filtrado|Una abertura entre hojas proyecta círculos de luz sobre tierra limpia.
Paso de la Cascada Tibia|Un velo de agua templada separa dos tramos de una misma senda.
Claro de las Máscaras Vegetales|Máscaras hechas con hojas secas descansan sobre soportes de madera.
Selva de la Savia Blanca|La savia blanquecina de varios troncos forma líneas hasta una roca central.
Ribera de los Caimanes de Piedra|Esculturas de reptiles emergen de la orilla cubiertas de musgo.
Jungla de los Ecoacuáticos|Pequeñas cavidades llenas de agua devuelven los sonidos con tonos distintos.
Claro de los Cestos Suspendidos|Cestos cerrados cuelgan de cuerdas que desaparecen entre las copas.
Selva de las Columnas Verdes|Raíces aéreas rodean columnas talladas y ocultan sus bases por completo.`);

add("pantanos", "Pantanos y marismas",
  "El terreno firme se divide en islotes unidos por pasos inciertos. El agua oscura refleja el cielo entre hierbas altas, y su superficie solo se rompe cuando algo se mueve debajo o cerca de la orilla.",
  "El olor mezcla vegetación fermentada, tierra mojada y madera blanda. Algunas plantas señalan zonas profundas, mientras otras arraigan sobre suelo más seguro. Entre los juncos aparecen viejos apoyos para pasarelas y pequeños puntos donde alguien dejó espacio para amarrar una embarcación. La orientación depende tanto de esas marcas como de las escasas elevaciones visibles.",
  "Una persona conoce una travesía segura, pero necesita recuperar algo arrastrado por el agua. Puede acordarse una ayuda mutua sin convertir la ruta en una emboscada obligatoria.", "srd-enemy-cocodrilo", "npc-cartografa", "srd-cuerda", "dark marsh swamp ambient",
`Marisma de los Faroles Verdes|Faroles verdosos descansan sobre estacas inclinadas junto a una pasarela incompleta.
Pantano de las Campanas Sumergidas|Bajo el agua se distinguen campanas apoyadas en el fondo cenagoso.
Islote de los Sauces Negros|Sauces de corteza oscura rodean una pequeña extensión de tierra seca.
Turbera del Carro Hundido|El techo de un carro sobresale entre plantas que cubren sus ruedas.
Canal de las Botellas Selladas|Botellas cerradas se acumulan contra una barrera de ramas entrelazadas.
Marjal del Molino Torcido|Un molino inclinado conserva una rueda que el agua apenas alcanza.
Pantano de los Juncos Cortados|Un círculo de juncos recién cortados rodea una plataforma de tablas.
Poza del Reflejo Quieto|La superficie refleja ramas inmóviles mientras las ramas reales se balancean.
Islas de los Espantamoscas|Muñecos de tela penden sobre islotes unidos mediante cuerdas finas.
Marisma del Camino de Conchas|Conchas claras marcan una ruta que desaparece con el ascenso del agua.
Pantano de las Raíces Flotantes|Masas de raíces se desplazan lentamente junto a un tronco anclado.
Turbera del Humo Frío|Un humo pálido se concentra sobre una depresión sin cenizas visibles.
Canal de los Remeros Ausentes|Remos alineados descansan junto a un muelle donde no hay barcas.
Marjal de las Garzas Rojas|Plumas rojizas cubren un poste de amarre rodeado de huellas largas.
Pantano del Altar de Sal|Una piedra plana sostiene montoncitos de sal protegidos por un techo pequeño.
Islote de las Casas Cerradas|Tres cabañas cerradas comparten una terraza elevada sobre barro reciente.
Marisma de los Peces Luminosos|Destellos recorren el agua bajo una cubierta de hojas flotantes.
Pantano de los Barcos Árbol|Árboles crecen dentro de cascos de barcas apoyados en el fango.
Canal del Puente de Huesos|Huesos grandes refuerzan una pasarela cuyas tablas se hunden en el centro.
Turbera de las Huellas Secas|Huellas perfectamente secas atraviesan una franja de barro húmedo.
Marjal del Nido Vacío|Un enorme nido de ramas ocupa el único montículo visible.
Pantano de la Cuerda Tensa|Una cuerda atraviesa el agua y desaparece bajo dos orillas opuestas.
Islote de las Ofrendas Oxidadas|Herramientas oxidadas descansan sobre piedras cubiertas de líquenes.
Marisma de las Puertas Flotantes|Puertas desprendidas giran lentamente alrededor de una vieja escalera.
Pantano del Último Poste|Una sucesión de postes termina ante una extensión sin señales de paso.`);

add("montanas", "Montañas y barrancos",
  "Las pendientes fragmentan el paisaje en planos de piedra. Cada curva oculta el siguiente tramo, y los perfiles de las cumbres cambian al acercarse hasta perder el parecido con su forma vista desde abajo.",
  "El viento llega en ráfagas que transportan polvo fino y un frío seco. La roca muestra vetas, derrumbes antiguos y superficies pulidas por quienes buscaron apoyo. Entre las alturas se distinguen pequeños refugios naturales; algunos reciben el sol, otros conservan sombra durante horas. La ruta más corta no parece necesariamente la más sencilla ni la más protegida.",
  "El paso habitual está cerrado y dos guías proponen alternativas. Investigar sus razones puede revelar una necesidad local antes que un enemigo.", "srd-enemy-aguila-gigante", "npc-cartografa", "srd-cuerda", "mountain wind adventure ambient",
`Paso de las Agujas Gemelas|Dos agujas de roca enmarcan una senda marcada con piedras blancas.
Barranco del Puente Roto|Restos de un puente cuelgan sobre un vacío cuyo fondo no se distingue.
Cornisa del Nido Antiguo|Un nido desocupado llena una cornisa protegida del viento dominante.
Valle de las Campanas de Hierro|Campanas de hierro penden entre refugios dispersos a distintas alturas.
Ladera de los Cristales Verdes|Cristales verdosos asoman en una veta junto a herramientas de extracción.
Garganta del Río Lejano|El río apenas se ve al fondo, pero su rumor llena toda la garganta.
Cumbre de las Banderas Deshilachadas|Banderas de distintos colores rodean un hito de piedras sueltas.
Cantera de las Estatuas Inacabadas|Figuras incompletas permanecen unidas a la roca de la que fueron talladas.
Paso de la Nieve Manchada|Una franja de nieve teñida de rojo cruza la senda sin huellas alrededor.
Mirador de los Siete Picos|Siete cumbres rodean una plataforma con marcas de observación en el suelo.
Barranco de los Troncos Encallados|Troncos arrastrados forman una barrera sobre un cauce estrecho.
Ladera de las Escaleras Talladas|Escalones de tamaños desiguales ascienden hasta una abertura oscura.
Valle del Humo Azul|Columnas de humo azulado surgen entre rocas próximas a un pequeño campamento.
Paso de las Cadenas Antiguas|Cadenas fijadas a la pared permiten cruzar una pendiente muy expuesta.
Cresta del Viento Silbador|Grietas estrechas producen notas distintas cuando cambia la dirección del viento.
Circo de las Piedras Redondas|Piedras redondas se agrupan en el fondo de una depresión casi circular.
Montaña del Cráter Dormido|El borde de un cráter conserva una senda y pequeños respiraderos tibios.
Ladera de los Carneros Tallados|Relieves de carneros aparecen sobre apoyos de una vieja ruta de carga.
Paso del Refugio Excavado|Una puerta baja conduce a un refugio abierto directamente en la roca.
Balcón de las Nubes Bajas|Las nubes cruzan por debajo de una terraza con postes de amarre.
Garganta de las Voces Partidas|Cada palabra vuelve desde paredes opuestas en fragmentos separados.
Cantera del Bloque Suspendido|Un bloque enorme queda sujeto por vigas junto a una pista abandonada.
Valle de las Fuentes Minerales|Manchas de colores rodean fuentes que brotan a distintas temperaturas.
Paso de los Clavos Dobles|Clavos viejos y nuevos comparten una línea de ascenso sobre piedra lisa.
Cumbre del Espejo Roto|Fragmentos de un espejo orientado al valle permanecen sujetos a un marco.`);

add("desiertos", "Desiertos y eriales",
  "La vista se extiende sobre superficies que parecen vacías hasta descubrir sus diferencias: crestas bajas, cauces secos y manchas de roca donde la luz cambia de intensidad. El horizonte tiembla sobre las zonas más expuestas.",
  "El aire arrastra granos finos que se acumulan en cualquier hueco protegido. Los rastros duran poco en terreno abierto y mucho más bajo los salientes. Hay lugares donde la sombra resulta tan importante como una puerta o un camino. Las señales de agua, refugio y tránsito se reconocen en pequeños detalles que destacan precisamente por su escasez.",
  "Una reserva de agua tiene más solicitantes que provisiones. El master puede proponer un acuerdo, reparar su abastecimiento o investigar otra fuente, sin resolverlo automáticamente mediante combate.", "srd-enemy-escorpion-gigante", "npc-cartografa", "srd-cuerda", "desert caravan ambient",
`Oasis de las Palmeras Cortadas|Palmeras cortadas rodean un estanque cuya orilla conserva escalones de piedra.
Dunas de las Campanas Enterradas|Los bordes de varias campanas asoman entre crestas de arena.
Erial de los Espejos Negros|Placas oscuras reflejan fragmentos del cielo sobre una llanura agrietada.
Caravanserai de las Tres Puertas|Tres puertas exteriores conducen a patios cubiertos por toldos distintos.
Pozo de la Cuerda Sin Cubo|Una cuerda larga desciende por un brocal y termina fuera de la vista.
Desierto de las Costillas Gigantes|Costillas enormes forman arcos sobre una ruta de huellas recientes.
Meseta de los Hornos Fríos|Hornos de barro alineados conservan vasijas sin cocer a su alrededor.
Duna del Estandarte Hundido|La punta de un estandarte sobresale de arena acumulada en círculos.
Salina de las Huellas Oscuras|Huellas oscuras atraviesan una costra blanca que cruje en sus bordes.
Cañón de los Toldos Rojos|Toldos rojizos enlazan paredes estrechas sobre una ruta de caravanas.
Oasis de la Fuente Sellada|Una placa cubre la fuente central y conserva sellos de varias manos.
Erial del Barco Lejano|Un casco de barco descansa sobre tierra seca lejos de cualquier cauce.
Dunas de las Escaleras Perdidas|Escaleras aisladas ascienden por fachadas enterradas casi por completo.
Llanura de las Piedras Imantadas|Fragmentos metálicos se agrupan alrededor de rocas de superficie oscura.
Refugio de las Velas Blancas|Grandes telas blancas protegen una hondonada con anclajes recientemente reparados.
Desierto del Reloj de Sombra|Columnas de alturas distintas rodean marcas circulares sobre el suelo.
Cripta de Arena Abierta|Una abertura rectangular muestra escalones que la arena empieza a cubrir.
Oasis de los Cuencos Vacíos|Cuencos de tamaños diversos rodean un manantial reducido a un hilo.
Erial de las Torres de Vidrio|Torres translúcidas y quebradas proyectan colores sobre el terreno seco.
Duna de los Cascabeles|Pequeños cascabeles unidos por un hilo atraviesan una cresta arenosa.
Cauce de la Caravana Pétrea|Rocas con formas de animales cargados siguen un cauce sin agua.
Salina de las Puertas Bajas|Puertas bajas se abren en montículos blancos rodeados de canales secos.
Desierto de la Lluvia Antigua|Surcos profundos convergen en una cisterna de muros cuidadosamente mantenidos.
Campamento del Mapa Quemado|Un mapa parcialmente quemado permanece sujeto bajo piedras de distinto color.
Erial del Jardín Cercado|Una cerca protege surcos vacíos y una sola planta bajo sombra.`);

add("llanuras", "Praderas y campos abiertos",
  "La vegetación baja deja ver grandes distancias, aunque las ondulaciones del suelo esconden caminos y pequeños refugios. El viento recorre las hierbas en franjas que cambian de color al inclinarse.",
  "El aire lleva semillas ligeras y sonidos que parecen llegar desde más lejos de lo habitual. Postes, cercas y árboles aislados sirven de referencia sobre una extensión sin muros. En algunos puntos el suelo conserva senderos bien definidos; en otros, el paso se dispersa hasta confundirse con la hierba. Cada elevación ofrece una vista distinta del conjunto.",
  "Las marcas de un límite territorial han cambiado de sitio. Dos grupos sostienen recuerdos distintos; un testigo, un mapa o una señal antigua puede ayudar a acordar el uso del terreno.", "srd-enemy-jabali", "srd-npc-plebeyo", "srd-mapa", "grassland pastoral ambient",
`Pradera de las Cometas Quietas|Cometas sujetas a postes descansan a pesar de la brisa constante.
Campo de las Piedras Cantoras|Piedras perforadas producen silbidos sobre una elevación cubierta de hierba.
Llanura de los Caballos Pintados|Siluetas de caballos pintadas en losas señalan un sendero ancho.
Colina de las Ovejas Ausentes|Un redil abierto conserva lana en las cercas y ningún animal visible.
Prado del Círculo Segado|Un círculo de hierba corta rodea un poste sin inscripciones.
Campo de los Girasoles Nocturnos|Girasoles secos mantienen sus cabezas orientadas hacia un único montículo.
Estepa de las Tiendas Dobles|Tiendas emparejadas dejan un pasillo central lleno de pequeñas hogueras apagadas.
Pradera de las Tumbas Sin Nombre|Túmulos bajos aparecen bajo hierba cuidadosamente cortada.
Llanura del Árbol Solitario|Un árbol enorme ofrece sombra junto a bancos de distintas épocas.
Campo de las Cercas Móviles|Tramos de cerca descansan sobre ruedas en torno a un cultivo pequeño.
Colina del Observatorio de Hierba|Aros de madera apuntan hacia el horizonte desde una plataforma elevada.
Prado de las Cintas de Viento|Cintas largas sujetas a estacas indican corrientes en direcciones diferentes.
Estepa de los Pozos Tapados|Tapas circulares de piedra se repiten a distancias regulares.
Campo del Espantapájaros Coronado|Un espantapájaros lleva una corona de flores frescas y zapatos nuevos.
Llanura de los Surcos Interrumpidos|Surcos de arado terminan todos ante una franja de tierra intacta.
Colina de los Carros Circulares|Carros vacíos forman un círculo con una entrada orientada al oeste.
Pradera de las Flores de Ceniza|Flores pálidas crecen sobre manchas antiguas de tierra quemada.
Campo del Molino Sin Aspas|La torre de un molino conserva sus aspas desmontadas alrededor.
Estepa de las Huellas Paralelas|Dos líneas de huellas atraviesan kilómetros visibles sin llegar a cruzarse.
Prado del Estanque Redondo|Un estanque casi circular refleja un anillo de juncos bajos.
Llanura de las Banderas Pequeñas|Banderas a ras de suelo delimitan zonas de colores distintos.
Colina de las Flechas de Tiza|Flechas blancas cubren piedras dispuestas alrededor de una senda borrada.
Campo de las Campanas de Barro|Campanas enterradas hasta la mitad rodean un huerto protegido.
Pradera del Festival Desmontado|Postes decorados y plataformas vacías permanecen tras una celebración reciente.
Estepa del Horizonte Partido|Una larga falla divide la llanura y deja ver una ruta inferior.`);

add("costas", "Costas y acantilados",
  "El terreno termina junto a una extensión de agua en movimiento. Las líneas de espuma dibujan y borran fronteras sobre la orilla, mientras los puntos elevados permiten ver rutas que desde abajo quedan ocultas.",
  "La sal se acumula sobre piedras, cuerdas y superficies expuestas. El viento trae olor a algas y cambia la claridad de los sonidos que llegan desde el agua. Restos de amarre, escalones y marcas de nivel indican cómo se utiliza este borde entre tierra y mar. Algunos pasos solo parecen disponibles cuando las aguas se retiran.",
  "Algo útil ha quedado atrapado por la marea. Una persona local puede explicar cuándo recuperarlo y pedir ayuda; el peligro puede ser ambiental antes que un combate.", "srd-enemy-cangrejo-gigante", "srd-npc-plebeyo", "srd-red", "ocean coast harbor ambient",
`Playa de las Botellas Negras|Botellas negras se acumulan en una línea que la espuma no alcanza.
Acantilado de las Escaleras Blancas|Escalones blanqueados por la sal bajan hasta una cornisa cubierta de algas.
Cala de los Remiendos|Velas remendadas cubren pequeñas barcas varadas entre piedras.
Faro de la Ventana Oscura|La linterna del faro permanece apagada y una ventana inferior está abierta.
Costa de las Anclas Viejas|Anclas oxidadas emergen de la arena junto a marcas de arrastre recientes.
Playa del Barco Partido|Las dos mitades de un casco descansan separadas por un arroyo.
Acantilado de los Nidos Salinos|Nidos de aves llenan cavidades alrededor de una puerta tallada.
Puerto de la Campana Sumergida|Una campana se distingue bajo el agua clara junto al muelle.
Cala de las Conchas Rojas|Conchas rojizas forman montones ordenados sobre una terraza natural.
Costa de los Arcos Marinos|Arcos de roca enlazan pequeñas playas visibles durante la bajamar.
Playa de la Estatua Volcada|Una estatua yace de lado con su rostro orientado hacia el mar.
Faro de los Cristales Coloreados|Cristales de colores rodean una linterna protegida por paneles reparados.
Acantilado del Sendero de Cabras|Un sendero estrecho cruza sobre una grieta que comunica con el agua.
Cala del Muelle de Cuerda|Tablas unidas por cuerdas forman un muelle recogido sobre la arena.
Costa de las Salinas Abandonadas|Pequeñas piscinas de sal conservan compuertas de madera recién movidas.
Playa de los Escudos Lavados|Escudos sin emblemas descansan entre algas depositadas por la marea.
Puerto de las Redes Doradas|Redes teñidas de amarillo cuelgan entre cobertizos con puertas bajas.
Acantilado del Órgano de Roca|Aberturas en la roca devuelven tonos graves con cada oleaje.
Cala de las Huellas Descalzas|Huellas descalzas suben desde el agua hasta una roca seca.
Costa del Cementerio de Timones|Timones rotos se apoyan en pequeñas lápidas frente al mar.
Playa del Círculo de Medusas|Medusas transparentes rodean un espacio de arena sorprendentemente limpio.
Faro de la Escalera Exterior|Una escalera de hierro rodea la torre por fuera y termina antes del techo.
Puerto del Embarcadero Cerrado|Una cadena cruza el embarcadero junto a permisos sujetos en tablillas.
Acantilado de las Velas Prendidas|Velas de cera protegidas por vasos iluminan huecos cercanos al borde.
Cala del Refugio de Naufragios|Tablas de varios barcos forman un refugio con nombres grabados.`);

add("islas", "Islas y archipiélagos",
  "El lugar queda rodeado por agua, aunque sus límites se descubren poco a poco. Desde la llegada se distinguen rutas hacia el interior y señales de que otras personas eligieron accesos diferentes.",
  "El viento lleva noticias del agua incluso cuando esta queda fuera de la vista. Los recursos aparecen agrupados en pequeños espacios, y cualquier construcción parece responder a la necesidad de conservarlos. En las elevaciones se reconocen referencias para navegar; cerca de las orillas, los rastros de desembarco se mezclan con lo que han dejado las corrientes.",
  "Los habitantes o visitantes esperan un transporte que no llega. Reparar una embarcación, investigar una señal o decidir qué suministros compartir permite abrir una historia sin imponer un naufragio.", "srd-enemy-serpiente-constrictora", "npc-cartografa", "srd-mapa", "mysterious island ambient",
`Isla del Faro Inclinado|Un faro inclinado señala un desembarcadero oculto detrás de rocas oscuras.
Islote de los Cien Cangrejos|Caparazones vacíos rodean una caja cerrada sobre arena seca.
Isla de las Palmas Gemelas|Dos palmeras enlazadas dominan un pozo protegido por tablas.
Archipiélago de las Pasarelas|Pasarelas desmontables unen islotes separados por canales estrechos.
Isla del Jardín Circular|Un jardín circular ocupa el centro de una isla de costas pedregosas.
Islote del Ermitaño Ausente|Una pequeña casa conserva comida tapada y una puerta sin cerrojo.
Isla de los Barcos Colgados|Pequeños barcos cuelgan entre árboles como si fueran depósitos elevados.
Isla de la Arena Violeta|Arena violácea cubre la playa alrededor de una fuente transparente.
Archipiélago de las Torres Huecas|Torres sin techo se levantan en islas de tamaños distintos.
Isla de la Campana Rajada|Una campana rajada descansa sobre un pedestal visible desde la costa.
Islote de las Plumas Largas|Plumas de gran tamaño se acumulan junto a marcas de garras.
Isla del Lago Interior|Un lago quieto queda separado del mar por una cresta de tierra.
Isla de los Mástiles Vivos|Árboles crecen junto a mástiles antiguos sujetos mediante raíces.
Archipiélago de las Mareas Cruzadas|Dos corrientes dibujan líneas opuestas entre los canales de desembarco.
Isla de las Máscaras Blancas|Máscaras blancas cuelgan sobre entradas excavadas en una ladera.
Islote del Puente Hundido|Un puente emerge bajo el agua y apunta hacia otra isla cercana.
Isla de los Huertos de Sal|Huertos elevados comparten canales estrechos junto a barreras de piedra.
Isla del Cráter Verde|Vegetación espesa llena un cráter con una escalera tallada en el borde.
Archipiélago de las Luces Bajas|Luces protegidas por pantallas señalan entradas próximas al nivel del agua.
Isla del Astillero Silencioso|Un casco a medio construir permanece sobre soportes cuidadosamente alineados.
Islote de las Cuerdas Secas|Cuerdas tendidas entre postes guardan nudos de formas diferentes.
Isla de las Estatuas Orientadas|Estatuas de rostros gastados miran hacia un mismo punto del horizonte.
Isla de la Biblioteca Sellada|Un edificio sin ventanas conserva una puerta cubierta de sellos de cera.
Archipiélago del Paso Estrecho|Un paso entre arrecifes queda marcado por postes de colores alternos.
Isla del Banquete Vacío|Mesas de piedra sostienen platos limpios bajo una cubierta vegetal.`);

add("rios", "Ríos, lagos y humedales",
  "El agua organiza el paisaje y obliga a mirar cómo se llega a cada orilla. Las corrientes muestran trayectos rápidos, remansos y pequeños obstáculos que desde lejos parecían formar una sola superficie.",
  "El aire resulta más fresco cerca del cauce. Piedras mojadas, raíces expuestas y marcas en los apoyos permiten reconocer antiguos niveles de agua. Los accesos usados con frecuencia tienen bordes gastados; otros permanecen cubiertos de plantas. Desde una zona protegida se pueden observar ambas orillas y distinguir qué conexiones dependen de un puente, una barca o un vado.",
  "El uso de un paso o una fuente genera una disputa local. Un acuerdo, la reparación de un canal o una búsqueda río arriba puede resolverla y descubrir otros lugares.", "srd-enemy-cocodrilo", "srd-npc-plebeyo", "srd-cuerda", "river lake water ambient",
`Vado de las Piedras Azules|Piedras azules forman una línea irregular bajo agua poco profunda.
Lago de la Torre Reflejada|Una torre aparece en el reflejo cerca de restos de cimientos sumergidos.
Ribera de las Barcas Cerradas|Barcas cubiertas con lonas descansan junto a estacas numeradas.
Cascada de los Escalones Rotos|Una escalera fragmentada acompaña la cascada hasta una cornisa oculta.
Remanso de las Flores Flotantes|Flores recién cortadas giran lentamente junto a una pequeña pasarela.
Río de los Puentes Desiguales|Dos puentes de alturas distintas cruzan el cauce en pocos pasos.
Lago del Muelle Sumergido|Postes del muelle sobresalen del agua mientras las tablas permanecen debajo.
Ribera del Molino Abierto|La rueda del molino gira junto a una puerta abierta y sin bisagras.
Cascada del Velo Plateado|El agua fina deja ver una cavidad con marcas en la pared.
Vado de los Escudos de Piedra|Losas talladas como escudos sirven de apoyos entre las corrientes.
Río de las Cestas Amarradas|Cestas cerradas flotan sujetas a cuerdas tendidas desde la orilla.
Lago de las Velas Pequeñas|Pequeñas embarcaciones de vela se agrupan alrededor de un islote central.
Ribera de los Sauces Numerados|Los troncos de los sauces llevan números pintados por encima de la crecida.
Remanso del Puente Inacabado|Pilares sin tablero dividen el agua en corrientes estrechas.
Cascada de las Campanas de Cristal|Cristales colgados junto al agua producen notas finas al mojarse.
Río del Tronco Atravesado|Un tronco enorme conecta ambas orillas y conserva marcas de pasos.
Lago de las Tres Profundidades|Postes de colores distintos separan zonas cuya agua cambia de tonalidad.
Ribera del Lavadero Vacío|Piedras de lavar conservan telas extendidas sin nadie a su alrededor.
Vado del Carro Detenido|Un carro inmóvil ocupa el centro del paso junto a cuerdas sueltas.
Remanso de las Llaves Oxidadas|Llaves oxidadas cuelgan de ramas sobre una poza transparente.
Río de las Compuertas Viejas|Compuertas de madera distribuyen el cauce entre canales de tamaños distintos.
Lago de las Escaleras Gemelas|Dos escaleras bajan al agua desde orillas opuestas sin embarcaderos.
Ribera de los Peces Tallados|Peces tallados en las rocas señalan pequeños accesos al cauce.
Cascada del Arco Partido|El agua cae a través de restos de un arco de piedra.
Remanso del Refugio Flotante|Una plataforma techada permanece anclada junto a una orilla de juncos.`);

add("cavernas", "Cuevas y profundidades",
  "La abertura conduce a un espacio donde la luz pierde alcance rápidamente. Las formas de la piedra ofrecen salientes, huecos y pasos que solo se distinguen al cambiar la posición desde la que se observan.",
  "La temperatura varía menos que afuera y el aire transporta olor mineral. Las gotas marcan un ritmo irregular, acompañado por corrientes que señalan conexiones invisibles. El suelo alterna superficies secas, humedad y restos arrastrados desde otras cámaras. Los ecos prolongan algunos sonidos y absorben otros, dificultando saber qué distancia separa una sala de la siguiente.",
  "Una expedición dejó señales incompletas para una ruta segura. El master puede ofrecer rescate, exploración o recuperación de herramientas; las marcas no tienen por qué ocultar una criatura hostil.", "srd-enemy-murcielago-gigante", "npc-cartografa", "srd-antorcha", "underground cavern ambience",
`Cueva de las Columnas Blancas|Columnas blancas estrechan el paso alrededor de una poza inmóvil.
Gruta de los Cristales Rojos|Cristales rojos reflejan la luz sobre paredes cubiertas de pequeños arañazos.
Galería del Lago Negro|Un lago oscuro ocupa la galería y deja una cornisa en un lateral.
Cavidad de las Escaleras Naturales|Escalones de roca descienden hacia una abertura desde la que sopla aire.
Cueva de los Nidos Ciegos|Nidos vacíos ocupan huecos altos junto a plumas cubiertas de polvo.
Gruta de las Raíces Colgantes|Raíces atraviesan el techo y llegan hasta un suelo de barro claro.
Galería de las Herramientas Rotas|Herramientas rotas se apilan contra una pared con marcas de extracción.
Cueva del Eco Doble|Dos corredores devuelven cada sonido con retrasos diferentes.
Cavidad de los Hongos Pálidos|Hongos pálidos iluminan una grieta lo suficiente para distinguir su borde.
Gruta del Puente Mineral|Una formación mineral enlaza dos plataformas sobre agua profunda.
Galería de los Carros Bajos|Pequeños carros de mina permanecen sobre rieles que se separan.
Cueva de la Cascada Oculta|Una cascada se oye detrás de una pared perforada por huecos estrechos.
Gruta de los Escudos Calcificados|Formas de escudos sobresalen de una costra mineral sobre el suelo.
Cavidad de la Luz Vertical|Un pozo en el techo deja entrar una franja vertical de luz.
Galería del Polvo Azul|Polvo azul cubre una sección de suelo sin alcanzar las paredes.
Cueva de las Mesas Planas|Rocas planas forman superficies semejantes a mesas alrededor de un hueco.
Gruta del Río Subterráneo|Un río veloz cruza bajo un acceso tallado a media altura.
Galería de los Cascabeles Quietos|Cascabeles sujetos a cuerdas delimitan una zona libre de piedras.
Cavidad del Gigante Sentado|Una formación rocosa recuerda una figura sentada con manos abiertas.
Cueva de las Cuerdas Antiguas|Cuerdas endurecidas por minerales descienden desde anclajes en el techo.
Gruta del Cristal Partido|Un cristal enorme está partido y sus mitades contienen burbujas alineadas.
Galería de las Huellas Profundas|Huellas profundas atraviesan arcilla húmeda y desaparecen sobre roca lisa.
Cueva de la Puerta de Hueso|Huesos entrelazados forman una puerta baja junto a una abertura natural.
Cavidad de los Vapores Tibios|Vapor tibio emerge de fisuras que rodean una plataforma seca.
Gruta de los Mapas Rayados|Dibujos de pasajes cubren una pared protegida de las filtraciones.`);

add("mazmorras", "Mazmorras y recintos subterráneos",
  "La construcción conserva la intención de controlar el paso. Muros, esquinas y puertas dividen el espacio en tramos breves, cada uno con una vista parcial de lo que continúa detrás.",
  "El aire huele a piedra cerrada, hierro y humedad acumulada. Las superficies muestran capas de uso: desgaste a la altura de las manos, reparaciones en las bisagras y marcas cerca del suelo. Hay elementos preparados para moverse y otros diseñados para impedirlo. Los sonidos cambian al atravesar las aberturas, como si cada recinto tuviera su propia profundidad.",
  "Un antiguo sistema de acceso sigue funcionando de manera parcial. Averiguar para qué se construyó puede permitir negociar el paso, desactivar un riesgo o recuperar un registro sin arrasar el recinto.", "srd-enemy-esqueleto", "npc-vigilia", "srd-antorcha", "dungeon exploration dark ambient",
`Prisión de las Llaves Gemelas|Dos llaves iguales cuelgan junto a celdas con cerraduras diferentes.
Sala de las Baldosas Hundidas|Baldosas hundidas forman una línea hasta una puerta de hierro.
Corredor de los Espejos Velados|Espejos cubiertos con tela se alternan con nichos vacíos.
Armería de las Vainas Vacías|Vainas y soportes permanecen alineados sin ninguna hoja visible.
Cámara del Pozo de Cadenas|Cadenas bajan por un pozo cuadrado cuyo fondo devuelve golpes apagados.
Archivo de las Puertas Numeradas|Puertas numeradas rodean un mostrador cubierto de fichas de metal.
Sala de la Mesa Encadenada|Una mesa queda sujeta a cuatro anclajes y conserva marcas circulares.
Pasillo de las Flechas Talladas|Flechas talladas señalan direcciones distintas bajo placas añadidas después.
Celdas de los Nombres Borrados|Cada celda conserva una placa raspada sobre el marco.
Cámara del Reloj Detenido|Un mecanismo de reloj ocupa la pared sobre bandejas llenas de arena.
Depósito de los Barriles Sellados|Barriles cerrados llevan sellos de colores que se repiten en las puertas.
Sala de los Tronos Bajos|Asientos bajos rodean una tarima vacía con escalones gastados.
Galería de las Rejas Torcidas|Rejas deformadas dejan pasos de anchuras distintas entre recintos.
Cámara de los Braseros Azules|Braseros apagados contienen residuos azules junto a tubos de ventilación.
Corredor de las Cuerdas de Aviso|Cuerdas tensas enlazan pequeñas campanas a distintas alturas.
Sala del Mapa Incrustado|Un mapa hecho con piedras de colores cubre el suelo central.
Celdas del Agua Ascendente|Marcas de niveles anteriores rodean celdas situadas bajo una tubería abierta.
Cámara de los Cofres Empotrados|Cofres empotrados comparten una pared con ranuras estrechas entre tapas.
Pasillo del Portón Desmontado|Piezas de un portón descansan ordenadas junto a herramientas pequeñas.
Sala de las Estatuas Vendadas|Estatuas con vendas sobre los ojos rodean una puerta sin tirador.
Laboratorio de los Cuencos Rotos|Cuencos rotos y tubos vacíos ocupan mesas separadas por biombos.
Cámara de las Escaleras Cruzadas|Dos escaleras se cruzan sin compartir descansillo en una sala alta.
Corredor del Fuego Encerrado|Una luz anaranjada se ve detrás de placas metálicas perforadas.
Sala del Libro de Piedra|Un libro tallado en piedra permanece abierto sobre un pedestal rayado.
Salida de los Cerrojazos Nuevos|Cerrojos nuevos refuerzan una puerta antigua desde el lado del recinto.`);

add("ruinas", "Ruinas y lugares olvidados",
  "Los restos del lugar dejan ver partes de una organización anterior. Lo que ahora parece un paso pudo ser una pared, y lo que permanece cerrado quizá fue una entrada importante antes del deterioro.",
  "Polvo, plantas y materiales caídos ocupan los espacios que han perdido protección. Las zonas todavía cubiertas conservan colores y marcas más definidos. Entre los fragmentos se reconocen trabajos de épocas distintas, algunos añadidos para mantener en uso una parte del conjunto cuando las demás ya estaban abandonadas. Los caminos recientes aprovechan esas diferencias sin seguir necesariamente el trazado original.",
  "Un grupo reclama un objeto del lugar como parte de su historia. El master puede plantear una búsqueda y una decisión sobre su destino, evitando asumir que todo hallazgo carece de dueño.", "srd-enemy-esqueleto", "npc-cartografa", "srd-mapa", "ancient ruins mysterious ambient",
`Teatro de las Máscaras Caídas|Máscaras de piedra yacen entre gradas invadidas por plantas bajas.
Palacio de los Patios Abiertos|Patios sin techos conservan fuentes secas conectadas por canales tallados.
Acueducto de los Arcos Rotos|Arcos fragmentados proyectan sombras sobre depósitos de agua improvisados.
Ciudad de las Puertas Sin Muros|Marcos de puertas permanecen de pie entre cimientos apenas visibles.
Biblioteca de los Nichos Vacíos|Nichos vacíos rodean mesas derrumbadas cubiertas de fragmentos de cerámica.
Torre del Escudo Desprendido|Un escudo de piedra caído bloquea la base de una torre hueca.
Jardín de las Fuentes Dormidas|Fuentes cubiertas de raíces conservan figuras con manos extendidas.
Mercado de los Mostradores Pétreos|Mostradores de piedra forman calles entre columnas de alturas desiguales.
Baños de los Mosaicos Azules|Mosaicos azules aparecen bajo sedimentos en piscinas sin agua.
Palacio del Balcón Suspendido|Un balcón sin escalera domina un salón cuyo techo ha desaparecido.
Templo del Techo de Árboles|Árboles crecidos entre columnas sustituyen el antiguo techo del recinto.
Ciudad de las Calles Hundidas|Calles hundidas conectan edificios conservados por encima del nivel del suelo.
Observatorio del Aro Caído|Un aro metálico enorme descansa sobre escalones orientados al cielo.
Archivo de las Placas de Arcilla|Placas rotas se apilan bajo estanterías de piedra todavía enteras.
Fortín de las Banderas Petrificadas|Relieves de banderas cubren muros abiertos por derrumbes antiguos.
Necrópolis de las Escaleras Cortas|Escaleras cortas conducen a tumbas con puertas de diferentes tamaños.
Molino de las Ruedas de Piedra|Ruedas de piedra permanecen en un canal desviado por plantas.
Palacio de los Retratos Lavados|Retratos casi borrados ocupan paredes protegidas por aleros rotos.
Ciudad del Puente Sepultado|Un puente sobresale de tierra acumulada entre antiguas fachadas.
Astillero de los Cascos Verdes|Musgo cubre soportes donde permanecen costillas de barcos incompletos.
Arena de las Columnas Negras|Columnas ennegrecidas rodean un espacio circular con varias entradas.
Santuario de las Manos Rotas|Manos de estatuas desprendidas descansan juntas sobre una mesa intacta.
Ruinas del Taller de Gigantes|Herramientas de gran tamaño permanecen junto a bancos de altura inusual.
Palacio de las Escaleras al Cielo|Escaleras terminan en descansillos abiertos donde antes hubo habitaciones.
Ciudad de los Jardines Invertidos|Raíces y flores cuelgan de balcones sobre calles cubiertas de escombros.`);

add("santuarios", "Santuarios y lugares de memoria",
  "El espacio parece dispuesto para recibir a quienes llegan con una intención concreta. Los accesos conducen hacia un punto que reúne señales de cuidado, recuerdo y distintas formas de permanecer en silencio.",
  "Los materiales muestran intervenciones pequeñas y repetidas: superficies limpiadas, objetos repuestos y marcas preservadas pese al desgaste. Los sonidos se perciben de manera distinta cerca del centro, donde hay menos obstáculos y más espacio para detenerse. Algunas ofrendas parecen antiguas; otras conservan la frescura de algo dejado hace poco por una mano que todavía podría regresar.",
  "Quienes cuidan el lugar necesitan completar una tarea de memoria o mantenimiento. Ayudar puede revelar una historia, facilitar un descanso o abrir un diálogo; no exige adoptar una creencia.", "srd-enemy-sombra", "srd-npc-plebeyo", "srd-vela", "sacred temple peaceful ambient",
`Capilla de las Velas Gemelas|Pares de velas rodean bancos donde siempre queda un asiento libre.
Santuario de las Fuentes Quietas|Pequeñas fuentes sin corriente sostienen flores de distintas estaciones.
Jardín de los Nombres Susurrados|Nombres tallados aparecen en piedras colocadas entre plantas aromáticas.
Templo de las Puertas Abiertas|Todas las puertas están sujetas abiertas mediante cuerdas cuidadosamente anudadas.
Cripta de los Faroles Blancos|Faroles blancos iluminan nichos cubiertos por telas sin símbolos.
Ermita del Árbol Protector|Un árbol crece a través del techo sin desplazar las vigas.
Santuario de las Máscaras Guardadas|Máscaras de ceremonias distintas permanecen ordenadas en cajas abiertas.
Memorial del Puente Caído|Fragmentos de un puente rodean una placa con nombres de viajeros.
Templo de las Campanas Mudas|Campanas sin badajo cuelgan sobre un suelo de mosaicos gastados.
Capilla del Agua Compartida|Una pila central conecta cuencos situados a diferentes alturas.
Santuario del Pan de Piedra|Panes tallados en piedra ocupan una mesa junto a cestas reales vacías.
Jardín de las Linternas Bajas|Linternas bajas marcan caminos entre bancos protegidos por setos.
Cripta de los Escudos Sin Emblema|Escudos sin emblema se apoyan contra lápidas con inscripciones breves.
Templo de la Escalera Circular|Una escalera rodea el recinto central y termina ante una ventana.
Ermita de la Última Flor|Una sola flor cuidada crece en un patio de tierra desnuda.
Santuario de los Cien Cuencos|Cuencos de tamaños distintos forman espirales alrededor de una piedra lisa.
Memorial de las Botas Vacías|Botas vacías descansan bajo una cubierta junto a pequeñas tablillas.
Capilla de las Siete Sombras|Siete columnas dividen la luz de una ventana sobre un suelo claro.
Templo de los Tapices Remendados|Tapices con remiendos visibles cubren muros de distintas épocas.
Jardín de las Semillas Prestadas|Frascos de semillas se alinean junto a surcos con etiquetas de madera.
Santuario de las Llaves Ofrecidas|Llaves de formas diversas cuelgan de un aro sobre la entrada.
Cripta de los Retratos Pequeños|Retratos pequeños acompañan nichos que conservan flores secas.
Ermita del Descanso Peregrino|Bancos, mantas y un depósito de agua ocupan un porche abierto.
Memorial de la Campana Nueva|Una campana nueva cuelga junto a fragmentos cuidadosamente reunidos de otra.
Templo del Cielo Visible|El recinto central carece de techo y conserva canales para recoger lluvia.`);

add("fortalezas", "Fortalezas y puestos de vigilancia",
  "La posición permite observar los accesos antes de que lleguen hasta el recinto. Muros y desniveles distribuyen las rutas disponibles, dejando algunos pasos a la vista y protegiendo otros detrás de la construcción.",
  "El aire transporta olor a hierro, madera trabajada y materiales almacenados. Las zonas de tránsito muestran desgaste regular, mientras los espacios de reserva permanecen más despejados. Reparaciones recientes conviven con partes antiguas que aún cumplen su función. Desde distintos puntos se aprecian señales preparadas para comunicar una llegada, pedir ayuda o cerrar el paso sin abandonar la protección.",
  "Un puesto necesita suministros o relevo, pero sus responsables discrepan sobre cómo obtenerlos. El master puede ofrecer negociación, transporte o reconocimiento del entorno antes de recurrir a un asalto.", "srd-enemy-bandido", "npc-vigilia", "srd-cuerda", "castle watchtower ambient",
`Fortaleza del Portón Remendado|El portón combina maderas distintas y conserva una abertura para hablar.
Atalaya de las Banderas Cruzadas|Dos banderas diferentes ondean sobre una torre con accesos separados.
Bastión del Foso Seco|Un foso sin agua contiene huertos pequeños entre viejos obstáculos.
Puesto de los Escudos Rojos|Escudos rojos delimitan una zona de espera junto a una barrera.
Ciudadela de las Escaleras Estrechas|Escaleras estrechas enlazan patios situados a alturas diferentes.
Fortín del Puente Levantado|Un puente elevado queda sujeto por cadenas que muestran reparaciones nuevas.
Torre de los Faroles Numerados|Faroles numerados rodean una terraza desde la que se ven varios caminos.
Bastión de las Carretas Blindadas|Carretas reforzadas ocupan un patio con salidas orientadas a distintas rutas.
Muralla de los Nidos Permitidos|Nidos de aves comparten huecos con puestos de observación vacíos.
Fortaleza del Patio de Arena|Arena limpia cubre un patio rodeado de soportes para armas.
Atalaya del Cuerno Partido|Un cuerno partido permanece sobre una mesa junto a señales escritas.
Puesto de las Cadenas de Paso|Cadenas a distintas alturas separan rutas para personas, animales y carros.
Ciudadela de las Puertas de Colores|Puertas coloreadas conectan dependencias con marcas similares en el suelo.
Fortín del Aljibe Cerrado|El aljibe central conserva una tapa nueva bajo un arco antiguo.
Bastión de los Estandartes Guardados|Estandartes enrollados descansan bajo techo junto a varas sin tela.
Torre de las Escaleras Retiradas|Escaleras de mano yacen dentro de un recinto con accesos elevados.
Fortaleza del Muro de Cristal|Un tramo translúcido refuerza un muro de piedra oscura.
Puesto del Mensajero Esperado|Un banco vacío y una montura preparada ocupan el espacio de recepción.
Muralla de los Relojes de Arena|Relojes de arena se alinean en nichos junto a tablillas de turnos.
Atalaya de las Tres Fogatas|Tres braseros se disponen en terrazas visibles desde caminos diferentes.
Fortín de los Huertos Interiores|Huertos pequeños ocupan el patio protegido detrás de un muro doble.
Ciudadela del Mercado Cercado|Puestos de venta desmontables llenan un patio entre dos controles de acceso.
Bastión de las Ballestas Cubiertas|Lonas cubren soportes de ballesta orientados hacia una ladera despejada.
Torre del Mapa de Cuerdas|Cuerdas de colores conectan clavijas sobre una representación del terreno.
Fortaleza de la Puerta Prestada|Una puerta de otro tamaño refuerza un arco parcialmente derrumbado.`);

add("tierras-heladas", "Nieve y tierras heladas",
  "La nieve suaviza los bordes del paisaje y oculta diferencias del terreno. Allí donde se ha retirado aparecen superficies oscuras, marcas de paso y referencias que permiten medir mejor las distancias.",
  "El frío vuelve visibles las respiraciones y endurece los materiales expuestos. El viento levanta pequeñas cortinas de nieve que cambian la vista sin borrar todos los rastros. Los lugares protegidos conservan detalles que afuera desaparecen: huellas, colores y pequeños restos de actividad. Una línea de postes o una entrada resguardada puede importar más que cualquier forma lejana en el horizonte.",
  "El frío amenaza una reserva o un refugio compartido. Reparar su protección, transportar recursos o localizar a alguien antes de una tormenta abre una aventura sin fijar un enemigo obligatorio.", "srd-enemy-lobo", "srd-npc-plebeyo", "srd-manta", "snow wilderness winter ambient",
`Glaciar de las Voces Bajas|Grietas azules devuelven rumores bajo una ruta marcada con postes.
Refugio de las Pieles Blancas|Pieles blancas cubren una entrada baja protegida por bloques de nieve.
Lago de los Círculos Congelados|Círculos de hielo transparente revelan objetos distintos bajo la superficie.
Paso de las Campanas de Hielo|Campanas de hielo cuelgan de un arco sujeto entre dos rocas.
Bosque de las Ramas Escarchadas|Ramas escarchadas forman un corredor sobre huellas parcialmente cubiertas.
Llanura de los Trineos Vacíos|Trineos sin carga permanecen alineados junto a un poste de amarre.
Torre de la Ventana Tibia|Una ventana empañada destaca en una torre cubierta de nieve.
Cueva del Viento Cortado|La nieve acumulada deja una entrada libre de viento bajo la roca.
Campo de las Estatuas Nevadas|Figuras cubiertas de nieve dejan ver manos orientadas hacia una colina.
Fiordo del Barco Atrapado|Un barco queda inmóvil entre placas de hielo junto a una escalera.
Refugio de los Guantes Colgados|Guantes de tamaños distintos cuelgan junto a una estufa apagada.
Glaciar de los Escalones Tallados|Escalones tallados atraviesan hielo azulado hasta una grieta protegida.
Lago de la Campana Bajo el Hielo|Una campana se ve bajo una superficie cruzada por líneas blancas.
Paso de los Estandartes Congelados|Estandartes endurecidos señalan una curva donde desaparecen las huellas.
Bosque del Fuego Protegido|Una pantalla de troncos rodea restos de una hoguera recientemente usada.
Llanura de las Huellas Gigantes|Huellas enormes se separan junto a marcas de arrastre más pequeñas.
Torre de los Carámbanos Largos|Carámbanos cubren una torre cuyo acceso permanece despejado.
Cueva de las Mantas Secas|Mantas secas descansan sobre soportes elevados junto a hielo en el suelo.
Campo de las Antorchas Apagadas|Antorchas clavadas en la nieve forman dos filas paralelas.
Fiordo de las Redes Heladas|Redes heladas cuelgan sobre plataformas de madera sujetas a la costa.
Refugio del Techo de Musgo|Musgo protegido cubre el techo de una casa enterrada hasta las ventanas.
Glaciar de los Objetos Suspendidos|Objetos pequeños quedan suspendidos dentro de una pared de hielo claro.
Lago de los Puentes Blancos|Puentes blancos conectan islotes donde el hielo tiene tonos distintos.
Paso del Alud Antiguo|Troncos y piedras sobresalen de una lengua de nieve ya endurecida.
Llanura del Sol Reflejado|Fragmentos de hielo orientados en círculo concentran luz sobre una piedra.`);

add("lugares-extranos", "Lugares extraños y fronteras mágicas",
  "Hay algo en la disposición del lugar que no coincide con lo esperado. Las formas siguen siendo reconocibles, pero una relación entre distancia, luz o movimiento invita a mirar de nuevo antes de decidir cómo avanzar.",
  "Los materiales presentan huellas de uso cotidiano pese a la anomalía. Eso sugiere que alguien encontró una manera de habitar o atravesar el espacio sin eliminar su rareza. Las señales próximas ofrecen referencias más fiables que las perspectivas lejanas. Una parte del entorno responde como cualquier otro lugar, mientras otra conserva una diferencia que solo se aprecia al observarla con calma.",
  "La anomalía tiene una condición que puede descubrirse mediante observación y pruebas prudentes. El master decide su alcance; puede ser una oportunidad, un inconveniente o una costumbre local, sin infligir efectos automáticos.", "srd-enemy-sombra", "npc-cartografa", "srd-espejo", "surreal magical realm ambient",
`Jardín de las Sombras Floridas|Flores dibujadas por sombras se desplazan sin que cambien las plantas.
Puente de la Lluvia Ascendente|Gotas de agua suben desde el río bajo un puente seco.
Plaza de los Relojes Desacordados|Relojes de una plaza marcan horas distintas mientras sus péndulos coinciden.
Bosque de los Árboles Transparentes|Los troncos dejan ver caminos que desaparecen al rodearlos.
Lago de los Reflejos Ausentes|El agua refleja las nubes, pero no los objetos de la orilla.
Escalera de las Puertas Estacionales|Cada descansillo conserva plantas de una estación diferente.
Mercado de las Voces Guardadas|Frascos tapados vibran sobre mostradores con etiquetas escritas a mano.
Desierto de las Estrellas Bajas|Puntos luminosos permanecen suspendidos sobre una extensión de arena oscura.
Casa de las Ventanas Lejanas|Las ventanas muestran paisajes distintos de lo que rodea la casa.
Camino de los Pasos Repetidos|Una misma marca de bota reaparece antes de cada curva.
Isla de la Marea Aérea|Una franja de agua flota sobre la playa y deja caer gotas lentas.
Biblioteca de las Letras Sueltas|Letras luminosas se desplazan sobre páginas aparentemente vacías.
Valle de la Nieve Tibia|Nieve tibia se acumula alrededor de plantas que siguen verdes.
Torre del Eco Adelantado|Un sonido parece surgir en la torre antes de repetirse cerca del acceso.
Jardín de los Frutos de Cristal|Frutos transparentes contienen pequeñas formas suspendidas dentro.
Cueva del Horizonte Interior|Un horizonte claro ocupa el fondo de una cueva de paredes cercanas.
Plaza de las Estatuas Migratorias|Bases vacías y marcas de arrastre rodean estatuas orientadas de forma distinta.
Río de las Hojas Inmóviles|Hojas suspendidas permanecen quietas mientras el agua corre por debajo.
Bosque del Cielo Bajo|Una capa de nubes atraviesa el bosque por debajo de sus ramas.
Puerta de los Colores Prestados|Los colores cercanos parecen concentrarse sobre una puerta de madera.
Pradera de las Campanas Invisibles|Las hierbas se inclinan alrededor de sonidos de campanas sin soporte visible.
Ruinas de los Muros Dibujados|Líneas sobre el suelo proyectan sombras semejantes a paredes enteras.
Santuario de las Llamas Frías|Llamas pálidas arden en cuencos cuyo exterior permanece cubierto de escarcha.
Estación de los Caminos Plegados|Mapas desplegados muestran rutas que coinciden con los pliegues del papel.
Mirador de las Lunas Pequeñas|Esferas luminosas recorren círculos lentos por debajo de la barandilla.`);
