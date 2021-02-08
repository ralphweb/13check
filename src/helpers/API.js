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

/* DASHBOARD */
const getDashboard = (from,to,type,topic,topics,intent) => {
  var filter = "/";
  if(type!='TODOS') {
    if(topic==null) {
      //All topics - No intents
      var topicsArr = topics.map((topic)=>{
        return topic._id;
      });
      filter = filter + topicsArr.join();
    } else {
      //Selected topics
      filter = filter + topic;
      if(intent!=null) {
        //Selected intent
        filter = filter + "/" + intent;
      }
    }
  }
  return api.get("/dashboard/"+from+"/"+to+filter,{});
};

const getConversation = (conversation) => {
  return apiWithoutLoader.get("/conversation/"+conversation,{});
};

/* INTENTS */
const getIntents = () => {
  return api.get("/intent",{});
};

/* TOPICS */
const getTopics = () => {
  return api.get("/topic",{});
};

/* AGENTS */
const getAgents = () => {
  return api.get("/session",{});
};

const saveAgent = (agent,form) => {
  if(agent==null) {
    return api.post("/user/",form);
  } else {
    return api.put("/user/"+agent,form);
  }
};

const deleteAgent = (agent) => {
  return api.delete("/user/"+agent,{});
};

export {
  login,
  logout,
  getDashboard,
  getConversation,
  getTopics,
  getIntents,
  getAgents,
  saveAgent,
  deleteAgent
};