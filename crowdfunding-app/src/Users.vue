<template>
    <div>
        <div v-if="errorFlag" style="color: red;">
            {{ error }}
        </div>

        <div id="user">
            <router-link :to="{ name: 'projects' }">Back to Projects</router-link>

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