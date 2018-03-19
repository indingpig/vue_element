<template>
  <div>
      <div class="header float-fix">
        <el-dropdown trigger="click" class="header-float">
            <el-button>
                {{currentUser}}<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>黄金糕</el-dropdown-item>
                <el-dropdown-item>狮子头</el-dropdown-item>
                <el-dropdown-item>螺蛳粉</el-dropdown-item>
                <el-dropdown-item>双皮奶</el-dropdown-item>
                <el-dropdown-item>蚵仔煎</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <ul class="float-fix header-link-wrap">
            <li v-for="(val, index) in routerList" :key="index" class="header-link">
                <router-link :to="val.path">{{val.linkName}}</router-link>
            </li>
        </ul>
      </div>
  </div>
</template>

<script>
    import userImage from './../public/images/user.png';
    export default {
        data () {
            return {
                routerList: [
                    {path: '/login', linkName: "登录页"},
                    {path: 'home', linkName: '首页'},
                ],
                currentUser: '',
                userImage: userImage
            }
        },
        methods: {

        },
        mounted() {
            
        },
        created() {
            let userName = JSON.parse(sessionStorage.getItem('currentUser')).userName
            if (userName) {
                
            }
            this.currentUser = userName;
        },
        computed: {

        }
    }
</script>

<style>
    .header {
        width: 100%;
        height: 50px;
        background-color: #00AAFF;
        text-align: center;
        line-height: 50px;
    }
    .header .header-link-wrap {
        float: right;
    }
    .header .header-float {
        float: right;
    }
    .header .header-link-wrap .header-link{
        float: right;
    }
    .header .header-link-wrap .header-link a {
        color: #fff;
        padding: 0 15px;
        display: block;
        box-sizing: border-box;
        border-top: 2px solid transparent;
        height: 50px;
    }
    .header .header-link-wrap .header-link a:hover {
        border-top: aqua 2px solid;
    }
    .header .login-out .user-img {
        width: 40px;
        height: 40px;
    }
</style>
