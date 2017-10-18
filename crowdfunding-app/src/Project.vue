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

        <div class="container-fluid" id="project">
            <div class="row" id="projectTop">
                <h2>{{ singleProject.title }}</h2>
                <h4>{{ singleProject.subtitle }}</h4>
                <br />
                Project created on: {{ getDate() }} by creator(s):
                <ul v-for="creator in getCreators()">
                    <li>{{ creator.username }}</li>
                </ul>
            </div>
            <div class="row">
                <div class="col-lg-7">
                    <img v-bind:src="'http://localhost:4941/api/v2/projects/' + singleProject.id + '/image'" />
                </div>
                <div class="col-lg-2"></div>
                <div class="col-lg-5">
                    <h4>Progress</h4>
                    <b-progress :value="singleProject.progress.currentPledged / 100" :max="singleProject.target / 100"></b-progress>
                    <p>Total Pledged: ${{ singleProject.progress.currentPledged / 100}} out of ${{ singleProject.target / 100 }} </p>
                    <p>Number of Backers: {{ singleProject.progress.numberOfBackers }}</p>

                    <br />
                    <div if v-if="singleProject.open">
                        <button class="btn btn-primary"><router-link :to="{ name: 'pledge', params: { projectId: $route.params.projectId } }">Back this project!</router-link></button>
                    </div>
                    <div v-else>
                        <button class="btn btn-primary" disabled><router-link :to="{ name: 'pledge', params: { projectId: $route.params.projectId } }">Back this project!</router-link></button>
                    </div>

                    <div>
                        <h4>Recent Pledges</h4>
                        <p v-for="pledge in recentPledges()">
                            {{ pledge.username }} pledged ${{ pledge.amount / 100}}!
                        </p>
                    </div>

                </div>
            </div>
            <div class="row">
                <h4>Description</h4>
                <p>{{ singleProject.description }}</p>
            </div>
            <div class="row">
                <h4>Rewards</h4>
                <p v-for="reward in getRewards()">
                    ${{ reward.amount / 100 }}
                    : {{ reward.description }}
                </p>
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
                singleProject: "",
                cUsername: "",
                cPassword: ""
            }
        },
        mounted: function (){
            this.getSingleProjectDetails(this.$route.params.projectId);
        },
        methods: {
            getSingleProjectDetails: function(id){
                this.$http.get("http://localhost:4941/api/v2/projects/" + id)
                    .then(function (response) {
                        this.singleProject = response.data;
                    }, function (error) {
                        this.error = error;
                        this.errorFlag = true;
                    });
            },
            getCreators: function(){
                return this.singleProject.creators;
            },
            getRewards: function(){
                return this.singleProject.rewards;
            },
            getDate: function(){
                let date = new Date(this.singleProject.creationDate);
                return date.toLocaleDateString();
            },
            recentPledges: function(){
                let pledges = this.singleProject.backers;
                let recentPledges = [];
                let finalCount = 0;
                let currentIndex = 0;
                let anonBacker = false;
                while(finalCount < 5){
                    if(currentIndex >= pledges.length){
                        break;
                    }
                    if(pledges[currentIndex].username === "anonymous"){
                        if(!anonBacker ){
                            anonBacker = true;
                            recentPledges.push(this.getAnonBacker(currentIndex));
                            finalCount += 1;
                        }
                    }else{
                        recentPledges.push(pledges[currentIndex]);
                        finalCount += 1;
                    }
                    currentIndex += 1;
                }
                return recentPledges;
            },
            getAnonBacker: function(){
                let pledges = this.singleProject.backers;
                let anonBacker = {
                    id: 0,
                    username: "anonymous",
                    amount: 0
                };
                for(let i = 0; i < pledges.length; i++){
                    if(pledges[i].username === "anonymous"){
                        anonBacker.amount += pledges[i].amount;
                    }
                }
                return anonBacker;
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