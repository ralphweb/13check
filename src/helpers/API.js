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

/* FORMULARIO */
/* COUNTRY */
const getallCountry = () => {
  return api.get("/country/all",{});
};

const createCountry = (country) => {
  return api.post("/country",country);
};

const updateCountry = (id,country) => {
  return api.put("/country/"+id,country);
};

const deleteCountry = (id) => {
  return api.delete("/country/"+id,{});
};

/* PERSON */
const getallPerson = () => {
  return api.get("/person/all",{});
};

const createPerson = (person) => {
  return api.post("/person",person);
};

const updatePerson = (id,person) => {
  return api.put("/person/"+id,person);
};

const deletePerson = (id) => {
  return api.delete("/person/"+id,{});
};

/* SHOW */
const getallShow = () => {
  return api.get("/show/all",{});
};

const createShow = (show) => {
  return api.post("/show",show);
};

const updateShow = (id,show) => {
  return api.put("/show/"+id,show);
};

const deleteShow = (id) => {
  return api.delete("/show/"+id,{});
};

/* TOPIC */
const getallTopic = () => {
  return api.get("/topic/all",{});
};

const createTopic = (topic) => {
  return api.post("/topic",topic);
};

const updateTopic = (id,topic) => {
  return api.put("/topic/"+id,topic);
};

const deleteTopic = (id) => {
  return api.delete("/topic/"+id,{});
};

/* AGE */
const getallAge = () => {
  return api.get("/age/all",{});
};

const createAge = (age) => {
  return api.post("/age",age);
};

const updateAge = (id,age) => {
  return api.put("/age/"+id,age);
};

const deleteAge = (id) => {
  return api.delete("/age/"+id,{});
};

/* CATEGORY */
const getallCategory = () => {
  return api.get("/category/all",{});
};

const createCategory = (category) => {
  return api.post("/category",category);
};

const updateCategory = (id,category) => {
  return api.put("/category/"+id,category);
};

const deleteCategory = (id) => {
  return api.delete("/category/"+id,{});
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
  deleteSignal,
  getallCountry,
  createCountry,
  updateCountry,
  deleteCountry,
  getallPerson,
  createPerson,
  updatePerson,
  deletePerson,
  getallShow,
  createShow,
  updateShow,
  deleteShow,
  getallTopic,
  createTopic,
  updateTopic,
  deleteTopic,
  getallAge,
  createAge,
  updateAge,
  deleteAge,
  getallCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};