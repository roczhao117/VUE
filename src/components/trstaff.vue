<template>
  <div>
    <!-- 查询头 -->

    <div style="display: flex; margin: 1px; margin-right: 4px">
      <el-tooltip content="刷新数据" placement="top">
        <el-button icon="Refresh" size="small" @click="listMain()"></el-button>
      </el-tooltip>

      <span style="margin-left: 20px">
        <el-select
          v-model="isstopkq"
          placeholder="请考勤人员类型"
          style="width: 100%"
          size="small"
        >
          <el-option
            v-for="item in selkqstafftype"
            :key="item.itemid"
            :label="item.itemname"
            :value="item.itemid"
          ></el-option>
        </el-select>
      </span>

      <el-input
        placeholder="查询员工姓名"
        v-model="inputsearch"
        class="input-with-select"
        v-on:keydown.enter="listMain()"
        size="small"
      >
        <template #append>
          <el-button size="small" icon="search" @click="listMain()"
            >查询</el-button
          >
        </template>
      </el-input>
    </div>
    <!-- 人事表格子 -->
    <div>
      <div
        style="
          margin-left: 2px;
          width: 100%;
          min-width: 600px;
          font-size: 12px;
          padding: 10px;
        "
      >
        <el-table
          :data="tableData"
          style="width: 920px; font-size: 12px; height: 680px"
          v-loading="loading"
          :element-loading-text="loadingContent"
          element-loading-spinner="el-icon-loading"
          :element-loading-background="loadingBackground"
          @selection-change="handleSelectionChange"
          stripe
        >
          <el-table-column prop="id" fixed="left" width="80" type="index">
            <template #default="scope">
              <span>{{
                (page.cpg - 1) * page.limit + (scope.$index + 1)
              }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="emid"
            label="工号"
            width="80"
            fixed="left"
          ></el-table-column>
          <el-table-column
            prop="cname"
            label="中文名"
            width="100"
          ></el-table-column>
          <el-table-column
            prop="ename"
            label="英文名"
            width="120"
          ></el-table-column>
          <el-table-column prop="item" label="课程" width="150">
            <template #default="scope">
              <span>{{ dictritemsData.dicDescs(scope.row.item) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="fromdate"
            label="培训日期"
            width="100"
          ></el-table-column>
          <el-table-column
            prop="time"
            label="培训时间"
            width="80"
          ></el-table-column>
          <el-table-column
            prop="hours"
            label="时长(H)"
            width="80"
          ></el-table-column>

          <el-table-column prop="id" fixed="right" label="操作" width="120">
            <template #default="scope">
              <span class="butgrp">
                <el-tooltip content="修改" placement="top">
                  <el-button
                    size="small"
                    icon="Edit"
                    @click="handleEdit(scope.$index, scope.row)"
                    :disabled="true"
                  ></el-button
                ></el-tooltip>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 翻页控件 -->
    </div>
    <div>
      <el-pagination
        background
        layout="total,prev, pager, next"
        :page-size="page.limit"
        @current-change="changePage"
        :current-page="page.cpg"
        :total="page.counts"
      ></el-pagination>
    </div>
    <div>
      <el-dialog
        v-model="dialogLEVVisibility"
        title="假 单 申 请"
        width="800px"
      >
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { AX } from "../utils/api";
import { ref } from "vue";
import moment from "moment";
import $ from "jquery";
import { stopKQ } from "../utils/comdata";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import otlist from "../components/otlist.vue";
import levlist from "../components/levlist.vue";
import {
  useDeptPosStore,
  useDicStore,
  useUserStore,
  useEmidStore,
  useShiftStore,
} from "../store/index";

export default {
  components: { otlist, levlist },
  setup() {
    const deptstore = useDeptPosStore();
    const dicstore = useDicStore();
    const userstore = useUserStore();
    const emidstore = useEmidStore();
    const shiftstore = useShiftStore();
    return { deptstore, dicstore, userstore, emidstore, shiftstore };
  },
  data() {
    return {
      locale: zhCn,
      dplimit: [],
      fsysid: "123",
      hrData: {},
      calbdt: [],
      caldates: [],
      shifttmps: [],
      shifttmp: "-1", //因为select的默认是sysid，默认sysid是-1
      isstopkq: ref("0"),
      otlevfromdate: "",

      dialogOTVisibility: false,
      dialogLEVVisibility: false,
      //排班信息，从数据库里拿来
      ashiftdata: {},
      //保存的排班信息，从排班界面里得到
      saveshiftdata: {},
      shiftsysids: ref([]),

      multipleSelection: ref([]),
      shifttemplates: [],
      templateid: ref(""),

      loadingContent: "拼命加载中",
      loadingBackground: "rgba(0, 0, 0, 0.8)",

      tableData: [],
      roleData: [],

      selkqstafftype: [],

      pritemData: [],

      loading: false,
      deptVisible: false,

      dictritemsData: [],
      dichrpropsData: [],
      deptChecked: [],

      dichktypeData: [],

      hrnewData: [],
      addvalue: [],

      shiftlst: [],

      dpData: [],
      dpList: [],
      dpProps: {
        label: "deptname",
        level: "deptlevel",
        children: "children",
      },

      inputsearch: "",
      counts: 1,
      cp1: 1,
      formLabelWidth: "200",

      kqinfo: {
        period: "202101",
        fromdate: "2021-01-01",
        todate: "2021-01-01",
        prgrp: "1",
        diffmons: 0,
        currperiod: "202101",
      },

      prtype: "0",

      cmppwd: "",

      dialogFormVisible: true,

      dialogAddVisible: false,

      dialogApplyTempsVisible: false,

      neworedit: true,

      //这只是初始化数据
      shiftdays: [{ id: "sf01", desc: "01" }],

      page: {
        limit: 15,
        cpg: 1,
        counts: 1,
      },
      s003: "1",
      shifttmpform: {},
      hrform: {
        emid: "",
        cname: "",
        sysid: "",
        datejoined: "",
      },
      form: {
        calperiod: "202401",
        fromdate: "2024-1-1",
        todate: "2024-1-31",
        if_stop: "",
        istemplate: "0",
        remark: "",
      },
      rules: {
        // emid: [{ required: true, message: '请输入 工号', trigger: 'blur' }],
        // jjname: [{ required: true, message: '请输入 紧急联系人', trigger: 'blur' }],
        // jjtele: [{ required: true, message: '请输入 紧急联系人电话', trigger: 'blur' }],
        // mtele: [{ required: true, message: '请输入 电话号码', trigger: 'blur' }],
        // cname: [{ required: true, message: '请输入 中文名', trigger: 'blur', min: 1, max: 32 }],
        // dpname: [{ required: true, message: '请输入 部门职位', trigger: 'blur' }],
        // idcard: [{ required: true, message: '请输入 身份证号(18位)', trigger: 'blur', min: 15, max: 18 }],
        // prosalary: [{
        //     required: true, message: '请输入 试用期工资', trigger: 'blur', pattern: /^(0(.)?\d+|[1-9]\d*(.)?\d*)$/,
        // }],
        // consalary: [{
        //     required: true, message: '请输入 合同工资', trigger: 'blur', pattern: /^(0(.)?\d+|[1-9]\d*(.)?\d*)$/,
        // }],
        // currsalary: [{
        //     required: true, message: '请输入 当前工资', trigger: 'blur', pattern: /^(0(.)?\d+|[1-9]\d*(.)?\d*)$/,
        // }],
        // serveryear: [{
        //     required: true, message: '请输入 入职前工龄月份数', trigger: 'blur', pattern: /^((0)([1-9]{1}[0-9]*))$/,
        // }],
        // housefund: [{
        //     required: true, message: '请输入 公积金基数', trigger: 'blur', pattern: /^(0(.)?\d+|[1-9]\d*(.)?\d*)$/,
        // }],
        // socialbase: [{
        //     required: true, message: '请输入 社保基数', trigger: 'blur', pattern: /^(0(.)?\d+|[1-9]\d*(.)?\d*)$/,
        // }],
      },

      checkoutrules: {
        // reqleavedate: [{ required: true, message: '请输入 离职申请日期', trigger: 'blur' }],
        // checkout: [{ required: true, message: '请输入 离职工作日', trigger: 'blur', }],
        // lastdate: [{ required: true, message: '请输入 最后工作日', trigger: 'blur', }],
        // accledate: [{ required: true, message: '请输入 积假到期日', trigger: 'blur', }],
        // aledate: [{ required: true, message: '请输入 年假到期日', trigger: 'blur', }],
        // acclhoursm: [{
        //     required: true, message: '请输入 结余积假小时数', trigger: 'blur', pattern: /^-?(0|0\.\d*|[1-9]\d*\.?\d*)$/,//正负数
        // }],
        // alhoursm: [{
        //     required: true, message: '请输入 结余年假小时数', trigger: 'blur', pattern: /^-?(0|0\.\d*|[1-9]\d*\.?\d*)$/,//正负数
        // }],
      },
    };
  },
  computed: {
    // s33() { return this.form.s015 }
  },
  mounted() {
    /**
     * 必须在这里初始化日历控件的日期区间，否则排班的弹出框报错
     */
    //   this.calbdt = [new Date(2023, 12, 21), new Date(2024, 1, 20)];

    /**这里必须定义为假，默认情况是真，真的意思是让他显示至少一次，这样可以吧组件构建完成，不会导致第一次打开的时候是空 */
    this.dialogFormVisible = false;
    /***************************************************************** */
    this.getdic();
  },
  watch: {
    // form(val) {
    // }
  },
  methods: {
    cusRules() {
      let done = true;
      for (let ele of this.pritemData) {
        const reg = /[sS]{1}\d{3}/g;
        const moneyreg =
          /(^[1-9]([0-9]+)?(\.[0-9]{1,4})?$)|(^(0){1}$)|(^(0){1}\.[0-9]+$)|(^[0-9]\.[0-9]([0-9])?$)/;
        if (ele.prid.match(reg)) {
          let v = this.form[ele.prid];
          if (!v.match(moneyreg) && !ele.prfur) {
            $("#" + ele.prid).css("background-color", "red");
            done = false;
            break;
          } else if (v.match(moneyreg) && !ele.prfur) {
            $("#" + ele.prid).css("background-color", "white");
          }
        }
      }
      return done;
    },

    changeprtype() {
      this.listMain();
    },

    changeacc() {
      // console.log(this.form)
    },

    handleDelete(idx, row, if_stop) {
      let if_stop_mesg = "停发";
      if (if_stop == "0") {
        if_stop_mesg = "发放";
      }

      this.$confirm(
        "此操作将" + if_stop_mesg + "该人当月的薪资, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          AX("patch", "/prstaff/" + row.id, { if_stop: if_stop }).then(
            (res) => {
              if (res) {
                this.listMain();
              }
            }
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    handleSelectionChange(val) {
      this.multipleSelection.value = val;
      console.log(this.multipleSelection);
    },
    saveForm(istemplate) {
      //  let data = [];

      // console.log(this.saveshiftdata);
      // console.log(this.ashiftdata);
      const currdate = moment().format("YYYY-MM-DD");
      Object.keys(this.saveshiftdata).forEach((k) => {
        let dt = moment(k.substring(1)).format("YYYY-MM-DD");
        let diffdays = moment(currdate).diff(dt, "day");
        let sf = k.substring(1) + "#sf" + k.substring(7);
        let msf = k.substring(1) + "#msf" + k.substring(7);
        let dmsf = k.substring(1) + "#dmsf" + k.substring(7);
        // console.log(
        //   k,
        //   currdate,
        //   dt,
        //   diffdays,
        //   sf,
        //   msf,
        //   dmsf,
        //   this.saveshiftdata[k]
        // );

        if (diffdays < 0) {
          //未来
          this.ashiftdata[sf] = this.saveshiftdata[k];
        } else {
          //过去
          if (this.ashiftdata[sf]) {
            this.ashiftdata[dmsf] = "改";
          } else {
            this.ashiftdata[dmsf] = "补";
          }
          this.ashiftdata[msf] = this.saveshiftdata[k];
        }
      });

      // console.log(this.ashiftdata);

      let aft = this.kqinfo.fromdate.split("-").slice(0, 2).join("");
      let att = this.kqinfo.todate.split("-").slice(0, 2).join("");

      const a = {};
      const b = {};

      for (let dt of [aft, att]) {
        Object.keys(this.ashiftdata).forEach((k) => {
          // console.error(dt, k);
          if (dt == k.substring(0, dt.length)) {
            var reg = /\d+(.*)#/gim;
            if (dt == aft) {
              a[k.replace(reg, "")] = this.ashiftdata[k];
            }
            if (dt == att) {
              b[k.replace(reg, "")] = this.ashiftdata[k];
            }
          }
        });
      }
      // console.log(a, b);

      //------------------------------------------------------
      //默认保存按钮不做任何模版处理，原来是模块的就是，原来不是的仍然不是。
      //模版一定是1，取消模版后一定是0，（0）也是默认。-1为不做模版处理。
      if (istemplate == 1) {
        //3月表示3月1日到3月31日，也可以表示为 3月21日到4月20日。
        a.istemplate = istemplate;
        a.tempfrom = this.kqinfo.fromdate;
        a.tempto = this.kqinfo.todate;
        //firstmonth就行了，secondmonth默认，也许他是下一个月的模版月。
      }
      //-------------------------------------------------------

      let updatedata = [];
      updatedata.push(a);
      updatedata.push(b);

      console.log(updatedata);

      AX("post", "kqinfo/updateashift", updatedata).then((res1) => {
        if (res1) {
          console.log(res1);

          this.dialogFormVisible = false;
          //this.addvalue = [];
          this.listMain();
        }
      });
    },

    cmd_lev(fromdate) {
      this.otlevfromdate = fromdate;
      this.dialogLEVVisibility = true;
      console.log("lev", fromdate);
    },

    activeActivity(stopkq, idx, row) {
      console.log(stop, idx, row);
      AX("patch", `hrinfo/${row.id}`, { stopkq }).then((res1) => {
        if (res1) {
          this.listMain();
        }
      });
    },

    formatisstop(row) {
      return row.is_stop == 0 ? "No" : "STOP";
    },

    handleEdit(index, row) {
      this.hrform.emid = row.emid;
      this.hrform.cname = row.cname;
      this.hrform.datejoined = row.datejoined;
      this.hrform.sysid = row.sysid;

      this.needshow = true;
      //必须是-1，否则模版下拉框会默认上一个操作
      this.shifttmp = "-1";
      //这是保存的数据，必须清空。
      this.saveshiftdata = [];
      this.shiftlst = [];

      let block = {};

      block.fromdate = this.kqinfo.fromdate;
      block.todate = this.kqinfo.todate;

      block.sysid = row.sysid;

      block = encodeURI(JSON.stringify(block));

      this.shiftlst = this.shiftstore.getsftByDept(row.dept);

      // console.log("--------------------------------", this.shiftlst, row.dept);
      AX("get", `kqinfo/ashift/info?block=${block}`).then((res) => {
        if (res && res.total > 0) {
          this.neworedit = false;
          this.ashiftdata = {};

          for (let i = 0; i < res.total; i++) {
            Object.keys(res.data[i]).forEach((K) => {
              let k = res.data[i]["shiftdate"] + "@" + K + "#" + K;
              let v = res.data[i][K];
              k = k.replace(/(@sf)|(@msf)|(@dmsf)|(@msts)/gim, "");

              this.ashiftdata[k] = v;
            });
          }

          console.log(this.ashiftdata);
        }
        this.loading = false;
        this.dialogFormVisible = true;
      });
    },

    changePage(idx) {
      this.page.cpg = idx;
      this.listMain();
    },

    getdic(type = "hr") {
      this.loading = true;

      this.dictritemsData = this.dicstore.getDic("tritems");

      if (type == "hr") {
        this.selkqstafftype = stopKQ;
        // AX("get", "/dicm/hrgrade")
        //   .then((res) => {
        //     this.dichrgradeData = res.data;
        //     // console.log(res.data)
        //     //this.showdesc(res.data, 'hrgrade_13', 'itemid', 'itemname')
        //     // console.log(res.data.dicDescs('hrgrade_13'));
        //   })
        //   .catch((e) => console.log(e.message));
        this.dichrgradeData = this.dicstore.getDic("hrgrade");

        // AX("get", "/dicm/hrtype")
        //   .then((res) => {
        //     this.dichrtypeData = res.data;
        //   })
        //   .catch((e) => console.log(e.message));

        this.dichrtypeData = this.dicstore.getDic("hrtype");

        // AX("get", "/dicm/hrstatus")
        //   .then((res) => {
        //     this.dichrstatusData = res.data;
        //   })
        //   .catch((e) => console.log(e.message));

        this.dichrstatusData = this.dicstore.getDic("hrstatus");

        // AX("get", "/dept")
        //   .then((res) => {
        //     this.dpData = res.data;
        //     this.flattenTree(res.data);
        //   })
        //   .catch((e) => console.log(e.message));

        // this.dpData = this.deptstore.deptposData.data;
        // this.flattenTree(this.dpData);
        // AX("get", "/dicm/hrprops")
        //   .then((res) => {
        //     this.dichrpropsData = res.data;
        //   })
        //   .catch((e) => console.log(e.message));
        this.dichrpropsData = this.dicstore.getDic("hrporps");
      }

      this.loading = false;
    },

    closedialog() {
      this.needshow = false;
    },

    closelevlistform() {
      this.dialogLEVVisibility = false;
    },

    listMain() {
      if (!this.inputsearch) {
        this.$message.error("请输入需要查询员工姓名！");
        return;
      }

      this.loadingContent = "拼命加载中";
      this.loadingBackground = "rgba(0, 0, 0, 0.8)";
      this.loading = true;
      let block = {};

      let depts = [];

      this.deptChecked.forEach((item) => {
        depts.push(item.deptid);
      });

      block.dept = depts;
      block.stopkq = this.isstopkq;
      block.shiftdate = this.kqinfo.period;
      block.fromdate = this.kqinfo.fromdate;
      block.todate = this.kqinfo.todate;
      block.name = this.inputsearch;
      block = encodeURI(JSON.stringify(block));

      AX(
        "get",
        "trstaff/byname?page=" +
          this.page.cpg +
          "&pagesize=" +
          this.page.limit +
          "&block=" +
          block
      ).then((res) => {
        if (res && res.total >= 0) {
          this.tableData = [];
          this.tableData = res.data;
          this.page.counts = Number(res.total);

          // console.log("dddddddddddddddddddddd", res.data);
        }

        this.loading = false;
      });
    },
  },
};
</script>
<style scoped>
.transfer {
  color: red;
  text-align: left;
}

.input-with-select {
  width: 360px;
  margin-left: 10px;
}
div.el-calendar-day {
  padding: 0px;
  background-color: red;
  border: 0;
  color: red;
}
.iscompany {
  padding: 2px 6px;
  cursor: pointer;
  font-size: 12px;
  background-color: rgb(0 107 255 / 59%);
  color: rgb(250, 250, 250);
  border: 0;
}
.isdept {
  padding: 2px 6px;
  cursor: pointer;
  font-size: 12px;
  background-color: transparent;
  border: 0;
  color: rgb(66 66 66 / 71%);
}
.ispos {
  padding: 2px 6px;
  cursor: pointer;
  font-size: 12px;

  color: rgb(167 167 167);
  background-color: #5192eb1a;
}
.el-divider i {
  color: #409eff;
}
.pdmsg {
  margin-left: 1px;
  background-color: none;
  color: rgb(192, 192, 192);
  font-weight: normal;
  font-size: 12px;
}

.companyflag {
  margin-left: 1px;
  color: #ebb563;
  font-weight: normal;
  font-size: 14px;
}

.selectdt_hid {
  visibility: hidden;
}
.otlevgrp {
  display: flex;
  justify-content: right;
  float: right;
}
.otlevgrp .el-button {
  margin: 1px;
  background-color: #f7f7f7;
  border: 1;
  height: 0;
  width: 0;
}
</style>
