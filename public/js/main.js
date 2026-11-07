import { error } from "winston";

document.addEventListener("DOMContentLoaded", () => {
  const sidebarToggle = document.getElementById("sidebarToggle");
  const sidebar = document.getElementById("sidebar");

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      sidebar.classList.toggle("-translate-x-full");
    });

    // Close mobile menu gracefully if clicking content outside main sidebar element
    document.addEventListener("click", (e) => {
      if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
        sidebar.classList.add("-translate-x-full");
      }
    });
  }
});

// FOR USERS.EJS USERS VIEW
function showUserDetails(id) {
  fetch(`/user-details/${id}`)
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("user-details").innerHTML = html;
    })
    .catch((error) => console.error(error));
}
