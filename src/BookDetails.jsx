import { useEffect, useState } from "react";

export default function BookDetails({ book, onBack }) {
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!book) return;
    const querySource = book.author || book.title || book.publisher || "";
    if (!q) {
      setSimilar([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`https://api.itbook.store/1.0/search/${querySource}`)
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        const books = (data && data.books) || [];
        setSimilar(books.slice(0, 8));
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || "Failed to load similar books");
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [book]);

  if (!book) return null;

  return (
    <main className="details-page">
      <div className="details-top">
        <h2>Book Details</h2>
        <div className="details-top-right">
          <button className="btn-back" onClick={onBack}>
            BACK
          </button>
        </div>
      </div>

      <div className="details-content">
        <div className="details-left">
          {book.image ? (
            <img
              className="details-cover-large"
              src={book.image}
              alt={book.title}
            />
          ) : (
            <div className="details-cover-large placeholder">No cover</div>
          )}
        </div>

        <div className="details-right">
          <h2 className="details-title">{book.title}</h2>
          <div className="details-row">
            Author:
            <span>{book.author || "Unknown"}</span>
          </div>
          <div className="details-row">
            Publisher:
            <span>{book.publisher || "Unknown"}</span>
          </div>
          <div className="details-row">
            Published:
            <span>{book.year || book.published || "Unknown"}</span>
          </div>
          <div className="details-row">
            Pages:
            <span>{book.pages || "Unknown"}</span>
          </div>
          {book.loan ? (
            <p className="book-loan">
              On loan to {book.loan.borrower || "someone"}
            </p>
          ) : null}
        </div>
      </div>

      <section className="similar-section">
        <h3>Similar books</h3>
        {loading ? (
          <p>Loading similar books…</p>
        ) : error ? (
          <p className="error">Error: {error}</p>
        ) : similar.length === 0 ? (
          <p>No similar books found.</p>
        ) : (
          <div className="similar-list">
            {similar.map((s) => (
              <a
                key={s.isbn13 || s.title}
                className="similar-item"
                href={
                  s.url ||
                  `https://api.itbook.store/${encodeURIComponent(s.title)}`
                }
                target="_blank"
                rel="noreferrer"
              >
                <img className="similar-image" src={s.image} alt={s.title} />
                <div className="similar-meta">
                  <div className="similar-title">{s.title}</div>
                  {s.subtitle ? (
                    <div className="similar-sub">{s.subtitle}</div>
                  ) : null}
                  <div className="similar-price">{s.price}</div>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
