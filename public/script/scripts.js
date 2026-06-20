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
