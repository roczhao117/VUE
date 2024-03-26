<template>
  <!-- 工作表单 -->
  <div id="searchform">
    <el-form :model="form" ref="form" style="width: 100%">
      <el-row :gutter="24">
        <el-col :span="6">
          <el-form-item label="员工状态" :label-width="formLabelWidth">
            <el-checkbox-group
              v-model="form.hrstatus"
              style="display: flex; flex-wrap: wrap; width: 100%"
            >
              <el-checkbox
                v-for="item in dichrstatusData"
                :key="item.itemid"
                :value="item.itemname"
                :label="item.itemid"
                :checked="true"
                style="width: 100px; text-align: left"
                >{{ item.itemname }}</el-checkbox
              >
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="员工学历" :label-width="formLabelWidth">
            <el-checkbox-group
              v-model="form.hredu"
              style="display: flex; flex-wrap: wrap; width: 100%"
            >
              <el-checkbox
                v-for="item in dichreduData"
                :key="item.itemid"
                :value="item.itemname"
                :label="item.itemid"
                :checked="true"
                style="width: 120px; text-align: left"
                >{{ item.itemname }}</el-checkbox
              >
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="员工类型" :label-width="formLabelWidth">
            <el-checkbox-group
              v-model="form.hrtype"
              style="display: flex; flex-wrap: wrap; width: 100%"
            >
              <el-checkbox
                v-for="item in dichrtypeData"
                :key="item.itemid"
                :value="item.itemname"
                :label="item.itemid"
                :checked="true"
                style="width: 100px; text-align: left"
                >{{ item.itemname }}</el-checkbox
              >
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="员工级别" :label-width="formLabelWidth">
            <el-checkbox-group
              v-model="form.hrgrade"
              style="display: flex; flex-wrap: wrap; width: 100%"
            >
              <el-checkbox
                v-for="item in dichrgradeData"
                :key="item.itemid"
                :value="item.itemname"
                :label="item.itemid"
                :checked="true"
                style="width: 50px; text-align: left"
                >{{ item.itemname }}</el-checkbox
              >
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="政治面貌" :label-width="formLabelWidth">
            <el-checkbox-group
              v-model="form.hrpolitical"
              style="display: flex; flex-wrap: wrap; width: 100%"
            >
              <el-checkbox
                v-for="item in dichrpoliticalData"
                :key="item.itemid"
                :value="item.itemname"
                :label="item.itemid"
                :checked="true"
                style="width: 100px; text-align: left"
                >{{ item.itemname }}</el-checkbox
              >
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="性别" :label-width="formLabelWidth">
            <el-checkbox-group
              v-model="form.sex"
              style="display: flex; flex-wrap: wrap; width: 100%"
            >
              <el-checkbox
                v-for="item in form.sexdata"
                :key="item.id"
                :value="item.name"
                :label="item.id"
                :checked="true"
                style="width: 120px; text-align: left"
                >{{ item.name }}</el-checkbox
              >
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <div>
            <el-form-item
              label="生日月份"
              :label-width="formLabelWidth"
              prop="type"
            >
              <el-checkbox-group
                v-model="form.birthmonth"
                style="display: flex; flex-wrap: wrap; width: 100%"
              >
                <el-checkbox
                  v-for="item in form.birthMonth"
                  :key="item"
                  :value="item"
                  :label="item"
                  :checked="true"
                  style="width: 13px; text-align: left"
                  >{{ item }}</el-checkbox
                >
              </el-checkbox-group>
            </el-form-item>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="12">
          <div>
            <el-form-item
              label="入职日期"
              :label-width="formLabelWidth"
              prop="type"
            >
              <el-date-picker
                v-model="form.datejoined"
                :unlink-panels="true"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="YYYY-MM-DD"
              ></el-date-picker>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div>
            <el-form-item
              label="转正日期"
              :label-width="formLabelWidth"
              prop="type"
            >
              <el-date-picker
                v-model="form.regulardate"
                :unlink-panels="true"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="YYYY-MM-DD"
              ></el-date-picker>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <div>
            <el-form-item
              label="合同到期"
              :label-width="formLabelWidth"
              prop="type"
            >
              <el-date-picker
                v-model="form.conedate"
                :unlink-panels="true"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="YYYY-MM-DD"
              ></el-date-picker>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div>
            <el-form-item
              label="健康证到期"
              :label-width="formLabelWidth"
              prop="type"
            >
              <el-date-picker
                v-model="form.healedate"
                :unlink-panels="true"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="YYYY-MM-DD"
              ></el-date-picker>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <div>
            <el-form-item
              label="离职日期"
              :label-width="formLabelWidth"
              prop="type"
            >
              <el-date-picker
                v-model="form.checkout"
                :unlink-panels="true"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="YYYY-MM-DD"
              ></el-date-picker>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-divider content-position="left"></el-divider>
      <el-row :gutter="24">
        <el-col :span="24">
          <div style="display: flex; justify-content: flex-end">
            <el-button type="primary" @click="saveform">确 定</el-button>
            <el-button @click="closeform">取 消</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
