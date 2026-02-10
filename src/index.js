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

const form = document.querySelector("#searchForm");
const input = document.querySelector("#query");
const formLoader = form.querySelector(".loader");
const locationsDiv = document.createElement("div");
const settingsMenuBtn = document.querySelector(".settings-menu-btn");
const settingsMenu = document.querySelector(".settings-menu");

const mainCard = document.querySelector(".main-card");
const mainContentLeft = document.querySelector(".main-inner-content-left");

const mainContentRight = document.querySelector(".main-inner-content-right");
const mainWeatherIcon = document.querySelector(".main-weather-img");

const themeBtn = document.querySelector(".theme-btn");
const tempUnitsBtn = document.querySelector(".temp-units-btn");
const speedUnitsBtn = document.querySelector(".speed-units-btn");

let darkmode = localStorage.getItem("darkmode");

if (darkmode === "active") {
  enableDarkmode(themeBtn);
} 

// Add one function show?

input.addEventListener("input", async () => {
  if (!input.value.trim()) {
    hide(locationsDiv, "location");
    return;
  }
  const query = input.value.trim();
  
  if(query < 2) {
    return;
  }
  const locations = await searchLocations(query);
  showLocations({ locations, locationsDiv, form });
  console.log(locations);
});

// Get location value on click, pass to getWeather
locationsDiv.addEventListener("mousedown", (e) => {
  const span = e.target.closest(".loc-span");
  if (!span) return;
  
  e.preventDefault();
  
  const location = span.textContent.trim();
  handleGetWeather(location);
  input.value = "";
  
  hide(locationsDiv, "location");
});

settingsMenuBtn.addEventListener("click", () => {
  const themeIcon = createImg({ classes: ["theme-icon"] });
  const tempUnitsIcon = createImg({ classes: ["temp-units-icon"] });
  const speedUnitsIcon = createImg({ classes: ["speed-units-icon"] });

  if (darkmode === "active") {
    themeBtn.textContent = "Dark theme";
    setWeatherIcon({ iconName: "dark-mode", iconRef: themeIcon, iconCont: themeBtn });
  } else {
    themeBtn.textContent = "Light theme";
    setWeatherIcon({ iconName: "light-mode", iconRef: themeIcon, iconCont: themeBtn });
  }

  tempUnitsBtn.textContent = "Fahrenheit";
  speedUnitsBtn.textContent = "mi/h";
  setWeatherIcon({ iconName: "degrees", iconRef: tempUnitsIcon, iconCont: tempUnitsBtn });
  setWeatherIcon({ iconName: "speed-unit", iconRef: speedUnitsIcon, iconCont: speedUnitsBtn });

  settingsMenu.classList.toggle("active");
});

settingsMenu.addEventListener("click", (e) => {
  const clicked = e.target;

  if (clicked.closest(".theme-btn")) {
    darkmode = localStorage.getItem("darkmode");
    darkmode !== "active" ? enableDarkmode(themeBtn) : disableDarkmode(themeBtn);
  }
});

async function handleGetWeather(loc) {
  try {
    showLoader(formLoader);
    const weatherData = await getWeather(loc);
    
    console.log(weatherData);
    setWeatherData(weatherData);

    const currentWeatherIcon = weatherData.currentConditions.icon;
    console.log(currentWeatherIcon);
    
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

handleGetWeather("Đurđevac, Croácia");
