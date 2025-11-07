function Books({
  id,
  title,
  author,
  image,
  isSelected,
  onSelect,
  onViewDetails,
  loan,
}) {
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
        {title ? <p className="book-title">{title}</p> : null}
        {author ? <p className="book-author">{`by ${author}`}</p> : null}
        <div className="book-controls">
          <button
            className="btn-details"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails && onViewDetails(id);
            }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default Books;
