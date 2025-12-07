// File: SheetService.gs

/**
 * Mengambil data produk dari Spreadsheet berdasarkan keyword (kode atau nama).
 */
function searchProduct(keyword) {
  const cfg = CONFIG.DB_PRODUK;
  const ss = SpreadsheetApp.openById(cfg.ID);
  const sheet = ss.getSheetByName(cfg.SHEET_NAME) || ss.getSheets()[0];
  
  // Ambil semua data (kecuali header)
  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
  
  const keywordLower = keyword.toLowerCase();
  
  const products = data
    .filter(row => 
      (row[cfg.COL.KODE_PRODUK - 1] && row[cfg.COL.KODE_PRODUK - 1].toString().toLowerCase().includes(keywordLower)) ||
      (row[cfg.COL.NAMA_PRODUK - 1] && row[cfg.COL.NAMA_PRODUK - 1].toString().toLowerCase().includes(keywordLower))
    )
    .map(row => ({
      kode: row[cfg.COL.KODE_PRODUK - 1],
      nama: row[cfg.COL.NAMA_PRODUK - 1],
      fileId: row[cfg.COL.ID_DRIVE - 1],
      type: row[cfg.COL.TIPE - 1] 
    }));
    
  return products;
}

// ====================================================================

/**
 * Menyimpan atau memperbarui log proses.
 * - Jika Nomor Pesanan sudah ada: HAPUS baris lama, lalu SIMPAN BARU di Baris 2.
 * - Jika Nomor Pesanan baru: SIMPAN BARU di Baris 2 (di bawah Header).
 * @param {Object} logData - Data log yang akan disimpan/diperbarui.
 */
function saveOrUpdateLog(logData) {
  const cfg = CONFIG.LOG_WEBAPPS;
  const ss = SpreadsheetApp.openById(cfg.ID);
  const sheet = ss.getSheetByName(cfg.SHEET_NAME) || ss.getSheets()[0];
  const nomorPesanan = logData.NomorPesanan;
  
  const logArray = [
    logData.TimestampMasuk || new Date(),
    nomorPesanan,
    logData.NamaPembeli,
    logData.NoHpPembeli,
    logData.EmailPembeli,
    logData.SKUProduk,
    logData.StatusTerkirim,
    logData.TimestampSelesai || (logData.StatusTerkirim ? new Date() : '')
  ];

  const trimmedNomorPesanan = nomorPesanan.toString().trim();
  const lastRow = sheet.getLastRow();
  
  // Kasus 1: Sheet kosong atau hanya ada Header (Baris 1)
  if (lastRow <= 1) {
    sheet.appendRow(logArray); // Akan menjadi Baris 2
    Logger.log(`Log untuk pesanan ${nomorPesanan} berhasil disimpan (Sheet kosong/Header saja).`);
    return; 
  }

  // Kasus 2: Cari data yang sudah ada untuk dihapus
  
  // Ambil data kolom Nomor Pesanan, dimulai dari Baris 2 hingga Baris terakhir.
  const rangeHeight = lastRow - 1; 
  const nomorPesananColumnValues = sheet.getRange(2, cfg.COL_INDEX.NOMOR_PESANAN, rangeHeight, 1).getValues();

  // Cari indeks array (0-based) dari data yang cocok (data ini mewakili baris 2, 3, 4, dst.)
  const rowIndexInArray = nomorPesananColumnValues.findIndex(row => 
    row[0] && row[0].toString().trim() === trimmedNomorPesanan
  );
  
  if (rowIndexInArray !== -1) {
    // A. DELETE: Baris di sheet = rowIndexInArray (0-based) + 2 
    const logRowToDelete = rowIndexInArray + 2; 
    sheet.deleteRow(logRowToDelete); // <<< HAPUS BARIS LAMA
    Logger.log(`Log lama untuk pesanan ${nomorPesanan} di baris ${logRowToDelete} berhasil dihapus.`);

    // B. INSERT BARU di Baris 2 (Logika yang sama dengan SIMPAN BARU)
    sheet.insertRowBefore(2);
    sheet.getRange(2, 1, 1, logArray.length).setValues([logArray]);
    Logger.log(`Log terbaru untuk pesanan ${nomorPesanan} berhasil disisipkan di baris 2 (di atas log lama lainnya).`);
    
  } else {
    // Kasus 3: Simpan Baru (Nomor Pesanan belum pernah ada)
    // Masukkan baris baru tepat di bawah header (Baris 2)
    sheet.insertRowBefore(2);
    sheet.getRange(2, 1, 1, logArray.length).setValues([logArray]);
    Logger.log(`Log baru untuk pesanan ${nomorPesanan} berhasil disimpan di baris 2 (log terbaru).`);
  }
}
