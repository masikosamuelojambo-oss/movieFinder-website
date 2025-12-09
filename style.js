document.addEventListener('DOMContentLoaded', () => {
    // 1. SELECTORS
    const searchButton = document.getElementById('search-button');
    const movieTitleInput = document.getElementById('movie-title');
    const resultsContainer = document.getElementById('results-container');
    
    // 2. CONFIGURATION
    // !!! REPLACE 'YOUR_OMDB_API_KEY' with your actual key from OMDB API
    const API_KEY = 'fac64365'; 

    // 3. EVENT LISTENERS
    searchButton.addEventListener('click', searchMovies);
    movieTitleInput.addEventListener('keypress', (event) => {
        // Allows searching by pressing 'Enter'
        if (event.key === 'Enter') {
            searchMovies();
        }
    });

    // 4. MAIN SEARCH FUNCTION
    async function searchMovies() {
        const title = movieTitleInput.value.trim();
        
        // Clear previous results and show loading/error
        resultsContainer.innerHTML = ''; 
        
        if (title === '') {
            resultsContainer.innerHTML = '<p class="placeholder">Please enter a movie title to search.</p>';
            return;
        }

        // Show a loading message
        resultsContainer.innerHTML = '<p class="placeholder">Searching...</p>';

        try {
            // Construct the API URL for searching
            const url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(title)}`;
            
            // Fetch data from the OMDB API
            const response = await fetch(url);
            const data = await response.json();

            if (data.Response === "True") {
                // Display the results
                displayMovies(data.Search);
            } else {
                // No results found
                resultsContainer.innerHTML = `<p class="placeholder">No movies found for "${title}".</p>`;
            }

        } catch (error) {
            console.error('Error fetching data:', error);
            resultsContainer.innerHTML = '<p class="placeholder">An error occurred while fetching movies. Please check your API key and try again.</p>';
        }
    }

    // 5. DISPLAY RESULTS FUNCTION
    function displayMovies(movies) {
        resultsContainer.innerHTML = ''; // Clear the 'Searching...' message

        movies.forEach(movie => {
            // Create the main card element
            const card = document.createElement('div');
            card.className = 'movie-card';

            // Check for a valid poster image (OMDB uses 'N/A' for missing)
            const posterUrl = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster';

            // Build the HTML structure for the card
            card.innerHTML = `
                <img src="${posterUrl}" alt="${movie.Title} Poster">
                <div class="movie-info">
                    <h3>${movie.Title}</h3>
                    <p>Year: ${movie.Year}</p>
                    <p>Type: ${movie.Type.charAt(0).toUpperCase() + movie.Type.slice(1)}</p>
                </div>
            `;
            
            // Add the card to the results container
            resultsContainer.appendChild(card);
        });
    }
});
