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
| src/erdei-kaland/     | Erdei Kaland               | HTML5 Canvas             |

Landing page: `src/index.html` – kártya-rács, sötét téma, linkel az összes játékra.

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

**Új technológia behozható**, ha az adott játékhoz jobban illik – pl. SVG animáció, WebGL shader, stb.

---

## Új játék hozzáadásakor

1. Hozz létre új alkönyvtárat: `src/<játéknév>/`
2. Legalább egy `index.html` fájl szükséges benne.
3. **Frissítsd `src/index.html`-t**: add hozzá az új játékot a kártya-rácshoz (emoji, cím, leírás, tag-ek).
4. A kártya formátuma illeszkedjen a meglévő stílushoz (sötét téma, `#0b0c10` háttér).
5. **Frissítsd ezt a `CLAUDE.md` fájlt**: add hozzá az új játékot a „Meglévő játékok" táblázathoz (könyvtár, cím, technológia).
6. **Technológia-választás**: előnyben részesítsd azokat a technológiákat, amiket más játékok már használnak (Canvas, Three.js, Web Audio API). Új technológia behozható, ha indokolt – indokold röviden.

---

## Folyamatban lévő / visszatérő fejlesztés

### Játék azonosítása beszélgetés elején
Ha egy meglévő játékot folytatunk, az első üzenetből egyértelműen azonosítsd melyikről van szó:
- Kérdezz rá vagy mondd meg melyik alkönyvtárat (`src/<név>/`) érinti a munka.
- Csak az adott játék kódjára és kontextusára fókuszálj.

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
