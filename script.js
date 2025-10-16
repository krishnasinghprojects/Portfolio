const firebaseConfig = {
    apiKey: "AIzaSyDzyjLVHhGE5NbDsuaHhhZ4tdvrUgEJt3E",
    authDomain: "krishnasinghportfolio.firebaseapp.com",
    projectId: "krishnasinghportfolio",
    storageBucket: "krishnasinghportfolio.firebasestorage.app",
    messagingSenderId: "811580744649",
    appId: "1:811580744649:web:44475b391b166b14fafe18",
    measurementId: "G-THQRRDJSR0"
};

// 2. Initialize Firebase and get a reference to the database
let db;
try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    console.log('Firebase initialized successfully');
} catch (error) {
    console.error('Firebase initialization failed:', error);
}



async function loadPortfolioData() {
    try {
        if (!db) {
            throw new Error('Firebase database not initialized');
        }

        console.log('Attempting to load portfolio data from Firebase...');

        // This is the reference to your specific document
        const docRef = db.collection("portfolio").doc("mainDetails");

        // Fetch the document
        const docSnap = await docRef.get();

        // Check if the document exists (use the .exists property)
        if (docSnap.exists) {
            // Get the entire object from the document
            const details = docSnap.data();
            console.log("Portfolio data loaded from Firebase:", details);

            // Now, call your rendering function with the fetched data
            renderPortfolio(details);
        } else {
            console.error("Error: Could not find portfolio data in Firestore!");
            showErrorMessage("Portfolio data not found in database");
        }
    } catch (error) {
        console.error("Error connecting to Firestore:", error);
        showErrorMessage(`Failed to load portfolio data: ${error.message}`);
    }
}

