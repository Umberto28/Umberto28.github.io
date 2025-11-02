new FinisherHeader({
    "count": 12,
    "size": {
        "min": 800,
        "max": 1200,
        "pulse": 0.3
    },
    "speed": {
        "x": {
        "min": 3,
        "max": 5
        },
        "y": {
        "min": 3,
        "max": 5
        }
    },
    "colors": {
        "background": "#282b34",
        "particles": [
        "#3c6e71"
        ]
    },
    "blending": "lighten",
    "opacity": {
        "center": 0.2,
        "edge": 0
    },
    "skew": 0,
    "shapes": [
        "c"
    ]
});

async function loadProjectsData() {
    try {
        const response = await fetch('./assets/data/projects.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.projects;
    }
    catch (error) {
        console.error('Error loading projects:', error);
        return [];
    }
}

function findProjectById(projects, id) {
    return projects.find(project => project.id === id);
}

function createProjectLink(projectId, text = '', className = '') {
    const link = document.createElement('a');
    link.href = `project.html?id=${projectId}`;
    link.textContent = text;
    if (className) link.className = className;
    return link;
}

function createFeaturedProjectCard(project) {
    const card = document.createElement('article');
        
    card.innerHTML = `
        <span class="image">
            <img src="./images/cover-images/${project.id}.png" alt="${project.id}" />
            <p class="icon solid fa-thumbtack pin"></p>
        </span>
        <a href="${createProjectLink(project.id)}">
            <div class="content">
                <h2> ${project.details.title}</h2>
                <p>${project.captionHighlight}</p>
            </div>
        </a>
    `;
    return card;
}

async function populateFeaturedProjects() {
    const projects = await loadProjectsData();
    const featuredProjects = projects.filter(project => project.isFeatured);
    const container = document.getElementById('featured-projects');
    
    if (container && featuredProjects.length > 0) {
        container.innerHTML = '';
        featuredProjects.slice(0, 3).forEach(project => {
            const projectCard = createFeaturedProjectCard(project);
            container.appendChild(projectCard);
        });
        const action = document.createElement('div');
        action.innerHTML = `
            <ul class="actions">
				<li><a href="portfolio.html" class="button style1 large">See All Projects</a></li>
			</ul>
        `;
        container.parentElement.appendChild(action);
    }
}

function createPortfolioProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'col-4';
        
    card.innerHTML = `
        <section class="project-card">
            <a href="${createProjectLink(project.id)}">
                <img src="./images/cover-images/${project.id}.png" alt="${project.id}" />
                ${project.isFeatured ? `<p class="icon solid fa-thumbtack pin"></p>` : ``}
                <div class="cardTitle">
                    <h3>${project.details.title}</h3>
                    <h3 class="icon solid fa-arrow-right"></h3>
                </div>
                <div class="cardText">
                    <p>${project.captionPortfolio}</p>
                </div>              
            </a>
        </section>
    `; // <h3 class="pedix">2025<h3>
    return card;
}

async function populatePortfolioProjects() {
    document.getElementById('style-sheet').href = 'assets/css/main-portfolio.css';
    document.getElementById('web-project-title').textContent = 'Umberto Gentile | Portfolio';

    const projects = await loadProjectsData();
    const projects_game_jam = projects.filter(project => project.category === "game-jam");
    const projects_personal = projects.filter(project => project.category === "personal-project");
    
    const container_game_jam = document.getElementById('projects-container-game-jam');
    
    if (container_game_jam) {
        container_game_jam.innerHTML = '';
        projects_game_jam.forEach(project => {
            const projectCard = createPortfolioProjectCard(project, 2);
            container_game_jam.appendChild(projectCard);
        });
    }

    const container_personal = document.getElementById('projects-container-personal');
    
    if (container_personal) {
        container_personal.innerHTML = '';
        projects_personal.forEach(project => {
            const projectCard = createPortfolioProjectCard(project, 1);
            container_personal.appendChild(projectCard);
        });
    }
}

