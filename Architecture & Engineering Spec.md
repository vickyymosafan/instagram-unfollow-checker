# FULLSTACK NEXT.JS — Architecture & Engineering Spec

**Project:** Instagram Unfollow Checker  
**Stack:** Next.js 15 (App Router) + TypeScript  
**Principle:** Clean Code + Clean Architecture + Performance-First

---

## 1. Tech Stack

```
Framework:     Next.js 15 (App Router)
Language:      TypeScript 5.x (strict mode)
Styling:       Tailwind CSS v4 + CSS Variables
UI Components: shadcn/ui (customized)
Icons:         Lucide React
Fonts:         Google Fonts (Space Grotesk + Inter + JetBrains Mono)
State:         Zustand (lightweight, no Redux overhead)
Animation:     Framer Motion (tree-shakeable)
Testing:       Vitest + Testing Library + Playwright (E2E)
Linting:       ESLint + Prettier + Husky
Bundler:       Turbopack (built-in Next.js 15)
Deployment:    Vercel (edge network)
Analytics:     Vercel Analytics (privacy-first, no cookies)
```

---

## 2. Project Structure (Clean Architecture)

```
ig-unfollow-checker/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Landing page (/)
│   │   ├── checker/
│   │   │   └── page.tsx              # Checker tool (/checker)
│   │   ├── tutorial/
│   │   │   └── page.tsx              # Tutorial (/tutorial)
│   │   ├── globals.css               # Global styles + CSS variables
│   │   ├── fonts.ts                  # Font config
│   │   └── sitemap.ts                # Sitemap generator
│   │
│   ├── domain/                       # DOMAIN LAYER — pure business logic
│   │   ├── entities/
│   │   │   ├── User.ts               # User entity
│   │   │   └── CheckResult.ts        # Result entity
│   │   ├── use-cases/
│   │   │   ├── compareFollowers.ts   # Core comparison logic
│   │   │   ├── parseJsonFile.ts      # JSON parser use case
│   │   │   └── exportResults.ts      # Export use case
│   │   └── repositories/
│   │       └── IUserRepository.ts    # Interface (no implementation here)
│   │
│   ├── infrastructure/               # INFRASTRUCTURE LAYER
│   │   ├── parsers/
│   │   │   ├── instagramJsonParser.ts  # Parse IG JSON format
│   │   │   └── textParser.ts           # Parse plain text input
│   │   ├── exporters/
│   │   │   ├── csvExporter.ts
│   │   │   └── txtExporter.ts
│   │   └── storage/
│   │       └── localStorageAdapter.ts  # Theme persistence
│   │
│   ├── application/                  # APPLICATION LAYER
│   │   ├── stores/
│   │   │   ├── checkerStore.ts       # Zustand store for checker
│   │   │   └── themeStore.ts         # Theme store
│   │   ├── hooks/
│   │   │   ├── useChecker.ts         # Main checker hook
│   │   │   ├── useFileUpload.ts      # File upload handler
│   │   │   ├── useExport.ts          # Export handler
│   │   │   └── useTheme.ts           # Theme hook
│   │   └── dto/
│   │       ├── CheckerInput.dto.ts
│   │       └── CheckResult.dto.ts
│   │
│   ├── presentation/                 # PRESENTATION LAYER
│   │   ├── components/
│   │   │   ├── ui/                   # Base UI components (shadcn-based)
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   └── ...
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── ThemeToggle.tsx
│   │   │   ├── checker/
│   │   │   │   ├── CheckerForm.tsx
│   │   │   │   ├── DropZone.tsx
│   │   │   │   ├── TextInput.tsx
│   │   │   │   ├── ResultSection.tsx
│   │   │   │   ├── UserList.tsx
│   │   │   │   ├── StatCard.tsx
│   │   │   │   └── ExportButtons.tsx
│   │   │   ├── landing/
│   │   │   │   ├── HeroSection.tsx
│   │   │   │   ├── FeatureSection.tsx
│   │   │   │   ├── HowItWorks.tsx
│   │   │   │   ├── PrivacyBadge.tsx
│   │   │   │   └── CTASection.tsx
│   │   │   └── tutorial/
│   │   │       ├── TutorialSteps.tsx
│   │   │       └── StepCard.tsx
│   │   └── providers/
│   │       └── ThemeProvider.tsx
│   │
│   ├── shared/                       # SHARED UTILITIES
│   │   ├── constants/
│   │   │   ├── routes.ts
│   │   │   └── config.ts
│   │   ├── utils/
│   │   │   ├── cn.ts                 # classnames helper
│   │   │   ├── formatNumber.ts
│   │   │   └── debounce.ts
│   │   └── types/
│   │       └── index.ts              # Global type definitions
│   │
│   └── workers/                      # WEB WORKERS
│       └── parserWorker.ts           # Heavy parsing off main thread
│
├── public/
│   ├── fonts/                        # Self-hosted fonts (performance)
│   ├── images/
│   ├── og-image.png                  # Open Graph image
│   └── favicon.ico
│
├── tests/
│   ├── unit/
│   │   ├── domain/
│   │   └── infrastructure/
│   ├── integration/
│   └── e2e/
│
├── .env.local                        # Environment variables
├── next.config.ts                    # Next.js config
├── tailwind.config.ts                # Tailwind config
├── tsconfig.json                     # TypeScript config (strict)
└── package.json
```

