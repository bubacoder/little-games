---
name: hang-muhely
description: Web Audio API hangeffekt-receptek a little-games játékokhoz. Használd, amikor hangot kell adni egy játékhoz vagy meglévő hangot kell javítani („adj hangot", „legyen hangeffekt", „csinálj hozzá zenét/dallamot", ugrás/érme/robbanás/siker hang kérése). Minden hang kódból generált (oszcillátor, zajbuffer) – külső hangfájl tilos.
---

# Hang-műhely – kódból generált hangeffektek

A repó szabálya: minden hang a Web Audio API-val, kódból készül – hangfájl nincs.
Kipróbált receptek: [references/receptek.md](references/receptek.md) – olvasd be,
amikor konkrét hangeffektet készítesz.

## Alapszerkezet (a repó bevett mintája)

Egy közös `AudioContext` + egy kis `tone()` segédfüggvény (így csinálja a breakout is):

```js
const AC = new (window.AudioContext || window.webkitAudioContext)();

function tone(freq, type, dur, vol, freqEnd) {
    const o = AC.createOscillator();
    const g = AC.createGain();
    o.connect(g); g.connect(AC.destination);
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, AC.currentTime);
    if (freqEnd) o.frequency.exponentialRampToValueAtTime(freqEnd, AC.currentTime + dur);
    g.gain.setValueAtTime(vol || 0.3, AC.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, AC.currentTime + dur);
    o.start(); o.stop(AC.currentTime + dur);
}
```

## Kötelező szabályok

1. **Feloldás első interakcióra**: a böngészők felfüggesztve indítják az AudioContextet.
   Az első kattintásnál/billentyűnél hívd meg:
   ```js
   if (AC.state === 'suspended') AC.resume();
   ```
2. **Hangerő**: effektek 0.1–0.3 között; sose 1.0. Egyszerre legfeljebb néhány hang.
3. **Mindig legyen lecsengés** (`exponentialRampToValueAtTime` 0.001-ig) – enélkül
   kattanás hallatszik a hang végén.
4. `exponentialRamp` célértéke soha ne legyen 0 (hibát dob) – használj 0.001-et.
5. Adj némítás-lehetőséget (🔊/🔇 gomb), az állapotot `localStorage`-ba mentheted.

## Hangtervezési ökölszabályok

- **Felfelé csúszó hang** = pozitív dolog (ugrás, gyűjtés, szint fel).
- **Lefelé csúszó hang** = negatív dolog (találat, hiba, élet elvesztése).
- **`square`/`triangle`** = retró, játékos; **`sine`** = lágy; **`sawtooth`** = durva, gépi.
- A visszajelzés azonnali legyen: a hang a cselekvés *pillanatában* szóljon.
- Kevesebb több: a folyamatos csipogás fárasztó – a fontos eseményeknek legyen hangja.

A headless playtest nem hallja a hangot – hang-ellenőrzéshez kérd meg a felhasználót,
hogy játsszon a játékkal, vagy ellenőrizd a kódot a fenti szabályok szerint.
