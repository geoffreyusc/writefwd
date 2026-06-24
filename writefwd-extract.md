# writefwd — write-b writing-screen extraction

**Source file (single, self-contained):** `write-b/index.html`
All CSS is in one inline `<style>` block (lines ~9–791); all JS is in inline `<script>` blocks (the pre-paint theme bootstrap at ~792–804, and the main IIFE at ~1049–end). No linked CSS/JS. Line numbers below refer to `write-b/index.html` as it currently stands.

> Note: write-b has **three** themes, not two — `dark` (default), `midnight`, and `light`. The user asked for "light and dark"; both are given in full below, and `midnight` is included for completeness because it has its own separate per-word fade path (Section B) that the dark/light themes do not use.

---

## SECTION A — Theme colors for the writing screen

### How the theme switches

It's a **`data-theme` attribute on `<html>`** (the document element), combined with a JS toggle and `localStorage` persistence. There is **no** `body.light`/`body.dark` class and **no** `prefers-color-scheme` for the palette. Cycle order: **dark → midnight → light → dark**.

**Pre-paint bootstrap (avoids a flash), lines 792–804, verbatim:**

```html
<script>
  // Apply saved theme before paint to avoid a flash.
  (function() {
    try {
      var t = localStorage.getItem('draft-theme');
      var valid = ['dark', 'midnight', 'light'];
      var theme = valid.indexOf(t) !== -1 ? t : 'dark';
      document.documentElement.setAttribute('data-theme', theme);
    } catch(e) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  })();
</script>
```

**Theme list + cycle + apply, JS verbatim (lines 1568–1641):**

```js
  var THEMES = ['dark', 'midnight', 'light'];

  function getCurrentTheme() {
    return document.documentElement
      .getAttribute('data-theme') || 'dark';
  }

  function applyTheme(theme) {
    document.documentElement
      .setAttribute('data-theme', theme);
    // ... (icon swaps + tooltips omitted; not color-relevant) ...
    // Re-skin the atmosphere surfaces and repaint the writing text for the
    // new mode (a full rebuild so spans/classes don't carry across modes).
    repaintAtmosphere();
    resetLines();
    paint();
  }

  function cycleTheme() {
    var current = getCurrentTheme();
    var idx = THEMES.indexOf(current);
    var next = THEMES[(idx + 1) % THEMES.length];
    applyTheme(next);
    try {
      localStorage.setItem('draft-theme', next);
    } catch(e) {}
  }

  // Initialize from saved theme
  applyTheme(getCurrentTheme());

  // Wire up all toggle buttons
  document.querySelectorAll('[data-theme-toggle]')
    .forEach(function(btn) {
      btn.addEventListener('click', cycleTheme);
    });
```

Persistence key: `localStorage['draft-theme']`. Default when missing/invalid: `dark`.

---

### Custom-property definitions (verbatim)

**`:root` = DARK theme (default), lines 12–45:**

```css
    :root {
      /* ── Dark theme (default) — the lighter dark from write/index.html ── */
      --bg: #1a1a1a;
      --border: #333333;
      --text-bright: #eeeeee;
      --text-dim1: #909090;
      --text-dim2: #505050;
      --text-dim3: #282828;
      --text-muted: #555555;
      --text-faint: #333;
      --wordmark: #777777;
      --stats: #777777;
      --hint: #555555;
      --finish-text: #aaaaaa;
      --finish-border: #666666;
      --icon: #555555;
      --btn-bg: #252525;
      --btn-text: #666666;
      --btn-border: #333333;
      --btn-hover-text: #bbb;
      --btn-hover-border: #666;
      --start-mark-color: #444444;
      --ring-progress: #aaa;
      --scanline: rgba(0,0,0,0.05);
      --vignette: rgba(0,0,0,0.6);
      /* additional vars referenced elsewhere in the CSS — kept so Dark doesn't regress */
      --text-dim3-fade: #282828;
      --heading: #e0e0e0;
      --subhead: #9a9a9a;
      --read: #cfcfcf;
      --opt-sel-bg: rgba(232,232,232,0.08);
      --icon-hover: #888;
      --icon-on: #888;
    }
```

