# Jarsix Gallery WebApps: Sistem Otomatisasi Distribusi Produk Digital E-commerce

## Ringkasan Proyek

**Jarsix Gallery WebApps** adalah solusi *back-end* kustom yang dikembangkan menggunakan **Google Apps Script (GAS)** untuk mengotomatisasi proses krusial pasca-pembelian di platform *e-commerce*. Aplikasi ini berfungsi sebagai panel kendali internal bagi administrator untuk mencatat pesanan, memberikan akses file digital secara instan, dan mengirimkan notifikasi *email* kepada pembeli secara real-time, menghilangkan kebutuhan akan intervensi manual dalam proses pengiriman.

## ⚙️ Detail Teknis dan Teknologi

Aplikasi ini dibangun dengan arsitektur *full-stack* Google Apps Script, memanfaatkan integrasi mendalam dengan layanan Google Workspace:

| Komponen | Teknologi/Layanan | Fungsi Utama |
| :--- | :--- | :--- |
| **Backend Logic** | Google Apps Script (GAS) | Menangani alur kerja utama, validasi data, *grant access*, dan *logging*. |
| **Frontend** | HTML5, CSS3, & Custom JavaScript | Menyediakan antarmuka *admin* yang responsif (*Web App*) untuk *input* data pesanan, pencarian produk, dan menampilkan hasil proses. |
| **Database** | Google Sheets | Berfungsi sebagai *database* utama untuk menyimpan **Database Produk** (kode SKU, ID Drive) dan **Arsip Log** Transaksi. |
| **Akses File** | Google Drive API (via GAS) | Secara otomatis memodifikasi izin file/folder, memberikan akses **`viewer`** (hanya lihat/unduh) kepada email pembeli. |
| **Notifikasi** | GmailApp (via GAS) | Mengirimkan *email* berformat HTML yang profesional dan informatif kepada pembeli, berisi tautan unduh yang sudah diizinkan. |

## 🚀 Fitur Utama

1.  **Input Data Terpusat:** Antarmuka yang efisien memungkinkan *admin* memasukkan data pesanan mentah (Nomor Pesanan, Alamat, Email Pembeli) dan memprosesnya dalam satu klik.
2.  **Pencarian Produk Dinamis:** Menggunakan `google.script.run` untuk memanggil database produk di Google Sheets secara *real-time*, memungkinkan *admin* mencari dan menambahkan produk berdasarkan SKU atau nama dengan cepat.
3.  **Otomatisasi Pemberian Akses (Access Grant):** Mengambil *ID Google Drive* (file atau folder) yang terasosiasi dengan produk, lalu secara otomatis memberikan izin akses (*addViewer*) kepada email pembeli.
4.  **Sistem Logging Robust:** Setiap proses transaksi dicatat ke Google Sheets dengan detail (Timestamp, Status, SKU). Sistem ini menggunakan logika **Delete-then-Insert** untuk memastikan hanya ada **satu baris** log per Nomor Pesanan, sehingga arsip selalu rapi dan terurut berdasarkan aktivitas terbaru (log terbaru selalu berada di Baris 2).
5.  **Notifikasi Email Kustom:** Mengirimkan email transaksi yang profesional dan *mobile-friendly* (dibuat dengan *template* HTML khusus), lengkap dengan daftar produk dan tautan unduh yang sudah diaktifkan.

## ✨ Manfaat Bisnis

Proyek ini berhasil **mengurangi waktu pemrosesan pesanan** yang melibatkan produk digital dari potensi menit per transaksi menjadi **hanya beberapa detik**. Dengan mengeliminasi *human error* dalam proses *grant access* dan *logging*, **Jarsix Gallery** mampu meningkatkan efisiensi operasional dan memberikan pengalaman *post-sales* yang lebih cepat dan profesional kepada pelanggan.
