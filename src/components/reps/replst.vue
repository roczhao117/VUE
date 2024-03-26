<template>
  <rep
    :data="data.items"
    :flds="flds"
    :file="file"
    :ischanged="ischanged"
    @loaddata="loaddata"
  ></rep>
</template>

<script setup>
import rep from "./templates/reptmpl.vue";
import { AX } from "../../utils/api";
import { hrStatus } from "../../utils/comdata";
import {
  useUserStore,
  useDicStore,
  useDeptPosStore,
  useRightStore,
} from "../../store/index";
import { reactive, ref, watch } from "vue";
const data = reactive({ items: [] });
const userstore = useUserStore();
let ischanged = ref(0);
let isdesignReport = ref(true);
let dpList = [];
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  ischanged: {
    type: Number,
    required: true,
  },
});

let file = {
  //数据源
  dbs: "pr",
  //表头
  title: "薪资表",
  //薪资明细报表
  repname: "薪资报表",
  //保存时候的权限
  right: "0",
  //保存时候的签名
  signs: ["制表人", "审核人", "人事部", "财务部", "业主代表", "总经理"].join(
    ","
  ),
  //一行有几个签名，多个签名的时候，可以控制一行有几个签名，比如默认是3，就是一行3个，一共2行
  signbyrow: 3,
  rowheight: 0,
};

let otheropts = {
  sumgrp: "foot",
  showData: true,
  showGrpHead: true,
  showGrpFoot: true,
  eachRowHead: false,
  showGrpFootTitle: true,
  showGrpHeadTitle: true,
};
let flds = {
  showflds: ["rct", "emid", "cname"],
  grpflds: [],
  sumflds: [],
  condi: {},
  otheropts,
  //这里顺序很重要，特别是showflds中不显示，但是却组的字段
  //他不是按照grpflds来排序的，而是根据组再showflds中的位置，sumgrp字段
  //或者fldprop的前后次序来排的，这个需要更正，不然不方便。必须更正，否则
  //界面上就不能根据设置来排序。
  fldprop: [
    { fld: "rct", descs: "#", width: 3, sort: 0 },
    { fld: "emid", descs: "工号", width: 0 },
    { fld: "cname", descs: "中文名", width: 0 },
    { fld: "ename", descs: "英文名", width: 0 },
    { fld: "grade", descs: "级别", width: 0 },
    { fld: "dept", descs: "部门", width: 0 },
    { fld: "comid", descs: "单位", width: 0 },
  ],
};
function ini_data(data) {
  // ischanged.value = Math.random() * 100;
  if (data) {
    if (data.code1) {
      //如果报表来自于非设计，设计中没有对象
      isdesignReport.value = false;
      const code1 = JSON.parse(data.code1);

      file = code1["file"];

      flds["flds"] = code1["flds"];
      flds["condi"] = code1["condi"] ? code1["condi"] : [];
      flds["otheropts"] = code1["opts"] ? code1["opts"] : flds.otheropts;
      flds["grpflds"] = code1["grpflds"] ? code1["grpflds"] : flds.grpflds;
      flds["sumflds"] = code1["sumflds"] ? code1["sumflds"] : flds.sumflds;
    } else {
      //这是设计报表传进来的参数
      file = data.file;
      isdesignReport.value = true;
    }
    console.log("isdesignReport:", isdesignReport.value);
  }
  //这里是指，如果打开的报表页面的时候，就给她一个100内的随机数，
  //用这个数字来先让reptmpl.vue这个组件的watch能够拦截到有页面打开了，
  //并能清除留下的数据，不然会保留原来打开的数据，需要点刷新才能，这样不太友好。
  ischanged.value = Math.floor(Math.random() * 100) + 1;
  //------------------------------------------------
}
watch(
  () => [props.ischanged],
  async (newVal, oldVal) => {
    console.log("监听报表数据");
    console.log("new", newVal);
    console.log("old", oldVal);
    //如果父，点击了报表就会传递值过来，先
    //默认是设计状态
    isdesignReport.value = true;
    //如果传过来的是报表信息，如果是成表，那么就是数据库来的，有完整的数据
    //如果不是，而是点了设计的表，他需要获得初始的file对象文件，并作为默认对象。
    ini_data(props.data);
    //直接从信息中获得表的信息。
    // getData(file.dbs);
  },
  {
    //必须有这个东西，如果监控的是对象的话。
    deep: true,
    immediate: true,
  }
);

