class ImageSlideshow {
            constructor() {
                // Sample images - replace with your own image URLs
                this.images = [
                    { src: 'assets/images/process-photo-1.jpg', alt: 'Process photo 1' },
                    { src: 'assets/images/process-photo-2.jpg', alt: 'Process photo 2' },
                    { src: 'assets/images/process-photo-3.jpg', alt: 'Process photo 3' },
                    { src: 'assets/images/process-photo-4.png', alt: 'Process photo 4' },
                    // { src: 'assets/images/process-photo-1.jpg', alt: 'Process photo 5' },
                    // { src: 'assets/images/process-photo-2.jpg', alt: 'Process photo 6' },
                    // { src: 'assets/images/process-photo-3.jpg', alt: 'Process photo 7' }
                ];

                this.currentIndex = 0;
                this.mainImage = document.getElementById('mainImage');
                this.prevBtn = document.getElementById('prevBtn');
                this.nextBtn = document.getElementById('nextBtn');
                this.imageCounter = document.getElementById('imageCounter');
                this.thumbnailsContainer = document.getElementById('thumbnailsContainer');

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
                    
                    thumbnail.addEventListener('click', () => {
                        this.goToSlide(index);
                    });

                    this.thumbnailsContainer.appendChild(thumbnail);
                });
            }

            bindEvents() {
                this.prevBtn.addEventListener('click', () => this.previousSlide());
                this.nextBtn.addEventListener('click', () => this.nextSlide());

                // Keyboard navigation
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'ArrowLeft') this.previousSlide();
                    if (e.key === 'ArrowRight') this.nextSlide();
                });

                // Touch/swipe support for mobile
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

                    // Only trigger if horizontal swipe is greater than vertical
                    if (Math.abs(diffX) > Math.abs(diffY)) {
                        if (Math.abs(diffX) > 50) { // Minimum swipe distance
                            if (diffX > 0) {
                                this.nextSlide();
                            } else {
                                this.previousSlide();
                            }
                        }
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
                // Update main image
                const currentImage = this.images[this.currentIndex];
                this.mainImage.src = currentImage.src;
                this.mainImage.alt = currentImage.alt;

                // Update counter
                this.imageCounter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;

                // Update active thumbnail
                const thumbnails = this.thumbnailsContainer.querySelectorAll('.thumbnail');
                thumbnails.forEach((thumbnail, index) => {
                    thumbnail.classList.toggle('active', index === this.currentIndex);
                });
            }
        }

        // Initialize slideshow when page loads
        document.addEventListener('DOMContentLoaded', () => {
            new ImageSlideshow();
        });


function playaudio() {
            var audio = document.getElementById("lindaAudio");
            audio.play().catch(function(error) {
                console.log("Audio play failed:", error);
                alert("Could not play audio. This might be due to browser autoplay policy or missing audio file.");
            });
        }