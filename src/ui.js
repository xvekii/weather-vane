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
        hourlyTempWrapper,
        hourlyTempMin,
        hourlyTempMax,
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
      const precip = data.days[currDay].hours[currHr].precip;
      const tempMin = data.days[currDay].tempmin;
      const tempMax = data.days[currDay].tempmax;

      hours.textContent = hrs;

      setWeatherIcon({ iconName: icon, iconRef: hourlyIcon, iconCont: hourlyIconWrap });
      hourlyTempMin.textContent = `${Math.round(tempMin)}°`;
      hourlyTempMax.textContent = `${Math.round(tempMax)}°`;
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

    // const fullTime = data.currentConditions.datetime;
    // const time = fullTime.slice(0, 5);
    // const currentHours = Number(time);
    
    // const icon = data.days[i].hours[i].icon;
    // const precip = data.days[i].hours[i].precip;
    // const tempMin = data.days[i].tempmin;
    // const tempMax = data.days[i].tempmax;

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
  const hourlyTempWrapper = createSpan({ classes: ["hourly-temp-wrap"] });
  const hourlyTempMin = createSpan({ classes: ["hourly-temp-min"] });
  const hourlyTempMax = createSpan({ classes: ["hourly-temp-max"] });

  // Hourly precip
  const hourlyPrecipWrapper = createSpan({ classes: ["hourly-precip-wrap"] });
  const hourlyPrecipIcon = createImg({ classes: ["hourly-precip-icon"] });
  const hourlyPrecip = createSpan({ classes: ["hourly-precip"] });

  hourlyIconWrap.append(hourlyIcon);
  hourlyPrecipWrapper.append(hourlyPrecip);
  hourlyTempWrapper.append(hourlyTempMin, hourlyTempMax);
  rowWrapper.append(hours, hourlyIconWrap, hourlyTempWrapper, hourlyPrecipWrapper);

  return { 
    rowWrapper,
    hours,
    hourlyIconWrap,
    hourlyIcon,
    hourlyTempWrapper, 
    hourlyTempMin,
    hourlyTempMax,
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