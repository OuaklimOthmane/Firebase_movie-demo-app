import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";
import AddMovie from "./components/AddMovie";

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //! Getting the movies data from the database :
  const fetchMoviesHandler = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://react-movie-demo-app-default-rtdb.firebaseio.com/movies.json"
      );
      if (!response.ok) throw new Error("something went wrong !!");

      const data = await response.json();
      const transformedMovies = data.results.map((movieData) => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date,
        };
      });
      setMovies(transformedMovies);
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  //! Sending the movie data to the database :
  const addMovieHandler = async (movie) => {
    //? we can use any Firebase Realtime Database URL as a REST endpoint. All you need to do is append ".json" to the end of the URL and send a request from your favorite HTTPS client,besides that "movies" is the created node in the database.
    const response = await fetch(
      "https://react-movie-demo-app-default-rtdb.firebaseio.com/movies.json",
      {
        method: "POST",
        body: JSON.stringify(movie),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    console.log(data);
  };

  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (loading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>content</section>
    </React.Fragment>
  );
}

export default App;
