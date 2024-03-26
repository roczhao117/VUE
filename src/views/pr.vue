<template>
  <div style="min-width: 100px">
    <el-container>
      <el-tabs type="border-card" style="width: 100%" v-model="activeTab">
        <el-tab-pane label="薪资人员" name="PR">
          <prinfo></prinfo>
        </el-tab-pane>
        <el-tab-pane label="薪资帐套">
          <pritem></pritem>
        </el-tab-pane>
        <!--  <el-tab-pane label="薪资报表" v-show="false">
          <prrep></prrep>
        </el-tab-pane>
        <el-tab-pane label="薪资报表設置" v-show="false">
          <rep></rep>
        </el-tab-pane>
        <el-tab-pane label="薪资报表設置2" v-show="false">
          <rep2></rep2>
        </el-tab-pane>
        <el-tab-pane label="薪资报表HTML" v-show="false">
          <rep3></rep3>
        </el-tab-pane> -->
      </el-tabs>
    </el-container>
  </div>
</template>

<script>
import prinfo from "../components/prinfo.vue";
import pritem from "../components/pritem.vue";
import prrep from "../components/reps/rep1.vue";
import rep from "../components/reps/index.vue";

import rep2 from "../components/start-02/index.vue";
import rep3 from "../components/reps/rep3.vue";

export default {
  data() {
    return {
      activeTab: "PR",
    };
  },
  components: { prinfo, pritem, prrep, rep, rep2, rep3 },
};
</script>
