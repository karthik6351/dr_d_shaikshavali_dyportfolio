/* ========================================================
   Dr. Ganesh Kumar M — Portfolio JavaScript
   Premium Light Theme — Smooth interactions & animations
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Navbar Scroll Effect ----
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');

    function handleNavScroll() {
        const scrollY = window.scrollY;

        if (scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    // ---- Mobile Navigation Toggle ----
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // ---- Active Navigation Link ----
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNav() {
        const scrollY = window.scrollY + 150;
        let activeSectionId = 'hero';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                activeSectionId = sectionId;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${activeSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // ---- Scroll Reveal Animation (Staggered) ----
    const revealElements = document.querySelectorAll('[data-reveal]');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, index * 80);
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ---- Animated Counters (Smooth easeOutCubic) ----
    const counterElements = document.querySelectorAll('[data-target]');

    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2200;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Smooth ease-out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(target * easeOut);

            element.textContent = currentValue;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }

        requestAnimationFrame(updateCounter);
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    counterElements.forEach(el => counterObserver.observe(el));

    // ---- Typing Effect ----
    const typedTextElement = document.getElementById('typedText');
    const phrases = [
        'an Assistant Professor',
        'a VLSI Expert',
        'a Semiconductor Device Physicist',
        'a Microwave Engineering Researcher',
        'a Ph.D. in VLSI Domain'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 60;

    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typedTextElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 30;
        } else {
            typedTextElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 60;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            typingSpeed = 2500;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 400;
        }

        setTimeout(typeEffect, typingSpeed);
    }

    setTimeout(typeEffect, 1000);

    // ---- Smooth Scroll for Anchor Links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ---- Contact Form (Visual Feedback Only) ----
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const btn = this.querySelector('button[type="submit"]');
            const originalContent = btn.innerHTML;

            btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            btn.style.background = '#1a8f4e';

            setTimeout(() => {
                btn.innerHTML = originalContent;
                btn.style.background = '';
                this.reset();
            }, 3000);
        });
    }

    // ---- Parallax Effect for Hero Orbs ----
    const heroSection = document.querySelector('.hero');

    if (heroSection) {
        window.addEventListener('mousemove', (e) => {
            const orbs = document.querySelectorAll('.gradient-orb');
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;

            orbs.forEach((orb, index) => {
                const speed = (index + 1) * 8;
                orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
            });
        }, { passive: true });
    }

    // ---- Card Hover Lift Effect ----
    const cards = document.querySelectorAll('.project-card, .award-card, .metric-card, .exp-card, .contact-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });

    // ---- Show More Publications ----
    const showMorePubsBtn = document.getElementById('showMorePubs');
    if (showMorePubsBtn) {
        let currentlyVisible = 4;
        const pubsToRevealPerClick = 4;

        showMorePubsBtn.addEventListener('click', () => {
            const pubs = document.querySelectorAll('.pub-item');
            let newlyVisible = 0;

            for (let i = currentlyVisible; i < pubs.length; i++) {
                if (newlyVisible < pubsToRevealPerClick) {
                    pubs[i].style.display = 'flex';
                    pubs[i].classList.remove('pub-hidden');

                    // Animate in with a stagger
                    pubs[i].style.opacity = '0';
                    pubs[i].style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        pubs[i].style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                        pubs[i].style.opacity = '1';
                        pubs[i].style.transform = 'translateY(0)';
                    }, newlyVisible * 100);

                    newlyVisible++;
                }
            }

            currentlyVisible += newlyVisible;

            if (currentlyVisible >= pubs.length) {
                showMorePubsBtn.style.display = 'none';
            }
        });
    }

    // ---- Admin Functionality ----
    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminPanel = document.getElementById('adminPanel');
    const saveBtn = document.getElementById('saveChangesBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginError = document.getElementById('loginError');
    const adminLoginSection = document.getElementById('adminLoginSection');
    
    let isAdmin = localStorage.getItem('adminToken') !== null;

    function enableEditMode() {
        if(adminPanel) adminPanel.style.display = 'flex';
        if(adminLoginSection) adminLoginSection.style.display = 'none';
        
        // Make text elements editable
        const editableTags = document.querySelectorAll('main h1, main h2, main h3, main h4, main h5, main h6, main p:not(.typed-text), main span:not(.fas):not(.fab):not(.bx):not(.typed-cursor):not(.stat-number):not(.section-tag), main strong, main li');
        
        editableTags.forEach(el => {
            el.setAttribute('contenteditable', 'true');
            // Remove links default behavior when editing
            if(el.tagName.toLowerCase() === 'a' || el.closest('a')) {
                el.addEventListener('click', e => e.preventDefault());
            }
        });

        // Add +/- buttons to blocks
        const blockItems = document.querySelectorAll('.timeline-item, .exp-card, .project-card, .about-content-col li');
        blockItems.forEach(item => {
            if (!item.querySelector('.admin-item-actions')) {
                const actionsDiv = document.createElement('div');
                actionsDiv.className = 'admin-item-actions';
                actionsDiv.innerHTML = `
                    <button class="admin-add-btn" title="Duplicate Block"><i class="fas fa-plus"></i></button>
                    <button class="admin-remove-btn" title="Remove Block"><i class="fas fa-minus"></i></button>
                `;
                item.appendChild(actionsDiv);

                actionsDiv.querySelector('.admin-add-btn').addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const clone = item.cloneNode(true);
                    // Remove old actions div from clone to avoid duplicate events
                    const cloneActions = clone.querySelector('.admin-item-actions');
                    if (cloneActions) cloneActions.remove();
                    item.parentNode.insertBefore(clone, item.nextSibling);
                    // Re-run enableEditMode to attach events to new clone
                    enableEditMode();
                });

                actionsDiv.querySelector('.admin-remove-btn').addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (confirm('Are you sure you want to remove this block?')) {
                        item.remove();
                    }
                });
            }
        });
    }

    function disableEditMode() {
        if(adminPanel) adminPanel.style.display = 'none';
        if(adminLoginSection) adminLoginSection.style.display = 'block';
        
        const editableTags = document.querySelectorAll('[contenteditable="true"]');
        editableTags.forEach(el => {
            el.removeAttribute('contenteditable');
        });

        const actionsDivs = document.querySelectorAll('.admin-item-actions');
        actionsDivs.forEach(el => el.remove());
    }

    if (isAdmin) {
        enableEditMode();
    }

    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('adminUser').value;
            const password = document.getElementById('adminPass').value;
            
            try {
                const res = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                const data = await res.json();
                
                if (data.success) {
                    localStorage.setItem('adminToken', data.token);
                    if(loginError) loginError.style.display = 'none';
                    enableEditMode();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    if(loginError) loginError.style.display = 'block';
                }
            } catch (err) {
                console.error(err);
                if(loginError) {
                    loginError.textContent = 'Server not running. Start server.js first.';
                    loginError.style.display = 'block';
                }
            }
        });
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', async () => {
            const originalText = saveBtn.innerHTML;
            saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
            
            const mainClone = document.getElementById('main').cloneNode(true);
            mainClone.querySelectorAll('.admin-item-actions').forEach(el => el.remove());
            mainClone.querySelectorAll('[contenteditable="true"]').forEach(el => {
                el.removeAttribute('contenteditable');
            });
            const htmlToSave = mainClone.innerHTML;
            
            try {
                const res = await fetch('/api/save', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        token: localStorage.getItem('adminToken'),
                        mainContent: htmlToSave
                    })
                });
                const data = await res.json();
                if (data.success) {
                    saveBtn.innerHTML = '<i class="fas fa-check"></i> Saved!';
                    setTimeout(() => saveBtn.innerHTML = originalText, 2000);
                } else {
                    alert('Error saving: ' + data.message);
                    saveBtn.innerHTML = originalText;
                }
            } catch (err) {
                console.error(err);
                alert('Error saving. Server not running.');
                saveBtn.innerHTML = originalText;
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('adminToken');
            disableEditMode();
            window.location.reload();
        });
    }

});
