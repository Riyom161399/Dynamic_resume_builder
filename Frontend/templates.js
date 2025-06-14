// Global Variables
let currentTemplate = 'modern';
let zoomLevel = 100;
let resumeData = {
    personalInfo: {
        fullName: 'John Doe',
        title: 'Software Developer',
        email: 'john.doe@email.com',
        phone: '+1 (555) 123-4567',
        location: 'New York, NY',
        website: 'www.johndoe.com',
        linkedin: 'linkedin.com/in/johndoe',
        github: 'github.com/johndoe',
        summary: 'Passionate software developer with 5+ years of experience in full-stack development. Skilled in JavaScript, React, Node.js, and cloud technologies.',
        profilePicture: null
    },
    experience: [
        {
            id: 1,
            position: 'Senior Software Developer',
            company: 'Tech Solutions Inc.',
            location: 'New York, NY',
            startDate: '2021-01',
            endDate: 'Present',
            current: true,
            description: '• Led development of web applications using React and Node.js\n• Collaborated with cross-functional teams to deliver high-quality software\n• Mentored junior developers and conducted code reviews'
        }
    ],
    education: [
        {
            id: 1,
            degree: 'Bachelor of Science in Computer Science',
            school: 'University of Technology',
            location: 'Boston, MA',
            graduationDate: '2019-05',
            gpa: '3.8'
        }
    ],
    skills: [
        { id: 1, name: 'JavaScript', category: 'Programming', level: 90 },
        { id: 2, name: 'React', category: 'Frontend', level: 85 },
        { id: 3, name: 'Node.js', category: 'Backend', level: 80 }
    ],
    projects: [
        {
            id: 1,
            name: 'E-commerce Platform',
            description: 'Full-stack e-commerce solution built with React and Node.js',
            technologies: 'React, Node.js, MongoDB, Stripe API',
            link: 'github.com/johndoe/ecommerce'
        }
    ],
    certifications: [
        {
            id: 1,
            name: 'AWS Certified Developer',
            issuer: 'Amazon Web Services',
            date: '2023-06',
            link: 'aws.amazon.com/certification'
        }
    ],
    languages: [
        { id: 1, name: 'English', level: 'Native' },
        { id: 2, name: 'Spanish', level: 'Intermediate' }
    ]
};

let sidebarCollapsed = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    addA4CanvasSupport();
    initializeApp();
    setupEventListeners();
    renderResume();
    updateEditForm();
    
    // Initialize first tab
    setTimeout(() => {
        switchTab('personal');
    }, 100);
});

// **MAIN FIX: Add A4 Canvas Support**
function addA4CanvasSupport() {
    const style = document.createElement('style');
    style.textContent = `
        .a4-canvas {
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            padding: 20mm;
            box-sizing: border-box;
            transform-origin: top left;
        }
        
        .resume-preview {
            overflow: auto;
            max-height: 80vh;
            border: 1px solid #ddd;
            border-radius: 8px;
            background: #f5f5f5;
            padding: 20px;
        }
        
        @media print {
            .a4-canvas {
                width: 100% !important;
                min-height: auto !important;
                margin: 0 !important;
                box-shadow: none !important;
                padding: 15mm !important;
                transform: none !important;
            }
            
            .no-print {
                display: none !important;
            }
        }
        
        @media screen and (max-width: 768px) {
            .a4-canvas {
                width: 95%;
                padding: 15mm 10mm;
                transform: scale(0.8);
            }
        }
    `;
    document.head.appendChild(style);
}

// **FIX 1: Tab Switching Function**
function switchTab(tabName) {
    console.log('Switching to tab:', tabName);
    
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected tab content
    const selectedTab = document.getElementById(tabName + '-tab');
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Add active class to clicked button
    const activeButton = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    showNotification(`Switched to ${tabName} section`, 'info');
}

