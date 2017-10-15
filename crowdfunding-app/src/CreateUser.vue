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
                        <li><router-link :to="{ name: 'myProjects' }"><span class="glyphicon glyphicon-edit"></span> Manage My Projects</router-link></li>
                        <li><router-link @click.native="logOut()" :to="{ name: 'projects'}" ><span class="glyphicon glyphicon-log-out"></span> Log Out</router-link></li>
                    </ul>
                </div>

                <div v-else>
                    <ul class="nav navbar-nav navbar-right">
                        <li class="active"><router-link :to="{ name: 'createUser' }"><span class="glyphicon glyphicon-user"></span> Create Account</router-link></li>

                        <li class="dropdown disabled">
                            <router-link :to="{ name: 'createUser' }" class="dropdown-toggle disabled" data-toggle="dropdown"><b>Login</b><span class="caret"></span></router-link>

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

        <div class="container">
            <div class="form-group row">
                <label for="inputUsername" class="col-sm-3 col-form-label">Username</label>
                <div class="col-sm-7">
                    <input type="text" class="form-control" id="inputUsername" v-model="newUsername" placeholder="Username" required>
                </div>
            </div>
            <div class="form-group row">
                <label for="inputEmail" class="col-sm-3 col-form-label">Email Address</label>
                <div class="col-sm-7">
                    <input type="email" class="form-control" id="inputEmail" v-model="newEmail" placeholder="Email Address" required>
                </div>
            </div>
            <div class="form-group row">
                <label for="inputPassword" class="col-sm-3 col-form-label">Password</label>
                <div class="col-sm-7">
                    <input type="password" class="form-control" id="inputPassword" v-model="newPassword" placeholder="Password" required>
                </div>
            </div>
            <div class="form-group row">
                <label for="inputLocation" class="col-sm-3 col-form-label">Location</label>
                <div class="col-sm-7">
                    <input type="text" class="form-control" id="inputLocation" v-model="newLocation" placeholder="Location (optional)">
                </div>
            </div>
            <div class="form-group row" v-if="errorFlag" style="color: red;">
                {{ error }}
            </div>
            <div class="form-group row">
                <button @click="createNewUser()" type="submit" class="btn btn-primary">Create Account</button>
                <router-link @click.native="logOut()" :to="{ name: 'projects'}"><button type="submit" class="btn btn-primary">Cancel</button></router-link>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                error: "",
                errorFlag: false,

                newUsername: "",
                newEmail: "",
                newPassword: "",
                newLocation: "",

                cUsername: "",
                cPassword: "",

            }
        },
        mounted: function () {
        },
        methods: {
            createNewUser: function () {
                this.error = "Error with Account Creation:";
                this.errorFlag = false;

                if (!this.newUsername) {
                    this.error = this.error + "\n\n Please enter a username.";
                    this.errorFlag = true;
                    return;
                }
                if (!this.newPassword) {
                    this.error = this.error + "\n\n Please enter a password.";
                    this.errorFlag = true;
                    return;
                }
                let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (!this.newEmail || !emailRegex.test(this.newEmail)) {
                    this.error = this.error + "\n\n Please enter a valid email address.";
                    this.errorFlag = true;
                    return;
                }

                this.$http.post("http://localhost:4941/api/v2/users", {
                    username: this.newUsername,
                    email: this.newEmail,
                    password: this.newPassword,
                    location: this.newLocation
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(function (response) {
                        this.logInAfterCreation();
                    }, function (error) {
                        this.error = "There was an error creating your account. Try using a different username and/or email.";
                        this.errorFlag = true;
                    });
            },
            logInAfterCreation: function(){
                this.errorFlag = false;
                this.$http.post("http://localhost:4941/api/v2/users/login", {}, {
                    params: {
                        username: this.newUsername,
                        email: this.newUsername,
                        password: this.newPassword
                    }
                }).then(function(response){
                    this.$store.commit('changeId', response.data.id);
                    this.$store.commit('changeToken', response.data.token);
                    this.cUsername = "";
                    this.cPassword = "";
                }, function(error) {
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
                }, function(error) {
                    this.error = error;
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