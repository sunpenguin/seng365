<template>
    <div>
        Home Page
        <div v-if="errorFlag" style="color: red;">
            {{ error }}
        </div>

        <div id="projects">
            <table>
                <tr v-for="project in projects">
                    <td> {{ project.imageUri }} </td>
                    <td> {{ project.title }} </td>
                    <td> {{ project.subtitle }} </td>
                    <td><router-link :to="{ name: 'project', params: { project_id: project.id }}">View</router-link></td>
                </tr>
            </table>
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
        mounted: function() {
            this.getProjects();
        },
        methods: {
            getProjects: function() {
                this.$http.get("http://localhost:4941/api/v2/projects")
                    .then(function(response) {
                        this.projects = response.data;
                        <!-- This is for duplicating data to check how large amounts of projects look. -->
                        for (let i = 1; i < 16; i++) {
                            this.projects.push(this.projects[0]);
                        }
                    }, function(error) {
                        this.error = error;
                        this.errorFlag = true;
                    });
            }
        }
    }
</script>