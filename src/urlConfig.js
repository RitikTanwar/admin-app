const baseURL = "https://flipkart-admins-apps.herokuapp.com";

export const api = `${baseURL}/api`;
export const generatePublicURL = (filename) => {
  return `${baseURL}/public/${filename}`;
};
