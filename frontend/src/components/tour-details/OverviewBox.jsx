import "./OverviewBox.css";

export default function OverviewBox({ heading, children }) {
  return (
    <div className="overview-box__group">
      <h2 className="heading-secondary ma-bt-lg">{heading}</h2>
      {children}
    </div>
  );
}
