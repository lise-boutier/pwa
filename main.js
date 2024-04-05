const formatter = new Intl.DateTimeFormat(navigator.language);

async function fetchWeatherForecast() {
    console.log('ici')
    const weatherData = await fetch("https://my.meteoblue.com/packages/basic-1h_basic-day?apikey=NKEu72fl3RBGYLHT&lat=50.5012&lon=2.69708&asl=27&format=json");
    return weatherData;
}

async function displayWeather() {
    const data = await fetchWeatherForecast();
    console.log(data)
}

displayWeather();
