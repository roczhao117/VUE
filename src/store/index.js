import axios from "axios";
import { defineStore } from "pinia";
import { reactive } from "vue";
import { ref, computed } from "vue";

import { createStore } from "vuex";

import { AX } from "../utils/api";
import moment from "moment";

export default createStore({
  state: {
    userid: "",
    token: "",
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
      window.localStorage.setItem("token", token);
    },

    setUser(state, userid) {
      state.userid = userid;
      window.localStorage.setItem("userid", userid);
    },
  },

  actions: {},
  modules: {},
  getters: {
    token: (state) => {
      if (!state.token) {
        state.token = window.localStorage.getItem("token").replace(/"/g, "");
      }
      return state.token;
    },
    userid: (state) => {
      if (!state.userid) {
        state.userid = window.localStorage.getItem("userid").replace(/"/g, "");
      }
      return state.userid;
    },
  },
});
/**
 * option 方法
 */
export const useUserStore = defineStore(
  "user",
  () => {
    const userData = reactive({
      data: {
        token: "",
        user: {},
      },
    });

    async function add2UserStore(user) {
      if (user) {
        const userinfo = await AX("get", `user/${user}`);
        this.userData.data.user = Object.assign({}, userinfo);
      }
    }

    function add2TokenStore(token) {
      if (token) {
        this.userData.data.token = token;
      }
    }

    function getUser(q = true) {
      if (q == false) {
        return this.userData.data.user.data[0];
      } else {
        return this.userData.data.user;
      }
    }

    function getperiod(type = "pr") {
      const dt = this.userData.data.user.data[0];
      const sysyear = dt["sysyear"];
      const sysmonth = dt["sysmonth"];
      let day = dt["salperiod"];
      if (type != "pr") {
        day = dt["kqperiod"];
      }

      let sdate = "";
      let edate = "";
      let period = moment(sysyear + "-" + sysmonth + "-1").format("YYYYMM");
      let sdateyear = "";
      let edateyear = "";

      //1：首先判断薪资的周期，如果薪资的周期数字为1或者为0，那么代表自然月份。

      if (day == 1 || day == 0) {
        //如果是202401，变成开始日期为20231201
        sdate = moment(sysyear + "-" + sysmonth + "-1")
          .add(0, "month")
          .format("YYYY-MM-DD");
        edate = moment(sdate)
          .add(1, "month")
          .add(-1, "day")
          .format("YYYY-MM-DD");
        sdateyear = moment(sysyear + "-1-1").format("YYYY-MM-DD");
        edateyear = moment(sysyear + "-12-31").format("YYYY-MM-DD");
      } else {
        sdate = moment(sysyear + "-" + sysmonth + "-" + day)
          .add(-1, "month")
          .format("YYYY-MM-DD");
        edate = moment(sdate)
          .add(1, "month")
          .add(-1, "day")
          .format("YYYY-MM-DD");

        sdateyear = moment(sysyear + "-12-" + day)
          .add(-1, "year")
          .format("YYYY-MM-DD");
        edateyear = moment(sysyear + "-12-" + day)
          .add(-1, "day")
          .format("YYYY-MM-DD");
      }
      return { period, sdate, edate, sdateyear, edateyear };
    }

    function getToken() {
      return this.userData.data.token;
    }
    return {
      userData,
      add2UserStore,
      add2TokenStore,
      getUser,
      getToken,
      getperiod,
    };
  },
  {
    persist: true,
  }
);

/**
 * setup方法
 */
export const useMenuStore = defineStore(
  "menu",
  () => {
    const menuData = ref({});
    const getMenu = computed(() => {
      return menuData;
    });

    function add2MenuStore(menu) {
      if (menu) {
        this.menuData = Object.assign({}, menu);
      }
    }

    return {
      menuData,
      getMenu,
      add2MenuStore,
    };
  },
  {
    persist: true,
  }
);

/**
 *
 */
export const useDicStore = defineStore(
  "dic",
  () => {
    let dic = reactive({
      data: [],
    });

    function getDic(dicmid, isActive = true) {
      const t = reactive({
        data: [],
      });

      if (dicmid) {
        dic.data.map((item) => {
          if (item.dicmid.toLowerCase().trim() == dicmid.toLowerCase().trim()) {
            if (isActive && item.isactive) {
              t.data.push(item);
            } else {
              t.data.push(item);
            }
          }
        });
      }
      return t.data;
    }

    function add2DicStore(dicmid = "-1", data) {
      if (dicmid == "-1") {
        dic.data.splice(0, dic.data.length);

        dic.data = [...data];
      }

      if (dicmid != "-1" && data && data.length > 0) {
        if (dic.data.length > 0) {
          for (var i = 0; i < dic.data.length; i++) {
            if (
              dic.data[i].dicmid.toLowerCase().trim() ==
              dicmid.toLowerCase().trim()
            ) {
              //vue 中的  splice(index,len,[item])
              //SPLICE 不会删除最后一个元素，所以当有删除的时候，需要用for循环，而不是foreach。
              //必须有 i--
              // console.log(i, dic.data[i])
              dic.data.splice(i, 1);
              i--;
            }
          }
        }
        dic.data.push(...data);
      }
    }

    return {
      dic,
      add2DicStore,
      getDic,
    };
  },
  {
    persist: true,
  }
);

/**
 *
 */
export const useDeptPosStore = defineStore(
  "deptpos",
  () => {
    let deptposData = reactive({
      data: [],
    });

    function getDeptPos(deptid) {
      const t = reactive({
        data: [],
      });

      if (deptid) {
        deptposData.data.map((item) => {
          if (item.deptid.toLowerCase().trim() == deptid.toLowerCase().trim()) {
            t.data.push(item);
          }
        });
      }
      return t.data;
    }

    /**
     *
     * @param {*} deptid
     * @param {*} data
     */

    function add2DeptPosStore(deptid = "-1", data) {
      if (deptid == "-1") {
        deptposData.data.splice(0, deptposData.data.length);

        deptposData.data = [...data];
      }
    }

    return {
      deptposData,
      add2DeptPosStore,
      getDeptPos,
    };
  },
  {
    persist: true,
  }
);

export const useRightStore = defineStore(
  "right",
  () => {
    const rightData = reactive([]);

    function add2RightStore(data) {
      if (data && data.length > 0) {
        rightData.push(...data);
      }
    }
    return {
      rightData,
      add2RightStore,
    };
  },
  {
    persist: true,
  }
);
export const useShiftStore = defineStore(
  "shift",
  () => {
    const shiftData = reactive([]);

    function add2ShiftStore(data) {
      if (data && data.length > 0) {
        shiftData.push(...data);
      }
    }
    function getsftByDept(dept = "123") {
      const depts = [];
      shiftData.forEach((sft) => {
        const sftdepts = sft["sftdept"].split(",");
        if (sftdepts.includes(dept)) {
          depts.push(sft);
        }
      });
      return depts;
    }
    return {
      shiftData,
      add2ShiftStore,
      getsftByDept,
    };
  },
  {
    persist: true,
  }
);

export const useEmidStore = defineStore(
  "emid",
  () => {
    const maxemids = reactive({ data: [] });

    function add2EmidStore(data) {
      let isnew = true;
      if (data) {
        maxemids.data.forEach((item) => {
          if (item.comid == data.comid) {
            item.emid = data.emid;
            isnew = false;
          }
        });
        if (isnew) {
          maxemids.data.push(data);
        }
      }
    }

    function getNewEmid(comid) {
      let emid = ref("");

      if (maxemids.data && maxemids.data.length > 0 && comid) {
        maxemids.data.forEach((item) => {
          // console.log("kkkkkkkkk", item.comid);
          if (item.comid == comid) {
            emid = parseInt(item.emid) + 1;
            item.emid = emid;
          }
        });
      } else {
        emid = "10001";
        maxemids.data.push({ comid, emid });
      }
      console.log(emid);
      return emid;
    }
    return {
      maxemids,
      add2EmidStore,
      getNewEmid,
    };
  },
  {
    persist: true,
  }
);
