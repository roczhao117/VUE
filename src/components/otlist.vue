<template>
  <!-- 工作表单 -->
  <div class="dialogform">
    <el-form :rules="rules" :model="form" ref="form" style="width: 100%">
      <el-row :gutter="24">
        <el-col :span="8">
          <div>
            <el-form-item
              label="加班类型"
              :label-width="formLabelWidth"
              prop="type"
            >
              <el-select
                v-model="form.type"
                placeholder="请选择"
                size="default"
                style="width: 100%"
              >
                <el-option
                  v-for="item in typeData"
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
              label="偿付方式"
              :label-width="formLabelWidth"
              prop="pay"
            >
              <el-select
                v-model="form.pay"
                placeholder="请选择"
                size="default"
                style="width: 100%"
              >
                <el-option
                  v-for="item in payData"
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
        <el-col :span="8">
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
        <el-col :span="8">
          <div>
            <el-form-item
              label="开始时间"
              :label-width="formLabelWidth"
              prop="fromtime"
            >
              <el-time-picker
                v-model="form.fromtime"
                placeholder="选择时间"
                format="HH:mm"
                value-format="HH:mm"
                :editable="false"
              ></el-time-picker>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="8">
          <div>
            <el-form-item
              label="小时数"
              :label-width="formLabelWidth"
              prop="hours"
            >
              <el-input
                size="default"
                v-model="form.hours"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="8">
          <div>
            <el-form-item
              label="提供班次补贴"
              prop="shifttype"
              :label-width="formLabelWidth"
            >
              <el-select
                v-model="form.shifttype"
                :clearable="true"
                placeholder="请选择"
                size="default"
                style="width: 100%"
              >
                <el-option
                  v-for="item in shifttype2Data"
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
              label="单据状态"
              :label-width="formLabelWidth"
              prop="status"
            >
              <el-select
                v-model="form.status"
                placeholder="请选择"
                size="default"
                style="width: 100%"
              >
                <el-option
                  v-for="item in funData"
                  :key="item.itemid"
                  :label="item.itemname"
                  :value="item.itemid"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
      </el-row>

      <el-divider content-position="left">
        <i class="el-icon-edit-outline">提供餐次</i>
      </el-divider>
      <el-row :gutter="24">
        <el-col :span="24">
          <div style="display: block; width: 960px; margin-left: 120px">
            <el-checkbox-group
              v-model="form.addmeals"
              style="display: flex; flex-wrap: wrap"
            >
              <el-checkbox
                v-for="item in mealsData"
                :key="item.itemid"
                :value="item.itemname"
                :label="item.itemid"
                style="width: 100px; text-align: left"
                >{{ item.itemname }}</el-checkbox
              >
            </el-checkbox-group>
          </div>
        </el-col>
      </el-row>
      <el-divider content-position="left"></el-divider>
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
            <i class="el-icon-edit-outline">历史信息</i>
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
            <el-table-column
              prop="isactive"
              fixed
              width="80"
              show-overflow-tooltip
              label="失效"
            >
              <template #default="scope">
                <el-tag v-if="scope.row.isactive == 0" type="danger">失</el-tag>

                <el-tag v-else type="success">否</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="type" fixed="left" width="40" type="index">
              <template #default="scope">{{
                (page.cpg - 1) * page.limit + (scope.$index + 1)
              }}</template>
            </el-table-column>
            <el-table-column
              prop="type"
              label="加班类型"
              fixed="left"
              width="120"
            >
              <template #default="scope">
                <el-tag>{{ typeData.dicDescs(scope.row.type) }}</el-tag>
              </template>
            </el-table-column>

            <el-table-column
              prop="type"
              label="偿付方式"
              fixed="left"
              width="80"
            >
              <template #default="scope">
                <el-tag>{{ payData.dicDescs(scope.row.pay) }}</el-tag>
              </template>
            </el-table-column>

            <el-table-column
              prop="fromdate"
              label="开始日期"
              width="100"
            ></el-table-column>
            <el-table-column prop="fromtime" label="开始时间" width="100">
            </el-table-column>

            <el-table-column
              prop="hours"
              label="小时数"
              width="80"
            ></el-table-column>
            <el-table-column prop="fun" label="状态" fixed="left" width="80">
              <template #default="scope">
                <el-tag>{{ funData.dicDescs(scope.row.status) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="fun" label="班贴" fixed="left" width="80">
              <template #default="scope">
                <el-tag>{{
                  shifttype2Data.dicDescs(scope.row.shifttype)
                }}</el-tag>
              </template>
            </el-table-column>

            <el-table-column
              prop="remark"
              label="备注"
              width="180"
            ></el-table-column>
            <el-table-column prop="id" fixed="right" label="操作" width="120">
              <template #default="scope">
                <span class="butgrp" v-if="scope.row.isactive != 0">
                  <el-button
                    size="small"
                    icon="edit"
                    @click="editform(scope.$index, scope.row)"
                  ></el-button>

                  <el-button
                    size="small"
                    type="danger"
                    icon="delete"
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
          style="
            display: flex;
            justify-content: space-between;
            padding-top: 15px;
          "
        >
          <span>
            <div>
              <el-pagination
                background
                layout="prev, pager, next"
                :page-size="page.limit"
                @current-change="changePage"
                :current-page="cp1"
                :total="counts"
              ></el-pagination>
            </div>
          </span>
          <span>
            <el-button
              type="success"
              icon="plus"
              @click="init_form"
              v-if="is_new == false"
              >新 建</el-button
            >

            <el-button type="success" @click="saveform" v-if="is_new == true"
              >新 增</el-button
            >
            <el-button @click="closeform">取 消</el-button>
            <el-button @click="saveform" v-if="is_new == false"
              >保 存</el-button
            >
          </span>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { AX } from "../utils/api";
import { ref } from "vue";
import { moment } from "moment";
import { useDicStore, useUserStore } from "../store/index";
import { mealsType } from "../utils/comdata";

export default {
  setup() {
    const dicstore = useDicStore();
    const userstore = useUserStore();
    return {
      dicstore,
      userstore,
    };
  },
  props: {
    fsysid: {
      type: String,
      required: true,
    },

    otfromdate: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      selfRouter: "otlist",

      typeData: [],
      payData: [],
      funData: [],
      shifttype2Data: [],
      mealsData: [],

      formData: [],

      loading: false,

      is_new: true,

      dialogFormVisible: false,

      formLabelWidth: "100",

      page: {
        limit: 6,
        cpg: 1,
      },
      counts: 1,
      cp1: 1,
      form: {
        sysid: ref(""),
        type: "A",
        status: "0",
        item: "1",
        pay: "A",
        hours: "2",
        fromdate: this.otfromdate,
        fromtime: "18:35",
        shifttype: "",
        remark: "",
        addmeals: ["-1"],
        isactive: 1,
        sort: 100,
        is_show: 1,
      },
      rules: {
        type: [{ required: true, message: "请选择 类型", trigger: "blur" }],

        status: [
          { required: true, message: "请选择 单据状态", trigger: "blur" },
        ],

        pay: [{ required: true, message: "请选择 方式", trigger: "blur" }],

        hours: [
          {
            required: true,
            message: "请输入 金额，没有写0",
            trigger: "blur",
            pattern: /^(0|0(.)?\d+|[1-9]\d*(.)?\d*)$/,
          },
        ],

        fromdate: [
          { required: true, message: "请选择 开始日期", trigger: "blur" },
        ],

        fromtime: [
          { required: true, message: "请选择 开始时间", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.getdic();
    this.init_form();
  },
  computed: {
    countfsysid: function () {
      // console.log("computer------------------------", this.fsysid);
      this.form.fromdate = this.otfromdate;
      this.form.sysid = this.fsysid;
      return this.fsysid;
    },
    countfromdate: function () {
      this.form.fromdate = this.otfromdate;
      return this.otfromdate;
    },
  },
  watch: {
    countfsysid: {
      immediate: true,
      handler(n, o) {
        // console.log("watch--------------------", n, o);
        this.listMain();
      },
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
      this.form.hours = "2";
      this.form.addmeals = ["-1"];
      this.form.fromdate = this.otfromdate;
      this.form.fromtime = "18:35";
      this.form.type = "A";
      this.form.status = "0";
      this.form.pay = "A";
      this.form.sysid = this.fsysid;
      //--------------------------------------------------
      this.form.isactive = 1;
      this.form.sort = 100;
      this.form.is_show = 1;
      //--------------------------------------------------
    },

    closeform() {
      var formname = "close" + this.selfRouter + "form";

      this.$emit(formname, false);
    },

    delform(idx, row) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          AX("patch", this.selfRouter + "/" + row.id, {
            isactive: 0,
          }).then((res) => {
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
      this.form.addmeals = row.addmeals.split(",");
    },

    saveform() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.form.addmeals || this.form.addmeals.length <= 0) {
            this.form.addmeals = ["-1"];
          }
          if (!this.is_new) {
            AX("patch", this.selfRouter + "/" + this.form.id, this.form).then(
              (res) => {
                if (res && res.code == 200) {
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
                if (res && res.code == 200) {
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

    getdic() {
      this.typeData = this.dicstore.getDic("ottype");
      // this.funData = this.dicstore.getDic("otlevfun");
      this.shifttype2Data = this.dicstore.getDic("shifttype2");
      this.mealsData.push(...mealsType);
      this.payData = this.dicstore.getDic("otpay");
      this.funData = this.dicstore.getDic("docstatus");
    },

    changePage(idx) {
      //  console.log(idx)
      this.page.cpg = idx;
      this.listMain();
    },

    listMain() {
      this.form.fromdate = this.otfromdate;
      this.form.sysid = this.fsysid;

      console.log(this.form.fromdate, this.form.sysid);

      AX(
        "get",
        this.selfRouter +
          "/findstaff/" +
          this.form.sysid +
          "?page=" +
          this.page.cpg +
          "&pagesize=" +
          this.page.limit
      ).then((res) => {
        this.formData.splice(0, this.formData.length);
        if (res && res.data && res.data.length > 0) {
          this.formData = res.data;
          this.counts = res.total;
        }
        this.loading = false;
      });
    },
  },
};
</script>
<style scoped>
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
