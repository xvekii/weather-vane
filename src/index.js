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

const apiKey = "H9CXBS2KVNGA3AW4L8PF8PGK4";
const locAPIKey = "bd15706d81c640a398a191135262501";

//  Use DevTools to simulate network speeds with loader

// Default URL
const defaultURL = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/shanghai?unitGroup=metric&elements=add%3Atimezone%2Cadd%3Atzoffset%2Cremove%3Acloudcover%2Cremove%3Amoonphase%2Cremove%3Apressure%2Cremove%3Astations&include=days%2Chours%2Ccurrent%2Calerts%2Cevents&key=${apiKey}&contentType=json`;

// Add const loc = encodeURIComponent(location);
// Implement location variable inside link, otherwise default Shanghai
// Return data 

// if backspace pressed, repopulate results

input.addEventListener("input", () => {
  if (!input.value.trim()) {
    locationsDiv.replaceChildren();
    locationsDiv.classList.remove("location");
  }
  
  const query = input.value.trim();
  
  if(query < 2) {
    return;
  }
  
  searchLocations(query);
});

async function searchLocations(query) {
  try {
    showLoader();
    const res = await fetch(`http://api.weatherapi.com/v1/search.json?key=${locAPIKey}&q=${encodeURIComponent(query)}`);
    const locations = await res.json();
    showLocations(locations);
    console.log(locations);
    hideLoader();
  } catch (err) {
    // Add N/A
    hideLoader();
    console.log(err);
  }
}

function showLocations(locs) {
  locationsDiv.replaceChildren();
  locs.forEach(loc => {
    const span = document.createElement("span");
    span.textContent = `${loc.name}, ${loc.country}`;
    locationsDiv.appendChild(span);
    span.classList.add("loc-span");
  });
  
  form.appendChild(locationsDiv);
  locationsDiv.classList.add("location");

}

function getLocation() {
  let inputVal = input.value;
  const loc = encodeURIComponent(inputVal);
  return loc.toLowerCase();
}

// Refactor to get value on click
// input.addEventListener("mousedown", (e) => {
//   if (e.key === "Enter") {
//     e.preventDefault();
//     const inputLoc = getLocation();
//     getWeather(inputLoc);
//   }
// });


async function getWeather(loc) {
  try {
    showLoader();
    // const URL = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${loc}?unitGroup=metric&elements=add%3Atimezone%2Cadd%3Atzoffset%2Cremove%3Acloudcover%2Cremove%3Amoonphase%2Cremove%3Apressure%2Cremove%3Astations&include=days%2Chours%2Ccurrent%2Calerts%2Cevents&key=${apiKey}&contentType=json`;
    const URL = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${loc}?unitGroup=metric&elements=add%3Aaddress%2Cadd%3Alatitude%2Cadd%3Alongitude%2Cadd%3AresolvedAddress%2Cadd%3Atimezone%2Cadd%3Atzoffset%2Cremove%3Acloudcover%2Cremove%3Adew%2Cremove%3Afeelslikemax%2Cremove%3Afeelslikemin%2Cremove%3Amoonphase%2Cremove%3Aprecipcover%2Cremove%3Apressure%2Cremove%3Asevererisk%2Cremove%3Asnow%2Cremove%3Asnowdepth%2Cremove%3Asolarenergy%2Cremove%3Asolarradiation%2Cremove%3Astations%2Cremove%3Auvindex%2Cremove%3Avisibility%2Cremove%3Awinddir%2Cremove%3Awindgust&include=days%2Chours%2Ccurrent%2Calerts%2Cevents&key=${apiKey}&contentType=json`;
    const response = await fetch(URL);
    const weatherData = await response.json();
    console.log(weatherData);
    console.log(weatherData.address);
    hideLoader();
  } catch (err) {
    // Add N/A
    hideLoader();
    console.log(err);
  }
}



// getWeather();