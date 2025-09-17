// TrueCred Homepage with GSAP and Locomotive Scroll
class TruCredModern {
    constructor() {
        this.init();
    }

    init() {
        this.initLocomotiveScroll();
        this.initGSAP();
        this.setupNavigation();
        this.setupAnimations();
        this.setupCounters();
        this.setupInteractions();
    }

    initLocomotiveScroll() {
        this.scroll = new LocomotiveScroll({
            el: document.querySelector('[data-scroll-container]'),
            smooth: true,
            multiplier: 1,
            class: 'is-reveal'
        });

        // Update ScrollTrigger when Locomotive Scroll updates
        this.scroll.on('scroll', () => {
            ScrollTrigger.update();
        });

        // Sync ScrollTrigger with Locomotive Scroll
        ScrollTrigger.scrollerProxy('[data-scroll-container]', {
            scrollTop(value) {
                return arguments.length ? 
                    this.scroll.scrollTo(value, 0, 0) : 
                    this.scroll.scroll.instance.scroll.y;
            }.bind(this),
            getBoundingClientRect() {
                return {
                    top: 0,
                    left: 0,
                    width: window.innerWidth,
                    height: window.innerHeight
                };
            },
            pinType: document.querySelector('[data-scroll-container]').style.transform ? 'transform' : 'fixed'
        });

        ScrollTrigger.addEventListener('refresh', () => this.scroll.update());
        ScrollTrigger.refresh();
    }

    initGSAP() {
        gsap.registerPlugin(ScrollTrigger);

        // Set default animations
        gsap.set('[data-scroll-delay]', { 
            opacity: 0, 
            y: 100 
        });
    }

    setupNavigation() {
        const navbar = document.querySelector('.navbar');
        
        ScrollTrigger.create({
            start: 'top -80',
            end: 99999,
            toggleClass: { className: 'scrolled', targets: navbar },
            scroller: '[data-scroll-container]'
        });

        // Smooth anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    this.scroll.scrollTo(target);
                }
            });
        });
    }

    setupAnimations() {
        // Hero animations
        const tl = gsap.timeline();
        
        tl.from('.hero-badge', {
            duration: 0.8,
            opacity: 0,
            y: 30,
            ease: 'power2.out'
        })
        .from('.hero-title', {
            duration: 1,
            opacity: 0,
            y: 50,
            ease: 'power2.out'
        }, '-=0.5')
        .from('.hero-description', {
            duration: 0.8,
            opacity: 0,
            y: 30,
            ease: 'power2.out'
        }, '-=0.7')
        .from('.stat-card', {
            duration: 0.6,
            opacity: 0,
            y: 30,
            stagger: 0.1,
            ease: 'power2.out'
        }, '-=0.5')
        .from('.hero-actions .btn-primary-large, .hero-actions .btn-secondary-large', {
            duration: 0.6,
            opacity: 0,
            y: 30,
            stagger: 0.1,
            ease: 'power2.out'
        }, '-=0.3');

        // Floating cards animation
        gsap.to('.floating-card', {
            duration: 6,
            y: -20,
            ease: 'power1.inOut',
            repeat: -1,
            yoyo: true,
            stagger: {
                each: 2,
                repeat: -1
            }
        });

        // Section animations
        gsap.utils.toArray('.process-card').forEach((card, i) => {
            gsap.from(card, {
                duration: 0.8,
                opacity: 0,
                y: 50,
                delay: i * 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    scroller: '[data-scroll-container]'
                }
            });
        });

        gsap.utils.toArray('.feature-card').forEach((card, i) => {
            gsap.from(card, {
                duration: 0.8,
                opacity: 0,
                x: i % 2 === 0 ? -50 : 50,
                delay: i * 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    scroller: '[data-scroll-container]'
                }
            });
        });

        // Showcase items parallax
        gsap.utils.toArray('.showcase-item').forEach((item, i) => {
            gsap.to(item, {
                yPercent: -50,
                ease: 'none',
                scrollTrigger: {
                    trigger: item,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                    scroller: '[data-scroll-container]'
                }
            });
        });
    }

    setupCounters() {
        const counters = document.querySelectorAll('.stat-number[data-target], .trust-number[data-target]');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            
            ScrollTrigger.create({
                trigger: counter,
                start: 'top 80%',
                scroller: '[data-scroll-container]',
                once: true,
                onEnter: () => {
                    gsap.to(counter, {
                        duration: 2,
                        innerHTML: target,
                        ease: 'power2.out',
                        snap: { innerHTML: 1 },
                        onUpdate: function() {
                            counter.innerHTML = Math.ceil(counter.innerHTML);
                        }
                    });
                }
            });
        });
    }

    setupInteractions() {
        // Button hover effects
        document.querySelectorAll('.btn-primary, .btn-primary-large').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                gsap.to(btn, {
                    duration: 0.3,
                    scale: 1.05,
                    ease: 'power2.out'
                });
            });
            
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    duration: 0.3,
                    scale: 1,
                    ease: 'power2.out'
                });
            });
        });

        // Card hover effects
        document.querySelectorAll('.process-card, .feature-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    duration: 0.3,
                    y: -10,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    ease: 'power2.out'
                });
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    duration: 0.3,
                    y: 0,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                    ease: 'power2.out'
                });
            });
        });

        // Logo animation
        const logo = document.querySelector('.logo');
        logo.addEventListener('mouseenter', () => {
            gsap.to('.logo-icon', {
                duration: 0.5,
                rotation: 360,
                ease: 'power2.out'
            });
        });
    }

    // Certificate upload simulation
    simulateVerification() {
        const steps = [
            'Uploading certificate...',
            'Extracting text with OCR...',
            'Running AI analysis...',
            'Checking blockchain registry...',
            'Verification complete ✅'
        ];

        // Create progress indicator
        const progressContainer = document.createElement('div');
        progressContainer.className = 'verification-progress';
        progressContainer.innerHTML = `
            <div class="progress-step">
                <div class="progress-text">Ready to verify...</div>
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(progressContainer);

        // Animate through steps
        let currentStep = 0;
        const progressText = progressContainer.querySelector('.progress-text');
        const progressFill = progressContainer.querySelector('.progress-fill');

        const nextStep = () => {
            if (currentStep < steps.length) {
                progressText.textContent = steps[currentStep];
                gsap.to(progressFill, {
                    duration: 0.8,
                    width: `${((currentStep + 1) / steps.length) * 100}%`,
                    ease: 'power2.out'
                });
                currentStep++;
                setTimeout(nextStep, 1000);
            } else {
                setTimeout(() => {
                    gsap.to(progressContainer, {
                        duration: 0.5,
                        opacity: 0,
                        y: -50,
                        ease: 'power2.out',
                        onComplete: () => {
                            progressContainer.remove();
                        }
                    });
                }, 2000);
            }
        };

        // Start animation
        gsap.from(progressContainer, {
            duration: 0.5,
            opacity: 0,
            y: 50,
            ease: 'power2.out',
            onComplete: nextStep
        });
    }
}

// Global functions
function playDemo() {
    const demo = new TruCredModern();
    demo.simulateVerification();
}

function scheduleDemo() {
    alert('Demo scheduling feature coming soon!');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TruCredModern();
});

// Handle window resize
window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
});
