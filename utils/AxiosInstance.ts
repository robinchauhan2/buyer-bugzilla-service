import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.BugZilla_Base_URL
  });
  


export default axiosInstance