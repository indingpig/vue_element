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
      <el-container>
        <el-header>
          <Header></Header>
        </el-header>
      </el-container>
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
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
