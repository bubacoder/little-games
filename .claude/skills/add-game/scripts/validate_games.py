#!/usr/bin/env python3
"""games.js és a játék-könyvtárak konzisztencia-ellenőrzése.

Ellenőrzi: kötelező mezők (id, emoji, thumb, hu/en title+desc, tags),
duplikált id-k, létező src/<id>/ könyvtárak, index.html megléte,
games.js-ből kimaradt könyvtárak, CLAUDE.md táblázat sorai.

Futtatás (a repó gyökeréből, minden platformon ugyanígy):
    uv run --with json5 .claude/skills/add-game/scripts/validate_games.py
"""

import re
import sys
from pathlib import Path

import json5

REPO = Path(__file__).resolve().parents[4]
SRC = REPO / "src"


def main() -> int:
    text = (SRC / "games.js").read_text(encoding="utf-8")
    m = re.search(r"const\s+GAMES\s*=\s*(\[.*\])\s*;", text, re.S)
    if not m:
        print("❌ Nem található a `const GAMES = [...];` tömb a src/games.js-ben")
        return 1
    try:
        games = json5.loads(m.group(1))
    except Exception as e:
        print(f"❌ A GAMES tömb nem értelmezhető: {e}")
        return 1

    errors, warns = [], []
    seen = set()

    for g in games:
        gid = g.get("id", "<id nélkül>")
        for field in ("id", "emoji", "thumb"):
            if not g.get(field):
                errors.append(f"{gid}: hiányzó mező: {field}")
        for lang in ("hu", "en"):
            for field in ("title", "desc"):
                if not g.get(lang, {}).get(field):
                    errors.append(f"{gid}: hiányzó mező: {lang}.{field}")
        if not g.get("tags"):
            warns.append(f"{gid}: nincs egyetlen tag sem")
        if gid in seen:
            errors.append(f"{gid}: duplikált id")
        seen.add(gid)

        gdir = SRC / gid
        if not gdir.is_dir():
            errors.append(f"{gid}: nem létezik a src/{gid}/ könyvtár")
        elif not (gdir / "index.html").exists():
            warns.append(f"{gid}: nincs index.html (még csak terv?)")

    for d in sorted(SRC.iterdir()):
        if d.is_dir() and d.name not in seen:
            warns.append(f"src/{d.name}/ létezik, de nincs a games.js-ben")

    claude_md = REPO / "CLAUDE.md"
    if claude_md.exists():
        claude = claude_md.read_text(encoding="utf-8")
        for gid in sorted(seen):
            if f"src/{gid}/" not in claude:
                warns.append(f'{gid}: hiányzik a CLAUDE.md „Meglévő játékok" táblázatából')

    print(f"games.js: {len(games)} játék ellenőrizve.")
    for e in errors:
        print(f"❌ {e}")
    for w_ in warns:
        print(f"⚠️ {w_}")
    if not errors and not warns:
        print("✅ Minden rendben!")
    elif not errors:
        print("✅ Nincs hiba (csak figyelmeztetések).")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
