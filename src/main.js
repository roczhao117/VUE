import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import App from './App.vue';
//import Home from'./components/home.vue'
import SIdentify from './views/imgIdentify';//注意引入路
import router from './router';
import Vuex from 'vuex';
import store from './store';

createApp(App).use(store).use(router).use(Vuex).use(ElementPlus).use(SIdentify).mount('#app');





