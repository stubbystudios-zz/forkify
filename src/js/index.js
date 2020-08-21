// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/base';

/*
  Global state of the app. 
  This is equal to the "store" in React
  - Search objects
  - Current recipe object
  - Shopping list object
  - Liked recipes
*/
const state = {};

// SEARCH CONTROLLER
const controlSearch = async () => {
  // Get the query from the view.
  const query = searchView.getInput();

  if (query) {
    // New search object and add to state
    state.search = new Search(query);

    // Prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);

    try {
      //Search for recipes
      await state.search.getResults();

      // Render results in UI
      clearLoader();
      searchView.renderResults(state.search.result);
    } catch (error) {
      alert('Something went wrong with the search...', error);
      clearLoader();
    }
  }
}

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline');
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
    console.log(goToPage);
  }
});

// RECIPE CONTROLLER
const controlRecipe = async () => {
  // Get the ID from the URL
  const id = window.location.hash.replace('#', '');
  console.log(id);

  if (id) {
    // Prepare for UI changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    // Create new recipe object
    state.recipe = new Recipe(id);

    try {
      // Get recipe data and parse ingredients
      await state.recipe.getRecipe();
      // console.log('Ingredients', state.recipe.ingredients);
      state.recipe.parseIngredients();

      // Calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();

      // Render recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe);
    } catch (error) {
      console.log('Error processing recipe', error);
    }
  }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));
