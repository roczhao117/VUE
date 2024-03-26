<template>
  <!-- 工作表单 -->
  <div class="dialogform">
    <el-form :rules="rules" :model="form" ref="form" style="width: 100%">
      <el-row :gutter="24">
        <el-col :span="8">
          <div>
            <el-form-item
              label="请假类型"
              :label-width="formLabelWidth"
              prop="type"
            >
              <el-select
                v-model="form.type"
                placeholder="请选择"
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
              <el-input v-model="form.hours" autocomplete="off"></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <div>
            <el-form-item label="取消津贴" :label-width="formLabelWidth">
              <el-switch
                v-model="form.delshiftbenefit"
                active-color="#13ce66"
                inactive-color="#f56c6c"
                active-text="取消 (如果当天班次涉及班次津贴，比如夜班费或者长夜班费，将取消该津贴)"
                inactive-text="否"
                :active-value="1"
                :inactive-value="0"
              ></el-switch>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="24">
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
                style="width: 100%"
              >
                <el-option
                  v-for="item in rfunData"
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
        <i class="el-icon-edit-outline"
          >取消当日餐次 （取消当日排班里默认提供的工作餐次 , 打勾为取消）</i
        >
      </el-divider>
      <el-row :gutter="24">
        <el-col :span="24">
          <div style="display: block; width: 960px; margin-left: 80px">
            <el-checkbox-group
              v-model="form.delmeals"
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
            <el-input v-model="form.remark" autocomplete="off"></el-input>
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
            style="width: 95%"
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
            <el-table-column fixed="left" width="40" type="index">
              <template #default="scope">{{
                (page.cpg - 1) * page.limit + (scope.$index + 1)
              }}</template>
            </el-table-column>

            <el-table-column
              prop="type"
              label="请假类型"
              fixed="left"
              width="80"
            >
              <template #default="scope">
                <el-tag>{{ typeData.dicDescs(scope.row.type) }}</el-tag>
              </template>
            </el-table-column>

            <el-table-column
              prop="pay"
              label="偿付方式"
              fixed="left"
              width="120"
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
              <template #default="scope">{{
                scope.row.fromtime.toString().substr(11, 5)
              }}</template>
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
            <el-table-column prop="fun" label="消班贴" fixed="left" width="80">
              <template #default="scope">
                <el-tag v-if="scope.row.delshiftbenefit == 1">消</el-tag>
                <el-tag v-else>否</el-tag>
              </template>
            </el-table-column>

            <el-table-column
              prop="remark"
              label="备注"
              width="180"
            ></el-table-column>
            <el-table-column fixed="right" label="操作" width="120">
              <template #default="scope">
                <span
                  class="butgrp"
                  v-if="
                    scope.row.isactive != 0 &&
                    rfunIdsData.includes(scope.row.status)
                  "
                >
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
                :current-page="page.cpg"
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

            <el-button type="primary" @click="saveform" v-if="is_new == false"
              >保 存</el-button
            >
            <el-button @click="closeform">离 开</el-button>
          </span>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { AX } from "../utils/api";
import { ref } from "vue";
import * as moment from "moment";
import { mealsType } from "../utils/comdata";
import { useDicStore, useUserStore, useRightStore } from "../store/index";

