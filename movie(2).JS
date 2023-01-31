const BASE_URL = "https://webdev.alphacamp.io"
const INDEX_URL = BASE_URL + "/api/movies/"
const POSTER_URL = BASE_URL + "/posters/"
const movies = []
const dataPanel = document.querySelector("#data-panel")
const inputForm = document.querySelector("#search-form")
const searchInput = document.querySelector("#search-input")
let filteredMovies = []
const pagination = document.querySelector("#pagination")
const moviesPerPage = 12

// ajax
axios.get(INDEX_URL)
  .then(function (response) {
    // handle success
    //data-results
    movies.push(...response.data.results)
    renderMovieList(renderMoviesPagination(1))
    addMoviesPagination(movies.length)
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })

////////// function //////////
function renderMovieList(data) {
  let rawHTML = ""
  //titel, image, description
  for (let movie of data) {
    rawHTML += `<div class="col-sm-3 mb-5">
        <div class="card">
          <img
            src="${POSTER_URL + movie.image}"
            class="card-img-top" alt="..." data-id="${movie.id}">
          <div class="card-body">
            <h5 class="card-title" id="cardTitle" data-id="${movie.id}">${movie.title}</h5>
            <div class="btn-form" id="btn-form">
              <button class="btn btn-success btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${movie.id}">more</button>
              <button class="btn btn-danger btn-favorite-movie" data-id="${movie.id}">+</button>
            </div>
          </div>
        </div>
      </div>`
  }

  dataPanel.innerHTML = rawHTML
}

function getMoreMovieInfo(movieId) {
  const modalTitle = document.querySelector("#modal-title")
  const modalImage = document.querySelector("#modal-image")
  const modalDescription = document.querySelector("#modal-description")
  const movieRelease = document.querySelector("#movie-modal-date")
  //清空先前存的資料
  modalTitle.textContent = ""
  modalDescription.textContent = ""
  modalImage.src = ""
  movieRelease.textContent = ""

  const movie = movies.find((movie) =>
    movie.id === Number(movieId)
  )
  modalTitle.textContent = movie.title
  modalImage.src = POSTER_URL + movie.image
  modalDescription.textContent = movie.description
  movieRelease.textContent = 'Release date:' + ' ' + movie.release_date
}
//0~11, 12~23, 24~35...

function renderMoviesPagination(page) {
  const data = filteredMovies.length ? filteredMovies : movies
  const list = data.slice((page - 1) * moviesPerPage, (page - 1) * moviesPerPage + moviesPerPage)
  return list
}

function addMoviesPagination(amount) {
  let rawHTML = ""
  const pageNum = Math.ceil(amount / moviesPerPage)
  for (let page = 1; page <= pageNum; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  pagination.innerHTML = rawHTML
}

function addFavoriteMovies(id) {
  const data = JSON.parse(localStorage.getItem("favoriteMovies(2)")) || []
  if (data.find((movie) =>
    movie.id === Number(id) 
  )){ return alert( "此電影已加過至我的最愛了。")
  } else {
      data.push(movies.find((movie)=>
      movie.id === Number(id)
    ))
  }
  localStorage.setItem("favoriteMovies(2)",JSON.stringify(data))
}

////////// 監聽器 ///////////
dataPanel.addEventListener("click", function onOneClick(event) {
  const id = event.target.dataset.id
  if (event.target.matches(".btn-show-movie")) {
    getMoreMovieInfo(id)
  } else if (event.target.matches(".btn-favorite-movie")) {
    addFavoriteMovies(id)
  }
})

inputForm.addEventListener("submit", (event) => {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  )
  if (filteredMovies.length === 0) {
    return alert(`找不到${keyword}的相關電影`)
  } else {
    renderMovieList(renderMoviesPagination(1))
    addMoviesPagination(filteredMovies.length)
  }
})

pagination.addEventListener("click", (event) => {
  const page = Number(event.target.dataset.page)
  renderMovieList(renderMoviesPagination(page))
})