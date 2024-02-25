
import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://localhost:7203/odata",
  
});

export default axiosClient;
