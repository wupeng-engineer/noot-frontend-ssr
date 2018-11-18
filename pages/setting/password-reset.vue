<template>
  <div>
    <Card class="change-pass">
      <p slot="title">
        <Icon type="key"></Icon>
        修改密码
      </p>
      <div>
        <Form ref="editPasswordForm" :model="editPasswordForm" :label-width="100" label-position="right" :rules="passwordValidate" style="width:450px">
          <FormItem label="原密码" prop="oldPass">
            <Input type="password" v-model="editPasswordForm.oldPass" placeholder="请输入现在使用的密码"></Input>
          </FormItem>
          <FormItem label="新密码" prop="newPass">
            <Poptip trigger="focus" placement="right" width="250">
              <Input type="password" v-model="editPasswordForm.newPass" @on-change="strengthChange" placeholder="请输入新密码，长度为6-20个字符"></Input>
              <div v-bind:class="tipStyle" slot="content">
                <span class="words">强度 : {{strength}}</span>
                <Slider v-model="strengthValue" :step="33" style="width:95%"></Slider>
                请至少输入 6 个字符。请不要使<br>用容易被猜到的密码。
              </div>
            </Poptip>
          </FormItem>
          <FormItem label="确认新密码" prop="rePass">
            <Input type="password" v-model="editPasswordForm.rePass" placeholder="请再次输入新密码"></Input>
          </FormItem>
          <FormItem>
            <Button type="primary" style="width: 100px;margin-right:5px" :loading="savePassLoading" @click="saveEditPass">保存</Button>
            <Button @click="cancelEditPass">取消</Button>
          </FormItem>
        </Form>
      </div>
    </Card>
  </div>
</template>

<script>
export default {
  name: 'passowrd-reset',
  layout: 'common',
  data() {
    const valideRePassword = (rule, value, callback) => {
      if (value !== this.editPasswordForm.newPass) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };
    return {
      savePassLoading: false,
      tipStyle: "password-tip-none",
      strength: "无",
      strengthValue: 0,
      editPasswordForm: {
        oldPass: "",
        newPass: "",
        rePass: ""
      },
      passwordValidate: {
        oldPass: [
          {
            required: true,
            message: "请输入原密码",
            trigger: "blur"
          }
        ],
        newPass: [
          {
            required: true,
            message: "请输入新密码",
            trigger: "blur"
          },
          {
            min: 6,
            message: "请至少输入6个字符",
            trigger: "blur"
          },
          {
            max: 32,
            message: "最多输入32个字符",
            trigger: "blur"
          }
        ],
        rePass: [
          {
            required: true,
            message: "请再次输入新密码",
            trigger: "blur"
          },
          {
            validator: valideRePassword,
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    init() {},
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
      if (!this.editPasswordForm.newPass) {
        this.tipStyle = "password-tip-none";
        this.strength = "无";
        this.strengthValue = 0;
        return;
      }
      let grade = this.checkStrengthValue(this.editPasswordForm.newPass);
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
    saveEditPass() {
      let params = {
        password: this.editPasswordForm.oldPass,
        newPass: this.editPasswordForm.newPass,
        passStrength: this.strength
      };
      this.$refs["editPasswordForm"].validate(valid => {
        if (valid) {
          this.savePassLoading = true;
          this.$axios.api.userUpdatePassword({
              old_password: params.password,
              new_password: params.newPass
          }).then(res => {
            this.savePassLoading = false;
            if (res.access_token) {
              this.$Modal.success({
                title: "修改密码成功",
                content: "修改密码成功，需重新登录",
                onOk: () => {
                  this.$store.commit("logout");
                  this.$store.commit("removeMenuList");
                  this.$router.push({ path: "/login" });
                }
              });
            }
          });
        }
      });
    },
    cancelEditPass() {
      this.$store.commit("removeTag", "change_pass");
      localStorage.pageOpenedList = JSON.stringify(
        this.$store.state.app.pageOpenedList
      );
      let lastPageName = "";
      let length = this.$store.state.app.pageOpenedList.length;
      if (length > 1) {
        lastPageName = this.$store.state.app.pageOpenedList[length - 1].name;
      } else {
        lastPageName = this.$store.state.app.pageOpenedList[0].name;
      }
      this.$router.push({
        name: lastPageName
      });
    }
  },
  mounted() {}
};
</script>
<style lang="less" scoped>
.change-pass {
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
    &-btn-box {
        margin-bottom: 10px;
        button {
            padding-left: 0;
            span {
                color: #2D8CF0;
                transition: all .2s;
            }
            span:hover {
                color: #0C25F1;
                transition: all .2s;
            }
        }
    }
}
</style>