**`[data-theme="light"]` = LIGHT theme, lines 86–118:**

```css
    [data-theme="light"] {
      /* ── Light theme (warm Rhode gray) ── */
      --bg: #f0ede8;
      --border: #d0ccc6;
      --text-bright: #2c2a27;
      --text-dim1: #888078;
      --text-dim2: #aaa89f;
      --text-dim3-fade: #c8c4be;
      --start-mark-color: #c8c4be;
      --text-muted: #aaa;
      --hint: #aaa;
      --finish-text: #888;
      --finish-border: #ccc;
      --text-faint: #c8c4be;
      --accent: #c0392b;
      --wordmark: #888;
      --stats: #999;
      --heading: #4a4640;
      --subhead: #aaa;
      --read: #4a4640;
      --btn-bg: #e4e0da;
      --btn-border: #ccc;
      --btn-text: #888;
      --btn-hover-border: #888;
      --btn-hover-text: #4a4640;
      --opt-sel-bg: rgba(44,42,39,0.08);
      --icon: #999;
      --icon-hover: #4a4640;
      --icon-on: #4a4640;
      --scanline: rgba(0,0,0,0.03);
      --vignette: rgba(0,0,0,0.2);
      --ring-progress: #777;
    }
```

**`[data-theme="midnight"]` = MIDNIGHT theme, lines 120–153 (for completeness):**

```css
    [data-theme="midnight"] {
      /* ── Midnight theme — the original write-b near-black palette ── */
      --bg: #080808;
      --border: #1a1a1a;
      --text-bright: #d8d8d8;
      --text-dim1: #b0b0b0;
      --text-dim2: #383838;
      --text-dim3: #181818;
      --text-muted: #888;
      --text-faint: #1e1e1e;
      --wordmark: #555;
      --stats: #555;
      --hint: #333;
      --finish-text: #888888;
      --finish-border: #444444;
      --icon: #444;
      --btn-bg: #111;
      --btn-text: #555;
      --btn-border: #222;
      --btn-hover-text: #aaa;
      --btn-hover-border: #444;
      --start-mark-color: #333;
      --ring-progress: #666;
      --scanline: rgba(0,0,0,0.12);
      --vignette: rgba(0,0,0,0.7);
      /* additional vars referenced elsewhere in the CSS — kept so Midnight doesn't regress */
      --text-dim3-fade: #181818;
      --heading: #d8d8d8;
      --subhead: #888;
      --read: #b0b0b0;
      --opt-sel-bg: rgba(232,232,232,0.08);
      --icon-hover: #888;
      --icon-on: #888;
    }
```

---

### ⚠️ Mobile (≤600px) overrides the writing-text colors

Inside `@media (max-width: 600px)` (lines 759–775) the **writing text brightness/dim tiers are overridden**, so the per-theme values above are NOT what renders on a phone. Verbatim:

```css
      /* Higher text contrast for real-world mobile lighting. Scope the
         brightening to the default dark theme only (the :not() guards) so it
         never leaks into light mode, where a light --text-bright would make
         the writing text invisible against the cream background. */
      :root:not([data-theme="light"]):not([data-theme="midnight"]) {
        --text-bright: #f0f0f0;
        --text-dim1:   #999999;
      }
      [data-theme="midnight"] {
        --text-bright: #f0f0f0;
        --text-dim1:   #cccccc;
      }
      [data-theme="light"] {
        --text-bright: #1a1816 !important;
        --text-dim1:   #6b6560 !important;
        --text-dim2:   #aaa89f !important;
      }
```

The resolved tables below give **desktop** values first, then note the mobile override where one exists.

---

### Resolved writing-screen colors — LIGHT mode

