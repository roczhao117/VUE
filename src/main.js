import {
    createApp
} from 'vue';
import {
    createPinia
} from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue';
import SIdentify from './views/imgIdentify'; //注意引入路
import router from './router/index';
import Vuex from 'vuex';
import store from './store';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
//import Moment from 'moment'; //导入文件
const pinia = createPinia();
const app = createApp(App);

pinia.use(piniaPluginPersistedstate);


app.use(store).use(pinia).use(router).use(Vuex).use(ElementPlus).use(SIdentify).mount('#app');
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}