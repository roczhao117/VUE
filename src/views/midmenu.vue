<template>
  <el-sub-menu v-if="!item.children" :index="item.path">
    <template #title>
      <el-icon><component :is="item.icon"></component></el-icon>
      <span style="font-size: 16px; font-weight: bold">{{ item.name }}</span>
    </template>
    <template v-for="inItem in item.children" :key="inItem.name">
      <midmenu :item="inItem"></midmenu>
    </template>
  </el-sub-menu>

  <el-menu-item v-else :index="item.path">
    <template #title>
      <el-icon><component :is="item.icon"></component></el-icon>
      <span style="font-size: 16px; font-weight: bold">{{ item.name }}</span>
    </template>
  </el-menu-item>
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "midmenu",
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
});
</script>
<style scoped>
.el-menu {
  height: 100%;
}
</style>
