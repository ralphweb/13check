import create from "@/helpers/axiosWithLoader";
import createWithoutLoader from "@/helpers/axiosWithoutLoader";
import Config from "@/app.config";

const api = create({
  baseURL: Config.apiUrl,
});

const apilocal = create({
  baseURL: Config.apiUrlLocal,
});

const apiWithoutLoader = createWithoutLoader({
  baseURL: Config.apiUrl,
});

/* LOGIN */
const login = (email, password) => {
  return api.post("/user/login", {
    email: email,
    password: password,
    dashboard: true,
  });
};

const loginGoogle = (email) => {
  return api.post("/user/logingoogle", { email: email });
};

/* LOGOUT */
const logout = (email) => {
  return api.put("/user/logout/", { email: email });
};

/* VIEWS */
const getViews = () => {
  return api.get("/view", {});
};

/* ROLES */
const getRoles = () => {
  return api.get("/role", {});
};

const getRole = (id) => {
  return api.get("/role/" + id, {});
};

const createRole = (role) => {
  return api.post("/role", role);
};

const updateRole = (id, role) => {
  return api.put("/role/" + id, role);
};

const deleteRole = (id) => {
  return api.delete("/role/" + id, {});
};

/* USERS */
const getUsers = () => {
  return api.get("/user", {});
};

const createUser = (user) => {
  return api.post("/user", user);
};

const updateUser = (id, user) => {
  return api.put("/user/" + id, user);
};

const deleteUser = (id) => {
  return api.delete("/user/" + id, {});
};

/* SIGNALS */
const getSignals = () => {
  return api.get("/signal", {});
};

const getallSignal = () => {
  return api.get("/signal/all", {});
};

const createSignal = (signal) => {
  return api.post("/signal", signal);
};

const updateSignal = (id, signal) => {
  delete signal.logo;
  return api.put("/signal/" + id, signal);
};

const deleteSignal = (id) => {
  return api.delete("/signal/" + id, {});
};

/* FORMULARIO */
/* COUNTRY */
const getallCountry = () => {
  return api.get("/country/all", {});
};

const searchCountry = (query) => {
  return api.post("/country/search", { query: query });
};

const createCountry = (country) => {
  return api.post("/country", country);
};

const updateCountry = (id, country) => {
  return api.put("/country/" + id, country);
};

const deleteCountry = (id) => {
  return api.delete("/country/" + id, {});
};

/* PERSON */
const getallPerson = () => {
  return api.get("/person/all", {});
};

const searchPerson = (query) => {
  return api.post("/person/search", { query: query });
};

const createPerson = (person) => {
  return api.post("/person", person);
};

const updatePerson = (id, person) => {
  return api.put("/person/" + id, person);
};

const deletePerson = (id) => {
  return api.delete("/person/" + id, {});
};

/* SHOW */
const getallShow = () => {
  return api.get("/show/all", {});
};

const searchShow = (query) => {
  return api.post("/show/search", { query: query });
};

const createShow = (show) => {
  return api.post("/show", show);
};

const updateShow = (id, show) => {
  return api.put("/show/" + id, show);
};

const deleteShow = (id) => {
  return api.delete("/show/" + id, {});
};

/* TOPIC */
const getallTopic = () => {
  return api.get("/topic/all", {});
};

const searchTopic = (query) => {
  return api.post("/topic/search", { query: query });
};

const createTopic = (topic) => {
  return api.post("/topic", topic);
};

const updateTopic = (id, topic) => {
  return api.put("/topic/" + id, topic);
};

const deleteTopic = (id) => {
  return api.delete("/topic/" + id, {});
};

/* AGE */
const getallAge = () => {
  return api.get("/age/all", {});
};

const searchAge = (query) => {
  return api.post("/age/search", { query: query });
};

const createAge = (age) => {
  return api.post("/age", age);
};

const updateAge = (id, age) => {
  return api.put("/age/" + id, age);
};

const deleteAge = (id) => {
  return api.delete("/age/" + id, {});
};

/* CATEGORY */
const getallCategory = () => {
  return api.get("/category/all", {});
};

const searchCategory = (query) => {
  return api.post("/category/search", { query: query });
};

const createCategory = (category) => {
  return api.post("/category", category);
};

const updateCategory = (id, category) => {
  return api.put("/category/" + id, category);
};

const deleteCategory = (id) => {
  return api.delete("/category/" + id, {});
};

/* CATALOG */
const getCatalog = (id) => {
  return api.get("/catalog/" + id, {});
};

const createCatalog = (catalog) => {
  return api.post("/catalog", catalog);
};

const updateCatalog = (id, catalog) => {
  return api.put("/catalog/" + id, catalog);
};

/* CROPS */
const sendCrop = (parameters) => {
  return new Promise((resolve, reject) => {
    let crop = {
      author: parameters.author_id,
      signal: parameters.signal,
      timestampStart: parameters.dateini,
      timestampEnd: parameters.dateend,
    };
    api
      .post("/crop", crop)
      .then((response) => {
        delete parameters.author_id;
        delete parameters.signal;
        apilocal
          .post("/crop/" + parameters.ipServer + "/crop", parameters)
          .then((result) => {
            resolve(result);
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};

const getCrops = (user) => {
  return api.get("/crop/" + user);
};

const getCropsByUser = (user) => {
  return api.get("/crop/user/" + user);
};

const getAllCrops = () => {
  return api.get("/crop");
};

const deleteCrop = (id) => {
  return api.delete("/crop/" + id, {});
};

const updateCrop = (id, crop) => {
  return api.put("/crop/" + id, crop);
};

/* EMAIL */
const sendEmail = (email) => {
  return api.post("/email", email);
};

const validateToken = (token) => {
  return api.get("/email/" + token);
};

const modifyPassword = (token, password) => {
  return api.put("/email/" + token, { password: password });
};

/* RATING */
const getRating = (startdate, enddate, unit) => {
  return apilocal.post("/r", {
    startdate: startdate,
    enddate: enddate,
    unit: unit,
  });
};

export {
  login,
  loginGoogle,
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
  getallSignal,
  createSignal,
  updateSignal,
  deleteSignal,
  getallCountry,
  searchCountry,
  createCountry,
  updateCountry,
  deleteCountry,
  getallPerson,
  searchPerson,
  createPerson,
  updatePerson,
  deletePerson,
  getallShow,
  searchShow,
  createShow,
  updateShow,
  deleteShow,
  getallTopic,
  searchTopic,
  createTopic,
  updateTopic,
  deleteTopic,
  getallAge,
  searchAge,
  createAge,
  updateAge,
  deleteAge,
  getallCategory,
  searchCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCatalog,
  createCatalog,
  updateCatalog,
  sendCrop,
  getCrops,
  getCropsByUser,
  getAllCrops,
  deleteCrop,
  updateCrop,
  sendEmail,
  validateToken,
  modifyPassword,
  getRating,
};
