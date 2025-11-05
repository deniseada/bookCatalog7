function Books({ id, title, author, image, isSelected, onSelect, loan }) {
  return (
    <div
      className={`book ${isSelected ? "book-bg" : ""}`}
      onClick={() => onSelect && onSelect(id)}
    >
      {loan ? <p className="book-loan">On loan</p> : null}
      {image ? (
        <img className="book-image" src={image} alt={title || ""} />
      ) : null}
      <div className="book-info">
        {author ? <p className="book-author">{`by ${author}`}</p> : null}
      </div>
    </div>
  );
}

export default Books;
