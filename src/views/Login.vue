<template>
  <div id="Login">
    <img src="../assets/logo.png" />
    <div class="login">
      <el-form :rules="rules" ref="loginform" :model="loginForm">
        <h2>系统登陆</h2>
        <el-form-item prop="username">
          <el-input
            type="text"
            v-model="loginForm.username"
            auto-complete="false"
            placeholder="please input username"
          ></el-input>
        </el-form-item>

        <el-form-item prop="pwd">
          <el-input
            type="password"
            v-model="loginForm.pwd"
            auto-complete="false"
            placeholder="please input password"
          ></el-input>
        </el-form-item>

        <el-form-item prop="code">
          <el-input
            type="text"
            v-model="loginForm.code"
            auto-complete="false"
            placeholder="please input verify code"
          ></el-input>
        </el-form-item>

        <span @click="refreshCode">
          <SIdentify :identifyCode="identifyCode" style="display:inline-block;"></SIdentify>
        </span>

        <el-button style="width:100%;" type="primary" @click="verifyUser">Login</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import SIdentify from "./imgIdentify";
import axios from 'axios';
import store from '../store';
import { AX } from '../utils/api';

export default {
  name: "Login",
  store,
  data() {
    return {
      codes: '123456789ABCDEFGHJKLMNPQRTVWXY'.split(''),
      identifyCode: '',
      isloading: 0,
      title: "",
      loginForm: {
        username: "admin",
        pwd: "123321",
        code: '',


      },
      rules: {
        username: [{ required: true, message: 'please input username', trigger: 'blur' }],
        pwd: [{ required: true, message: 'please input password', trigger: 'blur' }],
        code: [{ required: true, message: 'please input code', trigger: 'blur' }]
      }
    };
  },
  components: {
    SIdentify,
  },
  mounted() {
    this.identifyCode = "";
    this.makeCode(this.identifyCodes, 4);
  },
  created() {

    axios.interceptors.request.use((config) => {
      this.isloading = 1;
      return config;
    })

    axios.interceptors.response.use((config) => {
      this.isloading = 0;
      return config;
    })
  },
  methods: {

    verifyUser() {

      AX('get', '/posts').then(

        res => console.log(res),
        e => { console.log(e) }
      );
      this.$refs.loginform.validate((valid) => {
        if (valid) {
          if (this.loginForm.code !== this.identifyCode) {
            this.$message.error('please check code!')
            this.refreshCode();
            return false;

          }
          //alert('submit!');
          this.$router.push('/Home');
        } else {
          this.$message.error('please filled box below!!');
          this.refreshCode();
          return false;

        }
      })
    },
    resetForm() {
      this.$refs.loginform.resetFields();
    },

    //  ...mapActions("modules/account", ["settoken", "setname"]),
    jumpregister: function() {
      this.$router.push({ path: "/register" });
    },
    //验证码abcdefghijklnmopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    refreshCode() {
      this.identifyCode = "";
      this.makeCode(this.codes, 4);
    },
    makeCode(o, l) {

      for (let i = 0; i < l; i++) {

        this.identifyCode += this.codes[
          this.randomNum(0, this.codes.length)
        ];
      }
      console.log(this.identifyCode);
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h2 {
  margin: 12px 0 0;
  padding-bottom: 15px;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

img {
  margin-top: 80px;
}
identifyCode {
  display: flex;
  text-align: center;
}
.login {
  background-clip: padding-box;
  text-align: center;
  width: 300px;
  height: 340px;
  border: 2px solid rgb(199, 199, 199);
  padding: 30px 35px;
  margin: 20px auto;
  border-radius: 20px;
  box-shadow: 0 0 25px rgba(163, 163, 163, 0.4);
}
</style>






