# Kürt Kaland – Hangjegyliget 🎺🐰

Önálló, statikus böngészős gyakorlójáték kezdő kürtösöknek. Nincs telepítendő alkalmazás, build vagy npm-csomag.

## Indítás

A repó szokásos `./start.sh` indítója után:

<http://localhost:8765/kurt-kaland/>

Alternatíva a repó gyökeréből:

```powershell
python -m http.server 8765 --bind 127.0.0.1 --directory src
```

Telefonon egy **HTTPS-en közzétett** oldal szükséges a mikrofonhoz. A számítógép helyi IP-címén elérhető sima HTTP-oldal a legtöbb mobilböngészőben nem kap mikrofont. A demó mikrofon nélkül is használható.

## Első gyakorlás felnőttel

1. A **Kipróbálom hangszer nélkül** gombbal megismerhetitek a pályát. A pálya alatt rögtön látszik a billentyűs útmutató és a hanggombok; az aktuális célgomb kiemelve jelenik meg. A **MOST NYOMD!** jelre nyomjátok meg a kiírt 1–5 számbillentyűt, vagy tartsátok lenyomva a képernyőn a hanggombot. Rövid hanghoz kb. fél másodperc után engedjétek fel; hosszú hanghoz tartsátok a jelzett ideig; ismétlésnél engedjétek fel az egyes lenyomások között. A demó nem ad tartós matricát.
2. Nyissátok meg a **Beállítások** panelt. A hangszer alapértelmezetten **B-kürt (B♭)**, de ez nem határozza meg automatikusan a kotta transzpozícióját.
3. Egyetlen, tanárral már tanult, kényelmes hanggal kezdjetek. Kattintsatok az első sor **Bemérés** gombjára, engedélyezzétek a mikrofont, majd tartsátok egyenletesen a hangot kb. 1–2 másodpercig.
4. A javasolt hangot és oktávot felnőtt/tanár ellenőrizze, majd **Jóváhagyom**. A hang neve átírható arra, amit a gyermek ismer; a Hz mező mindig a ténylegesen megszólaló hangot jelenti. A példahangok nem tantervi ajánlások.
5. Kezdetnek: egy hang, **Pöttyös rét**, lassú sebesség, megengedő pontosság, bekapcsolt **Segítő felhő**. A panel bezárása után válasszátok a **Gyakorlás kürttel** gombot.
6. A **MOST FÚJJ!** jelre játsszatok. Az előkészületi szakaszban még nem számít a hang. A Segítő felhő megvárja a gyermeket; kikapcsolva a feladat időkorlátos.

### Mit jelentenek a hangnevek?

Alapból a ténylegesen **megszólaló** hang neve látszik, például **B♭3, C4, D4**. A szám az oktávot jelöli; a B♭ a magyar B hangot jelenti (nem a H-t). Beméréskor a név automatikusan követi a mért hangot.

A B-kürt típusa önmagában nem elég a gyermek **kottában látott** hangnevének megállapításához: B-kürtön is tanulhatnak például F-ben írott szólamból. Ezt a tanártól érdemes megkérdezni. Az ismert kottahangot bármikor beírhatjátok saját névként; ezt a bemérés később sem írja felül. A név kiürítése visszaállítja az automatikus megszólaló nevet. A példahangok nem kezdő fogásrendet vagy tananyagot jelölnek.

### Tippek

