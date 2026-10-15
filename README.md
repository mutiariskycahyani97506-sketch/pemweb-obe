# PTS Pemrograman Web — Velvet & Co

Katalog groceries berbasis REST API DummyJSON, dibuat sebagai mini project front-end individual untuk PTS Pemrograman Web.

## Identitas

- **Nama:** Muthiya Riski Chahyani
- **NIM:** 2440304002
- **Kelas:** A1 Teknik Komputer
- **Nama aplikasi:** Velvet & Co — Katalog Groceries

## Deskripsi aplikasi

Velvet & Co menampilkan produk dari kategori groceries DummyJSON. Pengguna dapat mencari produk secara real-time, mengurutkan katalog, melihat ringkasan data, dan mengirim catatan minat melalui formulir. Aplikasi dibuat menggunakan HTML, CSS, dan Vanilla JavaScript.

Harga asli API berformat USD. Aplikasi mengubah tampilannya menjadi Rupiah menggunakan kurs simulasi tetap US$1 = Rp16.000. Ini hanya konversi tampilan untuk demonstrasi, bukan kurs real-time, dan tidak mengubah data asli API.

## Perhitungan varian NIM

Tiga digit terakhir NIM 2440304002 adalah **002**.

- X = 0
- Y = 0
- Z = 2
- S = X + Y + Z = 0 + 0 + 2 = 2
- C = S mod 4 = 2 mod 4 = 2

Varian project:

- **Dataset X=0:** Products, menggunakan kategori groceries DummyJSON.
- **Fitur Y=0:** pencarian real-time dan pengurutan produk.
- **Validasi Z=2:** catatan minat minimal 30 karakter setelah spasi awal dan akhir dihapus.
- **Challenge C=2:** indikator loading dan pencarian dengan debounce.

## Dataset dan endpoint

- **Sumber:** DummyJSON Products API, kategori groceries.
- **Endpoint:** `https://dummyjson.com/products/category/groceries?limit=0`
- **Method:** GET
- **Format respons:** JSON
- **Data yang digunakan:** `title`, `description`, `category`, `price`, `rating`, dan `thumbnail`.
- **Koneksi:** membutuhkan internet.

Endpoint memakai `limit=0` agar seluruh data kategori yang tersedia diminta. Jumlah produk mengikuti data yang dikembalikan API.

## Analisis data

Aplikasi menghitung informasi berikut secara otomatis dari produk yang berhasil dimuat:

1. Rata-rata harga produk.
2. Jumlah kategori unik.
3. Harga tertinggi beserta nama produknya.

Perhitungan dilakukan dalam JavaScript dengan `reduce()`, `map()`, dan `Set`. Harga dalam analisis ditampilkan dengan konversi Rupiah simulasi yang sama seperti kartu produk.

## Fitur dan validasi

- Pencarian berdasarkan nama, deskripsi, kategori, dan merek.
- Debounce pencarian selama 300 milidetik.
- Pengurutan berdasarkan harga naik/turun, rating, dan nama.
- Ringkasan analisis data dari respons API.
- Indikator loading, pesan error, dan tombol coba lagi.
- Formulir catatan minat dengan validasi nama, produk, serta catatan minimal 30 karakter.
- Tampilan responsive untuk desktop dan mobile.
- Format harga IDR menggunakan kurs simulasi tetap; API sumber tetap menyimpan harga USD.

## Cara menjalankan

1. Simpan atau salin folder project ke direktori `www` Laragon.
2. Jalankan Laragon dan aktifkan Apache.
3. Buka `http://localhost/pemweb-obe/pts.html` atau domain lokal Laragon yang sudah dikonfigurasi.
4. Pastikan koneksi internet aktif agar data dapat diambil dari DummyJSON.
5. Jika data gagal dimuat, pilih tombol **Coba lagi**.

## Screenshot

Tambahkan bukti screenshot dari aplikasi yang benar-benar dijalankan:

- **Desktop:** simpan sebagai `screenshots/desktop.png` lalu tampilkan di sini.
- **Mobile:** simpan sebagai `screenshots/mobile.png` lalu tampilkan di sini.

## Jawaban pertanyaan penjelasan kode

### 1. Jelaskan alur sejak halaman dibuka sampai data REST API tampil. Sebutkan nama fungsi pada project Anda.

