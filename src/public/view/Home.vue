<template>
  <div id="home">
    <!-- <v-header></v-header> -->
    <v-aside></v-aside>
    <div class="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import header from "../../components/header";
import aside from "../../components/aside.vue";
export default {
  data() {
    return {
      headMsg: "This page is Home page"
    };
  },
  computed: {
    // 计算属性
    // some code here...
  },
  methods: {},
  components: {
    // 'v-header': header,
    "v-aside": aside
  }
};
</script>

<style>
#home {
  height: 100%;
}
</style>
