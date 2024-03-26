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
import {
  useMenuStore,
  useDicStore,
  useDeptPosStore,
  useUserStore,
  useRightStore,
  useEmidStore,
  useShiftStore,
} from "@/store/index.js";
import { AX } from "../utils/api";

export default {
  setup() {
    const menustore = useMenuStore();
    const dicstore = useDicStore();
    const deptposstore = useDeptPosStore();
    const userstore = useUserStore();
    const rightstore = useRightStore();
    const emidstore = useEmidStore();
    const shiftstore = useShiftStore();
    return {
      menustore,
      dicstore,
      deptposstore,
      userstore,
      rightstore,
      emidstore,
      shiftstore,
    };
  },
  data() {
    return {
      menudata: reactive([]),
    };
  },
  mounted() {
    // const fullPath = this.$route.path;
    // console.log(fullPath);
    // const menustr = sessionStorage.getItem("menu");
    // if (menustr) {
    //   this.menudata = JSON.parse(menustr)[0].children;
    //   // console.log(this.menudata[0].children);
    // }
    let rid = "-1";
    let udatastr = "";
    let comid = "0";
    if (
      this.userstore.getUser().data &&
      this.userstore.getUser().data[0] &&
      this.userstore.getUser().data[0].usrgrpid
    ) {
      rid = this.userstore.getUser().data[0].usrgrpid;
      comid = this.userstore.getUser().data[0].comid;
      udatastr = JSON.stringify(this.userstore.getUser().data[0]);
    }

    // console.warn("################", rid);
    // console.error("################", udatastr);

    AX("get", "dic/lstall").then((e) => {
      if (e && e.data && e.data.length > 0) {
        // console.log(e);
        this.dicstore.add2DicStore("-1", e.data);
      }
    });
    //----------------------------------------------
    AX("get", `dept?hookpos=0&user=${udatastr}`).then((e) => {
      if (e && e.data) {
        this.deptposstore.add2DeptStore("-1", e.data);
      }
    });

    AX("get", `dept?hookpos=1&user=${udatastr}`).then((e) => {
      if (e && e.data) {
        this.deptposstore.add2DeptPosStore("-1", e.data);
      }
    });
    //------------------------------------------
    AX("get", `roleright/lst/${rid}/-1`).then((e) => {
      // console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$", e.data, rid);
      if (e && e.data) {
        this.rightstore.add2RightStore(e.data);
      }
    });

    //================================================================
    //这里必须提供对象，ID位随便赋值，否则nest解析json出错
    const block = {};
    block.id = -1;
    //================================================================
    AX(
      "get",
      `kqshift?page=1
        &pagesize=800&block=${JSON.stringify(block)}`
    ).then((e) => {
      console.log(e.data);
      if (e && e.data) {
        this.shiftstore.add2ShiftStore(e.data);
      }
    });
    // AX("get", `hrinfo/maxemid/${comid}`).then((e) => {
    //   console.log("=====================", e.data);
    //   if (e && e.data) {
    //     this.emidstore.add2EmidStore(e.data);
    //   }
    // });

    this.menudata = this.menustore.menuData.children;
  },
};
</script>
<style scoped>
.el-menu {
  height: 100%;

  position: fixed;
}
</style>
