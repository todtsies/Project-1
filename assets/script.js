$(document).ready(function() {

  // Make API call to get recipe data
  function getRecipes(queryURL, queryString, userInput) {
    $.ajax({
      url: queryURL,
      method: "GET",
      data: {
        i: userInput
      }
    }).then(function(response) {
      console.log(response);      
    });
  }


  // Event Listener: Search button
  $("#search").on("click", function() {
    var mode = $(this).attr("data-mode");
    var ingredient = $("#ingredient-input").val();
    var category = $("#category").val();
    var apiKey =  "9973533";
    var queryURL;
    var queryString;

    if (mode === "recipes") {
      queryURL = `https://www.themealdb.com/api/json/v2/${apiKey}/filter.php`;
    } else if (mode === "drinks") {
      queryURL = `https://www.thecocktaildb.com/api/json/v2/${apiKey}/filter.php`;
    }

    if (ingredient && !category) {
      queryString = "i";
      getRecipes(queryURL, queryString, ingredient);

    } else if (!ingredient && category) {
      queryString = "c";
      getRecipes(queryURL, queryString, category)

    } else if (!ingredient && !category) {
      console.log("Invalid input.");
    }
  });
});