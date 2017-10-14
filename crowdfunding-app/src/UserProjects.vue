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
                        <li><router-link @click.native="logOut()" :to="{ name: 'projects'}" ><span class="glyphicon glyphicon-log-out"></span> Log Out</router-link></li>
                    </ul>
                </div>

                <div v-else>
                    <ul class="nav navbar-nav navbar-right">
                        <li><router-link :to="{ name: 'createUser' }"><span class="glyphicon glyphicon-user"></span> Create Account</router-link></li>

                        <li class="dropdown">
                            <router-link :to="{ name: 'userProjects' }" class="dropdown-toggle" data-toggle="dropdown"><b>Login</b><span class="caret"></span></router-link>

                            <ul class="dropdown-menu">
                                <li>
                                    <div class="form-group">
                                        <label for="usernameEmailUserProjects">Username or Email</label>
                                        <input type="text" class="form-control" id="usernameEmailUserProjects" v-model="cUsername" placeholder="Username/Email">
                                    </div>
                                    <div class="form-group">
                                        <label for="passwordUserProjects">Password</label>
                                        <input type="password" class="form-control" id="passwordUserProjects" v-model="cPassword" placeholder="Password">
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

        <p>{{ error }}</p>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                error: "haHAA",
                errorFlag: false,
                cUsername: "",
                cPassword: ""
            }
        },
        methods: {
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