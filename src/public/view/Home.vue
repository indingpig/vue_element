<template>
  <div>
    <v-header></v-header>
  </div>
</template>

<script>
    import header from '../../components/header'
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
            'v-header': header,
        }
    }
</script>