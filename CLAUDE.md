# CLAUDE.md – little-games repó

## A fejlesztőről
Felső tagozatos általános iskolás lány, aki nagyon szereti az állatokat és a matematikát.
Kommunikáció: barátságos, életkori szintnek megfelelő, lelkesítő hangnem.
Minden elvégzett feladat után adj 2-3 rövid oktató érdekességet/tippet a felhasznált technológiáról
vagy a játékfejlesztésről.

---

## Repó áttekintés
Statikus böngészős mini-játékok gyűjteménye. Nincs build lépés, nincs package.json.
Minden játék önálló alkönyvtárban él az `src/` mappán belül.
Indítás: `./start.sh` (Python http.server, port 8765).

### Meglévő játékok
| Könyvtár              | Cím                        | Technológia              |
|-----------------------|----------------------------|--------------------------|
| src/parallax/         | Parallax Window            | Three.js, MediaPipe      |
| src/snake/            | Snake                      | HTML5 Canvas, Web Audio  |
| src/egri-csillagok/   | Egri Csillagok (1552)      | Three.js, Canvas         |
| src/snake42/          | Snake 42                   | HTML5 Canvas, Web Audio, AI |
| src/breakout/         | Breakout                   | HTML5 Canvas, Web Audio  |
| src/erdei-kaland/     | Erdei Kaland               | HTML5 Canvas             |
| src/szamolas-ut/      | Matekos Út                 | HTML5 Canvas, Web Audio  |
| src/repulo-madar/     | Repülő Madár               | HTML5 Canvas, Web Audio  |
| src/repulo-3d/        | Repülő Madár 3D            | Three.js, Web Audio      |
| src/szo-memoria/      | Szó-Memória                | DOM/CSS, Web Audio, Web Speech |

Landing page: `src/index.html` – kártya-rács, sötét téma, linkel az összes játékra.
Játék-adatok: `src/games.js` – kétnyelvű (hu/en) adatfájl, innen tölti be az index a kártyákat.
Nyelvváltó: 🇭🇺/🇬🇧 zászló gombok a fejlécben; választott nyelv `localStorage`-ban tárolódik; alapértelmezett: magyar.

### Agent skillek (`.claude/skills/`)
| Skill | Mire való |
|---|---|
| `game-design` | Új játékötlet vezetett tervezése kódolás előtt → `src/<játék>/DESIGN.md` |
| `playtest` | Játék futtatása headless böngészőben: képernyőképek + JS-hibák |
| `add-game` | Kész játék bekötése: games.js + CLAUDE.md táblázat + validátor |
| `hang-muhely` | Web Audio hangeffekt-receptek (kódból generált hangok) |

A playtest és add-game scriptekhez `uv` kell – telepítés: README „Fejlesztői eszközök".
Játékkód változtatása után futtasd a `playtest` skillt; új játék bekötésekor az `add-game`-et.

---

## Technológiai irányelvek

Ezek **erős ajánlások** – indokolt esetben el lehet térni tőlük, de az eltérést röviden indokold.

1. **Statikus fájlok** – semmi build lépés, semmi npm, semmi bundler. (Ez kötelező, nem ajánlás.)
2. **Játéklogika**: HTML5 Canvas és/vagy Three.js – ezeket már több játék használja, előnyben részesítendő.
3. **Adattárolás**: `localStorage` ajánlott (nincs backend).
4. **Hangeffektek**: Web Audio API, kódból generált hang – külső hangfájl kerülendő.
5. **Betűtípusok**: Google Fonts CDN ajánlott; egyéb külső font kerülendő.
6. **Külső könyvtárak**: CDN-ről töltve ajánlott (pl. Three.js, MediaPipe). Lokális vendor mappa nem szükséges.
7. Minden játék legyen **önálló `src/<játéknév>/index.html`** fájlban (kis fájlok esetén single-file megközelítés).
8. **Mobil támogatás – KÖTELEZŐ.** Minden játéknak futnia és jól játszhatónak kell lennie mobil böngészőben is:
   touch vezérlés (gombok / D-pad / swipe / joystick, a billentyűzet helyett vagy mellett), reszponzív
   elrendezés és méretezés (ne lógjon ki a képernyőről, ne kelljen vízszintesen scrollozni), és megfelelő
   `viewport` meta tag. Új játék létrehozásakor vagy meglévő módosításakor ezt mindig ellenőrizd.

**Új technológia behozható**, ha az adott játékhoz jobban illik – pl. SVG animáció, WebGL shader, stb.

---

## Új játék hozzáadásakor

0. **Tervezés először**: az ötletet a `game-design` skill-lel tervezzétek meg
   (`.claude/skills/game-design/`). Eredménye a `src/<játéknév>/DESIGN.md` játékterv.
   Kódolás csak kész terv után kezdődjön.
