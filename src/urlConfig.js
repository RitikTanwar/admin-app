// const baseURL = "http://localhost:3000";
const baseURL = "https://flipkart-backened-rest-server.herokuapp.com";

export const api = `${baseURL}/api`;
export const generatePublicURL = (filename) => {
  return `${baseURL}/public/${filename}`;
};
