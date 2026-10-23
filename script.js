/* ========================================================
   Dr. Dudekula Shaikshavali — Dynamic Portfolio JavaScript
   Integrated with MongoDB Atlas, Image Uploads & Admin Studio
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // Global Portfolio State
    let portfolioData = null;
    let isQuickEditActive = false;
    let typewriterTimeout = null;

    // ---- Core UI: Navbar Scroll Effect ----
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

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

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

    // ---- Scroll Reveal Animation ----
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('[data-reveal]');
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, index * 60);
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -30px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }
    initScrollReveal();

    // ---- Animated Counters ----
    function initCounters() {
        const counterElements = document.querySelectorAll('[data-target]');
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const target = parseInt(element.getAttribute('data-target')) || 0;
                    const duration = 2000;
                    const startTime = performance.now();

                    function updateCounter(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const easeOut = 1 - Math.pow(1 - progress, 3);
                        element.textContent = Math.floor(target * easeOut);

                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        } else {
                            element.textContent = target;
                        }
                    }

                    requestAnimationFrame(updateCounter);
                    counterObserver.unobserve(element);
                }
            });
        }, { threshold: 0.4 });

        counterElements.forEach(el => counterObserver.observe(el));
    }
    initCounters();

    // ---- Typewriter Effect ----
    const typedTextElement = document.getElementById('typedText');
    let phrases = [
        'an Assistant Professor',
        'a VLSI Expert',
        'a Semiconductor Device Physicist',
        'a Microwave Engineering Researcher',
        'a Ph.D. in VLSI Domain'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function runTypeEffect() {
        if (!typedTextElement) return;
        const currentPhrase = phrases[phraseIndex] || '';

        if (isDeleting) {
            typedTextElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedTextElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        let typingSpeed = isDeleting ? 35 : 65;

        if (!isDeleting && charIndex === currentPhrase.length) {
            typingSpeed = 2400;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 400;
        }

        if (typewriterTimeout) clearTimeout(typewriterTimeout);
        typewriterTimeout = setTimeout(runTypeEffect, typingSpeed);
    }
    runTypeEffect();

    // ---- Smooth Anchor Scroll ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !targetId) return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const offsetTop = targetElement.offsetTop - 75;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ---- Contact Form Visual Handler ----
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = this.querySelector('button[type="submit"]');
            const originalContent = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            btn.style.background = '#10b981';

            setTimeout(() => {
                btn.innerHTML = originalContent;
                btn.style.background = '';
                this.reset();
            }, 3000);
        });
    }

    // ========================================================
    // TOAST NOTIFICATION UTILITY
    // ========================================================
    function showToast(message, type = 'success') {
        const container = document.getElementById('adminToastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `admin-toast ${type === 'error' ? 'toast-error' : 'toast-success'}`;
        const icon = type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle';
        toast.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    // ========================================================
    // BACKEND URL RESOLUTION (Vercel <-> Render Linkage)
    // ========================================================
    function getApiBaseUrl() {
        const custom = localStorage.getItem('customBackendUrl');
        if (custom && custom.trim() !== '') {
            return custom.trim().replace(/\/$/, '');
        }

        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        if (isLocal) {
            if (window.location.port === '3000') {
                return '';
            }
            return 'http://localhost:3000';
        }

        if (window.APP_CONFIG && window.APP_CONFIG.BACKEND_URL) {
            return window.APP_CONFIG.BACKEND_URL.trim().replace(/\/$/, '');
        }

        return 'https://dr-shaikshavali-portfolio-backend.onrender.com';
    }

    // ========================================================
    // DATA FETCHING & DYNAMIC RENDERING (With Offline Fallback)
    // ========================================================
    async function fetchPortfolio() {
        const baseUrl = getApiBaseUrl();
        try {
            const res = await fetch(`${baseUrl}/api/portfolio`);
            const json = await res.json();
            if (json.success && json.data) {
                portfolioData = json.data;
                renderPortfolio(portfolioData);
                return;
            }
        } catch (err) {
            console.warn('Backend server unreachable or starting up:', err.message);
        }

        // Resilient fallback to local static data if Render backend is sleeping
        try {
            const fallbackRes = await fetch('./portfolio-data.json');
            const fallbackJson = await fallbackRes.json();
            if (fallbackJson) {
                portfolioData = fallbackJson;
                renderPortfolio(portfolioData);
            }
        } catch (errFallback) {
            console.warn('Local static fallback error:', errFallback.message);
        }
    }

    function renderPortfolio(data) {
        if (!data) return;

        // 1. Hero
        if (data.hero) {
            const heroName = document.getElementById('heroName');
            const heroBadgeText = document.getElementById('heroBadgeText');
            const statPubs = document.getElementById('statPubs');
            const statPatents = document.getElementById('statPatents');
            const statExp = document.getElementById('statExp');
            const resumeBtn = document.getElementById('resumeBtn');

            if (heroName && data.hero.name) heroName.textContent = data.hero.name;
            if (heroBadgeText && data.hero.badge) heroBadgeText.textContent = data.hero.badge;

            if (data.hero.typedPhrases && data.hero.typedPhrases.length > 0) {
                phrases = data.hero.typedPhrases;
                phraseIndex = 0;
                charIndex = 0;
                isDeleting = false;
            }

            if (data.hero.stats) {
                if (statPubs) {
                    statPubs.setAttribute('data-target', data.hero.stats.publications || 0);
                    statPubs.textContent = data.hero.stats.publications || 0;
                }
                if (statPatents) {
                    statPatents.setAttribute('data-target', data.hero.stats.patents || 0);
                    statPatents.textContent = data.hero.stats.patents || 0;
                }
                if (statExp) {
                    statExp.setAttribute('data-target', data.hero.stats.experience || 0);
                    statExp.textContent = data.hero.stats.experience || 0;
                }
            }

            if (resumeBtn && data.hero.resumeUrl) {
                resumeBtn.href = data.hero.resumeUrl;
            }
        }

        // 2. About Section & Photo
        if (data.about) {
            const profileImg = document.getElementById('profileImg');
            const aboutBadge = document.getElementById('aboutBadge');
            const aboutRole = document.getElementById('aboutRole');
            const aboutInstitution = document.getElementById('aboutInstitution');
            const aboutBio = document.getElementById('aboutBio');
            const aboutPhd = document.getElementById('aboutPhd');
            const aboutMtech = document.getElementById('aboutMtech');
            const aboutEmail = document.getElementById('aboutEmail');
            const aboutPhone = document.getElementById('aboutPhone');
            const aboutDob = document.getElementById('aboutDob');
            const aboutLanguages = document.getElementById('aboutLanguages');
            const competenciesContainer = document.getElementById('competenciesContainer');

            if (profileImg && data.about.image) {
                profileImg.src = data.about.image;
            }
            if (aboutBadge && data.about.badge) {
                aboutBadge.innerHTML = `<i class="fas fa-award"></i> ${data.about.badge}`;
            }
            if (aboutRole && data.about.role) aboutRole.textContent = data.about.role;
            if (aboutInstitution && data.about.institution) {
                aboutInstitution.innerHTML = `<i class="fas fa-university"></i> ${data.about.institution}`;
            }
            if (aboutBio && data.about.bio) aboutBio.textContent = data.about.bio;

            if (data.about.details) {
                if (aboutPhd && data.about.details.phd) aboutPhd.textContent = data.about.details.phd;
                if (aboutMtech && data.about.details.mtech) aboutMtech.textContent = data.about.details.mtech;
                if (aboutEmail && data.about.details.email) aboutEmail.textContent = data.about.details.email;
                if (aboutPhone && data.about.details.phone) aboutPhone.textContent = data.about.details.phone;
                if (aboutDob && data.about.details.dob) aboutDob.textContent = data.about.details.dob;
                if (aboutLanguages && data.about.details.languages) aboutLanguages.textContent = data.about.details.languages;
            }

            if (competenciesContainer && data.about.competencies && data.about.competencies.length > 0) {
                competenciesContainer.innerHTML = data.about.competencies
                    .map(item => `<span class="research-tag">${item}</span>`)
                    .join('');
            }
        }

        // 3. Education Timeline
        if (data.education && Array.isArray(data.education) && data.education.length > 0) {
            const educationTimeline = document.getElementById('educationTimeline');
            if (educationTimeline) {
                educationTimeline.innerHTML = data.education.map(edu => `
                    <div class="timeline-item">
                        <div class="timeline-marker"></div>
                        <div class="timeline-content">
                            <div class="timeline-badge">${edu.period || ''}</div>
                            <h4>${edu.degree || ''}</h4>
                            <p class="timeline-org"><i class="fas fa-university"></i> ${edu.institution || ''}</p>
                            ${edu.thesis ? `<p style="margin-top: 10px; font-size: 0.9rem; color: var(--text-secondary);">
                                <strong>Thesis:</strong> ${edu.thesis}<br>
                                ${edu.fields ? `<strong>Fields:</strong> ${edu.fields}<br>` : ''}
                                ${edu.grade ? `<strong>Grade:</strong> ${edu.grade}` : ''}
                            </p>` : ''}
                        </div>
                    </div>
                `).join('');
            }
        }

        // 4. Experience Grid
        if (data.experience && Array.isArray(data.experience) && data.experience.length > 0) {
            const experienceGrid = document.getElementById('experienceGrid');
            if (experienceGrid) {
                experienceGrid.innerHTML = data.experience.map(exp => `
                    <div class="exp-card ${exp.isCurrent ? 'exp-current' : ''}">
                        <div class="exp-period">
                            <span class="exp-year">${exp.period || ''}</span>
                            ${exp.isCurrent ? '<span class="exp-badge-current">Current</span>' : ''}
                        </div>
                        <div class="exp-content">
                            <h4>${exp.role || ''}</h4>
                            <p class="exp-org"><i class="fas fa-building-columns"></i> ${exp.organization || ''}</p>
                            ${exp.highlights && exp.highlights.length > 0 ? `
                                <ul class="exp-highlights" style="margin-top: 10px;">
                                    ${exp.highlights.map(h => `<li>${h}</li>`).join('')}
                                </ul>
                            ` : ''}
                        </div>
                    </div>
                `).join('');
            }
        }

        // 5. Publications Grid
        if (data.publications && Array.isArray(data.publications) && data.publications.length > 0) {
            const publicationsGrid = document.getElementById('publicationsGrid');
            if (publicationsGrid) {
                publicationsGrid.innerHTML = data.publications.map(pub => `
                    <div class="project-card">
                        <div class="project-icon"><i class="fas fa-book-open"></i></div>
                        <span class="project-status published">${pub.status || 'PUBLISHED'}</span>
                        <h4>${pub.title || ''}</h4>
                        <div class="project-meta" style="margin-top: 15px;">
                            <div class="project-meta-item">
                                <i class="fas fa-newspaper"></i>
                                <span>${pub.journal || ''}</span>
                            </div>
                            <div class="project-meta-item">
                                <i class="fas fa-calendar-alt"></i>
                                <span>${pub.year || ''}</span>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }

        // 6. Conferences Grid
        if (data.conferences && Array.isArray(data.conferences) && data.conferences.length > 0) {
            const conferencesGrid = document.getElementById('conferencesGrid');
            if (conferencesGrid) {
                conferencesGrid.innerHTML = data.conferences.map(conf => `
                    <div class="project-card">
                        <div class="project-icon"><i class="fas fa-chalkboard-teacher"></i></div>
                        <span class="project-status published">${conf.status || 'PRESENTED'}</span>
                        <h4>${conf.title || ''}</h4>
                        <div class="project-subtitle" style="margin-top: 10px; margin-bottom: 15px;">
                            ${conf.event || ''}
                        </div>
                        <div class="project-meta">
                            <div class="project-meta-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${conf.location || ''}</span>
                            </div>
                            <div class="project-meta-item">
                                <i class="fas fa-calendar-alt"></i>
                                <span>${conf.dates || ''}</span>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }

        // 7. Book Chapters Grid
        if (data.bookChapters && Array.isArray(data.bookChapters) && data.bookChapters.length > 0) {
            const bookChaptersGrid = document.getElementById('bookChaptersGrid');
            if (bookChaptersGrid) {
                bookChaptersGrid.innerHTML = data.bookChapters.map(book => `
                    <div class="project-card">
                        <div class="project-icon"><i class="fas fa-book"></i></div>
                        <span class="project-status published">${book.status || 'PUBLISHED'}</span>
                        <h4>${book.title || ''}</h4>
                        <div class="project-subtitle" style="margin-top: 10px; margin-bottom: 15px;">
                            ${book.details || ''}
                        </div>
                        <div class="project-meta">
                            <div class="project-meta-item">
                                <i class="fas fa-calendar-alt"></i>
                                <span>${book.date || ''}</span>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }

        // 8. Patents Grid
        if (data.patents && Array.isArray(data.patents) && data.patents.length > 0) {
            const patentsGrid = document.getElementById('patentsGrid');
            if (patentsGrid) {
                patentsGrid.innerHTML = data.patents.map(pat => `
                    <div class="project-card">
                        <div class="project-icon"><i class="fas fa-certificate"></i></div>
                        <span class="project-status completed">${pat.status || 'FILED'}</span>
                        <h4>${pat.title || ''}</h4>
                        <div class="project-meta" style="margin-top: 15px;">
                            <div class="project-meta-item">
                                <i class="fas fa-globe"></i>
                                <span>${pat.country || ''}</span>
                            </div>
                            <div class="project-meta-item">
                                <i class="fas fa-calendar-alt"></i>
                                <span>${pat.date || ''}</span>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }

        // 9. Funded Projects Grid
        if (data.fundedProjects && Array.isArray(data.fundedProjects) && data.fundedProjects.length > 0) {
            const fundedProjectsGrid = document.getElementById('fundedProjectsGrid');
            if (fundedProjectsGrid) {
                fundedProjectsGrid.innerHTML = data.fundedProjects.map(proj => `
                    <div class="project-card">
                        <div class="project-icon"><i class="fas fa-flask"></i></div>
                        <span class="project-status ongoing">${proj.status || 'ONGOING'}</span>
                        <h4>${proj.title || ''}</h4>
                        <div class="project-subtitle" style="margin-top: 15px; margin-bottom: 15px;">
                            ${proj.description || ''}
                        </div>
                        <div class="project-meta">
                            <div class="project-meta-item">
                                <i class="fas fa-university"></i>
                                <span>${proj.agency || ''}</span>
                            </div>
                            <div class="project-meta-item">
                                <i class="fas fa-rupee-sign"></i>
                                <span>${proj.amount || ''}</span>
                            </div>
                            <div class="project-meta-item">
                                <i class="fas fa-calendar-alt"></i>
                                <span>${proj.period || ''}</span>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }

        // 10. Activities (Organisational, Memberships, Workshops, Certifications)
        if (data.activities) {
            const organisationalList = document.getElementById('organisationalList');
            const membershipsGrid = document.getElementById('membershipsGrid');
            const workshopsList = document.getElementById('workshopsList');
            const certificationsGrid = document.getElementById('certificationsGrid');

            if (organisationalList && data.activities.organisational) {
                organisationalList.innerHTML = data.activities.organisational.map(item => `
                    <li style="margin-bottom: 15px; display: flex; align-items: flex-start; gap: 10px;">
                        <i class="fas fa-check-circle" style="color: var(--accent-secondary); margin-top: 5px;"></i>
                        <span>${item}</span>
                    </li>
                `).join('');
            }

            if (membershipsGrid && data.activities.memberships) {
                membershipsGrid.innerHTML = data.activities.memberships.map(item => `
                    <div class="course-chip"><i class="fas fa-award"></i> ${item}</div>
                `).join('');
            }

            if (workshopsList && data.activities.workshops) {
                workshopsList.innerHTML = data.activities.workshops.map(ws => `
                    <li style="margin-bottom: 15px; display: flex; align-items: flex-start; gap: 10px;">
                        <i class="fas fa-calendar-check" style="color: var(--accent-secondary); margin-top: 5px;"></i>
                        <div>
                            <strong>${ws.title || ''}</strong><br>
                            <span style="font-size: 0.85rem; color: var(--text-secondary);">${ws.institution || ''} | ${ws.dates || ''}</span>
                        </div>
                    </li>
                `).join('');
            }

            if (certificationsGrid && data.activities.certifications) {
                certificationsGrid.innerHTML = data.activities.certifications.map(c => `
                    <div class="course-chip"><i class="fas fa-medal"></i> ${c}</div>
                `).join('');
            }
        }

        // 11. Contact & Socials
        if (data.contact) {
            const contactLocationText = document.getElementById('contactLocationText');
            const contactEmailLink = document.getElementById('contactEmailLink');
            const contactPhoneLink = document.getElementById('contactPhoneLink');
            const footerLinkedIn = document.getElementById('footerLinkedIn');
            const footerScholar = document.getElementById('footerScholar');
            const footerEmail = document.getElementById('footerEmail');

            if (contactLocationText && data.contact.location) contactLocationText.textContent = data.contact.location;
            if (contactEmailLink && data.contact.email) {
                contactEmailLink.textContent = data.contact.email;
                contactEmailLink.href = `mailto:${data.contact.email}`;
            }
            if (contactPhoneLink && data.contact.phone) {
                contactPhoneLink.textContent = data.contact.phone;
                contactPhoneLink.href = `tel:${data.contact.phone.replace(/[^0-9+]/g, '')}`;
            }
            if (footerLinkedIn && data.contact.linkedin) footerLinkedIn.href = data.contact.linkedin;
            if (footerScholar && data.contact.scholar) footerScholar.href = data.contact.scholar;
            if (footerEmail && data.contact.email) footerEmail.href = `mailto:${data.contact.email}`;
        }

        // 12. Academic & Campus Photo Gallery (Auto-Scrolling)
        renderPublicGallery(data.gallery);

        // If quick edit mode was on, re-apply section shortcuts
        if (isQuickEditActive) {
            attachSectionEditButtons();
        }
    }

    // ========================================================
    // ADMIN AUTHENTICATION & BAR
    // ========================================================
    const adminFloatingBar = document.getElementById('adminFloatingBar');
    const adminLoginTrigger = document.getElementById('adminLoginTrigger');
    const adminLoginModal = document.getElementById('adminLoginModal');
    const closeLoginModalBtn = document.getElementById('closeLoginModalBtn');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const loginError = document.getElementById('loginError');
    const adminLogoutBtn = document.getElementById('adminLogoutBtn');
    const changePhotoBtn = document.getElementById('changePhotoBtn');

    function checkAdminAuth() {
        return !!localStorage.getItem('adminToken');
    }

    function updateAdminUI() {
        const isAdmin = checkAdminAuth();
        const galleryAdminAction = document.getElementById('galleryAdminAction');
        if (isAdmin) {
            if (adminFloatingBar) adminFloatingBar.style.display = 'flex';
            if (adminLoginTrigger) adminLoginTrigger.style.display = 'none';
            if (changePhotoBtn) changePhotoBtn.style.display = 'flex';
            if (galleryAdminAction) galleryAdminAction.style.display = 'flex';
        } else {
            if (adminFloatingBar) adminFloatingBar.style.display = 'none';
            if (adminLoginTrigger) adminLoginTrigger.style.display = 'flex';
            if (changePhotoBtn) changePhotoBtn.style.display = 'none';
            if (galleryAdminAction) galleryAdminAction.style.display = 'none';
            disableQuickEdit();
        }
    }

    // Trigger Login Modal
    if (adminLoginTrigger) {
        adminLoginTrigger.addEventListener('click', () => {
            if (adminLoginModal) adminLoginModal.classList.add('active');
        });
    }

    if (closeLoginModalBtn) {
        closeLoginModalBtn.addEventListener('click', () => {
            if (adminLoginModal) adminLoginModal.classList.remove('active');
        });
    }

    // Login Form Submit
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('adminUser').value.trim();
            const password = document.getElementById('adminPass').value.trim();
            const submitBtn = document.getElementById('loginSubmitBtn');
            const origText = submitBtn.innerHTML;

            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';

            try {
                const res = await fetch(`${getApiBaseUrl()}/api/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                const data = await res.json();

                if (data.success && data.token) {
                    localStorage.setItem('adminToken', data.token);
                    if (loginError) loginError.style.display = 'none';
                    if (adminLoginModal) adminLoginModal.classList.remove('active');
                    updateAdminUI();
                    showToast('Welcome Dr. Shaikshavali! Admin Studio is now active.');
                } else {
                    if (loginError) {
                        loginError.textContent = data.message || 'Invalid credentials';
                        loginError.style.display = 'block';
                    }
                }
            } catch (err) {
                if (loginError) {
                    loginError.textContent = 'Backend server offline or waking up on Render. Please retry in a few seconds.';
                    loginError.style.display = 'block';
                }
            } finally {
                submitBtn.innerHTML = origText;
            }
        });
    }

    // Logout
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', () => {
            localStorage.removeItem('adminToken');
            updateAdminUI();
            showToast('You have logged out of Admin mode.');
        });
    }

    // ========================================================
    // DIRECT PROFILE PHOTO UPLOAD (CAMERA OVERLAY)
    // ========================================================
    const directPhotoFileInput = document.getElementById('directPhotoFileInput');

    if (changePhotoBtn && directPhotoFileInput) {
        changePhotoBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            directPhotoFileInput.click();
        });

        directPhotoFileInput.addEventListener('change', async () => {
            const file = directPhotoFileInput.files[0];
            if (!file) return;

            showToast('Uploading profile picture to MongoDB...', 'success');
            const token = localStorage.getItem('adminToken');
            const formData = new FormData();
            formData.append('file', file);

            try {
                const res = await fetch(`${getApiBaseUrl()}/api/upload`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });
                const json = await res.json();

                if (json.success && json.url) {
                    const profileImg = document.getElementById('profileImg');
                    if (profileImg) profileImg.src = json.url;

                    if (!portfolioData) portfolioData = {};
                    if (!portfolioData.about) portfolioData.about = {};
                    portfolioData.about.image = json.url;

                    // Automatically save updated image to MongoDB
                    await savePortfolioData(false);
                    showToast('Profile photo updated & saved to MongoDB Atlas!');
                } else {
                    showToast(json.message || 'Upload failed', 'error');
                }
            } catch (err) {
                showToast('Upload failed: ' + err.message, 'error');
            }
        });
    }

    // ========================================================
    // ADMIN STUDIO DASHBOARD MODAL
    // ========================================================
    const adminStudioModal = document.getElementById('adminStudioModal');
    const openStudioBtn = document.getElementById('openStudioBtn');
    const closeStudioModalBtn = document.getElementById('closeStudioModalBtn');
    const closeStudioFooterBtn = document.getElementById('closeStudioFooterBtn');
    const studioSaveBtn = document.getElementById('studioSaveBtn');
    const saveStudioFooterBtn = document.getElementById('saveStudioFooterBtn');
    const quickSaveBtn = document.getElementById('quickSaveBtn');

    function openStudio(targetTabId = 'tab-hero') {
        if (!adminStudioModal) return;
        populateStudioInputs();
        switchStudioTab(targetTabId);
        fetchGalleryImages();
        adminStudioModal.classList.add('active');
    }

    function closeStudio() {
        if (adminStudioModal) adminStudioModal.classList.remove('active');
    }

    if (openStudioBtn) openStudioBtn.addEventListener('click', () => openStudio('tab-hero'));
    if (closeStudioModalBtn) closeStudioModalBtn.addEventListener('click', closeStudio);
    if (closeStudioFooterBtn) closeStudioFooterBtn.addEventListener('click', closeStudio);

    // Tab Switching
    function switchStudioTab(tabId) {
        document.querySelectorAll('.studio-tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
        });
        document.querySelectorAll('.studio-tab-pane').forEach(pane => {
            pane.classList.toggle('active', pane.getAttribute('id') === tabId);
        });
    }

    document.querySelectorAll('.studio-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            switchStudioTab(tabId);
        });
    });

    // Populate Studio Inputs from current state
    function populateStudioInputs() {
        if (!portfolioData) return;

        // Hero
        if (portfolioData.hero) {
            setInputValue('inputHeroName', portfolioData.hero.name);
            setInputValue('inputHeroBadge', portfolioData.hero.badge);
            setInputValue('inputTypedPhrases', (portfolioData.hero.typedPhrases || []).join('\n'));
            if (portfolioData.hero.stats) {
                setInputValue('inputStatPubs', portfolioData.hero.stats.publications);
                setInputValue('inputStatPatents', portfolioData.hero.stats.patents);
                setInputValue('inputStatExp', portfolioData.hero.stats.experience);
            }
            setInputValue('inputResumeUrl', portfolioData.hero.resumeUrl);
        }

        // Media & About
        if (portfolioData.about) {
            const studioProfilePreview = document.getElementById('studioProfilePreview');
            const currentImageLabel = document.getElementById('currentImageLabel');
            if (studioProfilePreview && portfolioData.about.image) {
                studioProfilePreview.src = portfolioData.about.image;
            }
            if (currentImageLabel && portfolioData.about.image) {
                currentImageLabel.textContent = portfolioData.about.image;
            }

            setInputValue('inputAboutRole', portfolioData.about.role);
            setInputValue('inputAboutInstitution', portfolioData.about.institution);
            setInputValue('inputAboutBadge', portfolioData.about.badge);
            setInputValue('inputAboutBio', portfolioData.about.bio);

            if (portfolioData.about.details) {
                setInputValue('inputAboutPhd', portfolioData.about.details.phd);
                setInputValue('inputAboutMtech', portfolioData.about.details.mtech);
                setInputValue('inputAboutEmail', portfolioData.about.details.email);
                setInputValue('inputAboutPhone', portfolioData.about.details.phone);
                setInputValue('inputAboutDob', portfolioData.about.details.dob);
                setInputValue('inputAboutLanguages', portfolioData.about.details.languages);
            }

            renderStudioTags();
        }

        // Render dynamic list items
        renderStudioEducationList();
        renderStudioExperienceList();
        renderStudioPublicationsList();
        renderStudioConferencesList();
        renderStudioBookChaptersList();
        renderStudioPatentsList();
        renderStudioProjectsList();
        renderStudioGalleryList();

        // Activities
        if (portfolioData.activities) {
            setInputValue('inputOrganisational', (portfolioData.activities.organisational || []).join('\n'));
            setInputValue('inputMemberships', (portfolioData.activities.memberships || []).join('\n'));
            setInputValue('inputCertifications', (portfolioData.activities.certifications || []).join('\n'));
        }

        // Contact
        if (portfolioData.contact) {
            setInputValue('inputContactLocation', portfolioData.contact.location);
            setInputValue('inputContactEmail', portfolioData.contact.email);
            setInputValue('inputContactPhone', portfolioData.contact.phone);
            setInputValue('inputContactLinkedIn', portfolioData.contact.linkedin);
            setInputValue('inputContactScholar', portfolioData.contact.scholar);
        }

        syncBackendSettingsUI();
    }

    function setInputValue(id, val) {
        const el = document.getElementById(id);
        if (el) el.value = val !== undefined && val !== null ? val : '';
    }

    function getInputValue(id) {
        const el = document.getElementById(id);
        return el ? el.value.trim() : '';
    }

    // ========================================================
    // STUDIO MEDIA & PHOTO UPLOADER
    // ========================================================
    const photoDropzone = document.getElementById('photoDropzone');
    const choosePhotoFileBtn = document.getElementById('choosePhotoFileBtn');
    const applyImageUrlBtn = document.getElementById('applyImageUrlBtn');
    const inputCustomImageUrl = document.getElementById('inputCustomImageUrl');
    const uploadResumeBtn = document.getElementById('uploadResumeBtn');
    const directResumeFileInput = document.getElementById('directResumeFileInput');
    const refreshGalleryBtn = document.getElementById('refreshGalleryBtn');

    if (choosePhotoFileBtn && directPhotoFileInput) {
        choosePhotoFileBtn.addEventListener('click', () => directPhotoFileInput.click());
    }

    if (photoDropzone && directPhotoFileInput) {
        photoDropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            photoDropzone.classList.add('drag-over');
        });
        photoDropzone.addEventListener('dragleave', () => {
            photoDropzone.classList.remove('drag-over');
        });
        photoDropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            photoDropzone.classList.remove('drag-over');
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                directPhotoFileInput.files = e.dataTransfer.files;
                directPhotoFileInput.dispatchEvent(new Event('change'));
            }
        });
    }

    if (applyImageUrlBtn && inputCustomImageUrl) {
        applyImageUrlBtn.addEventListener('click', () => {
            const url = inputCustomImageUrl.value.trim();
            if (!url) return;
            if (!portfolioData) portfolioData = {};
            if (!portfolioData.about) portfolioData.about = {};
            portfolioData.about.image = url;

            const studioProfilePreview = document.getElementById('studioProfilePreview');
            const profileImg = document.getElementById('profileImg');
            if (studioProfilePreview) studioProfilePreview.src = url;
            if (profileImg) profileImg.src = url;

            showToast('Custom image URL applied to profile photo!');
        });
    }

    // Resume PDF Upload in Studio
    if (uploadResumeBtn && directResumeFileInput) {
        uploadResumeBtn.addEventListener('click', () => directResumeFileInput.click());

        directResumeFileInput.addEventListener('change', async () => {
            const file = directResumeFileInput.files[0];
            if (!file) return;

            showToast('Uploading resume PDF...', 'success');
            const token = localStorage.getItem('adminToken');
            const formData = new FormData();
            formData.append('file', file);

            try {
                const res = await fetch(`${getApiBaseUrl()}/api/upload`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData
                });
                const json = await res.json();
                if (json.success && json.url) {
                    setInputValue('inputResumeUrl', json.url);
                    if (!portfolioData) portfolioData = {};
                    if (!portfolioData.hero) portfolioData.hero = {};
                    portfolioData.hero.resumeUrl = json.url;

                    const resumeBtn = document.getElementById('resumeBtn');
                    if (resumeBtn) resumeBtn.href = json.url;

                    showToast('Resume uploaded successfully!');
                } else {
                    showToast(json.message || 'PDF upload failed', 'error');
                }
            } catch (err) {
                showToast('PDF upload failed: ' + err.message, 'error');
            }
        });
    }

    // Fetch and render uploaded media gallery
    async function fetchGalleryImages() {
        const grid = document.getElementById('studioGalleryGrid');
        if (!grid) return;

        const token = localStorage.getItem('adminToken');
        if (!token) return;

        try {
            const res = await fetch(`${getApiBaseUrl()}/api/images`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();

            if (data.success && Array.isArray(data.files) && data.files.length > 0) {
                grid.innerHTML = data.files.map(img => `
                    <div class="gallery-item-card" title="${img.filename} (${img.size})">
                        <img src="${img.url}" alt="${img.filename}">
                        <div class="gallery-item-actions">
                            <button class="gallery-action-btn btn-use-profile" data-url="${img.url}" title="Set as Profile Photo">
                                <i class="fas fa-user-circle"></i>
                            </button>
                            <button class="gallery-action-btn btn-copy-link" data-url="${img.url}" title="Copy Link">
                                <i class="fas fa-link"></i>
                            </button>
                            <button class="gallery-action-btn btn-delete" data-filename="${img.filename}" title="Delete File">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `).join('');

                // Action Listeners
                grid.querySelectorAll('.btn-use-profile').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const url = btn.getAttribute('data-url');
                        if (!portfolioData) portfolioData = {};
                        if (!portfolioData.about) portfolioData.about = {};
                        portfolioData.about.image = url;

                        const studioProfilePreview = document.getElementById('studioProfilePreview');
                        const profileImg = document.getElementById('profileImg');
                        if (studioProfilePreview) studioProfilePreview.src = url;
                        if (profileImg) profileImg.src = url;

                        showToast('Profile photo set from gallery!');
                    });
                });

                grid.querySelectorAll('.btn-copy-link').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const rawUrl = btn.getAttribute('data-url');
                        const url = rawUrl.startsWith('http') || rawUrl.startsWith('data:') ? rawUrl : `${getApiBaseUrl()}${rawUrl}`;
                        navigator.clipboard.writeText(url);
                        showToast('Image URL copied to clipboard!');
                    });
                });

                grid.querySelectorAll('.btn-delete').forEach(btn => {
                    btn.addEventListener('click', async (e) => {
                        e.stopPropagation();
                        const filename = btn.getAttribute('data-filename');
                        if (!confirm(`Delete ${filename}?`)) return;

                        try {
                            const delRes = await fetch(`${getApiBaseUrl()}/api/images/${filename}`, {
                                method: 'DELETE',
                                headers: { 'Authorization': `Bearer ${token}` }
                            });
                            const delJson = await delRes.json();
                            if (delJson.success) {
                                showToast('File deleted.');
                                fetchGalleryImages();
                            }
                        } catch (err) {
                            showToast('Error deleting file: ' + err.message, 'error');
                        }
                    });
                });

            } else {
                grid.innerHTML = '<p style="color: var(--text-muted); font-size: 0.85rem; grid-column: 1 / -1;">No uploaded media yet. Upload photos using the dropzone above.</p>';
            }
        } catch (err) {
            console.warn('Error fetching gallery:', err);
        }
    }

    if (refreshGalleryBtn) {
        refreshGalleryBtn.addEventListener('click', fetchGalleryImages);
    }

    // ========================================================
    // COMPETENCIES / SKILLS TAG EDITOR
    // ========================================================
    function renderStudioTags() {
        const container = document.getElementById('studioTagsContainer');
        if (!container || !portfolioData || !portfolioData.about) return;
        const tags = portfolioData.about.competencies || [];

        container.innerHTML = tags.map((tag, idx) => `
            <span class="tag-badge-editable">
                <span>${tag}</span>
                <i class="fas fa-times tag-remove-x" data-index="${idx}"></i>
            </span>
        `).join('');

        container.querySelectorAll('.tag-remove-x').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(btn.getAttribute('data-index'));
                portfolioData.about.competencies.splice(idx, 1);
                renderStudioTags();
            });
        });
    }

    const addNewTagBtn = document.getElementById('addNewTagBtn');
    const inputNewTag = document.getElementById('inputNewTag');

    if (addNewTagBtn && inputNewTag) {
        addNewTagBtn.addEventListener('click', () => {
            const val = inputNewTag.value.trim();
            if (!val) return;
            if (!portfolioData) portfolioData = {};
            if (!portfolioData.about) portfolioData.about = {};
            if (!portfolioData.about.competencies) portfolioData.about.competencies = [];

            portfolioData.about.competencies.push(val);
            inputNewTag.value = '';
            renderStudioTags();
        });

        inputNewTag.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addNewTagBtn.click();
            }
        });
    }

    // ========================================================
    // ITEM LIST RENDERERS & ADD BUTTONS IN STUDIO
    // ========================================================

    // 1. Education
    function renderStudioEducationList() {
        const list = document.getElementById('studioEducationList');
        if (!list || !portfolioData) return;
        const items = portfolioData.education || [];

        list.innerHTML = items.map((item, idx) => `
            <div class="admin-card-item">
                <div class="admin-card-header">
                    <div>
                        <h5>${item.degree || 'Degree'}</h5>
                        <span style="font-size: 0.8rem; color: var(--accent-secondary); font-weight: 600;">${item.period || ''} — ${item.institution || ''}</span>
                    </div>
                    <div class="admin-card-actions">
                        <button class="admin-card-btn delete-btn" data-type="education" data-index="${idx}" title="Delete"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
                <div class="admin-form-row">
                    <div class="admin-field" style="margin-bottom: 0;">
                        <label>Degree</label>
                        <input type="text" class="edu-field-degree" data-index="${idx}" value="${item.degree || ''}">
                    </div>
                    <div class="admin-field" style="margin-bottom: 0;">
                        <label>Institution</label>
                        <input type="text" class="edu-field-inst" data-index="${idx}" value="${item.institution || ''}">
                    </div>
                    <div class="admin-field" style="margin-bottom: 0;">
                        <label>Period</label>
                        <input type="text" class="edu-field-period" data-index="${idx}" value="${item.period || ''}">
                    </div>
                </div>
                <div class="admin-field" style="margin-top: 10px; margin-bottom: 0;">
                    <label>Thesis / Research Title</label>
                    <input type="text" class="edu-field-thesis" data-index="${idx}" value="${item.thesis || ''}">
                </div>
            </div>
        `).join('');

        attachItemInputListeners('education', list);
    }

    const addEducationBtn = document.getElementById('addEducationBtn');
    if (addEducationBtn) {
        addEducationBtn.addEventListener('click', () => {
            if (!portfolioData) portfolioData = {};
            if (!portfolioData.education) portfolioData.education = [];
            portfolioData.education.unshift({
                degree: 'New Degree / Specialization',
                institution: 'University / Institute Name',
                period: '2024 – 2026',
                thesis: '',
                fields: '',
                grade: ''
            });
            renderStudioEducationList();
        });
    }

    // 2. Experience
    function renderStudioExperienceList() {
        const list = document.getElementById('studioExperienceList');
        if (!list || !portfolioData) return;
        const items = portfolioData.experience || [];

        list.innerHTML = items.map((item, idx) => `
            <div class="admin-card-item">
                <div class="admin-card-header">
                    <div>
                        <h5>${item.role || 'Role'}</h5>
                        <span style="font-size: 0.8rem; color: var(--accent-secondary); font-weight: 600;">${item.period || ''} — ${item.organization || ''}</span>
                    </div>
                    <div class="admin-card-actions">
                        <button class="admin-card-btn delete-btn" data-type="experience" data-index="${idx}" title="Delete"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
                <div class="admin-form-row">
                    <div class="admin-field" style="margin-bottom: 0;">
                        <label>Role</label>
                        <input type="text" class="exp-field-role" data-index="${idx}" value="${item.role || ''}">
                    </div>
                    <div class="admin-field" style="margin-bottom: 0;">
                        <label>Organization / University</label>
                        <input type="text" class="exp-field-org" data-index="${idx}" value="${item.organization || ''}">
                    </div>
                    <div class="admin-field" style="margin-bottom: 0;">
                        <label>Duration / Period</label>
                        <input type="text" class="exp-field-period" data-index="${idx}" value="${item.period || ''}">
                    </div>
                </div>
                <div class="admin-field" style="margin-top: 10px; margin-bottom: 0;">
                    <label>Bullet Highlights (one per line)</label>
                    <textarea class="exp-field-highlights" data-index="${idx}" rows="2">${(item.highlights || []).join('\n')}</textarea>
                </div>
            </div>
        `).join('');

        attachItemInputListeners('experience', list);
    }

    const addExperienceBtn = document.getElementById('addExperienceBtn');
    if (addExperienceBtn) {
        addExperienceBtn.addEventListener('click', () => {
            if (!portfolioData) portfolioData = {};
            if (!portfolioData.experience) portfolioData.experience = [];
            portfolioData.experience.unshift({
                role: 'Assistant Professor',
                organization: 'Institution Name',
                period: '2026 - Present',
                isCurrent: false,
                highlights: ['Teaching courses and conducting research']
            });
            renderStudioExperienceList();
        });
    }

    // 3. Publications
    function renderStudioPublicationsList() {
        const list = document.getElementById('studioPublicationsList');
        if (!list || !portfolioData) return;
        const items = portfolioData.publications || [];

        list.innerHTML = items.map((item, idx) => `
            <div class="admin-card-item">
                <div class="admin-card-header">
                    <div>
                        <h5>${item.title || 'Paper Title'}</h5>
                        <span style="font-size: 0.8rem; color: var(--accent-secondary); font-weight: 600;">${item.year || ''} — ${item.journal || ''}</span>
                    </div>
                    <div class="admin-card-actions">
                        <button class="admin-card-btn delete-btn" data-type="publications" data-index="${idx}" title="Delete"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
                <div class="admin-field" style="margin-bottom: 10px;">
                    <label>Paper Title</label>
                    <input type="text" class="pub-field-title" data-index="${idx}" value="${item.title || ''}">
                </div>
                <div class="admin-form-row">
                    <div class="admin-field" style="margin-bottom: 0;">
                        <label>Journal / Publisher</label>
                        <input type="text" class="pub-field-journal" data-index="${idx}" value="${item.journal || ''}">
                    </div>
                    <div class="admin-field" style="margin-bottom: 0;">
                        <label>Publication Year</label>
                        <input type="text" class="pub-field-year" data-index="${idx}" value="${item.year || ''}">
                    </div>
                    <div class="admin-field" style="margin-bottom: 0;">
                        <label>Status (e.g. PUBLISHED)</label>
                        <input type="text" class="pub-field-status" data-index="${idx}" value="${item.status || 'PUBLISHED'}">
                    </div>
                </div>
            </div>
        `).join('');

        attachItemInputListeners('publications', list);
    }

    const addPublicationBtn = document.getElementById('addPublicationBtn');
    if (addPublicationBtn) {
        addPublicationBtn.addEventListener('click', () => {
            if (!portfolioData) portfolioData = {};
            if (!portfolioData.publications) portfolioData.publications = [];
            portfolioData.publications.unshift({
                title: 'New Research Paper Title',
                journal: 'Journal Name [SCIE / Scopus]',
                year: new Date().getFullYear().toString(),
                indexing: 'SCIE',
                status: 'PUBLISHED'
            });
            renderStudioPublicationsList();
        });
    }

    // 4. Conferences & Books
    function renderStudioConferencesList() {
        const list = document.getElementById('studioConferencesList');
        if (!list || !portfolioData) return;
        const items = portfolioData.conferences || [];

        list.innerHTML = items.map((item, idx) => `
            <div class="admin-card-item">
                <div class="admin-card-header">
                    <div>
                        <h5>${item.title || 'Conference Presentation'}</h5>
                        <span style="font-size: 0.8rem; color: var(--accent-secondary);">${item.dates || ''} — ${item.location || ''}</span>
                    </div>
                    <div class="admin-card-actions">
                        <button class="admin-card-btn delete-btn" data-type="conferences" data-index="${idx}" title="Delete"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
                <div class="admin-field" style="margin-bottom: 10px;">
                    <label>Paper / Presentation Title</label>
                    <input type="text" class="conf-field-title" data-index="${idx}" value="${item.title || ''}">
                </div>
                <div class="admin-form-row">
                    <div class="admin-field" style="margin-bottom: 0;">
                        <label>Conference Event Name</label>
                        <input type="text" class="conf-field-event" data-index="${idx}" value="${item.event || ''}">
                    </div>
                    <div class="admin-field" style="margin-bottom: 0;">
                        <label>Location</label>
                        <input type="text" class="conf-field-location" data-index="${idx}" value="${item.location || ''}">
                    </div>
                    <div class="admin-field" style="margin-bottom: 0;">
                        <label>Dates</label>
                        <input type="text" class="conf-field-dates" data-index="${idx}" value="${item.dates || ''}">
                    </div>
                </div>
            </div>
        `).join('');

        attachItemInputListeners('conferences', list);
    }

    const addConferenceBtn = document.getElementById('addConferenceBtn');
    if (addConferenceBtn) {
        addConferenceBtn.addEventListener('click', () => {
            if (!portfolioData) portfolioData = {};
            if (!portfolioData.conferences) portfolioData.conferences = [];
            portfolioData.conferences.unshift({
                title: 'New Conference Presentation Title',
                event: 'International Conference Name',
                location: 'City, Country',
                dates: '2026',
                status: 'PRESENTED'
            });
            renderStudioConferencesList();
        });
    }

    function renderStudioBookChaptersList() {
        const list = document.getElementById('studioBookChaptersList');
        if (!list || !portfolioData) return;
        const items = portfolioData.bookChapters || [];

        list.innerHTML = items.map((item, idx) => `
            <div class="admin-card-item">
                <div class="admin-card-header">
                    <div>
                        <h5>${item.title || 'Book Chapter'}</h5>
                        <span style="font-size: 0.8rem; color: var(--accent-secondary);">${item.date || ''}</span>
                    </div>
                    <div class="admin-card-actions">
                        <button class="admin-card-btn delete-btn" data-type="bookChapters" data-index="${idx}" title="Delete"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
                <div class="admin-field" style="margin-bottom: 10px;">
                    <label>Chapter Title</label>
                    <input type="text" class="book-field-title" data-index="${idx}" value="${item.title || ''}">
                </div>
                <div class="admin-form-row">
                    <div class="admin-field" style="margin-bottom: 0;">
                        <label>Publisher & ISBN Details</label>
                        <input type="text" class="book-field-details" data-index="${idx}" value="${item.details || ''}">
                    </div>
                    <div class="admin-field" style="margin-bottom: 0;">
                        <label>Publication Date</label>
                        <input type="text" class="book-field-date" data-index="${idx}" value="${item.date || ''}">
                    </div>
                </div>
            </div>
        `).join('');

        attachItemInputListeners('bookChapters', list);
    }

    const addBookChapterBtn = document.getElementById('addBookChapterBtn');
    if (addBookChapterBtn) {
        addBookChapterBtn.addEventListener('click', () => {
            if (!portfolioData) portfolioData = {};
            if (!portfolioData.bookChapters) portfolioData.bookChapters = [];
            portfolioData.bookChapters.unshift({
                title: 'New Book Chapter Title',
                details: 'ISBN Details, Publishing House',
                date: '2026',
                status: 'PUBLISHED'
            });
            renderStudioBookChaptersList();
        });
    }

    // 5. Patents & Projects
    function renderStudioPatentsList() {
        const list = document.getElementById('studioPatentsList');
        if (!list || !portfolioData) return;
        const items = portfolioData.patents || [];

        list.innerHTML = items.map((item, idx) => `
            <div class="admin-card-item">
                <div class="admin-card-header">
                    <div>
                        <h5>${item.title || 'Patent Title'}</h5>
                        <span style="font-size: 0.8rem; color: var(--accent-secondary); font-weight: 600;">${item.status || 'FILED'} — ${item.country || ''} (${item.date || ''})</span>
                    </div>
                    <div class="admin-card-actions">
                        <button class="admin-card-btn delete-btn" data-type="patents" data-index="${idx}" title="Delete"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
                <div class="admin-field" style="margin-bottom: 10px;">
                    <label>Invention / Patent Title</label>
                    <input type="text" class="pat-field-title" data-index="${idx}" value="${item.title || ''}">
                </div>
                <div class="admin-form-row">
                    <div class="admin-field" style="margin-bottom: 0;">
                        <label>Country / Jurisdiction</label>
                        <input type="text" class="pat-field-country" data-index="${idx}" value="${item.country || ''}">
                    </div>
                    <div class="admin-field" style="margin-bottom: 0;">
                        <label>Status (FILED / GRANTED)</label>
                        <input type="text" class="pat-field-status" data-index="${idx}" value="${item.status || 'FILED'}">
                    </div>
                    <div class="admin-field" style="margin-bottom: 0;">
                        <label>Year / Date</label>
                        <input type="text" class="pat-field-date" data-index="${idx}" value="${item.date || ''}">
                    </div>
                </div>
            </div>
        `).join('');

        attachItemInputListeners('patents', list);
    }

    const addPatentBtn = document.getElementById('addPatentBtn');
    if (addPatentBtn) {
        addPatentBtn.addEventListener('click', () => {
            if (!portfolioData) portfolioData = {};
            if (!portfolioData.patents) portfolioData.patents = [];
            portfolioData.patents.unshift({
                title: 'New Patent Title',
                country: 'India',
                status: 'FILED',
                date: '2026'
            });
            renderStudioPatentsList();
        });
    }

    function renderStudioProjectsList() {
        const list = document.getElementById('studioProjectsList');
        if (!list || !portfolioData) return;
        const items = portfolioData.fundedProjects || [];

        list.innerHTML = items.map((item, idx) => `
            <div class="admin-card-item">
                <div class="admin-card-header">
                    <div>
                        <h5>${item.title || 'Project Title'}</h5>
                        <span style="font-size: 0.8rem; color: var(--accent-secondary); font-weight: 600;">${item.amount || ''} — ${item.agency || ''}</span>
                    </div>
                    <div class="admin-card-actions">
                        <button class="admin-card-btn delete-btn" data-type="fundedProjects" data-index="${idx}" title="Delete"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
                <div class="admin-field" style="margin-bottom: 10px;">
                    <label>Funded Project Title</label>
                    <input type="text" class="proj-field-title" data-index="${idx}" value="${item.title || ''}">
                </div>
                <div class="admin-form-row">
                    <div class="admin-field" style="margin-bottom: 0;">
                        <label>Funding Agency</label>
                        <input type="text" class="proj-field-agency" data-index="${idx}" value="${item.agency || ''}">
                    </div>
                    <div class="admin-field" style="margin-bottom: 0;">
                        <label>Grant Amount</label>
                        <input type="text" class="proj-field-amount" data-index="${idx}" value="${item.amount || ''}">
                    </div>
                    <div class="admin-field" style="margin-bottom: 0;">
                        <label>Period</label>
                        <input type="text" class="proj-field-period" data-index="${idx}" value="${item.period || ''}">
                    </div>
                </div>
                <div class="admin-field" style="margin-top: 10px; margin-bottom: 0;">
                    <label>Project Description</label>
                    <textarea class="proj-field-desc" data-index="${idx}" rows="2">${item.description || ''}</textarea>
                </div>
            </div>
        `).join('');

        attachItemInputListeners('fundedProjects', list);
    }

    const addProjectBtn = document.getElementById('addProjectBtn');
    if (addProjectBtn) {
        addProjectBtn.addEventListener('click', () => {
            if (!portfolioData) portfolioData = {};
            if (!portfolioData.fundedProjects) portfolioData.fundedProjects = [];
            portfolioData.fundedProjects.unshift({
                title: 'New Funded Project Title',
                agency: 'Funding Agency Name',
                amount: '₹ 50,000',
                period: '2026 - Current',
                description: 'Brief description of project research goals',
                status: 'ONGOING'
            });
            renderStudioProjectsList();
        });
    }

    // Helper: attach listeners for input updates and deletes
    function attachItemInputListeners(type, container) {
        // Delete buttons
        container.querySelectorAll(`.delete-btn[data-type="${type}"]`).forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-index'));
                if (portfolioData && portfolioData[type]) {
                    portfolioData[type].splice(idx, 1);
                    if (type === 'education') renderStudioEducationList();
                    if (type === 'experience') renderStudioExperienceList();
                    if (type === 'publications') renderStudioPublicationsList();
                    if (type === 'conferences') renderStudioConferencesList();
                    if (type === 'bookChapters') renderStudioBookChaptersList();
                    if (type === 'patents') renderStudioPatentsList();
                    if (type === 'fundedProjects') renderStudioProjectsList();
                }
            });
        });

        // Field change updates
        container.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', () => {
                const idx = parseInt(input.getAttribute('data-index'));
                if (!portfolioData || !portfolioData[type] || !portfolioData[type][idx]) return;
                const item = portfolioData[type][idx];

                if (type === 'education') {
                    if (input.classList.contains('edu-field-degree')) item.degree = input.value;
                    if (input.classList.contains('edu-field-inst')) item.institution = input.value;
                    if (input.classList.contains('edu-field-period')) item.period = input.value;
                    if (input.classList.contains('edu-field-thesis')) item.thesis = input.value;
                } else if (type === 'experience') {
                    if (input.classList.contains('exp-field-role')) item.role = input.value;
                    if (input.classList.contains('exp-field-org')) item.organization = input.value;
                    if (input.classList.contains('exp-field-period')) item.period = input.value;
                    if (input.classList.contains('exp-field-highlights')) item.highlights = input.value.split('\n').filter(Boolean);
                } else if (type === 'publications') {
                    if (input.classList.contains('pub-field-title')) item.title = input.value;
                    if (input.classList.contains('pub-field-journal')) item.journal = input.value;
                    if (input.classList.contains('pub-field-year')) item.year = input.value;
                    if (input.classList.contains('pub-field-status')) item.status = input.value;
                } else if (type === 'conferences') {
                    if (input.classList.contains('conf-field-title')) item.title = input.value;
                    if (input.classList.contains('conf-field-event')) item.event = input.value;
                    if (input.classList.contains('conf-field-location')) item.location = input.value;
                    if (input.classList.contains('conf-field-dates')) item.dates = input.value;
                } else if (type === 'bookChapters') {
                    if (input.classList.contains('book-field-title')) item.title = input.value;
                    if (input.classList.contains('book-field-details')) item.details = input.value;
                    if (input.classList.contains('book-field-date')) item.date = input.value;
                } else if (type === 'patents') {
                    if (input.classList.contains('pat-field-title')) item.title = input.value;
                    if (input.classList.contains('pat-field-country')) item.country = input.value;
                    if (input.classList.contains('pat-field-status')) item.status = input.value;
                    if (input.classList.contains('pat-field-date')) item.date = input.value;
                } else if (type === 'fundedProjects') {
                    if (input.classList.contains('proj-field-title')) item.title = input.value;
                    if (input.classList.contains('proj-field-agency')) item.agency = input.value;
                    if (input.classList.contains('proj-field-amount')) item.amount = input.value;
                    if (input.classList.contains('proj-field-period')) item.period = input.value;
                    if (input.classList.contains('proj-field-desc')) item.description = input.value;
                }
            });
        });
    }

    // ========================================================
    // SAVE TO MONGODB ATLAS
    // ========================================================
    async function collectStudioFormData() {
        if (!portfolioData) portfolioData = {};

        // Hero
        if (!portfolioData.hero) portfolioData.hero = {};
        portfolioData.hero.name = getInputValue('inputHeroName');
        portfolioData.hero.badge = getInputValue('inputHeroBadge');
        portfolioData.hero.typedPhrases = getInputValue('inputTypedPhrases').split('\n').map(s => s.trim()).filter(Boolean);
        if (!portfolioData.hero.stats) portfolioData.hero.stats = {};
        portfolioData.hero.stats.publications = parseInt(getInputValue('inputStatPubs')) || 0;
        portfolioData.hero.stats.patents = parseInt(getInputValue('inputStatPatents')) || 0;
        portfolioData.hero.stats.experience = parseInt(getInputValue('inputStatExp')) || 0;
        portfolioData.hero.resumeUrl = getInputValue('inputResumeUrl') || 'Shaik_July2026_CV-6.pdf';

        // About
        if (!portfolioData.about) portfolioData.about = {};
        portfolioData.about.role = getInputValue('inputAboutRole');
        portfolioData.about.institution = getInputValue('inputAboutInstitution');
        portfolioData.about.badge = getInputValue('inputAboutBadge');
        portfolioData.about.bio = getInputValue('inputAboutBio');
        if (!portfolioData.about.details) portfolioData.about.details = {};
        portfolioData.about.details.phd = getInputValue('inputAboutPhd');
        portfolioData.about.details.mtech = getInputValue('inputAboutMtech');
        portfolioData.about.details.email = getInputValue('inputAboutEmail');
        portfolioData.about.details.phone = getInputValue('inputAboutPhone');
        portfolioData.about.details.dob = getInputValue('inputAboutDob');
        portfolioData.about.details.languages = getInputValue('inputAboutLanguages');

        // Activities
        if (!portfolioData.activities) portfolioData.activities = {};
        portfolioData.activities.organisational = getInputValue('inputOrganisational').split('\n').map(s => s.trim()).filter(Boolean);
        portfolioData.activities.memberships = getInputValue('inputMemberships').split('\n').map(s => s.trim()).filter(Boolean);
        portfolioData.activities.certifications = getInputValue('inputCertifications').split('\n').map(s => s.trim()).filter(Boolean);

        // Contact
        if (!portfolioData.contact) portfolioData.contact = {};
        portfolioData.contact.location = getInputValue('inputContactLocation');
        portfolioData.contact.email = getInputValue('inputContactEmail');
        portfolioData.contact.phone = getInputValue('inputContactPhone');
        portfolioData.contact.linkedin = getInputValue('inputContactLinkedIn');
        portfolioData.contact.scholar = getInputValue('inputContactScholar');

        return portfolioData;
    }

    async function savePortfolioData(showUserToast = true) {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            showToast('You must be logged in to save changes.', 'error');
            return false;
        }

        const dataToSave = await collectStudioFormData();

        try {
            const res = await fetch(`${getApiBaseUrl()}/api/portfolio`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ data: dataToSave })
            });
            const json = await res.json();

            if (json.success) {
                renderPortfolio(dataToSave);
                if (showUserToast) {
                    showToast('Portfolio details saved to MongoDB Atlas successfully!');
                }
                return true;
            } else {
                showToast(json.message || 'Error saving to database', 'error');
                return false;
            }
        } catch (err) {
            showToast('Save failed: ' + err.message, 'error');
            return false;
        }
    }

    if (studioSaveBtn) {
        studioSaveBtn.addEventListener('click', async () => {
            const orig = studioSaveBtn.innerHTML;
            studioSaveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
            await savePortfolioData(true);
            studioSaveBtn.innerHTML = orig;
        });
    }

    if (saveStudioFooterBtn) {
        saveStudioFooterBtn.addEventListener('click', async () => {
            const orig = saveStudioFooterBtn.innerHTML;
            saveStudioFooterBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
            await savePortfolioData(true);
            saveStudioFooterBtn.innerHTML = orig;
        });
    }

    if (quickSaveBtn) {
        quickSaveBtn.addEventListener('click', async () => {
            const orig = quickSaveBtn.innerHTML;
            quickSaveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
            await savePortfolioData(true);
            quickSaveBtn.innerHTML = orig;
        });
    }

    // ========================================================
    // PHOTO GALLERY SHOWCASE (SMOOTH TRANSITIONS) & LIGHTBOX
    // ========================================================
    let currentGalleryList = [];
    let currentGalleryIndex = 0;
    let currentLightboxIndex = 0;
    let isGalleryAutoplay = true;
    let galleryAutoplayTimer = null;
    const AUTOPLAY_INTERVAL = 4500;

    function renderPublicGallery(galleryItems) {
        const track = document.getElementById('galleryCarouselTrack');
        const indicatorsBar = document.getElementById('carouselIndicatorsBar');
        const totalSlidesEl = document.getElementById('carouselTotalSlides');
        const currentSlideEl = document.getElementById('carouselCurrentSlide');
        if (!track) return;

        currentGalleryList = Array.isArray(galleryItems) && galleryItems.length > 0 
            ? galleryItems 
            : [];

        if (totalSlidesEl) {
            totalSlidesEl.textContent = currentGalleryList.length;
        }

        if (currentGalleryList.length === 0) {
            track.innerHTML = `
                <div style="padding: 60px 20px; color: var(--text-muted); text-align: center; width: 100%;">
                    <i class="fas fa-camera-retro" style="font-size: 2.4rem; margin-bottom: 12px; display: block; color: var(--accent-secondary);"></i>
                    <p style="font-size: 1rem; margin: 0 0 10px 0;">No gallery moments uploaded yet.</p>
                    <p style="font-size: 0.85rem; margin: 0;">Click "Manage Photos" below to upload campus and conference photos.</p>
                </div>
            `;
            if (indicatorsBar) indicatorsBar.innerHTML = '';
            if (currentSlideEl) currentSlideEl.textContent = '0';
            stopGalleryAutoplay();
            return;
        }

        // Render Slides
        track.innerHTML = currentGalleryList.map((item, idx) => {
            const rawUrl = item.url || '';
            const fullUrl = rawUrl.startsWith('http') || rawUrl.startsWith('data:') 
                ? rawUrl 
                : `${getApiBaseUrl()}/${rawUrl.replace(/^\//, '')}`;

            return `
                <div class="carousel-slide ${idx === 0 ? 'active' : ''}" data-gallery-index="${idx}">
                    <div class="carousel-slide-img-wrapper" title="Click to view full photo: ${item.title || 'Photo'}">
                        <img src="${fullUrl}" alt="${item.title || 'Academic Moment'}" loading="${idx === 0 ? 'eager' : 'lazy'}">
                    </div>
                </div>
            `;
        }).join('');

        // Render Indicators (Dots & elongated pill for active)
        if (indicatorsBar) {
            indicatorsBar.innerHTML = currentGalleryList.map((item, idx) => `
                <button type="button" class="carousel-indicator-dot ${idx === 0 ? 'active' : ''}" 
                    data-slide-index="${idx}" 
                    aria-label="Go to slide ${idx + 1} of ${currentGalleryList.length}"
                    title="Slide ${idx + 1}: ${item.title || 'Moment'}">
                </button>
            `).join('');

            // Click listener for indicators
            indicatorsBar.querySelectorAll('.carousel-indicator-dot').forEach(dot => {
                dot.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const targetIndex = parseInt(dot.getAttribute('data-slide-index'), 10);
                    goToSlide(targetIndex, true);
                });
            });
        }

        // Click on slide image opens Lightbox
        track.querySelectorAll('.carousel-slide-img-wrapper').forEach((wrapper, idx) => {
            wrapper.addEventListener('click', () => {
                openLightbox(idx);
            });
        });

        // Initialize at slide 0
        currentGalleryIndex = 0;
        updateCarouselUI(false);
        startGalleryAutoplay();
    }

    function goToSlide(newIndex, isManual = false) {
        if (!currentGalleryList || currentGalleryList.length === 0) return;
        const total = currentGalleryList.length;
        currentGalleryIndex = (newIndex + total) % total;
        updateCarouselUI(true);

        if (isManual) {
            resetGalleryAutoplay();
        }
    }

    function updateCarouselUI(smooth = true) {
        const track = document.getElementById('galleryCarouselTrack');
        const currentSlideEl = document.getElementById('carouselCurrentSlide');
        const totalSlidesEl = document.getElementById('carouselTotalSlides');
        const indicatorsBar = document.getElementById('carouselIndicatorsBar');

        if (!track || currentGalleryList.length === 0) return;

        // Apply smooth GPU transform
        track.style.transition = smooth ? 'transform 0.65s cubic-bezier(0.25, 1, 0.5, 1)' : 'none';
        track.style.transform = `translate3d(-${currentGalleryIndex * 100}%, 0, 0)`;

        // Update active class on slides
        const slides = track.querySelectorAll('.carousel-slide');
        slides.forEach((slide, idx) => {
            slide.classList.toggle('active', idx === currentGalleryIndex);
        });

        // Update counter badge
        if (currentSlideEl) currentSlideEl.textContent = currentGalleryIndex + 1;
        if (totalSlidesEl) totalSlidesEl.textContent = currentGalleryList.length;

        // Update active indicator pill
        if (indicatorsBar) {
            const dots = indicatorsBar.querySelectorAll('.carousel-indicator-dot');
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === currentGalleryIndex);
            });
        }

        // Update caption overlay
        updateCaptionOverlay(currentGalleryIndex);
    }

    function updateCaptionOverlay(index) {
        const item = currentGalleryList[index];
        if (!item) return;

        const tagEl = document.getElementById('carouselCaptionTag');
        const titleEl = document.getElementById('carouselCaptionTitle');
        const descEl = document.getElementById('carouselCaptionDesc');

        if (tagEl) {
            tagEl.innerHTML = `<i class="fas fa-tag"></i> ${item.category || 'Academic'}`;
        }
        if (titleEl) {
            titleEl.textContent = item.title || 'Academic Moment';
        }
        if (descEl) {
            descEl.textContent = item.caption || item.date || '';
        }
    }

    function nextSlide(isManual = false) {
        goToSlide(currentGalleryIndex + 1, isManual);
    }

    function prevSlide(isManual = false) {
        goToSlide(currentGalleryIndex - 1, isManual);
    }

    function startGalleryAutoplay() {
        if (!isGalleryAutoplay || currentGalleryList.length <= 1) return;
        stopGalleryAutoplay();
        galleryAutoplayTimer = setInterval(() => {
            nextSlide(false);
        }, AUTOPLAY_INTERVAL);
    }

    function stopGalleryAutoplay() {
        if (galleryAutoplayTimer) {
            clearInterval(galleryAutoplayTimer);
            galleryAutoplayTimer = null;
        }
    }

    function resetGalleryAutoplay() {
        if (!isGalleryAutoplay) return;
        stopGalleryAutoplay();
        startGalleryAutoplay();
    }

    // Attach Carousel Navigation Event Listeners
    const galleryPrevBtn = document.getElementById('galleryPrevBtn');
    const galleryNextBtn = document.getElementById('galleryNextBtn');
    const galleryCarouselCard = document.getElementById('galleryCarouselCard');
    const galleryToggleAutoBtn = document.getElementById('galleryToggleAutoBtn');
    const galleryPlayPauseIcon = document.getElementById('galleryPlayPauseIcon');
    const galleryPlayPauseText = document.getElementById('galleryPlayPauseText');
    const openUploadGalleryQuickBtn = document.getElementById('openUploadGalleryQuickBtn');
    const carouselExpandBtn = document.getElementById('carouselExpandBtn');
    const carouselViewport = document.getElementById('carouselViewport');

    if (galleryPrevBtn) {
        galleryPrevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            prevSlide(true);
        });
    }

    if (galleryNextBtn) {
        galleryNextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            nextSlide(true);
        });
    }

    if (carouselExpandBtn) {
        carouselExpandBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openLightbox(currentGalleryIndex);
        });
    }

    // Pause autoplay on mouse hover, resume on mouse leave
    if (galleryCarouselCard) {
        galleryCarouselCard.addEventListener('mouseenter', () => {
            stopGalleryAutoplay();
        });
        galleryCarouselCard.addEventListener('mouseleave', () => {
            if (isGalleryAutoplay) startGalleryAutoplay();
        });
    }

    // Autoplay toggle button
    if (galleryToggleAutoBtn) {
        galleryToggleAutoBtn.addEventListener('click', () => {
            isGalleryAutoplay = !isGalleryAutoplay;
            galleryToggleAutoBtn.classList.toggle('is-paused', !isGalleryAutoplay);
            if (galleryPlayPauseIcon) {
                galleryPlayPauseIcon.className = isGalleryAutoplay ? 'fas fa-pause' : 'fas fa-play';
            }
            if (galleryPlayPauseText) {
                galleryPlayPauseText.textContent = isGalleryAutoplay ? 'Autoplay Active' : 'Autoplay Paused';
            }
            if (isGalleryAutoplay) {
                startGalleryAutoplay();
                showToast('Slideshow autoplay resumed');
            } else {
                stopGalleryAutoplay();
                showToast('Slideshow paused');
            }
        });
    }

    // Touch Swipe Gesture Support
    if (carouselViewport) {
        let touchStartX = 0;
        let touchStartY = 0;
        let isTouching = false;

        carouselViewport.addEventListener('touchstart', (e) => {
            if (e.touches && e.touches[0]) {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
                isTouching = true;
                stopGalleryAutoplay();
            }
        }, { passive: true });

        carouselViewport.addEventListener('touchend', (e) => {
            if (!isTouching) return;
            isTouching = false;
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;

            if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX < 0) {
                    nextSlide(true);
                } else {
                    prevSlide(true);
                }
            }
            if (isGalleryAutoplay) resetGalleryAutoplay();
        }, { passive: true });

        // Mouse Drag Support
        let mouseStartX = 0;
        let isMouseDown = false;

        carouselViewport.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            mouseStartX = e.clientX;
            stopGalleryAutoplay();
        });

        window.addEventListener('mouseup', (e) => {
            if (!isMouseDown) return;
            isMouseDown = false;
            const mouseEndX = e.clientX;
            const diffX = mouseEndX - mouseStartX;
            if (Math.abs(diffX) > 50) {
                if (diffX < 0) {
                    nextSlide(true);
                } else {
                    prevSlide(true);
                }
            }
            if (isGalleryAutoplay) resetGalleryAutoplay();
        });
    }

    // Quick Admin Button to Open Studio Gallery Tab
    if (openUploadGalleryQuickBtn) {
        openUploadGalleryQuickBtn.addEventListener('click', () => {
            if (checkAdminAuth()) {
                openStudio('tab-gallery-manager');
            } else {
                if (adminLoginModal) adminLoginModal.classList.add('active');
            }
        });
    }

    // Keyboard Navigation for Gallery (Arrow keys when gallery in viewport)
    window.addEventListener('keydown', (e) => {
        if (galleryLightboxModal && galleryLightboxModal.classList.contains('active')) return;
        const galleryEl = document.getElementById('gallery');
        if (!galleryEl) return;
        const rect = galleryEl.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;
        if (isInView) {
            if (e.key === 'ArrowLeft') prevSlide(true);
            if (e.key === 'ArrowRight') nextSlide(true);
        }
    });

    // Lightbox Modal Controls
    const galleryLightboxModal = document.getElementById('galleryLightboxModal');
    const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
    const lightboxBackdrop = document.getElementById('lightboxBackdrop');
    const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
    const lightboxNextBtn = document.getElementById('lightboxNextBtn');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxCategory = document.getElementById('lightboxCategory');
    const lightboxDate = document.getElementById('lightboxDate');

    function openLightbox(index) {
        if (!currentGalleryList || currentGalleryList.length === 0) return;
        currentLightboxIndex = (index + currentGalleryList.length) % currentGalleryList.length;
        const item = currentGalleryList[currentLightboxIndex];
        if (!item) return;

        const rawUrl = item.url || '';
        const fullUrl = rawUrl.startsWith('http') || rawUrl.startsWith('data:') 
            ? rawUrl 
            : `${getApiBaseUrl()}/${rawUrl.replace(/^\//, '')}`;

        if (lightboxImg) lightboxImg.src = fullUrl;
        if (lightboxTitle) lightboxTitle.textContent = item.title || 'Academic Moment';
        if (lightboxCaption) lightboxCaption.textContent = item.caption || '';
        if (lightboxCategory) lightboxCategory.textContent = item.category || 'Gallery';
        if (lightboxDate) lightboxDate.textContent = item.date || '';

        if (galleryLightboxModal) galleryLightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (galleryLightboxModal) galleryLightboxModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
    if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
    if (lightboxPrevBtn) {
        lightboxPrevBtn.addEventListener('click', () => openLightbox(currentLightboxIndex - 1));
    }
    if (lightboxNextBtn) {
        lightboxNextBtn.addEventListener('click', () => openLightbox(currentLightboxIndex + 1));
    }

    window.addEventListener('keydown', (e) => {
        if (!galleryLightboxModal || !galleryLightboxModal.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') openLightbox(currentLightboxIndex - 1);
        if (e.key === 'ArrowRight') openLightbox(currentLightboxIndex + 1);
    });

    // ========================================================
    // ADMIN STUDIO: GALLERY MANAGER (Upload & Edit)
    // ========================================================
    const studioGalleryItemsList = document.getElementById('studioGalleryItemsList');
    const studioGalleryItemCount = document.getElementById('studioGalleryItemCount');
    const chooseGalleryFilesBtn = document.getElementById('chooseGalleryFilesBtn');
    const galleryMultiFileInput = document.getElementById('galleryMultiFileInput');
    const galleryUploadDropzone = document.getElementById('galleryUploadDropzone');
    const addSinglePhotoToGalleryBtn = document.getElementById('addSinglePhotoToGalleryBtn');
    const addNewGalleryPhotoBtn = document.getElementById('addNewGalleryPhotoBtn');

    function renderStudioGalleryList() {
        if (!studioGalleryItemsList) return;
        if (!portfolioData) portfolioData = {};
        if (!Array.isArray(portfolioData.gallery)) portfolioData.gallery = [];

        const list = portfolioData.gallery;
        if (studioGalleryItemCount) studioGalleryItemCount.textContent = list.length;

        if (list.length === 0) {
            studioGalleryItemsList.innerHTML = '<p style="color: var(--text-muted); font-size: 0.85rem; padding: 12px 0;">No gallery photos yet. Drag & drop images above or add a photo URL.</p>';
            return;
        }

        studioGalleryItemsList.innerHTML = list.map((item, idx) => {
            const rawUrl = item.url || '';
            const fullUrl = rawUrl.startsWith('http') || rawUrl.startsWith('data:') 
                ? rawUrl 
                : `${getApiBaseUrl()}/${rawUrl.replace(/^\//, '')}`;

            return `
                <div class="admin-gallery-item-row" data-index="${idx}">
                    <div class="admin-gallery-item-thumb">
                        <img src="${fullUrl}" alt="${item.title || 'Thumb'}">
                    </div>
                    <div class="admin-gallery-item-inputs">
                        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 8px;">
                            <input type="text" class="gal-field-title" data-index="${idx}" value="${item.title || ''}" placeholder="Photo Title">
                            <input type="text" class="gal-field-cat" data-index="${idx}" value="${item.category || ''}" placeholder="Category Tag">
                        </div>
                        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 8px;">
                            <input type="text" class="gal-field-caption" data-index="${idx}" value="${item.caption || ''}" placeholder="Caption / Description">
                            <input type="text" class="gal-field-date" data-index="${idx}" value="${item.date || ''}" placeholder="Date / Event">
                        </div>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 6px;">
                        <button type="button" class="admin-btn admin-btn-danger gal-btn-delete" data-index="${idx}" title="Delete Photo" style="padding: 6px 10px;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        // Attach listeners for delete and edits
        studioGalleryItemsList.querySelectorAll('.gal-btn-delete').forEach(btn => {
            btn.addEventListener('click', async () => {
                const idx = parseInt(btn.getAttribute('data-index'), 10);
                if (confirm('Delete this photo from the gallery?')) {
                    portfolioData.gallery.splice(idx, 1);
                    renderStudioGalleryList();
                    renderPublicGallery(portfolioData.gallery);
                    await savePortfolioData(false);
                    showToast('Photo removed from gallery.');
                }
            });
        });

        studioGalleryItemsList.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', () => {
                const idx = parseInt(input.getAttribute('data-index'), 10);
                if (!portfolioData.gallery[idx]) return;
                const item = portfolioData.gallery[idx];

                if (input.classList.contains('gal-field-title')) item.title = input.value;
                if (input.classList.contains('gal-field-cat')) item.category = input.value;
                if (input.classList.contains('gal-field-caption')) item.caption = input.value;
                if (input.classList.contains('gal-field-date')) item.date = input.value;

                renderPublicGallery(portfolioData.gallery);
            });
        });
    }

    // Multi-file upload for Gallery
    async function handleGalleryFilesUpload(files) {
        if (!files || files.length === 0) return;
        const token = localStorage.getItem('adminToken');
        if (!token) {
            showToast('You must be logged in to upload photos.', 'error');
            return;
        }

        showToast(`Uploading ${files.length} photo(s) to gallery...`);
        let uploadCount = 0;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const formData = new FormData();
            formData.append('file', file);

            try {
                const res = await fetch(`${getApiBaseUrl()}/api/upload`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData
                });
                const json = await res.json();

                if (json.success && json.url) {
                    if (!portfolioData) portfolioData = {};
                    if (!Array.isArray(portfolioData.gallery)) portfolioData.gallery = [];

                    const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
                    portfolioData.gallery.unshift({
                        id: 'gal-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
                        url: json.url,
                        title: cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1),
                        caption: 'Campus & Research Visual Moment',
                        category: 'Campus',
                        date: '2026'
                    });
                    uploadCount++;
                }
            } catch (err) {
                console.error('Error uploading file:', file.name, err);
            }
        }

        if (uploadCount > 0) {
            renderStudioGalleryList();
            renderPublicGallery(portfolioData.gallery);
            await savePortfolioData(false);
            showToast(`Successfully added ${uploadCount} photo(s) to the auto-scrolling gallery!`);
        } else {
            showToast('Upload failed. Please check backend connection.', 'error');
        }
    }

    if (chooseGalleryFilesBtn && galleryMultiFileInput) {
        chooseGalleryFilesBtn.addEventListener('click', () => galleryMultiFileInput.click());
    }
    if (addNewGalleryPhotoBtn && galleryMultiFileInput) {
        addNewGalleryPhotoBtn.addEventListener('click', () => galleryMultiFileInput.click());
    }

    if (galleryMultiFileInput) {
        galleryMultiFileInput.addEventListener('change', () => {
            if (galleryMultiFileInput.files && galleryMultiFileInput.files.length > 0) {
                handleGalleryFilesUpload(galleryMultiFileInput.files);
            }
        });
    }

    if (galleryUploadDropzone && galleryMultiFileInput) {
        galleryUploadDropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            galleryUploadDropzone.classList.add('drag-over');
        });
        galleryUploadDropzone.addEventListener('dragleave', () => {
            galleryUploadDropzone.classList.remove('drag-over');
        });
        galleryUploadDropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            galleryUploadDropzone.classList.remove('drag-over');
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                handleGalleryFilesUpload(e.dataTransfer.files);
            }
        });
    }

    // Add single photo via URL
    if (addSinglePhotoToGalleryBtn) {
        addSinglePhotoToGalleryBtn.addEventListener('click', async () => {
            const url = getInputValue('newPhotoUrl');
            if (!url) {
                showToast('Please enter a photo URL or upload an image above.', 'error');
                return;
            }

            const title = getInputValue('newPhotoTitle') || 'Campus Moment';
            const category = getInputValue('newPhotoCategory') || 'Academic';
            const date = getInputValue('newPhotoDate') || '2026';
            const caption = getInputValue('newPhotoCaption') || '';

            if (!portfolioData) portfolioData = {};
            if (!Array.isArray(portfolioData.gallery)) portfolioData.gallery = [];

            portfolioData.gallery.unshift({
                id: 'gal-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
                url,
                title,
                category,
                date,
                caption
            });

            // Clear input fields
            setInputValue('newPhotoUrl', '');
            setInputValue('newPhotoTitle', '');
            setInputValue('newPhotoCategory', '');
            setInputValue('newPhotoDate', '');
            setInputValue('newPhotoCaption', '');

            renderStudioGalleryList();
            renderPublicGallery(portfolioData.gallery);
            await savePortfolioData(false);
            showToast('New photo added to the auto-scrolling gallery!');
        });
    }

    // ========================================================
    // VISUAL QUICK-EDIT (IN-PAGE SHORTCUTS)
    // ========================================================
    const toggleInlineEditBtn = document.getElementById('toggleInlineEditBtn');
    const inlineEditStatus = document.getElementById('inlineEditStatus');

    function attachSectionEditButtons() {
        const sectionMap = [
            { id: 'hero', tab: 'tab-hero', title: 'Edit Hero' },
            { id: 'about', tab: 'tab-about', title: 'Edit About' },
            { id: 'education', tab: 'tab-education', title: 'Edit Education' },
            { id: 'experience', tab: 'tab-experience', title: 'Edit Experience' },
            { id: 'publications', tab: 'tab-publications', title: 'Edit Publications' },
            { id: 'conferences', tab: 'tab-conferences', title: 'Edit Conferences' },
            { id: 'projects', tab: 'tab-patents', title: 'Edit Patents/Projects' },
            { id: 'activities', tab: 'tab-activities', title: 'Edit Activities' },
            { id: 'gallery', tab: 'tab-gallery-manager', title: 'Manage Gallery' },
            { id: 'contact', tab: 'tab-contact', title: 'Edit Contact' }
        ];

        sectionMap.forEach(sec => {
            const el = document.getElementById(sec.id);
            if (!el) return;
            const header = el.querySelector('.section-title, .hero-title, .gallery-title');
            if (header && !header.querySelector('.section-edit-btn')) {
                const btn = document.createElement('button');
                btn.className = 'section-edit-btn';
                btn.innerHTML = `<i class="fas fa-pencil-alt"></i> ${sec.title}`;
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openStudio(sec.tab);
                });
                header.appendChild(btn);
            }
        });
    }

    function removeSectionEditButtons() {
        document.querySelectorAll('.section-edit-btn').forEach(btn => btn.remove());
    }

    function enableQuickEdit() {
        isQuickEditActive = true;
        if (inlineEditStatus) inlineEditStatus.textContent = 'Quick Edit: ON';
        if (toggleInlineEditBtn) toggleInlineEditBtn.classList.add('admin-btn-gold');
        attachSectionEditButtons();
        showToast('Quick edit mode enabled! Click edit shortcuts on sections.');
    }

    function disableQuickEdit() {
        isQuickEditActive = false;
        if (inlineEditStatus) inlineEditStatus.textContent = 'Quick Edit: OFF';
        if (toggleInlineEditBtn) toggleInlineEditBtn.classList.remove('admin-btn-gold');
        removeSectionEditButtons();
    }

    if (toggleInlineEditBtn) {
        toggleInlineEditBtn.addEventListener('click', () => {
            if (isQuickEditActive) {
                disableQuickEdit();
            } else {
                enableQuickEdit();
            }
        });
    }

    // ========================================================
    // PASSWORD UPDATE & RESET TO DEFAULTS
    // ========================================================
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const inputNewPassword = document.getElementById('inputNewPassword');

    if (changePasswordBtn && inputNewPassword) {
        changePasswordBtn.addEventListener('click', async () => {
            const newPassword = inputNewPassword.value.trim();
            if (newPassword.length < 4) {
                showToast('Password must be at least 4 characters long.', 'error');
                return;
            }

            const token = localStorage.getItem('adminToken');
            try {
                const res = await fetch(`${getApiBaseUrl()}/api/change-password`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ newPassword })
                });
                const json = await res.json();
                if (json.success) {
                    showToast('Admin password updated successfully!');
                    inputNewPassword.value = '';
                } else {
                    showToast(json.message || 'Error updating password', 'error');
                }
            } catch (err) {
                showToast('Failed to change password: ' + err.message, 'error');
            }
        });
    }

    const resetDefaultsBtn = document.getElementById('resetDefaultsBtn');
    if (resetDefaultsBtn) {
        resetDefaultsBtn.addEventListener('click', async () => {
            if (!confirm('Are you sure you want to reset all portfolio data to default? Any unsaved edits will be lost.')) {
                return;
            }

            const token = localStorage.getItem('adminToken');
            try {
                const res = await fetch(`${getApiBaseUrl()}/api/reset-portfolio`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const json = await res.json();
                if (json.success) {
                    portfolioData = json.data;
                    renderPortfolio(portfolioData);
                    populateStudioInputs();
                    showToast('Portfolio reset to default data.');
                }
            } catch (err) {
                showToast('Error resetting data: ' + err.message, 'error');
            }
        });
    }

    // ========================================================
    // BACKEND SETTINGS & UPTIME MONITOR LINK
    // ========================================================
    const inputBackendUrl = document.getElementById('inputBackendUrl');
    const saveBackendUrlBtn = document.getElementById('saveBackendUrlBtn');
    const currentBackendDisplay = document.getElementById('currentBackendDisplay');
    const backendPingStatus = document.getElementById('backendPingStatus');

    function syncBackendSettingsUI() {
        const activeUrl = getApiBaseUrl();
        if (inputBackendUrl) {
            const custom = localStorage.getItem('customBackendUrl');
            inputBackendUrl.value = custom || (window.APP_CONFIG ? window.APP_CONFIG.BACKEND_URL : activeUrl);
        }
        if (currentBackendDisplay) {
            currentBackendDisplay.textContent = activeUrl || 'Local / Default';
        }
    }

    if (saveBackendUrlBtn && inputBackendUrl) {
        saveBackendUrlBtn.addEventListener('click', async () => {
            const orig = saveBackendUrlBtn.innerHTML;
            saveBackendUrlBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing...';

            const rawVal = inputBackendUrl.value.trim().replace(/\/$/, '');
            if (rawVal) {
                localStorage.setItem('customBackendUrl', rawVal);
            } else {
                localStorage.removeItem('customBackendUrl');
            }

            syncBackendSettingsUI();

            const testUrl = getApiBaseUrl();
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 8000);
                const pingRes = await fetch(`${testUrl}/api/health`, { signal: controller.signal });
                clearTimeout(timeoutId);
                const pingJson = await pingRes.json();

                if (pingJson.status === 'healthy') {
                    showToast(`Connected to Render backend! Server uptime: ${pingJson.uptime}s`);
                    if (backendPingStatus) {
                        backendPingStatus.innerHTML = `Active Backend: <span style="color: #10b981; font-weight: 600;">Connected (${testUrl})</span>`;
                    }
                    await fetchPortfolio();
                } else {
                    showToast('Backend responded, but reported unexpected status.', 'error');
                }
            } catch (pingErr) {
                showToast('URL saved! Render backend may be waking up. Will connect once alive.', 'error');
                if (backendPingStatus) {
                    backendPingStatus.innerHTML = `Active Backend: <span style="color: #f59e0b; font-weight: 600;">Connecting / Waking up (${testUrl})</span>`;
                }
            } finally {
                saveBackendUrlBtn.innerHTML = orig;
            }
        });
    }

    // Initialize Page
    updateAdminUI();
    syncBackendSettingsUI();
    fetchPortfolio();

});
