<template>
    <div>
        <nav class="navbar navbar-inverse">
            <div class="container-fluid">
                <div class="navbar-header">
                    <router-link class="navbar-brand" :to="{ name: 'projects' }">Crowdfunding Website</router-link>
                </div>
                <ul class="nav navbar-nav">
                    <li class="active"><router-link :to="{ name: 'projects' }">Projects</router-link></li>
                    <li><router-link :to="{ name: 'user' }">User</router-link></li>
                </ul>
                <ul class="nav navbar-nav navbar-right">
                    <li><router-link :to="{ name: 'createUser' }"><span class="glyphicon glyphicon-user"></span> Create Account</router-link></li>
                    <li><router-link :to="{ name: 'createUser' }"><span class="glyphicon glyphicon-log-in"></span> Login</router-link></li>
                </ul>
            </div>
        </nav>
        <div v-if="errorFlag" style="color: red;">
            {{ error }}
        </div>

        <div v-if="authToken">
            Yes
        </div>

        <div v-if="$route.params.projectId">
            <div id="project">
                <br /><br />
                <h2>{{ singleProject.title }}</h2>
                <h4>{{ singleProject.subtitle }}</h4>
                <img v-bind:src="'http://localhost:4941/api/v2/projects/' + singleProject.id + '/image'" />

                <br />
                Project created on:
                <p>{{ getDate() }}</p>

                <br />
                Description:
                <p>{{ singleProject.description }}</p>

                <br />
                Target:
                <p>{{ singleProject.target }}</p>

                <br />
                Creator(s):
                <p v-for="creator in getCreators()">
                    {{ creator.username }}
                </p>

                <br />
                Rewards:
                <p v-for="reward in getRewards()">
                    ${{ reward.amount / 100 }}
                    : {{ reward.description }}
                </p>

                <!--Include Recent Pledges and Anonymous Pledges-->
                <br />
                Progress
                <p>Total Pledged: {{ singleProject.progress.currentPledged }}</p>
                <p>Number of Backers: {{ singleProject.progress.numberOfBackers }}</p>
            </div>
        </div>

        <div v-else>
            Search Projects <input type="search" v-model="searchString" placeholder="Search Projects" />
            <br /><br />
            <div id="projectsList">
                <ul>
                    <li class="projectSummary" v-for="project in searchProjects">
                        <img v-bind:src="'http://localhost:4941/api/v2/projects/' + project.id + '/image'" />
                        <h4>{{ project.title }}</h4>
                        <p>{{ project.subtitle }}</p>
                        <router-link @click.native="getSingleProjectDetails(project.id)" :to="{ name: 'project', params: { projectId: project.id }}">View Details</router-link>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                searchString: "",
                error: "",
                errorFlag: false,
                projects: [],
                singleProject: "",
                authToken: ""
            }
        },
        mounted: function (){
            this.getProjects();
        },
        methods: {
            getProjects: function(){
                this.$http.get("http://localhost:4941/api/v2/projects", {params: {open: true}})
                    .then(function (response) {
                        this.projects = response.data;
                    }, function (error) {
                        this.error = error;
                        this.errorFlag = true;
                    });
            },
            getSingleProject: function(id){
                for(let i = 0; i <= this.projects.length; i++){
                    if(this.projects[i].id === id){
                        return this.projects[i];
                    }
                }
            },
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
            loggedIn: function(){
                return this.authToken;
            }
        },
        computed: {
            searchProjects: function(){
                let projects = this.projects,
                   searchString  = this.searchString;

                if (!searchString) {
                    return projects;
                }

                this.number+=1;

                searchString = searchString.trim().toLowerCase();

                projects = projects.filter(function(item){
                    if(item.title.toLowerCase().indexOf(searchString) !== -1){
                        return item;
                    }
                });

                return projects;
            }
        }
    }
</script>