const openPopupEl = document.getElementById("openPopup-btn");
const popupEl = document.getElementById("popup");
const closePopupEl = document.getElementById("closePopup");
let isFormVisible = false;

openPopupEl.addEventListener("click", () => {
  popupEl.classList.add("open-popup");
  openPopupEl.style.display = "none";
  setTimeout(() => {
    popupEl.style.display = "block";
  }, 1000);
  isFormVisible = true;
});

closePopupEl.addEventListener("click", () => {
  popupEl.style.display = "none";
  openPopupEl.style.display = "block";
});

// function closePopup() {
// }
