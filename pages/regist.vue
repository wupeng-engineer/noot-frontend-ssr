<template>
  <Row type="flex" justify="center" align="middle" class="regist" @keydown.enter.native="submitRegist">
    <Col :xs="{span:22}" style="width: 368px;">
  
    <Alert type="error" show-icon v-if="error">{{errorMsg}}</Alert>
  
    <Row class="regist-form">
      <Form ref="registForm" :model="form" :rules="rules" class="form">
        <span class="regist-title">
                          注册
                      </span>
        <FormItem prop="username">
          <Input v-model="form.username" :maxlength="30" size="large" clearable placeholder="请输入用户名" />
        </FormItem>
        <FormItem prop="password">
          <Poptip trigger="focus" placement="right" width="250">
            <Input type="password" :maxlength="20" v-model="form.password" @on-change="strengthChange" size="large" clearable placeholder="请输入密码，长度为6-20个字符" />
            <div v-bind:class="tipStyle" slot="content">
              <span class="words">强度 : {{strength}}</span>
              <Slider v-model="strengthValue" :step="33" style="width:95%"></Slider>
              请至少输入 6 个字符。请不要使<br>用容易被猜到的密码。
            </div>
          </Poptip>
        </FormItem>
        <FormItem prop="confirmPass">
          <Input type="password" :maxlength="20" v-model="form.confirmPass" size="large" clearable placeholder="请再次输入确认密码" />
        </FormItem>
        <FormItem prop="phone">
          <Input v-model="form.phone" size="large" clearable placeholder="请输入手机号">
          <Select v-model="select" slot="prepend" style="width: 70px">
                              <Option value="86">+86</Option>
                            </Select>
          </Input>
        </FormItem>
        <FormItem prop="verifyCode" :error="errorCode">
          <Row type="flex" justify="space-between" class="code-row-bg">
            <Input v-model="form.verifyCode" size="large" clearable placeholder="请输入短信验证码(随意输入即可)" :maxlength="10" class="input-verify" />
            <Button size="large" @click="sendVerify" v-if="!sended" class="send-verify">获取验证码</Button>
            <Button size="large" disabled v-if="sended" class="count-verify">{{countButton}}</Button>
          </Row>
        </FormItem>
        <FormItem prop="verify">
          <Row type="flex" justify="space-between" class="code-row-bg" style="align-items: center;overflow: hidden;">
            <Input v-model="form.verify" size="large" clearable placeholder="请输入验证码" :maxlength="10" class="input-verify" />
            <div style="position:relative">
              <Spin v-if="loadingCode" fix></Spin>
              <img :src="verifyCodeImg"  @click="getVerifyCode" alt="加载验证码失败" style="width:100px;cursor:pointer;display:block">
            </div>
  
          </Row>
        </FormItem>
      </Form>
  
      <Row type="flex" justify="space-between" class="code-row-bg">
        <Button class="regist-btn" type="primary" size="large" :loading="loading" @click="submitRegist">
                          <span v-if="!loading">注册</span>
                          <span v-else>注册中...</span>
                      </Button>
        <router-link to="/login"><a class="to-login">使用已有账号登录</a></router-link>
      </Row>
    </Row>
  
    <Row class="foot">
      <Row type="flex" justify="space-around" class="code-row-bg help">
        <a class="item" href="https://github.com/Exrick/Noot" target="_blank">帮助</a>
        <a class="item" href="https://github.com/Exrick/Noot" target="_blank">隐私</a>
        <a class="item" href="https://github.com/Exrick/Noot" target="_blank">条款</a>
      </Row>
      <Row type="flex" justify="center" class="code-row-bg copyright">
        Copyright © 2018 - Present <a href="http://exrick.cn" target="_blank" style="margin:0 5px;">Exrick</a> 版权所有
      </Row>
    </Row>
    </Col>
  </Row>
</template>

