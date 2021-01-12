$(document).ready(function() {

  var apiKey =  "9973533";
  var mode = "recipes";


  function getRecipes(api, query, userInput) {
    $.ajax({
      url: `https://www.${api}.com/api/json/v2/${apiKey}/filter.php?${query}=${userInput}`,
      method: "GET"
    }).then(function(response) {
      console.log(response);

      var recipeArray;
      var recipeIds = [];
      var index;
      var id;

      if (mode === "recipes") {
        recipeArray = response.meals;
      } else if (mode === "drinks") {
        recipeArray = response.drinks;
      }

      $.each(recipeArray, function(i, recipe) {
        if (mode === "recipes") {
          recipeIds.push(recipe.idMeal);

        } else if (mode === "drinks") {
          recipeIds.push(recipe.drinkId);
        }
      });

      if (mode === "recipes") {
        index = Math.floor(Math.random() * response.meals.length);
        id = response.meals[index].idMeal;
        getDetails(id, api);

      } else if (mode === "drinks") {
        index = Math.floor(Math.random() * response.drinks.length);
        id = response.drinks[index].idDrink;
        getDetails(id, api);
      }
    });
  }


  function getDetails(id, api) {
    $.ajax({
      url: `https://www.${api}.com/api/json/v2/${apiKey}/lookup.php?i=${id}`,
      method: "GET"
    }).then(function(response) {
      console.log(response);

      if (mode === "recipes") {
        getIngredientList(response.meals[0]);

      } else if (mode === "drinks") {
        getIngredientList(response.drinks[0]);
      }
    });
  }


  function getIngredientList(recipe) {

    var ingredients = [
      recipe.strIngredient1,
      recipe.strIngredient2,
      recipe.strIngredient3,
      recipe.strIngredient4,
      recipe.strIngredient5,
      recipe.strIngredient6,
      recipe.strIngredient7,
      recipe.strIngredient8,
      recipe.strIngredient9,
      recipe.strIngredient10,
      recipe.strIngredient11,
      recipe.strIngredient12,
      recipe.strIngredient13,
      recipe.strIngredient14,
      recipe.strIngredient15,
      recipe.strIngredient16,
      recipe.strIngredient17,
      recipe.strIngredient18,
      recipe.strIngredient19,
      recipe.strIngredient20,
    ];

    var measurements = [
      recipe.strMeasure1,
      recipe.strMeasure2,
      recipe.strMeasure3,
      recipe.strMeasure4,
      recipe.strMeasure5,
      recipe.strMeasure6,
      recipe.strMeasure7,
      recipe.strMeasure8,
      recipe.strMeasure9,
      recipe.strMeasure10,
      recipe.strMeasure11,
      recipe.strMeasure12,
      recipe.strMeasure13,
      recipe.strMeasure14,
      recipe.strMeasure15,
      recipe.strMeasure16,
      recipe.strMeasure17,
      recipe.strMeasure18,
      recipe.strMeasure19,
      recipe.strMeasure20,
    ];

    if (mode === "recipes") {
      displayRecipe(recipe, ingredients, measurements);

    } else if (mode === "drinks") {

    }

  }


  function displayRecipe(recipe, ingredients, measurements) {

    $("#title").text(recipe.strMeal);
    $("#thumbnail").attr("src", recipe.strMealThumb);
    $("#instructions").text(recipe.strInstructions);

    var listTitle = $("<li>");
    listTitle.addClass("list-group-item text-success bold pl-0");
    listTitle.text("Ingredients:")
    $("#recipe-info").append(listTitle);

    $.each(ingredients, function(i, ingredient) {
      if (ingredient) {
        var li = $("<li>");
        li.addClass("list-group-item pl-0");
        li.text(measurements[i] + " " + ingredient);
        $("#recipe-info").append(li);
      }
    });

    if (recipe.strSource) {
      var li = $("<li>").addClass("list-group-item pl-0");
      var a = $("<a>").addClass("text-success bold");
      a.text("View Recipe Source");
      a.attr("href", recipe.strSource)
      li.append(a);
      $("#recipe-info").append(li);
    }

    if (recipe.strYoutube) {
      var li = $("<li>").addClass("list-group-item pl-0");
      var a = $("<a>").addClass("text-success bold");
      a.text("View Video");
      a.attr("href", recipe.strYoutube)
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
  $(".search-btn").on("click", function() {

    var ingredient;
    var category;
    var api;
    var query;
    var userInput;

    if (mode === "recipes") {
      api = "themealdb";
      ingredient = $("#recipe-ingredient").val();
      category = $("#recipe-categories").val();

    } else if (mode === "drinks") {
      api = "thecocktaildb";
      ingredient = $("#drink-ingredient").val();
      category = $("#drink-categories").val();
    }

    if (ingredient && !category) {
      query = "i";
      userInput = ingredient;

    } else if (!ingredient && category) {
      userInput = category;
      query = "c";
    
    } else if (!ingredient && !category) {
      console.log("Invalid input.");

    } else if (ingredient && category) {
      console.log("Please choose one input only.");
    }

    getRecipes(api, query, userInput);
  });


  // Event Listeners: Food/Drink Buttons
  $(".button-left").ready(function() {
    $("#food-side").show();
    $("#drinks-side").hide();
    $(".button-left").css({"background-color": "black", "color": "white"});
    $(".button-right").css({"background-color": "gray", "color": "white"});
  });
  
  $('.button-left').click(function() {
    mode = "recipes";
    $('#food-side').show(500);
    $('#drinks-side').hide(500);
    $(".button-left").css({"background-color": "black", "color": "white"});
    $(".button-right").css({"background-color": "gray", "color": "white"});
  });

  $('.button-right').click(function() {
    mode = "drinks";
    $('#drinks-side').show(500);
    $('#food-side').hide(500);
    $(".button-left").css({"background-color": "gray", "color": "white"});
    $(".button-right").css({"background-color": "black", "color": "white"});
  });
});