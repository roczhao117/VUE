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
          <SIdentify
            :identifyCode="identifyCode"
            style="display: inline-block"
          ></SIdentify>
        </span>

        <el-button style="width: 100%" type="primary" @click="verifyUser"
          >Login</el-button
        >
      </el-form>
    </div>
  </div>
</template>

<script>
import SIdentify from "./imgIdentify";
import axios from "axios";
import store from "../store";
import { AX } from "../utils/api";
import { encrypt } from "../utils/sec";
import { useMenuStore, useUserStore } from "../store/index";

// const crypto = require('crypto');

export default {
  name: "Login",
  store,

  setup() {
    const menustore = useMenuStore();
    const userstore = useUserStore();
    return {
      menustore,
      userstore,
    };
  },

  data() {
    return {
      codes: "123456789ABCDEFGHJKLMNPQRTVWXY".split(""),
      identifyCode: "",
      isloading: 0,
      title: "",
      loginForm: {
        username: "18601690100",
        pwd: "123456",
        code: "1234",
      },
      rules: {
        username: [
          { required: true, message: "please input username", trigger: "blur" },
        ],
        pwd: [
          { required: true, message: "please input password", trigger: "blur" },
        ],
        code: [
          { required: true, message: "please input code", trigger: "blur" },
        ],
      },
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
    });

    axios.interceptors.response.use((config) => {
      this.isloading = 0;
      return config;
    });
  },
  methods: {
    treeRegMenu(data) {
      if (data && data.path) {
        // console.log("dddddddddddd", data.module);
        this.$router.addRoute(data.name, {
          path: data.path,
          name: data.name,
          component: () => import(`../views/${data.module}`),
        });
      }
      if (data && data.children) {
        data.children.forEach((el) => {
          this.treeRegMenu(el);
        });
      }
    },

    verifyUser() {
      this.$refs.loginform.validate((valid) => {
        if (valid) {
          if (this.loginForm.code !== this.identifyCode) {
            this.$message.error("please check code!");
            this.refreshCode();
            //测试的时候取消掉，否则每次登录都需要设置，
            //上线的时候需要打开。
            // return false;
          }

          // let userinfo = {
          //   username: this.loginForm.username,
          // //  这里的密码是加密的，加密以后传递过去。这里是为了查看加密的过程
          //   // pwd: crypto.createHash('md5').update(this.loginForm.pwd).digest('hex'),
          // // 这里的是不需要加密的，直接把原密码传递过去，然后通过服务的解码
          //   pwd:this.loginForm.pwd,
          //   code: this.loginForm.code,
          // }

          //   userinfo = encrypt(
          //   JSON.stringify({
          //     username: this.loginForm.username,
          //     pwd: this.loginForm.pwd,
          //   })
          // );

          AX("post", "auth/login", {
            username: this.loginForm.username,
            pwd: encrypt(this.loginForm.pwd),
          })
            .then(async (res) => {
              // console.log("2222222222222222222222222222222222", res);
              if (res.code == 200) {
                this.$store.commit("setToken", res.token);
                this.$store.commit("setUser", res.usrid);
                this.userstore.add2TokenStore(res.token);

                //这里的USERNAME 是电话号码。

                await this.userstore.add2UserStore(this.loginForm.username);
                // console.log("username", this.loginForm.username);

                // console.log("**********", this.userstore.userData, res.usrid);
                let rid = "-1";
                if (
                  this.userstore.getUser().data &&
                  this.userstore.getUser().data[0] &&
                  this.userstore.getUser().data[0].usrgrpid
                ) {
                  rid = this.userstore.getUser().data[0].usrgrpid;
                }

                AX(
                  "get",
                  `menu/lst?user=${JSON.stringify(
                    this.userstore.getUser().data[0]
                  )}`
                ).then((res) => {
                  if (res) {
                    // console.log(res);
                    const menudata = [...res.data];
                    // console.log("kkkkkkkkkkkkkkkkkkkk", menudata[0]);
                    // this.$router.addRoute("home", {
                    //   path: "/home",
                    //   name: "Home",
                    //   component: () => import("./Home.vue"),
                    // });

                    this.treeRegMenu(menudata[0]);
                    this.menustore.add2MenuStore(menudata[0]);
                    sessionStorage.setItem("menu", JSON.stringify(menudata));
                    this.$router.push("/home");
                  }
                });
              } else {
                this.$message.error("账号错误❌");
                this.refreshCode();
                return null;
              }
            })
            .catch((err) => {
              console.log(err.message);
              this.refreshCode();
              return null;
            });
        } else {
          this.$message.error("请填写下面所有格子！");
          this.refreshCode();
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.loginform.resetFields();
    },

    //  ...mapActions("modules/account", ["settoken", "setname"]),
    jumpregister: function () {
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
        this.identifyCode += this.codes[this.randomNum(0, this.codes.length)];
      }
      // console.log(this.identifyCode);
    },
  },
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
