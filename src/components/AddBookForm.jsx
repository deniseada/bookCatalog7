import { nanoid } from "nanoid";

function AddBookForm({ add, closeModal, book = null }) {
  function handleSubmit(e) {
    e.preventDefault();

    const data = new FormData(e.target);
    const idFromForm = data.get("id");

    const newBook = {
      title: data.get("title") || "",
      author: data.get("author") || "",
      subtitle: "",
      image: data.get("image") || "",
      url: data.get("url") || "",
      id: idFromForm || (book && book.id) || nanoid(),
    };

    if (typeof add === "function") add(newBook);

    // only reset when adding a new book
    if (!book) e.target.reset();

    if (typeof closeModal === "function") {
      closeModal();
    } else {
      const dialog = e.target.closest("dialog");
      if (dialog && typeof dialog.close === "function") dialog.close();
    }
  }

  return (
    <div className="form-container">
      <h2>{book ? "Edit Book" : "Add Book"}</h2>
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="id" defaultValue={book?.id || ""} />
        <div className="form-control">
          <label>Title:</label>
          <input
            name="title"
            type="text"
            placeholder="Book Title.."
            defaultValue={book?.title || ""}
            required
          />
        </div>
        <div className="form-control">
          <label>Author:</label>
          <input
            name="author"
            type="text"
            placeholder="Author.."
            defaultValue={book?.author || ""}
            required
          />
        </div>
        <div className="form-control">
          <label>Publisher:</label>
          <input
            name="publisher"
            type="text"
            placeholder="Publisher.."
            defaultValue={book?.publisher || ""}
          />
        </div>
        <div className="form-control">
          <label> Publication Year:</label>
          <input name="year" type="number" defaultValue={book?.year || ""} />
        </div>
        <div className="form-control">
          <label>Language:</label>
          <input
            name="language"
            type="text"
            placeholder="Language.."
            defaultValue={book?.language || ""}
          />
        </div>
        <div className="form-control">
          <label>Pages:</label>
          <input name="pages" type="number" defaultValue={book?.pages || ""} />
        </div>
        <div className="form-control">
          <label>Image URL:</label>
          <input
            name="image"
            type="url"
            placeholder="https://..."
            defaultValue={book?.image || ""}
          />
        </div>
        <button className="btn-save" type="submit">
          Save
        </button>
      </form>
    </div>
  );
}

export default AddBookForm;
