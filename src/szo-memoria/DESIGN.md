# Szó-Memória – játékterv

## Játékmag
A játékos lefordított kártyapárokat (magyar szó ↔ angol szó) keres meg felfordítással,
így játszva tanulja/gyakorolja az angol szókincset.

## Terv

| Elem | Leírás |
|---|---|
| Cím | Szó-Memória (Word Memory) |
| Játékmag | Kártyákat fordít fel, és a magyar szót a helyes angol párjával köti össze. |
| Cél | Az összes pár megtalálása minél kevesebb lépésből / minél gyorsabban. |
| Akadály | A kártyák le vannak fordítva – emlékezni kell, hol mi van; a szót is tudni kell. |
| Fő mechanika | Két kártya felfordítása; ha a magyar-angol pár összeillik, ott maradnak. |
| Kiegészítő mechanika | Sorozat-bónusz (🔥 combo), csillag-értékelés, angol kiejtés hanggal. |
| Tanulási cél | Angol szókincs bővítése témakörök szerint (2–6 éve tanulóknak). |
| Hangulat | Kedves, aranyos, pasztell, bátorító – hibázni nem baj. |
| Visszajelzés | Lapfordítás-hang, találat-csengő, sorozat-számláló, "Ügyes vagy!" üzenetek. |
| Jutalom | Csillagok, rekord (legkevesebb lépés), konfetti, új témakörök felfedezése. |
| Nehezítés | Több pár, kevesebb kártya-segítség, nehezebb témakörök (⭐→⭐⭐⭐). |

### Beállítások (kezdőképernyő)
- **Témakör**: ~18 téma nehézségi jelöléssel (⭐/⭐⭐/⭐⭐⭐) + 🎲 véletlen témakör.
- **Játékmód**:
  - *Memória* – a kártyák lefelé, fel kell fordítani (klasszikus).
  - *Nyitott* – minden kártya látszik, csak párosítani kell (nem-memóriás mód).
- **Kártya-segítség (nehézség)**:
  - *Kezdő* – emoji + mindkét nyelv a kártyán (legkönnyebb).
  - *Haladó* – emoji + egy nyelv (a jelentést az emoji segíti).
  - *Profi* – csak egy szó, se emoji, se fordítás (igazi kihívás).
- **Pár-szám / tábla-méret**: kicsi / közepes / nagy (mobilon kevesebb az alap).
- **Kiejtés hangja** 🔊: az angol szót ki is mondja találatkor (kapcsolható).

## Első 30 másodperc
A játékos egy aranyos pasztell képernyőt lát mackóval/tappancsokkal. Kiválaszt egy témát
(pl. Háziállatok 🐶), rákoppint a Start-ra. Megjelenik a tábla, felfordít két kártyát,
az elsőt megtalálja → csengő szól, a kártyák felugranak, az app kimondja: "dog", 🔥 combo indul.

## Pályák / helyzetek (fokozatosan tanító témák)
1. **Háziállatok ⭐** – kevés, ismerős szó, emoji + kétnyelvű segítség: könnyű sikerélmény.
2. **Ruhák / Ételek ⭐⭐** – több szó, Haladó mód: emoji segít, de csak egy nyelv.
3. **Gyakori igék / melléknevek ⭐⭐⭐** – absztrakt szavak, Profi mód: valódi szótudás kell.

## Nehezítések / csavarok (későbbre)
1. **Sorozat-bónusz (combo)**: hibátlan találat-sorozatért extra csillag/pont.
2. **Idő-mód / rekordok**: legkevesebb lépés és legjobb idő témakörönként (localStorage).
3. **Véletlen kevert téma**: több témakör szavai egy táblán (vegyes szókincs-teszt).

## Technológia
- **HTML + CSS 3D flip + DOM** a kártyákhoz (Canvas helyett): a lapfordítás, elrendezés és
  reszponzivitás natívan, egyszerűbben megoldható DOM-mal – indokolt eltérés a Canvas-ajánlástól.
- **Web Audio API**: procedurális hangok (lapfordítás, találat, hiba, győzelem).
- **Web Speech API (speechSynthesis)**: az angol szó kiejtése – böngésző-natív, nem külső fájl.
- **localStorage**: rekordok, választott nyelv/beállítások.
- **Google Fonts (Fredoka)**: kerek, barátságos betűtípus.
- **Adatok külön `topics.js`-ben**: témakörök + szavak (hu/en/emoji), nem a fő HTML-ben.
- Háttér/kártyahátlap: CSS-mintázat (tappancs/csillag) – offline marad, nincs külső képfájl.

## Továbbfejlesztési ötletek
- Saját szólista szerkesztő (a gyerek beírhat új szavakat).
- "Elrontott" szavak külön gyakorló-paklija (Anki-jellegű ismétlés).
- Napi kihívás, jelvények, gyűjthető állat-matricák.
- Kiejtés-gyakorlás mikrofonnal (Web Speech recognition).

## Változásnapló
- 2026-07-06: első terv elkészült; alap implementáció (18 téma, 3 segítség-szint, 2 mód).
