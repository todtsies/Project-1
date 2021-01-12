$(document).ready(function() {

  var apiKey =  "9973533";
  var mode = "recipes";


  function getRecipes(api, query, userInput) {
    $.ajax({
      url: `https://www.${api}.com/api/json/v2/${apiKey}/filter.php?${query}=${userInput}`,
      method: "GET"
    }).then(function(response) {
      console.log(response);

      var index;
      var id;

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

    console.log(id);

    $.ajax({
      url: `https://www.${api}.com/api/json/v2/${apiKey}/lookup.php?i=${id}`,
      method: "GET"
    }).then(function(response) {
      console.log(response);
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