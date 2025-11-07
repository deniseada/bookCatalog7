import { useState, useEffect } from "react";
import Books from "./book";
import BookDetails from "./BookDetails";
import "./index.css";
import AddBookForm from "./components/AddBookForm";
import Modal from "./components/Modal";
import LoanManager from "./components/LoanManager";

function App() {
  const [books, setBooks] = useState(() => {
    try {
      const raw = localStorage.getItem("books");
      if (raw) return JSON.parse(raw);
    } catch (e) {
      // ignore
    }
    return [];
  });

  const [selectedId, setSelectedId] = useState(null);
  const [authorFilter, setAuthorFilter] = useState("");
  const [view, setView] = useState("catalog"); // 'catalog', 'loans' or 'details'

  function addBook(book) {
    setBooks((prev) => [book, ...prev]);
  }

  function selectBook(id) {
    setSelectedId((prev) => (prev === id ? null : id));
  }

  function deleteSelected() {
    if (!selectedId) return;
    setBooks((prev) => prev.filter((b) => b.id !== selectedId));
    setSelectedId(null);
  }

  useEffect(() => {
    localStorage.setItem("books", JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    if (!selectedId) return;
    if (!authorFilter) return;
    const selectedBook = books.find((b) => b.id === selectedId);
    if (!selectedBook) return;
    if ((selectedBook.author || "") !== authorFilter) setSelectedId(null);
  }, [authorFilter, books, selectedId]);

  function updateBook(updatedBook) {
    setBooks((prev) =>
      prev.map((b) => (b.id === updatedBook.id ? updatedBook : b))
    );
    setSelectedId(null);
  }

  function createLoan({ bookId, borrower, weeks }) {
    const due = new Date();
    due.setDate(due.getDate() + weeks * 7);

    setBooks((prev) =>
      prev.map((b) => {
        if (b.id !== bookId) return b;
        return {
          ...b,
          loan: {
            borrower: borrower || "",
            dueDate: due.toISOString(),
            weeks,
          },
        };
      })
    );
  }

  return (
    <div className="container">
      <h1>Book Catalog</h1>

      {view === "details" ? (
        (() => {
          const selectedBook = books.find((b) => b.id === selectedId);
          if (!selectedBook) {
            // fallback to catalog if book not found
            setView("catalog");
            return null;
          }
          return (
            <BookDetails
              book={selectedBook}
              onBack={() => setView("catalog")}
            />
          );
        })()
      ) : view === "loans" ? (
        <main className="loan-view">
          <div className="loan-header">
            <button
              className="btn-toggle btn-back"
              onClick={() => setView("catalog")}
            >
              ← Back to Catalog
            </button>
          </div>
          <div className="loan-panel">
            <LoanManager books={books} createLoan={createLoan} />
          </div>
        </main>
      ) : (
        <div className="actions">
          <div className="top-bar">
            <div className="top-left">
              <button
                className="btn-toggle"
                onClick={() =>
                  setView((v) => (v === "catalog" ? "loans" : "catalog"))
                }
              >
                Manage Loans
              </button>
            </div>
            <div className="top-right">
              <div className="filter">
                <label className="filter-label">Filter by author:</label>
                <select
                  className="filter-select"
                  value={authorFilter}
                  onChange={(e) => setAuthorFilter(e.target.value)}
                >
                  <option value="">All</option>
                  {Array.from(
                    new Set(books.map((b) => b.author).filter(Boolean))
                  )
                    .sort()
                    .map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>
          <div className="bookContainers">
            <div className="newBook">
              <Modal btnLabel="+" btnClassName="btn-plus">
                <AddBookForm add={addBook} />
              </Modal>

              <div className="controls">
                {selectedId ? (
                  <Modal btnLabel="Edit" btnClassName="edit">
                    <AddBookForm
                      add={updateBook}
                      book={books.find((b) => b.id === selectedId) || null}
                    />
                  </Modal>
                ) : (
                  <button className="edit" disabled>
                    Edit
                  </button>
                )}

                <button className="delete" onClick={deleteSelected}>
                  Delete
                </button>
              </div>
            </div>

            <div className="books">
              {books
                .filter((b) =>
                  authorFilter ? (b.author || "") === authorFilter : true
                )
                .map((book) => (
                  <Books
                    {...book}
                    key={book.id}
                    isSelected={selectedId === book.id}
                    onSelect={selectBook}
                    onViewDetails={(id) => {
                      setSelectedId(id);
                      setView("details");
                    }}
                  />
                ))}
            </div>
          </div>
        </div>
      )}

      <footer> @ 2025 Denise Aquino</footer>
    </div>
  );
}

export default App;
