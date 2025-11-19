// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');

        // Animate hamburger
        const spans = hamburger.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Subject Tabs Functionality
const tabButtons = document.querySelectorAll('.tab-button');
const subjectPanels = document.querySelectorAll('.subject-panel');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons and panels
        tabButtons.forEach(btn => btn.classList.remove('active'));
        subjectPanels.forEach(panel => panel.classList.remove('active'));

        // Add active class to clicked button
        button.classList.add('active');

        // Show corresponding panel
        const subject = button.getAttribute('data-subject');
        const targetPanel = document.getElementById(subject);
        if (targetPanel) {
            targetPanel.classList.add('active');
        }
    });
});

// Scroll Animation for Cards
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and items
const animatedElements = document.querySelectorAll(
    '.tool-card, .sen-card, .ethics-card, .prompt-card, .rec-item, .plan-week'
);

animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

// Active Navigation Link on Scroll
const sections = document.querySelectorAll('section[id]');

function updateActiveLink() {
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveLink);

// Scroll to Top on Page Load
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
});

// Copy Prompt to Clipboard Functionality
function createCopyButtons() {
    const promptBoxes = document.querySelectorAll('.prompt-box p');

    promptBoxes.forEach(box => {
        // Create copy button
        const copyBtn = document.createElement('button');
        copyBtn.textContent = '📋 Copy Prompt';
        copyBtn.className = 'copy-prompt-btn';
        copyBtn.style.cssText = `
            margin-top: 0.5rem;
            padding: 0.5rem 1rem;
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            transition: background-color 0.3s;
        `;

        // Add hover effect
        copyBtn.addEventListener('mouseenter', () => {
            copyBtn.style.backgroundColor = '#1d4ed8';
        });

        copyBtn.addEventListener('mouseleave', () => {
            copyBtn.style.backgroundColor = 'var(--primary-color)';
        });

        // Copy functionality
        copyBtn.addEventListener('click', () => {
            const text = box.textContent;
            navigator.clipboard.writeText(text).then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = '✓ Copied!';
                copyBtn.style.backgroundColor = '#10b981';

                setTimeout(() => {
                    copyBtn.textContent = originalText;
                    copyBtn.style.backgroundColor = 'var(--primary-color)';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        });

        // Insert button after the paragraph
        box.parentElement.appendChild(copyBtn);
    });
}

// Initialize copy buttons after DOM is loaded
document.addEventListener('DOMContentLoaded', createCopyButtons);

// Search Functionality (Optional Enhancement)
function addSearchFeature() {
    // This is a placeholder for future search functionality
    // You could add a search box to filter prompts or tools
}

// Print Friendly Version
function setupPrintMode() {
    window.addEventListener('beforeprint', () => {
        // Expand all collapsed sections for printing
        subjectPanels.forEach(panel => {
            panel.style.display = 'block';
        });
    });

    window.addEventListener('afterprint', () => {
        // Restore original state
        subjectPanels.forEach(panel => {
            if (!panel.classList.contains('active')) {
                panel.style.display = 'none';
            }
        });
    });
}

setupPrintMode();

// Lazy Loading for Images (if you add images later)
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Keyboard Navigation for Tabs
tabButtons.forEach((button, index) => {
    button.addEventListener('keydown', (e) => {
        let newIndex;

        if (e.key === 'ArrowRight') {
            newIndex = (index + 1) % tabButtons.length;
            tabButtons[newIndex].click();
            tabButtons[newIndex].focus();
        } else if (e.key === 'ArrowLeft') {
            newIndex = (index - 1 + tabButtons.length) % tabButtons.length;
            tabButtons[newIndex].click();
            tabButtons[newIndex].focus();
        }
    });
});

// Dark Mode Toggle (Optional Feature)
function setupDarkMode() {
    // Check for saved user preference
    const darkModePreference = localStorage.getItem('darkMode');

    if (darkModePreference === 'enabled') {
        document.body.classList.add('dark-mode');
    }
}

// Optional: Add a dark mode toggle button
function createDarkModeToggle() {
    const toggleBtn = document.createElement('button');
    toggleBtn.innerHTML = '🌙';
    toggleBtn.className = 'dark-mode-toggle';
    toggleBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: var(--primary-color);
        color: white;
        border: none;
        cursor: pointer;
        font-size: 1.5rem;
        box-shadow: var(--shadow-lg);
        z-index: 999;
        transition: transform 0.3s;
    `;

    toggleBtn.addEventListener('mouseenter', () => {
        toggleBtn.style.transform = 'scale(1.1)';
    });

    toggleBtn.addEventListener('mouseleave', () => {
        toggleBtn.style.transform = 'scale(1)';
    });

    toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');

        if (isDarkMode) {
            localStorage.setItem('darkMode', 'enabled');
            toggleBtn.innerHTML = '☀️';
        } else {
            localStorage.setItem('darkMode', 'disabled');
            toggleBtn.innerHTML = '🌙';
        }
    });

    // Uncomment to enable dark mode toggle
    // document.body.appendChild(toggleBtn);
}

// Initialize features
document.addEventListener('DOMContentLoaded', () => {
    setupDarkMode();
    // createDarkModeToggle(); // Uncomment to enable dark mode
    lazyLoadImages();
});

// Performance: Debounce scroll event
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

// Apply debounce to scroll event
window.addEventListener('scroll', debounce(updateActiveLink, 100));

// Accessibility: Skip to content link
const skipLink = document.createElement('a');
skipLink.href = '#home';
skipLink.textContent = 'Skip to main content';
skipLink.className = 'skip-link';
skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 0;
    background: var(--primary-color);
    color: white;
    padding: 8px;
    text-decoration: none;
    z-index: 100;
`;

skipLink.addEventListener('focus', () => {
    skipLink.style.top = '0';
});

skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
});

document.body.insertBefore(skipLink, document.body.firstChild);

// Analytics placeholder (if you add analytics later)
function trackEvent(category, action, label) {
    // Placeholder for analytics tracking
    console.log(`Event: ${category} - ${action} - ${label}`);
}

// Track clicks on external tool links
document.querySelectorAll('.tool-link').forEach(link => {
    link.addEventListener('click', () => {
        trackEvent('Tool', 'Click', link.textContent);
    });
});
