<template>
    <Row type="flex" justify="center" align="middle" class="login" @keydown.enter.native="submitLogin">
        <Col :xs="{span:22}" style="width: 368px;">
            <Alert type="error" show-icon v-if="error">{{errorMsg}}</Alert>
            <Row class="login-form" v-if="!socialLogining">
                <Form ref="usernameLoginForm" :model="form" :rules="rules" class="form">
                    <FormItem prop="username">
                        <Input v-model="form.username" prefix="ios-contact" size="large" clearable placeholder="请输入用户名" autocomplete="off" />
                    </FormItem>
                    <FormItem prop="password">
                        <Input type="password" v-model="form.password" prefix="ios-lock" size="large" clearable placeholder="请输入密码" autocomplete="off" />
                    </FormItem>
                    <FormItem prop="code">
                        <Input style="width: 70%" type="text" v-model="form.code" prefix="ios-code" size="large" clearable placeholder="验证码" autocomplete="off" />
                        <div class="code-wrap" @click="this.changeCode"><img :src="codeUrl"/></div>
                    </FormItem>
                </Form>
                <Row>
                    <Button class="login-btn" type="primary" size="large" :loading="loading" @click="submitLogin" long>
                        <span v-if="!loading">登录</span>
                        <span v-else>登录中...</span>
                    </Button>
                </Row>
            </Row>
        </Col>
    </Row>
</template>

<script>
import Cookies from "js-cookie";
import util from '~/libs/util';
export default {
    data() {
        return {
            codeUrl: '',
            socialLogining: false,
            error: false,
            errorMsg: "",
            tabName: "username",
            saveLogin: true,
            loading: false,
            sending: false,
            sended: false,
            maxLength: 6,
            errorCode: "",
            form: {
                username: "",
                password: "",
                code: ""
            },
            rules: {
                username: [{
                    required: true,
                    message: "账号不能为空",
                    trigger: "blur"
                }], password: [{
                    required: true,
                    message: "密码不能为空",
                    trigger: "blur"
                }], code: [{
                    required: true,
                    message: "验证码不能为空",
                    trigger: "blur"
                }]
            }
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.changeCode()
        },
        changeCode() {
            this.$axios.api.code().then(res => {
                return 'data:image/png;base64,' + btoa(
                    new Uint8Array(res).reduce((data, byte) => data + String.fromCharCode(byte), '')
                );
            }).then(data => {
                this.codeUrl = data;
            })
        },
    showErrorMsg(msg) {
        this.error = true;
        this.errorMsg = msg;
    },
    submitLogin() {
        this.$refs.usernameLoginForm.validate(valid => {
            if (valid) {
                this.loading = true;
                this.$axios.api.login({
                    username: this.form.username,
                    password: this.form.password,
                    auth_code: this.form.code,
                }).then(res => {
                    if (Number(res.error_code) === 0 && res.result === 'Y') {
                        this.$axios.api.userInfo().then(res => {
                            if (Number(res.error_code) === 0 && res.result === 'Y') {
                                this.$store.commit('setInfo', res.data);
                                this.$router.push({ path: "/sys/home" })
                            }
                        });
                    } else {
                        this.loading = false;
                    }
                });
            } else {
                this.loading = false;
            }
        });
    }
  },
};
</script>

<style lang="less" scoped>
    .login {
        height: 100vh;
        background: url('~assets/background.svg');
        .login-form {
            margin-bottom: 16vh;
        }
        .code-wrap {
            float: right;
            display: flex;
            align-items: center;
            height: 35px;
            cursor: pointer;
        }
    .ivu-tabs-nav-container {
        line-height: 2;
        font-size: 17px;
        box-sizing: border-box;
        white-space: nowrap;
        overflow: hidden;
        position: relative;
        zoom: 1;
    }
    .form {
        padding-top: 1vh;
        .input-verify {
            width: 70%;
        }
        .count-verify,
        .send-verify {
            width: 100px;
        }
    }
    .forget-pass,
    .other-way {
        font-size: 14px;
    }
    .login-btn,
    .other-login {
        margin-top: 3vh;
    }
    .icons {
        display: flex;
        align-items: center;
    }
    .other-icon {
        cursor: pointer;
        margin-left: 10px;
        display: flex;
        align-items: center;
        color: rgba(0, 0, 0, .2);
        :hover {
            color: #2d8cf0;
        }
    }
    .foot {
        margin-bottom: 2vh;
        color: rgba(0, 0, 0, .45);
        font-size: 14px;
        .help {
            margin: 0 auto;
            margin-bottom: 1vh;
            width: 60%;
            .item {
                color: rgba(0, 0, 0, .45);
            }
            :hover {
                color: rgba(0, 0, 0, .65);
            }
        }
    }
}

.ivu-tabs-nav .ivu-tabs-tab .ivu-icon {
    width: 14px;
    height: 14px;
    margin-right: 8px;
    margin-bottom: 5px;
}
</style>