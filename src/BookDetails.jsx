import { useEffect, useState } from "react";

export default function BookDetails({ book, onBack }) {
  const [similar, setSimilar] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!book) return;

    const querySource = (
      book.title ||
      book.author ||
      book.publisher ||
      ""
    ).trim();
    if (!querySource) {
      setSimilar([]);
      return;
    }

    let cancelled = false;
    setError(null);
    setLoading(true);

    // Build priority queries: try combined title+author, then author, then title, then publisher
    const rawParts = [
      (book.title || "").trim(),
      (book.author || "").trim(),
      (book.publisher || "").trim(),
    ];

    const queries = [];
    if (rawParts[0] && rawParts[1]) {
      queries.push(`${rawParts[0]} ${rawParts[1]}`);
    }
    rawParts.forEach((p) => {
      if (p && !queries.includes(p)) queries.push(p);
    });

    const parseJson = async (res) => {
      try {
        return await res.json();
      } catch (e) {
        return null;
      }
    };

    const tryQuery = (index) => {
      if (cancelled) return;
      if (index >= queries.length) {
        // no queries produced results
        setSimilar([]);
        setLoading(false);
        return;
      }

      const raw = queries[index].split(/\s+/).slice(0, 5).join(" ");
      const q = encodeURIComponent(raw);
      // use correct API path (includes version)
      const apiUrl = `https://api.itbook.store/1.0/search/${q}`;

      fetch(apiUrl)
        .then((res) => {
          if (!res.ok)
            throw new Error(`Network response was not ok (${res.status})`);
          return parseJson(res);
        })
        .then((data) => {
          if (cancelled) return;
          const books = (data && data.books) || [];
          if (books.length > 0) {
            setSimilar(books.slice(0, 10));
            setLoading(false);
            return;
          }
          // try next query
          tryQuery(index + 1);
        })
        .catch(() => {
          if (cancelled) return;
          // fallback to public CORS proxy for local/dev testing
          const proxy = `https://api.allorigins.win/raw?url=${encodeURIComponent(
            apiUrl
          )}`;
          fetch(proxy)
            .then((res) => {
              if (!res.ok)
                throw new Error(`Proxy response was not ok (${res.status})`);
              return parseJson(res);
            })
            .then((data) => {
              if (cancelled) return;
              const books = (data && data.books) || [];
              if (books.length > 0) {
                setSimilar(books.slice(0, 1));
                setLoading(false);
                return;
              }
              tryQuery(index + 1);
            })
            .catch(() => {
              if (cancelled) return;
              tryQuery(index + 1);
            });
        });
    };

    tryQuery(0);

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
            Author: <span>{book.author || "Unknown"}</span>
          </div>
          <div className="details-row">
            Publisher: <span>{book.publisher || "Unknown"}</span>
          </div>
          <div className="details-row">
            Published: <span>{book.year || book.published || "Unknown"}</span>
          </div>
          <div className="details-row">
            Pages: <span>{book.pages || "Unknown"}</span>
          </div>

          {book.loan && (
            <p className="book-loan">
              On loan to {book.loan.borrower || "someone"}
            </p>
          )}
        </div>
      </div>

      <section className="similar-section">
        <h3>Similar books</h3>

        {loading ? (
          <p>Loading similar books…</p>
        ) : error ? (
          <p className="error">Error: {error}</p>
        ) : (
          similar.length === 0 && <p>No similar books found.</p>
        )}

        <div className="similar-list">
          {similar.map((s) => (
            <a
              key={s.isbn13 || s.title}
              className="similar-item"
              href={
                s.url ||
                `https://itbook.store/search/${encodeURIComponent(s.title)}`
              }
              target="_blank"
              rel="noreferrer"
            >
              <img className="similar-image" src={s.image} alt={s.title} />
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
