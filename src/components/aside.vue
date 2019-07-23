<template>
  <div id="aside">
    <div class="aside">
      <ul>
        <li v-for="val in liList" :key="val.linkName">
          <router-link :to="val.path">{{val.linkName}}</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      liList: [
        { path: "/main/home/addShop", linkName: "新增店铺" },
        { path: "/main/home/addMenu", linkName: "新增菜单" },
        { path: "/main/home/testPage", linkName: "测试页面" },
        { path: "/main/home/form", linkName: "表单" }
      ]
    };
  },
  methods: {}
};
</script>

<style>
#aside {
  height: 100%;
  width: 10%;
  float: left;
}
.aside {
  height: 100%;
  /* float: left; */
  background: plum;
  width: 100%;
}
.main {
  float: left;
  width: 90%;
  height: 100%;
  padding: 10px;
}
</style>
