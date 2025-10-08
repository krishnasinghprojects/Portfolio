class ModalManager {
    constructor() {
        this.imageModal = document.getElementById('imageModal');
        this.pdfModal = document.getElementById('pdfModal');
        this.journeyMapModal = document.getElementById('journeyMapModal');
        
        this.modalImage = document.getElementById('modalImage');
        this.modalPdf = document.getElementById('modalPdf');
        this.downloadPdfBtn = document.getElementById('downloadPdfBtn');
        this.journeyMapContainer = document.getElementById('journeyMapContainer');
        
        this.initializeEventListeners();
        this.initializeCertificateClickHandlers();
        this.initializeResumeButton();
        this.initializeJourneyMapButton();
    }

    initializeEventListeners() {
        // Close modal when clicking overlay or close button
        [this.imageModal, this.pdfModal, this.journeyMapModal].forEach(modal => {
            if (modal) {
                const overlay = modal.querySelector('.modal-overlay');
                const closeBtn = modal.querySelector('.modal-close');
                
                overlay?.addEventListener('click', () => this.closeModal(modal));
                closeBtn?.addEventListener('click', () => this.closeModal(modal));
            }
        });

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });

        // Prevent modal content clicks from closing modal
        document.querySelectorAll('.modal-content').forEach(content => {
            content.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });
    }

    initializeCertificateClickHandlers() {
        // Wait for certificates to be loaded, then add click handlers
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    const certificatesContainer = document.querySelector('.certificates-container');
                    if (certificatesContainer && certificatesContainer.children.length > 0) {
                        this.addCertificateClickHandlers();
                        observer.disconnect(); // Stop observing once certificates are loaded
                    }
                }
            });
        });

        // Start observing
        const certificatesContainer = document.querySelector('.certificates-container');
        if (certificatesContainer) {
            observer.observe(certificatesContainer, { childList: true, subtree: true });
        }

        // Also try to add handlers immediately in case certificates are already loaded
        setTimeout(() => {
            this.addCertificateClickHandlers();
        }, 1000);
    }

    addCertificateClickHandlers() {
        const certificateImages = document.querySelectorAll('.certificates-container img, .badge-container img');
        
        certificateImages.forEach(img => {
            if (!img.hasAttribute('data-modal-handler')) {
                img.style.cursor = 'pointer';
                img.setAttribute('data-modal-handler', 'true');
                
                img.addEventListener('click', (e) => {
                    e.preventDefault();
                    const imgSrc = img.src;
                    const imgAlt = img.alt || 'Certificate';
                    this.openImageModal(imgSrc, imgAlt);
                });

                // Add hover effect
                img.addEventListener('mouseenter', () => {
                    img.style.transform = 'scale(1.05)';
                    img.style.transition = 'transform 0.3s ease';
                });

                img.addEventListener('mouseleave', () => {
                    img.style.transform = 'scale(1)';
                });
            }
        });
    }

    initializeResumeButton() {
        const resumeLink = document.getElementById('resume_link');
        if (resumeLink) {
            resumeLink.addEventListener('click', (e) => {
                e.preventDefault();
                const resumePath = 'https://krishnasingh.live/Resume/Krishna%20Singh%20-%20Resume%20-%202025.pdf';
                
                // For mobile devices, open PDF in new tab instead of modal
                if (window.innerWidth <= 768) {
                    window.open(resumePath, '_blank');
                } else {
                    this.openPdfModal(resumePath, 'Krishna Singh - Resume');
                }
            });
        }
    }

    initializeJourneyMapButton() {
        const journeyMapBtn = document.getElementById('journeyMapBtn');
        if (journeyMapBtn) {
            journeyMapBtn.addEventListener('click', () => {
                this.openJourneyMapModal();
            });
        }
    }

    openImageModal(imageSrc, imageTitle = 'Image') {
        if (!this.imageModal) return;

        this.modalImage.src = imageSrc;
        this.modalImage.alt = imageTitle;
        document.getElementById('imageModalTitle').textContent = imageTitle;
        
        this.showModal(this.imageModal);
    }

    openPdfModal(pdfSrc, pdfTitle = 'PDF Document') {
        if (!this.pdfModal) return;

        this.modalPdf.src = pdfSrc;
        this.downloadPdfBtn.href = pdfSrc;
        document.getElementById('pdfModalTitle').textContent = pdfTitle;
        
        this.showModal(this.pdfModal);
    }

    async openJourneyMapModal() {
        if (!this.journeyMapModal) return;

        try {
            // Load the SVG file - try journey-map.svg first, then fallback to story.svg
            let response = await fetch('Story.svg');
            if (!response.ok) {
                response = await fetch('story.svg');
                if (!response.ok) {
                    throw new Error('Failed to load journey map');
                }
            }
            
            const svgContent = await response.text();
            this.journeyMapContainer.innerHTML = svgContent;
            
            // Add some styling to the SVG
            const svg = this.journeyMapContainer.querySelector('svg');
            if (svg) {
                svg.style.maxWidth = '100%';
                svg.style.height = 'auto';
                svg.style.background = 'white';
                svg.style.borderRadius = '10px';
                svg.style.padding = '1rem';
            }
            
            this.showModal(this.journeyMapModal);
        } catch (error) {
            console.error('Error loading journey map:', error);
            this.journeyMapContainer.innerHTML = `
                <div style="text-align: center; color: var(--text-color); padding: 2rem;">
                    <h3>Journey Map Coming Soon!</h3>
                    <p>The visual journey map is being prepared and will be available soon.</p>
                </div>
            `;
            this.showModal(this.journeyMapModal);
        }
    }

    showModal(modal) {
        if (!modal) return;

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Show modal with animation
        modal.setAttribute('aria-hidden', 'false');
        modal.classList.add('active');
        
        // Focus management for accessibility
        const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            setTimeout(() => firstFocusable.focus(), 100);
        }
    }

    closeModal(modal) {
        if (!modal) return;

        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Clear content for better performance
        setTimeout(() => {
            if (modal === this.imageModal) {
                this.modalImage.src = '';
            } else if (modal === this.pdfModal) {
                this.modalPdf.src = '';
            } else if (modal === this.journeyMapModal) {
                this.journeyMapContainer.innerHTML = '';
            }
        }, 300);
    }

    closeAllModals() {
        [this.imageModal, this.pdfModal, this.journeyMapModal].forEach(modal => {
            if (modal && modal.classList.contains('active')) {
                this.closeModal(modal);
            }
        });
    }
}

// Initialize modal manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.modalManager = new ModalManager();
});

// Also initialize if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.modalManager = new ModalManager();
    });
} else {
    window.modalManager = new ModalManager();
}