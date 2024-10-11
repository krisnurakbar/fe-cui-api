// utils/auth.js
export const isLoggedIn = () => {
  return !!localStorage.getItem("userToken"); // Return true if token exists
};
