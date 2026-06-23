# DESIGN.md

## Visual Thesis
Website terasa seperti studio tool Gen-Z yang rapi. Gelap default, material kaca tipis, aksen coral dan mint, tanpa ungu.

## Prinsip
- Produk harus terbaca dalam 3 detik.
- Satu aksen utama, coral pink.
- Mint hanya untuk status aman.
- Gunakan ruang kosong, bukan banyak kartu.
- Panel hanya untuk area interaksi.
- Transisi warna wajib halus.
- Hindari dekorasi ramai, emoji berlebihan, ikon generik, dan efek AI slop.

## Warna

### Dark Default
```css
--bg: #07080b;
--bg-soft: #0d1016;
--surface: rgba(18, 21, 29, 0.78);
--surface-strong: #151923;
--text: #f7f7fb;
--text-muted: #9aa3b2;
--border: rgba(255, 255, 255, 0.11);
--accent: #ff3ea5;
--accent-strong: #ff2f87;
--safe: #25e0b7;
--warm: #ff8a3d;
--shadow: rgba(0, 0, 0, 0.36);
```

### Light Mode
```css
--bg: #fbfcff;
--bg-soft: #f1f5f9;
--surface: rgba(255, 255, 255, 0.82);
--surface-strong: #ffffff;
--text: #080a10;
--text-muted: #647084;
--border: rgba(8, 10, 16, 0.11);
--accent: #f72f9d;
--accent-strong: #e72583;
--safe: #00b894;
--warm: #f97316;
--shadow: rgba(15, 23, 42, 0.12);
```

## Typography
- Font utama: Geist Sans.
- Font data: Geist Mono.
- Hero: 56 sampai 88px desktop, 42 sampai 56px mobile.
- Heading section: 28 sampai 40px.
- Body: 16 sampai 18px.
- Gunakan font weight 800 sampai 950 untuk headline.
- Gunakan tracking rapat untuk headline, normal untuk body.

## Layout
- Header tipis, floating, transparan.
- Hero full bleed, bukan card.
- Hero punya satu visual anchor berupa mesh gradient coral, mint, warm.
- Checker menjadi workspace dua kolom di desktop.
- Form di kiri, hasil di kanan.
- Tutorial menjadi strip tiga langkah, singkat.
- Mobile satu kolom, tap target minimal 44px.

## Komponen

### Button
- Primary coral solid.
- Secondary transparan dengan border halus.
- Hover naik 1 sampai 2px.
- Active turun 1px.

### Input
- Background memakai surface strong.
- Border halus.
- Focus pakai ring coral.
- File input terlihat seperti drop zone.

### Result Row
- Baris bersih dengan divider tipis.
- Username pakai mono.
- Hover pakai tint coral sangat tipis.

### Badge
- Privacy badge pakai mint tint.
- Counter kecil pakai surface soft.

## Motion
```css
--ease-out: cubic-bezier(0.22, 1, 0.36, 1);
--ease-soft: cubic-bezier(0.16, 1, 0.3, 1);
--duration-fast: 160ms;
--duration-base: 260ms;
--duration-slow: 520ms;
```
- Semua perubahan background, color, border, shadow, transform memakai transition halus.
- Theme switch memakai transition global 260ms sampai 520ms.
- Hero masuk dengan fade dan translate kecil.
- Panel interaksi punya hover lembut.
- Respect `prefers-reduced-motion`.

## Accessibility
- Contrast body minimal 4.5:1.
- Focus ring terlihat.
- Skip link wajib.
- Label input wajib.
- `aria-live` untuk error dan hasil.
- Jangan mengandalkan warna saja.

## Larangan
- Jangan pakai ungu.
- Jangan pakai gradient pelangi.
- Jangan pakai card grid berlebihan.
- Jangan pakai efek blur ekstrem.
- Jangan pakai copy panjang.
- Jangan tambah dependency untuk visual dasar.
