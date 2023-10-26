import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/style.css'
import './assets/script/binarypack.js'
import './assets/script/binary.js'
import './assets/script/worker/resampler.js'
import './assets/script/worker/resampler-worker.js'
import './assets/script/script.js'

import 'primevue/resources/themes/lara-light-teal/theme.css'
import 'primevue/resources/primevue.min.css'
import { Icon } from '@iconify/vue';

import PrimeVue from 'primevue/config';
const app = createApp(App)

import Card from 'primevue/card';
import Fieldset from 'primevue/fieldset';
app.use(PrimeVue);
app.component('Card', Card)
app.component('Fieldset', Fieldset)

app.component('Icon', Icon)

app.config.globalProperties.window = window

app.use(store).use(router).mount('#app')