| Role | Variable | Desktop value | Mobile (≤600px) value |
|---|---|---|---|
| Page / writing background | `--bg` | `#f0ede8` | `#f0ede8` |
| Active / current line (brightest text) | `--text-bright` (used by `#curline`) | `#2c2a27` | `#1a1816` |
| Dim tier 1 (`.line.a1`) | `--text-dim1` | `#888078` | `#6b6560` |
| Dim tier 2 (`.line.a2`) | `--text-dim2` | `#aaa89f` | `#aaa89f` |
| Dim tier 3 (`.line.a3`) | `--text-dim3-fade` | `#c8c4be` | `#c8c4be` |
| Cursor | `--text-bright` (`#cursor { background }`) | `#2c2a27` | `#1a1816` |
| Strikethrough word text | `--text-dim1` (`.struck { color }`) | `#888078` | `#6b6560` |
| Strikethrough line color | `--text-dim1` (`.struck { text-decoration-color }`) | `#888078` | `#6b6560` |
| Header wordmark / back-link | `--wordmark` | `#888` | `#888` |
| Header stats / word count / timer | `--stats` | `#999` | `#999` |
| Footer hint text | `--hint` | `#aaa` | `#aaa` |
| Write-hint placeholder (`#write-hint`) | `--text-dim3-fade` | `#c8c4be` | `#c8c4be` |

### Resolved writing-screen colors — DARK mode (default)

| Role | Variable | Desktop value | Mobile (≤600px) value |
|---|---|---|---|
| Page / writing background | `--bg` | `#1a1a1a` | `#1a1a1a` |
| Active / current line (brightest text) | `--text-bright` (used by `#curline`) | `#eeeeee` | `#f0f0f0` |
| Dim tier 1 (`.line.a1`) | `--text-dim1` | `#909090` | `#999999` |
| Dim tier 2 (`.line.a2`) | `--text-dim2` | `#505050` | `#505050` |
| Dim tier 3 (`.line.a3`) | `--text-dim3-fade` | `#282828` | `#282828` |
| Cursor | `--text-bright` (`#cursor { background }`) | `#eeeeee` | `#f0f0f0` |
| Strikethrough word text | `--text-dim1` (`.struck { color }`) | `#909090` | `#999999` |
| Strikethrough line color | `--text-dim1` (`.struck { text-decoration-color }`) | `#909090` | `#999999` |
| Header wordmark / back-link | `--wordmark` | `#777777` | `#777777` |
| Header stats / word count / timer | `--stats` | `#777777` | `#777777` |
| Footer hint text | `--hint` | `#555555` | `#555555` |
| Write-hint placeholder (`#write-hint`) | `--text-dim3-fade` | `#282828` | `#282828` |

> Note on dim tiers: each `.a*` class also applies an **opacity** on top of the color (a1 → 0.85, a2 → 0.55, a3 → 0.25 — see Section B). So the *effective* on-screen dim color is the hex above composited at that opacity over `--bg`. The tables list the raw color token; the opacity is applied separately by the class.

### MIDNIGHT mode (separate per-word path — for completeness)

Midnight does **not** use the `.line.a1/a2/a3` CSS tiers for committed text. Its fade is computed per-word in JS (`paintMidnight` / `renderAged`) as an atmosphere-tinted `rgba()` with a `Math.pow(0.84, age)` falloff — see Section B. Its base palette: `--bg: #080808`, `--text-bright: #d8d8d8` (mobile `#f0f0f0`), cursor uses `--text-bright` (or the atmosphere color when a tinted atmosphere is active).

---

### Verbatim CSS rules that consume these (writing screen)

**Page/body background + base text color (lines 155–166):**

```css
    html, body {
      position: fixed;          /* lock the page so iOS can't scroll the body when the keyboard opens */
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      height: 100dvh;
      background: var(--bg);
      color: var(--text-bright);
      font-family: 'Courier New', Courier, monospace;
      overflow: hidden;
    }
```

**Current/active line + cursor (lines 318–340):**

