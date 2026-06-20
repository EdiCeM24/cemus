// add hovered class to selected list item
const list = document.querySelectorAll('.container_navigation li');

function activateLink() {
  list.forEach(item => {
    item.classList.remove('hovered');
  })

  this.classList.add('hovered');
}

list.forEach(item => item.addEventListener('mouseover', activateLink))





// MENU TOGGLE TOPBAR MAIN
const toggleElem = document.querySelector('.toggle');
const navigationContainer = document.querySelector('.container_navigation');
const mainContainer = document.querySelector('.main_container');


toggleElem.onclick = function() {
  navigationContainer.classList.toggle('active');
  mainContainer.classList.toggle('active');
}






