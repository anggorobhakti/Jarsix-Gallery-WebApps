// File: DriveService.gs
// (Menggunakan kode yang Anda berikan, disesuaikan dengan CONFIG)

/**
 * Memberikan akses ke file/folder Google Drive kepada pembeli.
 * @param {string} emailPembeli - Alamat email pembeli.
 * @param {Array<Object>} produkDetailList - Array objek detail produk.
 * @returns {Array<Object>} Hasil dari setiap operasi pemberian akses.
 */
function grantAccessToProducts(emailPembeli, produkDetailList) {
  const accessResults = [];

  for (const produk of produkDetailList) {
    const fileId = produk.fileId;
    const isFolder = produk.type && produk.type.toString().toLowerCase() === 'folder';
    
    if (!fileId) {
      accessResults.push({
        nama: produk.nama,
        link: `[Link unduhan tidak tersedia. Mohon hubungi kami melalui Chat Toko Shopee.]`,
        status: 'Gagal',
        error: 'File ID kosong atau tidak ditemukan.'
      });
      Logger.log(`File ID kosong untuk produk ${produk.nama}.`);
      continue;
    }

    try {
      let resource;
      if (isFolder) {
        resource = DriveApp.getFolderById(fileId);
      } else {
        resource = DriveApp.getFileById(fileId);
      }
      
      // Memberikan akses sebagai viewer
      resource.addViewer(emailPembeli);
      
      const linkDownload = (isFolder) ?
        `https://drive.google.com/drive/folders/${fileId}` :
        `https://drive.google.com/file/d/${fileId}/view`;

      accessResults.push({
        nama: produk.nama,
        link: linkDownload,
        status: 'Berhasil',
        error: null
      });
      Logger.log(`Akses ke produk "${produk.nama}" berhasil diberikan kepada ${emailPembeli}.`);
      
    } catch (e) {
      accessResults.push({
        nama: produk.nama,
        link: `[Link unduhan tidak tersedia. Mohon hubungi kami melalui Chat Toko Shopee.]`,
        status: 'Gagal',
        error: e.message || 'ID Drive tidak valid atau akses ditolak.'
      });
      Logger.log(`Gagal memberikan akses ke produk "${produk.nama}" (ID: ${fileId}): ${e.message}`);
    }
  }
  return accessResults;
}
