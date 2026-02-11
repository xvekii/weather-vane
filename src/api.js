const WEATHER_API_KEY = "H9CXBS2KVNGA3AW4L8PF8PGK4";
const LOCATION_API_KEY = "bd15706d81c640a398a191135262501";

export async function searchLocations(query) {
  try {
    const res = await fetch(`http://api.weatherapi.com/v1/search.json?key=${LOCATION_API_KEY}&q=${encodeURIComponent(query)}`);
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const locations = await res.json();
    return locations;

  } catch (err) {
    // Add N/A
    console.error('Error fetching locations:', err);
  }
}

export async function getWeather(loc = "Đurđevac, Croácia", units = "metric") {
  try {
    const unitGroup = units;
    localStorage.setItem("units", units);
    const encodedLoc = encodeURIComponent(loc);
    const URL = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodedLoc}?unitGroup=${unitGroup}&elements=add%3Aaddress%2Cadd%3Alatitude%2Cadd%3Alongitude%2Cadd%3AresolvedAddress%2Cadd%3Atimezone%2Cadd%3Atzoffset%2Cremove%3Acloudcover%2Cremove%3Adew%2Cremove%3Afeelslikemax%2Cremove%3Afeelslikemin%2Cremove%3Amoonphase%2Cremove%3Aprecipcover%2Cremove%3Apressure%2Cremove%3Asevererisk%2Cremove%3Asnow%2Cremove%3Asnowdepth%2Cremove%3Asolarenergy%2Cremove%3Asolarradiation%2Cremove%3Astations%2Cremove%3Auvindex%2Cremove%3Avisibility%2Cremove%3Awinddir%2Cremove%3Awindgust&include=days%2Chours%2Ccurrent%2Calerts%2Cevents&key=${WEATHER_API_KEY}&contentType=json`;
    const response = await fetch(URL);
    
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const weatherData = await response.json();
    return weatherData;

  } catch (err) {
    // Add N/A
    console.error('Error fetching weather:', err);
    throw err;
  }
}
