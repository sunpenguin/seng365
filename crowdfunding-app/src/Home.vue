<template>
    <div>
        <nav class="navbar navbar-inverse">
            <div class="container-fluid">
                <div class="navbar-header">
                    <router-link class="navbar-brand" :to="{ name: 'projects' }">Crowdfunding Website</router-link>
                </div>
                <ul class="nav navbar-nav">
                    <li class="active"><router-link :to="{ name: 'projects' }">Projects</router-link></li>
                </ul>
                <div v-if="this.$store.state.authenticationToken">
                    <ul class="nav navbar-nav navbar-right">
                        <li><router-link :to="{ name: 'user' }"><span class="glyphicon glyphicon-user"></span> My Account</router-link></li>
                        <li><router-link :to="{ name: 'myProjects' }"><span class="glyphicon glyphicon-edit"></span> Manage My Projects</router-link></li>
                        <li><router-link @click.native="logOut()" :to="{ name: 'projects'}"><span class="glyphicon glyphicon-log-out"></span> Log Out</router-link></li>
                    </ul>
                </div>

                <div v-else>
                    <ul class="nav navbar-nav navbar-right">
                        <li><router-link :to="{ name: 'createUser' }"><span class="glyphicon glyphicon-user"></span> Create Account</router-link></li>

                        <li class="dropdown" id="logInDropdown">
                            <router-link :to="{ name: 'projects' }" class="dropdown-toggle" data-toggle="dropdown"><b>Login</b><span class="caret"></span></router-link>

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
                                        <button type="button" @click="logIn()" class="btn btn-primary btn-block">Log in</button>
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
        <div class="row">
            <div class="col-lg-3"></div>
            <div class="col-lg-6">
                <div class="input-group" id="homeTop">
                    <div class="input-group-addon" id="searchText">Search Projects</div>
                    <input class="form-control" type="search" v-model="searchString" placeholder="Search Projects" aria-describedby="searchText"/>
                </div>
            </div>
            <div class="col-lg-3"></div>
        </div>
        <div class="row">
            <div class="col-lg-4"></div>
            <div class="col-lg-2">
                <div class="input-group">
                    <label id="checkboxBacked">Show Projects I have backed:</label>
                    <input type="checkbox" v-model="backedProjects" />
                </div>
            </div>

            <div class="col-lg-2">
                <div class="input-group">
                    <label>Show Projects I have created </label>
                    <input type="checkbox" v-model="createdProjects" />
                </div>
            </div>
            <div class="col-lg-4"></div>
        </div>


        <br /><br />
        <div id="projectsList" v-cloak>
            <ul>
                <li class="projectSummary" v-for="project in searchProjects">
                    <img v-bind:src="'http://localhost:4941/api/v2/projects/' + project.id + '/image'" />
                    <div class="card">
                        <div class="card-body" id="projectSummary">
                            <h4 class="card-title">{{ project.title }}</h4>
                            <p class="card-subtitle mb-2 text-muted">{{ project.subtitle }}</p>
                            <router-link class="btn btn-primary" :to="{ name: 'project', params: { projectId: project.id }}">View Details</router-link>
                        </div>
                    </div>


                </li>
            </ul>
            <br />
            <p>{{ $store.state.authenticationToken }}</p>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                searchString: "",
                error: "",
                errorFlag: false,
                projects: [],
                authToken: "",
                cUsername: "",
                cPassword: "",
                backedProjects: false,
                createdProjects: false
            }
        },
        mounted: function (){
            this.getProjects();
        },
        methods: {
            getProjects: function(){
                let parameters = {
                    open: true
                };
                if (this.$store.state.userId > 0) {
                    if(this.backedProjects === true && this.createdProjects === true) {
                        parameters = {
                            creator: this.$store.state.userId,
                            backer: this.$store.state.userId
                        }
                    } else if(this.backedProjects === true && this.createdProjects === false) {
                        parameters = {
                            backer: this.$store.state.userId
                        }
                    } else if(this.backedProjects === false && this.createdProjects === true) {
                        parameters = {
                            creator: this.$store.state.userId
                        }
                    }
                }

                this.$http.get("http://localhost:4941/api/v2/projects", {params: parameters})
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
        },
        computed: {
            searchProjects: function(){
                this.getProjects();

                let projects = this.projects,
                   searchString  = this.searchString;

                if (!searchString) {
                    return projects;
                }

                searchString = searchString.trim().toLowerCase();

                projects = projects.filter(function(item){
                    if(item.title.toLowerCase().indexOf(searchString) !== -1){
                        return item;
                    }
                });

                return projects;
            }
        }
    }
</script>