# PRD — Instagram Unfollow Checker
**Version:** 1.0.0  
**Status:** Active  
**Owner:** Product Team  
**Last Updated:** 2025

---

## 1. Executive Summary

Instagram Unfollow Checker adalah web app yang memungkinkan pengguna mengetahui siapa yang tidak follow balik mereka di Instagram, cukup dengan meng-upload atau paste data dari Instagram Data Download. Tidak ada login, tidak ada scraping, tidak ada data yang dikirim ke server — 100% privacy-first, fully client-side processing.

Target utama: pengguna Gen-Z Indonesia (15–28 tahun) yang aktif di Instagram dan peduli dengan engagement & social proof.

---

## 2. Problem Statement

### Pain Point
- Instagram tidak menyediakan fitur native untuk melihat siapa yang tidak follow balik
- Tools pihak ketiga yang ada mengharuskan login akun Instagram (berisiko banned/phished)
- Banyak tool scraping yang melanggar ToS Instagram
- Tidak ada tool yang transparent, open, dan privacy-friendly

### Opportunity
- Data download Instagram (GDPR) tersedia untuk semua pengguna
- Parsing JSON sederhana, tidak perlu backend
- Gen-Z sangat peduli dengan follower management dan social metrics

---

## 3. Goals & Success Metrics

### Goals
- G1: Pengguna dapat mengetahui unfollowers dalam < 30 detik
- G2: Zero data sent to server (full client-side)
- G3: Lighthouse score ≥ 95 semua kategori
- G4: Mobile-first, works on all devices

### Success Metrics
| Metric | Target |
|--------|--------|
| Time to result | < 30 detik dari landing |
| Bounce rate | < 40% |
| Task completion rate | > 80% |
| Core Web Vitals (LCP) | < 2.5s |
| Core Web Vitals (CLS) | < 0.1 |
| Core Web Vitals (FID) | < 100ms |

---

## 4. User Personas

### Persona 1 — "Si Curious"
- **Usia:** 17–22 tahun
- **Platform:** Instagram power user, 500–2000 following
- **Goal:** Tau siapa yang ghosting / unfollow setelah di-follow balik
- **Pain:** Capek scroll manual, takut pakai app yg butuh login

### Persona 2 — "The Manager"
- **Usia:** 22–28 tahun
- **Platform:** Content creator / influencer mikro
- **Goal:** Manage follower ratio, cek mutual, bersihkan following
- **Pain:** Butuh data akurat tanpa risiko akun kena suspend

---

## 5. User Stories

```
US-001: Sebagai pengguna, saya ingin upload file JSON Instagram saya
        agar tidak perlu paste manual ratusan username.
        DONE WHEN: Upload JSON → auto-parse → tampil result

US-002: Sebagai pengguna, saya ingin paste username satu per baris
        agar bisa pakai tool tanpa download data lengkap.
        DONE WHEN: Textarea input → parse → result

US-003: Sebagai pengguna, saya ingin melihat daftar yang tidak follow balik
        agar tahu siapa yang perlu di-unfollow.
        DONE WHEN: List unfollowers tampil dengan username + link profil

US-004: Sebagai pengguna, saya ingin melihat mutual followers
        agar tahu siapa yang saling follow.
        DONE WHEN: List mutual tampil terpisah

US-005: Sebagai pengguna, saya ingin export hasil ke CSV/TXT
        agar bisa disimpan atau diproses lebih lanjut.
        DONE WHEN: Tombol download → file terunduh

US-006: Sebagai pengguna, saya ingin data saya tidak pernah dikirim ke server
        agar privasi saya terjaga.
        DONE WHEN: Zero network request saat processing (verifiable via DevTools)

US-007: Sebagai pengguna, saya ingin ada tutorial step-by-step
        cara download data Instagram agar saya tahu prosesnya.
        DONE WHEN: Tutorial interaktif dengan screenshot/ilustrasi

US-008: Sebagai pengguna mobile, saya ingin experience yang sama baiknya
        seperti di desktop.
        DONE WHEN: Fully responsive, touch-friendly, no horizontal scroll
```

---

## 6. Features Scope

### In Scope (MVP)
- JSON file upload (following.json + followers_1.json)
- Manual paste textarea input
- Parse & compare logic (client-side)
- Result: unfollowers, mutuals, fans
- Export CSV/TXT
- Tutorial interaktif cara download data IG
- Privacy badge (no server processing)
- Stats summary (counts)

### Out of Scope (Post-MVP)
- Login dengan Instagram OAuth
- Notifikasi real-time unfollow
- History tracking antar session
- Fitur bulk unfollow (melanggar ToS)
- API backend

---

## 7. Non-Functional Requirements

| Requirement | Spec |
|-------------|------|
| Performance | LCP < 2.5s, TTI < 3.5s |
| Accessibility | WCAG 2.1 AA |
| SEO | Meta tags, OG, sitemap, robots.txt |
| Security | No external API call saat processing, CSP headers |
| Browser support | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ |
| Mobile | iOS 14+, Android 9+ |
| Bundle size | < 150KB JS (gzipped) |
| File size limit | Max 50MB per JSON file |

---

## 8. Data Flow

```
User
  │
  ├─ Upload JSON file ──────────────────────┐
  │                                          │
  └─ Paste username text ───────────────────┤
                                             │
                              ┌──────────────▼──────────────┐
                              │   CLIENT-SIDE ONLY           │
                              │   Parse → Set A (following)  │
                              │   Parse → Set B (followers)  │
                              │   Compare A vs B             │
                              │   Generate results           │
                              └──────────────┬──────────────┘
                                             │
                              ┌──────────────▼──────────────┐
                              │   UI Render                  │
                              │   • Unfollowers list         │
                              │   • Mutual list              │
                              │   • Fans list                │
                              │   • Stats summary            │
                              └──────────────┬──────────────┘
                                             │
                              ┌──────────────▼──────────────┐
                              │   Optional Export            │
                              │   CSV / TXT (local download) │
                              └─────────────────────────────┘

ZERO SERVER INTERACTION DURING PROCESSING
```

---

## 9. Acceptance Criteria

- [ ] Upload JSON berhasil parse tanpa error untuk file valid
- [ ] Error handling untuk file invalid/corrupt
- [ ] Hasil tampil dalam < 500ms setelah proses selesai
- [ ] Export file berhasil diunduh
- [ ] Zero network call tercatat di DevTools saat processing
- [ ] Responsive di 320px – 2560px viewport
- [ ] Keyboard navigable (tab, enter)
- [ ] Screen reader compatible (ARIA labels)

---

## 10. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Instagram mengubah format JSON export | High | Versioned parser, fallback ke manual input |
| File terlalu besar (> 50MB) | Medium | File size validation + chunked processing |
| Browser memory issue (10k+ following) | Medium | Web Worker untuk parsing heavy data |
| SEO rendah (no SSR content) | Low | Static landing + metadata yang kuat |