import create from "@/helpers/axiosWithLoader";
import createWithoutLoader from "@/helpers/axiosWithoutLoader";
import Config from "@/app.config";

const api = create({
  baseURL: Config.apiUrl
});

const apiWithoutLoader = createWithoutLoader({
  baseURL: Config.apiUrl
});

/* LOGIN */
const login = (email,password) => {
  return api.post("/auth/login",{email:email,password:password,dashboard:true});
};

/* LOGOUT */
const logout = (email) => {
  return api.put("/auth/logout/",{email:email});
};

/* LOGOUT */
const getSignals = (email) => {
  return api.get("/signal",{});
};

export {
  login,
  logout,
  getSignals
};