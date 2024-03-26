<template>
  <el-menu router text-color="#a1a2a5" unique-opened>
    <el-sub-menu v-for="item in menudata" :key="item.mid" :index="item.mid">
      <template #title>
        <el-icon><component :is="item.icon"></component></el-icon>
        <span style="font-size: 16px; font-weight: bold">{{ item.name }}</span>
      </template>
      <el-menu-item
        v-for="citem in item.children"
        :key="citem.id"
        :index="citem.path"
        style="font-size: 16px"
        ><el-icon><component :is="citem.icon"></component></el-icon
        >{{ citem.name }}</el-menu-item
      >
    </el-sub-menu>
  </el-menu>
</template>
<script>
import { reactive } from "vue";
export default {
  data() {
    return {
      menudata: reactive([]),
    };
  },
  mounted() {
    // const fullPath = this.$route.path;
    // console.log(fullPath);
    const menustr = sessionStorage.getItem("menu");
    if (menustr) {
      this.menudata = JSON.parse(menustr)[0].children;
      // console.log(this.menudata[0].children);
    }
  },
};
</script>
<style scoped>
.el-menu {
  height: 100%;
}
</style>