1. Hozz létre új alkönyvtárat: `src/<játéknév>/` (ha a tervezés során még nem jött létre)
2. Legalább egy `index.html` fájl szükséges benne.
3. **Frissítsd `src/games.js`-t**: add hozzá az új játékot a `GAMES` tömbhöz.
   - `id` – könyvtár neve (pl. `"matekos-kviz"`)
   - `emoji` – egyetlen ikon a kártya előnézetéhez
   - `thumb` – CSS `background` érték (gradient ajánlott, illeszkedjen a sötét témához)
   - `hu.title` / `hu.desc` – magyar cím és leírás
   - `en.title` / `en.desc` – angol cím és leírás
   - `tags` – technológiai tagek tömbje (pl. `["Canvas", "Web Audio"]`)
   - Az `src/index.html` **nem igényel módosítást** – automatikusan megjelenik a kártya.
4. **Frissítsd ezt a `CLAUDE.md` fájlt**: add hozzá az új játékot a „Meglévő játékok" táblázathoz (könyvtár, cím, technológia).
5. **Technológia-választás**: előnyben részesítsd azokat a technológiákat, amiket más játékok már használnak (Canvas, Three.js, Web Audio API). Új technológia behozható, ha indokolt – indokold röviden.

---

## Folyamatban lévő / visszatérő fejlesztés

### Játék azonosítása beszélgetés elején
Ha egy meglévő játékot folytatunk, az első üzenetből egyértelműen azonosítsd melyikről van szó:
- Kérdezz rá vagy mondd meg melyik alkönyvtárat (`src/<név>/`) érinti a munka.
- Csak az adott játék kódjára és kontextusára fókuszálj.

### DESIGN.md – a játék tervdokumentuma
Minden játékhoz tartozhat `src/<játék>/DESIGN.md` (a `game-design` skill hozza létre).

- **Mindig olvasd be** a játék DESIGN.md-jét a munka elején, ha létezik – ez a játék
  szándékainak forrása (játékmag, mechanikák, tanulási cél, tervezett nehezítések).
- **Tartsd karban**: frissítsd a DESIGN.md-t, ha
  - új mechanika, játékmód vagy pályatípus kerül a játékba,
  - változik a nehézségi görbe, a jutalmazás vagy a tanulási cél,
  - egy tervezett elem végül kimarad vagy másképp valósul meg,
  - játék közben új ötlet merül fel → jegyezd fel a „Továbbfejlesztési ötletek" részbe.
- Apró javítás (bugfix, stílus-finomítás) nem igényel DESIGN.md-frissítést.
- Frissítéskor írj egy sort a „Változásnapló" részbe (dátum + mi változott).

### Játékok közötti keveredés elkerülése
Ha éppen folyamatban van egy játék fejlesztése és a felhasználó egy MÁsik új játékot szeretne
készíteni, FIGYELMEZTESD barátságosan:
> "Hé! Most éppen a [játék neve] játékon dolgozunk. Ha új játékot szeretnél kezdeni, nyiss inkább
> egy új beszélgetést – így nem keverednek össze a dolgok! :)"

---

## Mentés / git commit

Ha a felhasználó kéri hogy "mentsd el" vagy "commitolj":
1. `git add` – csak az érintett játék fájljait (ne mindent vakra).
2. `git commit` – **rövid, tömör magyar nyelvű** üzenettel, conventional commits stílusban.
   Példák:
   - `feat(snake): time attack mód hozzáadva`
   - `fix(erdei-kaland): róka ütközés javítva`
   - `feat(src): új játék – matekos kvíz hozzáadva`
3. Ne push-olj automatikusan, hacsak a felhasználó külön nem kéri.

---

## Oktató tippek stílusa

Minden elvégzett feladat végén adj 2-3 rövid tippet/érdekességet, pl.:
- Mire való az épp használt technológia (Canvas, Web Audio, localStorage…)
- Miért jó ez a megközelítés játékfejlesztésben
- Kapcsolódás matematikához (koordináták, vektorok, valószínűség) vagy állatokhoz ha van
- Legyen rövid, emojis, barátságos – felső tagozatos szintű

---

## Stílus-összefoglaló (meglévő játékok alapján)
- Sötét színvilág (neon akcentek jellemzők: zöld, lila, cián)
- Magyar nyelvű szövegek a játékokban (ha nem más nyelvű a téma)
- Mobile-friendly: touch kontrollok (joystick / gombok) ahol releváns
- Google Fonts használata (Press Start 2P, vagy más tematikus font)
- Web Audio API: procedurális hangok (oszcillátor, gain, filter) – mindig kódból generálva
