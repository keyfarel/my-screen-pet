window.PetApp = window.PetApp || {};

window.PetApp.State = {
    // --- Dynamic State Variables ---
    x: -150,
    direction: 1,
    isWalking: true,
    isShocked: false,
    isDragging: false,
    isFalling: false,
    isSpeaking: false,
    isFollowMode: false,
    
    // --- User Settings ---
    isSoundEnabled: true,
    
    // --- Input Tracking ---
    mouseX: 0,
    dragStartX: 0,
    hasMoved: false,

    // --- Load Data from Storage ---
    load: function(callback) {
        chrome.storage.local.get(['petState', 'soundActive', 'petHue', 'followActive'], (result) => {
            if (result.petState) {
                this.x = result.petState.x;
                this.direction = result.petState.dir;
                if (this.x > window.innerWidth) this.x = window.innerWidth - 100;
            }
            this.isSoundEnabled = result.soundActive !== undefined ? result.soundActive : true;
            this.isFollowMode = result.followActive !== undefined ? result.followActive : false;
            if (callback) callback(result.petHue);
        });
    },

    // --- Save Data to Storage ---
    save: function() {
        if (!chrome.runtime?.id) return;
        try {
            chrome.storage.local.set({
                petState: { x: Math.round(this.x), dir: this.direction }
            });
        } catch (e) {}
    }
};