<template>
  <div class="about">
    <el-container>
      <el-tabs type="border-card" style="width: 100%">
        <el-tab-pane label="系统选项">
          <dic></dic>
        </el-tab-pane>
        <el-tab-pane label="部门结构">
          <deptpos></deptpos>
        </el-tab-pane>
        <el-tab-pane label="职位设置">
          <position></position>
        </el-tab-pane>
        <el-tab-pane label="成本结构">
          <cost></cost>
        </el-tab-pane>
      </el-tabs>
    </el-container>
  </div>
</template>

<script>
import dic from "../components/dic.vue";
import deptpos from "../components/deptpos.vue";
import cost from "../components/cost.vue";
import position from "../components/position.vue";
//import { AX } from '../utils/api'
export default {
  components: { dic, position, cost, deptpos },
};
</script>
