<template>
    <div class="login-wrap" :style="{background:'url('+ imgUrl +')'}">
        <div class="login">
            <form action="">
                haha<input type="text">
            </form>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    export default {
        data () {
            return {
                imgUrl: '',
            }
        },
        methods: {
            getImgData() {
                var self = this
                axios.get('/api/query/picture')
                .then(function(res) {
                    self.imgUrl = res.data
                })
                .catch(function(error) {
                    console.log(error)
                })
            }
        },
        mounted: function() {
            this.getImgData();
        }
    }
</script>

<style>
    .login-wrap {
        width:100%;
        height: 100%;
        
    }
    .login-wrap img {
        width: 100%;
        height: 100%;
    }
</style>
