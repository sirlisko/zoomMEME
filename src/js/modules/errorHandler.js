function errorHandler(err) {
  const error = document.querySelector(".error");
  error.textContent = err.message;
  error.hidden = false;
}

export function clearError() {
  document.querySelector(".error").hidden = true;
}

export default errorHandler;
