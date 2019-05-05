<template>
    <v-app dark>
        <v-content>
            <v-container align-content-center>
                <positions-table></positions-table>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
    import PositionsTable from "./components/PositionsTable.vue";

    export default {
        name: "App",
        components: {
            PositionsTable
        }
    };
</script>
