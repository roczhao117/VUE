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
          <span
            :class="{ iscom: data.level in ['0', '1'] }"
            style="font-size: 12px"
          >
            {{ node.label }}
            <span class="pdmsgroot" v-if="data.level == '0'">绩效指标设置</span>
            <span class="pdmsgcom" v-else-if="data.level == '1'">组</span>
            <span class="pdmsgpos" v-else-if="data.level == '2'"
              >指标 【 权重:{{ data.whtval }} 目标值:{{ data.value }}】</span
            >
            <span class="pdmsg" v-else-if="data.level == '3'"
              >评分标准 【 评分:{{ data.value }} 参考值从:{{
                data.fromval
              }}
              参考值到:{{ data.toval }}】</span
            >
          </span>
          <span>
            <el-tooltip content="增加" v-if="data.level in [0, 1, 2]"
              ><el-button size="small" @click.stop="handleNew(data)"
                ><el-icon><Plus /></el-icon></el-button
            ></el-tooltip>

            <el-button
              type="danger"
              size="small"
              v-if="data.level == 4"
              @click.stop="handleDelete(node, data)"
              ><el-icon><Delete /></el-icon
            ></el-button>
            <el-tooltip content="修改" placement="bottom" v-if="data.level != 0"
              ><el-button size="small" @click.stop="handleEdit(data)"
                ><el-icon><Edit /></el-icon></el-button
            ></el-tooltip>
          </span>
        </span>
      </template>
    </el-tree>

    <div class="dialogform">
      <el-dialog
        :title="level == 1 ? '组设置' : '项目/指标设置'"
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
            ><el-col :span="8">
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
                  style="font-size: 9px"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
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
            <el-col :span="8">
              <el-form-item
                label="通用名称"
                :label-width="formLabelWidth"
                prop="itemename"
              >
                <el-input
                  size="small"
                  v-model="form.itemename"
                  autocomplete="off"
                ></el-input> </el-form-item></el-col
          ></el-row>
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item
                label="权重"
                :label-width="formLabelWidth"
                v-if="level == 2"
                prop="whtval"
              >
                <el-input
                  size="small"
                  v-model="form.whtval"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="目标值"
                :label-width="formLabelWidth"
                v-if="level == 2"
                prop="value"
              >
                <el-input
                  size="small"
                  v-model="form.value"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="排序"
                :label-width="formLabelWidth"
                prop="sort"
                v-if="level == 2"
              >
                <el-input
                  size="small"
                  v-model="form.sort"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item
                label="分数"
                :label-width="formLabelWidth"
                v-if="level == 3"
                prop="value"
                @change="valueChange3"
              >
                <el-input
                  size="small"
                  v-model="form.value"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="参考分数从"
                :label-width="formLabelWidth"
                v-if="level == 3"
                prop="fromval"
              >
                <el-input
                  size="small"
                  v-model="form.fromval"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="参考分数到"
                :label-width="formLabelWidth"
                v-if="level == 3"
                prop="toval"
              >
                <el-input
                  size="small"
                  v-model="form.toval"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="排序"
                :label-width="formLabelWidth"
                prop="sort"
                v-if="level == 3"
              >
                <el-input
                  size="small"
                  v-model="form.sort"
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
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="备注" :label-width="formLabelWidth">
                <el-input
                  size="small"
                  v-model="form.remark"
                  autocomplete="off"
                ></el-input> </el-form-item
            ></el-col>
          </el-row>
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
      evaitem: [],
      level: 0,
      dictrprops: [],
      hrgradedata: [],
      postypedata: [],
      deptposdata: [],
      posdatafull: [],
      posdata: [],
      newposdata: [],
      openkey: [],
      formLabelWidth: 90,
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

        isactive: 1,
        result: "",
        value: 1,
        whtval: 1,
        fromval: 0,
        toval: 1,
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
        fromval: [
          {
            required: true,
            message: "请输入数字参考值",
            trigger: "blur",
            pattern: /^(0(.)?\d*|[1-9]\d*(.)?\d*)$/,
          },
        ],
        toval: [
          {
            required: true,
            message: "请输入数字参考值",
            trigger: "blur",
            pattern: /^(0(.)?\d*|[1-9]\d*(.)?\d*)$/,
          },
        ],
        value: [
          {
            required: true,
            message: "请输入数字值",
            trigger: "blur",
            pattern: /^(0(.)?\d*|[1-9]\d*(.)?\d*)$/,
          },
        ],
        whtval: [
          {
            required: true,
            message: "请输入权重，最大1，最小0",
            trigger: "blur",
            pattern: /^(0(.)?\d*|1(.)?0*)$/,
          },
        ],
        itemname: [
          {
            required: true,
            message: "请输入名称，大于2位",
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

      //这里可以用UUIDV4，进到系统中，大于10位的情况下，会自动更改为自增的数字
      this.form.itemid = uuidv4();
      //==============================

      this.form.itemfees = 0;
      this.form.nums = 1.0;
      this.form.isactive = 1;
      this.form.value = 60;
      this.form.whtval = 0.5;
      this.form.fromval = 0;
      this.form.toval = 1;

      //fid 这个东西如果是组的话，他和dicmid是一致的，因为他来自于上面
      //这里不应该去判断，而是根节点放上去。
      this.form.fid = data.itemid;
      //这里这个是固定的，代表里组。这里的组就是evaitem
      this.form.dicmid = "evaitem";
    },

    handleEdit(data) {
      this.neworedit = false;
      this.dialogFormVisible = true;
      //这里LEVEL是表示树形里的登记，0：根 1：组 2：项目 3:评分
      //0的新建是组，1的新建是项目。项目有细则，而组没有，所以这里必须更新为1
      this.level = data.level;

      this.form = Object.assign({}, data);
    },
    handleEdit_deptpos(data) {
      console.log(data);
      this.budgetform.id = data.id;
      this.budgetform.budget = data.budget;
      this.budgetform.deptid = this.posform.deptid;
      this.dialogBudgetFormVisible = true;
    },

    handleDelete(idx, row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          AX("DELETE", "dic/" + row.id, { deptid: row.deptid }).then((res) => {
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

      /**
       * level 0:根 1：组 2：项目 3：指标
       */

      this.$refs.form.validate((valid) => {
        if (valid) {
          this.form.itemrate = 0;

          if (!this.neworedit) {
            //树形必须删除children节点，否则更新不了。
            delete this.form.children;
            AX("patch", "dic/" + this.form.id, this.form).then((res) => {
              if (res) {
                this.dialogFormVisible = false;
                this.dicstore.refreshDB("evaitem").then(() => {
                  this.listMain();
                });
              }
            });
          } else {
            AX("post", "dic", this.form).then((res) => {
              console.log(res);
              if (res && res.code == 200) {
                this.dialogFormVisible = false;
                this.dicstore.refreshDB("evaitem").then(() => {
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
    valueChange3() {
      this.form.fromval = this.form.value;
      this.form.toval = Number(this.form.value) + 0.3;
    },
    fun() {
      if (this.data.is_position == 1) return "el-icon-search";
      else return "el-icon-delete";
    },
    getDic() {
      // this.evaitem = this.dicstore.getDicTree("evaitem", "绩效指标设置");
      // this.dictrprops = this.dicstore.getDic("evaitemprot");
    },
    listMain() {
      this.data = this.dicstore.getDicTree("evaitem", "绩效指标").data;
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
  background-color: rgba(65, 150, 255, 0.699);
  border: 1px solid rgb(234, 241, 250);
  border-radius: 5px;
}
.pdmsg {
  margin-left: 1px;
  background-color: none;
  color: rgb(199, 199, 199);
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
  color: rgb(224, 224, 224);
  font-weight: bold;
  font-size: 12px;
}
</style>
