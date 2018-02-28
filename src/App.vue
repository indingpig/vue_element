<template>
  <div id="app">
    <div>
      <!-- <el-container>
        <el-header>
          <h1>{{msg}}</h1>
        </el-header>
        <el-main>
          <img src="./assets/logo.png">
          <div>
            <router-link to="/home">点我试试</router-link>
            <router-link to="/user">user界面</router-link>
            <router-view></router-view>
          </div>
        </el-main>
        <el-footer>底部容器</el-footer>
      </el-container> -->
      <Header></Header>
    </div>
  </div>
</template>

<script>
import Header from './components/header';

export default {
  name: 'app',
  data () {
    return {
      msg: 'Vue Test'
    }
  },
  components: {
    Header
  }
}
</script>

<style>

</style>
