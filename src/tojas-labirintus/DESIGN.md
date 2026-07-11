# Tojáslabirintus – játékterv

## Játékmag
A farmerrel bejárod a bokros labirintust, összeszeded a fürjek tojásait a
korlátozott vödrödbe, majd hazaviszed őket – kikerülve az alvó-ébredő rókát –,
hogy a hazavitt tojásokból új fürjek keljenek ki és nőjön a farmod.

## Terv

| Elem | Leírás |
|---|---|
| Cím | **Tojáslabirintus** (angolul: *Egg Labyrinth*) |
| Játékmag | Tojást szedsz a fészkekből a vödrödbe, majd hazaviszed kikeltetni. |
| Cél | **Növekvő farm**: minden hazavitt adag tojásból új fürj kel ki → több fürj = több tojás = nagyobb udvar. Hosszú távon minél nagyobbra növeszted a farmodat. |
| Akadály | 1) **Korlátozott vödör** – csak pár tojás fér bele, dönteni kell, mikor indulsz haza. 2) **Bokros labirintus** – nem tudsz egyenesen hazamenni, az útvonal maga is ügyesség. 3) **Róka** – ha felébred és elér, ellopja a vödröt. |
| Fő mechanika | Mozgás a labirintusban (rács alapú), tojás felszedése a fészeknél, leadás otthon → kikelés. |
| Kiegészítő mechanika | **Alvó-ébredő róka**: az odújában alszik (Zzz…), majd felébred és üldöz. Ha eléri a farmert, elkapja a vödröt és az odújába rohan vele – ha utoléred, visszaszerzed; ha beér, a vödör tojásai elvesznek. A róka **nem tud bemenni a házba** → a ház biztonságos menedék. |
| Tanulási cél | Útvonaltervezés a labirintusban (térbeli gondolkodás), **döntéshozás/kockázat** („most még szedjek, vagy induljak haza?"), számolás és a farm növekedésének megfigyelése (több fürj → gyorsabb tojástermelés). |
| Hangulat | Alapból **nyugtató, meleg, cuki** kis farmhangulat, amit a róka felébredése rövid **adrenalinlökésekkel** szakít meg. |
| Visszajelzés | Vödörjelző (hány tojás / mennyi fér még), fürjek számlálója, kikelés animáció + „csip-csip" hang, a róka feje fölött Zzz vs. felkiáltójel (!), pontszám/rekord. |
| Jutalom | Látványos növekedés: minden hazaút után szaporodik a nyáj, egyre nyüzsgőbb az udvar; high-score a legnagyobb farmért. |
| Nehezítés | Egyre nagyobb labirintus, kisebb vödör, gyorsabb és rövidebb ideig alvó róka, több fészek egyszerre. |

## Első 30 másodperc
A játékos egy kis, barátságos, bokrokkal tagolt udvart lát felülnézetből. Középen
a farmer, pár fészekben fürjek, a sarokban a ház, egy másik sarokban az **alvó róka**
(Zzz…). Az első tojás pár másodperc múlva megjelenik egy fészekben – a játékos
odamegy, felveszi (a vödör mutatója 1-re ugrik, kis „ploccs" hang), majd a ház felé
indul. Otthon leadja → az első tojás **kikel**, megjelenik egy pici fürjfióka, „csip-csip"
hang. Máris megvan a teljes körforgás sikerélménye – és látszik, hogy a róka még alszik,
de bármikor felébredhet. A ház körül a róka soha nem tud elkapni – ez a biztos zóna.

## Pályák / helyzetek
1. **Nyugis kezdés** – kicsi labirintus, 2 fészek, nagy vödör, a róka **végig alszik**.
   Csak a szedés → hazavitel → kikelés kört tanulja meg a játékos, nyomás nélkül.
2. **Ébredő róka** – több fészek, kisebb udvar; a róka most **felébred és járőrözik** egy
   ideig, majd visszaalszik. A játékos megtanulja figyelni a Zzz/`!` jelet és időzíteni a hazautat.
3. **Nagy udvar** – nagyobb, kanyargósabb labirintus, **kisebb vödör**, gyorsabb róka,
   rövidebb alvások. Itt kell összerakni mindent: útvonal + vödör + rókacsel.

## Nehezítések / csavarok
1. **Két róka** – külön odúból, eltérő ritmusban ébrednek, nehezebb egyszerre figyelni őket.
2. **Nappal/éjszaka ciklus** – éjszaka szűkebb a látótávolság (a ház körüli fény segít),
   a róka éjjel bátrabb.
3. **Aranytojás bónusz** – néha ritka aranytojás jelenik meg, ami több fürjfiókát ér, de
   gyorsan eltűnik / a rókát is jobban vonzza → kockázat-jutalom döntés.

## Technológia
- **HTML5 Canvas** – rács alapú felülnézetes labirintus, mozgó farmer/róka/tojások
  rajzolása; ezt már több játék használja a repóban (Snake, Breakout, Erdei Kaland).
- **Web Audio API** – procedurális hangok (tojás felvétel „ploccs", kikelés „kotkodács",
  róka ébredés riasztás), külső hangfájl nélkül.
- **localStorage** – a farm mérete / legjobb eredmény mentése.
- **Mobil (kötelező)**: touch D-pad vagy swipe vezérlés a mozgáshoz, reszponzív canvas,
  megfelelő viewport – az Erdei Kaland / Snake42 mintájára.

## Továbbfejlesztési ötletek
- Különböző fürjfajták eltérő tojásrátával (matek: melyik éri meg jobban).
- Fejleszthető ház/kerítés a rókával szemben (a hazavitt tojásokból „vásárolható").
- Napi kihívás / pályaszerkesztő.
- Kutya-segítő, ami elugatja a rókát rövid időre.

## Változásnapló
- 2026-07-11: első terv elkészült (fürjek, nem tyúkok; a róka nem mehet be a házba)
- 2026-07-11: játék elkészült (index.html) és felvéve a gyűjteménybe (games.js, CLAUDE.md)
- 2026-07-11: szüneteltetés (P/Esc/gomb); nagyobb vödörkapacitás (10/8/7) + „tele a vödör" jelzés (banner, villogó HUD, ❗ a gazda felett); nagyobb, képernyőt kitöltő pálya (17×13, magasság-alapú méretezés)
- 2026-07-11: irányítás lépkedősre váltva (1 gombnyomás = 1 kocka, nyomva tartva ismétel); róka kissé lassabb (foxSpeed 3.0/4.0 → 2.4/3.2, végtelen mód cap 6.0 → 4.5)
