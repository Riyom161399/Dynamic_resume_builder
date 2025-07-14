document.addEventListener("DOMContentLoaded", () => {
  console.log("server_jobs.js is running");
  
  const apiUrl = '/api/jobs';

  function displayJobs(jobs, filter = "") {
    const jobSection = document.querySelector(".job-section");

    // Remove old job cards
    jobSection.querySelectorAll(".job-card").forEach(card => card.remove());

    if (!Array.isArray(jobs)) {
      // Optionally show an error message to the user
      const errorMsg = document.createElement("div");
      errorMsg.textContent = "No jobs found or failed to load jobs.";
      jobSection.appendChild(errorMsg);
      return;
    }

    let count = 0;

    jobs.forEach(job => {
      // Use 'tags' for skills, as per Remotive API
       const skills = job.tags && job.tags.length > 0 ? job.tags.join(", ") : "No tags"; 

      if (skills.toLowerCase().includes(filter.toLowerCase())) {
        const card = document.createElement("div");
        card.className = "job-card";
        card.innerHTML = `
          <h3>${job.title}</h3>
          <p><strong>Company:</strong> ${job.company_name}</p>
          <p><strong>Location:</strong> ${job.candidate_required_location}</p>
          <p><strong>Skills Required:</strong> ${skills}</p>
          <button>Apply Now</button>
        `;
        jobSection.appendChild(card);
        count++;
      }
    });

    if (count === 0) {
      const noMatch = document.createElement("p");
      noMatch.className = "no-match";
      noMatch.textContent = "No jobs match your filter.";
      jobSection.appendChild(noMatch);
    }
  }

  // Use only DOMContentLoaded event here, no need for window.onload
  const filterInput = document.getElementById("skillFilter");

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      console.log("API response:", data);
      console.log("First few jobs and their tags:", data.jobs.slice(0, 5).map(job => ({
    title: job.title,
    tags: job.tags
  }))); 
      window.jobs = data.jobs; // store jobs globally
      displayJobs(window.jobs);

      filterInput.addEventListener("input", () => {
        console.log("Filtering with:", filterInput.value); // Log the current filter value
        displayJobs(window.jobs, filterInput.value);
      });
    })
    .catch(error => {
      console.error('Error fetching jobs:', error);
    });
});
