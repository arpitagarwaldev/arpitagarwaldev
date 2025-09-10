// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Intersection Observer for animations
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

// Observe all sections for scroll animations
document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + (element.textContent.includes('+') ? '+' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + (element.textContent.includes('+') ? '+' : '');
        }
    }, 16);
}

// Animate counters when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('.stat-number');
            const text = statNumber.textContent;
            const number = parseInt(text.replace(/\D/g, ''));
            
            if (number && !statNumber.dataset.animated) {
                statNumber.dataset.animated = 'true';
                animateCounter(statNumber, number);
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat').forEach(stat => {
    statsObserver.observe(stat);
});

// Add hover effects to cards
document.querySelectorAll('.patent-card, .project-card, .achievement-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Mobile menu toggle (if needed)
const createMobileMenu = () => {
    const navbar = document.querySelector('.navbar');
    const navMenu = document.querySelector('.nav-menu');
    
    if (window.innerWidth <= 768) {
        if (!document.querySelector('.mobile-menu-btn')) {
            const menuBtn = document.createElement('button');
            menuBtn.className = 'mobile-menu-btn';
            menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            menuBtn.style.cssText = `
                background: none;
                border: none;
                font-size: 1.5rem;
                color: var(--primary-color);
                cursor: pointer;
            `;
            
            menuBtn.addEventListener('click', () => {
                navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
                navMenu.style.flexDirection = 'column';
                navMenu.style.position = 'absolute';
                navMenu.style.top = '70px';
                navMenu.style.left = '0';
                navMenu.style.width = '100%';
                navMenu.style.background = 'white';
                navMenu.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                navMenu.style.padding = '1rem';
            });
            
            navbar.querySelector('.nav-container').appendChild(menuBtn);
        }
    }
};

// Initialize mobile menu on load and resize
window.addEventListener('load', createMobileMenu);
window.addEventListener('resize', createMobileMenu);

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    document.body.style.transition = 'opacity 0.5s ease';
});

// Set initial body opacity
document.body.style.opacity = '0';



// Scroll-based neural activity
window.addEventListener('scroll', () => {
    const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    const nodes = document.querySelectorAll('.neural-node');
    const connections = document.querySelectorAll('.neural-connection');
    
    nodes.forEach((node) => {
        const intensity = 0.5 + scrollPercent * 0.5;
        node.style.opacity = intensity;
        node.style.animationDuration = (2 - scrollPercent) + 's';
    });
    
    connections.forEach((connection) => {
        const intensity = 0.3 + scrollPercent * 0.5;
        connection.style.opacity = intensity;
    });
});





// Continuous typing animation for main title
function continuousTypeWriter(element, text, typeSpeed = 150, pauseTime = 2000) {
    let i = 0;
    let isDeleting = false;
    
    function type() {
        if (!isDeleting && i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, typeSpeed);
        } else if (!isDeleting && i === text.length) {
            setTimeout(() => {
                isDeleting = true;
                type();
            }, pauseTime);
        } else if (isDeleting && i > 0) {
            element.textContent = text.substring(0, i - 1);
            i--;
            setTimeout(type, typeSpeed / 2);
        } else if (isDeleting && i === 0) {
            isDeleting = false;
            setTimeout(type, typeSpeed);
        }
    }
    type();
}

// Initialize continuous typing animation
window.addEventListener('load', () => {
    const titleElement = document.getElementById('typing-title');
    if (titleElement) {
        setTimeout(() => {
            continuousTypeWriter(titleElement, 'Arpit Agarwal', 150, 2000);
        }, 500);
    }
});

// Business card download function
function downloadBusinessCard() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 1050;
    canvas.height = 600;
    
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1e40af');
    gradient.addColorStop(0.5, '#3b82f6');
    gradient.addColorStop(1, '#8b5cf6');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 52px Arial, sans-serif';
    ctx.fillText('ARPIT AGARWAL', 50, 100);
    
    ctx.font = '28px Arial, sans-serif';
    ctx.fillText('Senior AI Engineer', 50, 140);
    
    ctx.font = '22px Arial, sans-serif';
    ctx.fillText('Denver, Colorado, USA', 50, 180);
    
    // Contact section
    ctx.font = 'bold 20px Arial, sans-serif';
    ctx.fillText('CONTACT', 50, 240);
    
    ctx.font = '18px Arial, sans-serif';
    ctx.fillText('Phone: +1 (720) 710-6105', 50, 270);
    ctx.fillText('Email: arpit.dev@outlook.com', 50, 300);
    
    // Professional links
    ctx.font = 'bold 20px Arial, sans-serif';
    ctx.fillText('PROFESSIONAL LINKS', 50, 360);
    
    ctx.font = '18px Arial, sans-serif';
    ctx.fillText('LinkedIn: linkedin.com/in/arpitagarwaldev', 50, 390);
    ctx.fillText('GitHub: github.com/arpitagarwaldev', 50, 420);
    
    // Expertise
    ctx.font = 'bold 20px Arial, sans-serif';
    ctx.fillText('EXPERTISE', 50, 480);
    
    ctx.font = '16px Arial, sans-serif';
    ctx.fillText('• 3 US Patents in AI & 5G Networks', 50, 510);
    ctx.fillText('• Agentic AI Systems & LLM Fine-tuning', 50, 535);
    ctx.fillText('• Machine Learning & Data Science', 50, 560);
    
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Arpit_Agarwal_Business_Card.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
}