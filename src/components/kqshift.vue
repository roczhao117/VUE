<template>
  <div>
    <!-- 查询头 -->

    <div style="display: flex; margin: 1px; margin-right: 20px">
      <el-tooltip content="新加班次" placement="top">
        <el-button
          type="primary"
          icon="plus"
          size="small"
          @click="handleNew()"
        ></el-button>
      </el-tooltip>
      <el-tooltip content="刷新数据" placement="top">
        <el-button
          type="primary"
          icon="refresh"
          size="small"
          @click="listMain()"
        ></el-button>
      </el-tooltip>
      <span style="margin-left: 20px">
        <el-select
          v-model="isstop"
          placeholder="请选择类型"
          style="width: 100%"
          @change="changeacc"
          size="small"
        >
          <el-option
            v-for="item in typelist"
            :key="item.id"
            :label="item.desc"
            :value="item.id"
          ></el-option>
        </el-select>
      </span>
      <el-input
        placeholder="可填写班次代码和名称来查询"
        size="small"
        v-model="inputsearch"
        class="input-with-select"
        v-on:keydown.enter="listMain()"
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
      <div style="border-right: 0px solid rgb(239, 239, 239); margin-left: 1px">
        <el-tree
          :data="dpData"
          show-checkbox
          node-key="id"
          ref="deptTree"
          :props="dpProps"
          :default-expand-all="true"
          @check="check"
          style="
            width: 250px;
            overflow-x: scroll;
            height: 715px;
            font-size: 12px;
          "
          class="dept"
        >
          <template #default="{ node, data }">
            <span :class="{ ispos: data.deptlevel == 2 }">
              {{ node.label }}
              <span class="pdmsg" v-if="data.deptlevel == 2">职位</span>

              <span class="pdmsg" v-if="data.deptlevel == 1">部门</span>
              <span class="companyflag" v-if="data.deptlevel == 0"
                ><el-icon><OfficeBuilding /></el-icon
              ></span>
            </span>
          </template>
        </el-tree>
      </div>
      <div style="margin-left: 20px; width: 100%; min-width: 800px">
        <el-table
          :data="tableData"
          style="width: 95%; margin-left: 2px; font-size: 12px"
          v-loading="loading"
          :element-loading-text="loadingContent"
          element-loading-spinner="el-icon-loading"
          :element-loading-background="loadingBackground"
          stripe
        >
          <el-table-column prop="id" fixed width="60" type="index">
            <template #default="scope">
              <span>{{
                (page.cpg - 1) * page.limit + (scope.$index + 1)
              }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="sftid"
            fixed="left"
            label="代码"
            width="100"
          ></el-table-column>
          <el-table-column
            prop="sftdesc"
            label="名称"
            width="80"
          ></el-table-column>
          <el-table-column prop="sftgrp" label="组" width="100">
            <template #default="scope">
              <span>{{ dicshiftgrp.dicDescs(scope.row.sftgrp) }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="isactive" label="停用" width="80">
            <template #default="scope">
              <span v-if="scope.row.isactive == 0">❌</span>
              <span v-else>-</span>
            </template>
          </el-table-column>

          <el-table-column prop="sfttype" label="类型" width="100">
            <template #default="scope">
              <span>{{ dicshifttype.dicDescs(scope.row.sfttype) }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="sftsubsidy"
            label="补贴"
            width="100"
          ></el-table-column>

          <el-table-column prop="in1" label="进1" width="80"></el-table-column>

          <el-table-column prop="out1" label="出1" width="80"></el-table-column>

          <el-table-column prop="in2" label="进2" width="80"></el-table-column>
          <el-table-column prop="out2" label="出2" width="80"></el-table-column>

          <el-table-column prop="m1" label="早餐" width="60">
            <template #default="scope">
              <span v-if="scope.row.m1 == 1">✅</span>
              <span v-else></span>
            </template>
          </el-table-column>

          <el-table-column prop="m2" label="午餐" width="60">
            <template #default="scope">
              <span v-if="scope.row.m2 == 1">✅</span>
              <span v-else></span>
            </template>
          </el-table-column>

          <el-table-column prop="m3" label="晚餐" width="60">
            <template #default="scope">
              <span v-if="scope.row.m3 == 1">✅</span>
              <span v-else></span>
            </template>
          </el-table-column>

          <el-table-column prop="m4" label="夜宵" width="60">
            <template #default="scope">
              <span v-if="scope.row.m4 == 1">✅</span>
              <span v-else></span>
            </template>
          </el-table-column>

          <el-table-column prop="m5" label="次日早餐" width="80">
            <template #default="scope">
              <span v-if="scope.row.m5 == 1">✅</span>
              <span v-else></span>
            </template>
          </el-table-column>

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
                    icon="edit"
                    @click="handleEdit(scope.$index, scope.row)"
                  ></el-button>
                </el-tooltip>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 翻页控件 -->
    <div style="margin-top: 25px; margin-left: 280px">
      <el-pagination
        background
        layout="total,prev, pager, next"
        :page-size="page.limit"
        @current-change="changePage"
        :current-page="page.cp1"
        :total="page.counts"
      ></el-pagination>
    </div>
    <!-- 人事表单 -->

    <!-- 人事新人表单 -->
    <div>
      <el-dialog
        title="班次设置"
        width="630px"
        @close="closeForm"
        v-model="dialogAddVisible"
      >
        <el-form
          :rules="rules"
          :model="form"
          ref="form"
          class="margin:0 20px;display:flex;"
        >
          <el-row :gutter="24">
            <el-col :span="12">
              <div>
                <el-form-item
                  label="班次代码"
                  :label-width="formLabelWidth"
                  prop="sftid"
                >
                  <el-input
                    size="small"
                    v-model="form.sftid"
                    autocomplete="off"
                    prefix-icon="edit"
                    :disabled="neworedit == false"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <div>
                <el-form-item
                  label="班次说明"
                  :label-width="formLabelWidth"
                  prop="sftdesc"
                >
                  <el-input
                    size="small"
                    v-model="form.sftdesc"
                    autocomplete="off"
                    prefix-icon="edit"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <div>
                <el-form-item
                  label="归属班组"
                  :label-width="formLabelWidth"
                  prop="sftgrp"
                >
                  <el-select
                    id="selshiftgrp"
                    v-model="form.sftgrp"
                    placeholder="请选择所属班组"
                    style="width: 100%"
                    size="small"
                  >
                    <el-option
                      v-for="item in dicshiftgrp"
                      :key="item.itemid"
                      :label="item.itemname"
                      :value="item.itemid"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <div>
                <el-form-item
                  label="班次类型"
                  :label-width="formLabelWidth"
                  prop="sfttype"
                >
                  <el-select
                    id="selshifttype"
                    v-model="form.sfttype"
                    placeholder="请选择班次类型"
                    style="width: 100%"
                    size="small"
                  >
                    <el-option
                      v-for="item in dicshifttype"
                      :key="item.itemid"
                      :label="item.itemname"
                      :value="item.itemid"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <div>
                <el-form-item
                  label="班次补贴"
                  :label-width="formLabelWidth"
                  prop="sftsubsidy"
                >
                  <el-input
                    size="small"
                    v-model="form.sftsubsidy"
                    autocomplete="off"
                    prefix-icon="edit"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-row :gutter="24">
              <el-col :span="6">
                <div>
                  <el-form-item label="进1" :label-width="60" prop="in1">
                    <el-input
                      size="small"
                      v-model="form.in1"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="6">
                <div>
                  <el-form-item label="出1" :label-width="60" prop="out1">
                    <el-input
                      size="small"
                      v-model="form.out1"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="6">
                <div>
                  <el-form-item label="进2" :label-width="60" prop="in2">
                    <el-input
                      size="small"
                      v-model="form.in2"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="6">
                <div>
                  <el-form-item label="出2" :label-width="60" prop="out2">
                    <el-input
                      size="small"
                      v-model="form.out2"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-divider content-position="left">可享餐次</el-divider>
            <el-row :gutter="24">
              <el-col :span="4">
                <div>
                  <el-form-item
                    label="早餐"
                    :label-width="formLabelWidth"
                    prop="m1"
                  >
                    <el-checkbox
                      :true-label="1"
                      :false-label="0"
                      size="small"
                      v-model="form.m1"
                      autocomplete="off"
                    ></el-checkbox>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="4">
                <div>
                  <el-form-item
                    label="午餐"
                    :label-width="formLabelWidth"
                    prop="m2"
                  >
                    <el-checkbox
                      :true-label="1"
                      :false-label="0"
                      size="small"
                      v-model="form.m2"
                      autocomplete="off"
                    ></el-checkbox>
                  </el-form-item>
                </div>
              </el-col>

              <el-col :span="4">
                <div>
                  <el-form-item
                    label="晚餐"
                    :label-width="formLabelWidth"
                    prop="m3"
                  >
                    <el-checkbox
                      :true-label="1"
                      :false-label="0"
                      size="small"
                      v-model="form.m3"
                      autocomplete="off"
                    ></el-checkbox>
                  </el-form-item>
                </div>
              </el-col>

              <el-col :span="4">
                <div>
                  <el-form-item
                    label="夜餐"
                    :label-width="formLabelWidth"
                    prop="m4"
                  >
                    <el-checkbox
                      :true-label="1"
                      :false-label="0"
                      size="small"
                      v-model="form.m4"
                      autocomplete="off"
                    ></el-checkbox>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="4">
                <div>
                  <el-form-item
                    label="次早"
                    :label-width="formLabelWidth"
                    prop="m5"
                  >
                    <el-checkbox
                      :true-label="1"
                      :false-label="0"
                      size="small"
                      v-model="form.m5"
                      autocomplete="off"
                    ></el-checkbox>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-divider content-position="center">适用部门</el-divider>

            <el-col :span="24">
              <div>
                <el-tree
                  :data="dpData"
                  node-key="deptid"
                  ref="deptTree1"
                  :props="dpProps"
                  :default-expand-all="true"
                  show-checkbox
                  style="
                    overflow-x: scroll;
                    height: 300px;
                    border: 1px rgb(175, 175, 175) solid;
                    font-size: 12px;
                  "
                  @node-click="newdeptnodeclick"
                >
                  <template #default="{ node, data }">
                    <span :class="{ ispos: data.deptlevel == 2 }">{{
                      node.label
                    }}</span>
                  </template>
                </el-tree>
              </div>
            </el-col>

            <el-col :span="24">
              <div>
                <el-form-item
                  label="备注"
                  :label-width="formLabelWidth"
                  prop="remark"
                >
                  <el-input
                    size="small"
                    v-model="form.remark"
                    autocomplete="off"
                    prefix-icon="edit"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="8" style="align-text: right">
              <div>
                <el-form-item
                  label="激活"
                  :label-width="formLabelWidth"
                  prop="isactive"
                >
                  <el-checkbox
                    :true-label="1"
                    :false-label="0"
                    size="small"
                    v-model="form.isactive"
                    autocomplete="off"
                    prefix-icon="edit"
                  ></el-checkbox>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="closeForm">取 消</el-button>
            <el-button type="primary" @click="saveForm">确 定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { AX } from "../utils/api";
//import { ref } from 'vue';
//import moment from 'moment';
import $ from "jquery";
import {
  useDeptPosStore,
  useDicStore,
  useUserStore,
  useEmidStore,
} from "../store/index";

export default {
  setup() {
    const deptstore = useDeptPosStore();
    const dicstore = useDicStore();
    const userstore = useUserStore();
    const emidstore = useEmidStore();
    return { deptstore, dicstore, userstore, emidstore };
  },
  data() {
    return {
      dplimit: [],
      fsysid: "123",
      hrData: {},
      loadingContent: "拼命加载中",
      loadingBackground: "rgba(0, 0, 0, 0.8)",
      tableData: [],
      roleData: [],
      loading: false,
      deptVisible: false,
      dicshifttype: [],
      dicshiftgrp: [],
      deptChecked: [],
      dichktypeData: [],
      hrnewData: [],
      addvalue: [],
      dicpraccountgrp: [],
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
      prinfo: {
        period: "202101",
        fromdate: "2021-01-01",
        todate: "2021-01-01",
        prgrp: "1",
      },
      typelist: [
        {
          id: "0",
          desc: "停止",
        },
        { id: "1", desc: "激活" },
      ],
      isstop: "0",
      prtypes: [
        { code: "0", itemname: "发薪员工" },
        { code: "1", itemname: "停薪员工" },
      ],
      prtype: "0",
      cmppwd: "",
      dialogFormVisible: false,
      dialogAddVisible: false,
      neworedit: true,
      //这只是初始化数据
      shiftdays: [{ id: "sf01", desc: "01" }],
      page: {
        limit: 15,
        cpg: 1,
        counts: 1,
      },
      s003: "1",
      form: {
        id: "",
        sftid: "",
        sftdesc: "",
        in1: "0830",
        in2: "0000",
        out1: "1800",
        out2: "0000",
        sfttype: "",
        sftdept: "",
        m1: 1,
        m2: 1,
        m3: 0,
        m4: 0,
        m5: 0,
        isactive: 1,
        sftsubsidy: 0,
        remark: "",
      },
      rules: {
        sfttype: [
          { required: true, message: "请厦门站班次类型", trigger: "blur" },
        ],
        sftgrp: [{ required: true, message: "请选择班组", trigger: "blur" }],
        sftid: [
          {
            required: true,
            message: "请输入班次代码(4-20位字母数字组合)，不可重复！",
            pattern: /^[0-9a-zA-Z-]+$/,
            trigger: "blur",
            min: 4,
            max: 20,
          },
        ],
        sftsubsidy: [
          {
            required: true,
            message: "请输入数字",
            trigger: "blur",
            pattern: /^(0|0(.)?\d+|[1-9]\d*(.)?\d*)$/,
          },
        ],
        in1: [
          {
            required: true,
            message: "格式为:hhmm 4位。空为 0000",
            trigger: "blur",
            min: 4,
            max: 4,
            pattern:
              /^(0{1}[0-9]{1}|1{1}[0-9]{1}|2{1}[0-3]{1})([0-5]{1}[0-9]{1}|[6]{1}[0]{1})$/,
          },
        ],
        in2: [
          {
            required: true,
            message: "格式为:hhmm 4位。空为 0000",
            trigger: "blur",
            min: 4,
            max: 4,
            pattern:
              /^(0{1}[0-9]{1}|1{1}[0-9]{1}|2{1}[0-3]{1})([0-5]{1}[0-9]{1}|[6]{1}[0]{1})$/,
          },
        ],
        out1: [
          {
            required: true,
            message: "格式为:hhmm 4位。空为 0000",
            trigger: "blur",
            min: 4,
            max: 4,
            pattern:
              /^(0{1}[0-9]{1}|1{1}[0-9]{1}|2{1}[0-3]{1})([0-5]{1}[0-9]{1}|[6]{1}[0]{1})$/,
          },
        ],
        out2: [
          {
            required: true,
            message: "格式为:hhmm 4位。空为 0000",
            trigger: "blur",
            min: 4,
            max: 4,
            pattern:
              /^(0{1}[0-9]{1}|1{1}[0-9]{1}|2{1}[0-3]{1})([0-5]{1}[0-9]{1}|[6]{1}[0]{1})$/,
          },
        ],
      },
    };
  },
  computed: {
    // s33() { return this.form.s015 }
  },
  mounted() {
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
      this.listMain();
    },
    check() {
      this.deptChecked.splice("0", this.deptChecked.length);
      this.deptChecked = this.$refs.deptTree.getCheckedNodes();
    },
    newdeptnodeclick(data) {
      console.log(data);
      // if (data.is_pos == 1) {
      //   this.deptVisible = false;
      //   this.form.dpname = data.dpname;
      //   this.form.dept = data.fid;
      //   this.form.position = data.dpid;
      // }
    },
    test() {
      console.log("deptvisible:", this.deptVisible);
      this.deptVisible = !this.deptVisible;
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
    closeForm() {
      this.$refs.deptTree1.setCheckedNodes(["-1"]);
      this.loading = false;
      this.dialogAddVisible = false;
    },
    saveForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          const sftdept = this.$refs.deptTree1.getCheckedKeys();
          this.form.sftdept = sftdept.join(",");
          if (sftdept.length < 1) {
            this.$message.error("请选择该班次适用部门！");
            return;
          }
          if (this.form.id) {
            AX("patch", "kqshift/" + this.form.id, this.form).then((res) => {
              if (res) {
                this.$refs.deptTree1.setCheckedNodes(["-1"]);
                this.dialogAddVisible = false;
                this.addvalue = [];
                this.listMain();
              }
            });
          } else {
            AX("post", "kqshift", this.form).then((res) => {
              if (res) {
                this.$refs.deptTree1.setCheckedNodes(["-1"]);
                this.dialogAddVisible = false;
                this.addvalue = [];
                this.listMain();
              }
            });
          }
        }
      });
    },
    formatisstop(row) {
      return row.is_stop == 0 ? "No" : "STOP";
    },
    handleNew() {
      this.neworedit = true;
      this.dialogAddVisible = true;
      this.loading = true;
      this.form.id = "";
      this.form.sftid = "exe";
      this.form.sftdesc = "行政班";
      this.form.in1 = "0830";
      this.form.in2 = "0000";
      this.form.out1 = "1800";
      this.form.out2 = "0000";
      this.form.sfttype = "";
      this.form.sftdept = "";
      this.form.m1 = 1;
      this.form.m2 = 1;
      this.form.m3 = 0;
      this.form.m4 = 0;
      this.form.m5 = 0;
      this.form.sftsubsidy = 0;
      this.form.stop = false;
      this.form.remark = "";
    },
    handleEdit(index, row) {
      //  this.getdic();
      this.neworedit = false;
      //非常非常重要，在有自定义dom下，又是弹出框下进行操作这些dom，利用form是不能自动读取内容的
      //这里目前用jquery的方法非常好用。
      //更新form，如果有弹出框的情况下，必须更新。
      this.form = Object.assign({}, row);
      this.dialogAddVisible = true;
      let depts = row.sftdept.split(",");
      depts.forEach((v) => {
        this.$nextTick(() => {
          this.$refs.deptTree1.setChecked(v, true, false);
        });
      });
    },
    changePage(idx) {
      //  console.log(idx)
      this.page.cpg = idx;
      this.listMain();
    },
    getdic(type = "hr") {
      this.loading = true;
      if (type == "hr") {
        // AX("get", "/dicm/shifttype2")
        //   .then((res) => {
        //     this.dicshifttype = res.data;
        //   })
        //   .catch((e) => console.log(e.message));
        // AX("get", "/dept")
        //   .then((res) => {
        //     this.dpData = res.data;
        //     this.flattenTree(res.data);
        //   })
        //   .catch((e) => console.log(e.message))
        //   .catch((e) => console.log(e.message));
        this.dicshifttype = this.dicstore.getDic("shifttype2");
        this.dicshiftgrp = this.dicstore.getDic("shiftgroup");
        this.dpData = this.deptstore.deptposData.data;
        this.flattenTree(this.dpData);
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
        node.dpid = item.dpid;
        node.dpname = item.dpname;
        node.fid = item.fid;
        node.is_pos = item.is_pos;
        node.posgrade = item.posgrade;
        this.dpList.push(node);
        if (item.children) {
          this.flattenTree(item.children);
        }
      }
    },
    cmd_moresearch() {
      if (this.deptChecked.length < 1) {
        this.$message.error("请选择需要查询的部门！");
        return;
      } else {
        this.deptChecked.forEach((item) => {
          let dpobj = {};
          dpobj.dpid = item.dpid;
          this.dplimit.push(dpobj);
        });
        this.dialogMSVisible = true;
      }
    },
    moreSearch() {
      this.listmain();
    },
    listMain() {
      this.tableData = [];
      this.neworedit = false;
      if (this.deptChecked.length < 1) {
        this.$message.error("请选择班次适用部门！");
        return;
      }
      this.dplimit = [];
      this.deptChecked.forEach((item) => {
        this.dplimit.push(item.deptid);
      });
      // console.log(this.deptChecked, this.dplimit);
      this.loadingContent = "拼命加载中";
      this.loadingBackground = "rgba(0, 0, 0, 0.8)";
      this.loading = true;
      let block = {};
      let depts = [];
      this.deptChecked.forEach((item) => {
        let dpobj = {};
        dpobj.dpid = item.deptid;
        depts.push(dpobj);
      });
      block.dept = depts;
      //console.log(depts)
      block.isactive = this.isstop;
      block.name = this.inputsearch;
      block = encodeURI(JSON.stringify(block));
      AX(
        "get",
        "kqshift?page=" +
          this.page.cpg +
          "&pagesize=" +
          this.page.limit +
          "&block=" +
          block
      ).then((res) => {
        // console.log(res);
        this.tableData = [];
        if (res && res.total > 0) {
          this.tableData = res.data;
          this.page.counts = parseInt(res.total);

          this.tableData.forEach((item, idx) => {
            const ids = item.sftdept.split(",");
            for (const id of ids) {
              if (this.dplimit.includes(id)) {
                continue;
              } else {
                delete this.tableData[idx];
              }
            }
          });
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
.ispos {
  padding: 2px 6px;
  cursor: pointer;
  font-size: 12px;
  background-color: #3186f5;
  color: rgb(255, 255, 255);

  border-radius: 5px;
}
</style>