---

## 3. Domain Layer — Entities & Core Logic

### User Entity

```typescript
// src/domain/entities/User.ts

export interface User {
  readonly username: string;
  readonly profileUrl: string;
}

export function createUser(username: string): User {
  const sanitized = username.trim().toLowerCase().replace(/^@/, "");
  if (!sanitized) throw new Error("Username cannot be empty");
  return {
    username: sanitized,
    profileUrl: `https://instagram.com/${sanitized}`,
  };
}
```

### CheckResult Entity

```typescript
// src/domain/entities/CheckResult.ts

export interface CheckResult {
  readonly unfollowers: ReadonlyArray<string>; // kamu follow, mereka tidak
  readonly mutuals: ReadonlyArray<string>; // saling follow
  readonly fans: ReadonlyArray<string>; // mereka follow, kamu tidak
  readonly stats: {
    readonly totalFollowing: number;
    readonly totalFollowers: number;
    readonly unfollowerCount: number;
    readonly mutualCount: number;
    readonly fanCount: number;
    readonly followRatio: number;
  };
}
```

### Core Use Case — Compare Followers

```typescript
// src/domain/use-cases/compareFollowers.ts

import type { CheckResult } from "../entities/CheckResult";

/**
 * Pure function — zero side effects, zero dependencies.
 * Testable in isolation.
 */
export function compareFollowers(
  following: ReadonlySet<string>,
  followers: ReadonlySet<string>,
): CheckResult {
  const unfollowers: string[] = [];
  const mutuals: string[] = [];
  const fans: string[] = [];

  for (const user of following) {
    if (followers.has(user)) {
      mutuals.push(user);
    } else {
      unfollowers.push(user);
    }
  }

  for (const user of followers) {
    if (!following.has(user)) {
      fans.push(user);
    }
  }

  const totalFollowing = following.size;
  const totalFollowers = followers.size;
  const followRatio =
    totalFollowers > 0
      ? Number((totalFollowers / totalFollowing).toFixed(2))
      : 0;

  return {
    unfollowers: unfollowers.sort(),
    mutuals: mutuals.sort(),
    fans: fans.sort(),
    stats: {
      totalFollowing,
      totalFollowers,
      unfollowerCount: unfollowers.length,
      mutualCount: mutuals.length,
      fanCount: fans.length,
      followRatio,
    },
  };
}
```

---

## 4. Infrastructure Layer — Parsers

### Instagram JSON Parser

```typescript
// src/infrastructure/parsers/instagramJsonParser.ts

/**
 * Parses Instagram's official data download JSON format.
 * Handles both "following.json" and "followers_1.json" structures.
 */
