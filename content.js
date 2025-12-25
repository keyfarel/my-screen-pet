(function () {
    // ===========================
    // 1. SETUP & ASSETS
    // ===========================
    const imgElement = document.createElement('img');

    // Load Gambar Jalan (MELEK)
    const imgWalk1 = chrome.runtime.getURL('assets/walk_1.png');
    const imgWalk2 = chrome.runtime.getURL('assets/walk_2.png');

    // Load Gambar Jalan (MEREM - NEW!)
    const imgWalk1Blink = chrome.runtime.getURL('assets/walk_1_blink.png');
    const imgWalk2Blink = chrome.runtime.getURL('assets/walk_2_blink.png');

    // Load Gambar Duduk
    const imgSit1 = chrome.runtime.getURL('assets/sit_1.png');
    const imgSitBlink = chrome.runtime.getURL('assets/sit_blink.png');

    // Setup Awal
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
    let stateTimer = 0;

    let frameTimer = 0;
    let currentWalkFrame = 1;    // 1 atau 2
    let blinkTimer = 0;

    // ===========================
    // 4. MAIN LOOP
    // ===========================
    function updatePet() {
        const screenWidth = window.innerWidth;

        // --- A. GLOBAL BLINK TIMER ---
        if (blinkTimer > 0) {
            blinkTimer--;
        } else {
            // 1% chance mulai kedip
            if (Math.random() < 0.01) {
                blinkTimer = blinkDuration;
            }
        }

        // Cek status mata sekarang: True (Merem) atau False (Melek)
        const isBlinking = (blinkTimer > 0);

        // --- B. LOGIKA JALAN (WALKING) ---
        if (isWalking) {
            // 1. Gerak & Teleport (Pac-Man)
            positionX += (speed * direction);
            imgElement.style.left = positionX + 'px';

            if (direction === 1 && positionX > screenWidth) {
                positionX = -petWidth;
            } else if (direction === -1 && positionX < -petWidth) {
                positionX = screenWidth;
            }

            // 2. Hitung Frame Jalan (Kaki)
            frameTimer++;
            if (frameTimer > walkAnimSpeed) {
                frameTimer = 0;
                // Tukar frame kaki (1 -> 2 atau 2 -> 1)
                currentWalkFrame = (currentWalkFrame === 1) ? 2 : 1;
            }

            // 3. RENDER GAMBAR (Gabungan Kaki + Mata)
            if (currentWalkFrame === 1) {
                // Kaki 1: Cek matanya merem atau melek?
                imgElement.src = isBlinking ? imgWalk1Blink : imgWalk1;
            } else {
                // Kaki 2: Cek matanya merem atau melek?
                imgElement.src = isBlinking ? imgWalk2Blink : imgWalk2;
            }

            // 4. Chance Duduk
            if (Math.random() < 0.002) {
                isWalking = false;
                stateTimer = Math.floor(Math.random() * 300) + 200;
                imgElement.src = imgSit1; // Default duduk melek dulu
            }
        }

        // --- C. LOGIKA DUDUK (IDLE) ---
        else {
            stateTimer--;

            // Render gambar duduk (Cek mata saja)
            imgElement.src = isBlinking ? imgSitBlink : imgSit1;

            // Selesai duduk
            if (stateTimer <= 0) {
                isWalking = true;
                blinkTimer = 0; // Reset mata biar pas jalan melek dulu

                // Mulai jalan pakai frame 1 melek
                imgElement.src = imgWalk1;
                currentWalkFrame = 1;

                if (Math.random() < 0.5) direction *= -1;
            }
        }

        // --- D. FLIP ---
        imgElement.style.transform = (direction === 1) ? "scaleX(1)" : "scaleX(-1)";

        requestAnimationFrame(updatePet);
    }

    updatePet();
})();