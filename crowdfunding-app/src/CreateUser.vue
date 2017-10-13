<template>
    <div>
        <div v-if="errorFlag" style="color: red;">
            {{ error }}
        </div>

        <router-link :to="{ name: 'projects' }">Cancel</router-link>

        <div id="newUserForm">
            <p>AND HIS NAME IS...</p>
            <h1>JOHN CENA!</h1>
            <br />
            <input type="text" v-model="newUsername" placeholder="Username">
            {{ username }}
            <br />
            <input type="password" v-model="newPassword" placeholder="Password">
            {{ password }}
            <br />
            <input type="email" v-model="newEmail" placeholder="Email Address">
            {{ email }}
            <br />
            <input type="text" v-model="newLocation" placeholder="(optional)">
            {{ location }}
            <br />
            <button @click="createNewUser()">Create New Account</button>
            <button @click="logIn()">Log In</button>
            <button @click="logOut()">Log Out</button>
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
                currentAuthenticationToken: ""

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
                this.$http.post("http://localhost:4941/api/v2/users/login", {}, {
                    params: {
                        username: this.newUsername,
                        password: this.newPassword
                    }
                }).then(function(response){
                    this.userId = response.data.id;
                    this.currentAuthenticationToken = response.data.token;
                }, function(error) {
                    this.error = "Error Logging In!";
                    this.errorFlag = true;
                });
            },
            logOut: function() {
                this.errorFlag = false;
                this.$http.post("http://localhost:4941/api/v2/users/logout", {}, {
                    headers: {
                        'X-Authorization': this.currentAuthenticationToken
                    }
                }).then(function(response){
                    this.userId = "";
                    this.currentAuthenticationToken = "";
                }, function(error) {
                    this.error = "Error Logging Out!";
                    this.errorFlag = true;
                });
            }
        }
    }
</script>