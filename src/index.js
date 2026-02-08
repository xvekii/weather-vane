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

settingsMenuBtn.addEventListener("mousedown", () => {
  const themeBtn = document.querySelector(".theme-btn");
  const tempUnitsBtn = document.querySelector(".temp-units-btn");
  const speedUnitsBtn = document.querySelector(".speed-units-btn");
  
  themeBtn.textContent = "Dark theme";
  tempUnitsBtn.textContent = "Fahrenheit";
  speedUnitsBtn.textContent = "mi/h";

  const themeIcon = createImg({ classes: ["theme-icon"] });
  const tempUnitsIcon = createImg({ classes: ["temp-units-icon"] });
  const speedUnitsIcon = createImg({ classes: ["speed-units-icon"] });

  setWeatherIcon({ iconName: "dark-mode", iconRef: themeIcon, iconCont: themeBtn });
  setWeatherIcon({ iconName: "degrees", iconRef: tempUnitsIcon, iconCont: tempUnitsBtn });
  setWeatherIcon({ iconName: "speed-unit", iconRef: speedUnitsIcon, iconCont: speedUnitsBtn });

  settingsMenu.classList.toggle("active");
});


// settingsMenu.replaceChildren();
  // const btn0Txt = ""

  // for (let i = 0; i < 3; i++) {
  //   const menuRow = document.createElement("div");
  //   menuRow.classList.add("settings-menu-row");

  //   const menuOptionsBtn = document.createElement("button");
  //   menuOptionsBtn.classList.add(`menu-options-btn${i}`);
  //   menuOptionsBtn.textContent = ""
  //   menuRow.append(menuOptionsBtn);

  //   settingsMenu.append(menuRow);
  // }

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





// function fillRowData() {
    // fill in alt with weather icon name
// }



handleGetWeather("Đurđevac, Croácia");
