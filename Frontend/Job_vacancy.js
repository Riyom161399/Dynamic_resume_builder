document.addEventListener("DOMContentLoaded", () => {
  console.log("Job_vacancy.js is running");

  const apiUrl = '/api/jobs';

  function displayJobs(jobs, filter = "") {
    const jobSection = document.querySelector(".job-section");
    jobSection.querySelectorAll(".job-card").forEach(card => card.remove());

    if (!Array.isArray(jobs)) {
      const errorMsg = document.createElement("div");
      errorMsg.textContent = "No jobs found or failed to load jobs.";
      jobSection.appendChild(errorMsg);
      return;
    }

    let count = 0;

    jobs.forEach(job => {
      const skills = Array.isArray(job.categories) && job.categories.length > 0
  ? job.categories.join(", ").replace(/-/g, " ")
  : "Not specified";
      const location = job.locationRestrictions?.join(", ") || "Remote";
      const matchText = `${job.title} ${job.companyName} ${skills}`.toLowerCase();
     if (matchText.includes(filter.toLowerCase())) {
        const card = document.createElement("div");
        card.className = "job-card";
        card.innerHTML = `
          <h3>${job.title}</h3>
          <p><strong>Company:</strong> ${job.companyName}</p>
          <p><strong>Type:</strong> ${job.employmentType}</p>
          <p><strong>Location:</strong> ${location}</p>
          <p><strong>Skills Required:</strong> ${skills}</p>
          <a href="${job.applicationLink}" target="_blank">
            <button>Apply Now</button>
          </a>
        `;
        jobSection.appendChild(card);
        count++;
      }
    });

    if (count === 0) {
      const noMatch = document.createElement("p");
      noMatch.className = "no-match";
      jobSection.appendChild(noMatch);
    }
  }

  const filterInput = document.getElementById("skillFilter");

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      if (!data.jobs) {
        console.error("Unexpected API response:", data);
        return;
      }

      console.log("Loaded jobs:", data.jobs.slice(0, 3));
      window.jobs = data.jobs;
      displayJobs(window.jobs);

      filterInput.addEventListener("input", () => {
        displayJobs(window.jobs, filterInput.value);
      });
    })
    .catch(error => {
      console.error('Error fetching jobs:', error);
    });
});
