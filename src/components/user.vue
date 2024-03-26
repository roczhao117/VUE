<template>
  <el-container direction="vertical">
    <div style="display: flex; margin: 1px; margin-right: 20px">
      <el-button type="primary" @click="handleNew()"
        ><el-icon><Plus /></el-icon
      ></el-button>
      <el-button type="primary" @click="listMain()"
        ><el-icon><Refresh /></el-icon
      ></el-button>
      <el-input
        placeholder="查询内容"
        v-model="inputsearch"
        class="input-with-select"
      >
        <template #append>
          <el-button @click="listMain"
            ><el-icon><Search /></el-icon
          ></el-button>
        </template>
      </el-input>
    </div>
    <div>
      <el-table :data="tableData" stripe>
        <el-table-column
          prop="id"
          fixed="left"
          width="40"
          type="selection"
        ></el-table-column>
        <el-table-column
          fixed="left"
          width="40"
          type="index"
          :index="getIndex"
        ></el-table-column>
        <el-table-column prop="tele" fixed="left" label="账号" width="120"
          ><template #default="scope">
            <el-tag>{{
              scope.row.tele.substring(0, 3) +
              "*****" +
              scope.row.tele.substring(scope.row.tele.length - 3)
            }}</el-tag></template
          ></el-table-column
        >
        <el-table-column
          prop="usrname"
          fixed="left"
          label="用户全名"
          width="150"
        ></el-table-column>
        <el-table-column prop="usrgrpid" fixed="left" label="角色" width="180"
          ><template #default="scope">
            <el-tag> {{ showacc(scope.row.usrgrpid) }}</el-tag>
          </template></el-table-column
        >

        <el-table-column
          prop="isactive"
          :formatter="formatisstop"
          fixed="left"
          width="80"
          show-overflow-tooltip
          label="激活"
        >
          <template #default="scope">
            <el-tag v-if="scope.row.isactive == 1" type="success">激活</el-tag>

            <el-tag v-else type="danger">未</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="id" label="操作">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
              ><el-icon><Edit /></el-icon
            ></el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
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
        @current-change="changePage"
        :current-page="page.cpg"
        :total="page.total"
      ></el-pagination>
    </div>
    <div class="dialogform">
      <el-dialog title="用户账号" width="40%" v-model="dialogFormVisible">
        <el-form
          :rules="rules"
          :model="form"
          ref="refform"
          class="margin:0 20px;display:flex;"
        >
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item
                label="ID"
                :label-width="formLabelWidth"
                prop="usrid"
              >
                <el-input
                  size="default"
                  :disabled="!neworedit"
                  v-model="form.usrid"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="全名" :label-width="formLabelWidth">
                <el-input
                  size="default"
                  v-model="form.usrname"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item
            label="账号(手机号码)"
            :label-width="formLabelWidth"
            prop="tele"
          >
            <el-input
              size="default"
              v-model="form.tele"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item
                label="角色"
                :label-width="formLabelWidth"
                prop="usrgrpid"
              >
                <el-select
                  size="default"
                  v-model="form.usrgrpid"
                  placehhlder="请选择活动区域"
                >
                  <el-option
                    v-for="item in rolesdata"
                    :label="item.comname + '-' + item.rname"
                    :value="item.rid"
                    :key="item.rid"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item
            label="密码(6-32位数字字母)"
            :label-width="formLabelWidth"
            prop="pwd"
            placeholder="Please input password"
            show-password
          >
            <el-input
              size="default"
              v-model="form.pwd"
              type="password"
              autocomplete="off"
              placeholder="Please input password"
              show-password
            ></el-input>
          </el-form-item>

          <el-form-item
            label="重复密码"
            :label-width="formLabelWidth"
            prop="cmppwd"
          >
            <el-input
              size="default"
              v-model="cmppwd"
              autocomplete="off"
              type="password"
              placeholder="Please input password"
              show-password
            ></el-input>
          </el-form-item>

          <el-form-item label="邮件" :label-width="formLabelWidth" prop="email">
            <el-input
              size="default"
              v-model="form.email"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item label="激活" :label-width="formLabelWidth">
            <el-radio-group v-model="form.isactive">
              <el-radio :label="0">锁死</el-radio>
              <el-radio :label="1">激活</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item
            label="下次登陆需要更改密码"
            :label-width="formLabelWidth"
          >
            <el-radio-group v-model="form.is_nextmp">
              <el-radio :label="1">要</el-radio>
              <el-radio :label="0">不要</el-radio>
            </el-radio-group>
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
  </el-container>
