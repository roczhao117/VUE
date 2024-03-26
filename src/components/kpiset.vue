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
        placeholder="可填写名称来查询"
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
      <div style="margin-left: 20px; width: 100%; width: 800px">
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
            prop="itemid"
            fixed="left"
            label="代码"
            width="100"
          ></el-table-column>
          <el-table-column
            prop="itemname"
            label="模版名称"
            width="150"
          ></el-table-column>
          <el-table-column
            prop="itemename"
            label="模版描述"
            width="150"
          ></el-table-column>

          <el-table-column prop="isactive" label="停用" width="80">
            <template #default="scope">
              <span v-if="scope.row.isactive == 0">❌</span>
              <span v-else>-</span>
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
    <div style="margin-top: 25px; margin-left: 0px">
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
        title="绩效模版设置"
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
                  label="模版说明"
                  :label-width="formLabelWidth"
                  prop="itemname"
                >
                  <el-input
                    size="small"
                    v-model="form.itemname"
                    autocomplete="off"
                    prefix-icon="edit"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>

            <el-col :span="12">
              <div>
                <el-form-item
                  label="模版描述"
                  :label-width="formLabelWidth"
                  prop="itemename"
                >
                  <el-input
                    size="small"
                    v-model="form.itemename"
                    autocomplete="off"
                    prefix-icon="edit"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <div>
                <el-form-item
                  label="代码"
                  :label-width="formLabelWidth"
                  prop="itemid"
                  v-show="false"
                >
                  <el-input
                    size="small"
                    v-model="form.itemid"
                    autocomplete="off"
                    :disabled="true"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>

            <el-divider content-position="center"
              >绩效组适用部门匹配设置</el-divider
            >

            <el-col :span="12">
              <div>
                <el-tree
                  :data="dpData"
                  node-key="deptid"
                  ref="deptsetTree"
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
            <el-col :span="12">
              <div>
                <el-tree
                  :data="kpiData"
                  node-key="id"
                  ref="kpisetTree"
                  :props="kpiProps"
                  :default-expand-all="true"
                  show-checkbox
                  style="
                    overflow-x: scroll;
                    height: 300px;
                    border: 1px rgb(175, 175, 175) solid;
                    font-size: 12px;
                  "
                >
                  <template #default="{ node, data }">
                    <span>{{ node.label }}</span>
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
import { reactive } from "vue";
//import moment from 'moment';
import { v4 as uuidv4 } from "uuid";
import $ from "jquery";
import { storeToRefs } from "pinia";
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
      kpiData: reactive([]),
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
      kpiProps: {
        label: "itemname",
        //这里不需要children，因为只要绩效组，其实可以用其他控件
        //这里不用，是因为只要更改了PINIA中的数据，他的数据就是被改变的，后面无法更改，
        //比如你再里面加了东西，再其他任何地方都加了，所谓状态机就是这样。
        //如果要干净的数据，还是必须从数据库中抓取。
        //就是对状态机PINIA中做的任何更改都会同步到pinia中。
        children: "xxx",
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

      form: {
        id: "",
        isactive: 1,
        remark: "",
        itemid: "",
        itemname: "",
        itemename: "",
        sort: 100,
        //部门ids
        code1: "",
        //绩效组ids//
        code2: "",
      },
      rules: {
        itemid: [
          {
            required: true,
            message: "请输入代码(4-20位字母数字)！",
            pattern: /^[0-9a-zA-Z-]+$/,
            trigger: "blur",
            min: 4,
            max: 20,
          },
        ],
        itemname: [
          {
            required: true,
            message: "请输入说明",
            trigger: "blur",
            pattern: /[\u4e00-\u9fa5a-zA-Z0-9]+/,
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
      // this.$refs.deptTree1.setCheckedNodes(["-1"]);
      this.loading = false;
      this.dialogAddVisible = false;
    },
    saveForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          const setdept = this.$refs.deptsetTree.getCheckedKeys();
          const setkpi = this.$refs.kpisetTree.getCheckedKeys();

          if (setdept.length < 1) {
            this.$message.error("请选择绩效匹配部门！");
            return;
          }
          if (setkpi.length < 1) {
            this.$message.error("请选择绩效组！");
            return;
          }

          this.form.code1 = setdept.join(",");
          this.form.code2 = setkpi.join(",");
          this.form.dicmid = "kpitmp";

          console.log(this.form);

          if (this.form.id) {
            AX("patch", "dic/" + this.form.id, this.form).then((res) => {
              if (res) {
                this.$refs.deptsetTree.setCheckedNodes(["-1"]);
                this.$refs.kpisetTree.setCheckedNodes(["-1"]);
                this.dialogAddVisible = false;
                this.listMain();
              }
            });
          } else {
            AX("post", "dic", this.form).then((res) => {
              if (res) {
                this.$refs.deptsetTree.setCheckedNodes(["-1"]);

                this.$refs.kpisetTree.setCheckedNodes(["-1"]);

                this.dialogAddVisible = false;

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
      this.form.itemid = uuidv4();
      this.form.itemname = "";
      this.form.itemename = "";
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

      /**初始化 */

      this.$nextTick(() => {
        this.$refs.deptsetTree.setCheckedKeys([]);
        this.$refs.kpisetTree.setCheckedKeys([]);
      });
      // let rootNode = this.$refs.deptsetTree.getNode(this.dpData[0]);
      // this.$refs.deptsetTree.setChecked(rootNode, false, true);

      // /**初始化 */
      // this.kpiData.forEach((v) => {
      //   this.$nextTick(() => {
      //     this.$refs.kpisetTree.setChecked(v, false, true);
      //   });
      // });

      let depts = row.code1.split(",");
      depts.forEach((v) => {
        this.$nextTick(() => {
          this.$refs.deptsetTree.setChecked(v, true, false);
        });
      });

      let kpis = row.code2.split(",");
      kpis.forEach((v) => {
        this.$nextTick(() => {
          this.$refs.kpisetTree.setChecked(v, true, false);
        });
      });
    },
    changePage(idx) {
      //  console.log(idx)
      this.page.cpg = idx;
      this.listMain();
    },
    async getdic(type = "hr") {
      this.loading = true;

      this.dpData = this.deptstore.deptposData.data;
      this.flattenTree(this.dpData);
      this.kpiData = [];

      this.kpiData = this.dicstore.getDic("evaitem", "evaitem");

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

      this.loadingContent = "拼命加载中";
      this.loadingBackground = "rgba(0, 0, 0, 0.8)";
      this.loading = true;
      let block = {};

      block.name = this.inputsearch;
      block = encodeURI(JSON.stringify(block));
      AX(
        "get",
        "dic/dicmid/kpitmp?page=" +
          this.page.cpg +
          "&pagesize=" +
          this.page.limit +
          "&block=" +
          block
      ).then((res) => {
        console.log(res);
        this.tableData = [];
        if (res && res.total > 0) {
          this.tableData = res.data;
          this.page.counts = parseInt(res.total);
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
