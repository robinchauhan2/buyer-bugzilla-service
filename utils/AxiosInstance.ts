import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://bugzilla.thewitslab.com/bugzilla/"
  });
  


export default axiosInstance