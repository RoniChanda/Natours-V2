export default function InnerContainer({
  children,
  className,
  heading,
  headerClass,
  style,
}) {
  return (
    <div className={className || undefined} style={style || undefined}>
      {heading && (
        <h2
          className={`heading-secondary ma-bt-md ${headerClass || undefined}`}
        >
          {heading}
        </h2>
      )}
      {children}
    </div>
  );
}
