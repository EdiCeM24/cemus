// HEADER NAV BOTTOM BORDER
const navLinks = document.querySelectorAll(".nav-link");

// SIDEBAR ADMIN
const dropdownBtns = document.querySelectorAll("#dropdown-btn");
const dropdownMenus = document.querySelectorAll("#dropdown-menu");

// HEADER NAVIGATION BOTTOM BORDER
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    // Remove active class from all links
    navLinks.forEach((nav) => nav.classList.remove("active"));
    // Add active class to clicked link
    link.classList.add("active");
  });
});

//
dropdownBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Remove active ID from all buttons
    dropdownBtns.forEach((button) => button.classList.remove("active"));
    // Add active ID to clicked button
    btn.classList.add("active");

    // Hide all dropdown menus
    dropdownMenus.forEach((menu) => menu.classList.remove("show"));

    const dropdownMenu = btn.parentNode.querySelector("#dropdown-menu");
    if (dropdownMenu) {
      dropdownMenu.classList.add("show");
    }
  });
});

// dropdownBtns.forEach((btn) => {
//   btn.addEventListener("click", () => {
//     const target = btn.dataset.target;
//     const menu = document.querySelector(target);

//     // Remove active class from all buttons
//     dropdownBtns.forEach((b) => b.classList.remove("active"));
//     // Add active class to clicked button
//     btn.classList.add("active");

//     // Hide all dropdown menus
//     dropdownMenus.forEach((men) => men.classList.remove("show"));
//     if (menu) {
//       menu.classList.add("show");
//     }
//   });
// });
