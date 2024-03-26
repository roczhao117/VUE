<template>
  <el-container direction="vertical">
    <div style="display: flex; margin: 1px; margin-right: 20px">
      <el-button type="primary" @click="handleAdd()"
        ><el-icon><Plus /></el-icon
      ></el-button>
      <el-input
        placeholder="查询内容"
        v-model="inputsearch"
        class="input-with-select"
      >
        <template #append>
          <el-button @click="listMain()"
            ><el-icon><Search /></el-icon
          ></el-button>
        </template>
      </el-input>
    </div>
    <div>
      <el-table :data="tableData" stripe>
        <el-table-column
          prop="id"
          fixed
          width="40"
          type="selection"
        ></el-table-column>

        <el-table-column prop="grp" fixed label="组" width="60">
        </el-table-column>

        <el-table-column prop="code" fixed label="代码" width="120">
          <template #default="scope">
            <el-tag>{{ scope.row.code.substring(0, 7) }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column
          prop="name"
          fixed
          label="参数名称"
          width="200"
        ></el-table-column>

        <el-table-column
          prop="ename"
          fixed
          label="描述"
          width="200"
        ></el-table-column>

        <el-table-column
          prop="postype2"
          fixed
          label="类型"
          width="100"
        ></el-table-column>

        <el-table-column
          prop="grade"
          fixed
          label="级别"
          width="100"
        ></el-table-column>

        <el-table-column
          prop="isactive"
          :formatter="formatisstop"
          fixed
          width="80"
          show-overflow-tooltip
          label="激活"
        >
          <template #default="scope">
            <el-tag v-if="scope.row.isactive == 0" type="danger">否</el-tag>

            <el-tag v-else type="success">是</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="id" label="操作">
          <template #default="scope">
            <el-button size="default" @click="handleEdit(scope.row)"
              ><el-icon><Edit /></el-icon
            ></el-button>
            <el-button size="default" @click="handleViewSub(scope.row.itemid)"
              ><el-icon><Files /></el-icon
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div style="margin-top: 17px">
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="page.limit"
        @current-change="changePage"
        :current-page="cp1"
        :total="counts"
      ></el-pagination>
    </div>
    <div class="dialogform">
      <el-dialog title="职位设置" width="40%" v-model="dialogFormVisible">
        <el-form
          :rules="rules"
          :model="form"
          ref="refform"
          class="margin:0 20px;display:flex;"
        >
          <el-form-item label="代码" :label-width="formLabelWidth" prop="code">
            <el-input
              size="default"
              v-model="form.code"
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
              v-model="form.ename"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item label="所属组" :label-width="formLabelWidth" prop="grp">
            <el-select
              size="default"
              v-model="form.grp"
              placehhlder="请选择"
              :disabled="true"
            >
              <el-option
                v-for="item in roleData"
                :label="item.itemname"
                :value="item.itemid"
                :key="item.itemid"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="职位级别"
            :label-width="formLabelWidth"
            prop="grade"
          >
            <el-select size="default" v-model="form.grade" placehhlder="请选择">
              <el-option
                v-for="item in hrgradedata"
                :label="item.itemname"
                :value="item.itemid"
                :key="item.itemid"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="职位所属类型"
            :label-width="formLabelWidth"
            prop="postype2"
          >
            <el-select
              size="default"
              v-model="form.postype2"
              placehhlder="请选择"
            >
              <el-option
                v-for="item in postype2data"
                :label="item.itemname"
                :value="item.itemid"
                :key="item.itemid"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="激活" :label-width="formLabelWidth">
            <el-radio-group v-model="form.isactive">
              <el-radio :label="1">激活</el-radio>
              <el-radio :label="0">不</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="排序" :label-width="formLabelWidth">
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
    <div class="dialogformdic">
      <el-dialog
        title="参数明细设置"
        width="40%"
        v-model="dialogFormDicVisible"
      >
        <el-form
          :rules="rules"
          :model="formdic"
          ref="refformdic"
          class="margin:0 20px;display:flex;"
        >
          <el-form-item
            label="代码"
            :label-width="formLabelWidth"
            prop="itemid"
          >
            <el-input
              size="default"
              v-model="formdic.itemid"
              autocomplete="off"
              :disabled="!neworedit"
            ></el-input>
          </el-form-item>

          <el-form-item
            label="名称"
            :label-width="formLabelWidth"
            prop="itemname"
          >
            <el-input
              size="default"
              v-model="formdic.itemname"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item label="描述" :label-width="formLabelWidth">
            <el-input
              size="default"
              v-model="formdic.itemename"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item label="所属组" :label-width="formLabelWidth">
            <el-input
              size="default"
              v-model="formdic.dicmid"
              autocomplete="off"
              :disabled="true"
            ></el-input>
          </el-form-item>

          <el-form-item label="激活？" :label-width="formLabelWidth">
            <el-radio-group v-model="formdic.isactive">
              <el-radio :label="1">激活</el-radio>
              <el-radio :label="0">取消</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item
            label="月度数"
            :label-width="formLabelWidth"
            prop="itemmonths"
          >
            <el-input
              size="default"
              v-model="formdic.itemmonths"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item
            label="费用"
            :label-width="formLabelWidth"
            prop="itemfees"
          >
            <el-input
              size="default"
              v-model="formdic.itemfees"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item label="公式/比率" :label-width="formLabelWidth">
            <el-input
              size="default"
              v-model="formdic.itemrate"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item label="排序" :label-width="formLabelWidth">
            <el-input
              size="default"
              v-model="formdic.itemorder"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item label="备注" :label-width="formLabelWidth">
            <el-input
              size="default"
              v-model="formdic.remark"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogFormDicVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveSubForm">确 定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
    <div class="dialogformViewSub">
      <el-dialog
        title="参数明细"
        width="800px"
        v-model="dialogFormViewSubVisible"
      >
        <div style="text-align: right">
          <el-button type="primary" @click="handleAddSub()"
            ><el-icon><Plus /></el-icon
          ></el-button>
        </div>

        <div>
          <el-table :data="tableData2" stripe>
            <el-table-column
              prop="id"
              fixed
              width="40"
              type="selection"
            ></el-table-column>

            <el-table-column prop="itemid" fixed label="代码" width="80"
              ><template #default="scope">
                <i>{{ scope.row.itemid.substring(0, 5) }}</i>
              </template></el-table-column
            >

            <el-table-column
              prop="itemname"
              fixed
              label="参数名称"
              width="100"
            ></el-table-column>

            <el-table-column
              prop="itemename"
              fixed
              label="描述"
              width="100"
            ></el-table-column>

            <el-table-column
              prop="itemmonths"
              fixed
              label="月度数"
              width="80"
            ></el-table-column>

            <el-table-column
              prop="itemfees"
              fixed
              label="费用"
              width="80"
            ></el-table-column>

            <el-table-column
              prop="itemorder"
              fixed
              label="排列"
              width="80"
            ></el-table-column>

            <el-table-column
              prop="isactive"
              :formatter="formatisstop"
              fixed
              width="60"
              show-overflow-tooltip
              label="激活"
            >
              <template #default="scope">
                <el-tag v-if="scope.row.isactive == 0" type="danger">否</el-tag>

                <el-tag v-else type="success">是</el-tag>
              </template>
            </el-table-column>

            <el-table-column label="操作">
              <template #default="scope">
                <el-button size="default" @click="handleEditSub(scope.row)"
                  ><el-icon><Edit /></el-icon
                ></el-button>

                <el-button
                  size="default"
                  type="danger"
                  @click="handleDelSub(scope.row)"
                  ><el-icon><Delete /></el-icon
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="margin-top: 17px">
          <el-pagination
            background
            layout="prev, pager, next"
            :page-size="page.limit"
            @current-change="changePageSub"
            :current-page="cp2"
            :total="counts2"
          ></el-pagination>
        </div>
      </el-dialog>
    </div>
  </el-container>
</template>
<script>
import { AX } from "../utils/api";
import { ref } from "vue";
import { v4 as uuidv4 } from "uuid";
// import {
//   Check,
//   Delete,
//   Edit,
//   Message,
//   Search,
//   Star,
// } from '@element-plus/icons-vue'

export default {
  data() {
    return {
      tableData: [],
      roleData: [],
      tableData2: [],
      data: [],
      defaultProps: {
        children: "children",
        label: "itemname",
        is_node: this.dicmid == "00" ? true : false,
      },
      openkey: [],
      inputsearch: "",
      counts: 1,
      counts2: 1,
      cp1: 1,
      cp2: 1,

      hrgradedata: [],

      postype2data: [],

      cmppwd: "",
      DICMID: ref(""),
      dialogFormVisible: false,
      dialogFormDicVisible: false,
      dialogFormViewSubVisible: false,
      neworedit: true,
      formLabelWidth: ref("120px"),
      page: {
        limit: 15,
        cpg: 1,
        cpg2: 1,
      },
      form: {
        id: "",
        code: ref(""),
        name: "",
        ename: "",
        grade: "",
        remark: "",
        addcode1: "1001",
        addcode2: "0",
        posttype2: "0",
        isactive: 1,
        type: "",
        grp: "",
        sort: 100,
      },
      formdic: {
        id: "",
        itemid: ref(""),
        itemname: "",
        itemename: "",
        itemrate: "",
        dicmid: "",
        itemtype: "",
        remark: "",
        itemorder: "1001",
        itemmonths: "0",
        itemfees: "0",
        isactive: "0",
      },
      rules: {
        code: [
          {
            required: true,
            message: "数字,字母或中下划线",
            trigger: "blur",
            pattern: /^[\w_-]{1,49}$/,
          },
        ],
        itemmonths: [
          {
            required: true,
            pattern:
              /^(-|\+)?([0-8]?\d{1}\.\d{0,7}|90\.0{0,6}|[0-8]?\d{1}|90)$/,
            message: "整数部分为0-90,小数部分为0到7位",
            trigger: "blur",
          },
        ],
        itemfees: [
          {
            required: true,
            pattern:
              /^(-|\+)?([0-8]?\d{1}\.\d{0,7}|90\.0{0,6}|[0-8]?\d{1}|90)$/,
            message: "整数部分为0-90,小数部分为0到7位",
            trigger: "blur",
          },
        ],
        name: [
          {
            required: true,
            message: "请填写名称",
            trigger: "blur",
            min: 1,
            max: 36,
          },
        ],
        grade: [
          {
            required: true,
            message: "请选择",
            trigger: "blur",
            min: 1,
            max: 50,
          },
        ],
        postype2: [
          {
            required: true,
            message: "请选择",
            trigger: "blur",
            min: 1,
            max: 50,
          },
        ],
      },
    };
  },
  methods: {
    nodeClick(node) {
      this.openkey.push(node.id);
    },
    nodeCollapse(node) {
      this.openkey.remove(node.id);
    },
    handleDelete(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          AX("DELETE", "dic/" + row.id).then((res) => {
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
    handleDelSub(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          AX("DELETE", `dic/${row.id}`).then((res) => {
            if (res.code == 200) {
              this.handleViewSub(this.DICMID);
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
      // console.log(this.form);
      this.$refs.refform.validate((valid) => {
        if (valid) {
          if (!this.neworedit) {
            AX("patch", "position/" + this.form.id, this.form).then((res) => {
              if (res) {
                this.dialogFormVisible = false;
                this.listMain();
              }
            });
          } else {
            AX("post", "position", this.form).then((res) => {
              if (res) {
                this.dialogFormVisible = false;
                this.listMain();
              }
            });
          }
        }
      });
    },
    saveSubForm() {
      console.log(this.formdic);
      this.$refs.refformdic.validate((valid) => {
        if (valid) {
          if (!this.neworedit) {
            AX("patch", "dic/" + this.formdic.id, this.formdic).then((res) => {
              if (res) {
                this.dialogFormDicVisible = false;
                this.handleViewSub(this.DICMID);
              }
            });
          } else {
            AX("post", "dic", this.formdic).then((res) => {
              if (res) {
                this.dialogFormDicVisible = false;
                this.handleViewSub(this.DICMID);
              }
            });
          }
        }
      });
    },
    formatisstop(row) {
      return row.isactive == 0 ? "" : "lock";
    },
    handleViewSub(dicmid) {
      this.dialogFormViewSubVisible = true;
      this.DICMID = dicmid;
      AX(
        "get",
        `dic/dicmid/${dicmid}?page=${this.page.cpg2}&pagesize=${this.page.limit}`
      ).then((res) => {
        this.tableData2 = res.data;
        this.counts2 = res.total;
      });
    },
    handleAdd() {
      this.neworedit = true;
      this.dialogFormVisible = true;
      this.getdic();
      Object.keys(this.form).forEach((key) => {
        this.form[key] = "";
      });
      this.form.sort = 101;

      this.form.isactive = 1;

      this.form.grp = "g10";

      this.form.code = uuidv4();
    },
    handleEditSub(data) {
      this.neworedit = false;
      this.dialogFormDicVisible = true;
      // this.formdic = Object.assign({}, data);
      // console.log(this.formdic);
      //  this.getdic();
      Object.keys(this.formdic).forEach((key) => {
        this.formdic[key] = "";
        this.formdic[key] = data[key];
      });
    },
    handleEdit(data) {
      if (data.dicmid == "00") {
        return;
      }
      this.neworedit = false;
      this.dialogFormVisible = true;
      Object.keys(this.form).forEach((key) => {
        this.form[key] = data[key];
      });
      this.openkey.push(data.id);
    },
    changePage(idx) {
      console.log(idx);
      this.cp1 = idx;
      this.page.cpg = idx;
      this.listMain();
    },
    changePageSub(idx) {
      console.log(idx);
      this.page.cpg2 = idx;
      //   this.handleViewSub(this.form.itemid);
      console.log(this.form.itemid);
      AX(
        "get",
        `dic/dicmid/${this.DICMID}?page=${this.page.cpg2}&pagesize=${this.page.limit}`
      ).then((res) => {
        console.log(res);
        this.tableData2 = res.data;
        this.counts2 = res.total;
      });
    },
    getdic() {
      AX("get", "dic/dicmid/hrgrade?page=1&pagesize=9999")
        .then((res) => {
          this.hrgradedata = res.data;
        })
        .catch((e) => console.log(e.message));

      AX("get", "dic/dicmid/postype2?page=1&pagesize=9999")
        .then((res) => {
          this.postype2data = res.data;
        })
        .catch((e) => console.log(e.message));
    },
    listMain() {
      this.getdic();
      AX(
        "get",
        `position?value=${this.inputsearch}&page=${this.page.cpg}&pagesize=${this.page.limit}`
      ).then((res) => {
        this.tableData = res.data;
        this.counts = res.total;
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
  font-size: 16px;
  padding-right: 8px;
  margin: 15px;
}
.el-tree .el-button {
  margin-right: 5px;
  min-height: 25px;
  padding: 3px;
}
.input-with-select {
  width: 360px;
  margin-left: 10px;
}
.dialogform {
  display: flex;
  margin: 0 0;
}
.el-form-item {
  margin-bottom: 18px;
}
.el-form-item__content {
  display: flex;
}
</style>
