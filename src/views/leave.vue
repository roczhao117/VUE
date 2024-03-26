<template>
  <div class="about">
    <el-container>
      <el-tabs type="border-card" style="width: 99%" v-model="activeTab">
        <el-tab-pane label="请假单管理" name="lev">
          <lev></lev>
        </el-tab-pane>
      </el-tabs>
    </el-container>
  </div>
</template>

<script>
import lev from "../components/levmgr.vue";

export default {
  data() {
    return {
      activeTab: "lev",
    };
  },

  components: { lev },
};
</script>
