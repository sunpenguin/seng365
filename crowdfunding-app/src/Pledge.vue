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

                        <li class="dropdown">
                            <router-link :to="{ name: 'pledge' }" class="dropdown-toggle" data-toggle="dropdown"><b>Login</b><span class="caret"></span></router-link>

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

        <div v-if="this.$store.state.userId > 0">
            <div class="form-group">
                <label for="amount">Amount</label>
                <input type="number" class="form-control" id="amount" aria-describedby="amountHelp" v-model="amount" placeholder="Enter amount">
                <small id="amountHelp" class="for-text text-muted">Enter the amount in dollars.</small>
            </div>
            <div class="form-check">
                <label class="form-check-label">
                    Anonymous donation:
                    <input type="checkbox" v-model="anonymous" class="form-check-input">
                </label>
            </div>
            <div class="form-group">
                <label for="amount">Card Number</label>
                <input type="number" class="form-control" id="amount" aria-describedby="amountHelp" placeholder="Enter card number">
                <small id="amountHelp" class="for-text text-muted">Card Number.</small>

                <label for="name">Name</label>
                <input type="text" class="form-control" id="name" aria-describedby="nameHelp" placeholder="Enter card name">
                <small id="nameHelp" class="for-text text-muted">The name on the card.</small>

                <label for="expiry">Expiry Date</label>
                <input type="date" class="form-control" id="expiry" aria-describedby="expiryHelp" placeholder="Enter card name">
                <small id="expiryHelp" class="for-text text-muted">The expiry date of the card.</small>
            </div>
            <div class="form-group">
                <button type="submit" class="btn btn-primary" @click="pledge()">Pledge</button>
            </div>
        </div>

        <div v-else>
            PLEASE LOG IN YOU TOMATO PIE!
        </div>

        <div v-if="errorFlag">
            {{ error }}
        </div>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                error: "",
                errorFlag: false,

                amount: "121212",
                anonymous: true,
                token: "accept",

                cUsername: "",
                cPassword: ""
            }
        },
        mounted: function (){
        },
        methods: {
            pledge: function(){
                this.errorFlag = false;
                this.$http.post("http://localhost:4941/api/v2/projects/" + this.$route.params.projectId + "/pledge", {
                    id: this.$store.state.userId,
                    amount: this.amount * 100,
                    anonymous: this.anonymous,
                    card: {
                        authToken: this.token
                    }
                }, {
                    headers: {
                        'X-Authorization': this.$store.state.authenticationToken,
                        'Content-Type': 'application/json'
                    }
                }).then(function(response){
                    this.error = "Successfully pledged your amount.";
                    this.amount = "";
                    this.anonymous = false;
                    this.errorFlag = true;
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