async function getData(dbs) {
  data.items.splice(0, data.items.length);
  //更具dbs的值来判断，如果是pr，就是prdata，用switch来设置。

  switch (dbs) {
    case "pr":
      await prData();
      break;
    case "hr":
      await hrData();
      break;
    default:
      break;
  }
  //这里设置随机数再1000以上，因为100内的，认为是清空原来数据的。
  //下载数据的时候必须是1000以上的。
  ischanged.value = Math.floor(Math.random() * 1000) + 100;
  console.log("ischanged:", ischanged.value);
  return;
}

function setDefault(std) {
  file = std.file;
  otheropts = std.otheropts;
  flds = { ...std.flds };
}

const prstd = {
  file: {
    //数据源
    dbs: "pr",
    //表头
    title: "薪资表",
    //薪资明细报表
    repname: "薪资报表",
    //保存时候的权限
    right: "0",
    //保存时候的签名
    signs: ["制表人", "审核人", "人事部", "财务部", "业主代表", "总经理"].join(
      ","
    ),
    //一行有几个签名，多个签名的时候，可以控制一行有几个签名，比如默认是3，就是一行3个，一共2行
    signbyrow: 3,
    rowheight: 0,
  },
  otheropts: {
    sumgrp: "foot",
    showData: true,
    showGrpHead: true,
    showGrpFoot: true,
    eachRowHead: false,
    showGrpFootTitle: true,
    showGrpHeadTitle: true,
  },
  flds: {
    showflds: ["rct", "emid", "cname"],
    grpflds: [],
    sumflds: [],
    condi: {},
    otheropts,
    //这里顺序很重要，特别是showflds中不显示，但是却组的字段
    //他不是按照grpflds来排序的，而是根据组再showflds中的位置，sumgrp字段
    //或者fldprop的前后次序来排的，这个需要更正，不然不方便。必须更正，否则
    //界面上就不能根据设置来排序。
    fldprop: [
      { fld: "rct", descs: "#", width: 3, sort: 0 },
      { fld: "emid", descs: "工号", width: 0 },
      { fld: "cname", descs: "中文名", width: 0 },
      { fld: "grade", descs: "级别", width: 0 },
      { fld: "dept", descs: "部门", width: 0 },
      { fld: "comid", descs: "单位", width: 0 },
    ],
  },
};
async function prData() {
  const block = {};
  block.prcalgrp = "1";
  block.rid = userstore.getUser(false).rid;
  block.prstop = 0;

  console.log("==============", isdesignReport.value);
  //如果是点击设计报表，必须把内容变成默认的。
  //因为报表上更改的数据被会保留下来，这个很麻烦。
  if (isdesignReport.value) {
    setDefault(prstd);
  }
  console.log("prstd", prstd, "file", file, "flds", flds);
  //------------------------
  await AX("get", `prstaff?pagesize=500&block=${JSON.stringify(block)}`).then(
    (res) => {
      //   console.log("==============", res, res.total > 0);
      data.items.splice(0, data.items.length);
      if (res.total > 0) {
        data.items.push(...res.data);
      }
    }
  );
  await AX("get", `pritem/findbycalgrpall/${block.prcalgrp}`).then((res) => {
    // console.log("==============", res, res.total > 0);
    if (res.total > 0) {
      res.data.forEach((pritem) => {
        if (pritem.is_show == 1) {
          let obj = {};
          obj.fld = pritem.prid;
          obj.descs = pritem.prname;
          flds.fldprop.push(obj);
        }
      });
    }
  });

  return;
}

