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
            queryGet () {
                let params = {
                    collectionName: 'userlist',
                    condition: {
                        sex: 'female'
                    }
                }
                axios.get('/api/query/users', {
                    params
                })
                .then(function (data) {
                    console.log(data)
                })
                .catch(function (error) {
                    console.log(error)
                })
            },
            queryPost () {
                let condition = {
                    sex: 'female'
                };
                axios.post('/api/query/testpost',{
                    collectionName: 'userlist',
                    condition
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
            // this.queryGet();
            this.queryPost()
        }
    }
</script>