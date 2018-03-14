<template>
  <div id="main">
    <v-header></v-header>
    <router-view></router-view>
  </div>
</template>

<script>
    import Header from './../../components/header.vue'
    export default {
        data () {
            return {
                headMsg:　'This page is Home page'
            }
        },
        computed: {
          // 计算属性
          // some code here...  
        },
        methods: {


        },
        components: {
            'v-header': Header
        }
    }
</script>

<style>
    #main {
        height: 100%;
    }
</style>
