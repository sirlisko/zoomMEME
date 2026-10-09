function errorHandler(err) {
  const error = document.querySelector(".error");
  error.textContent = err.message;
  error.hidden = false;
}

export default errorHandler;
