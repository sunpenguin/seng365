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
            <input type="text" v-model="username" placeholder="Username">
            {{ username }}
            <br />
            <input type="password" v-model="password" placeholder="Password">
            {{ password }}
            <br />
            <input type="email" v-model="email" placeholder="Email Address">
            {{ email }}
            <br />
            <input type="text" v-model="location" placeholder="(optional)">
            {{ location }}
            <br />
            <button @click="createNewUser()">Create New Account</button>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                error: "",
                errorFlag: false,
                newUser: {
                    username: "",
                    email: "",
                    password: "",
                    location: ""
                },
                user: ""

            }
        },
        mounted: function() {
        },
        methods: {
            createNewUser: function(){
//                this.error = "Error with Account Creation:";
//                this.errorFlag = false;
//                if(!this.username){
//                    this.error = this.error + "\n\n Please enter a username.";
//                    this.errorFlag = true;
//                }
//                if(!this.password){
//                    this.error = this.error + "\n\n Please enter a password.";
//                    this.errorFlag = true;
//                }
//                let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//                if(!this.email || !emailRegex.test(this.email)){
//                    this.error = this.error + "\n\n Please enter a valid email address.";
//                    this.errorFlag = true;
//                }
                this.$http.post("http://localhost:4941/api/v2/users", this.newUser, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(function (response) {
                        this.user = response.data;
                    }, function (error) {
                        this.error = error;
                        this.errorFlag = true;
                    });
            }

        }
    }
</script>