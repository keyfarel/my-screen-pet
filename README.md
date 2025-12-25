# My Screen Pet – Chrome Extension (MVP)

Ekstensi Chrome sederhana yang menampilkan karakter pixel art sebagai overlay di layar browser. Dibangun menggunakan HTML, CSS, dan JavaScript tanpa framework.

## Fitur Saat Ini (MVP)

- **Overlay Character**  
  Karakter tampil di atas halaman web menggunakan `z-index` tinggi.

- **Movement**  
  Karakter berjalan dari kiri ke kanan secara kontinu.

- **Looping (Pac-Man Effect)**  
  Saat mencapai tepi kanan layar, karakter kembali muncul dari sisi kiri.

- **Natural Behavior**
  - **Walking:** Animasi langkah dan kedipan mata ketika bergerak.  
  - **Sitting:** Karakter berhenti secara acak untuk duduk.  
  - **Blinking:** Karakter berkedip saat berjalan maupun duduk.

- **Interaction**  
  Menggunakan `pointer-events: none` sehingga tidak mengganggu aktivitas klik pengguna di halaman.

## Struktur File

```text
my-screen-pet/
├── assets/
│   ├── walk_1.png        (Animasi berjalan – fase A, mata terbuka)
│   ├── walk_2.png        (Animasi berjalan – fase B, mata terbuka)
│   ├── walk_1_blink.png  (Animasi berjalan – fase A, mata tertutup)
│   ├── walk_2_blink.png  (Animasi berjalan – fase B, mata tertutup)
│   ├── sit_1.png         (Posisi duduk, mata terbuka)
│   ├── sit_blink.png     (Posisi duduk, mata tertutup)
│   └── idle_blink.png    (Posisi diam, mata tertutup)
├── content.js            (Logika animasi dan pergerakan)
├── manifest.json         (Konfigurasi Extension Manifest V3)
├── style.css             (Pengaturan posisi dan layering)
├── README.md             (Dokumentasi utama)
└── PLANNING.md           (Rencana pengembangan berikutnya)
```

