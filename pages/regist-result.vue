<template>
    <Row type="flex" justify="center" align="middle" class="regist" @keydown.enter="submitRegist">
        <Col :xs="{span:22}" style="width: 368px;">
        <Row class="success">
            <Icon type="md-checkmark-circle" color="#52c41a" size="64"></Icon>
            <p class="success-words">恭喜您，您的账户：{{username}} 注册成功</p>
            <Row class="buttons">
                <router-link to="/login">
                    <Button type="primary" size="large" style="margin-right:10px;">立即登录</Button>
                </router-link>
                <router-link to="/regist">
                    <Button size="large">返回注册</Button>
                </router-link>
            </Row>
        </Row>
    
        <Row class="foot">
            <Row type="flex" justify="space-around" class="help">
                <a class="item" href="https://github.com/Exrick/Noot" target="_blank">帮助</a>
                <a class="item" href="https://github.com/Exrick/Noot" target="_blank">隐私</a>
                <a class="item" href="https://github.com/Exrick/Noot" target="_blank">条款</a>
            </Row>
            <Row type="flex" justify="center" class="copyright">
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
    return {
      username: ""
    };
  },
  methods: {},
  mounted() {
    this.username = this.$route.query.username;
  }
};
</script>

<style lang="less" scoped>
.regist{
    height: 100vh;
    background: url('~assets/background.svg');
    .header{
        margin-top: 12vh;
        margin-bottom: 12vh;
        text-align: center;
        .description{
            font-size: 14px;
            color: rgba(0,0,0,.45);
            margin-top: 1vh;
        }
    }
    .success{
        text-align: center;
        margin-bottom: 25vh;
        .success-words {
            margin-top: 32px;
            font-size: 20px;
            line-height: 28px;
        }
        .buttons{
            margin-top: 40px;
        }
    }
    .foot{
        margin-bottom: 2vh;
        color: rgba(0,0,0,.45);
        font-size: 14px;
        .help {
            margin: 0 auto;
            margin-bottom: 1vh;
            width: 60%;
            .item{
                color: rgba(0,0,0,.45);
            }
            :hover{
                color:rgba(0,0,0,.65);
            }
        }
    }
    
}
</style>