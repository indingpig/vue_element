<template>
  <div>
      <div class="header">
        <ul class="float-fix header-link-wrap">
            <li v-for="(val, index) in routerList" :key="index" class="header-link">
                <router-link :to="val.path">{{val.linkName}}</router-link>
            </li>
        </ul>
        <div class="login-out">
            
        </div>
      </div>
  </div>
</template>

<script>
    export default {
        data () {
            return {
                routerList: [
                    {path: '/login', linkName: "登录页"},
                    {path: 'home', linkName: '首页'},
                ]
            }
        },
        methods: {
            mounted() {
                
            }
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
    .header .header-link-wrap .header-link{
        float: right;
    }
    .header .header-link-wrap .header-link a {
        color: #fff;
        padding: 0 5px;
        display: block;
        box-sizing: border-box;
        border-top: 2px solid transparent;
    }
    .header .header-link-wrap .header-link a:hover {
        border-top: aqua 2px solid;
    }
</style>
