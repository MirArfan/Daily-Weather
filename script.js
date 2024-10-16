const searchField = document.querySelector('.search_location');
const form = document.querySelector('#search-form');
let target = 'chittagong'; 

const sortTemperatureDropdown = document.getElementById('sort-temperature');
const filterConditionDropdown = document.getElementById('filter-condition');

sortTemperatureDropdown.addEventListener('change', () => fetchDetails(target));
filterConditionDropdown.addEventListener('change', () => fetchDetails(target));

form.addEventListener('submit', searchForLocation);

const fetchDetails = async (targetLocation) => {
    let url = `https://api.weatherapi.com/v1/forecast.json?key=a39fe280497c4fbc85c34957241510&q=${targetLocation}&days=7&aqi=no&alerts=no`;

    try {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Error ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        if (!data || !data.location || !data.forecast) {
            throw new Error('No valid data returned from API');
        }
        console.log(data);

        let locationName = data.location.name;
        let time = data.location.localtime;
        let temp = data.current.temp_c;
        let condition = data.current.condition.text;
        let iconUrl = data.current.condition.icon;
        let forecast = data.forecast.forecastday; 
        // let country=data.location.country; 

        updateDetails(locationName, time, temp, condition, iconUrl, forecast);

    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('location').innerText = 'Location not found';
        document.getElementById('temperature').innerText = '--';
        document.getElementById('condition').innerText = '--';
        document.getElementById('condition-icon').src = ''; 


        const forecastContainer = document.getElementById('forecast-container');
        forecastContainer.innerHTML = '';

        
    }
};

function updateDetails(locationName, time, temp, condition, iconUrl, forecast) { 
    let splitDate = time.split(' ')[0];
    let splitTime = time.split(' ')[1];
    let currentDay = getDayName(new Date(splitDate).getDay());

    document.getElementById('temperature').innerText = `${temp}°C`;
    document.getElementById('location').innerText = locationName;
    document.getElementById('time').innerHTML = `${splitDate} <br> ${currentDay}<br> Time :  ${splitTime}`;
    document.getElementById('condition').innerText = condition;
    document.getElementById('condition-icon').src = iconUrl; 




    // Get user sorting and filtering preferences
    const sortOption = document.getElementById('sort-temperature').value;
    const filterCondition = document.getElementById('filter-condition').value;

    // Apply filtering
    if (filterCondition) {
        forecast = forecast.filter(day => day.day.condition.text.includes(filterCondition));
    }

    // Apply sorting by temperature
    if (sortOption === 'asc') {
        forecast.sort((a, b) => a.day.maxtemp_c - b.day.maxtemp_c);  // Low to High
    } else if (sortOption === 'desc') {
        forecast.sort((a, b) => b.day.maxtemp_c - a.day.maxtemp_c);  // High to Low
    }

    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = ''; 

    forecast.forEach(day => {
        let date = day.date;
        let maxTemp = day.day.maxtemp_c;
        let minTemp = day.day.mintemp_c;
        let condition = day.day.condition.text;
        let icon = day.day.condition.icon;

        let dayOfWeek = getDayName(new Date(date).getDay());

        let forecastHTML = `
            <div class="forecast-card">
                <p class="forecast-date">, <br> ${date} <p/>
                <p class="forecast-day"> ${dayOfWeek}</p> 
                <p class="forecast-icon"><img src="${icon}" alt="weather-icon" /></p>
                <p class="forecast-condition"> ${condition}</p>
                <p class="forecast-max"> Max: ${maxTemp}°C <p/>
                <p class="forecast-min"> Min: ${minTemp}°C</p>
            </div>
        `;

        forecastContainer.innerHTML += forecastHTML;
    });
}

function searchForLocation(e) {
    e.preventDefault();
    target = searchField.value;
    searchField.value = ''; 
    fetchDetails(target);
}

fetchDetails(target); 

function getDayName(number) {
    switch (number) {
        case 0: return 'Sunday';
        case 1: return 'Monday';
        case 2: return 'Tuesday';
        case 3: return 'Wednesday';
        case 4: return 'Thursday';
        case 5: return 'Friday';
        case 6: return 'Saturday';
    }
}
