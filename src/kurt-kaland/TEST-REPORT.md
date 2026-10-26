# Teszteredmények – 2026-10-26

## Sikeres automatizált ellenőrzések

- **122 jelfeldolgozási/szabály-/mozgásellenőrzés**: 44,1/48 kHz, tiszta és felhangos jelek, domináns második felhang, zaj, csend, halk jel, hangindítási tranziens, centhatárok, rossz oktáv, ismétlés, kitartás, mérési kiesés, dupla jutalom kizárása, külön hangindítás feladatváltás után, ugrásív és simított lebegés. Új tesztek: buckasor pozíciófolytonossága landoláskor és következő ugrás indításakor, távozási eltolás, szélső halványodás, valós hangnevek és oktávok.
- **85 böngészős ellenőrzés**, Chromium: teljes vegyes demókör három hanggal; koncertképernyő; szünet; tartós demójutalom kizárása; mobil érintés; mikrofonengedély megtagadása; bemérés; rövid/ismételt/kitartott mikrofonos feladat; három siker után matrica; streamleállítás; jóváhagyott hang tárolása. A demó minden feladatnál a megfelelő számbillentyűt írja ki; mikrofonos módban a billentyűs rész rejtve marad.
- Görgetésmentes, egyesített műszerfal kilenc méreten: **1280×720, 1366×600, 1024×600, 390×844, 320×568, 320×480, 844×390, 667×375, 568×320**. Külön ellenőrizve a célhang, utasítás, időmérő, hanggombok, szünet, befejezés és beállításgomb képernyőn belül maradása; 44 px-es érintési célok; a Canvas és műszerfal nem takarja egymást.
- Valódi DOM-bemenettel ellenőrzött folyamatos elrugaszkodás, ugráscsúcs, landolás, simított lebegés, számértékkel is frissülő kitartásmérő és az animáció szüneteltetése. A beállítások teljes képernyős, kisebb kijelzőn görgethető oldalon látszanak.
- Felhőlift: az előkészületi utasítás felhőt, nem buckát magyaráz; a feladat folyamatos nyomást kér; korai felengedés finom ereszkedést okoz hamis siker nélkül; teljes kitartásnál öt csillagos felhős sikerjelzés jelenik meg, nem ugrásról szóló szöveg. A nagy, közösen emelkedő felhő/nyuszi és a haladásjelző csillagok asztali, álló mobil és fekvő képernyőképei vizuálisan ellenőrizve. Az ugrás regressziótesztjei továbbra is sikeresek.
- Az átugrott virágos buckák a pihenőre váltás után is folyamatosan kifutnak; szünetben a távozásuk is megáll. Landolás utáni és távozási képernyőképek vizuálisan ellenőrizve.
- Új és régi mentéssel is ellenőrizve a 3 mp-es alap pihenő, a régi generált hangnevek frissítése, a jóváhagyott frekvenciák és matricák megőrzése. Az újonnan külön választott 5/8 mp megmarad újratöltéskor. Az automatikus név Hz-módosításkor és valódi mikrofonláncon végzett beméréskor frissül; a saját tanári felirat nem íródik felül.
- Új időzítési próbák megállított tesztórával: egyetlen 3 mp-es közös pihenő/felkészülés; `3 → 2 → 1` számjelző töltődő sáv nélkül; közvetlen váltás a tényleges kitartásmérőre; kézi szünetben megálló számláló; a következő feladat előtt nincs második várakozás. A korábbi buckák külön kifutó animációja szintén ellenőrizve.
- Teljes képernyős, átlátszatlan beállítások **1920×1080 és 1920×900** méreten: az alapnézet elsődleges vezérlői képernyőn belül, görgetés nélkül; a játék rejtve marad. Tab-fókusz nem kerülhet a mögöttes játékra. A két méret és a külön várakozásjelzés képernyőképei vizuálisan is ellenőrizve.
- A mikrofontesztek valódi `getUserMedia` és Web Audio útvonalon, generált, felhangos WAV-jellel futottak, nem belső sikerinjektálással.
- A repó `playtest` skilljének asztali és mobil próbája: nincs JavaScript-hiba.
- Főoldal: az új Kürt Kaland kártya megjelenik; nincs JavaScript-hiba.
- Játéklista-validátor: **12 játék, minden rendben**.
- `git diff --check`: nincs whitespace-hiba.
- Az asztali kezdő-, játék- és eredményképernyő, a mobil játék/beállítások és a mikrofonos siker képernyőképei vizuálisan is ellenőrizve.

## Teszt közben javítva

- Windows Python-szerver `.mjs` MIME-eltérése: a modulok szabványos `.js` kiterjesztést kaptak.
- A zajos hangindítás hamis alaphangbecslése: időbeli jelszint-stabilitás ellenőrzése.
- A szivárványhíd Canvas-ellipszisének hiányzó paramétere.
- Folyamatos hang ne teljesítsen automatikusan új hangindítási feladatot.
- A mikrofonhoz a teljes Chromium új headless módját használja a teszt: a Windows headless-shell nem támogatta a médiabemenetet.

## Még emberi próba szükséges

- **Valódi B-kürt, gyermek, tényleges mikrofon és akusztikus környezet.** A célhangok és oktávok tanári jóváhagyása, elfogadható késleltetés és érzékenység beállítása.
- **Fizikai telefon / Safari / Firefox.** Az automatizált mobilteszt Chromium-emuláció, nem valódi iPhone/Android készülék.
- Kényelmes hanghossz, pihenő és gyakorlásmennyiség ellenőrzése a tanárral. Az automatikus teszt nem tudja megítélni a helyes fogást vagy légzéstechnikát.

Futtatási parancsok és használat: [README.md](README.md).