// import { AX, } from '../utils/api';
import { ref } from "vue";

import moment from "moment";

export default {
  props: {
    fsysid: {
      type: String,
      required: true,
    },

    dichrgradeData: {
      type: Array,
      required: true,
    },
    dichrtypeData: {
      type: Array,
      required: true,
    },
    dichrstatusData: {
      type: Array,
      required: true,
    },
    dichrpropsData: {
      type: Array,
      required: true,
    },
    dichreduData: {
      type: Array,
      required: true,
    },
    dichrpoliticalData: {
      type: Array,
      required: true,
    },
    dplimit: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      selfRouter: "moresearch",

      typeData: [],
      payData: [],
      funData: [],
      shifttype2Data: [],
      mealsData: [],

      formData: [],

      loading: false,

      is_new: true,

      dialogFormVisible: false,

      formLabelWidth: "200",

      page: {
        limit: 10,
        cpg: 1,
      },
      counts: 1,
      cp1: 1,

      form: {
        sysid: ref(""),
        datejoined: ref(""),
        regulardate: ref(""),
        checkout: ref(""),
        conedate: ref(""),
        healedate: ref(""),

        hrtype: [],
        hrstatus: [],
        hrgrade: [],
        hrprops: [],
        hredu: [],
        birthMonth: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        birthmonth: [],
        sexdata: [
          { id: "0", name: "女" },
          { id: "1", name: "男" },
        ],

        sex: [],
        hrpolitical: [],
      },
    };
  },
  mounted() {},
  watch: {
    fsysid() {
      this.listMain();
    },
  },
  methods: {
    init_form() {
      this.is_new = true;

      const keyitems = ["sysid", "createdat", "updatedat", "deletedat"];

      for (let item in this.form) {
        if (keyitems.includes(item.toString().toLowerCase()) == false) {
          this.form[item] = "";
        }
      }
      this.form.hours = "8";
      this.form.delshiftbenefit = "1";
      this.form.delmealsObj = [];
    },
    closeform() {
      this.$emit("close" + this.selfRouter + "Form", false);
    },

    saveform() {
      const data = {};

      if (this.form.hrstatus) {
        data.hrstatus = this.form.hrstatus;
      }
      if (this.form.hrprops) {
        data.ifcheckout = this.form.hrprops;
      }
      if (this.form.hrtype) {
        data.hrtype = this.form.hrtype;
      }
      if (this.form.hrgrade) {
        data.hrgrade = this.form.hrgrade;
      }
      if (this.form.hrpolitical) {
        data.hrpolitical = this.form.hrpolitical;
      }
      if (this.form.sex) {
        data.sex = this.form.sex;
      }
      if (this.form.birthmonth) {
        data.birthmonth = this.form.birthmonth;
      }

      if (this.form.datejoined) {
        this.form.datejoined[0] = moment(this.form.datejoined[0]).format(
          "YYYY-MM-DD"
        );
        this.form.datejoined[1] = moment(this.form.datejoined[1]).format(
          "YYYY-MM-DD"
        );
        data.datejoined = this.form.datejoined;
      }
      if (this.form.regulardate) {
        this.form.regulardate[0] = moment(this.form.regulardate[0]).format(
          "YYYY-MM-DD"
        );
        this.form.regulardate[1] = moment(this.form.regulardate[1]).format(
          "YYYY-MM-DD"
        );
        data.regulardate = this.form.regulardate;
      }

      if (this.form.checkout) {
        this.form.checkout[0] = moment(this.form.checkout[0]).format(
          "YYYY-MM-DD"
        );
        this.form.checkout[1] = moment(this.form.checkout[1]).format(
          "YYYY-MM-DD"
        );
        data.checkout = this.form.checkout;
      }

      if (this.form.healedate) {
        this.form.healedate[0] = moment(this.form.healedate[0]).format(
          "YYYY-MM-DD"
        );
        this.form.healedate[1] = moment(this.form.healedate[1]).format(
          "YYYY-MM-DD"
        );
        data.healedate = this.form.healedate;
      }

      if (this.form.conedate) {
        this.form.conedate[0] = moment(this.form.conedate[0]).format(
          "YYYY-MM-DD"
        );
        this.form.conedate[1] = moment(this.form.conedate[1]).format(
          "YYYY-MM-DD"
        );
        data.conedate = this.form.conedate;
      }

      data.dept = this.dplimit;
      data.position = this.dplimit;
      // console.log(data);
      this.$emit("moreSearch", data);

      this.$emit("close" + this.selfRouter + "Form", false);
    },
  },
};
</script>
<style scoped>
#searchform {
  font-size: 8px;
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
.el-select {
  text-align: left;
}
</style>
