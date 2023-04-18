import axios from "axios";

console.log(process.env.BUGZILLA_BASE_URI)

const axiosInstance = axios.create({
    baseURL: process.env.BUGZILLA_BASE_URI, headers:{ "X-BUGZILLA-API-KEY": process.env.API_KEY,"Content-Type": "application/json" } 
  });
  


export default axiosInstance