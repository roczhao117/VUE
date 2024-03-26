<template>
  <div>
    <!-- 查询头 -->

    <div style="display: flex; margin: 1px 1px 10px">
      <span
        type="info"
        style="font-size: 24px; padding-top: 2px; height: 32px; color: gray"
        >当前薪资周期: {{ prinfo.period }}</span
      >
      <span style="margin-left: 20px">
        <el-select
          v-model="prinfo.prgrp"
          placeholder="请选择参考周期"
          style="width: 100%"
        >
          <el-option
            v-for="item in dicpraccountgrp"
            :key="item.code"
            :label="item.itemname"
            :value="item.code"
          ></el-option>
        </el-select>
      </span>
    </div>
    <div style="display: flex; margin: 1px; margin-right: 20px">
      <el-tooltip content="与上月薪资周期数据对比" placement="top">
        <el-button type="primary" icon="el-icon-plus" @click="compared(1)"
          >对比上期</el-button
        >
      </el-tooltip>
      <el-tooltip content="与去年同期数据对比" placement="top">
        <el-button type="primary" icon="el-icon-plus" @click="compared(2)"
          >对比去年同期</el-button
        >
      </el-tooltip>
      <el-tooltip content="自定义周期对比" placement="top">
        <el-button type="primary" icon="el-icon-plus" @click="compared(3)"
          >自定义周期对比</el-button
        >
      </el-tooltip>
      <el-tooltip content="刷新数据" placement="top">
        <el-button
          type="primary"
          icon="el-icon-refresh"
          @click="listMain()"
        ></el-button>
      </el-tooltip>
      <el-input
        placeholder="查询内容"
        v-model="inputsearch"
        class="input-with-select"
        v-on:keydown.enter="listMain()"
      >
        <template #append>
          <el-button icon="el-icon-search" @click="listMain()">查询</el-button>
        </template>
      </el-input>
      <el-tooltip content="高级查询" placement="top">
        <el-button
          type="primary"
          icon="el-icon-view"
          @click="cmd_moresearch"
          style="margin-left: 20px"
        ></el-button>
      </el-tooltip>
    </div>
    <!-- 人事表格子 -->
    <div style="display: flex; margin-top: 10px; height: 650px">
      <div style="border-right: 0px solid rgb(239, 239, 239); margin-left: 1px">
        <el-tree
          :data="dpData"
          show-checkbox
          node-key="id"
          ref="deptTree"
          :props="dpProps"
          :default-expand-all="true"
          @check="check"
          style="width: 250px; overflow-x: scroll; height: 715px"
        >
          <template #default="{ node, data }">
            <span :class="{ ispos: data.is_pos == 1 }">
              {{ node.label }}
              <span class="pdmsg" v-if="data.is_pos == 1">职位</span>

              <span class="pdmsg" v-else>部门</span>
            </span>
          </template>
        </el-tree>
      </div>
      <div style="margin-left: 20px; width: 100%; min-width: 800px">
        <el-table
          :data="tableData"
          style="width: 95%"
          v-loading="loading"
          :element-loading-text="loadingContent"
          element-loading-spinner="el-icon-loading"
          :element-loading-background="loadingBackground"
          stripe
        >
          <el-table-column prop="id" fixed width="80" type="index">
            <template #default="scope">
              <span>{{
                (page.cpg - 1) * page.limit + (scope.$index + 1)
              }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="h.emid"
            label="工号"
            width="100"
          ></el-table-column>

          <el-table-column
            prop="comptype"
            fixed="left"
            label="对比类型"
            width="80"
          >
            <template #default="scope">
              <span v-if="scope.row.comptype == 1">增</span>
              <span v-else-if="scope.row.comptype == -1" type="danger">停</span>
              <span v-else></span>
            </template>
          </el-table-column>
          <el-table-column
            prop="h.cname"
            fixed="left"
            label="中文名"
            width="80"
          ></el-table-column>

          <el-table-column
            prop="h.ename"
            label="英文名"
            width="120"
          ></el-table-column>
          <el-table-column prop="h.sex" label="性别" width="60">
            <template #default="scope">
              <span v-if="scope.row.sex == 1">男</span>

              <span v-else>女</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="h.datejoined"
            label="入职日期"
            width="100"
          ></el-table-column>

          <el-table-column
            prop="h.regualdate"
            label="转正日期"
            width="100"
          ></el-table-column>
          <el-table-column prop="h.type" label="类型" width="120">
            <template #default="scope">
              <span>{{ dichrtypeData.dicDescs(scope.row.h.type) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="h.grade" label="级别" width="60">
            <template #default="scope">
              <span>{{ dichrgradeData.dicDescs(scope.row.h.grade) }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="h.ifcheckout"
            :formatter="formatisstop"
            width="120"
            show-overflow-tooltip
            label="离职状态"
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
            prop="h.reqleavedate"
            label="离职申请日期"
            width="120"
          ></el-table-column>
          <el-table-column
            prop="h.checkout"
            label="最后工作日"
            width="100"
          ></el-table-column>
          <el-table-column prop="calperiod" label="停薪周期" width="100">
            <template #default="scope">
              <span v-if="scope.row.if_stop == '1'">{{
                scope.row.calperiod
              }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="h.bank1"
            label="银行卡号"
            width="180"
          ></el-table-column>
          <el-table-column
            prop="h.idcard"
            label="身份证号"
            width="180"
          ></el-table-column>

          <el-table-column
            prop="h.currsalary"
            label="当前工资"
            width="100"
          ></el-table-column
          >>
          <el-table-column
            v-for="pritem in pritemData"
            :key="pritem.prid"
            :prop="pritem.prid"
            :label="pritem.prname"
            width="120"
          >
            <template #default="scope">
              <span v-if="scope.row.if_stop == '1'">-</span>
              <span v-else>{{ scope.row[pritem.prid] }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="source_period"
            label="对比月份"
            width="120"
          ></el-table-column>
          <el-table-column
            prop="target_period"
            label="参考月份"
            width="120"
          ></el-table-column>

          <el-table-column prop="id" fixed="right" label="操作" width="120">
            <template #default="scope">
              <span class="butgrp">
                <el-button
                  size="mini"
                  icon="el-icon-edit"
                  @click="handleEdit(scope.$index, scope.row)"
                  v-if="scope.row.if_stop == 0"
                ></el-button>
                <el-tooltip
                  content="停止薪资"
                  placement="top"
                  v-if="scope.row.if_stop == 0"
                >
                  <el-button
                    size="mini"
                    type="danger"
                    icon="el-icon-video-pause"
                    @click="handleDelete(scope.$index, scope.row, 1)"
                  ></el-button>
                </el-tooltip>
                <el-tooltip
                  content="发放薪资"
                  placement="top"
                  v-if="scope.row.if_stop == 1"
                >
                  <el-button
                    size="mini"
                    type="success"
                    icon="el-icon-caret-right"
                    @click="handleDelete(scope.$index, scope.row, 0)"
                  ></el-button>
                </el-tooltip>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 翻页控件 -->
    <div style="margin-top: 25px">
      <el-pagination
        background
        layout="total,prev, pager, next"
        :page-size="page.limit"
        @current-change="changePage"
        :current-page="page.cp1"
        :total="page.counts"
      ></el-pagination>
    </div>
    <!-- 人事表单 -->
    <div class="dialogform">
      <el-dialog title="薪酬信息" width="1000px" v-model="dialogFormVisible">
        <el-form
          :rules="rules"
          :model="form"
          ref="form"
          class="margin:0 20px;display:flex;"
        >
          <el-row :gutter="20">
            <el-col :span="6">
              <div>
                <el-form-item
                  label="工号"
                  :label-width="formLabelWidth"
                  prop="emid"
                >
                  <el-input
                    size="medium"
                    :disabled="!neworedit"
                    v-model="form.h.emid"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item
                  label="中文名"
                  :label-width="formLabelWidth"
                  prop="cname"
                >
                  <el-input
                    size="medium"
                    v-model="form.h.cname"
                    :disabled="!neworedit"
                    autocomplete="off"
                    prefix-icon="el-icon-edit"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="英文名" :label-width="formLabelWidth">
                  <el-input
                    size="medium"
                    v-model="form.h.ename"
                    :disabled="!neworedit"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item
                  label="入职日期"
                  :label-width="formLabelWidth"
                  prop="datejoined"
                >
                  <el-input
                    size="medium"
                    v-model="form.h.datejoined"
                    :disabled="!neworedit"
                    autocomplete="off"
                    prefix-icon="el-icon-edit"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <div>
                <el-form-item
                  label="身份证号"
                  :label-width="formLabelWidth"
                  prop="idcard"
                >
                  <el-input
                    size="medium"
                    v-model="form.h.idcard"
                    :disabled="!neworedit"
                    autocomplete="off"
                    prefix-icon="el-icon-edit"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item
                  label="银行卡号"
                  :label-width="formLabelWidth"
                  prop="idcard"
                >
                  <el-input
                    size="medium"
                    v-model="form.h.bank1"
                    :disabled="!neworedit"
                    autocomplete="off"
                    prefix-icon="el-icon-edit"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="当前工资" :label-width="formLabelWidth">
                  <el-input
                    size="medium"
                    :disabled="!neworedit"
                    v-model="form.h.currsalary"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="4" v-for="item in pritemData" :key="item.prid">
              <div>
                <el-form-item
                  :label="item.prname + '[' + item.prid + ']'"
                  :label-width="formLabelWidth"
                  :prop="item.prid"
                  :key="item.prid"
                >
                  <el-input
                    v-model="form[item.prid]"
                    :ref="item.prid"
                    :id="item.prid"
                    size="medium"
                    :disabled="item.prfur != ''"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="24"></el-row>

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
            <el-button type="success" @click="calculateforsysid"
              >试 算</el-button
            >
            <el-button type="primary" @click="savepritemvalForm"
              >确 定</el-button
            >
          </span>
        </template>
      </el-dialog>
    </div>
    <!-- 人事新人表单 -->
    <div>
      <el-dialog
        title="自定义周期对比"
        width="630px"
        v-model="dialogComparedCustomVisible"
      >
        <el-switch
          v-model="prinfo.ishist"
          inactive-color="#13ce66"
          inactive-text="当月比历史"
          active-color="#ff4949"
          active-text="历史比历史"
        ></el-switch>
        <div style="margin-top: 10px">
          <label>
            原始周期
            <el-select
              v-model="prinfo.fromperiod"
              placeholder="请选择原始周期"
              size="small"
              style="margin: 10px 0"
              :disabled="!prinfo.ishist"
            >
              <el-option
                v-for="item in dicprsum1"
                :key="item.code"
                :label="item.itemname"
                :value="item.code"
                :disabled="!prinfo.ishist"
              ></el-option>
            </el-select>
          </label>
        </div>
        <div style="margin-top: 10px">
          <label>
            目标周期
            <el-select
              v-model="prinfo.toperiod"
              placeholder="请选择目标周期"
              size="small"
              style="margin: 10px 0"
            >
              <el-option
                v-for="item in dicprsum1"
                :key="item.code"
                :label="item.itemname"
                :value="item.code"
              ></el-option>
            </el-select>
          </label>
        </div>

        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogComparedCustomVisible = false"
              >取 消</el-button
            >
            <el-button type="primary" @click="saveForm">确 定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { AX } from "../utils/api";
import { ref } from "vue";
import * as moment from "moment";
import $ from "jquery";
import {
  useDeptPosStore,
  useDicStore,
  useUserStore,
  useEmidStore,
  usePermissionStore,
  useRightStore,
} from "../store/index";
export default {
  setup() {
    const deptstore = useDeptPosStore();
    const dicstore = useDicStore();
    const userstore = useUserStore();
    const emidstore = useEmidStore();
    const pmsStore = usePermissionStore();
    const rightstore = useRightStore();
    return { deptstore, dicstore, userstore, emidstore, pmsStore, rightstore };
  },
  data() {
    return {
      dplimit: [],
      fsysid: "123",
      hrData: {},

      loadingContent: "拼命加载中",
      loadingBackground: "rgba(0, 0, 0, 0.8)",

      tableData: [],
      roleData: [],
      familyData: [],

      pritemData: [],

      loading: false,
      deptVisible: false,

      dichrgradeData: [],
      dichrtypeData: [],
      dichrstatusData: [],
      dichreducationData: [],
      dichrmarryData: [],
      diccontypeData: [],
      dichrsurData: [],
      diccerttypeData: [],
      dichrpropsData: [],

      dichrpoliticalData: [],
      dichrcheckedData: [],

      dicprsum1: [],

      checkoutcheckedData: [],
      checkouttypeData: [],
      checkoutreasonData: [],

      hrcheckedshow: [],
      deptChecked: [],

      dichktypeData: [],

      hrnewData: [],
      addvalue: [],
      dicpraccountgrp: [],

      dpData: [],
      dpList: [],
      deptData: [],
      dpProps: {
        label: "deptname",
        level: "deptlevel",
        children: "children",
      },

      inputsearch: "",
      counts: 1,
      cp1: 1,
      formLabelWidth: "200",

      prinfo: {
        period: "202101",
        fromdate: "2021-01-01",
        todate: "2021-01-01",
        prgrp: "1",

        fromperiod: "202101",
        toperiod: "202101",
        ishist: false,
      },

      prtypes: [
        { code: "0", itemname: "发薪员工" },
        { code: "1", itemname: "停薪员工" },
      ],
      prtype: "0",

      cmppwd: "",

      // dialogFormVisible: true,

      // dialogCheckoutVisible: false,
      // dialogFamilyVisible: false,
      // dialogWorksVisible: false,
      // dialogEducationVisible: false,
      // dialogCertVisible: false,
      // dialogContractVisible: false,
      // dialogPPVisible: false,
      // dialogTransformVisible: false,
      // dialogAwardVisible: false,
      // dialogOTlistVisible: false,
      // dialogLevlistVisible: false,
      // dialogMSVisible: false,

      dialogComparedCustomVisible: false,

      neworedit: true,

      page: {
        limit: 10,
        cpg: 1,
        counts: 1,
      },
      s003: "1",
      form: {
        calperiod: "",
        fromdate: "",
        todate: "",
        if_stop: "",
        remark: "",
        s001: 0,
        s002: 0,
        s003: 0,
        s004: 0,
        s005: 0,
        s006: 0,
        s007: 0,
        s008: 0,
        s009: 0,
        s010: 0,
        s011: 0,
        s012: 0,
        s013: 0,
        s014: 0,
        s015: 0,
        s016: 0,
        s017: 0,
        s018: 0,
        s019: 0,
        s020: 0,
        s021: 0,
        s022: 0,
        s023: 0,
        s024: 0,
        s025: 0,
        s026: 0,
        s027: 0,
        s028: 0,
        s029: 0,
        s030: 0,
        s031: 0,
        s032: 0,
        s033: 0,
        s034: 0,
        s035: 0,
        s036: 0,
        s037: 0,
        s038: 0,
        s039: 0,
        s040: 0,
        s041: 0,
        s042: 0,
        s043: 0,
        s044: 0,
        s045: 0,
        s046: 0,
        s047: 0,
        s048: 0,
        s049: 0,
        s050: 0,
        s051: 0,
        s052: 0,
        s053: 0,
        s054: 0,
        s055: 0,
        s056: 0,
        s057: 0,
        s058: 0,
        s059: 0,
        s060: 0,
        s061: 0,
        s062: 0,
        s063: 0,
        s064: 0,
        s065: 0,
        s066: 0,
        s067: 0,
        s068: 0,
        s069: 0,
        s070: 0,
        s071: 0,
        s072: 0,
        s073: 0,
        s074: 0,
        s075: 0,
        s076: 0,
        s077: 0,
        s078: 0,
        s079: 0,
        s080: 0,
        s081: 0,
        s082: 0,
        s083: 0,
        s084: 0,
        s085: 0,
        s086: 0,
        s087: 0,
        s088: 0,
        s089: 0,
        s090: 0,
        s091: 0,
        s092: 0,
        s093: 0,
        s094: 0,
        s095: 0,
        s096: 0,
        s097: "0",
        s098: 0,
        s099: 0,
        s100: 0,
        s101: 0,
        s102: 0,
        s103: 0,
        s104: 0,
        s105: 0,
        s106: 0,
        s107: 0,
        s108: 0,
        s109: 0,
        s110: 0,
        s111: 0,
        s112: 0,
        s113: 0,
        s114: 0,
        s115: 0,
        s116: 0,
        s117: 0,
        s118: 0,
        s119: 0,
        s120: 0,
        s121: 0,
        s122: 0,
        s123: 0,
        s124: 0,
        s125: 0,
        s126: 0,
        s127: 0,
        s128: 0,
        s129: 0,
        s130: 0,
        s131: 0,
        s132: 0,
        s133: 0,
        s134: 0,
        s135: 0,
        s136: 0,
        s137: 0,
        s138: 0,
        s139: 0,
        s140: 0,
        s141: 0,
        s142: 0,
        s143: 0,
        s144: 0,
        s145: 0,
        s146: 0,
        s147: 0,
        s148: 0,
        s149: 0,
        s150: 0,
        s151: 0,
        s152: 0,
        s153: 0,
        s154: 0,
        s155: 0,
        s156: 0,
        s157: 0,
        s158: 0,
        s159: 0,
        s160: 0,
        s161: 0,
        s162: 0,
        s163: 0,
        s164: 0,
        s165: 0,
        s166: 0,
        s167: 0,
        s168: 0,
        s169: 0,
        s170: 0,
        s171: 0,
        s172: 0,
        s173: 0,
        s174: 0,
        s175: 0,
        s176: 0,
        s177: 0,
        s178: 0,
        s179: 0,
        s180: 0,
        s181: 0,
        s182: 0,
        s183: 0,
        s184: 0,
        s185: 0,
        s186: 0,
        s187: 0,
        s188: 0,
        s189: 0,
        s190: 0,
        s191: 0,
        s192: 0,
        s193: 0,
        s194: 0,
        s195: 0,
        s196: 0,
        s197: 0,
        s198: 0,
        s199: 0,
        s200: 0,

        h: {
          sysid: ref(""),
          dpname: "",
          dept: "",
          position: "",

          hrchecked: [],

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
      familyform: {
        sysid: "",
        birth: "",
        idcard: "",
        remark: "",
        mtele: "",
        name: "",
        relation: "",
        company: "",
      },
      familyrules: {
        name: [{ required: true, message: "请输入 家属姓名", trigger: "blur" }],

        mtele: [
          { required: true, message: "请输入 家属电话号码", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    // s33() { return this.form.s015 }
  },
  mounted() {
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
    compared(idx) {
      let tyyyy = "2020";
      let tmm = "01";
      this.prinfo.fromperiod = this.prinfo.period;
      this.prinfo.toperiod = this.prinfo.period;

      tyyyy = this.prinfo.fromperiod.substring(0, 4);

      tmm = this.prinfo.fromperiod.substr(4, 2);

      if (parseInt(idx) == 1) {
        if (parseInt(tmm) == 1) {
          tyyyy = parseInt(tyyyy) - 1;
        } else {
          tmm = "00" + (parseInt(tmm) - 1);
          tmm = tmm.substr(tmm.length - 2, 2);
        }

        this.prinfo.toperiod = tyyyy + tmm;
      }
      if (parseInt(idx) == 2) {
        tyyyy = parseInt(tyyyy) - 1;

        this.prinfo.toperiod = tyyyy + tmm;
      }
      if (parseInt(idx) == 3) {
        this.dialogComparedCustomVisible = true;
      }

      if (this.prinfo.fromperiod != this.prinfo.toperiod) {
        let data = {
          fd: this.prinfo.fromperiod,
          td: this.prinfo.toperiod,
        };
        this.loading = true;
        AX("post", "/prcompare", data).then((res) => {
          if (res) {
            this.dialogComparedCustomVisible = false;
            this.listMain();
          }
          this.loading = false;
        });
      }

      console.log(this.prinfo.fromperiod, this.prinfo.toperiod);
    },

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
      this.listMain();
    },

    cmd_tohist() {
      this.$confirm(
        "此操作将把当前薪资转化为历史数据，并清零。 是否继续?",
        "重要信息",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          AX("get", "/prtohist").then((res) => {
            if (res) {
              //console.log(res);
              AX("get", "/getprperiod")
                .then((res) => {
                  this.prinfo = res.data;
                })
                .catch((e) => console.log(e.message));

              this.listMain();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },

    /****************************************************************
     * sysid=- 1 表示所有人
     */
    async cmd_calculate(sysid = "-1") {
      if (this.tableData.length < 1) {
        this.$message.error("请选择需要计算员工的帐套和员工类型！");
        return;
      }

      this.loadingContent = "薪资数据正在为你拼命计算中，请阁下稍加休息～";
      this.loadingBackground = "rgba(0, 0, 0, 0.8)";
      this.loading = true;

      AX("post", "/calculate", {
        accountgrp: this.prinfo.prgrp,
        sysid: sysid,
      }).then(() => {
        //暂时停用，为了调试，正式版中必须启用
        this.listMain();
        // //
        this.loading = false;
      });
    },
    /**************************************************************** */
    async calculateforsysid() {
      if (!this.cusRules()) {
        return;
      }
      let done = false;
      if (this.savepritembyStaff()) {
        this.cmd_calculate(this.form.sysid).then(() => {
          done = true;
        });
      }

      return done;
    },

    pritemchange() {
      //实时计算的前提是不能列数据。
      //  this.cmd_calculate(this.form.sysid)
    },

    init_familyform() {
      this.neworedit = true;
      const keyitems = ["sysid", "createdat", "updatedat", "deletedat"];

      for (let item in this.familyform) {
        if (keyitems.includes(item.toString().toLowerCase()) == false) {
          //   console.log('-1', item);
          this.familyform[item] = "";
        }
      }
    },

    changeToplus_family() {
      this.init_familyform();
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

    saveForm() {
      if (this.prinfo.fromperiod == this.prinfo.toperiod) {
        this.$message({
          message: "比较周期必须不同!",
          type: "error",
        });
        return;
      }
      let data = {
        fd: this.prinfo.fromperiod,
        td: this.prinfo.toperiod,
      };
      this.dialogComparedCustomVisible = false;
      this.loading = true;
      AX("post", "/prcompare", data).then((res) => {
        if (res) {
          this.dialogComparedCustomVisible = false;
          this.listMain();
        }
        this.loading = false;
      });
    },

    async savepritembyStaff() {
      let done = false;
      let updateitem = {};
      updateitem.id = this.form.id;
      updateitem.remark = this.form.remark;
      for (let item of this.pritemData) {
        updateitem[item.prid] = this.form[item.prid];
      }

      AX("put", "/prstaff/" + this.form.id, updateitem).then(() => {
        done = true;
      });
      return done;
    },

    savepritemvalForm() {
      this.savepritembyStaff();

      this.dialogFormVisible = false;
    },

    formatisstop(row) {
      return row.is_stop == 0 ? "No" : "STOP";
    },
    handleNew() {
      this.neworedit = true;
      this.dialogAddVisible = true;
      this.hrnewData = [];
      this.loading = true;

      AX("get", "/hrnewstaff")
        .then((res) => {
          res.data.forEach((ele) => {
            let hr = {};
            hr.key = ele.sysid;
            hr.label = ele.cname;
            this.hrnewData.push(hr);
          });
          this.loading = false;
        })
        .catch((e) => console.log(e.message));
    },

    handleEdit(index, row) {
      //  this.getdic();
      this.neworedit = false;

      console.log(row);

      //非常非常重要，在有自定义dom下，又是弹出框下进行操作这些dom，利用form是不能自动读取内容的
      //这里目前用jquery的方法非常好用。
      //更新form，如果有弹出框的情况下，必须更新。

      this.form = Object.assign({}, row);

      this.dialogFormVisible = true;

      //——————————————————————————————————————————————————————————————————————
      //数字或者boolean 其实都是数字，ui中的任意内容都是字符，所以需要转化
      // this.form.sex = this.form.sex.toString();//数据字段是数字 smallint
      // this.form.if_proba = this.form.if_proba.toString();//数据字段是真假boolean
      //——————————————————————————————————————————————————————————————————————

      // this.hrcheckedshow.splice(0, this.hrcheckedshow.length);

      // this.hrcheckedshow = this.form.hrchecked.split(',')

      // console.log(this.form.hrcheckedshow)

      // let c = 0;
      // let dpname = '';
      // for (let element of this.dpList) {

      //     if (c < 2) {
      //         if (element.dpid == row.dept) {
      //             dpname += element.dpname;
      //             c++;
      //         }
      //         if (element.dpid == row.position) {
      //             dpname += element.dpname;
      //             c++;
      //         }
      //     } else {
      //         this.form.dpname = dpname;
      //         break;
      //     }
      // }
    },

    changePage(idx) {
      //  console.log(idx)
      this.page.cpg = idx;
      this.listMain();
    },

    getdic(type = "hr") {
      this.loading = true;

      if (type == "hr") {
        this.dichrgradeData = this.dicstore.getDic("hrgrade");

        this.dichrgradeData = this.dicstore.getDic("prsum1");

        this.deptData = this.deptstore.deptData.data;

        this.dpData = this.deptstore.deptposData.data;
        this.flattenTree(this.dpData);

        this.dichrpropsData = this.dicstore.getDic("hrprops");

        this.dichrpropsData = this.dicstore.getDic("pritemgcalgrp");

        AX("post", "pritemlst", { prgrp: this.prinfo.prgrp })
          .then((res) => {
            this.pritemData = res.data;
          })
          .catch((e) => console.log(e.message));

        AX("get", "getprperiod")
          .then((res) => {
            this.prinfo = res.data;
          })
          .catch((e) => console.log(e.message));
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
        node.dpid = item.dpid;
        node.dpname = item.dpname;
        node.fid = item.fid;
        node.is_pos = item.is_pos;
        node.posgrade = item.posgrade;

        this.dpList.push(node);
        if (item.children) {
          this.flattenTree(item.children);
        }
      }
    },

    cmd_moresearch() {
      if (this.deptChecked.length < 1) {
        this.$message.error("请选择需要查询的部门！");
        return;
      } else {
        this.deptChecked.forEach((item) => {
          let dpobj = {};
          dpobj.dpid = item.dpid;
          this.dplimit.push(dpobj);
        });

        this.dialogMSVisible = true;
      }
    },

    moreSearch(data) {
      //console.log(data;
      this.loading = true;

      let block = encodeURI(JSON.stringify(data));

      // console.log('blockencodeURI', block.length)

      AX(
        "get",
        "/hrinfo/" +
          this.page.limit +
          "/" +
          this.page.cpg +
          "/" +
          block +
          "/" +
          this.inputsearch
      ).then((res) => {
        this.tableData = res.data.rows;
        this.counts = res.data.count;

        this.tableData.forEach((item) => {
          item.birthshow = moment(item.birth).format("MM-DD");
        });

        this.loading = false;
      });
    },

    listMain() {
      //  console.log('33333333333333')

      //  let api = ''
      if (this.deptChecked.length < 1) {
        this.$message.error("请选择需要查询的部门！");
        return;
      }
      if (!this.prinfo.prgrp) {
        this.$message.error("请选择薪资帐套！");
        return;
      }

      AX("post", "/pritemlst", { prgrp: this.prinfo.prgrp })
        .then((res) => {
          this.pritemData = res.data;
        })
        .catch((e) => console.log(e.message));
      //   console.log(this.deptChecked)
      this.loadingContent = "拼命加载中";
      this.loadingBackground = "rgba(0, 0, 0, 0.8)";
      this.loading = true;
      let block = {};

      let depts = [];

      this.deptChecked.forEach((item) => {
        let dpobj = {};
        dpobj.dpid = item.dpid;
        depts.push(dpobj);
      });

      block.dept = depts;
      block.prgrp = this.prinfo.prgrp;
      block.prtype = this.prtype;
      block.id = this.inputsearch;

      // console.log('block', JSON.stringify(block))
      block = encodeURI(JSON.stringify(block));

      // console.log('blockencodeURI', block.length)

      AX(
        "get",
        "/prcompare/" + this.page.limit + "/" + this.page.cpg + "/" + block
      ).then((res) => {
        this.tableData = res.data.rows;
        this.page.counts = res.data.count;

        // this.tableData.forEach(item => {

        //     console.log(item.h.birth)

        // })

        //非常非常重要，在有自定义dom下，又是弹出框下进行操作这些dom，利用form是不能自动读取内容的
        //这里目前用jquery的方法非常好用。
        if (this.form.sysid) {
          //更新form，如果有弹出框的情况下，必须更新。
          for (let item of this.tableData) {
            if (item.sysid == this.form.sysid) {
              for (let i in item) {
                this.form[i] = item[i];
                // console.log(i)
              }
              break;
            }
          }
        }

        //=========================================================================

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
.ispos {
  padding: 2px 6px;
  cursor: pointer;
  font-size: 14px;
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
</style>
