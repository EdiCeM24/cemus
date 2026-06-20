// CONTACT FORM VISIBILITY
const hireMe = document.querySelector(".hire-me");
const contactFormContainer = document.querySelector(".contact_form_container");

// CONTACT FORM VISIBILITY
hireMe.addEventListener("click", () => {
  if (contactFormContainer) {
    contactFormContainer.classList.toggle("show");
  }
});

window.addEventListener("click", (event) => {
  // event.preventDefault();
  if (
    !event.target.closest(".contact_form_container") &&
    event.target !== hireMe
  ) {
    contactFormContainer.classList.remove("show");
  }
});
