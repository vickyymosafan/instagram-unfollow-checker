# Instagram Unfollow Checker

Tool web untuk cek akun Instagram yang tidak follow balik. Kamu cukup upload file data resmi dari Instagram atau paste username manual.

## Fitur

- Cek akun yang tidak follow balik.
- Lihat mutual followers.
- Lihat fans, yaitu followers yang belum kamu follow balik.
- Upload `followers_1.json` dan `following.json`.
- Paste username manual, satu username per baris.
- Export hasil ke CSV atau TXT.
- Semua proses berjalan di browser.
- Tidak perlu login Instagram.
- Tidak ada backend untuk membaca data kamu.

## Cara Pakai

1. Buka aplikasi.
2. Upload file `followers_1.json` di bagian Followers.
3. Upload file `following.json` di bagian Following.
4. Klik `Proses data lokal`.
5. Buka tab hasil sesuai kebutuhan.
6. Klik CSV atau TXT jika ingin menyimpan hasil.

## Cara Ambil Data Instagram

1. Buka Instagram Accounts Center.
2. Pilih `Your information and permissions`.
3. Pilih `Download your information`.
4. Minta data followers dan following.
5. Pilih format JSON.
6. Setelah file siap, download dan ekstrak ZIP.
7. Cari file `followers_1.json` dan `following.json`.

## Privasi

Aplikasi ini membaca file langsung di browser kamu.
Data tidak dikirim ke server saat proses cek berjalan.
Aplikasi ini tidak meminta password, token, cookie, atau login Instagram.

## Menjalankan Project

Pastikan Node.js sudah terpasang.

```bash
npm install
npm run dev
```

Buka:

```bash
http://localhost:3000
```

## Build Production

```bash
npm run build
npm run start
```

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4

## Struktur Penting

- `app/page.tsx` untuk UI dan logic checker.
- `app/globals.css` untuk design system dan styling.
- `DESIGN.md` untuk panduan visual.
- `PRD.md` untuk kebutuhan produk.
- `LICENSE` untuk lisensi project.

## Lisensi

Project ini menggunakan lisensi custom `vickymosafan`.
Lihat file `LICENSE` untuk detail lengkap.
