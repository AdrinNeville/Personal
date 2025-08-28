// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const themeToggle = document.getElementById('theme-toggle');
const scrollIndicator = document.getElementById('scroll-indicator');
const contactForm = document.getElementById('contact-form');
const particles = document.getElementById('particles');

// Theme Management
let isDarkTheme = true;

// Check for user's preferred color scheme
function getPreferredTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        return savedTheme === 'dark';
    }
    return !window.matchMedia('(prefers-color-scheme: light)').matches;
}

function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    document.body.classList.toggle('light-theme', !isDarkTheme);
    
    const icon = themeToggle.querySelector('i');
    icon.className = isDarkTheme ? 'fas fa-moon' : 'fas fa-sun';
    
    // Save theme preference
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    
    // Announce theme change to screen readers
    announceToScreenReader(`Switched to ${isDarkTheme ? 'dark' : 'light'} theme`);
}

// Load saved theme
function loadTheme() {
    isDarkTheme = getPreferredTheme();
    document.body.classList.toggle('light-theme', !isDarkTheme);
    const icon = themeToggle.querySelector('i');
    icon.className = isDarkTheme ? 'fas fa-moon' : 'fas fa-sun';
    themeToggle.setAttribute('aria-label', `Switch to ${isDarkTheme ? 'light' : 'dark'} theme`);
}

// Screen reader announcements
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Particles Animation
function createParticle() {
    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }
    
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
    particle.style.opacity = Math.random();
    particles.appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 5000);
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Update ARIA attributes
    const isExpanded = navMenu.classList.contains('active');
    hamburger.setAttribute('aria-expanded', isExpanded);
    
    // Focus management
    if (isExpanded) {
        navMenu.querySelector('.nav-link').focus();
    }
}

// Close mobile menu when clicking on a link
function closeMobileMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
}

// Smooth scrolling for navigation links
function smoothScroll(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
        target.scrollIntoView({
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
            block: 'start'
        });
        
        // Focus the target for screen readers
        target.setAttribute('tabindex', '-1');
        target.focus();
        target.addEventListener('blur', () => {
            target.removeAttribute('tabindex');
        }, { once: true });
    }
}

// Navbar background on scroll
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Counter Animation
function animateCounter(counter) {
    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const target = parseInt(counter.getAttribute('data-target'));
        counter.textContent = target + '+';
        return;
    }
    
    const target = parseInt(counter.getAttribute('data-target'));
    const increment = target / 200;
    let current = 0;
    
    const updateCounter = () => {
        if (current < target) {
            current += increment;
            counter.textContent = Math.ceil(current) + '+';
            requestAnimationFrame(updateCounter);
        } else {
            counter.textContent = target + '+';
        }
    };
    
    updateCounter();
}

// Skill Bar Animation
function animateSkillBars(skillsSection) {
    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const skillBars = skillsSection.querySelectorAll('.skill-progress');
        skillBars.forEach(bar => {
            bar.style.width = bar.getAttribute('data-skill') + '%';
        });
        return;
    }
    
    const skillBars = skillsSection.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        bar.style.width = bar.getAttribute('data-skill') + '%';
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Animate counters
            if (entry.target.classList.contains('about')) {
                const counters = entry.target.querySelectorAll('.counter');
                counters.forEach(counter => {
                    if (!counter.classList.contains('animated')) {
                        counter.classList.add('animated');
                        animateCounter(counter);
                    }
                });
            }
            
            // Animate skill bars
            if (entry.target.classList.contains('skills')) {
                animateSkillBars(entry.target);
            }
            
            // Add fade-in animation to cards
            const cards = entry.target.querySelectorAll('.skill-card, .project-card');
            cards.forEach((card, index) => {
                if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                } else {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        }
    });
}, observerOptions);

// Form Submission
// Updated handleFormSubmit to send data to FastAPI backend

async function handleFormSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    // Validation
    if (!name || !email || !message) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    try {
        const response = await fetch("http://127.0.0.1:8000/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
                email: email,
                subject: subject,
                message: message,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to send message");
        }

        await response.json();

        submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        showNotification('Message sent successfully!', 'success');
        contactForm.reset();
        announceToScreenReader('Message sent successfully!');
    } catch (error) {
        console.error(error);
        showNotification('Something went wrong. Please try again later.', 'error');
    } finally {
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'assertive');
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(notificationStyles);

// Initialize cards with hidden state for animation
function initializeCards() {
    const cards = document.querySelectorAll('.skill-card, .project-card');
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s ease';
        });
    }
}

// Typing Effect for Hero Title
function typeWriter(element, text, speed = 100) {
    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        element.innerHTML = text;
        return;
    }
    
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Keyboard navigation enhancement
function enhanceKeyboardNavigation() {
    // Add keyboard support for custom elements
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            if (e.target.classList.contains('scroll-indicator')) {
                e.preventDefault();
                document.querySelector('#about').scrollIntoView({ 
                    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' 
                });
            }
        }
        
        // Escape key to close mobile menu
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileMenu();
            hamburger.focus();
        }
    });
}

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll handler
const handleScroll = debounce(() => {
    handleNavbarScroll();
    
    // Parallax effect (only if motion is not reduced)
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const heroContent = document.querySelector('.hero-content');
        
        if (hero && heroContent && scrolled < hero.offsetHeight) {
            heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    }
}, 16); // ~60fps

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load theme
    loadTheme();
    
    // Initialize cards
    initializeCards();
    
    // Enhance keyboard navigation
    enhanceKeyboardNavigation();
    
    // Set up observers
    const sections = document.querySelectorAll('.about, .skills');
    sections.forEach(section => observer.observe(section));
    observer.observe(document.querySelector('.projects'));

    
    // Create particles periodically (only if motion is not reduced)
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setInterval(createParticle, 300);
    }
    
    // Typing effect for hero title
    const heroTitle = document.querySelector('.typing-text');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setTimeout(() => {
                typeWriter(heroTitle, originalText, 150);
            }, 1000);
        }
    }
    
    // Set initial focus for better accessibility
    if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
            setTimeout(() => {
                target.scrollIntoView({ behavior: 'auto' });
                target.focus();
            }, 100);
        }
    }
});

// Event Listeners
themeToggle.addEventListener('click', toggleTheme);
hamburger.addEventListener('click', toggleMobileMenu);
contactForm.addEventListener('submit', handleFormSubmit);
scrollIndicator.addEventListener('click', () => {
    document.querySelector('#about').scrollIntoView({ 
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' 
    });
});

// Close mobile menu when clicking on nav links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

// Smooth scrolling for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', smoothScroll);
});

// Window event listeners
window.addEventListener('scroll', handleScroll);

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Animate hero elements
    const heroElements = document.querySelectorAll('.hero-text h1, .hero-text h2, .hero-text p, .hero-buttons');
}
)