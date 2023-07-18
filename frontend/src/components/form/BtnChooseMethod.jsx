export default function BtnForgotPassword({ children, onClick }) {
  return (
    <div className="center">
      <button
        type="button"
        className={`btn btn--green btn--x-large ma-t-lg`}
        onClick={onClick}
      >
        {children}
      </button>
    </div>
  );
}
