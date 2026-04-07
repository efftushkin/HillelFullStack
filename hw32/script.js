// API Configuration
const API_KEY = 'YOUR_API_KEY'; // Replace with your API key from http://www.omdbapi.com/apikey.aspx
const API_URL = 'https://www.omdbapi.com/';
const NO_POSTER_URL = 'https://m.media-amazon.com/images/G/01/imdb/images-ANDW73HA/favicon_iPhone_retina_180x180._CB1582158069_.png';

// Get DOM elements
const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('resultsContainer');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const emptyState = document.getElementById('emptyState');
const searchInfo = document.getElementById('searchInfo');

// Variables for debounce
let debounceTimer;
const DEBOUNCE_DELAY = 500; // milliseconds

// Input text event handler
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    
    // Clear previous timer
    clearTimeout(debounceTimer);
    
    // If input is empty
    if (query.length === 0) {
        clearResults();
        showEmptyState();
        searchInfo.textContent = '';
        return;
    }
    
    // If query is too short
    if (query.length < 3) {
        searchInfo.textContent = 'Enter at least 3 characters for search';
        clearResults();
        showEmptyState();
        return;
    }
    
    // Set new timer for debounce
    debounceTimer = setTimeout(() => {
        searchMovies(query);
    }, DEBOUNCE_DELAY);
});

// Search movies function
async function searchMovies(query) {
    try {
        // Show loading indicator
        showLoading();
        hideError();
        hideEmptyState();
        searchInfo.textContent = `Search: "${query}"...`;
        
        // Execute API request
        const response = await fetch(`${API_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(data);
        
        // Hide loading indicator
        hideLoading();
        
        // Handle results
        if (data.Response === 'True') {
            displayResults(data.Search);
            searchInfo.textContent = `Знайдено ${data.totalResults} результатів`;
        } else if (data.Error === 'Movie not found!') {
            showNoResults();
            searchInfo.textContent = 'Нічого не знайдено';
        } else {
            throw new Error(data.Error || 'Unknown error');
        }
    } catch (error) {
        hideLoading();
        showError(error.message);
        searchInfo.textContent = '';
        console.error('Search error:', error);
    }
}

// Display results
function displayResults(movies) {
    clearResults();
    hideEmptyState();
    
    movies.forEach((movie, index) => {
        const movieCard = createMovieCard(movie, index);
        resultsContainer.appendChild(movieCard);
    });
}

// Show no results
function showNoResults() {
    clearResults();
    hideEmptyState();
}

// Create movie card
function createMovieCard(movie, index) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    const posterUrl = movie.Poster !== 'N/A' ? movie.Poster : NO_POSTER_URL;
    
    card.innerHTML = `
        <img src="${posterUrl}" alt="${movie.Title}" class="movie-poster" onerror="this.src='${NO_POSTER_URL}'">
        <div class="movie-info">
            <h3 class="movie-title">${movie.Title}</h3>
            <div class="movie-details">
                <span class="movie-year">${movie.Year}</span>
                <span class="movie-type">${movie.Type}</span>
            </div>
            <div class="movie-id">ID: ${movie.imdbID}</div>
        </div>
    `;
    
    // Add click handler to open IMDb
    card.addEventListener('click', () => {
        window.open(`https://www.imdb.com/title/${movie.imdbID}`, '_blank');
    });
    
    return card;
}

// UI management functions
function showLoading() {
    loadingSpinner.classList.remove('hidden');
}

function hideLoading() {
    loadingSpinner.classList.add('hidden');
}

function showError(message) {
    errorText.textContent = `Помилка: ${message}`;
    errorMessage.classList.remove('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}

function showEmptyState() {
    emptyState.classList.remove('hidden');
}

function hideEmptyState() {
    emptyState.classList.add('hidden');
}

function clearResults() {
    resultsContainer.innerHTML = '';
}
