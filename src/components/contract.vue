<template>
  <!-- 工作表单 -->
  <div class="dialogform">
    <el-form :rules="rules" :model="form" ref="form">
      <el-row :gutter="24">
        <el-col :span="8">
          <div>
            <el-form-item
              label="合同类型"
              :label-width="formLabelWidth"
              prop="type"
            >
              <el-select
                v-model="form.type"
                placeholder="请选择"
                size="default"
              >
                <el-option
                  v-for="item in diccontypeData"
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
              label="有效日期从"
              :label-width="formLabelWidth"
              prop="fromdate"
            >
              <el-date-picker
                v-model="form.fromdate"
                type="date"
                placeholder="选择日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                @change="fromdateChange"
              ></el-date-picker>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="8">
          <div>
            <el-form-item
              label="有效日期到"
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
        <el-col :span="8">
          <div>
            <el-form-item
              label="合同金额"
              :label-width="formLabelWidth"
              prop="fee"
            >
              <el-input
                size="default"
                v-model="form.fee"
                autocomplete="off"
                prefix-icon="Edit"
              ></el-input>
            </el-form-item>
          </div>
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
            <i class="el-icon-edit-outline">合同信息</i>
          </el-divider>
        </el-col>
      </el-row>
      <el-row :gutter="24">
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
          <el-table-column prop="type" label="类型">
            <template #default="scope">
              <el-tag>{{ diccontypeData.dicDescs(scope.row.type) }}</el-tag>
            </template>
          </el-table-column>

          <el-table-column
            prop="fromdate"
            label="有效日期从"
            width="100"
          ></el-table-column>
          <el-table-column
            prop="todate"
            label="有效日期到"
            width="100"
          ></el-table-column>

          <el-table-column
            prop="fee"
            label="合同金额"
            width="150"
          ></el-table-column>

          <el-table-column
            prop="remark"
            label="备注"
            width="180"
          ></el-table-column>
          <el-table-column prop="id" fixed="right" label="操作" width="120">
            <template #default="scope">
              <span>
                <el-button
                  size="small"
                  @click="editform(scope.$index, scope.row)"
                  ><el-icon><Edit /></el-icon
                ></el-button>

                <el-button
                  size="small"
                  type="danger"
                  @click="delform(scope.$index, scope.row)"
                  ><el-icon><Delete /></el-icon
                ></el-button>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </el-row>

      <el-row :gutter="24">
        <el-col
          :span="24"
          style="display: flex; justify-content: flex-end; padding-top: 15px"
        >
          <el-button
            type="success"
            icon="el-icon-plus"
            @click="init_form"
            v-if="is_new == false"
            >清 空</el-button
          >

          <el-button type="success" @click="saveform" v-if="is_new == true"
            >新 增</el-button
          >
          <el-button @click="closeform">取 消</el-button>
          <el-button type="primary" @click="saveform" v-if="is_new == false"
            >保 存</el-button
          >
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { AX } from "../utils/api";
import { ref } from "vue";
import moment from "moment";

export default {
  props: {
    fsysid: {
      type: String,
      required: true,
    },
    diccontypeData: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      selfRouter: "contract",

      formData: [],

      loading: false,

      is_new: true,

      dialogFormVisible: false,

      formLabelWidth: 100,

      form: {
        sysid: ref(""),
        type: "",
        fee: "0",
        fromdate: "",
        todate: "",
        remark: "",
        isactive: 1,
        sort: 100,
      },
      rules: {
        type: [{ required: true, message: "请选择 合同类型", trigger: "blur" }],

        fee: [
          {
            required: true,
            message: "请输入 合同金额，没有写0",
            trigger: "blur",
            pattern: /^(0|0(.)?\d+|[1-9]\d*(.)?\d*)$/,
          },
        ],

        fromdate: [
          { required: true, message: "请选择 有效日期从", trigger: "blur" },
        ],

        todate: [
          { required: true, message: "请选择 有效日期到", trigger: "blur" },
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
    fromdateChange() {
      this.form.todate = moment(this.form.fromdate)
        .add(1, "years")
        .add(-1, "days")
        .format("YYYY-MM-DD");
    },
    init_form() {
      this.is_new = true;

      const keyitems = ["sysid", "createdat", "updatedat", "deletedat", "id"];

      for (let item in this.form) {
        if (keyitems.includes(item.toString().toLowerCase()) == false) {
          this.form[item] = "";
        }
      }
      this.form.fee = "0";
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
