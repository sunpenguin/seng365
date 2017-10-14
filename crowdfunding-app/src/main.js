import Vue from 'vue'
import App from './App.vue'
import Home from './Home.vue'
import User from './User.vue'
import CreateUser from './CreateUser.vue'
import LogIn from './LogIn.vue'
import UserDetails from './UserDetails.vue'

import VueRouter from 'vue-router';
Vue.use(VueRouter);

import VueResource from 'vue-resource';
Vue.use(VueResource);

import VueX from 'vuex';
Vue.use(VueX);

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
    },
    {
        path: "/logIn",
        name: "logIn",
        component: LogIn
    },
    {
        path: "/userDetails",
        name: "userDetails,",
        component: UserDetails
    }
];

const router = new VueRouter({
    routes: routes,
    mode: 'history'
});

const store = new VueX.Store({
    state: {
        userId: -1,
        authenticationToken: ""
    },
    mutations: {
        changeId (state, newId) {
            state.userId = newId;
        },
        changeToken (state, newToken) {
            state.authenticationToken = newToken;
        }
    }
});

new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App)
});
