import Vue from 'vue'
import App from './App.vue'
import Home from './Home.vue'
import Users from './Users.vue'

import VueRouter from 'vue-router';
Vue.use(VueRouter);
// Vue.http.options.emulateJSON = true;

import VueResource from 'vue-resource';
Vue.use(VueResource);

const routes = [
    {
        path: "/",
        name: "projects",
        component: Home
    },
    {
        path: "/:projectId",
        name: "project",
        component: Home
    },
    {
        path: "/users",
        name: "users",
        component: Users
    }
];

const router = new VueRouter({
    routes: routes,
    mode: 'history'
});

new Vue({
    el: '#app',
    router: router,
    render: h => h(App)
});
