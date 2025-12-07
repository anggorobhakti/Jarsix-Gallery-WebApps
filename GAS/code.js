// File: Code.gs

/**
 * [GAS ENTRY POINT] Menangani permintaan GET dari Google Site (Menampilkan Antarmuka).
 */
function doGet() {
  // Menampilkan template HTML Front-end
  return HtmlService.createHtmlOutputFromFile('Frontend_Interface')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * [GAS ENTRY POINT] Menangani data submit dari Front-end (dipanggil oleh google.script.run).
 * @param {Object} data - Objek data formulir dari client-side.
 */
function handleDataSubmission(data) {
  const timestampMasuk = new Date();
  
  // VALIDASI AWAL
  if (!data || !data.nomor_pesanan || !data.email_pembeli) {
     Logger.log("handleDataSubmission: Data formulir tidak lengkap/kosong.");
     return HtmlService.createHtmlOutput("<h1>ERROR: Data Input Kurang Lengkap (Nomor Pesanan/Email wajib diisi).</h1>");
  }

  // 1. Ambil & Ekstrak Data
  const nomorPesanan = data.nomor_pesanan.trim();
  const emailPembeli = data.email_pembeli.trim();
  const alamatMentah = data.alamat_pengiriman.trim();
  const produkListJson = data.produk_list; // Array JSON string dari Front-end

  // Ekstraksi Nama & No HP dari Alamat Pengiriman Mentah
  const match = alamatMentah.match(/^([^/]+)\/([^ ]+) (\d+)(.*)/);
  let namaPembeli = 'Pembeli';
  let noHpPembeli = '';
  
  if (match) {
    // Kelompok 1: Nama, Kelompok 3: No HP
    namaPembeli = match[1].trim() + (match[2] ? '/' + match[2].trim() : '');
    noHpPembeli = match[3].trim();
  } else {
      const parts = alamatMentah.split(' ');
      namaPembeli = parts[0].trim();
      noHpPembeli = parts.find(p => /^\d+$/.test(p)) || '';
  }

  // Parse Produk
  let produkDetailList;
  try {
      produkDetailList = JSON.parse(produkListJson);
  } catch(e) {
      Logger.log("Gagal parsing produk list: " + e.message);
      return HtmlService.createHtmlOutput("<h1>ERROR: Data produk tidak valid.</h1>");
  }

  const skuProduk = produkDetailList.map(p => p.kode).join('; ');

  // Objek Data Log/Email awal
  const rawLogData = {
    TimestampMasuk: timestampMasuk,
    NomorPesanan: nomorPesanan,
    NamaPembeli: namaPembeli,
    NoHpPembeli: noHpPembeli,
    EmailPembeli: emailPembeli,
    SKUProduk: skuProduk
  };

  // 2. Proses Inti: Grant Access
  const accessResults = grantAccessToProducts(emailPembeli, produkDetailList);

  // 3. Kirim Email
  let emailHtmlContent;
  try {
      emailHtmlContent = sendOrderEmail(emailPembeli, rawLogData, accessResults);
  } catch (e) {
      Logger.log(`Gagal total mengirim email: ${e.message}`);
      emailHtmlContent = `<p style="color: red;">ERROR: Gagal mengirim email. ${e.message}</p>`;
  }

  // 4. Proses Log Hasil ke Front-end (Versi Simpel)
  const frontLog = createFrontLogHtml(rawLogData, accessResults);

  // 5. Simpan/Update Log WebApps JarsixGallery
  rawLogData.StatusTerkirim = frontLog.status;
  rawLogData.TimestampSelesai = new Date();
  
  saveOrUpdateLog(rawLogData);

  // 6. Mengirim Hasil Log ke Front google site
  return HtmlService.createHtmlOutput(frontLog.html);
}

/**
 * Fungsi untuk dipanggil dari Front-end untuk Pencarian Produk.
 * @param {string} keyword - Keyword pencarian.
 * @returns {Array<Object>} Hasil produk.
 */
function searchProductsFromDb(keyword) {
    if (!keyword || keyword.length < 3) {
        return [];
    }
    return searchProduct(keyword);
}

  //////////////////
 //  Utillities  //
//////////////////

function forceAuthorization() {
  // Panggil fungsi yang menggunakan Drive dan Email untuk memicu izin
  DriveApp.getFileById("ID_FILE_GOOGLE_DRIVE"); // Ganti dengan ID file yang ada
  MailApp.sendEmail("nama-email@gmail.com", "Test Izin", "Ini adalah email tes otorisasi.");
  Logger.log("Pemicu otorisasi selesai. Sekarang jalankan lagi handleDataSubmission.");
}

function forceDriveViewerAuth() {
  // GANTI dengan ID File/Folder yang BENAR-BENAR ada di Drive Anda
  const fileIdTest = "ID_FILE_GOOGLE_DRIVE"; 

  // Memaksa permintaan izin untuk addViewer (membutuhkan scope penuh Drive)
  DriveApp.getFileById(fileIdTest).addViewer(Session.getActiveUser().getEmail());
  Logger.log("Pemicu izin Drive telah dicoba.");
}
