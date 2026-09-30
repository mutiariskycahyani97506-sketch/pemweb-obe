# SIRA-KONTRAK

## Sistem Informasi & Reservasi Kontrakan

### Identitas

- Nama: Muthiya Riski Chahyani
- NIM: 2440304002
- Mata Kuliah: Pemrograman Web
- Semester: 5
- Repository: pemweb-obe

## Deskripsi Proyek

SIRA-KONTRAK (Sistem Informasi & Reservasi Kontrakan) merupakan proyek website yang dirancang untuk memberikan informasi mengenai kamar kontrakan secara lebih terstruktur dan mudah diakses.

Landing page menampilkan informasi kamar, harga, fasilitas, status ketersediaan, serta informasi kontak.

Pada Pertemuan 3, proyek dikembangkan menjadi responsive landing page dengan menerapkan CSS modern, Flexbox, CSS Grid, custom properties, media query, dan focus state.

## Teknologi

- HTML5
- CSS3
- Flexbox
- CSS Grid
- Responsive Design
- Laragon 5
- Git
- GitHub

## Fitur Halaman

Fitur yang tersedia pada landing page:

1. Header dan navigasi
2. Hero section
3. Informasi kontrakan
4. Daftar kamar
5. Informasi harga dan status kamar
6. Informasi fasilitas
7. Form pengajuan sewa kamar dengan validasi client-side
8. Responsive layout
9. Focus state pada elemen interaktif

## Komponen Reusable

Komponen yang digunakan dalam landing page meliputi:

- Hero
- Card
- Button
- Information Card

Komponen tersebut digunakan secara konsisten untuk menjaga struktur dan tampilan halaman.

## Responsive Design

Halaman menggunakan media query untuk menyesuaikan tampilan pada berbagai ukuran layar.

Pengujian dilakukan pada:

- Mobile
- Tablet
- Desktop

CSS Grid digunakan pada bagian kartu kamar dan fasilitas, sedangkan Flexbox digunakan pada bagian header dan navigasi.

## Accessibility Check

Pemeriksaan accessibility dasar dilakukan pada halaman dengan memperhatikan:

- Keterbacaan teks
- Kontras warna
- Focus state
- Spacing antar elemen
- Target klik
- Tidak terdapat horizontal scrolling pada tampilan responsive

Focus state diterapkan menggunakan `:focus-visible` pada link, button, input, dan textarea.

## Cara Menjalankan Proyek melalui Laragon 5

1. Jalankan aplikasi Laragon 5.
2. Pastikan web server sudah berjalan.
3. Letakkan folder proyek `pemweb-obe` di dalam folder `D:\laragon\www\`.
4. Buka browser.
5. Akses URL:

   `http://localhost/pemweb-obe/`

6. Halaman SIRA-KONTRAK akan ditampilkan pada browser.

## Struktur Proyek

```text
pemweb-obe/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   ├── siraData.js
│   └── formPraktikum6.js
├── praktikum6.html
├── AI_USAGE_LOG.md
└── images/
    ├── hero-kontrakan.jpeg
    ├── kamar-a01.jpeg
    ├── kamar-a02.jpeg
    └── kamar-a03.jpeg
```

## Pertemuan 6: Form Pengajuan Sewa Kamar

Form pengajuan minat sewa kamar membantu calon penyewa memilih kamar yang tersedia, mengisi rencana mulai sewa dan durasi, lalu memeriksa kembali data melalui pratinjau. Form belum mengirim atau menyimpan data penyewa ke server maupun `localStorage`.

Validasi HTML menggunakan tipe input yang sesuai, atribut `required`, `min`, `max`, `step`, dan `maxlength`. JavaScript memeriksa nama minimal tiga karakter, format email, pilihan kamar yang masih tersedia, tanggal mulai yang tidak lampau, durasi bilangan bulat 1–12 bulan, panjang catatan, serta persetujuan.

Setiap field memiliki label dan petunjuk yang terhubung melalui `aria-describedby`. Pesan error ditampilkan dekat field, field invalid diberi `aria-invalid="true"`, ringkasan error diumumkan dengan `role="alert"`, dan fokus diarahkan ke field invalid pertama. Tautan pada ringkasan dapat memindahkan fokus ke field terkait.

### Cara Menguji Form Pertemuan 6

1. Jalankan Laragon 5 dan buka `http://localhost/pemweb-obe/`.
2. Pilih menu **Kontak** untuk menuju Form Pengajuan Sewa Kamar.
3. Kirim form kosong untuk melihat ringkasan dan pesan error.
4. Isi data valid, pilih kamar tersedia, centang persetujuan, lalu tekan **Periksa Pengajuan** untuk melihat pratinjau.

### Review Kode Berbantuan AI

Pada 30 September 2026, review kode berbantuan AI menemukan dua hal yang diperbaiki:

1. Ringkasan error memakai `role="alert"` bersama `aria-live="assertive"`. Atribut `aria-live` dihapus karena `role="alert"` sudah mengumumkan konten secara assertive.
2. Pesan di ringkasan error awalnya hanya teks. Pesan diubah menjadi tautan yang memindahkan fokus ke field terkait.

Review ini dicatat sebagai review kode berbantuan AI, bukan sebagai peer review dari teman.
