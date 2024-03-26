<template>
  <div class="about">
    <el-container>
      <el-tabs type="border-card" style="width: 100%">
        <el-tab-pane label="组织信息">
          <cominfo></cominfo>
        </el-tab-pane>

        <el-tab-pane label="功能模块">
          <homemenu></homemenu>
        </el-tab-pane>
      </el-tabs>
    </el-container>
  </div>
</template>

<script>
import homemenu from "../components/menu.vue";
import cominfo from "../components/cominfo.vue";

export default {
  components: { homemenu, cominfo },
};
</script>
