import { createDiv, createSpan, createImg } from "./elements.js";

const CELSIUS = "C";
const FAHRENHEIT = "F";
const KMH = "km/h";
const MPH = "m/h";

export function showLoader(loader) {
  loader.classList.add("is-visible");
}

export function hideLoader(loader) {
  loader.classList.remove("is-visible");
}

export function fillSearchInput({ locationStr, input }) {
  input.value = locationStr;
}

export function fillMainCardWeather({ temp, currConditions, feelsLike, }) {
  const mainTempNum = document.querySelector(".main-temp-num");
  const mainFeelsLike = document.querySelector(".main-feels-like");
  const mainWeatherTxt = document.querySelector(".main-weather-txt");
  
  // Main temp
  const displayTemp = Math.round(temp);
  mainTempNum.textContent = `${displayTemp}°`;

  // Feels like
  const feelsLikeRaw = feelsLike;
  const feelsLikeRound = Math.round(feelsLikeRaw);
  mainFeelsLike.textContent = `Feels like ${feelsLikeRound}°`;

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
  
  humidityVal.textContent = `${humidity}%`;
  windspeedVal.textContent = `${windSpeed} ${KMH}`;
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

      // console.log(fullTime);
      // console.log(data.days[currDay].datetime);
      
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
      // console.log(`ttlhrs: ${ttlHrs}`);
      dayHrs = dayHrs - ttlHrs;
      console.log(`dayHrsEnd: ${dayHrs}`);
      nextDay = 2;
      currHr = 0;
      ttlHrs = 24;
    }
  }
}


function createDailyRow() {
  // Row wrapper
  const rowWrapper = createDiv({ classes: ["daily-wrap", "row"] });

  // Hours
  const days = createSpan({ classes: ["days"] });

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

  dailyIconWrap.append(hourlyIcon);
  dailyPrecipWrapper.append(dailyPrecip);
  rowWrapper.append(days, dailyIconWrap, dailyTemp, dailyPrecipWrapper);

  return { 
    rowWrapper,
    days,
    dailyIconWrap,
    dailyIcon, 
    dailyTemp,
    dailyPrecipWrapper,
    dailyPrecipIcon,
    dailyPrecip,
    };
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