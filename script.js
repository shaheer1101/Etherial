document.addEventListener('DOMContentLoaded', () => {

    // 1. GLOBAL TOAST NOTIFICATION LOGIC
    const dynamicToast = document.getElementById('dynamicToast');
    const toastIcon = document.getElementById('toastIcon');
    const toastText = document.getElementById('toastText');
    let toastTimeout;

    window.showToast = function(icon, text) {
        if (!dynamicToast || !toastIcon || !toastText) return;
        clearTimeout(toastTimeout);
        dynamicToast.classList.remove('show');
        
        setTimeout(() => {
            toastIcon.innerText = icon;
            toastText.innerText = text;
            dynamicToast.classList.add('show');
            
            toastTimeout = setTimeout(() => {
                dynamicToast.classList.remove('show');
            }, 4000); 
        }, 50);
    };

    // 2. SCENE 1: HERO SCROLL LOCK LOGIC
    const startBtn = document.getElementById('startBtn');
    const scene2 = document.getElementById('scene2');

    if (startBtn && scene2) {
        startBtn.addEventListener('click', () => {
            document.body.classList.add('scroll-unlocked');
            scene2.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // 3. SCENE 2: ANGER-O-METER LOGIC
    const slider = document.getElementById('angerSlider');
    const visualBarFill = document.getElementById('visualBarFill');
    const badgeText = document.getElementById('badgeText');
    const badge = document.getElementById('statusBadge');
    const descText = document.getElementById('dynamicText');

    const angryEyes = document.getElementById('angry-eyes');
    const neutralEyes = document.getElementById('neutral-eyes');
    const happyEyes = document.getElementById('happy-eyes');
    const mouth = document.getElementById('mouth');
    const blushLeft = document.getElementById('blush-left');
    const blushRight = document.getElementById('blush-right');

    if (slider) {
        slider.addEventListener('input', (e) => {
            const value = e.target.value;
            const clipRight = 100 - value;
            
            if (visualBarFill) {
                visualBarFill.style.clipPath = `inset(0 ${clipRight}% 0 0)`;
            }

            if (value > 70) {
                if (badgeText) badgeText.innerText = 'Fuming';
                if (badge) badge.style.color = '#e64072';
                if (descText) descText.innerText = 'Take a deep breath… try sliding me left to calm down.';
                if (angryEyes) { angryEyes.style.display = 'block'; angryEyes.style.opacity = '1'; }
                if (neutralEyes) neutralEyes.style.display = 'none';
                if (happyEyes) happyEyes.style.display = 'none';
                if (mouth) mouth.setAttribute('d', 'M85 145 q15 -10 30 0');
                if (blushLeft) blushLeft.style.opacity = '0';
                if (blushRight) blushRight.style.opacity = '0';
            } 
            else if (value > 30) {
                if (badgeText) badgeText.innerText = 'Warming up';
                if (badge) badge.style.color = '#ff8ba8';
                if (descText) descText.innerText = 'Okay okay... softening. I see you. Keep going.';
                if (angryEyes) angryEyes.style.display = 'none';
                if (neutralEyes) { neutralEyes.style.display = 'block'; neutralEyes.style.opacity = '1'; }
                if (happyEyes) happyEyes.style.display = 'none';
                if (mouth) mouth.setAttribute('d', 'M85 140 q15 0 30 0');
                if (blushLeft) blushLeft.style.opacity = '0';
                if (blushRight) blushRight.style.opacity = '0';
            } 
            else {
                if (badgeText) badgeText.innerText = 'Perfect love';
                if (badge) badge.style.color = '#4ade80';
                if (descText) descText.innerText = "You're glowing 💚 — I don't deserve this smile, but I'll take it.";
                if (angryEyes) angryEyes.style.display = 'none';
                if (neutralEyes) neutralEyes.style.display = 'none';
                if (happyEyes) { happyEyes.style.display = 'block'; happyEyes.style.opacity = '1'; }
                if (mouth) mouth.setAttribute('d', 'M85 135 q15 15 30 0');
                if (blushLeft) blushLeft.style.opacity = '1';
                if (blushRight) blushRight.style.opacity = '1';
            }
        });
    }

    // 4. SCENE 3: SCRATCH CARD LOGIC
    const canvas = document.getElementById('scratchCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        const scratchPercent = document.getElementById('scratchPercent');
        const resetBtn = document.getElementById('resetBtn');
        const badgeStatus = document.getElementById('scratchBadgeText');

        let isDrawing = false;
        let isRevealed = false;

        function initCanvas() {
            isRevealed = false;
            canvas.style.opacity = '1';
            canvas.style.pointerEvents = 'auto';
            if (resetBtn) resetBtn.classList.add('hidden');
            if (scratchPercent) scratchPercent.style.opacity = '0';
            if (badgeStatus) badgeStatus.innerText = '✨ scratch me';
            
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            
            const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            grad.addColorStop(0, '#ff9a9e');
            grad.addColorStop(1, '#fecfef');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.font = 'bold 24px Fredoka, sans-serif';
            ctx.fillText('✨ Scratch to reveal ✨', canvas.width/2, canvas.height/2 - 5);
            ctx.font = '14px Inter, sans-serif';
            ctx.fillText('use your finger or mouse 💗', canvas.width/2, canvas.height/2 + 25);
            
            ctx.globalCompositeOperation = 'destination-out';
        }

        function getMousePos(e) {
            const rect = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return { x: clientX - rect.left, y: clientY - rect.top };
        }

        function startScratch(e) {
            if(isRevealed) return;
            isDrawing = true;
            if (scratchPercent) scratchPercent.style.opacity = '1';
            scratch(e);
        }

        function stopScratch() {
            isDrawing = false;
        }

        function scratch(e) {
            if (!isDrawing || isRevealed) return;
            e.preventDefault();
            const pos = getMousePos(e);
            
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 24, 0, Math.PI * 2);
            ctx.fill();
            
            if(Math.random() > 0.8) calculateScratch();
        }

        function calculateScratch() {
            const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            let transparent = 0;
            for (let i = 3; i < pixels.length; i += 16) {
                if (pixels[i] === 0) transparent++;
            }
            const totalChecks = pixels.length / 16;
            const percent = Math.round((transparent / totalChecks) * 100);
            if (scratchPercent) scratchPercent.innerText = `${percent}% revealed`;

            if (percent > 55) {
                revealCard();
            }
        }

        function revealCard() {
            isRevealed = true;
            canvas.style.opacity = '0';
            canvas.style.pointerEvents = 'none';
            if (scratchPercent) scratchPercent.style.opacity = '0';
            if (resetBtn) resetBtn.classList.remove('hidden');
            if (badgeStatus) badgeStatus.innerText = '✨ revealed';
            
            showToast('💌', 'You found it. I meant every word. 💗');
        }

        canvas.addEventListener('mousedown', startScratch);
        canvas.addEventListener('mousemove', scratch);
        window.addEventListener('mouseup', stopScratch);
        canvas.addEventListener('touchstart', startScratch, {passive: false});
        canvas.addEventListener('touchmove', scratch, {passive: false});
        window.addEventListener('touchend', stopScratch);
        if (resetBtn) resetBtn.addEventListener('click', initCanvas);
        window.addEventListener('load', initCanvas);
        window.addEventListener('resize', () => { if(!isRevealed) initCanvas(); });
    }

    // 5. SCENE 4: WHACK-A-BOYFRIEND LOGIC
    const holes = document.querySelectorAll('.hole-container');
    if (holes.length > 0) {
        const hitCounterText = document.getElementById('hitCounter');
        const resetWhackBtn = document.getElementById('resetWhackBtn');

        let hits = 0;
        const maxHits = 10;
        let lastHole;
        let timeUp = false;
        let moleTimer;

        const sequentialMessages = [
            { icon: '💔', text: 'Ouch! Take it all out on me 🥺' },
            { icon: '🩹', text: 'Yep, I definitely deserved that.' },
            { icon: '🙏', text: "I'll do better, I promise." },
            { icon: '😭', text: "My bad, my bad, my bad!" },
            { icon: '🙈', text: "I'm a dummy, forgive me?" },
            { icon: '🤕', text: "Oof! Okay, message received!" },
            { icon: '🍕', text: "I'll buy you your favorite food!" },
            { icon: '💖', text: "Each hit, I'm even sorrier..." },
            { icon: '🥺', text: "Almost at perfect love..." },
            { icon: '🏆', text: "Okay okay — you win. I'm truly sorry." }
        ];

        function randomTime(min, max) {
            return Math.round(Math.random() * (max - min) + min);
        }

        function randomHole(holesList) {
            const idx = Math.floor(Math.random() * holesList.length);
            const hole = holesList[idx];
            if (hole === lastHole) return randomHole(holesList);
            lastHole = hole;
            return hole;
        }

        function peep() {
            if (hits >= maxHits) return;

            const time = randomTime(1400, 2400); 
            const hole = randomHole(holes);
            
            hole.classList.remove('hit');
            hole.classList.add('up');
            
            moleTimer = setTimeout(() => {
                hole.classList.remove('up');
                if (!timeUp && hits < maxHits) {
                    setTimeout(peep, randomTime(500, 1200)); 
                }
            }, time);
        }

        function whack(e) {
            const hole = this;
            if (!hole.classList.contains('up') || hole.classList.contains('hit')) return;
            
            hits++;
            if (hitCounterText) hitCounterText.innerText = `Hits: ${hits}/${maxHits}`;
            
            hole.classList.remove('up');
            hole.classList.add('hit');

            setTimeout(() => { hole.classList.remove('hit'); }, 400);

            if (slider) {
                let currentValue = parseInt(slider.value);
                let newValue = Math.max(0, currentValue - 10);
                slider.value = newValue;
                slider.dispatchEvent(new Event('input', { bubbles: true }));
            }

            const msgIndex = hits - 1; 
            if (sequentialMessages[msgIndex]) {
                showToast(sequentialMessages[msgIndex].icon, sequentialMessages[msgIndex].text);
            }
        }

        function startGame() {
            hits = 0;
            if (hitCounterText) hitCounterText.innerText = `Hits: ${hits}/${maxHits}`;
            timeUp = false;
            clearTimeout(moleTimer);
            
            holes.forEach(hole => {
                hole.classList.remove('up');
                hole.classList.remove('hit');
            });

            if (slider) {
                slider.value = 100;
                slider.dispatchEvent(new Event('input', { bubbles: true }));
            }

            peep();
        }

        holes.forEach(hole => {
            hole.addEventListener('mousedown', whack);
            hole.addEventListener('touchstart', (e) => {
                e.preventDefault();
                whack.call(hole, e);
            }, {passive: false});
        });

        if (resetWhackBtn) {
            resetWhackBtn.addEventListener('click', startGame);
        }
        
        startGame();
    }

    // 6. SCENE 5: SWEET BRIBERY DESK LOGIC -> DIRECTLY GO TO LETTER (SCENE 7)
    const promiseItems = document.querySelectorAll('.promise-item');
    const lockBriberyBtn = document.getElementById('lockBriberyBtn');

    if (promiseItems.length > 0) {
        promiseItems.forEach(item => {
            const checkbox = item.querySelector('.promise-checkbox');
            item.addEventListener('click', () => {
                if (!checkbox) return; 
                checkbox.checked = !checkbox.checked;
                if (checkbox.checked) {
                    item.classList.add('selected');
                } else {
                    item.classList.remove('selected');
                }
            });
        });

        if (lockBriberyBtn) {
            lockBriberyBtn.addEventListener('click', () => {
                const checkedBoxes = document.querySelectorAll('.promise-checkbox:checked');
                if (checkedBoxes.length === 0) {
                    showToast('⚠️', 'Pick at least one, I insist! 🥺');
                    return;
                }

                if (slider) {
                    let currentValue = parseInt(slider.value);
                    let newValue = Math.max(0, currentValue - 30);
                    slider.value = newValue;
                    slider.dispatchEvent(new Event('input', { bubbles: true }));
                }

                showToast('🔒', 'Promises locked in!');
                document.getElementById('scene7').scrollIntoView({ behavior: 'smooth' });
            });
        }
    }

    // 7. SCENE 8 & 6: RUNAWAY 'NO' BUTTON, YES -> FINGERPRINT SCANNER -> CERTIFICATE MODAL
    const noBtn = document.getElementById('noBtn');
    const yesBtn = document.getElementById('yesBtn');
    const certModal = document.getElementById('certModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    const certPromisesList = document.getElementById('certPromisesList');
    
    const scannerModal = document.getElementById('scannerModal');
    const cancelScannerBtn = document.getElementById('cancelScannerBtn');
    const scannerTouchArea = document.getElementById('scannerTouchArea');
    const scannerStatus = document.getElementById('scannerStatus');

    const runawayMessages = [
        { icon: '🏃‍♂️', text: 'It keeps running... just like I’ll keep trying 💖' },
        { icon: '💨', text: 'That button’s too shy to be pressed 🙈' },
        { icon: '🌸', text: 'Every "no" makes me adore you more 💕' },
        { icon: '🥺', text: 'Chase it all you want — I’m not giving up on us 🥺' },
        { icon: '💖', text: 'You don’t mean that 🥹 the pink one’s waiting 💗' }
    ];

    if (noBtn && yesBtn) {
        let runCount = 0;
        
        function moveNoButton() {
            const x = (Math.random() - 0.5) * 160;
            const y = (Math.random() - 0.5) * 80;
            noBtn.style.transform = `translate(${x}px, ${y}px)`;
            
            const currentYesScale = Math.min(1.4, 1 + (runCount * 0.08));
            noBtn.style.fontSize = `${Math.max(10, 14 - runCount)}px`;
            yesBtn.style.transform = `scale(${currentYesScale})`;

            const msg = runawayMessages[runCount % runawayMessages.length];
            showToast(msg.icon, msg.text);
            runCount++;
        }

        noBtn.addEventListener('mouseover', moveNoButton);
        noBtn.addEventListener('click', moveNoButton);
        noBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            moveNoButton();
        });
    }

    if (yesBtn) {
        yesBtn.addEventListener('click', () => {
            if (scannerModal) scannerModal.classList.add('open');
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            if (certModal) certModal.classList.remove('open');
        });
    }

    if (cancelScannerBtn) {
        cancelScannerBtn.addEventListener('click', () => {
            if (scannerModal) scannerModal.classList.remove('open');
        });
    }

    let holdTimer;
    let progressInterval;
    
    function startScan() {
        let progress = 0;
        scannerStatus.innerText = 'Verifying... 0%';
        
        progressInterval = setInterval(() => {
            progress += 5;
            if(progress <= 100) {
                scannerStatus.innerText = `Verifying... ${progress}%`;
            }
        }, 150);

        holdTimer = setTimeout(() => {
            clearInterval(progressInterval);
            scannerStatus.innerText = 'Verified! 💖';
            
            setTimeout(() => {
                if (scannerModal) scannerModal.classList.remove('open');
                
                const checkedBoxes = document.querySelectorAll('.promise-checkbox:checked');
                if (certPromisesList) {
                    certPromisesList.innerHTML = '';
                    if (checkedBoxes.length > 0) {
                        checkedBoxes.forEach((cb) => {
                            const li = document.createElement('li');
                            li.innerHTML = `<b>${cb.value}</b>`;
                            certPromisesList.appendChild(li);
                        });
                    } else {
                        const li = document.createElement('li');
                        li.innerHTML = `<b>Unlimited love and cuddles</b>`;
                        certPromisesList.appendChild(li);
                    }
                }

                if (certModal) certModal.classList.add('open');
                showToast('🎉', 'Deed of Reconciliation sealed!');
            }, 800);
        }, 3000);
    }

    function cancelScan() {
        clearTimeout(holdTimer);
        clearInterval(progressInterval);
        scannerStatus.innerText = 'Touch the scanner';
    }

    if (scannerTouchArea) {
        scannerTouchArea.addEventListener('mousedown', startScan);
        scannerTouchArea.addEventListener('mouseup', cancelScan);
        scannerTouchArea.addEventListener('touchstart', (e) => { e.preventDefault(); startScan(); }, {passive: false});
        scannerTouchArea.addEventListener('touchend', cancelScan);
    }

    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', () => {
            window.print();
        });
    }

});
