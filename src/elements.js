export const createDiv = ({ classes }) => {
  const div = document.createElement("div");
  div.classList.add(...classes);
  return div;
}

export const createSpan = ({ classes, imgSrc, imgClass, imgAlt }) => {
  const span = document.createElement("span");
  span.classList.add(...classes);

  if (imgSrc) {
    const image = document.createElement("img");
    if (imgClass) {
      image.classList.add(imgClass);
    }
    image.src = imgSrc;
    image.alt = imgAlt;
    span.appendChild(image);
  }
  return span;
}

export const createImg = ({ classes, imgSrc, imgAlt }) => {
  const img = document.createElement("img");
  if (classes.length) {
    img.classList.add(...classes);
  }
  if (imgSrc) {
    img.src = imgSrc;
  }
  if (imgAlt) {
    img.alt = imgAlt;
  }
  return img;
}