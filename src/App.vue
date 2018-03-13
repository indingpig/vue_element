<template>
  <div id="app">
    <v-header></v-header>
    <router-view></router-view>
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
    'v-header': Header
  }
}
</script>

<style>
  #app {
    height: 100%;
    overflow: hidden;
  }
</style>
