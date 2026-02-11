import { createDiv, createSpan, createImg } from "./elements.js";

const CELS= "C";
const FAHR = "F";
const KMH = "km/h";
const MPH = "mph";

export function enableDarkmode(themeBtn) {
  if (themeBtn) showDarkmodeBtn(themeBtn);
  document.body.classList.add('dark');
  localStorage.setItem("darkmode", "active");
}

export function disableDarkmode(themeBtn) {
  if (themeBtn) showLightmodeBtn(themeBtn);
  document.body.classList.remove('dark');
  localStorage.setItem("darkmode", "inactive");
}

export function showDarkmodeBtn(themeBtn) {
  themeBtn.textContent = "Dark mode";
  const themeIcon = createImg({ classes: ["theme-icon"] });
  setWeatherIcon({ iconName: "dark-mode", iconRef: themeIcon, iconCont: themeBtn });
}

export function showLightmodeBtn(themeBtn) {
  themeBtn.textContent = "Light mode";
  const themeIcon = createImg({ classes: ["theme-icon"] });
  setWeatherIcon({ iconName: "light-mode", iconRef: themeIcon, iconCont: themeBtn });
}

export function showLoader(loader) {
  loader.classList.add("is-visible");
}

export function hideLoader(loader) {
  loader.classList.remove("is-visible");
}

function setUnits() {
  const currUnits = localStorage.getItem("units");
  return currUnits === "us" ? MPH : KMH;
}

export function fillSearchInput({ locationStr, input }) {
  input.value = locationStr;
}

export function fillMainCardWeather({ temp, currConditions, feelsLike, }) {
  const mainTempNum = document.querySelector(".main-temp-num");
  const mainFeelsLike = document.querySelector(".main-feels-like");
  const mainWeatherTxt = document.querySelector(".main-weather-txt");

  const units = setUnits();
  const tempUnits = units === MPH ? FAHR : CELS;

  
  // Main temp
  const displayTemp = Math.round(temp);
  mainTempNum.textContent = `${displayTemp}°`;

  // Feels like
  const feelsLikeRaw = feelsLike;
  const feelsLikeRound = Math.round(feelsLikeRaw);
  mainFeelsLike.textContent = `Feels like ${feelsLikeRound}°${tempUnits}`;

  // Current conditions
  mainWeatherTxt.textContent = currConditions;
}

export function fillSecondaryCardWeather({ 
  humidity, 
  windSpeed,
  sunriseTime,
  sunsetTime,
  alertsArr,
}) {
  const humidityVal = document.querySelector(".humidity-val");
  const windspeedVal = document.querySelector(".windspeed-val");
  const sunriseVal = document.querySelector(".sunrise-val");
  const sunsetVal = document.querySelector(".sunset-val");

  const severeAlertsTxt = document.querySelector(".severe-alerts-txt");
  const noAlerts = "There are no alerts issued at this time.";
  const sunrise = sunriseTime.slice(0, 5);
  const sunset = sunsetTime.slice(0, 5);

  const unit = setUnits();
  
  humidityVal.textContent = `${Math.round(humidity)}%`;
  windspeedVal.textContent = `${Math.round(windSpeed)} ${unit}`;
  sunriseVal.textContent = sunrise;
  sunsetVal.textContent = sunset;

  const alerts = alertsArr.length !== 0 ? alertsArr[0].description : noAlerts;
  severeAlertsTxt.textContent = alerts;
}

export function fillHourlyCardWeather({ data }) {
  const hourlyInnerContainer = document.querySelector(".hourly-card-inner-content");
  hourlyInnerContainer.replaceChildren();
  
  const timeNowHr = data.currentConditions.datetime;
  const timeSlicedHr = timeNowHr.slice(0, 2);
  const currentHour = Number(timeSlicedHr) + 2;

  let currDay = 0;
  let nextDay = 1;
  
  let dayHrs = 24;
  let currHr = currentHour;
  let ttlHrs = 0;

  for (currDay; currDay < nextDay; currDay++) {
    for (currHr; currHr < dayHrs; currHr++) {
      const {
        rowWrapper,
        hours,
        hourlyIconWrap,
        hourlyIcon,
        hourlyTemp,
        hourlyPrecipWrapper,
        hourlyPrecipIcon,
        hourlyPrecip,
      } = createHourlyRow();

      const fullTime = data.days[currDay].hours[currHr].datetime;
      const time = fullTime.slice(0, 5);
      const hrs = time;
      
      const icon = data.days[currDay].hours[currHr].icon;
      const precip = data.days[currDay].hours[currHr].precipprob;
      const temp = data.days[currDay].hours[currHr].temp;

      hours.textContent = hrs;

      setWeatherIcon({ iconName: icon, iconRef: hourlyIcon, iconCont: hourlyIconWrap });
      hourlyTemp.textContent = `${Math.round(temp)}°`;
      setWeatherIcon({ iconName: "precip", iconRef: hourlyPrecipIcon, iconCont: hourlyPrecipWrapper });
      hourlyPrecip.textContent = `${Math.round(precip)}%`;

      hourlyInnerContainer.append(rowWrapper);
      if (ttlHrs !== 24 ) ttlHrs++;
    }
    if (ttlHrs < dayHrs) {
      dayHrs = dayHrs - ttlHrs;
      nextDay = 2;
      currHr = 0;
      ttlHrs = 24;
    }
  }
}

