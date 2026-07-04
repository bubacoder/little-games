# little-games

Statikus böngészős mini-játékok gyűjteménye. Nincs build lépés, nincs npm, nincs bundler.

## Indítás

```bash
./start.sh
```

Megnyitja a böngészőt a `http://localhost:8765` címen. Opcionálisan megadható port:

```bash
./start.sh 9000
```

Windows rendszeren: `start.cmd`

## Struktúra

```
src/
  index.html      # landing page – kártyarács, sötét téma
  games.js        # játék-adatok (kétnyelvű: hu/en)
  <játéknév>/
    index.html    # az adott játék (önálló fájl)
```

## Új játék hozzáadása

1. Hozz létre `src/<játéknév>/index.html` fájlt.
2. Add hozzá a játékot a `src/games.js` `GAMES` tömbjéhez.
3. A landing page automatikusan megjelenik – `src/index.html` módosítása nem szükséges.

## Fejlesztői eszközök (opcionális)

A játékok futtatásához csak Python kell (`start.sh` / `start.cmd`). A `.claude/skills/`
alatti fejlesztő-segédeszközökhöz (automata játékteszt, `games.js`-ellenőrzés) ennyi kell:

1. **uv telepítése** (Python-eszköz futtató, minden platformon):
   - Windows: `winget install astral-sh.uv`
   - macOS/Linux: `brew install uv` vagy `curl -LsSf https://astral.sh/uv/install.sh | sh`
2. **Chromium letöltése** a játékteszthez (egyszeri, ~150 MB):
   ```bash
   uv run --with playwright playwright install chromium
   ```

Használat (a repó gyökeréből, minden platformon ugyanígy):

```bash
# Játék automata tesztje: képernyőképek + JavaScript-hibák
uv run --with playwright .claude/skills/playtest/scripts/playtest.py --game breakout --keys "ArrowLeft ArrowRight"

# games.js és a játékkönyvtárak konzisztencia-ellenőrzése
uv run --with json5 .claude/skills/add-game/scripts/validate_games.py
```

A Python-függőségeket (playwright, json5) az `uv run --with` automatikusan kezeli,
telepíteni nem kell őket.

## Technológia

- HTML5 Canvas, Three.js, Web Audio API
- Külső könyvtárak CDN-ről (nincs lokális vendor mappa)
- Hangeffektek: Web Audio API, kódból generálva
- Betűtípusok: Google Fonts CDN
- Adattárolás: `localStorage`
- Nyelv: magyar/angol váltó (alapértelmezett: magyar)