</template>
<script>
import { AX } from "../utils/api";
import { ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import { useUserStore } from "../store/index";
export default {
  setup() {
    const userstore = useUserStore();
    return {
      userstore,
    };
  },
  data() {
    return {
      tableData: [],
      rolesdata: [],
      cominfodata: [],

      inputsearch: "",
      counts: 1,
      cp1: 1,

      formLabelWidth: "200",

      cmppwd: "",

      dialogFormVisible: false,

      neworedit: true,

      page: {
        limit: 20,
        cpg: 1,
        total: 0,
      },
      form: {
        id: "",
        is_nextmp: "0",
        isactive: ref("1"),
        usrid: ref(""),
        usrname: "",
        pwd: ref(""),
        usrgrpid: "",
        tele: "",
        email: "",
        remark: "",
      },

      rules: {
        usrid: [
          {
            required: true,
            message: "数字字母 6-36位",
            partten: /^[a-zA-Z0-9_-]{6-36}$/,
            trigger: "blur",
            min: 6,
            max: 36,
          },
        ],
        tele: [
          {
            required: true,
            message: "请输入11位电话号码.",
            partten: /^1[3-9][0-9]9$/,
            trigger: "blur",
            min: 11,
            max: 11,
          },
        ],

        pwd: [
          {
            required: true,
            message: "please input password",
            trigger: "blur",
            min: 6,
            max: 32,
          },
        ],

        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur",
            partten: /^([a-zA-Z0-9_\.-]+)@([\da-zA-Z\.-]+)\.([a-zA-Z\.]{2,6})$/,
            min: 6,
            max: 50,
          },
        ],

        usrgrpid: [
          { required: true, message: "please input roler", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    getIndex(index) {
      return index + 1 + "";
    },
    handleDelete(idx, row) {
      const logintele = this.userstore.userData.data.user.data[0].tele;
      if (row.tele == logintele) {
        this.$message({
          message: "不能删除当前登陆账号",
          type: "error",
        });
        return;
      }

      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          AX("DELETE", "user/" + row.id).then((res) => {
            if (res) {
              this.listMain();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消删除",
          });
        });
    },
    saveForm() {
      // console.log(this.form);

      this.$refs.refform.validate((valid) => {
        if (valid) {
          if (this.form.pwd == this.cmppwd) {
            if (!this.neworedit && this.form.id) {
              AX("patch", "user/" + this.form.id, this.form).then((res) => {
                console.log(this.form);
                if (res) {
                  this.dialogFormVisible = false;
                  this.listMain();
                }
              });
            } else {
              AX("post", "user", this.form).then((res) => {
                if (res) {
                  this.dialogFormVisible = false;
                  this.listMain();
                }
              });
            }
          } else {
            this.$message.error("密码不对！");
            return false;
          }
        }
      });
    },
    formatisstop(row) {
      return row.is_stop == 0 ? "No" : "STOP";
    },
    handleNew() {
      this.neworedit = false;
      this.dialogFormVisible = true;
      this.getdic();
      Object.keys(this.form).forEach((key) => {
        console.log();
        this.form[key] = "";
      });
      this.form.is_nextmp = 0;
      this.form.isactive = 1;
      this.form.usrid = uuidv4();
      this.cmppwd = "";
    },
    handleEdit(index, row) {
      //  this.getdic();
      //  console.log(index, row);
      this.neworedit = false;
      this.dialogFormVisible = true;
      Object.keys(this.form).forEach((key) => {
        this.form[key] = row[key];
      });
      this.form.pwd = "";
      this.cmppwd = "";
    },

    changePage(idx) {
      console.log(idx);
      this.page.cpg = idx;
      this.listMain();
    },

    getdic() {
      AX("get", `roles/lstall/${this.userstore.getUser(false).comid}`)
        .then((res) => {
          // console.log(res);
          if (res && res.data.length > 0) {
            this.rolesdata = res.data;
          }
        })
        .catch((e) => console.log(e.message));
    },

    listMain() {
      this.getdic();

      AX(
        "get",
        `user?value=${this.inputsearch}&pagesize=${this.page.limit}&page=${
          this.page.cpg
        }&user=${JSON.stringify(this.userstore.getUser(false))}`
      ).then((res) => {
        if (res) {
          this.tableData = res.data;
          this.page.total = res.total;
        }
      });
    },

    showacc(usrid) {
      let label = usrid;
      this.rolesdata.forEach((item) => {
        if (item["rid"] == usrid) {
          label = item["rname"] + "-" + item["comname"];
        }
      });
      return label;
    },
  },
};
</script>
<style scoped>
.input-with-select {
  width: 360px;
  margin-left: 10px;
}
.dialogform {
  display: flex;
  margin: 0 0;
}
.el-form-item {
  margin-bottom: 15px;
}
.el-form-item__content {
  display: flex;
}
</style>
