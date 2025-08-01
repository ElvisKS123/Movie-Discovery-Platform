// Use TMDB_API_KEY from config.js
const API_KEY = typeof TMDB_API_KEY !== 'undefined' ? TMDB_API_KEY : undefined;
const API_BASE = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p/w500";

const moviesDiv = document.getElementById("movies");
const genreSelect = document.getElementById("genre-select");
const sortSelect = document.getElementById("sort-select");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const modal = document.getElementById("movie-modal");

async function fetchGenres() {
  try {
    const res = await fetch(`${API_BASE}/genre/movie/list?api_key=${API_KEY}`);
    if (!res.ok) throw new Error("Failed to fetch genres.");
    const data = await res.json();
    genreSelect.innerHTML = `<option value="">All Genres</option>` +
      data.genres.map(g => `<option value="${g.id}">${g.name}</option>`).join('');
  } catch (err) {
    genreSelect.innerHTML = `<option value="">Error loading genres</option>`;
  }
}

async function fetchMovies(query = "", genre = "", sort = "popularity.desc") {
  let url = `${API_BASE}/discover/movie?api_key=${API_KEY}&sort_by=${sort}&language=en-US&page=1`;
  if (genre) url += `&with_genres=${genre}`;
  if (query) url = `${API_BASE}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to load movies.");
    const data = await res.json();
    renderMovies(data.results || []);
  } catch (err) {
    moviesDiv.innerHTML = `<p style="color: #ff6666;">Error loading movies. Please try again later.</p>`;
  }
}

function renderMovies(movies) {
  if (!movies.length) {
    moviesDiv.innerHTML = "<p>No movies found.</p>";
    return;
  }
  moviesDiv.innerHTML = movies.map(m => `
    <div class="movie-card" data-id="${m.id}">
      <img src="${m.poster_path ? IMG_BASE + m.poster_path : 'https://via.placeholder.com/300x450?text=No+Image'}" alt="${m.title}">
      <div class="movie-info">
        <div class="movie-title">${m.title}</div>
        <div class="movie-meta">
          ⭐ ${m.vote_average} &nbsp; • &nbsp; ${m.release_date ? m.release_date.substring(0,4) : ''}
        </div>
      </div>
    </div>
  `).join('');
  Array.from(document.getElementsByClassName('movie-card')).forEach(card =>
    card.addEventListener('click', () => showMovieDetails(card.dataset.id))
  );
}

async function showMovieDetails(id) {
  try {
    const res = await fetch(`${API_BASE}/movie/${id}?api_key=${API_KEY}&append_to_response=credits`);
    if (!res.ok) throw new Error("Failed to load details.");
    const m = await res.json();
    modal.classList.add('active');
    modal.innerHTML = `
      <div class="modal-content">
        <button class="modal-close" onclick="document.getElementById('movie-modal').classList.remove('active')">&times;</button>
        <h2>${m.title} (${m.release_date?.substring(0,4)})</h2>
        <img src="${m.poster_path ? IMG_BASE + m.poster_path : 'https://via.placeholder.com/300x450?text=No+Image'}" style="width:100%;max-width:220px;float:left;margin-right:1rem;margin-bottom:1rem;">
        <div style="overflow:auto;">
          <p>${m.overview || "No synopsis available."}</p>
          <b>Genres:</b> ${(m.genres || []).map(g => g.name).join(', ')}<br>
          <b>Cast:</b> ${(m.credits?.cast?.slice(0,5).map(c => c.name).join(', ') || "N/A")}
        </div>
      </div>
    `;
  } catch (err) {
    modal.classList.add('active');
    modal.innerHTML = `<div class="modal-content"><button class="modal-close" onclick="document.getElementById('movie-modal').classList.remove('active')">&times;</button>
      <p style="color: #ff6666;">Error loading movie details.</p>
    </div>`;
  }
}

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  fetchMovies(searchInput.value, genreSelect.value, sortSelect.value);
});
genreSelect.addEventListener('change', () =>
  fetchMovies(searchInput.value, genreSelect.value, sortSelect.value)
);
sortSelect.addEventListener('change', () =>
  fetchMovies(searchInput.value, genreSelect.value, sortSelect.value)
);
window.onclick = e => { if (e.target == modal) modal.classList.remove('active'); };

fetchGenres().then(() => fetchMovies());