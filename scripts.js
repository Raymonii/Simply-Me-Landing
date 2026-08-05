/* ==========================================================================
   Image slideshow (behind-the-scenes photos)
   ========================================================================== */

class ImageSlideshow {
    constructor() {
        this.images = [
            { src: 'assets/images/process-photo-1.jpg', alt: 'Process photo 1' },
            { src: 'assets/images/process-photo-2.jpg', alt: 'Process photo 2' },
            { src: 'assets/images/process-photo-3.jpg', alt: 'Process photo 3' },
            { src: 'assets/images/process-photo-4.png', alt: 'Process photo 4' },
        ];

        this.currentIndex = 0;
        this.mainImage = document.getElementById('mainImage');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.imageCounter = document.getElementById('imageCounter');
        this.thumbnailsContainer = document.getElementById('thumbnailsContainer');

        if (!this.mainImage) return;
        this.init();
    }

    init() {
        this.createThumbnails();
        this.bindEvents();
        this.updateSlideshow();
    }

    createThumbnails() {
        this.images.forEach((image, index) => {
            const thumbnail = document.createElement('img');
            thumbnail.src = image.src;
            thumbnail.alt = image.alt;
            thumbnail.className = 'thumbnail';
            thumbnail.dataset.index = index;

            thumbnail.addEventListener('click', () => this.goToSlide(index));

            this.thumbnailsContainer.appendChild(thumbnail);
        });
    }

    bindEvents() {
        this.prevBtn.addEventListener('click', () => this.previousSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.previousSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });

        let startX = 0;
        let startY = 0;

        this.mainImage.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        this.mainImage.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;

            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;

            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) this.nextSlide();
                else this.previousSlide();
            }

            startX = 0;
            startY = 0;
        });
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.updateSlideshow();
    }

    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateSlideshow();
    }

    previousSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateSlideshow();
    }

    updateSlideshow() {
        const currentImage = this.images[this.currentIndex];
        this.mainImage.style.opacity = 0;

        setTimeout(() => {
            this.mainImage.src = currentImage.src;
            this.mainImage.alt = currentImage.alt;
            this.mainImage.style.opacity = 1;
        }, 120);

        this.imageCounter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;

        const thumbnails = this.thumbnailsContainer.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumbnail, index) => {
            thumbnail.classList.toggle('active', index === this.currentIndex);
        });
    }
}

/* ==========================================================================
   Linda's affirmation audio
   ========================================================================== */

function playAudio() {
    const audio = document.getElementById('lindaAudio');
    if (!audio) return;
    audio.play().catch((error) => {
        console.log('Audio play failed:', error);
        alert('Could not play audio. This might be due to browser autoplay policy or a missing audio file.');
    });
}

/* ==========================================================================
   Join modal
   ========================================================================== */

function openJoinModal() {
    const modal = document.getElementById('joinModal');
    if (modal) modal.classList.add('show');
}

function closeJoinModal() {
    const modal = document.getElementById('joinModal');
    if (modal) modal.classList.remove('show');
}

const WEBAPP_URL = 'https://script.google.com/macros/s/YOUR_WEB_APP_URL/exec';

async function handleJoinFormSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('joinName').value.trim();
    const email = document.getElementById('joinEmail').value.trim();

    if (!name || !email) {
        alert('Please fill all fields.');
        return;
    }

    try {
        const response = await fetch(WEBAPP_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email }),
        });

        const result = await response.json();

        if (result.status === 'success') {
            alert('Thank you for joining!');
            document.getElementById('joinForm').reset();
            closeJoinModal();
        } else {
            alert(result.message || 'Something went wrong.');
        }
    } catch (error) {
        // Fall back gracefully so a broken/placeholder webhook never blocks a real signup.
        alert("Thanks! If this doesn't go through, just email us at SimplymeDolls@gmail.com and we'll add you directly.");
        console.log(error);
    }
}

/* ==========================================================================
   Scroll reveal
   ========================================================================== */

function initScrollReveal() {
    const revealEls = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || revealEls.length === 0) {
        revealEls.forEach((el) => el.classList.add('in-view'));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    revealEls.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   Mobile nav toggle
   ========================================================================== */

function initMobileNav() {
    const toggle = document.getElementById('navToggle');
    const links = document.querySelector('.nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
        const isOpen = links.classList.toggle('nav-links-open');
        toggle.classList.toggle('nav-toggle-open', isOpen);
    });

    links.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            links.classList.remove('nav-links-open');
            toggle.classList.remove('nav-toggle-open');
        });
    });
}

/* ==========================================================================
   Init
   ========================================================================== */

window.addEventListener('load', () => {
    setTimeout(() => {
        openJoinModal();
    }, 600);
});

document.addEventListener('DOMContentLoaded', () => {
    new ImageSlideshow();
    initScrollReveal();
    initMobileNav();

    const playBtn = document.getElementById('playAudioBtn');
    if (playBtn) playBtn.addEventListener('click', playAudio);

    const closeBtn = document.getElementById('closeModal');
    if (closeBtn) closeBtn.addEventListener('click', closeJoinModal);

    const overlay = document.getElementById('joinModal');
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeJoinModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeJoinModal();
    });

    const navJoinBtn = document.getElementById('navJoinBtn');
    if (navJoinBtn) navJoinBtn.addEventListener('click', openJoinModal);

    const heroJoinBtn = document.getElementById('heroJoinBtn');
    if (heroJoinBtn) heroJoinBtn.addEventListener('click', openJoinModal);

    const joinForm = document.getElementById('joinForm');
    if (joinForm) joinForm.addEventListener('submit', handleJoinFormSubmit);
});
