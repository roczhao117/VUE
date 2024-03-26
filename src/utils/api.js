import axios from "axios";
//const ax=require("axios");
import { ElMessage } from "element-plus";
import route from "../router";
//import qs from 'qs'
import moment from "moment";

Array.prototype.remove = function (val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};
Array.prototype.dicDescs = function (val, id = "itemid", descs = "itemname") {
  if (!val) {
    return;
  }
  for (let item of this) {
    if (item[id] == val) {
      //  console.log('finded...')
      return item[descs];
    }
  }

  return "-";
};
Array.prototype.treeDescs = async function (
  val,
  id = "itemid",
  descs = "itemname"
) {
  if (!val) {
    return;
  }
  let r = "";
  for (let item of this) {
    console.log("tree:", val, item[id]);
    if (val != item[id]) {
      if (item.children) {
        item.children.treeDescs(val, id, descs);
      }
    } else {
      console.log("find......................." + item[descs]);
      r = item[descs];
      break;
    }
    break;
    // return r;
  }
  console.log("rrrrrrrrrrrrrrrrr:", r);
  return r;
};

export const diffdate = function (fromdate, todate = moment(), type = "days") {
  let d = moment(fromdate, "YYYY-MM-DD").diff(todate, type, true);
  return d;
};
/**
 * 判断用户指定日期是否在区间内。
 * @param {*} fromdate
 * @param {*} todate
 * @param {*} userdate
 * @returns
 * 0:在职
 * 1:离职
 * 2:离职中，申请中
 */
export const chkBtdt = function (todate, userdate = moment()) {
  //    let sameF = moment(fromdate, "YYYY-MM-DD").isSame(userdate);

  //  let sameT = moment(todate, "YYYY-MM-DD").isSame(userdate);
  let aF = moment(todate, "YYYY-MM-DD").isAfter(userdate);

  //    let aT = moment(todate, "YYYY-MM-DD").isAfter(userdate);

  //    let bF = moment(fromdate, "YYYY-MM-DD").isBefore(userdate);
  let bT = moment(todate, "YYYY-MM-DD").isBefore(userdate);

  if (aF) {
    return 2;
  }
  if (bT) {
    return 1;
  }

  return 0;
};

const tree = function (data, val, fldid, flddescs) {
  let r = "-";
  for (let item of data) {
    console.log("tree:", val, item[fldid]);
    if (val != item[fldid]) {
      if (item.children) {
        tree(item.children, val, fldid, flddescs);
      }
    } else {
      console.log("find.......................");
      r = item[flddescs];
      break;
    }
  }
  console.log("我已经返回了，");
  return r;
};
Array.prototype.treeX = async function (
  val,
  id = "itemid",
  descs = "itemname"
) {
  if (!val) {
    return;
  }
  let r = await tree(this, val, id, descs);
  console.log("r=", r);
  return r;
};

axios.interceptors.request.use((config) => {
  const cloginroute = route.currentRoute.value.name;
  // console.log(config)
  if (cloginroute) {
    if (cloginroute.toUpperCase().trim() == "LOGIN") {
      return config;
    }
    // console.log(config, route.currentRoute.value.name.toUpperCase().trim() == "LOGIN");
    //if (config.data.userinfo &&  )
  }
  if (window.localStorage.getItem("token")) {
    config.headers.token = window.localStorage.getItem("token");
  }

  return config;
});

axios.interceptors.response.use(
  (success) => {
    if (success.status && success.status == 200) {
      if (
        success.data.code == 500 ||
        success.data.code == 401 ||
        success.data.code == 402
      ) {
        ElMessage.error({
          message: success.data.message,
        });
        return;
      }
      if (success.status && success.data.code == 4000) {
        //4000 就是系统逻辑错误，故意设置的。
        ElMessage.error({
          message: success.data.message,
        });

        return;
      }

      //
      if (success.status && success.data.code == 9999) {
        //9999 用户账号验证失败
        ElMessage.error({
          message: success.data.message,
        });

        route.replace("/");
      }

      if (success.data.message) {
        ElMessage.success({
          message: success.data.message,
        });
      }
      return success.data;
    }
  },
  (error) => {
    console.log("no code,please check error", error.message);
    if (error.response.code == 504 || error.response.code == 404) {
      ElMessage.error({
        message: "servers has down!",
      });
    } else if (error.response.code == 403) {
      ElMessage.error({
        message: "miss permission.",
      });
    } else if (error.response.code == 401) {
      ElMessage.error({
        message: "Please login in first.",
      });
      route.replace("/");
    } else if (error.response.code == 400) {
      ElMessage.error({
        message: "请求错误.",
      });
    } else {
      if (error.response.data.message) {
        ElMessage.error({
          message: error.response.data.message,
        });
      } else {
        ElMessage.error({
          message: "unkonwn error.",
        });
      }
      return;
    }
  }
);

// const base = 'http://localhost:7001';
const base = "http://localhost:3000/specicwp/";

export const AX = (method, url, data) => {
  return axios({
    method,
    url: `${base}${url}`,
    // data: qs.stringify(data),
    data,
  });
};
