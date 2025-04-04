import { useEffect, useState, useRef, Suspense } from 'react';
import { useParams, useLocation, Link, Outlet } from 'react-router-dom';
import { getMovieById } from '../../movies-api';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import Loader from '../../components/Loader/Loader';
import MovieDetailsCard from '../../components/MovieDetailsCard/MovieDetailsCard';
import css from './MovieDetailsPage.module.css';
import { Movie } from '../../commonTypes';

export default function MovieDetailsPage() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const location = useLocation();
  const backLinkURL = useRef(location.state ?? '/movies');

  useEffect(() => {
    if (!movieId) {
      return;
    }
    async function fetchMovie() {
      try {
        setLoading(true);
        const data = await getMovieById(Number(movieId));
        setMovie(data);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchMovie();
  }, [movieId]);

  return (
    <div>
      {loading && <Loader />}
      {error && <ErrorMessage />}
      <div className={css.homeBtn}>
        <Link to={backLinkURL.current}>Go back</Link>
      </div>
      {movie && <MovieDetailsCard movie={movie} />}

      <div className={css.addInfo}>
        <p>Additional information</p>
        <ul>
          <li>
            <Link to="cast">Cast</Link>
          </li>
          <li>
            <Link to="reviews">Reviews</Link>
          </li>
        </ul>
      </div>

      <Suspense fallback={<Loader />}>
        <Outlet />
      </Suspense>
    </div>
  );
}
