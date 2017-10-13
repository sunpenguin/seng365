import Vue from 'vue'
import App from './App.vue'
import Home from './Home.vue'
import User from './User.vue'
import CreateUser from './CreateUser.vue'

import VueRouter from 'vue-router';
Vue.use(VueRouter);

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
        path: "/user",
        name: "user",
        component: User
    },
    {
        path: "/createUser",
        name: "createUser",
        component: CreateUser
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
