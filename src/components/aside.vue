<template>
  <div id="aside">
      <div class="aside">
          <ul>
              <li v-for="(val, key) in liList" :key="key">
                  <router-link to="home/addMenu">{{val.linkName}}</router-link>
              </li>
          </ul>
      </div>
      <div class="main">
          11111
        <router-view></router-view>
      </div>
  </div>
</template>

<script>
    export default {
        data () {
           return {
                liList: [
                    {paht: 'addMenu', linkName: '新增菜单'}
                ]
           }
        },
        methods: {

        }
    }
</script>

<style>
    #aside {
        height: 100%;
        width: 100%;
    }
    .aside {
        height: 100%;
        float: left;
        background: plum;
        width: 10%;
    }
    .main {
        float: left;
        width: 90%;
        height: 100%;
    }
</style>
