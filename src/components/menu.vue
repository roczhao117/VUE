<template>
  <div>
    <el-tree
      :data="data"
      node-key="id"
      :default-expand-all="true"
      :default-expanded-keys="openkey"
      :default-checked-keys="[5]"
      :props="defaultProps"
      @node-click="nodeClick"
      @node-expand="nodeClick"
      @node-collapse="nodeCollapse"
    >
      <template #default="{ node, data }">
        <span class="custom-tree-node">
          <el-tag style="font-size: 14px" :type="data.type == 0 ? 'info' : ''">
            {{
              data.fid != -1 ? node.label + " [" + data.mid + "]" : node.label
            }}
            {{ data.type == "0" ? "M" : "F" }}</el-tag
          >
          <span>
            <template v-if="data.fid != '-1'">
              <el-tooltip content="修改">
                <el-button size="small" plain @click="handleEdit(data)"
                  ><el-icon><Edit /></el-icon></el-button></el-tooltip
            ></template>
            <el-tooltip content="增加子功能">
              <el-button size="small" plain @click="handleNew(data)"
                ><el-icon><Plus /></el-icon></el-button
            ></el-tooltip>
            <template v-if="data.fid != '-1'">
              <el-tooltip content="删除">
                <el-button
                  type="danger"
                  size="small"
                  plain
                  @click="handleDelete(node, data)"
                  ><el-icon><Delete /></el-icon></el-button></el-tooltip
            ></template>
          </span>
        </span>
      </template>
    </el-tree>

    <div class="dialogform">
      <el-dialog title="功能结构" width="40%" v-model="dialogFormVisible">
        <el-form
          :rules="rules"
          :model="form"
          ref="form"
          class="margin:0 20px;display:flex;"
        >
          <el-form-item label="代码" :label-width="formLabelWidth" prop="mid">
            <el-input
              size="default"
              v-model="form.mid"
              autocomplete="off"
              :disabled="!neworedit"
            ></el-input>
          </el-form-item>

          <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
            <el-input
              size="default"
              v-model="form.name"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item label="描述" :label-width="formLabelWidth">
            <el-input
              size="default"
              v-model="form.desc"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item label="类型" :label-width="formLabelWidth" prop="type">
            <el-select v-model="form.type" placeholder="请选择类型">
              <el-option
                v-for="item in typelst"
                :label="item.name"
                :value="item.id"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="归属" :label-width="formLabelWidth">
            <el-select
              v-model="form.fid"
              placeholder="请选择父节点"
              :disabled="neworedit"
            >
              <el-option
                v-for="item in menuseldata"
                :label="item.name + '[' + item.mid + ']'"
                :value="item.mid"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="图标（Menu）" :label-width="formLabelWidth">
            <el-input
              size="default"
              v-model="form.icon"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item label="路由(/)" :label-width="formLabelWidth">
            <el-input
              size="default"
              v-model="form.path"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="模块（xxx.vue）" :label-width="formLabelWidth">
            <el-input
              size="default"
              v-model="form.module"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item label="排序" :label-width="formLabelWidth" prop="sort">
            <el-input
              size="default"
              v-model="form.sort"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item label="备注" :label-width="formLabelWidth">
            <el-input
              size="default"
              v-model="form.remark"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveForm">确 定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { AX } from "../utils/api";
