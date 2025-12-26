# 🐾 My Screen Pet (Axo) – Chrome Extension (v1.3)

Ekstensi Chrome interaktif yang menampilkan karakter pixel art (Axo) hidup di layar browser Anda.  
Update **v1.3** menghadirkan struktur kode yang lebih rapi (Modular), mode pengikut kursor, dan balon bicara!

## 🌟 Fitur Utama

### 1. Core Mechanics
- **Overlay Character:** Karakter berjalan di atas elemen web (`z-index` tinggi).
- **Pac-Man Effect:** Karakter menembus tepi layar dan muncul di sisi sebaliknya.
- **Natural Behavior:** Berjalan, berkedip, dan duduk beristirahat secara acak.
- **Speech Bubbles (New in v1.3):** Axo sesekali berbicara atau menyapa saat diklik.

### 2. Control & Physics
- **Drag & Drop:** Pindahkan pet sesuka hati dengan fisika gravitasi.
- **Gravity System:** Pet akan jatuh dan mendarat dengan animasi "squash".
- **Poke:** Klik sekali untuk membuat pet kaget dan melompat.

### 3. Interactive Modes & Polish 🎨
- **Follow Mouse Mode (New in v1.3):** Axo akan mengejar kursor mouse Anda jika mode ini diaktifkan.
- **Sound Effects:** Efek suara retro 8-bit (langkah, lompat, mendarat).
- **Customization:** Toggle Mute & Slider Warna (Hue Rotate).
- **Smart Memory:** Mengingat posisi dan pengaturan terakhir.

## 📂 Struktur File (Modular)

Refactoring kode dilakukan di versi 1.3 untuk mempermudah pengembangan.
```text
my-screen-pet/
├── assets/
│   ├── common/
│   │   └── sfx/                 # Audio Shared
│   │       ├── jump.wav
│   │       ├── land.wav
│   │       └── step.wav
│   └── skins/
│       └── axo/                 # Skin: Axo
│           ├── walk_1.png
│           ├── walk_2.png
│           ├── walk_1_blink.png
│           ├── walk_2_blink.png
│           ├── sit_1.png        # Perhatikan nama file ini!
│           ├── sit_blink.png
│           ├── jump_shock.png
│           └── jump_land.png
├── popup/                       # UI Extension
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
├── scripts/                     # Logika Modular
│   ├── config.js                # Pengaturan & Path
│   ├── state.js                 # Memory & Save System
│   ├── pet.js                   # Class Pet (Brain)
│   └── main.js                  # Game Loop & Input
├── style.css                    # Style untuk Pet di Halaman Web
├── manifest.json
├── README.md
└── PLANNING.md