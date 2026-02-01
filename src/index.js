import "./styles.css";

const CELSIUS = "C";
const FAHRENHEIT = "F";
const KMH = "km/h";
const MPH = "m/h";

const WEATHER_API_KEY = "H9CXBS2KVNGA3AW4L8PF8PGK4";
const LOCATION_API_KEY = "bd15706d81c640a398a191135262501";

const form = document.querySelector("#searchForm");
const input = document.querySelector("#query");
const loader = form.querySelector(".loader");
const locationsDiv = document.createElement("div");

const mainCard = document.querySelector(".main-card");
const mainContentLeft = document.querySelector(".main-inner-content-left");
const mainTempNum = document.querySelector(".main-temp-num");
const mainFeelsLike = document.querySelector(".main-feels-like");

const mainContentRight = document.querySelector(".main-inner-content-right");
const mainWeatherIcon = document.querySelector(".main-weather-img");
const mainWeatherTxt = document.querySelector(".main-weather-txt");

const humidityVal = document.querySelector(".humidity-val");
const windspeedVal = document.querySelector(".windspeed-val");
const sunriseVal = document.querySelector(".sunrise-val");
const sunsetVal = document.querySelector(".sunset-val");

function showLoader() {
  loader.classList.add("is-visible");
}

function hideLoader() {
  loader.classList.remove("is-visible");
}

// Add one function show?

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
    const res = await fetch(`http://api.weatherapi.com/v1/search.json?key=${LOCATION_API_KEY}&q=${encodeURIComponent(query)}`);
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
    const URL = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodedLoc}?unitGroup=metric&elements=add%3Aaddress%2Cadd%3Alatitude%2Cadd%3Alongitude%2Cadd%3AresolvedAddress%2Cadd%3Atimezone%2Cadd%3Atzoffset%2Cremove%3Acloudcover%2Cremove%3Adew%2Cremove%3Afeelslikemax%2Cremove%3Afeelslikemin%2Cremove%3Amoonphase%2Cremove%3Aprecipcover%2Cremove%3Apressure%2Cremove%3Asevererisk%2Cremove%3Asnow%2Cremove%3Asnowdepth%2Cremove%3Asolarenergy%2Cremove%3Asolarradiation%2Cremove%3Astations%2Cremove%3Auvindex%2Cremove%3Avisibility%2Cremove%3Awinddir%2Cremove%3Awindgust&include=days%2Chours%2Ccurrent%2Calerts%2Cevents&key=${WEATHER_API_KEY}&contentType=json`;
    const response = await fetch(URL);
    
    if (!response.ok) {
      hideLoader();
      throw new Error(`Response status: ${response.status}`);
    }

    const weatherData = await response.json();
    console.log(weatherData);
    setWeatherData(weatherData);

    const currentWeatherIcon = weatherData.currentConditions.icon;
    console.log(currentWeatherIcon);
    
    if (currentWeatherIcon) {
      setWeatherIcon(currentWeatherIcon);
    } else {
      // Add N/A
      console.log("Icon error");
    }
    hideLoader();
  } catch (err) {
    // Add N/A
    hideLoader();
    console.log(err);
  }
}

function setWeatherData(data) {
  const temp = data.currentConditions.temp;
  const displayTemp = Math.round(temp);
  const humidity = data.currentConditions.humidity;
  const windSpeed = data.currentConditions.windspeed;
  const sunriseTime = data.currentConditions.sunrise;
  const sunrise = sunriseTime.slice(0, 5);
  const sunsetTime = data.currentConditions.sunset;
  const sunset = sunsetTime.slice(0, 5);

  input.value = data.address;

  // Main card
  const feelsLike = data.currentConditions.feelslike;
  const displayFeelsLike = Math.round(feelsLike);

  mainWeatherTxt.textContent = data.currentConditions.conditions;
  mainTempNum.textContent = `${displayTemp}°`;
  mainFeelsLike.textContent = `Feels like ${displayFeelsLike}°`;

  // Secondary card
  humidityVal.textContent = `${humidity}%`;
  windspeedVal.textContent = `${windSpeed} ${KMH}`;
  sunriseVal.textContent = sunrise;
  sunsetVal.textContent = sunset;

  // Hourly card - 0-23 hrs
  // data.days[0].hours[0].datetime
  // data.days[0].hours[0].icon
  // data.days[0].hours[0].precipprob
  // data.days[0].hours[0].tempmin
  // data.days[0].hours[0].tempmax
  
  // Daily card - 0-14 days
  // data.days[0].datetime
  // data.days[0].icon
  // data.days[0].precipprob
  // data.days[0].tempmin
  // data.days[0].tempmax

}

function setWeatherIcon(iconName) {
  import(`./assets/images/${iconName}.svg`)
    .then((images) => {
      mainWeatherIcon.src = images.default;
      mainContentRight.appendChild(mainWeatherIcon);
    });
}

getWeather("Shanghai, China");