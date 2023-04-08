const URL_BASE = "https://image.tmdb.org/t/p/w300/";
const api = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  headers: { "Content-Type": "application/json;charset=utf-8" },
  params: { api_key: API_KEY },
});

//UTILS

function createVideo(movies, container) {
  container.innerHTML = "";
  movies.forEach((movie) => {
    const movieContainer = document.createElement("div");
    const movieImg = document.createElement("img");
    movieContainer.classList.add("movie-container");
    movieImg.classList.add("movie-img");
    movieImg.setAttribute("alt", movie.title);
    movieImg.setAttribute("src", URL_BASE.concat(movie.poster_path));
    movieContainer.onclick = () => {
      location.hash = `#movie=${movie.id}`;
    };
    movieContainer.appendChild(movieImg);
    container.appendChild(movieContainer);
  });
}

function createCategories(categories, container) {
  container.innerHTML = "";
  categories.forEach((category) => {
    const categoryContainer = document.createElement("div");
    const categoryTitle = document.createElement("h3");
    const categoryTitleText = document.createTextNode(category.name);
    categoryTitle.onclick = () => {
      location.hash = `#category=${category.id}-${category.name}`;
    };
    categoryContainer.classList.add("category-container");
    categoryTitle.classList.add("category-title");
    categoryTitle.setAttribute("id", "id" + category.id);
    categoryTitle.appendChild(categoryTitleText);
    categoryContainer.appendChild(categoryTitle);
    container.appendChild(categoryContainer);
  });
}

//API CONSUME

async function getCategoriesPreview() {
  const { data } = await api("genre/movie/list");
  const genres = data.genres;
  createCategories(genres, categoriesPreviewList);
}

async function getTrendingMoviesPreview() {
  const { data } = await api("trending/movie/week");
  createVideo(data.results, trendingMoviesPreviewList);
}

async function getMoviesByCategory(id) {
  const { data } = await api("discover/movie", {
    params: { with_genres: id },
  });
  createVideo(data.results, genericSection);
}

async function getMoviesBySearch(query) {
  const { data } = await api("search/movie", {
    params: { query },
  });
  createVideo(data.results, genericSection);
}

async function getTrendingMovies() {
  const { data } = await api("trending/movie/week");
  createVideo(data.results, genericSection);
}

async function getMovieById(id) {
  const { data: movie } = await api(`movie/${id}`);

  const movieImgUrl = "https://image.tmdb.org/t/p/w500/" + movie.poster_path;
  headerSection.style.background = `linear-gradient( 180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%), url(${movieImgUrl}) `;

  movieDetailTitle.textContent = movie.title;
  movieDetailDescription.textContent = movie.overview;
  movieDetailScore.textContent = movie.move_average;

  createCategories(movie.genres, movieDetailCategoriesList);
  getRelatedMoviesId(id);
}

async function getRelatedMoviesId(id) {
  const { data } = await api(`movie/${id}/recommendations`);
  createVideo(data.results, relatedMoviesContainer);
}
