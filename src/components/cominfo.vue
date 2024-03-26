<template>
  <div class="cominfo" style="min-width: 1250px">
    <el-form
      ref="refform"
      :rules="rules"
      :model="form"
      label-width="80px"
      label-position="left"
      @submit.prevent="saveform"
    >
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="企业税号" prop="comid">
            <el-input v-model="form.comid" :disabled="!isAdd"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="公司名称"
            prop="comname"
            :label-width="formLabelWidth"
          >
            <el-input v-model="form.comname"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item label="开户银行" prop="bank">
            <el-input v-model="form.bank"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="银行账号" prop="bankaccount">
            <el-input v-model="form.bankaccount"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="邮寄地址" prop="address">
            <el-input v-model="form.address"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item label="联系人">
            <el-input v-model="form.contacts"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系电话">
            <el-input v-model="form.tele"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="电子邮箱">
            <el-input v-model="form.email"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item label="数据库" prop="dbname">
            <el-input v-model="form.dbname"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="库服务器" prop="dbhost">
            <el-input v-model="form.dbhost"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="库端口" prop="dbport">
            <el-input v-model="form.dbport" type="number"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="6">
          <el-tooltip placement="top">
            <template #content>
              数字0：表示自然月份 （月头1号到月尾）
              <br />数字2-28:表示跨月，数字表示开始日（比如数字21，表示周期为上月21日，到本月20日）。
            </template>
            <el-form-item label="薪资周期" prop="salperiod">
              <el-input-number
                v-model="form.salperiod"
                type="number"
                :min="0"
                :max="31"
              ></el-input-number>
            </el-form-item>
          </el-tooltip>
        </el-col>

        <el-col :span="6">
          <el-tooltip placement="top">
            <template #content>
              数字0：表示自然月份 （月头1号到月尾）
              <br />数字2-28:表示跨月，数字表示开始日（比如数字21，表示周期为这上月21日，到本月20日）。
            </template>
            <el-form-item label="考勤周期" prop="kqperiod">
              <el-input-number
                v-model="form.kqperiod"
                :min="0"
                :max="31"
              ></el-input-number>
            </el-form-item>
          </el-tooltip>
        </el-col>
        <el-col :span="6">
          <el-form-item label="系统年度" prop="sysyear">
            <el-input-number
              v-model="form.sysyear"
              :min="2024"
              :max="2099"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="系统月度" prop="sysmonth">
            <el-input-number
              v-model="form.sysmonth"
              :min="1"
              :max="12"
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="6">
          <el-form-item label="服务开始" prop="svrsdate">
            <el-date-picker
              v-model="form.svrsdate"
              type="date"
              placeholder="Pick a Date"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              @change="fromdateChange"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="服务结束" prop="svredate">
            <el-date-picker
              v-model="form.svredate"
              type="date"
              placeholder="Pick a Date"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="所属" prop="fid">
            <el-select
              size="default"
              v-model="form.fid"
              placehhlder="请选择类型"
            >
              <el-option
                v-for="item in comsdata"
                :label="item.comname"
                :value="item.comid"
                :key="item.comid"
              ></el-option> </el-select
          ></el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="许可证" prop="license">
            <el-input v-model="form.license" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item>
            <el-button @click="newform()" v-if="isAdd == false">
              新建
            </el-button>
            <el-button type="primary" @click="saveform">{{
              savenewbtn
            }}</el-button>
            <el-button @click="close()">取消</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
  <div class="dialogroleform">
    <el-dialog
      title="角 色 设 置"
      width="500px"
      style="font-weight: bold"
      v-model="dialogRoleFormVisible"
    >
      <el-form
        :rules="rules"
        :model="roleform"
        ref="refroleform"
        class="margin:0 20px;display:flex;"
      >
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item
              label="名称"
              :label-width="formLabelWidth2"
              prop="rname"
            >
              <el-input
                size="default"
                v-model="roleform.rname"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="描述"
              :label-width="formLabelWidth2"
              prop="desc"
            >
              <el-input
                size="default"
                v-model="roleform.desc"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              label="排序"
              :label-width="formLabelWidth2"
              prop="sort"
            >
              <el-input
                size="default"
                v-model="roleform.sort"
                autocomplete="off"
              ></el-input> </el-form-item
          ></el-col>

          <el-col :span="24">
            <el-form-item label="备注" :label-width="formLabelWidth2">
              <el-input
                size="default"
                v-model="roleform.remark"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-button type="primary" @click="saveRoleForm">{{
          addeditbtnlable
        }}</el-button>
      </el-form>
      <el-divider content-position="left"><b>该账号角色列表</b></el-divider>
      <el-form-item>
        <el-table :data="roledata" stripe style="font-size: 12px">
          <el-table-column label="角色/name" prop="rname"></el-table-column>
          <el-table-column label="描述/Desc" prop="desc"></el-table-column>
          <el-table-column label="激活/Active" prop="isactive"
            ><template #default="scope">
              <el-tag v-if="scope.row.isactive == 1">激活</el-tag>
              <el-tag type="danger" v-else>未</el-tag>
            </template></el-table-column
          >
          <el-table-column label="操作">
            <template #default="scope">
              <el-tooltip
                content="设置用户"
                v-if="scope.row.rname.toLowerCase().trim() == 'admin'"
              >
                <el-button
                  size="small"
                  @click="handleAdd_user(scope.row)"
                  v-if="scope.row.rname.toLowerCase().trim() == 'admin'"
                  ><el-icon><Plus /></el-icon></el-button
              ></el-tooltip>

              <el-tooltip content="角色修改" v-if="scope.row.rname != 'admin'">
                <el-button
                  size="small"
                  @click="handleEdit_role(scope.row)"
                  v-if="scope.row.rname != 'admin'"
                  ><el-icon><Edit /></el-icon></el-button
              ></el-tooltip>

              <el-tooltip content="激活？" v-if="scope.row.rname != 'admin'">
                <el-button
                  type="danger"
                  size="small"
                  v-if="scope.row.rname != 'admin'"
                  @click="handleDelete_role(scope.row)"
                  ><el-icon><SwitchButton /></el-icon></el-button
              ></el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogRoleFormVisible = false" type="primary"
            >离 开</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
  <div class="dialogmenuform">
    <el-dialog title="功能设置" width="40%" v-model="dialogMenuFormVisible">
      <menutemplate
        v-bind:comid="comid"
        @closeDialog="dialogMenuFormVisible = false"
      ></menutemplate>
    </el-dialog>
  </div>

  <el-dialog
    title="设 置 登 录 账 号"
    width="500px"
    style="font-weight: bold"
    v-model="dialogPwdFormVisible"
  >
    <el-form
      ref="refpwdform"
      :rules="rules"
      :model="userform"
      label-width="80px"
      label-position="left"
      @submit.prevent="savepwdform"
    >
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item
            label="用户名"
            prop="usrname"
            placeholder="Please input name."
            :label-width="formLabelWidth3"
          >
            <el-input v-model="userform.usrname"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item
            label="手机号码(登录)"
            prop="tele"
            placeholder="Please input tele Number."
            :label-width="formLabelWidth3"
          >
            <el-input v-model="userform.tele"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item
            label="邮箱"
            prop="email"
            placeholder="Please input email."
            :label-width="formLabelWidth3"
          >
            <el-input v-model="userform.email" type="email"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item
            label="密码(默认:123456)"
            :label-width="formLabelWidth3"
            prop="pwd"
          >
            <el-input
              v-model="userform.pwd"
              type="password"
              autocomplete="off"
              placeholder="Please input password"
              show-password
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="重复密码" :label-width="formLabelWidth3">
            <el-input
              v-model="userform.rpwd"
              type="password"
              autocomplete="off"
              placeholder="Please input password"
              show-password
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-button @click="savepwdform" type="primary">创建用户</el-button>
    </el-form>

    <el-divider content-position="left"
      ><b>归属Admin角色的其他账号用户列表</b></el-divider
    >
    <el-form-item>
      <el-table :data="admindata" stripe>
        <el-table-column label="用户名" prop="usrname"></el-table-column>
        <el-table-column label="登录号码" prop="tele"></el-table-column>
        <el-table-column label="激活/Active" prop="isactive"
          ><template #default="scope">
            <el-tag v-if="scope.row.isactive == 1" type="success">激活</el-tag>
            <el-tag type="danger" v-else>锁定</el-tag>
          </template></el-table-column
        >
        <el-table-column label="操作">
          <template #default="scope">
            <el-tooltip content="激活/锁定">
              <el-button
                type="danger"
                size="small"
                @click="handleDelete_adminuser(scope.row)"
                ><el-icon><SwitchButton /></el-icon></el-button
            ></el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
  </el-dialog>

  <el-divider content-position="left"><b>单位列表</b></el-divider>
  <div>
    <el-table :data="data" stripe>
      <el-table-column
        prop="id"
        fixed
        width="40"
        type="selection"
      ></el-table-column>

      <el-table-column prop="comname" fixed label="公司" width="220"
        ><template #default="scope">
          <el-tag type="info" v-if="scope.row.fid == -1">{{
            scope.row.comname
          }}</el-tag>
          <el-tag v-else-if="scope.row.fid == 0"
            >&nbsp;|----{{ scope.row.comname }}</el-tag
          ><el-tag type="success" v-else
            >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|----{{
              scope.row.comname
            }}</el-tag
          ></template
        ></el-table-column
      >
      <el-table-column prop="fid" fixed label="所属" width="60"
        ><template #default="scope">
          <el-tag type="info" v-if="scope.row.fid == -1">根</el-tag>
          <el-tag v-else-if="scope.row.fid == 0">总</el-tag>
          <el-tag type="success" v-else>子</el-tag>
        </template></el-table-column
      >
      <el-table-column
        prop="dbname"
        fixed
        label="库"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="sysyear"
        fixed
        label="系统年度"
        width="80"
      ></el-table-column>
      <el-table-column
        prop="sysmonth"
        fixed
        label="系统月度"
        width="80"
      ></el-table-column>

      <el-table-column
        prop="salperiod"
        fixed
        label="薪资周期"
        width="80"
      ></el-table-column>

      <el-table-column
        prop="kqperiod"
        fixed
        label="考勤周期"
        width="80"
      ></el-table-column>
      <el-table-column
        prop="svredate"
        fixed
        label="服务到期日"
        width="140"
      ></el-table-column>

      <el-table-column
        prop="isactive"
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
        <template #default="scope"
          ><el-tooltip
            content="修改账号"
            placement="bottom"
            :disabled="scope.row.fid == '-1'"
          >
            <el-button
              size="small"
              @click="handleEdit(scope.row)"
              :disabled="scope.row.fid == '-1'"
              ><el-icon><Edit /></el-icon></el-button></el-tooltip
          ><el-tooltip content="角色设置" placement="bottom">
            <el-button size="small" @click="handleViewRole(scope.row)"
              ><el-icon><UserFilled /></el-icon></el-button
          ></el-tooltip>
          <el-tooltip content="功能设置" :disabled="scope.row.fid == '-1'">
            <el-button
              size="small"
              @click="handleViewMenu(scope.row)"
              :disabled="scope.row.fid == '-1'"
              v-if="scope.row.rname != 'admin'"
              ><el-icon><Menu /></el-icon></el-button></el-tooltip
          ><el-tooltip
            content="激活？"
            placement="bottom"
            :disabled="scope.row.fid == '-1'"
          >
            <el-button
              type="danger"
              size="small"
              :disabled="scope.row.fid == '-1'"
              @click="handleSwitchActive(scope.row)"
              ><el-icon><SwitchButton /></el-icon></el-button
          ></el-tooltip>
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
      :total="page.counts"
    ></el-pagination>
  </div>
