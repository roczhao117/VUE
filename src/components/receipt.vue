<template>
  <!-- 工作表单 -->
  <div>
    <el-form :rules="rules" :model="form" ref="form">
      <el-row :gutter="24">
        <el-col :span="8">
          <div>
            <el-form-item
              label="物品名称"
              :label-width="formLabelWidth"
              prop="item"
            >
              <el-input
                size="default"
                v-model="form.item"
                autocomplete="off"
                :disabled="is_new == false"
              ></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="16">
          <div>
            <el-form-item
              label="型号/编号"
              :label-width="formLabelWidth"
              prop="code"
            >
              <el-input
                size="default"
                v-model="form.code"
                autocomplete="off"
                :disabled="is_new == false"
              ></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <el-form-item label="金额" :label-width="formLabelWidth" prop="sum">
              <el-input
                size="default"
                v-model="form.sum"
                autocomplete="off"
                @change="sumChange"
                :disabled="is_new == false"
              ></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <el-form-item
              label="数量"
              :label-width="formLabelWidth"
              prop="nums"
            >
              <el-input-number
                size="default"
                v-model="form.nums"
                autocomplete="off"
                @change="sumChange"
                :disabled="is_new == false"
              ></el-input-number>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <el-form-item
              label="领用人"
              :label-width="formLabelWidth"
              prop="recipient"
            >
              <el-input
                size="default"
                v-model="form.recipient"
                autocomplete="off"
                placeholder="领用人姓名"
                :disabled="is_new == false"
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
                placeholder="领用人联系电话"
                :disabled="is_new == false"
              ></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="6">
          <div>
            <el-form-item
              label="领用日期"
              :label-width="formLabelWidth"
              prop="fromdate"
            >
              <el-date-picker
                v-model="form.fromdate"
                type="date"
                placeholder="选择日期"
                format="YYYY-MM-DD"
                @change="fromdateChange"
                :disabled="is_new == false"
              ></el-date-picker>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <el-form-item
              label="归还日期"
              :label-width="formLabelWidth"
              prop="todate"
            >
              <el-date-picker
                v-model="form.todate"
                type="date"
                placeholder="选择日期"
                format="YYYY-MM-DD"
                :disabled="is_new == false"
              ></el-date-picker>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <el-form-item
              label="登记人"
              :label-width="formLabelWidth"
              prop="registrant"
            >
              <el-input
                size="default"
                v-model="form.registrant"
                autocomplete="off"
                placeholder=""
                :disabled="true"
              ></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-divider content-position="left">
        <i class="el-icon-edit-outline">领用最终处置状态</i>
      </el-divider>
      <el-row :gutter="24">
        <el-col :span="6">
          <div>
            <el-form-item
              label="状态"
              :label-width="formLabelWidth"
              prop="status"
            >
              <el-select
                v-model="form.status"
                placeholder="请选择"
                size="default"
              >
                <el-option
                  v-for="item in statusData"
                  :key="item.id"
                  :label="item.descs"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>

        <el-col :span="6">
          <div>
            <el-form-item
              label="处置日期"
              :label-width="formLabelWidth"
              prop="dealdate"
            >
              <el-date-picker
                v-model="form.dealdate"
                type="date"
                placeholder="选择日期"
                format="YYYY-MM-DD"
              ></el-date-picker>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <el-form-item
              label="处置人员"
              :label-width="formLabelWidth"
              prop="hander"
            >
              <el-input
                size="default"
                v-model="form.handler"
                autocomplete="off"
                placeholder="最后状态处理人"
                :disabled="true"
              ></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <el-form-item
              label="处置金额"
              :label-width="formLabelWidth"
              prop="fee"
            >
              <el-input
                v-model="form.fee"
                placeholder="处置金额"
                autocomplete="off"
              ></el-input>
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
          <el-divider content-position="left">
            <i class="el-icon-edit-outline">领用历史</i>
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
            <el-table-column prop="item" label="状态" fixed="left" width="100"
              ><template #default="scope">
                <el-tag>{{
                  stdata.dicDescs(scope.row.status, "id", "descs")
                }}</el-tag>
              </template></el-table-column
            >
            <el-table-column
              prop="item"
              label="物品"
              fixed="left"
              width="100"
            ></el-table-column>
            <el-table-column
              prop="code"
              label="型号或编号"
              width="150"
            ></el-table-column>
            <el-table-column
              prop="sum"
              label="价值"
              width="120"
            ></el-table-column>
            <el-table-column
              prop="recipient"
              label="领用人"
              width="100"
            ></el-table-column>
            <el-table-column
              prop="nums"
              label="领用数量"
              width="100"
            ></el-table-column>
            <el-table-column
              prop="fromdate"
              label="领用日期"
              width="100"
            ></el-table-column>
            <el-table-column
              prop="todate"
              label="预归还日"
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
                  <el-tooltip content="处置资产" placement="bottom">
                    <el-button
                      size="small"
                      type="primary"
                      @click="editform(scope.$index, scope.row)"
                      ><el-icon><EditPen /></el-icon></el-button
                  ></el-tooltip>
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
          >
          <el-button @click="closeform">离 开</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import moment from "moment";
