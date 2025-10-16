// markdown-parser.js (Rewritten and Improved)
// 
// Image Width Syntax Support:
// 1. Standard: ![alt](src "width:300px") - width in title
// 2. Attribute: ![alt](src){width:300px} - width in curly braces
// 3. Percentage: ![alt](src "w:50%") - percentage width
// 4. Multiple images on same line will auto-wrap in image-row container
//
class MarkdownParser {
    constructor() {
        // The order of these rules is important.
        // Block elements are processed first.
        this.rules = [
            // Code blocks (```...```) - Must be first to preserve content
            {
                pattern: /```(\w+)?\n?([\s\S]*?)```/g,
                replacement: (_, language, code) => {
                    const cleanCode = code.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;");
                    const langClass = language ? ` class="language-${language}"` : '';
                    return `<pre><code${langClass}>${cleanCode}</code></pre>`;
                }
            },
            // Headings
            { pattern: /^### (.*$)/gim, replacement: '<h3>$1</h3>' },
            { pattern: /^## (.*$)/gim, replacement: '<h2>$1</h2>' },
            { pattern: /^# (.*$)/gim, replacement: '<h1>$1</h1>' },
            // Blockquotes
            { pattern: /^> (.*$)/gim, replacement: '<blockquote>$1</blockquote>' },
            // Images - handle relative paths and width attributes
            {
                pattern: /!\[([^\]]*)\]\(([^)]+?)(?:\s+"([^"]*)")?\)/g,
                replacement: (_, alt, src, title) => {
                    // Handle relative paths that start with ../
                    const imageSrc = src.startsWith('../') ? src.substring(3) : src;

                    // Check if title contains width specification (e.g., "width:300px" or "w:50%")
                    let widthStyle = '';
                    let actualTitle = title || '';

                    if (title) {
                        const widthMatch = title.match(/(?:width|w):([^;]+)/i);
                        if (widthMatch) {
                            const width = widthMatch[1].trim();
                            widthStyle = ` style="width: ${width}; max-width: ${width}; display: inline-block;"`;
                            // Remove width specification from title
                            actualTitle = title.replace(/(?:width|w):[^;]+;?/gi, '').trim();
                        }
                    }

                    const titleAttr = actualTitle ? ` title="${actualTitle}"` : '';
                    return `<img src="${imageSrc}" alt="${alt}" class="blog-image"${widthStyle}${titleAttr}/>`;
                }
            },
            // Images with width attribute syntax: ![alt](src){width:300px}
            {
                pattern: /!\[([^\]]*)\]\(([^)]+)\)\{([^}]+)\}/g,
                replacement: (_, alt, src, attributes) => {
                    // Handle relative paths that start with ../
                    const imageSrc = src.startsWith('../') ? src.substring(3) : src;

                    // Parse attributes
                    let widthStyle = '';
                    const widthMatch = attributes.match(/(?:width|w):([^;,]+)/i);
                    if (widthMatch) {
                        const width = widthMatch[1].trim();
                        widthStyle = ` style="width: ${width}; max-width: ${width}; display: inline-block;"`;
                    }

                    return `<img src="${imageSrc}" alt="${alt}" class="blog-image"${widthStyle}/>`;
                }
            },
            // Links -> converted to glass buttons
            { pattern: /\[([^\]]+)\]\(([^)]+)\)/g, replacement: '<a href="$2" target="_blank" class="glass-button blog-link">$1</a>' },
            // Horizontal rules
            { pattern: /^---$/gm, replacement: '<hr>' },
            { pattern: /^\*\*\*$/gm, replacement: '<hr>' },
            // Unordered lists (• and -)
            { pattern: /^[•\*-] (.*$)/gim, replacement: '<li>$1</li>' },
            // Ordered lists
            { pattern: /^\d+\. (.*$)/gim, replacement: '<li>$1</li>' },
            // Inline elements
            { pattern: /\*\*(.*?)\*\*/g, replacement: '<strong>$1</strong>' },
            { pattern: /__(.*?)__/g, replacement: '<strong>$1</strong>' },
            { pattern: /\*([^*]+)\*/g, replacement: '<em>$1</em>' },
            { pattern: /_([^_]+)_/g, replacement: '<em>$1</em>' },
            { pattern: /~~(.*?)~~/g, replacement: '<del>$1</del>' },
            { pattern: /==(.*?)==/g, replacement: '<mark>$1</mark>' },
            { pattern: /`([^`]+)`/g, replacement: '<code>$1</code>' },
        ];
    }

    parse(markdown) {
        if (!markdown) return '';

        let html = '\n' + markdown.trim() + '\n';

        // Apply rules
        this.rules.forEach(rule => {
            if (typeof rule.replacement === 'function') {
                html = html.replace(rule.pattern, rule.replacement);
            } else {
                html = html.replace(rule.pattern, rule.replacement);
            }
        });

        // Consolidate multi-line blockquotes
        html = html.replace(/<\/blockquote>\s*<blockquote>/g, '<br>');

        // Wrap list items in proper list containers
        // First, handle ordered lists (they have numbers)
        html = html.replace(/((?:<li>\d+\..*?<\/li>\s*)+)/gs, (match) => {
            const cleanMatch = match.replace(/<li>\d+\.\s*/g, '<li>');
            return `<ol>\n${cleanMatch}</ol>\n`;
        });

        // Then handle unordered lists (remaining <li> elements)
        html = html.replace(/((?:<li>(?!\d+\.).*?<\/li>\s*)+)/gs, (match) => {
            return `<ul>\n${match}</ul>\n`;
        });

        // Clean up adjacent lists of the same type
        html = html.replace(/<\/ul>\s*<ul>/g, '');
        html = html.replace(/<\/ol>\s*<ol>/g, '');

        // Handle multiple images on the same line (wrap in image-row div)
        html = html.replace(/(<img[^>]*class="blog-image"[^>]*\/?>)(\s*)(<img[^>]*class="blog-image"[^>]*\/?>)/g,
            (match, img1, _, img2) => {
                // Check if there are more images following
                const remainingHtml = html.substring(html.indexOf(match) + match.length);
                const nextImgMatch = remainingHtml.match(/^\s*(<img[^>]*class="blog-image"[^>]*\/?>)/);

                if (nextImgMatch) {
                    return `<div class="image-row">${img1}${img2}`;
                } else {
                    return `<div class="image-row">${img1}${img2}</div>`;
                }
            });

        // Close any unclosed image-row divs
        html = html.replace(/<div class="image-row">([^<]*(?:<img[^>]*>[^<]*)*)<img[^>]*class="blog-image"[^>]*\/?>(?!\s*<img)/g,
            (match) => match + '</div>');

        // Paragraphs and cleanup
        // Split into paragraphs based on double line breaks
        let paragraphs = html.trim().split(/\n{2,}/);

        html = paragraphs.map(p => {
            p = p.trim();
            if (!p) return '';

            // If the chunk is already a block-level element, don't wrap it in <p>
            if (p.match(/^\s*<(h[1-6]|ul|ol|li|blockquote|pre|hr|img|div)/)) {
                return p;
            }
            // Skip if it's just a closing tag
            if (p.match(/^\s*<\/(h[1-6]|ul|ol|li|blockquote|pre|hr|img|div)/)) {
                return p;
            }
            // Otherwise, wrap it in a <p> tag and handle single line breaks inside it
            return `<p>${p.replace(/\n/g, '<br>')}</p>`;
        }).filter(p => p).join('\n\n');

        // Final cleanup of paragraphs around block elements which might have been missed
        html = html.replace(/<p>\s*<(h[1-6]|ul|ol|blockquote|pre|hr|img|div)/g, '<$1');
        html = html.replace(/<\/(h[1-6]|ul|ol|blockquote|pre|hr|img|div)>\s*<\/p>/g, '</$1>');
        html = html.replace(/<p><\/p>/g, '');
        html = html.replace(/\n{3,}/g, '\n\n');

        return html;
    }
}

// The BlogRenderer class remains unchanged as it correctly uses the parser.
class BlogRenderer {
    constructor() {
        this.parser = new MarkdownParser();
        this.blogFolder = 'Blogs/';

        // Add cache to avoid repeated requests
        this.cache = new Map();
    }

    async loadMarkdownFile(filename) {
        // Check cache first
        if (this.cache.has(filename)) {
            console.log(`Cache hit for: ${filename}`);
            return this.cache.get(filename);
        }

        // Try multiple path strategies for different hosting environments
        const pathStrategies = [
            `${this.blogFolder}${filename}.md`,           // Direct relative path
            `./${this.blogFolder}${filename}.md`,         // Explicit relative path
            `/${this.blogFolder}${filename}.md`,          // Absolute path from root
        ];

        for (let i = 0; i < pathStrategies.length; i++) {
            const filePath = pathStrategies[i];
            try {
                console.log(`Attempt ${i + 1}: Loading markdown file: ${filePath}`);

                const response = await fetch(filePath);
                if (response.ok) {
                    const content = await response.text();
                    console.log(`Success: Loaded ${filePath}`);

                    // Cache the successful result
                    this.cache.set(filename, content);
                    return content;
                }
                console.log(`Failed: ${filePath} - HTTP ${response.status}: ${response.statusText}`);
            } catch (error) {
                console.log(`Error with ${filePath}:`, error.message);
            }
        }

        console.error(`All attempts failed for filename: ${filename}`);
        // Cache the null result to avoid repeated failed requests
        this.cache.set(filename, null);
        return null;
    }

    async renderBlog(projectName) {
        const markdown = await this.loadMarkdownFile(projectName.toLowerCase().replace(/\s+/g, '-'));

        if (!markdown) {
            return '<p>Blog content not found.</p>';
        }

        return this.parser.parse(markdown);
    }

    extractMetadata(markdown) {
        const metadataRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/;
        const metadataMatch = markdown.match(metadataRegex);

        if (!metadataMatch) return { content: markdown, metadata: {} };

        const metadataText = metadataMatch[1];
        const content = markdown.replace(metadataRegex, '').trim();
        const metadata = {};

        metadataText.split(/\r?\n/).forEach(line => {
            const colonIndex = line.indexOf(':');
            if (colonIndex > 0) {
                const key = line.substring(0, colonIndex).trim();
                const value = line.substring(colonIndex + 1).trim();
                if (key && value) {
                    metadata[key] = value;
                }
            }
        });

        return { content, metadata };
    }

    async renderBlogWithMetadata(projectName) {
        const filename = projectName.toLowerCase().replace(/\s+/g, '-');
        console.log(`Rendering blog for project: "${projectName}" -> filename: "${filename}"`);

        const markdown = await this.loadMarkdownFile(filename);

        if (!markdown) {
            return {
                html: '<p>Blog content not found.</p>',
                metadata: { title: projectName, subtitle: '' }
            };
        }

        const { content, metadata } = this.extractMetadata(markdown);
        const html = this.parser.parse(content);

        return {
            html,
            metadata: {
                title: metadata.title || projectName,
                subtitle: metadata.subtitle || '',
                date: metadata.date || '',
                author: metadata.author || ''
            }
        };
    }
}

// Global blog renderer instance
window.blogRenderer = new BlogRenderer();

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

class HorizontalTimelineParser {
    constructor() {
        this.timelineData = [];
        this.activeCard = null;
    }

    async loadTimeline() {
        try {
            // Check if journey data is available from Firebase (global portfolioDetails)
            if (window.portfolioDetails && window.portfolioDetails.journey) {
                console.log('Loading timeline from Firebase data, entries:', window.portfolioDetails.journey.length);
                this.timelineData = window.portfolioDetails.journey;
                console.log('Timeline data loaded:', this.timelineData);
                return this.timelineData;
            }

            // Fallback to markdown file if Firebase data not available
            console.log('Fallback: Loading timeline from markdown file');
            console.log('portfolioDetails available:', !!window.portfolioDetails);
            console.log('journey available:', !!(window.portfolioDetails && window.portfolioDetails.journey));

            const response = await fetch('timeline.md');
            const markdown = await response.text();
            this.timelineData = this.parseTimeline(markdown);
            return this.timelineData;
        } catch (error) {
            console.error('Error loading timeline:', error);
            return [];
        }
    }

    parseTimeline(markdown) {
        const entries = [];
        const sections = markdown.split('---').filter(section => section.trim());

        sections.forEach(section => {
            const lines = section.trim().split('\n');
            const entry = {};
            let currentSection = '';
            let content = '';

            // Initialize sections array to store dynamic sections
            entry.sections = [];

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();

                if (line.startsWith('## ')) {
                    entry.year = line.replace('## ', '');
                } else if (line.startsWith('**Duration:**')) {
                    entry.duration = line.replace('**Duration:**', '').trim();
                } else if (line.startsWith('**Title:**')) {
                    entry.title = line.replace('**Title:**', '').trim();
                } else if (line.startsWith('**Subtitle:**')) {
                    entry.subtitle = line.replace('**Subtitle:**', '').trim();
                } else if (line.startsWith('**Summary:**')) {
                    entry.summary = line.replace('**Summary:**', '').trim();
                } else if (line.startsWith('**Image:**')) {
                    // Save current section before processing image
                    if (content.trim() && currentSection) {
                        entry.sections.push({
                            title: this.formatSectionTitle(currentSection),
                            content: content.trim(),
                            type: this.getSectionType(content.trim())
                        });
                    }
                    entry.image = line.replace('**Image:**', '').trim();
                    currentSection = '';
                    content = '';
                } else if (line.startsWith('**') && line.endsWith(':**')) {
                    // Save previous section if exists
                    if (content.trim() && currentSection) {
                        entry.sections.push({
                            title: this.formatSectionTitle(currentSection),
                            content: content.trim(),
                            type: this.getSectionType(content.trim())
                        });
                    }
                    // Start new section
                    currentSection = line.replace(/\*\*/g, '').replace(':', '');
                    content = '';
                } else if (line.startsWith('- ') && currentSection) {
                    content += line + '\n';
                } else if (!line.startsWith('**') && line !== '' && currentSection) {
                    content += line + ' ';
                }
            }

            // Save the last section
            if (content.trim() && currentSection) {
                entry.sections.push({
                    title: this.formatSectionTitle(currentSection),
                    content: content.trim(),
                    type: this.getSectionType(content.trim())
                });
            }

            // Only add entries that have a year and at least one section, or have basic info
            if (entry.year && (entry.sections.length > 0 || entry.title || entry.summary)) {
                // If no sections but has title/summary, create a default section
                if (entry.sections.length === 0 && (entry.title || entry.summary)) {
                    entry.sections.push({
                        title: 'Overview',
                        content: entry.summary || entry.title || 'No additional details available.',
                        type: 'paragraph'
                    });
                }
                entries.push(entry);
            }
        });

        return entries;
    }

    formatSectionTitle(sectionKey) {
        // Convert camelCase or other formats to proper titles
        return sectionKey
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    }

    getSectionType(content) {
        // Determine if content is a list or paragraph
        if (!content || content.trim() === '') {
            return 'paragraph';
        }
        return content.includes('- ') ? 'list' : 'paragraph';
    }

    parseMarkdown(text) {
        if (!text) return '';

        // Parse basic markdown formatting (order matters!)
        return text
            // Code first to avoid conflicts: `text`
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            // Bold text: **text** or __text__
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/__([^_]+)__/g, '<strong>$1</strong>')
            // Italic text: *text* or _text_ (single chars, not already processed)
            .replace(/\*([^*]+)\*/g, '<em>$1</em>')
            .replace(/_([^_]+)_/g, '<em>$1</em>')
            // Line breaks
            .replace(/\n/g, '<br>');
    }

    renderTimeline() {
        console.log('renderTimeline called');
        const container = document.querySelector('.timeline-container');
        if (!container) {
            console.error('Timeline container not found');
            return;
        }

        console.log('Timeline container found, rendering', this.timelineData.length, 'entries');
        container.innerHTML = '';

        this.timelineData.forEach((entry, index) => {
            console.log('Rendering entry:', entry.year, entry.title);
            const cardWrapper = this.createTimelineCardWrapper(entry, index);
            container.appendChild(cardWrapper);
        });

        console.log('Timeline cards rendered, equalizing heights...');
        // Equalize card heights after rendering
        setTimeout(() => {
            this.equalizeCardHeights();
        }, 100);
    }

    equalizeCardHeights() {
        const cards = document.querySelectorAll('.timeline-main-card');
        if (cards.length === 0) return;

        // Reset heights first
        cards.forEach(card => {
            card.style.height = 'auto';
        });

        // Find the maximum height
        let maxHeight = 0;
        cards.forEach(card => {
            const cardHeight = card.offsetHeight;
            if (cardHeight > maxHeight) {
                maxHeight = cardHeight;
            }
        });

        // Apply the maximum height to all cards
        cards.forEach(card => {
            card.style.height = maxHeight + 'px';
        });
    }

    createTimelineCardWrapper(entry, index) {
        const wrapper = document.createElement('div');
        wrapper.className = 'timeline-card-wrapper';
        wrapper.dataset.index = index;

        const mainCard = this.createMainCard(entry);
        const expandedPanel = this.createExpandedPanel(entry);

        wrapper.appendChild(mainCard);
        wrapper.appendChild(expandedPanel);

        return wrapper;
    }

    createMainCard(entry) {
        console.log('Creating main card for entry:', entry);
        console.log('Entry year:', entry.year);
        console.log('Entry title:', entry.title);
        console.log('Entry subtitle:', entry.subtitle);
        console.log('Entry summary:', entry.summary);

        const card = document.createElement('div');
        card.className = 'timeline-main-card';
        // Force visibility and dimensions for debugging

        const yearBadge = document.createElement('div');
        yearBadge.className = 'timeline-year-badge';
        yearBadge.textContent = entry.year || 'No Year';
        // Force visibility for debugging
        yearBadge.style.color = '#ffffff';
        yearBadge.style.fontSize = '1.2rem';
        yearBadge.style.fontWeight = 'bold';
        console.log('Year badge text:', yearBadge.textContent);

        const duration = document.createElement('div');
        duration.className = 'timeline-duration';
        duration.textContent = entry.duration || '';
        // Force visibility for debugging
        duration.style.color = '#4a90ff';
        duration.style.fontSize = '0.85rem';
        console.log('Duration text:', duration.textContent);

        const title = document.createElement('h3');
        title.className = 'timeline-title';
        const titleText = this.parseMarkdown(entry.title || 'Untitled');
        title.innerHTML = titleText;
        // Force visibility for debugging
        title.style.color = '#ffffff';
        title.style.fontSize = '1.4rem';
        console.log('Title HTML:', titleText);

        const subtitle = document.createElement('h4');
        subtitle.className = 'timeline-subtitle';
        const subtitleText = this.parseMarkdown(entry.subtitle || '');
        subtitle.innerHTML = subtitleText;
        // Force visibility for debugging
        subtitle.style.color = '#4a90ff';
        subtitle.style.fontSize = '1rem';
        console.log('Subtitle HTML:', subtitleText);

        const summary = document.createElement('p');
        summary.className = 'timeline-summary';
        const summaryText = this.parseMarkdown(entry.summary || 'No summary available.');
        summary.innerHTML = summaryText;
        // Force visibility for debugging
        summary.style.color = '#e0e8ff';
        summary.style.fontSize = '0.9rem';
        console.log('Summary HTML:', summaryText);

        const readButton = document.createElement('button');
        readButton.className = 'timeline-read-button';
        readButton.innerHTML = `
            <span>Read More</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 18l6-6-6-6"/>
            </svg>
        `;

        readButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleExpansion(card.parentElement);
        });

        card.appendChild(yearBadge);
        card.appendChild(duration);
        card.appendChild(title);
        card.appendChild(subtitle);
        card.appendChild(summary);
        card.appendChild(readButton);

        return card;
    }

    createExpandedPanel(entry) {
        const panel = document.createElement('div');
        panel.className = 'timeline-expanded-panel';

        const closeButton = document.createElement('button');
        closeButton.className = 'timeline-close-button';
        closeButton.innerHTML = '✕';
        closeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.collapsePanel(panel.parentElement);
        });

        const contentGrid = document.createElement('div');
        contentGrid.className = 'timeline-content-grid';

        // Determine number of sections (including image if present) - Max 3 columns
        const numSections = entry.sections.length;
        const hasImage = !!entry.image;
        const totalColumns = Math.min(numSections + (hasImage ? 1 : 0), 3); // Max 3 columns

        // Set dynamic grid columns based on actual content
        if (totalColumns === 1) {
            contentGrid.style.gridTemplateColumns = '1fr';
        } else if (totalColumns === 2) {
            contentGrid.style.gridTemplateColumns = '1fr 1fr';
        } else {
            contentGrid.style.gridTemplateColumns = '1fr 1fr 1fr';
        }

        // Create sections dynamically
        if (entry.sections && Array.isArray(entry.sections)) {
            entry.sections.forEach((section, index) => {
                const sectionDiv = document.createElement('div');
                sectionDiv.className = 'timeline-section';

                const sectionTitle = document.createElement('h4');
                sectionTitle.textContent = section.title;
                sectionTitle.className = 'timeline-section-title';

                if (section.type === 'list') {
                    const list = document.createElement('ul');
                    list.className = 'timeline-section-list';

                    const items = section.content.split('\n').filter(item => item.trim().startsWith('- '));
                    if (items.length > 0) {
                        items.forEach(item => {
                            const li = document.createElement('li');
                            li.innerHTML = this.parseMarkdown(item.replace('- ', ''));
                            list.appendChild(li);
                        });

                        sectionDiv.appendChild(sectionTitle);
                        sectionDiv.appendChild(list);
                    } else {
                        // Fallback to paragraph if no list items found
                        const content = document.createElement('p');
                        content.innerHTML = this.parseMarkdown(section.content || 'No content available.');
                        content.className = 'timeline-section-content';

                        sectionDiv.appendChild(sectionTitle);
                        sectionDiv.appendChild(content);
                    }
                } else {
                    const content = document.createElement('p');
                    content.innerHTML = this.parseMarkdown(section.content || 'No content available.');
                    content.className = 'timeline-section-content';

                    sectionDiv.appendChild(sectionTitle);
                    sectionDiv.appendChild(content);
                }

                contentGrid.appendChild(sectionDiv);
            });
        } else {
            console.warn('No sections found for entry:', entry.year);
            // Create a default section if no sections exist
            const defaultSection = document.createElement('div');
            defaultSection.className = 'timeline-section';
            defaultSection.innerHTML = '<h4>Overview</h4><p>No additional details available.</p>';
            contentGrid.appendChild(defaultSection);
        }

        // Add image as a separate column if it exists
        if (entry.image) {
            const imageSection = document.createElement('div');
            imageSection.className = 'timeline-image-section';

            const image = document.createElement('img');
            image.src = entry.image;
            image.alt = `${entry.title} - ${entry.year}`;
            image.className = 'timeline-showcase-image';
            image.loading = 'lazy';

            imageSection.appendChild(image);
            contentGrid.appendChild(imageSection);
        }

        panel.appendChild(closeButton);
        panel.appendChild(contentGrid);

        return panel;
    }

    toggleExpansion(wrapper) {
        const isExpanded = wrapper.classList.contains('expanded');

        if (isExpanded) {
            this.collapsePanel(wrapper);
        } else {
            if (this.activeCard && this.activeCard !== wrapper) {
                this.collapsePanel(this.activeCard);
                setTimeout(() => {
                    this.expandPanel(wrapper);
                }, 200);
            } else {
                this.expandPanel(wrapper);
            }
        }
    }

    expandPanel(wrapper) {
        wrapper.classList.add('expanding');
        this.activeCard = wrapper;

        this.updateCardPositions(wrapper);

        const button = wrapper.querySelector('.timeline-read-button span');
        if (button) button.textContent = 'Close';

        setTimeout(() => {
            wrapper.classList.add('expanded');
            wrapper.classList.remove('expanding');

            setTimeout(() => {
                this.scrollToExpandedCard(wrapper);
            }, 300);
        }, 50);
    }

    collapsePanel(wrapper) {
        if (!wrapper) return;

        wrapper.classList.add('collapsing');
        wrapper.classList.remove('expanded');

        const button = wrapper.querySelector('.timeline-read-button span');
        if (button) button.textContent = 'Read More';

        this.resetCardPositions();

        setTimeout(() => {
            wrapper.classList.remove('collapsing');
            if (this.activeCard === wrapper) {
                this.activeCard = null;
            }
            // Re-equalize heights after collapse
            this.equalizeCardHeights();
        }, 500);
    }

    updateCardPositions(expandedWrapper) {
        const container = document.querySelector('.timeline-container');
        const allWrappers = container.querySelectorAll('.timeline-card-wrapper');
        const expandedIndex = Array.from(allWrappers).indexOf(expandedWrapper);

        // Determine shift distance based on screen size
        const isExtraSmall = window.innerWidth <= 360;
        const isMobile = window.innerWidth <= 480;
        const isTablet = window.innerWidth <= 768;

        let shiftDistance;
        if (isExtraSmall) {
            shiftDistance = '320px';
        } else if (isMobile) {
            shiftDistance = '340px';
        } else if (isTablet) {
            shiftDistance = '420px';
        } else {
            shiftDistance = '840px';
        }

        allWrappers.forEach((wrapper, index) => {
            if (index > expandedIndex) {
                wrapper.style.transform = `translateX(${shiftDistance})`;
                wrapper.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            } else {
                wrapper.style.transform = 'translateX(0)';
                wrapper.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            }
        });
    }

    resetCardPositions() {
        const container = document.querySelector('.timeline-container');
        const allWrappers = container.querySelectorAll('.timeline-card-wrapper');

        allWrappers.forEach(wrapper => {
            wrapper.style.transform = 'translateX(0)';
            wrapper.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        });
    }

    scrollToExpandedCard(wrapper) {
        const container = document.querySelector('.timeline-container');
        const containerRect = container.getBoundingClientRect();
        const wrapperRect = wrapper.getBoundingClientRect();

        const scrollLeft = wrapper.offsetLeft - (containerRect.width / 2) + (wrapperRect.width / 2);

        container.scrollTo({
            left: Math.max(0, scrollLeft),
            behavior: 'smooth'
        });
    }
}

// Timeline will be initialized from script.js after Firebase data is loaded
// No automatic initialization here to avoid race conditions

window.HorizontalTimelineParser = HorizontalTimelineParser;