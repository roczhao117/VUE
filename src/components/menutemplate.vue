<template>
  <div>
    <el-tabs v-model="tabindex" type="card" style="margin-top: 10px">
      <el-tab-pane label="菜单/功能" name="menu">
        <el-tree
          :data="menuData"
          show-checkbox
          node-key="id"
          ref="menutree"
          :props="menuProps"
          default-expand-all
        >
          <template #default="{ node }">
            <span class="custom-tree-node">
              {{ node.label }}
            </span>
          </template>
        </el-tree>

        <el-button type="primary" style="margin-left: 10px" @click="saveMenu"
          >保存</el-button
        >
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { AX } from "../utils/api";
import {
  watch,
  reactive,
  onMounted,
  toRaw,
  ref,
  getCurrentInstance,
} from "vue";
import { useMenuStore } from "../store/index.js";
const props = defineProps(["comid"]);
const menustore = useMenuStore();
const menuProps = {
  label: "name",
  children: "children",
};
const tabindex = "menu";
let data = [];
let menuData = reactive([]);
let menuChk = [];
const { proxy } = getCurrentInstance();

/**
 * 初始化树
 */
const iniTree = async (data) => {
  //console.log("initree");
  data.forEach((item) => {
    /**
     * 必须在下面设置之前进行打勾，否则下面的设置会改变所有的钩子
     */
    proxy.$refs.menutree.setChecked(item.id, false);

    if (item.children) {
      iniTree(item.children);
    }
  });
};
/**
 * 递归树，
 */

const tree = async (data, res) => {
  let id = res.mid;
  data.forEach((item) => {
    if (id != item.mid) {
      if (item.children) {
        tree(item.children, res);
      }
    } else {
      //       this.menuChk.push(item.id)
      /**
       * 必须在下面设置之前进行打勾，否则下面的设置会改变所有的钩子
       */
      //    //console.log(this.menuChk)

      //      this.$refs.menutree.setCheckedKeys(this.menuChk);
      proxy.$refs.menutree.setChecked(item.id, true);

      return;
    }
  });
};
const saveMenu = () => {
  let lst = proxy.$refs.menutree.getCheckedNodes(false, true);
  let formdata = [];

  lst.forEach((val) => {
    let data = {};
    data.mid = val.mid;
    data.comid = props.comid;
    formdata.push(data);
  });
  if (formdata.length > 0) {
    //删除代号role的所有数据，且弄好
    AX("post", "menutemplate", formdata)
      .then((res) => {
        console.log(res);
        proxy.$emit("closeDialog");
      })
      .catch((e) => console.log(e.message));
  }
};

const listMain = async () => {
  await AX("get", "menu/-1").then((res) => {
    if (res && res.data) {
      menuData = res.data;
    }
  });
};

watch(
  () => props.comid,
  (n, o) => {
    console.log(n, o);

    iniTree(menuData);

    AX("get", "menutemplate/" + n)
      .then((res) => {
        data = [...res.data];
        data.forEach((r) => {
          tree(menuData, r);
        });
      })
      .catch((e) => console.log(e.message));
  },
  { immediate: true }
);

onMounted(async () => {
  let data = menustore.menuData;
  if (data) {
    menuData.push(toRaw(data));
  }
});

const ck = async () => {};
</script>
<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.el-form-item {
  margin-bottom: 5px;
}
.el-tree {
  margin-top: 10px;
}
.el-tree .el-button,
.el-checkbox {
  margin-right: 5px;
  min-height: 20px;
  padding: 3px;
}
</style>
