const URL_BASE = "https://image.tmdb.org/t/p/w300/";
const api = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  headers: { "Content-Type": "application/json;charset=utf-8" },
  params: { api_key: API_KEY },
});

function likedMovieList() {
  const item = JSON.parse(localStorage.getItem("liked_movies"));
  let movies = item ? item : {};
  return movies;
}

function likeMovie(movie) {
  const likedMovies = likedMovieList();
  if (likedMovies[movie.id]) {
    delete likedMovies[movie.id];
    console.log("La película ya está en LS, toca eliminarla");
  } else {
    console.log("La película no está en LS, toca agregarla");
    likedMovies[movie.id] = movie;
  }
  localStorage.setItem("liked_movies", JSON.stringify(likedMovies));
  console.log(likedMovies);
}

//UTILS

const lazyLoader = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const src = entry.target.getAttribute("data-img");
      entry.target.setAttribute("src", src);
    }
  });
});

function createVideo(
  movies,
  container,
  { lazyLoad = true, clean = true } = {}
) {
  if (clean) container.innerHTML = "";
  movies.forEach((movie) => {
    const movieContainer = document.createElement("div");
    const movieImg = document.createElement("img");
    movieContainer.classList.add("movie-container");
    movieImg.classList.add("movie-img");
    movieImg.setAttribute("alt", movie.title);
    movieImg.setAttribute(
      lazyLoad ? "data-img" : "src",
      URL_BASE.concat(movie.poster_path)
    );
    movieImg.addEventListener("error", () => {
      movieImg.setAttribute(
        "src",
        "https://static.platzi.com/static/images/error/img404.png"
      );
    });
    movieImg.onclick = () => {
      location.hash = `#movie=${movie.id}`;
    };

    const movieBtn = document.createElement("button");
    movieBtn.classList.add("movie-btn");
    likedMovieList()[movie.id] && movieBtn.classList.add("movie-btn--liked");
    movieBtn.onclick = () => {
      movieBtn.classList.toggle("movie-btn--liked");
      likeMovie(movie);
      if (!likedMoviesSection.classList.contains("inactive")) {
        getLikedMovies();
      }
    };

    if (lazyLoad) lazyLoader.observe(movieImg);
    movieContainer.appendChild(movieImg);
    movieContainer.appendChild(movieBtn);
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
  createVideo(data.results, trendingMoviesPreviewList, true);
}

async function getMoviesByCategory(id) {
  const { data } = await api("discover/movie", {
    params: { with_genres: id },
  });
  createVideo(data.results, genericSection);
  page = 1;
  total_pages = data.total_pages;
}

async function getMoviesByCategoryPaginated(id) {
  const scrollIsNotMax = page < total_pages;
  if (scrollIsBottom() && scrollIsNotMax) {
    page++;
    const { data } = await api("discover/movie", {
      params: { with_genres: id },
      page,
    });
    createVideo(data.results, genericSection, { clean: false, lazyLoad: true });
    total_pages = data.total_pages;
  }
}

async function getMoviesBySearch(query) {
  const { data } = await api("search/movie", {
    params: { query },
  });
  createVideo(data.results, genericSection);
  total_pages = data.total_pages;
  page = 1;
}

async function getMoviesBySearchPaginated(query) {
  const scrollIsNotMax = page < total_pages;
  if (scrollIsBottom() && scrollIsNotMax) {
    page++;
    const { data } = await api("search/movie", {
      params: { query, page, include_adult: false },
    });
    total_pages = data.total_pages;
    createVideo(data.results, genericSection, { clean: false, lazyLoad: true });
  }
}

async function getTrendingMovies() {
  const { data } = await api("trending/movie/week");
  createVideo(data.results, genericSection);
  total_pages = data.total_pages;
  page = 1;
}

async function getPaginatedTrendingMovies() {
  const scrollIsNotMax = page < total_pages;
  if (scrollIsBottom() && scrollIsNotMax) {
    page++;
    const { data } = await api("trending/movie/week", {
      params: {
        page,
      },
    });
    total_pages = data.total_pages;
    createVideo(data.results, genericSection, { clean: false, lazyLoad: true });
  }
}

function scrollIsBottom() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  return scrollTop + clientHeight >= scrollHeight - 50;
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

function getLikedMovies() {
  const likedMovies = likedMovieList();
  const arrayMovies = Object.values(likedMovies);
  createVideo(arrayMovies, likedMoviesListContainer, {
    lazyLoad: true,
    clean: true,
  });
}
