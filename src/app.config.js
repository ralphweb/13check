const CONFIG = {
  node_env: process.env.NODE_ENV,

  debug_enabled: parseInt(process.env.VUE_APP_ENABLE_DEBUG, 10),

  vue_app_title: process.env.VUE_APP_TITLE || "13Check",
  vue_app_hostname:
    process.env.VUE_APP_HOSTNAME || "https://13checkqa.ingenieriac13.cl",

  api_hostname: "https://13checkapi.ingenieriac13.cl",
  api_url:
    process.env.VUE_APP_API_URL || "https://13checkapi.ingenieriac13.cl/api/",
  api_url_local:
    process.env.VUE_APP_API_URL || "https://13checkqa.ingenieriac13.cl/",
  //api_hostname: process.env.VUE_APP_API_HOSTNAME || "https://lablab-desk-api.simpleux.cl",
  //api_url: process.env.VUE_APP_API_URL || "https://lablab-desk-api.simpleux.cl/api/",

  domain: process.env.VUE_APP_DOMAIN || "13checkqa.ingenieriac13.cl",

  supertoken: "token-super-secretooooooooooo",
};

export default {
  get appName() {
    return CONFIG.vue_app_title;
  },
  get defaultRoute() {
    return {
      name: CONFIG.default_route || "",
    };
  },
  get storageNamespace() {
    return CONFIG.vue_app_title;
  },
  get debugEnabled() {
    return !!(CONFIG.debug_enabled || CONFIG.node_env === "development");
  },
  get domain() {
    return CONFIG.domain;
  },
  get nodeEnv() {
    return CONFIG.node_env;
  },
  get apiHostname() {
    return CONFIG.api_hostname;
  },
  get apiUrl() {
    return CONFIG.api_url || `${CONFIG.apiHostname}/api/`;
  },
  get apiUrlLocal() {
    return CONFIG.api_url_local;
  },
  get superToken() {
    return CONFIG.supertoken;
  },
};
