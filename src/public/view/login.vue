<template>
    <div class="login-wrap">
        <div class="login-wrap-background" :style="{background:'url('+ imgUrl +')', opacity: opacityNum}">
        </div>
        <div class="button-group">
            <div>
                <a href="javasctipt:void(0)" @click="previous" class="button-previous"></a>
                <a href="javasctipt:void(0)" @click="next" class="button-next"></a>
            </div>
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
            previous(evt) {
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
    .button-group {
        width: 100%;
        height: 43px;
        position: absolute;
        z-index: 1;
        bottom: 10px;
        overflow: hidden;
    }
    .button-group > diV {
        float: right;
        margin-right: 5%;
    }
    .button-previous, .button-next{
        display: inline-block;
        width: 40px;
        height: 40px;
        background: #666;
        text-decoration: none;
        transition: background .5s;
        opacity: .5;
        position: relative;
    }
    .button-previous:hover, .button-next:hover {
        background: #333;
    }
    .button-previous::after, .button-previous::before,.button-next::after, .button-next::before {
        position:absolute;
        width: 14px;
        border: 1px solid #fff;
        content: '';
        transform: rotateZ(-45deg);
        top: 14px;
        left: 12px;
    }
    .button-previous::after, .button-next::after {
        transform: rotateZ(45deg);
        top: 25px;
    }
    .button-next::before {
        transform: rotate(45deg);
    }
    .button-next::after {
        transform: rotate(-45deg)
    }
</style>
