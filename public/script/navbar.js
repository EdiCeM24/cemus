const navbarBtn = document.querySelector("#navbar-btn");
const navbarLinks = document.querySelector(".navbar-nav-links");
const navbarMobCloseBtn = document.querySelector("#navbar-mob-close-btn");

//
navbarBtn.addEventListener("click", () => {
  navbarLinks.classList.toggle("open");
});

navbarMobCloseBtn.addEventListener("click", () => {
  navbarLinks.classList.remove("open");
  navbarBtn.classList.toggle("open");
});
