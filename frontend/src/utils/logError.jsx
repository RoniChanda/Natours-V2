export const logError = (obj, fn) => {
  try {
    fn(obj);
  } catch (error) {
    if (import.meta.env.DEV) console.error("Error:", error);
  }
};
