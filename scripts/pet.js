window.PetApp = window.PetApp || {};

window.PetApp.Pet = class {
    constructor() {
        this.cfg = window.PetApp.CONFIG;
        this.state = window.PetApp.State;
        
        // --- Timers ---
        this.frameTimer = 0;
        this.walkFrame = 1;
        this.blinkTimer = 0;
        this.speechTimer = 600;
        this.speechDuration = 0;
        this.stateTimer = 0;

        this.initDOM();
        this.initAudio();
    }

    // --- Initialize Visual Elements ---
    initDOM() {
        this.img = document.createElement('img');
        this.img.classList.add('my-pet-walker');
        this.img.src = this.cfg.getSprite('walk_1');
        document.body.appendChild(this.img);

        this.bubble = document.createElement('div');
        this.bubble.classList.add('pet-speech-bubble');
        document.body.appendChild(this.bubble);
    }

    // --- Initialize Audio Objects ---
    initAudio() {
        this.audio = {
            jump: new Audio(this.cfg.getAudio('jump')),
            land: new Audio(this.cfg.getAudio('land')),
            step: new Audio(this.cfg.getAudio('step'))
        };
        this.audio.step.volume = 0.4;
        this.audio.land.volume = 0.6;
        this.audio.jump.volume = 0.7;
    }

    // --- Play Sound Helper (With Debugging) ---
    playSound(name) {
        if (!this.state.isSoundEnabled) return;
        
        if (this.audio[name]) {
            this.audio[name].currentTime = 0;
            this.audio[name].play().catch((err) => {
                // Debugging: Cek console kalau suara ga keluar
                console.warn(`Sound Error (${name}):`, err);
            });
        }
    }

    // --- Update Visual Position & CSS ---
    draw() {
        this.img.style.left = this.state.x + 'px';
        
        // Flip Logic
        const scale = this.state.direction === 1 ? "1" : "-1";
        this.img.style.transform = `scaleX(${scale})`;

        // Bubble Position
        const left = parseFloat(this.img.style.left);
        
        // Ambil posisi bottom aktual (baik dari CSS atau JS)
        let bottomVal = 0;
        if (this.img.style.bottom && this.img.style.bottom !== 'auto') {
            bottomVal = parseFloat(this.img.style.bottom);
        }

        this.bubble.style.left = (left + (this.cfg.PET_WIDTH / 2)) + 'px';
        this.bubble.style.bottom = (bottomVal + this.cfg.BUBBLE_OFFSET_Y) + 'px';
    }

    // --- Speech Logic ---
    handleSpeech() {
        if (this.state.isSpeaking) {
            this.speechDuration--;
            if (this.speechDuration <= 0) this.toggleSpeech(false);
        } else {
            this.speechTimer--;
            if (this.speechTimer <= 0) this.toggleSpeech(true);
        }
    }

    toggleSpeech(show, text = null) {
        if (show) {
            this.bubble.innerText = text || this.cfg.QUOTES[Math.floor(Math.random() * this.cfg.QUOTES.length)];
            this.bubble.classList.add('show');
            this.state.isSpeaking = true;
            this.speechDuration = this.cfg.SPEECH_SHOW_TIME;
        } else {
            this.bubble.classList.remove('show');
            this.state.isSpeaking = false;
            this.speechTimer = Math.floor(Math.random() * this.cfg.SPEECH_DELAY_ADD) + this.cfg.SPEECH_DELAY_MIN;
        }
    }

    // --- Jump / Poke Animation (FIXED) ---
    triggerJump() {
        this.toggleSpeech(false);
        this.state.isShocked = true;
        this.state.isWalking = false;
        
        // Ganti Sprite
        this.img.src = this.cfg.getSprite('jump_shock');
        
        // [FIX ANIMASI] Gunakan Inline Style JS (Lebih Kuat dari CSS Class)
        // 1. Reset ke tanah dulu
        this.img.style.bottom = '0px';
        
        // 2. Force Reflow (Penting! Agar browser sadar posisi 0 sebelum ke 30)
        void this.img.offsetHeight;
        
        // 3. Set Tinggi Lompatan Manual (30px)
        this.img.style.bottom = '30px';
        
        // 4. Play Sound
        this.playSound('jump');

        // 5. Landing Logic
        setTimeout(() => {
            // Turun ke tanah
            this.img.style.bottom = '0px';
            
            setTimeout(() => {
                this.img.src = this.cfg.getSprite('jump_land');
                this.playSound('land');
                
                setTimeout(() => {
                    this.state.isShocked = false;
                    this.state.isWalking = true;
                    this.img.src = this.cfg.getSprite('walk_1');
                }, 200);
            }, 300); // Durasi jatuh (sesuai transisi CSS bottom 0.3s)
        }, 400); // Durasi melayang
    }

    // --- Main Logic Update per Frame ---
    update() {
        this.draw();
        
        // Blink Timer
        if (this.blinkTimer > 0) this.blinkTimer--;
        else if (Math.random() < this.cfg.BLINK_CHANCE) this.blinkTimer = this.cfg.BLINK_DURATION;
        const isBlinking = this.blinkTimer > 0;

        this.handleSpeech();

        // State Machine
        if (this.state.isShocked) {
            // Do nothing, handled by Timeout di triggerJump
        } 
        else if (this.state.isFollowMode) {
            const petCenter = this.state.x + (this.cfg.PET_WIDTH / 2);
            const dist = this.state.mouseX - petCenter;
            
            if (Math.abs(dist) > this.cfg.FOLLOW_DISTANCE) {
                this.state.isWalking = true;
                this.state.direction = dist > 0 ? 1 : -1;
                this.state.x += (this.cfg.SPEED * this.state.direction);
                this.animateWalk(isBlinking);
            } else {
                this.state.isWalking = false;
                // [FIX] Pastikan nama file benar (sit_1)
                this.img.src = isBlinking ? this.cfg.getSprite('sit_blink') : this.cfg.getSprite('sit_1');
            }
        }
        else if (this.state.isWalking) {
            this.state.x += (this.cfg.SPEED * this.state.direction);
            
            if (this.state.direction === 1 && this.state.x > window.innerWidth) this.state.x = -this.cfg.PET_WIDTH;
            else if (this.state.direction === -1 && this.state.x < -this.cfg.PET_WIDTH) this.state.x = window.innerWidth;
            
            this.animateWalk(isBlinking);

            if (Math.random() < 0.002) {
                this.state.isWalking = false;
                this.stateTimer = Math.floor(Math.random() * 300) + 200;
                // [FIX] Pastikan nama file benar (sit_1)
                this.img.src = this.cfg.getSprite('sit_1');
                if (Math.random() < 0.5) this.toggleSpeech(true, "Zzz...");
            }
        } 
        else { // Sitting
            this.stateTimer--;
            // [FIX] Pastikan nama file benar (sit_1)
            this.img.src = isBlinking ? this.cfg.getSprite('sit_blink') : this.cfg.getSprite('sit_1');
            if (this.stateTimer <= 0) {
                this.state.isWalking = true;
                this.blinkTimer = 0;
                this.img.src = this.cfg.getSprite('walk_1');
                this.walkFrame = 1;
                if (Math.random() < 0.5) this.state.direction *= -1;
            }
        }
    }

    animateWalk(isBlinking) {
        this.frameTimer++;
        if (this.frameTimer > this.cfg.ANIMATION_SPEED) {
            this.frameTimer = 0;
            this.walkFrame = (this.walkFrame === 1) ? 2 : 1;
            if (this.walkFrame === 1) this.playSound('step');
        }
        const suffix = (this.walkFrame === 1) ? '1' : '2';
        const sprite = isBlinking ? `walk_${suffix}_blink` : `walk_${suffix}`;
        this.img.src = this.cfg.getSprite(sprite);
    }
};