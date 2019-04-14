import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { split } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import Vue from "vue";
import VueApollo from "vue-apollo";
import Vuetify from "vuetify";
import App from "./App.vue";
import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader

import DatetimePicker from "vuetify-datetime-picker";
import VueMoment from 'vue-moment';

Vue.config.productionTip = false;

const httpLink = new HttpLink({
    uri: "http://localhost:8080/graphql"
});

const wsLink = new WebSocketLink({
    uri: "ws://localhost:8080/graphql",
    options: {
        reconnect: true
    }
});

const link = split(
    ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === "OperationDefinition" && operation === "subscription";
    },
    wsLink,
    httpLink
);

const apolloClient = new ApolloClient({
    link,
    cache: new InMemoryCache(),
    connectToDevTools: true
});

const apolloProvider = new VueApollo({
    defaultClient: apolloClient
});

Vue.use(VueApollo);
Vue.use(Vuetify);

Vue.use(DatetimePicker);
Vue.use(VueMoment);

new Vue({
    apolloProvider,
    render: h => h(App)
}).$mount("#app");
