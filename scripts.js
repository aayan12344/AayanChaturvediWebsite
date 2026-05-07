const navLinks = document.querySelectorAll('.nav-link');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const navbar = document.querySelector('.navbar');
const scrollableContent = document.querySelector('.scrollable-content');
const mainLayout = document.querySelector('.main-layout');

// ─── Sync body padding to exact navbar height (eliminates the gap) ──────────

function syncNavHeight() {
    const h = navbar.offsetHeight;
    document.body.style.paddingTop = h + 'px';
    if (mainLayout) mainLayout.style.height = `calc(100vh - ${h}px)`;
}

syncNavHeight();
window.addEventListener('resize', syncNavHeight);

// ─── Scroll target: use .scrollable-content on desktop, window on mobile ───

function getScrollTop() {
    if (scrollableContent && scrollableContent.scrollHeight > scrollableContent.clientHeight) {
        return scrollableContent.scrollTop;
    }
    return window.pageYOffset;
}

// ─── Center About section on load ──────────────────────────────────────────

window.addEventListener('load', () => {
    const aboutSection = document.getElementById('about');
    if (scrollableContent && aboutSection) {
        const scrollTop = aboutSection.offsetTop
            - (scrollableContent.clientHeight / 2)
            + (aboutSection.clientHeight / 2);
        scrollableContent.scrollTop = Math.max(0, scrollTop);
    }
    startTyping();
});

// ─── Active nav highlighting ────────────────────────────────────────────────

function updateActiveNav() {
    const scrollTop = getScrollTop();
    const sections = document.querySelectorAll('section[id]');
    let current = '';

    sections.forEach(section => {
        if (section.offsetTop - 160 <= scrollTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ─── Dynamic navbar on scroll ───────────────────────────────────────────────

function handleScroll() {
    const scrollTop = getScrollTop();
    const progress = Math.min(scrollTop / 120, 1); // 0 → 1 over first 120px

    // Interpolate background opacity: nearly invisible → solid
    const bgAlpha   = (0.05 + progress * 0.85).toFixed(3);
    const blurPx    = (4   + progress * 16).toFixed(1);
    const borderA   = (0.04 + progress * 0.1).toFixed(3);
    const shadowA   = (0   + progress * 0.5).toFixed(3);

    navbar.style.background      = `rgba(0, 0, 0, ${bgAlpha})`;
    navbar.style.backdropFilter  = `blur(${blurPx}px)`;
    navbar.style.borderBottom    = `1px solid rgba(255, 255, 255, ${borderA})`;
    navbar.style.boxShadow       = `0 4px 30px rgba(0, 0, 0, ${shadowA})`;

    updateActiveNav();
}

if (scrollableContent) {
    scrollableContent.addEventListener('scroll', handleScroll, { passive: true });
}
window.addEventListener('scroll', handleScroll, { passive: true });

// Run once on load to set initial state
handleScroll();

// ─── Smooth scrolling ───────────────────────────────────────────────────────

navLinks.forEach(link => {
    link.addEventListener('click', event => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            event.preventDefault();
            const target = document.getElementById(href.substring(1));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    });
});

// ─── Mobile menu ────────────────────────────────────────────────────────────

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });
}

document.addEventListener('click', event => {
    if (!navMenu.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    }
});

// ─── Scroll-reveal animations ───────────────────────────────────────────────

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    root: scrollableContent || null,
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px',
});

document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));

// ─── Typing animation ────────────────────────────────────────────────────────

const typingLines = [
    'Computer Science @ Virginia Tech',
    'AI & Machine Learning Developer',
    'Software Engineering Intern',
    'Data Analytics Enthusiast',
];

let lineIndex = 0;
let charIndex = 0;
let deleting = false;

function startTyping() {
    const elem = document.getElementById('typing-text');
    if (!elem) return;

    const line = typingLines[lineIndex];

    if (deleting) {
        elem.textContent = line.substring(0, charIndex - 1);
        charIndex--;
    } else {
        elem.textContent = line.substring(0, charIndex + 1);
        charIndex++;
    }

    let delay = deleting ? 45 : 75;

    if (!deleting && charIndex === line.length) {
        delay = 2200;
        deleting = true;
    } else if (deleting && charIndex === 0) {
        deleting = false;
        lineIndex = (lineIndex + 1) % typingLines.length;
        delay = 350;
    }

    setTimeout(startTyping, delay);
}

