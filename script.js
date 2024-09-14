
const API_KEY = "1a8569318dfebd26480e1e1cebcb1a4f";
var cityInput = document.querySelector('.city-input').value;
var searchBtn = document.querySelector('.search-btn');
window.addEventListener("load", () => {
    getWeatherByLocation();
});

function getWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            let lon = position.coords.longitude;
            let lat = position.coords.latitude;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&` + `lon=${lon}&appid=${API_KEY}`;


            fetch(url).then((res) => {
                return res.json();
            }).then((data) => {
                console.log(data);
                weatherReport(data);
            })
                .catch((error) => {
                    console.error("Error fetching")
                });
        });
    }
}


function searchByCity() {
    var cityInput = document.querySelector('.city-input').value;
    var urlsearch = `http://api.openweathermap.org/data/2.5/weather?q=${cityInput}&` + `appid=${API_KEY}`;

    fetch(urlsearch).then((res) => {
        return res.json();
    }).then((data) => {
        console.log(data);
        weatherReport(data);
    })

    document.querySelector('.city-input').value = '';
}


function weatherReport(data) {

    var urlcast = `http://api.openweathermap.org/data/2.5/forecast?q=${data.name}&` + `appid=${API_KEY}`;

    fetch(urlcast).then((res) => {
        return res.json();
    }).then((forecast) => {
        console.log(forecast.city);
        hourForecast(forecast);
        dayForecast(forecast);
        updateDetailsSection(forecast)

        console.log(data);
        document.getElementById('city').innerText = data.name + ', ' + data.sys.country;
        console.log(data.name, data.sys.country);

        console.log(Math.floor(data.main.temp - 273));
        document.getElementById('temperature').innerText = Math.floor(data.main.temp - 273) + ' °C';

        document.getElementById('clouds').innerText = data.weather[0].description;
        console.log(data.weather[0].description)

        let icon1 = data.weather[0].icon;
        let iconurl = "http://api.openweathermap.org/img/w/" + icon1 + ".png";
        document.getElementById('img').src = iconurl
    })

}

function hourForecast(forecast) {
    document.querySelector('.hour').innerHTML = ''
    for (let i = 0; i < 5; i++) {

        var date = new Date(forecast.list[i].dt * 1000)
        console.log((date.toLocaleTimeString(undefined, 'Asia/Kolkata')).replace(':00', ''))

        let hourR = document.createElement('div');
        hourR.setAttribute('class', 'day');

        let div = document.createElement('div');
        let time = document.createElement('p');
        time.setAttribute('class', 'time')
        time.innerText = (date.toLocaleTimeString(undefined, 'Asia/Kolkata')).replace(':00', '');

        let temp = document.createElement('h3');
        temp.innerText = Math.floor((forecast.list[i].main.temp_max - 273)) + ' °C' + ' / ' + Math.floor((forecast.list[i].main.temp_min - 273)) + ' °C';

        div.appendChild(time)
        div.appendChild(temp)

        let icon1 = forecast.list[i].icon;
        let iconurl = "http://api.openweathermap.org/img/w/" + icon1 + ".png";
        document.getElementsByClassName('day-img').src = iconurl

        let desc = document.createElement('p');
        desc.setAttribute('class', 'desc')
        desc.innerText = forecast.list[i].weather[0].description;

        hourR.appendChild(div);
        hourR.appendChild(desc)
        document.querySelector('.hour').appendChild(hourR);
    }
}

function dayForecast(forecast) {
    document.querySelector('.next').innerHTML = ''
    for (let i = 8; i < forecast.list.length; i += 8) {
        console.log(forecast.list[i]);
        let div = document.createElement('div');
        div.setAttribute('class', 'week');

        let day = document.createElement('p');
        day.setAttribute('class', 'date')
        day.innerText = new Date(forecast.list[i].dt * 1000).toDateString(undefined, 'Asia/Kolkata');
        div.appendChild(day);

        let temp = document.createElement('p');
        temp.innerText = Math.floor((forecast.list[i].main.temp_max - 273)) + ' °C' + ' / ' + Math.floor((forecast.list[i].main.temp_min - 273)) + ' °C';
        div.appendChild(temp)

        let icon1 = forecast.list[i].weather[0].icon;
        let iconurl = "http://api.openweathermap.org/img/w/" + icon1 + ".png";
        document.getElementsByClassName('week-img').src = iconurl

        let description = document.createElement('h6');
        description.setAttribute('class', 'desc')
        description.innerText = forecast.list[i].weather[0].description;
        div.appendChild(description);

        document.querySelector('.next').appendChild(div)
    }
}


function updateDetailsSection(forecast) {
    document.querySelector('.feels-like h4').innerText = (forecast.list[0].feels_like - 273) + ' °C';
    document.querySelector('.precipataion h4').innerText = forecast.list[0].pressure + ' °C';
    document.querySelector('.wind h4').innerText = forecast.list[0].wind.speed + ' Km/h';
    document.querySelector('.visibility h4').innerText = forecast.list[0].visibility + ' %';
}


searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    searchByCity();
});

document.querySelector('.city-input').addEventListener("keyup", (e) => e.key === "Enter" && searchByCity());





