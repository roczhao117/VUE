<template>
  <div>
    <el-tree
      :data="data"
      show-checkbox
      node-key="id"
      :default-expanded-keys="openkey"
      :default-checked-keys="[5]"
      :props="defaultProps"
      :default-expand-all="true"
      @node-click="nodeClick"
      @node-expand="nodeClick"
      @node-collapse="nodeCollapse"
    >
      <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span :class="{ iscom: data.id == -1 }">
            {{ data.id != -1 ? node.label : data.descs }}
            <span class="pdmsgcom" v-if="data.id == '-1'">单位</span>
            <span class="pdmsg" v-else></span>
          </span>
          <span>
            <el-button
              size="small"
              style="height: 20px"
              plain
              v-if="data.id != -1"
              @click="handleEdit(data)"
              ><el-icon><Edit /></el-icon
            ></el-button>
            <el-button size="small" plain @click="handleNew(data)"
              ><el-icon><Plus /></el-icon
            ></el-button>
            <el-button
              type="danger"
              size="small"
              plain
              v-if="data.id != -1"
              @click="handleDelete(node, data)"
              ><el-icon><Delete /></el-icon
            ></el-button>
          </span>
        </span>
      </template>
    </el-tree>

    <div class="dialogform">
      <el-dialog title="成本结构" width="40%" v-model="dialogFormVisible">
        <el-form
          :rules="rules"
          :model="form"
          ref="form"
          class="margin:0 20px;display:flex;"
        >
          <el-form-item
            label="代码"
            :label-width="formLabelWidth"
            prop="costid"
          >
            <el-input
              size="medium"
              v-model="form.costid"
              autocomplete="off"
              :disabled="!neworedit"
            ></el-input>
          </el-form-item>

          <el-form-item label="描述" :label-width="formLabelWidth">
            <el-input
              size="medium"
              v-model="form.descs"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item label="类型" :label-width="formLabelWidth">
            <el-input
              size="medium"
              v-model="form.type"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item label="排序" :label-width="formLabelWidth">
            <el-input
              size="medium"
              v-model="form.sort"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item label="备注" :label-width="formLabelWidth">
            <el-input
              size="medium"
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
export default {
  data() {
    return {
      hrgradedata: [],
      postypedata: [],
      openkey: [],

      dialogFormVisible: false,
      data: [],
      defaultProps: {
        children: "children",
        label: "costid",
      },
      form: {
        costid: "",
        descs: "",
        fid: "",
        remark: "",
        is_del: "0",
        sort: "",
        type: "",
      },
      rules: {
        costid: [
          {
            required: true,
            pattern: /^\d{2,15}$/,

            message: "2位以上数字，格式不正确",

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
    handleNew(data) {
      this.neworedit = true;
      this.dialogFormVisible = true;

      Object.keys(this.form).forEach((key) => {
        this.form[key] = "";
      });

      this.form.is_del = 0;
      this.form.fid = data.costid;
      this.openkey.push(data.id);
    },
    handleEdit(data) {
      this.neworedit = false;
      this.dialogFormVisible = true;
      this.form = Object.assign({}, data);
      this.openkey.push(data.id);
    },

    handleDelete(idx, row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          AX("DELETE", "/cost/" + row.id).then((res) => {
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
            AX("put", "/cost/" + this.form.id, this.form).then((res) => {
              if (res) {
                this.dialogFormVisible = false;
                this.listMain();
              }
            });
          } else {
            AX("post", "/cost", this.form).then((res) => {
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
      AX("get", "cost").then((res) => {
        console.log(res);
        if (res && res.data.length > 0) {
          this.data = res.data;
        }
      });
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
  margin-bottom: 20px;
}
.el-tree {
  margin-top: 10px;
}
.el-tree .el-button {
  margin-right: 5px;
  min-height: 20px;
  padding: 3px;
}
.iscom {
  color: #9a9797;
  padding: 1px 5px;
  margin-left: 7px;
  font-weight: bold;
  font-size: 14px;
  background-color: rgb(242 242 242);
  border: 1px solid #d2d2d2;
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
  font-size: 10px;
}
.pdmsgcom {
  margin-left: 1px;
  background-color: none;
  color: rgb(192, 192, 192);
  font-weight: bold;
  font-size: 12px;
}
</style>