// **FIX 2: Preview Resume Function**
function previewResume() {
    console.log('Previewing resume...');
    
    // Re-render the resume to ensure it's up to date
    renderResume();
    
    // Scroll to preview section
    const previewSection = document.querySelector('.resume-preview-panel');
    if (previewSection) {
        previewSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    showNotification('Resume preview updated', 'success');
    
    // Optional: Highlight the preview area briefly
    const previewArea = document.getElementById('resumePreview');
    if (previewArea) {
        previewArea.style.border = '3px solid #007bff';
        setTimeout(() => {
            previewArea.style.border = '';
        }, 2000);
    }
}

// **FIX 3: Download Resume Function**
function downloadResume(format = 'pdf') {
    console.log('Downloading resume as:', format);
    
    switch(format.toLowerCase()) {
        case 'pdf':
            downloadPDF();
            break;
        case 'word':
        case 'docx':
            downloadWord();
            break;
        case 'json':
            downloadJSON();
            break;
        default:
            downloadPDF();
            break;
    }
}

// **FIX 4: Zoom Functions**
function zoomIn() {
    zoomLevel = Math.min(zoomLevel + 10, 200);
    updateZoom();
}

function zoomOut() {
    zoomLevel = Math.max(zoomLevel - 10, 50);
    updateZoom();
}

function updateZoom() {
    const preview = document.getElementById('resumePreview');
    const zoomDisplay = document.getElementById('zoomLevel');
    
    if (preview) {
        preview.style.transform = `scale(${zoomLevel / 100})`;
        preview.style.transformOrigin = 'top left';
    }
    
    if (zoomDisplay) {
        zoomDisplay.textContent = `${zoomLevel}%`;
    }
    
    showNotification(`Zoom: ${zoomLevel}%`, 'info');
}

// **FIX 5: Modal Functions**
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

function downloadAs(format) {
    closeModal('downloadModal');
    downloadResume(format);
}

function initializeApp() {
    // Load saved data if exists
    const savedData = localStorage.getItem('resumeData');
    if (savedData) {
        try {
            resumeData = JSON.parse(savedData);
        } catch (e) {
            console.error('Error loading saved data:', e);
        }
    }
    
    // Load saved template
    const savedTemplate = localStorage.getItem('currentTemplate');
    if (savedTemplate) {
        currentTemplate = savedTemplate;
    }
    
    // Set active template
    setTimeout(() => {
        const templateCard = document.querySelector(`[data-template="${currentTemplate}"]`);
        if (templateCard) {
            document.querySelectorAll('.template-card').forEach(card => {
                card.classList.remove('active');
            });
            templateCard.classList.add('active');
        }
    }, 100);
    
    console.log('Resume Builder Pro initialized successfully!');
}

function setupEventListeners() {
    // Auto-save on input changes
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('form-input')) {
            const field = e.target.name;
            const value = e.target.value;
            
            if (field && resumeData.personalInfo.hasOwnProperty(field)) {
                resumeData.personalInfo[field] = value;
                setTimeout(() => {
                    renderResume();
                    autoSave();
                }, 300);
            }
        }
    });
    
    // Profile picture upload
    setTimeout(() => {
        const fileInput = document.getElementById('profilePictureInput');
        if (fileInput) {
            fileInput.addEventListener('change', handleProfilePictureUpload);
        }
    }, 100);
}

// Template Selection
function selectTemplate(templateName) {
    console.log('Selecting template:', templateName);
    
    // Remove active class from all templates
    document.querySelectorAll('.template-card').forEach(card => {
        card.classList.remove('active');
    });
    
    // Add active class to selected template
    const selectedCard = document.querySelector(`[data-template="${templateName}"]`);
    if (selectedCard) {
        selectedCard.classList.add('active');
    }
    
    currentTemplate = templateName;
    localStorage.setItem('currentTemplate', templateName);
    
    renderResume();
    showNotification(`Template changed to ${templateName}`, 'success');
}

