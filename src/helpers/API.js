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

/* VIEWS */
const getViews = () => {
  return api.get("/view",{});
};

/* ROLES */
const getRoles = () => {
  return api.get("/role",{});
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

export {
  login,
  logout,
  getSignals,
  getViews,
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  getUsers,
  createUser,
  updateUser,
  deleteUser
};