Saat `pts.html` dibuka, browser memuat `js/pts-dashboard.js` melalui atribut `defer`, sehingga JavaScript dijalankan setelah struktur HTML selesai dibaca. Fungsi `loadProducts()` menampilkan indikator loading dengan `showLoading()` dan mengambil data dari `API_URL` menggunakan `fetch()`. Setelah respons berhasil, data diubah menjadi JSON dan disimpan ke variabel `products`. Fungsi `showInsights()` menghitung ringkasan, `fillProductOptions()` mengisi pilihan produk pada formulir, dan `renderProducts()` menampilkan daftar. Fungsi `createProductCard()` membuat elemen DOM untuk setiap kartu. Harga API dalam USD ditampilkan dalam Rupiah oleh `formatRupiah()` menggunakan kurs simulasi tetap.

### 2. Mengapa setelah `fetch()` selesai Anda masih perlu memeriksa `response.ok`? Jelaskan dengan kasus pada aplikasi Anda.

`fetch()` tidak otomatis menganggap status HTTP seperti 404 atau 500 sebagai error. Karena itu, aplikasi memeriksa `response.ok`. Jika endpoint kategori groceries salah atau server mengembalikan status gagal, kode melempar error sebelum memproses JSON sebagai daftar produk. Error tersebut kemudian ditangani oleh `catch` dalam `loadProducts()`.

### 3. Pilih satu data JSON dari API dan jelaskan bagaimana data tersebut diubah menjadi elemen DOM yang terlihat.

Contohnya, objek produk Apple dari API memiliki informasi seperti `title`, `thumbnail`, `description`, `category`, `price`, dan `rating`. Fungsi `createProductCard(item)` membuat elemen kartu dengan `document.createElement()`. Nilai `thumbnail` digunakan sebagai sumber gambar, `title` menjadi nama produk, dan `description` menjadi deskripsi. Harga ditampilkan melalui `formatRupiah()`, sementara rating ditampilkan sebagai teks. `renderProducts()` memasukkan kartu yang sudah dibuat ke halaman.

### 4. Apa yang terjadi jika internet terputus, endpoint salah, atau server mengembalikan HTTP 404/500? Jelaskan penanganannya.

Jika internet terputus, `fetch()` gagal dan masuk ke `catch`. Jika endpoint salah atau server memberi status 404/500, pemeriksaan `response.ok` membuat kode melempar error. Aplikasi menampilkan pesan pada `error-panel` dan status bahwa data gagal dimuat. Bagian `finally` tetap menyembunyikan indikator loading dan mengaktifkan tombol **Coba lagi**.

### 5. Jelaskan bagaimana fitur berdasarkan digit Y bekerja. Cantumkan nama fungsi/event yang digunakan.

Digit Y saya adalah 0, sehingga fiturnya adalah pencarian real-time dan pengurutan. Pencarian memakai event `input` pada kolom pencarian. Perubahan input memperbarui `searchTerm`, membatalkan timer sebelumnya, lalu menjadwalkan pencarian setelah 300 milidetik. Fungsi `getVisibleProducts()` menyaring produk berdasarkan nama, deskripsi, kategori, atau merek. Pengurutan memakai event `change` pada `sortSelect` dan juga diproses oleh `getVisibleProducts()`.

### 6. Jelaskan bagaimana validasi berdasarkan digit Z bekerja dan mengapa input tidak valid tidak boleh langsung diproses.

Digit Z saya adalah 2, sehingga catatan minat harus berisi minimal 30 karakter. Event `submit` mencegah formulir langsung diproses. Isi catatan dibersihkan dengan `trim()`, lalu panjangnya diperiksa. Jika kurang dari 30 karakter, aplikasi menampilkan pesan kesalahan, memberi atribut `aria-invalid`, dan memindahkan fokus ke input bermasalah. Input yang belum valid tidak diproses agar data memenuhi ketentuan.

### 7. Jika project Anda menggunakan `localStorage`, jelaskan data yang disimpan. Jika tidak, jelaskan skenario penerapannya.

Project ini belum menggunakan `localStorage`. Salah satu penerapannya adalah menyimpan pilihan pengurutan produk. Nilai sorting dapat disimpan saat event `change` pada pilihan urutan terjadi, lalu dibaca kembali ketika halaman dibuka agar preferensi pengguna tetap digunakan setelah halaman dimuat ulang.

### 8. Pilih satu fungsi JavaScript penting, lampirkan potongan maksimal 15 baris, lalu jelaskan input–proses–output.

