// Smooth scrolling and active navigation
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

// Center the About Me section on page load
window.addEventListener('load', () => {
    const scrollableContent = document.querySelector('.scrollable-content');
    const aboutSection = document.getElementById('about');
    
    if (scrollableContent && aboutSection) {
        const scrollTop = aboutSection.offsetTop - (scrollableContent.clientHeight / 2) + (aboutSection.clientHeight / 2);
        scrollableContent.scrollTop = scrollTop;
    }
});

// Active navigation highlighting
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 100;
        if (window.pageYOffset >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Smooth scrolling for navigation links
navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
        const href = link.getAttribute('href');
        // Only prevent default for internal links (anchors)
        if (href && href.startsWith('#')) {
            event.preventDefault();
            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            // Close mobile menu if open
            navMenu.classList.remove('active');
        }
        // For external links (social), do nothing so browser default works
    });
});

// Mobile menu toggle
if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (event) => {
    if (!navMenu.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
        navMenu.classList.remove('active');
    }
});

// Navbar hide/show on scroll with Dark Green Theme
let lastScrollTop = 0;
let isScrolling = false;

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Always maintain dark green theme when navbar is visible
    navbar.style.background = 'linear-gradient(135deg, #0d4f3c 0%, #1a5f4a 50%, #2d7a5f 100%)';
    navbar.style.boxShadow = '0 8px 32px rgba(13, 79, 60, 0.3)';
    navbar.style.backdropFilter = 'blur(20px)';
    
    if (!isScrolling) {
        window.requestAnimationFrame(() => {
            if (currentScrollTop > lastScrollTop && currentScrollTop > 100) {
                // Scrolling down - hide navbar
                navbar.style.transform = 'translateY(-100%)';
                navbar.style.transition = 'transform 0.3s ease-in-out';
            } else {
                // Scrolling up - show navbar
                navbar.style.transform = 'translateY(0)';
                navbar.style.transition = 'transform 0.3s ease-in-out';
            }
            
            lastScrollTop = currentScrollTop;
            isScrolling = false;
        });
    }
    
    isScrolling = true;
});

// FPS Counter
(function() {
    let lastFrame = performance.now();
    let frames = 0;
    let fps = 0;
    const fpsElem = document.getElementById('stat-fps');
    function loop(now) {
        frames++;
        if (now - lastFrame >= 1000) {
            fps = frames;
            frames = 0;
            lastFrame = now;
            if (fpsElem) fpsElem.textContent = fps;
        }
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
})();

// Internet Speed Test (simple download test)
(function() {
    const speedElem = document.getElementById('stat-speed');
    async function testSpeed() {
        const imageUrl = "https://upload.wikimedia.org/wikipedia/commons/3/3f/Fronalpstock_big.jpg?" + Math.random();
        const startTime = performance.now();
        try {
            const response = await fetch(imageUrl, { method: 'GET', cache: 'no-store' });
            const reader = response.body.getReader();
            let received = 0;
            while(true) {
                const {done, value} = await reader.read();
                if (done) break;
                received += value.length;
            }
            const endTime = performance.now();
            const duration = (endTime - startTime) / 1000;
            const bitsLoaded = received * 8;
            const speedMbps = (bitsLoaded / duration / 1024 / 1024).toFixed(2);
            if (speedElem) speedElem.textContent = speedMbps + ' Mbps';
        } catch {
            if (speedElem) speedElem.textContent = 'N/A';
        }
        setTimeout(testSpeed, 15000); // update every 15s
    }
    testSpeed();
})();