</template>

<script>
import { AX } from "../utils/api";
import { ref, watchEffect } from "vue";
import menutemplate from "../components/menutemplate.vue";
import moment from "moment";

export default {
  components: { menutemplate },
  data() {
    return {
      comsdata: [],
      savenewbtn: "创建",
      addeditbtnlable: "创建角色",
      formLabelWidth: "160px",
      formLabelWidth1: "180px",
      formLabelWidth2: "60px",
      formLabelWidth3: "150px",
      dialogRoleFormVisible: false,
      dialogMenuFormVisible: false,
      dialogUserFormVisible: false,
      dialogPwdFormVisible: false,
      isAdd: true,
      data: [],
      roledata: [],
      admindata: [],
      menuform: [],
      comid: ref("-1"),

      page: {
        limit: 10,
        cpg: 1,
        counts: 0,
      },
      rolepage: {
        limit: 10,
        cpg: 1,
        counts: 0,
      },
      cp1: 1,
      userform: {
        tele: "",
        pwd: "123456",
        rpwd: "123456",
        usrname: "admin",
        email: "695050907@qq.com",
        usrgrpid: "",
      },
      roleform: {
        id: "",
        //rid 是不需要出现的，因为它是自己计数的
        //在新建和修改里都不能出现，否则报错，它只作为链接用。
        //rid: "1",
        rname: "",
        comid: "",
        isactive: 1,
        remark: "",
        sort: "101",
        desc: "",
      },
      form: {
        id: "",
        name: "",
        reamrk: "",
        sort: "100",
        type: "",
        comid: ref(""),
        comname: ref(""),
        bank: "",
        bankaccount: "",
        address: "",
        contacts: "",
        tele: "",
        email: "",
        website: "",
        salperiod: 0,
        kqperiod: 0,
        sysyear: 2023,
        sysmonth: 1,
        svrsdate: "2023-01-01",
        svredate: "2024-12-31",
        isactive: 1,
        fid: "0",
        dbname: "specicwp",
        dbhost: "localhost",
        dbport: 5432,
      },
      rules: {
        dbname: [
          {
            required: true,
            message: "please input databbase name(4-32位)",
            partten: /^[a-zA-Z][a-zA-Z0-9-_]+[a-zA-Z]$/,
            trigger: "blur",
            min: 4,
            max: 32,
          },
        ],
        dbhost: [
          {
            required: true,
            message: "please input databbase host(5-250位)",
            trigger: "blur",
            min: 5,
            max: 250,
          },
        ],
        dbport: [
          {
            required: true,
            message: "please input database port(4-5位数字)",
            trigger: "blur",
          },
        ],
        tele: [
          {
            required: true,
            message: "请输入11位电话号码.",
            partten: /^1\d{10}$/,
            trigger: "blur",
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
        comid: [
          {
            required: true,
            min: 15,
            max: 18,
            message: "请输入国家提供的15-18位企业税号！",
            trigger: blur,
          },
        ],

        comname: [
          {
            required: true,
            min: 2,
            max: 50,
            message: "请输入企业名称！",
            trigger: blur,
          },
        ],
        usrname: [
          {
            required: true,
            min: 2,
            max: 50,
            message: "请输入用户名（2-50位）！",
            trigger: blur,
          },
        ],
        rname: [
          {
            required: true,
            min: 2,
            max: 50,
            partten: /^([a-zA-Z]{1})|([a-zA-Z0-9]*)$/,
            message: "请输入角色名称，字母或数字，2到50位！",
            trigger: blur,
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
        salperiod: [
          {
            required: true,
            // min: 0,
            // max: 31,
            // message: "薪资周期需要数字！",
            // parttern: /^([1-9]{1})|([1,2]{1}[0-9]{1})$/,
            trigger: blur,
          },
        ],
        kqperiod: [
          {
            required: true,

            message: "考勤周期需要数字！",
            // parttern: /^((0?[0-9]{1})|([1,2]{1}[0-9]{1}))$/,
            trigger: blur,
          },
        ],
        sysyear: [
          {
            required: true,

            message: "系统年度需要4位大于2020的数字！",
            // parttern: /^20[2-9]{1}[0-9]{1}$/,
            trigger: blur,
          },
        ],
        sysmonth: [
          {
            required: true,

            message: "系统月份需要数字！",
            // parttern: /^(0?[1-9]{1})|([1]{1}[0-2]{1})$/,
            trigger: blur,
          },
        ],
        svrsdate: [
          {
            required: true,

            message: "请输入开始日期",

            trigger: blur,
          },
        ],
        svredate: [
          {
            required: true,

            message: "请输入结束日期",

            trigger: blur,
          },
        ],
      },
    };
  },
  mounted() {
    this.listMain();
  },

  methods: {
    iniForm() {
      Object.keys(this.form).forEach((key) => (this.form[key] = ""));
      this.form.sort = "101";
      this.form.salperiod = "21";
      this.form.kqperiod = "21";
      this.form.sysyear = "2024";
      this.form.sysmonth = "1";
      this.form.isactive = "1";
      this.form.fid = "0";
      this.form.svrsdate = "2023-01-01";
      this.form.svredate = "2024-12-31";
      this.form.isactive = 1;
      this.form.dbname = "specicwp";
      this.form.dbhost = "localhost";
      this.form.dbport = 5432;
      this.savenewbtn = "创建";
      this.isAdd = true;
    },

    newform() {
      this.iniForm();
    },

    close() {
      this.iniForm();
    },
    fromdateChange() {
      console.log(this.form.svrsdate);
      this.form.svredate = moment(this.form.svrsdate)
        .add(1, "year")
        .add(-1, "day")
        .format("YYYY-MM-DD");
    },

    iniroleForm() {
      const comid = this.roleform.comid;
      Object.keys(this.roleform).forEach((key) => (this.roleform[key] = ""));
      this.roleform.sort = "101";
      this.roleform.comid = comid;
      this.roleform.isactive = 1;
      this.addeditbtnlable = "创建角色";
      this.roleform.id = ""; //这里必须是空，表示新加入
    },
    savepwdform() {
      this.$refs.refpwdform.validate((valid) => {
        if (this.userform.pwd != this.userform.rpwd) {
          this.$message.error("密码不对，请重新设置！");
          return;
        }
        if (valid) {
          let reg = new RegExp();
          reg = /^1[3-9]\d{9}$/;
          if (!reg.test(this.userform.tele)) {
            this.$message.error("请输入正确的手机号码！");
            return;
          }

          // console.log("我靠过儿");
          // if (true) {
          //   return;
          // }

          AX("post", "user", this.userform)
            .then((res) => {
              if (res) {
                console.log(res);
                if (res && res.code == 200) {
                  this.$message.success("创建成功！");
                  this.dialogPwdFormVisible = false;
                }
              }
            })
            .catch((e) => {
              console.log(e);
            });
        }
      });
    },
    saveform() {
      this.$refs.refform.validate((valid) => {
        if (this.form.fid == this.form.comid) {
          this.$message.error("保存错误！组织所属信息不能是自己！");
          return;
        }
        if (valid) {
          console.log(this.form);
          let updatestr = "cominfo/";
          let requestType = "post";

          if (this.form.id) {
            updatestr = "cominfo/" + this.form.id;
            requestType = "patch";
          }

          AX(requestType, updatestr, this.form)
            .then((res) => {
              this.data = res.data;
              this.listMain();
              this.iniForm();
            })
            .catch((e) => {
              console.log(e.message);
              return;
            });
        }
      });
    },

    saveRoleForm() {
      this.$refs.refroleform.validate((valid) => {
        // if (this.form.fid == this.form.comid) {
        //   this.$message.error("保存错误！组织所属信息不能是自己！");
        //   return;
        // }
        // console.log(this.roleform);

        if (valid) {
          let updatestr = "roles/";
          let requestType = "post";

          //任何情况下，都不能创建ADMIN名称的用户组
          if (this.roleform.rname.toLowerCase().trim() == "admin") {
            this.$message.error("保存错误！不能创建ADMIN名称的用户组！");
            return;
          }

          //不能创建同名的用户组
          for (let el of this.roledata) {
            if (
              el.rname.toLowerCase().trim() ==
              this.roleform.rname.toLowerCase().trim()
            ) {
              this.$message.error("保存错误！不能创建同名的用户组！");
              return;
            }
          }
          //=====================
          if (this.roleform.id) {
            updatestr = "roles/" + this.roleform.id;
            requestType = "patch";
          }

          AX(requestType, updatestr, this.roleform)
            .then((res) => {
              this.roledata = res.data;
              this.listrole(this.roleform.comid);
              this.iniroleForm();
            })
            .catch((e) => {
              console.log(e.message);
              return;
            });
        }
      });
    },
    changePage(idx) {
      this.page.cpg = idx;
      this.cp1 = idx;
      this.listMain();
    },

    handleSwitchActive(data) {
      AX("patch", `cominfo/${data.id}`, {
        isactive: data.isactive == 1 ? 0 : 1,
        id: data.id,
      })
        .then((res) => {
          if (res.code == 200) {
            this.listMain();
          }
        })
        .catch((e) => console.log(e.message));
    },

    handleEdit(data) {
      this.savenewbtn = "保存修改";
      this.isAdd = false;
      Object.keys(this.form).forEach((key) => (this.form[key] = data[key]));
      this.form.salperiod = data.salperiod;
      this.form.kqperiod = data.kqperiod;
      this.form.sysyear = data.sysyear;
      this.form.sysmonth = data.sysmonth;

      this.clearFldlst();
    },
    handleViewRole(data) {
      Object.keys(this.roleform).forEach((key) => (this.roleform[key] = ""));

      this.roleform.comid = data.comid;
      this.roleform.isactive = 1;
      this.roleform.sort = 101;
      this.listrole(data.comid);
      this.dialogRoleFormVisible = true;
    },
    handleViewMenu(data) {
      this.comid = data.comid;
      this.dialogMenuFormVisible = true;
    },
    handleEdit_role(data) {
      Object.keys(this.roleform).forEach(
        (key) => (this.roleform[key] = data[key])
      );
      this.addeditbtnlable = "修改角色";
    },

    listadmin(rid) {
      AX("get", `user/lstadmin/${rid}`)
        .then((res) => {
          if (res.code == 200) {
            this.admindata = res.data;
          }
        })
        .catch((e) => console.log(e.message));
    },

    handleAdd_user(data) {
      console.log("10000", data);

      if (data.rname != "admin") {
        this.$message.error(
          "非Admin角色用户，请在【用户账号】模块中进行设置！"
        );
        return;
      } else {
        this.listadmin(data.rid);
        this.userform.email = "@";
        this.userform.usrname = "";
        this.userform.tele = "";

        this.dialogPwdFormVisible = true;
        this.userform.usrgrpid = data.rid;
      }
    },
    handleDelete_role(data) {
      AX("patch", `roles/${data.id}`, {
        isactive: data.isactive == 1 ? 0 : 1,
        id: data.id,
      })
        .then((res) => {
          if (res.code == 200) {
            this.listrole(data.comid);
          }
        })
        .catch((e) => console.log(e.message));
    },
    handleDelete_adminuser(data) {
      AX("patch", `user/${data.id}`, {
        isactive: data.isactive == 1 ? 0 : 1,
        id: data.id,
      })
        .then((res) => {
          if (res.code == 200) {
            this.listadmin(data.usrgrpid);
          }
        })
        .catch((e) => console.log(e.message));
    },

    clearFldlst() {
      AX("get", `cominfo/lst/all`)
        .then((res) => {
          if (res.data.length > 0) {
            this.comsdata = res.data;
          }
          const defval = {
            comid: "0",
            comname: "单体/总公司",
          };
          this.comsdata.unshift(defval);

          this.comsdata.forEach((item, idx, ary) => {
            // console.log(item["comid"], this.form.comid);
            if (ary[idx].comid == this.form.comid) {
              this.comsdata.splice(idx, 1);
            }
          });
        })
        .catch((e) => console.log(e.message));
    },

    listMain() {
      AX("get", `cominfo?page=${this.page.cpg}`)
        .then((res) => {
          // console.log(res);
          if (res.data.length > 0) {
            this.data = res.data;
            page.counts = res.total;
          }
        })
        .catch((e) => console.log(e.message));

      this.clearFldlst();
    },
    listrole(comid) {
      if (this.roledata && this.roledata.length > 0) {
        this.roledata.splice(0, this.roledata.length);
      }
      AX("get", `roles?value=${comid}&page=${this.rolepage.cpg}`)
        .then((res) => {
          let addAdmin = true;
          if (res && res.data && res.data.length > 0) {
            this.roledata = res.data;
            this.rolepage.counts = res.total;
            res.data.forEach((item) => {
              if ("admin" == item.rname.toLowerCase().trim()) {
                addAdmin = false;
              }
            });
          }
          //每个账号里至少有一个admin的角色，如果没有，只要点击角色设置，会自动建立
          //这个很重要。所有的账号必须有一个admin的角色
          //当有了角色之后，同时会建立一个属于该角色下的用户
          //创建改用户需要有一个至少电话号码。密码123456，最好的情况是通过扫码
          //或者是电话短信来登录。
          if (addAdmin) {
            AX("post", `roles`, {
              rname: "admin",
              desc: "admin",
              comid,
              remark: "admin",
            }).then(() => {
              addAdmin = false;
              this.listrole(comid);
            });
          }
        })
        .catch((e) => console.log(e.message));
    },
  },
};
</script>
<style scoped>
.cominfo .el-form-item {
  width: 100%;
}
.el-form-item {
  margin-bottom: 20px;
}
.demo-date-picker {
  display: flex;
  width: 100%;
  padding: 0;
  flex-wrap: wrap;
}
.demo-date-picker .block {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  flex: 1;
}
.demo-date-picker .block:last-child {
  border-right: none;
}
</style>
