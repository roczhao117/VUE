<template>
  <!-- 工作表单 -->
  <div class="dialogform">
    <el-form :rules="rules" :model="form" ref="form">
      <el-row :gutter="24">
        <el-col :span="10">
          <div>
            <el-form-item
              label="工作单位"
              :label-width="formLabelWidth"
              prop="company"
            >
              <el-input
                size="default"
                v-model="form.company"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="7">
          <div>
            <el-form-item
              label="所属部门"
              :label-width="formLabelWidth"
              prop="dept"
            >
              <el-input
                size="default"
                v-model="form.dept"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="7">
          <div>
            <el-form-item
              label="担任职位"
              :label-width="formLabelWidth"
              prop="position"
            >
              <el-input
                size="default"
                v-model="form.position"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <el-form-item
              label="联系电话"
              :label-width="formLabelWidth"
              prop="tele"
            >
              <el-input
                size="default"
                v-model="form.tele"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <el-form-item
              label="开始日期"
              :label-width="formLabelWidth"
              prop="fromdate"
            >
              <el-date-picker
                v-model="form.fromdate"
                type="date"
                placeholder="选择日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              ></el-date-picker>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <el-form-item
              label="结束日期"
              :label-width="formLabelWidth"
              prop="todate"
            >
              <el-date-picker
                v-model="form.todate"
                type="date"
                placeholder="选择日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              ></el-date-picker>
            </el-form-item>
          </div>
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
      <el-divider content-position="left">
        <i class="el-icon-edit-outline">工作经历</i>
      </el-divider>
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
            <el-table-column label="激活">
              <template #default="scope">
                <el-tag type="success" v-if="scope.row.isactive == 1">{{
                  "激活"
                }}</el-tag>
                <el-tag type="danger" v-else>{{ "否" }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="company"
              label="工作单位"
              width="150"
            ></el-table-column>
            <el-table-column prop="dept" label="所属部门"></el-table-column>
            <el-table-column prop="position" label="担任职位"></el-table-column>

            <el-table-column prop="tele" label="联系电话"></el-table-column>

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
              width="150"
            ></el-table-column>
            <el-table-column prop="id" fixed="right" label="操作" width="120">
              <template #default="scope">
                <span class="butgrp">
                  <el-button
                    size="small"
                    icon="Edit"
                    @click="editform(scope.$index, scope.row)"
                  ></el-button>

                  <el-button
                    size="small"
                    type="danger"
                    icon="Delete"
                    @click="delform(scope.$index, scope.row)"
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
          <el-button
            type="success"
            icon="Plus"
            @click="init_form"
            v-if="is_new == false"
            >新 建</el-button
          >

          <el-button type="success" @click="saveform" v-if="is_new == true"
            >新 增</el-button
          >
          <el-button type="primary" @click="saveform" v-if="is_new == false"
            >保 存</el-button
          >
          <el-button @click="closeform">离 开</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { AX } from "../utils/api";
import { ref } from "vue";

export default {
  props: {
    fsysid: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      selfRouter: "works",

      formData: [],

      loading: false,

      is_new: true,

      dialogFormVisible: false,

      formLabelWidth: 100,

      form: {
        id: "",
        sysid: ref(""),
        company: "",
        position: "",
        dept: "",
        tele: "",
        fromdate: "",
        todate: "",
        remark: "",
        isactive: 1,
        sort: 100,
      },
      rules: {
        company: [
          { required: true, message: "请输入 工作单位", trigger: "blur" },
        ],

        position: [
          { required: true, message: "请输入 担任职位", trigger: "blur" },
        ],

        dept: [{ required: true, message: "请输入 所属部门", trigger: "blur" }],

        fromdate: [
          { required: true, message: "请选择 开始日期", trigger: "blur" },
        ],

        todate: [
          { required: true, message: "请选择 结束日期", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.listMain();
  },
  watch: {
    fsysid() {
      this.listMain();
    },
  },
  methods: {
    init_form() {
      this.is_new = true;

      const keyitems = ["sysid", "createdat", "updatedat", "deletedat", "id"];

      for (let item in this.form) {
        if (keyitems.includes(item.toString().toLowerCase()) == false) {
          this.form[item] = "";
        }
      }
      this.form.sort = 100;
      this.form.isactive = 1;
    },

    closeform() {
      this.$emit("close" + this.selfRouter + "Form", false);
    },

    delform(idx, row) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          AX("DELETE", this.selfRouter + "/" + row.id).then((res) => {
            if (res) {
              this.listMain();
              this.init_form();
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

    saveform() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.is_new) {
            AX("patch", this.selfRouter + "/" + this.form.id, this.form).then(
              (res) => {
                if (res) {
                  this.dialogFormVisible = false;
                  this.listMain();
                  this.init_form();
                }
              }
            );
          } else {
            if (this.fsysid) {
              this.form.sysid = this.fsysid;
              AX("post", this.selfRouter, this.form).then((res) => {
                if (res) {
                  this.dialogFormVisible = false;
                  this.listMain();
                  this.init_form();
                }
              });
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
        }
        this.loading = false;
      });
    },
  },
};
</script>
<style scoped>
.el-dialog__body {
  text-align: left;
}
.input-with-select {
  width: 360px;
  margin-left: 10px;
}
.dialogform {
  display: flex;
  margin: 0 0;
}
.el-form-item {
  margin-bottom: 14px;
}
.el-form-item__content {
  display: flex;
}
td {
  padding: 4px 0;
}
.el-table td,
.el-table th {
  padding: 0;
}

.el-menu {
  padding: 0;
}
.label-width {
  width: 200px;
}
.el-select,
.el-date-picker {
  width: 100%;
}

.ispos {
  color: white;
  background-color: #409eff;
  padding: 2px 6px;
  cursor: pointer;
  font-size: 12px;
  border-radius: 5px;
}
.el-divider i {
  color: #409eff;
}
</style>
