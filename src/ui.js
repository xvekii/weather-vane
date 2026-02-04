export function showLoader(loader) {
  loader.classList.add("is-visible");
}

export function hideLoader(loader) {
  loader.classList.remove("is-visible");
}

export function fillSearchInput({ locationStr }, input) {
  input.value = locationStr;
}

