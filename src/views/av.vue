<template>
  <div class="about">
    <el-container>
      <el-tabs type="border-card" style="width: 99%" v-model="activeTab">
        <el-tab-pane label="积假管理" name="av">
          <av></av>
        </el-tab-pane>
      </el-tabs>
    </el-container>
  </div>
</template>

<script>
import av from "../components/avmgr.vue";

export default {
  data() {
    return {
      activeTab: "av",
    };
  },

  components: { av },
};
</script>
