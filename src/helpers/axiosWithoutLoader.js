
import axios from "axios";

function createWithoutLoader(config) {
  const instance = axios.create(config);

  instance.interceptors.request.use(config => {
    return config;
  }, error => {
    return Promise.reject(error);
  });

  instance.interceptors.response.use(response => {
    return response;
  }, error => {
    return Promise.reject(error);
  });

  return instance;
}

export default createWithoutLoader;

