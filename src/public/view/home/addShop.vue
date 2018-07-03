<template>
  <div>
      {{msg}}
      <div>
          <webix-ui :config='ui'/>
      </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: "增加店铺",
      ui: {
        cols: [
          {
            view: "calendar"
          },
          {
            view: "list",
            select: true,
          }
        ]
      }
    };
  },
  methods: {
    test(e) {
      e.preventDefault();
    }
  }
};
</script>