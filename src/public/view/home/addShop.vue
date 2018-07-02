<template>
  <div>
      {{msg}}
      <div @click="test">
          点我试试
      </div>
  </div>
</template>

<script>
    export default {
        data() {
            return {
                msg: '增加店铺'
            }
        },
        methods: {
            test(e){
                e.preventDefault();
            }
        }
    }
</script>