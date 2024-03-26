<template>
  <div>
    <!-- 查询头 -->

    <div style="display: flex; margin: 1px 1px 10px">
      <el-tooltip content="上一月度" placement="top">
        <el-button
          icon="caret-left"
          size="small"
          @click="changeshiftdate(-1)"
        ></el-button>
      </el-tooltip>
      <el-tag
        type="success"
        style="
          font-size: 12px;
          padding: 4px;
          height: 24px;
          color: rgb(163, 163, 163);
          margin: 0 4px;
        "
        >当前考勤周期: {{ kqinfo.period }} 日期区间[ {{ kqinfo.fromdate }} 到
        {{ kqinfo.todate }}]</el-tag
      >

      <el-tooltip
        content="下一月度"
        placement="top"
        :disabled="kqinfo.diffmons >= 1"
      >
        <el-button
          icon="Caret-right"
          size="small"
          :disabled="kqinfo.diffmons >= 1"
          @click="changeshiftdate(1)"
        ></el-button>
      </el-tooltip>
    </div>

    <div style="display: flex; margin: 1px; margin-right: 4px">
      <el-tooltip content="刷新数据" placement="top">
        <el-button icon="Refresh" size="small" @click="listMain()"></el-button>
      </el-tooltip>

      <span style="margin-left: 20px">
        <el-select
          v-model="isstopkq"
          placeholder="请考勤人员类型"
          style="width: 100%"
          size="small"
        >
          <el-option
            v-for="item in selkqstafftype"
            :key="item.itemid"
            :label="item.itemname"
            :value="item.itemid"
          ></el-option>
        </el-select>
      </span>

      <el-input
        placeholder="查询内容"
        v-model="inputsearch"
        class="input-with-select"
        v-on:keydown.enter="listMain()"
        size="small"
      >
        <template #append>
          <el-button size="small" icon="search" @click="listMain()"
            >查询</el-button
          >
        </template>
      </el-input>
      <el-tooltip content="批量排班" placement="top">
        <el-button
          icon="DocumentChecked"
          size="small"
          @click="cmd_batchshift"
          style="margin-left: 4px"
        ></el-button>
      </el-tooltip>
    </div>
    <!-- 人事表格子 -->
    <div style="display: flex; margin-top: 10px; height: 650px">
      <div style="border-right: 0px solid rgb(239, 239, 239); margin-left: 1px">
        <el-tree
          size="small"
          :data="dpData"
          show-checkbox
          node-key="id"
          ref="deptTree"
          :props="dpProps"
          :default-expand-all="true"
          @check="check"
          style="
            width: 250px;
            overflow-x: scroll;
            height: 715px;
            font-size: 12px;
          "
          class="dept"
        >
          <template #default="{ node, data }">
            <span>
              <el-tag class="iscompany" v-if="data.deptlevel == 0">{{
                node.label
              }}</el-tag>
              <el-tag class="isdept" v-if="data.deptlevel == 1">{{
                node.label
              }}</el-tag>
              <el-tag class="ispos" v-if="data.deptlevel == 2">{{
                node.label
              }}</el-tag>
              <span class="pdmsg" v-if="data.deptlevel == 2"
                ><el-icon><Medal /></el-icon
              ></span>

              <span class="pdmsg" v-if="data.deptlevel == 1"
                ><el-icon><House /></el-icon
              ></span>
              <span class="companyflag" v-if="data.deptlevel == 0"
                ><el-icon><OfficeBuilding /></el-icon
              ></span>
            </span>
          </template>
        </el-tree>
      </div>
      <div
        style="margin-left: 2px; width: 100%; min-width: 800px; font-size: 12px"
      >
        <el-table
          :data="tableData"
          style="width: 1200px; font-size: 12px"
          v-loading="loading"
          :element-loading-text="loadingContent"
          element-loading-spinner="el-icon-loading"
          :element-loading-background="loadingBackground"
          @selection-change="handleSelectionChange"
          stripe
        >
          <el-table-column prop="id" fixed="left" width="80" type="index">
            <template #default="scope">
              <span>{{
                (page.cpg - 1) * page.limit + (scope.$index + 1)
              }}</span>
            </template>
          </el-table-column>

          <el-table-column type="selection" fixed="left" width="55">
            <template #default="scope">
              <el-tag
                size="small"
                v-if="shiftsysids.includes(scope.row.sysid) == true"
                >模板</el-tag
              >
            </template>
          </el-table-column>

          <el-table-column
            prop="emid"
            label="工号"
            width="80"
          ></el-table-column>
          <el-table-column
            prop="cname"
            fixed="left"
            label="中文名"
            width="80"
          ></el-table-column>
          <el-table-column
            prop="cname"
            label="英文名"
            width="120"
          ></el-table-column>
          <el-table-column prop="h.sex" label="性别" width="60">
            <template #default="scope">
              <span v-if="scope.row.sex == 1">男</span>

              <span v-else>女</span>
            </template>
          </el-table-column>

          <el-table-column prop="dept" label="部门" width="120">
            <template #default="scope">
              <span>{{
                dpList.dicDescs(scope.row.dept, "dpid", "dpname")
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="position" label="职位" width="180">
            <template #default="scope">
              <span>{{
                dpList.dicDescs(scope.row.position, "dpid", "dpname")
              }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="datejoined"
            label="入职日期"
            width="100"
          ></el-table-column>

          <el-table-column
            prop="regualdate"
            label="转正日期"
            width="100"
          ></el-table-column>

          <el-table-column
            prop="ifcheckout"
            :formatter="formatisstop"
            width="120"
            show-overflow-tooltip
            label="在职状态"
          >
            <template #default="scope">
              <el-tag v-if="scope.row.ifcheckout == 1" type="danger"
                >离职</el-tag
              >
              <el-tag v-else-if="scope.row.ifcheckout == 0" type="success"
                >在职</el-tag
              >
              <el-tag v-else type="warning">离职申请递交</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="reqleavedate"
            label="离职申请日"
            width="120"
          ></el-table-column>
          <el-table-column
            prop="checkout"
            label="最后工作日"
            width="100"
          ></el-table-column>

          <el-table-column prop="stopkq" label="停止" width="100">
            <template #default="scope">
              <el-tooltip content="点击可切换状态,停止表示隐藏" placement="top">
                <el-button
                  type="danger"
                  size="small"
                  v-if="scope.row.stopkq == 1"
                  @click="activeActivity(0, scope.$index, scope.row)"
                  >停</el-button
                >
                <el-button
                  type="success"
                  size="small"
                  @click="activeActivity(1, scope.$index, scope.row)"
                  v-else
                  >非</el-button
                >
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column
            v-for="d in shiftdays"
            :key="d.id"
            :prop="d.id"
            :label="d.desc"
            width="80"
          >
            <template #default="scope">
              <span style="text-align: center">{{ scope.row[d.id] }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="id" fixed="right" label="操作" width="120">
            <template #default="scope">
              <span class="butgrp">
                <el-tooltip content="排班" placement="top">
                  <el-button
                    size="small"
                    icon="Edit"
                    @click="handleEdit(scope.$index, scope.row)"
                  ></el-button
                ></el-tooltip>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 翻页控件 -->
    <div style="margin-top: 25px; margin-left: 280px">
      <el-pagination
        background
        size="small"
        layout="total,prev, pager, next"
        :page-size="page.limit"
        @current-change="changePage"
        :current-page="page.cpg"
        :total="page.counts"
      ></el-pagination>
    </div>
    <!-- 人事表单 -->

    <!-- 人事新人表单 -->
    <div>
      <el-dialog
        title="排班"
        width="1000px"
        v-model="dialogFormVisible"
        @close="closedialog"
      >
        <span style="display: flex">
          <span style="margin-left: 20px; color: gray"
            >No.:{{ hrform.emid }} {{ hrform.cname }}
          </span>
        </span>

        <el-config-provider :locale="locale">
          <el-calendar :range="calbdt">
            <template #date-cell="{ data }">
              <template
                v-if="caldates.includes(data.day)"
                :class="data.isSelected ? 'is-selected' : ''"
              >
                <div style="padding: 0px; display: flex; margin: 0">
                  <el-tag style="margin-top: 1px">{{
                    data.day.split("-").slice(1).join("-")
                  }}</el-tag>
                  <el-tag
                    class="sfclass"
                    v-show="
                      ashiftdata[
                        data.day.split('-').slice(0, 3).join('') +
                          '#sf' +
                          data.day.split('-').slice(2).join('')
                      ] != ''
                    "
                    style="
                      font-size: smaller;
                      border: 0;
                      color: #304f7a;
                      background-color: transparent;
                    "
                    >{{
                      "s:   " +
                      ashiftdata[
                        data.day.split("-").slice(0, 3).join("") +
                          "#sf" +
                          data.day.split("-").slice(2).join("")
                      ]
                    }}</el-tag
                  >
                </div>
                <div style="padding: 0; margin: 0; display: flex">
                  <el-tag
                    class="msfclass"
                    v-show="
                      ashiftdata[
                        data.day.split('-').slice(0, 3).join('') +
                          '#msf' +
                          data.day.split('-').slice(2).join('')
                      ] != ''
                    "
                    style="
                      font-size: smaller;
                      border: 0;
                      background-color: transparent;
                      margin-top: -10px;
                      margin-left: 50px;
                      color: rgb(212 110 0);
                    "
                    >{{
                      "m:   " +
                      ashiftdata[
                        data.day.split("-").slice(0, 3).join("") +
                          "#msf" +
                          data.day.split("-").slice(2).join("")
                      ]
                    }}</el-tag
                  >
                </div>
                <div style="padding: 0; margin: 0; display: flex">
                  <el-tag
                    class="msfclass"
                    v-show="
                      ashiftdata[
                        data.day.split('-').slice(0, 3).join('') +
                          '#dmsf' +
                          data.day.split('-').slice(2).join('')
                      ] != ''
                    "
                    style="
                      font-size: smaller;
                      border: 0;
                      background-color: transparent;
                      margin-top: -10px;
                      margin-left: 50px;
                      color: rgb(212, 156, 0);
                    "
                    >{{
                      "d:   " +
                      ashiftdata[
                        data.day.split("-").slice(0, 3).join("") +
                          "#dmsf" +
                          data.day.split("-").slice(2).join("")
                      ]
                    }}</el-tag
                  >
                </div>
              </template>
              <template
                v-else
                style="background-color: gray; color: white; font-weight: bold"
              ></template>

              <!-- <p>{{ data.isSelected ? '✔️' : '' }}</p> -->
              <p
                v-if="data.isSelected && caldates.includes(data.day)"
                style="margin-top: -18px"
              >
                <el-select
                  v-model="saveshiftdata['d' + data.day.split('-').join('')]"
                  placeholder="请选择班次"
                  style="width: 100%; padding: 1px 1px; margin: -5px 1px"
                  size="small"
                >
                  <el-option
                    v-for="item in shiftlst"
                    :key="item.id"
                    :label="
                      item.sftid +
                      ':' +
                      item.sftdesc +
                      '[' +
                      item.in1 +
                      '--' +
                      item.out1 +
                      ']'
                    "
                    :value="item.sftid"
                  ></el-option>
                </el-select>
              </p>

              <p
                v-else
                style="
                  margin-top: -18px;
                  background-color: #fc7b2c;
                  font-size: 16px;
                  color: white;
                  border-radius: 5px;
                  display: inline-block;
                  width: 95%;
                "
              >
                {{ saveshiftdata["d" + data.day.split("-").join("")] }}
              </p>
              <p class="otlevgrp" v-if="caldates.includes(data.day)">
                <el-tooltip content="申请加班" placement="top">
                  <el-button
                    style="color: #67c23a"
                    @click.stop="cmd_ot(data.day)"
                    >+</el-button
                  ></el-tooltip
                >
                <el-tooltip content="申请请假" placement="top">
                  <el-button
                    style="color: #e6a23c"
                    @click.stop="cmd_lev(data.day)"
                    >-</el-button
                  ></el-tooltip
                >
              </p>
            </template>
          </el-calendar></el-config-provider
        >
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button v-if="form.istemplate == 0" @click="saveForm(1)"
              >保存为模版</el-button
            >
            <el-button v-else @click="saveForm(0)">取消该模版</el-button>
            <el-button @click="saveForm(-1)">保存</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
    <div>
      <el-dialog
        title="批 量 排 班"
        width="400px"
        v-model="dialogApplyTempsVisible"
      >
        <span>
          <el-select
            v-model="templateid"
            placeholder="请选择模板"
            style="width: 100%"
            @change="changeacc"
            size="default"
          >
            <el-option
              v-for="item in shifttemplates"
              :key="item.id"
              :label="
                item.cname +
                ' ' +
                item.shiftdate +
                ':[' +
                item.tempfrom +
                '-' +
                item.tempto +
                ']'
              "
              :value="item.id"
            ></el-option>
          </el-select>
        </span>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogApplyTempsVisible = false">取消</el-button>
            <el-button @click="batchshift()">运用模板</el-button>
          </span>
        </template>
      </el-dialog>
    </div>

    <div>
      <el-dialog v-model="dialogOTVisibility" title="申 请 加 班" width="800px">
        <otlist
          @closeotlistform="closeotlistform"
          :otfromdate="otlevfromdate"
          :fsysid="hrform.sysid"
        ></otlist>
      </el-dialog>
    </div>

    <div>
      <el-dialog
        v-model="dialogLEVVisibility"
        title="假 单 申 请"
        width="800px"
      >
        <levlist
          @closelevlistform="closelevlistform"
          :levfromdate="otlevfromdate"
          :fsysid="hrform.sysid"
        ></levlist>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { AX } from "../utils/api";
import { ref } from "vue";
import moment from "moment";
import $ from "jquery";
import { stopKQ } from "../utils/comdata";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import otlist from "../components/otlist.vue";
import levlist from "../components/levlist.vue";
import {
  useDeptPosStore,
  useDicStore,
  useUserStore,
  useEmidStore,
  useShiftStore,
} from "../store/index";

export default {
  components: { otlist, levlist },
  setup() {
    const deptstore = useDeptPosStore();
    const dicstore = useDicStore();
    const userstore = useUserStore();
    const emidstore = useEmidStore();
    const shiftstore = useShiftStore();
    return { deptstore, dicstore, userstore, emidstore, shiftstore };
  },
  data() {
    return {
      locale: zhCn,
      dplimit: [],
      fsysid: "123",
      hrData: {},
      calbdt: [],
      caldates: [],
      shifttmps: [],
      shifttmp: "-1", //因为select的默认是sysid，默认sysid是-1
      isstopkq: ref("0"),
      otlevfromdate: "",

      dialogOTVisibility: false,
      dialogLEVVisibility: false,
      //排班信息，从数据库里拿来
      ashiftdata: {},
      //保存的排班信息，从排班界面里得到
      saveshiftdata: {},
      shiftsysids: ref([]),

      multipleSelection: ref([]),
      shifttemplates: [],
      templateid: ref(""),

      loadingContent: "拼命加载中",
      loadingBackground: "rgba(0, 0, 0, 0.8)",

      tableData: [],
      roleData: [],

      selkqstafftype: [],

      pritemData: [],

      loading: false,
      deptVisible: false,

      dichrpropsData: [],
      deptChecked: [],

      dichktypeData: [],

      hrnewData: [],
      addvalue: [],

      shiftlst: [],

      dpData: [],
      dpList: [],
      dpProps: {
        label: "deptname",
        level: "deptlevel",
        children: "children",
      },

      inputsearch: "",
      counts: 1,
      cp1: 1,
      formLabelWidth: "200",

      kqinfo: {
        period: "202101",
        fromdate: "2021-01-01",
        todate: "2021-01-01",
        prgrp: "1",
        diffmons: 0,
        currperiod: "202101",
      },

      prtypes: [
        { code: "0", itemname: "发薪员工" },
        { code: "1", itemname: "停薪员工" },
      ],
      prtype: "0",

      cmppwd: "",

      dialogFormVisible: true,

      dialogAddVisible: false,

      dialogApplyTempsVisible: false,

      neworedit: true,

      //这只是初始化数据
      shiftdays: [{ id: "sf01", desc: "01" }],

      page: {
        limit: 12,
        cpg: 1,
        counts: 1,
      },
      s003: "1",
      shifttmpform: {},
      hrform: {
        emid: "",
        cname: "",
        sysid: "",
        datejoined: "",
      },
      form: {
        calperiod: "202401",
        fromdate: "2024-1-1",
        todate: "2024-1-31",
        if_stop: "",
        istemplate: "0",
        remark: "",
        s001: 0,
        s002: 0,
        s003: 0,
        s004: 0,

        h: {
          sysid: ref(""),
          dpname: "",
          dept: "",
          position: "",

          hrchecked: [],
          needshow: false,

          emid: "12345",

          cname: "",
          ename: "",
          sex: "0",
          grade: "",
          type: "",
          hrstatus: "",
          datejoined: "",
          regulardate: "",
          idcard: "530102199907111555",

          mtele: "",
          qq: "",
          wechat: "",
          email: "",
          marry: "",
          education: "",

          birth: "",
          birthmonth: "",
          lockid: "",
          mz: "",
          bank1: "",
          address: "",
          political: "",
          nation: "",

          school: "",
          speciality: "",
          serveryear: "",

          //probation:'',
          if_proba: "0",
          //probationdate:'',
          //probationenddate:'',
          probafrom: "",
          probato: "",

          prosalary: "0",

          confrom: "",
          conto: "",
          contype: "",

          consalary: "0",

          currsalary: "0",

          housefund: "",
          socialbase: "",
          socialid: "",

          locate: "",
          source: "",
          jjname: "",
          jjtele: "",
          jjmtele: "",
          jjpostcode: "",
          jjrelation: "",
          jjaddress: "",

          hktype: "",
          hkaddress: "",
          hkfield: "",
          remark: "",
          profileno: "",

          //------------------------------------------------
          //离职信息
          //------------------------------------------------

          checkoutremark: "",
          reqleavedate: "",
          holdays: "0",
          reqdays: "0",
          checkout: "",
          lastdate: "",
          accledate: "",
          acclhoursm: "0",
          aledate: "",
          alhoursm: "0",
          checkoutreason: ["-1"],
          checkouttype: ["-1"],
          checkoutchecked: ["-1"],
          ifcheckout: "0", //必须是0
          //-----------------------------------------------
        },
      },
      rules: {
        // emid: [{ required: true, message: '请输入 工号', trigger: 'blur' }],
        // jjname: [{ required: true, message: '请输入 紧急联系人', trigger: 'blur' }],
        // jjtele: [{ required: true, message: '请输入 紧急联系人电话', trigger: 'blur' }],
        // mtele: [{ required: true, message: '请输入 电话号码', trigger: 'blur' }],
        // cname: [{ required: true, message: '请输入 中文名', trigger: 'blur', min: 1, max: 32 }],
        // dpname: [{ required: true, message: '请输入 部门职位', trigger: 'blur' }],
        // idcard: [{ required: true, message: '请输入 身份证号(18位)', trigger: 'blur', min: 15, max: 18 }],
        // prosalary: [{
        //     required: true, message: '请输入 试用期工资', trigger: 'blur', pattern: /^(0(.)?\d+|[1-9]\d*(.)?\d*)$/,
        // }],
        // consalary: [{
        //     required: true, message: '请输入 合同工资', trigger: 'blur', pattern: /^(0(.)?\d+|[1-9]\d*(.)?\d*)$/,
        // }],
        // currsalary: [{
        //     required: true, message: '请输入 当前工资', trigger: 'blur', pattern: /^(0(.)?\d+|[1-9]\d*(.)?\d*)$/,
        // }],
        // serveryear: [{
        //     required: true, message: '请输入 入职前工龄月份数', trigger: 'blur', pattern: /^((0)([1-9]{1}[0-9]*))$/,
        // }],
        // housefund: [{
        //     required: true, message: '请输入 公积金基数', trigger: 'blur', pattern: /^(0(.)?\d+|[1-9]\d*(.)?\d*)$/,
        // }],
        // socialbase: [{
        //     required: true, message: '请输入 社保基数', trigger: 'blur', pattern: /^(0(.)?\d+|[1-9]\d*(.)?\d*)$/,
        // }],
      },

      checkoutrules: {
        // reqleavedate: [{ required: true, message: '请输入 离职申请日期', trigger: 'blur' }],
        // checkout: [{ required: true, message: '请输入 离职工作日', trigger: 'blur', }],
        // lastdate: [{ required: true, message: '请输入 最后工作日', trigger: 'blur', }],
        // accledate: [{ required: true, message: '请输入 积假到期日', trigger: 'blur', }],
        // aledate: [{ required: true, message: '请输入 年假到期日', trigger: 'blur', }],
        // acclhoursm: [{
        //     required: true, message: '请输入 结余积假小时数', trigger: 'blur', pattern: /^-?(0|0\.\d*|[1-9]\d*\.?\d*)$/,//正负数
        // }],
        // alhoursm: [{
        //     required: true, message: '请输入 结余年假小时数', trigger: 'blur', pattern: /^-?(0|0\.\d*|[1-9]\d*\.?\d*)$/,//正负数
        // }],
      },
    };
  },
  computed: {
    // s33() { return this.form.s015 }
  },
  mounted() {
    /**
     * 必须在这里初始化日历控件的日期区间，否则排班的弹出框报错
     */
    //   this.calbdt = [new Date(2023, 12, 21), new Date(2024, 1, 20)];

    /**这里必须定义为假，默认情况是真，真的意思是让他显示至少一次，这样可以吧组件构建完成，不会导致第一次打开的时候是空 */
    this.dialogFormVisible = false;
    /***************************************************************** */
    this.getdic();
  },
  watch: {
    // form(val) {
    // }
  },
  methods: {
    cusRules() {
      let done = true;
      for (let ele of this.pritemData) {
        const reg = /[sS]{1}\d{3}/g;
        const moneyreg =
          /(^[1-9]([0-9]+)?(\.[0-9]{1,4})?$)|(^(0){1}$)|(^(0){1}\.[0-9]+$)|(^[0-9]\.[0-9]([0-9])?$)/;
        if (ele.prid.match(reg)) {
          let v = this.form[ele.prid];
          if (!v.match(moneyreg) && !ele.prfur) {
            $("#" + ele.prid).css("background-color", "red");
            done = false;
            break;
          } else if (v.match(moneyreg) && !ele.prfur) {
            $("#" + ele.prid).css("background-color", "white");
          }
        }
      }
      return done;
    },

    changeprtype() {
      this.listMain();
    },

    changeacc() {
      // console.log(this.form)
    },

    check() {
      this.deptChecked.splice("0", this.deptChecked.length);
      this.deptChecked = this.$refs.deptTree.getCheckedNodes();
    },

    newdeptnodeclick(data) {
      console.log(data);
      if (data.is_pos == 1) {
        this.deptVisible = false;
        this.form.dpname = data.dpname;
        this.form.dept = data.fid;
        this.form.position = data.dpid;
      }
    },
    test() {
      console.log("deptvisible:", this.deptVisible);
      this.deptVisible = !this.deptVisible;
    },
    handleDelete(idx, row, if_stop) {
      let if_stop_mesg = "停发";
      if (if_stop == "0") {
        if_stop_mesg = "发放";
      }

      this.$confirm(
        "此操作将" + if_stop_mesg + "该人当月的薪资, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          AX("patch", "/prstaff/" + row.id, { if_stop: if_stop }).then(
            (res) => {
              if (res) {
                this.listMain();
              }
            }
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    handleSelectionChange(val) {
      this.multipleSelection.value = val;
      console.log(this.multipleSelection);
    },
    saveForm(istemplate) {
      //  let data = [];

      // console.log(this.saveshiftdata);
      // console.log(this.ashiftdata);
      const currdate = moment().format("YYYY-MM-DD");
      Object.keys(this.saveshiftdata).forEach((k) => {
        let dt = moment(k.substring(1)).format("YYYY-MM-DD");
        let diffdays = moment(currdate).diff(dt, "day");
        let sf = k.substring(1) + "#sf" + k.substring(7);
        let msf = k.substring(1) + "#msf" + k.substring(7);
        let dmsf = k.substring(1) + "#dmsf" + k.substring(7);
        // console.log(
        //   k,
        //   currdate,
        //   dt,
        //   diffdays,
        //   sf,
        //   msf,
        //   dmsf,
        //   this.saveshiftdata[k]
        // );

        if (diffdays < 0) {
          //未来
          this.ashiftdata[sf] = this.saveshiftdata[k];
        } else {
          //过去
          if (this.ashiftdata[sf]) {
            this.ashiftdata[dmsf] = "改";
          } else {
            this.ashiftdata[dmsf] = "补";
          }
          this.ashiftdata[msf] = this.saveshiftdata[k];
        }
      });

      // console.log(this.ashiftdata);

      let aft = this.kqinfo.fromdate.split("-").slice(0, 2).join("");
      let att = this.kqinfo.todate.split("-").slice(0, 2).join("");

      const a = {};
      const b = {};

      for (let dt of [aft, att]) {
        Object.keys(this.ashiftdata).forEach((k) => {
          // console.error(dt, k);
          if (dt == k.substring(0, dt.length)) {
            var reg = /\d+(.*)#/gim;
            if (dt == aft) {
              a[k.replace(reg, "")] = this.ashiftdata[k];
            }
            if (dt == att) {
              b[k.replace(reg, "")] = this.ashiftdata[k];
            }
          }
        });
      }
      // console.log(a, b);

      //------------------------------------------------------
      //默认保存按钮不做任何模版处理，原来是模块的就是，原来不是的仍然不是。
      //模版一定是1，取消模版后一定是0，（0）也是默认。-1为不做模版处理。
      if (istemplate == 1) {
        //3月表示3月1日到3月31日，也可以表示为 3月21日到4月20日。
        a.istemplate = istemplate;
        a.tempfrom = this.kqinfo.fromdate;
        a.tempto = this.kqinfo.todate;
        //firstmonth就行了，secondmonth默认，也许他是下一个月的模版月。
      }
      //-------------------------------------------------------

      let updatedata = [];
      updatedata.push(a);
      updatedata.push(b);

      console.log(updatedata);

      AX("post", "kqinfo/updateashift", updatedata).then((res1) => {
        if (res1) {
          console.log(res1);

          this.dialogFormVisible = false;
          //this.addvalue = [];
          this.listMain();
        }
      });
    },

    cmd_ot(fromdate) {
      this.otlevfromdate = fromdate;
      this.dialogOTVisibility = true;
      console.log("ot", fromdate);
    },
    cmd_lev(fromdate) {
      this.otlevfromdate = fromdate;
      this.dialogLEVVisibility = true;
      console.log("lev", fromdate);
    },

    batchshift() {
      const uptdata = [];
      for (let i = 0; i < this.multipleSelection.value.length; i++) {
        //这里必须判断是否是模板，如果本身是模板的数据，是不加入到批量处理里的

        if (
          this.shiftsysids.includes(this.multipleSelection.value[i].sysid) !=
          true
        ) {
          uptdata.push(this.multipleSelection.value[i].sysid);
        }
      }

      console.log(
        this.templateid,
        this.multipleSelection.value.length,
        uptdata
      );
      AX("post", `kqinfo/batch/${this.templateid}`, uptdata).then((res1) => {
        if (res1) {
          console.log(res1);

          this.dialogApplyTempsVisible = false;
          //this.addvalue = [];
          this.listMain();
        }
      });
    },

    activeActivity(stopkq, idx, row) {
      console.log(stop, idx, row);
      AX("patch", `hrinfo/${row.id}`, { stopkq }).then((res1) => {
        if (res1) {
          this.listMain();
        }
      });
    },

    changeshiftdate(mons) {
      let ft = this.kqinfo.fromdate.split("-").slice(0, 2).join("");
      let tt = this.kqinfo.todate.split("-").slice(0, 2).join("");
      console.log(ft, tt);
      //获取一个月的实际天数
      //let fdays = moment(ft, 'YYYYMM').daysInMonth();
      //let tdays = moment(tt, 'YYYYMM').daysInMonth();
      //这表示跨月
      if (ft != tt) {
        //首先获得变更的月度。
        console.log(this.kqinfo.fromdate);

        let period = moment(this.kqinfo.period)
          .add(mons, "month")
          .format("YYYYMM");
        let fromdate = moment(this.kqinfo.fromdate)
          .add(mons, "month")
          .format("YYYY-MM-DD");
        let todate = moment(this.kqinfo.todate)
          .add(mons, "month")
          .add(0, "day")
          .format("YYYY-MM-DD");

        this.kqinfo.period = period;
        this.kqinfo.fromdate = fromdate;
        this.kqinfo.todate = todate;

        this.kqinfo.diffmons =
          parseInt(this.kqinfo.period) - parseInt(this.kqinfo.currperiod);

        this.listMain();
      } else {
        //这里需要处理日期，如果是同一个月的，那么就是1号到月底。但一般设置的话，是1号到下个月15号。
        //如果是跨月的话，一般就是这个21到下个月20，最好到月底。都多15天。
        //这里没处理，标记一下，先确定周期怎么拿再确定。
        let fromdate = moment(this.kqinfo.fromdate)
          .add(mons, "month")
          .format("YYYY-MM-DD");
        let todate = moment(this.kqinfo.fromdate)
          .add(mons + 1, "month")
          .add(-1, "day")
          .format("YYYY-MM-DD");

        let period = moment(fromdate).format("YYYYMM");

        this.kqinfo.period = period;
        this.kqinfo.fromdate = fromdate;
        this.kqinfo.todate = todate;
        this.listMain();
      }
    },

    formatisstop(row) {
      return row.is_stop == 0 ? "No" : "STOP";
    },

    handleEdit(index, row) {
      this.hrform.emid = row.emid;
      this.hrform.cname = row.cname;
      this.hrform.datejoined = row.datejoined;
      this.hrform.sysid = row.sysid;

      this.needshow = true;
      //必须是-1，否则模版下拉框会默认上一个操作
      this.shifttmp = "-1";
      //这是保存的数据，必须清空。
      this.saveshiftdata = [];
      this.shiftlst = [];

      let block = {};

      block.fromdate = this.kqinfo.fromdate;
      block.todate = this.kqinfo.todate;

      block.sysid = row.sysid;

      block = encodeURI(JSON.stringify(block));

      this.shiftlst = this.shiftstore.getsftByDept(row.dept);

      // console.log("--------------------------------", this.shiftlst, row.dept);
      AX("get", `kqinfo/ashift/info?block=${block}`).then((res) => {
        if (res && res.total > 0) {
          this.neworedit = false;
          this.ashiftdata = {};

          for (let i = 0; i < res.total; i++) {
            Object.keys(res.data[i]).forEach((K) => {
              let k = res.data[i]["shiftdate"] + "@" + K + "#" + K;
              let v = res.data[i][K];
              k = k.replace(/(@sf)|(@msf)|(@dmsf)|(@msts)/gim, "");

              this.ashiftdata[k] = v;
            });
          }

          console.log(this.ashiftdata);
        }
        this.loading = false;
        this.dialogFormVisible = true;
      });
    },

    changeshifttmp() {
      let tmp = this.shifttmp;

      if (tmp == -1) {
        return;
      }
      for (let s of this.shifttmps) {
        if (s.sysid == this.shifttmp) {
          this.shifttmpform = Object.assign({}, s);

          /**
           * 一下内容必须排除掉，实际上应该是通过日期赋值
           */
          this.shifttmpform.sysid = this.form.sysid;
          this.shifttmpform.shiftdate = this.form.shiftdate;
          this.shifttmpform.istemplate = this.form.istemplate;
          this.shifttmpform.remark = this.form.remark;
          this.shifttmpform.h = this.form.h;

          this.page.cpg = 1;

          this.form = Object.assign({}, this.shifttmpform);

          break;
        }
      }
    },

    changePage(idx) {
      this.page.cpg = idx;
      this.listMain();
    },

    loadTemplate() {
      const diffdays = moment(this.kqinfo.todate).diff(
        this.kqinfo.fromdate,
        "day"
      );
      for (let i = 0; i <= diffdays; i++) {
        let obj = {};
        obj.has = 0;
        obj.date = moment(this.kqinfo.fromdate)
          .add(i, "day")
          .format("YYYY-MM-DD");

        this.caldates.push(obj.date);
      }

      // console.log("-------------------------------------------", this.kqinfo);

      this.calbdt = [
        moment(this.kqinfo.fromdate).format("YYYY-MM-DD"),
        moment(this.kqinfo.todate).format("YYYY-MM-DD"),
      ];
    },

    getdic(type = "hr") {
      this.loading = true;

      this.kqinfo.period = this.userstore.getperiod("kq").period;
      this.kqinfo.currperiod = this.userstore.getperiod("kq").period;
      this.kqinfo.fromdate = this.userstore.getperiod("kq").sdate;
      this.kqinfo.todate = this.userstore.getperiod("kq").edate;

      if (type == "hr") {
        this.selkqstafftype = stopKQ;
        // AX("get", "/dicm/hrgrade")
        //   .then((res) => {
        //     this.dichrgradeData = res.data;
        //     // console.log(res.data)
        //     //this.showdesc(res.data, 'hrgrade_13', 'itemid', 'itemname')
        //     // console.log(res.data.dicDescs('hrgrade_13'));
        //   })
        //   .catch((e) => console.log(e.message));
        this.dichrgradeData = this.dicstore.getDic("hrgrade");

        // AX("get", "/dicm/hrtype")
        //   .then((res) => {
        //     this.dichrtypeData = res.data;
        //   })
        //   .catch((e) => console.log(e.message));

        this.dichrtypeData = this.dicstore.getDic("hrtype");

        // AX("get", "/dicm/hrstatus")
        //   .then((res) => {
        //     this.dichrstatusData = res.data;
        //   })
        //   .catch((e) => console.log(e.message));

        this.dichrstatusData = this.dicstore.getDic("hrstatus");

        // AX("get", "/dept")
        //   .then((res) => {
        //     this.dpData = res.data;
        //     this.flattenTree(res.data);
        //   })
        //   .catch((e) => console.log(e.message));

        this.dpData = this.deptstore.deptposData.data;
        this.flattenTree(this.dpData);
        // AX("get", "/dicm/hrprops")
        //   .then((res) => {
        //     this.dichrpropsData = res.data;
        //   })
        //   .catch((e) => console.log(e.message));
        this.dichrpropsData = this.dicstore.getDic("hrporps");

        //这里是暂时的数据，以后必须通过调用来获取信息。

        // const sysyear = 2024;
        // const sysmonth = 1;

        // let kqperiod = 0;
        // if (kqperiod == 1 || kqperiod == 0) {
        //   kqperiod = 1;
        // }

        // const currdate = sysyear + "-" + sysmonth + "-" + kqperiod;
        // this.kqinfo.currperiod = moment(currdate).format("YYYYMM");
        // if (kqperiod > 1) {
        //   this.kqinfo.fromdate = moment(currdate)
        //     .add(-1, "month")
        //     .format("YYYY-MM-DD");
        //   this.kqinfo.todate = moment(currdate)
        //     .add(-1, "day")
        //     .endOf("month")
        //     .format("YYYY-MM-DD");
        // } else {
        //   this.kqinfo.fromdate = moment(currdate).format("YYYY-MM-DD");
        //   this.kqinfo.todate = moment(currdate)
        //     .add(1, "month")
        //     .add(15, "day")
        //     .format("YYYY-MM-DD");
        // }
        this.loadTemplate();
      }

      this.loading = false;
    },

    async tree(data, val, id, descs) {
      if (!val) {
        return;
      }
      let r = "";
      for (let item of data) {
        console.log("tree:", val, item[id]);
        if (val != item[id]) {
          if (item.children) {
            await this.tree(item.children, val, id, descs);
          }
        } else {
          // console.log('find.......................' + item[descs])
          r = item[descs];
          return item[descs];
          //break;
        }
        break;
      }

      return r;
    },

    flattenTree(treedata) {
      for (let item of treedata) {
        let node = {};
        node.dpid = item.deptid;
        node.dpname = item.deptname;
        node.fid = item.fid;
        node.is_pos = item.deptlevel == 2 ? true : false;
        node.posgrade = "1";

        this.dpList.push(node);
        if (item.children) {
          this.flattenTree(item.children);
        }
      }
    },

    cmd_batchshift() {
      // console.log(this.multipleSelection, this.multipleSelection.value);
      if (this.multipleSelection.value) {
        this.dialogApplyTempsVisible = true;
      } else {
        this.$message({
          message: "请勾选需要被批量设置的人员！",
          type: "warning",
        });
      }
    },

    freemonths(data, ft, tt, fday, fdays, fm, tday, tm) {
      let tableData = data;

      // console.log(tableData);

      let newtabledata = [];

      let staffset = new Set();

      for (let s of tableData) {
        staffset.add(s.sysid);
      }

      //---------------------
      // let firstshifttmp = {
      //     sysid: '-1',
      //     shiftdate: this.kqinfo.period,
      //     h: {
      //         cname: '空',
      //     }
      // };
      // this.shifttmps.push(firstshifttmp);

      //--------------------------
      if (ft != tt) {
        let istemplate = 0;

        for (let s of staffset) {
          let newdata = {};
          for (let i in tableData) {
            if (s == tableData[i].sysid) {
              //如果是开始月份；
              if (tableData[i].shiftdate == ft) {
                newdata.h = tableData[i]["h"];

                for (let d = fday; d <= fdays; d++) {
                  let sd = "00" + d;
                  sd = sd.substr(sd.length - 2, 2);

                  newdata["d" + fm + sd] = tableData[i]["sf" + sd];
                }
                //只需要考虑首月，跨月中的不需要考虑。
                istemplate = tableData[i].istemplate;
                newdata.istemplate = istemplate;
                //-------------------------------------------
              }
              if (tableData[i].shiftdate == tt) {
                newdata.h = tableData[i]["h"];

                for (let d = 1; d <= tday; d++) {
                  let sd = "00" + d;
                  sd = sd.substr(sd.length - 2, 2);

                  //  console.log(sd);

                  newdata["d" + tm + sd] = tableData[i]["sf" + sd];
                }
              }
            }
          }
          newdata.shiftdate = this.kqinfo.period;
          newdata.sysid = s;
          newtabledata.push(newdata);
          // console.log(newdata, ft, tt, tday)

          // //如果是
          // if (istemplate == 1) {
          //     console.log(this.shifttmps
          //     )
          //     this.shifttmps.push(newdata);
          // }
        }

        // this.tableData = newtabledata;
        return newtabledata;
      }
    },

    closedialog() {
      this.needshow = false;
    },

    closeotlistform() {
      this.dialogOTVisibility = false;
    },
    closelevlistform() {
      this.dialogLEVVisibility = false;
    },

    listMain() {
      //  console.log('33333333333333')
      // this.shiftsysids.splice(0, this.shiftsysids.length);
      //  let api = ''
      if (this.deptChecked.length < 1) {
        this.$message.error("请选择需要查询的部门！");
        return;
      }

      // if (!this.kqinfo.prgrp) {
      //   //  this.$message.error('请选择薪资帐套！');
      const sobj = {};
      sobj.fromdate = this.kqinfo.fromdate;
      sobj.todate = this.kqinfo.todate;
      const tmppage = 1;
      const tmppagesize = 1000;

      //这里没必要处理，一般就3到5条数据。
      //当然也要仔细考虑，后面再考虑也行。
      AX(
        "get",
        "kqinfo/ashift/template?page=" +
          tmppage +
          "&pagesize=" +
          tmppagesize +
          "&block=" +
          encodeURI(JSON.stringify(sobj))
      ).then((res) => {
        if (res && res.total >= 0) {
          this.shifttemplates = [];
          this.shiftsysids = [];
          this.shifttemplates = res.data;
          res.data.forEach((e) => {
            this.shiftsysids.push(e.sysid);
          });
          console.log(this.shiftsysids);
        }
      }); //   //  return;
      // }

      this.loadingContent = "拼命加载中";
      this.loadingBackground = "rgba(0, 0, 0, 0.8)";
      this.loading = true;
      let block = {};

      let depts = [];

      this.deptChecked.forEach((item) => {
        depts.push(item.deptid);
      });

      block.dept = depts;
      block.stopkq = this.isstopkq;
      block.shiftdate = this.kqinfo.period;
      block.fromdate = this.kqinfo.fromdate;
      block.todate = this.kqinfo.todate;
      block.name = this.inputsearch;
      block = encodeURI(JSON.stringify(block));

      AX(
        "get",
        "kqinfo?page=" +
          this.page.cpg +
          "&pagesize=" +
          this.page.limit +
          "&block=" +
          block
      ).then((res) => {
        if (res && res.total >= 0) {
          this.tableData = [];
          this.tableData = res.data;
          this.page.counts = res.total;
        }

        //   this.page.counts = res.data.count / 2;
        //console.log(this.page.count)
        //   this.tableData = this.freemonths(
        //     res.data.rows,
        //     ft,
        //     tt,
        //     fday,
        //     fdays,
        //     fm,
        //     tday,
        //     tm
        //   );
        //  console.log('1111111111111', res)
        //获取模版，id==-1;
        //   AX("get", "/kqinfo/35/1/" + block + "/").then((res2) => {
        //     if (res2) {
        //       this.shifttmps = [];
        //       this.shifttmps = this.freemonths(
        //         res2.data,
        //         ft,
        //         tt,
        //         fday,
        //         fdays,
        //         fm,
        //         tday,
        //         tm
        //       );
        //       // console.log('2@@@@@@@@@@@@@@@@@@@@@@@@@', this.shifttmps);
        //       let firstshifttmp = {
        //         sysid: "-1",
        //         shiftdate: this.kqinfo.period,
        //         h: {
        //           cname: "空",
        //         },
        //       };
        //       this.shifttmps.push(firstshifttmp);
        //     }
        //   });
        // }

        //--------------------------

        // this.tableData.forEach(item => {

        //     console.log(item.h.birth)

        // })

        //非常非常重要，在有自定义dom下，又是弹出框下进行操作这些dom，利用form是不能自动读取内容的
        //这里目前用jquery的方法非常好用。
        // if (this.form.sysid) {
        //   //更新form，如果有弹出框的情况下，必须更新。
        //   for (let item of this.tableData) {
        //     if (item.sysid == this.form.sysid) {
        //       for (let i in item) {
        //         this.form[i] = item[i];
        //         // console.log(i)
        //       }
        //       break;
        //     }
        //   }
        // }

        //=========================================================================
        this.loadTemplate();
        this.loading = false;
      });
    },
  },
};
</script>
<style scoped>
.transfer {
  color: red;
  text-align: left;
}

.input-with-select {
  width: 360px;
  margin-left: 10px;
}
div.el-calendar-day {
  padding: 0px;
  background-color: red;
  border: 0;
  color: red;
}
.iscompany {
  padding: 2px 6px;
  cursor: pointer;
  font-size: 12px;
  background-color: rgb(0 107 255 / 59%);
  color: rgb(250, 250, 250);
  border: 0;
}
.isdept {
  padding: 2px 6px;
  cursor: pointer;
  font-size: 12px;
  background-color: transparent;
  border: 0;
  color: rgb(66 66 66 / 71%);
}
.ispos {
  padding: 2px 6px;
  cursor: pointer;
  font-size: 12px;

  color: rgb(167 167 167);
  background-color: #5192eb1a;
}
.el-divider i {
  color: #409eff;
}
.pdmsg {
  margin-left: 1px;
  background-color: none;
  color: rgb(192, 192, 192);
  font-weight: normal;
  font-size: 12px;
}

.companyflag {
  margin-left: 1px;
  color: #ebb563;
  font-weight: normal;
  font-size: 14px;
}

.selectdt_hid {
  visibility: hidden;
}
.otlevgrp {
  display: flex;
  justify-content: right;
  float: right;
}
.otlevgrp .el-button {
  margin: 1px;
  background-color: #f7f7f7;
  border: 1;
  height: 0;
  width: 0;
}
</style>
