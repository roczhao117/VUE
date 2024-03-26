<template>
  <div class="about">
    <el-container>
      <el-tabs type="border-card" style="width: 99%" v-model="activeTab">
        <el-tab-pane label="加班单管理" name="ot">
          <ot></ot>
        </el-tab-pane>
      </el-tabs>
    </el-container>
  </div>
</template>

<script>
import ot from "../components/otmgr.vue";

export default {
  data() {
    return {
      activeTab: "ot",
    };
  },

  components: { ot },
};
</script>
