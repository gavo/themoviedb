let page;
let total_pages;
let infiniteScroll;

searchFormBtn.addEventListener("click", () => {
  location.hash = "#search=" + searchFormInput.value;
});
trendingBtn.addEventListener("click", () => {
  location.hash = "#trends";
});
arrowBtn.addEventListener("click", () => {
  location.hash = window.history.back();
});
window.addEventListener("DOMContentLoaded", navigator, { passive: false });
window.addEventListener("hashchange", navigator, { passive: false });
window.addEventListener("scroll", () => infiniteScroll(), { passive: false });

function navigator() {
  window.scrollTo({ top: 0, behavior: "smooth" });
  const hash = location.hash;
  if (hash.startsWith("#trends")) {
    trendsPage();
  } else if (hash.startsWith("#search=")) {
    searchPage();
  } else if (hash.startsWith("#movie=")) {
    movieDetailPage();
  } else if (hash.startsWith("#category=")) {
    categoriesPage();
  } else {
    homePage();
  }
}

function homePage() {
  headerSection.classList.remove("header-container--long");
  headerSection.style.background = "";
  arrowBtn.classList.add("inactive");
  arrowBtn.classList.remove("header-arrow--white");
  headerTitle.classList.remove("inactive");
  headerCategoryTitle.classList.add("inactive");
  searchForm.classList.remove("inactive");

  trendingPreviewSection.classList.remove("inactive");
  likedMoviesSection.classList.remove("inactive");
  categoriesPreviewSection.classList.remove("inactive");
  genericSection.classList.add("inactive");
  movieDetailSection.classList.add("inactive");

  getTrendingMoviesPreview();
  getCategoriesPreview();
  getLikedMovies();
  infiniteScroll = () => {};
}

function categoriesPage() {
  headerSection.classList.remove("header-container--long");
  headerSection.style.background = "";
  arrowBtn.classList.remove("inactive");
  arrowBtn.classList.remove("header-arrow--white");
  headerTitle.classList.add("inactive");
  headerCategoryTitle.classList.remove("inactive");
  searchForm.classList.add("inactive");

  trendingPreviewSection.classList.add("inactive");
  likedMoviesSection.classList.add("inactive");
  categoriesPreviewSection.classList.add("inactive");
  genericSection.classList.remove("inactive");
  movieDetailSection.classList.add("inactive");

  const [id, name] = location.hash.split("=")[1].split("-");
  headerCategoryTitle.innerHTML = name.replace("%20", " ");
  getMoviesByCategory(id);
  infiniteScroll = () => {
    getMoviesByCategoryPaginated(id);
  };
}

function movieDetailPage() {
  headerSection.classList.add("header-container--long");
  arrowBtn.classList.remove("inactive");
  arrowBtn.classList.add("header-arrow--white");
  headerTitle.classList.add("inactive");
  headerCategoryTitle.classList.add("inactive");
  searchForm.classList.add("inactive");

  trendingPreviewSection.classList.add("inactive");
  likedMoviesSection.classList.add("inactive");
  categoriesPreviewSection.classList.add("inactive");
  genericSection.classList.add("inactive");
  movieDetailSection.classList.remove("inactive");

  const [_, movieId] = location.hash.split("=");
  getMovieById(movieId);
  infiniteScroll = () => {};
}

function searchPage() {
  headerSection.classList.remove("header-container--long");
  headerSection.style.background = "";
  arrowBtn.classList.remove("inactive");
  arrowBtn.classList.remove("header-arrow--white");
  headerTitle.classList.add("inactive");
  headerCategoryTitle.classList.add("inactive");
  searchForm.classList.remove("inactive");

  trendingPreviewSection.classList.add("inactive");
  likedMoviesSection.classList.add("inactive");
  categoriesPreviewSection.classList.add("inactive");
  genericSection.classList.remove("inactive");
  movieDetailSection.classList.add("inactive");

  const [_, query] = location.hash.split("=");
  getMoviesBySearch(query);
  infiniteScroll = () => {
    getMoviesBySearchPaginated(query);
  };
}

function trendsPage() {
  headerSection.classList.remove("header-container--long");
  headerSection.style.background = "";
  arrowBtn.classList.remove("inactive");
  arrowBtn.classList.remove("header-arrow--white");
  headerTitle.classList.add("inactive");
  headerCategoryTitle.classList.remove("inactive");
  searchForm.classList.add("inactive");

  trendingPreviewSection.classList.add("inactive");
  likedMoviesSection.classList.add("inactive");
  categoriesPreviewSection.classList.add("inactive");
  genericSection.classList.remove("inactive");
  movieDetailSection.classList.add("inactive");

  headerCategoryTitle.innerHTML = "Tendencias";
  getTrendingMovies();
  infiniteScroll = getPaginatedTrendingMovies;
}
