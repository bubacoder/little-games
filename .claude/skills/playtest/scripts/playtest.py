#!/usr/bin/env python3
"""Játékteszt-futtató a little-games repóhoz.

Headless Chromiummal megnyit egy játékot, elindítja (kattintás + indító billentyű),
billentyűket nyomogat, képernyőképeket készít és összegyűjti a konzolhibákat.

Futtatás (a repó gyökeréből, minden platformon ugyanígy):
    uv run --with playwright .claude/skills/playtest/scripts/playtest.py --game breakout

Előfeltétel (egyszeri, lásd README "Fejlesztői eszközök"):
    uv run --with playwright playwright install chromium
"""

import argparse
import socket
import subprocess
import sys
import tempfile
import time
from pathlib import Path

REPO = Path(__file__).resolve().parents[4]
SRC = REPO / "src"

# Windows konzol (pl. cp1250) nem tudja megjeleníteni az emoji jeleket – UTF-8-ra váltunk,
# hogy a kimenet ne szálljon el UnicodeEncodeError-ral.
for _stream in (sys.stdout, sys.stderr):
    if hasattr(_stream, "reconfigure"):
        _stream.reconfigure(encoding="utf-8", errors="replace")


def port_open(port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(0.3)
        return s.connect_ex(("127.0.0.1", port)) == 0


def main() -> int:
    ap = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
    ap.add_argument("--game", help="játék könyvtárneve a src/ alatt (pl. breakout)")
    ap.add_argument("--url", help="teljes URL a --game helyett")
    ap.add_argument("--port", type=int, default=8765)
    ap.add_argument("--duration", type=float, default=10,
                    help="játékidő másodpercben (alap: 10)")
    ap.add_argument("--keys", default="",
                    help='körben nyomogatott billentyűk, pl. "ArrowLeft ArrowRight Space"')
    ap.add_argument("--interval", type=int, default=250,
                    help="billentyűnyomások köze ms-ban (alap: 250)")
    ap.add_argument("--shots", type=int, default=4,
                    help="képernyőképek száma játék közben (alap: 4)")
    ap.add_argument("--start-keys", default="Space",
                    help="indító billentyű(k) a kezdő kattintás után (üres = nincs)")
    ap.add_argument("--viewport", default="1280x720")
    ap.add_argument("--out", help="kimeneti mappa (alap: <temp>/playtest-<game>)")
    args = ap.parse_args()

    if not args.game and not args.url:
        ap.error("adj meg --game vagy --url értéket")

    name = args.game or "custom"
    url = args.url or f"http://localhost:{args.port}/{args.game}/"
    out = Path(args.out) if args.out else Path(tempfile.gettempdir()) / f"playtest-{name}"
    out.mkdir(parents=True, exist_ok=True)
    w, h = (int(x) for x in args.viewport.lower().split("x"))

    server = None
    if f"localhost:{args.port}" in url and not port_open(args.port):
        server = subprocess.Popen(
            [sys.executable, "-m", "http.server", str(args.port),
             "--bind", "127.0.0.1", "-d", str(SRC)],
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
        )
        for _ in range(40):
            if port_open(args.port):
                break
            time.sleep(0.25)
        else:
            print("HIBA: nem indult el a helyi szerver")
            return 1

    console, page_errors, shots = [], [], []
    try:
        from playwright.sync_api import sync_playwright

        with sync_playwright() as p:
            try:
                browser = p.chromium.launch(headless=True)
            except Exception as e:
                if "Executable doesn't exist" not in str(e):
                    raise
                print(
                    "HIBA: a Playwright Chromium még nincs telepítve.\n"
                    "Egyszeri telepítés (a repó gyökeréből):\n"
                    "    uv run --with playwright playwright install chromium"
                )
                return 1
            page = browser.new_page(viewport={"width": w, "height": h})
            page.on("console", lambda m: console.append((m.type, m.text))
                    if m.type in ("error", "warning") and "favicon" not in m.text else None)
            page.on("pageerror", lambda e: page_errors.append(str(e)))

            page.goto(url)
            page.wait_for_load_state("networkidle")
            page.wait_for_timeout(500)

            def shot(label: str) -> None:
                path = out / f"{len(shots):02d}-{label}.png"
                page.screenshot(path=str(path))
                shots.append(path)

            shot("betoltes")

            page.mouse.click(w // 2, h // 2)
            for k in args.start_keys.split():
                page.keyboard.press(k)
            page.wait_for_timeout(400)
            shot("inditas")

            keys = args.keys.split()
            steps = max(1, int(args.duration * 1000 / args.interval))
            shot_at = {round(i * steps / (args.shots + 1))
                       for i in range(1, args.shots + 1)} if args.shots else set()
            for i in range(steps):
                if keys:
                    page.keyboard.press(keys[i % len(keys)])
                page.wait_for_timeout(args.interval)
                if i in shot_at:
                    shot("jatek")

            shot("vege")
            browser.close()
    finally:
        if server:
            server.terminate()

    print(f"\n=== Játékteszt kész: {url} ===")
    print(f"Képernyőképek ({len(shots)} db):")
    for s_ in shots:
        print(f"  {s_}")

    errs = [t for _, t in console if _ == "error"]
    warns = [t for _, t in console if _ == "warning"]
    if page_errors:
        print(f"\n❌ JavaScript hibák ({len(page_errors)}):")
        for e in dict.fromkeys(page_errors):
            print(f"  {e}")
    if errs:
        print(f"\n❌ Konzol hibák ({len(errs)}):")
        for t in dict.fromkeys(errs):
            print(f"  {t}")
    if warns:
        print(f"\n⚠️ Konzol figyelmeztetések ({len(warns)}):")
        for t in dict.fromkeys(warns):
            print(f"  {t}")
    if not page_errors and not errs:
        print("\n✅ Nincs JavaScript-hiba.")

    return 1 if (page_errors or errs) else 0


if __name__ == "__main__":
    sys.exit(main())
