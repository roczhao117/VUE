<template>
  <!-- 工作表单 -->
  <div class="form">
    <!-- 查询头 -->
    <div style="display: flex; margin: 1px; margin-right: 20px">
      <el-input
        placeholder="查询内容"
        v-model="searchform.searchinput"
        class="input-with-select"
        v-on:keydown.enter="listMain()"
        style="width: 200px; margin-right: 20px"
      ></el-input>
      <el-date-picker
        v-model="searchform.fromdate"
        type="date"
        placeholder="发生日期从"
        format="YYYY-MM-DD"
        style="margin-right: 20px"
      ></el-date-picker>
      <el-date-picker
        v-model="searchform.todate"
        type="date"
        placeholder="发生日期到"
        format="YYYY-MM-DD"
        style="margin-right: 20px"
      ></el-date-picker>

      <el-button
        icon="el-icon-search"
        @click="listMain()"
        style="margiin-right: 20px"
        >查询</el-button
      >
    </div>

    <el-form :model="form" ref="form">
      <el-row :gutter="24">
        <el-col :span="24">
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
              prop="object"
              label="操作对象"
              fixed="left"
              width="150"
            ></el-table-column>
            <el-table-column
              prop="type"
              label="操作类型"
              fixed="left"
              width="100"
            ></el-table-column>
            <el-table-column
              prop="item"
              label="操作项目"
              width="250"
            ></el-table-column>
            <el-table-column
              prop="from"
              label="原始值"
              width="250"
            ></el-table-column>
            <el-table-column
              prop="to"
              label="更改值"
              width="250"
            ></el-table-column>
            <el-table-column
              prop="userid"
              label="操作人"
              width="100"
            ></el-table-column>
            <el-table-column
              prop="createdAt"
              label="执行日期"
              width="150"
            ></el-table-column>
            <el-table-column
              prop="remark"
              label="备注"
              width="180"
            ></el-table-column
            >>
          </el-table>
        </el-col>
      </el-row>
      <el-row>
        <!-- 翻页控件 -->
        <div style="margin-top: 25px">
          <el-pagination
            background
            layout="prev, pager, next"
            :page-size="page.limit"
            @current-change="changePage"
            :current-page="page.cpg"
            :total="counts"
          ></el-pagination>
        </div>
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
    diccerttypeData: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      selfRouter: "loglist",

      aptypeData: [],
      apmodeData: [],
      apitemData: [],

      counts: 0,
      page: {
        limit: 15,
        cpg: 1,
      },

      formData: [],

      loading: false,

      is_new: true,

      dialogFormVisible: false,

      formLabelWidth: "200",

      form: {
        sysid: ref(""),
        object: "",
        type: "",
        item: "",
        usreid: "",
        from: "",
        to: "",
        remark: "",
        createdAt: "",
      },
      searchform: {
        fromdate: moment(),
        todate: moment(),
        searchinput: "",
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
    changePage(idx) {
      //  console.log(idx)
      this.page.cpg = idx;
      this.listMain();
    },

    getdic() {
      // AX('get', '/dicm/aptype').then((res) => {
      //     this.aptypeData = res.data;
      // }), AX('get', '/dicm/apitem').then((res) => {
      //     this.apitemData = res.data;
      // }), AX('get', '/dicm/apmode').then((res) => {
      //     this.apmodeData = res.data;
      // })
    },

    listMain() {
      let fromdate =
        moment(this.searchform.fromdate).format("YYYY-MM-DD") == "Invalid date"
          ? "1949-10-01"
          : moment(this.searchform.fromdate).format("YYYY-MM-DD");

      let todate =
        moment(this.searchform.todate).format("YYYY-MM-DD") == "Invalid date"
          ? "2949-10-01"
          : moment(this.searchform.todate).format("YYYY-MM-DD");

      let paramsBlock = {};

      paramsBlock.name = this.searchform.searchinput;
      paramsBlock.fromdate = fromdate;
      paramsBlock.todate = todate;

      paramsBlock = encodeURI(JSON.stringify(paramsBlock));

      AX(
        "get",
        "/" +
          this.selfRouter +
          "/" +
          this.page.limit +
          "/" +
          this.page.cpg +
          "/" +
          paramsBlock
      ).then((res) => {
        this.formData = {};

        if (res) {
          for (let row of res.data.rows) {
            row.createdAt = moment(row.createdAt).format("YYYY-MM-DD HH:mm");
          }
          this.formData = res.data.rows;

          this.counts = res.data.count;
        }
        this.loading = false;
      });
    },
  },
};
</script>
<style scoped>
.input-with-select {
  width: 200;
}

.label-width {
  width: 200px;
}
.el-divider i {
  color: #409eff;
}
</style>
