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
                        <li><router-link :to="{ name: 'user' }"><span class="glyphicon glyphicon-user"></span> JOHN CENA</router-link></li>
                        <li><router-link :to="{ name: 'myProjects' }"><span class="glyphicon glyphicon-edit"></span> Manage My Projects</router-link></li>
                        <li><router-link @click.native="logOut()" :to="{ name: 'projects'}" ><span class="glyphicon glyphicon-log-out"></span> Log Out</router-link></li>
                    </ul>
                </div>

                <div v-else>
                    <ul class="nav navbar-nav navbar-right">
                        <li><router-link :to="{ name: 'createUser' }"><span class="glyphicon glyphicon-user"></span> Create Account</router-link></li>

                        <li class="dropdown">
                            <router-link :to="{ name: 'createUser' }" class="dropdown-toggle" data-toggle="dropdown"><b>Login</b><span class="caret"></span></router-link>

                            <ul class="dropdown-menu">
                                <li>
                                    <div class="form-group">
                                        <label for="usernameEmailCreateUser">Username or Email</label>
                                        <input type="text" class="form-control" id="usernameEmailCreateUser" v-model="cUsername" placeholder="Username/Email">
                                    </div>
                                    <div class="form-group">
                                        <label for="passwordCreateUser">Password</label>
                                        <input type="password" class="form-control" id="passwordCreateUser" v-model="cPassword" placeholder="Password">
                                    </div>
                                    <div class="form-group">
                                        <button type="submit" @click="logIn()" class="btn btn-primary btn-block">Log in</button>
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

        <div id="newUserForm">
            <br />
            Username <input type="text" v-model="newUsername" placeholder="Username">
            <br />
            Password <input type="password" v-model="newPassword" placeholder="Password">
            <br />
            E-mail <input type="email" v-model="newEmail" placeholder="Email Address">
            <br />
            Location <input type="text" v-model="newLocation" placeholder="(optional)">
            <br />
            <button @click="createNewUser()">Create New Account</button>
            <br />
            <p>{{ userId }}</p>
            <p>{{ currentAuthenticationToken }}</p>
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

                userId: "",
                currentAuthenticationToken: "",
                cUsername: "",
                cPassword: ""

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
                        this.logIn();
                    }, function (error) {
                        this.error = "There was an error creating your account. Try using a different username and/or email.";
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