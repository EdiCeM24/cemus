import { data } from "autoprefixer";
import { response } from "express";

const clickMe = document.querySelector(".signup-btn");

clickMe.addEventListener("click", app);

function app() {
  return alert("Are you serious about this?");
}

app();

const iconViewBtns = document.querySelectorAll(".signup_eye_icons");
const passwordInput = document.querySelector('input[name="password"]');

// passwordInput.forEach(inputElement => inputElement);

iconViewBtns.forEach((iconBtn) => {
  iconBtn.addEventListener("click", passwordText);
  function passwordText() {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      iconBtn.innerHTML =
        '<i class="fa fa-eye-slash absolute top-1 right-3 cursor-pointer" aria-hidden="false"></i>';

      iconBtn.classList.remove("i");
      iconBtn.classList.add("i");
    } else {
      passwordInput.type = "password";
      iconBtn.innerHTML =
        '<i class="fa fa-eye absolute top-1 right-3 cursor-pointer" aria-hidden="false"></i>';
      iconBtn.classList.add("i");
      iconBtn.classList.remove("i");
    }
  }
});

//
fetch("/api/v1/auth/sign-up", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ profile: req.file }),
})
  .then((response) => response.json())
  .then((data) => {
    if (data.status === 400 && data.error.include("profile")) {
      console.log("Profile is required");
    } else {
      console.log("Profile is upload successfully!");
    }
  })
  .catch((error) => {
    console.error(error);
  });
