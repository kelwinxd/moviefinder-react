import { useState, useEffect } from "react";

import './App.css'
import StarRate from './features/StarRate/StarRate.jsx'

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
const KEY = "800eab5d"
export default function App() {
  
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [loading,setLoading] = useState(true)
  const [error, setError] = useState("")
  const [query, setQuery] = useState("inception")
  const [selectId, setSelectId] = useState(null)

  function handleWatched(movie){
   
    setWatched(watched => [...watched,movie])
     CloseMovie()
  }

  useEffect(() => {
    async function fetchMovies(){
      try {
        setLoading(true)
        setError("")
      const res = await fetch(`https://www.omdbapi.com/?apikey=${KEY}&s=${query}`)

      if(!res.ok){
        throw new Error("Something went wrong")
      }
      const data = await res.json()
      if(data.Response === "False") throw new Error("Movie not found")
      setMovies(data.Search)
    console.log(data)
     
      } catch (error) {
        console.error(error.message)
        setError(error.message)
      } finally {
        setLoading(false)
      }
      
    
    }

    if(query.length < 3){
      setError("")
      setLoading("")
      setMovies([])
      return
    }

    fetchMovies()
    
  },[query])
  function HandleSelectId(id){
    setSelectId(selectId => id === selectId ? null : id)
   
  }

  function CloseMovie(){
    setSelectId(null)
  }


  return (
    <>
      <Navbar>
        <Search query={query} setQuery={setQuery} />
        <Nresults results={movies}/>
      </Navbar>

      <Main>

        <Box>

           {/* loading ? <Loader /> : <ul className="list">
              {movies?.map((movie) => (
                <Movie movie={movie} key={movie.imdbID}/>
              ))}
            </ul> */}
            {loading && <Loader />}
            {!loading && !error && <ul className="list list-movies">
              {movies?.map((movie) => (
                <Movie movie={movie} HandleSelect={HandleSelectId} key={movie.imdbID}/>
              ))}
            </ul> }
            {error && <ErrorMsg msg={error} />}
        </Box>
          
        
       
        <Box>
          {
selectId ?  <MovieSelected selectId={selectId} watched={watched} onClose={CloseMovie} movieWatched={handleWatched}/> : <>
 <WatchedSummary watched={watched}/>
              <WatchedMoviesList watched={watched} />
 </>
             
          }
         
              
        </Box>
      </Main>
      
    </>
  );
}

function Loader(){
  return <p className="loader">Loading...</p>
}

function ErrorMsg({msg}){

  return (
    <p>{msg}</p>
  )
}

function Main({children}){
    


  return (
    <main className="main">

      {children}
      

       
      </main>
  )
}

function Box({children}){
  const [isOpen, setIsOpen] = useState(true);

  return (
<div className="box">
          <button
            className="btn-toggle"
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? "–" : "+"}
          </button>

     
          {isOpen && (
            <>
            {children}
           

             
            </>
          )}
        </div>
  )
}

function WatchedMoviesList({watched}){

  return (
     <ul className="list">
                {watched.map((movie) => (
                 <WatchedMovie movie={movie} key={movie.imdbID}/>
                ))}
              </ul>
  )
}

function WatchedMovie({movie}){
  return (
 <li key={movie.imdbID}>
                    <img src={movie.poster} alt={`${movie.Title} poster`} />
                    <h3>{movie.title}</h3>
                    <div>
                      <p>
                        <span>⭐️</span>
                        <span>{movie.imdbRating}</span>
                      </p>
                      <p>
                        <span>🌟</span>
                        <span>{movie.userRating}</span>
                      </p>
                      <p>
                        <span>⏳</span>
                        <span>{movie.runTime} min</span>
                      </p>
                    </div>
                  </li>
  )
}

