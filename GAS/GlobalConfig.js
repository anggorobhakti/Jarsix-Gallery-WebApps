// File: GlobalConfig.gs

/**
 * Konfigurasi Global untuk ID Spreadsheet, Nama Toko, dan Email.
 */
const CONFIG = {
  // Spreadsheet Database Produk
  DB_PRODUK: {
    ID: "ID_SPREADSHEET_DATABASE_PRODUK",
    SHEET_NAME: "NAMA_SHEET_DATABASE_PRODUK",
    COL: {
      KODE_PRODUK: 1, // A
      NAMA_PRODUK: 2, // B
      ID_DRIVE: 3,    // C
      TIPE: 5         // E
    }
  },

  // Spreadsheet Log WebApps
  LOG_WEBAPPS: {
    ID: "ID_SPREADSHEET_LOG_ARSIP",
    SHEET_NAME: "NAMA_SHEET_LOG_ARSIP", // Anggap sheet pertama
    COL_INDEX: {
      TIMESTAMP_MASUK: 1,  // Kolom A
      NOMOR_PESANAN: 2,    // Kolom B
      NAMA_PEMBELI: 3,     // Kolom C
      NO_HP_PEMBELI: 4,    // Kolom D
      EMAIL_PEMBELI: 5,    // Kolom E
      SKU_PRODUK: 6,       // Kolom F
      STATUS_TERKIRIM: 7,  // Kolom G
      TIMESTAMP_SELESAI: 8,// Kolom H
    }
  },
  
  // Konfigurasi Toko dan Email
  SHOPEE: {
    NAMA_TOKO: "Nama Toko Online",
    LINK_TOKO: "https://shopee.co.id/NamaTokoOnline",
  },
  EMAIL_SENDER: {
    ALIAS: "nama-email@gmail.com",
    REPLY_TO: "nama-email@gmail.com"
  },
  
  // Warna untuk Template Email
  COLORS: {
    BG_SECONDARY: "#F4F4F4",
    ACCENT_COLOR_1: "#007AFF", // Contoh warna biru
    ACCENT_COLOR_2: "#28A745"  // Contoh warna hijau
  }
};
