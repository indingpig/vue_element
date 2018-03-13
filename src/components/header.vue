<template>
  <div>
      <div class="header">
        <ul>
            <li v-for="(val, index) in routerList" :key="index">
                <router-link :to="val.path">{{val.linkName}}</router-link>
            </li>
        </ul>
      </div>
  </div>
</template>

<script>
    export default {
        data () {
            return {
                msg:　'头部111',
                routerList: [
                    {path: '/home', linkName: '首页'},
                    {path: '/login', linkName: "登录页"}
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
</style>
