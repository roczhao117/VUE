<template>
  <!-- 工作表单 -->
  <div class="form">
    <!-- 查询头 -->
    <div style="display: flex; margin: 1px; margin-right: 20px">
      <el-input
        placeholder="查询姓名"
        v-model="searchform.searchinput"
        class="input-with-select"
        v-on:keydown.enter="listMain()"
        style="width: 200px; margin-right: 20px"
      ></el-input>
      <el-date-picker
        v-model="searchform.fromdate"
        type="date"
        placeholder="选择到期日从"
        format="YYYY-MM-DD"
        style="margin-right: 20px"
      ></el-date-picker>
      <el-date-picker
        v-model="searchform.todate"
        type="date"
        placeholder="选择到期日到"
        format="YYYY-MM-DD"
        style="margin-right: 20px"
      ></el-date-picker>

      <el-button @click="listMain()" style="margiin-right: 20px" type="primary"
        ><el-icon><Search /></el-icon>查询</el-button
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
              prop="emid"
              label="工号"
              width="100"
            ></el-table-column>
            <el-table-column
              prop="cname"
              label="姓名"
              width="100"
            ></el-table-column>

            <el-table-column prop="type" label="类型">
              <template #default="scope">
                <el-tag>{{ diccontypeData.dicDescs(scope.row.type) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="激活">
              <template #default="scope">
                <el-tag type="success" v-if="scope.row.isactive == 1">{{
                  "激活"
                }}</el-tag>

                <el-tag type="danger" v-else>{{ "否" }}</el-tag>
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
import { useDicStore } from "../store/index";

export default {
  setup() {
    const dicstore = useDicStore();
    return { dicstore };
  },
  props: {
    // fsysid: {
    //   type: String,
    //   required: true,
    // },
    // diccerttypeData: {
    //   type: Array,
    //   required: true,
    // },
  },

  data() {
    return {
      selfRouter: "contract",

      diccontypeData: [],

      apmodeData: [],
      apitemData: [],

      counts: 0,
      page: {
        limit: 10,
        cpg: 1,
      },

      formData: [],

      loading: false,

      is_new: true,

      dialogFormVisible: false,

      formLabelWidth: "200",

      form: {
        sysid: ref(""),
        type: "",
        item: "",
        mode: "",
        fee: "0",
        fromdate: "",
        todate: "",
        remark: "",
        isactive: 1,
      },
      searchform: {
        fromdate: moment().format("YYYY-MM-DD"),
        todate: moment().format("YYYY-MM-DD"),
        searchinput: "",
      },
    };
  },
  mounted() {
    this.getdic();
  },
  // watch: {
  //   fsysid() {
  //     this.listMain();
  //   },
  // },
  methods: {
    changePage(idx) {
      //  console.log(idx)
      this.page.cpg = idx;
      this.listMain();
    },

    getdic() {
      //   AX("get", "/dicm/contype").then((res) => {
      //     this.diccontypeData = res.data;
      //   });
      this.diccontypeData = this.dicstore.getDic("contype");
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
        this.selfRouter +
          "/find/name?page=" +
          this.page.cpg +
          "&pagesize=" +
          this.page.limit +
          "&block=" +
          paramsBlock
      ).then((res) => {
        this.formData.splice(0, this.formData.length);
        if (res && res.total > 0) {
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
