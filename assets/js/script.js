var btn = $(".btn");
var citiesArray = [];
var date = moment().format('MMMM Do YYYY, h:mm a');
var cityDate = moment().format('MMMM Do YYYY');
var APIKey = "7460ca674a63cbae5e3acbd439f037f5";
var fiveDayTemp = 0;
var fiveDayDate = "";
var uvIndex = 0;
var city = "";
var temp = 0;
var humidity = "";
var windSpeed = "";
var latitude = "";
var longitude = "";
var weatherIcon = "";
var fiveDayHumidity = "";
// Puts date and time onto header
$("#date").text(date);

// Establishing default key values
if (localStorage.getItem("cities") == null) {
  var defaultKey = "Nashville";
  citiesArray.push(defaultKey);
  localStorage.setItem("cities", JSON.stringify(citiesArray));
}
else {
  citiesArray = JSON.parse(localStorage.getItem("cities"));
}

// Adds a new city to the buttons array, sets the array, clears dashboard and populates with the city they last entered
btn.on("click", function() {
  $(".empty").empty();
  input = $(":text:eq(" + 0 + ")").val().trim();
  citiesArray.push(input);
  localStorage.setItem("cities", JSON.stringify(citiesArray));
  $(":text:eq(" + 0 + ")").val("")
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + input + "&appid=" + APIKey;
      $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      city = response.city.name;
      temp = response.list[0].main.temp;
      temp = (temp - 273.15) * 9/5 + 32
      temp = temp.toFixed(2)
      humidity = response.list[0].main.humidity;
      windSpeed = response.list[0].wind.speed;
      latitude = response.city.coord.lat;
      longitude = response.city.coord.lon;
      // Doing another query to obtain the UV index;
      var queryURL2 = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + latitude + "&lon=" + longitude + "";
        $.ajax({
          url: queryURL2,
          method: "GET"
        }).then(function(response2) {
          uvIndex = response2.value;
          var uvSpan = $("<span>").text(uvIndex).addClass("uvSpan");
          $("<div>").appendTo("#wrapDash").addClass("uvInfo").text("UV Index: ").append(uvSpan);
          uvColor();
        });
        for (j=0; j < 5; j++) {
          fiveDayDate = moment().add(j + 1, "day").format("MMMM Do YYYY");
          fiveDayTemp = response.list[j + 1].main.temp;
          fiveDayTemp = (fiveDayTemp - 273.15) * 9/5 + 32;
          fiveDayTemp = fiveDayTemp.toFixed(2);
          weatherIcon = response.list[j + 1].weather[0].icon;
          fiveDayHumidity = response.list[j + 1].main.humidity; 
          appendForecast();
        }
        appendInformation();
        $(".cities").remove();
        $(".cities").addClass("hidden");
        $(".cities").removeClass("hidden");
        $("br").remove();
        loadBtns();
    });
  });

// Grabbing the last entry in the citiesArray to load onto page, gets called on page load
function pageLoad() {
  loadBtns();
  var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + citiesArray[citiesArray.length - 1] + "&appid=" + APIKey;
    $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    city = response.city.name;
    temp = response.list[0].main.temp;
    temp = (temp - 273.15) * 9/5 + 32
    temp = temp.toFixed(2)
    humidity = response.list[0].main.humidity;
    windSpeed = response.list[0].wind.speed;
    latitude = response.city.coord.lat;
    longitude = response.city.coord.lon;
    // Doing another query to obtain the UV index;
    var queryURL2 = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + latitude + "&lon=" + longitude + "";
      $.ajax({
        url: queryURL2,
        method: "GET"
      }).then(function(response2) {
        uvIndex = response2.value;
        var uvSpan = $("<span>").text(uvIndex).addClass("uvSpan");
        $("<div>").appendTo("#wrapDash").addClass("uvInfo").text("UV Index: ").append(uvSpan);
        uvColor();
      });
      for (j=0; j < 5; j++) {
        fiveDayDate = moment().add(j + 1, "day").format("MMMM Do YYYY");
        fiveDayTemp = response.list[j + 1].main.temp;
        fiveDayTemp = (fiveDayTemp - 273.15) * 9/5 + 32;
        fiveDayTemp = fiveDayTemp.toFixed(2);
        weatherIcon = response.list[j + 1].weather[0].icon;
        fiveDayHumidity = response.list[j + 1].main.humidity;
        appendForecast();
      } 
      appendInformation();
  });
};

