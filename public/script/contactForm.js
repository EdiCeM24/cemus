// CONTACT FORM VISIBILITY
const touchMeOut = document.querySelector(".touch_me_out");
const contactForm = document.querySelector(".contact_form");

// CONTACT FORM VISIBILITY
touchMeOut.addEventListener("click", () => {
  contactForm.classList.add("show");
  touchMeOut.style.display = "none";
});

window.addEventListener("click", (event) => {
  // event.preventDefault();
  if (!event.target.closest(".contact_form") && event.target !== touchMeOut) {
    contactForm.classList.remove("show"); // style.display = "none";
  }
});

//Form Removal BTN
const contactCancel = document.getElementById("contact-cancel");
const contactFormElem = document.querySelector(".contact_form");

contactCancel.addEventListener("click", (e) => {
  e.preventDefault();
  contactFormElem.classList.remove("show");
  setTimeout(() => {
    touchMeOut.style.display = "block";
  }, 300);
});
