<template>
  <div>
    <!-- 查询头 -->
    <div style="display: flex; margin: 1px; margin-right: 20px">
      <el-tooltip content="新项目" placement="top">
        <el-button type="primary" icon="Plus" @click="handleNew()"></el-button>
      </el-tooltip>
      <el-tooltip content="刷新数据" placement="top">
        <el-button
          type="primary"
          icon="Refresh"
          @click="listMain()"
        ></el-button>
      </el-tooltip>
      <el-select
        v-model="select_accountgrp"
        placeholder="帐套选择"
        @change="accgrpchange"
        style="width: 200px; margin-left: 40px"
      >
        <el-option
          v-for="item in dicpraccountgrp"
          :key="item.itemid"
          :label="item.itemname"
          :value="item.itemid"
        ></el-option>
      </el-select>
      <el-input
        placeholder="查询名称或为空"
        v-model="inputsearch"
        style="width: 250px; margin-left: 20px"
        size="small"
        v-on:keydown.enter="listMain()"
      >
        <template #append>
          <el-button icon="Search" @click="listMain()">查询</el-button>
        </template>
      </el-input>
    </div>
    <!-- 薪资修改界面 -->
    <div style="display: flex; margin-top: 22px; height: 650px">
      <div style="border-right: 1px solid rgb(239, 239, 239); margin-left: 1px">
        <el-tree
          :data="dicpritemgrp"
          show-checkbox
          node-key="id"
          ref="deptTree"
          :props="dicprops"
          :default-expand-all="true"
          @check="check"
          style="width: 150px; overflow-x: scroll; height: 715px"
        ></el-tree>
      </div>
      <div style="margin-left: 0; width: 1200px; min-width: 800px">
        <el-table
          :data="tableData"
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          stripe
        >
          <el-table-column type="index" label="id">
            <template #default="scope">
              <span>{{
                (page.cpg - 1) * page.limit + (scope.$index + 1)
              }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="prid"
            label="编号"
            width="60"
          ></el-table-column>
          <el-table-column
            prop="prname"
            label="名称"
            width="120"
          ></el-table-column>
          <el-table-column prop="prfur" label="类型" width="140">
            <template #default="scope">
              <span>{{ pritemtypeData.dicDescs(scope.row.prtype) }}</span>
              <span v-if="scope.row.prfur.trim() == ''">-手动</span>
              <span v-else-if="scope.row.prfur.indexOf(' sum(') > -1"
                >-统计</span
              >
              <span v-else-if="scope.row.prfur.indexOf(' avg(') > -1"
                >-平均</span
              >
              <span v-else>-计算</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="initval"
            label="初值"
            width="100"
          ></el-table-column>
          <el-table-column prop="prgrp" label="组" width="100">
            <template #default="scope">
              <span>{{ dicpritemgrp.dicDescs(scope.row.prgrp) }}</span>
            </template></el-table-column
          >

          <el-table-column prop="prgrp" label="帐套" width="100">
            <template #default="scope">
              <span>{{ dicpraccountgrp.dicDescs(scope.row.prcalgrp) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="sort"
            label="计算序号"
            width="100"
          ></el-table-column>

          <el-table-column prop="isactive" label="激活" width="100">
            <template #default="scope">
              <el-tooltip
                content="点击可切换状态,激活表示项目可计算"
                placement="top"
              >
                <el-button
                  type="success"
                  size="small"
                  v-if="scope.row.isactive == 1"
                  @click="activeActivity(0, scope.$index, scope.row)"
                  >激活</el-button
                >
                <el-button
                  type="info"
                  size="small"
                  @click="activeActivity(1, scope.$index, scope.row)"
                  v-else
                  >否</el-button
                >
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column prop="is_show" label="可显示" width="100">
            <template #default="scope">
              <el-tooltip content="点击可切换状态" placement="top">
                <el-button
                  type="success"
                  size="small"
                  v-if="scope.row.is_show == 1"
                  @click="activeShow(0, scope.$index, scope.row)"
                  >是</el-button
                >
                <el-button
                  type="info"
                  size="small"
                  @click="activeShow(1, scope.$index, scope.row)"
                  v-else
                  >否</el-button
                >
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column prop="is_clear" label="清零" width="100">
            <template #default="scope">
              <el-tooltip content="点击可切换状态" placement="top">
                <el-button
                  type="success"
                  size="small"
                  v-if="scope.row.is_clear == 1"
                  @click="activeClear(0, scope.$index, scope.row)"
                  >清</el-button
                >
                <el-button
                  type="info"
                  size="small"
                  @click="activeClear(1, scope.$index, scope.row)"
                  v-else
                  >否</el-button
                >
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column
            prop="remark"
            label="备注"
            width="200"
          ></el-table-column>
          <el-table-column prop="id" fixed="right" label="操作" width="140">
            <template #default="scope">
              <span class="butgrp">
                <el-button
                  size="small"
                  icon="Edit"
                  @click="handleEdit(scope.$index, scope.row)"
                ></el-button>

                <el-button
                  size="small"
                  type="danger"
                  icon="Delete"
                  @click="handleDelete(scope.$index, scope.row)"
                ></el-button>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 翻页控件 -->
    <div style="margin-top: 25px; margin-left: 170px">
      <el-pagination
        background
        layout="total,prev, pager, next"
        :page-size="page.limit"
        @current-change="changePage"
        :current-page="page.cpg"
        :total="counts"
      ></el-pagination>
    </div>
    <!-- 薪资项目表单 -->
    <div class="dialogform">
      <el-dialog title="薪资项目" width="1000px" v-model="dialogFormVisible">
        <el-form :rules="pritemrules" :model="pritemform" ref="refpritemform">
          <el-row :gutter="24">
            <el-col :span="12">
              <div>
                <el-form-item
                  label="帐套"
                  prop="prgrp"
                  :label-width="formLabelWidth"
                >
                  <el-select
                    v-model="pritemform.prcalgrp"
                    placeholder="请选择账套"
                    style="width: 100%"
                    @change="changeacc"
                  >
                    <el-option
                      v-for="item in dicpraccountgrp"
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
                  label="组"
                  prop="prtype"
                  :label-width="formLabelWidth"
                >
                  <el-select
                    v-model="pritemform.prgrp"
                    placeholder="请选择组"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in dicpritemgrp"
                      :key="item.itemid"
                      :label="item.itemname"
                      :value="item.itemid"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item
                label="计算类型"
                :label-width="formLabelWidth"
                prop="prtype"
              >
                <div style="display: flex; margin-left: 10px">
                  <el-radio-group v-model="pritemform.prtype">
                    <el-radio
                      v-if="pritemform.prtype == '2' && neworedit == false"
                      v-for="item in pritemtypeData"
                      :key="item.itemid"
                      :value="item.itemname"
                      :label="item.itemid"
                      @change="pritemtypeChange"
                      :disabled="true"
                      >{{ item.itemname }}</el-radio
                    >
                    <el-radio
                      v-if="pritemform.prtype != '2' && neworedit == false"
                      v-for="item in pritemtypeData"
                      :key="item.itemid"
                      :value="item.itemname"
                      :label="item.itemid"
                      @change="pritemtypeChange"
                      :disabled="item.itemid == '2'"
                      >{{ item.itemname }}</el-radio
                    >
                    <el-radio
                      v-if="neworedit"
                      v-for="item in pritemtypeData"
                      :key="item.itemid"
                      :value="item.itemname"
                      :label="item.itemid"
                      @change="pritemtypeChange"
                      >{{ item.itemname }}</el-radio
                    >
                  </el-radio-group>
                </div></el-form-item
              >
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="6">
              <div>
                <el-form-item
                  label="编号"
                  :label-width="formLabelWidth"
                  prop="prid"
                >
                  <el-input
                    disabled
                    v-model="pritemform.prid"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item
                  label="名称"
                  :label-width="formLabelWidth"
                  prop="prname"
                >
                  <el-input
                    v-model="pritemform.prname"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item
                  label="初始值"
                  :label-width="formLabelWidth"
                  prop="initval"
                >
                  <el-input
                    v-model="pritemform.initval"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <div>
                <el-form-item label="显示？" :label-width="formLabelWidth">
                  <el-switch
                    v-model="pritemform.is_show"
                    active-text="是"
                    inactive-text="否"
                    :active-value="1"
                    :inactive-value="0"
                  ></el-switch>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="清零？" :label-width="formLabelWidth">
                  <el-switch
                    v-model="pritemform.is_clear"
                    active-text="是"
                    inactive-text="否"
                    :active-value="1"
                    :inactive-value="0"
                  ></el-switch>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="激活？" :label-width="formLabelWidth">
                  <el-switch
                    v-model="pritemform.isactive"
                    active-text="激活"
                    inactive-text="否"
                    :active-value="1"
                    :inactive-value="0"
                  ></el-switch>
                </el-form-item>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="6">
              <div>
                <el-form-item
                  label="计算顺序"
                  :label-width="formLabelWidth"
                  prop="sort"
                >
                  <el-input
                    v-model="pritemform.sort"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="18">
              <div>
                <el-form-item label="公式" :label-width="formLabelWidth">
                  <el-input
                    v-model="pritemform.prfur"
                    autocomplete="off"
                    type="textarea"
                    :autosize="{ minRows: 10, maxRows: 80 }"
                    @change="prfurChange"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <el-form-item :label-width="10">
                <el-space direction="vertical" class="elspace">
                  <div v-for="item in furpritem">
                    <el-text
                      tag="del"
                      v-if="item.isactive == 0"
                      style="color: red"
                      >{{ item.prid }}:{{ item.prname }}</el-text
                    >
                    <el-text v-else>{{ item.prid }}:{{ item.prname }}</el-text>
                  </div>
                </el-space>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="备注" :label-width="formLabelWidth">
            <el-input v-model="pritemform.remark" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="testreg">公式说明</el-button>
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveForm">确 定</el-button>
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
import { useDeptPosStore, useDicStore, useUserStore } from "../store/index";
import { pritemType } from "../utils/comdata";
export default {
  setup() {
    const deptstore = useDeptPosStore();
    const dicstore = useDicStore();
    const userstore = useUserStore();

    return { deptstore, dicstore, userstore };
  },
  data() {
    return {
      dplimit: [],
      fsysid: "123",
      hrData: {},

      tableData: [],
      roleData: [],
      familyData: [],

      furpritem: [],

      newprid: {
        sid: "",
        rid: "",
      },
      select_accountgrp: "",

      //=========================
      dicpritemgrp: [],
      dicpraccountgrp: [],
      pritemtypeData: [],
      dicprops: {
        label: "itemname",
        children: "children",
      },

      //==================

      loading: false,
      deptVisible: false,

      deptChecked: [],

      dpData: [],
      dpList: [],
      dpProps: {
        label: "dpname",
        ispos: "is_pos",
        children: "children",
      },

      inputsearch: "",
      counts: 1,
      cp1: 1,
      formLabelWidth: "100",

      cmppwd: "",

      dialogFormVisible: false,

      neworedit: true,

      page: {
        limit: 15,
        cpg: 1,
      },
      form: {
        calperiod: "",
        fromdate: "",
        todate: "",
        s01: "",
        s02: "",

        h: {
          sysid: ref(""),
          dpname: "",
          dept: "",
          position: "",
        },
      },

      pritemform: {
        id: "",
        prid: "",
        prname: "",
        is_show: 1,
        is_clear: 0,
        isactive: 1,
        prcalgrp: "",
        prgrp: "",
        prtype: "0",
        initval: 0.0,
        sort: 100,
        prfur: "",
        remark: "",
      },
      pritemrules: {
        prgrp: [{ required: true, message: "请选择账套", trigger: "blur" }],
        prid: [{ required: true, message: "请输入 编号", trigger: "blur" }],
        prname: [
          {
            required: true,
            message: "请输入名称,名称不能数字开头",
            trigger: "blur",
            pattern: /^[_a-zA-Z\u4e00-\u9fa5]+[a-zA-Z0-9\u4e00-\u9fa5_]*$/,
          },
        ],
        initval: [
          {
            required: true,
            message: "请输入 初始值",
            trigger: "blur",
            pattern: /^[0-9]+(\.[0-9]+)?$/,
          },
        ],
        sort: [
          {
            required: true,
            message: "请输入序号",
            trigger: "blur",
            pattern: /^[1-9]\d*$/,
          },
        ],
        prtype: [{ required: true, message: "请选择 类型", trigger: "blur" }],
      },
    };
  },

  mounted() {
    this.getdic();
  },
  methods: {
    changeacc() {
      if (this.neworedit) {
        AX("get", `pritem/getprid/${this.pritemform.prcalgrp}`).then((res) => {
          if (res) {
            this.newprid.sid = res.data.sid;
            this.newprid.rid = res.data.rid;
            this.pritemform.prid = this.newprid.sid;
            this.pritemform.prgrp = this.dicpritemgrp[0].itemid;
            this.pritemform.prtype = this.pritemtypeData[0].itemid;
          }
        });
      }
    },

    accgrpchange() {},

    activeShow(show = 1, idx, row) {
      this.pritemform = Object.assign({}, row);
      this.pritemform.is_show = show;
      // console.log('row', row);

      AX("patch", "pritem/" + this.pritemform.id, this.pritemform).then(
        (res) => {
          if (res) {
            this.listMain();
          }
        }
      );
    },
    activeClear(show = 1, idx, row) {
      this.pritemform = Object.assign({}, row);
      this.pritemform.is_clear = show;

      AX("patch", "pritem/" + this.pritemform.id, this.pritemform).then(
        (res) => {
          if (res) {
            this.listMain();
          }
        }
      );
    },
    activeActivity(show = 1, idx, row) {
      this.pritemform = Object.assign({}, row);
      this.pritemform.isactive = show;

      AX("patch", "pritem/" + this.pritemform.id, this.pritemform).then(
        (res) => {
          if (res) {
            this.listMain();
          }
        }
      );
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
    test() {
      console.log("deptvisible:", this.deptVisible);
      this.deptVisible = !this.deptVisible;
    },
    handleDelete(idx, row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          AX("DELETE", "/hrinfo/" + row.id).then((res) => {
            if (res) {
              this.listMain();
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
    testreg() {
      var str = this.pritemform.prfur;
      var regex = /[sSrR]\d+/g;
      var matches = str.match(regex);
      if (!matches || matches.length < 1) {
        return;
      }

      this.loading = true;

      const pritems = [];

      AX("get", `pritem/findbycalgrpall/${this.pritemform.prcalgrp}`).then(
        (res) => {
          this.furpritem.splice(0, this.furpritem.length);
          if (res && res.total > 0) {
            pritems.push(...res.data);

            pritems.forEach((item) => {
              matches.forEach((pr) => {
                if (item.prid == pr) {
                  if (!this.furpritem.includes(item)) {
                    this.furpritem.push(item);
                  }
                }
              });
            });
          }
          this.loading = false;
        }
      );
    },
    saveForm() {
      this.$refs.refpritemform.validate((valid) => {
        if (valid) {
          console.log(
            this.pritemform.prtype,
            this.pritemform.prfur,
            /\dcase|if|else|when|end\d/gim.test(this.pritemform.prfur)
          );
          if (this.pritemform.prtype == "2") {
            const reg = /\bcase|if|else|when|end\b/gim;
            const casebl = reg.test(this.pritemform.prfur);
            console.log(casebl);
            if (casebl) {
              this.$message.error(
                "链接项目公式中不容许出现case,if,when,end等函数类型！"
              );
              return;
            }
          }

          if (this.pritemform.prtype == "3") {
            this.pritemform.remark = `v${this.pritemform.prid}_${this.pritemform.prcalgrp}`;
          }

          if (!this.neworedit) {
            AX("patch", "pritem/" + this.pritemform.id, this.pritemform).then(
              (res) => {
                if (res) {
                  this.dialogFormVisible = false;
                  this.listMain();
                }
              }
            );
          } else {
            AX("post", "pritem", this.pritemform).then((res) => {
              if (res) {
                this.dialogFormVisible = false;
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
      this.dialogFormVisible = true;
      // this.getdic();
      Object.keys(this.pritemform).forEach((key) => {
        this.pritemform[key] = "";
      });
      this.pritemform.is_clear = 0;
      this.pritemform.isactive = 1;
      this.pritemform.is_show = 1;
      this.pritemform.initval = 0.0;
      this.pritemform.sort = 100;
      //这个元素不删除掉，会报日期格式错误。
      delete this.pritemform["updatedat"];
    },
    handleEdit(index, row) {
      //  this.getdic();

      this.pritemform = Object.assign({}, row);
      this.neworedit = false;
      this.newprid.sid = this.pritemform.prid;
      this.dialogFormVisible = true;
    },
    prfurChange() {
      let str = this.pritemform.prfur;

      if (str) {
        str = str.trimLeft();
        console.log(str.indexOf("select"));
        if (str.indexOf("select") >= 0) {
          this.pritemform.prtype = "3";
        }
      }
    },

    changePage(idx) {
      //  console.log(idx)
      this.page.cpg = idx;
      this.listMain();
    },
    pritemtypeChange() {
      /**
       * 如果选择的是 链接，那么就把prid 更改为r开头的字符型字段
       * 否则保持原来s开头的字段。
       * 但是要考虑：再修改状态中，本身就是链接的字段，不容许更改类型。
       * 本身就是非链接的字段，也不容许更改为其他类型的字段类型。
       */
      if (this.pritemform.prtype == "2") {
        this.pritemform.prid = this.newprid.rid;
      } else {
        this.pritemform.prid = this.newprid.sid;
      }
      //如果选择是累计类型，就不需要显示了，因为显示没有意义。
      //累计主要是sql语句生成视图view
      if (this.pritemform.prtype == "3") {
        this.pritemform.is_show = 0;
      } else {
        this.pritemform.is_show = 1;
      }
    },

    getdic(type = "hr") {
      this.loading = true;

      if (type == "hr") {
        // AX('get', '/dicm/pritemgrp').then(res => {
        //     this.dicpritemgrp = res.data;
        // })
        //     .catch(e => console.log(e.message))
        // AX('get', '/dicm/pritemgcalgrp').then((res) => {
        //     this.dicpraccountgrp = res.data;
        //
        // })
        //     .catch(e => console.log(e.message))
        // AX('get', '/dicm/hrsur').then((res) => {
        //     this.dichrsurData = res.data;
        // })
        //     .catch(e => console.log(e.message))
        this.dicpritemgrp = this.dicstore.getDic("pritemgrp");

        this.dicpraccountgrp = this.dicstore.getDic("pritemgcalgrp");

        this.pritemtypeData.push(...pritemType);

        // this.select_accountgrp = this.dicpraccountgrp[0].itemid;
      }

      this.loading = false;
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

    moreSearch(data) {
      //console.log(data;
      this.loading = true;

      let block = encodeURI(JSON.stringify(data));

      // console.log('blockencodeURI', block.length)

      AX(
        "get",
        "/hrinfo/" +
          this.page.limit +
          "/" +
          this.page.cpg +
          "/" +
          block +
          "/" +
          this.inputsearch
      ).then((res) => {
        this.tableData = res.data.rows;
        this.counts = res.data.count;

        this.tableData.forEach((item) => {
          item.birthshow = moment(item.birth).format("MM-DD");
        });

        this.loading = false;
      });
    },

    listMain() {
      //  console.log('33333333333333')

      //  let api = ''
      if (this.deptChecked.length < 1) {
        this.$message.error("请选择需要查询的类型！");
        return;
      }

      if (!this.select_accountgrp) {
        this.$message.error("请选择帐套！");
        return;
      }

      //   console.log(this.deptChecked)
      this.loading = true;
      let block = {};

      let prtypes = [];

      this.deptChecked.forEach((item) => {
        prtypes.push(item.itemid);
      });

      block.prtypes = prtypes;
      block.accgrp = this.select_accountgrp;
      block.name = this.inputsearch;
      // console.log(this.select_accountgrp)
      //console.log('block', JSON.stringify(block))
      block = encodeURI(JSON.stringify(block));

      // console.log('blockencodeURI', block.length)

      let cpg = this.page.cpg;
      if (!this.page.cpg) {
        cpg = 1;
      }

      AX(
        "get",
        "pritem/find?page=" +
          this.page.cpg +
          "&pagesize=" +
          this.page.limit +
          "&block=" +
          block
      ).then((res) => {
        this.tableData.splice(0, this.tableData.length);
        if (res && res.total > 0) {
          this.tableData = res.data;
          this.counts = res.total;
        }
        this.loading = false;
      });
    },
  },
};
</script>
<style scoped>
.elspace {
  margin: 1px 1px;
  overflow-y: scroll;
  width: 250px;
  height: 216px;
  border: 1px solid rgb(231, 231, 231);
}
.ispos {
  padding: 2px 6px;
  cursor: pointer;
  font-size: 14px;
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
</style>
