# 🐾 My Screen Pet – Chrome Extension (v1.1)

Ekstensi Chrome interaktif yang menampilkan karakter pixel art hidup di layar browser Anda. Dibangun menggunakan HTML, CSS, dan Vanilla JS (Manifest V3).

## 🌟 Fitur Utama

### 1. Core Mechanics
- **Overlay Character:** Karakter berjalan di atas elemen web (`z-index` tinggi).
- **Pac-Man Effect:** Karakter menembus tepi layar dan muncul di sisi sebaliknya.
- **Natural Behavior:**
  - **Walking & Blinking:** Animasi langkah kaki yang sinkron dengan kedipan mata.
  - **Idle/Sitting:** Karakter sesekali duduk beristirahat secara acak.

### 2. Control & Interaction (New!)
- **Control Panel:** Tombol ON/OFF melalui menu popup ekstensi untuk menyembunyikan pet.
- **Poke / Click:** Klik sekali pada pet untuk membuatnya kaget dan melompat.
- **Drag & Drop:**
  - Angkat dan pindahkan pet ke posisi mana pun di layar.
  - **Gravity:** Pet akan jatuh secara realistis jika dilepas di udara.
  - **Landing Animation:** Animasi jongkok/mendarat (squash & stretch) saat menyentuh tanah.
- **Throw to Change Direction:** Geser (drag) pet ke arah tertentu (kiri/kanan) lalu lepas untuk mengubah arah jalannya.

## 📂 Struktur File

```text
my-screen-pet/
├── assets/
│   ├── walk_1.png          (Jalan A - Melek)
│   ├── walk_2.png          (Jalan B - Melek)
│   ├── walk_1_blink.png    (Jalan A - Merem)
│   ├── walk_2_blink.png    (Jalan B - Merem)
│   ├── sit_1.png           (Duduk - Melek)
│   ├── sit_blink.png       (Duduk - Merem)
│   ├── jump_shock.png      (Lompat/Kaget/Diangkat)
│   └── jump_land.png       (Mendarat/Jongkok)
├── content.js              (Logika fisika, animasi, dan interaksi mouse)
├── popup.html              (UI Menu Kontrol ON/OFF)
├── popup.js                (Logika komunikasi tombol popup)
├── manifest.json           (Konfigurasi Extension V3 & Permissions)
├── style.css               (Styling animasi & transisi)
├── README.md               (Dokumentasi)
└── PLANNING.md             (Roadmap pengembangan)