import { useUserStore, useMenuStore } from "../store/index";
export default {
  setup() {
    const userstore = useUserStore();
    const menuStore = useMenuStore();

    return {
      userstore,
      menuStore,
    };
  },
  data() {
    return {
      hrgradedata: [],
      postypedata: [],
      openkey: [],
      myRoute: "menu",
      formLabelWidth: 160,
      dialogFormVisible: false,
      data: [],
      menuseldata: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      typelst: [
        { id: "0", name: "菜单" },
        { id: "1", name: "功能" },
      ],
      form: {
        id: "",
        mid: "",
        name: "",
        desc: "",
        fid: "",
        remark: "",
        path: "",
        module: "",
        icon: "",
        sort: "0",
        type: "0",
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入名称（2到50位）",
            trigger: "blur",
            min: 2,
            max: 50,
          },
        ],
        type: [
          {
            required: true,
            message: "请选择类型",
            trigger: "blur",
          },
        ],
        sort: [
          {
            required: true,

            pattern: /^\d{1,5}$/,

            message: "排序需要1-5位数字，格式不正确",

            trigger: "blur",
          },
        ],
        mid: [
          {
            required: true,

            pattern: /^[1-9]{1}\d{3,18}$/,

            message: "代码需要大于1000的4-18位数字，格式不正确！",

            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    this.listMain();
    this.getDic();
  },
  methods: {
    nodeClick(node) {
      this.openkey.push(node.id);
    },
    nodeCollapse(node) {
      this.openkey.remove(node.id);
    },

    getMaxMid(data, mid = 1001, idx = 0) {
      let id = mid;
      data.forEach((item) => {
        this.menuseldata.push(item);
        if (parseInt(item.mid) > id) {
          id = parseInt(item.mid);
        }

        if (item["children"]) {
          id = this.getMaxMid(item.children, id, idx++);
        }
      });
      return id;
    },
    handleNew(data) {
      this.neworedit = true;
      this.dialogFormVisible = true;

      this.menuseldata.splice(0, this.menuseldata.length);

      Object.keys(this.form).forEach((key) => {
        this.form[key] = "";
      });
      this.form.icon = "Menu";
      this.form.path = "/home";
      this.form.name = "home";
      this.form.module = "Home.vue";
      this.form.fid = data.mid;
      //这种方法这能在这里用，因为这个管理程序，不可能有多个人操作，否则就会出错。
      this.form.mid = this.getMaxMid(this.data) + 1;
      this.form.sort = "1001";
      this.form.type = "0";
      this.openkey.push(data.id);
    },
    handleEdit(data) {
      this.neworedit = false;
      this.dialogFormVisible = true;
      Object.keys(this.form).forEach((key) => {
        this.form[key] = "";
        this.form[key] = data[key];
      });
      this.openkey.push(data.id);
    },

    handleDelete(idx, row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          AX("DELETE", this.myRoute + "/" + row.id).then((res) => {
            if (res) {
              this.listMain();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    saveForm() {
      this.openkey.push(this.form.id);
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.neworedit) {
            AX("patch", this.myRoute + "/" + this.form.id, this.form).then(
              (res) => {
                if (res) {
                  this.dialogFormVisible = false;
                  this.listMain();
                }
              }
            );
          } else {
            AX("post", this.myRoute, this.form).then((res) => {
              if (res) {
                this.dialogFormVisible = false;
                this.listMain();
              }
            });
          }
        }
      });
    },
    getDic() {
      // AX('get', '/dicm/postype2').then(res => {
      //     this.postypedata = res.data;
      // })
      //     .catch(e => console.log(e.message));
      // AX('get', '/dicm/hrgrade').then(res => {
      //     this.hrgradedata = res.data;
      // })
      //     .catch(e => console.log(e.message))
    },
    listMain() {
      let rid = "-1";
      let user = {};
      if (
        this.userstore.getUser().data &&
        this.userstore.getUser().data[0] &&
        this.userstore.getUser().data[0].usrgrpid
      ) {
        rid = this.userstore.getUser().data[0].usrgrpid;
        user = this.userstore.getUser().data[0];
      }
      // AX("get", `menu/lst/user=${JSON.stringify}`).then((res) => {
      //   if (res && res.data) {
      //     this.data = res.data;
      //     this.getMaxMid(res.data, 1001);
      //   }
      // });
      this.data = this.menuStore.menuData.children;
    },
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
  margin-bottom: 15px;
}
.el-tree {
  margin-top: 10px;
}
.el-tree .el-button {
  margin-right: 5px;
  min-height: 20px;
  padding: 3px;
}
.ispos {
  color: #67c23a;

  background-color: #ecf5ff;
  padding: 1px 5px;
  margin-left: 7px;
}
.pdmsg {
  margin-left: 1px;
  background-color: none;
  color: rgb(192, 192, 192);
  font-weight: normal;
  font-size: 14px;
}
</style>
