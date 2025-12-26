(function() {
    const App = window.PetApp;
    
    // --- Wait for State to Load ---
    App.State.load((savedHue) => {
        const pet = new App.Pet();
        
        // Apply saved color
        if (savedHue) pet.img.style.filter = `hue-rotate(${savedHue}deg)`;
        
        setupEventListeners(pet);
        
        // Auto Save Loop
        setInterval(() => App.State.save(), App.CONFIG.SAVE_INTERVAL_MS);

        // --- Main Game Loop ---
        function loop() {
            if (!App.State.isDragging && !App.State.isFalling) {
                pet.update();
            }
            requestAnimationFrame(loop);
        }
        loop();
    });

    // --- Setup Inputs & Listeners ---
    function setupEventListeners(pet) {
        // Global Mouse Tracker
        document.addEventListener('mousemove', (e) => {
            App.State.mouseX = e.clientX;
            
            // Dragging Logic
            if (App.State.isDragging) {
                if (!App.State.hasMoved) { 
                    App.State.hasMoved = true; 
                    pet.img.src = App.CONFIG.getSprite('jump_shock'); 
                }
                const offsetX = parseFloat(pet.img.dataset.offsetX);
                App.State.x = e.clientX - offsetX;
                pet.img.style.left = App.State.x + 'px';
                
                const newBottom = (window.innerHeight - e.clientY) - (pet.img.height / 2);
                pet.img.style.bottom = Math.max(0, newBottom) + 'px';
                
                // Flip while dragging
                if (e.clientX > App.State.dragStartX) pet.img.style.transform = "scaleX(1)";
                else if (e.clientX < App.State.dragStartX) pet.img.style.transform = "scaleX(-1)";
            }
        });

        // Mouse Down (Start Drag)
        pet.img.addEventListener('mousedown', (e) => {
            if (App.State.isShocked || App.State.isFalling) return;
            e.preventDefault();
            
            App.State.isDragging = true;
            App.State.isWalking = false;
            App.State.hasMoved = false;
            App.State.dragStartX = e.clientX;
            
            const rect = pet.img.getBoundingClientRect();
            pet.img.classList.add('dragging');
            pet.img.dataset.offsetX = e.clientX - rect.left;
            pet.toggleSpeech(false);
        });

        // Mouse Up (End Drag / Click)
        window.addEventListener('mouseup', (e) => {
            if (!App.State.isDragging) return;
            
            App.State.isDragging = false;
            pet.img.classList.remove('dragging');

            if (!App.State.hasMoved) {
                pet.triggerJump(); // Poke
            } else {
                // Drop Logic
                if (e.clientX > App.State.dragStartX) App.State.direction = 1;
                else if (e.clientX < App.State.dragStartX) App.State.direction = -1;
                
                pet.img.style.transform = (App.State.direction === 1) ? "scaleX(1)" : "scaleX(-1)";
                App.State.isFalling = true;
                App.State.isWalking = false;
                App.State.save();

                setTimeout(() => {
                    pet.img.style.bottom = '0px';
                    setTimeout(() => {
                        pet.img.src = App.CONFIG.getSprite('jump_land');
                        pet.playSound('land');
                        setTimeout(() => {
                            App.State.isFalling = false;
                            App.State.isWalking = true;
                            pet.img.src = App.CONFIG.getSprite('walk_1');
                            App.State.save();
                        }, 1000);
                    }, 300);
                }, 50);
            }
        });

        // Popup Messages
        chrome.runtime.onMessage.addListener((req) => {
            if (req.action === "togglePet") {
                pet.img.style.display = req.status ? 'block' : 'none';
                pet.bubble.style.display = req.status ? 'block' : 'none';
            }
            if (req.action === "toggleSound") App.State.isSoundEnabled = req.status;
            if (req.action === "updateHue") pet.img.style.filter = `hue-rotate(${req.value}deg)`;
            if (req.action === "toggleFollow") {
                App.State.isFollowMode = req.status;
                if (!App.State.isFollowMode) App.State.isWalking = true;
            }
        });

        // Check Initial Hide State
        chrome.storage.local.get(['petActive'], (res) => {
            const isActive = res.petActive !== undefined ? res.petActive : true;
            if (!isActive) {
                pet.img.style.display = 'none';
                pet.bubble.style.display = 'none';
            }
        });
    }
})();