import Vue from 'vue';
// 引入router文件夹
import router from './router';
// 引入主样式;
import './public/css/index.css'
// 引入element-ui
import ElementUi from 'element-ui';
// 引入underscore 
import underscore from 'vue-underscore';
// webix UI
import './webix/webix.css';
import webix from './webix/webix';
import vueWebix from 'vue-webix';
// 引入element-ui样式;
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue';

Vue.use(ElementUi);
Vue.use(underscore);
// Vue.use(webix);

new Vue({
  el: '#app',
  render: h => h(App),
  router
})