```css
    #curline {
      font-size: inherit;   /* follow #writing-col so the size buttons take effect */
      line-height: 1.9;     /* same rhythm as committed .line elements */
      color: var(--text-bright);
      min-height: 1.9em;
      white-space: pre-wrap;
      word-break: break-word;
      margin: 0;
      padding: 0;
      position: relative;
      z-index: 1;
    }
    /* Inline text holders must not override the line rhythm. */
    #curtext { line-height: 1.9; }
    #cursor {
      display: inline-block;
      width: 0.46em; height: 1.05em;
      background: var(--text-bright);
      vertical-align: middle;
      margin-left: 1px;
      animation: blink 0.9s step-end infinite;
    }
    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
```

**Strikethrough (crossed-out word), lines 312–317:**

```css
    .struck {
      text-decoration: line-through;
      text-decoration-color: var(--text-dim1);
      text-decoration-thickness: 1px;
      color: var(--text-dim1);
    }
```

**Header / footer / hint (lines 205, 212–224, 424):**

```css
    #back-link {
      ...
      color: var(--wordmark);
      ...
    }
    #wordmark {
      font-size: 14px;
      letter-spacing: 0.2em;
      color: var(--wordmark);
      text-transform: uppercase;
    }
    #stats {
      display: flex;
      align-items: center;
      gap: 18px;
      font-size: 13px;
      color: var(--stats);
    }
    #timer-label { font-size: 14px; color: var(--stats); }

    #hint { font-size: 11px; color: var(--hint); letter-spacing: 0.1em; }
```

**Write-hint placeholder (lines 270–288):**

```css
    #write-hint {
      color: var(--text-dim3-fade);
      pointer-events: none;
      transition: opacity 0.6s ease;
      opacity: 1;
      line-height: 1.9;
      margin: 0;
      padding: 0;
    }
    #write-hint.hidden {
      opacity: 0;
      display: block;     /* take it out of the inline flow so height:0 truly collapses it */
      height: 0;
      min-height: 0;
      line-height: 0;
      overflow: hidden;
      margin: 0;
      padding: 0;
    }
```

---

## SECTION B — The text-fade mechanic ("text fades — eyes ahead")

### Overview / answers to the specific questions

- **What determines which line gets which fade level:** the line's **distance from the bottom (most recent) committed line**, i.e. recency by line index — NOT scroll position, NOT a timer, NOT character count. In `paint()`: `age = w.result.length - i`, then class `'line a' + Math.min(age, 3)`. Newest committed line = `a1`, next up = `a2`, then `a3` and beyond all clamp to `a3`.
- **When a line starts fading (exact trigger):** the moment a **new line is committed below it** (i.e. the writer wraps to a new visual line or presses Enter, pushing this line up). Fade is recomputed on **every `input` event** via `render() → paint()`. It is **not** time-based and **not** character-count-based. Additional gate: **fading is suppressed until there are ≥4 committed lines.** While `w.result.length < 4`, every committed line stays at full brightness (plain `line`, no age class). At 4+, the age-class ladder applies.
- **Does the active/current line ever fade:** **No.** The in-progress current line is `#curline`/`#curtext`, which is always `color: var(--text-bright)` and never receives an `a*` class. Only **committed** lines (in `#lines`) fade. The newest committed line gets `a1` (the lightest fade), so even the most-recently-finished line is only slightly dimmed; the line you're actively typing is full brightness.
- **Transition timing / easing:** `0.6s cubic-bezier(0.25, 0, 0.5, 1)` on both `color` and `opacity` (committed `.line` elements). The placeholder `#write-hint` uses `opacity 0.6s ease`. The top scrim `#fade-top` is a static gradient (no transition).

> This is the **dark/light** path. Midnight uses a different, per-word recency fade (`paintMidnight`/`renderAged`) documented at the end of this section.

---

### CSS — fade tiers + transition (verbatim, lines 297–317)

