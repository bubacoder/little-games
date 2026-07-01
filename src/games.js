/**
 * games.js – játékok adatai
 *
 * ÚJ JÁTÉK HOZZÁADÁSA:
 *   1. Másold le az alábbi objektum-sablont
 *   2. Töltsd ki: id, emoji, thumb (CSS gradient), hu + en mezők, tags
 *   3. Mentsd el – az index.html automatikusan megjelenik
 *   4. Frissítsd a CLAUDE.md „Meglévő játékok" táblázatát is
 *
 * Mezők:
 *   id       – könyvtár neve (src/<id>/)
 *   emoji    – kártya előnézeti ikon
 *   thumb    – CSS background (gradient) a kártya fejlécéhez
 *   hu.title – Magyar cím
 *   hu.desc  – Magyar leírás
 *   en.title – English title
 *   en.desc  – English description
 *   tags     – technológiai tagek (nyelv-független)
 */

const GAMES = [
  {
    id: "parallax",
    emoji: "🪟",
    thumb: "linear-gradient(135deg, #0a0a14 0%, #1a1040 50%, #0a1428 100%)",
    hu: {
      title: "Parallax Window",
      desc: "A webkamera követi a fejed, és valós időben mozgatja a 3D jelenetet – mintha egy ablakból néznél be egy másik világba.",
    },
    en: {
      title: "Parallax Window",
      desc: "Webcam tracks your head and shifts the 3D scene in real time — like looking through a window into another world.",
    },
    tags: ["Three.js", "MediaPipe", "Head tracking"],
  },
  {
    id: "snake",
    emoji: "🐍",
    thumb: "linear-gradient(135deg, #0a1a0a 0%, #0d3020 50%, #0a1a0a 100%)",
    hu: {
      title: "Snake",
      desc: "Klasszikus kígyós játék. Egyél, növekedj, ne ütközz magadba! Irányítás: nyilak vagy WASD.",
    },
    en: {
      title: "Snake",
      desc: "Classic Snake. Eat, grow, don't hit yourself. Arrow keys or WASD to move.",
    },
    tags: ["Canvas", "Keyboard", "Classic"],
  },
  {
    id: "egri-csillagok",
    emoji: "⚔️",
    thumb: "linear-gradient(135deg, #14091a 0%, #2a1020 50%, #3d0a14 100%)",
    hu: {
      title: "Egri Csillagok",
      desc: "Védd meg Eger várát az 1552-es oszmán ostrom ellen! Történelmi akciójáték Gárdonyi Géza regénye alapján.",
    },
    en: {
      title: "Stars of Eger",
      desc: "Defend Eger Castle against the Ottoman siege of 1552. A story-driven action game inspired by the Hungarian classic.",
    },
    tags: ["Canvas", "Historical", "Three.js"],
  },
  {
    id: "snake42",
    emoji: "🐍🐍",
    thumb: "linear-gradient(135deg, #002218 0%, #0a0a1a 50%, #1a0022 100%)",
    hu: {
      title: "Snake 42",
      desc: "Felturbózott kígyós játék! Küzdj meg a MI-vel (3 nehézségi szint, BFS algoritmus) vagy egy barátod ellen – egy billentyűzeten, két kígyóval.",
    },
    en: {
      title: "Snake 42",
      desc: "Snake, supercharged! Play vs AI (3 difficulty levels, BFS pathfinding) or challenge a friend on the same keyboard — two snakes, one board.",
    },
    tags: ["Canvas", "Web Audio", "AI", "2-Player"],
  },
  {
    id: "breakout",
    emoji: "🧱",
    thumb: "linear-gradient(135deg, #000814 0%, #001a2e 50%, #000a1a 100%)",
    hu: {
      title: "Breakout",
      desc: "Törd szét az összes téglát! Klasszikus Breakout több pályával, neon részecske-effektekkel és pontrekord-követéssel.",
    },
    en: {
      title: "Breakout",
      desc: "Smash all the bricks! Classic Breakout with multiple levels, neon particle effects, and high score tracking.",
    },
    tags: ["Canvas", "Web Audio", "Classic"],
  },
  {
    id: "szamolas-ut",
    emoji: "🧮",
    thumb: "linear-gradient(135deg, #080818 0%, #0a1a2e 40%, #1a0a2e 100%)",
    hu: {
      title: "Matekos Út",
      desc: "Vezess egy téglalapot az úton! Gyűjts matekos jeleket (+, -, ×, ÷) hogy változtasd a szélességed – szűk részen légy keskeny, lyuknál légy széles!",
    },
    en: {
      title: "Math Road",
      desc: "Drive a rectangle down the road! Collect math signs (+, -, ×, ÷) to change your width — squeeze through narrow gaps, bridge over holes!",
    },
    tags: ["Canvas", "Web Audio", "Math"],
  },
  {
    id: "repulo-3d",
    emoji: "🐦",
    thumb: "linear-gradient(160deg, #1a4a7a 0%, #2a7a3a 55%, #1a3a1a 100%)",
    hu: {
      title: "Repülő Madár 3D",
      desc: "Repülj egy 3D erdőn át madárként! Valódi fényhatások, árnyékok és élethű fenyőfák. Kerüld el a fákat balra-jobbra!",
    },
    en: {
      title: "Flying Bird 3D",
      desc: "Fly through a 3D forest as a bird! Real lighting, shadows and lifelike pine trees. Dodge the trees left and right!",
    },
    tags: ["Three.js", "3D", "Web Audio", "Dodge"],
  },
  {
    id: "repulo-madar",
    emoji: "🐦",
    thumb: "linear-gradient(135deg, #060e06 0%, #0a2010 50%, #061406 100%)",
    hu: {
      title: "Repülő Madár",
      desc: "Madárként repülsz felfelé, és fák jönnek szembe! Nyomj balra/jobbra, hogy kitérj előlük. Minél messzebb jutsz, annál gyorsabb lesz!",
    },
    en: {
      title: "Flying Bird",
      desc: "You fly upward as a bird while trees rush toward you! Press left/right to dodge them. The further you go, the faster it gets!",
    },
    tags: ["Canvas", "Web Audio", "Dodge"],
  },
  {
    id: "erdei-kaland",
    emoji: "🌲",
    thumb: "linear-gradient(135deg, #1d3322 0%, #3e7a44 50%, #1d3322 100%)",
    hu: {
      title: "Erdei Kaland",
      desc: "Fedezd fel az erdőt és találkozz lakóival! Természetes témájú oktató kalandjáték minden korosztálynak.",
    },
    en: {
      title: "Forest Adventure",
      desc: "Explore the forest and discover its inhabitants. A nature-themed educational adventure for all ages.",
    },
    tags: ["Canvas", "Nature", "Educational"],
  },
];
