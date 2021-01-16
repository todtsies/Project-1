$(document).ready(function() {
 
  // API + App Mode (Recipes/Drinks)
  var apiKey =  "9973533";
  var mode = "recipes";
  var api = "themealdb";

  // Track indexes of currently displayed recipe and drink
  var currentRecipe = 0;
  var currentDrink = 0;

  // Recipe and drink ID number arrays
  var recipeIds = [];
  var drinkIds = [];

  // Local storage arrays
  var savedRecipes = [];
  var savedDrinks = [];


  // Initialize app
  init();


  // Startup function
  function init() {

    // Show recipes side + hide drinks side
    $("#food-side").show();
    $("#drinks-side").hide();
    
    // Set button colors
    $(".button-left").css({"background-color": "black", "color": "white"});
    $(".button-right").css({"background-color": "gray", "color": "white"});

    // Load random recipe and drink on startup
    preloadRandomRecipe();

    // Get items saved to local storage (if any)
    getStorage();

    // Display recipes from local storage UI
    $.each(savedRecipes, function(i, recipe) {
      displaySavedRecipes(recipe);
    });

    // Display drinks from local storage in UI
    $.each(savedDrinks, function(i, drink) {
      displaySavedDrinks(drink);
    });
  }


  // Preload a random recipe and drink on startup
function preloadRandomRecipe() {
  ​
    // Get random recipe
    $.ajax({
      url: `https://www.themealdb.com/api/json/v2/${apiKey}/random.php`,
      method: "GET"
    }).then(function(response) {
      mode = "recipes";
      recipeIds.push(response.meals[0].idMeal);
      getIngredientList(response.meals[0]);
  ​
      // Get random drink
      $.ajax({
        url: `https://www.thecocktaildb.com/api/json/v2/${apiKey}/random.php`,
        method: "GET"
      }).then(function(response) {
        mode = "drinks";
        drinkIds.push(response.drinks[0].idDrink);
        getIngredientList(response.drinks[0]);
        mode = "recipes";
      })
    });
  }


  // Get recipe/drink data from APIs
  function getRecipes(api, query, userInput) {

    // Empty recipe and drink ID arrays before requesting new data
    if (mode === "recipes") {
      recipeIds.splice(0);
    } else if (mode === "drinks") {
      drinkIds.splice(0);
    }

    // Request data from either recipe API or drink API
    $.ajax({
      url: `https://www.${api}.com/api/json/v2/${apiKey}/filter.php?${query}=${userInput}`,
      method: "GET"
    }).then(function(response) {

      var resultsArray;
      var id;

      // Add returned recipes or drinks to temp array
      if (mode === "recipes") {
        resultsArray = response.meals;
      } else if (mode === "drinks") {
        resultsArray = response.drinks;
      }

      // Loop through results and push ID numbers into arrays
      $.each(resultsArray, function(i, recipe) {
        if (mode === "recipes") {
          recipeIds.push(recipe.idMeal);

        } else if (mode === "drinks") {
          drinkIds.push(recipe.idDrink);
        }
      });

      // Generate random index from results array and pass into get details function
      if (mode === "recipes") {
        currentRecipe = Math.floor(Math.random() * response.meals.length);
        id = response.meals[currentRecipe].idMeal;
        getDetails(id, api);

      } else if (mode === "drinks") {
        currentDrink = Math.floor(Math.random() * response.drinks.length);
        id = response.drinks[currentDrink].idDrink;
        getDetails(id, api);
      }
    });
  }

  // Get recipe or drink details by ID number
  function getDetails(id, api) {
    $.ajax({
      url: `https://www.${api}.com/api/json/v2/${apiKey}/lookup.php?i=${id}`,
      method: "GET"
    }).then(function(response) {

      // Pass results into get ingredients functions
      if (mode === "recipes") {
        getIngredientList(response.meals[0]);

      } else if (mode === "drinks") {
        getIngredientList(response.drinks[0]);
      }
    });
  }

  // Get ingredients and measurements from result and pass into arrays
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

    // Call function to display results in UI
    if (mode === "recipes") {
      displayRecipe(recipe, ingredients, measurements);

    } else if (mode === "drinks") {
      displayDrinks(recipe, ingredients, measurements);
    }

  }


  // Display recipe in UI
  function displayRecipe(recipe, ingredients, measurements) {

    // Display text fields
    $("#recipe-info").empty();
    $("#recipe-title").text(recipe.strMeal);
    $("#recipe-thumbnail").attr("src", recipe.strMealThumb);
    $("#recipe-instructions").text(recipe.strInstructions);

    // Generate ingredients title
    var listTitle = $("<li>");
    listTitle.addClass("list-group-item text-success bold pl-0");
    listTitle.text("Ingredients:")
    $("#recipe-info").append(listTitle);

    // Display ingredients and measurements
    $.each(ingredients, function(i, ingredient) {
      if (ingredient) {
        var li = $("<li>");
        li.addClass("list-group-item pl-0");
        li.text(measurements[i] + " " + ingredient);
        $("#recipe-info").append(li);
      }
    });

    // Display recipe source link (if available)
    if (recipe.strSource) {
      var li = $("<li>").addClass("list-group-item pl-0");
      var a = $("<a>").addClass("text-success bold");
      a.text("View Recipe Source");
      a.attr("href", recipe.strSource)
      li.append(a);
      $("#recipe-info").append(li);
    }

    // Display recipe YouTube link (if available)
    if (recipe.strYoutube) {
      var li = $("<li>").addClass("list-group-item pl-0");
      var a = $("<a>").addClass("text-success bold");
      a.text("View Video");
      a.attr("href", recipe.strYoutube)
      li.append(a);
      $("#recipe-info").append(li);
    }

    // Display recipe instructions and instructions link
    var instructions = $("<li>").addClass("list-group-item pl-0");
    var instructionsLink = $("<a>").addClass("text-success bold");
    instructions.attr({
      "data-toggle": "collapse",
      "data-target": "#drawer",
      "aria-expanded": "false",
      "aria-controls": "drawer"
    });
    instructionsLink.text("View Recipe Instructions");
    instructions.append(instructionsLink);
    $("#recipe-info").append(instructions);
  }


  // Display drink in UI
  function displayDrinks(drink, ingredients, measurements) {

    // Display text fields
    $("#drink-info").empty();
    $("#drink-title").text(drink.strDrink);
    $("#drink-thumbnail").attr("src", drink.strDrinkThumb);
    $("#drink-instructions").text(drink.strInstructions);

    // Generate ingredients title
    var li = $("<li>");
    li.addClass("list-group-item text-info bold pl-0");
    li.text("Ingredients:")
    $("#drink-info").append(li);

    // Display ingredients and measurements
    $.each(ingredients, function(i, ingredient) {
      if (ingredient) {
        var li = $("<li>");
        li.addClass("list-group-item pl-0");
        li.text(measurements[i] + " " + ingredient);
        $("#drink-info").append(li);
      }
    });

    // Display glass (if available)
    if (drink.strGlass) {
      var li = $("<li>").addClass("list-group-item pl-0 text-info bold");
      li.text(`Preferred Glass: ${drink.strGlass}`);
      $("#drink-info").append(li);
    }

    // Display drink source link (if available)
    if (drink.strSource) {
      var li = $("<li>").addClass("list-group-item pl-0");
      var a = $("<a>").addClass("text-info bold");
      a.text("View drink Source");
      a.attr("href", drink.strSource)
      li.append(a);
      $("#drink-info").append(li);
    }

    // Display drink instructions
    var instructions = $("<li>").addClass("list-group-item pl-0");
    var instructionsLink = $("<a>").addClass("text-info bold");
    instructions.attr({
      "data-toggle": "collapse",
      "data-target": "#drawer",
      "aria-expanded": "false",
      "aria-controls": "drawer"
    });
    instructionsLink.text("View Drink Instructions");
    instructions.append(instructionsLink);
    $("#drink-info").append(instructions);
  }


  // Display saved recipes and drinks
  function displaySavedRecipes(recipe) {
    var badge = $("<a>").attr("href", "#");
    badge.addClass("badge badge-success p-2 my-1 mr-1 badge-recipe");
    badge.attr("data-id", recipe.id);
    badge.text(recipe.title);
    $("#saved-recipes-container").append(badge);
  }


  function displaySavedDrinks(drink) {
    var badge = $("<a>").attr("href", "#");
    badge.addClass("badge badge-info p-2 my-1 mr-1 badge-drink");
    badge.attr("data-id", drink.id)
    badge.text(drink.title);
    $("#saved-drinks-container").append(badge);
  }


  // Save recipe to local storage
  function saveRecipe() {
    var recipe = {
      id: recipeIds[currentRecipe],
      title: $("#recipe-title").text()
    }

    displaySavedRecipes(recipe);
    getStorage();
    savedRecipes.push(recipe);
    setStorage("recipes");
  }


  // Save drink to local storage
  function saveDrink() {
    var drink = {
      id: drinkIds[currentDrink],
      title: $("#drink-title").text()
    };

    displaySavedDrinks(drink);
    getStorage();
    savedDrinks.push(drink);
    setStorage("drinks");
  }


  // Get saved recipes and drinks
  function getStorage() {
    if (localStorage.getItem("recipes") === null) {
      savedRecipes = [];
    } else {
      savedRecipes = JSON.parse(localStorage.getItem("recipes"));
    }

    if (localStorage.getItem("drinks") === null) {
      savedDrinks = [];
    } else {
      savedDrinks = JSON.parse(localStorage.getItem("drinks"));
    }
  }


  // Set saved recipes to local storage
  function setStorage(mode) {
    if (mode === "recipes") {
      localStorage.setItem("recipes", JSON.stringify(savedRecipes));
    } else if (mode === "drinks") {
      localStorage.setItem("drinks", JSON.stringify(savedDrinks));
    }
  }


  // Event Listener: Search button
  $(".search-btn").on("click", function() {
    var ingredient;
    var category;
    var query;
    var userInput;

    // Capture user inputs
    if (mode === "recipes") {
      ingredient = $("#recipe-ingredient").val();
      category = $("#recipe-categories").val();

    } else if (mode === "drinks") {
      ingredient = $("#drink-ingredient").val();
      category = $("#drink-categories").val();
    }

    // Validate and check whether user inputted ingredient or category
    if (ingredient && !category) {
      query = "i";
      userInput = ingredient;

    } else if (!ingredient && category) {
      userInput = category;
      query = "c";
    
    } else if (!ingredient && !category) {
      console.log("Invalid input.");
      return;

    } else if (ingredient && category) {
      console.log("Please choose one input only.");
      return;
    }

    // Get recipe/drink data from API
    getRecipes(api, query, userInput);

    // Reset input fields
    $("#recipe-ingredient").val("");
    $("#recipe-categories").val($("#recipe-categories option:first").val());
    $("#drink-ingredient").val("");
    $("#drink-categories").val($("#drink-categories option:first").val());
  });


  // Event Listener: Cycle Forward Arrow
  $(".cycle-forward").click(function() {
    var lastRecipe = recipeIds.length - 1;
    var lastDrink = drinkIds.length - 1;

    if (currentRecipe === lastRecipe && mode === "recipes") {
      currentRecipe = 0;
      getDetails(recipeIds[currentRecipe], api);

    } else if (currentRecipe !== lastRecipe && mode === "recipes") {
      currentRecipe++;
      getDetails(recipeIds[currentRecipe], api);
    } 
    
    if (currentDrink === lastDrink && mode === "drinks") {
      currentDrink = 0;
      getDetails(drinkIds[currentDrink], api);

    } else if (currentDrink !== lastDrink && mode === "drinks") {
      currentDrink++;
      getDetails(drinkIds[currentDrink], api);
    }
  });


  // Event Listener: Cycle Backward Button
  $(".cycle-backward").click(function() {
    var lastRecipe = recipeIds.length - 1;
    var lastDrink = drinkIds.length - 1;

    if (currentRecipe === 0 && mode === "recipes") {
      currentRecipe = lastRecipe;
      getDetails(recipeIds[currentRecipe], api);

    } else if (currentRecipe > 0 && mode === "recipes") {
      currentRecipe--;
      getDetails(recipeIds[currentRecipe], api);
    }

    if (currentDrink === 0 && mode === "drinks") {
      currentDrink = lastDrink;
      getDetails(drinkIds[currentDrink], api);

    } else if (currentDrink > 0 && mode === "drinks") {
      currentDrink--;
      getDetails(drinkIds[currentDrink], api);
    }
  });


  // Event Listener: Saved recipe arrow
  $("#saved-recipes-header").on("click", function() {
    var arrow = $("#recipe-arrow");
    var direction = arrow.attr("data-direction");

    if (direction === "up") {
      arrow.removeClass("fa-chevron-up");
      arrow.addClass("fa-chevron-down");
      arrow.attr("data-direction", "down");

    } else if (direction === "down") {
      arrow.removeClass("fa-chevron-down");
      arrow.addClass("fa-chevron-up");
      arrow.attr("data-direction", "up");
    }
  });


  // Event Listener: Saved drinks arrow
  $("#saved-drinks-header").on("click", function() {
    var arrow = $("#drink-arrow");
    var direction = arrow.attr("data-direction");

    if (direction === "up") {
      arrow.removeClass("fa-chevron-up");
      arrow.addClass("fa-chevron-down");
      arrow.attr("data-direction", "down");

    } else if (direction === "down") {
      arrow.removeClass("fa-chevron-down");
      arrow.addClass("fa-chevron-up");
      arrow.attr("data-direction", "up");
    }
  });


  // Event Listeners: Save recipe and save drink buttons
  $("#save-recipe").on("click", saveRecipe);
  $("#save-drink").on("click", saveDrink);

  // Event Listener: Delete recipes from UI and local storage
  $("#delete-recipes").on("click", function() {
  $("#saved-recipes-container").empty();
  savedRecipes.splice(0);
  setStorage("recipes");
  });

  // Event Listener: Saved recipe badge
  $("#saved-recipes-container").on("click", ".badge-recipe", function() {
    var recipeId = $(this).attr("data-id");
    getDetails(recipeId, "themealdb");
  });


  // Event Listener: Saved drink badge
  $("#saved-drinks-container").on("click", ".badge-drink", function() {
    var drinkId = $(this).attr("data-id");
    getDetails(drinkId, "thecocktaildb");
  });


  // Event Listener: Food Button
  $('.button-left').click(function() {
    mode = "recipes";
    api = "themealdb";
    $(".save-btn").hide();
    $('#food-side').show(500);
    $('#drinks-side').hide(500);
    $(".button-left").css({"background-color": "black", "color": "white"});
    $(".button-right").css({"background-color": "gray", "color": "white"});
    $("#sticky-footer").removeClass("bg-info").addClass("bg-success");
  });

  // Event Listener: Drinks Button
  $('.button-right').click(function() {
    mode = "drinks";
    api = "thecocktaildb";
    $(".save-btn").hide();
    $('#drinks-side').show(500);
    $('#food-side').hide(500);
    $(".button-left").css({"background-color": "gray", "color": "white"});
    $(".button-right").css({"background-color": "black", "color": "white"});
    $("#sticky-footer").removeClass("bg-success").addClass("bg-info");
  });
});

