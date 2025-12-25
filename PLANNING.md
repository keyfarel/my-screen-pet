# Rencana Pengembangan: Day 2 (Control & Interaction)

**Status Terakhir:**  
Pet sudah dapat berjalan, melakukan teleportasi (loop), dan duduk secara otomatis. Seluruh sprite sudah sinkron dan tidak terjadi pergeseran saat berkedip.

## Target Fitur Day 2
Fokus pengembangan adalah menambahkan kontrol agar ekstensi lebih mudah digunakan oleh pengguna.

### 1. Tombol ON/OFF (Prioritas Tinggi)
Permasalahan: Pet dapat menutupi konten penting pada halaman.  
Solusi: Menambahkan menu kontrol melalui icon ekstensi.

Checklist:
- [ ] Membuat `popup.html` sebagai tampilan UI switch.
- [ ] Membuat `popup.js` untuk proses messaging.
- [ ] Memperbarui `content.js` untuk menerima pesan seperti `HIDE` dan `SHOW`.

### 2. Interaksi Klik / Poke (Prioritas Menengah)
Permasalahan: Pet tidak dapat disentuh dan terasa pasif.  
Solusi: Menambahkan respons ketika pet diklik.

Checklist:
- [ ] Mengubah CSS dari `pointer-events: none` menjadi `pointer-events: auto`.
- [ ] Menambahkan event listener `click` pada `content.js`.
- [ ] Logika: ketika diklik → berhenti berjalan → memutar animasi kaget → melanjutkan pergerakan.

### 3. Drag and Drop (Prioritas Rendah / Bonus)
Solusi: Memberikan kemampuan bagi pengguna untuk memindahkan posisi pet tanpa mematikannya.

---

## PR Aset (Disiapkan Sebelum Coding)
Dibuat melalui AI dengan metode Image-to-Image menggunakan referensi dari `walk_1.png`.

1. `jump_shock.png`  
   Deskripsi: Sprite dengan visual karakter sedikit melompat atau mengejut, mungkin dengan tangan terangkat atau ekspresi terkejut.  
   Kegunaan: Dipakai ketika fitur interaksi klik diterapkan.
   
   Prompt: Character jumping up slightly, looking surprised/shocked. Arms raised if possible. Keep exact style.


---

## Catatan Teknis
- Perhatikan penggunaan `pointer-events: auto`. Pastikan bagian transparan pada PNG benar-benar bersih agar pengguna tidak mengklik area kosong yang sebenarnya berada di atas elemen halaman yang penting.
