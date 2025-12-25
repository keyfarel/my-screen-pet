(function () {
    // ===========================
    // 1. SETUP & ASSETS
    // ===========================
    const imgElement = document.createElement('img');

    const imgWalk1 = chrome.runtime.getURL('assets/walk_1.png');
    const imgWalk2 = chrome.runtime.getURL('assets/walk_2.png');
    const imgWalk1Blink = chrome.runtime.getURL('assets/walk_1_blink.png');
    const imgWalk2Blink = chrome.runtime.getURL('assets/walk_2_blink.png');
    const imgSit1 = chrome.runtime.getURL('assets/sit_1.png');
    const imgSitBlink = chrome.runtime.getURL('assets/sit_blink.png');
    const imgShock = chrome.runtime.getURL('assets/jump_shock.png');
    const imgLand = chrome.runtime.getURL('assets/jump_land.png');

    imgElement.src = imgWalk1;
    imgElement.classList.add('my-pet-walker');
    imgElement.style.left = '-150px';
    document.body.appendChild(imgElement);

    // ===========================
    // 2. CONFIGURATION
    // ===========================
    const speed = 1.5;
    const petWidth = 128;
    const walkAnimSpeed = 15;
    const blinkDuration = 8;

    // ===========================
    // 3. STATE VARIABLES
    // ===========================
    let positionX = -150;
    let direction = 1; 

    let isWalking = true;
    let isShocked = false;
    let isDragging = false; 
    let isFalling = false; 
    let stateTimer = 0;

    let frameTimer = 0;
    let currentWalkFrame = 1;
    let blinkTimer = 0;

    let dragStartX = 0;
    let dragOffsetY = 0;
    let hasMoved = false; 

    // ===========================
    // 4. INTERACTION
    // ===========================

    // A. MOUSE DOWN
    imgElement.addEventListener('mousedown', function (e) {
        if (isShocked || isFalling) return;
        e.preventDefault(); 

        isDragging = true;
        isWalking = false; 
        hasMoved = false; 

        // Catat posisi awal mouse untuk mendeteksi arah lemparan nanti
        dragStartX = e.clientX; 
        
        // Hitung offset agar gambar tidak 'jumping' ke kursor
        const rect = imgElement.getBoundingClientRect();
        dragOffsetY = window.innerHeight - e.clientY; 
        // Simpan offset X juga biar smooth
        const offsetX = e.clientX - rect.left;

        imgElement.classList.add('dragging'); 
        
        // Simpan offset X ke atribut elemen (trik biar bisa diakses di mousemove)
        imgElement.dataset.offsetX = offsetX;
    });

    // B. MOUSE MOVE
    window.addEventListener('mousemove', function (e) {
        if (!isDragging) return;

        if (!hasMoved) {
            hasMoved = true; 
            imgElement.src = imgShock; // Ganti muka kaget (Drag Mode)
        }

        // Ambil offset X yang disimpan tadi
        const offsetX = parseFloat(imgElement.dataset.offsetX);
        
        const newX = e.clientX - offsetX;
        positionX = newX;
        imgElement.style.left = positionX + 'px';

        const newBottom = (window.innerHeight - e.clientY) - (imgElement.height / 2);
        imgElement.style.bottom = Math.max(0, newBottom) + 'px';
        
        // [VISUAL UPDATE] Ubah arah hadap REAL-TIME saat di-drag
        // Kalau mouse ada di kanan posisi awal -> Madep Kanan
        // Kalau mouse ada di kiri posisi awal -> Madep Kiri
        if (e.clientX > dragStartX) {
            imgElement.style.transform = "scaleX(1)";
        } else if (e.clientX < dragStartX) {
            imgElement.style.transform = "scaleX(-1)";
        }
    });

    // C. MOUSE UP
    window.addEventListener('mouseup', function (e) {
        if (!isDragging) return;

        isDragging = false; 
        imgElement.classList.remove('dragging');

        if (!hasMoved) {
            // --- KASUS: KLIK MURNI (INSTAN) ---
            // Tidak ada delay, tidak ada timer. Langsung eksekusi.
            triggerJumpAnimation();
        } else {
            // --- KASUS: DROP (LEMPAR/GANTI ARAH) ---
            
            // [LOGIC BARU] Tentukan arah berdasarkan posisi drop
            if (e.clientX > dragStartX) {
                direction = 1; // Jalan ke Kanan
            } else if (e.clientX < dragStartX) {
                direction = -1; // Jalan ke Kiri
            }
            // Update visual arah segera
            imgElement.style.transform = (direction === 1) ? "scaleX(1)" : "scaleX(-1)";

            // Animasi Jatuh
            isFalling = true; 
            isWalking = false;

            setTimeout(() => {
                imgElement.style.bottom = '0px';
                setTimeout(() => {
                    imgElement.src = imgLand;
                    setTimeout(() => {
                        isFalling = false; 
                        isWalking = true;  
                        imgElement.src = imgWalk1; 
                    }, 1000); 
                }, 300); 
            }, 50); 
        }
    });

    // Fungsi Animasi Lompat (Simple & Instan)
    function triggerJumpAnimation() {
        isShocked = true;
        isWalking = false;

        imgElement.src = imgShock;
        imgElement.classList.add('pet-jump');

        setTimeout(() => {
            imgElement.classList.remove('pet-jump');
            imgElement.src = imgLand;

            setTimeout(() => {
                isShocked = false;
                isWalking = true;
                imgElement.src = imgWalk1;
            }, 200);
        }, 400);
    }

    // ===========================
    // 5. ON/OFF LOGIC
    // ===========================
    chrome.storage.local.get(['petActive'], function (result) {
        const isActive = result.petActive !== undefined ? result.petActive : true;
        if (!isActive) document.body.classList.add('hide-my-pet');
    });
    chrome.runtime.onMessage.addListener(function (request) {
        if (request.action === "togglePet") {
            if (request.status) document.body.classList.remove('hide-my-pet');
            else document.body.classList.add('hide-my-pet');
        }
    });

    // ===========================
    // 6. MAIN LOOP
    // ===========================
    function updatePet() {
        if (isDragging || isFalling) {
            requestAnimationFrame(updatePet);
            return;
        }

        const screenWidth = window.innerWidth;

        // --- BLINK ---
        if (blinkTimer > 0) blinkTimer--;
        else if (Math.random() < 0.01) blinkTimer = blinkDuration;
        const isBlinking = (blinkTimer > 0);

        // --- KAGET ---
        if (isShocked) {
            imgElement.style.transform = (direction === 1) ? "scaleX(1)" : "scaleX(-1)";
            requestAnimationFrame(updatePet);
            return;
        }

        // --- JALAN ---
        else if (isWalking) {
            positionX += (speed * direction);
            imgElement.style.left = positionX + 'px';

            if (direction === 1 && positionX > screenWidth) positionX = -petWidth;
            else if (direction === -1 && positionX < -petWidth) positionX = screenWidth;

            frameTimer++;
            if (frameTimer > walkAnimSpeed) {
                frameTimer = 0;
                currentWalkFrame = (currentWalkFrame === 1) ? 2 : 1;
            }

            if (currentWalkFrame === 1) imgElement.src = isBlinking ? imgWalk1Blink : imgWalk1;
            else imgElement.src = isBlinking ? imgWalk2Blink : imgWalk2;

            if (Math.random() < 0.002) {
                isWalking = false;
                stateTimer = Math.floor(Math.random() * 300) + 200;
                imgElement.src = imgSit1;
            }
        }

        // --- DUDUK ---
        else {
            stateTimer--;
            imgElement.src = isBlinking ? imgSitBlink : imgSit1;

            if (stateTimer <= 0) {
                isWalking = true;
                blinkTimer = 0;
                imgElement.src = imgWalk1;
                currentWalkFrame = 1;
                if (Math.random() < 0.5) direction *= -1;
            }
        }

        imgElement.style.transform = (direction === 1) ? "scaleX(1)" : "scaleX(-1)";
        requestAnimationFrame(updatePet);
    }

    updatePet();
})();