$(document).ready(function() {

// Declaration of global variables
var apiKey = "4b9f79035e8d3dd47f7a2ebf1d60e057";
var urlBase = "https://api.openweathermap.org/data/2.5/weather?q="
var cities = [];
init();

// On search button click
$("#citySearch").on("click", function () {
    var city = $("#city").val();
    var queryURL =  urlBase + city + "&appid=" + apiKey;

    // Call to get the current weather
    getCurrentWeather(queryURL, city);    
});

// Loading weather for a saved city
$(".savedCity").on("click", function () {
    
    var city = $(this).text();
    var queryURL =  urlBase + city + "&appid=" + apiKey;

    // // Call to get the current weather
     getCurrentWeather(queryURL, city); 
});

// Clearing out the saved cities list
$("#clearCities").on("click", function () {
    localStorage.clear();
    cities = [];
    renderCities();
})

// Function call to populate the weather
function getCurrentWeather(URL, city) {
    // This API call gets the city by name. It returns the current weather and also the longitude/latitude
    // needed in order to get the 5 day forecast. The current weather could also be gathered from the 5 day 
    // and the actual weather icon comes from that api call. 
    $.ajax({
        url: URL,
        method: "GET"
    })
    // Callback function. 
    .then(function(res) {
        console.log(res);
        $("#cityHolder").text(city +" "+ moment().format('l'));
        var temp = kelToFar(res.main.temp);
        $("#temp").text("Temperature: " + temp + " " +"℉");
        $("#humid").text("Humidity: " + res.main.humidity + " %");
        $("#wind").text("Wind Speed: " + res.wind.speed + " MPH");
        var lat = (res.coord.lat);
        var lon = (res.coord.lon);
        // Calling the function to get the 5 day forecast
        pop5Day(lat, lon);
        // Checking to see if the city should be added to the left side nav
        addCity(city);
    })
    .catch(function(res){
        // Alerts the user the city entered was not found in the API call
        alert((res.responseJSON.message));
    });
};

// Function and API calls to populate the 5 day forecast
function pop5Day (lat, lon) {
    var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=current,minutely,hourly,alerts&appid=" + apiKey
    $.ajax({
        url: queryURL,
        method: "GET"
    })
    // Callback function to populate the response data
    .then(function(res) {
        // Completing the current day's weather
        $("#uv").text("UV Index: " + res.daily[0].uvi);
        $("#uvValue").text(res.daily[0].uvi);
        var icon = (res.daily[0].weather[0].icon)
        $("#curWeather").attr("src", "http://openweathermap.org/img/wn/" + icon + "@2x.png");
        
        // Loop to populate each of the 5 daily cards
        for (i=0; i < 5; i++) {
            $("#" + i +"-h4").text(moment().add(i+1, 'days').format('l'));
            $("#" + i +"-img").attr("src", "");
            var temp = kelToFar(res.daily[i+1].temp.day);
            $("#" + i +"-p1").text("Temp: " + temp + " " +"℉");
            var icon = (res.daily[i + 1].weather[0].icon)
            $("#" + i + "-img").attr("src", "http://openweathermap.org/img/wn/" + icon + "@2x.png");
            $("#" + i +"-p2").text("Humidity: " + res.daily[i+1].humidity + " %");
            $("#5day").removeClass("hidden");
        }
    });
};

// Conversion of Kelvin to Fahrenheit
function kelToFar(temp) {
    return Math.round((temp) * 9/5 - 459.67, 0)
};

// Function to render the cities to the left nav
function renderCities () {
    $("#cityList").empty();
    for (i=0; i<cities.length; i++) {
        var cityDiv = $("<li>");
        cityDiv.addClass("list-group-item savedCity");
        cityDiv.attr("value", cities[i]);
        cityDiv.text(cities[i]);
        // needed to re-establish the on-click event listener
        cityDiv.click(savedCityClick);
        $("#cityList").prepend(cityDiv);
    };    
};

// Initializes the page pulling in the saved citys from local storage
function init() {
  var storedCities = JSON.parse(localStorage.getItem("cities"));

  // If cities were retrieved from localStorage, update the cities array
  if (storedCities !== null) {
    cities = storedCities;
  }
  // Render cities to the DOM
  renderCities();
};

// Looks to see if a city is in local storage
function addCity(city) {
    var storedCities = JSON.parse(localStorage.getItem("cities"));
    for (i=0; i<cities.length; i++) {
        if (storedCities[i] === city) {
            return
        }
    }
    cities.push(city);
    localStorage.setItem("cities", JSON.stringify(cities));
    renderCities();
};

// Function for the event listener when clicking on a saved city.
function savedCityClick () {
    var city = $(this).text();
    var queryURL =  urlBase + city + "&appid=" + apiKey;
    getCurrentWeather(queryURL, city); 
}

})