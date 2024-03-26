<template>
  <el-container direction="vertical">
    <div style="display: flex; margin: 1px; margin-right: 20px">
      <el-button type="primary" @click="listMain()"
        ><el-icon><Refresh /></el-icon
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

        <el-table-column
          prop="itemid"
          fixed
          label="代码"
          width="120"
        ></el-table-column>

        <el-table-column
          prop="itemname"
          fixed
          label="参数名称"
          width="140"
        ></el-table-column>

        <el-table-column
          prop="isactive"
          :formatter="formatisstop"
          fixed
          width="80"
          show-overflow-tooltip
          label="锁定"
        >
          <template #default="scope">
            <el-tag v-if="scope.row.isactive == 0" type="danger">锁</el-tag>

            <el-tag v-else type="success">未</el-tag>
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
      <el-dialog title="参数设置" width="40%" v-model="dialogFormVisible">
        <el-form
          :rules="rules"
          :model="form"
          ref="refform"
          class="margin:0 20px;display:flex;"
        >
          <el-form-item label="代码" :label-width="formLabelWidth" prop="code">
            <el-input
              size="default"
              v-model="form.itemid"
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
              v-model="form.itemname"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item label="描述" :label-width="formLabelWidth">
            <el-input
              size="default"
              v-model="form.itemename"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item
            label="所属类型"
            :label-width="formLabelWidth"
            prop="dicmid"
          >
            <el-select
              size="default"
              v-model="form.dicmid"
              placehhlder="请选择"
              :disabled="true"
            >
              <el-option
                v-for="item in roleData"
                :label="item.itemname"
                :value="item.code"
                :key="item.code"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="激活" :label-width="formLabelWidth">
            <el-radio-group v-model="form.isactive">
              <el-radio :label="1">激活</el-radio>
              <el-radio :label="0">未</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="编辑" :label-width="formLabelWidth">
            <el-radio-group v-model="form.itemsys">
              <el-radio :label="0">编辑</el-radio>
              <el-radio :label="1">只读</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="其他公式" :label-width="formLabelWidth">
            <el-input
              size="default"
              v-model="form.sqlstr"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item label="排序" :label-width="formLabelWidth">
            <el-input
              size="default"
              v-model="form.itemorder"
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
      cmppwd: "",
      DICMID: ref(""),
      dialogFormVisible: false,
      dialogFormDicVisible: false,
      dialogFormViewSubVisible: false,
      neworedit: true,
      formLabelWidth: ref("80px"),
      page: {
        limit: 15,
        cpg: 1,
        cpg2: 1,
      },
      form: {
        id: "",
        itemid: ref(""),
        itemname: "",
        itemename: "",
        dicmid: "",
        remark: "",
        itemorder: "1001",
        itemmonths: "0",
        itemfees: "0",
        isactive: "0",
        itemsys: "0",
        sqlstr: "",
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
        itemid: [
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
        itemname: [
          {
            required: true,
            message: "请填写名称",
            trigger: "blur",
            min: 1,
            max: 36,
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
            AX("patch", "dicm/" + this.form.id, this.form).then((res) => {
              if (res) {
                this.dialogFormVisible = false;
                this.listMain();
              }
            });
          } else {
            AX("post", "dicm", this.form).then((res) => {
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
    handleAddSub() {
      this.neworedit = true;
      this.dialogFormDicVisible = true;
      //  this.getdic();
      Object.keys(this.formdic).forEach((key) => {
        this.formdic[key] = "";
      });
      this.formdic.itemorder = "1001";
      this.formdic.dicmid = this.DICMID;
      this.formdic.isactive = 1;
      this.formdic.itemmonths = 0;
      this.formdic.itemfees = 0.0;
      this.formdic.itemid = uuidv4();
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
      // Object.keys(this.roleData).forEach(key => {
      //     console.log(key, this.roleData[key].itemid, row.usrgrpid)
      //     if (this.roleData[key].itemid == row.usrgrpid) {
      //         this.form.usrgrptxt = this.roleData[key].itemname;
      //         return;
      //     }
      // })
      // //   roleData.itemid=row.usergrpid
      //this.form.usrgrptxt =
      //   console.log(this.form, row)
    },
    changePage(idx) {
      console.log(idx);

      this.page.cpg = idx;
      this.cp1 = idx;
      this.listMain();
    },
    changePageSub(idx) {
      console.log(idx);
      this.page.cpg2 = idx;
      this.cp2 = idx;
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
      AX("get", "/dicm/00")
        .then((res) => {
          this.roleData = res.data;
        })
        .catch((e) => console.log(e.message));
    },
    listMain() {
      // this.getdic();
      AX(
        "get",
        `dicm?value=${this.inputsearch}&page=${this.page.cpg}&pagesize=${this.page.limit}`
      ).then((res) => {
        console.log(res);
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
