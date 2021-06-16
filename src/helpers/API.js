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

/* VIEWS */
const getViews = () => {
  return api.get("/view",{});
};

/* ROLES */
const getRoles = () => {
  return api.get("/role",{});
};

const getRole = (id) => {
  return api.get("/role/"+id,{});
};

const createRole = (role) => {
  return api.post("/role",role);
};

const updateRole = (id,role) => {
  return api.put("/role/"+id,role);
};

const deleteRole = (id) => {
  return api.delete("/role/"+id,{});
};

/* USERS */
const getUsers = () => {
  return api.get("/user",{});
};

const createUser = (user) => {
  return api.post("/user",user);
};

const updateUser = (id,user) => {
  return api.put("/user/"+id,user);
};

const deleteUser = (id) => {
  return api.delete("/user/"+id,{});
};

/* SIGNALS */
const getSignals = () => {
  return api.get("/signal",{});
};

const getAllSignals = () => {
  return api.get("/signal/all",{});
};

const createSignal = (signal) => {
  return api.post("/signal",signal);
};

const updateSignal = (id,signal) => {
  delete signal.logo;
  return api.put("/signal/"+id,signal);
};

const deleteSignal = (id) => {
  return api.delete("/signal/"+id,{});
};

export {
  login,
  logout,
  getViews,
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getSignals,
  getAllSignals,
  createSignal,
  updateSignal,
  deleteSignal
};