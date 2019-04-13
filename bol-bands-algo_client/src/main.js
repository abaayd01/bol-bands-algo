import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import { createProvider } from './vue-apollo';
import Vuetify from 'vuetify';
import DatetimePicker from 'vuetify-datetime-picker';
import 'vuetify-datetime-picker/src/stylus/main.styl';

Vue.config.productionTip = false;

new Vue({
    apolloProvider: createProvider(),
    render: h => h(App)
}).$mount('#app');

Vue.use(Vuetify);
Vue.use(DatetimePicker);
