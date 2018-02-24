import Vue from 'vue';
import App from './App.vue';
// 引入router文件夹
import router from './router';

new Vue({
  el: '#app',
  render: h => h(App),
  router
})
