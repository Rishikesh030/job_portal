// script.js

let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
let editingIndex = -1;

// Save jobs to localStorage and re-render
function saveJobs() {
  localStorage.setItem("jobs", JSON.stringify(jobs));
  renderJobs();
}

// Check if job is expired
function isExpired(expiryDate) {
  const today = new Date().toISOString().split("T")[0];
  return expiryDate < today;
}

// Render jobs as a table in admin panel
function renderJobs() {
  const jobList = document.getElementById("jobList");
  if (!jobList) return;

  if (jobs.length === 0 || jobs.every(job => isExpired(job.expiry))) {
    jobList.innerHTML = `<p style="padding:1rem;">No active jobs available.</p>`;
    return;
  }

  jobList.innerHTML = `
    <div style="overflow-x:auto;">
      <table style="width:100%; border-collapse:collapse;">
        <thead style="background:#f1f1f1;">
          <tr>
            <th style="padding:10px; border:1px solid #ddd;">Job ID</th>
            <th style="padding:10px; border:1px solid #ddd;">Title</th>
            <th style="padding:10px; border:1px solid #ddd;">Technology</th>
            <th style="padding:10px; border:1px solid #ddd;">Location</th>
            <th style="padding:10px; border:1px solid #ddd;">Experience</th>
            <th style="padding:10px; border:1px solid #ddd;">Org</th>
            <th style="padding:10px; border:1px solid #ddd;">Expiry</th>
            <th style="padding:10px; border:1px solid #ddd;">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${jobs.map((job, index) => {
            if (isExpired(job.expiry)) return "";

            return `
              <tr>
                <td style="padding:8px; border:1px solid #ddd;">${job.jobId}</td>
                <td style="padding:8px; border:1px solid #ddd;">${job.title}</td>
                <td style="padding:8px; border:1px solid #ddd;">${job.technology}</td>
                <td style="padding:8px; border:1px solid #ddd;">${job.location}</td>
                <td style="padding:8px; border:1px solid #ddd;">${job.experience}</td>
                <td style="padding:8px; border:1px solid #ddd;">${job.organization}</td>
                <td style="padding:8px; border:1px solid #ddd;">${job.expiry}</td>
                <td style="padding:8px; border:1px solid #ddd;">
               <button onclick="editJob(${index})" class="action-btn edit-btn">✏️ Edit</button>
<button onclick="deleteJob(${index})" class="action-btn delete-btn">🗑️ Delete</button>

                </td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

// Handle job form submission
const form = document.getElementById("jobForm");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const job = {
      jobId: document.getElementById("jobId").value.trim(),
      title: document.getElementById("title").value.trim(),
      location: document.getElementById("location").value.trim(),
      technology: document.getElementById("technology").value.trim(),
      experience: document.getElementById("experience").value.trim(),
      organization: document.getElementById("organization").value.trim(),
      email: document.getElementById("email").value.trim(),
      expiry: document.getElementById("expiry").value,
      description: document.getElementById("description").value.trim(),
    };

    if (editingIndex > -1) {
      jobs[editingIndex] = job;
      editingIndex = -1;
    } else {
      jobs.push(job);
    }

    form.reset();
    saveJobs();
  });
}

// Edit job
function editJob(index) {
  const job = jobs[index];
  document.getElementById("jobId").value = job.jobId;
  document.getElementById("title").value = job.title;
  document.getElementById("location").value = job.location;
  document.getElementById("technology").value = job.technology;
  document.getElementById("experience").value = job.experience;
  document.getElementById("organization").value = job.organization;
  document.getElementById("email").value = job.email;
  document.getElementById("expiry").value = job.expiry;
  document.getElementById("description").value = job.description;

  editingIndex = index;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Delete job
function deleteJob(index) {
  if (confirm("Are you sure you want to delete this job?")) {
    jobs.splice(index, 1);
    saveJobs();
  }
}

// Initial render
renderJobs();
