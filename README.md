# 🐾 My Screen Pet – Chrome Extension (v1.2)

Ekstensi Chrome interaktif yang menampilkan karakter pixel art hidup di layar browser Anda. Dilengkapi dengan fisika, suara, dan kemampuan mengingat posisi.

## 🌟 Fitur Utama

### 1. Core Mechanics
- **Overlay Character:** Karakter berjalan di atas elemen web (`z-index` tinggi).
- **Pac-Man Effect:** Karakter menembus tepi layar dan muncul di sisi sebaliknya.
- **Natural Behavior:** Berjalan, berkedip, dan duduk beristirahat secara acak.

### 2. Control & Physics
- **Drag & Drop:** Pindahkan pet sesuka hati.
- **Gravity System:** Pet akan jatuh dan mendarat dengan animasi "squash" jika dilepas di udara.
- **Drag & Throw:** Geser pet ke arah tertentu untuk mengubah arah jalannya.
- **Poke:** Klik sekali untuk membuat pet kaget dan melompat.

### 3. Polish & Customization (New in v1.2!) 🎨
- **Sound Effects:** Efek suara retro 8-bit untuk langkah kaki, lompatan, dan pendaratan.
- **Mute Toggle:** Matikan suara melalui menu popup tanpa menghilangkan pet.
- **Color Slider:** Ubah warna pakaian pet secara real-time menggunakan slider "Hue".
- **State Persistence (Ingatan):** Pet mengingat posisi terakhir, arah, warna, dan status suara meskipun browser di-refresh atau ditutup.

## 📂 Struktur File

```text
my-screen-pet/
├── assets/
│   ├── sfx/                (Sound Effects)
│   │   ├── jump.wav
│   │   ├── land.wav
│   │   └── step.wav
│   ├── walk_1.png          (Sprite Aset...)
│   ├── ...                 (Sprite lainnya)
│   ├── jump_shock.png
│   └── jump_land.png
├── content.js              (Logika utama: Fisika, Audio, AI, Memory)
├── popup.html              (UI: Tombol ON/OFF, Mute, Color Slider)
├── popup.js                (Logika UI & Messaging)
├── manifest.json           (Konfigurasi V3 & Permissions)
├── style.css               (Styling & Animations)
├── README.md               (Dokumentasi)
└── PLANNING.md             (Roadmap pengembangan)