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
                        <li><router-link :to="{ name: 'user' }"><span class="glyphicon glyphicon-user"></span> JOHN CENA</router-link></li>
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

        <div v-if="errorFlag" style="color: red;">
            {{ error }}
        </div>

        <h2>{{ singleProject.title }}</h2>
        <img v-bind:src="'http://localhost:4941/api/v2/projects/' + $route.params.projectId + '/image'" />
        <br />
        Update Image <input type="file" accept="image/jpeg,image/png" @change="onImageChange($event)">
        <button type="button" @click="updateImage()" class="btn btn-primary">Update Image</button>
        <br /><br />
        <div class="btn-group" v-if="projectOpen">
            <button type="button" @click="closeProject()" class="btn btn-primary">Close Project</button>
            <button class="btn btn-primary"><router-link style="color:white" :to="{ name: 'myProjects'}">Back to My Projects</router-link></button>
        </div>
        <div class="btn-group" v-else>
            <button type="button" class="btn btn-primary disabled">Project already closed.</button>
            <button class="btn btn-primary"><router-link style="color:white" :to="{ name: 'myProjects'}">Back to My Projects</router-link></button>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                error: "",
                errorFlag: false,
                singleProject: "",
                cUsername: "",
                cPassword: "",
                projectOpen: true,
                newImage: "",
                type: ""
            }
        },
        mounted: function (){
            this.getSingleProjectDetails(this.$route.params.projectId);
        },
        methods: {
            giveError: function(){
                this.error += "ERROR";
                this.errorFlag = true;
            },
            getSingleProjectDetails: function(id){
                this.$http.get("http://localhost:4941/api/v2/projects/" + id)
                    .then(function (response) {
                        this.singleProject = response.data;
                        this.projectOpen = response.data.open;
                    }, function (error) {
                        this.error = error;
                        this.errorFlag = true;
                    });
            },
            onImageChange: function(event){
                this.newImage = event.target.files[0];
            },
            updateImage: function(){
                this.$http.put("http://localhost:4941/api/v2/projects/" + this.$route.params.projectId + "/image", this.newImage, {
                    headers: {
                        'Content-Type': 'image/png',
                        'X-Authorization': this.$store.state.authenticationToken
                    }
                }).then(function(response){
                    this.getSingleProjectDetails(this.$route.params.projectId);
                    this.$router.push({ name: 'editProject', params: { projectId: this.singleProject.id } });
                    this.newImage = "";
                }, function(error){
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