```css
    #lines { display: block; margin: 0; padding: 0; }
    .line {
      font-size: inherit;   /* follow #writing-col so the size buttons take effect */
      line-height: 1.9;      /* uniform rhythm — matches #curline and wrapped lines */
      white-space: pre-wrap;
      word-break: break-word;
      min-height: 1.9em;     /* blank lines (Enter) hold exactly one line, == line-height */
      margin: 0;
      padding: 0;
      transition: color 0.6s cubic-bezier(0.25, 0, 0.5, 1),
                  opacity 0.6s cubic-bezier(0.25, 0, 0.5, 1);
    }
    .line.a1 { color: var(--text-dim1); opacity: 0.85; }
    .line.a2 { color: var(--text-dim2); opacity: 0.55; }
    .line.a3 { color: var(--text-dim3-fade); opacity: 0.25; }
    .struck {
      text-decoration: line-through;
      text-decoration-color: var(--text-dim1);
      text-decoration-thickness: 1px;
      color: var(--text-dim1);
    }
```

**Top scrim gradient `#fade-top` (static, lines 289–296):**

```css
    #fade-top {
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 40px;
      background: linear-gradient(to bottom, var(--bg) 0%, transparent 100%);
      pointer-events: none;
      z-index: 2;
    }
```

Note (line 47–49): the theme cross-fade transition block is *deliberately scoped to exclude* `.line`, `#curline`, `#cursor` so the fade mechanic and cursor blink aren't disturbed by theme switches:

```css
    /* Smooth theme cross-fade — scoped to structural elements only.
       Deliberately excludes .line, #curline, #cursor so the writing
       fade mechanic and cursor blink are unaffected. */
```

---

### JS — the trigger chain (verbatim)

**Input handler → render → paint (lines 1952–1963):**

```js
  function render() {
    var val = inp.value;
    if (val.length < lastLen) { inp.value = allText; return; }
    allText += val.slice(lastLen);
    lastLen = allText.length;
    inp.value = allText;
    // Fade the hint out the moment the writer commits any text.
    if (writeHint && allText.length) writeHint.classList.add('hidden');
    paint();
    // Keep the cursor line visible above the keyboard at all times.
    if (writingScroll) writingScroll.scrollTop = writingScroll.scrollHeight;
  }
```

`render` is bound to the input event (line 2081): `inp.addEventListener('input', render);`

**`wrap()` — splits `allText` into committed lines (`result`) + the live current line (`cur`), wrapping at 54 chars (lines 1904–1927):**

```js
  function wrap(text) {
    var WIDTH = 54;
    var words = text.split(' ');
    var result = [];
    var cur = '';
    for (var i = 0; i < words.length; i++) {
      var word = words[i];
      if (word.indexOf('\n') >= 0) {
        var parts = word.split('\n');
        for (var j = 0; j < parts.length; j++) {
          var p = parts[j];
          var test = cur ? (cur + (cur && p ? ' ' : '') + p) : p;
          if (test.length > WIDTH && cur) { result.push(cur); cur = p; }
          else { cur = test; }
          if (j < parts.length - 1) { result.push(cur); cur = ''; }
        }
      } else {
        var test2 = cur ? cur + ' ' + word : word;
        if (test2.length > WIDTH && cur) { result.push(cur); cur = word; }
        else { cur = test2; }
      }
    }
    return { result: result, cur: cur };
  }
```

So a line is "committed" (and thus eligible to fade) the moment `cur` exceeds 54 chars and is pushed into `result`, or when a `\n` is entered. The line you're typing is always `cur`.

**`paint()` — assigns the fade classes (light/dark path), verbatim (lines 1970–2021):**

