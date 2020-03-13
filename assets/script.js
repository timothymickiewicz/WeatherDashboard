var btn = $(".btn");
var citiesArray = [];
var date = moment().format('MMMM Do YYYY, h:mm a');

$("#date").text(date);
// Making a refresh page function for when user submits their new city
function refreshPage(){
    window.location.reload();
}; 
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
    console.log(input);
    citiesArray.push(input);
    localStorage.setItem("cities", JSON.stringify(citiesArray));
    console.log(citiesArray);
    refreshPage();
});
for (i=1; i < citiesArray.length; i++) {
  $("<button>").text(citiesArray[i]).addClass("cities").appendTo("#addedCities");
  $("</br>").appendTo("#addedCities"); 
  var APIKey = "7460ca674a63cbae5e3acbd439f037f5";
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + citiesArray[i] + "&appid=" + APIKey;
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      console.log(response);
      var city = response.name;
      console.log(city);

    });
    
}
// * City Name
// * Date
// * Icon representation
// * Temperature
// * Humidity
// * Wind Speed
// * UV Index (with color representation)  