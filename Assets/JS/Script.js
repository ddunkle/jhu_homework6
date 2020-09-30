$("#citySearch").on("click", function () {
    var city = $("#city").val();
    var apiKey = "4b9f79035e8d3dd47f7a2ebf1d60e057";
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;

    getCurrentWeather(queryURL, city);
});

function getCurrentWeather(URL, city) {
    $.ajax({
        url: URL,
        method: "GET"
    })
    .then(function(res) {
        $("#cityHolder").text(city +" "+ moment().format('l'));
        var temp = Math.round((res.main.temp) * 9/5 - 459.67, 0);
        $("#temp").text("Temperature: " + temp + " " +"F");
        $("#humid").text("Humidity: " + res.main.humidity + " %");
        $("#wind").text("Wind Speed: " + res.wind.speed + " MPH");
        //$("#uv").text(res.uv);
        var lat = (res.coord.lat);
        var lon = (res.coord.lon);
    });
};