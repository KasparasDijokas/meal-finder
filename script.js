const inputValue = document.getElementById("search-meal");
const searchBtn = document.getElementById("search-button");
const randomBtn = document.getElementById("random-button");
const resultContainer = document.getElementById("result-container");
const resultHeading = document.getElementById("result-heading");
const singleMeal = document.getElementById("single-meal");
const error = document.getElementById("error");

function fetchData(value) {
  // check if input valid
  if (!value.trim()) {
    error.innerHTML = "Please enter valid meal name";
    error.classList.add("show");
    setTimeout(() => {
      error.classList.remove("show");
    }, 1500);
  } else {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${value}`)
      .then((response) => response.json())
      .then((data) => {
        resultContainer.innerHTML = "";
        resultHeading.innerHTML = "";
        singleMeal.innerHTML = "";
        data.meals.map((item) => {
          const meal = document.createElement("div");
          meal.className = "meal-container";
          meal.setAttribute(`data-mealID`, `${item.idMeal}`);
          meal.innerHTML = `<img src=${item.strMealThumb}></img> <p class="meal-heading">${item.strMeal}</p>`;
          resultHeading.innerHTML = `Search results for '${value}':`;
          resultContainer.append(meal);
        });
      });
  }
}

// fetch meal by id
function getMealById(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`).then(
    (response) =>
      response.json().then((data) => {
        const meal = data.meals[0];
        console.log(data);
        addMealToDOM(meal);
      })
  );
}

// add meal to DOM
function addMealToDOM(meal) {
  resultContainer.innerHTML = "";
  resultHeading.innerHTML = "";
  singleMeal.innerHTML = "";
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  singleMeal.innerHTML = `<div class="single-meal">
        <h1>${meal.strMeal}</h1>
        <img src=${meal.strMealThumb} alt="${meal.strMeal}"> </img>
        <div class="dotted-box">
            <p class="dotted-p">${meal.strCategory}</p>
            <p class="dotted-p">${meal.strArea}</p>
        </div>
        <div class="meal-instructions">
            <p>${meal.strInstructions}</p>
        </div>
        <div class="meal-ingredients">
            <h2>Ingredients</h2>
            <ul>
            ${ingredients.map((item) => `<li>${item}</li>`).join("")}
            </ul>
        </div>
    </div>`;
}

function randomMeal() {
  resultContainer.innerHTML = "";
  resultHeading.innerHTML = "";
  fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    .then((response) => response.json())
    .then((data) => {
      const meal = data.meals[0];
      addMealToDOM(meal);
    });
}

resultContainer.addEventListener("click", (e) => {
  const mealInfo = e.path.find((item) => {
    if (item.classList) {
      return item.classList.contains("meal-container");
    } else {
      return false;
    }
  });

  if (mealInfo) {
    const mealID = mealInfo.getAttribute("data-mealID");
    getMealById(mealID);
  }
});

searchBtn.addEventListener("click", (event) => {
  event.preventDefault();
  const mealName = inputValue.value;
  fetchData(mealName);
});

randomBtn.addEventListener("click", (e) => {
  e.preventDefault();
  randomMeal();
});
