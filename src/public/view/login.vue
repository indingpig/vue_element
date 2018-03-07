<template>
    <div class="login-wrap">
        <div class="login-wrap-background" :style="{background:'url('+ imgUrl +')'}" :class="{'image-change':imageChage, 'image-change-after':imageChageAfter}">
            <div class="login">
                <button @click="previous">Previous image</button>
                <button @click="next">Next image</button>
            </div>
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
                imageChage: false,
                imageChageAfter: false
            }
        },
        methods: {
            getImgData() {
                // this.imgUrl = backImage;
                // this.imageChage = true;
                var self = this;
                axios.get('/api/query/picture',{
                    params: {
                        day: self.day
                    }
                })
                .then(function(res) {
                    self.timer = setTimeout(function(){
                        self.imgUrl = res.data;
                        // self.imageChage = false;
                        clearTimeout(self.timer)
                    }, 1000)
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
        background-color: #333;
    }
    .login-wrap-background{
        width: 100%;
        height: 100%;
        opacity: 0;
        transition: opacity 0.5s;
    }
    /* .image-change {
        background: #333333 !important;
    }
    .image-change-after{
        background: #ffffff !important;
    }
    .test {
        background: #ffffff;
        transition: all .5s;
    } */
    /* @keyframes showBtn{
        10%{
            background:-webkit-radial-gradient(Circle,#1E7AA5 28%, #2287B7 30%, #2287B7 48%,#208FC1 60%); 
            background:radial-gradient(Circle,#1E7AA5 28%, #2287B7 30%, #2287B7 48%,#208FC1 60%); 
        }
        20%{
            background:-webkit-radial-gradient(Circle,#1E7AA5 32%, #2287B7 34%, #2287B7 52%,#208FC1 60%);
            background:radial-gradient(Circle,#1E7AA5 32%, #2287B7 34%, #2287B7 52%,#208FC1 60%); 
        }
        40%{
            background:-webkit-radial-gradient(Circle,#1E7AA5 34%, #2287B7 36%, #2287B7 54%,#208FC1 60%);
            background:radial-gradient(Circle,#1E7AA5 34%, #2287B7 36%, #2287B7 54%,#208FC1 60%);
        }
        60%{
            background:-webkit-radial-gradient(Circle,#1E7AA5 36%, #2287B7 38%, #2287B7 56%,#208FC1 60%);
            background:radial-gradient(Circle,#1E7AA5 36%, #2287B7 38%, #2287B7 56%,#208FC1 60%);
        }
        80%{
            background:-webkit-radial-gradient(Circle,#1E7AA5 38%, #2287B7 40%, #2287B7 58%,#208FC1 60%);
            background:radial-gradient(Circle,#1E7AA5 38%, #2287B7 40%, #2287B7 58%,#208FC1 60%);
        }
        100%{
            background:-webkit-radial-gradient(Circle,#1E7AA5 40%, #2287B7 42%, #2287B7 60%,#208FC1 60%);
            background:radial-gradient(Circle,#1E7AA5 40%, #2287B7 42%, #2287B7 60%,#208FC1 60%);
        }
    } */
</style>