<script>
import Cookies from "js-cookie";
export default {
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码长度不得小于6位"));
      } else {
        callback();
      }
    };
    const validateConfirmPass = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码长度不得小于6位"));
      } else if (value !== this.form.password) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    const validatephone = (rule, value, callback) => {
      var reg = /^[1][3,4,5,6,7,8][0-9]{9}$/;
      if (!reg.test(value)) {
        callback(new Error("手机号格式错误"));
      } else {
        callback();
      }
    };
    return {
      captchaId: "",
      verifyCodeImg: "",
      error: false,
      errorMsg: "",
      loading: false,
      loadingCode: true,
      sended: false,
      count: 60,
      countButton: "60 s",
      tipStyle: "password-tip-none",
      strength: "无",
      select: "86",
      strengthValue: 0,
      errorCode: "",
      form: {
        username: "",
        password: "",
        confirmPass: "",
        phone: "",
        verifyCode: "",
        verify: ""
      },
      rules: {
        username: [
          {
            required: true,
            message: "账号不能为空",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          },
          {
            validator: validatePassword,
            trigger: "blur"
          }
        ],
        confirmPass: [
          {
            required: true,
            message: "确认密码不能为空",
            trigger: "blur"
          },
          {
            validator: validateConfirmPass,
            trigger: "blur"
          }
        ],
        phone: [
          {
            required: true,
            message: "手机号不能为空",
            trigger: "blur"
          },
          {
            validator: validatephone,
            trigger: "blur"
          }
        ],
        verify: [
          {
            required: true,
            message: "验证码不能为空",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    showErrorMsg(msg) {
      this.error = true;
      this.errorMsg = msg;
    },
    checkStrengthValue(v) {
      // 评级制判断密码强度 最高5
      let grade = 0;
      if (/\d/.test(v)) {
        grade++; //数字
      }
      if (/[a-z]/.test(v)) {
        grade++; //小写
      }
      if (/[A-Z]/.test(v)) {
        grade++; //大写
      }
      if (/\W/.test(v)) {
        grade++; //特殊字符
      }
      if (v.length >= 10) {
        grade++;
      }
      return grade;
    },
    strengthChange() {
      if (!this.form.password) {
        this.tipStyle = "password-tip-none";
        this.strength = "无";
        this.strengthValue = 0;
        return;
      }
      let grade = this.checkStrengthValue(this.form.password);
      if (grade <= 1) {
        this.tipStyle = "password-tip-weak";
        this.strength = "弱";
        this.strengthValue = 33;
      } else if (grade >= 2 && grade <= 4) {
        this.tipStyle = "password-tip-middle";
        this.strength = "中";
        this.strengthValue = 66;
      } else {
        this.tipStyle = "password-tip-strong";
        this.strength = "强";
        this.strengthValue = 100;
      }
    },
    sendVerify() {
      this.$refs.registForm.validate(valid => {
        if (valid) {
          this.sended = true;
          this.countDown();
        }
      });
    },
    countDown() {
      let that = this;
      if (this.count === 0) {
        this.sended = false;
        this.count = 60;
        return;
      } else {
        this.countButton = this.count + " s";
        this.count--;
      }
      setTimeout(function() {
        that.countDown();
      }, 1000);
    },
    submitRegist() {
      this.$refs.registForm.validate(valid => {
        if (valid) {
          if (this.form.verifyCode === "") {
            this.errorCode = "验证码不能为空";
            return;
          } else {
            this.errorCode = "";
          }
          this.loading = true;
          this.form.captchaId = this.captchaId;
          this.form.passStrength = this.strength;
          regist(this.form).then(res => {
            this.loading = false;
            if (res.message ===  'success') {
              let query = {
                username: this.form.username
              };
              this.$router.push({
                name: "regist-result",
                query: query
              });
            } else {
              this.getVerifyCode();
            }
          });
        }
      });
    },
    getVerifyCode() {
      this.loadingCode = true;
      initCaptcha().then(res => {
        if (res.message ===  'success') {
          this.captchaId = res.data.captchaId;
          this.verifyCodeImg = drawCodeImage + this.captchaId;
          this.loadingCode = false;
        }
      });
    }
  },
  mounted() {
    this.getVerifyCode();
  }
};
</script>

<style lang="less" scoped>
.regist {
    height: 100vh;
    background: url('~assets/background.svg');
    .header {
        margin-top: 5vh;
        margin-bottom: 4vh;
        text-align: center;
        .description {
            font-size: 14px;
            color: rgba(0, 0, 0, .45);
            margin-top: 1vh;
        }
    }
    .regist-form {
        margin-bottom: 6vh;
    }
    .form {
        padding-top: 1vh;
        .regist-title {
            display: block;
            font-size: 16px;
            margin-bottom: 2vh;
        }
        .input-verify {
            width: 70%;
        }
        .count-verify,
        .send-verify {
            width: 100px;
        }
        .ivu-poptip {
            display: inline-block;
            width: 100%;
        }
        .ivu-poptip-rel {
            width: 100%;
            display: inline-block;
            position: relative;
        }
        .ivu-slider-button {
            display: none;
        }
        .ivu-slider-button-wrap .ivu-tooltip {
            display: none;
        }
        .password-tip-none {
            padding: 1vh 0;
            font-size: 14px;
            .ivu-slider-bar {
                height: 4px;
                border-radius: 3px;
                position: absolute;
            }
        }
        .password-tip-weak {
            padding: 1vh 0;
            font-size: 14px;
            .words {
                color: #ed3f14;
            }
            .ivu-slider-bar {
                height: 4px;
                background: #ed3f14;
                border-radius: 3px;
                position: absolute;
            }
        }
        .password-tip-middle {
            padding: 1vh 0;
            font-size: 14px;
            .words {
                color: #faad14;
            }
            .ivu-slider-bar {
                height: 4px;
                background: #faad14;
                border-radius: 3px;
                position: absolute;
            }
        }
        .password-tip-strong {
            padding: 1vh 0;
            font-size: 14px;
            .words {
                color: #52c41a;
            }
            .ivu-slider-bar {
                height: 4px;
                background: #52c41a;
                border-radius: 3px;
                position: absolute;
            }
        }
        .ivu-input-group-append,
        .ivu-input-group-prepend {
            padding: 4px 7px;
            font-size: inherit;
            font-weight: 400;
            line-height: 1;
            color: #495060;
            text-align: center;
            background-color: #fff;
            border: 1px solid #dddee1;
            border-radius: 6px;
        }
    }
    .regist-btn {
        width: 50%;
    }
    .to-login {
        font-size: 14px;
        line-height: 35px;
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
    .ivu-spin-fix .ivu-spin-main {
        top: 70%;
    }
}
</style>