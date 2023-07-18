export default function Loader({ className }) {
  return (
    <img
      src="/img/spinner.gif"
      alt="Spinner"
      height="35"
      width="35"
      style={{ display: "block" }}
      className={className}
    />
  );
}
