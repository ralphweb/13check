import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import { logout } from '@/helpers/API.js';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: function () {
      return import('../views/Login.vue')
    }
  },
  {
    path: '/logout',
    name: 'Logout',
    component: function () {
      return import('../views/Login.vue')
    }
  },
  {
    path: '/agentes',
    name: 'Agentes',
    component: function () {
      return import('../views/Agents.vue')
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (!Vue.prototype.$session.exists()&&to.path!='/login') {
    router.push({name:'Login'})
  }

  if(Vue.prototype.$session.exists()&&to.path=='/login') {
    router.push({name:'Home'})
  }

  if(Vue.prototype.$session.exists()&&to.path=='/logout') {
    let user = Vue.prototype.$session.get('user');
    logout(user.email)
      .then((result)=>{
        Vue.prototype.$session.destroy();
        router.push({name:'Login'});
      }).catch((e)=>{
        console.log(e);
        Vue.prototype.$session.destroy();
        router.push({name:'Login'});
      })
  }

  return next();
});

export default router