function populateProjectPage(project) {
    document.getElementById('style-sheet').href = 'assets/css/main-project.css';

    // Check if the given project exists
    if (!project) {
        document.getElementById('web-project-title').textContent = 'Umberto Gentile | Progetto non trovato';
        document.getElementById('project-title').textContent = 'Progetto non trovato';
        document.getElementById('project-description-content').innerHTML = '<p>Il progetto richiesto non è stato trovato.</p>';
        document.getElementById('project-details').innerHTML = '';
        return;
    }

    document.getElementById('web-project-title').textContent = `Umberto Gentile | ${project.details.title}`;
    document.getElementById('project-title').textContent = project.details.title;
    document.getElementById('project-participants').innerHTML = `<p id="project-participants"><i class="icon solid fa-users"></i> ${project.details.participants}</p>`;
    document.getElementById('project-time').innerHTML = `<p id="project-time"><i class="icon solid fa-hourglass-end"> ${project.details.time}</i></p>`;
    //document.getElementById('project-github').href = project.githubUrl;
    document.getElementById('project-video').src = project.links.youtubeUrl;
    document.getElementById('project-description-content').innerHTML = 
        `<h3>Context</h3>
        <p>${project.description.summary}</p>
        <h3>${project.details.participants > 1 ? `My contribution` : `My work`}</h3>
        <p class="style1">${project.description.role}</p>
        ${project.description.tasks.length > 0 
        ? `<ul>
            ${project.description.tasks.map(task => `<li><p class="style2">${task}</p></li>`).join('')}
           </ul>` 
        : ''}
        <h3>Results</h3>
        <p>${project.description.results}</p>
        ${project.links.githubUrl != "" || project.links.itchioUrl != "" ?
            `<hr>
            <div class="links">
                <p class="style2">Want to see more? Check out: ${project.links.githubUrl != "" ? `<a href="${project.links.githubUrl}" class="icon brands fa-github" target="_blank"></a>` : ``} ${project.links.itchioUrl != "" ? `<a href="${project.links.itchioUrl}" class="icon brands fa-itch-io" target="_blank"></a>` : ``}
                </p>
            </div>` : ``}
        </div>`;

    // Handling tags
    const tagsContainer = document.getElementById('project-tags');
    tagsContainer.innerHTML = '';
    project.details.tags.forEach(tag => {
        const tagElement = document.createElement('li');
        tagElement.className = 'tag';
        tagElement.innerHTML = `<p>${tag}</p>`;
        tagsContainer.appendChild(tagElement);
    });

    // Check if gallery is empty
    if (project.gallery.length > 0) {
        //Add navbar section
        const navbarGallery = document.createElement('li');
        navbarGallery.innerHTML = `<a href="#gallery">Gallery</a>`;
        document.getElementById('navCenter').append(navbarGallery);

        const gallerySection = document.getElementById('gallery');
        
		const title = document.createElement('div');
        title.className = "title";
        title.textContent = "Gallery (" + project.gallery.length + ")";

		const picsContainer = document.createElement('div');
        picsContainer.className = "container";

        const picsRows = document.createElement('div');
        picsRows.className = "gallery-card aln-center";

        project.gallery.forEach(p => {
            const pic = document.createElement('article');
            pic.innerHTML = `<span class="image">
							    <img src="${p}" alt=""/>
                            </span>`;
            picsRows.append(pic);
        });

        picsContainer.append(picsRows);
        gallerySection.append(title);
        gallerySection.append(picsContainer);
    }
    else {
        document.getElementById('gallery').remove();
    }
}

function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function hideURLParameters(projectId) {
    // Check if url has parameters
    if (window.location.search) {
        const cleanURL = window.location.protocol + '//' + 
                        window.location.host + 
                        window.location.pathname;

        window.history.replaceState({}, document.title, cleanURL);
    }
}

// Init the current page
document.addEventListener('DOMContentLoaded', async function() {
    document.head.innerHTML = `<title id="web-project-title">Umberto Gentile | Personal Website</title>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
		<link id="style-sheet" rel="stylesheet" href="assets/css/main.css" />
		<link rel="preconnect" href="https://fonts.googleapis.com">
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
		<link href="https://fonts.googleapis.com/css2?family=Geologica:wght@100..900&display=swap" rel="stylesheet">`;
    
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'project.html':
            var projectId = getURLParameter('id');

            if (projectId != null) {
                window.history.pushState(projectId, '', '/project.html');
                sessionStorage.setItem('projectState', projectId);
            }
            else {
                projectId = sessionStorage.getItem('projectState');
            }

            hideURLParameters();

            const projects = await loadProjectsData();
            const project = findProjectById(projects, projectId);
            populateProjectPage(project);
            break;
            
        case 'index.html':
        case '':
            populateFeaturedProjects();
            break;
            
        case 'portfolio.html':
            populatePortfolioProjects();
            break;
    }
});
