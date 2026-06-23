# DESIGN.md

## Visual Thesis
Website terasa seperti tool Gen-Z yang bersih, tajam, dan mudah dibaca. Dark mode default memakai latar hitam netral, panel charcoal, aksen lime, dan status teal. Tidak memakai ungu atau pink.

## Prinsip
- Prioritaskan keterbacaan daripada efek dekoratif.
- Satu warna aksi utama: lime.
- Satu warna status aman: teal.
- Latar memakai hitam netral atau putih netral.
- Hindari ungu, violet, lavender, indigo, pink, rose, fuchsia, dan magenta.
- Gunakan panel solid atau semi-solid. Jangan blur ekstrem.
- Gunakan transisi warna halus untuk theme switch, hover, border, dan button.
- Hindari AI slop: gradient ramai, glow besar, kartu terlalu banyak, dan copy panjang.

## Warna

### Dark Default
```css
--bg: #08090c;
--bg-soft: #10141a;
--surface: #131821;
--surface-strong: #18202b;
--text: #f8fafc;
--text-muted: #b6c0cc;
--border: rgba(248, 250, 252, 0.14);
--accent: #a3e635;
--accent-strong: #65a30d;
--accent-text: #102000;
--safe: #19c6a3;
--info: #38bdf8;
--shadow: rgba(0, 0, 0, 0.34);
```

### Light Mode
```css
--bg: #f8fafc;
--bg-soft: #eef3f8;
--surface: #ffffff;
--surface-strong: #f2f6fb;
--text: #0b1117;
--text-muted: #526070;
--border: rgba(11, 17, 23, 0.13);
--accent: #84cc16;
--accent-strong: #4d7c0f;
--accent-text: #102000;
--safe: #059b80;
--info: #0284c7;
--shadow: rgba(15, 23, 42, 0.12);
```

## Typography
- Font utama: Geist Sans.
- Font data: Geist Mono.
- Hero desktop: 64 sampai 96px.
- Hero mobile: 42 sampai 56px.
- Heading section: 28 sampai 40px.
- Body: 16 sampai 18px.
- Body memakai warna `--text-muted` hanya untuk teks pendukung.
- Label, tombol, dan username harus kontras tinggi.

## Layout
- Header floating tipis.
- Hero full bleed, tanpa card hero.
- Workspace dua kolom di desktop, satu kolom di mobile.
- Panel form dan hasil memakai surface solid agar teks mudah dibaca.
- Tutorial menjadi strip tiga langkah.
- Mobile tap target minimal 44px.

## Komponen

### Button
- Primary lime solid dengan teks gelap.
- Secondary surface solid dengan border jelas.
- Hover naik 1px.
- Active turun 1px.

### Input
- Background `--surface-strong`.
- Border terlihat di dark dan light.
- Placeholder harus terbaca di dark dan light.
- Focus ring lime.

### Result Row
- Divider tipis.
- Username pakai mono.
- Hover pakai lime tint 10 persen.

### Badge
- Privacy atau status aman pakai teal.
- Counter pakai surface strong.

## Motion
```css
--ease-out: cubic-bezier(0.22, 1, 0.36, 1);
--ease-soft: cubic-bezier(0.16, 1, 0.3, 1);
--duration-fast: 160ms;
--duration-base: 260ms;
--duration-slow: 520ms;
```
- Semua background, color, border, shadow, opacity, dan transform wajib transition halus.
- Theme switch tidak boleh patah warna.
- Hero boleh fade dan translate ringan.
- Hindari blur animasi besar.
- Respect `prefers-reduced-motion`.

## Accessibility
- Body text minimal 4.5:1.
- Large heading minimal 3:1.
- Focus ring terlihat.
- Skip link wajib.
- Label input wajib.
- `aria-live` untuk error dan hasil.
- Jangan mengandalkan warna saja.

## Larangan
- Jangan pakai ungu, violet, lavender, indigo, pink, rose, fuchsia, atau magenta.
- Jangan pakai gradient ungu atau pink.
- Jangan pakai glow besar.
- Jangan pakai blur ekstrem.
- Jangan pakai glass effect yang menurunkan kontras.
- Jangan pakai copy panjang.
