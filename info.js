const details = {
    // Title Details
    titleTop: "Krishna's Portfolio",

    // Navbar Details
    navbar: {
        navbar_name: "Krishna Singh",
        name_abbrivation: "KS",
        resume: {
            text: "Resume",
            url: "https://drive.google.com/file/d/1xNYfrq1NvDH2FMi1liOlK2Tp_rJn08-b/view",
        },
    },

    // About Details
    about: {
        greeting: "Hi, I'm Krishna Singh",
        title: "Web Developer & Designer",
        description:
            "Engineering student who loves combining coding and design.\nSkilled in front-end development with HTML, CSS, JavaScript, and experienced in programming languages C, Python, and Java.",
        downloadCV: {
            text: "Download CV",
            url: "https://drive.google.com/uc?export=download&id=1xNYfrq1NvDH2FMi1liOlK2Tp_rJn08-b",
        },
    },
    // Project Details
    projects: [
        {
            name: "Portfolio",
            url: "https://krishnasingh1920.github.io/Portfolio/",
            imgSrc: "PortfolioSS.jpg",
            imgAlt: "Portfolio Project",
            tech: [
                { imgSrc: "https://img.icons8.com/?size=100&id=20909&format=png&color=000000", alt: "HTML" },
                { imgSrc: "https://img.icons8.com/?size=100&id=21278&format=png&color=000000", alt: "CSS" },
                { imgSrc: "https://img.icons8.com/?size=100&id=108784&format=png&color=000000", alt: "JavaScript" },
            ],
            description:
                "This portfolio website is designed to showcase my projects, skills, and experiences, all wrapped in a responsive and modern layout.",
        },
        {
            name: "TypeQuest",
            url: "https://krishnasingh1920.github.io/TypeQuest/",
            imgSrc: "TypeQuestSS.jpg",
            imgAlt: "TypeQuest Project",
            tech: [
                { imgSrc: "https://img.icons8.com/?size=100&id=20909&format=png&color=000000", alt: "Jsx" },
                { imgSrc: "https://img.icons8.com/?size=100&id=21278&format=png&color=000000", alt: "CSS" },
                { imgSrc: "https://img.icons8.com/?size=100&id=108784&format=png&color=000000", alt: "JavaScript" },
                { imgSrc: "https://img.icons8.com/?size=100&id=asWSSTBrDlTW&format=png&color=000000", alt: "React" }
            ],
            description: "TypeQuest is an interactive typing app that helps users practice, track WPM, and improve accuracy in a clean and responsive interface."
        },
        {
            name: "PocketBank",
            url: "https://krishnasingh1920.github.io/PocketBank/",
            imgSrc: "PocketBankSS.jpg",
            imgAlt: "PocketBank Project",
            tech: [
                { imgSrc: "https://img.icons8.com/?size=100&id=20909&format=png&color=000000", alt: "HTML" },
                { imgSrc: "https://img.icons8.com/?size=100&id=21278&format=png&color=000000", alt: "CSS" },
                { imgSrc: "https://img.icons8.com/?size=100&id=108784&format=png&color=000000", alt: "JavaScript" },
            ],
            description:
                "PocketBank is a banking application that stores variables in the browser's memory to keep finances managed.",
        },
        {
            name: "Gallery",
            url: "https://krishnasingh1920.github.io/Gallery/",
            imgSrc: "GallerySS.jpg",
            imgAlt: "Gallery Project",
            tech: [
                { imgSrc: "https://img.icons8.com/?size=100&id=20909&format=png&color=000000", alt: "HTML" },
                { imgSrc: "https://img.icons8.com/?size=100&id=21278&format=png&color=000000", alt: "CSS" },
                { imgSrc: "https://img.icons8.com/?size=100&id=108784&format=png&color=000000", alt: "JavaScript" },
            ],
            description:
                "Gallery is a dynamic web application that hosts a collection of images, allowing users to easily navigate and explore the photos.",
        },
        {
            name: "Tic Tac Toe",
            url: "https://krishnasingh1920.github.io/TicTacToe/",
            imgSrc: "TicTacToeSS.jpg",
            imgAlt: "Tic Tac Toe Project",
            tech: [
                { imgSrc: "https://img.icons8.com/?size=100&id=20909&format=png&color=000000", alt: "HTML" },
                { imgSrc: "https://img.icons8.com/?size=100&id=21278&format=png&color=000000", alt: "CSS" },
                { imgSrc: "https://img.icons8.com/?size=100&id=108784&format=png&color=000000", alt: "JavaScript" },
            ],
            description:
                "This classic Tic Tac Toe game features a sleek, modern interface and interactive gameplay.",
        },
        {
            name: "QuickMaze",
            url: "https://krishnasingh1920.github.io/QuickMaze/",
            imgSrc: "QuickMazeSS.jpg",
            imgAlt: "QuickMaze Project",
            tech: [
                { imgSrc: "https://img.icons8.com/?size=100&id=20909&format=png&color=000000", alt: "Jsx" },
                { imgSrc: "https://img.icons8.com/?size=100&id=21278&format=png&color=000000", alt: "CSS" },
                { imgSrc: "https://img.icons8.com/?size=100&id=108784&format=png&color=000000", alt: "JavaScript" },
                { imgSrc: "https://img.icons8.com/?size=100&id=asWSSTBrDlTW&format=png&color=000000", alt: "React" },
                { imgSrc: "https://img.icons8.com/?size=100&id=dJjTWMogzFzg&format=png&color=000000", alt: "Vite" }
            ],
            description: "QuickMaze is a puzzle game where you race through a maze to reach the anchor point. Each move costs score points, making efficiency key."
        },
        {
            name: "Snake",
            url: "https://krishnasingh1920.github.io/Snake/",
            imgSrc: "SnakeSS.jpg",
            imgAlt: "Snake Game Project",
            tech: [
                { imgSrc: "https://img.icons8.com/?size=100&id=20909&format=png&color=000000", alt: "HTML" },
                { imgSrc: "https://img.icons8.com/?size=100&id=21278&format=png&color=000000", alt: "CSS" },
                { imgSrc: "https://img.icons8.com/?size=100&id=108784&format=png&color=000000", alt: "JavaScript" },
            ],
            description:
                "Snake is a game where you control a snake, navigate through the grid, and avoid walls while growing longer with each item you collect.",
        },
    ],
    // Social Links
    social: [
        {
            name: "Chess",
            url: "https://www.chess.com/member/nether_god",
            imgSrc: "https://img.icons8.com/?size=100&id=C5LTcmsc3cr0&format=png&color=000000",
            alt: "Chess",
            width: 40,
        },
        {
            name: "LinkedIn",
            url: "https://www.linkedin.com/in/krishnasingh1920",
            imgSrc: "https://img.icons8.com/?size=100&id=xuvGCOXi8Wyg&format=png&color=000000",
            alt: "LinkedIn",
            width: 40,
        },
        {
            name: "GitHub",
            url: "https://github.com/KrishnaSingh1920",
            imgSrc: "https://img.icons8.com/?size=100&id=62856&format=png&color=000000",
            alt: "GitHub",
            width: 40,
        },
    ],

    // Skills Section
    skills: [
        {
            name: "HTML",
            imgSrc: "https://img.icons8.com/?size=100&id=20909&format=png&color=000000",
            alt: "HTML",
        },
        {
            name: "CSS",
            imgSrc: "https://img.icons8.com/?size=100&id=21278&format=png&color=000000",
            alt: "CSS",
        },
        {
            name: "JavaScript",
            imgSrc: "https://img.icons8.com/?size=100&id=108784&format=png&color=000000",
            alt: "JavaScript",
        },
        {
            name: "Tailwind CSS",
            imgSrc: "https://img.icons8.com/?size=100&id=CIAZz2CYc6Kc&format=png&color=000000",
            alt: "Tailwind CSS",
        },
        {
            name: "React",
            imgSrc: "https://img.icons8.com/?size=100&id=123603&format=png&color=000000",
            alt: "React",
        },
        {
            name: "Vite",
            imgSrc: "https://img.icons8.com/?size=100&id=dJjTWMogzFzg&format=png&color=000000",
            alt: "Vite",
        },
        {
            name: "Python",
            imgSrc: "https://img.icons8.com/?size=100&id=13441&format=png&color=000000",
            alt: "Python",
        },
        {
            name: "C",
            imgSrc: "https://img.icons8.com/?size=100&id=40670&format=png&color=000000",
            alt: "C",
        },
        {
            name: "Java",
            imgSrc: "https://img.icons8.com/?size=100&id=13679&format=png&color=000000",
            alt: "Java",
        },
        {
            name: "Git",
            imgSrc: "https://img.icons8.com/?size=100&id=20906&format=png&color=000000",
            alt: "Git",
        },
        {
            name: "GitHub",
            imgSrc: "https://img.icons8.com/?size=100&id=62856&format=png&color=000000",
            alt: "GitHub",
        },
        {
            name: "Canva",
            imgSrc: "https://img.icons8.com/?size=100&id=iWw83PVcBpLw&format=png&color=000000",
            alt: "Canva",
        },
        {
            name: "MS Word",
            imgSrc: "https://img.icons8.com/?size=100&id=13674&format=png&color=000000",
            alt: "Ms Word",
        },
        {
            name: "MS PowerPoint",
            imgSrc: "https://img.icons8.com/?size=100&id=81726&format=png&color=000000",
            alt: "Ms PowerPoint",
        },
        {
            name: "MS Excel",
            imgSrc: "https://img.icons8.com/?size=100&id=13654&format=png&color=000000",
            alt: "Ms Excel",
        },
    ],

    //Education Details
    education: [
        {
            period: "2024-2028",
            degree: "Bachelor of Technology",
            institution: "Babu Banarasi Das University",
            percentage: null
        },
        {
            period: "2022-2024",
            degree: "Intermediate",
            institution: "City Convent School",
            percentage: 91.4
        },
        {
            period: "2020-2022",
            degree: "High School",
            institution: "City Convent School",
            percentage: 90.4
        },
    ],

    //Contact Details
    contact: {
        title: "Contact Me",
        info: [
            { icon: "fas fa-user", text: "Name: Krishna Singh" },
            { icon: "fas fa-phone-alt", text: "Phone: +91 9026316048" },
            {
                icon: "fas fa-envelope",
                text: "Email: KrishnaSingh",
                url: "mailto:krishnasinghprojects@gmail.com"
            },
            {
                icon: "fab fa-linkedin",
                text: "LinkedIn: KrishnaSingh1920",
                url: "https://www.linkedin.com/in/krishnasingh1920"
            }
        ],
        button: {
            text: "Send an Email",
            url: "mailto:krishnasinghprojects@gmail.com"
        }
    },

    //Footer Details
    footer: {
        copyrightText: `© 2025 Krishna Singh. All Rights Reserved.`
    }
};







