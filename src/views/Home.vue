<template>
  <div style="height: 100%">
    <el-container>
      <el-header>
        <div id="header">
          <span>
            <img
              src="../assets/logo.png"
              style="
                align-self: flex-start;
                margin-top: 10px;
                width: 100px;
                height: 40px;
              "
          /></span>

          <span
            style="
              align-self: flex-start;
              margin: 0px 2px;
              font-weight: bold;
              color: ghostwhite;
            "
          >
            <span style="font-size: 20px; margin: 0 30px">
              <el-tag
                style="
                  margin: 0, 40px;
                  color: aliceblue;
                  border-color: rgb(98 166 247);
                  font-size: 14px;
                  background-color: rgb(33 127 225);
                "
                >{{
                  userinfo.comname +
                  "   [" +
                  userinfo.dbname +
                  "_" +
                  userinfo.rolename +
                  "]"
                }}
                &nbsp;&nbsp;&nbsp;
                {{
                  userinfo.period +
                  "        [" +
                  userinfo.sdate +
                  "," +
                  userinfo.edate +
                  "]"
                }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{
                  userinfo.username + "   [" + userinfo.userid + "]"
                }} </el-tag
              >&nbsp;&nbsp;&nbsp;{{ $store.getters.userid }}
            </span></span
          >

          <span class="tbar" style="align-self: flex-end" @click="loginout">
            <b class="tbar"
              ><el-icon><SwitchButton /></el-icon> 退出系统</b
            >
          </span>
        </div>
      </el-header>
      <el-aside> <appside></appside></el-aside>

      <el-main>
        <el-button type="primary" @click="ck"></el-button>
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { reactive } from "vue";
import store from "../store";
import appside from "../views/appside.vue";
import {
  useDicStore,
  useDeptPosStore,
  useUserStore,
  useRightStore,
  useEmidStore,
} from "@/store/index";
import { AX } from "../utils/api";

export default {
  name: "Home",
  store,
  components: { appside },
  setup() {
    const dics = useDicStore();
    const deptpos = useDeptPosStore();
    const users = useUserStore();
    const rights = useRightStore();
    const emids = useEmidStore();
    return {
      dics,
      deptpos,
      users,
      rights,
      emids,
    };
  },
  data() {
    return {
      circleUrl:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      squareUrl:
        "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
      sizeList: ["large", "medium", "small"],

      menudata: [],

      userinfo: reactive({
        comname: "",
        rolename: "",
        dbname: "",
        period: "",
        sdate: "",
        edate: "",
        username: "",
        userid: "",
      }),
    };
  },
  methods: {
    menuClick(index) {
      this.$router.push(index);
    },
    loginout() {
      //这个暂时不改，后面再说，要改的话，改成pinia的状态机
      //但没必要。
      window.localStorage.removeItem("token");
      this.$router.push("/");
    },

    async ck() {
      // const k = [
      //   {
      //     dicmid: "hrgrade",
      //     itemename: "1",
      //     itemid: "1",
      //     itemname: "服务类1",
      //   },
      //   {
      //     dicmid: "hrgrade",
      //     itemename: "2",
      //     itemid: "2",
      //     itemname: "服务类2",
      //   },
      // ];
      // await this.dics.add2DicStore("hrgrade", k);
      console.log("dics:", [this.dics.dic.data]);
      console.log("emids", this.emids.maxemids.data);
      this.emids.getNewEmid("0");
      // console.log("emids", this.emids.maxemids);
      // console.log("dics2:", [await this.dics.getDic("hrgrade")]);
      // console.log(...(await this.deptpos.deptposData.data));
      // console.log(await this.users.userData.data);
      // this.userinfo.comname = this.users.userData.data.user.data[0].comname;
      // this.userinfo.rolename = this.users.userData.data.user.data[0].rname;
      // console.log(this.users.userData.data.user.data[0].comname);
      //console.log("rights", this.rights.rightData);
      // AX("get", "user/lst/lst").then((res) => {
      //   console.log(res);
      // });
    },
  },
  mounted() {
    // console.log(this.users.userData.data);
    this.userinfo.comname = this.users.userData.data.user.data[0].comname;
    this.userinfo.rolename = this.users.userData.data.user.data[0].rname;
    this.userinfo.dbname = this.users.userData.data.user.data[0].dbname;
    this.userinfo.username = this.users.userData.data.user.data[0].usrname;
    this.userinfo.userid = this.users.userData.data.user.data[0].tele;
    this.userinfo.userid =
      this.userinfo.userid.substring(0, 4) +
      "***" +
      this.userinfo.userid.substring(7);
    this.userinfo.period = this.users.getperiod().period;
    this.userinfo.sdate = this.users.getperiod().sdate;
    this.userinfo.edate = this.users.getperiod().edate;
  },
  // mounted() {
  //   // const fullPath = this.$route.path;
  //   // console.log(fullPath);
  //   const menustr = sessionStorage.getItem("menu");
  //   if (menustr) {
  //     this.menudata = JSON.parse(menustr)[0].children;
  //      console.log(this.menudata[0].children);
  //   }
  // },
};
</script>

<style>
html,
body {
  margin: 0 0;
  height: 100%;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

fade-enter,
.fade-leave-to {
  opacity: 0;
}

.el-container {
  height: 100%;
  min-height: 200px;
  min-width: 1080px;
}

.el-header,
.el-footer {
  background-color: #2d4980;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #ffffff;
  color: #333;
  text-align: center;
  line-height: 200px;
  /* height: 100%; */
  border: 1px solid #e6e6e6;
}

.el-main {
  background-color: #ffffff;
  color: #333;
  text-align: center;
  /* line-height: 160px; 
  height: 100%;*/

  width: 80%;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
#header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

#header span:nth-child(2) {
  flex: 1;
  text-align: left;
  padding: 0 10px;
  display: flex;
}
#header span:nth-child(3) {
  color: white;
  font-weight: bold;
  cursor: pointer;
  text-align: left;
  display: flex;
  margin: 10px 0px;
}

#header span:nth-child(3):hover {
  color: rgb(255, 127, 53);
}
</style>
