---
name: game-design
description: Vezetett játéktervezési beszélgetés a little-games repóhoz. Használd MIELŐTT kód készülne, amikor a felhasználó új játékot szeretne kitalálni, játékötleteken gondolkodik, vagy egy ötletet szeretne értékelni/finomítani (pl. „találjunk ki egy játékot", „új játékötlet", „milyen játékot csináljunk?", „jó ötlet ez a játék?"). Eredmény: kitöltött játékterv a src/<játéknév>/DESIGN.md fájlban. A skill nem ír játékkódot.
---

# Játéktervezés (game-design)

Cél: közösen kitalálni és letisztázni egy játékötletet, mielőtt egy sor kód készülne.
Ez a skill NEM ír kódot és NEM hoz létre `index.html`-t — az implementáció külön lépés,
a CLAUDE.md „Új játék hozzáadásakor" folyamata szerint.

## Hangnem

- Magyarul, barátságosan, bátorítóan, felső tagozatos szinten.
- Egyszerre legfeljebb 1-2 kérdést tegyél fel — beszélgetés legyen, ne kérdőív.
- A gyerek ötletét soha ne írd felül: kérdezz, javasolj, közösen finomítsatok.
- Használd az AI-t kritikusként is: nevezd meg kedvesen, mi lehet unalmas, túl bonyolult
  vagy frusztráló az ötletben — mindig javaslattal együtt.

## Háttéranyagok

- [references/design-principles.md](references/design-principles.md) — mitől jó egy játék:
  mechanikák, kihívás, tanulás, jutalmazás, design. Olvasd be, amikor mechanikát, nehézséget
  vagy jutalmazást terveztek, vagy amikor értékelned kell egy ötletet.
- [references/examples.md](references/examples.md) — három kidolgozott mintapélda és
  ötletindító kérdések. Olvasd be, ha még nincs ötlet, vagy inspiráció kell.

## Folyamat

### 1. Ötletmag

Ha még nincs ötlet, indíts a négy ötletforrás egyikéből:

- **érdekes cselekvés**: elkapni, dobni, egyensúlyozni, rakosgatni
- **érdekes szabály**: csak három lépés van, minden kattintásnak ára van, a szín váltja a fizikát
- **érdekes téma**: állatok, űr, kertészkedés, varázslat, matek, zene
- **tanulási cél**: logika, becslés, mintafelismerés, szókincs, tervezés

Tágítsd „Mi lenne, ha…?" kérdésekkel (pl. „Mi lenne, ha a gravitáció néha megfordulna?").
Az erős ötlet kicsi, tiszta, és egy mondatban elmondható.

### 2. Játékmag egy mondatban

Fogalmazzátok meg egy mondatban, mit csinál a játékos újra meg újra.
Pl.: „A játékos pattogó labdaként gyűjti a csillagokat, miközben kerüli a tüskéket."
Ha nem fér el egy mondatban, egyszerűsítsetek. A mag köré három dolog kell:
**cél** (mit akar elérni egy körben), **akadály** (mi nehezíti), **eszköz** (mivel oldja meg).

### 3. Sablon kitöltése

Töltsétek ki közösen, kérdésenként haladva:

| Elem | Kérdés |
|---|---|
| Cím | Mi a játék neve? |
| Játékmag | Mit csinál a játékos újra és újra? |
| Cél | Hogyan lehet nyerni vagy fejlődni? |
| Akadály | Mi nehezíti a játékos dolgát? |
| Fő mechanika | Mi a legfontosabb szabály vagy interakció? |
| Kiegészítő mechanika | Mi teszi változatosabbá? (legfeljebb 1-2) |
| Tanulási cél | Mit tanul vagy gyakorol közben a játékos? |
| Hangulat | Milyen érzést adjon? (pörgős, vicces, okos, nyugtató, felfedezős) |
| Visszajelzés | Honnan tudja a játékos, hogy jól halad? |
| Jutalom | Miért akarja újra játszani? |
| Nehezítés | Hogyan lesz fokozatosan összetettebb? |

Ezen felül találjatok ki:

- **3 egyszerű pályát/helyzetet**, amelyek fokozatosan tanítanak (pályánként csak egy új ötlet),
- **3 nehezítést vagy csavart** későbbre.

### 4. Ellenőrzőlista

Menj végig a listán; ami elbukik, azt közösen javítsátok, mielőtt továbblépnétek:

- Egy mondatban elmondható, mi a játék lényege.
- Az első 30 másodpercben történik valami érdekes.
- A fő mechanika önmagában is szórakoztató.
- A hibából lehet tanulni (a kudarc informatív, nem büntető).
- A nehézség fokozatosan nő.
- A játékos világos visszajelzést kap.
- Van oka újraindítani a következő kört.
- A tanulási cél a játékmenet része, nem ráfestett dísz.
- Nincs benne túl sok szabály elsőre.
- A design segíti a megértést.

### 5. Technológia-illesztés

A CLAUDE.md irányelvei szerint javasolj technológiát (HTML5 Canvas / Three.js / Web Audio API,
statikus fájlok, nincs build). Csak jelezd, melyik illik és miért — ne kezdj kódolni.

### 6. DESIGN.md mentése

Hozd létre a `src/<játéknév>/` könyvtárat, és mentsd bele **csak** a `DESIGN.md`-t
(más fájlt ne — a scaffold nem ennek a skillnek a dolga). Szerkezet:

```markdown
# <Cím> – játékterv

## Játékmag
<egy mondat>

## Terv
<kitöltött sablon-táblázat>

## Első 30 másodperc
<mit lát, mit csinál, milyen sikerélményt kap a játékos>

## Pályák / helyzetek
<3 fokozatosan tanító pálya>

## Nehezítések / csavarok
<3 későbbi nehezítés>

## Technológia
<választott technológia + rövid indoklás>

## Továbbfejlesztési ötletek
<ami most kimaradt, de jó lenne később>

## Változásnapló
- <ÉÉÉÉ-HH-NN>: első terv elkészült
```

Végül foglald össze a tervet a beszélgetésben, és a CLAUDE.md szerint adj 2-3 oktató tippet.
