<template>
    <div class="login-wrap">
        <div class="login-wrap-background" :style="{'background-image':'url('+ imgUrl +')', opacity: opacityNum}">
        </div>
        <div class="login">
            <div class="login-top">
                <div>{{loaginMessage}}</div>
            </div>
            <div>
                <el-form :model="loginForm"
                    :rules="loginRules"
                    ref="loginFormRules">
                    <el-form-item prop="userName">
                        <el-input
                            placeholder="请输入用户名或者邮箱"
                            v-model="loginForm.userName"
                            clearable>
                        </el-input>
                    </el-form-item>
                    <!-- <div class="userName">
                        
                    </div> -->
                    <el-form-item prop="password">
                        <el-input
                            placeholder="请输入密码"
                            v-model="loginForm.password"
                            clearable
                            type="password">
                        </el-input>
                    </el-form-item>
                    <!-- <div class="password">
                        
                    </div> -->
                </el-form>
            </div>
        </div>
        <div class="button-group floatfix">
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
                opacityNum: 0,
                loginForm: {
                    userName: ''
                },
                loaginMessage: '欢迎来到海德鲁大陆',
                loginRules: {
                    userName: [
                        {
                            required: true,
                            message: '请补全信息',
                            targger: 'blur' 
                        }
                    ],
                    password: [
                        {
                            required: true,
                            message: '请补全信息',
                            targger: 'blur'
                        }
                    ]
                }
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
                if (this.day >=7 ) {
                    return
                }
                this.opacityNum = 0;
                this.day += 1;
                this.getImgData();
            },
            next() {
                if (this.day <= -1) {
                    return
                }
                this.opacityNum = 0;
                this.day -= 1;
                this.getImgData();
            }
        },
        mounted() {
            // this.getImgData();
        },
        created() {
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
        background-size: cover
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
    /* 登录表单 */
    .login {
        position: absolute;
        margin: auto;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        width: 400px;
        height: 300px;
        border-radius: 3%;
        z-index: 1;
        overflow: hidden;
        box-shadow: 0px 5px 20px rgba(0,0,0,.5);
        padding: 20px;
    }
    .login::after {
        width: 400px;
        height: 300px;
        top: 0;
        content: '';
        position: absolute;
        filter: blur(30px);
        background: rgba(255,255,255,.6);
        z-index: -1;
    }
    .login-top {
        text-align: center;
        font-size: 24px;
        padding: 10px;
        margin-bottom: 20px;
    }
    .password {
        margin-top: 10px;
    }
</style>
