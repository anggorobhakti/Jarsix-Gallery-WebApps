// File: HtmlProcessor.gs

/**
 * Membuat tampilan log hasil proses versi simpel untuk Front-end.
 * @param {Object} rawLogData - Objek data mentah untuk log.
 * @param {Array<Object>} accessResults - Hasil dari grantAccessToProducts.
 * @returns {Object} Objek berisi HTML log (versi simpel) dan status akhir.
 */
function createFrontLogHtml(rawLogData, accessResults) {
  let listProdukHtml = '';
  let isAllSuccess = true;
  let errorMessages = [];
  
  let counter = 1;
  for (const result of accessResults) {
    let statusText = (result.status === 'Berhasil') ?
      `<span style="color: green; font-weight: bold;">Link Download: <a href="${result.link}" target="_blank">Lihat Link Drive</a></span>` :
      `<span style="color: red; font-weight: bold;">Status: Gagal - ${result.error}</span>`;
      
    if (result.status !== 'Berhasil') {
        isAllSuccess = false;
        errorMessages.push(`${result.nama}: ${result.error}`);
    }

    listProdukHtml += `
      <li>
        <strong>${result.nama}</strong><br>
        ${statusText}
      </li>
    `;
    counter++;
  }

  const finalStatus = isAllSuccess ? 'Berhasil Dikirim' : 'Gagal Dikirim';
  const finalReason = isAllSuccess ? '' : `<br><strong>Alasan Kegagalan:</strong> ${errorMessages.join('; ')}`;
  
  // Format tanggal untuk tampilan log
  const formattedTimestamp = new Date().toLocaleString('id-ID', { 
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' 
  });

  // MASIH PROSES PENGEMBANGAN KARENA ERROR
  // Tampilan log hasil proses di Front
  const htmlOutput = `
    <div style="border: 2px solid ${isAllSuccess ? 'green' : 'red'}; padding: 15px; border-radius: 5px; background-color: #f9f9f9; max-width: 500px; margin: 20px auto;">
      <h3 style="margin-top: 0; color: #333;">Hasil Proses Pengiriman</h3>
      <hr style="border: 0; border-top: 1px solid #ccc;">
      <p><strong>Timestamp:</strong> ${formattedTimestamp}</p>
      <p><strong>Nomor Pesanan:</strong> ${rawLogData.NomorPesanan}</p>
      <p><strong>Nama Pembeli:</strong> ${rawLogData.NamaPembeli}</p>
      <p><strong>Nomor HP:</strong> ${rawLogData.NoHpPembeli}</p>
      <p><strong>Alamat Email:</strong> ${rawLogData.EmailPembeli}</p>
      <p><strong>Status:</strong> <span style="font-weight: bold; color: ${isAllSuccess ? 'green' : 'red'};">${finalStatus}</span>${finalReason}</p>
      <hr style="border: 0; border-top: 1px solid #ccc;">
      <p style="font-weight: bold;">Produk yang dibeli:</p>
      <ul style="list-style-type: none; padding-left: 0;">
        ${listProdukHtml}
      </ul>
    </div>
    <div style="text-align: center; margin-top: 20px;">
      <button onclick="window.top.location.reload();" style="padding: 10px 20px; background-color: #007AFF; color: white; border: none; border-radius: 5px; cursor: pointer;">Kembali ke Input</button>
    </div>
  `;
  
  return {
    html: htmlOutput,
    status: finalStatus,
    error: isAllSuccess ? null : errorMessages.join('; ')
  };
}
