<template>
  <div>
    <el-tree
      :data="data"
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
          <span :class="{ iscom: data.level == '1' }">
            {{ node.label }}
            <span class="pdmsgroot" v-if="data.level == '0'">培训课程设置</span>
            <span class="pdmsgcom" v-else-if="data.level == '1'"
              ><el-icon style="font-size: 14px; color: azure"
                ><Folder /></el-icon
            ></span>
            <span class="pdmsgpos" v-else-if="data.level == '2'">课程</span>
            <span class="pdmsg" v-else-if="data.level == '3'">指标</span>
          </span>
          <span>
            <el-tooltip
              content="修改"
              placement="bottom"
              v-if="data.level != 0"
            >
              <el-button size="small" @click.stop="handleEdit(data)"
                ><el-icon><Edit /></el-icon></el-button
            ></el-tooltip>
            <el-tooltip content="增加" v-if="data.level in ['0', '1']"
              ><el-button size="small" @click.stop="handleNew(data)"
                ><el-icon><Plus /></el-icon></el-button
            ></el-tooltip>

            <el-button
              type="danger"
              size="small"
              v-if="data.level == 3"
              @click="handleDelete(node, data)"
              ><el-icon><Delete /></el-icon
            ></el-button>
          </span>
        </span>
      </template>
    </el-tree>

    <div class="dialogform">
      <el-dialog
        :title="level == 1 ? '组设置' : '课程设置'"
        width="60%"
        v-model="dialogFormVisible"
      >
        <el-form
          :rules="rules"
          :model="form"
          ref="form"
          class="margin:0 20px;display:flex;"
          size="small"
        >
          <el-row :gutter="24"
            ><el-col :span="12">
              <el-form-item
                label="代码"
                :label-width="formLabelWidth"
                prop="itemid"
              >
                <el-input
                  size="small"
                  v-model="form.itemid"
                  autocomplete="off"
                  :disabled="true"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="名称"
                :label-width="formLabelWidth"
                prop="itemname"
              >
                <el-input
                  size="small"
                  v-model="form.itemname"
                  autocomplete="off"
                ></el-input> </el-form-item
            ></el-col>
            <el-col :span="12">
              <el-form-item
                label="参考费用"
                :label-width="formLabelWidth"
                v-if="level == 2"
              >
                <el-input
                  size="small"
                  v-model="form.itemfees"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="参考时长(H)"
                :label-width="formLabelWidth"
                v-if="level == 2"
              >
                <el-input
                  size="small"
                  v-model="form.nums"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="助教老师"
                :label-width="formLabelWidth"
                v-if="level == 2"
              >
                <el-input
                  size="small"
                  v-model="form.result"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="父级"
                :label-width="formLabelWidth"
                v-show="false"
              >
                <el-input
                  size="small"
                  v-model="form.fid"
                  autocomplete="off"
                  :disabled="true"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item
            label="课程属性"
            :label-width="formLabelWidth"
            v-if="level == 2"
          >
            <el-checkbox-group
              v-model="form.code1"
              style="display: flex; flex-wrap: wrap"
            >
              <el-checkbox
                v-for="item in dictrprops"
                :key="item.itemid"
                :value="item.itemid"
                :label="item.itemid"
                style="width: 120px"
                >{{ item.itemname }}</el-checkbox
              >
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="排序" :label-width="formLabelWidth" prop="sort">
            <el-input
              size="small"
              v-model="form.sort"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item label="备注" :label-width="formLabelWidth">
            <el-input
              size="small"
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
              size="small"
              v-model="posform.deptid"
              autocomplete="off"
              :disabled="true"
            ></el-input>
          </el-form-item>

          <el-form-item label="职位" :label-width="formLabelWidth" prop="posid">
            <el-select
              size="small"
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
              size="small"
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
              size="small"
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
import { useUserStore, useDeptPosStore, useDicStore } from "../store/index";

