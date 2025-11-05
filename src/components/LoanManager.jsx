import { useState } from "react";

function LoanManager({ books = [], createLoan }) {
  const [message, setMessage] = useState("");

  const availableBooks = books.filter((b) => !b.loan);
  const loanedBooks = books.filter((b) => b.loan);

  function handleSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    const borrower = (data.get("borrower") || "").trim();
    const bookId = data.get("bookId");
    const weeks = parseInt(data.get("weeks"), 10) || 1;

    if (!borrower) {
      setMessage("Please enter a borrower name.");
      return;
    }
    if (!bookId) {
      setMessage("Please select a book.");
      return;
    }
    if (weeks < 1 || weeks > 4) {
      setMessage("Loan period must be between 1 and 4 weeks.");
      return;
    }

    createLoan({ bookId, borrower, weeks });
    e.target.reset();
    setMessage("Loan created.");
  }

  return (
    <div className="loan-manager">
      <h2>Loan Management</h2>
      {availableBooks.length === 0 ? (
        <p className="info">All books are currently on loan.</p>
      ) : (
        <form className="loan-form" onSubmit={handleSubmit}>
          <div className="form-control">
            <label>Borrower:</label>
            <input name="borrower" type="text" placeholder="Borrower name" />
          </div>
          <div className="form-control">
            <label>Book:</label>
            <select name="bookId" defaultValue="">
              <option value="" disabled>
                -- select a book --
              </option>
              {availableBooks.map((b) => (
                <option
                  key={b.id}
                  value={b.id}
                  title={b.title || b.author || b.id}
                >
                  {b.title || b.author || "Untitled"}
                </option>
              ))}
            </select>
          </div>
          <div className="form-control">
            <label>Loan period (weeks):</label>
            <input name="weeks" type="number" min="1" max="4" />
          </div>
          <button className="btn-loan" type="submit">
            Create Loan
          </button>
          {message ? <p className="message">{message}</p> : null}
        </form>
      )}

      <div className="loaned-list">
        <h3>Loaned Books</h3>
        {loanedBooks.length === 0 ? (
          <p className="info">No books are currently loaned out.</p>
        ) : (
          <ul>
            {loanedBooks.map((b) => (
              <li key={b.id} className="loan-item">
                <div className="loan-row">
                  {b.image ? (
                    <img
                      src={b.image}
                      alt={b.title || b.author || "Book"}
                      className="loan-thumb"
                    />
                  ) : null}
                  <div className="loan-details">
                    <div className="loan-field">
                      <span className="loan-label">Book:</span>
                      <span className="loan-value">
                        {b.title || "Untitled"}
                      </span>
                    </div>
                    {b.author ? (
                      <div className="loan-field small">
                        <span className="loan-label">Author:</span>
                        <span className="loan-value">{b.author}</span>
                      </div>
                    ) : null}
                    <div className="loan-field">
                      <span className="loan-label">Borrower:</span>
                      <span className="loan-value">{b.loan.borrower}</span>
                    </div>
                    <div className="loan-field">
                      <span className="loan-label">Due date:</span>
                      <span className="loan-value">
                        {new Date(b.loan.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default LoanManager;
