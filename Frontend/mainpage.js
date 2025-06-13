    // Global variables
      let currentTemplate = null;

      // Load template into editor
      function loadTemplate(templateId) {
        currentTemplate = templateId;
        
        // Hide templates view and show editor
        document.getElementById('templatesView').style.display = 'none';
        const editor = document.getElementById('cvEditor');
        editor.style.display = 'block';
        
        // Scroll to top
        window.scrollTo(0, 0);
        
        // Load different content based on template
        const editableCv = document.getElementById('editableCv');
        
        switch(templateId) {
          case 'template1':
            editableCv.innerHTML = `
              <h1 contenteditable="true">John Doe</h1>
              <div class="section">
                <h2>Professional Summary</h2>
                <p contenteditable="true">Experienced professional with 5+ years in the industry. Skilled in project management, team leadership, and strategic planning. Proven track record of delivering results and driving business growth.</p>
              </div>
              
              <div class="section">
                <h2>Work Experience</h2>
                <h3 contenteditable="true">Senior Project Manager</h3>
                <p contenteditable="true">ABC Company | 2018 - Present</p>
                <ul contenteditable="true">
                  <li>Lead cross-functional teams of 10+ members</li>
                  <li>Managed projects with budgets up to $2M</li>
                  <li>Improved operational efficiency by 30%</li>
                </ul>
                
                <h3 contenteditable="true">Project Coordinator</h3>
                <p contenteditable="true">XYZ Corporation | 2015 - 2018</p>
                <ul contenteditable="true">
                  <li>Coordinated project timelines and deliverables</li>
                  <li>Facilitated client communications</li>
                  <li>Implemented new tracking system</li>
                </ul>
              </div>
              
              <div class="section">
                <h2>Education</h2>
                <h3 contenteditable="true">MBA in Business Administration</h3>
                <p contenteditable="true">University of Business | 2013 - 2015</p>
                
                <h3 contenteditable="true">Bachelor of Science</h3>
                <p contenteditable="true">State University | 2009 - 2013</p>
              </div>
              
              <div class="section">
                <h2>Skills</h2>
                <ul contenteditable="true">
                  <li>Project Management</li>
                  <li>Team Leadership</li>
                  <li>Strategic Planning</li>
                  <li>Budget Management</li>
                  <li>Data Analysis</li>
                </ul>
              </div>
            `;
            break;
            
          case 'template2':
            editableCv.innerHTML = `
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 contenteditable="true" style="color: var(--primary-color); margin-bottom: 5px;">John Doe</h1>
                <p contenteditable="true" style="color: #666;">Creative Director | Photographer | Designer</p>
              </div>
              
              <div style="display: flex; gap: 30px;">
                <div style="flex: 1;">
                  <div class="section">
                    <h2>About Me</h2>
                    <p contenteditable="true">Innovative creative professional with a passion for visual storytelling. Specialized in branding, photography, and digital design. Always looking for new challenges and opportunities to create meaningful work.</p>
                  </div>
                  
                  <div class="section">
                    <h2>Experience</h2>
                    <h3 contenteditable="true">Creative Director</h3>
                    <p contenteditable="true">Design Studio | 2017 - Present</p>
                    <p contenteditable="true">Lead creative team and develop brand identities for clients.</p>
                    
                    <h3 contenteditable="true">Senior Designer</h3>
                    <p contenteditable="true">Advertising Agency | 2013 - 2017</p>
                    <p contenteditable="true">Created visual concepts for campaigns and marketing materials.</p>
                  </div>
                </div>
                
                <div style="flex: 1;">
                  <div class="section">
                    <h2>Skills</h2>
                    <ul contenteditable="true">
                      <li>Brand Identity</li>
                      <li>Photography</li>
                      <li>Adobe Creative Suite</li>
                      <li>Art Direction</li>
                      <li>UI/UX Design</li>
                    </ul>
                  </div>
                  
                  <div class="section">
                    <h2>Education</h2>
                    <h3 contenteditable="true">BFA in Graphic Design</h3>
                    <p contenteditable="true">Art Institute | 2009 - 2013</p>
                  </div>
                  
                  <div class="section">
                    <h2>Contact</h2>
                    <p contenteditable="true">hello@johndoe.com</p>
                    <p contenteditable="true">(123) 456-7890</p>
                    <p contenteditable="true">portfolio.com/johndoe</p>
                  </div>
                </div>
              </div>
            `;
            break;
            
          case 'template3':
            editableCv.innerHTML = `
              <h1 contenteditable="true" style="border-bottom: none; text-align: center;">JOHN DOE</h1>
              <p contenteditable="true" style="text-align: center; color: #666; margin-bottom: 30px;">Software Engineer | San Francisco, CA</p>
              
              <div class="section">
                <h2>EXPERIENCE</h2>
                
                <div style="display: flex; margin-bottom: 15px;">
                  <div style="width: 120px; flex-shrink: 0;">
                    <p contenteditable="true">2019 - Present</p>
                  </div>
                  <div>
                    <h3 contenteditable="true">Senior Software Engineer</h3>
                    <p contenteditable="true">Tech Company Inc.</p>
                    <ul contenteditable="true">
                      <li>Developed scalable web applications using React and Node.js</li>
                      <li>Led team of 5 engineers in agile environment</li>
                      <li>Improved system performance by 40%</li>
                    </ul>
                  </div>
                </div>
                
                <div style="display: flex; margin-bottom: 15px;">
                  <div style="width: 120px; flex-shrink: 0;">
                    <p contenteditable="true">2016 - 2019</p>
                  </div>
                  <div>
                    <h3 contenteditable="true">Software Engineer</h3>
                    <p contenteditable="true">Startup Labs</p>
                    <ul contenteditable="true">
                      <li>Built MVP for SaaS product</li>
                      <li>Implemented CI/CD pipeline</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div class="section">
                <h2>EDUCATION</h2>
                <div style="display: flex;">
                  <div style="width: 120px; flex-shrink: 0;">
                    <p contenteditable="true">2012 - 2016</p>
                  </div>
                  <div>
                    <h3 contenteditable="true">B.S. Computer Science</h3>
                    <p contenteditable="true">University of Technology</p>
                  </div>
                </div>
              </div>
              
              <div class="section">
                <h2>SKILLS</h2>
                <p contenteditable="true">JavaScript, Python, React, Node.js, AWS, Docker, SQL</p>
              </div>
            `;
            break;
            
          case 'template4':
            editableCv.innerHTML = `
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                <div>
                  <h1 contenteditable="true">John Doe</h1>
                  <p contenteditable="true" style="color: #666;">Chief Financial Officer</p>
                </div>
                <div style="text-align: right;">
                  <p contenteditable="true">johndoe@email.com</p>
                  <p contenteditable="true">(123) 456-7890</p>
                  <p contenteditable="true">linkedin.com/in/johndoe</p>
                </div>
              </div>
              
              <div class="section">
                <h2>EXECUTIVE PROFILE</h2>
                <p contenteditable="true">Results-driven financial executive with 15+ years of experience in corporate finance, strategic planning, and business development. Proven ability to drive profitability and operational efficiency in complex organizations.</p>
              </div>
              
              <div class="section">
                <h2>PROFESSIONAL EXPERIENCE</h2>
                
                <h3 contenteditable="true">CHIEF FINANCIAL OFFICER</h3>
                <p contenteditable="true">Global Corporation Inc. | 2015 - Present</p>
                <ul contenteditable="true">
                  <li>Oversaw all financial operations for $500M revenue company</li>
                  <li>Led successful IPO raising $150M in capital</li>
                  <li>Implemented cost-saving initiatives saving $20M annually</li>
                </ul>
                
                <h3 contenteditable="true">VICE PRESIDENT OF FINANCE</h3>
                <p contenteditable="true">National Enterprises | 2010 - 2015</p>
                <ul contenteditable="true">
                  <li>Managed financial planning and analysis team</li>
                  <li>Developed financial models for strategic initiatives</li>
                </ul>
              </div>
              
              <div class="section">
                <h2>EDUCATION & CREDENTIALS</h2>
                <p contenteditable="true">MBA, Harvard Business School</p>
                <p contenteditable="true">CPA (Certified Public Accountant)</p>
                <p contenteditable="true">CFA (Chartered Financial Analyst)</p>
              </div>
            `;
            break;
        }
      }

      // Back to templates view
      function backToTemplates() {
        document.getElementById('templatesView').style.display = 'block';
        document.getElementById('cvEditor').style.display = 'none';
      }

      // Chat functionality
      function handleKeyPress(event) {
        if (event.key === 'Enter') {
          sendMessage();
        }
      }

      async function sendMessage() {
        const input = document.getElementById('userInput');
        const chat = document.getElementById('chat');
        const userText = input.value.trim();

        if (!userText) return;

        // Add user message to chat
        const userMessage = document.createElement('div');
        userMessage.classList.add('message', 'user-message');
        userMessage.textContent = userText;
        chat.appendChild(userMessage);

        // Clear input
        input.value = '';

        // Add temporary bot message
        const botMessage = document.createElement('div');
        botMessage.classList.add('message', 'bot-message');
        botMessage.textContent = '...';
        chat.appendChild(botMessage);
        
        // Scroll to bottom
        chat.scrollTop = chat.scrollHeight;

        // Simulate AI response (in a real app, you would call an API)
        setTimeout(() => {
          const responses = [
            "I recommend using the Professional template for corporate jobs.",
            "The Creative template would work well for design positions.",
            "For technical roles, the Minimal template is often preferred.",
            "Executive-level positions typically use the Executive template.",
            "Remember to tailor your resume to each job application.",
            "Highlight your most relevant experience at the top.",
            "Use bullet points to make your achievements stand out.",
            "Quantify your accomplishments where possible (e.g., 'Increased sales by 30%')."
          ];
          
          const randomResponse = responses[Math.floor(Math.random() * responses.length)];
          botMessage.textContent = randomResponse;
          chat.scrollTop = chat.scrollHeight;
        }, 1000);
      }

      // Initialize the app
      document.addEventListener('DOMContentLoaded', function() {
        // Add any initialization code here
      });