<template>
  <!-- 工作表单 -->
  <div>
    <el-form :rules="rules" :model="form" ref="refform">
      <el-row :gutter="24">
        <el-col :span="6">
          <div>
            <el-form-item
              label="变更类型"
              :label-width="formLabelWidth"
              prop="type"
            >
              <el-select
                v-model="form.type"
                placeholder="请选择"
                size="default"
                @change="transtypeChange"
              >
                <el-option
                  v-for="item in dictranstypeData"
                  :key="item.itemid"
                  :label="item.itemname"
                  :value="item.itemid"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>

        <el-col :span="8">
          <div>
            <el-form-item
              label="当前内容"
              :label-width="formLabelWidth"
              prop="fromid"
            >
              <el-input
                size="default"
                v-model="form.fromid"
                autocomplete="off"
                disabled
                id="transfrom"
              ></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="8">
          <div>
            <el-form-item
              label="变更到"
              :label-width="formLabelWidth"
              prop="toid"
            >
              <el-popover
                placement="bottom"
                title
                :width="400"
                trigger="click"
                :visible="deptVisible"
              >
                <el-tree
                  :data="dpData"
                  node-key="id"
                  ref="deptTree"
                  :props="dpProps"
                  :default-expand-all="true"
                  @node-click="dpNodeClick"
                  class="popcls"
                  v-if="form.type == 'A'"
                >
                  <template #default="{ node, data }">
                    <span
                      id="transto"
                      :class="{ ispos: data.deptlevel == 2 }"
                      >{{ node.label }}</span
                    >
                  </template>
                </el-tree>

                <el-tree
                  :data="deptpos"
                  node-key="id"
                  ref="deptTree"
                  :props="dposProps"
                  :default-expand-all="true"
                  @node-click="posNodeClick"
                  class="popcls"
                  v-if="form.type == 'B'"
                >
                  <template #default="{ node }">
                    <span id="transto">{{ node.label }}</span>
                  </template>
                </el-tree>
                <el-tree
                  :data="dichrgradeData"
                  node-key="id"
                  ref="deptTree"
                  :props="dicProps"
                  :default-expand-all="true"
                  @node-click="dicNodeClick"
                  class="popcls"
                  v-if="form.type == 'C'"
                >
                  <template #default="{ node }">
                    <span id="transto">{{ node.label }}</span>
                  </template>
                </el-tree>
                <el-tree
                  :data="dichrtypeData"
                  node-key="id"
                  ref="deptTree"
                  :props="dicProps"
                  :default-expand-all="true"
                  @node-click="dicNodeClick"
                  class="popcls"
                  v-if="form.type == 'E'"
                >
                  <template #default="{ node }">
                    <span id="transto">{{ node.label }}</span>
                  </template>
                </el-tree>

                <template #reference>
                  <el-input
                    size="default"
                    v-model="form.toid"
                    autocomplete="off"
                    @click="to_click"
                  ></el-input>
                </template>
              </el-popover>
            </el-form-item>
          </div>
        </el-col>

        <el-col :span="6">
          <el-form-item
            label="执行日期"
            :label-width="formLabelWidth"
            prop="execdate"
          >
            <el-date-picker
              v-model="form.execdate"
              size="default"
              type="date"
              placeholder="选择日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="激活？" :label-width="formLabelWidth">
            <el-switch
              v-model="form.isactive"
              active-color="#409EFF"
              inactive-color="#F56C6C"
              active-text="是"
              inactive-text="否"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="备注" :label-width="formLabelWidth">
            <el-input
              size="default"
              v-model="form.remark"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-divider content-position="left">
            <i class="el-icon-edit-outline">内部变动历史信息</i>
          </el-divider>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-table
            :data="formData"
            style="width: 100%"
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            stripe
          >
            <el-table-column prop="type" label="类型" fixed="left" width="100">
              <template #default="scope">
                <span>{{ dictranstypeData.dicDescs(scope.row.type) }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="from" label="从" width="180">
              <template #default="scope">
                <span v-if="scope.row.type == 'A'">{{
                  dpList.dicDescs(scope.row.fromid, "dpid", "dpname")
                }}</span>
                <span v-if="scope.row.type == 'B'">{{
                  dpList.dicDescs(scope.row.fromid, "dpid", "dpname")
                }}</span>
                <span v-if="scope.row.type == 'C'">{{
                  dichrgradeData.dicDescs(scope.row.fromid)
                }}</span>
                <span v-if="scope.row.type == 'D'">{{ scope.row.fromid }}</span>
                <span v-if="scope.row.type == 'E'">{{
                  dichrtypeData.dicDescs(scope.row.fromid)
                }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="to" label="到" width="180">
              <template #default="scope">
                <span v-if="scope.row.type == 'A'">{{
                  dpList.dicDescs(scope.row.toid, "dpid", "dpname")
                }}</span>
                <span v-if="scope.row.type == 'B'">{{
                  dpList.dicDescs(scope.row.toid, "dpid", "dpname")
                }}</span>
                <span v-if="scope.row.type == 'C'">{{
                  dichrgradeData.dicDescs(scope.row.toid)
                }}</span>
                <span name="transto" v-if="scope.row.type == 'D'">{{
                  scope.row.toid
                }}</span>
                <span v-if="scope.row.type == 'E'">{{
                  dichrtypeData.dicDescs(scope.row.toid)
                }}</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="execdate"
              label="执行日期"
              width="150"
            ></el-table-column>
            <el-table-column prop="passed" label="激活" width="70">
              <template #default="scope">
                <el-tag type="success" v-if="scope.row.isactive == 1">{{
                  "激活"
                }}</el-tag>

                <el-tag type="danger" v-else>{{ "否" }}</el-tag>
              </template>
            </el-table-column>

            <el-table-column
              prop="remark"
              label="备注"
              width="150"
            ></el-table-column>
            <el-table-column prop="id" fixed="right" label="操作">
              <template #default="scope">
                <span class="butgrp">
                  <el-button
                    size="small"
                    type="danger"
                    @click="delform(scope.$index, scope.row)"
                    v-if="scope.row.isactive == 1"
                    ><el-icon><Delete /></el-icon
                  ></el-button>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col
          :span="24"
          style="display: flex; justify-content: flex-end; padding-top: 15px"
        >
          <el-button type="success" @click="init_form" v-if="is_new == false"
            >新 建</el-button
          >

          <el-button type="success" @click="saveform" v-if="is_new == true"
            >新 增</el-button
          >

          <el-button type="primary" @click="saveform" v-if="is_new == false"
            >保 存</el-button
          ><el-button @click="closeform">离 开</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { AX } from "../utils/api";
import { ref } from "vue";
import { useDicStore } from "../store/index";
import moment from "moment";
// import $ from 'jquery';

export default {
  setup() {
    const dicstore = useDicStore();
    return { dicstore };
  },
  props: {
    fsysid: {
      type: String,
      required: true,
    },
    hrData: {
      type: Object,
      required: true,
    },

    dichrtypeData: {
      type: Array,
      required: true,
    },
    dichrgradeData: {
      type: Array,
      required: true,
    },
    dpData: {
      type: Object,
      required: true,
    },
    dpList: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      selfRouter: "transform",

      formData: [],

      deptpos: [],

      loading: false,

      is_new: true,

      dialogFormVisible: false,

      deptVisible: false,

      formLabelWidth: "100",

      dictranstypeData: [],

      dpProps: {
        label: "deptname",
        ispos: "deptlevel",
        children: "children",
      },
      dposProps: {
        label: "dpname",
        children: "children",
      },
      dicProps: {
        label: "itemname",
        id: "itemid",
        children: "children",
      },

      form: {
        id: "",
        sysid: ref(""),
        type: "",
        fromid: "",
        toid: "",
        execdate: "",
        fromdescs: "",
        todescs: "",
        remark: "",
        isactive: 1,
        sort: 100,
      },
      deptposform: {
        dept: "",
        position: "",
      },
      rules: {
        type: [{ required: true, message: "请选择 类型", trigger: "blur" }],

        toid: [
          { required: true, message: "请选择 变更到的内容", trigger: "blur" },
        ],

        execdate: [
          { required: true, message: "请选择 执行日期", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.getdic();
    this.listMain();
  },
  watch: {
    fsysid() {
      this.listMain();
    },
  },
  methods: {
    dpNodeClick(data) {
      if (data.deptlevel == 2) {
        this.deptVisible = false;
        this.form.toid = data.deptname;
        this.deptposform.dept = data.fid;
        this.deptposform.position = data.deptid;
      } else {
        this.$message.error("请选择绿色的职位！");
      }
    },
    posNodeClick(data) {
      this.deptVisible = false;
      this.form.toid = data.dpname;
      this.deptposform.dept = data.fid;
      this.deptposform.position = data.dpid;
    },
    dicNodeClick(data) {
      this.deptVisible = false;
      this.form.toid = data.itemname;
      this.deptposform.dept = data.itemid;
      this.deptposform.position = data.itemid;
    },

    to_click() {
      //如果不等一当前工资
      if (this.form.type != "D") {
        this.deptVisible = true;
      }
    },

    transtypeChange() {
      if (!this.form.type) {
        return;
      }
      // console.log("=========================================", this.dpList);

      // console.log("#########################################", this.dpData);
      this.form.toid = "";
      switch (this.form.type) {
        case "A": //部门职位
          this.form.fromid =
            this.dpList.dicDescs(this.hrData.dept, "dpid", "dpname") +
            " [ " +
            this.dpList.dicDescs(this.hrData.position, "dpid", "dpname") +
            " ]";
          break;
        case "B": //职位
          this.deptpos.splice(0, this.deptpos.length);
          this.dpList.forEach((item) => {
            if (item.fid == this.hrData.dept) {
              this.deptpos.push(item);
            }
          });
          this.form.fromid = this.dpList.dicDescs(
            this.hrData.position,
            "dpid",
            "dpname"
          );
          break;
        case "C": //级别
          this.form.fromid = this.dichrgradeData.dicDescs(this.hrData.grade);
          break;
        case "D": //当前工资
          this.form.fromid = this.hrData.currsalary;
          break;
        case "E": //录用性质
          this.form.fromid = this.dichrtypeData.dicDescs(this.hrData.type);
          break;
        default:
          console.log(this.form.type);
      }
    },

    init_form() {
      this.is_new = true;

      const keyitems = [
        "sysid",
        "createdat",
        "updatedat",
        "deletedat",
        "id",
        "fromid",
        "toid",
        "type",
        "formdescs",
        "todescs",
      ];

      for (let item in this.form) {
        if (keyitems.includes(item.toString().toLowerCase()) == false) {
          this.form[item] = "";
        }
      }
      this.form.sort = 100;
      this.form.isactive = 1;
      this.form.execdate = moment().format("YYYY-MM-DD");
    },

    closeform() {
      this.$emit("close" + this.selfRouter + "Form", false);
    },

    delform(idx, row) {
      this.$confirm(
        "此操作将永久删除该人当天所有变动记录,并将已经发生的变动取消, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          AX("DELETE", this.selfRouter + "/" + row.id).then((res) => {
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

    editform(idx, row) {
      //  console.log(idx, row);
      this.is_new = false;
      this.form = Object.assign({}, row);
    },

    /**
     * 这里需要检查，同一天，同种类型只能存在一条数据，但可以不算非激活的数据，
     * 所以数据一旦被设置为非激活，就不得再激活，否则出错。
     */
    /**
     * This function checks if there is a unique combination of type and execdate in the formData array.
     * If the type is "A", "B", "a", or "b", it checks if there is already an item with the same type, execdate, and isactive = 1.
     * If the type is not "A", "B", "a", or "b", it checks if there is already an item with the same type, execdate, and isactive = 1.
     * If a duplicate combination is found, an error message is displayed and the function returns false.
     * If no duplicate combination is found, the function returns true.
     */
    checkUnique(type, execdate) {
      let r = true;
      this.formData.forEach((item) => {
        //如果是部门和职位，或者单部门，单职位
        if (["A", "B", "a", "b"].includes(type)) {
          if (
            //存在同一日期，同一类型，A,B中一个就不行。
            ["A", "B", "a", "b"].includes(item.type) &&
            execdate == item.execdate &&
            item.isactive == 1
          ) {
            this.$message.error(
              "该日期已经存在该类型的变动，请先取消，再保存！"
            );

            r = false;
            return r;
          }
        } else {
          if (
            type == item.type &&
            execdate == item.execdate &&
            item.isactive == 1
          ) {
            this.$message.error(
              "该日期已经存在该类型的变动，请先取消，再保存！"
            );

            r = false;
            return r;
          }
        }
      });
      return r;
    },

    saveform() {
      this.form.fromdescs = this.form.fromid;
      this.form.todescs = this.form.toid;

      this.$refs.refform.validate((valid) => {
        if (valid) {
          if (this.fsysid) {
            this.form.sysid = this.fsysid;

            if (!this.checkUnique(this.form.type, this.form.execdate)) {
              return;
            }

            //增加部门职位
            if (this.form.type == "A") {
              if (
                this.hrData.dept == this.deptposform.dept &&
                this.hrData.position == this.deptposform.position
              ) {
                this.$message.error("保存无效，数据更改前后必须不一致！");
                return;
              }

              this.form.fromid = this.hrData.dept;
              this.form.toid = this.deptposform.dept;
              this.form.type = "A";
              //判断部门是否变了？
              if (this.form.fromid == this.form.toid) {
                this.form.fromid = this.hrData.position;
                this.form.toid = this.deptposform.position;
                this.form.type = "B";
                //判断职位是否相同？
                if (this.form.fromid != this.form.toid) {
                  AX("post", this.selfRouter, this.form).then((res) => {
                    if (res) {
                      //    this.dialogFormVisible = false;
                      this.listMain();
                      this.init_form();
                    }
                  });
                } else {
                  this.listMain();
                  this.init_form();
                }
              } else {
                //如果部门变了，就POST两次，无所谓性能，一般一个月就5条。
                AX("post", this.selfRouter, this.form).then((res) => {
                  if (res) {
                    this.form.fromid = this.hrData.position;
                    this.form.toid = this.deptposform.position;
                    this.form.type = "B";
                    //判断职位是否相同，如果职位编号是一样的，就算你改变了部门，也算只改部门，不改职位
                    //这个概念很重要，比如你从人事部秘书到财务部秘书，如果秘书的代码是一致的，那么
                    //变动记录中只记录部门变更，而不记录职位变更。职位保持一致。
                    if (this.form.fromid != this.form.toid) {
                      AX("post", this.selfRouter, this.form).then((res) => {
                        if (res) {
                          //    this.dialogFormVisible = false;
                          this.listMain();
                          this.init_form();
                        }
                      });
                    } else {
                      this.listMain();
                      this.init_form();
                    }
                  }
                });
              }
            } else {
              if (this.form.type == "B") {
                this.form.fromid = this.hrData.position;
                this.form.toid = this.deptposform.position;
              }

              if (this.form.type == "C") {
                this.form.fromid = this.hrData.grade;
                this.form.toid = this.deptposform.position;
              }
              if (this.form.type == "D") {
                this.form.fromid = this.hrData.currsalary;
              }
              if (this.form.type == "E") {
                this.form.fromid = this.hrData.type;
                this.form.toid = this.deptposform.position;
              }
              if (this.form.fromid != this.form.toid) {
                const reg =
                  /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;

                console.log(
                  this.form.toid,
                  reg.test(this.form.toid),
                  this.form.type == "D"
                );
                if (this.form.type == "D") {
                  if (!reg.test(this.form.toid)) {
                    this.$message.error("工资变更后内容必须填写阿拉伯数字！");
                    return;
                  }
                }

                AX("post", this.selfRouter, this.form).then((res) => {
                  if (res) {
                    this.dialogFormVisible = false;
                    this.listMain();
                    this.init_form();
                  }
                });
              } else {
                this.$message.error("保存无效，数据更改前后必须不一致！");
              }
            }
          }
        }
      });
    },

    listMain() {
      AX("get", this.selfRouter + "/" + this.fsysid).then((res) => {
        this.formData.splice(0, this.formData.length);
        if (res && res.data && res.data.length > 0) {
          this.formData = res.data;
          this.form.type = "";
          this.form.fromid = "";
          this.form.toid = "";
          this.form.remark = "";
          this.form.isactive = 1;
        }
        this.loading = false;
      });
    },

    getdic() {
      // AX("get", "/dicm/transtype").then((res) => {
      //   this.dictranstypeData = res.data;
      // });
      this.dictranstypeData = this.dicstore.getDic("transtype");
    },
  },
};
</script>
<style scoped>
.ispos {
  color: white;
  background-color: #67c23a;
  padding: 2px 6px;
  cursor: pointer;
  font-size: 12px;
  border-radius: 5px;
}
.el-divider i {
  color: #409eff;
}
.popcls {
  overflow-x: scroll;
  height: 400px;
  border: 1px solid gray;
}
</style>
