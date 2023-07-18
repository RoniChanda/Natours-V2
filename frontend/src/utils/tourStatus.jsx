export const getTourStatus = (el) => {
  const startDate = new Date(el.tourStartDate).getTime();
  const tourOver =
    Date.now() > startDate + el.tour.duration * 24 * 60 * 60 * 1000;

  return tourOver;
};