pageLoad();

// Creating buttons for local storage entries, and assigning click events for each to pull information on the selected city
function loadBtns() {
  for (var i=1; i < citiesArray.length; i++) {
      $("<button>").text(citiesArray[i]).attr('id', citiesArray[i]).addClass("cities").appendTo("#addedCities");
      $("</br>").appendTo("#addedCities");  
      // Creating click events for the stored cities
      $("#" + citiesArray[i]).on("click", function() {
        $(".empty").empty();
        var selectedCity = $(this).text();
        var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + selectedCity + "&appid=" + APIKey;
        $.ajax({
          url: queryURL,
          method: "GET"
        }).then(function(response) {
          city = response.city.name;
          temp = response.list[0].main.temp;
          temp = (temp - 273.15) * 9/5 + 32
          temp = temp.toFixed(2)
          humidity = response.list[0].main.humidity;
          windSpeed = response.list[0].wind.speed;
          latitude = response.city.coord.lat;
          longitude = response.city.coord.lon;
          // Doing another query to obtain the UV index;
          var queryURL2 = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + latitude + "&lon=" + longitude + "";
          $.ajax({
            url: queryURL2,
            method: "GET"
          }).then(function(response2) {
            uvIndex = response2.value;
            var uvSpan = $("<span>").text(uvIndex).addClass("uvSpan");
            $("<div>").appendTo("#wrapDash").addClass("uvInfo").text("UV Index: ").append(uvSpan);
            uvColor();
          });
          for (j=0; j < 5; j++) {
            fiveDayDate = moment().add(j + 1, "day").format("MMMM Do YYYY");
            fiveDayTemp = response.list[j + 1].main.temp;
            fiveDayTemp = (fiveDayTemp - 273.15) * 9/5 + 32;
            fiveDayTemp = fiveDayTemp.toFixed(2);
            weatherIcon = response.list[j + 1].weather[0].icon;
            fiveDayHumidity = response.list[j + 1].main.humidity; 
            appendForecast();
          };
          appendInformation();
        });
      });  
  };
};

// Appends the main dashboard information to the page
function appendInformation() {
  $("<div>").appendTo("#wrapDash").addClass("city").text(city + " (" + cityDate + ")");
  $("<div>").appendTo("#wrapDash").addClass("cityInfo").text("Temperature: " + temp + " ℉");
  $("<div>").appendTo("#wrapDash").addClass("cityInfo").text("Humidity: " + humidity + "%");
  $("<div>").appendTo("#wrapDash").addClass("cityInfo").text("Wind Speed: " + windSpeed + " MPH");
}

// Appends the forecast data into cards
function appendForecast() {
    $("<div>").appendTo("#fiveDayCards").addClass("card");
    $("<div>").appendTo(".card:eq(" + j + ")").addClass("card-body");
    $("<h5>").appendTo(".card-body:eq(" + j + ")").addClass("card-title").text(fiveDayDate);
    $("<div>").appendTo(".card-body:eq(" + j + ")").append("<img class='image' src=''/>");
    $(".image:eq(" + j + ")").attr("src", "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png");
    $("<p>").appendTo(".card-body:eq(" + j + ")").addClass("card-text").text("Temperature: " + fiveDayTemp + " ℉");
    $("<p>").appendTo(".card-body:eq(" + j + ")").addClass("card-text").text("Humidity: " + fiveDayHumidity + "%");
};

// Assigning the uv background color based on value
function uvColor() {
  if (uvIndex >= 11.00) {
    $("div").find("span").css("background-color", "violet");
  }
  else if (uvIndex >= 8.00 && uvIndex < 11.00) {
    $("div").find("span").css("background-color", "red");
  }
  else if (uvIndex >= 6.00 && uvIndex < 8.00) {
    $("div").find("span").css("background-color", "orange");
  }
  else if (uvIndex >= 3.00 && uvIndex < 6.00) {
    $("div").find("span").css("background-color", "yellow");
  }
  else if (uvIndex < 3.00) {
    $("div").find("span").css("background-color", "lightblue");
  }
}