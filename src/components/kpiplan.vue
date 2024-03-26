<template>
  <div>
    <!-- 查询头 -->

    <div style="display: flex; margin-right: 4px">
      <el-tooltip content="刷新数据" placement="top">
        <el-button icon="Refresh" size="small" @click="listMain()"></el-button>
      </el-tooltip>
      <el-tooltip content="增加绩效计划" placement="top">
        <el-button icon="plus" size="small" @click="addNew()"></el-button>
      </el-tooltip>
      <span style="margin-left: 4px">
        <el-date-picker
          size="small"
          style="width: 110px; margin-left: 4px"
          v-model="searchform.fromdate"
          placeholder="输入绩效开始日期"
        ></el-date-picker>
        <el-date-picker
          size="small"
          style="width: 110px; margin-left: 8px"
          v-model="searchform.todate"
          placeholder="输入绩效结束日期"
        ></el-date-picker>
      </span>

      <el-input
        placeholder="查询课程名称"
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
    <div style="display: flex; margin-top: 10px; height: 650px">
      <div
        style="margin-left: 2px; width: 100%; min-width: 300px; font-size: 12px"
      >
        <el-table
          :data="tableData"
          style="width: 840px; font-size: 12px"
          v-loading="loading"
          :element-loading-text="loadingContent"
          element-loading-spinner="el-icon-loading"
          :element-loading-background="loadingBackground"
          @selection-change="handleSelectionChange"
          stripe
        >
          <el-table-column prop="id" fixed="left" width="60" type="index">
            <template #default="scope">
              <span>{{
                (page.cpg - 1) * page.limit + (scope.$index + 1)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="isactive" label="完结" width="100">
            <template #default="scope">
              <el-tooltip content="点击可切换状态" placement="top">
                <el-button
                  type="info"
                  size="small"
                  v-if="scope.row.isactive == 0"
                  @click="activeActivity(1, scope.$index, scope.row)"
                  >完结</el-button
                >
                <el-button
                  type="warning"
                  size="small"
                  @click="activeActivity(0, scope.$index, scope.row)"
                  v-else
                  >活动中</el-button
                >
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column prop="descs" label="绩效主题" width="150">
          </el-table-column>
          <el-table-column prop="item" label="类型" width="80">
            <template #default="scope">
              <span>{{ dicevatypeData.dicDescs(scope.row.type) }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="fromdate"
            label="开始日期"
            width="100"
          ></el-table-column>
          <el-table-column
            prop="todate"
            label="结束日期"
            width="100"
          ></el-table-column>
          <el-table-column
            prop="remark"
            label="备注"
            width="180"
          ></el-table-column>

          <el-table-column prop="id" fixed="right" label="操作" width="120">
            <template #default="scope">
              <span class="butgrp">
                <el-tooltip content="修改" placement="top">
                  <el-button
                    size="small"
                    icon="Edit"
                    @click="editPlan(scope.$index, scope.row)"
                  ></el-button
                ></el-tooltip>
                <el-tooltip content="绩效员工" placement="top">
                  <el-button
                    size="small"
                    icon="user"
                    @click="editStaff(scope.$index, scope.row)"
                  ></el-button
                ></el-tooltip>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 翻页控件 -->
    <div style="margin-top: 10px; margin-left: 0px">
      <el-pagination
        background
        size="small"
        layout="total,prev, pager, next"
        :page-size="page.limit"
        @current-change="changePage"
        :current-page="page.cpg"
        :total="page.counts"
      ></el-pagination>
    </div>
    <!-- 人事表单 -->

    <!-- 人事新人表单 -->
    <div>
      <el-dialog
        title="绩效计划"
        width="800px"
        v-model="dialogAddVisible"
        @close="closedialog"
      >
        <el-form
          :rules="rules"
          :model="form"
          ref="refform"
          class="margin:0 20px;display:flex;"
          size="small"
        >
          <el-row :gutter="24"
            ><el-col :span="8">
              <el-form-item
                label="代码"
                :label-width="formLabelWidth"
                prop="planid"
              >
                <el-input
                  size="small"
                  v-model="form.planid"
                  autocomplete="off"
                  :disabled="true"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="绩效主题"
                prop="descs"
                :label-width="formLabelWidth"
              >
                <el-input
                  size="small"
                  v-model="form.descs"
                  autocomplete="off"
                ></el-input> </el-form-item
            ></el-col>
            <el-col :span="8">
              <el-form-item
                label="绩效周期"
                prop="type"
                :label-width="formLabelWidth"
              >
                <el-select
                  v-model="form.type"
                  placeholder="请选择类型"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in dicevatypeData"
                    :key="item.itemid"
                    :label="item.itemname"
                    :value="item.itemid"
                  ></el-option>
                </el-select> </el-form-item
            ></el-col>

            <el-col :span="8">
              <el-form-item
                label="开始日期"
                :label-width="formLabelWidth"
                prop="fromdate"
              >
                <el-date-picker
                  v-model="form.fromdate"
                  autocomplete="off"
                  size="small"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  placeholder="开始日期"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="结束日期"
                :label-width="formLabelWidth"
                prop="fromdate"
              >
                <el-date-picker
                  v-model="form.todate"
                  autocomplete="off"
                  size="small"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  placeholder="结束日期"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="活动中" :label-width="formLabelWidth">
                <el-radio-group v-model="form.isactive">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">关闭</el-radio>
                </el-radio-group>
              </el-form-item></el-col
            >
          </el-row>

          <el-form-item label="备注" :label-width="formLabelWidth">
            <el-input
              size="small"
              v-model="form.remark"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="saveForm(-1)">保存</el-button>
            <el-button @click="dialogAddVisible = false">取消</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
    <div>
      <el-dialog
        title="绩效员工"
        width="800px"
        v-model="dialogStaffVisible"
        @close="closedialog"
      >
        <el-form
          :rules="rules"
          :model="form"
          ref="refform"
          class="margin:0 20px;display:flex;"
          size="small"
        >
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item
                label="绩效主题"
                :label-width="formLabelWidth"
                prop="descs"
              >
                <el-input
                  size="small"
                  v-model="form.descs"
                  autocomplete="off"
                  :disabled="true"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="绩效类型"
                prop="type"
                :label-width="formLabelWidth"
              >
                <el-select
                  v-model="form.descs"
                  placeholder="绩效类型"
                  style="width: 100%"
                  :disabled="true"
                >
                  <el-option
                    v-for="item in dicevatypeData"
                    :key="item.itemid"
                    :label="item.itemname"
                    :value="item.itemid"
                  ></el-option>
                </el-select> </el-form-item
            ></el-col>

            <el-col :span="8">
              <el-form-item
                label="开始日期"
                :label-width="formLabelWidth"
                prop="fromdate"
              >
                <el-date-picker
                  v-model="form.fromdate"
                  autocomplete="off"
                  size="small"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  placeholder="开始日期"
                  :disabled="true"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="结束日期"
                :label-width="formLabelWidth"
                prop="todate"
              >
                <el-date-picker
                  v-model="form.todate"
                  autocomplete="off"
                  size="small"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  placeholder="结束日期"
                  :disabled="true"
                ></el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :span="16">
              <el-form-item
                label="备注"
                :label-width="formLabelWidth"
                prop="remark"
              >
                <el-input
                  size="small"
                  v-model="form.remark"
                  autocomplete="off"
                  :disabled="true"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="活动中"
                :label-width="formLabelWidth"
                :disabled="true"
              >
                <el-radio-group v-model="form.isactive" disabled="true">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">关闭</el-radio>
                </el-radio-group>
              </el-form-item></el-col
            >
          </el-row>
          <el-divider content-position="left"
            ><i style="font-size: 12px">学员列表</i>

            <el-button
              type="primary"
              icon="plus"
              size="small"
              style="margin-left: 560px"
              @click="addStaff()"
            ></el-button
          ></el-divider>
          <el-table :data="staffdata" style="font-size: 9px">
            <el-table-column label="工号" prop="emid"></el-table-column>
            <el-table-column label="姓名" prop="cname"></el-table-column>
            <el-table-column label="考勤" prop="status">
              <template #default="scope">
                <span>{{ dictrstatus.dicDescs(scope.row.status) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="评分" prop="score"></el-table-column>
            <el-table-column label="备注" prop="remark"></el-table-column>
            <el-table-column prop="id" label="操作">
              <template #default="scope">
                <el-button
                  size="small"
                  @click="staffEdit(scope.$index, scope.row)"
                  ><el-icon><Edit /></el-icon
                ></el-button>
                <el-button
                  size="small"
                  type="danger"
                  @click="staffDelete(scope.$index, scope.row)"
                  ><el-icon><Delete /></el-icon
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogStaffVisible = false">离 开</el-button>
          </span>
        </template>

        <!-- 绩效人员翻页控件 -->
        <div style="margin-top: 10px; margin-left: 0px">
          <el-pagination
            background
            size="small"
            layout="total,prev, pager, next"
            :page-size="staffpage.limit"
            @current-change="staffchangePage"
            :current-page="staffpage.cpg"
            :total="staffpage.counts"
          ></el-pagination>
        </div>
      </el-dialog>
    </div>

    <div>
      <el-dialog
        v-model="dialogaddStaffVisible"
        title="添加绩效员工"
        width="640px"
      >
        <div class="eltransfer" style="display: flex; justify-content: center">
          <el-transfer
            class="transfer"
            v-model="addvalue"
            :data="hrnewData"
            size="small"
            :titles="['人事库', '受训员工']"
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
          />
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="savenewstaff()">保存</el-button>
            <el-button @click="dialogaddStaffVisible = false">取消</el-button>
          </span>
        </template>
      </el-dialog>
    </div>

    <div>
      <el-dialog
        v-model="dialogEditStaffStatusVisible"
        title="更改"
        width="400px"
      >
        <el-form
          :rules="rules"
          :model="staffform"
          ref="refstaffform"
          class="margin:0 20px;display:flex;"
          size="small"
        >
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item
                label="评分"
                :label-width="formLabelWidth"
                prop="score"
              >
                <el-input-number
                  size="small"
                  v-model="staffform.score"
                  :min="0"
                  :max="100"
                  autocomplete="off"
                ></el-input-number> </el-form-item
            ></el-col>
            <el-col :span="24">
              <el-form-item
                label="备注"
                :label-width="formLabelWidth"
                prop="remark"
              >
                <el-input
                  size="small"
                  v-model="staffform.remark"
                  autocomplete="off"
                ></el-input> </el-form-item
            ></el-col> </el-row
        ></el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="editstaffstatus()">保存</el-button>
            <el-button @click="dialogEditStaffStatusVisible = false"
              >取消</el-button
            >
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { AX } from "../utils/api";
import { ref } from "vue";
import moment from "moment";
import $ from "jquery";
import { stopKQ, trtype, timeStatus } from "../utils/comdata";
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

      hrnewData: [],
      addvalue: [],
      staffdata: [],

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
      dicevatypeData: [],
      dictritemsData: [],
      dictrtypeData: [],

      pritemData: [],
      dictrstatus: [],

      loading: false,
      deptVisible: false,

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
      formLabelWidth: "80",

      dialogFormVisible: false,

      dialogAddVisible: false,
      dialogStaffVisible: false,
      dialogaddStaffVisible: false,
      dialogEditStaffStatusVisible: false,

      neworedit: true,

      searchform: {
        fromdate: "",
        todate: "",
      },

      page: {
        limit: 12,
        cpg: 1,
        counts: 1,
      },

      staffpage: {
        limit: 10,
        cpg: 1,
        counts: 1,
      },

      staffform: {
        id: "",
        status: "",
        score: 75,
        remark: "",
      },
      form: {
        id: "",
        planid: "",
        type: "",
        fromdate: "",
        todate: "",
        descs: "",
        isactive: 1,
        remark: "",
      },
      rules: {
        planid: [
          { required: true, message: "请输入计划编号", trigger: "blur" },
        ],
        descs: [{ required: true, message: "请输入说明", trigger: "blur" }],

        type: [{ required: true, message: "请选择类型", trigger: "blur" }],

        fromdate: [
          {
            required: true,
            message: "请输入日期",
            trigger: "blur",
          },
        ],

        todate: [
          {
            required: true,
            message: "请输入日期",
            trigger: "blur",
          },
        ],

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
    addNew() {
      this.neworedit = true;
      this.form.planid = moment().format("YYYYMMDDHHmmss");
      this.form.fromdate = moment().format("YYYY-MM-DD");
      this.form.todate = moment().format("YYYY-MM-DD");
      this.form.id = "";
      this.form.descs = "";
      this.form.type = "";
      this.form.isactive = 1;
      this.dialogAddVisible = true;
    },
    addStaff() {
      console.log("addStaff");
      this.dialogaddStaffVisible = true;
      this.hrnewData = [];
      this.addvalue = [];

      AX("get", `hrinfo/kpistaff/${this.form.planid}`)
        .then((res) => {
          if (res && res.data.length > 0) {
            res.data.forEach((ele) => {
              let hr = {};
              hr.key = ele.sysid;
              hr.label = ele.cname;
              this.hrnewData.push(hr);
            });
          }
          this.loading = false;
        })
        .catch((e) => console.log(e.message));
    },
    changeprtype() {
      this.listMain();
    },

    changeacc() {
      // console.log(this.form)
    },

    check() {
      this.deptChecked.splice("0", this.deptChecked.length);
      this.deptChecked = this.$refs.deptTree.getCheckedNodes();
    },

    newdeptnodeclick(data) {
      console.log(data);
      if (data.is_pos == 1) {
        this.deptVisible = false;
        this.form.dpname = data.dpname;
        this.form.dept = data.fid;
        this.form.position = data.dpid;
      }
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

    staffEdit(idx, row) {
      this.staffform.id = row.id;
      this.staffform.status = row.status;
      this.staffform.score = row.score;
      this.staffform.remark = row.remark;
      this.dialogEditStaffStatusVisible = true;
    },

    savenewstaff() {
      if (this.addvalue.length > 0) {
        const uptdata = [];
        for (let i = 0; i < this.addvalue.length; i++) {
          let staff = {};
          staff.sysid = this.addvalue[i];
          staff.planid = this.form.planid;
          staff.score = 75;
          uptdata.push(staff);
        }

        AX("post", "kpistaff/addstaff", uptdata).then((res1) => {
          if (res1) {
            this.dialogaddStaffVisible = false;
            this.listTrstaff();
          }
        });
      }
    },
    saveForm() {
      this.$refs.refform.validate((valid) => {
        if (valid) {
          if (this.neworedit) {
            AX("post", "kpiplan", this.form).then((res1) => {
              if (res1) {
                this.dialogAddVisible = false;
                this.neworedit = false;
                this.listMain();
              }
            });
          } else {
            AX("patch", `kpiplan/${this.form.id}`, this.form).then((res1) => {
              if (res1) {
                this.dialogAddVisible = false;
                this.neworedit = false;
                this.listMain();
              }
            });
          }
        }
      });
    },

    activeActivity(isactive, idx, row) {
      console.log(stop, idx, row);
      AX("patch", `kpiplan/${row.id}`, { isactive }).then((res1) => {
        if (res1) {
          this.listMain();
        }
      });
    },

    formatisstop(row) {
      return row.is_stop == 0 ? "No" : "STOP";
    },

    editPlan(index, row) {
      this.neworedit = false;
      Object.assign(this.form, row);
      this.dialogAddVisible = true;
    },

    editStaff(indx, row) {
      Object.assign(this.form, row);
      this.listTrstaff();
      this.dialogStaffVisible = true;
    },

    editstaffstatus(row) {
      this.$refs.refstaffform.validate((valid) => {
        if (valid) {
          AX("patch", `kpistaff/${this.staffform.id}`, this.staffform).then(
            (res1) => {
              if (res1) {
                this.dialogEditStaffStatusVisible = false;
                this.listTrstaff();
              }
            }
          );
        }
      });
    },

    staffDelete(idx, row) {
      this.$confirm("此操作将删除该人的绩效记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          AX("delete", "kpistaff/" + row.id).then((res) => {
            if (res) {
              this.listTrstaff();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    listTrstaff() {
      this.staffdata = [];
      AX(
        "get",
        `kpistaff/bypid/${this.form.planid}?page=${this.staffpage.cpg}&pagesize=${this.staffpage.limit}`
      )
        .then((res) => {
          console.log("ddddddddddddddd", res);
          if (res && res.data.length > 0) {
            this.staffdata = res.data;
            this.staffpage.counts = Number(res.total);
          }
          this.loading = false;
        })
        .catch((e) => console.log(e.message));
    },

    changePage(idx) {
      this.page.cpg = idx;
      this.listMain();
    },

    staffchangePage(idx) {
      this.staffpage.cpg = idx;
      this.listTrstaff();
    },

    getdic(type = "hr") {
      this.loading = true;

      this.searchform.fromdate = moment().add(-1, "M").format("YYYY-MM-DD");
      this.searchform.todate = moment().format("YYYY-MM-DD");

      this.dicevatypeData = this.dicstore.getDic("evatype");

      if (type == "hr") {
        // this.selkqstafftype = stopKQ;
        // this.dictrstatus.push(...timeStatus);
        // AX("get", "/dicm/hrgrade")
        //   .then((res) => {
        //     this.dichrgradeData = res.data;
        //     // console.log(res.data)
        //     //this.showdesc(res.data, 'hrgrade_13', 'itemid', 'itemname')
        //     // console.log(res.data.dicDescs('hrgrade_13'));
        //   })
        //   .catch((e) => console.log(e.message));
        // this.dichrgradeData = this.dicstore.getDic("hrgrade");
        // AX("get", "/dicm/hrtype")
        //   .then((res) => {
        //     this.dichrtypeData = res.data;
        //   })
        //   .catch((e) => console.log(e.message));
        // this.dichrtypeData = this.dicstore.getDic("hrtype");
        // AX("get", "/dicm/hrstatus")
        //   .then((res) => {
        //     this.dichrstatusData = res.data;
        //   })
        //   .catch((e) => console.log(e.message));
        // this.dichrstatusData = this.dicstore.getDic("hrstatus");
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
        //   this.dichrpropsData = this.dicstore.getDic("hrporps");
        //   this.dictritemsData = this.dicstore.getDic("tritems");
        //   for (let i = 0; i < this.dictritemsData.length; i++) {
        //     let el = this.dictritemsData[i];
        //     if (el.fid == el.dicmid) {
        //       console.log(el, i, el.itemname);
        //       this.dictritemsData.splice(i, 1);
        //       i--;
        //     }
        //   }
        //   this.dictritemsData.forEach((el, idx) => {
        //     console.log(el.fid, el.dicmid, el.fid == el.dicmid, el.itemname);
        //   });
        //   this.dictrtypeData.push(...trtype);
      }

      this.loading = false;
    },

    async tree(data, val, id, descs) {
      if (!val) {
        return;
      }
      let r = "";
      for (let item of data) {
        console.log("tree:", val, item[id]);
        if (val != item[id]) {
          if (item.children) {
            await this.tree(item.children, val, id, descs);
          }
        } else {
          // console.log('find.......................' + item[descs])
          r = item[descs];
          return item[descs];
          //break;
        }
        break;
      }

      return r;
    },

    flattenTree(treedata) {
      for (let item of treedata) {
        let node = {};
        node.dpid = item.deptid;
        node.dpname = item.deptname;
        node.fid = item.fid;
        node.is_pos = item.deptlevel == 2 ? true : false;
        node.posgrade = "1";

        this.dpList.push(node);
        if (item.children) {
          this.flattenTree(item.children);
        }
      }
    },

    closedialog() {
      this.needshow = false;
    },

    closeotlistform() {
      this.dialogOTVisibility = false;
    },
    closelevlistform() {
      this.dialogLEVVisibility = false;
    },

    listMain() {
      //  console.log('33333333333333')
      // this.shiftsysids.splice(0, this.shiftsysids.length);
      //  let api = ''
      // if (this.deptChecked.length < 1) {
      //   this.$message.error("请选择需要查询的部门！");
      //   return;
      // }

      this.loadingContent = "拼命加载中";
      this.loadingBackground = "rgba(0, 0, 0, 0.8)";
      this.loading = true;
      let block = {};

      let depts = [];

      this.deptChecked.forEach((item) => {
        depts.push(item.deptid);
      });

      block.dept = depts;
      block.fromdate = this.searchform.fromdate;
      block.todate = this.searchform.todate;
      block.name = this.inputsearch;
      block = encodeURI(JSON.stringify(block));

      AX(
        "get",
        "kpiplan?page=" +
          this.page.cpg +
          "&pagesize=" +
          this.page.limit +
          "&block=" +
          block
      ).then((res) => {
        if (res && res.total >= 0) {
          this.tableData = [];
          this.tableData = res.data;
          this.page.counts = res.total;
        }

        //=========================================================================

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
