// File: EmailService.gs

/**
 * Fungsi pembantu untuk membuat daftar produk dalam format HTML.
 * Menggunakan format tabel dan ikon yang mirip dengan template sebelumnya (sesuai request user).
 * @param {Array<Object>} accessResults - Hasil dari pemberian akses Google Drive.
 * @returns {string} String HTML dari daftar produk.
 */
function createProductListHtml(accessResults) {
  let html = '';
  const colors = CONFIG.COLORS; // Mengambil warna dari Config

  accessResults.forEach(result => {
    // Tentukan link atau pesan error
    const linkStatus = result.link.includes('[Link unduhan tidak tersedia') ? 
        `${result.link}` : 
        `Unduh via: <a href="${result.link}" style="color: ${colors.ACCENT_COLOR_1}; text-decoration: none;"><strong>Google Drive</strong></a>`;

    // Tentukan status ikon (checkmark jika berhasil, atau titik jika gagal)
    const icon = result.status === 'Berhasil' ? '&#10003;' : '&#9679;';
    const iconColor = result.status === 'Berhasil' ? colors.ACCENT_COLOR_2 : '#CC0000'; // Merah untuk Gagal

    html += `
      <tr>
        <td style="padding-bottom: 5px;">
          <table border="0" cellpadding="0" cellspacing="0">
            <tr>
              <td valign="top" style="padding-right: 5px;">
                <span style="color: ${iconColor}; font-weight: bold; font-size: 16px; line-height: 1.2;">${icon}</span>
              </td>
              <td valign="top" style="font-size: 16px; line-height: 1.2; color: #333333;">
                <strong>${result.nama}</strong>
              </td>
            </tr>
            <tr>
              <td valign="top" style="padding-right: 5px;"></td>
              <td valign="top" style="font-size: 16px; line-height: 1.2; color: #333333; padding-top: 2px;">
                ${linkStatus}
              </td>
            </tr>
          </table>
        </td>
      </tr>`;
  });

  return html;
}


/**
 * Mengirim email ke pembeli dengan detail produk.
 * @param {string} emailPembeli - Alamat email pembeli.
 * @param {Object} emailData - Objek berisi semua placeholder data mentah (nama, no. pesanan, dll).
 * @param {Array<Object>} accessResults - Hasil dari grantAccessToProducts.
 * @returns {string} Konten HTML email yang terkirim.
 */
function sendOrderEmail(emailPembeli, emailData, accessResults) {
  const template = HtmlService.createTemplateFromFile('TemplateEmail');
  const cfg = CONFIG.SHOPEE;
  const colors = CONFIG.COLORS;
  const senderCfg = CONFIG.EMAIL_SENDER;

  // 1. Buat HTML daftar produk menggunakan fungsi pembantu
  const daftarProdukHtml = createProductListHtml(accessResults);

  // 2. Isi semua placeholder di template (Menggunakan skema data Anda)
  template.nama_toko = cfg.NAMA_TOKO;
  template.nama_pembeli = emailData.NamaPembeli;
  template.nomor_pesanan = emailData.NomorPesanan;
  template.daftar_produk_dan_link = daftarProdukHtml;
  template.link_toko_shopee = cfg.LINK_TOKO;
  
  // Warna
  template.BG_SECONDARY = colors.BG_SECONDARY;
  template.ACCENT_COLOR_1 = colors.ACCENT_COLOR_1;
  template.ACCENT_COLOR_2 = colors.ACCENT_COLOR_2;

  // 3. Evaluasi template menjadi HTML final
  const htmlBody = template.evaluate().getContent();
  
  // 4. Kirim Email (MENGGUNAKAN GMAILAPP)
  // GmailApp lebih baik dalam menghormati parameter 'from' alias
  try {
    GmailApp.sendEmail(
      emailPembeli, // Penerima
      `[${cfg.NAMA_TOKO}] Tautan Unduh Produk Pesanan #${emailData.NomorPesanan}`, // Subjek
      '', // Isi teks biasa (dibiarkan kosong karena ada htmlBody)
      {
        htmlBody: htmlBody,
        name: cfg.NAMA_TOKO, // Nama pengirim (e.g., Jarsix Gallery)
        from: senderCfg.ALIAS, // Alias email: jarsix@autokarya.com
        replyTo: senderCfg.REPLY_TO
      }
    );
    Logger.log(`Email untuk pesanan ${emailData.NomorPesanan} berhasil dikirim ke ${emailPembeli}.`);
  } catch (e) {
    Logger.log(`Gagal mengirim email: ${e.toString()}`);
    // PENTING: Tambahkan logika gagal kirim email di sini jika perlu
  }

  // 5. Mengembalikan konten HTML untuk log
  return htmlBody;
}
