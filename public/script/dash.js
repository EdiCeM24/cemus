// HEADER NAV BOTTOM BORDER
const navLinks = document.querySelectorAll(".nav-link");

// HEADER NAVIGATION BOTTOM BORDER
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    // Remove active class from all links
    navLinks.forEach((nav) => nav.classList.remove("active"));
    // Add active class to clicked link
    link.classList.add("active");
  });
});

// function app() {
//   return alert("Are you serious about this?");
// }

// app();
