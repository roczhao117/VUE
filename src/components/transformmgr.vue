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
        placeholder="选择执行日期从"
        format="YYYY-MM-DD"
        style="margin-right: 20px"
      ></el-date-picker>
      <el-date-picker
        v-model="searchform.todate"
        type="date"
        placeholder="选择执行日期到"
        format="YYYY-MM-DD"
        style="margin-right: 20px"
      ></el-date-picker>
      <el-select
        clearable
        v-model="searchform.type"
        placeholder="请选择调动类型"
        style="margin-right: 20px"
      >
        <el-option
          v-for="item in dictranstypeData"
          :key="item.itemid"
          :label="item.itemname"
          :value="item.itemid"
        ></el-option>
      </el-select>

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
                <el-tag>{{ dictranstypeData.dicDescs(scope.row.type) }}</el-tag>
              </template>
            </el-table-column>

            <el-table-column prop="from" label="从">
              <template #default="scope">
                <el-tag v-if="scope.row.type == 'A'">{{
                  dpList.dicDescs(scope.row.fromid, "dpid", "dpname")
                }}</el-tag>
                <el-tag v-if="scope.row.type == 'B'">{{
                  dpList.dicDescs(scope.row.fromid, "dpid", "dpname")
                }}</el-tag>
                <el-tag v-if="scope.row.type == 'C'">{{
                  dichrgradeData.dicDescs(scope.row.fromid)
                }}</el-tag>
                <el-tag v-if="scope.row.type == 'D'">{{
                  scope.row.fromid
                }}</el-tag>
                <el-tag v-if="scope.row.type == 'E'">{{
                  dichrtypeData.dicDescs(scope.row.fromid)
                }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="to" label="到">
              <template #default="scope">
                <el-tag v-if="scope.row.type == 'A'">{{
                  dpList.dicDescs(scope.row.toid, "dpid", "dpname")
                }}</el-tag>
                <el-tag v-if="scope.row.type == 'B'">{{
                  dpList.dicDescs(scope.row.toid, "dpid", "dpname")
                }}</el-tag>
                <el-tag v-if="scope.row.type == 'C'">{{
                  dichrgradeData.dicDescs(scope.row.toid)
                }}</el-tag>
                <el-tag v-if="scope.row.type == 'D'">{{
                  scope.row.toid
                }}</el-tag>
                <el-tag v-if="scope.row.type == 'E'">{{
                  dichrtypeData.dicDescs(scope.row.toid)
                }}</el-tag>
              </template>
            </el-table-column>

            <el-table-column
              prop="execdate"
              label="执行日期"
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
import { useDicStore, useDeptPosStore } from "../store/index";

export default {
  setup() {
    const dicstore = useDicStore();
    const deptstore = useDeptPosStore();
    return { dicstore, deptstore };
  },
  props: {
    // fsysid: {
    //   type: String,
    //   required: true,
    // },
    // diccerttypeData: {
    //     type: Array,
    //     required: true
    // },
  },

  data() {
    return {
      selfRouter: "transform",

      dichrtypeData: [],
      dichrgradeData: [],
      dictranstypeData: [],

      counts: 0,
      page: {
        limit: 15,
        cpg: 1,
      },

      dpData: [],
      dpList: [],

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
        amount: "0",
        fromdate: "",
        todate: "",
        remark: "",
      },
      searchform: {
        fromdate: moment().format("YYYY-MM-DD"),
        todate: moment().format("YYYY-MM-DD"),
        type: "",
        searchinput: "",
      },
    };
  },
  mounted() {
    this.getdic();
  },

  methods: {
    changePage(idx) {
      //  console.log(idx)
      this.page.cpg = idx;
      this.listMain();
    },

    getdic() {
      //   AX("get", "/dicm/hrgrade").then((res) => {
      //     this.dichrgradeData = res.data;
      //   });
      //   AX("get", "/dicm/hrtype").then((res) => {
      //     this.dichrtypeData = res.data;
      //   });
      //   AX("get", "/dept").then((res) => {
      //     this.dpData = res.data;
      //     this.flattenTree(res.data);
      //   });
      //   AX("get", "/dicm/transtype").then((res) => {
      //     this.dictranstypeData = res.data;
      //   });

      this.dichrgradeData = this.dicstore.getDic("hrgrade");

      this.dichrtypeData = this.dicstore.getDic("hrtype");

      this.dpData = this.deptstore.deptposData.data;
      this.flattenTree(this.dpData);

      this.dictranstypeData = this.dicstore.getDic("transtype");
    },

    flattenTree(treedata) {
      for (let item of treedata) {
        let node = {};
        node.dpid = item.deptid;
        node.dpname = item.deptname;
        node.fid = item.fid;
        node.is_pos = item.deptlevel;
        node.posgrade = item.posgrade;

        this.dpList.push(node);
        if (item.children) {
          this.flattenTree(item.children);
        }
      }
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
      paramsBlock.type = this.searchform.type;

      paramsBlock = encodeURI(JSON.stringify(paramsBlock));

      AX(
        "get",
        this.selfRouter +
          "/find/nametype?page=" +
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
