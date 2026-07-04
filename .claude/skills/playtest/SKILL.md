---
name: playtest
description: Játék kipróbálása headless böngészőben (Playwright + Chromium). Használd, amikor ellenőrizni kell, hogy egy játék tényleg működik-e – új funkció/javítás után, hiba keresésekor, vagy ha a felhasználó kéri („teszteld", „nézd meg, működik-e", „próbáld ki a játékot"). Elindítja a helyi szervert, billentyűket nyomogat, képernyőképeket készít és összegyűjti a JavaScript-hibákat. Kódváltozás után ezzel győződj meg róla, hogy a játék valóban fut.
---

# Playtest – játékteszt headless böngészőben

Előfeltétel: `uv` + egyszeri Chromium-letöltés (lásd README „Fejlesztői eszközök").
Minden platformon (Windows/Linux/macOS) ugyanúgy működik.

## Futtatás

A repó gyökeréből:

```bash
uv run --with playwright .claude/skills/playtest/scripts/playtest.py --game <játék-id> [opciók]
```

Részletes opciók: futtasd `--help`-pel. A leggyakoribbak:

- `--keys "ArrowLeft ArrowRight"` – körben nyomogatott billentyűk játék közben
- `--start-keys "Space"` – indító billentyű a kezdő kattintás után (alap: Space)
- `--duration 10` – játékidő másodpercben
- `--shots 4` – képernyőképek száma játék közben
- `--viewport 480x800` – mobil-szerű nézethez

A script automatikusan elindítja a helyi szervert a 8765-ös porton, ha még nem fut,
és a végén leállítja. A képernyőképek a temp mappába kerülnek (kiírja az útvonalakat).

## Tipikus billentyűk játéktípusonként

| Játéktípus | Javasolt `--keys` |
|---|---|
| ütő/mozgás balra-jobbra (breakout) | `"ArrowLeft ArrowLeft ArrowRight ArrowRight"` |
| flappy-szerű (repulo-madar) | `"Space"` |
| négyirányú mozgás (snake, erdei-kaland) | `"ArrowUp ArrowRight ArrowDown ArrowLeft"` |
| válaszadós/kvíz | kattintás kell – lásd lentebb |

## Munkafolyamat

1. Futtasd a scriptet a játékhoz illő billentyűkkel.
2. **Nézd meg a képernyőképeket a Read tool-lal** – ez a lényeg! Ellenőrizd:
   - betöltött-e a játék (00-betoltes),
   - elindult-e (01-inditas – nem ragadt-e a kezdőképernyőn),
   - történik-e valami a játék közbeni képeken (mozgás, pontszám változás),
   - nincs-e vizuális hiba (üres canvas, egymásra csúszott elemek, hiányzó szöveg).
3. Ellenőrizd a kimenetben a JavaScript-hibákat (a script exit kódja 1, ha volt hiba).
4. Ha a játéknak van `DESIGN.md`-je, vesd össze a látottakat a tervvel
   (első 30 másodperc, visszajelzés, cél érthetősége).
5. Számolj be barátságosan: mi működik, mi tört el, mit érdemes javítani.

## Korlátok és tippek

- A script kezdésként a képernyő közepére kattint, majd megnyomja a `--start-keys`-t –
  a legtöbb játék így elindul. Ha a játéknak menüje van, több kattintás kell:
  írj egyedi Playwright-scriptet a `playtest.py` mintájára (sync_playwright,
  headless chromium, `page.mouse.click(x, y)`).
- Hangot nem lehet headless módban megítélni – a hangokért lásd a `hang-muhely` skillt.
- Az egérrel irányított játékokhoz használj `page.mouse.move()`-os egyedi scriptet.
- A pontos játékérzést (nehézség, tempó) képernyőképekből csak becsülni lehet –
  a végső szót mindig az ember kimondja, aki tényleg játszik vele. 🎮
