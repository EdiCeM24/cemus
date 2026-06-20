const questions = document.querySelectorAll(".questions");

// SUCCESS AND ERROR MESSAGES
const successBtns = document.querySelectorAll("success-btn");
const successMsg = document.getElementById("success_msg");
const errorBtn = document.querySelectorAll("error-Btn");
const errorMsg = document.getElementById("error_msg");
const errorEl = document.querySelectorAll("errorEl");
const errorMsgEl = document.getElementById("error_msge");

successBtns.forEach((successBtn) => {
  successBtn.addEventListener("click", successmessage);
});

function successmessage() {
  if (successMsg) {
    successMsg.style.display = "block";
  } else {
    setTimeout(() => {
      successMsg.style.display = "none";
    }, 10000);
  }
}

errorBtn.forEach((errorBtns) => {
  errorBtns.addEventListener("click", () => {
    if (errorMsg) {
      errorMsg.style.display = "block";
    } else {
      setTimeout(() => {
        errorMsg.style.visibility = "hiden";
      }, 10000);
    }
  });
});

errorEl.forEach((errorElem) => {
  errorElem.addEventListener("click", () => {
    if (errorMsgEl) {
      errorMsgEl.style.display = "block";
    } else {
      setTimeout(() => {
        errorMsgEl.style.display = "none";
      }, 10000);
    }
  });
});

questions.forEach((question) => {
  question.addEventListener("click", appQuestions);
});

function appQuestions() {
  return alert("Are you serious about this?");
}

appQuestions();

// HOME PAGE VIEW --> PROJECTS PAGE REDIRECT URL
const viewProject = document.querySelector("#view-projects");

// HOME PAGE VIEW --> PROJECTS PAGE REDIRECT URL
viewProject.addEventListener("click", () => {
  // const url = (location.href = "/api/v1/homes/projects");
  // alert(url);
  try {
    const clickHandler = async () => {
      const response = await fetch("/api/v1/homes/projects");
      const data = await response.url;
      // console.log("I have been clicked!: ", data);
      await setTimeout(() => {
        location.href = data;
      }, 1000);
    };

    clickHandler();
  } catch (error) {
    console.error(error);
  }
});

// HOME PAGE --> CV DOWNLOADS
const cvBtn = document.getElementById("cv-btn");

cvBtn.addEventListener("click", () => {
  alert("I have been downloaded!");
  const url = "";
});

// HOME PAGE VIEW --> ABOUT PAGE REDIRECT URL
const aboutMe = document.getElementById("about-me");

aboutMe.addEventListener("click", () => {
  try {
    const urlHandler = async () => {
      const urlResponse = await fetch("/api/v1/homes/about");
      const data = await urlResponse.url;

      setTimeout(() => {
        location.href = data;
      }, 1000);
    };

    urlHandler();
  } catch (error) {
    console.error(error);
  }
});

// HOME PAGE VIEW CONTACT ME --> CONTACT PAGE REDIRECT URL
const contactMe = document.getElementById("contact-me");

contactMe.addEventListener("click", () => {
  try {
    const contactClick = async () => {
      const navigateUrl = await fetch("/api/v1/contacts/contact");
      const response = await navigateUrl.url;

      alert(
        "Your click the promise button: also get the hire me button",
        response,
      );

      setTimeout(() => {
        location.href = response;
      }, 1000);
    };

    contactClick();
  } catch (error) {
    console.error(error);
  }
});
