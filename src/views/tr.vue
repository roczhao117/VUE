<template>
  <div style="min-width: 100px">
    <el-container>
      <el-tabs type="border-card" style="width: 100%" v-model="activeTab">
        <el-tab-pane label="培训计划" name="trplan">
          <trplan></trplan>
        </el-tab-pane>
        <el-tab-pane label="培训课程">
          <tritem></tritem>
        </el-tab-pane>
        <el-tab-pane label="培训记录"> <trstaff></trstaff></el-tab-pane>
      </el-tabs>
    </el-container>
  </div>
</template>

<script>
import trplan from "../components/trplan.vue";
import tritem from "../components/tritem.vue";
import trstaff from "../components/trstaff.vue";

export default {
  data() {
    return {
      activeTab: "trplan",
    };
  },
  components: { trplan, tritem, trstaff },
};
</script>
