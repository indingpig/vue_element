<template>
  <div>
      <h2>
        {{user.name}}
      </h2>
  </div>
</template>

<script>
    import axios from 'axios';
    export default {
        data () {
            return {
                user:　{
                    name: "default name"
                }
            }
        },
        computed: {
          // 计算属性
          // some code here...  
        },
        methods: {
            query () {
                let userlist = 'userlist';
                axios.get('/api/query/users', {
                    params: {
                        userlist,
                    }
                })
                .then(function (data) {
                    console.log(data)
                })
                .catch(function (error) {
                    console.log(error)
                })
            }
        },
        mounted: function () {
            this.query()
        }
    }
</script>