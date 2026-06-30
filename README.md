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

## Technológia

- HTML5 Canvas, Three.js, Web Audio API
- Külső könyvtárak CDN-ről (nincs lokális vendor mappa)
- Hangeffektek: Web Audio API, kódból generálva
- Betűtípusok: Google Fonts CDN
- Adattárolás: `localStorage`
- Nyelv: magyar/angol váltó (alapértelmezett: magyar)
