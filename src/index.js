import "./styles.css";

const form = document.querySelector("#searchForm");
const input = document.querySelector("#query");
const loader = form.querySelector(".loader");
const locationsDiv = document.createElement("div");

function showLoader() {
  loader.classList.add("is-visible");
}

function hideLoader() {
  loader.classList.remove("is-visible");
}

// Add one function show?

const apiKey = "H9CXBS2KVNGA3AW4L8PF8PGK4";
const locAPIKey = "bd15706d81c640a398a191135262501";

//  Use DevTools to simulate network speeds with loader

// Default URL
const defaultURL = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/shanghai?unitGroup=metric&elements=add%3Atimezone%2Cadd%3Atzoffset%2Cremove%3Acloudcover%2Cremove%3Amoonphase%2Cremove%3Apressure%2Cremove%3Astations&include=days%2Chours%2Ccurrent%2Calerts%2Cevents&key=${apiKey}&contentType=json`;

// Add const loc = encodeURIComponent(location);
// Implement location variable inside link, otherwise default Shanghai
// Return data 

input.addEventListener("input", () => {
  if (!input.value.trim()) {
    hide(locationsDiv, "location");
  }
  const query = input.value.trim();
  
  if(query < 2) {
    return;
  }
  searchLocations(query);
});

async function searchLocations(query) {
  try {
    const res = await fetch(`http://api.weatherapi.com/v1/search.json?key=${locAPIKey}&q=${encodeURIComponent(query)}`);
    const locations = await res.json();

    showLocations(locations);
    console.log(locations);
  } catch (err) {
    // Add N/A
    console.log(err);
  }
}

function showLocations(locs) {
  locationsDiv.replaceChildren();
  
  if (locs.length === 0) {
    locationsDiv.classList.remove("location");
    return;
  }

  locs.forEach(loc => {
    const span = document.createElement("span");
    span.textContent = `${loc.name}, ${loc.country}`;
    locationsDiv.appendChild(span);
    span.classList.add("loc-span");
  });
  
  form.appendChild(locationsDiv);
  locationsDiv.classList.add("location");
}

// Get location value on click, pass to getWeather
locationsDiv.addEventListener("mousedown", (e) => {
  const span = e.target.closest(".loc-span");
  if (!span) return;
  
  e.preventDefault();
  
  const location = span.textContent.trim();
  getWeather(location);
  input.value = "";
  
  hide(locationsDiv, "location");
});

function hide(el, className) {
  el.replaceChildren();
  el.classList.remove(className);
}


async function getWeather(loc) {
  try {
    showLoader();
    const encodedLoc = encodeURIComponent(loc);
    const URL = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodedLoc}?unitGroup=metric&elements=add%3Aaddress%2Cadd%3Alatitude%2Cadd%3Alongitude%2Cadd%3AresolvedAddress%2Cadd%3Atimezone%2Cadd%3Atzoffset%2Cremove%3Acloudcover%2Cremove%3Adew%2Cremove%3Afeelslikemax%2Cremove%3Afeelslikemin%2Cremove%3Amoonphase%2Cremove%3Aprecipcover%2Cremove%3Apressure%2Cremove%3Asevererisk%2Cremove%3Asnow%2Cremove%3Asnowdepth%2Cremove%3Asolarenergy%2Cremove%3Asolarradiation%2Cremove%3Astations%2Cremove%3Auvindex%2Cremove%3Avisibility%2Cremove%3Awinddir%2Cremove%3Awindgust&include=days%2Chours%2Ccurrent%2Calerts%2Cevents&key=${apiKey}&contentType=json`;
    const response = await fetch(URL);
    const weatherData = await response.json();
    console.log(weatherData);
    console.log(weatherData.address);
    // Add fn that takes in data and hydrates fields
    hideLoader();
  } catch (err) {
    // Add N/A
    hideLoader();
    console.log(err);
  }
}
