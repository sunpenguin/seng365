<template>
    <div>
        <nav class="navbar navbar-inverse">
            <div class="container-fluid">
                <div class="navbar-header">
                    <router-link class="navbar-brand" :to="{ name: 'projects' }">Crowdfunding Website</router-link>
                </div>
                <ul class="nav navbar-nav">
                    <li><router-link :to="{ name: 'projects' }">Projects</router-link></li>
                </ul>
                <div v-if="this.$store.state.authenticationToken">
                    <ul class="nav navbar-nav navbar-right">
                        <li><router-link :to="{ name: 'user' }"><span class="glyphicon glyphicon-user"></span> My Account</router-link></li>
                        <li class="active"><router-link :to="{ name: 'myProjects' }"><span class="glyphicon glyphicon-edit"></span> Manage My Projects</router-link></li>
                        <li><router-link @click.native="logOut()" :to="{ name: 'projects'}"><span class="glyphicon glyphicon-log-out"></span> Log Out</router-link></li>
                    </ul>
                </div>

                <div v-else>
                    <ul class="nav navbar-nav navbar-right">
                        <li><router-link :to="{ name: 'createUser' }"><span class="glyphicon glyphicon-user"></span> Create Account</router-link></li>

                        <li class="dropdown">
                            <router-link :to="{ name: 'project' }" class="dropdown-toggle" data-toggle="dropdown"><b>Login</b><span class="caret"></span></router-link>

                            <ul class="dropdown-menu">
                                <li>
                                    <div class="form-group">
                                        <label for="usernameEmail" class="col-sm-10">Username or Email</label>
                                        <input type="text" class="form-control" id="usernameEmail" v-model="cUsername" placeholder="Username/Email">
                                    </div>
                                    <div class="form-group">
                                        <label for="password" class="col-sm-10">Password</label>
                                        <input type="password" class="form-control" id="password" v-model="cPassword" placeholder="Password">
                                    </div>
                                    <div class="form-group">
                                        <button type="submit" @click="logIn()" class="btn btn-primary btn-block">Log in</button>
                                    </div>
                                    <div class="form-group">
                                        <div v-if="errorFlag" style="color: red; text-align: center">
                                            {{ error }}
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </li>

                    </ul>
                </div>
            </div>
        </nav>
            <h1>My Projects</h1>

            <div>
                <li type="submit" class="btn btn-primary"><router-link style="color:white" :to="{ name: 'createProject' }">Create New Project</router-link></li>
            </div>

            <ul v-if="projects.length === 0">
                <h3>You currently have no projects created.</h3>
            </ul>

            <ul v-else>
                <div id="projectsList">
                    <li v-for="project in projects">
                        <div class="projectSummary" v-if="project.open">
                            <img v-bind:src="'http://localhost:4941/api/v2/projects/' + project.id + '/image/?time=' + getCurrentDate()" />
                            <div class="card">
                                <div class="card-body" id="projectSummary">
                                    <h4 class="card-title">{{ project.title }}</h4>
                                    <p class="card-subtitle mb-2 text-muted">{{ project.subtitle }}</p>
                                    <router-link class="btn btn-primary" :to="{ name: 'editProject', params: { projectId: project.id }}">Edit Project Details</router-link>
                                </div>
                            </div>
                        </div>
                        <div class="projectSummary" v-else>
                            <img style="opacity: 0.5" v-bind:src="'http://localhost:4941/api/v2/projects/' + project.id + '/image'" />
                            <div class="card">
                                <div class="card-body" id="projectSummary">
                                    <h4 style="color: grey" class="card-title">{{ project.title }}</h4>
                                    <p class="card-subtitle mb-2 text-muted">{{ project.subtitle }}</p>
                                    <router-link class="btn btn-primary" :to="{ name: 'editProject', params: { projectId: project.id }}">Edit Project Details (Closed)</router-link>
                                </div>
                            </div>
                        </div>
                    </li>
                </div>
            </ul>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                error: "",
                errorFlag: false,
                projects: [],
                cUsername: "",
                cPassword: ""
            }
        },
        mounted: function(){
            this.getMyProjects();
        },
        methods: {
            getCurrentDate: function() {
                return Date.now();
            },
            getMyProjects: function(){
                this.$http.get("http://localhost:4941/api/v2/projects", {
                    params: {
                        creator: this.$store.state.userId
                    }
                })
                    .then(function (response) {
                        this.projects = response.data;
                    }, function (error) {
                        this.error = error;
                        this.errorFlag = true;
                    });
            },
            logIn: function(){
                this.errorFlag = false;
                this.$http.post("http://localhost:4941/api/v2/users/login", {}, {
                    params: {
                        username: this.cUsername,
                        email: this.cUsername,
                        password: this.cPassword
                    }
                }).then(function(response){
                    this.$store.commit('changeId', response.data.id);
                    this.$store.commit('changeToken', response.data.token);
                    this.cUsername = "";
                    this.cPassword = "";
                    this.$router.push({ name: 'projects' });
                }, function(error) {
                    this.error = "Error Logging In!";
                    this.errorFlag = true;
                });
            },
            logOut: function() {
                this.errorFlag = false;
                this.$http.post("http://localhost:4941/api/v2/users/logout", {}, {
                    headers: {
                        'X-Authorization': this.$store.state.authenticationToken
                    }
                }).then(function(response){
                    this.$store.commit('changeId', -1);
                    this.$store.commit('changeToken', "");
                }, function(error) {
                    this.error = "Error Logging Out!";
                    this.errorFlag = true;
                });
            }
        }
    }
</script>