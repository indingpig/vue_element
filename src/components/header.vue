<template>
  <div>
      <div class="header float-fix">
        <el-dropdown trigger="click" class="header-float">
            <el-button>
                {{currentUser}}<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item >
                    <p @click="logout">退出</p>
                </el-dropdown-item>
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
    import {_} from 'vue-underscore';
    export default {
        data () {
            return {
                routerList: [
                    {path: '/login', linkName: "登录页"},
                    {path: 'home', linkName: '首页'},
                    {path: 'music', linkName: '音乐'}
                ],
                currentUser: '',
                userImage: userImage
            }
        },
        methods: {
            logout() {
                sessionStorage.removeItem('currentUser');
                this.$router.push({path: '/login'})
            }
        },
        mounted() {
            
        },
        created() {
            let userName = JSON.parse(sessionStorage.getItem('currentUser')).userName
            if (userName) {
                let i = _.findIndex(this.routerList, (e)=>{
                    return e.linkName == '登录页'
                })
                this.routerList.splice(0,1)
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