function showErrorMessage(message) {
    const errorContainer = document.createElement('div');
    errorContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background: var(--bgcolor-gradient);
        background-attachment: fixed;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        color: var(--text-color);
        font-family: "Lora", Georgia, serif;
    `;

    errorContainer.innerHTML = `
        <div style="
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            padding: 3rem;
            max-width: 500px;
            width: 90%;
            text-align: center;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3),
                        0 0 20px rgba(74, 144, 255, 0.15),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2),
                        inset 0 -1px 0 rgba(0, 0, 0, 0.1);
            position: relative;
            overflow: hidden;
        ">
            <h1 style="
                font-size: 2rem;
                font-family: 'Young Serif', serif;
                margin-bottom: 1.5rem;
                background: var(--title-texts);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                text-shadow: none;
            ">Error Loading Portfolio</h1>
            
            <p style="
                font-size: 1.1rem;
                line-height: 1.6;
                margin-bottom: 2rem;
                color: var(--text-color);
                opacity: 0.9;
            ">${message}</p>
            
            <button onclick="location.reload()" style="
                font-family: 'Lora', serif;
                font-weight: 600;
                padding: 0.8rem 2rem;
                border-radius: 25px;
                border: none;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(15px);
                -webkit-backdrop-filter: blur(15px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: var(--text-color);
                cursor: pointer;
                font-size: 1rem;
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3),
                            0 0 15px rgba(74, 144, 255, 0.2),
                            inset 0 1px 0 rgba(255, 255, 255, 0.2),
                            inset 0 -1px 0 rgba(0, 0, 0, 0.1);
                position: relative;
                overflow: hidden;
            " onmouseover="
                this.style.transform = 'translateY(-3px) scale(1.02)';
                this.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.4), 0 0 25px rgba(74, 144, 255, 0.5), 0 0 50px rgba(74, 144, 255, 0.3), inset 0 2px 0 rgba(255, 255, 255, 0.3), inset 0 -2px 0 rgba(0, 0, 0, 0.2)';
                this.style.borderColor = 'rgba(255, 255, 255, 0.4)';
            " onmouseout="
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 15px rgba(74, 144, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -1px 0 rgba(0, 0, 0, 0.1)';
                this.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            ">
                🔄 Refresh Page
            </button>
        </div>
    `;

    document.body.innerHTML = '';
    document.body.appendChild(errorContainer);
}

// Global variable to store portfolio details for blog access
let portfolioDetails = null;

// Make sure it's also available on window object
window.portfolioDetails = null;

// Function to load blog content from Firebase
async function loadBlogFromFirebase(projectName) {
    try {
        if (!db) {
            throw new Error('Firebase database not initialized');
        }

        console.log(`Loading blog content for project: ${projectName}`);

        // First, try to get blog content from the main portfolio details if available
        if (portfolioDetails && portfolioDetails.blogs) {
            const blogKey = projectName.toLowerCase().replace(/\s+/g, '-');
            if (portfolioDetails.blogs[blogKey]) {
                console.log(`Blog content found in main details for ${projectName}`);
                return portfolioDetails.blogs[blogKey];
            }
        }

        // Fallback: Try to load from separate blogs collection
        const blogRef = db.collection("blogs").doc(projectName.toLowerCase().replace(/\s+/g, '-'));

        // Fetch the blog document
        const blogSnap = await blogRef.get();

        if (blogSnap.exists) {
            const blogData = blogSnap.data();
            console.log(`Blog content loaded from separate collection for ${projectName}:`, blogData);
            return blogData;
        } else {
            console.log(`No blog content found for project: ${projectName}`);
            return null;
        }
    } catch (error) {
        console.error('Error loading blog from Firebase:', error);
        return null;
    }
}

// Use the existing MarkdownParser from renderingEngine.js
function formatBlogContent(content) {
    if (!content) return '<p>No content available.</p>';

    // If content is already HTML (contains HTML tags), return as is
    if (content.includes('<') && content.includes('>')) {
        console.log('Content appears to be HTML, returning as is');
        return content;
    }

    // Remove any remaining frontmatter that might be in the content
    let cleanContent = content;

    // Debug: Log the first 200 characters of content
    console.log('Original content preview:', content.substring(0, 200));

    // Remove frontmatter if it exists (between --- markers)
    const frontmatterRegex = /^---\s*\n[\s\S]*?\n---\s*\n?/;
    if (frontmatterRegex.test(cleanContent)) {
        cleanContent = cleanContent.replace(frontmatterRegex, '');
        console.log('Removed frontmatter from content');
    }

    // More aggressive frontmatter removal - remove any lines that start with frontmatter keys
    cleanContent = cleanContent.replace(/^(title|subtitle|author|date):\s*.*$/gm, '');

    // Remove any standalone --- lines that might be leftover
    cleanContent = cleanContent.replace(/^---\s*$/gm, '');

    // Remove any loose frontmatter-like lines at the beginning
    const lines = cleanContent.split('\n');
    let startIndex = 0;

    // Skip empty lines and frontmatter-like lines at the start
    while (startIndex < lines.length) {
        const line = lines[startIndex].trim();
        if (line === '' ||
            line === '---' ||
            line.match(/^(title|subtitle|author|date):\s*.+$/) ||
            line.match(/^---\s*$/)) {
            startIndex++;
        } else {
            break;
        }
    }

    if (startIndex > 0) {
        cleanContent = lines.slice(startIndex).join('\n');
        console.log('Removed loose frontmatter lines');
    }

    // Clean up multiple consecutive newlines
    cleanContent = cleanContent.replace(/\n{3,}/g, '\n\n').trim();

    // Debug: Log the first 200 characters of cleaned content
    console.log('Cleaned content preview:', cleanContent.substring(0, 200));

    // Use the existing MarkdownParser class from renderingEngine.js
    if (window.blogRenderer && window.blogRenderer.parser) {
        console.log('Using existing MarkdownParser from renderingEngine.js');
        return window.blogRenderer.parser.parse(cleanContent);
    } else {
        console.error('MarkdownParser not available, falling back to simple formatting');
        // Simple fallback - just wrap in paragraphs
        return cleanContent.split('\n\n').map(p => p.trim() ? `<p>${p.replace(/\n/g, '<br>')}</p>` : '').join('\n');
    }
}

// Blog Post Functions - Updated for Firebase
async function openBlogPost(project) {
    const modal = document.getElementById('blogModal');
    const title = document.getElementById('blogTitle');
    const subtitle = document.getElementById('blogSubtitle');
    const content = document.getElementById('blogContent');

    // Close mobile menu if open
    const nav = document.querySelector('.nav-links');
    const burger = document.querySelector('.burger');
    if (nav && nav.classList.contains('nav-active')) {
        nav.classList.remove('nav-active');
        burger.classList.remove('burger-active');
        document.body.classList.remove('nav-open');
        document.querySelectorAll('.nav-links li').forEach(link => link.style.animation = '');
    }

    // Show loading state
    title.textContent = 'Loading...';
    subtitle.textContent = '';
    content.innerHTML = '<p>Loading blog content...</p>';

    // Show modal with animation
    modal.style.display = 'block';
    modal.classList.remove('hide');
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);

    // Store current scroll position
    const scrollY = window.scrollY;
    document.body.dataset.scrollY = scrollY;

    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');

    try {
        // Load blog content from Firebase data
        const blogData = await loadBlogFromFirebase(project.name);

        if (blogData && blogData.content) {
            // Create metadata object similar to what the existing system expects
            const metadata = {
                title: blogData.title || project.name,
                subtitle: blogData.subtitle || '',
                date: blogData.date || '',
                author: blogData.author || ''
            };

            // Update modal content with Firebase data
            title.textContent = metadata.title;
            subtitle.textContent = metadata.subtitle;

            // Use the existing markdown parser to format content
            const formattedContent = formatBlogContent(blogData.content);
            content.innerHTML = formattedContent;
        } else {
            throw new Error('Blog content not found in Firebase');
        }
    } catch (error) {
        console.error('Error loading blog content:', error);
        title.textContent = project.name;
        subtitle.textContent = 'Blog Post';
        content.innerHTML = `
            <p>Sorry, the blog content for this project is not available yet.</p>
            <p>Please check back later or visit the project directly:</p>
            <a href="${project.url}" target="_blank" class="cta-button">View Project</a>
        `;
    }
}

// Safety function to restore scrolling
function ensureScrollingRestored() {
    const modal = document.getElementById('blogModal');
    if (!modal || modal.style.display === 'none' || !modal.classList.contains('show')) {
        forceRestoreScrolling();
    }
}

// Force restore scrolling function
function forceRestoreScrolling() {
    // Restore scrolling
    document.body.style.overflow = '';
    document.body.classList.remove('modal-open');

    // Restore scroll position
    const scrollY = document.body.dataset.scrollY;
    if (scrollY) {
        window.scrollTo(0, parseInt(scrollY));
        delete document.body.dataset.scrollY;
    }
}

function closeBlogModal() {
    const modal = document.getElementById('blogModal');

    modal.classList.remove('show');
    modal.classList.add('hide');

    setTimeout(() => {
        modal.style.display = 'none';
        modal.classList.remove('hide');
        // Force restore scrolling after animation completes
        forceRestoreScrolling();
    }, 400); // Match the CSS transition duration
}

// Function to render all portfolio sections with the loaded data
function renderPortfolio(details) {
    if (!details) {
        console.error('No details provided to renderPortfolio');
        return;
    }

    // Store details globally for blog access
    portfolioDetails = details;
    window.portfolioDetails = details;

    console.log('Global portfolioDetails set:', !!window.portfolioDetails);
    console.log('Journey data available globally:', !!(window.portfolioDetails && window.portfolioDetails.journey));

    console.log('Starting to render portfolio with data:', details);
    console.log('Available data keys:', Object.keys(details));

    // Check if blogs are included in the main data
    if (details.blogs) {
        console.log('Blog data found in main details:', Object.keys(details.blogs));
    }

    // Check if journey data is included and initialize timeline
    if (details.journey) {
        console.log('Journey data found in main details:', details.journey.length, 'entries');
        // Initialize timeline after portfolio data is loaded with a small delay to ensure global variable is set
        setTimeout(() => {
            initializeTimeline();
        }, 100);
    }





    // -- Title Details --
    const titleElement = document.getElementById("titleTop");
    if (titleElement) titleElement.innerText = details.titleTop;

    // -- Navbar Details --
    const navbarNameElement = document.getElementById("navbar_name");
    const nameAbbreviationElement = document.getElementById("name_abbrivation");
    if (navbarNameElement) navbarNameElement.innerText = details.navbar.navbar_name;
    if (nameAbbreviationElement) nameAbbreviationElement.innerText = details.navbar.name_abbrivation;

    // Set Resume Link
    const resumeLink = document.getElementById("resume_link");
    if (resumeLink) {
        resumeLink.innerText = details.navbar.resume.text;
        resumeLink.href = details.navbar.resume.url;
    }

    // -- About Details --
    const greetingElement = document.getElementById("greeting");
    const titleAboutElement = document.getElementById("title");
    const descriptionElement = document.getElementById("description");
    if (greetingElement) greetingElement.innerText = details.about.greeting;
    if (titleAboutElement) titleAboutElement.innerText = details.about.title;
    if (descriptionElement) descriptionElement.innerText = details.about.description;

    // Set Download CV Link
    const downloadCVLink = document.getElementById("download_cv");
    if (downloadCVLink) {
        downloadCVLink.innerText = details.about.downloadCV.text;
        downloadCVLink.href = details.about.downloadCV.url;
    }

    // -- Dynamic Project Cards --
    const projectsContainer = document.querySelector(".projects-container");
    if (!projectsContainer) {
        console.error('Projects container not found');
        return;
    }
    projectsContainer.innerHTML = ""; // Clear existing content

    details.projects.forEach((project) => {
        // Create the card container
        const projectCard = document.createElement("div");
        projectCard.classList.add("project-card");
        projectCard.style.cursor = "pointer";

        // Project Title
        const projectTitle = document.createElement("h1");
        projectTitle.innerText = project.name;
        projectCard.appendChild(projectTitle);

        // Project image (clickable for blog post)
        const projectImageDiv = document.createElement("div");
        projectImageDiv.classList.add("project-image");

        const projectImage = document.createElement("img");
        projectImage.src = project.imgSrc;
        projectImage.alt = project.imgAlt;

        projectImageDiv.appendChild(projectImage);
        projectCard.appendChild(projectImageDiv);

        // Technology logos section
        const projectTechDiv = document.createElement("div");
        projectTechDiv.classList.add("project-tech");

        const techLogosDiv = document.createElement("div");
        techLogosDiv.classList.add("tech-logos");

        project.tech.forEach((tech) => {
            const techImg = document.createElement("img");
            techImg.src = tech.imgSrc;
            techImg.alt = tech.alt;
            techImg.classList.add("tech-logo");
            techLogosDiv.appendChild(techImg);
        });

        projectTechDiv.appendChild(techLogosDiv);
        projectCard.appendChild(projectTechDiv);

        // Project description
        const projectDesc = document.createElement("p");
        projectDesc.classList.add("project-desc");
        projectDesc.innerText = project.description;
        projectCard.appendChild(projectDesc);

        // Add blog indicator for all projects (will try to load markdown)
        const blogIndicator = document.createElement("div");
        blogIndicator.classList.add("blog-indicator");
        blogIndicator.innerHTML = "Read More";
        projectCard.appendChild(blogIndicator);

        // Add click event for blog post (always try to load markdown)
        projectCard.addEventListener('click', () => {
            openBlogPost(project);
        });

        // Append the card to the projects container
        projectsContainer.appendChild(projectCard);
    });

    // -- Dynamic Certificates Section --
    const certificatesContainer = document.querySelector(".certificates-container");
    if (certificatesContainer) {
        certificatesContainer.innerHTML = "";

        // Create rows for certificates layout
        const certFirstRow = document.createElement("div");
        certFirstRow.classList.add("certificates-row", "certificates-row-first");

        const certSecondRow = document.createElement("div");
        certSecondRow.classList.add("certificates-row", "certificates-row-second");

        // Get all certificate categories and distribute them between rows
        const certCategories = Object.keys(details.certificates);

        certCategories.forEach((category, index) => {
            // Create category container
            const categoryContainer = document.createElement("div");
            categoryContainer.classList.add("certificate-category");

            // Create category title
            const categoryTitle = document.createElement("h2");
            categoryTitle.classList.add("certificate-category-title");
            categoryTitle.innerText = category;
            categoryContainer.appendChild(categoryTitle);

            // Create certificates grid for this category
            const certificatesGrid = document.createElement("div");
            certificatesGrid.classList.add("certificates-grid");

            // Add certificates to the grid
            details.certificates[category].forEach((certificate) => {
                const certImage = document.createElement("img");
                certImage.src = certificate.imgSrc;
                certImage.alt = certificate.imgAlt || "Certificate";
                certImage.classList.add("certificate-image");
                certificatesGrid.appendChild(certImage);
            });

            categoryContainer.appendChild(certificatesGrid);

            // First 2 categories go to first row, remaining go to second row
            if (index < 2) {
                certFirstRow.appendChild(categoryContainer);
            } else {
                certSecondRow.appendChild(categoryContainer);
            }
        });

        // Append rows to the main container
        certificatesContainer.appendChild(certFirstRow);
        certificatesContainer.appendChild(certSecondRow);
    }
    // -- Dynamic Badges Section --
    const badgesContainer = document.querySelector(".badge-container");
    if (badgesContainer) {
        badgesContainer.innerHTML = "";

        // Create a single row for badges (since there are fewer categories)
        const badgesRow = document.createElement("div");
        badgesRow.classList.add("badges-row");

        // Get all badge categories
        const badgeCategories = Object.keys(details.badges);

        badgeCategories.forEach((category) => {
            // Create category container
            const categoryContainer = document.createElement("div");
            categoryContainer.classList.add("badge-category");

            // Create category title
            const categoryTitle = document.createElement("h2");
            categoryTitle.classList.add("badge-category-title");
            categoryTitle.innerText = category;
            categoryContainer.appendChild(categoryTitle);

            // Create badges grid for this category
            const badgesGrid = document.createElement("div");
            badgesGrid.classList.add("badges-grid");

            // Add badges to the grid
            details.badges[category].forEach((badge) => {
                const badgeImage = document.createElement("img");
                badgeImage.src = badge.imgSrc;
                badgeImage.alt = badge.imgAlt || "Badge";
                badgeImage.classList.add("badge");
                badgesGrid.appendChild(badgeImage);
            });

            categoryContainer.appendChild(badgesGrid);
            badgesRow.appendChild(categoryContainer);
        });

        // Append row to the main container
        badgesContainer.appendChild(badgesRow);
    }



    // -- Dynamic Social Links --
    const socialLinksElement = document.getElementById("social_links");
    if (socialLinksElement) {
        socialLinksElement.innerHTML = "";
        details.social.forEach((social) => {
            const a = document.createElement("a");
            a.href = social.url;
            a.target = "_blank";

            const img = document.createElement("img");
            img.src = social.imgSrc;
            img.alt = social.alt;
            img.width = social.width;

            a.appendChild(img);
            socialLinksElement.appendChild(a);
        });
    }

    // -- Dynamic Skills Section --
    const skillsContainer = document.getElementById("skills_container");
    if (skillsContainer) {
        skillsContainer.innerHTML = "";

        // Create two rows for the layout
        const firstRow = document.createElement("div");
        firstRow.classList.add("skills-row", "skills-row-first");

        const secondRow = document.createElement("div");
        secondRow.classList.add("skills-row", "skills-row-second");

        // Get all categories and sort them by number of skills (descending order)
        const categories = Object.keys(details.skills).sort((a, b) => {
            return details.skills[b].length - details.skills[a].length;
        });

        console.log('Skills categories ordered by count:', categories.map(cat => `${cat}: ${details.skills[cat].length}`));

        categories.forEach((category, index) => {
            // Create category container
            const categoryContainer = document.createElement("div");
            categoryContainer.classList.add("skill-category");

            // Create category title
            const categoryTitle = document.createElement("h2");
            categoryTitle.classList.add("skill-category-title");
            categoryTitle.innerText = category;
            categoryContainer.appendChild(categoryTitle);

            // Create skills grid for this category
            const skillsGrid = document.createElement("div");
            skillsGrid.classList.add("skills-grid");

            // Add skills to the grid
            details.skills[category].forEach((skill) => {
                const skillCard = document.createElement("div");
                skillCard.classList.add("skill-card");

                const img = document.createElement("img");
                img.src = skill.imgSrc;
                img.alt = skill.alt;
                img.style.borderRadius = "5px";

                const p = document.createElement("p");
                p.innerText = skill.name;

                skillCard.appendChild(img);
                skillCard.appendChild(p);
                skillsGrid.appendChild(skillCard);
            });

            categoryContainer.appendChild(skillsGrid);

            // First 3 categories go to first row, remaining go to second row
            if (index < 3) {
                firstRow.appendChild(categoryContainer);
            } else {
                secondRow.appendChild(categoryContainer);
            }
        });

        // Append rows to the main container
        skillsContainer.appendChild(firstRow);
        skillsContainer.appendChild(secondRow);
    }


    // Function to Create Timeline Elements
    function createEmptyDiv() {
        const div = document.createElement('div');
        div.className = 'timeline-empty';
        return div;
    }

    function createMiddleDiv() {
        const middleDiv = document.createElement('div');
        middleDiv.className = 'timeline-middle';
        const circleDiv = document.createElement('div');
        circleDiv.className = 'timeline-circle';
        middleDiv.appendChild(circleDiv);
        return middleDiv;
    }

    function createContentDiv(edu) {
        const contentDiv = document.createElement('div');
        contentDiv.className = 'timeline-component timeline-content';
        contentDiv.innerHTML = `
      <h3>${edu.period}</h3>
      <h1>${edu.degree}</h1>
      <p>${edu.institution}</p>
      <p>${edu.percentage ? 'Percentage: ' + edu.percentage + '%' : ''}</p>
    `;
        return contentDiv;
    }

    // Populate the Timeline
    const timeline = document.querySelector('.timeline');
    if (timeline) {
        timeline.innerHTML = ''; // Clear existing content

        details.education.forEach((edu, index) => {
            if (index % 2 === 0) {
                // Right-aligned entry (empty, middle, content)
                timeline.appendChild(createEmptyDiv());
                timeline.appendChild(createMiddleDiv());
                timeline.appendChild(createContentDiv(edu));
            } else {
                // Left-aligned entry (content, middle, empty)
                timeline.appendChild(createContentDiv(edu));
                timeline.appendChild(createMiddleDiv());
                timeline.appendChild(createEmptyDiv());
            }
        });

        // Add Closing Elements to End the Timeline
        const middleSpacer = document.createElement('div');
        middleSpacer.className = 'timeline-middle';
        timeline.appendChild(middleSpacer);

        const middleEnd = document.createElement('div');
        middleEnd.className = 'timeline-middle';
        const endLine = document.createElement('div');
        endLine.className = 'timeline-end';
        middleEnd.appendChild(endLine);
        timeline.appendChild(middleEnd);

        timeline.appendChild(createEmptyDiv());
    }


    // Generate Contact Section Dynamically
    const contactSection = document.getElementById("contact");
    if (contactSection) {
        contactSection.innerHTML = `
          <div class="contact-container">
            <h1>${details.contact.title}</h1>
            ${details.contact.info.map(item => `
              <p>
                <i class="${item.icon || ''}"></i>
                ${item.url ? `
                  <a href="${item.url}" ${item.url.includes('http') ? 'target="_blank"' : ''}>
                    ${item.text}
                  </a>
                ` : item.text}
              </p>
            `).join('')}
            <a class="contact-btn" href="${details.contact.button.url}">
              ${details.contact.button.text}
            </a>
          </div>
        `;
    }

    const footer = document.querySelector('footer');
    if (footer) {
        footer.innerHTML = `<p>${details.footer.copyrightText}</p>`;
    }

    const projectLinksElement = document.getElementById("project_links");
    if (projectLinksElement) {
        projectLinksElement.innerHTML = "";
        details.projects.forEach(project => {
            const li = document.createElement("ul");
            const a = document.createElement("a");
            a.href = project.url;
            a.target = "_blank";
            a.innerText = project.name;
            li.appendChild(a);
            projectLinksElement.appendChild(li);
        });
    }
}

// Initialize Firebase and load portfolio data when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded, checking Firebase availability...');

    // Check if Firebase is loaded
    if (typeof firebase === 'undefined') {
        console.error('Firebase is not loaded. Make sure Firebase scripts are included.');
        showErrorMessage('Firebase library not loaded. Please check your internet connection.');
        return;
    }

    console.log('Firebase available, loading portfolio data...');
    loadPortfolioData();

    // Close modal functionality
    const modal = document.getElementById('blogModal');
    const closeBtn = document.querySelector('.blog-close');

    if (closeBtn) {
        // Close when clicking the X button
        closeBtn.addEventListener('click', function () {
            closeBlogModal();
        });
    }

    if (modal) {
        // Close when clicking outside the modal
        window.addEventListener('click', function (event) {
            if (event.target === modal) {
                closeBlogModal();
            }
        });
    }

    // Close with Escape key
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && modal && modal.classList.contains('show')) {
            closeBlogModal();
        }
    });

    // Safety check to restore scrolling on window focus
    window.addEventListener('focus', ensureScrollingRestored);

    // Safety check on page visibility change
    document.addEventListener('visibilitychange', function () {
        if (!document.hidden) {
            ensureScrollingRestored();
        }
    });

    // Emergency scroll restore on any click outside modal when it should be closed
    document.addEventListener('click', function (e) {
        const modal = document.getElementById('blogModal');
        if (modal && modal.style.display === 'none' && document.body.classList.contains('modal-open')) {
            forceRestoreScrolling();
        }
    });
});

// Function to initialize timeline after Firebase data is loaded
async function initializeTimeline() {
    try {
        console.log('initializeTimeline called');
        console.log('portfolioDetails available:', !!window.portfolioDetails);
        console.log('journey data available:', !!(window.portfolioDetails && window.portfolioDetails.journey));

        if (window.portfolioDetails && window.portfolioDetails.journey) {
            console.log('Journey entries count:', window.portfolioDetails.journey.length);
        }

        // Check if timeline parser is available
        if (typeof HorizontalTimelineParser !== 'undefined') {
            console.log('Initializing timeline with Firebase data...');
            const timelineParser = new HorizontalTimelineParser();
            await timelineParser.loadTimeline();
            timelineParser.renderTimeline();

            // Store timeline parser globally for event handlers
            window.timelineParser = timelineParser;

            // Add keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (timelineParser.activeCard && e.key === 'Escape') {
                    timelineParser.collapsePanel(timelineParser.activeCard);
                }
            });

            // Handle window resize
            window.addEventListener('resize', () => {
                if (timelineParser.activeCard) {
                    timelineParser.updateCardPositions(timelineParser.activeCard);
                }
                setTimeout(() => {
                    timelineParser.equalizeCardHeights();
                }, 100);
            });

            console.log('Timeline initialized successfully');
        } else {
            console.error('HorizontalTimelineParser not available');
        }
    } catch (error) {
        console.error('Error initializing timeline:', error);
    }
}

