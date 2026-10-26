"""Kürt Kaland: core-, demó-, mobil- és valódi getUserMedia-lánc teszt.

Futtatás a repó gyökeréből:
  uv run --with playwright src/kurt-kaland/tests/playtest.py
A mesterséges mikrofon WAV-fájlja csak az ideiglenes mappában készül el.
"""
from array import array
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
import importlib.util
import math
import sys
import tempfile
import wave

from playwright.sync_api import sync_playwright

# Ne kerüljön generált Python-bytecode a statikusan kiszolgált játék mellé.
sys.dont_write_bytecode = True

ROOT = Path(__file__).resolve().parents[3]
OUT = Path(tempfile.gettempdir()) / "opencode" / "kurt-tests"
OUT.mkdir(parents=True, exist_ok=True)
for output in (sys.stdout, sys.stderr):
    if hasattr(output, "reconfigure"):
        output.reconfigure(encoding="utf-8", errors="replace")


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


def make_audio(path):
    rate = 48000
    hz = 233.0819
    # Domináns második felhang: ne a legerősebb FFT-csúcsot fogadjuk el!
    samples = array("h")
    # A beméréshez lassabb CI-gépen is maradjon elég stabil mérőablak.
    for i in range(int(rate * 3.5)):
        t = i / rate
        envelope = min(1, t / .03, max(0, (2.8 - t) / .03)) if t < 2.8 else 0
        phase = math.tau * hz * t
        value = .24 * envelope * (.35 * math.sin(phase) + .8 * math.sin(2*phase) + .25 * math.sin(3*phase))
        samples.append(int(value * 32767))
    if sys.byteorder != "little":
        samples.byteswap()
    with wave.open(str(path), "wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(rate)
        for _ in range(80):
            wav.writeframes(samples.tobytes())


def main():
    handler = partial(QuietHandler, directory=str(ROOT / "src"))
    server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
    Thread(target=server.serve_forever, daemon=True).start()
    origin = f"http://localhost:{server.server_port}"
    url = origin + "/kurt-kaland/?test=1"
    errors = []
    checks = []

    def check(condition, label):
        if not condition:
            raise AssertionError(label)
        checks.append(label)
        print("PASS:", label)

    def watch(page):
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.on("console", lambda m: errors.append(m.text) if m.type == "error" and not any(part in m.location.get("url", "") for part in ("favicon", "fonts.googleapis", "fonts.gstatic")) else None)

    try:
        audio_path = OUT / "synthetic-horn.wav"
        make_audio(audio_path)
        with sync_playwright() as p:
            # A teljes Chromium új headless módja támogatja a mikrofont;
            # a külön headless-shell Windows alatt NotSupportedError-t adhat.
            browser = p.chromium.launch(headless=True, channel="chromium", args=["--use-fake-device-for-media-stream", f"--use-file-for-fake-audio-capture={audio_path}"])
            spec = importlib.util.spec_from_file_location("layout_checks", Path(__file__).with_name("layout-checks.py"))
            layouts = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(layouts)
            layouts.run_wait_settings_checks(browser, url, OUT, check, watch)
            layouts.run_preference_checks(browser, url, check, watch)
            layouts.run_layout_checks(browser, url, OUT, check, watch)
            context = browser.new_context(viewport={"width": 1280, "height": 1000})
            page = context.new_page()
            watch(page)
            page.goto(url)
            page.wait_for_function("!!window.kurtTest")
            result = page.evaluate("async () => (await import('./tests/core-tests.js')).runCoreTests()")
            check(result["result"] == "PASS", f"Core: {result['assertions']} assertions")
            page.screenshot(path=str(OUT / "desktop-welcome.png"), full_page=True)

            # Szimulált óra: a teljes kör valós DOM-bemenettel, belső sikerinjektálás nélkül.
            page.clock.install()
            page.locator("#settings-toggle").click()
            page.locator("#speed").select_option("1.5")
            page.locator("#rest").select_option("3")
            page.locator("#length").select_option("6")
            page.locator("#note-count").select_option("3")
            page.locator("#settings-close").click()
            page.locator("#demo-start").click()
            check(page.locator("#control-dock").is_visible() and "1-es gombot" in page.locator("#hint").inner_text(), "Demo starts with one combined task/control panel")
            page.locator("#scene").scroll_into_view_if_needed()
            for task_index in range(6):
                for _ in range(60):
                    snapshot = page.evaluate("kurtTest.snapshot()")
                    if snapshot["phase"] == "play":
                        break
                    page.clock.run_for(100)
                check(snapshot["taskIndex"] == task_index and snapshot["phase"] == "play", f"Demo task {task_index + 1} reachable")
                key = str(snapshot["task"]["note"] + 1)
                page.clock.run_for(100)
                instruction = page.locator("#hint").inner_text()
                check(page.locator("#phase").inner_text() == "MOST NYOMD!" and f"{key}-es gombot" in instruction, f"Demo task {task_index + 1}: names the actual key")
                if task_index == 0:
                    page.screenshot(path=str(OUT / "desktop-demo-instructions.png"), full_page=True)
                needed = snapshot["task"]["needed"]
                duration = snapshot["task"]["duration"]
                # A gombfókusz helyett a billentyűzet valódi játéktér-fókuszt kap.
                page.locator("#scene").click(position={"x": 20, "y": 20})
                for _ in range(needed):
                    page.keyboard.down(key)
                    page.clock.run_for(int((duration + .12) * 1000))
                    page.keyboard.up(key)
                    page.clock.run_for(180)
                snapshot = page.evaluate("kurtTest.snapshot()")
                check(snapshot["score"] == task_index + 1, f"Demo task {task_index + 1}: correct reward")
                if task_index == 0:
                    page.screenshot(path=str(OUT / "desktop-success.png"), full_page=True)
                    page.locator("#pause").click()
                    before = page.evaluate("kurtTest.snapshot().elapsed")
                    page.clock.run_for(5000)
                    check(page.evaluate("kurtTest.snapshot().elapsed") == before, "Pause freezes round")
                    page.locator("#pause").click()
                page.clock.run_for(4400)
            check(page.locator("#result").is_visible(), "Full mixed demo reaches concert")
            check(page.locator("#collection").inner_text() == "", "Demo does not award permanent stickers")
            page.screenshot(path=str(OUT / "desktop-result.png"), full_page=True)
            context.close()

            # Érintéses, keskeny mobilnézet; többféle hang, menü és forgatás.
            mobile = browser.new_context(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True, device_scale_factor=2)
            mp = mobile.new_page()
            watch(mp)
            mp.goto(url)
            mp.wait_for_function("!!window.kurtTest")
            mp.locator("#settings-toggle").tap()
            mp.locator("#note-count").select_option("5")
            check(mp.evaluate("document.documentElement.scrollWidth <= innerWidth"), "Mobile settings: no horizontal overflow")
            mp.screenshot(path=str(OUT / "mobile-settings.png"), full_page=True)
            mp.locator("#settings-close").tap()
            mp.locator("#demo-start").tap()
            check(mp.locator("#hint").evaluate("el => { const r=el.getBoundingClientRect(); return r.top>=0 && r.bottom<=innerHeight; }") , "Mobile instructions fit without scrolling")
            mp.wait_for_function("kurtTest.snapshot().phase === 'play'", timeout=12000)
            button = mp.locator("#demo-keys button").first
            button.scroll_into_view_if_needed()
            # Pointerdown/up út: a Playwright tap rövidebb egy érvényes kürthangnál.
            button.dispatch_event("pointerdown", {"pointerId": 1, "pointerType": "touch"})
            mp.wait_for_timeout(250)
            button.dispatch_event("pointerup", {"pointerId": 1, "pointerType": "touch"})
            mp.wait_for_function("kurtTest.snapshot().score === 1")
            check(True, "Mobile held touch triggers jump")
            mp.locator("#scene").scroll_into_view_if_needed()
            mp.screenshot(path=str(OUT / "mobile-game.png"), full_page=True)
            mp.set_viewport_size({"width": 844, "height": 390})
            check(mp.evaluate("document.documentElement.scrollWidth <= innerWidth"), "Landscape: no horizontal overflow")
            mp.locator("#finish").tap()
            check(mp.locator("#result").is_visible(), "Mobile finish action")
            mobile.close()

            # Engedély elutasítása, elkülönített böngészőkörnyezetben.
            denied = browser.new_context()
            dp = denied.new_page()
            watch(dp)
            dp.goto(url)
            denied.grant_permissions([], origin=origin)
            dp.locator("#settings-toggle").click()
            dp.locator("#mic-enable").click()
            dp.wait_for_function("document.querySelector('#mic-status').textContent.includes('engedélyt')")
            check(not dp.evaluate("kurtTest.snapshot().stream"), "Denied microphone: clear error and no stream")
            dp.locator("#settings-close").click()
            dp.locator("#demo-start").click()
            check(dp.evaluate("kurtTest.snapshot().running"), "Demo remains available after microphone denial")
            denied.close()

            # A fájl a böngésző hamis mikrofonja: nem a hangbecslő megkerülése.
            mic = browser.new_context(permissions=["microphone"], viewport={"width": 1280, "height": 1000})
            ap = mic.new_page()
            watch(ap)
            ap.goto(url)
            ap.wait_for_function("!!window.kurtTest")
            ap.locator("#settings-toggle").click()
            ap.locator("#speed").select_option("1.5")
            ap.locator("#rest").select_option("3")
            # Elsőként rossz oktáv: hiába azonos a hangosztály, ne legyen siker.
            ap.locator("#note-editor input[type=number]").first.fill("466.1638")
            ap.locator("#note-editor input[type=number]").first.dispatch_event("change")
            ap.locator(".note-row").first.get_by_role("button", name="Jóváhagyom", exact=True).click()
            ap.locator("#mode").select_option("short")
            ap.locator("#settings-close").click()
            ap.locator("#mic-start").click()
            ap.wait_for_function("kurtTest.snapshot().mode === 'mic'")
            check(ap.locator("#demo-guide").is_hidden(), "Keyboard instructions hidden in microphone mode")
            ap.wait_for_function("kurtTest.snapshot().signal.hz > 0", timeout=15000)
            ap.wait_for_function("kurtTest.snapshot().phase === 'play'", timeout=12000)
            ap.wait_for_timeout(3500)
            check(ap.evaluate("kurtTest.snapshot().score") == 0, "Synthetic microphone: wrong octave rejected")
            ap.locator("#finish").click()
            # Bemérés + explicit jóváhagyás, majd mindhárom mechanika a mikrofonból.
            ap.locator("#settings-toggle").click()
            ap.locator(".note-row").first.get_by_role("button", name="Bemérés", exact=True).click()
            ap.wait_for_function("document.querySelector('#capture-status').textContent.startsWith('Javaslat:')", timeout=20000)
            detected = float(ap.locator("#note-editor input[type=number]").first.input_value())
            check(abs(1200 * math.log2(detected / 233.0819)) < 10, "Microphone calibration recognises fundamental under dominant overtone")
            check(ap.locator("#note-editor input[maxlength]").first.input_value() == "B♭3", "Microphone calibration updates the automatic sounding note name")
            ap.locator(".note-row").first.get_by_role("button", name="Jóváhagyom", exact=True).click()
            ap.locator("#settings-close").click()
            for practice in ("short", "repeat", "hold"):
                ap.locator("#settings-toggle").click()
                ap.locator("#mode").select_option(practice)
                ap.locator("#hold").select_option("0.5")
                ap.locator("#settings-close").click()
                ap.locator("#again").click()
                goal = 3 if practice == "short" else 1
                ap.wait_for_function(f"kurtTest.snapshot().score >= {goal}", timeout=35000)
                check(True, f"Synthetic microphone completes {practice} task")
                if practice == "hold":
                    ap.locator("#scene").scroll_into_view_if_needed()
                    ap.screenshot(path=str(OUT / "microphone-success.png"), full_page=True)
                ap.locator("#finish").click()
                check(not ap.evaluate("kurtTest.snapshot().stream"), "Finishing stops microphone tracks")
                if practice == "short":
                    check("koncertmatrica" in ap.locator("#sticker").inner_text(), "Three microphone successes award a permanent sticker")
            # Következő belépéskor megmarad a jóváhagyott hang.
            ap.reload()
            ap.wait_for_function("!!window.kurtTest")
            ap.locator("#settings-toggle").click()
            check("approved" in ap.locator(".note-row").first.get_attribute("class"), "Approved notes survive reload")
            mic.close()
            browser.close()
        check(not errors, f"No JavaScript/console errors: {errors}")
        print(f"\n{len(checks)} browser checks passed. Screenshots: {OUT}")
    finally:
        server.shutdown()
        server.server_close()


if __name__ == "__main__":
    main()
