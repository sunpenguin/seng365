<template>
    <div>
        <nav class="navbar navbar-inverse">
            <div class="container-fluid">
                <div class="navbar-header">
                    <router-link class="navbar-brand" :to="{ name: 'projects' }">Crowdfunding Website</router-link>
                </div>
                <ul class="nav navbar-nav">
                    <li><router-link :to="{ name: 'projects' }">Projects</router-link></li>
                    <li><router-link :to="{ name: 'user' }">User</router-link></li>
                </ul>
                <ul class="nav navbar-nav navbar-right">
                    <li><router-link :to="{ name: 'createUser' }"><span class="glyphicon glyphicon-user"></span> Create Account</router-link></li>
                    <li class="active"><router-link :to="{ name: 'logIn' }"><span class="glyphicon glyphicon-log-in"></span> Login</router-link></li>
                </ul>
            </div>
        </nav>
        <div v-if="errorFlag" style="color: red;">
            {{ error }}
        </div>

        <div id="newUserForm">
            <br />
            Username or Email <input type="text" v-model="newUsername" placeholder="Username/Email">
            <br />
            Password <input type="password" v-model="newPassword" placeholder="Password">
            <br />
            <button @click="logIn()">Log In</button>
            <button @click="logOut()">Log Out</button>
            <br />
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
                newPassword: ""
            }
        },
        mounted: function () {
        },
        methods: {
            logIn: function(){
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