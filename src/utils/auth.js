// utils/auth.js

export const saveToken = (token) => localStorage.setItem("token", token);
export const getToken = () => localStorage.getItem("token");
export const removeToken = () => localStorage.removeItem("token");

export const decodeToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const { sub, ...rest } = payload;
    return { ...rest, id: sub }; // ⬅️ Now id will work correctly
  } catch (err) {
    console.error("Failed to decode token:", err);
    return null;
  }
};
