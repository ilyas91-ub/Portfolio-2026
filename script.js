// Initialisation de Lenis pour le smooth scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// GSAP et ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Loader
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('hidden');
        initAnimations();
    }, 2000);
});

// Initialisation des animations GSAP
function initAnimations() {
    // Animations d'apparition au scroll
    gsap.utils.toArray('.gsap-reveal').forEach((element, index) => {
        gsap.set(element, {
            opacity: 0,
            y: 50
        });

        ScrollTrigger.create({
            trigger: element,
            start: 'top 80%',
            end: 'bottom 20%',
            onEnter: () => {
                gsap.to(element, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: 'power2.out'
                });
            },
            onLeaveBack: () => {
                gsap.to(element, {
                    opacity: 0,
                    y: 50,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            }
        });
    });

    // Animation des formes flottantes
    gsap.utils.toArray('.shape').forEach((shape, index) => {
        gsap.to(shape, {
            rotation: 360,
            duration: 20 + index * 5,
            repeat: -1,
            ease: 'none'
        });
    });

    // Animation du logo
    gsap.to('.logo-dots .dot', {
        scale: 1.2,
        opacity: 0.5,
        duration: 1,
        stagger: 0.2,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
    });
}

// Mode sombre/clair
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('.theme-icon');

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';

    // Sauvegarde dans localStorage
    localStorage.setItem('theme', newTheme);
}

// Chargement du thème sauvegardé
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

themeToggle.addEventListener('click', toggleTheme);

// Menu mobile
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('mobile');
    navToggle.classList.toggle('active');
});

// Fermeture du menu mobile lors du clic sur un lien
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('mobile');
        navToggle.classList.remove('active');
    });
});

// Boutons magnétiques
document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(btn, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'power2.out'
        });
    });
});

// Système de filtrage des projets
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Retirer la classe active de tous les boutons
        filterButtons.forEach(b => b.classList.remove('active'));
        // Ajouter la classe active au bouton cliqué
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');

            if (filterValue === 'all' || category === filterValue) {
                gsap.to(card, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.5,
                    ease: 'power2.out',
                    display: 'block'
                });
            } else {
                gsap.to(card, {
                    opacity: 0,
                    scale: 0.8,
                    duration: 0.5,
                    ease: 'power2.out',
                    onComplete: () => {
                        card.style.display = 'none';
                    }
                });
            }
        });
    });
});

// Bouton "En savoir plus" dans la section expérience
const expandBtn = document.querySelector('.expand-btn');
const expandedContent = document.querySelector('.expanded-content');

expandBtn.addEventListener('click', () => {
    const isExpanded = expandedContent.classList.contains('show');

    if (isExpanded) {
        gsap.to(expandedContent, {
            height: 0,
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out',
            onComplete: () => {
                expandedContent.classList.remove('show');
                expandBtn.textContent = 'En savoir plus';
            }
        });
    } else {
        expandedContent.classList.add('show');
        const height = expandedContent.scrollHeight;

        gsap.fromTo(expandedContent,
            { height: 0, opacity: 0 },
            {
                height: height,
                opacity: 1,
                duration: 0.5,
                ease: 'power2.out'
            }
        );

        expandBtn.textContent = 'Voir moins';
    }
});

// Smooth scroll pour les liens d'ancrage
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            lenis.scrollTo(target, {
                offset: -80,
                duration: 1.5
            });
        }
    });
});

// Animation du header au scroll
ScrollTrigger.create({
    start: 'top -80',
    end: 99999,
    toggleClass: {
        className: 'header--scrolled',
        targets: '.header'
    }
});

// Effet parallax sur les images
gsap.utils.toArray('.project-image img, .article-image img').forEach(img => {
    gsap.to(img, {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
            trigger: img,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });
});

// Animation des statistiques
gsap.utils.toArray('.stat-number').forEach(counter => {
    const target = parseInt(counter.textContent);
    const isPercentage = counter.textContent.includes('%');

    gsap.fromTo(counter,
        { innerText: 0 },
        {
            innerText: target,
            duration: 2,
            ease: 'power2.out',
            snap: { innerText: 1 },
            scrollTrigger: {
                trigger: counter,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            onUpdate: function() {
                if (isPercentage) {
                    counter.textContent = Math.round(counter.textContent) + '%';
                } else {
                    counter.textContent = Math.round(counter.textContent) + '+';
                }
            }
        }
    );
});

// Gestion du formulaire de contact
const contactForm = document.querySelector('.contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Animation de succès
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;

    submitBtn.textContent = 'Message envoyé !';
    submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

    setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.style.background = '';
        contactForm.reset();
    }, 3000);
});

// Animation des cartes au survol
document.querySelectorAll('.project-card, .methodology-item, .role-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        gsap.to(card, {
            y: -10,
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            y: 0,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// Responsive adjustments
function handleResize() {
    if (window.innerWidth > 768) {
        navMenu.classList.remove('mobile');
        navToggle.classList.remove('active');
    }
}

window.addEventListener('resize', handleResize);

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    // Forcer un recalcul pour les animations
    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 100);
});