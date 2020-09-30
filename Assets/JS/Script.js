$(document).ready(function() {

var apiKey = "4b9f79035e8d3dd47f7a2ebf1d60e057";
var urlBase = "http://api.openweathermap.org/data/2.5/weather?q="
var cities = [];
init();

$("#citySearch").on("click", function () {
    var city = $("#city").val();
    //var apiKey = "4b9f79035e8d3dd47f7a2ebf1d60e057";
    var queryURL =  urlBase + city + "&appid=" + apiKey;

    getCurrentWeather(queryURL, city);    
});

function citySearchClick {
    
}

$(".savedCity").on("click", function () {
    var city = $(this).text();
    var queryURL =  urlBase + city + "&appid=" + apiKey;
    getCurrentWeather(queryURL, city); 
});

$("#clearCities").on("click", function () {
    localStorage.clear();
    cities = [];
    renderCities();
})

function getCurrentWeather(URL, city) {
    $.ajax({
        url: URL,
        method: "GET"
    })
    .then(function(res) {
        $("#cityHolder").text(city +" "+ moment().format('l'));
        var temp = kelToFar(res.main.temp);
        //var temp = Math.round((res.main.temp) * 9/5 - 459.67, 0);
        $("#temp").text("Temperature: " + temp + " " +"F");
        $("#humid").text("Humidity: " + res.main.humidity + " %");
        $("#wind").text("Wind Speed: " + res.wind.speed + " MPH");
        //$("#uv").text(res.uv);
        var lat = (res.coord.lat);
        var lon = (res.coord.lon);
        pop5Day(lat, lon);
        addCity(city);
    })
    .catch(function(res){
        alert((res.responseJSON.message));
    });
};
function pop5Day (lat, lon) {
    var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=current,minutely,hourly,alerts&appid=" + apiKey
    $.ajax({
        url: queryURL,
        method: "GET"
    })
    .then(function(res) {
        for (i=0; i < 5; i++) {
            $("#" + i +"-h4").text(moment().add(i+1, 'days').format('l'));
            $("#" + i +"-img").attr("src", "");
            var temp = kelToFar(res.daily[i+1].temp.day);
            $("#" + i +"-p1").text("Temp: " + temp + " " +"F");
            $("#" + i +"-p2").text("Humidity: " + res.daily[i+1].humidity + " %");
            $("#5day").removeClass("hidden");
        }
    });
};
function kelToFar(temp) {
    return Math.round((temp) * 9/5 - 459.67, 0)
};
function renderCities () {
    $("#cityList").empty();
    for (i=0; i<cities.length; i++) {
        var cityDiv = $("<li>");
        cityDiv.addClass("list-group-item savedCity");
        cityDiv.attr("value", cities[i]);
        cityDiv.text(cities[i]);
        cityDiv.addEventListener("click", )
        $("#cityList").prepend(cityDiv);
    };    
};
function init() {
  var storedCities = JSON.parse(localStorage.getItem("cities"));

  // If cities were retrieved from localStorage, update the cities array
  if (storedCities !== null) {
    cities = storedCities;
  }

  // Render cities to the DOM
  renderCities();
};
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

})