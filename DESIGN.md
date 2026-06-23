# DESIGN.MD — Gen-Z Design System

**Project:** Instagram Unfollow Checker  
**Theme:** Gen-Z Raw Digital Aesthetic  
**Version:** 1.0.0

---

## 1. Design Philosophy

Desain ini terinspirasi dari aesthetic Gen-Z: **anti-perfection, brutally honest, hidup, dan expressive**. Bukan clean minimalis corporate — tapi juga bukan chaos. Think: Notion meets TikTok meets zine culture.

**3 Kata Kunci:**

- **RAW** — tidak terlalu polished, ada sedikit "grit"
- **LOUD** — typography yang berani, kontras tinggi
- **ALIVE** — micro-interaction, hover states, subtle motion

---

## 2. Color Palette

### Primary Palette

```css
:root {
  /* Core */
  --color-bg-base: #0a0a0a; /* Near-black background */
  --color-bg-surface: #141414; /* Card surface */
  --color-bg-elevated: #1e1e1e; /* Elevated components */
  --color-bg-overlay: #2a2a2a; /* Overlays, modals */

  /* Accent — Electric Lime (signature color) */
  --color-accent-primary: #c8ff00; /* Electric lime — the ONE loud color */
  --color-accent-hover: #d4ff33; /* Hover state */
  --color-accent-muted: #c8ff0020; /* Muted/ghost version */

  /* Semantic */
  --color-danger: #ff4545; /* Unfollowers — red */
  --color-danger-muted: #ff454515;
  --color-success: #00e676; /* Mutual — green */
  --color-success-muted: #00e67615;
  --color-info: #448aff; /* Fans — blue */
  --color-info-muted: #448aff15;
  --color-warning: #ffd740; /* Warning states */

  /* Text */
  --color-text-primary: #f5f5f5; /* Near-white */
  --color-text-secondary: #a0a0a0; /* Muted */
  --color-text-tertiary: #5a5a5a; /* Very muted */
  --color-text-inverse: #0a0a0a; /* Text on accent bg */

  /* Border */
  --color-border-default: #2a2a2a;
  --color-border-subtle: #1e1e1e;
  --color-border-accent: #c8ff0040;
}
```

### Light Mode Override

```css
.light {
  --color-bg-base: #f7f7f0; /* Warm off-white */
  --color-bg-surface: #ffffff;
  --color-bg-elevated: #f0f0e8;
  --color-bg-overlay: #e8e8e0;
  --color-accent-primary: #8b00ff; /* Electric purple in light mode */
  --color-accent-hover: #9b20ff;
  --color-accent-muted: #8b00ff15;
  --color-text-primary: #0a0a0a;
  --color-text-secondary: #5a5a5a;
  --color-text-tertiary: #a0a0a0;
  --color-text-inverse: #f5f5f5;
  --color-border-default: #e0e0d8;
  --color-border-subtle: #ebebeb;
}
```

---

## 3. Typography

### Font Stack

```css
/* Display — Loud headlines */
@import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap");
/* Body — Readable, modern */
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap");
/* Mono — Data, usernames */
@import url("https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap");

:root {
  --font-display: "Space Grotesk", sans-serif;
  --font-body: "Inter", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
}
```

### Type Scale

```css
/* Display sizes */
--text-display-2xl: clamp(3rem, 8vw, 6rem); /* Hero headline */
--text-display-xl: clamp(2.25rem, 5vw, 4rem); /* Section headline */
--text-display-lg: clamp(1.75rem, 3vw, 2.5rem); /* Card headline */

/* Body sizes */
--text-xl: 1.25rem; /* 20px */
--text-lg: 1.125rem; /* 18px */
--text-base: 1rem; /* 16px */
--text-sm: 0.875rem; /* 14px */
--text-xs: 0.75rem; /* 12px */

/* Mono sizes */
--text-mono-base: 0.875rem; /* 14px */
--text-mono-sm: 0.75rem; /* 12px */
```

### Typography Treatments

