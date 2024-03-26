<template>
  <div class="about">
    <el-container>
      <el-tabs type="border-card" style="width: 99%" v-model="activeTab">
        <el-tab-pane label="年假管理" name="al">
          <al></al>
        </el-tab-pane>
      </el-tabs>
    </el-container>
  </div>
</template>

<script>
import al from "../components/almgr.vue";

export default {
  data() {
    return {
      activeTab: "al",
    };
  },

  components: { al },
};
</script>
