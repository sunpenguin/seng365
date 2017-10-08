<template>
    <div>
        Home Page
        <div v-if="errorFlag" style="color: red;">
            {{ error }}
        </div>

        <div v-if="$route.params.projectId">
            <div id="project">
                <router-link :to="{ name: 'projects' }">Back to all Projects</router-link>
                <br /><br />
                <table>
                    <tr>
                        <td>{{ $route.params.projectId }}</td>
                        <td>{{ getSingleProject($route.params.projectId).title }}</td>
                    </tr>
                </table>
            </div>
        </div>

        <div v-else>
            <div id="projectsList">
                <ul>
                    <li class="projectSummary" v-for="project in projects">
                        <img v-bind:src="'http://localhost:4941/api/v2/projects/' + project.id + '/image'" />
                        <p>{{ project.title }}</p>
                        <p>{{ project.subtitle }}</p>
                        <p><router-link :to="{ name: 'project', params: { projectId: project.id }}">View Details</router-link></p>
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
                error: "",
                errorFlag: false,
                projects: []
            }
        },
        mounted: function (){
            this.getProjects();
        },
        methods: {
            getProjects: function(){
                this.$http.get("http://localhost:4941/api/v2/projects")
                    .then(function (response) {
                        this.projects = response.data;

                        for (let i = 1; i < 5; i++) {
                            this.projects.push(this.projects[0]);
                        }
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
            }
        }
    }
</script>