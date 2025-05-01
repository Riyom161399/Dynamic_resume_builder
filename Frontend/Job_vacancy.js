const jobs = [
    {
      title: "Frontend Developer",
      company: "TechNova Ltd.",
      location: "Dhaka",
      skills: "HTML, CSS, JavaScript, React"
    },
    {
      title: "UI/UX Designer",
      company: "SoftLayer",
      location: "Remote",
      skills: "Figma, Adobe XD"
    },
    {
      title: "Backend Developer",
      company: "CodeCraft",
      location: "Chattogram",
      skills: "Node.js, Express, MongoDB"
    }
  ];
  
  function displayJobs(filter = "") {
    const jobSection = document.querySelector(".job-section");
  
    // Remove old job cards
    jobSection.querySelectorAll(".job-card").forEach(card => card.remove());
  
    jobs.forEach(job => {
      if (job.skills.toLowerCase().includes(filter.toLowerCase())) {
        const card = document.createElement("div");
        card.className = "job-card";
        card.innerHTML = `
          <h3>${job.title}</h3>
          <p><strong>Company:</strong> ${job.company}</p>
          <p><strong>Location:</strong> ${job.location}</p>
          <p><strong>Skills Required:</strong> ${job.skills}</p>
          <button>Apply Now</button>
        `;
        jobSection.appendChild(card);
      }
    });
  }
  
  window.onload = () => {
    const filterInput = document.getElementById("skillFilter");
    displayJobs();
  
    filterInput.addEventListener("input", () => {
      displayJobs(filterInput.value);
    });
  };
  