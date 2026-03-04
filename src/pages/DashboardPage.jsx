import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../state/AuthContext.jsx'
import heroImage from '../money-heist-hero.png'

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'

function MovieRow({ title, movies }) {
  if (!movies?.length) return null

  return (
    <section className="mb-6 px-4 sm:px-10">
      <h2 className="mb-3 text-base font-semibold text-neutral-100 sm:text-lg">
        {title}
      </h2>
      <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="relative h-40 w-28 flex-shrink-0 cursor-pointer overflow-hidden rounded-md bg-neutral-800 transition hover:scale-105 hover:bg-neutral-700 sm:h-48 sm:w-32"
          >
            {movie.poster_path ? (
              <img
                src={`${TMDB_IMAGE_BASE}${movie.poster_path}`}
                alt={movie.title || movie.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
                No Image
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const [trending, setTrending] = useState([])
  const [topRated, setTopRated] = useState([])
  const [actionMovies, setActionMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchMovies = async () => {
      if (!TMDB_API_KEY) {
        setError('TMDB API key is not configured.')
        setLoading(false)
        return
      }

      try {
        const [trendingRes, topRatedRes, actionRes] = await Promise.all([
          axios.get(`${TMDB_BASE_URL}/trending/all/week`, {
            params: { api_key: TMDB_API_KEY },
          }),
          axios.get(`${TMDB_BASE_URL}/movie/top_rated`, {
            params: { api_key: TMDB_API_KEY },
          }),
          axios.get(`${TMDB_BASE_URL}/discover/movie`, {
            params: {
              api_key: TMDB_API_KEY,
              with_genres: 28,
            },
          }),
        ])
        setTrending(trendingRes.data.results || [])
        setTopRated(topRatedRes.data.results || [])
        setActionMovies(actionRes.data.results || [])
      } catch (err) {
        const message =
          err?.response?.data?.status_message ||
          err?.message ||
          'Failed to load movies.'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative">
        <div className="absolute inset-0 -z-10">
          <img
            src={heroImage}
            alt="Money Heist hero"
            className="h-[60vh] w-full object-cover sm:h-[70vh]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />
        </div>

        <header className="flex items-center justify-between px-4 py-4 sm:px-10">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-sm bg-netflix-red" />
            <span className="text-2xl font-bold tracking-widest text-netflix-red">
              MOVIE FLIX
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            {user?.username && (
              <span className="hidden text-neutral-200 sm:inline">
                {user.username}
              </span>
            )}
            <button
              type="button"
              onClick={logout}
              className="rounded bg-netflix-red px-3 py-1.5 text-xs font-semibold hover:bg-red-700"
            >
              Sign out
            </button>
          </div>
        </header>

        <div className="flex h-[60vh] flex-col justify-end px-4 pb-12 sm:h-[70vh] sm:px-10 sm:pb-20">
          <div className="max-w-xl space-y-4">
            <p className="inline-flex items-center gap-2 rounded bg-yellow-500/90 px-2 py-0.5 text-xs font-semibold text-black">
              <span>IMDb</span>
              <span>8.8/10</span>
            </p>
            <h1 className="text-3xl font-bold drop-shadow sm:text-5xl">
              Money Heist
            </h1>
            <p className="max-w-lg text-sm text-neutral-200 sm:text-base">
              A criminal mastermind known as The Professor plans the biggest
              heist in history. Eight thieves take hostages and lock themselves
              in the Royal Mint of Spain while manipulating the police to carry
              out his plan.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button className="inline-flex items-center gap-2 rounded bg-white px-5 py-2 text-sm font-semibold text-black hover:bg-neutral-200">
                Play
              </button>
              <button className="inline-flex items-center gap-2 rounded bg-neutral-500/70 px-5 py-2 text-sm font-semibold text-white hover:bg-neutral-400/80">
                Watch Trailer
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="bg-gradient-to-b from-black via-black to-neutral-950 pt-4">
        {loading && (
          <div className="px-4 py-6 text-sm text-neutral-300 sm:px-10">
            Loading movies...
          </div>
        )}
        {error && !loading && (
          <div className="px-4 py-6 text-sm text-red-400 sm:px-10">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <MovieRow title="Trending Now" movies={trending} />
            <MovieRow title="Top Rated" movies={topRated} />
            <MovieRow title="Action Hits" movies={actionMovies} />
          </>
        )}
      </main>
    </div>
  )
}

