class HorizontalTimelineParser {
    constructor() {
        this.timelineData = [];
        this.activeCard = null;
    }

    async loadTimeline() {
        try {
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
        const container = document.querySelector('.timeline-container');
        if (!container) return;

        container.innerHTML = '';

        this.timelineData.forEach((entry, index) => {
            const cardWrapper = this.createTimelineCardWrapper(entry, index);
            container.appendChild(cardWrapper);
        });

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
        const card = document.createElement('div');
        card.className = 'timeline-main-card';

        const yearBadge = document.createElement('div');
        yearBadge.className = 'timeline-year-badge';
        yearBadge.textContent = entry.year;

        const duration = document.createElement('div');
        duration.className = 'timeline-duration';
        duration.textContent = entry.duration || '';

        const title = document.createElement('h3');
        title.className = 'timeline-title';
        title.innerHTML = this.parseMarkdown(entry.title || 'Untitled');

        const subtitle = document.createElement('h4');
        subtitle.className = 'timeline-subtitle';
        subtitle.innerHTML = this.parseMarkdown(entry.subtitle || '');

        const summary = document.createElement('p');
        summary.className = 'timeline-summary';
        summary.innerHTML = this.parseMarkdown(entry.summary || 'No summary available.');

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

// Initialize timeline when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    const timelineParser = new HorizontalTimelineParser();
    await timelineParser.loadTimeline();
    timelineParser.renderTimeline();

    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (timelineParser.activeCard && e.key === 'Escape') {
            timelineParser.collapsePanel(timelineParser.activeCard);
        }
    });

    // Handle window resize to adjust card positions and heights
    window.addEventListener('resize', () => {
        if (timelineParser.activeCard) {
            timelineParser.updateCardPositions(timelineParser.activeCard);
        }
        // Re-equalize heights on resize
        setTimeout(() => {
            timelineParser.equalizeCardHeights();
        }, 100);
    });

    // Add touch/swipe support for mobile
    let startX = 0;
    let startY = 0;
    let scrollLeft = 0;
    let isHorizontalSwipe = false;
    const container = document.querySelector('.timeline-container');

    if (container) {
        container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX - container.offsetLeft;
            startY = e.touches[0].pageY;
            scrollLeft = container.scrollLeft;
            isHorizontalSwipe = false;
        });

        container.addEventListener('touchmove', (e) => {
            if (!startX) return;
            
            const x = e.touches[0].pageX - container.offsetLeft;
            const y = e.touches[0].pageY;
            const deltaX = Math.abs(x - startX);
            const deltaY = Math.abs(y - startY);
            
            // Determine if this is a horizontal or vertical swipe
            if (!isHorizontalSwipe && deltaX > 10 && deltaY > 10) {
                // If both deltas are significant, determine primary direction
                isHorizontalSwipe = deltaX > deltaY;
            } else if (!isHorizontalSwipe && deltaX > 10) {
                // Clear horizontal movement
                isHorizontalSwipe = true;
            }
            
            // Only handle horizontal scrolling and prevent default if it's a horizontal swipe
            if (isHorizontalSwipe && deltaX > 5) {
                e.preventDefault();
                const walk = (x - startX) * 2;
                container.scrollLeft = scrollLeft - walk;
            }
            // For vertical swipes or unclear direction, let the browser handle it naturally
        });

        container.addEventListener('touchend', () => {
            startX = 0;
            startY = 0;
            isHorizontalSwipe = false;
        });
    }
});

window.HorizontalTimelineParser = HorizontalTimelineParser;