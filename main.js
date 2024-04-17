const weather = document.querySelector("#weather");
const minTemp = document.querySelector("#min-temp");
const maxTemp = document.querySelector("#max-temp");
const formatter = new Intl.DateTimeFormat(navigator.language);

async function fetchWeatherForecast() {
    console.log('ici')
    const weatherData = await fetch("https://my.meteoblue.com/packages/basic-1h_basic-day?apikey=NKEu72fl3RBGYLHT&lat=50.5012&lon=2.69708&asl=27&format=json").then(r => r.json());
    return weatherData;
}

async function displayWeather() {
    const data = await fetchWeatherForecast();
    console.log(data.data_day.time[0])

    data.data_day.time.forEach(date => {
        let weatherDate = document.createElement('p')
        let div = document.createElement('div')
        weatherDate.textContent = date
        div.appendChild(weatherDate)
        weather.appendChild(div);
    });
    console.log(data)

        
}

displayWeather();