```css
/* Hero headline — massive, tight tracking */
.text-hero {
  font-family: var(--font-display);
  font-size: var(--text-display-2xl);
  font-weight: 700;
  line-height: 0.95;
  letter-spacing: -0.03em;
  text-transform: uppercase;
}

/* Section headline */
.text-headline {
  font-family: var(--font-display);
  font-size: var(--text-display-lg);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

/* Body text */
.text-body {
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: 400;
  line-height: 1.7;
  color: var(--color-text-secondary);
}

/* Username mono */
.text-username {
  font-family: var(--font-mono);
  font-size: var(--text-mono-base);
  font-weight: 400;
  color: var(--color-text-primary);
}

/* Label / badge text */
.text-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
```

---

## 4. Spacing System

```css
:root {
  --space-1: 0.25rem; /* 4px */
  --space-2: 0.5rem; /* 8px */
  --space-3: 0.75rem; /* 12px */
  --space-4: 1rem; /* 16px */
  --space-5: 1.25rem; /* 20px */
  --space-6: 1.5rem; /* 24px */
  --space-8: 2rem; /* 32px */
  --space-10: 2.5rem; /* 40px */
  --space-12: 3rem; /* 48px */
  --space-16: 4rem; /* 64px */
  --space-20: 5rem; /* 80px */
  --space-24: 6rem; /* 96px */
}
```

---

## 5. Border Radius

```css
:root {
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-2xl: 32px;
  --radius-full: 9999px;
}
```

---

## 6. Component Library

### 6.1 Buttons

```css
/* Primary Button — accent on dark */
.btn-primary {
  background: var(--color-accent-primary);
  color: var(--color-text-inverse);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: var(--text-sm);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 14px 28px;
  border-radius: var(--radius-full);
  border: none;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    background 0.15s ease;
}

.btn-primary:hover {
  background: var(--color-accent-hover);
  transform: translateY(-2px);
}

.btn-primary:active {
  transform: scale(0.97);
}

/* Ghost Button */
.btn-ghost {
  background: transparent;
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-default);
  /* same padding/font as primary */
  transition:
    border-color 0.15s,
    background 0.15s;
}

.btn-ghost:hover {
  border-color: var(--color-accent-primary);
  background: var(--color-accent-muted);
}

/* Icon Button */
.btn-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border-default);
  cursor: pointer;
  transition: all 0.15s;
}
```

### 6.2 Cards

```css
/* Base Card */
.card {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  transition: border-color 0.2s;
}

.card:hover {
  border-color: var(--color-border-accent);
}

/* Stat Card */
.card-stat {
  background: var(--color-bg-elevated);
  border-radius: var(--radius-lg);
  padding: var(--space-5) var(--space-6);
  text-align: center;
}

/* Result Category Card */
.card-result-danger {
  background: var(--color-danger-muted);
  border: 1px solid var(--color-danger) 30;
  border-radius: var(--radius-xl);
}

.card-result-success {
  background: var(--color-success-muted);
  border: 1px solid var(--color-success) 30;
  border-radius: var(--radius-xl);
}

.card-result-info {
  background: var(--color-info-muted);
  border: 1px solid var(--color-info) 30;
  border-radius: var(--radius-xl);
}
```

### 6.3 Input / Upload Zone

```css
/* Textarea */
.input-area {
  width: 100%;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  color: var(--color-text-primary);
  font-family: var(--font-mono);
  font-size: var(--text-mono-base);
  padding: var(--space-4);
  resize: vertical;
  min-height: 160px;
  transition: border-color 0.2s;
}

.input-area:focus {
  outline: none;
  border-color: var(--color-accent-primary);
  box-shadow: 0 0 0 3px var(--color-accent-muted);
}

/* Upload Dropzone */
.dropzone {
  border: 2px dashed var(--color-border-default);
  border-radius: var(--radius-xl);
  padding: var(--space-12) var(--space-8);
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: var(--color-bg-surface);
}

.dropzone:hover,
.dropzone.drag-over {
  border-color: var(--color-accent-primary);
  background: var(--color-accent-muted);
}
```

