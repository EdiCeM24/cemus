Toastify({
  text: "This is a success toast!",
  duration: 3000,
  close: true,
  gravity: "top", // `top` or `bottom`
  position: "right", // `left`, `center` or `right`
  style: {
    background: "linear-gradient(to right, #00b09b, #96c93d)",
  },
}).showToast();

// Use EJS output syntax to check if the message array contains elements
// connect-flash returns an array, so check if length > 0
