$(document).ready(function() {

  var apiKey =  "9973533";

  // Make API call to get recipe data
  function getRecipes(queryURL, queryString, userInput, mode) {
    $.ajax({
      url: queryURL,
      method: "GET",
      data: {
        i: userInput
      }
    }).then(function(response) {

      console.log(response);      

      var id;

      if (mode === "recipes") {
        id = response.meals[0].idMeal;
      } else if (mode === "drinks") {
        id = response.drinks[0].idDrink;
      }

      $.ajax({
        url: `https://www.themealdb.com/api/json/v2/${apiKey}/lookup.php`,
        method: "GET",
        data: {
          i: id
        }
      }).then(function(response) {
        console.log(response);
        displayRecipe(response);


      });
    });
  }

  function displayRecipe(recipe) {
    $("#title").text(recipe.meals[0].strMeal)
    $("#thumbnail").attr("src", recipe.meals[0].strMealThumb)
    
    if (recipe.meals[0].strYoutube) {
        var li = $("<li>").addClass("list-group-item pl-0");
        var a = $("<a>").addClass("text-success bold");
        a.text("New Video");
        a.attr("href", recipe.meals[0].strYoutube)
        li.append(a);
        $("#recipe-info").prepend(li);
        
    }
  }


  // Event Listener: Search button
  $("#search").on("click", function() {
    var mode = $(this).attr("data-mode");
    var ingredient = $("#ingredient-input").val();
    var category = $("#category").val();
    var queryURL;
    var queryString;

    if (mode === "recipes") {
      queryURL = `https://www.themealdb.com/api/json/v2/${apiKey}/filter.php`;
    } else if (mode === "drinks") {
      queryURL = `https://www.thecocktaildb.com/api/json/v2/${apiKey}/filter.php`;
    }

    if (ingredient && !category) {
      queryString = "i";
      getRecipes(queryURL, queryString, ingredient, mode);

    } else if (!ingredient && category) {
      queryString = "c";
      getRecipes(queryURL, queryString, category, mode)

    } else if (!ingredient && !category) {
      console.log("Invalid input.");
    }
  });
});