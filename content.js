(function () {
    // ===========================
    // 1. SETUP & ASSETS
    // ===========================
    const imgElement = document.createElement('img');

    // --- IMAGES ---
    const imgWalk1 = chrome.runtime.getURL('assets/walk_1.png');
    const imgWalk2 = chrome.runtime.getURL('assets/walk_2.png');
    const imgWalk1Blink = chrome.runtime.getURL('assets/walk_1_blink.png');
    const imgWalk2Blink = chrome.runtime.getURL('assets/walk_2_blink.png');
    const imgSit1 = chrome.runtime.getURL('assets/sit_1.png');
    const imgSitBlink = chrome.runtime.getURL('assets/sit_blink.png');
    const imgShock = chrome.runtime.getURL('assets/jump_shock.png');
    const imgLand = chrome.runtime.getURL('assets/jump_land.png');

    // --- AUDIO ---
    const sfxJump = new Audio(chrome.runtime.getURL('assets/sfx/jump.wav'));
    const sfxLand = new Audio(chrome.runtime.getURL('assets/sfx/land.wav'));
    const sfxStep = new Audio(chrome.runtime.getURL('assets/sfx/step.wav'));

    sfxStep.volume = 0.4;
    sfxLand.volume = 0.6;
    sfxJump.volume = 0.7;

    // --- GLOBAL SETTINGS ---
    let isSoundEnabled = true;

    // Helper: Play Sound
    function playSound(audioObj) {
        if (!isSoundEnabled) return;
        audioObj.currentTime = 0;
        audioObj.play().catch(e => { });
    }

    // --- DOM SETUP ---
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
    // 3.5. MEMORY SYSTEM (LOAD & SAVE)
    // ===========================

    // A. LOAD STATE
    chrome.storage.local.get(['petState', 'soundActive', 'petHue'], function (result) {
        // 1. Load Posisi
        if (result.petState) {
            positionX = result.petState.x;
            direction = result.petState.dir;
            if (positionX > window.innerWidth) positionX = window.innerWidth - 100;

            imgElement.style.left = positionX + 'px';
            imgElement.style.transform = (direction === 1) ? "scaleX(1)" : "scaleX(-1)";
        }

        // 2. Load Sound
        isSoundEnabled = result.soundActive !== undefined ? result.soundActive : true;

        // 3. [NEW] Load Warna
        if (result.petHue) {
            imgElement.style.filter = `hue-rotate(${result.petHue}deg)`;
        }
    });

    function savePetState() {
        // [FIX] Cek apakah context extension masih valid sebelum akses storage
        // Jika chrome.runtime.id tidak ada, berarti extension sudah di-reload/mati.
        if (!chrome.runtime?.id) {
            return;
        }

        try {
            chrome.storage.local.set({
                petState: {
                    x: Math.round(positionX),
                    dir: direction
                }
            });
        } catch (e) {
            // Tangkap error diam-diam agar tidak memerah di console
            console.log("Extension context invalidated. Please refresh the page.");
        }
    }

    // C. AUTO-SAVE INTERVAL (Setiap 5 detik)
    const saveInterval = setInterval(savePetState, 5000); // Simpan ke variabel
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

        dragStartX = e.clientX;
        const rect = imgElement.getBoundingClientRect();
        dragOffsetY = window.innerHeight - e.clientY;
        const offsetX = e.clientX - rect.left;

        imgElement.classList.add('dragging');
        imgElement.dataset.offsetX = offsetX;
    });

    // B. MOUSE MOVE
    window.addEventListener('mousemove', function (e) {
        if (!isDragging) return;

        if (!hasMoved) {
            hasMoved = true;
            imgElement.src = imgShock;
        }

        const offsetX = parseFloat(imgElement.dataset.offsetX);
        const newX = e.clientX - offsetX;
        positionX = newX;
        imgElement.style.left = positionX + 'px';

        const newBottom = (window.innerHeight - e.clientY) - (imgElement.height / 2);
        imgElement.style.bottom = Math.max(0, newBottom) + 'px';

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
            triggerJumpAnimation();
        } else {
            if (e.clientX > dragStartX) direction = 1;
            else if (e.clientX < dragStartX) direction = -1;

            imgElement.style.transform = (direction === 1) ? "scaleX(1)" : "scaleX(-1)";

            isFalling = true;
            isWalking = false;
            savePetState();

            setTimeout(() => {
                imgElement.style.bottom = '0px';
                setTimeout(() => {
                    imgElement.src = imgLand;
                    playSound(sfxLand);
                    setTimeout(() => {
                        isFalling = false;
                        isWalking = true;
                        imgElement.src = imgWalk1;
                        savePetState();
                    }, 1000);
                }, 300);
            }, 50);
        }
    });

    function triggerJumpAnimation() {
        isShocked = true;
        isWalking = false;

        imgElement.src = imgShock;
        imgElement.classList.add('pet-jump');
        playSound(sfxJump);

        setTimeout(() => {
            imgElement.classList.remove('pet-jump');
            imgElement.src = imgLand;
            playSound(sfxLand);

            setTimeout(() => {
                isShocked = false;
                isWalking = true;
                imgElement.src = imgWalk1;
            }, 200);
        }, 400);
    }

    // ===========================
    // 5. LISTENERS (POPUP)
    // ===========================

    chrome.storage.local.get(['petActive'], function (result) {
        const isActive = result.petActive !== undefined ? result.petActive : true;
        if (!isActive) document.body.classList.add('hide-my-pet');
    });

    chrome.runtime.onMessage.addListener(function (request) {
        // Toggle Hide/Show
        if (request.action === "togglePet") {
            if (request.status) document.body.classList.remove('hide-my-pet');
            else document.body.classList.add('hide-my-pet');
        }

        // Toggle Sound
        if (request.action === "toggleSound") {
            isSoundEnabled = request.status;
        }

        // Update Color [NEW]
        if (request.action === "updateHue") {
            // Apply filter CSS secara dinamis
            imgElement.style.filter = `hue-rotate(${request.value}deg)`;
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
        if (blinkTimer > 0) blinkTimer--;
        else if (Math.random() < 0.01) blinkTimer = blinkDuration;
        const isBlinking = (blinkTimer > 0);

        if (isShocked) {
            imgElement.style.transform = (direction === 1) ? "scaleX(1)" : "scaleX(-1)";
            requestAnimationFrame(updatePet);
            return;
        }
        else if (isWalking) {
            positionX += (speed * direction);
            imgElement.style.left = positionX + 'px';

            if (direction === 1 && positionX > screenWidth) positionX = -petWidth;
            else if (direction === -1 && positionX < -petWidth) positionX = screenWidth;

            frameTimer++;
            if (frameTimer > walkAnimSpeed) {
                frameTimer = 0;
                currentWalkFrame = (currentWalkFrame === 1) ? 2 : 1;
                if (currentWalkFrame === 1) playSound(sfxStep);
            }

            if (currentWalkFrame === 1) imgElement.src = isBlinking ? imgWalk1Blink : imgWalk1;
            else imgElement.src = isBlinking ? imgWalk2Blink : imgWalk2;

            if (Math.random() < 0.002) {
                isWalking = false;
                stateTimer = Math.floor(Math.random() * 300) + 200;
                imgElement.src = imgSit1;
            }
        }
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