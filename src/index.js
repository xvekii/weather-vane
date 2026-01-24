import "./styles.css";

// Get form value
// variable.toLowerCase()
const apiKey = "H9CXBS2KVNGA3AW4L8PF8PGK4";

// add a ‘loading’ component that displays from the time the form is submitted until the 
// information comes back from the API. Use DevTools to simulate network speeds.

const URL = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/shanghai?unitGroup=metric&elements=add%3Atimezone%2Cadd%3Atzoffset%2Cremove%3Acloudcover%2Cremove%3Amoonphase%2Cremove%3Apressure%2Cremove%3Astations&include=days%2Chours%2Ccurrent%2Calerts%2Cevents&key=&contentType=json`;

// Default URL
const defaultURL = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/shanghai?unitGroup=metric&elements=add%3Atimezone%2Cadd%3Atzoffset%2Cremove%3Acloudcover%2Cremove%3Amoonphase%2Cremove%3Apressure%2Cremove%3Astations&include=days%2Chours%2Ccurrent%2Calerts%2Cevents&key=${apiKey}&contentType=json`;

// Add const loc = encodeURIComponent(location);
// Implement location variable inside link, otherwise default Shanghai
// Return data 
// function getLocation() {

// }

// Add eventListener to input, manage with getLocation
// Pass its return value to getWeather

async function getWeather(location) {
  try {
    const response = await fetch(URL);
    const weatherData = await response.json();
    console.log(weatherData);
  } catch (err) {
    // Add N/A
    console.log(err);
  }
}

getWeather();