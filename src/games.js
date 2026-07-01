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