export function fillDailyCardWeather({ data }) {
  const dailyInnerContainer = document.querySelector(".daily-card-inner-content");
  dailyInnerContainer.replaceChildren();
  const options = {
    weekday: "short",
  };
  
  data.days.forEach((day, idx) => {
    const {
      rowWrapper,
      dayOfWeek,
      dailyIconWrap,
      dailyIcon, 
      dailyTemp,
      dailyPrecipWrapper,
      dailyPrecipIcon,
      dailyPrecip,
    } = createDailyRow();
    
    const currDay = new Date(day.datetime);
    const currDayName = currDay.toLocaleDateString(undefined, options);

    const temp = day.temp;
    const icon = day.icon;
    const precip = day.precipprob;
    
    dayOfWeek.textContent = idx === 0 ? "Today" : currDayName;
    setWeatherIcon({ iconName: icon, iconRef: dailyIcon, iconCont: dailyIconWrap });
    dailyTemp.textContent = `${Math.round(temp)}°`;
    setWeatherIcon({ iconName: "precip", iconRef: dailyPrecipIcon, iconCont: dailyPrecipWrapper });
    dailyPrecip.textContent = `${Math.round(precip)}%`;

    dailyInnerContainer.append(rowWrapper);
  });
}


function createHourlyRow() {
  // Row wrapper
  const rowWrapper = createDiv({ classes: ["hourly-wrap", "row"] });

  // Hours
  const hours = createSpan({ classes: ["hours"] });

  const hourlyIconWrap = createSpan({
    classes: ["hourly-icon-wrap"],
  });

  const hourlyIcon = createImg({
    classes: ["hourly-icon"],
  });

  // Hourly temp
  const hourlyTemp = createSpan({ classes: ["hourly-temp"] });

  // Hourly precip
  const hourlyPrecipWrapper = createSpan({ classes: ["hourly-precip-wrap"] });
  const hourlyPrecipIcon = createImg({ classes: ["hourly-precip-icon"] });
  const hourlyPrecip = createSpan({ classes: ["hourly-precip"] });

  hourlyIconWrap.append(hourlyIcon);
  hourlyPrecipWrapper.append(hourlyPrecip);
  rowWrapper.append(hours, hourlyIconWrap, hourlyTemp, hourlyPrecipWrapper);

  return { 
    rowWrapper,
    hours,
    hourlyIconWrap,
    hourlyIcon, 
    hourlyTemp,
    hourlyPrecipWrapper,
    hourlyPrecipIcon,
    hourlyPrecip,
    };
}

function createDailyRow() {
  // Row wrapper
  const rowWrapper = createDiv({ classes: ["daily-wrap", "row"] });

  // Days
  const dayOfWeek = createSpan({ classes: ["day-of-week"] });

  const dailyIconWrap = createSpan({
    classes: ["daily-icon-wrap"],
  });

  const dailyIcon = createImg({
    classes: ["daily-icon"],
  });

  // Hourly temp
  const dailyTemp = createSpan({ classes: ["daily-temp"] });

  // Hourly precip
  const dailyPrecipWrapper = createSpan({ classes: ["daily-precip-wrap"] });
  const dailyPrecipIcon = createImg({ classes: ["daily-precip-icon"] });
  const dailyPrecip = createSpan({ classes: ["daily-precip"] });

  dailyIconWrap.append(dailyIcon);
  dailyPrecipWrapper.append(dailyPrecip);
  rowWrapper.append(dayOfWeek, dailyIconWrap, dailyTemp, dailyPrecipWrapper);

  return { 
    rowWrapper,
    dayOfWeek,
    dailyIconWrap,
    dailyIcon, 
    dailyTemp,
    dailyPrecipWrapper,
    dailyPrecipIcon,
    dailyPrecip,
    };
}

export function showLocations({ locations, locationsDiv, form }) {
  locationsDiv.replaceChildren();
  
  if (locations.length === 0) {
    locationsDiv.classList.remove("location");
    return;
  }

  locations.forEach(loc => {
    const span = document.createElement("span");
    span.textContent = `${loc.name}, ${loc.country}`;
    locationsDiv.appendChild(span);
    span.classList.add("loc-span");
  });
  
  form.appendChild(locationsDiv);
  locationsDiv.classList.add("location");
}

export function setWeatherIcon({ iconName, iconRef, iconCont }) {
  import(`./assets/images/${iconName}.svg`)
    .then((images) => {
      iconRef.src = images.default;
      iconCont.appendChild(iconRef);
    });
}

export function hide(el, className) {
  el.replaceChildren();
  el.classList.remove(className);
}