// -- Title Details --
document.getElementById("titleTop").innerText = details.titleTop;

// -- Navbar Details --
document.getElementById("navbar_name").innerText = details.navbar.navbar_name;
document.getElementById("name_abbrivation").innerText = details.navbar.name_abbrivation;

// Set Resume Link
const resumeLink = document.getElementById("resume_link");
resumeLink.innerText = details.navbar.resume.text;
resumeLink.href = details.navbar.resume.url;

// -- About Details --
document.getElementById("greeting").innerText = details.about.greeting;
document.getElementById("title").innerText = details.about.title;
document.getElementById("description").innerText = details.about.description;

// Set Download CV Link
const downloadCVLink = document.getElementById("download_cv");
downloadCVLink.innerText = details.about.downloadCV.text;
downloadCVLink.href = details.about.downloadCV.url;

// -- Dynamic Project Cards --
// Ensure your HTML contains a container element with class "projects-container"
const projectsContainer = document.querySelector(".projects-container");
projectsContainer.innerHTML = ""; // Clear existing content



details.projects.forEach((project) => {
    // Create the card container
    const projectCard = document.createElement("div");
    projectCard.classList.add("project-card");

    // Project Title
    const projectTitle = document.createElement("h1");
    projectTitle.innerText = project.name;
    projectCard.appendChild(projectTitle);

    // Project link with image
    const projectLink = document.createElement("a");
    projectLink.href = project.url;
    projectLink.target = "_blank";

    const projectImageDiv = document.createElement("div");
    projectImageDiv.classList.add("project-image");

    const projectImage = document.createElement("img");
    projectImage.src = project.imgSrc;
    projectImage.alt = project.imgAlt;

    projectImageDiv.appendChild(projectImage);
    projectLink.appendChild(projectImageDiv);
    projectCard.appendChild(projectLink);

    // Technology logos section
    const projectTechDiv = document.createElement("div");
    projectTechDiv.classList.add("project-tech");

    const techLogosDiv = document.createElement("div");
    techLogosDiv.classList.add("tech-logos");

    project.tech.forEach((tech) => {
        const techImg = document.createElement("img");
        techImg.src = tech.imgSrc;
        techImg.alt = tech.alt;
        techLogosDiv.appendChild(techImg);
    });

    projectTechDiv.appendChild(techLogosDiv);
    projectCard.appendChild(projectTechDiv);

    // Project description
    const projectDesc = document.createElement("p");
    projectDesc.classList.add("project-desc");
    projectDesc.innerText = project.description;
    projectCard.appendChild(projectDesc);

    // Append the card to the projects container
    projectsContainer.appendChild(projectCard);
});