```js
  function paint() {
    var w = wrap(allText);
    if (useAtmosphere()) { paintMidnight(w); return; }
    setLineContent(curtext, w.cur);
    curtext.style.color = '';

    var SHOW = 4;
    var start = Math.max(0, w.result.length - SHOW);
    // Drop line elements that have scrolled out of the visible window
    for (var key in lineEls) {
      var ki = +key;
      if (ki < start || ki >= w.result.length) {
        linesEl.removeChild(lineEls[key]);
        delete lineEls[key];
      }
    }

    // Reconcile visible lines in place: reuse existing nodes and only update
    // their age class, so the CSS color/opacity transition fires on the same
    // element as a line recedes - no innerHTML rebuild, no DOM jump.
    for (var i = start; i < w.result.length; i++) {
      // Hold off fading until there are >=4 committed lines; below that every
      // committed line stays full-brightness (no age class). At 4+ the existing
      // age-class logic applies exactly as before.
      var cls;
      if (w.result.length < 4) {
        cls = 'line';
      } else {
        var age = w.result.length - i;
        cls = 'line a' + Math.min(age, 3);
      }
      var text = w.result[i] || ' ';
      var el = lineEls[i];
      if (!el) {
        el = document.createElement('div');
        setLineContent(el, text);
        el.dataset.raw = text;
        lineEls[i] = el;
        linesEl.appendChild(el);
      } else if (el.dataset.raw !== text) {
        // dataset.raw holds the marker-bearing source so struck spans aren't rebuilt every keystroke.
        setLineContent(el, text);
        el.dataset.raw = text;
      }
      if (el.className !== cls) el.className = cls;
    }

    var n = wc(allText);
    wcEl.textContent = n + (n === 1 ? ' word' : ' words');
    lastWc = n;
    writingScroll.scrollTop = writingScroll.scrollHeight;
  }
```

**Key fade-assignment lines, isolated:**

```js
      var cls;
      if (w.result.length < 4) {
        cls = 'line';                         // <4 committed lines: no fade at all
      } else {
        var age = w.result.length - i;        // distance from newest committed line
        cls = 'line a' + Math.min(age, 3);    // a1 = newest committed, a2, a3 (clamped)
      }
```

- `SHOW = 4` → only the last 4 committed lines stay in the DOM; older ones are removed (line 1981–1985). Combined with `Math.min(age, 3)`, the visible ladder is: newest committed = `a1`, then `a2`, then `a3`, then `a3` (4th) before removal.
- `age` is a **line-index distance**, computed fresh on every paint. There is no timer and no per-character counter.

**Window/visible-row count:** `var SHOW = 4;` (line 1976) — at most 4 committed line nodes kept.

---

### MIDNIGHT-only per-word fade (separate path — included for completeness)

When `useAtmosphere()` is true (midnight theme + a non-"original" atmosphere selected), `paint()` forks to `paintMidnight()`, which fades **per word by recency**, tinted to the atmosphere RGB, with a `Math.pow(0.84, age)` alpha falloff and a one-shot landing glow on the just-committed word. This path does NOT touch the `.a1/.a2/.a3` classes.

**`renderAged()` — per-word recency tint (verbatim, lines 1216–1258):**

```js
  function renderAged(el, lineText, ctx, hasLive) {
    el.textContent = '';
    var segs = lineText.split('\x00');   // even index = normal text, odd = struck word
    var lastIdx = segs.length - 1;
    // The live buffer is the last non-empty word of the final segment, only when
    // that segment is normal text (an un-closed strike can't be the buffer).
    var livePos = -1;
    if (hasLive && lastIdx % 2 === 0) {
      var lw = segs[lastIdx].split(' ');
      for (var z = lw.length - 1; z >= 0; z--) { if (lw[z] !== '') { livePos = z; break; } }
    }
    for (var si = 0; si < segs.length; si++) {
      var seg = segs[si];
      if (si % 2 === 1) {                                      // struck word
        if (seg === '') continue;
        var ss = document.createElement('span');
        ss.textContent = seg;
        ss.style.color = c(0.26);
        ss.style.textDecoration = 'line-through';
        ss.style.textDecorationColor = c(0.38);
        el.appendChild(ss);
        ctx.idx++;
        continue;
      }
      var words = seg.split(' ');                             // normal run (spaces live here)
      for (var wi = 0; wi < words.length; wi++) {
        if (wi > 0) el.appendChild(document.createTextNode(' '));
        var wd = words[wi];
        if (wd === '') continue;
        var span = document.createElement('span');
        span.textContent = wd;
        if (si === lastIdx && wi === livePos) {
          span.style.color = c(0.95);                         // live buffer
        } else {
          var age = ctx.total - ctx.idx;
          span.style.color = (age <= 1) ? c(1) : c(Math.max(0.05, Math.pow(0.84, age)));
          if (age <= 1) ctx.newest = span;
          ctx.idx++;
        }
        el.appendChild(span);
      }
    }
  }
```

