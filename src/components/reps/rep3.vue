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
import { useUserStore } from "../../store/index";
import { reactive, ref, watch } from "vue";
const data = reactive({ items: [] });
const userstore = useUserStore();
let ischanged = ref(0);

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
watch(
  () => [props.ischanged],
  (newVal, oldVal) => {
    console.log("监听基本类型数据");
    console.log("new", newVal);
    console.log("old", oldVal);
    console.log("props.data---------------", props.data);
    ini_data(props.data);
  },
  {
    //必须有这个东西，如果监控的是对象的话。
    deep: true,
  }
);

const ini_data = (data) => {
  const code1 = JSON.parse(data.code1);

  file = code1["file"];
  flds["flds"] = code1["flds"];
  flds["condi"] = code1["condi"] ? code1["condi"] : [];
};

let file = {
  //数据源
  dbs: "pr",
  //表头
  title: "薪资明细表",
  //薪资明细报表
  repname: "薪资明细报表",
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

let flds = {
  showflds: ["rct", "emid", "cname"],
  grpflds: [],
  sumflds: [],
  condi: { stop: [0] },
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
};

const getData = async () => {
  data.items.splice(0, data.items.length);
  const block = {};
  block.prcalgrp = "1";
  block.rid = userstore.getUser(false).rid;
  block.prstop = 0;

  await AX("get", `prstaff?pagesize=500&block=${JSON.stringify(block)}`).then(
    (res) => {
      console.log("==============", res, res.total > 0);
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
      ischanged.value += 1;
    }
  });
};

const loaddata = async () => {
  await getData();
};
</script>

<style></style>