// -- Dynamic Social Links --
const socialLinksElement = document.getElementById("social_links");
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

// -- Dynamic Skills Section --
const skillsContainer = document.getElementById("skills_container");
skillsContainer.innerHTML = "";
details.skills.forEach((skill) => {
    const skillCard = document.createElement("div");
    skillCard.classList.add("skill-card");

    const img = document.createElement("img");
    img.src = skill.imgSrc;
    img.alt = skill.alt;

    const p = document.createElement("p");
    p.innerText = skill.name;

    skillCard.appendChild(img);
    skillCard.appendChild(p);
    skillsContainer.appendChild(skillCard);
});


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
      <p>${edu.institution}${edu.percentage ? ' | Percentage: ' + edu.percentage + '%' : ''}</p>
    `;
    return contentDiv;
}

// Populate the Timeline
const timeline = document.querySelector('.timeline');
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


// Generate Contact Section Dynamically
const contactSection = document.getElementById("contact");
contactSection.innerHTML = `
  <div class="contact-container">
    <h1>${details.contact.title}</h1>
    ${details.contact.info.map(item => `
      <p>
        <i class="${item.icon}"></i>
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

const footer = document.querySelector('footer');
footer.innerHTML = `<p>${details.footer.copyrightText}</p>`;


const projectLinksElement = document.getElementById("project_links");
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