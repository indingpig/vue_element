import Vue from 'vue';
// 引入vue路由
import VueRouter from 'vue-router';
// 引入路由模块
import login from './login'
import home from './home'
import user from './user'


// 安装路由

Vue.use(VueRouter);

//配置路由
const routes = [
    {
        path: '',
        redirect: '/home',
    },
    ...login,
    ...home,
    ...user,
];

// 创建路由对象
const router = new VueRouter({
    routes
});


// 暴露router
export default router;