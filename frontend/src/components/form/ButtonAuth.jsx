export default function ButtonAuth({ isLoading, children }) {
  return (
    <div className="center">
      <button
        type="submit"
        className={`btn btn--green btn--large ma-t-lg ${
          isLoading && "btn--loading"
        }`}
      >
        {children}
      </button>
    </div>
  );
}
