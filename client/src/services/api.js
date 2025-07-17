import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true, // 🔑 Important for session cookies
});

export default instance;
