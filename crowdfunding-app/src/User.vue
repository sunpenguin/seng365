<template>
    <div>
        <nav class="navbar navbar-inverse">
            <div class="container-fluid">
                <div class="navbar-header">
                    <router-link class="navbar-brand" :to="{ name: 'projects' }">Crowdfunding Website</router-link>
                </div>
                <ul class="nav navbar-nav">
                    <li><router-link :to="{ name: 'projects' }">Projects</router-link></li>
                    <li class="active"><router-link :to="{ name: 'user' }">User</router-link></li>
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

        <div id="user">

            <br /><br />

            <p>AND HIS NAME IS...</p>
            <h1>JOHN CENA!</h1>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                error: "",
                errorFlag: false,
            }
        },
        mounted: function() {
        },
        methods: {
        }
    }
</script>