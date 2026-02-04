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
