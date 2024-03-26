<template>
  <div style="min-width: 100px">
    <el-container>
      <el-tabs type="border-card" style="width: 100%">
        <el-tab-pane label="绩效成绩" name="kq">
          <kpiplan></kpiplan>
        </el-tab-pane>
        <el-tab-pane label="绩效指标">
          <kpiitems></kpiitems>
        </el-tab-pane>
        <el-tab-pane label="绩效设置">
          <kpiset></kpiset>
        </el-tab-pane>
      </el-tabs>
    </el-container>
  </div>
</template>

<script>
import kpiitems from "../components/kpiitems.vue";
import kpiplan from "../components/kpiplan.vue";
import kpiset from "../components/kpiset";

export default {
  components: { kpiitems, kpiset, kpiplan },
};
</script>
