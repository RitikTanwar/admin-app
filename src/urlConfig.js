const baseURL =
  location && location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://flipkart-admins-apps.herokuapp.com";

export const api = `${baseURL}/api`;
export const generatePublicURL = (filename) => {
  return `${baseURL}/public/${filename}`;
};