const hrstd = {
  file: {
    //数据源
    dbs: "hr",
    //表头
    title: "人事表",
    //薪资明细报表
    repname: "人事报表",
    //保存时候的权限
    right: "0",
    //保存时候的签名
    signs: ["制表人", "审核人", "人事部", "财务部", "业主代表", "总经理"].join(
      ","
    ),
    //一行有几个签名，多个签名的时候，可以控制一行有几个签名，比如默认是3，就是一行3个，一共2行
    signbyrow: 3,
    rowheight: 0,
  },
  otheropts: {
    sumgrp: "foot",
    showData: true,
    showGrpHead: true,
    showGrpFoot: true,
    eachRowHead: false,
    showGrpFootTitle: true,
    showGrpHeadTitle: true,
  },
  flds: {
    showflds: ["rct", "emid", "cname"],
    grpflds: [],
    sumflds: [],
    condi: {},
    otheropts,
    //这里顺序很重要，特别是showflds中不显示，但是却组的字段
    //他不是按照grpflds来排序的，而是根据组再showflds中的位置，sumgrp字段
    //或者fldprop的前后次序来排的，这个需要更正，不然不方便。必须更正，否则
    //界面上就不能根据设置来排序。
    fldprop: [
      { fld: "rct", descs: "#", width: 3, sort: 0 },
      { fld: "emid", descs: "工号", width: 0 },
      { fld: "cname", descs: "中文名", width: 0 },
      { fld: "grade", descs: "级别", width: 0 },
      { fld: "dept", descs: "部门", width: 0 },
      { fld: "comid", descs: "单位", width: 0 },
      { fld: "spellname", descs: "拼音" },
      { fld: "idcard", descs: "身份号码" },
      { fld: "idcardaddress", descs: "身份证地址" },
      { fld: "sex", descs: "性别" },
      { fld: "birth", descs: "生日" },
      { fld: "birthmonth", descs: "生日月份" },
      { fld: "marry", descs: "婚姻状况" },
      { fld: "native", descs: "母语" },
      { fld: "nation", descs: "籍贯" },
      { fld: "education", descs: "学历" },
      { fld: "profileno", descs: "档案号" },
      { fld: "qq", descs: "qq" },
      { fld: "wechat", descs: "微信" },
      { fld: "photo", descs: "照片" },
      { fld: "htele", descs: "家庭电话" },
      { fld: "mtele", descs: "手机号码" },
      { fld: "bp", descs: "短号" },
      { fld: "email", descs: "电邮" },
      { fld: "mz", descs: "名族" },
      { fld: "political", descs: "政治面貌" },
      { fld: "spousename", descs: "配偶名字" },
      { fld: "school", descs: "毕业院校" },
      { fld: "speciality", descs: "专业" },
      { fld: "address", descs: "居住地" },
      { fld: "country", descs: "国家" },
      { fld: "state", descs: "省" },
      { fld: "city", descs: "城市" },
      { fld: "postcode", descs: "邮编" },
      { fld: "position", descs: "职位代码" },
      { fld: "intosociety", descs: "入社会日期" },
      { fld: "datejoined", descs: "入职日期" },
      { fld: "datejoinedav", descs: "有效入职日期" },
      { fld: "regulardate", descs: "转正日期" },
      { fld: "joinedtimes", descs: "入职次数" },
      { fld: "workid", descs: "工卡号" },
      { fld: "lockid", descs: "更衣箱号" },
      { fld: "type", descs: "员工类型" },
      { fld: "source", descs: "员工来源" },
      { fld: "hrstatus", descs: "人事状态" },
      { fld: "commendman", descs: "介绍人" },
      { fld: "locate", descs: "工作地" },
      { fld: "bank1", descs: "银行卡号" },
      { fld: "serveryear", descs: "入职前工龄" },
      { fld: "jjname", descs: "紧急联系人" },
      { fld: "jjrelation", descs: "紧急联系人关系" },
      { fld: "jjtele", descs: "紧急联系人电话" },
      { fld: "jjaddress", descs: "紧急联系人地址" },
      { fld: "jjmtele", descs: "紧急联系人手机" },
      { fld: "jjpostcode", descs: "紧急联系邮编" },
      { fld: "height", descs: "身高CM" },
      { fld: "weight", descs: "体重KG" },
      { fld: "lsight", descs: "左眼视力" },
      { fld: "rsight", descs: "右眼视力" },
      { fld: "shoe", descs: "鞋码" },
      { fld: "dress", descs: "衣服大小" },
      { fld: "smoke", descs: "吸烟" },
      { fld: "hkaddress", descs: "户口地址" },
      { fld: "hktele", descs: "户口地址电话" },
      { fld: "hktype", descs: "户口类型" },
      { fld: "hkfield", descs: "户口所属社区" },
      { fld: "bloodtype", descs: "血型" },
      { fld: "bloodrh", descs: "血型RH" },
      { fld: "bloodfdate", descs: "上次献血日期" },
      { fld: "bloodndate", descs: "下次献血日期" },
      { fld: "if_proba", descs: "是否有无试用期" },
      { fld: "probafrom", descs: "试用期开始" },
      { fld: "probato", descs: "试用期结束" },
      { fld: "prosalary", descs: "试用期工资" },
      { fld: "contype", descs: "合同类型" },
      { fld: "confrom", descs: "合同开始日期" },
      { fld: "conto", descs: "合同结束日期" },
      { fld: "consalary", descs: "合同工资" },
      { fld: "currtype", descs: "货币类型" },
      { fld: "currsalary", descs: "当前工资" },
      { fld: "costid", descs: "成本号" },
      { fld: "benefittype", descs: "社保类型" },
      { fld: "inroom", descs: "住宿员工" },
      { fld: "nokq", descs: "不需要打卡" },
      { fld: "stopkq", descs: "停止考勤" },
      { fld: "stoppr", descs: "停发薪资" },
      { fld: "housefund", descs: "住房公积金" },
      { fld: "socialbase", descs: "社保基数" },
      { fld: "socialid", descs: "社保号码" },
      { fld: "accledate", descs: "积假结束日期" },
      { fld: "acclhoursm", descs: "积假结余小时数" },
      { fld: "aledate", descs: "年假到期日" },
      { fld: "alhoursm", descs: "年假结余小时数" },
    ],
  },
};
async function hrData() {
  const block = {};
  block.prcalgrp = "1";
  block.rid = userstore.getUser(false).rid;
  block.prstop = 0;
  // console.log("==============", isdesignReport.value);
  //如果是点击设计报表，必须把内容变成默认的。
  //因为报表上更改的数据被会保留下来，这个很麻烦。
  if (isdesignReport.value) {
    setDefault(hrstd);
  }
  console.log("hrstd", prstd, "file", file, "flds", flds);
  //------------------------
  await AX("get", `hrinfo?pagesize=500&block=${JSON.stringify(block)}`).then(
    (res) => {
      data.items.splice(0, data.items.length);
      if (res.data) {
        data.items.push(...res.data);
      }
      //更新部门和职位
      dpList.splice(0, dpList.length);
      const deptstore = useDeptPosStore();
      const dicstore = useDicStore();
      flattenTree(deptstore.deptposData.data);
      // console.log(dpList);
      dpList.forEach((dp) => {
        data.items.forEach((d) => {
          if (d.dept == dp.dpid && dp.deptlevel == 1) {
            d.dept = dp.dpname;
          }
          if (d.position == dp.dpid && dp.deptlevel == 2) {
            d.position = dp.dpname;
          }
          if (d.comid == dp.dpid && dp.deptlevel == 0) {
            d.comid = dp.dpname;
          }
        });
      });
      //其他DIC
      data.items.forEach((d) => {
        dicstore.getDic("hrtype").forEach((dic) => {
          if (d.type == dic.itemid) {
            d.type = dic.itemname;
          }
        }); //---------
        dicstore.getDic("hktype").forEach((dic) => {
          if (d.hktype == dic.itemid) {
            d.hktype = dic.itemname;
          }
        }); //---------
        dicstore.getDic("1").forEach((dic) => {
          if (d.marry == dic.itemid) {
            d.marry = dic.itemname;
          }
        }); //---------
        dicstore.getDic("5").forEach((dic) => {
          if (d.education == dic.itemid) {
            d.education = dic.itemname;
          }
        }); //---------

        dicstore.getDic("hrsur").forEach((dic) => {
          if (d.source == dic.itemid) {
            d.source = dic.itemname;
          }
        }); //---------
        dicstore.getDic("contype").forEach((dic) => {
          if (d.contype == dic.itemid) {
            d.contype = dic.itemname;
          }
        }); //---------
        dicstore.getDic("hrgrade").forEach((dic) => {
          if (d.grade == dic.itemid) {
            d.grade = dic.itemname;
          }
        }); //---------
        hrStatus.forEach((s) => {
          if (s.itemid == d.hrstatus) {
            d.hrstatus = s.itemname;
          }
        });

        d.sex = d.sex == 1 ? "男" : "女";
      });
    }
  );
  return;
}

const flattenTree = (treedata) => {
  for (let item of treedata) {
    let node = {};
    node.dpid = item.deptid;
    node.dpname = item.deptname;
    node.fid = item.fid;
    node.is_pos = item.deptlevel == 2 ? true : false;
    node.posgrade = "1";
    node.deptlevel = item.deptlevel;

    dpList.push(node);
    if (item.children) {
      flattenTree(item.children);
    }
  }
};

const loaddata = async () => {
  await getData(file.dbs);
};
</script>

<style></style>