export default {
  setup() {
    const dicstore = useDicStore();
    const userstore = useUserStore();
    const rightstore = useRightStore();
    return {
      dicstore,
      userstore,
      rightstore,
    };
  },
  props: {
    fsysid: {
      type: String,
      required: true,
    },
    levfromdate: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      selfRouter: "levlist",

      typeData: [],
      payData: [],
      funData: [],
      rfunData: [],
      rfunIdsData: [],
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

      delmealsshow: [],

      form: {
        id: "",
        sysid: ref(""),
        type: "",
        status: "",
        item: "",
        pay: "",
        hours: "8",
        delshiftbenefit: 1,
        fromdate: ref(""),
        fromtime: "08:00",
        shifttype: "",
        remark: "",
        delmeals: [],

        isactive: 1,
        sort: 100,
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
  },
  computed: {
    countfsysid: function () {
      // console.log(
      //   "computer------------------------",
      //   this.fsysid,
      //   this.levfromdate
      // );
      this.form.fromdate = this.levfromdate;
      this.form.sysid = this.fsysid;
      return this.fsysid;
    },
  },
  watch: {
    countfsysid: {
      immediate: true,
      handler(n, o) {
        // console.log(
        //   "watch-levlist-------------------",
        //   n,
        //   o,
        //   this.form.fromdate
        // );
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
      this.form.hours = "8";
      this.form.delshiftbenefit = 1;
      this.form.delmeals = [];
      this.form.isactive = 1;
      this.form.sort = 100;
      this.form.fromtime = "08:00";
      this.form.fromdate = this.levfromdate;
      this.form.type = "";
      this.form.status = "";
      this.form.pay = "";
      this.form.sysid = this.fsysid;
      if (!this.levfromdate) {
        this.form.fromdate = moment().format("YYYY-MM-DD");
      }
    },

    closeform() {
      this.$emit("close" + this.selfRouter + "Form", false);
    },

    delform(idx, row) {
      this.$confirm("此操作将永久失效该记录，而且不能恢复, 是否继续?", "提示", {
        confirmButtonText: "我知道风险，继续",
        cancelButtonText: "取消并离开",
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
      console.log(idx, row);
      this.is_new = false;

      Object.keys(this.form).forEach((key) => {
        this.form[key] = row[key];
      });
      // this.form.delshiftbenefit = this.form.delshiftbenefit.toString();
      // this.form.delmeals = [];
      // if (this.form.delmeals.length > 0) {
      this.form.delmeals = this.form.delmeals.split(",");
      // }
    },

    saveform() {
      console.log(this.form);

      for (let le of this.formData) {
        //这里必须加入id!=id的判断，因为如果ID一致的情况下，说明是修改，再新加入数据的时候
        //form 中的id是空，而formdata中的数据是从数据库中取的数据，这样的数据，id是有值的。
        //这样才能判断在改条数据是新加入时候不能重复，但修改的时候可以重复。
        //失效的数据不用管，但在恢复的时候，也要检查。最好的办法是不容许恢复，而且删除掉

        if (
          le.fromdate == this.form.fromdate &&
          le.id != this.form.id &&
          le.isactive == 1
        ) {
          this.$message({
            type: "error",
            message: "同一天只能输入一条有效的请假记录",
          });
          return false;
        }
      }

      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.delmeals.length > 0) {
            this.form.delmeals = this.form.delmeals.join(",");
          } else {
            this.form.delmeals = "-1";
          }

          if (!this.is_new) {
            AX("patch", this.selfRouter + "/" + this.form.id, this.form).then(
              (res) => {
                if (res && res.code == 200) {
                  this.dialogFormVisible = false;
                  this.listMain();
                  this.init_form();
                } else {
                  //如果保存不成功，需要把原来数组的数据在变回数组，否则是字符串
                  //字符串的话，checkbox就用不了。
                  this.form.delmeals = this.form.delmeals.split(",");
                  //-----------------------
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
                } else {
                  //如果保存不成功，需要把原来数组的数据在变回数组，否则是字符串
                  //字符串的话，checkbox就用不了。
                  this.form.delmeals = this.form.delmeals.split(",");
                  //-----------------------
                }
              });
            }
          }
        }
      });
    },

    getdic() {
      //     AX("get", "/dicm/staffcateentype").then((res) => {
      //       this.mealsData = res.data;
      //     });

      this.typeData = this.dicstore.getDic("levitem");
      // this.funData = this.dicstore.getDic("otlevfun");
      this.shifttype2Data = this.dicstore.getDic("shifttype2");
      this.mealsData.push(...mealsType);
      this.payData = this.dicstore.getDic("levpay");
      this.funData = this.dicstore.getDic("docstatus");
      this.rfunData = this.rightstore.getRightStore("docstatus", true);
      this.rfunIdsData = this.rfunData.map((el) => {
        return el.itemid;
      });
    },

    changePage(idx) {
      //  console.log(idx)
      this.page.cpg = idx;
      this.listMain();
    },

    listMain() {
      this.form.fromdate = this.levfromdate;
      this.form.sysid = this.fsysid;
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
.el-select {
  text-align: left;
}
</style>
