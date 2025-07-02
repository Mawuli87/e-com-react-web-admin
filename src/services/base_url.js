import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost/projects/ecom/", // Change this to your local or live endpoint
});

export default API;
//http://127.0.0.1/projects/ecom/
