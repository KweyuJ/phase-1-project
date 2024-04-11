
const baseURL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
let result = document.getElementById("result");
let searchBtn = document.getElementById("searchbtn");

// Select the mode toggle button that will switch between dark and lightmode and define the function
const modeToggleButton = document.getElementById("mode-toggle-button");
function toggleEvent() {
  document.body.classList.toggle("light-mode");
  document.body.classList.toggle("dark-mode");
}
// Add event listener to the mode toggle button
modeToggleButton.addEventListener("click", toggleEvent);

// Add event listener to the search button
searchBtn.addEventListener("click", () => {
  // Get the value of the input field when the button is clicked
  let userInput = document.getElementById("user-input").value;

  // See if the input field is empty
  if (userInput.length == 0) {
    result.innerHTML = `<h3>Input Field is Empty</h3>`;
  } else {
    // Fetch data based on the input of the user
    fetch(`${baseURL}${userInput}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        // Check if data.meals is null or empty
        if (data.meals == null || data.meals.length == 0) {
          result.innerHTML = `<h3>No meals found for '${userInput}'</h3>`;
        } else {
          // Access the first provided meal
          let myMeal = data.meals[0];
          console.log(myMeal);
          console.log(myMeal.strMealThumb);
          console.log(myMeal.strMeal);
          console.log(myMeal.strArea);
          console.log(myMeal.strInstructions);

          // Display the meal details together with intsructions
          result.innerHTML = `<img class="display-img" src= ${myMeal.strMealThumb}>
          <div class="details"> 
             <h2>${myMeal.strMeal}</h2>
             <h4>${myMeal.strArea}</h4>
          </div>
          <div id="ingredient-con"></div>
          <div id="recipe">
             <button id="hide-recipe">X</button>
             <pre id="instructions">${myMeal.strInstructions}</pre>
          </div> 
          `;

          let parent = document.createElement("ul");
          let recipe = document.getElementById("recipe");
          let hideRecipe = document.getElementById("hide-recipe");

          // Loop through ingredients
          let count = 1;
          let ingredients = [];
          for (const i in myMeal) {
            let ingredient = "";
            let measure = "";
            if (i.startsWith("strIngredient") && myMeal[i]) {
              ingredient = myMeal[i];
              measure = myMeal[`strMeasure` + count];
              count += 1;
              ingredients.push(`${measure} ${ingredient}`);
            }
          }

          // Append ingredients to the list
          ingredients.forEach((i) => {
            let child = document.createElement("li");
            child.innerText = i;
            parent.appendChild(child);
          });

          // Added another event listener to hide recipe button
          hideRecipe.addEventListener("click", () => {
            let instructions = document.getElementById("instructions");
            if (
              instructions.style.display === "none" ||
              !instructions.style.display
            ) {
              instructions.style.display = "block";
            } else {
              instructions.style.display = "none";
            }
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        result.innerHTML = `<h3>Error fetching data. Please try again later.</h3>`;
      });
  }
});

// Select the submit button
const submitRecipeButton = document.getElementById("submit-recipe-btn");

// Add event listener to the submit button
submitRecipeButton.addEventListener("click", function(event) {
  // Prevent default form submission behavior
  event.preventDefault();

  // Get the values of recipe name and instructions
  const recipeNameInput = document.getElementById("recipe-name");
  const recipeInstructionsInput = document.getElementById("recipe-instructions");

  const recipeName = recipeNameInput.value.trim();
  const recipeInstructions = recipeInstructionsInput.value.trim();

  // Check if both fields are not empty
  if (recipeName === "" || recipeInstructions === "") {
    alert("Please enter both recipe name and instructions.");
    return;
  }

  // Construct the recipe object
  const recipeData = {
    name: recipeName,
    instructions: recipeInstructions
  };

  // Send a POST request to the server
  fetch("http://localhost:3000/recipes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(recipeData)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(data => {
      // display a success message to the user
      alert("Recipe submitted successfully!");
      // Clear the form inputs
      recipeNameInput.value = "";
      recipeInstructionsInput.value = "";
    })
    .catch(error => {
      // Handle errors
      console.error("Error submitting recipe:", error);
      alert("Error submitting recipe. Please try again later.");
    });
});
