<template>
  <div>
      <div class="header">
        {{msg}}
      </div>
  </div>
</template>

<script>
    export default {
        data () {
            return {
                msg:　'头部111'
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
