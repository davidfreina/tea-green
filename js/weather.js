let cityInput = document.getElementById('city');
let keyInput = document.getElementById('key');
let owmApiKey = localStorage.getItem('owmApiKey');
let weatherInfo = document.querySelector('.weather-card__info');
let description = document.getElementById('description');
let icon = document.getElementById('icon');

if (owmApiKey === null) {
	localStorage.removeItem('city');
	cityInput.style.display = 'none';
	keyInput.focus();
} else {
	keyInput.style.display = 'none';
	if (localStorage.getItem('city') === null) {
		console.log(':(');
	} else {
		let cityName = localStorage.getItem('city');
		getWeatherInfo(cityName, owmApiKey);
		cityInput.placeholder = cityName;
	}
}

keyInput.addEventListener('keyup', event => {
	if (event.code === 'Enter') {
		owmApiKey = keyInput.value;
		localStorage.setItem('owmApiKey', owmApiKey);
		keyInput.style.display = 'none';
		cityInput.style.display = '';
		cityInput.focus();
	}
});

cityInput.addEventListener('keyup', event => {
	if (event.code === 'Enter') {
		owmApiKey = localStorage.getItem('owmApiKey');
		let cityName = cityInput.value;
		localStorage.setItem('city', cityName);
		getWeatherInfo(cityName, owmApiKey);

		cityInput.placeholder = localStorage.getItem('city');
		cityInput.value = '';
		cityInput.blur();
	}
});

function getWeatherInfo(cityName, apiKey) {
	fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			drawWeather(data);
		})
		.catch(function (error) {
			cityInput.placeholder = '¯\u005C_(ツ)_/¯';
			weatherInfo.style.display = 'none';
			console.log(error);
		});
}

function drawWeather(data) {
	let fahrenheit = Math.round(((parseFloat(data.main.temp) - 273.15) * 1.8) + 32);
	let celsius = Math.round(parseFloat(data.main.temp) - 273.15);
	let desc = data.weather[0].description;
	let id = data.weather[0].id;
	let hour = new Date().getHours();
	let time = hour >= 17 || hour < 6 ? 'night' : 'day';

	weatherInfo.style.display = '';
	description.innerHTML = `${desc}`;
	icon.innerHTML = `<i id='icon' class='wi wi-owm-${time}-${id}'></i>`;

	let temp = document.getElementById('temp');
	if (localStorage.getItem('temp') === 'fahrenheit') {
		temp.innerHTML = `${fahrenheit}°F`;
	} else {
		temp.innerHTML = ` ${celsius}°C`;
	}

	temp.onclick = () => {
		if (localStorage.getItem('temp') !== 'fahrenheit') {
			temp.innerHTML = `${fahrenheit}°F`;
			localStorage.setItem('temp', 'fahrenheit');
		} else {
			temp.innerHTML = `${celsius}°C`;
			localStorage.setItem('temp', 'celsius');
		}
	};
}