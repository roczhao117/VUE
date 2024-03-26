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
          <span :class="{ iscom: data.deptlevel == '0' }">
            {{ node.label }}
            <span class="pdmsgcom" v-if="data.deptlevel == '0'">单位</span>
            <span class="pdmsgpos" v-else-if="data.deptlevel == '2'">职位</span>
            <span class="pdmsg" v-else>部门</span>
          </span>
          <span>
            <el-tooltip
              content="修改部门"
              placement="bottom"
              v-if="data.deptlevel != '0' && data.deptlevel != '2'"
            >
              <el-button
                size="small"
                style="height: 20px"
                v-if="data.deptlevel != '0' && data.deptlevel != '2'"
                @click="handleEdit(data)"
                ><el-icon><Edit /></el-icon></el-button
            ></el-tooltip>
            <el-tooltip content="增加子部门"
              ><el-button size="small" @click="handleNew(data)"
                ><el-icon><Plus /></el-icon></el-button
            ></el-tooltip>
            <el-tooltip
              content="设置职位"
              placement="bottom"
              v-if="data.deptlevel != '0' && data.deptlevel != '2'"
            >
              <el-button
                size="small"
                @click="handlePosNew(data)"
                v-if="data.deptlevel != '0' && data.deptlevel != '2'"
                ><el-icon><Files /></el-icon></el-button
            ></el-tooltip>
            <el-button
              type="danger"
              size="small"
              v-if="data.deptlevel != '0' && data.deptlevel != '2'"
              @click="handleDelete(node, data)"
              ><el-icon><Delete /></el-icon
            ></el-button>
          </span>
        </span>
      </template>
    </el-tree>

    <div class="dialogform">
      <el-dialog title="参数设置" width="40%" v-model="dialogFormVisible">
        <el-form
          :rules="rules"
          :model="form"
          ref="form"
          class="margin:0 20px;display:flex;"
        >
          <el-form-item
            label="代码"
            :label-width="formLabelWidth"
            prop="deptid"
          >
            <el-input
              size="default"
              v-model="form.deptid"
              autocomplete="off"
              :disabled="true"
            ></el-input>
          </el-form-item>

          <el-form-item
            label="名称"
            :label-width="formLabelWidth"
            prop="deptname"
          >
            <el-input
              size="default"
              v-model="form.deptname"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item label="描述" :label-width="formLabelWidth">
            <el-input
              size="default"
              v-model="form.deptename"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item label="父级" :label-width="formLabelWidth">
            <el-input
              size="default"
              v-model="form.fid"
              autocomplete="off"
              :disabled="true"
            ></el-input>
          </el-form-item>

          <el-form-item label="代码1" :label-width="formLabelWidth">
            <el-input
              size="default"
              v-model="form.deptadd1"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item label="代码2" :label-width="formLabelWidth">
            <el-input
              size="default"
              v-model="form.deptadd2"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item label="成本代码" :label-width="formLabelWidth">
            <el-input
              size="default"
              v-model="form.costgrpid"
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

    <div class="dialogPosform">
      <el-dialog
        title="部门职位设置"
        width="40%"
        v-model="dialogPosFormVisible"
      >
        <el-form
          :rules="rules"
          ref="refposform"
          :model="posform"
          class="margin:0 20px;display:flex;"
        >
          <el-form-item label="部门代码" :label-width="formLabelWidth">
            <el-input
              size="default"
              v-model="posform.deptid"
              autocomplete="off"
              :disabled="true"
            ></el-input>
          </el-form-item>

          <el-form-item label="职位" :label-width="formLabelWidth" prop="posid">
            <el-select
              size="default"
              v-model="posform.posid"
              placehhlder="请选择"
            >
              <el-option
                v-for="item in posdata"
                :label="item.name"
                :value="item.code"
                :key="item.code"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="编制人数"
            :label-width="formLabelWidth"
            prop="budget"
          >
            <el-input
              size="default"
              v-model="posform.budget"
              autocomplete="off"
              style="width: 100px; margin-right: 30px"
            ></el-input>
            <el-button type="primary" @click="addPos">增加职位</el-button>
          </el-form-item>
          <el-divider content-position="left"><b>该部门职位列表</b></el-divider>
        </el-form>
        <el-form-item>
          <el-table :data="deptposdata" stripe>
            <el-table-column
              type="index"
              :index="indexMethod"
            ></el-table-column>
            <el-table-column label="职位/name" prop="name"></el-table-column>
            <el-table-column
              label="编制数/budget"
              prop="budget"
            ></el-table-column>
            <el-table-column prop="id" label="操作">
              <template #default="scope"
                ><el-tooltip content="修改编制数">
                  <el-button size="small" @click="handleEdit_deptpos(scope.row)"
                    ><el-icon><Edit /></el-icon></el-button></el-tooltip
                ><el-tooltip content="取消挂接">
                  <el-button
                    type="danger"
                    size="small"
                    @click="handleDelete_deptpos(scope.row)"
                    ><el-icon><Delete /></el-icon></el-button
                ></el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogPosFormVisible = false">关 闭</el-button>
          </span>
        </template>
      </el-dialog>
    </div>

    <div class="dialogBudgetform">
      <el-dialog
        title="部门职位编制数设置"
        width="40%"
        v-model="dialogBudgetFormVisible"
      >
        <el-form
          :rules="rules"
          ref="refbudgetform"
          :model="budgetform"
          class="margin:0 20px;display:flex;"
        >
          <el-form-item
            label="编制人数"
            :label-width="formLabelWidth"
            prop="budget"
          >
            <el-input
              size="default"
              v-model="budgetform.budget"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogBudgetFormVisible = false"
              >取 消</el-button
            >
            <el-button type="primary" @click="saveBudgetForm">确 定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { AX } from "../utils/api";