Fungsi `getVisibleProducts()` menerima daftar dari `products`, kata pencarian dari `searchTerm`, dan pilihan urutan dari `sortSelect`. Fungsi menyaring data berdasarkan kata pencarian, lalu mengurutkan hasilnya. Output berupa array produk yang siap ditampilkan.

```js
function getVisibleProducts() {
  const query = searchTerm.trim().toLocaleLowerCase('id');
  const matches = products.filter(item =>
    `${item.title} ${item.description} ${item.category} ${item.brand ?? ''}`
      .toLocaleLowerCase('id').includes(query)
  );
  const sortBy = sortSelect.value;
  const sorters = {
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    'rating-desc': (a, b) => b.rating - a.rating,
    'title-asc': (a, b) => a.title.localeCompare(b.title, 'id')
  };
  return matches.sort(sorters[sortBy] ?? ((a, b) => a.id - b.id));
}
```

### 9. Sebutkan bug/error paling sulit selama PTS, penyebabnya, cara menemukannya, dan cara memperbaikinya.

Masalah paling menonjol adalah data yang tampil belum sesuai dengan konsep katalog. Endpoint awal mengambil semua kategori Products, sehingga muncul produk dari kategori lain. Saya menemukan penyebabnya dengan membandingkan produk yang tampil dengan nilai `API_URL` pada `js/pts-dashboard.js`. Endpoint lalu diubah menjadi kategori groceries, sehingga katalog mengambil data yang sesuai dengan konsep project. Masalah ini merupakan ketidaksesuaian sumber data dengan konsep, bukan error sintaks JavaScript.

### 10. Jika diberi satu minggu lagi, sebutkan dua perbaikan teknis yang akan Anda lakukan dan alasannya.

1. Saya akan menambahkan penyimpanan data katalog terakhir yang berhasil dimuat menggunakan `localStorage`, sehingga data terakhir dapat tetap ditampilkan ketika koneksi internet bermasalah.
2. Saya akan menggunakan API kurs untuk memperoleh konversi USD ke Rupiah yang lebih baru. Jika API kurs gagal diakses, aplikasi akan menampilkan pesan dan memakai kurs simulasi sebagai nilai cadangan.

## AI Usage Log

AI digunakan untuk brainstorming, memahami varian, membantu pengembangan tampilan dan logika, serta menjelaskan kode. Saya meninjau hasilnya, memberi arahan perubahan, dan perlu memastikan memahami setiap fungsi sebelum demo atau defense. AI tidak menggantikan tanggung jawab saya untuk memeriksa dan menjelaskan project.

| Tanggal | AI/Tool | Tujuan | Prompt/Ringkasan | Bagian Digunakan | Verifikasi/Modifikasi |
|---|---|---|---|---|---|
| 15 Oktober 2026 | ChatGPT/Codex | Memahami varian PTS dan merencanakan konsep | Menghitung varian NIM 002 dan membahas konsep yang sesuai soal | Perhitungan varian, deskripsi, fitur | Varian dicocokkan dengan NIM; konsep akhir dipilih menjadi katalog groceries. |
| 15 Oktober 2026 | ChatGPT/Codex | Membantu mengembangkan dashboard | Menyesuaikan teks, ilustrasi, warna, dan tampilan dari tema kafe menjadi groceries | `pts.html`, `css/pts-dashboard.css` | Tampilan lokal ditinjau melalui browser dan diarahkan ulang sesuai preferensi mahasiswa. |
| 15 Oktober 2026 | ChatGPT/Codex | Menampilkan harga dalam Rupiah | Mengonversi tampilan harga USD dengan kurs simulasi tetap | `js/pts-dashboard.js`, `pts.html`, README | Harga Rupiah terlihat di halaman; kurs Rp16.000 dipahami sebagai kurs simulasi, bukan kurs real-time. |
| 15 Oktober 2026 | ChatGPT/Codex | Menyusun dokumentasi dan penjelasan kode | Membantu merapikan README dan menyusun draft jawaban pertanyaan PTS | README dan naskah dokumentasi Word | Isi perlu dicocokkan lagi dengan kode dan ditinjau mahasiswa sebelum dikumpulkan. |

## Informasi pengumpulan yang perlu dilengkapi

- URL repository GitHub/GitLab individual: isi setelah memeriksa link repository yang benar.
- Tag rilis: `v0.1-PTS` setelah project siap.
- URL video demo: isi setelah video direkam dan diunggah.
- Screenshot desktop dan mobile: tambahkan file hasil tangkapan layar aplikasi.