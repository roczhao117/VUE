<template>
  <el-menu
    router
    text-color="#a1a2a5"
    class="el-menu-vertical-demo sliderhight"
    unique-opened
  >
    <template v-for="item in menudata" :key="item.mid">
      <midmenu :item="item"></midmenu>
      <p>{{ item.name }}</p>
    </template>
  </el-menu>
</template>
<script>
import { reactive } from "vue";
import { midmenu } from "./midmenu.vue";
export default {
  components: { midmenu },
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
      console.log(this.menudata[0].children);
    }
  },
};
</script>
<style scoped>
.el-menu {
  height: 100%;
}
</style>
