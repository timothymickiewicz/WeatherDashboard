var btn = $(".btn");
var citiesArray = [];
var date = moment().format('MMMM Do YYYY, h:mm a');
var cityDate = moment().format('MMMM Do YYYY');
var APIKey = "7460ca674a63cbae5e3acbd439f037f5";
var fiveDayTemp = 0;
var fiveDayDate = "";
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

// Adds a new city to the buttons array, sets the array, and refreshes page
btn.on("click", function() {
  input = $(":text:eq(" + 0 + ")").val();
  citiesArray.push(input);
  localStorage.setItem("cities", JSON.stringify(citiesArray));
  refreshPage();
});

// Grabbing the last entry in the citiesArray to load onto page
function pageLoad() {
  loadBtns();
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
    // Creating the 5 cards for the 5 day forecast
    for (var j=0; j < 5; j++){
      fiveDayDate = moment().add(j + 1, "day").format("MMMM Do YYYY");
      fiveDayTemp = response.list[j + 1].main.temp;
      fiveDayTemp = (fiveDayTemp - 273.15) * 9/5 + 32
      fiveDayTemp = fiveDayTemp.toFixed(2)
      $("<div>").appendTo("#fiveDayCards").addClass("card");
      $("<div>").appendTo(".card:eq(" + j + ")").addClass("card-body");
      $("<h5>").appendTo(".card-body:eq(" + j + ")").addClass("card-title").text(fiveDayDate);
      $("<div>").appendTo(".card-body:eq(" + j + ")").append("<img class='image' src=''/>");
      $(".image:eq(" + j + ")").attr("src", "http://openweathermap.org/img/wn/" + response.list[j + 1].weather[0].icon + "@2x.png");
      $("<p>").appendTo(".card-body:eq(" + j + ")").addClass("card-text").text("Temperature: " + fiveDayTemp + " ℉");
      $("<p>").appendTo(".card-body:eq(" + j + ")").addClass("card-text").text("Humidity: " + response.list[j + 1].main.humidity + "%");
    };
  });
}
pageLoad();

// Making a refresh page function for when user submits their new city
function refreshPage(){
    window.location.reload();
}; 

// Creating buttons on page load for local storage entries, and assigning click events for each to pull information on the selected city
function loadBtns() {
  for (var i=1; i < citiesArray.length; i++) {
    // Creating new buttons with a text value of each index of citiesArray, with that same id value, appending to addedCities in html
    $("<button>").text(citiesArray[i]).attr('id', citiesArray[i]).addClass("cities").appendTo("#addedCities");
    $("</br>").appendTo("#addedCities");  
    // Creating click events for the stored cities
    $("#" + citiesArray[i]).on("click", function() {
    var selectedCity = $(this).text();
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
      // Creating 5 day forecast
      for (var j=0; j < 5; j++){
        fiveDayDate = moment().add(j + 1, "day").format("MMMM Do YYYY");
        fiveDayTemp = response.list[j + 1].main.temp;
        fiveDayTemp = (fiveDayTemp - 273.15) * 9/5 + 32;
        fiveDayTemp = fiveDayTemp.toFixed(2);
        $("<div>").appendTo("#fiveDayCards").addClass("card");
        $("<div>").appendTo(".card:eq(" + j + ")").addClass("card-body");
        $("<h5>").appendTo(".card-body:eq(" + j + ")").addClass("card-title").text(fiveDayDate);
        $("<div>").appendTo(".card-body:eq(" + j + ")").append("<img class='image' src=''/>");
        $(".image:eq(" + j + ")").attr("src", "http://openweathermap.org/img/wn/" + response.list[j + 1].weather[0].icon + "@2x.png");
        $("<p>").appendTo(".card-body:eq(" + j + ")").addClass("card-text").text("Temperature: " + fiveDayTemp + " ℉");
        $("<p>").appendTo(".card-body:eq(" + j + ")").addClass("card-text").text("Humidity: " + response.list[j + 1].main.humidity + "%");
      };
      // Doing a second ajax query to obtain the UV index;
      var queryURL2 = "http://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + latitude + "&lon=" + longitude + "";
        $.ajax({
          url: queryURL2,
          method: "GET"
        }).then(function(response2) {
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
};
// When they click on a button, it will empty the main dash and 5 day display to be replaced with new information
$(".cities").on("click", function() {
  $(".empty").empty();
});