document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('toggleBtn');
    const statusText = document.getElementById('statusText');
    const statusDot = document.getElementById('statusDot');

    // 1. Cek status saat dibuka
    chrome.storage.local.get(['petActive'], function (result) {
        let isActive = result.petActive !== undefined ? result.petActive : true;
        updateUI(isActive);
    });

    // 2. Klik Tombol
    btn.addEventListener('click', function () {
        chrome.storage.local.get(['petActive'], function (result) {
            let isActive = result.petActive !== undefined ? result.petActive : true;
            let newState = !isActive;

            chrome.storage.local.set({ petActive: newState }, function () {
                updateUI(newState);

                // Kirim pesan ke content.js
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    if (tabs[0]) {
                        chrome.tabs.sendMessage(tabs[0].id, {
                            action: "togglePet",
                            status: newState
                        });
                    }
                });
            });
        });
    });

    // Fungsi Update Tampilan (Tanpa Emoji Text)
    function updateUI(isActive) {
        if (isActive) {
            // State: NYALA
            btn.textContent = "Turn OFF";
            btn.classList.remove('off');

            statusText.textContent = "Pet is Active";
            statusDot.className = "status-dot active"; // Jadi Hijau
        } else {
            // State: MATI
            btn.textContent = "Turn ON";
            btn.classList.add('off');

            statusText.textContent = "Pet is Hidden";
            statusDot.className = "status-dot inactive"; // Jadi Merah
        }
    }
});