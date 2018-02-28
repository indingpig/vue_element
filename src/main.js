import Vue from 'vue';
// 引入router文件夹
import router from './router';
// 引入主样式;
import './public/css/index.css'
// 引入element-ui
import ElementUi from 'element-ui';
// 引入element-ui样式;
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue';

Vue.use(ElementUi)

new Vue({
  el: '#app',
  render: h => h(App),
  router
})
