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


let darkmode = localStorage.getItem("darkmode") || "inactive";
if (darkmode === "active") {
  enableDarkmode(themeBtn);
}

let units = localStorage.getItem("units") || "metric";
unitsBtn.dataset.units = units;

handleGetWeather(
  localStorage.getItem("lastLocation") || undefined,
  localStorage.getItem("units") || undefined
);

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
  handleGetWeather(location, units);
  input.value = "";
  
  hide(locationsDiv, "location");
});

settingsMenuBtn.addEventListener("click", () => {
  if (darkmode === "active") {
    themeBtn.textContent = "Dark theme";
    setWeatherIcon({ iconName: "dark-mode", iconRef: themeIcon, iconCont: themeBtn });
  } else {
    themeBtn.textContent = "Light theme";
    setWeatherIcon({ iconName: "light-mode", iconRef: themeIcon, iconCont: themeBtn });
  }

  // Get units from LS
  // Set attr 
  const currUnits = localStorage.getItem("units");
  unitsBtn.dataset.units = currUnits;

  if (currUnits === "us") {
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
    darkmode = localStorage.getItem("darkmode");
    darkmode !== "active" ? enableDarkmode(themeBtn) : disableDarkmode(themeBtn);
  }

  if (clicked.closest(".units-btn")) {
    let unitsBtnCurrAttr = unitsBtn.dataset.units;
    
    if (unitsBtnCurrAttr === "us") {
      unitsBtn.dataset.units = "metric";
      unitsBtnTxt.textContent = METRIC;
      localStorage.setItem("units", "metric");
    } else {
      unitsBtn.dataset.units = "us";
      unitsBtnTxt.textContent = IMPERIAL;
      localStorage.setItem("units", "us");
    }
  
    handleGetWeather(
      localStorage.getItem("lastLocation"),
      localStorage.getItem("units")
    );
  }
});

async function handleGetWeather(loc, units) {
  try {
    showLoader(formLoader);
    const weatherData = await getWeather(loc, units);
    localStorage.setItem("lastLocation", loc);

    console.log(weatherData);
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