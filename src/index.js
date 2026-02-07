import "./styles.css";
import { 
  hide,
  hideLoader,
  showLoader,
  fillSearchInput,
  fillMainCardWeather,
  fillSecondaryCardWeather,
  fillHourlyCardWeather,
  showLocations,
  setWeatherIcon,
} from "./ui.js";
import { searchLocations, getWeather } from "./api.js";

const form = document.querySelector("#searchForm");
const input = document.querySelector("#query");
const formLoader = form.querySelector(".loader");
const locationsDiv = document.createElement("div");

const mainCard = document.querySelector(".main-card");
const mainContentLeft = document.querySelector(".main-inner-content-left");

const mainContentRight = document.querySelector(".main-inner-content-right");
const mainWeatherIcon = document.querySelector(".main-weather-img");

const hourlyTitle = document.querySelector(".hourly-title");
const hourly = document.querySelector(".hourly");

const hours = document.querySelector(".hours");
const hourlyIcons = document.querySelector(".hourly-icons");
const hourlyTemp = document.querySelector(".hourly-temp");
const hourlyTempMin = document.querySelector(".hourly-temp-min");
const hourlyTempMax = document.querySelector(".hourly-temp-max");
const hourlyPrecip = document.querySelector(".hourly-precip");


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
  


  // Hourly card - 0-23 hrs
  // hours.textContent = time;
  // // Get current datetime str
  // const currentHrFull = data.currentConditions.datetime;
  // const currentHrNum = Number(currentHrFull.slice(0, 2));
  // console.log(currentHrNum);

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





// function fillRowData() {
    // fill in alt with weather icon name
// }



handleGetWeather("Đurđevac, Croácia");
