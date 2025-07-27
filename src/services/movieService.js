import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http:

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

export const movieService = {
  getAllMovies: async () => {
    try {
      const allMovies = [];
      let offset = 0;
      const limit = 100;
      let hasMore = true;
      let totalAmount = 0;

      console.log("Starting to fetch all movies...");

      while (hasMore) {
        console.log(`Fetching movies: offset=${offset}, limit=${limit}`);

        const response = await api.get("/movies", {
          params: { limit, offset },
        });

        const data = response.data;
        const movies = data.data || [];
        totalAmount = data.totalAmount || 0;

        allMovies.push(...movies);

        hasMore = movies.length === limit && allMovies.length < totalAmount;
        offset += limit;

        console.log(`Fetched ${allMovies.length} of ${totalAmount} movies`);
      }

      console.log(`Successfully fetched all ${allMovies.length} movies`);

      return {
        data: allMovies,
        totalAmount: allMovies.length,
        offset: 0,
        limit: allMovies.length,
      };
    } catch (error) {
      console.error("Error fetching all movies:", error);
      throw new Error(
        `Failed to fetch all movies: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  },

  getMovies: async (params = {}) => {
    try {
      const response = await api.get("/movies", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching movies:", error);
      throw new Error(
        `Failed to fetch movies: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  },

  getMovieById: async (id) => {
    try {
      const response = await api.get(`/movies/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching movie:", error);
      throw new Error(
        `Failed to fetch movie: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  },

  createMovie: async (movieData) => {
    try {
      const response = await api.post("/movies", movieData);
      return response.data;
    } catch (error) {
      console.error("Error creating movie:", error);
      throw new Error(
        `Failed to create movie: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  },

  updateMovie: async (movieData) => {
    try {
      if (!movieData.id) {
        throw new Error("Movie ID is required for update");
      }
      const response = await api.put("/movies", movieData);
      return response.data;
    } catch (error) {
      console.error("Error updating movie:", error);
      throw new Error(
        `Failed to update movie: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  },

  deleteMovie: async (id) => {
    try {
      if (!id) {
        throw new Error("Movie ID is required for deletion");
      }
      const response = await api.delete(`/movies/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting movie:", error);
      throw new Error(
        `Failed to delete movie: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  },
};

export default movieService;