import { AX } from "../utils/api";
import { ref } from "vue";
import { useDicStore, useUserStore } from "../store/index";
import { statusData } from "../utils/comdata";

export default {
  setup() {
    const dicstore = useDicStore();
    const usestore = useUserStore();
    return { dicstore, usestore };
  },
  props: {
    fsysid: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      selfRouter: "receipt",

      formData: [],
      stdata: [],

      loading: false,

      is_new: true,

      dialogFormVisible: false,

      formLabelWidth: 100,

      statusData: [
        { id: "1", descs: "未领用" },
        { id: "2", descs: "已领" },
        { id: "3", descs: "已归还" },
        { id: "4", descs: "遗失" },
        { id: "5", descs: "报废" },
        { id: "6", descs: "登记错误" },
      ],

      form: {
        id: "",
        sysid: ref(""),
        item: "",
        code: "",
        recipient: "",
        fromdate: "",
        sum: 1000,
        nums: 1,
        todate: "",
        registrant: "",
        remark: "",
        tele: "",
        status: "2",
        fee: 0,
        handler: "",
        sort: 0,
        isactive: 1,
      },
      rules: {
        item: [
          { required: true, message: "请输入 领用物品内容", trigger: "blur" },
        ],
        tele: [
          { required: true, message: "请输入 领用人联系电话", trigger: "blur" },
        ],

        sum: [
          {
            required: true,
            message: "请输入 金额，没有写0",
            trigger: "blur",
            pattern: /^(0|0(.)?\d+|[1-9]\d*(.)?\d*)$/,
          },
        ],
        fee: [
          {
            required: true,
            message: "请输入 金额，没有写0",
            trigger: "blur",
            pattern: /^(0|0(.)?\d+|[1-9]\d*(.)?\d*)$/,
          },
        ],

        nums: [
          {
            required: true,
            message: "请输入 领用数量",
            trigger: "blur",
            pattern: /^(0|0(.)?\d+|[1-9]\d*(.)?\d*)$/,
          },
        ],

        fromdate: [
          { required: true, message: "请选择 领用日期", trigger: "blur" },
        ],

        recipient: [
          { required: true, message: "请选择 领用人", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.init_form();
    this.listMain();
  },
  watch: {
    fsysid() {
      this.listMain();
    },
  },
  methods: {
    fromdateChange() {
      this.form.dealdate = this.form.fromdate;
    },
    sumChange() {
      this.form.fee = this.form.sum * this.form.nums;
    },
    init_form() {
      this.is_new = true;
      this.stdata.push(...statusData);
      const keyitems = ["sysid", "createdat", "updatedat", "deletedat", "id"];

      for (let item in this.form) {
        if (keyitems.includes(item.toString().toLowerCase()) == false) {
          this.form[item] = "";
        }
      }
      this.form.sum = 1000;
      this.form.fee = 1000;
      this.form.nums = 1;
      this.form.fromdate = moment().format("YYYY-MM-DD");
      this.form.todate = moment().format("YYYY-MM-DD");
      this.form.dealdate = moment().format("YYYY-MM-DD");
      this.form.status = "2";
      this.form.registrant = this.usestore.getUser(false).usrname;
      this.form.handler = this.usestore.getUser(false).usrname;
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
          AX("DELETE", "/" + this.selfRouter + "/" + row.id).then((res) => {
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

    saveform() {
      //   console.log(this.is_new);
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
