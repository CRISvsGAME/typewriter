# Typewriter

## Lightweight Typewriter Animation Library

Typewriter is a lightweight, fully typed TypeScript library for rendering
typewriter-style text animations in the browser.

It uses a single `requestAnimationFrame` loop to manage multiple typewriter
targets, natural randomised character timing, deleting cycles, cursor blinking,
and cursor-only states.

---

## 📦 Installation

Install from npm:

```bash
npm install @crisvsgame/typewriter
```

Import the main class:

```typescript
import { Typewriter } from "@crisvsgame/typewriter";
```

---

## 🚀 Quick Start

```html
<div class="cvg-typewriter">
    <div>I'm a: <span class="cvg-typewriter__view"></span></div>

    <div class="cvg-typewriter__text">Software Engineer</div>
    <div class="cvg-typewriter__text">Software Architect</div>
    <div class="cvg-typewriter__text">DevOps Engineer</div>
</div>
```

```typescript
import { Typewriter } from "@crisvsgame/typewriter";

const typewriter = new Typewriter();

typewriter.start();
```

Typewriter reads `.cvg-typewriter__text` elements as source text, hides them,
and renders the animated output inside `.cvg-typewriter__view`.

---

## 🌐 CDN / Browser ESM

Typewriter can also be imported directly in the browser through jsDelivr:

```html
<script type="module">
    import { Typewriter } from "https://cdn.jsdelivr.net/npm/@crisvsgame/typewriter@1.0.0/dist/index.js";

    const typewriter = new Typewriter();

    typewriter.start();
</script>
```

---

## 🔧 Features

- Typewriter text animation
- Randomised character write timing
- Randomised character delete timing
- Multiple text entries per target
- Multiple typewriter targets per controller
- Per-selector configuration
- DOM-based text sources
- Option-based text sources
- Source replacement, append, and prepend modes
- Runtime-generated cursor element
- RAF-controlled cursor blinking
- Cursor-only mode
- Start, pause, reset, and stop controls
- Zero runtime dependencies
- Fully typed TypeScript API

---

## 🧱 HTML Structure

Minimum structure:

```html
<div class="cvg-typewriter">
    <span class="cvg-typewriter__view"></span>
</div>
```

With DOM text sources:

```html
<div class="cvg-typewriter">
    <span class="cvg-typewriter__view"></span>

    <span class="cvg-typewriter__text">First Text</span>
    <span class="cvg-typewriter__text">Second Text</span>
    <span class="cvg-typewriter__text">Third Text</span>
</div>
```

Required user-provided elements:

```text
.cvg-typewriter
.cvg-typewriter__view
```

Optional user-provided elements:

```text
.cvg-typewriter__text
```

Runtime-generated elements:

```text
.cvg-typewriter__value
.cvg-typewriter__cursor
```

The `.cvg-typewriter__view` element is owned by Typewriter at runtime. Its
contents are cleared and replaced with internal render elements.

---

## 🎛️ Options

```typescript
const typewriter = new Typewriter({
    selector: ".hero",
    texts: ["Build", "Test", "Ship"],
    startDelay: 100,
    holdAfterWrite: 1000,
    holdAfterDelete: 100,
    minWriteDelay: 100,
    maxWriteDelay: 200,
    minDeleteDelay: 50,
    maxDeleteDelay: 100,
    sourceMode: "replace",
    cursor: true,
    cursorText: "|",
    cursorBlinkInterval: 500,
});

typewriter.start();
```

### `selector`

Additional selector appended to `.cvg-typewriter`.

```typescript
new Typewriter({
    selector: ".fast",
});
```

Targets:

```html
<div class="cvg-typewriter fast">
    <span class="cvg-typewriter__view"></span>
</div>
```

### `texts`

Option-based text source.

```typescript
new Typewriter({
    texts: ["Hello", "World"],
});
```

Empty strings are ignored. An empty text list enables cursor-only behaviour.