export default {
  setup() {
    const userstore = useUserStore();
    const deptposstore = useDeptPosStore();
    const dicstore = useDicStore();
    return {
      userstore,
      deptposstore,
      dicstore,
    };
  },
  data() {
    return {
      tritems: [],
      level: 0,
      dictrprops: [],
      hrgradedata: [],
      postypedata: [],
      deptposdata: [],
      posdatafull: [],
      posdata: [],
      newposdata: [],
      openkey: [],
      formLabelWidth: 80,
      dialogFormVisible: false,
      dialogPosFormVisible: false,
      dialogBudgetFormVisible: false,
      data: [],
      defaultProps: {
        children: "children",
        label: "itemname",
      },
      form: {
        id: "",
        itemid: "",
        itemname: "",
        itemename: "",
        dicmid: "",
        fid: "",
        itemfees: 0,
        remark: "",
        sort: 100,
        nums: 1.0,
        code1: [],
        isactive: 1,
        result: "",
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
        itemname: [
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
    /**
     * 这里是增加
     * @param {} data
     */
    handleNew(data) {
      //增加的时候，代表增加下一级的，所以是本级别加1.level+1；
      this.level = data.level + 1;
      this.neworedit = true;
      this.dialogFormVisible = true;
      Object.keys(this.form).forEach((key) => {
        this.form[key] = "";
      });
      this.form.id = "";
      this.form.sort = 100;
      this.form.itemid = uuidv4();
      this.form.itemfees = 0;
      this.form.nums = 1.0;
      this.form.code1 = [];
      this.form.isactive = 1;
      //fid 这个东西如果是组的话，他和dicmid是一致的，因为他来自于上面
      //这里不应该去判断，而是根节点放上去。
      this.form.fid = data.itemid;
      //这里这个是固定的，代表里组。这里的组就是TRITEMS
      this.form.dicmid = "tritems";
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
      //这里LEVEL是表示树形里的登记，0：根 1：组 2：项目
      //0的新建是组，1的新建是项目。项目有细则，而组没有，所以这里必须更新为1
      this.level = data.level;
      // Object.keys(data).forEach((key) => {
      //   console.log(key);
      //   if (Object.keys(this.form).includes(key) == false) {
      //     delete data[key];
      //   }
      // });
      this.form = Object.assign({}, data);
      if (this.form.code1) {
        this.form.code1 = data["code1"].split(",");
      } else {
        this.form.code1 = [];
      }
      // console.log("ddddddd", data);
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
      // console.log("dddddddddddddddddddd", this.form);
      console.log(this.level);
      // if (true) {
      //   return;
      // }
      /**
       * level 0:根 1：组 2：项目 3：指标
       */
      const regex = new RegExp(/^(0|([1-9][0-9]*))(\.[\d]{1,4})?$/, "im");
      if (this.level == 2) {
        if (!regex.test(this.form.nums) || !regex.test(this.form.itemfees)) {
          this.$message.error("时长和费用必须为非负数！");
          return;
        }
      }
      console.log("this.form.code1.length:", this.form.code1.length);
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.form.itemrate = 0;
          // this.form.code1 = [];
          if (this.level == 2 && this.form.code1.length < 1) {
            this.$message.error("请选择课程属性！");
            return;
          }
          if (this.form.code1 && this.form.code1.length > 0) {
            this.form.code1 = this.form.code1.join(",");
          }
          if (!this.neworedit) {
            //树形必须删除children节点，否则更新不了。
            delete this.form.children;
            AX("patch", "dic/" + this.form.id, this.form).then((res) => {
              if (res) {
                this.dialogFormVisible = false;
                this.dicstore.refreshDB("tritems").then(() => {
                  this.listMain();
                });
              }
            });
          } else {
            AX("post", "dic", this.form).then((res) => {
              console.log(res);
              if (res && res.code == 200) {
                this.dialogFormVisible = false;
                this.dicstore.refreshDB("tritems").then(() => {
                  this.listMain();
                });
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
      this.tritems = this.dicstore.getDicTree("tritems", "培训课程设置");
      this.dictrprops = this.dicstore.getDic("tritemprot");
    },
    listMain() {
      // this.data = this.deptposstore.deptposData.data;
      this.data = this.dicstore.getDicTree("tritems").data;
      console.log("ddddddddddddddddddddddddddddddd", this.data);
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
  font-size: 10px;
}
.iscom {
  color: #fdfdfd;
  padding: 1px 5px;
  margin-left: 7px;
  font-weight: bold;
  font-size: 12px;
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
