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

    let dictree = reactive({
      data: [],
    });

    function getDic(dicmid, fid = "", isActive = true) {
      const t = reactive({
        data: [],
      });

      if (dicmid) {
        dic.data.map((item) => {
          if (item.dicmid.toLowerCase().trim() == dicmid.toLowerCase().trim()) {
            if (isActive) {
              if (item.isactive) {
                if (fid) {
                  if (
                    item.fid.toLowerCase().trim() ==
                    fid.toLocaleLowerCase().trim()
                  ) {
                    t.data.push(item);
                  }
                } else {
                  t.data.push(item);
                }
              } else {
                t.data.push(item);
              }
            } else {
              t.data.push(item);
            }
          }
        });
      }
      return t.data;
    }

    function treedic(item, limitLevel) {
      let children = [];
      // console.log("ddddd--->", item.itemname, item.level, item);
      // delete item.children;
      for (var i = 0; i < dic.data.length; i++) {
        if (
          dic.data[i].fid == item.itemid &&
          dic.data[i].dicmid == item.dicmid &&
          Number(item.level) < Number(limitLevel)
        ) {
          let el = dic.data[i];
          el.level = item.level + 1;
          children.push(el);
          item["children"] = children;

          treedic(el, limitLevel);
        }
      }
    }

    /**
     * 这是得到dic中的树状图。
     * 设计:DICMID还是主，通过主来递归所有子。
     * 比如dicmid为培训课程，那么dic中有课程组，还有课程。也可以一直递归下去，但一般两步足够，组和项目。
     * 例如：dicmid 是指培训课程，dic 中可以建立课程组，课程组下可以建立课程。
     * @param {*} dicmid 递归的组。
     * @param {*} descs  可以给根一个名字。
     * @param {*} limitLevel 表示递归的级数，0表示无限制。
     * @param {*} isActive 只递归激活的项目
     * @returns
     */
    function getDicTree(dicmid, descs = "", limitLevel = 999, isActive = true) {
      dictree.data = [];
      let rootobj = {};
      rootobj.itemid = dicmid;
      rootobj.itemname = descs;
      rootobj.level = 0;
      rootobj.dicmid = "0";
      let rootcld = [];

      if (dicmid) {
        for (let item of dic.data) {
          if (item.fid == dicmid && item.dicmid == dicmid) {
            // console.log("这是第一次进入", item.itemname, item);
            item.level = 1;
            let el = item;
            // delete el.children;
            if (limitLevel != 0 && el.level <= limitLevel) {
              if (isActive) {
                if (el.isactive) {
                  treedic(el, limitLevel);
                }
              } else {
                treedic(el, limitLevel);
              }
              // console.log("::::::::::::::::::::", el);
              rootcld.push(el);
            }
          }
        }
      }
      // console.log(
      //   "111111",
      //   rootcld,
      //   "222",
      //   rootobj,
      //   "33333333333333",
      //   dictree.data
      // );
      rootobj.children = rootcld;
      // console.log("111111", rootcld);
      dictree.data.push(rootobj);
      // console.log("0000000000000000", rootobj);

      return dictree;
    }

    function add2DicStore(dicmid = "-1", data) {
      if (dicmid == "-1") {
        dic.data.splice(0, dic.data.length);

        dic.data = [...data];
      }

      if (dicmid != "-1" && data) {
        for (let i = 0; i < dic.data.length; i++) {
          if (
            dic.data[i].dicmid.toLowerCase().trim() ==
            dicmid.toLowerCase().trim()
          ) {
            //vue 中的  splice(index,len,[item])
            //SPLICE 不会删除最后一个元素，所以当有删除的时候，需要用for循环，而不是foreach。
            //必须有 i--
            // console.log("kill", i, dic.data[i].itemname);
            dic.data.splice(i, 1);
            i--;
          }
        }

        // console.log(dic.data, ...data);
        dic.data.push(...data);
      }

      // for (let i = 0; i < dic.data.length; i++) {
      //   if (
      //     dic.data[i].dicmid.toLowerCase().trim() == dicmid.toLowerCase().trim()
      //   ) {
      //     console.log("update", i, dic.data[i].itemname);
      //   }
      // }
    }

    /**
     * 这个功能是为了从数据库里刷新指定数据。特别是树状的数据。
     * 场景： 再修改并保存培训课程和绩效课程的时候，因为数据是保存再DIC中，而dic中包括了全部的参数。这时候用add2dicstore直接刷新数据
     * 的时候，会把全部数据刷新进去，等于是从数据库把DIC所有的数据从新刷提取一次，这是没有必要的。
     * 办法：可以通过指定dicmid，对指定的数据进行删除，再加入到pinia中，从新得到新的数据，而这一操作实际上联系到和数据库同步的操作。
     * 这个动作需要3步操作，1：清空指定数据 2：从数据库刷数据到pinia中 3：再从pinia中获取数据，更新到页面上，这里通过refreshdb这个操作也
     * 统一处理。
     * @param {} dicmid
     */
    async function refreshDB(dicmid) {
      const data = await AX("get", `dic/dicmid/${dicmid}?page=1&pagesize=8000`);

      add2DicStore(dicmid, data.data);

      // return getDicTree(dicmid);
    }

    return {
      dic,
      add2DicStore,
      getDic,
      getDicTree,
      refreshDB,
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

    let deptData = reactive({
      data: [],
    });

    function getDeptPos(deptid = -1, hookPos = true) {
      const t = reactive({
        data: [],
      });

      if (deptid) {
        if (hookPos) {
          deptposData.data.map((item) => {
            if (
              item.deptid.toLowerCase().trim() == deptid.toLowerCase().trim()
            ) {
              t.data.push(item);
            }
          });
        } else {
          deptData.data.map((item) => {
            if (
              item.deptid.toLowerCase().trim() == deptid.toLowerCase().trim()
            ) {
              t.data.push(item);
            }
          });
        }
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

    function add2DeptStore(deptid = "-1", data) {
      if (deptid == "-1") {
        deptData.data.splice(0, deptData.data.length);
        deptData.data = [...data];
      }
    }

    return {
      deptposData,
      deptData,
      add2DeptPosStore,
      getDeptPos,
      add2DeptStore,
    };
  },
  {
    persist: true,
  }
);

/**
 * 这是所有角色设置的权限表。
 */
export const useRightStore = defineStore(
  "right",
  () => {
    const rightData = reactive([]);

    function add2RightStore(data) {
      rightData.splice(0, rightData.length);
      if (data && data.length > 0) {
        rightData.push(...data);
      }
    }
    /**
     *
     * @param {*} type 权限的类型，比如 hrgrade,dept
     * @param {*} isdicData 用来过滤的dic中的数据，比如grade，hrtype
     * @returns
     */
    function getRightStore(type = "-1", isdicData = true) {
      const dicstore = useDicStore();
      let dicData = reactive([]);
      const Data = reactive([]);
      /**如果从dic中得到的数据来赛选，比如是hrgrade，
       * 1：那么可以从dic中取出hrgrade的全部数据，
       * 2：type不能为-1，必须是dic中明确的数据。
       */
      if (isdicData && type !== "-1") {
        dicData.splice(0, dicData.length);
        dicData = dicstore.getDic(type);
      }
      /***************************************** */
      if (type != "-1") {
        rightData.forEach((el) => {
          // console.log(el.aid);
          if (el.type.toLowerCase().trim() == type.toLowerCase().trim()) {
            if (dicData && dicData.length > 0) {
              dicData.forEach((item) => {
                if (
                  el.aid.toLowerCase().trim() ==
                  item.itemid.toLowerCase().trim()
                ) {
                  Data.push(item);
                }
              });
            } else {
              Data.push(el["aid"]);
            }
          }
        });
        return Data;
      }
      return rightData;
    }

    return {
      rightData,
      getRightStore,
      add2RightStore,
    };
  },
  {
    persist: true,
  }
);
/**
 * 这是通过名字存储。
 */
export const usePermissionStore = defineStore(
  "permission",
  () => {
    const pmsData = reactive([{ name: "", data: [] }]);
    let isFind = false;
    function add2PMSStore(name, data) {
      for (let p of pmsData) {
        if (p.name == name) {
          p.data.slice(0, p.data.length);
          p.data.push(...data);
          isFind = true;
        }
      }
      if (!isFind) {
        pmsData.push({ name: name, data: data });
      }
    }
    function getPMSStore(name) {
      for (let p of pmsData) {
        if (p.name == name) {
          return p.data;
        }
      }
      return null;
    }
    return {
      pmsData,
      add2PMSStore,
      getPMSStore,
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