### 6.4 Badges & Pills

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.badge-danger {
  background: var(--color-danger-muted);
  color: var(--color-danger);
}
.badge-success {
  background: var(--color-success-muted);
  color: var(--color-success);
}
.badge-info {
  background: var(--color-info-muted);
  color: var(--color-info);
}
.badge-accent {
  background: var(--color-accent-muted);
  color: var(--color-accent-primary);
}
```

### 6.5 Avatar Initials

```css
.avatar {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 500;
  flex-shrink: 0;
}
```

---

## 7. Layout System

### Grid

```css
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-6);
}

/* Responsive container padding */
@media (max-width: 768px) {
  .container {
    padding: 0 var(--space-4);
  }
}
```

### Section Spacing

```css
.section {
  padding: var(--space-24) 0;
}

@media (max-width: 768px) {
  .section {
    padding: var(--space-16) 0;
  }
}

@media (max-width: 480px) {
  .section {
    padding: var(--space-12) 0;
  }
}
```

---

## 8. Motion & Micro-interactions

```css
/* Base transitions */
:root {
  --transition-fast: 0.1s ease;
  --transition-base: 0.2s ease;
  --transition-slow: 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

/* Page entrance animation */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes countUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Result item stagger */
.result-item {
  animation: fadeInUp 0.3s ease both;
}

.result-item:nth-child(n) {
  animation-delay: calc(n * 30ms);
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 9. Responsive Breakpoints

```css
/* Mobile first */
--screen-sm: 480px; /* Large mobile */
--screen-md: 768px; /* Tablet */
--screen-lg: 1024px; /* Laptop */
--screen-xl: 1280px; /* Desktop */
--screen-2xl: 1536px; /* Large desktop */

/* Usage */
@media (min-width: 480px) {
  /* sm */
}
@media (min-width: 768px) {
  /* md */
}
@media (min-width: 1024px) {
  /* lg */
}
@media (min-width: 1280px) {
  /* xl */
}
```

---

## 10. Iconography

Gunakan **Lucide React** sebagai icon library utama.

```tsx
// Install
// npm install lucide-react

// Usage
import {
  UserMinus,
  Users,
  UserPlus,
  Upload,
  Download,
  Shield,
  Zap,
} from "lucide-react";

// Size guideline
// sm: 16px  — inline text icons
// md: 20px  — button icons
// lg: 24px  — card icons
// xl: 32px  — feature icons
// 2xl: 48px — hero decorations
```

---

## 11. Gen-Z Signature Elements

### Noise Texture Overlay

```css
/* Subtle noise untuk "tidak terlalu digital" feel */
.noise-overlay::after {
  content: "";
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,..."); /* SVG noise */
  opacity: 0.03;
  pointer-events: none;
  z-index: 9999;
}
```

### Accent Glow

```css
/* Hanya pada elemen penting, tidak berlebihan */
.glow-accent {
  text-shadow: 0 0 30px var(--color-accent-primary) 60;
}
```

### Ticker / Marquee

```css
/* Untuk tagline atau social proof */
.marquee-container {
  overflow: hidden;
  border-top: 1px solid var(--color-border-default);
  border-bottom: 1px solid var(--color-border-default);
  padding: var(--space-3) 0;
}

.marquee-track {
  display: flex;
  gap: var(--space-8);
  animation: marquee 20s linear infinite;
}

@keyframes marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}
```

### Split Text Highlight

```css
/* Untuk emphasis kata tertentu di headline */
.text-highlight {
  color: var(--color-accent-primary);
  position: relative;
}
```

---

## 12. Accessibility Requirements

- Contrast ratio minimum 4.5:1 untuk body text
- Contrast ratio minimum 3:1 untuk large text / UI components
- Focus ring visible pada semua interactive elements: `outline: 2px solid var(--color-accent-primary); outline-offset: 2px;`
- ARIA labels pada semua icon-only buttons
- Skip navigation link
- `prefers-color-scheme` respected
- `prefers-reduced-motion` respected
- Semantic HTML (nav, main, section, article, aside)

---

## 13. Dark Mode Default + Theme Toggle

App default ke **dark mode** (sesuai Gen-Z aesthetic). User bisa toggle ke light mode. Persist preference ke `localStorage`.

```tsx
// themes.ts
export type Theme = "dark" | "light";

const THEME_KEY = "ig-checker-theme";

export function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem(THEME_KEY) as Theme;
  if (stored) return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}
```
