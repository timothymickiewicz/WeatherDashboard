var btn = $(".btn");
var citiesArray = [];
var date = moment().format('MMMM Do YYYY, h:mm a');
var cityDate = moment().format('MMMM Do YYYY');

// Establishing default key values
if (localStorage.getItem("cities") == null) {
  var defaultKey = "Nashville";
  citiesArray.push(defaultKey);
  localStorage.setItem("cities", JSON.stringify(citiesArray));
}
else {
  citiesArray = JSON.parse(localStorage.getItem("cities"));
}
// Adds a new city to the buttons array, sets the array, and refreshes page
btn.on("click", function() {
  input = $(":text:eq(" + 0 + ")").val();
  citiesArray.push(input);
  localStorage.setItem("cities", JSON.stringify(citiesArray));
  refreshPage();
});
// Grabbing the last entry in the citiesArray to load onto page
function initialPageLoad() {
  $(".empty").empty();
  var APIKey = "7460ca674a63cbae5e3acbd439f037f5";
  var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + citiesArray[citiesArray.length - 1] + "&appid=" + APIKey;
    $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    console.log(response);
    var city = response.city.name;
    var temp = response.list[0].main.temp;
    temp = (temp - 273.15) * 9/5 + 32
    temp = temp.toFixed(2)
    var humidity = response.list[0].main.humidity;
    var windSpeed = response.list[0].wind.speed;
    var latitude = response.city.coord.lat;
    var longitude = response.city.coord.lon;
    var uvIndex = 0;
    // Doing a second ajax query to obtain the UV index;
    var queryURL2 = "http://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + latitude + "&lon=" + longitude + "";
      $.ajax({
        url: queryURL2,
        method: "GET"
      }).then(function(response2) {
        console.log(response2);
        uvIndex = response2.value;
        var uvSpan = $("<span>").text(uvIndex).addClass("uvSpan");
        $("<div>").appendTo("#wrapDash").addClass("uvInfo").text("UV Index: ").append(uvSpan);
        if (uvIndex > 10.00) {
          $("div").find("span").css("background-color", "red");
        }
        else if (uvIndex > 5.00) {
          $("div").find("span").css("background-color", "yellow");
        }
        else if (uvIndex > 2.00) {
          $("div").find("span").css("background-color", "lightblue");
        }
      });
    $("<div>").appendTo("#wrapDash").addClass("city").text(city + " (" + cityDate + ")");
    $("<div>").appendTo("#wrapDash").addClass("cityInfo").text("Temperature: " + temp + " ℉");
    $("<div>").appendTo("#wrapDash").addClass("cityInfo").text("Humidity: " + humidity + "%");
    $("<div>").appendTo("#wrapDash").addClass("cityInfo").text("Wind Speed: " + windSpeed + " MPH");
  });
  loadBtns();
}
initialPageLoad();

$("#date").text(date);
// Making a refresh page function for when user submits their new city
function refreshPage(){
    window.location.reload();
}; 
// Creating buttons on page load for local storage entries
function loadBtns() {
  for (i=1; i < citiesArray.length; i++) {
    $("<button>").text(citiesArray[i]).attr('id', citiesArray[i]).addClass("cities").appendTo("#addedCities");
    $("</br>").appendTo("#addedCities");  
    // Creating click events for the stored cities
    $("#" + citiesArray[i]).on("click", function() {
    $(".empty").empty();
    var selectedCity = $(this).text();
    $(".empty").empty();
    var APIKey = "7460ca674a63cbae5e3acbd439f037f5";
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + selectedCity + "&appid=" + APIKey;
      $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      console.log(response);
      var city = response.city.name;
      var temp = response.list[0].main.temp;
      temp = (temp - 273.15) * 9/5 + 32
      temp = temp.toFixed(2)
      var humidity = response.list[0].main.humidity;
      var windSpeed = response.list[0].wind.speed;
      var latitude = response.city.coord.lat;
      var longitude = response.city.coord.lon;
      var uvIndex = 0;
      // Doing a second ajax query to obtain the UV index;
      var queryURL2 = "http://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + latitude + "&lon=" + longitude + "";
        $.ajax({
          url: queryURL2,
          method: "GET"
        }).then(function(response2) {
          console.log(response2);
          uvIndex = response2.value;
          var uvSpan = $("<span>").text(uvIndex).addClass("uvSpan");
          $("<div>").appendTo("#wrapDash").addClass("uvInfo").text("UV Index: ").append(uvSpan);
          if (uvIndex > 10.00) {
            $("div").find("span").css("background-color", "red");
          }
          else if (uvIndex > 5.00) {
            $("div").find("span").css("background-color", "yellow");
          }
          else if (uvIndex > 2.00) {
            $("div").find("span").css("background-color", "lightblue");
          }
        });
      $("<div>").appendTo("#wrapDash").addClass("city").text(city + " (" + cityDate + ")");
      $("<div>").appendTo("#wrapDash").addClass("cityInfo").text("Temperature: " + temp + " ℉");
      $("<div>").appendTo("#wrapDash").addClass("cityInfo").text("Humidity: " + humidity + "%");
      $("<div>").appendTo("#wrapDash").addClass("cityInfo").text("Wind Speed: " + windSpeed + " MPH");
    });
    });  
  };
}
// * City Name
// * Date
// * Icon representation
// * Temperature
// * Humidity
// * Wind Speed
// * UV Index (with color representation)  