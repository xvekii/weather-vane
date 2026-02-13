import "./styles.css";
import { 
  hide,
  hideLoader,
  showLoader,
  fillSearchInput,
  fillMainCardWeather,
  fillSecondaryCardWeather,
  fillHourlyCardWeather,
  fillDailyCardWeather,
  showLocations,
  setWeatherIcon,
  enableDarkmode,
  disableDarkmode,
} from "./ui.js";
import { searchLocations, getWeather } from "./api.js";
import { createImg } from "./elements.js";

const METRIC = "°C, km/h";
const IMPERIAL = "°F, mph";

const form = document.querySelector("#searchForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();
});

const input = document.querySelector("#query");
const formLoader = form.querySelector(".loader");
const locationsDiv = document.createElement("div");
const settingsMenuBtn = document.querySelector(".settings-menu-btn");
const settingsMenu = document.querySelector(".settings-menu");

const mainContentRight = document.querySelector(".main-inner-content-right");
const mainWeatherIcon = document.querySelector(".main-weather-img");

const themeBtn = document.querySelector(".theme-btn");
const unitsBtn = document.querySelector(".units-btn");
const unitsBtnTxt = document.querySelector(".units-txt");

const themeIcon = createImg({ classes: ["theme-icon"] });
const unitsIcon = createImg({ classes: ["units-icon"] });

const defaultLoc = "Shanghai, China";


const darkmode = localStorage.getItem("darkmode") || "inactive";
if (darkmode === "active") {
  enableDarkmode(themeBtn);
}

let units = localStorage.getItem("units") || "metric";
unitsBtn.dataset.units = units;

handleGetWeather(
  localStorage.getItem("lastLocation") || defaultLoc,
  units
);

input.addEventListener("input", async () => {
  if (!input.value.trim()) {
    hide(locationsDiv, "location");
    return;
  }
  const query = input.value.trim();
  
  if (query.length < 2) {
    return;
  }
  const locations = await searchLocations(query);
  showLocations({ locations, locationsDiv, form });
});

input.addEventListener("blur", () => {
  setTimeout(() => {
    if (!input.value.trim()) {
      input.value = localStorage.getItem("lastLocation") || defaultLoc;
    }
  }, 200);
});

// Get location value on click, pass to getWeather
locationsDiv.addEventListener("click", (e) => {
  const span = e.target.closest(".loc-span");
  if (!span) return;
  
  e.preventDefault();
  
  const location = span.textContent.trim();
  handleGetWeather(location, units);
  input.value = "";
  
  hide(locationsDiv, "location");
});

settingsMenuBtn.addEventListener("click", () => {
  const activeDarkmode = localStorage.getItem("darkmode");
  if (activeDarkmode === "active") {
    themeBtn.textContent = "Dark mode";
    setWeatherIcon({ iconName: "dark-mode", iconRef: themeIcon, iconCont: themeBtn });
  } else {
    themeBtn.textContent = "Light mode";
    setWeatherIcon({ iconName: "light-mode", iconRef: themeIcon, iconCont: themeBtn });
  }

  // Get units from LS
  // Set attr 
  units = localStorage.getItem("units") || "metric";
  unitsBtn.dataset.units = units;

  if (units === "us") {
    unitsBtnTxt.textContent = IMPERIAL;
  } else {
    unitsBtnTxt.textContent = METRIC;
  }
  setWeatherIcon({ iconName: "units", iconRef: unitsIcon, iconCont: unitsBtn });

  settingsMenu.classList.toggle("active");
});

settingsMenu.addEventListener("click", (e) => {
  const clicked = e.target;

  if (clicked.closest(".theme-btn")) {
    const activeDarkmode = localStorage.getItem("darkmode");
    activeDarkmode !== "active" ? enableDarkmode(themeBtn) : disableDarkmode(themeBtn);
  }

  if (clicked.closest(".units-btn")) {
    let unitsBtnCurrAttr = unitsBtn.dataset.units;

    if (unitsBtnCurrAttr === "us") {
      units = "metric"; 
      unitsBtn.dataset.units = units;
      unitsBtnTxt.textContent = METRIC;
      localStorage.setItem("units", units);
    } else {
      units = "us";
      unitsBtn.dataset.units = "us";
      unitsBtnTxt.textContent = IMPERIAL;
      localStorage.setItem("units", "us");
    }
  
    handleGetWeather(
      localStorage.getItem("lastLocation") || defaultLoc,
      units
    );
  }
});

async function handleGetWeather(loc, units) {
  const location = loc || defaultLoc;
  const unitGroup = units || "metric";
  
  try {
    showLoader(formLoader);
    const weatherData = await getWeather(location, unitGroup);
    localStorage.setItem("lastLocation", location);

    setWeatherData(weatherData);
    const currentWeatherIcon = weatherData.currentConditions.icon;
    
    if (currentWeatherIcon) {
      setWeatherIcon({ iconName: currentWeatherIcon, iconRef: mainWeatherIcon, iconCont: mainContentRight });
    } else {
      console.log("Icon error");
    }
    hideLoader(formLoader);
  } catch (err) {
    hideLoader(formLoader);
    console.log(err);
  }
}

function setWeatherData(data) {
  fillSearchInput({ locationStr: data.address, input }); 

  fillMainCardWeather({
    temp: data.currentConditions.temp,
    currConditions: data.currentConditions.conditions,
    feelsLike: data.currentConditions.feelslike,
  });

  fillSecondaryCardWeather({ 
    humidity: data.currentConditions.humidity,
    windSpeed: data.currentConditions.windspeed,
    sunriseTime: data.currentConditions.sunrise,
    sunsetTime: data.currentConditions.sunset,
    alertsArr: data.alerts,
  });

  fillHourlyCardWeather({ data });
  fillDailyCardWeather({ data });
}