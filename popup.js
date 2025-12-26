document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('toggleBtn');
    const statusText = document.getElementById('statusText');
    const statusDot = document.getElementById('statusDot');

    // Sound Elements
    const soundBtn = document.getElementById('soundBtn');
    const iconOn = document.getElementById('iconSoundOn');
    const iconOff = document.getElementById('iconSoundOff');

    // Color Elements [NEW]
    const hueSlider = document.getElementById('hueSlider');
    const previewLogo = document.getElementById('previewLogo');

    // 1. Cek semua status saat dibuka
    chrome.storage.local.get(['petActive', 'soundActive', 'petHue'], function (result) {
        let isPetActive = result.petActive !== undefined ? result.petActive : true;
        let isSoundActive = result.soundActive !== undefined ? result.soundActive : true;
        let currentHue = result.petHue !== undefined ? result.petHue : 0; // Default 0

        updateUI(isPetActive);
        updateSoundUI(isSoundActive);

        // Update Slider & Preview Logo
        hueSlider.value = currentHue;
        previewLogo.style.filter = `hue-rotate(${currentHue}deg)`;
    });

    // 2. Klik Tombol PET (ON/OFF)
    btn.addEventListener('click', function () {
        chrome.storage.local.get(['petActive'], function (result) {
            let isActive = result.petActive !== undefined ? result.petActive : true;
            let newState = !isActive;
            chrome.storage.local.set({ petActive: newState }, function () {
                updateUI(newState);
                sendMessageToContent({ action: "togglePet", status: newState });
            });
        });
    });

    // 3. Klik Tombol SOUND (Mute/Unmute)
    soundBtn.addEventListener('click', function () {
        chrome.storage.local.get(['soundActive'], function (result) {
            let isSoundActive = result.soundActive !== undefined ? result.soundActive : true;
            let newSoundState = !isSoundActive;
            chrome.storage.local.set({ soundActive: newSoundState }, function () {
                updateSoundUI(newSoundState);
                sendMessageToContent({ action: "toggleSound", status: newSoundState });
            });
        });
    });

    // 4. Slider Color Change [NEW]
    hueSlider.addEventListener('input', function (e) {
        const hueValue = e.target.value;

        // Update Preview di Popup langsung
        previewLogo.style.filter = `hue-rotate(${hueValue}deg)`;

        // Kirim ke Content Script (Realtime)
        sendMessageToContent({ action: "updateHue", value: hueValue });

        // Simpan ke storage (Debounce sedikit biar ga spam write disk)
        chrome.storage.local.set({ petHue: hueValue });
    });

    // Helper: Kirim pesan
    function sendMessageToContent(msg) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, msg);
            }
        });
    }

    function updateUI(isActive) {
        if (isActive) {
            btn.textContent = "Turn OFF"; btn.classList.remove('off');
            statusText.textContent = "Pet is Active"; statusDot.className = "status-dot active";
        } else {
            btn.textContent = "Turn ON"; btn.classList.add('off');
            statusText.textContent = "Pet is Hidden"; statusDot.className = "status-dot inactive";
        }
    }

    function updateSoundUI(isSoundActive) {
        if (isSoundActive) {
            soundBtn.classList.remove('muted'); iconOn.style.display = 'block'; iconOff.style.display = 'none';
        } else {
            soundBtn.classList.add('muted'); iconOn.style.display = 'none'; iconOff.style.display = 'block';
        }
    }
});