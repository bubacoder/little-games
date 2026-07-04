---
name: add-game
description: Kész játék felvétele a little-games gyűjteménybe és a repó konzisztenciájának ellenőrzése. Használd, amikor egy új játék elkészült és be kell kötni (games.js bejegyzés, CLAUDE.md táblázat), vagy amikor ellenőrizni kell, hogy minden játék rendben szerepel-e mindenhol („vedd fel a játékot", „add hozzá a listához", „ellenőrizd a games.js-t").
---

# Add-game – játék felvétele a gyűjteménybe

## Lépések

### 1. games.js bejegyzés

Add hozzá az új játékot a `src/games.js` `GAMES` tömbjéhez. Sablon:

```js
{
  id: "jatek-id",            // pontosan a src/<id>/ könyvtár neve
  emoji: "🎯",               // egyetlen emoji a kártyához
  thumb: "linear-gradient(135deg, #0a0a14 0%, #1a1040 50%, #0a1428 100%)",
  hu: {
    title: "Magyar cím",
    desc: "1-2 mondatos magyar leírás – mit csinál a játékos, mitől izgalmas.",
  },
  en: {
    title: "English title",
    desc: "1-2 sentence English description.",
  },
  tags: ["Canvas", "Web Audio"],   // használt technológiák
},
```

Szabályok:

- A `thumb` sötét témájú gradient legyen, illeszkedjen a játék színvilágához
  (nézd meg a játék fő színeit, és abból építs 135deg-es gradientet).
- A hu és en szöveg tartalmilag egyezzen, ne gépi tükörfordítás legyen.
- A `tags` a repóban bevett neveket használja: `Canvas`, `Three.js`, `Web Audio`, stb.

### 2. CLAUDE.md táblázat

Vedd fel az új sort a CLAUDE.md „Meglévő játékok" táblázatába
(könyvtár, cím, technológia).

### 3. DESIGN.md

Ellenőrizd, hogy van-e `src/<id>/DESIGN.md`. Ha van, frissítsd a Változásnaplóját
(„játék elkészült és felvéve a gyűjteménybe"). Ha nincs, jelezd a felhasználónak –
nem kötelező visszamenőleg, de új játéknál a `game-design` skill-lel készülnie kellett.

### 4. Ellenőrzés

Futtasd a validátort a repó gyökeréből (előfeltétel: `uv`, lásd README):

```bash
uv run --with json5 .claude/skills/add-game/scripts/validate_games.py
```

Ellenőrzi a kötelező mezőket, a duplikált id-kat, a könyvtárak meglétét,
a games.js-ből kimaradt könyvtárakat és a CLAUDE.md táblázatot.
Minden ❌ hibát javíts ki; a ⚠️ figyelmeztetéseket mérlegeld.

### 5. Vizuális ellenőrzés (ajánlott)

A `playtest` skill-lel nézd meg a landing page-et, hogy az új kártya megjelenik-e:

```bash
uv run --with playwright .claude/skills/playtest/scripts/playtest.py --url http://localhost:8765/ --duration 2 --shots 0 --start-keys ""
```

Olvasd be a képernyőképet, és ellenőrizd az új kártyát: emoji, cím, gradient.
