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
                        <li><router-link :to="{ name: 'user' }"><span class="glyphicon glyphicon-user"></span> My Account</router-link></li>
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
        <div class="container">
            <h2>Create New Project</h2>
            <div class="form-group row">
                <label for="inputTitle" class="col-sm-3 col-form-label">Title</label>
                <div class="col-sm-7">
                    <input type="text" class="form-control" id="inputTitle" v-model="newTitle" placeholder="Title" required>
                </div>
            </div>
            <div class="form-group row">
                <label for="inputSubtitle" class="col-sm-3 col-form-label">Subtitle</label>
                <div class="col-sm-7">
                    <input type="text" class="form-control" id="inputSubtitle" v-model="newSubtitle" placeholder="Subtitle" required>
                </div>
            </div>
            <div class="form-group row">
                <label for="inputDescription" class="col-sm-3 col-form-label">Description</label>
                <div class="col-sm-7">
                    <input type="text" class="form-control" id="inputDescription" v-model="newDescription" placeholder="Description" required>
                </div>
            </div>
            <div class="form-group row">
                <label for="inputTarget" class="col-sm-3 col-form-label">Target ($)</label>
                <div class="col-sm-7">
                    <input type="number" class="form-control" id="inputTarget" v-model="newTarget" placeholder="Target" required>
                </div>
            </div>
            <div class="form-group row">
                <label for="inputImage" class="col-sm-3 col-form-label">Upload Project Image (optional)</label>
                <div class="col-sm-7">
                    <input type="file" accept="image/jpeg,image/png" id="inputImage" @change="onImageChange($event)">
                </div>
            </div>
            <div class="form-group row">
                <h3>Rewards</h3>
                <ul v-for="reward in getComputedRewards">
                    <li>
                        <label for="inputRewardAmount" class="col-sm-3 col-form-label">Reward Amount ($)</label>
                        <div class="col-sm-7">
                            <input type="number" accept="image/jpeg,image/png" id="inputRewardAmount" v-model="reward.amount">
                        </div>

                        <label for="inputRewardDescription" class="col-sm-3 col-form-label">Reward Description</label>
                        <div class="col-sm-7">
                            <input type="text" accept="image/jpeg,image/png" id="inputRewardDescription" v-model="reward.description">
                        </div>
                    </li>
                </ul>
                <button type="button" @click="removeLastReward()">Remove Last Reward</button>
                <button type="button" @click="addNewReward()">Add New Reward</button>
            </div>

            <div class="form-group row">
                <button @click="createProject()" type="submit" class="btn btn-primary">Create Project</button>
                <router-link :to="{ name: 'myProjects'}"><button type="submit" class="btn btn-primary">Back to My Projects</button></router-link>
            </div>

            <div class="form-group row" v-if="errorFlag" style="color: red;">
                {{ error }}
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
                cPassword: "",

                newTitle: "",
                newSubtitle: "",
                newDescription: "",
                newTarget: 0,
                newImage: "",
                newRewards: [],
                newProjId: 0
            }
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
            onImageChange: function(event){
                this.newImage = event.target.files[0];
            },
            convertRewards: function(){
                for(let i = 0; i < this.newRewards.length; i++){
                    this.newRewards[i].amount = parseInt(this.newRewards[i].amount) * 100;
                }
            },
            createProject: function(){
                this.errorFlag = false;

                if(!this.newTitle){
                    this.error = "Please insert a title.";
                    this.errorFlag = true;
                    return;
                }

                if(!this.newSubtitle){
                    this.error = "Please insert a subtitile.";
                    this.errorFlag = true;
                    return;
                }

                if(!this.newDescription){
                    this.error = "Please insert a description.";
                    this.errorFlag = true;
                    return;
                }

                if(this.newTarget <= 0){
                    this.error = "Please insert a valid target.";
                    this.errorFlag = true;
                    return;
                }

                this.convertRewards();

                this.$http.post("http://localhost:4941/api/v2/projects", {
                    title: this.newTitle,
                    subtitle: this.newSubtitle,
                    description: this.newDescription,
                    target: parseInt(this.newTarget),
                    creators: [
                        {
                            id: this.$store.state.userId
                        }
                    ],
                    rewards: this.newRewards
                }, {
                    headers: {
                        'X-Authorization': this.$store.state.authenticationToken,
                        'Content-Type': 'application/json'
                    }
                }).then(function(response){
                    this.newProjId = response.body.id;
                    this.includeImage();
                }, function(error){
                    this.error = error;
                    this.errorFlag = true;
                })
            },
            includeImage: function(){
                this.$http.put("http://localhost:4941/api/v2/projects/" + this.newProjId + "/image", this.newImage, {
                    headers: {
                        'Content-Type': 'image/png',
                        'X-Authorization': this.$store.state.authenticationToken
                    }
                }).then(function(response){
                    this.getSingleProjectDetails(this.$route.params.projectId);
                    this.$router.push({ name: 'myProjects' });
                    this.newImage = "";
                }, function(error){
                    this.error = error;
                    this.errorFlag = true;
                });
            },
            addNewReward: function() {
                this.newRewards.push({
                    amount: 0,
                    description: ""
                });
            },
            removeLastReward: function() {
                this.newRewards.pop();
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
        },
        computed: {
            getComputedRewards: function(){
                if(this.newRewards.length < 1) {
                    this.newRewards.push({
                        amount: 0,
                        description: ""
                    })
                }
                return this.newRewards;
            }
        }
    }
</script>