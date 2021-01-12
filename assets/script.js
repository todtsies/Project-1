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

      var index = Math.floor(Math.random() * response.meals.length);

      if (mode === "recipes") {
        id = response.meals[index].idMeal;
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
    var meal = recipe.meals[0];

    var ingredients = [
      meal.strIngredient1,
      meal.strIngredient2,
      meal.strIngredient3,
      meal.strIngredient4,
      meal.strIngredient5,
      meal.strIngredient6,
      meal.strIngredient7,
      meal.strIngredient8,
      meal.strIngredient9,
      meal.strIngredient10,
      meal.strIngredient11,
      meal.strIngredient12,
      meal.strIngredient13,
      meal.strIngredient14,
      meal.strIngredient15,
      meal.strIngredient16,
      meal.strIngredient17,
      meal.strIngredient18,
      meal.strIngredient19,
      meal.strIngredient20,
    ];

    var measurements = [
      meal.strMeasure1,
      meal.strMeasure2,
      meal.strMeasure3,
      meal.strMeasure4,
      meal.strMeasure5,
      meal.strMeasure6,
      meal.strMeasure7,
      meal.strMeasure8,
      meal.strMeasure9,
      meal.strMeasure10,
      meal.strMeasure11,
      meal.strMeasure12,
      meal.strMeasure13,
      meal.strMeasure14,
      meal.strMeasure15,
      meal.strMeasure16,
      meal.strMeasure17,
      meal.strMeasure18,
      meal.strMeasure19,
      meal.strMeasure20,
    ];

    $("#title").text(meal.strMeal);
    $("#thumbnail").attr("src", meal.strMealThumb);
    $("#instructions").text(meal.strInstructions);

    var listTitle = $("<li>");
    listTitle.addClass("list-group-item text-success bold pl-0");
    listTitle.text("Ingredients:")
    $("#recipe-info").append(listTitle);

    $.each(ingredients, function(i, ingredient) {
      if (ingredient) {
        var li = $("<li>");
        li.addClass("list-group-item pt-0 pl-0");
        li.text(measurements[i] + " " + ingredient);
        $("#recipe-info").append(li);
      }
    });

    if (meal.strSource) {
      var li = $("<li>").addClass("list-group-item pl-0");
      var a = $("<a>").addClass("text-success bold");
      a.text("View Recipe Source");
      a.attr("href", meal.strSource)
      li.append(a);
      $("#recipe-info").append(li);
    }

    if (meal.strYoutube) {
      var li = $("<li>").addClass("list-group-item pl-0");
      var a = $("<a>").addClass("text-success bold");
      a.text("View Video");
      a.attr("href", meal.strYoutube)
      li.append(a);
      $("#recipe-info").append(li);
    }

    var instructions = $("<li>").addClass("list-group-item pl-0");
    var instructionsLink = $("<a>").addClass("text-success bold");
    instructionsLink.attr("data-toggle", "collapse");
    instructionsLink.attr("data-target", "#drawer");
    instructionsLink.attr("aria-expanded", "false");
    instructionsLink.attr("aria-controls", "drawer");
    instructionsLink.text("View Recipe Instructions");
    instructions.append(instructionsLink);
    $("#recipe-info").append(instructions);
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


  // Event Listeners: Food/Drink Buttons
  $(".button-left").ready(function() {
    $("#food-side").show();
    $("#drinks-side").hide();
    $(".button-left").css({"background-color": "black", "color": "white"});
    $(".button-right").css({"background-color": "gray", "color": "white"});
  });
  
  $('.button-left').click(function() {
    $('#food-side').show(500);
    $('#drinks-side').hide(500);
    $(".button-left").css({"background-color": "black", "color": "white"});
    $(".button-right").css({"background-color": "gray", "color": "white"});
  });

  $('.button-right').click(function() {
    $('#drinks-side').show(500);
    $('#food-side').hide(500);
    $(".button-left").css({"background-color": "gray", "color": "white"});
    $(".button-right").css({"background-color": "black", "color": "white"});
  });
});