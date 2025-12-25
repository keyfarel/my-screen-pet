# 📅 Rencana Pengembangan: Day 3 (Polish & Features)

**Status Terakhir (Day 2 Completed):**
✅ Kontrol ON/OFF berhasil diimplementasikan.
✅ Fitur Drag & Drop dengan fisika gravitasi berjalan mulus.
✅ Masalah UX "Double Click" diganti dengan solusi "Drag & Throw" yang lebih intuitif.
✅ Animasi jatuh dan mendarat (landing) sudah natural.

## 🎯 Target Fitur Day 3
Fokus: Menambah "jiwa" pada pet melalui suara dan penyimpanan memori.

### 1. Sound Effects (Audio) 🔊
Menambahkan umpan balik suara agar interaksi lebih memuaskan.
- [ ] Cari/Generate aset suara 8-bit sederhana (Free license/CC0).
  - `jump.mp3` (Suara "Boing" saat diklik).
  - `land.mp3` (Suara "Thump" kecil saat jatuh).
  - `step.mp3` (Opsional: suara langkah kaki sangat pelan).
- [ ] Implementasi `Audio()` object di `content.js`.
- [ ] Tambah toggle "Mute Sound" di `popup.html`.

### 2. State Persistence (Ingatan) 🧠
Masalah: Saat browser di-refresh, pet kembali ke posisi awal (-150px).
Solusi: Pet mengingat posisi terakhirnya.
- [ ] Simpan koordinat X dan arah (Direction) ke `chrome.storage.local` setiap kali user berhenti nge-drag.
- [ ] Saat load halaman, ambil koordinat tersebut sebagai posisi awal spawn.

### 3. Customization (Opsional / Bonus) 🎨
Solusi: Biar user tidak bosan dengan satu warna.
- [ ] Tambahkan slider "Hue Rotate" di `popup.html`.
- [ ] Gunakan CSS filter untuk mengubah warna baju pet secara dinamis tanpa perlu gambar baru.

---

## 🛠️ Persiapan Aset (Day 3)
Jika ingin menggunakan fitur suara, siapkan file `.mp3` atau `.wav` durasi pendek (di bawah 1 detik).
1. `jump_sfx.mp3`
2. `land_sfx.mp3`

---

## Catatan Teknis
- Hati-hati dengan **Audio Policies** browser modern. Audio biasanya tidak boleh autoplay kecuali ada interaksi user (klik). Karena pet kita berbasis interaksi klik, seharusnya aman.