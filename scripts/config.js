window.PetApp = window.PetApp || {};

window.PetApp.CONFIG = {
    // --- Global Settings ---
    SPEED: 1.5,
    PET_WIDTH: 64,
    BUBBLE_OFFSET_Y: 60,
    
    // --- Timers & Durations ---
    ANIMATION_SPEED: 15,
    BLINK_CHANCE: 0.01,
    BLINK_DURATION: 8,
    SPEECH_DELAY_MIN: 600,
    SPEECH_DELAY_ADD: 600,
    SPEECH_SHOW_TIME: 180,
    
    // --- System ---
    SAVE_INTERVAL_MS: 5000,
    FOLLOW_DISTANCE: 20,

    // --- Assets Paths ---
    getSprite: (name) => chrome.runtime.getURL(`assets/skins/axo/${name}.png`), // Ganti 'akita' jika ganti skin
    getAudio: (name) => chrome.runtime.getURL(`assets/common/sfx/${name}.wav`),

    // --- Speech Text ---
    QUOTES: [
        "Hello World!", "Nice website!", "I'm hungry...", "Walk walk walk", 
        "Where am I?", "Don't click me!", "Looking for bugs...", 
        "Pixel art is cool", "Do you have cookies?", "Browser life..."
    ]
};