Here `c(alpha)` builds `rgba(r,g,b,alpha)` from the active atmosphere's RGB (lines 1139–1142):

```js
  function c(alpha) {
    var r = getAtmo().rgb;
    return 'rgba(' + r[0] + ',' + r[1] + ',' + r[2] + ',' + alpha + ')';
  }
```

**`paintMidnight()` (verbatim, lines 2025–2078):**

```js
  function paintMidnight(w) {
    var SHOW = 4;
    var start = Math.max(0, w.result.length - SHOW);

    for (var key in lineEls) {
      var ki = +key;
      if (ki < start || ki >= w.result.length) {
        linesEl.removeChild(lineEls[key]);
        delete lineEls[key];
      }
    }

    var lines = w.result;
    var cur = w.cur;
    // A live (in-progress) buffer exists only when the text doesn't end in
    // whitespace AND doesn't end with a closed strike marker.
    var hasLive = !(cur === '' || /\s$/.test(allText) || allText.slice(-1) === '\x00');

    // Count committed visible words (struck + normal), minus the live buffer.
    var total = 0, li;
    for (li = start; li < lines.length; li++) total += segWordCount(lines[li]);
    total += segWordCount(cur) - (hasLive ? 1 : 0);

    // Landing detection: a new word commits when the committed-word count grows.
    // wc() excludes struck words, so striking lowers it (no glow); typing a new
    // word raises it (glow on the just-committed word).
    var committedCount = Math.max(0, wc(allText) - (hasLive ? 1 : 0));
    var landed = committedCount > prevCommitted;
    prevCommitted = committedCount;

    var ctx = { idx: 0, total: total, newest: null };

    for (li = start; li < lines.length; li++) {
      var el = lineEls[li];
      if (!el) { el = document.createElement('div'); lineEls[li] = el; linesEl.appendChild(el); }
      el.className = 'line';
      el.dataset.raw = '\x01';   // sentinel: forces a rebuild if mode flips back
      renderAged(el, lines[li] || ' ', ctx, false);
    }

    renderAged(curtext, cur, ctx, hasLive);
    curtext.style.color = '';

    if (landed && ctx.newest) {
      ctx.newest.classList.remove('wf-land');
      void ctx.newest.offsetWidth;   // restart the keyframe
      ctx.newest.classList.add('wf-land');
    }

    var n = wc(allText);
    wcEl.textContent = n + (n === 1 ? ' word' : ' words');
    lastWc = n;
    writingScroll.scrollTop = writingScroll.scrollHeight;
  }
```

**Landing-glow keyframe (CSS, lines 352–357):**

```css
    /* Word-landing glow — the most recently committed word pulses once. */
    @keyframes wf-land {
      from { text-shadow: 0 0 4px currentColor; }
      to   { text-shadow: none; }
    }
    .wf-land { animation: wf-land 1.4s ease-out; }
```

---

## Quick reference — trigger summary

| Question | Answer (dark/light path) |
|---|---|
| What drives fade level? | Line-index distance from the newest committed line: `age = result.length - i`, class `a{min(age,3)}` |
| Scroll/timer/char-count involved? | No. Recomputed on every `input` event via `render()→paint()`. |
| When does a line start fading? | When a new line is committed beneath it (wrap at 54 chars or Enter), **and** only once ≥4 committed lines exist. |
| Does the active line fade? | No — `#curline`/`#curtext` is always `--text-bright`; only committed `.line`s fade. |
| Fade transition timing/easing | `0.6s cubic-bezier(0.25, 0, 0.5, 1)` on `color` + `opacity`. |
| Fade tier values (light) | a1 `#888078`@0.85 · a2 `#aaa89f`@0.55 · a3 `#c8c4be`@0.25 |
| Fade tier values (dark) | a1 `#909090`@0.85 · a2 `#505050`@0.55 · a3 `#282828`@0.25 |
| Max visible committed lines | `SHOW = 4` |
