require('./bootstrap');
import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import App from './App.vue'
import VueRouter from 'vue-router'
import router from './router'
import Vuelidate from "vuelidate";


import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Install BootstrapVue
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);
//Install VueRouter
Vue.use(VueRouter);
//Install Vuelidate
Vue.use(Vuelidate);

new Vue({
    router,
    render: h => h(App)  
}).$mount('#app')