import { useEffect, useState } from "react";
import axios from "axios";
import './App.css';
import MovieCard from "./components/MovieCard";
import YouTube from "react-youtube";

function App() {

  const IMAGE_PATH = "https://image.tmdb.org/t/p/w1280"
  const API_URL = "https://api.themoviedb.org/3"
  const API_KEY = "a740d051ae3c264a2a549666478d42fd"
  const [movies, setMovies] = useState([])
  const [selectedMovie, setSelectedMovie] = useState({})
  const [searchKey, setSearchKey] = useState("")
  const [playShortMovie, setPlayShortMovie] = useState(false)

  const fetchMovies = async (searchKey) => {
    const type = searchKey ? "search" : "discover"
    const {data: {results}} = await axios.get(`${API_URL}/${type}/movie`, {
      params: {
        api_key: API_KEY,
        query: searchKey
      }
    })

    setMovies(results)
    await selectMovie(results[0])
  }

  const fetchMovie = async (id) => {
    const {data} = await axios.get(`${API_URL}/movie/${id}`, {
      params: {
        api_key: API_KEY,
        append_to_response: 'videos'
      }
    })

    return data
  }

  const selectMovie = async (movie) => {
    setPlayShortMovie(false)
    const data = await fetchMovie(movie.id)
    setSelectedMovie(data)
  }

  useEffect ( () => {
    fetchMovies()
  }, [])

  const renderMovies = () => (
    movies.map(movie => (
      <MovieCard 
        key={movie.id}
        movie={movie}
        selectMovie={selectMovie}
      />
    )) 
  )

  const searchMovies = (e) => {
    e.preventDefault()
    fetchMovies(searchKey)
  }

  const renderShortMovie = () => {
    const shortMovie = selectedMovie.videos.results.find(vid => vid.name === "Official Trailer")
    const key = shortMovie ? shortMovie.key : selectedMovie.videos.results[0].key

    return (
      <YouTube 
        videoId={key}
        containerClassName={"youtube-container"}
        opts={{
          width: "100%",
          height: "100%",
          playerVars: {
            autoplay: 1,
            controls: 0
          }
        }}
      />
    )
  }

  return (
    <div className="App">
      <header className="header">
        <div className="header-content max-center">
          <span>LARA MOVIES APP</span>
          <form onSubmit={searchMovies}>
            <input type="text" onChange={(e) => setSearchKey(e.target.value)}/>
            <button type="submit">Search</button>
          </form>
        </div>
      </header>

      <div className="hero" style={{backgroundImage: `url('${IMAGE_PATH}${selectedMovie.backdrop_path}')`}}>
        <div className="hero-content max-center">
          {playShortMovie ? <button className="button button-close" onClick={() => setPlayShortMovie(false)}>Close</button> : null}
          {selectedMovie.videos && playShortMovie ? renderShortMovie() : null}
          <button className="button" onClick={() => setPlayShortMovie(true)}>Play Short Movie</button>
          <h1 className="hero-title">{selectedMovie.title}</h1>
          {selectedMovie.overview ? <p className="hero-overview">{selectedMovie.overview}</p> : null}
        </div>
      </div>

      <div className="container max-center">
        {renderMovies()}
      </div>
    </div>
  );
}

export default App;
