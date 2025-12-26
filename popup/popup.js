document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('toggleBtn');
    const statusText = document.getElementById('statusText');
    const statusDot = document.getElementById('statusDot');

    // Sound Elements
    const soundBtn = document.getElementById('soundBtn');
    const iconOn = document.getElementById('iconSoundOn');
    const iconOff = document.getElementById('iconSoundOff');

    // [NEW] Follow Element
    const followBtn = document.getElementById('followBtn');

    // Color Elements
    const hueSlider = document.getElementById('hueSlider');
    const previewLogo = document.getElementById('previewLogo');

    // 1. Cek semua status saat dibuka
    chrome.storage.local.get(['petActive', 'soundActive', 'petHue', 'followActive'], function (result) {
        let isPetActive = result.petActive !== undefined ? result.petActive : true;
        let isSoundActive = result.soundActive !== undefined ? result.soundActive : true;
        let currentHue = result.petHue !== undefined ? result.petHue : 0;

        // [NEW] Default follow mati (false)
        let isFollowActive = result.followActive !== undefined ? result.followActive : false;

        updateUI(isPetActive);
        updateSoundUI(isSoundActive);
        updateFollowUI(isFollowActive); // Update tampilan tombol follow

        hueSlider.value = currentHue;
        previewLogo.style.filter = `hue-rotate(${currentHue}deg)`;
    });

    // ... (Listener Pet ON/OFF tetap sama) ...
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

    // ... (Listener Sound tetap sama) ...
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

    // [NEW] 4. Listener Tombol Follow
    followBtn.addEventListener('click', function () {
        chrome.storage.local.get(['followActive'], function (result) {
            let isFollowActive = result.followActive !== undefined ? result.followActive : false;
            let newFollowState = !isFollowActive;

            chrome.storage.local.set({ followActive: newFollowState }, function () {
                updateFollowUI(newFollowState);
                sendMessageToContent({ action: "toggleFollow", status: newFollowState });
            });
        });
    });

    // 5. Slider Color (Tetap sama)
    hueSlider.addEventListener('input', function (e) {
        const hueValue = e.target.value;
        previewLogo.style.filter = `hue-rotate(${hueValue}deg)`;
        sendMessageToContent({ action: "updateHue", value: hueValue });
        chrome.storage.local.set({ petHue: hueValue });
    });

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

    const iconFollowOn = document.getElementById('iconFollowOn');
    const iconFollowOff = document.getElementById('iconFollowOff');

    // ... listener tetap sama ...

    // [UPDATE] Fungsi Update UI Follow
    function updateFollowUI(isFollowActive) {
        if (isFollowActive) {
            // MODE NYALA: Biru, Ikon Kursor Utuh
            followBtn.classList.add('active');
            followBtn.classList.remove('disabled');
            
            iconFollowOn.style.display = 'block';
            iconFollowOff.style.display = 'none';
        } else {
            // MODE MATI: Abu-abu, Ikon Kursor Coret
            followBtn.classList.remove('active');
            followBtn.classList.add('disabled');
            
            iconFollowOn.style.display = 'none';
            iconFollowOff.style.display = 'block';
        }
    }
});