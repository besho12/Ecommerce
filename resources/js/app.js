/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');
import moment from 'moment';






import { Form, HasError, AlertError } from 'vform';
window.Form = Form;

Vue.component(HasError.name, HasError)
Vue.component(AlertError.name, AlertError)
Vue.component('pagination', require('laravel-vue-pagination')); //pagination


import Gate from './Gate';
Vue.prototype.$gate = new Gate(window.user);//window.user will have authuntication user info from master.php

import VueRouter from 'vue-router'

Vue.use(VueRouter)

import store from './store';


///  progress bar //////////////////////////////////////
import VueProgressBar from 'vue-progressbar'
Vue.use(VueProgressBar, {
    color: 'rgb(143, 255, 199)',
    failedColor: 'red',
    height: '3px'
  })

/// sweetalert ////////////////////////////////////////
import Swal from 'sweetalert2'
window.Swal = Swal;



const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })
  window.Toast = Toast;


///////////////////////////////////////////////////////

let routes = [
    { path: '/dashboard', component: require('./components/Dashboard.vue').default },
    { path: '/profile', component: require('./components/Profile.vue').default },
    { path: '/users', component: require('./components/Users.vue').default },
    { path: '/products', component: require('./components/Products.vue').default },
    { path: '/home', component: require('./components/Dashboard.vue').default },
    { path: '/checkout', component: require('./components/Checkout.vue').default },
    { path: '*', component: require('./components/NotFound.vue').default },
  ]





const router = new VueRouter({
    mode: 'history',
    routes // short for `routes: routes`
  })

// filters ////////////////////////////////////////////

Vue.filter('upText', function(text){
    return text.charAt(0).toUpperCase() + text.slice(1);
});

Vue.filter('myDate', function(created){
    return moment(created).format('MMMM Do YYYY');
});



Vue.filter('str_limit', function (value, size) {
  if (!value) return '';
  value = value.toString();

  if (value.length <= size) {
    return value;
  }
  return value.substr(0, size) + '...';
});



///////////////////////////////////////////////////////

window.Fire = new Vue();


/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i)
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

Vue.component('example-component', require('./components/ExampleComponent.vue').default);
Vue.component('not-found', require('./components/NotFound.vue').default);
Vue.component('vue-per', require('./components/Vueper.vue').default);

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

const app = new Vue({
    el: '#app',
    router,
    store,
    data:{
        search: '',
    },
    methods:{
        searchit(){
            Fire.$emit('searching');
        }
    },
});

