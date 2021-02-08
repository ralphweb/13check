
import axios from "axios";
import store from "@/store";

function create(config) {
  const instance = axios.create(config);

  instance.interceptors.request.use(config => {
    store.commit('SET_IS_LOADING', true)
    return config;
  }, error => {
    store.commit('SET_IS_LOADING', false)
    return Promise.reject(error);
  });

  instance.interceptors.response.use(response => {
    store.commit('SET_IS_LOADING', true)
    return response;
  }, error => {
    store.commit('SET_IS_LOADING', false)
    return Promise.reject(error);
  });

  return instance;
}

export default create;