// Sidebar Toggle
function toggleSidebar() {
    const sidebar = document.getElementById('templatesSidebar');
    const icon = document.querySelector('.sidebar-toggle i');
    
    if (!sidebar) return;
    
    sidebarCollapsed = !sidebarCollapsed;
    
    if (sidebarCollapsed) {
        sidebar.classList.add('collapsed');
        if (icon) icon.className = 'fas fa-chevron-right';
    } else {
        sidebar.classList.remove('collapsed');
        if (icon) icon.className = 'fas fa-chevron-left';
    }
}

// Resume Templates with A4 Canvas Support
const resumeTemplates = {
    modern: function(data) {
        return `
            <div class="resume modern-template a4-canvas">
                <div class="resume-header">
                    <div class="header-content">
                        <div class="profile-section">
                            ${data.personalInfo.profilePicture ? `<img src="${data.personalInfo.profilePicture}" class="profile-picture" alt="Profile">` : ''}
                            <div class="profile-info">
                                <h1>${data.personalInfo.fullName}</h1>
                                <h2>${data.personalInfo.title}</h2>
                            </div>
                        </div>
                        <div class="contact-info">
                            <div class="contact-item">
                                <i class="fas fa-envelope"></i>
                                <span>${data.personalInfo.email}</span>
                            </div>
                            <div class="contact-item">
                                <i class="fas fa-phone"></i>
                                <span>${data.personalInfo.phone}</span>
                            </div>
                            <div class="contact-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${data.personalInfo.location}</span>
                            </div>
                            <div class="contact-item">
                                <i class="fas fa-globe"></i>
                                <span>${data.personalInfo.website}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="resume-body">
                    <section class="summary-section">
                        <h3>Professional Summary</h3>
                        <p>${data.personalInfo.summary}</p>
                    </section>
                    
                    <section class="experience-section">
                        <h3>Work Experience</h3>
                        ${data.experience.map(exp => `
                            <div class="experience-item">
                                <div class="experience-header">
                                    <h4>${exp.position}</h4>
                                    <span class="date">${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}</span>
                                </div>
                                <div class="company-info">
                                    <span class="company">${exp.company}</span>
                                    <span class="location">${exp.location}</span>
                                </div>
                                <div class="description">${exp.description.replace(/\n/g, '<br>')}</div>
                            </div>
                        `).join('')}
                    </section>
                    
                    <section class="education-section">
                        <h3>Education</h3>
                        ${data.education.map(edu => `
                            <div class="education-item">
                                <h4>${edu.degree}</h4>
                                <div class="school">${edu.school}</div>
                                <div class="edu-details">
                                    <span class="location">${edu.location}</span>
                                    <span class="date">${formatDate(edu.graduationDate)}</span>
                                </div>
                                ${edu.gpa ? `<div class="gpa">GPA: ${edu.gpa}</div>` : ''}
                            </div>
                        `).join('')}
                    </section>
                    
                    <section class="skills-section">
                        <h3>Skills</h3>
                        <div class="skills-grid">
                            ${data.skills.map(skill => `
                                <div class="skill-item">
                                    <span class="skill-name">${skill.name}</span>
                                    <div class="skill-bar">
                                        <div class="skill-progress" style="width: ${skill.level}%"></div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </section>
                    
                    <section class="projects-section">
                        <h3>Projects</h3>
                        ${data.projects.map(project => `
                            <div class="project-item">
                                <h4>${project.name}</h4>
                                <p>${project.description}</p>
                                <div class="technologies">
                                    <strong>Technologies:</strong> ${project.technologies}
                                </div>
                            </div>
                        `).join('')}
                    </section>
                </div>
            </div>
        `;
    },

    classic: function(data) {
        return `
            <div class="resume classic-template a4-canvas">
                <div class="resume-header">
                    <h1>${data.personalInfo.fullName}</h1>
                    <h2>${data.personalInfo.title}</h2>
                    <div class="contact-line">
                        ${data.personalInfo.email} | ${data.personalInfo.phone} | ${data.personalInfo.location}
                    </div>
                </div>
                
                <section class="summary-section">
                    <h3>PROFESSIONAL SUMMARY</h3>
                    <hr>
                    <p>${data.personalInfo.summary}</p>
                </section>
                
                <section class="experience-section">
                    <h3>PROFESSIONAL EXPERIENCE</h3>
                    <hr>
                    ${data.experience.map(exp => `
                        <div class="experience-item">
                            <div class="experience-header">
                                <h4>${exp.position}</h4>
                                <span class="date">${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}</span>
                            </div>
                            <div class="company-info">
                                <strong>${exp.company}</strong>, ${exp.location}
                            </div>
                            <div class="description">${exp.description.replace(/\n/g, '<br>')}</div>
                        </div>
                    `).join('')}
                </section>
                
                <section class="education-section">
                    <h3>EDUCATION</h3>
                    <hr>
                    ${data.education.map(edu => `
                        <div class="education-item">
                            <div class="education-header">
                                <h4>${edu.degree}</h4>
                                <span class="date">${formatDate(edu.graduationDate)}</span>
                            </div>
                            <div class="school-info">
                                <strong>${edu.school}</strong>, ${edu.location}
                            </div>
                            ${edu.gpa ? `<div class="gpa">GPA: ${edu.gpa}</div>` : ''}
                        </div>
                    `).join('')}
                </section>
                
                <section class="skills-section">
                    <h3>TECHNICAL SKILLS</h3>
                    <hr>
                    <div class="skills-list">
                        ${data.skills.map(skill => `<span class="skill-tag">${skill.name}</span>`).join('')}
                    </div>
                </section>
            </div>
        `;
    },

    creative: function(data) {
        return `
            <div class="resume creative-template a4-canvas">
                <div class="resume-sidebar">
                    ${data.personalInfo.profilePicture ? `<img src="${data.personalInfo.profilePicture}" class="profile-picture" alt="Profile">` : ''}
                    
                    <div class="contact-section">
                        <h3>Contact</h3>
                        <div class="contact-item">
                            <i class="fas fa-envelope"></i>
                            <span>${data.personalInfo.email}</span>
                        </div>
                        <div class="contact-item">
                            <i class="fas fa-phone"></i>
                            <span>${data.personalInfo.phone}</span>
                        </div>
                        <div class="contact-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${data.personalInfo.location}</span>
                        </div>
                    </div>
                    
                    <div class="skills-section">
                        <h3>Skills</h3>
                        ${data.skills.map(skill => `
                            <div class="skill-item">
                                <span class="skill-name">${skill.name}</span>
                                <div class="skill-level">
                                    ${Array(5).fill().map((_, i) => `
                                        <div class="skill-dot ${i < Math.round(skill.level / 20) ? 'filled' : ''}"></div>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="resume-main">
                    <div class="header-section">
                        <h1>${data.personalInfo.fullName}</h1>
                        <h2>${data.personalInfo.title}</h2>
                    </div>
                    
                    <section class="summary-section">
                        <h3>About Me</h3>
                        <p>${data.personalInfo.summary}</p>
                    </section>
                    
                    <section class="experience-section">
                        <h3>Experience</h3>
                        ${data.experience.map(exp => `
                            <div class="experience-item">
                                <div class="timeline-dot"></div>
                                <div class="experience-content">
                                    <h4>${exp.position}</h4>
                                    <div class="company-date">
                                        <span class="company">${exp.company}</span>
                                        <span class="date">${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}</span>
                                    </div>
                                    <div class="description">${exp.description.replace(/\n/g, '<br>')}</div>
                                </div>
                            </div>
                        `).join('')}
                    </section>
                </div>
            </div>
        `;
    },

    minimal: function(data) {
        return `
            <div class="resume minimal-template a4-canvas">
                <div class="resume-header">
                    <h1>${data.personalInfo.fullName}</h1>
                    <div class="title">${data.personalInfo.title}</div>
                    <div class="contact-info">
                        <span>${data.personalInfo.email}</span>
                        <span>${data.personalInfo.phone}</span>
                        <span>${data.personalInfo.location}</span>
                    </div>
                </div>
                
                <div class="section-divider"></div>
                
                <section class="summary-section">
                    <p>${data.personalInfo.summary}</p>
                </section>
                
                <div class="section-divider"></div>
                
                <section class="experience-section">
                    <h3>Experience</h3>
                    ${data.experience.map(exp => `
                        <div class="experience-item">
                            <div class="experience-header">
                                <h4>${exp.position}</h4>
                                <span class="date">${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}</span>
                            </div>
                            <div class="company">${exp.company}</div>
                            <div class="description">${exp.description.replace(/\n/g, '<br>')}</div>
                        </div>
                    `).join('')}
                </section>
                
                <div class="section-divider"></div>
                
                <section class="skills-section">
                    <h3>Skills</h3>
                    <div class="skills-grid">
                        ${data.skills.map(skill => `<span class="skill-tag">${skill.name}</span>`).join('')}
                    </div>
                </section>
            </div>
        `;
    },

    professional: function(data) {
        return `
            <div class="resume professional-template a4-canvas">
                <div class="resume-header">
                    <div class="header-left">
                        ${data.personalInfo.profilePicture ? `<img src="${data.personalInfo.profilePicture}" class="profile-picture" alt="Profile">` : ''}
                        <div class="name-title">
                            <h1>${data.personalInfo.fullName}</h1>
                            <h2>${data.personalInfo.title}</h2>
                        </div>
                    </div>
                    <div class="header-right">
                        <div class="contact-grid">
                            <div class="contact-item">
                                <i class="fas fa-envelope"></i>
                                <span>${data.personalInfo.email}</span>
                            </div>
                            <div class="contact-item">
                                <i class="fas fa-phone"></i>
                                <span>${data.personalInfo.phone}</span>
                            </div>
                            <div class="contact-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${data.personalInfo.location}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <section class="summary-section">
                    <h3>Executive Summary</h3>
                    <p>${data.personalInfo.summary}</p>
                </section>
                
                <section class="experience-section">
                    <h3>Professional Experience</h3>
                    ${data.experience.map(exp => `
                        <div class="experience-item">
                            <div class="experience-header">
                                <h4>${exp.position}</h4>
                                <span class="date">${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}</span>
                            </div>
                            <div class="company-location">
                                <span class="company">${exp.company}</span> | 
                                <span class="location">${exp.location}</span>
                            </div>
                            <div class="description">${exp.description.replace(/\n/g, '<br>')}</div>
                        </div>
                    `).join('')}
                </section>
            </div>
        `;
    },

    executive: function(data) {
        return `
            <div class="resume executive-template a4-canvas">
                <div class="executive-header">
                    <div class="header-background"></div>
                    <div class="header-content">
                        <h1>${data.personalInfo.fullName}</h1>
                        <h2>${data.personalInfo.title}</h2>
                        <div class="contact-bar">
                            <span>${data.personalInfo.email}</span>
                            <span>${data.personalInfo.phone}</span>
                            <span>${data.personalInfo.location}</span>
                        </div>
                    </div>
                </div>
                
                <div class="executive-body">
                    <section class="executive-summary">
                        <h3>Executive Summary</h3>
                        <div class="summary-content">
                            <p>${data.personalInfo.summary}</p>
                        </div>
                    </section>
                    
                    <section class="leadership-experience">
                        <h3>Leadership Experience</h3>
                        ${data.experience.map(exp => `
                            <div class="experience-item">
                                <div class="experience-header">
                                    <div class="position-company">
                                        <h4>${exp.position}</h4>
                                        <span class="company">${exp.company}</span>
                                    </div>
                                    <div class="date-location">
                                        <span class="date">${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}</span>
                                        <span class="location">${exp.location}</span>
                                    </div>
                                </div>
                                <div class="description">${exp.description.replace(/\n/g, '<br>')}</div>
                            </div>
                        `).join('')}
                    </section>
                </div>
            </div>
        `;
    }
};

// Render Functions
function renderResume() {
    const resumePreview = document.getElementById('resumePreview');
    if (resumePreview && resumeTemplates[currentTemplate]) {
        resumePreview.innerHTML = resumeTemplates[currentTemplate](resumeData);
    }
}

// Form Management Functions
function updateEditForm() {
    setTimeout(() => {
        updatePersonalInfoForm();
        updateExperienceForm();
        updateEducationForm();
        updateSkillsForm();
        updateProjectsForm();
    }, 100);
}

function updatePersonalInfoForm() {
    const form = document.getElementById('personalInfoForm');
    if (form) {
        const inputs = form.querySelectorAll('.form-input');
        inputs.forEach(input => {
            const field = input.name;
            if (field && resumeData.personalInfo[field]) {
                input.value = resumeData.personalInfo[field];
            }
        });
    }
}

// Add Section Functions
function addExperience() {
    const newExp = {
        id: Date.now(),
        position: 'New Position',
        company: 'Company Name',
        location: 'City, State',
        startDate: new Date().toISOString().slice(0, 7),
        endDate: '',
        current: true,
        description: 'Job description here...'
    };
    
    resumeData.experience.push(newExp);
    updateExperienceForm();
    renderResume();
    autoSave();
    showNotification('Experience added', 'success');
}

function addEducation() {
    const newEdu = {
        id: Date.now(),
        degree: 'Degree Name',
        school: 'School Name',
        location: 'City, State',
        graduationDate: new Date().toISOString().slice(0, 7),
        gpa: ''
    };
    
    resumeData.education.push(newEdu);
    updateEducationForm();
    renderResume();
    autoSave();
    showNotification('Education added', 'success');
}

function addSkill() {
    const newSkill = {
        id: Date.now(),
        name: 'New Skill',
        category: 'Other',
        level: 50
    };
    
    resumeData.skills.push(newSkill);
    updateSkillsForm();
    renderResume();
    autoSave();
    showNotification('Skill added', 'success');
}

function addProject() {
    const newProject = {
        id: Date.now(),
        name: 'New Project',
        description: 'Project description here...',
        technologies: 'Technology stack',
        link: 'project-link.com'
    };
    
    resumeData.projects.push(newProject);
    updateProjectsForm();
    renderResume();
    autoSave();
    showNotification('Project added', 'success');
}

// Update form functions (simplified versions)
function updateExperienceForm() {
    const container = document.getElementById('experienceContainer');
    if (container) {
        container.innerHTML = resumeData.experience.map((exp, index) => `
            <div class="form-section" data-index="${index}">
                <div class="form-header">
                    <h4>Experience ${index + 1}</h4>
                    <button type="button" class="btn-remove" onclick="removeExperience(${index})">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
                <div class="form-row">
                    <input type="text" class="form-input" placeholder="Position" value="${exp.position}" 
                           onchange="updateExperienceField(${index}, 'position', this.value)">
                    <input type="text" class="form-input" placeholder="Company" value="${exp.company}" 
                           onchange="updateExperienceField(${index}, 'company', this.value)">
                </div>
                <textarea class="form-input" rows="4" placeholder="Job description..." 
                          onchange="updateExperienceField(${index}, 'description', this.value)">${exp.description}</textarea>
            </div>
        `).join('');
    }
}

function updateEducationForm() {
    const container = document.getElementById('educationContainer');
    if (container) {
        container.innerHTML = resumeData.education.map((edu, index) => `
            <div class="form-section" data-index="${index}">
                <div class="form-header">
                    <h4>Education ${index + 1}</h4>
                    <button type="button" class="btn-remove" onclick="removeEducation(${index})">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
                <div class="form-row">
                    <input type="text" class="form-input" placeholder="Degree" value="${edu.degree}" 
                           onchange="updateEducationField(${index}, 'degree', this.value)">
                    <input type="text" class="form-input" placeholder="School" value="${edu.school}" 
                           onchange="updateEducationField(${index}, 'school', this.value)">
                </div>
            </div>
        `).join('');
    }
}

function updateSkillsForm() {
    const container = document.getElementById('skillsContainer');
    if (container) {
        container.innerHTML = resumeData.skills.map((skill, index) => `
            <div class="form-section" data-index="${index}">
                <div class="form-header">
                    <h4>Skill ${index + 1}</h4>
                    <button type="button" class="btn-remove" onclick="removeSkill(${index})">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
                <div class="form-row">
                    <input type="text" class="form-input" placeholder="Skill Name" value="${skill.name}" 
                           onchange="updateSkillField(${index}, 'name', this.value)">
                    <input type="range" class="form-input" min="0" max="100" value="${skill.level}" 
                           onchange="updateSkillField(${index}, 'level', this.value)">
                    <span>${skill.level}%</span>
                </div>
            </div>
        `).join('');
    }
}

function updateProjectsForm() {
    const container = document.getElementById('projectsContainer');
    if (container) {
        container.innerHTML = resumeData.projects.map((project, index) => `
            <div class="form-section" data-index="${index}">
                <div class="form-header">
                    <h4>Project ${index + 1}</h4>
                    <button type="button" class="btn-remove" onclick="removeProject(${index})">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
                <input type="text" class="form-input" placeholder="Project Name" value="${project.name}" 
                       onchange="updateProjectField(${index}, 'name', this.value)">
                <textarea class="form-input" rows="3" placeholder="Project description..." 
                          onchange="updateProjectField(${index}, 'description', this.value)">${project.description}</textarea>
            </div>
        `).join('');
    }
}

// Update field functions
function updateExperienceField(index, field, value) {
    if (resumeData.experience[index]) {
        resumeData.experience[index][field] = value;
        renderResume();
        autoSave();
    }
}

function updateEducationField(index, field, value) {
    if (resumeData.education[index]) {
        resumeData.education[index][field] = value;
        renderResume();
        autoSave();
    }
}

function updateSkillField(index, field, value) {
    if (resumeData.skills[index]) {
        resumeData.skills[index][field] = field === 'level' ? parseInt(value) : value;
        renderResume();
        autoSave();
        if (field === 'level') {
            updateSkillsForm();
        }
    }
}

function updateProjectField(index, field, value) {
    if (resumeData.projects[index]) {
        resumeData.projects[index][field] = value;
        renderResume();
        autoSave();
    }
}

// Remove functions
function removeExperience(index) {
    if (confirm('Are you sure you want to remove this experience?')) {
        resumeData.experience.splice(index, 1);
        updateExperienceForm();
        renderResume();
        autoSave();
        showNotification('Experience removed', 'success');
    }
}

function removeEducation(index) {
    if (confirm('Are you sure you want to remove this education?')) {
        resumeData.education.splice(index, 1);
        updateEducationForm();
        renderResume();
        autoSave();
        showNotification('Education removed', 'success');
    }
}

function removeSkill(index) {
    if (confirm('Are you sure you want to remove this skill?')) {
        resumeData.skills.splice(index, 1);
        updateSkillsForm();
        renderResume();
        autoSave();
        showNotification('Skill removed', 'success');
    }
}

function removeProject(index) {
    if (confirm('Are you sure you want to remove this project?')) {
        resumeData.projects.splice(index, 1);
        updateProjectsForm();
        renderResume();
        autoSave();
        showNotification('Project removed', 'success');
    }
}

// Utility Functions
function formatDate(dateString) {
    if (!dateString || dateString === 'Present') return dateString;
    
    try {
        const date = new Date(dateString + '-01');
        return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    } catch (e) {
        return dateString;
    }
}

// Profile Picture Upload
function handleProfilePictureUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            resumeData.personalInfo.profilePicture = e.target.result;
            renderResume();
            autoSave();
            showNotification('Profile picture updated successfully!', 'success');
        };
        reader.readAsDataURL(file);
    }
}

// Auto-save functionality
function autoSave() {
    try {
        localStorage.setItem('resumeData', JSON.stringify(resumeData));
        console.log('Data auto-saved');
    } catch (e) {
        console.error('Failed to auto-save data:', e);
    }
}

// Export Functions with A4 Support
function downloadPDF() {
    const element = document.getElementById('resumePreview');
    if (!element) {
        showNotification('Resume preview not found', 'error');
        return;
    }

    const opt = {
        margin: 0,
        filename: `${resumeData.personalInfo.fullName}_Resume.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2, 
            useCORS: true,
            width: 794,
            height: 1123
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait' 
        }
    };

    if (typeof html2pdf !== 'undefined') {
        showNotification('Generating PDF...', 'info');
        html2pdf().set(opt).from(element).save().then(() => {
            showNotification('PDF downloaded successfully!', 'success');
        }).catch((error) => {
            console.error('PDF generation error:', error);
            showNotification('Failed to generate PDF', 'error');
        });
    } else {
        showNotification('PDF library not loaded. Please refresh the page.', 'error');
    }
}

function downloadWord() {
    try {
        const element = document.getElementById('resumePreview');
        const htmlContent = element.innerHTML;
        
        const blob = new Blob([`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Resume</title>
            </head>
            <body>
                ${htmlContent}
            </body>
            </html>
        `], { type: 'application/msword' });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${resumeData.personalInfo.fullName}_Resume.doc`;
        a.click();
        URL.revokeObjectURL(url);
        
        showNotification('Word document downloaded', 'success');
    } catch (error) {
        showNotification('Error downloading Word document', 'error');
    }
}

function downloadJSON() {
    const dataStr = JSON.stringify(resumeData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resumeData.personalInfo.fullName}_Resume_Data.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification('Resume data downloaded as JSON', 'success');
}

function printResume() {
    const printWindow = window.open('', '_blank');
    const resumeContent = document.getElementById('resumePreview').innerHTML;
    
    printWindow.document.write(`
        <html>
            <head>
                <title>Resume - ${resumeData.personalInfo.fullName}</title>
                <style>
                    body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                    .a4-canvas {
                        width: 100% !important;
                        min-height: auto !important;
                        margin: 0 !important;
                        box-shadow: none !important;
                        padding: 15mm !important;
                    }
                    @media print {
                        body { margin: 0; padding: 0; }
                        .no-print { display: none !important; }
                    }
                </style>
            </head>
            <body>
                ${resumeContent}
            </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
    
    showNotification('Print dialog opened', 'success');
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        `;
        notification.className = `notification show notification-${type}`;
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

// Make all functions available globally
window.switchTab = switchTab;
window.previewResume = previewResume;
window.downloadResume = downloadResume;
window.selectTemplate = selectTemplate;
window.toggleSidebar = toggleSidebar;
window.zoomIn = zoomIn;
window.zoomOut = zoomOut;
window.downloadAs = downloadAs;
window.closeModal = closeModal;
window.addExperience = addExperience;
window.addEducation = addEducation;
window.addSkill = addSkill;
window.addProject = addProject;
window.removeExperience = removeExperience;
window.removeEducation = removeEducation;
window.removeSkill = removeSkill;
window.removeProject = removeProject;
window.updateExperienceField = updateExperienceField;
window.updateEducationField = updateEducationField;
window.updateSkillField = updateSkillField;
window.updateProjectField = updateProjectField;
window.downloadPDF = downloadPDF;
window.downloadWord = downloadWord;
window.downloadJSON = downloadJSON;
window.printResume = printResume;

console.log('Resume Builder JavaScript loaded successfully!');