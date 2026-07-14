// CONTACT FORM VISIBILITY
const hireMe = document.querySelector(".hire-me");
const contactFormContainer = document.querySelector(".contact_form_container");

// CONTACT FORM VISIBILITY
hireMe.addEventListener("click", () => {
  if (contactFormContainer) {
    contactFormContainer.classList.remove("show");
    contactFormContainer.classList.toggle("show");
    document.body.style.overflow = "auto";
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

//Form Removal BTN
const contactFormCancel = document.getElementById("contact-form-cancel");
const contactFormContainerElem = document.querySelector(
  ".contact_form_container",
);

contactFormCancel.addEventListener("click", () => {
  contactFormContainerElem.style.display = "flex";
  if (contactFormContainerElem) {
    contactFormContainerElem.style.display = "none";
  }
});

// End of Form Removal BTN
