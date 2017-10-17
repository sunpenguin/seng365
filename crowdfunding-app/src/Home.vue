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

        <!--<b-navbar toggleable="md" type="dark" variant="info">-->
            <!--<b-nav-toggle target="nav_collapse"></b-nav-toggle>-->
            <!--<b-navbar-brand><router-link class="navbar-brand" :to="{ name: 'projects' }">Crowdfunding Website</router-link></b-navbar-brand>-->
            <!--<b-collapse is-nav id="nav_collapse">-->
                <!--<b-nav is-nav-bar>-->
                    <!--<b-nav-item><router-link :to="{ name: 'projects' }">Projects</router-link></b-nav-item>-->
                <!--</b-nav>-->
                <!--<b-nav is-nav-bar class="ml-auto">-->
                    <!--<b-nav-item-dropdown text="Log In" right>-->
                        <!--<b-nav-form>-->
                            <!--<b-form-group-->
                                <!--id="usernameEmail1"-->
                                <!--description="The username or email address to your account."-->
                                <!--label="Username/Email Address"-->
                            <!--&gt;-->
                                <!--<b-form-input id="usernameEmailInput" v-model="cUsername"></b-form-input>-->
                            <!--</b-form-group>-->
                            <!--<b-form-group-->
                                    <!--id="password1"-->
                                    <!--description="The password of your account."-->
                                    <!--label="Password"-->
                            <!--&gt;-->
                                <!--<b-form-input id="passwordInput" v-model="cPassword" type="password"></b-form-input>-->
                            <!--</b-form-group>-->
                            <!--<b-btn size="lg" type="button" @click="logIn()">Log In</b-btn>-->
                        <!--</b-nav-form>-->
                    <!--</b-nav-item-dropdown>-->
                <!--</b-nav>-->
            <!--</b-collapse>-->
        <!--</b-navbar>-->

        Search Projects <input type="search" v-model="searchString" placeholder="Search Projects" />
        Show Projects I have backed <input type="checkbox" v-model="backedProjects" />
        Show Projects I have created <input type="checkbox" v-model="createdProjects" />
        <br /><br />
        <div id="projectsList" v-cloak>
            <ul>
                <li class="projectSummary" v-for="project in searchProjects">
                    <img v-bind:src="'http://localhost:4941/api/v2/projects/' + project.id + '/image'" />
                    <h4>{{ project.title }}</h4>
                    <p>{{ project.subtitle }}</p>
                    <router-link :to="{ name: 'project', params: { projectId: project.id }}">View Details</router-link>
                </li>
            </ul>
            <br />
            <p>{{ $store.state.authenticationToken }}</p>
            <p>Counter: {{ counter }}, Range: {{ sRange }}, AuthToken: {{ projects.length }}, {{ counter2 }}</p>
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
                sRange: 1,
                counter: 0,
                counter2: 0,
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
                            open: true,
                            creator: this.$store.state.userId,
                            backer: this.$store.state.userId
                        }
                    } else if(this.backedProjects === true && this.createdProjects === false) {
                        parameters = {
                            open: true,
                            backer: this.$store.state.userId
                        }
                    } else if(this.backedProjects === false && this.createdProjects === true) {
                        parameters = {
                            open: true,
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
                this.counter = 0;
                this.counter2 = this.projects.length;

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