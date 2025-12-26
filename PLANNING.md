# 📅 Rencana Pengembangan: Day 4 (Personality & Polish) - COMPLETED

**Status:** v1.3 Release Candidate Ready.

## 🎯 Target Fitur Day 4 (Selesai)
Fitur-fitur ini melengkapi update v1.3:

### 1. Speech Bubbles 💬
✅ Pet menampilkan teks acak dan merespons klik.

### 2. Follow Mouse Mode 🖱️
✅ Pet dapat mengejar kursor mouse user (Toggle via Popup).

### 3. Code Refactoring (Modular) 🧹
✅ Migrasi dari *Monolithic* (satu file) ke *Modular Architecture* (scripts terpisah) untuk kerapian kode jangka panjang.

---

# 📅 Rencana Pengembangan: Day 5 (Hardcore Testing & QA)

**Fokus:** Mencari bug tersembunyi, memory leak, dan memastikan Axo stabil di berbagai kondisi ekstrim ("Stress Testing").

## 1. 🌪️ Stress Testing (Uji Ketahanan)
Mencoba membuat Axo "pusing" atau error dengan interaksi ekstrim.
- [ ] **Spam Click:** Klik (Poke) Axo 20x dengan sangat cepat. Apakah animasinya rusak/stuck?
- [ ] **Rapid Mode Switch:** Buka Popup, nyalakan/matikan toggle "Follow" dan "Sound" berkali-kali dengan cepat.
- [ ] **Window Resizing:** Kecilkan jendela browser sekecil mungkin. Apakah Axo terjepit?
- [ ] **Zoom Abuse:** Zoom in halaman sampai 500% dan Zoom out sampai 25%. Cek resolusi dan posisi Axo.

## 2. 🌐 Multi-Tab Behavior
Ekstensi berjalan di setiap tab yang dibuka.
- [ ] **The "Chorus" Effect:** Buka 5 tab sekaligus. Apakah suara langkah kaki jadi berisik (menumpuk)?
- [ ] **Sync State:** Matikan suara di Tab A. Cek Tab B, apakah suara otomatis mati juga? (Harusnya ya via `chrome.storage`).
- [ ] **Background Tab:** Buka Tab A, lalu pindah ke Tab B. Apakah Axo di Tab A berhenti memakan resource CPU?

## 3. 🖱️ Physics & Movement Edge Cases
- [ ] **Throw out of bounds:** Lempar Axo ke luar layar (atas/kiri/kanan) dengan kencang. Apakah dia kembali?
- [ ] **Mouse Exit (Follow Mode):** Aktifkan Follow Mode, geser mouse keluar jendela browser. Apa reaksi Axo?
- [ ] **Select Text:** Coba blok teks di website saat Axo lewat di atasnya. Apakah Axo menghalangi seleksi?

## 4. 🌍 Compatibility Testing (Medan Perang Asli)
- [ ] **Video Fullscreen:** Buka YouTube fullscreen. Apakah Axo menutupi video?
- [ ] **Interactive Apps:** Coba di Google Docs/Sheets. Apakah mengganggu ketikan?
- [ ] **Fixed Elements:** Cek di website dengan Navbar melayang (Twitter/Facebook). Posisi Axo di atas atau di bawah navbar?
- [ ] **Dark Mode:** Cek visibilitas Axo dan Speech Bubble di website background hitam.

## 5. ⚙️ System & Performance
- [ ] **Installation Flow:** Hapus ekstensi, install ulang. Apakah setting kembali default?
- [ ] **Console Logs:** Pastikan console browser **BERSIH** dari error merah saat Axo berjalan lama.
- [ ] **Memory Leak:** Pantau Task Manager Chrome. Pastikan penggunaan memori tidak naik terus menerus.