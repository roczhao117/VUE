<template>
  <div>
    <el-row :gutter="24">
      <el-col :span="12">
        <el-select
          v-model="roleid"
          @change="roleChange"
          style="display: flex"
          placeholder="请选择角色"
        >
          <el-option
            v-for="item in roleData"
            :key="item.rid"
            :label="item.rname + '-' + item.comname"
            :value="item.rid"
          ></el-option> </el-select
      ></el-col>
      <el-col :span="12">
        <span style="margin-left: 50px; line-height: 40px">
          <el-switch
            v-model="is_fastselect"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="全选"
            inactive-text="查询状态"
            @change="switchChange"
            :disabled="true"
            v-show="false"
          ></el-switch> </span
      ></el-col>
    </el-row>
    <el-tabs
      v-model="activeName"
      type="card"
      @tab-click="tabClick"
      style="margin-top: 10px"
    >
      <el-tab-pane label="菜单/功能" name="menu" style="height: 600px">
        <el-tree
          :data="menuData"
          show-checkbox
          node-key="mid"
          ref="menuTree"
          :props="menuProps"
          :default-expand-all="true"
          @check-change="checkChange"
          style="height: 510px"
        >
          <template #default="{ node }">
            <span class="custom-tree-node">
              {{ node.label }}
              <!-- <span>
                <el-checkbox
                  v-model="node.data.has_read"
                  :disabled="true"
                  style="color: #67c23a"
                  >读</el-checkbox
                >
                <el-checkbox v-model="node.data.has_edit" style="color: #e6a23c"
                  >改</el-checkbox
                >
                <el-checkbox
                  v-model="node.data.has_delete"
                  style="color: #f56c6c"
                  >删</el-checkbox
                >
              </span> -->
            </span>
          </template>
        </el-tree>
        <el-divider></el-divider>
        <el-button type="primary" style="margin-left: 10px" @click="saveMenu"
          >保存</el-button
        >
      </el-tab-pane>
      <el-tab-pane label="部门权限" name="dept" style="height: 600px">
        <el-tree
          :data="dpData"
          show-checkbox
          node-key="deptid"
          ref="deptTree"
          :props="dpProps"
          :default-expand-all="true"
          style="height: 510px"
        ></el-tree>
        <el-divider></el-divider>
        <el-button type="primary" style="margin-left: 10px" @click="saveDept"
          >保存</el-button
        >
      </el-tab-pane>

      <el-tab-pane label="级别权限" name="hrgrade" style="height: 600px">
        <el-tree
          :data="gradeData"
          show-checkbox
          node-key="itemid"
          ref="hrgradeTree"
          :props="gradeProps"
          :default-expand-all="true"
          style="height: 510px"
        ></el-tree>
        <el-divider></el-divider>
        <el-button type="primary" style="margin-left: 10px" @click="saveTree"
          >保存</el-button
        >
      </el-tab-pane>
      <el-tab-pane label="敏感内容" name="otherright" style="height: 600px">
        <el-tree
          :data="otherrightData"
          show-checkbox
          ref="otherrightTree"
          node-key="itemid"
          :props="otherrightProps"
          :default-expand-all="true"
          style="height: 510px"
        ></el-tree>
        <el-divider></el-divider>
        <el-button type="primary" style="margin-left: 10px" @click="saveTree"
          >保存</el-button
        >
      </el-tab-pane>
      <el-tab-pane label="单据权限" name="docstatus" style="height: 600px">
        <el-tree
          :data="docstatusData"
          show-checkbox
          ref="docstatusTree"
          node-key="itemid"
          :props="docstatusProps"
          :default-expand-all="true"
          style="height: 510px"
        ></el-tree>
        <el-divider></el-divider>
        <el-button type="primary" style="margin-left: 10px" @click="saveTree"
          >保存</el-button
        >
      </el-tab-pane>
      <el-tab-pane label="薪资帐套" name="pritemgcalgrp" style="height: 600px">
        <el-tree
          :data="prgrpData"
          show-checkbox
          ref="prgrpTree"
          node-key="itemid"
          :props="prgrpProps"
          :default-expand-all="true"
          style="height: 510px"
        ></el-tree>
        <el-divider></el-divider>
        <el-button type="primary" style="margin-left: 10px" @click="saveTree"
          >保存</el-button
        >
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { AX } from "../utils/api";
import {
  useDeptPosStore,
  useUserStore,
  useMenuStore,
  useDicStore,
} from "../store/index";
import { useFormItemInputId } from "element-plus";
export default {
  setup() {
    const userstore = useUserStore();
    const deptposstore = useDeptPosStore();
    const menustore = useMenuStore();
    const dicstore = useDicStore();
    return {
      userstore,
      deptposstore,
      menustore,
      dicstore,
    };
  },
  data() {
    return {
      roleData: [],
      menuData: [],
      isAdmin: false,

      cominfoData: [],
      menuChk: [],
      menuProps: {
        label: "name",
        children: "children",
      },

      is_fastselect: true,

      dpData: [],
      dpProps: {
        label: "deptname",
        children: "children",
      },

      gradeData: [],
      gradeProps: {
        label: "itemname",
        children: "children",
      },

      docstatusData: [],
      docstatusProps: {
        label: "itemname",
        children: "children",
      },
      prgrpData: [],
      prgrpProps: {
        label: "itemname",
        children: "children",
      },

      otherrightData: [],
      otherrightProps: {
        label: "itemname",
        children: "children",
      },

      roleid: "",
      activeName: "menu",
    };
  },
  methods: {
    /**2021年6月
     * 如果角色发生改变，这里后面需要考虑，角色改变以后，只对当前的 权限所需数据进行更新，
     * 比如：功能，级别，部门职位 的选项卡，选择相应的卡，才下载相应的数据，目前是全部下载。
     * 可以考虑在点选卡片的时候进行下载，而且最后不是每次点都下载，数据有了就不用下载了，可以考虑是用
     * vuex 的数据状态管理
     *
     * 2023年12月03
     * 实际上没必要考虑上述的内容，因为本身权限的数据量级并不大，而且权限设置的功能也不常用。、
     * 真正需要考虑的是经常用，数据量大小无所谓，但是却需要频繁和数据库打交道的。比如DIC中的数据。
     * 而且应该考虑 Pinia.它是下一代的VUEX.
     */

    switchChange() {
      console.log(this.activeName);
    },
    roleChange() {
      /**
       *
       */
      this.is_fastselect = false;
      /**
       * 初始化树钩的数组
       */
      this.menuChk.splice(0, this.menuChk.length);
      /**
       * 如果存在角色，就是选择到了角色，默认进来是空的
       */

      // console.log(this.activeName);
      if (this.roleid) {
        AX("get", "roleright/lst/" + this.roleid + "/-1")
          .then((res) => {
            if (this.activeName == "menu") {
              // this.iniTree(this.menuData);
              this.$refs.menuTree.setCheckedNodes([]);
              res.data.forEach((item) => {
                if (item.type == this.activeName) {
                  this.$refs.menuTree.setChecked(item.aid, true);
                }
              });
            }

            if (this.activeName == "dept") {
              // this.iniTree(this.dpData);
              this.$refs.deptTree.setCheckedNodes([]);
              res.data.forEach((item) => {
                if (item.type == this.activeName) {
                  this.$refs.deptTree.setChecked(item.aid, true);
                }
              });
            }
            if (this.activeName == "hrgrade") {
              // this.iniTree(this.gradeData);
              this.$refs.hrgradeTree.setCheckedNodes([]);
              res.data.forEach((item) => {
                // this.tree(this.gradeData, item);
                if (item.type == this.activeName) {
                  this.$refs.hrgradeTree.setChecked(item.aid, true);
                }
              });
            }
            if (this.activeName == "otherright") {
              // this.iniTree(this.otherrightData);
              this.$refs.otherrightTree.setCheckedNodes([]);
              res.data.forEach((item) => {
                // this.tree(this.otherrightData, item);
                if (item.type == this.activeName) {
                  this.$refs.otherrightTree.setChecked(item.aid, true);
                }
              });
            }
            if (this.activeName == "docstatus") {
              // this.iniTree(this.docstatusData);
              this.$refs.docstatusTree.setCheckedNodes([]);
              res.data.forEach((item) => {
                // this.tree(this.docstatusData, item);
                if (item.type == this.activeName) {
                  this.$refs.docstatusTree.setChecked(item.aid, true);
                }
              });
            }
            if (this.activeName == "pritemgcalgrp") {
              // this.iniTree(this.prgrpData);
              this.$refs.prgrpTree.setCheckedNodes([]);
              res.data.forEach((item) => {
                if (item.type == this.activeName) {
                  this.$refs.prgrpTree.setChecked(item.aid, true);
                }

                // this.tree(this.prgrpData, item);
              });
            }
          })
          .catch((e) => console.log(e.message));
      }
    },
    /**
     * 初始化树
     */
    async iniTree(data) {
      // console.log('initree:', this.activeName)
      data.forEach((item) => {
        /**
         * 必须在下面设置之前进行打勾，否则下面的设置会改变所有的钩子
         */

        if (this.activeName == "menu") {
          // this.$refs.menuTree.setChecked(item.id, false);

          // if (item.children) {
          //   this.iniTree(item.children);
          // }

          this.$refs.menuTree.setCheckedNodes([]);
        }

        if (this.activeName == "dept") {
          // this.$refs.deptTree.setChecked(item.id, false);
          // if (item.children) {
          //   this.iniTree(item.children);
          // }
          this.$refs.deptTree.setCheckedNodes([]);
        }

        if (
          ["hrgrade", "otherright", "docstatus", "pritemgcalgrp"].includes(
            this.activeName
          ) != 0
        ) {
          switch (this.activeName) {
            case "hrgrade": {
              // this.$refs.hrgradeTree.setChecked(item.id, false);
              this.$refs.hrgradeTree.setCheckedNodes([]);
              break;
            }
            case "otherright": {
              this.$refs.otherrightTree.setCheckedNodes([]);
              break;
            }
            case "docstatus": {
              this.$nextTick(() => {
                this.$refs.docstatusTree.setCheckedNodes([]);
              });

              break;
            }
            case "pritemgcalgrp": {
              this.$nextTick(() => {
                console.log("pritemgcalgrp------------------");
                this.$refs.prgrpTree.setCheckedNodes([]);
              });
              break;
            }
          }

          // if (item.children) {
          //   this.iniTree(item.children);
          // }
        }
      });
    },
    /**
     * 递归树，
     */
    async tree(data, res) {
      let id = res.aid;

      // console.log("data", data);
      // console.log("atcive", this.activeName, "res:", res);

      data.forEach((item) => {
        let itemId = item.aid;
        if (this.activeName == "menu") {
          itemId = item.mid;
        }
        if (this.activeName == "dept") {
          itemId = item.deptid;
        }
        if (this.activeName == "hrgrade") {
          itemId = item.itemid;
        }
        if (this.activeName == "docstatus") {
          itemId = item.itemid;
        }
        if (this.activeName == "otherright") {
          itemId = item.itemid;
        }
        if (this.activeName == "pritemgcalgrp") {
          itemId = item.itemid;
        }

        if (id != itemId) {
          if (item.children) {
            this.tree(item.children, res);
          }
        } else {
          if (this.activeName == "menu") {
            this.$refs.menuTree.setChecked(item.id, true);
          }
          if (this.activeName == "dept") {
            this.$refs.deptTree.setChecked(item.id, true);
          }
          if (this.activeName == "hrgrade") {
            this.$refs.hrgradeTree.setChecked(item.id, true);
          }
          if (this.activeName == "docstatus") {
            this.$refs.docstatusTree.setChecked(item.id, true);
          }
          if (this.activeName == "otherright") {
            this.$refs.otherrightTree.setChecked(item.id, true);
          }
          if (this.activeName == "pritemgcalgrp") {
            this.$nextTick(() => {
              this.$refs.prgrpTree.setChecked(item.id, true);
              console.log("----set", item.id);
            });
          }

          return;
        }
      });
    },

    checkChange(data, nodeChk) {
      /**
       * 如果不等于不再快速选择状态下，就失效，否则会影响查询的结果。
       */
      // console.log(dat, nodeChk);
      if (!this.is_fastselect) {
        return;
      }
      // if (nodeChk) {
      //   data.has_read = true;
      //   data.has_edit = true;
      //   data.has_delete = true;
      // } else {
      //   data.has_read = false;
      //   data.has_edit = false;
      //   data.has_delete = false;
      // }
    },

    chkadmin() {
      /**
       * admin 不需要分配权限，一个单位只能有一个admin。
       * admin 在选择薪资的时候，需要手动选择账套。
       */
      // this.roleData.forEach((item) => {
      //   if (item.rid == this.roleid) {
      //     if ("admin" == item.rname.toLowerCase()) {
      //       this.isAdmin = true;
      //     }
      //   }
      // });
      //   if (this.isAdmin) {
      //     this.$message.error("admin 不需要分配权限，他有所在单位的最高权限！");
      //     return true;
      //   } else {
      //     return false;
      //   }
    },

    saveMenu() {
      this.isAdmin = false;

      if (!this.roleid) {
        this.$message.error("请选择角色！");
        return;
      }

      if (this.chkadmin()) {
        return;
      }

      let lst = this.$refs.menuTree.getCheckedNodes(false, true);
      let formdata = [];

      lst.forEach((val) => {
        let data = {};

        data.aid = val.mid;
        data.rid = this.roleid;

        data.type = "menu";
        formdata.push(data);
      });
      // console.error(formdata);
      if (formdata.length > 0) {
        //删除代号role的所有数据，且弄好
        AX("post", "roleright", formdata)
          .then((res) => {
            // console.log(res);
          })
          .catch((e) => console.log(e.message));
      }
    },

    saveTree() {
      if (!this.roleid) {
        this.$message.error("请选择角色！");
        return;
      }

      let lst = "";

      let datatype = this.activeName;

      switch (this.activeName) {
        case "hrgrade": {
          lst = this.$refs.hrgradeTree.getCheckedNodes();
          break;
        }
        case "otherright": {
          lst = this.$refs.otherrightTree.getCheckedNodes();
          break;
        }
        case "docstatus": {
          lst = this.$refs.docstatusTree.getCheckedNodes();
          break;
        }
        case "pritemgcalgrp": {
          lst = this.$refs.prgrpTree.getCheckedNodes();

          break;
        }
      }

      let formdata = [];

      lst.forEach((val) => {
        let data = {};

        data.aid = val.itemid;
        data.rid = this.roleid;
        data.type = datatype;
        formdata.push(data);
      });

      if (formdata.length > 0) {
        //删除代号role的所有数据，且弄好
        AX("post", "roleright/", formdata)
          .then((res) => {
            console.log(res);
          })
          .catch((e) => console.log(e.message));
      }
      // console.log(formdata);
    },

    saveDept() {
      if (!this.roleid) {
        this.$message.error("请选择角色！");
        return;
      }

      if (this.chkadmin()) {
        return;
      }
      let lst = this.$refs.deptTree.getCheckedNodes(false, true);
      let formdata = [];

      lst.forEach((val) => {
        let data = {};

        data.aid = val.deptid;
        data.rid = this.roleid;
        data.type = "dept";
        formdata.push(data);
      });

      if (formdata.length > 0) {
        //删除代号role的所有数据，且弄好
        AX("post", "roleright", formdata)
          .then((res) => {
            console.log(res);
          })
          .catch((e) => console.log(e.message));
      }
      // console.log(formdata);
    },

    tabClick() {
      if (this.roleid) {
        this.roleChange();
      }
    },
    getdic() {
      AX("get", "cominfo").then((res) => {
        if (res && res.data.length > 0) {
          this.cominfoData = res.data;
        }
      });

      AX("get", `roles/lstall/${this.userstore.getUser().data[0].comid}`).then(
        (res) => {
          // console.log(res);
          if (res && res.data.length > 0) {
            this.roleData = res.data;
          }
        }
      );
    },
    listMain() {
      let rid = "-1";
      if (
        this.userstore.getUser().data &&
        this.userstore.getUser().data[0] &&
        this.userstore.getUser().data[0].usrgrpid
      ) {
        rid = this.userstore.getUser().data[0].usrgrpid;
      }

      // AX("get", `menu/${rid}`).then((res) => {
      //   if (res && res.data.length > 0) {
      //     this.menuData = res.data;
      //   }
      // });
      this.menuData = this.menustore.menuData.children;
      this.menuData = [
        {
          mid: "0",
          name: "功能/Function",
          children: [...this.menuData],
        },
      ];
      // console.log(this.menuData);
      // AX("get", "dept/").then((res) => {
      //   if (res && res.data.length > 0) {
      //     this.dpData = res.data;
      //   }
      // });

      this.dpData = this.deptposstore.deptData.data;

      // AX("get", "dic/dicmid/hrgrade").then((res) => {
      //   if (res && res.data.length > 0) {
      //     this.gradeData = res.data;
      //   }
      // });

      this.gradeData = this.dicstore.getDic("hrgrade");
      this.gradeData = [
        {
          itemid: "0",
          itemname: "级别/grade",
          children: [...this.gradeData],
        },
      ];

      // AX("get", "dic/dicmid/docstatus").then((res) => {
      //   if (res && res.data.length > 0) {
      //     this.docstatusData = res.data;
      //   }
      // });
      this.docstatusData = this.dicstore.getDic("docstatus");
      this.docstatusData = [
        {
          itemid: "0",
          itemname: "状态/status",
          children: [...this.docstatusData],
        },
      ];

      // AX("get", "dic/dicmid/pritemgcalgrp").then((res) => {
      //   if (res && res.data.length > 0) {
      //     this.prgrpData = res.data;
      //   }
      // });
      this.prgrpData = this.dicstore.getDic("pritemgcalgrp");

      // AX("get", "dic/dicmid/otherright").then((res) => {
      //   if (res && res.data.length > 0) {
      //     this.otherrightData = res.data;
      //   }
      // });
      this.otherrightData = this.dicstore.getDic("otherright");
      this.otherrightData = [
        {
          itemid: "0",
          itemname: "隐私/privacy",
          children: [...this.otherrightData],
        },
      ];
    },
  },
  mounted() {
    this.getdic();
    this.listMain();
  },
};
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
  height: 510px;
  overflow: scroll;
}
.el-tree .el-button,
.el-checkbox {
  margin-right: 5px;
  min-height: 20px;
  padding: 3px;
}
</style>
