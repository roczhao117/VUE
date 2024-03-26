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

    <div style="display: flex; margin-right: 4px">
      <span style="margin-left: 0px; width: 120px">
        <el-select
          v-model="isstopkq"
          placeholder="请选考勤人员类型"
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

      <el-date-picker
        style="margin-left: 4px; width: 120px"
        v-model="search.fromdate"
        type="date"
        placeholder="选择开始日期"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        @change="fromdateChange"
        size="small"
      ></el-date-picker>

      <el-date-picker
        style="margin-left: 4px; width: 120px"
        v-model="search.todate"
        type="date"
        placeholder="选择结束日期"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        size="small"
      ></el-date-picker>
      <el-tooltip content="根据开始结束日期刷新年假数据" placement="top">
        <el-button
          icon="Refresh"
          size="small"
          @click="refresh()"
          style="margin-left: 4px"
        ></el-button>
      </el-tooltip>
      <span style="margin-left: 4px; width: 160px">
        <el-select
          v-model="search.avoptionid"
          placeholder="可选查询内容"
          style="width: 100%"
          size="small"
        >
          <el-option
            v-for="item in dicaloptions"
            :key="item.itemid"
            :label="item.itemname"
            :value="item.itemid"
          ></el-option>
        </el-select>
      </span>

      <el-input
        style="margin-left: 4px; width: 180px"
        placeholder="姓名工号查询"
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
      <el-tooltip content="年假设置" placement="top">
        <el-button
          icon="setting"
          size="small"
          @click="cmd_setting"
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
        style="
          margin-left: 2px;
          width: 100%;
          min-width: 1000px;
          font-size: 12px;
        "
      >
        <el-table
          :data="tableData"
          style="width: 1000px; font-size: 12px"
          v-loading="loading"
          :element-loading-text="loadingContent"
          element-loading-spinner="el-icon-loading"
          :element-loading-background="loadingBackground"
          @selection-change="handleSelectionChange"
          stripe
          v-if="search.avoptionid == 0"
        >
          <el-table-column prop="id" fixed="left" width="80" type="index">
            <template #default="scope">
              <span>{{
                (page.cpg - 1) * page.limit + (scope.$index + 1)
              }}</span>
            </template>
          </el-table-column>

          <el-table-column type="selection" fixed="left" width="55">
            <template #default="scope"> </template>
          </el-table-column>

          <el-table-column
            prop="emid"
            label="工号"
            fixed
            width="80"
          ></el-table-column>
          <el-table-column
            prop="cname"
            fixed="left"
            label="中文名"
            width="80"
          ></el-table-column>
          <el-table-column
            prop="fromdate"
            width="100"
            label="入职日期"
          ></el-table-column>
          <el-table-column prop="datejoined" width="100" label="开始日期">
          </el-table-column>
          <el-table-column prop="todate" width="100" label="结束日期">
          </el-table-column>

          <el-table-column prop="alt" width="120" label="当前生成年假(D)">
          </el-table-column>

          <el-table-column prop="levt" width="120" label="年假单合计(D)">
          </el-table-column>

          <el-table-column prop="difft" width="120" label="可用年假(D)">
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
        <el-table
          :data="tableData"
          style="width: 1000px; font-size: 12px"
          v-loading="loading"
          :element-loading-text="loadingContent"
          element-loading-spinner="el-icon-loading"
          :element-loading-background="loadingBackground"
          @selection-change="handleSelectionChange"
          stripe
          v-if="search.avoptionid == 1"
        >
          <el-table-column prop="id" fixed="left" width="80" type="index">
            <template #default="scope">
              <span>{{
                (page.cpg - 1) * page.limit + (scope.$index + 1)
              }}</span>
            </template>
          </el-table-column>

          <el-table-column type="selection" fixed="left" width="55">
            <template #default="scope"> </template>
          </el-table-column>

          <el-table-column prop="status" label="状态" width="60">
            <template #default="scope">
              <span>{{
                funData.dicDescs(scope.row.status, "itemid", "itemname")
              }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="emid"
            label="工号"
            fixed
            width="80"
          ></el-table-column>
          <el-table-column
            prop="cname"
            fixed="left"
            label="中文名"
            width="80"
          ></el-table-column>

          <el-table-column prop="type" label="类型" width="100">
            <template #default="scope">
              <span>{{
                dicottypeData.dicDescs(scope.row.type, "itemid", "itemname")
              }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="pay" label="偿付方式" width="80">
            <template #default="scope">
              <span>{{
                dicotpayData.dicDescs(scope.row.pay, "itemid", "itemname")
              }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="fromdate"
            label="加班日期"
            width="100"
          ></el-table-column>

          <el-table-column
            prop="fromtime"
            label="开始时间"
            width="100"
          ></el-table-column>

          <el-table-column prop="hours" width="80" label="时长(H)">
          </el-table-column>
          <el-table-column prop="remark" width="180" label="备注">
          </el-table-column>

          <el-table-column prop="isactive" label="激活" width="80">
            <template #default="scope">
              <el-tooltip
                content="点击可切换状态,非激活表示删除"
                placement="top"
              >
                <el-button
                  type="success"
                  size="small"
                  v-if="scope.row.isactive == 1"
                  @click="activeActivity(0, scope.$index, scope.row)"
                  >是</el-button
                >
                <el-button
                  type="danger"
                  size="small"
                  @click="activeActivity(1, scope.$index, scope.row)"
                  v-else
                  >非</el-button
                >
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="dept" label="部门" width="120">
            <template #default="scope">
              <span>{{
                dpList.dicDescs(scope.row.dept, "dpid", "dpname")
              }}</span>
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
        title="年假规则设置"
        width="600px"
        v-model="dialogSettingVisibility"
        @close="closedialog"
      >
        <span style="display: flex">
          <span style="margin-left: 20px; color: gray"> </span>
        </span>
        <el-form
          :rules="rules"
          :model="form"
          ref="refform"
          class="margin:0 20px;display:flex;"
        >
          <el-row
            :gutter="24"
            style="
              border: 1px solid rgb(226, 226, 226);
              margin-bottom: 4px;
              border-radius: 5px;
              padding: 4px;
            "
          >
            <el-col :span="24">
              <el-form-item
                label="规则说明"
                label-width="100"
                size="small"
                prop="name"
              >
                <el-input
                  v-model="form.name"
                  placeholder=""
                  size="small"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="年假起始天数" label-width="100" size="small">
                <el-input-number
                  v-model="form.mindays"
                  placeholder=""
                  :min="5"
                  :max="50"
                  size="small"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="上限天数" label-width="100" size="small">
                <el-input-number
                  v-model="form.maxdays"
                  placeholder=""
                  :min="8"
                  :max="50"
                  size="small"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="每年增加天数" label-width="100" size="small">
                <el-input-number
                  v-model="form.increasedays"
                  placeholder="每服务年递增天数"
                  :min="0"
                  :max="5"
                  size="small"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="处理顺序" label-width="100" size="small">
                <el-input-number
                  v-model="form.sort"
                  placeholder="规则顺序，同类型前面覆盖后面"
                  :min="0"
                  :max="100"
                  size="small"
                ></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row
            :gutter="24"
            style="
              border: 1px solid rgb(226, 226, 226);
              margin-bottom: 4px;
              border-radius: 5px;
            "
          >
            <el-col :span="24">
              <el-form-item label="适用组" label-width="80" size="small">
                <el-checkbox-group v-model="form.grp" class="chkgrp">
                  <el-checkbox
                    v-for="item in dichrgrpData"
                    :key="item.itemid"
                    :value="item.itemid"
                    :label="item.itemid"
                    :checked="item.chk1 == 1"
                    class="chk"
                    size="small"
                    >{{ item.itemname }}</el-checkbox
                  >
                </el-checkbox-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="适用级别" label-width="80" size="small">
                <el-checkbox-group v-model="form.grade" class="chkgrp">
                  <el-checkbox
                    v-for="item in dichrgradeData"
                    :key="item.itemid"
                    :value="item.itemid"
                    :label="item.itemid"
                    class="chk"
                    size="small"
                    >{{ item.itemname }}</el-checkbox
                  >
                </el-checkbox-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="适用类型" label-width="80" size="small">
                <el-checkbox-group v-model="form.type" class="chkgrp">
                  <el-checkbox
                    v-for="item in dichrtypeData"
                    :key="item.itemid"
                    :value="item.itemid"
                    :label="item.itemid"
                    class="chk"
                    size="small"
                    >{{ item.itemname }}</el-checkbox
                  >
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row
            :gutter="24"
            style="
              border: 1px solid rgb(226, 226, 226);
              margin-bottom: 4px;
              border-radius: 5px;
            "
          >
            <el-col :span="24">
              <el-form-item label="抵充项目" label-width="80" size="small">
                <el-checkbox-group v-model="form.levitem" class="chkgrp">
                  <el-checkbox
                    v-for="item in diclevItemData"
                    :key="item.itemid"
                    :value="item.itemid"
                    :label="item.itemid"
                    class="chk"
                    size="small"
                    >{{ item.itemname }}</el-checkbox
                  >
                </el-checkbox-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="抵充偿付" label-width="80" size="small">
                <el-checkbox-group v-model="form.levpay" class="chkgrp">
                  <el-checkbox
                    v-for="item in diclevpayData"
                    :key="item.itemid"
                    :value="item.itemid"
                    :label="item.itemid"
                    class="chk"
                    size="small"
                    >{{ item.itemname }}</el-checkbox
                  >
                </el-checkbox-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="抵充状态" label-width="80" size="small">
                <el-checkbox-group v-model="form.levstatus" class="chkgrp">
                  <el-checkbox
                    v-for="item in funData"
                    :key="item.itemid"
                    :value="item.itemid"
                    :label="item.itemid"
                    class="chk"
                    size="small"
                    >{{ item.itemname }}</el-checkbox
                  >
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-divider content-position="left"><i>规则列表</i></el-divider>
          <el-row
            :gutter="24"
            style="
              border: 1px solid rgb(226, 226, 226);
              margin-bottom: 4px;
              border-radius: 5px;
              font-size: 12px;
              font-weight: normal;
              padding: 0 20px;
            "
          >
            <el-table
              :data="tableRuleData"
              style="width: 740px; font-size: 12px"
              v-loading="loading"
              :element-loading-text="loadingContent"
              element-loading-spinner="el-icon-loading"
              :element-loading-background="loadingBackground"
              @selection-change="handleSelectionChange"
              stripe
            >
              <el-table-column
                label="规则"
                prop="itemname"
                fixed="left"
                width="120"
              ></el-table-column>
              <el-table-column
                label="起始天数"
                prop="chk1"
                fixed="left"
                width="80"
              ></el-table-column>
              <el-table-column
                label="上限天数"
                prop="chk2"
                fixed="left"
                width="80"
              ></el-table-column>
              <el-table-column
                label="年递增(D)"
                prop="chk3"
                fixed="left"
                width="100"
              ></el-table-column>
              <el-table-column
                label="序列"
                prop="sort"
                fixed="left"
                width="80"
              ></el-table-column>
              <el-table-column prop="id" fixed="right" label="操作" width="120">
                <template #default="scope">
                  <span class="butgrp">
                    <el-tooltip content="修改" placement="top">
                      <el-button
                        size="small"
                        icon="Edit"
                        @click="setEdit(scope.$index, scope.row)"
                      ></el-button
                    ></el-tooltip>
                    <el-tooltip content="删除" placement="top">
                      <el-button
                        size="small"
                        icon="delete"
                        type="danger"
                        @click="setDelete(scope.$index, scope.row)"
                      ></el-button
                    ></el-tooltip>
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </el-form>
        <el-config-provider :locale="locale"> </el-config-provider>
        <template #footer>
          <span class="dialog-footer">
            <el-button
              @click="newform()"
              type="success"
              v-if="neworedit == false"
              >新建</el-button
            >
            <el-button @click="saveForm(1)" type="primary" v-if="neworedit"
              >新增</el-button
            >
            <el-button
              @click="saveForm(0)"
              type="primary"
              v-if="neworedit == false"
            >
              保存</el-button
            >
            <el-button @click="this.dialogSettingVisibility = false"
              >取消</el-button
            >
          </span>
        </template>
      </el-dialog>
    </div>
    <div>
      <el-dialog
        title="批 量 处 理 状 态"
        width="400px"
        v-model="dialogApplyTempsVisible"
      >
        <span>
          <el-select
            v-model="statusid"
            placeholder="请选择状态"
            style="width: 100%"
            @change="changeacc"
            size="default"
          >
            <el-option
              v-for="item in funData"
              :key="item.itemid"
              :label="item.itemname"
              :value="item.itemid"
            ></el-option>
          </el-select>
        </span>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogApplyTempsVisible = false"
              >取 消</el-button
            >
            <el-button @click="batchshift()">确 定</el-button>
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
import { alOptions } from "../utils/comdata";
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
      statusid: "",

      dialogOTVisibility: false,
      dialogLEVVisibility: false,

      dialogSettingVisibility: false,
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
      tableRuleData: ref([]),
      roleData: [],

      selkqstafftype: [],

      pritemData: [],

      loading: false,
      deptVisible: false,

      dichrpropsData: [],
      deptChecked: [],

      dichktypeData: [],

      ////////////////////////////////

      diclevItemData: [],
      diclvepayData: [],
      funData: [],

      dichrgradeData: [],
      dichrtypeData: [],
      dichrgrpData: [],

      dicaloptions: [],
      //

      dicshifttype2Data: [],
      dicmealsData: [],

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

      search: {
        fromdate: "",
        todate: "",
        status: [],
        pay: [],
        type: [],
        avoptionid: "0",
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
      search: { fromdate: "", todate: "" },
      form: {
        id: "",
        mindays: 5,
        maxdays: 10,
        increasedays: 1,
        grade: [],
        type: [],
        grp: [],
        levitem: [],
        levpay: [],
        levstatus: [],
        name: "",
        sort: 50,
      },
      rules: {
        name: [{ required: true, message: "请输入规则说明", trigger: "blur" }],
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
        //     required: true, message: '请输入 公年金基数', trigger: 'blur', pattern: /^(0(.)?\d+|[1-9]\d*(.)?\d*)$/,
        // }],
        // socialbase: [{
        //     required: true, message: '请输入 社保基数', trigger: 'blur', pattern: /^(0(.)?\d+|[1-9]\d*(.)?\d*)$/,
        // }],
      },

      checkoutrules: {
        // reqleavedate: [{ required: true, message: '请输入 离职申请日期', trigger: 'blur' }],
        // checkout: [{ required: true, message: '请输入 离职工作日', trigger: 'blur', }],
        // lastdate: [{ required: true, message: '请输入 最后工作日', trigger: 'blur', }],
        // accledate: [{ required: true, message: '请输入 年假到期日', trigger: 'blur', }],
        // aledate: [{ required: true, message: '请输入 年假到期日', trigger: 'blur', }],
        // acclhoursm: [{
        //     required: true, message: '请输入 结余年假小时数', trigger: 'blur', pattern: /^-?(0|0\.\d*|[1-9]\d*\.?\d*)$/,//正负数
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
      // //console.log(this.form)
    },

    fromdateChange() {
      this.search.todate = moment(this.search.fromdate)
        .add(1, "month")
        .add(1, "day")
        .format("YYYY-MM-DD");
    },

    check() {
      this.deptChecked.splice("0", this.deptChecked.length);
      this.deptChecked = this.$refs.deptTree.getCheckedNodes();
    },

    newdeptnodeclick(data) {
      //console.log(data);
      if (data.is_pos == 1) {
        this.deptVisible = false;
        this.form.dpname = data.dpname;
        this.form.dept = data.fid;
        this.form.position = data.dpid;
      }
    },
    test() {
      //console.log("deptvisible:", this.deptVisible);
      this.deptVisible = !this.deptVisible;
    },

    handleEdit(idx, row) {
      this.neworedit = false;
    },

    newform() {
      this.neworedit = true;
      this.ini_ruleform();
    },

    ini_ruleform() {
      this.form = {
        id: "",
        mindays: 5,
        maxdays: 10,
        increasedays: 1,
        grade: [],
        type: [],
        grp: [],
        levitem: [],
        levpay: [],
        levstatus: [],
        name: "",
        sort: 50,
      };
    },
    setDelete(idx, row, if_stop) {
      this.$confirm("此操作将删除该规则，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          AX("delete", "dic/alrule/" + row.id).then((res) => {
            if (res) {
              // this.listMain();
              this.listalsettings();
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

    handleSelectionChange(val) {
      this.multipleSelection.value = val;
      //console.log(this.multipleSelection);
    },
    saveForm() {
      //  let data = [];
      this.$refs.refform.validate((valid) => {
        if (valid) {
          //type================================================================
          let A = {};
          A["grps"] = this.form.grp;
          A["grade"] = this.form.grade;
          A["type"] = this.form.type;
          A["name"] = this.form.name;
          A["maxdays"] = this.form.maxdays;
          A["mindays"] = this.form.mindays;
          A["increasedays"] = this.form.increasedays;
          A["id"] = this.form.id;
          A["sort"] = this.form.sort;
          A["levitem"] = this.form.levitem;
          A["levpay"] = this.form.levpay;
          A["docstatus"] = this.form.levstatus;

          // console.log(this.form.grp.length);

          if (
            this.form.grp.length == 0 ||
            this.form.grade.length == 0 ||
            this.form.type.length == 0 ||
            this.form.levitem.length == 0 ||
            this.form.levpay.length == 0 ||
            this.form.levstatus.length == 0
          ) {
            this.$message.error("适用选项和抵扣选项为必选项目，不能为空！");
            return;
          }

          //================================================================

          // A = encodeURI(JSON.stringify(A));
          // console.log(A);

          AX("post", "dic/alset", A).then((res1) => {
            if (res1) {
              this.neworedit = false;
              //console.log(res1);
              this.dialogSettingVisibility = false;
              //this.addvalue = [];
              // this.listMain();
            }
          });
        }
      });
    },

    cmd_ot(fromdate) {
      this.otlevfromdate = fromdate;
      this.dialogOTVisibility = true;
      //console.log("ot", fromdate);
    },
    cmd_lev(fromdate) {
      this.otlevfromdate = fromdate;
      this.dialogLEVVisibility = true;
      //console.log("lev", fromdate);
    },

    refresh() {
      let uptdata = {};

      let depts = [];

      this.deptChecked.forEach((item) => {
        depts.push(item.deptid);
      });

      uptdata.fromdate = this.search.fromdate;
      uptdata.todate = this.search.todate;
      uptdata.dept = depts;

      // uptdata = encodeURI(JSON.stringify(uptdata));

      AX("post", `allist/refresh`, uptdata).then((res1) => {
        if (res1) {
          //console.log(res1);
          this.dialogApplyTempsVisible = false;
          //this.addvalue = [];
          this.listMain();
        }
      });
    },

    activeActivity(isactive, idx, row) {
      //console.log(stop, idx, row);
      // AX("patch", `otlist/${row.id}`, { isactive }).then((res1) => {
      //   if (res1) {
      //     this.listMain();
      //   }
      // });
    },

    changeshiftdate(mons) {
      // let ft = this.kqinfo.fromdate.split("-").slice(0, 2).join("");
      // let tt = this.kqinfo.todate.split("-").slice(0, 2).join("");
      // //console.log(ft, tt);
      // //获取一个月的实际天数
      // //let fdays = moment(ft, 'YYYYMM').daysInMonth();
      // //let tdays = moment(tt, 'YYYYMM').daysInMonth();
      // //这表示跨月
      // if (ft != tt) {
      //   //首先获得变更的月度。
      //   //console.log(this.kqinfo.fromdate);
      //   let period = moment(this.kqinfo.period)
      //     .add(mons, "month")
      //     .format("YYYYMM");
      //   let fromdate = moment(this.kqinfo.fromdate)
      //     .add(mons, "month")
      //     .format("YYYY-MM-DD");
      //   let todate = moment(this.kqinfo.todate)
      //     .add(mons, "month")
      //     .add(0, "day")
      //     .format("YYYY-MM-DD");
      //   this.kqinfo.period = period;
      //   this.kqinfo.fromdate = fromdate;
      //   this.kqinfo.todate = todate;
      //   this.kqinfo.diffmons =
      //     parseInt(this.kqinfo.period) - parseInt(this.kqinfo.currperiod);
      //   this.listMain();
      // } else {
      //   //这里需要处理日期，如果是同一个月的，那么就是1号到月底。但一般设置的话，是1号到下个月15号。
      //   //如果是跨月的话，一般就是这个21到下个月20，最好到月底。都多15天。
      //   //这里没处理，标记一下，先确定周期怎么拿再确定。
      //   let fromdate = moment(this.kqinfo.fromdate)
      //     .add(mons, "month")
      //     .format("YYYY-MM-DD");
      //   let todate = moment(this.kqinfo.fromdate)
      //     .add(mons + 1, "month")
      //     .add(-1, "day")
      //     .format("YYYY-MM-DD");
      //   let period = moment(fromdate).format("YYYYMM");
      //   this.kqinfo.period = period;
      //   this.kqinfo.fromdate = fromdate;
      //   this.kqinfo.todate = todate;
      //   this.listMain();
      // }
    },

    formatisstop(row) {
      return row.is_stop == 0 ? "No" : "STOP";
    },

    setEdit(index, row) {
      this.neworedit = false;
      this.form.mindays = row.chk1;
      this.form.maxdays = row.chk2;
      this.form.increasedays = row.chk3;
      this.form.name = row.itemname;
      this.form.grp = row.code1.split(",");
      this.form.grade = row.code2.split(",");
      this.form.type = row.code3.split(",");
      this.form.levitem = row.code4.split(",");
      this.form.levpay = row.code5.split(",");
      this.form.levstatus = row.code6.split(",");
      this.form.id = row.id;
      this.form.sort = row.sort;
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

    getdic(type = "hr") {
      this.loading = true;

      this.kqinfo.period = this.userstore.getperiod("kq").period;
      this.kqinfo.currperiod = this.userstore.getperiod("kq").period;
      this.kqinfo.fromdate = this.userstore.getperiod("kq").sdate;
      this.kqinfo.todate = this.userstore.getperiod("kq").edate;
      this.search.fromdate = this.userstore.getperiod("kq").sdateyear;
      this.search.todate = this.userstore.getperiod("kq").edateyear;

      this.diclevItemData = this.dicstore.getDic("levitem");
      this.funData = this.dicstore.getDic("docstatus");
      this.diclevpayData = this.dicstore.getDic("levpay");
      // this.funData = this.dicstore.getDic("otlevfun");
      this.dicshifttype2Data = this.dicstore.getDic("shifttype2");
      // this.dicmealsData.push(...mealsType);
      this.dicaloptions.push(...alOptions);

      if (type == "hr") {
        this.selkqstafftype = stopKQ;
        // AX("get", "/dicm/hrgrade")
        //   .then((res) => {
        //     this.dichrgradeData = res.data;
        //     // //console.log(res.data)
        //     //this.showdesc(res.data, 'hrgrade_13', 'itemid', 'itemname')
        //     // //console.log(res.data.dicDescs('hrgrade_13'));
        //   })
        //   .catch((e) => //console.log(e.message));
        this.dichrgradeData = this.dicstore.getDic("hrgrade");

        // AX("get", "/dicm/hrtype")
        //   .then((res) => {
        //     this.dichrtypeData = res.data;
        //   })
        //   .catch((e) => //console.log(e.message));

        this.dichrtypeData = this.dicstore.getDic("hrtype");

        this.dichrgrpData = this.dicstore.getDic("hrgrps");

        // AX("get", "/dicm/hrstatus")
        //   .then((res) => {
        //     this.dichrstatusData = res.data;
        //   })
        //   .catch((e) => //console.log(e.message));

        // this.dichrstatusData = this.dicstore.getDic("hrstatus");

        // AX("get", "/dept")
        //   .then((res) => {
        //     this.dpData = res.data;
        //     this.flattenTree(res.data);
        //   })
        //   .catch((e) => //console.log(e.message));

        this.dpData = this.deptstore.deptposData.data;
        this.flattenTree(this.dpData);
        // AX("get", "/dicm/hrprops")
        //   .then((res) => {
        //     this.dichrpropsData = res.data;
        //   })
        //   .catch((e) => //console.log(e.message));
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
      }

      this.loading = false;
    },

    async tree(data, val, id, descs) {
      if (!val) {
        return;
      }
      let r = "";
      for (let item of data) {
        //console.log("tree:", val, item[id]);
        if (val != item[id]) {
          if (item.children) {
            await this.tree(item.children, val, id, descs);
          }
        } else {
          // //console.log('find.......................' + item[descs])
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

    cmd_setting() {
      this.neworedit = true;
      this.listalsettings();
      this.ini_ruleform();
      this.dialogSettingVisibility = true;
    },

    freemonths(data, ft, tt, fday, fdays, fm, tday, tm) {
      let tableData = data;

      // //console.log(tableData);

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

                  //  //console.log(sd);

                  newdata["d" + tm + sd] = tableData[i]["sf" + sd];
                }
              }
            }
          }
          newdata.shiftdate = this.kqinfo.period;
          newdata.sysid = s;
          newtabledata.push(newdata);
          // //console.log(newdata, ft, tt, tday)

          // //如果是
          // if (istemplate == 1) {
          //     //console.log(this.shifttmps
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
      this.dialogSettingVisibility = false;
    },

    closeotlistform() {
      this.dialogOTVisibility = false;
    },
    closelevlistform() {
      this.dialogLEVVisibility = false;
    },

    listalsettings() {
      this.loading = true;
      AX("get", "dic/alget/info").then((res) => {
        this.tableRuleData = [];
        if (res) {
          this.tableRuleData = res.data;
        }
        this.loading = false;
      });
    },

    listMain() {
      if (this.deptChecked.length < 1) {
        this.$message.error("请选择需要查询的部门！");
        return;
      }

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
      block.fromdate = this.search.fromdate;
      block.todate = this.search.todate;
      block.name = this.inputsearch;

      block = encodeURI(JSON.stringify(block));

      let api = "allist";

      switch (this.search.avoptionid) {
        case 0: {
          api = "allist";
          break;
        }
        case 1: {
          api = "levlist";
          break;
        }
      }

      AX(
        "get",
        api +
          "?page=" +
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
.chkgrp {
  display: flex;
  flex-wrap: wrap;
  float: left;
}
.chk {
  width: 80px;
  margin: 0 4px;
}
</style>
