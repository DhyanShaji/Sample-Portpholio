document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================================
       Background Effects (Tilt)
       ========================================================================== */
    const mainCard = document.querySelector('.main-card');
    
    // Custom Cursor Elements
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');
    const interactables = document.querySelectorAll('a, button, .social-icons i');

    // Typing Effect State
    const typeWriterTitle = document.getElementById('typewriter-title');
    const textToType = "Building the AI & Data systems of the future, today.";
    let isTyping = false;
    
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        
        // 1. Custom Cursor Follower
        if(cursorDot && cursorOutline) {
            cursorDot.style.left = `${x}px`;
            cursorDot.style.top = `${y}px`;
            
            // Add a slight delay to the outline using animate for smoother tracking
            cursorOutline.animate({
                left: `${x}px`,
                top: `${y}px`
            }, { duration: 500, fill: "forwards" });
        }

        // 2. Main Card Tilt Effect
        if (mainCard) {
            const rect = mainCard.getBoundingClientRect();
            const cardCenterX = rect.left + rect.width / 2;
            const cardCenterY = rect.top + rect.height / 2;
            const rotateX = (y - cardCenterY) * -0.01;
            const rotateY = (x - cardCenterX) * 0.01;
            
            mainCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        }
    });

    document.addEventListener('mouseleave', () => {
        if (mainCard) {
            mainCard.style.transform = `perspective(1000px) rotateX(0) rotateY(0) translateY(0)`;
        }
    });

    /* ==========================================================================
       Custom Cursor Hover States
       ========================================================================== */
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if(cursorOutline) {
                cursorOutline.style.width = '60px';
                cursorOutline.style.height = '60px';
                cursorOutline.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }
        });
        el.addEventListener('mouseleave', () => {
            if(cursorOutline) {
                cursorOutline.style.width = '40px';
                cursorOutline.style.height = '40px';
                cursorOutline.style.backgroundColor = 'transparent';
            }
        });
    });

    /* ==========================================================================
       Magnetic Buttons
       ========================================================================== */
    const magneticButtons = document.querySelectorAll('.btn');
    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            // Pull the button slightly towards cursor
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            // Reset to original position
            btn.style.transform = `translate(0px, 0px)`;
        });
    });

    /* ==========================================================================
       Login Modal Logic
       ========================================================================== */
    const loginModal = document.getElementById('login-modal');
    const openLoginBtn = document.getElementById('open-login-btn');
    const closeLoginBtn = document.getElementById('close-login-btn');

    if (openLoginBtn && loginModal && closeLoginBtn) {
        openLoginBtn.addEventListener('click', () => {
            loginModal.classList.add('open');
        });

        closeLoginBtn.addEventListener('click', () => {
            loginModal.classList.remove('open');
        });

        // Close when clicking outside the modal content
        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                loginModal.classList.remove('open');
            }
        });
    }

    /* ==========================================================================
       Scroll Reveal & Typing Effect
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal');

    const typeText = (element, text, i = 0) => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            setTimeout(() => typeText(element, text, i + 1), 50); // Typing speed
        } else {
            element.classList.add('done'); // Stop blinking cursor
        }
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Trigger fade/slide in
                entry.target.classList.add('active');
                
                // Trigger typing effect if the target is the profile section
                if (entry.target.classList.contains('profile-section') && !isTyping) {
                    isTyping = true;
                    if(typeWriterTitle) {
                        typeText(typeWriterTitle, textToType);
                    }
                }
                
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target); 
            }
        });
    }, {
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
});