```typescript
new Typewriter({
    texts: [],
});
```

### `sourceMode`

Controls how option texts and DOM texts are combined.

```typescript
sourceMode: "replace";
```

Supported values:

```text
replace
append
prepend
```

Behaviour:

```text
replace  → option texts replace DOM texts when provided
append   → DOM texts first, option texts after
prepend  → option texts first, DOM texts after
```

### Cursor

```typescript
new Typewriter({
    cursor: true,
    cursorText: "█",
    cursorBlinkInterval: 500,
});
```

Disable the cursor:

```typescript
new Typewriter({
    cursor: false,
});
```

The cursor is rendered as `.cvg-typewriter__cursor` and can be styled with CSS.

```css
.cvg-typewriter__cursor {
    color: currentColor;
}
```

---

## 🎚️ Multiple Configurations

A single `Typewriter` controller can configure multiple target groups:

```typescript
const typewriter = new Typewriter([
    {
        selector: ".fast",
        texts: ["Fast", "Responsive"],
        minWriteDelay: 50,
        maxWriteDelay: 100,
    },
    {
        selector: ".slow",
        texts: ["Slow", "Deliberate"],
        minWriteDelay: 200,
        maxWriteDelay: 400,
        cursorText: "█",
    },
]);

typewriter.start();
```

```html
<div class="cvg-typewriter fast">
    <span class="cvg-typewriter__view"></span>
</div>

<div class="cvg-typewriter slow">
    <span class="cvg-typewriter__view"></span>
</div>
```

---

## 🎮 Runtime Controls

```typescript
typewriter.start();
typewriter.pause();
typewriter.reset();
typewriter.stop();
```

### `start()`

Starts the typewriter animation loop.

```typescript
typewriter.start();
```

### `pause()`

Pauses the animation loop and freezes the current visual state.

```typescript
typewriter.pause();
```

### `reset()`

Resets the typewriter.

When running, reset performs a graceful delete back to the first text. When not
running, reset clears the current text immediately.

```typescript
typewriter.reset();
```

### `stop()`

Stops the animation loop and clears the rendered text.

```typescript
typewriter.stop();
```

---

## ♻️ Cursor-Only Mode

Typewriter supports cursor-only targets.

```html
<div class="cvg-typewriter">
    <span class="cvg-typewriter__view"></span>
</div>
```

```typescript
const typewriter = new Typewriter({
    texts: [],
    cursor: true,
});

typewriter.start();
```

This renders a blinking cursor without cycling text.

---

## 🎨 Styling

Typewriter does not require a CSS file.

The library creates the internal value and cursor elements automatically:

```html
<span class="cvg-typewriter__value"></span>

<span class="cvg-typewriter__cursor"></span>
```

You can style them normally:

```css
.cvg-typewriter {
    font-family: monospace;
}

.cvg-typewriter__cursor {
    color: currentColor;
}
```

Terminal-style cursor example:

```typescript
new Typewriter({
    cursorText: "█",
});
```

---

## 🎨 Public API

```typescript
new Typewriter(options);
typewriter.start();
typewriter.pause();
typewriter.reset();
typewriter.stop();
```

Fully typed imports:

```typescript
import { Typewriter, type TypewriterOptions } from "@crisvsgame/typewriter";
```

---

## 📂 Project Structure

```bash
src/
    Typewriter.ts
    index.ts
dist/ # generated build output published to npm
    Typewriter.d.ts
    Typewriter.d.ts.map
    Typewriter.js
    Typewriter.js.map
    index.d.ts
    index.d.ts.map
    index.js
    index.js.map
.gitignore
LICENSE
README.md
package-lock.json
package.json
tsconfig.json
```

---

## 🛠️ Build

Build the library:

```bash
npm run build
```

---

## 📝 License

MIT License

---

## 🔗 Links

- npm: https://www.npmjs.com/package/@crisvsgame/typewriter
- Source Code: https://github.com/CRISvsGAME/typewriter
