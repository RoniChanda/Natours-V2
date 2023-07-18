export const convertDate = (date, day) =>
  new Date(date).toLocaleString("en-us", {
    day: day ? "numeric" : undefined,
    month: "long",
    year: "numeric",
  });
