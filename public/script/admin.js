// add hovered class to selected list item
const list = document.querySelectorAll(".container_navigation li");

function activateLink() {
  list.forEach((item) => {
    item.classList.remove("hovered");
  });

  this.classList.add("hovered");
}

list.forEach((item) => item.addEventListener("mouseover", activateLink));

// MENU TOGGLE TOPBAR MAIN
const toggleElem = document.querySelector(".toggle");
const navigationContainer = document.querySelector(".container_navigation");
const mainContainer = document.querySelector(".main_container");

toggleElem.onclick = function () {
  navigationContainer.classList.toggle("active");
  mainContainer.classList.toggle("active");
};

document.addEventListener("DOMContentLoaded", () => {
  const btnShow = document.getElementById("btn-show");
  const showElements = document.getElementById("show-elements");

  btnShow.addEventListener("mouseover", show);

  let timeFrame = new Date(Date.now() + 10 * 60 * 60 * 1000);

  function show() {
    if (showElements) {
      setTimeout(() => {
        showElements.style.display = "block";
      }, 1000);
    }
  }

  btnShow.addEventListener("mouseover", () => {
    if (showElements) {
      setTimeout(() => {
        showElements.style.display = "none";
      }, timeFrame);
    }
  });
});
