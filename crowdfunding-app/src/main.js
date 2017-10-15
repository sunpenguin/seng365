import Vue from 'vue'
import App from './App.vue'
import Home from './Home.vue'
import Project from './Project.vue'
import User from './User.vue'
import CreateUser from './CreateUser.vue'
import UserProjects from './UserProjects.vue'
import CreateProject from './CreateProject.vue'

import VueRouter from 'vue-router';
Vue.use(VueRouter);

import VueResource from 'vue-resource';
Vue.use(VueResource);

import VueX from 'vuex';
Vue.use(VueX);

import BootstrapVue from 'bootstrap-vue';
Vue.use(BootstrapVue);


const routes = [
    {
        path: "/",
        name: "projects",
        component: Home
    },
    {
        path: "/:projectId",
        name: "project",
        component: Project
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
        path: "/myProjects",
        name: "myProjects",
        components: UserProjects
    },
    {
        path: "/createProject",
        name: "createProject",
        component: CreateProject
    }
];

const router = new VueRouter({
    routes: routes,
    mode: 'history',
    go: {
        path: "/",
        name: "projects",
        component: Home,
        force: true
    }
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
