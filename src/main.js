import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
//vue-hiprint 的全局样式
import "./style.css";
//------------------
import App from "./App.vue";
import SIdentify from "./views/imgIdentify"; //注意引入路
import router from "./router/index";
import Vuex from "vuex";
import store from "./store";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import * as moment from "moment"; //导入文件
import VuePluginHiPrint from "vue-plugin-hiprint";
import print from 'vue3-print-nb';
const pinia = createPinia();
const app = createApp(App);

pinia.use(piniaPluginPersistedstate);

app
  .use(store)
  .use(pinia)
  .use(router)
  .use(Vuex)
  .use(ElementPlus)
  .use(SIdentify)
  .use(print)
  .use(VuePluginHiPrint)
  .use(moment)
  .mount("#app");
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
