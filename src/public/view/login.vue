<template>
    <div class="login-wrap" :style="{background:'url('+ imgUrl +')'}">
        <div class="login">
            <button @click="previous">Previous image</button>
            <button @click="next">Next image</button>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    export default {
        data () {
            return {
                imgUrl: '',
                day: 0,
            }
        },
        methods: {
            getImgData() {
                var self = this;
                axios.get('/api/query/picture',{
                    params: {
                        day: self.day
                    }
                })
                .then(function(res) {
                    self.imgUrl = res.data
                })
                .catch(function(error) {
                    console.log(error)
                })
            },
            previous() {
                this.day += 1;
                this.getImgData();
            },
            next() {
                this.day -= 1;
                this.getImgData();
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
</style>
