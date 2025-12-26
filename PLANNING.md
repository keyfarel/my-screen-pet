# 📅 Rencana Pengembangan: Day 4 (Personality & Final Polish)

**Status Terakhir (Day 3 Completed):**
✅ Sound Effects (8-bit) berfungsi dengan toggle Mute.
✅ State Persistence (Memory) berjalan lancar (posisi, warna, suara tersimpan).
✅ Customization (Hue Slider) berhasil diterapkan.
✅ Handling error context invalidated sudah aman.

## 🎯 Target Fitur Day 4
Fokus: Memberikan kepribadian pada pet dan persiapan finalisasi.

### 1. Speech Bubbles (Balon Bicara) 💬
Membuat pet terlihat lebih komunikatif dengan menampilkan teks acak.
- [ ] Buat elemen HTML `div` untuk balon bicara di atas kepala pet.
- [ ] Buat array kata-kata (quotes) sederhana, misal: *"Hello!", "I'm hungry", "Nice website!", "Zzz..."*.
- [ ] Logika Randomizer: Tampilkan teks setiap 10-15 detik selama 3 detik.

### 2. Follow Mouse Mode (Mainan Baru) 🖱️
Menambahkan mode interaktif di mana pet mengejar kursor mouse user.
- [ ] Tambahkan toggle "Follow Cursor" di `popup.html`.
- [ ] Update logika `content.js`: Jika mode aktif, `direction` ditentukan oleh posisi mouse user relative terhadap pet.

### 3. Code Refactoring & Optimization 🧹
Membersihkan kode sebelum proyek dianggap "Selesai".
- [ ] Rapikan `content.js`: Pisahkan konfigurasi ke objek `const CONFIG`.
- [ ] Hapus `console.log` sisa debugging.
- [ ] Pastikan semua aset gambar sudah dikompresi (TinyPNG) agar ekstensi ringan.

---

## 💡 Ide Masa Depan (Post-MVP)
- **Hunger System:** Pet perlu makan (klik icon makanan) supaya tidak lemas/lambat.
- **Multiple Pets:** Memilih jenis hewan lain (Kucing/Anjing) di menu opsi.