# Aplikasi Daftar Tugas Mahasiswa

## Deskripsi

Aplikasi Daftar Tugas Mahasiswa merupakan aplikasi web sederhana untuk membantu mahasiswa mencatat dan mengelola tugas kuliah. Aplikasi ini dibuat menggunakan TypeScript dan Vite sebagai bagian dari tugas Praktikum Aplikasi Web (PAW) Pertemuan 6.

## Fitur Aplikasi

- Menambahkan tugas baru dengan informasi judul, mata kuliah, deadline, deskripsi, dan link pengumpulan.
- Mengedit informasi tugas.
- Menghapus tugas.
- Mengubah status tugas menjadi selesai atau belum selesai.
- Menampilkan detail tugas.
- Mencari tugas berdasarkan status atau nama mata kuliah.
- Memfilter tugas berdasarkan status dan mata kuliah.
- Mengurutkan tugas berdasarkan judul atau deadline.
- Menampilkan jumlah seluruh tugas, tugas yang belum selesai, dan tugas yang sudah selesai.
- Menyimpan data tugas menggunakan LocalStorage agar data tetap tersedia setelah halaman di-refresh.

## Teknologi yang Digunakan

- **HTML**: Membuat struktur halaman web.
- **CSS**: Mengatur tampilan dan tata letak aplikasi.
- **TypeScript**: Mengembangkan logika aplikasi dengan sistem tipe data.
- **Vite**: Menyediakan development server dan proses build.
- **npm**: Mengelola package dan dependency proyek.
- **Git dan GitHub**: Mengelola versi kode dan menyimpan repository.

## Cara Menjalankan Aplikasi

Pastikan Node.js dan npm sudah terpasang.

1. Clone repository:

   ```bash
   git clone https://github.com/auliasdr24/Tugas6-Daftar-Tugas.git
   ```

2. Masuk ke folder proyek:

   ```bash
   cd Tugas6-Daftar-Tugas
   ```

3. Install dependency:

   ```bash
   npm install
   ```

4. Buat file `.env` berdasarkan `.env.example`, lalu isi konfigurasi aplikasi.

5. Jalankan development server:

   ```bash
   npm run dev
   ```

6. Untuk membuat versi production:

   ```bash
   npm run build
   ```

   Hasil build akan tersimpan di folder `dist`.

## Struktur Project

```text
tugas6-daftar-tugas/
├── public/
├── src/
│   ├── assets/
│   ├── main.ts
│   └── style.css
├── .env
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Penerapan TypeScript

TypeScript digunakan untuk membantu penulisan kode agar lebih terstruktur dan mengurangi kesalahan tipe data.

Konsep TypeScript yang diterapkan:

- **Primitive Types**: Menggunakan `number`, `string`, dan `boolean`.
- **Array**: Menggunakan `Tugas[]` untuk menyimpan daftar tugas.
- **Interface**: Menggunakan `interface Tugas` untuk menentukan struktur data tugas.
- **Type Alias dan Union Type**: Menggunakan `type Filter` dengan pilihan `"semua"`, `"belum"`, dan `"selesai"`.
- **Generic**: Menggunakan fungsi `cariBerdasarkanId<T>` untuk mencari data berdasarkan ID dengan tipe data yang fleksibel.

## Penerapan Git dan GitHub

Git digunakan untuk mencatat perubahan kode selama proses pengembangan aplikasi. GitHub digunakan untuk menyimpan repository secara online.

Dalam pengerjaan proyek ini diterapkan:

- Membuat repository GitHub.
- Menggunakan beberapa branch untuk mengembangkan fitur.
- Melakukan commit untuk mencatat perubahan.
- Melakukan merge branch ke `main`.
- Melakukan simulasi dan penyelesaian merge conflict.
- Melakukan push dan pull untuk menyinkronkan kode dengan GitHub.
- Membuat dan menggabungkan Pull Request (PR).

## Penerapan npm dan Vite

**npm (Node Package Manager)** digunakan untuk mengelola package dan dependency yang dibutuhkan proyek. Dependency utama pengembangan disimpan pada bagian `devDependencies` di `package.json`.

**Vite** digunakan sebagai development server dan build tool. Vite menyediakan server lokal selama pengembangan serta membantu memproses file aplikasi untuk kebutuhan production.

Perintah yang digunakan:

- `npm run dev`: Menjalankan aplikasi dalam mode pengembangan.
- `npm run build`: Menjalankan pemeriksaan TypeScript dan membuat hasil build production.
- `npm run preview`: Menampilkan hasil build secara lokal.

## Compiler, Transpiler, dan Bundler

- **Compiler** adalah program yang memeriksa dan menerjemahkan kode sumber berdasarkan aturan bahasa pemrograman. Dalam proyek ini, TypeScript Compiler (`tsc`) digunakan untuk memeriksa tipe data dan mendeteksi kesalahan penulisan TypeScript.
- **Transpiler** adalah alat yang mengubah kode dari satu bentuk atau versi bahasa ke bentuk lain. Dalam proyek ini, esbuild yang digunakan oleh Vite membantu mengubah kode TypeScript menjadi JavaScript agar dapat dijalankan oleh browser.
- **Bundler** adalah alat yang menggabungkan dan memproses file aplikasi beserta dependency menjadi file yang siap digunakan. Vite menggunakan proses bundling saat membuat hasil build production.

## Environment Variables

Environment variable digunakan untuk menyimpan konfigurasi aplikasi agar tidak perlu ditulis langsung pada kode program.

Konfigurasi yang digunakan:

- `VITE_APP_NAME`: Nama aplikasi.
- `VITE_APP_VERSION`: Versi aplikasi.

File `.env` digunakan untuk konfigurasi lokal dan tidak diunggah ke repository karena sudah dimasukkan ke `.gitignore`. File `.env.example` disediakan sebagai contoh konfigurasi bagi pengguna lain.

Variabel dengan awalan `VITE_` dapat diakses oleh kode sisi browser, sehingga tidak boleh digunakan untuk menyimpan password, API key rahasia, atau informasi sensitif.

## Penyimpanan Data

Aplikasi menggunakan `localStorage` browser untuk menyimpan daftar tugas yang dimasukkan oleh pengguna.

Data disimpan dalam format JSON sehingga dapat dibaca kembali ketika aplikasi dibuka atau halaman di-refresh. Penyimpanan ini bersifat lokal pada browser dan perangkat yang digunakan, sehingga data tidak otomatis tersinkronisasi dengan perangkat lain.

## Deployment

Aplikasi di-build menggunakan perintah `npm run build`. Hasil build dari folder `dist` kemudian diunggah ke hosting InfinityFree agar dapat diakses melalui browser.

## Repository

GitHub: https://github.com/auliasdr24/Tugas6-Daftar-Tugas
