<template>
    <div>
        Home Page
        <div v-if="errorFlag" style="color: red;">
            {{ error }}
        </div>

        <br />
        <router-link :to="{ name: 'users' }">Users</router-link>
        <div v-if="$route.params.projectId">
            <div id="project">
                <router-link :to="{ name: 'projects' }">Back to all Projects</router-link>
                <br /><br />
                <table>
                    <tr>
                        <td>{{ $route.params.projectId }}</td>
                        <td>{{ getSingleProject($route.params.projectId).title }}</td>
                        <td>{{ singleProject }}</td>
                    </tr>
                </table>
            </div>
        </div>

        <div v-else>
            <br />
            <input type="search" v-model="searchString" placeholder="Search Projects" />
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
                number: 5
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
                        this.filteredProjects = response.data;
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