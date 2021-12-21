// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import E from 'wangeditor'

axios.defaults.withCredentials = true;
if (localStorage.getItem("token")) {
  axios.defaults.headers.common.Authorization = localStorage.getItem("token")
}

Vue.use(Vuex)
Vue.use(Element)
Vue.prototype.$axios = axios
Vue.prototype.$E = E
Vue.config.productionTip = false

const store = new Vuex.Store({
  state: {
    user: {

    },
  },
  getters: {
    isLogined() {
      var state = false;
      axios.get("http://localhost:8080/sign/isLogined").then((res) => {
        const r = res.data;
        state = r.state;
        console.log(r.user);
        if (r.state) {
          store.commit("setUser", r.user)
          return true;
        }else {
          return false;
        }
      })
    },
    
    getIsLogined(state){
      return state.isLogined;
    },
    getUser(state){
      return state.user
    },
    
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  store: store
})
