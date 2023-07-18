export const logError = (obj, fn) => {
  try {
    fn(obj);
  } catch (error) {
    console.error("Error:", error);
  }
};