- Játék közben a nagy fejléc összecsukódik, és a pálya az ablakhoz igazodik. Egyetlen alsó műszerfalon látszik a feladat, az utasítás, a folyamatjelző és a vezérlés; nem kell az oldalt görgetni.
- A kitartásmérő számmal is mutatja az időt (például **0,4 / 1,0 mp**). Rövid hangnál a nyuszi átugrik a buckán. A **Felhőlift** feladatban egy nagy, mosolygó felhőn emelkedik: folyamatosan tartsátok a hangot (demóban a gombot), amíg a felette lévő mind az öt csillag kigyullad. Ha túl korán abbahagyjátok, finoman leereszkedik; a pici mérési kieséseket továbbra is tolerálja.
- A részletes billentyűs leírás a **⌨ Súgó** alatt nyílik meg. A mikrofon és a hangok beállítása **teljes képernyős, átlátszatlan oldalon** érhető el, a játék nem látszik mögötte. Az alapnézet Full HD-n (és 1920×900 méreten) görgetés nélkül elfér; kisebb kijelzőn görgethető. Bezárás: a két bezáró/kész gomb vagy Escape.
- A mikrofont ne közvetlenül a tölcsérhez tegyétek. A kényelmes távolságot a jelszint és a valódi hangszeres próba alapján válasszátok ki.
- A **Csend / zaj bemérése** gombhoz két másodperc csend kell. Ha a halk hangok nem látszanak, vigyétek balra a hangerőküszöb csúszkáját. Ha a szoba zaját is hangnak veszi, vigyétek jobbra.
- Az ismétlésekhez külön fújások kellenek. Egy kitartott hang nem vált ki több ismétlést; rossz oktáv sem számít jó hangnak.
- Az új pályabeállítások és célhangok a következő körre érvényesek. A **Befejezem** gombbal bármikor lezárható a kör.
- A pihenő és a következő feladatra készülés **egyetlen, alapból 3 másodperces időszak**. Közben már látszik a következő célhang; nincs utána újabb várakozás. A kávészünet-ikonos **3 → 2 → 1** visszaszámlálás pihenőt jelent; a **zöld mérő** a valódi feladat teljesítését mutatja. A kézi Szünet mindkettőt megállítja.
- 5 vagy 8 másodperces közös pihenő/felkészülés is választható. A régi 5 mp-es alapérték frissül 3-ra, az ezután külön kiválasztott hosszabb pihenő viszont megmarad.
- Az átugrott virágos buckák folyamatosan kifutnak balra, és csak a képernyő szélén halványodnak el, nem tűnnek el hirtelen a landolás vagy a pihenő kezdetén.
- Három vagy több sikeres mikrofonos feladat egy körben koncertmatricát ad. A beállításokat és matricákat csak az adott böngésző tárolja.
- A háttérbe tett játék szünetel; visszatéréskor nyomjátok meg a Folytatást. A befejezés/kilépés kikapcsolja a mikrofont. Új körhöz ismét engedélyezni kell a használatát, de a böngésző korábbi engedélye megmaradhat.
- Nincs hangfelvétel, feltöltés vagy mikrofon-visszajátszás. Nincs háttérzene sem, ami tévesen vezérelhetné a nyuszit. A Google Fonts betűtípusa hálózat nélkül rendszerbetűre vált.

**Ez nem hangszeroktató vagy orvosi eszköz.** A fogást, légzéstechnikát és testtartást nem ellenőrzi. Fáradás vagy szédülés esetén azonnal pihenjetek; a gyakorlatok hosszát tanárhoz igazítsátok.

## Automatikus tesztelés

Előfeltétel: a repóban használt `uv` és a teljes Playwright Chromium:

```powershell
uv run --with playwright playwright install chromium
uv run --with playwright src/kurt-kaland/tests/playtest.py
uv run --with json5 .claude/skills/add-game/scripts/validate_games.py
```

A teszt saját, véletlen szabad porton futó szervert indít és állít le. Képernyőképek és generált, kürtszerű mikrofon-tesztjel: a rendszer ideiglenes mappájában, `opencode/kurt-tests/`. A tesztjelek nem részei az éles játék adatainak.

- Tiszta és felhangos hangok, zaj, csend, hangindítás, hangolási határok, rossz oktáv.
- Rövid/ismételt/kitartott feladatok, dupla jutalom elleni védelem, pihenés és szünet.
- Teljes demókör, mobil érintés, álló/fekvő nézet, tárolás, mikrofonengedély megtagadása.
- Kilenc képernyőméret (320×480-tól 1366×600-ig, álló/fekvő nézetben), minden játékvezérlő és kitartásmérő teljes láthatósága, 44 px-es érintési célok, oldalgörgetés nélkül; ugrásív, landolás és simított lebegés.
- Teljes `getUserMedia → Web Audio → hangbecslés → játékmenet` lánc a Chromium fájlból érkező mesterséges mikrofonjával.

A `?test=1` URL csak olvasható állapotmegfigyelést tesz elérhetővé az automatizált tesztnek; nem injektál sikeres hangokat.

**Valódi kürttel és valódi telefonnal végzett próba még szükséges.** Az automatizált teszt nem bizonyítja, hogy minden mikrofon és szoba ugyanolyan jól működik.
