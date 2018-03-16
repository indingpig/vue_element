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
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('loginFormRules')">登录</el-button>
                        <el-button @click="dialogVisible = true">注册</el-button>
                    </el-form-item>
                    <div class="error" v-if="errorShow">
                        <p>用户名或者密码错误</p>
                    </div>
                </el-form>
            </div>
        </div>
        <!-- dialog 注册弹出框 -->
        <div class="sign-up">
            <el-dialog
                title="欢迎注册"
                :visible.sync="dialogVisible"
                width="30%"
                :before-close="handleClose"
                class="">
                <el-form :model="siginUpForm"
                    :rules="signUpRules"
                    ref="siginUpFormRules">
                    <el-form-item prop="userEmail">
                        <el-input
                            placeholder="请输入邮箱"
                            v-model="siginUpForm.userEmail"
                            type="email"
                            clearable>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="userName">
                        <el-input
                            placeholder="请输入用户名"
                            v-model="siginUpForm.userName"
                            clearable>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input
                            placeholder="请输入密码"
                            v-model="siginUpForm.password"
                            clearable
                            type="password">
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="passwordConfirm">
                        <el-input
                            placeholder="请确认密码"
                            v-model="siginUpForm.passwordConfirm"
                            clearable
                            type="password">
                        </el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" 
                        @click="siginUp('siginUpFormRules')">
                        注 册
                    </el-button>
                </span>
            </el-dialog>
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
            // 自定义校验;
            let self = this;
            let passwordConfirm = (rule, value, callback) => {
                if (!value) {
                 return callback(new Error('请再次输入密码!'));
                };
                if (value != self.siginUpForm.password) {
                    return callback(new Error('密码不一致!!'));
                }
                callback();
            };
            // 检测邮箱是否被注册
            let chechEmail = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入邮箱'))
                } else {
                    axios.post('/api/query/checkData', {
                        userEmail: self.siginUpForm.userEmail
                        })
                        .then((res) => {
                            if (res.data.valid) {
                                callback()
                            } else {
                                return callback(new Error('邮箱已注册，请换邮箱注册或者找回密码'))
                            }
                        })
                        .catch((error) => {
                            console.log(error)
                        })
                };
            };
            // 检测用户名是否被注册
            let checkUserName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入用户名'));
                } else {
                    axios.post('/api/query/checkData', {
                        userName: self.siginUpForm.userName
                    }).then((res) => {
                        if (res.data.valid) {
                            callback()
                        } else {
                            return callback(new Error('用户名已经被注册，请更换用户名再尝试'))
                        }
                    }).catch((error) => {
                        console.log(error)
                    })
                }
            };
            return {
                imgUrl: '',
                day: 0,
                opacityNum: 0,
                errorShow: false,
                loginForm: {
                    userName: ''
                },
                siginUpForm: {
                    userEmail: '',
                    userName: '',
                    password: '',
                    passwordConfirm: ''
                },
                loaginMessage: '欢迎来到海拉尔大陆',
                loginRules: {
                    // 登录时校验
                    userName: [
                        {
                            required: true,
                            message: '请补全信息',
                            trigger: 'blur' 
                        }
                    ],
                    password: [
                        {
                            required: true,
                            message: '请补全信息',
                            trigger: 'blur'
                        },
                    ]
                },
                signUpRules: {
                    userEmail: [
                        {
                            type: 'email',
                            message: '请输入正确的邮箱地址',
                        },
                        {
                            required: true,
                            validator: chechEmail,
                            trigger: 'blur'
                        }
                    ],
                    userName: [
                        {
                            validator: checkUserName,
                            trigger: 'blur',
                        }
                    ],
                    password: [
                        {
                            required: true,
                            message: '请输入密码',
                            trigger: 'blur'
                        }
                    ],
                    passwordConfirm:[
                        {
                            validator: passwordConfirm,
                            trigger: 'blur',
                            required: true
                        }
                    ]
                },
                dialogVisible: false
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
            },
            // 提交表单
            submitForm(formName) {
                let self = this;
                this.$refs[formName].validate(function(valid){
                    if (valid) {
                        // 校验通过提交表单;
                        axios.post('/api/query/loginUp', self.loginForm)
                            .then((res) => {
                                console.log(res)
                                if (res.data.status == 1) {
                                    sessionStorage.setItem('currentUser', JSON.stringify(res.data.userData));
                                    self.$router.push({path: '/main/home'})
                                } else {
                                    self.errorShow = true
                                }
                            })
                    } else {
                        console.log('error submit!!');
                        return 
                    }
                })
            },
            // 注册表单提交
            siginUp(formName) {
                let self = this;
                this.$refs[formName].validate((vaild) =>{
                    if (vaild) {
                        // 校验通过
                        axios.post('/api/query/signUp',self.siginUpForm)
                            .then((res) => {
                                if (res.data.status == '200') {
                                    self.$router.push({path: '/main/home'})
                                } 
                            })
                    } else {
                        // 可以写提示
                    }
                })
            },
            handleClose() {
                this.dialogVisible = false
            }
        },
        mounted() {
            // this.getImgData();
        },
        created() {
            this.getImgData();
        },
        watch: {
            // 'siginUpForm.userEmail': (newVal, oldVal) => {
            //     // console.log(`${newVal}----${oldVal}`)
            // }
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
    .error > p {
        color: #f56c6c;
    }
</style>
