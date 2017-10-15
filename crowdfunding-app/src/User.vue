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
                        <li><router-link :to="{ name: 'createUser' }"><span class="glyphicon glyphicon-user"></span> Create Account</router-link></li>

                        <li class="dropdown">
                            <router-link :to="{ name: 'user' }" class="dropdown-toggle" data-toggle="dropdown"><b>Login</b><span class="caret"></span></router-link>

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

        <div id="user">
            <br />

            <p>AND HIS NAME IS...</p>
            <h1>JOHN CENA!</h1>

            <div class="container">
                <div class="form-group row">
                    <label for="inputUsername" class="col-sm-3 col-form-label">Username</label>
                    <div class="col-sm-7">
                        <input type="text" class="form-control" id="inputUsername" v-model="currentUsername" placeholder="Username" required readonly>
                    </div>
                </div>
                <div class="form-group row">
                    <label for="inputEmail" class="col-sm-3 col-form-label">Email Address</label>
                    <div class="col-sm-7">
                        <input type="email" class="form-control" id="inputEmail" v-model="currentEmail" placeholder="Email Address" required>
                    </div>
                </div>
                <div class="form-group row">
                    <label for="inputPassword" class="col-sm-3 col-form-label">Password</label>
                    <div class="col-sm-7">
                        <input type="password" class="form-control" id="inputPassword" v-model="currentPassword" placeholder="Password" required>
                    </div>
                </div>
                <div class="form-group row">
                    <label for="inputLocation" class="col-sm-3 col-form-label">Location</label>
                    <div class="col-sm-7">
                        <input type="text" class="form-control" id="inputLocation" v-model="currentLocation" placeholder="Location (optional)">
                    </div>
                </div>
                <div class="form-group row">
                    <button @click="editAccount()" type="submit" class="btn btn-primary">Edit Account</button>
                    <router-link :to="{ name: 'projects'}"><button type="submit" class="btn btn-primary">Back to Projects</button></router-link>
                </div>
                <div class="form-group row" v-if="errorFlag" style="color: red;">
                    {{ error }}
                </div>
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

                currentUsername: "",
                currentEmail: "",
                currentPassword: "",
                currentLocation: "",

                cUsername: "",
                cPassword: ""
            }
        },
        mounted: function() {
            this.getUserDetails();
        },
        methods: {
            getUserDetails: function(){
                this.$http.get("http://localhost:4941/api/v2/users/" + this.$store.state.userId, {
                    headers: {
                        'X-Authorization': this.$store.state.authenticationToken
                    }
                })
                    .then(function(response){
                        this.currentUsername = response.data.username;
                        this.currentEmail = response.data.email;
                        this.currentLocation = response.data.location;
                    }, function(error){
                        this.error = error;
                        this.errorFlag = true;
                    })
            },
            editAccount: function(){
                this.errorFlag = false;

                if (!this.currentPassword) {
                    this.error = "Please enter a password.";
                    this.errorFlag = true;
                    return;
                }
                let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (!this.currentEmail || !emailRegex.test(this.currentEmail)) {
                    this.error = "Please enter a valid email address.";
                    this.errorFlag = true;
                    return;
                }

                this.$http.put("http://localhost:4941/api/v2/users/" + this.$store.state.userId, {
                    username: this.currentUsername,
                    email: this.currentEmail,
                    password: this.currentPassword,
                    location: this.currentLocation
                }, {
                    headers: {
                        'X-Authorization': this.$store.state.authenticationToken
                    }
                })
                    .then(function(response){
                        this.error = "Account details successfully edited.";
                        this.errorFlag = true;
                    }, function(error){
                        this.error = "Error editing your account details. Please try again.";
                        this.errorFlag = true;
                    })
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