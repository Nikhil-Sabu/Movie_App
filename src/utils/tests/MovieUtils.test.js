import { 
    filterMoviesByGenre, 
    sortMovies, 
    searchMovies, 
    getMovieCountText, 
    validateMovieData, 
    generateMovieId, 
    formatMovieForSubmission 
  } from '../movieUtils';
  
  // Test data
  const mockMovies = [
    {
      id: 1,
      title: "Test Action Movie",
      year: "2023",
      genre: "Action & Adventure",
      rating: 8.5,
      runtime: "2h 30min",
      overview: "An exciting action movie",
      poster: "https://example.com/poster1.jpg",
      url: "https://example.com/movie1",
      releaseDate: "2023-01-01"
    },
    {
      id: 2,
      title: "Comedy Movie",
      year: "2022",
      genre: "Comedy",
      rating: 7.2,
      runtime: "1h 45min",
      overview: "A funny comedy movie",
      poster: "https://example.com/poster2.jpg",
      url: "https://example.com/movie2",
      releaseDate: "2022-06-15"
    },
    {
      id: 3,
      title: "Drama Film",
      year: "2024",
      genre: "Drama",
      rating: 9.1,
      runtime: "2h 15min",
      overview: "A compelling drama",
      poster: "https://example.com/poster3.jpg",
      url: "https://example.com/movie3",
      releaseDate: "2024-03-20"
    }
  ];
  
  describe('Movie Utility Functions', () => {
    describe('filterMoviesByGenre', () => {
      test('returns all movies when genre is ALL', () => {
        const result = filterMoviesByGenre(mockMovies, 'ALL');
        expect(result).toEqual(mockMovies);
        expect(result).toHaveLength(3);
      });
  
      test('filters movies by action genre correctly', () => {
        const result = filterMoviesByGenre(mockMovies, 'ACTION');
        expect(result).toHaveLength(1);
        expect(result[0].genre).toBe('Action & Adventure');
      });
  
      test('filters movies by comedy genre correctly', () => {
        const result = filterMoviesByGenre(mockMovies, 'COMEDY');
        expect(result).toHaveLength(1);
        expect(result[0].genre).toBe('Comedy');
      });
  
      test('returns empty array for non-existent genre', () => {
        const result = filterMoviesByGenre(mockMovies, 'HORROR');
        expect(result).toHaveLength(0);
      });
    });
  
    describe('sortMovies', () => {
      test('sorts movies by title alphabetically', () => {
        const result = sortMovies(mockMovies, 'title');
        expect(result[0].title).toBe('Comedy Movie');
        expect(result[1].title).toBe('Drama Film');
        expect(result[2].title).toBe('Test Action Movie');
      });
  
      test('sorts movies by rating descending', () => {
        const result = sortMovies(mockMovies, 'rating');
        expect(result[0].rating).toBe(9.1);
        expect(result[1].rating).toBe(8.5);
        expect(result[2].rating).toBe(7.2);
      });
  
      test('sorts movies by release date descending (default)', () => {
        const result = sortMovies(mockMovies, 'release_date');
        expect(result[0].year).toBe('2024');
        expect(result[1].year).toBe('2023');
        expect(result[2].year).toBe('2022');
      });
  
      test('does not mutate original array', () => {
        const originalLength = mockMovies.length;
        const originalFirst = mockMovies[0].title;
        
        sortMovies(mockMovies, 'title');
        
        expect(mockMovies).toHaveLength(originalLength);
        expect(mockMovies[0].title).toBe(originalFirst);
      });
    });
  
    describe('searchMovies', () => {
      test('returns all movies when search term is empty', () => {
        const result = searchMovies(mockMovies, '');
        expect(result).toEqual(mockMovies);
      });
  
      test('searches by movie title', () => {
        const result = searchMovies(mockMovies, 'Comedy');
        expect(result).toHaveLength(1);
        expect(result[0].title).toBe('Comedy Movie');
      });
  
      test('searches by genre', () => {
        const result = searchMovies(mockMovies, 'action');
        expect(result).toHaveLength(1);
        expect(result[0].genre).toBe('Action & Adventure');
      });
  
      test('searches by overview', () => {
        const result = searchMovies(mockMovies, 'funny');
        expect(result).toHaveLength(1);
        expect(result[0].overview).toContain('funny');
      });
  
      test('searches by year', () => {
        const result = searchMovies(mockMovies, '2023');
        expect(result).toHaveLength(1);
        expect(result[0].year).toBe('2023');
      });
  
      test('search is case insensitive', () => {
        const result = searchMovies(mockMovies, 'COMEDY');
        expect(result).toHaveLength(1);
        expect(result[0].title).toBe('Comedy Movie');
      });
    });
  
    describe('getMovieCountText', () => {
      test('returns correct text for zero movies', () => {
        expect(getMovieCountText(0)).toBe('No movies found');
      });
  
      test('returns correct text for one movie', () => {
        expect(getMovieCountText(1)).toBe('1 movie found');
      });
  
      test('returns correct text for multiple movies', () => {
        expect(getMovieCountText(5)).toBe('5 movies found');
        expect(getMovieCountText(10)).toBe('10 movies found');
      });
    });
  
    describe('validateMovieData', () => {
      const validMovieData = {
        title: 'Test Movie',
        releaseDate: '2023-01-01',
        movieUrl: 'https://example.com',
        rating: '8.5',
        genre: 'Action',
        runtime: '2h 30min',
        overview: 'A great movie'
      };
  
      test('returns valid for complete movie data', () => {
        const result = validateMovieData(validMovieData);
        expect(result.isValid).toBe(true);
        expect(result.errors).toEqual({});
      });
  
      test('returns error for missing title', () => {
        const result = validateMovieData({ ...validMovieData, title: '' });
        expect(result.isValid).toBe(false);
        expect(result.errors.title).toBe('Title is required');
      });
  
      test('returns error for invalid URL', () => {
        const result = validateMovieData({ ...validMovieData, movieUrl: 'invalid-url' });
        expect(result.isValid).toBe(false);
        expect(result.errors.movieUrl).toBe('Please enter a valid URL');
      });
  
      test('returns error for invalid rating', () => {
        const result = validateMovieData({ ...validMovieData, rating: '15' });
        expect(result.isValid).toBe(false);
        expect(result.errors.rating).toBe('Rating must be between 0 and 10');
      });
    });
  
    describe('generateMovieId', () => {
      test('returns 1 for empty array', () => {
        expect(generateMovieId([])).toBe(1);
      });
  
      test('returns 1 for null/undefined', () => {
        expect(generateMovieId(null)).toBe(1);
        expect(generateMovieId(undefined)).toBe(1);
      });
  
      test('returns next available ID', () => {
        expect(generateMovieId(mockMovies)).toBe(4);
      });
    });
  
    describe('formatMovieForSubmission', () => {
      test('formats form data correctly', () => {
        const formData = {
          title: '  Test Movie  ',
          releaseDate: '2023-01-01',
          movieUrl: '  https://example.com  ',
          rating: '8.5',
          genre: 'Action',
          runtime: '  2h 30min  ',
          overview: '  A great movie  '
        };
  
        const result = formatMovieForSubmission(formData);
  
        expect(result).toEqual({
          title: 'Test Movie',
          year: '2023',
          genre: 'Action',
          rating: 8.5,
          runtime: '2h 30min',
          overview: 'A great movie',
          poster: 'https://example.com',
          url: 'https://example.com',
          releaseDate: '2023-01-01'
        });
      });
    });
  });