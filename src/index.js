import "./styles.css";

// Add search form and location variable
// variable.toLowerCase()
const URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/%C4%90ur%C4%91evac?unitGroup=metric&include=days%2Chours%2Ccurrent%2Calerts%2Cevents&key=H9CXBS2KVNGA3AW4L8PF8PGK4&contentType=json';
// Implement location variable inside link, otherwise default Shanghai
// Return data 
async function getWeather() {
  const response = await fetch(URL);
  const weatherData = await response.json();
  console.log(weatherData);
}

getWeather();