export function parseInstagramJson(raw: string): Set<string> {
  const data = JSON.parse(raw);
  const usernames = new Set<string>();

  // Format 1: Array of objects with string_list_data
  // (followers_1.json, following.json — most common)
  if (Array.isArray(data)) {
    for (const item of data) {
      const entries = item?.string_list_data ?? [];
      for (const entry of entries) {
        if (entry?.value) usernames.add(normalizeUsername(entry.value));
      }
    }
    return usernames;
  }

  // Format 2: Object with relationships_following key
  if (data?.relationships_following) {
    for (const item of data.relationships_following) {
      const entries = item?.string_list_data ?? [];
      for (const entry of entries) {
        if (entry?.value) usernames.add(normalizeUsername(entry.value));
      }
    }
    return usernames;
  }

  throw new Error(
    "Unrecognized Instagram JSON format. Please use the correct file.",
  );
}

function normalizeUsername(raw: string): string {
  return raw.trim().toLowerCase().replace(/^@/, "");
}
```

### Text Parser

```typescript
// src/infrastructure/parsers/textParser.ts

export function parseTextInput(raw: string): Set<string> {
  return new Set(
    raw
      .split(/[\n,;\s]+/)
      .map((s) => s.trim().toLowerCase().replace(/^@/, ""))
      .filter(Boolean),
  );
}
```

---

## 5. Application Layer — Zustand Store

```typescript
// src/application/stores/checkerStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { CheckResult } from "@/domain/entities/CheckResult";

type CheckerState = {
  // Input
  followingInput: string;
  followersInput: string;
  inputMode: "text" | "file";

  // Processing
  isProcessing: boolean;
  error: string | null;

  // Output
  result: CheckResult | null;

  // Actions
  setFollowingInput: (v: string) => void;
  setFollowersInput: (v: string) => void;
  setInputMode: (mode: "text" | "file") => void;
  setResult: (result: CheckResult) => void;
  setError: (error: string | null) => void;
  setProcessing: (v: boolean) => void;
  reset: () => void;
};

const initialState = {
  followingInput: "",
  followersInput: "",
  inputMode: "text" as const,
  isProcessing: false,
  error: null,
  result: null,
};

export const useCheckerStore = create<CheckerState>()(
  devtools(
    (set) => ({
      ...initialState,
      setFollowingInput: (v) => set({ followingInput: v, error: null }),
      setFollowersInput: (v) => set({ followersInput: v, error: null }),
      setInputMode: (mode) => set({ inputMode: mode }),
      setResult: (result) => set({ result, isProcessing: false, error: null }),
      setError: (error) => set({ error, isProcessing: false }),
      setProcessing: (isProcessing) => set({ isProcessing }),
      reset: () => set(initialState),
    }),
    { name: "checker-store" },
  ),
);
```

---

## 6. Custom Hooks

```typescript
// src/application/hooks/useChecker.ts
"use client";

import { useCallback } from "react";
import { useCheckerStore } from "@/application/stores/checkerStore";
import { compareFollowers } from "@/domain/use-cases/compareFollowers";
import { parseTextInput } from "@/infrastructure/parsers/textParser";
import { parseInstagramJson } from "@/infrastructure/parsers/instagramJsonParser";

export function useChecker() {
  const store = useCheckerStore();

  const runCheck = useCallback(async () => {
    if (!store.followingInput.trim() || !store.followersInput.trim()) {
      store.setError("Harap isi kedua kolom terlebih dahulu.");
      return;
    }

    store.setProcessing(true);
    store.setError(null);

    // Use Web Worker for large datasets to avoid blocking UI
    try {
      // Small dataset: process inline
      // Large dataset (>5k entries): offload to worker
      const following = parseTextInput(store.followingInput);
      const followers = parseTextInput(store.followersInput);

      if (following.size === 0) {
        store.setError("Data following tidak valid atau kosong.");
        return;
      }

      const result = compareFollowers(following, followers);
      store.setResult(result);
    } catch (err) {
      store.setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    }
  }, [store]);

  const handleFileUpload = useCallback(
    async (file: File, type: "following" | "followers") => {
      if (file.size > 50 * 1024 * 1024) {
        store.setError("File terlalu besar (maks. 50MB).");
        return;
      }

      try {
        const text = await file.text();
        const usernames = parseInstagramJson(text);
        const formatted = Array.from(usernames).join("\n");

        if (type === "following") {
          store.setFollowingInput(formatted);
        } else {
          store.setFollowersInput(formatted);
        }
      } catch {
        store.setError(
          `Gagal membaca file. Pastikan file ${type}.json dari Instagram.`,
        );
      }
    },
    [store],
  );

  return {
    ...store,
    runCheck,
    handleFileUpload,
    followingCount: store.followingInput
      ? store.followingInput.split("\n").filter(Boolean).length
      : 0,
    followersCount: store.followersInput
      ? store.followersInput.split("\n").filter(Boolean).length
      : 0,
  };
}
```

---

## 7. Next.js Configuration

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance: experimental features
  experimental: {
    optimizeCss: true, // Critters CSS optimization
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline'", // Next.js needs this
              "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
              "font-src 'self' fonts.gstatic.com",
              "img-src 'self' data: blob:",
              "connect-src 'self'",
              "worker-src 'self' blob:", // Web Workers
            ].join("; "),
          },
        ],
      },
    ];
  },

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
  },

  // Bundle analyzer (dev only)
  ...(process.env.ANALYZE === "true" &&
    {
      // next-bundle-analyzer setup
    }),
};

export default nextConfig;
```

