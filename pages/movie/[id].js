import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function MovieDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    if (!id) return;

    fetch(`https://www.omdbapi.com/?apikey=http://www.omdbapi.com/?i=tt3896198&apikey=1ade8330&i=${id}`)
      .then((res) => res.json())
      .then((data) => setMovie(data));
  }, [id]);

  if (!movie) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{movie.Title}</h1>
      <img src={movie.Poster} width="200" />
      <p><b>Year:</b> {movie.Year}</p>
      <p><b>Genre:</b> {movie.Genre}</p>
      <p><b>Plot:</b> {movie.Plot}</p>
    </div>
  );
}
