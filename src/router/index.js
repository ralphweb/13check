import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import { logout } from '@/helpers/API.js';
import store from '@/store';

Vue.use(VueRouter)

var routes = [
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
    path: '/vistaunica',
    name: 'Vista Única',
    component: function () {
      return import('../views/single.vue')
    }
  },
  {
    path: '/catalogo/:id?',
    name: 'Catálogo',
    component: function () {
      return import('../views/catalog.vue')
    }
  },
  {
    path: '/comparador',
    name: 'Comparador',
    component: function () {
      return import('../views/compare.vue')
    }
  },
  {
    path: '/todas',
    name: 'Todas',
    component: function () {
      return import('../views/all.vue')
    }
  },
  {
    path: '/clips',
    name: 'Mis clips',
    component: function () {
      return import('../views/clips.vue')
    }
  },
  {
    path: '/admin/signals',
    name: 'AdminSeñales',
    component: function () {
      return import('../views/admin/signals.vue')
    }
  },
  {
    path: '/admin/users',
    name: 'AdminUsuarios',
    component: function () {
      return import('../views/admin/users.vue')
    }
  },
  {
    path: '/admin/roles',
    name: 'AdminRoles',
    component: function () {
      return import('../views/admin/roles.vue')
    }
  },
  {
    path: '/admin/catalogo',
    name: 'AdminCatálogo',
    component: function () {
      return import('../views/admin/catalog.vue')
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
  
router.beforeEach((to, from, next) => {
  store.commit('SET_SHOW_MENU', false);
  if (!Vue.prototype.$session.exists()&&to.path!='/login') {
    router.push({name:'Login'})
  }
  
  if(Vue.prototype.$session.exists()&&to.path=='/login') {
    router.push({name:'Comparador'})
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