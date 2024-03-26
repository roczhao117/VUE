<template>
  <rep :data="data" :flds="flds" :file="file"></rep>
</template>

<script setup>
import rep from "./reptmpl.vue";
import { useRightStore } from "../../../store/index";

const userstore = useRightStore();
const block = {};
block.prcalgrp = "1";
block.rid = userstore.getUser(false).rid;
block.prstop = 0;

const data = AX("get", "prstaff?pagesize=500&block=${block}").then((e) => {
  console.log(e);
});

// const data = [
//   { emid: "111", name: "1111", dept: "1111", comid: "1111", salary: 7000 },
//   { emid: "112", name: "1112", dept: "1112", comid: "1112", salary: 4000 },
//   { emid: "113", name: "1113", dept: "1111", comid: "1111", salary: 5000 },
//   { emid: "114", name: "1114", dept: "1112", comid: "1112", salary: 6000 },
// ];

const flds = {
  showflds: ["rct", "emid", "name", "salary"],
  grpflds: ["comid", "dept"],
  sumflds: ["salary"],
  //这里顺序很重要，特别是showflds中不显示，但是却组的字段
  //他不是按照grpflds来排序的，而是根据组再showflds中的位置，sumgrp字段
  //或者fldprop的前后次序来排的，这个需要更正，不然不方便。必须更正，否则
  //界面上就不能根据设置来排序。
  fldprop: [
    { fld: "rct", descs: "#", width: 3, sort: 0 },
    { fld: "emid", descs: "工号", width: 8 },
    { fld: "name", descs: "姓名", width: 4 },
    { fld: "dept", descs: "部门", width: 4 },
    { fld: "comid", descs: "单位", width: 4 },
  ],
};

const file = {
  //数据源
  dbs: "pr",
  //表头
  title: "薪资明细表1234",
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
};
</script>

<style></style>
