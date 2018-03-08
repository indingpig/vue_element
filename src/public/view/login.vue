<template>
    <div class="login-wrap">
        <div class="login-wrap-background" :style="{background:'url('+ imgUrl +')', opacity: opacityNum}">
        </div>
        <div class="login">
            <button @click="previous">Previous image</button>
            <button @click="next">Next image</button>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import backImage from './pic2460_017.jpg'
    export default {
        data () {
            return {
                imgUrl: '',
                day: 0,
                opacityNum: 0
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
                    self.timer = setTimeout(function(){
                        self.imgUrl = res.data;
                        self.opacityNum = 1;
                        clearTimeout(self.timer)
                    }, 500)
                })
                .catch(function(error) {
                    console.log(error)
                })
            },
            previous() {
                this.opacityNum = 0;
                this.day += 1;
                this.getImgData();
            },
            next() {
                this.opacityNum = 0;
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
        width: 100%;
        height: 100%;
        background-color: #333;
    }
    .login-wrap-background{
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        transition: opacity 0.5s;
    }
    .login {
        position: relative;
        z-index: 1;
    }
</style>