---

## 8. TypeScript Config

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "exactOptionalPropertyTypes": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## 9. Performance Principles

### 9.1 Code Splitting

```typescript
// Lazy load heavy components
import dynamic from 'next/dynamic'

const ResultSection = dynamic(
  () => import('@/presentation/components/checker/ResultSection'),
  {
    loading: () => <ResultSkeleton />,
    ssr: false, // Client-only (uses browser APIs)
  }
)
```

### 9.2 Web Worker untuk heavy processing

```typescript
// src/workers/parserWorker.ts
// Runs in separate thread — never blocks UI

self.addEventListener("message", (event: MessageEvent) => {
  const { type, payload } = event.data;

  if (type === "PARSE_AND_COMPARE") {
    try {
      const { followingRaw, followersRaw } = payload;
      // ... heavy processing
      self.postMessage({ type: "RESULT", payload: result });
    } catch (err) {
      self.postMessage({ type: "ERROR", payload: err.message });
    }
  }
});
```

### 9.3 Tailwind Purge

```typescript
// tailwind.config.ts
export default {
  content: ["./src/**/*.{ts,tsx}"],
  // Only include what's used — zero bloat
};
```

### 9.4 Font Optimization

```typescript
// src/app/fonts.ts
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";

export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  preload: true,
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  preload: true,
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  preload: false, // Less critical
});
```

---

## 10. Metadata & SEO

```typescript
// src/app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "IG Unfollow Checker — Cek Siapa yang Gak Follow Balik",
    template: "%s | IG Unfollow Checker",
  },
  description:
    "Cek siapa yang unfollow atau tidak follow balik Instagram kamu. 100% gratis, privacy-first, tanpa login. Upload data Instagram, langsung ketahuan.",
  keywords: [
    "instagram unfollow checker",
    "cek unfollow instagram",
    "siapa yang tidak follow balik",
    "instagram followers checker",
  ],
  openGraph: {
    title: "IG Unfollow Checker",
    description:
      "Cek unfollowers Instagram kamu. Gratis, tanpa login, 100% private.",
    url: "https://ig-checker.vercel.app",
    siteName: "IG Unfollow Checker",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IG Unfollow Checker",
    description: "Cek unfollowers Instagram kamu. Gratis & privacy-first.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};
```

---

## 11. Testing Strategy

```
Unit Tests (Vitest):
  - compareFollowers() — semua edge cases
  - parseInstagramJson() — berbagai format
  - parseTextInput() — special chars, encoding
  - exportResults() — output validation

Integration Tests (Testing Library):
  - CheckerForm — upload + paste flow
  - ResultSection — render dengan mock data

E2E Tests (Playwright):
  - Happy path: upload JSON → lihat hasil
  - Happy path: paste text → lihat hasil
  - Export CSV download
  - Mobile viewport (375px)
  - Error states
```

---

## 12. Git Commit Convention

```
feat: tambah fitur baru
fix: perbaiki bug
perf: improvement performa
style: perubahan styling (tidak mengubah logic)
refactor: restructure kode
test: tambah/update tests
docs: update dokumentasi
chore: update dependencies, config
```