function WatchedSummary({watched}){


    const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
    const avgUserRating = average(watched.map((movie) => movie.userRating));
    const avgRuntime = average(watched.map((movie) => movie.runTime));

  return (
    <>
    <div className="summary">
                <h2>Movies you watched</h2>
                <div>
                  <p>
                    <span>#️⃣</span>
                    <span>{watched.length} movies</span>
                  </p>
                  <p>
                    <span>⭐️</span>
                    <span>{avgImdbRating.toFixed(1)}</span>
                  </p>
                  <p>
                    <span>🌟</span>
                    <span>{avgUserRating.toFixed(1)}</span>
                  </p>
                  <p>
                    <span>⏳</span>
                    <span>{avgRuntime.toFixed(0)} min</span>
                  </p>
                </div>
              </div>
    </>
  )
}

function Movie({movie, HandleSelect}){
  return (
    <li key={movie.imdbID} style={{cursor:"pointer"}} onClick={() => HandleSelect(movie.imdbID)}>
                  <img src={movie.Poster} alt={`${movie.Title} poster`} />
                  <h3>{movie.Title}</h3>
                  <div>
                    <p>
                      <span>🗓</span>
                      <span>{movie.Year}</span>
                    </p>
                  </div>
                </li>
  )
}


function MovieSelected({ selectId, onClose, movieWatched, watched }) {
  const [movieData, setMovieData] = useState({});
  const [userRating, onSetR] = useState(0)
  const KEY = "800eab5d";

  useEffect(() => {
    async function getMovieDetails() {
      const res = await fetch(`https://www.omdbapi.com/?apikey=${KEY}&i=${selectId}`);
      const data = await res.json();
      setMovieData(data);
          console.log(data)
    }


    if (selectId) getMovieDetails();
  }, [selectId]); // Atualiza sempre que o ID mudar

  const title = movieData?.Title || "Carregando...";
  const year = movieData?.Year || "";
  const poster = movieData?.Poster || null
  const released = movieData?.Released || null
  const genre = movieData?.Genre || null
  const plot = movieData?.Plot || null
  const actors = movieData?.Actors || null
  const imdbRating = movieData?.imdbRating || null
  const runTime = movieData?.Runtime || null
  const isWatched = watched.map((m) => m.ImdbId).includes(selectId)


  function addMovie(){
    const newMovie = {
      ImdbId: selectId,
      title,
      year,
      poster,
      genre,
      plot,
      actors,
      imdbRating:Number(imdbRating),
      runTime: Number(runTime.split(" ")[0])
      ,
      userRating

    }


    movieWatched(newMovie)
    setAvaible(false)
  }

  return (
    <div className="details">
      
      <header>
<button className="btn-back" onClick={onClose}>
        &larr;
      </button>
      <img src={poster} alt="" />
   
      
      <div className="details-overview">
        <h1>{title}</h1>
        <p>{released} &bull; {year}</p>
          
      <p>{genre}</p>
      
      </div>
       </header>
       <section>
        
        <div className="rating">
 
 {!isWatched ? (
    <>
      <StarRate size={24} maxRating={10} setRating={onSetR}/>
      <button className="btn-add" onClick={addMovie}>+ Add to List</button>
    </>
  ) : (
    <>
      <button className="btn-add" style={{ backgroundColor: "gray" }}>
        Added
      </button>
    </>
  )}

        </div>
       
        <p>
          <em>
            {plot}
          </em>
        </p>
        <p>{imdbRating} Imdb Rate | Duration: {runTime}</p>
        <p>Starring: {actors}</p>
       </section>
      
    </div>
  );
}


function Logo(){
  return (
     <div className="logo">
           <span role="img">🍿</span>
           <h1>MovieFinder</h1>
         </div>
  )
}

function Search({query, setQuery}){

  return (
     <input
           className="search"
           type="text"
           placeholder="Search movies..."
           value={query}
           onChange={(e) => setQuery(e.target.value)}
         />
  )
}

function Nresults(){
  return (
       <p className="num-results">
           Found <strong>X</strong> results
         </p>
  )
}

function Navbar({children}){




   return (
       <nav className="nav-bar">
        <Logo />
        {children}
  
      
       </nav> 

   )
}