import { v4 as uuidv4 } from "uuid";
import { ref } from "vue";
import { useUserStore, useDeptPosStore } from "../store/index";

export default {
  setup() {
    const userstore = useUserStore();
    const deptposstore = useDeptPosStore();
    return {
      userstore,
      deptposstore,
    };
  },
  data() {
    return {
      hrgradedata: [],
      postypedata: [],
      deptposdata: [],
      posdatafull: [],
      posdata: [],
      newposdata: [],
      openkey: [],
      formLabelWidth: 120,
      dialogFormVisible: false,
      dialogPosFormVisible: false,
      dialogBudgetFormVisible: false,
      data: [],
      defaultProps: {
        children: "children",
        label: "deptname",
      },
      form: {
        deptid: "",
        deptname: "",
        deptename: "",
        fid: "",
        deptadd1: "",
        deptadd2: "",
        costgrpid: "",
        remark: "",
        sort: 100,
      },
      posform: {
        id: "",
        deptid: "",
        posid: ref(""),
        budget: 1,
        name: "",
      },
      budgetform: {
        id: "",
        budget: 1,
        deptid: "",
      },
      rules: {
        // deptid: [
        //   {
        //     required: true,
        //     message: "请输入正确的代码，非0开头大于2位的数字。",
        //     trigger: "blur",
        //     min: 2,
        //     max: 32,
        //     pattern: /^[1-9]\d*$/,
        //   },
        // ],
        deptname: [
          {
            required: true,
            message: "请输入部门名称，大于2位",
            trigger: "blur",
            min: 2,
            max: 32,
          },
        ],

        sort: [
          {
            required: true,
            pattern: /^0|[1-9]\d*$/,

            message: "请输入数字，格式不正确",

            trigger: "blur",
          },
        ],
        posid: [
          {
            required: true,
            trigger: blur,
            message: "请选择需要增加的部门！",
          },
        ],
        budget: [
          {
            required: true,
            pattern: /^0|[1-9]\d*$/,

            message: "数字格式不正确",

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

    indexMethod(index) {
      return index + 1;
    },

    clearPosdata() {
      this.posdata = Array.from(this.posdatafull);
      this.deptposdata.forEach((item, idx, ary) => {
        this.posdata.forEach((itemp, idxp, aryp) => {
          if (ary[idx].posid == aryp[idxp].code) {
            this.posdata.splice(idxp, 1);
            Object.assign(this.posform, {});
            this.posform.posid.valueOf("");
          }
        });
      });
    },

    addPos() {
      this.$refs.refposform.validate((valid) => {
        if (valid) {
          // console.log(this.posform.posid, this.posform.budget);

          let r = true;
          this.deptposdata.map((item) => {
            if (item.posid == this.posform.posid) {
              r = false;
            }
          });

          if (!r) {
            this.$message.error("该部门已经存在该职位");
            return;
          }

          console.log(valid);

          AX("post", "deptpos", this.posform).then((res) => {
            console.log(res);

            this.refresh_deptpos(this.posform.deptid);
          });
        }
      });
    },

    refresh_deptpos(deptid) {
      AX("get", `deptpos/deptid/${deptid}`).then((res) => {
        this.deptposdata = res;
        this.clearPosdata();
      });
    },

    handleNew(data) {
      console.log(data);
      this.neworedit = true;
      this.dialogFormVisible = true;

      Object.keys(this.form).forEach((key) => {
        this.form[key] = "";
      });

      this.form.sort = 100;
      this.form.deptid = uuidv4();
      this.form.fid = data.deptid;
    },
    handlePosNew(data) {
      AX("get", "position?pagesize=999").then((res) => {
        this.posdatafull = res.data;
        this.posdata = res.data;

        Object.keys(this.posform).forEach((key) => {
          this.posform[key] = "";
        });

        this.posform.deptid = data.deptid;
        this.posform.budget = 1;

        AX("get", `deptpos/deptid/${data.deptid}`).then((res) => {
          this.deptposdata = res;
          this.clearPosdata();
          this.dialogPosFormVisible = true;
        });
      });
      this.posform.deptid = data.deptid;
      this.posform.budget = 1;
    },

    handleEdit(data) {
      this.neworedit = false;
      this.dialogFormVisible = true;
      this.form = Object.assign({}, data);
      this.openkey.push(data.id);
    },

    handleEdit_deptpos(data) {
      console.log(data);

      this.budgetform.id = data.id;
      this.budgetform.budget = data.budget;
      this.budgetform.deptid = this.posform.deptid;
      this.dialogBudgetFormVisible = true;
    },

    handleDelete_deptpos(row) {
      this.$confirm("此操作将删除该职位, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          AX("DELETE", "deptpos/" + row.id).then((res) => {
            if (res) {
              this.refresh_deptpos(this.posform.deptid);
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

    handleDelete(idx, row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          AX("DELETE", "dept/" + row.id, { deptid: row.deptid }).then((res) => {
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
      //   this.openkey.push(this.form.id);

      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.neworedit) {
            //树形必须删除children节点，否则更新不了。
            delete this.form.children;
            AX("patch", "dept/" + this.form.id, this.form).then((res) => {
              if (res) {
                this.dialogFormVisible = false;
                this.listMain();
              }
            });
          } else {
            AX("post", "dept", this.form).then((res) => {
              console.log(res);
              if (res && res.code == 200) {
                this.dialogFormVisible = false;
                this.listMain();
              }
            });
          }
        }
      });
    },

    saveBudgetForm() {
      //   this.openkey.push(this.form.id);

      this.$refs.refbudgetform.validate((valid) => {
        if (valid) {
          AX("patch", "deptpos/" + this.budgetform.id, this.budgetform).then(
            (res) => {
              if (res) {
                this.dialogBudgetFormVisible = false;
                this.refresh_deptpos(this.posform.deptid);
              }
            }
          );
        }
      });
    },

    savePosForm() {},

    fun() {
      if (this.data.is_position == 1) return "el-icon-search";
      else return "el-icon-delete";
    },

    getDic() {
      AX("get", "dic/postype2")
        .then((res) => {
          if (res && res.data.length > 0) {
            this.postypedata = res.data;
          }
        })
        .catch((e) => console.log(e.message));

      AX("get", "dic/hrgrade")
        .then((res) => {
          if (res && res.data.length > 0) {
            this.hrgradedata = res.data;
          }
        })
        .catch((e) => console.log(e.message));
    },
    listMain() {
      this.data = this.deptposstore.deptposData.data;
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
  color: #fdfdfd;
  padding: 1px 5px;
  margin-left: 7px;
  font-weight: bold;
  font-size: 14px;
  background-color: rgb(104, 167, 245);
  border: 1px solid rgb(217, 231, 248);
}
.pdmsg {
  margin-left: 1px;
  background-color: none;
  color: rgb(192, 192, 192);
  font-weight: bold;
  font-size: 12px;
}
.pdmsgpos {
  margin-left: 1px;
  background-color: none;
  color: rgb(192, 192, 192);
  font-weight: bold;
  font-size: 12px;
}
.pdmsgcom {
  margin-left: 1px;
  background-color: none;
  color: rgb(192, 192, 192);
  font-weight: bold;
  font-size: 12px;
}
</style>
