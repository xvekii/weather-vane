import "./styles.css";
import { 
  hide,
  hideLoader,
  showLoader,
  fillSearchInput,
  fillMainCardWeather,
  fillSecondaryCardWeather,
  showLocations,
  setWeatherIcon,

} from "./ui.js";

const WEATHER_API_KEY = "H9CXBS2KVNGA3AW4L8PF8PGK4";
const LOCATION_API_KEY = "bd15706d81c640a398a191135262501";

const form = document.querySelector("#searchForm");
const input = document.querySelector("#query");
const formLoader = form.querySelector(".loader");
const locationsDiv = document.createElement("div");

const mainCard = document.querySelector(".main-card");
const mainContentLeft = document.querySelector(".main-inner-content-left");

const hourlyTitle = document.querySelector(".hourly-title");
const hourly = document.querySelector(".hourly");

const hours = document.querySelector(".hours");
const hourlyIcons = document.querySelector(".hourly-icons");
const hourlyTemp = document.querySelector(".hourly-temp");
const hourlyTempMin = document.querySelector(".hourly-temp-min");
const hourlyTempMax = document.querySelector(".hourly-temp-max");
const hourlyPrecip = document.querySelector(".hourly-precip");


// Add one function show?

input.addEventListener("input", () => {
  if (!input.value.trim()) {
    hide(locationsDiv, "location");
    return;
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

    showLocations({ locations, locationsDiv, form });
    console.log(locations);
  } catch (err) {
    // Add N/A
    console.log(err);
  }
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

async function getWeather(loc) {
  try {
    showLoader(formLoader);
    const encodedLoc = encodeURIComponent(loc);
    const URL = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodedLoc}?unitGroup=metric&elements=add%3Aaddress%2Cadd%3Alatitude%2Cadd%3Alongitude%2Cadd%3AresolvedAddress%2Cadd%3Atimezone%2Cadd%3Atzoffset%2Cremove%3Acloudcover%2Cremove%3Adew%2Cremove%3Afeelslikemax%2Cremove%3Afeelslikemin%2Cremove%3Amoonphase%2Cremove%3Aprecipcover%2Cremove%3Apressure%2Cremove%3Asevererisk%2Cremove%3Asnow%2Cremove%3Asnowdepth%2Cremove%3Asolarenergy%2Cremove%3Asolarradiation%2Cremove%3Astations%2Cremove%3Auvindex%2Cremove%3Avisibility%2Cremove%3Awinddir%2Cremove%3Awindgust&include=days%2Chours%2Ccurrent%2Calerts%2Cevents&key=${WEATHER_API_KEY}&contentType=json`;
    const response = await fetch(URL);
    
    if (!response.ok) {
      hideLoader(formLoader);
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
    hideLoader(formLoader);
  } catch (err) {
    // Add N/A
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

  const fullTime = data.days[0].hours[0].datetime;
  const time = fullTime.slice(0, 5);


  // Hourly card - 0-23 hrs
  hours.textContent = time;
  // Get current datetime str
  const currentHrFull = data.currentConditions.datetime;
  const currentHrNum = Number(currentHrFull.slice(0, 2));
  console.log(currentHrNum);


  // Go through hrs array and start filling in from 1+ hr from that
  // data.days[0].hours.forEach(hr => {
  //   const hrInDay = hr.datetime;
  //   const hrInDayNum = Number(hrInDay.slice(0, 2));
  //   if (hrInDayNum > currentHrNum) {
  //     console.log(hrInDay);
  //   }
  // });

  // data.days[0].hours.forEach(hr => {
  //   const hrInDay = hr.datetime;
  //   const hrInDayNum = Number(hrInDay.slice(0, 2));
  //   console.log(hrInDay);
  
  // });


  // data.days[0].hours[0].icon
  // data.days[0].hours[0].precip
  // data.days[0].hours[0].tempmin
  // data.days[0].hours[0].tempmax
  
  // Daily card - 0-14 days
  // data.days[0].datetime
  // data.days[0].icon
  // data.days[0].precipprob
  // data.days[0].tempmin
  // data.days[0].tempmax

}

function createRow() {
  // Create div wrapper, add class hourly row
  const rowWrapper = document.createElement("div");
  rowWrapper.classList.add("hourly-wrap", "row");

  // Append to rowWrapper
  const hours = document.createElement("span");
  hours.classList.add("hours");

  const hourlyIcon = document.createElement("img");
  hours.classList.add("hourly-icon");
  // Add spans, div with 2 spans and append it to rowWrapper

  const hourlyTempWrapper = document.createElement("span");
  hourlyTempWrapper.classList.add("hourly-temp-wrap");

  const hourlyTempMin = document.createElement("span");
  hours.classList.add("hourly-temp-min");

  const hourlyTempMax = document.createElement("span");
  hours.classList.add("hourly-temp-max");

  const hourlyPrecipWrapper = document.createElement("span");
  hours.classList.add("hourly-precip-wrap");

  const hourlyPrecipIcon = document.createElement("span");
  hours.classList.add("hourly-precip-icon");
  
  const hourlyPrecip = document.createElement("span");
  hours.classList.add("hourly-precip");

  hourlyPrecipWrapper.append(hourlyPrecipIcon, hourlyPrecip);
  hourlyTempWrapper.append(hourlyTempMin, hourlyTempMax);
  rowWrapper.append(hours, hourlyIcon, hourlyTempWrapper, hourlyPrecipWrapper);

  return rowWrapper;
  // removeChildren, Append rowWrapper to hourly-card-inner,
}

// function fillRowData() {
    // fill in alt with weather icon name
// }



getWeather("Đurđevac, Croácia");
