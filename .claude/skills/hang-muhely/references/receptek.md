# Hangeffekt-receptek

Mind a SKILL.md-beli `tone(freq, type, dur, vol, freqEnd)` segédfüggvényre épül,
kivéve a zaj-alapúakat (robbanás), amelyekhez saját kód van lent.
A számok kiindulópontok – hangold őket a játék hangulatához!

## Egyszerű effektek (egy tone-hívás)

```js
// Ugrás – felfelé csúszó, játékos
function sfxJump()    { tone(150, 'square', 0.15, 0.2, 400); }

// Pattanás / ütközés (labda, fal)
function sfxBounce()  { tone(220, 'square', 0.08, 0.2); }

// Kattintás / menü
function sfxClick()   { tone(600, 'sine', 0.05, 0.15); }

// Lézer / lövés – gyorsan lefelé csúszó
function sfxLaser()   { tone(900, 'sawtooth', 0.2, 0.15, 120); }

// Találat / sérülés – mély, lefelé csúszó
function sfxHit()     { tone(200, 'sawtooth', 0.25, 0.25, 60); }

// Powerup – hosszan felfelé csúszó
function sfxPowerup() { tone(300, 'triangle', 0.4, 0.2, 900); }
```

## Többhangú effektek (időzített sorozatok)

```js
// Érme / csillag gyűjtése – két gyors, vidám hang
function sfxCoin() {
    tone(988, 'square', 0.08, 0.15);
    setTimeout(() => tone(1319, 'square', 0.2, 0.15), 80);
}

// Siker / szint teljesítve – felfelé futó dallam (C-E-G-C akkordfelbontás)
function sfxWin() {
    [523, 659, 784, 1047].forEach((f, i) =>
        setTimeout(() => tone(f, 'triangle', 0.25, 0.2), i * 120));
}

// Hiba / vereség – lefelé lépegető szomorú hangok
function sfxLose() {
    [392, 330, 262, 196].forEach((f, i) =>
        setTimeout(() => tone(f, 'sawtooth', 0.3, 0.2), i * 180));
}

// Visszaszámlálás: 3-2-1-RAJT
function sfxCountdown(final) {
    tone(final ? 880 : 440, 'square', final ? 0.4 : 0.15, 0.2);
}
```

## Robbanás (zajbuffer)

Az oszcillátor nem tud zajt – ehhez véletlen mintákkal töltött buffer kell:

```js
function sfxExplosion(dur = 0.4, vol = 0.3) {
    const n = AC.sampleRate * dur;
    const buf = AC.createBuffer(1, n, AC.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < n; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / n);  // elhalkuló zaj
    }
    const src = AC.createBufferSource();
    const g = AC.createGain();
    const f = AC.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.setValueAtTime(1000, AC.currentTime);
    f.frequency.exponentialRampToValueAtTime(100, AC.currentTime + dur);
    src.buffer = buf;
    src.connect(f); f.connect(g); g.connect(AC.destination);
    g.gain.setValueAtTime(vol, AC.currentTime);
    src.start();
}
```

Rövidebb (0.15 s) és magasabb szűrővel: taps/csattanás. Hosszabb (1 s), mélyebb
szűrővel: dübörgés.

## Háttérdallam (opcionális, visszafogottan)

Egyszerű loop `setInterval`-lal – halkan (vol ≤ 0.08), és mindig kikapcsolhatóan:

```js
const MELODY = [262, 330, 392, 330];   // hangfrekvenciák Hz-ben
let melodyStep = 0, melodyTimer = null;

function startMusic() {
    if (melodyTimer) return;
    melodyTimer = setInterval(() => {
        tone(MELODY[melodyStep % MELODY.length], 'triangle', 0.25, 0.06);
        melodyStep++;
    }, 300);
}
function stopMusic() { clearInterval(melodyTimer); melodyTimer = null; }
```

## Hangmagasság-puska (gyakori frekvenciák)

| Hang | Hz | | Hang | Hz |
|---|---|---|---|---|
| C4 (közép C) | 262 | | G4 | 392 |
| D4 | 294 | | A4 | 440 |
| E4 | 330 | | B4 | 494 |
| F4 | 349 | | C5 | 523 |

Egy oktávval feljebb = frekvencia × 2. A vidám dallamok dúr hármashangzatra
(pl. C-E-G = 262-330-392) építhetők a legkönnyebben.
