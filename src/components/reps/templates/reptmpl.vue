<template>
  <div>
    <el-row :gutter="24">
      <el-col :span="24">
        <el-button
          type="primary"
          size="small"
          icon="filter"
          @click="showCondiForm"
          v-if="btns.condi"
          >条件</el-button
        >
        <el-button
          type="primary"
          size="small"
          icon="check"
          @click="showContenForm"
          v-if="btns.conten"
          >内容</el-button
        >
        <el-button
          type="primary"
          size="small"
          icon="grid"
          @click="showCellForm"
          v-if="btns.size"
          >网格</el-button
        >

        <el-button
          type="primary"
          size="small"
          icon="ScaleToOriginal"
          @click="showColForm"
          v-if="btns.order"
          >列序</el-button
        >

        <el-button
          type="primary"
          size="small"
          icon="Expand"
          @click="showSetGrpForm"
          v-if="btns.grp"
          >分组</el-button
        >
        <el-button
          type="primary"
          size="small"
          icon="FolderAdd"
          @click="showSetSumForm"
          v-if="btns.sum"
          >合计</el-button
        >
        <el-button
          type="primary"
          size="small"
          icon="FolderAdd"
          @click="showSignForm"
          v-if="btns.sign"
          >表头尾</el-button
        >
        <el-button
          type="primary"
          size="small"
          @click="showSettingForm"
          icon="setting"
          v-if="btns.setting"
          >其他</el-button
        >

        <el-button
          type="primary"
          size="small"
          @click="showDBSForm"
          icon="coin"
          v-if="btns.dbs"
          >数据源</el-button
        >
        <el-button
          type="primary"
          size="small"
          @click="setDefault()"
          icon="RefreshLeft"
          v-if="btns.setDefault"
          >恢复默认</el-button
        >
        <el-button
          type="warning"
          size="small"
          @click="loaddata()"
          icon="Refresh"
          v-if="btns.refresh"
          >刷新</el-button
        >
        <el-button
          type="primary"
          size="small"
          v-print="printObj"
          icon="printer"
          v-if="btns.printer"
          >打印</el-button
        >
        <el-button
          type="primary"
          size="small"
          icon="more"
          @click="showSaveForm"
          v-if="btns.save"
          >另存</el-button
        ></el-col
      >
    </el-row>
  </div>
  <div>
    <el-tooltip content="条件框，点我删除" placement="bottom">
      <div class="optsblock">
        <el-tag
          v-for="(item, index) in fbs.items"
          :key="index"
          size="small"
          type="primary"
          effect="light"
          @click="delfb(item)"
          >{{ item.fld }}{{ item.descs }}
        </el-tag>
      </div></el-tooltip
    >
    <body id="printArea" ref="printContent">
      <table
        id="rep"
        ref="refrep"
        border="0"
        cellpadding="0"
        cellspacing="0"
        v-loading="loading"
        element-loading-text="主公，您稍后，小的拼命加载中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      ></table>
      <div class="repfooter">
        <el-row :gutter="24">
          <el-col
            :span="24 / file.signbyrow"
            v-for="(sign, index) of file.signs.split(',')"
            :key="index"
          >
            <span class="sign"> {{ sign }} :_____________________</span>
          </el-col>
        </el-row>
        <div class="sign">
          <span></span>
        </div>
      </div>
    </body>
  </div>
  <div>
    <el-dialog :title="findname" width="400px" v-model="dialogPropVisible">
      <el-checkbox-group v-model="findchk.items" size="small">
        <el-checkbox
          v-for="(item, index) of findbox.data"
          :key="item"
          :label="item"
          @change="findboxChange(item)"
          >{{ item }}</el-checkbox
        >
      </el-checkbox-group>
    </el-dialog>

    <el-dialog title="条件选项" width="400px" v-model="dialogMoreVisible">
      <el-tag
        v-for="item in allflds.data"
        :key="item.fld"
        size="small"
        :type="item.show == 1 ? 'primary' : 'info'"
        effect="light"
        @click="getDataByFld(item.fld)"
        >{{ item.descs }}
      </el-tag>
    </el-dialog>

    <el-dialog title="网格尺寸比率" width="440px" v-model="dialogCellVisible">
      <div
        style="margin: 5px; margin-top: -15px; color: rgb(206, 123, 14)"
      ></div>
      <el-divider> 行高</el-divider>
      <el-input-number
        size="small"
        v-model="file.rowheight"
        placeholder="0"
        :min="0"
        :max="10"
        @change="setBodyTrH"
      ></el-input-number>
      <el-divider> 单元格宽度：提示：0为自动</el-divider>
      <el-row :gutter="24">
        <el-col :span="12" v-for="item in allflds.data">
          <el-form-item
            :label="item.descs"
            label-width="100"
            style="padding: 0px; margin: 0px"
          >
            <el-input-number
              v-show="item.show === 1"
              size="small"
              v-model="item['width']"
              placeholder="0"
              :min="0"
              :max="90"
              @change="doSearch()"
            ></el-input-number
          ></el-form-item> </el-col
      ></el-row>
    </el-dialog>

    <el-dialog title="网格列序设置" width="440px" v-model="dialogColVisible">
      <el-row :gutter="24">
        <el-col :span="12" v-for="item in allflds.data">
          <el-form-item
            :label="item.descs"
            label-width="100"
            style="padding: 0px; margin: 0px"
          >
            <el-input-number
              v-show="item.show === 1"
              size="small"
              v-model="item.sort"
              placeholder="sort"
              :min="0"
              :max="999"
              @change="doSearch()"
            ></el-input-number
          ></el-form-item> </el-col
      ></el-row>
    </el-dialog>

    <el-dialog title="内容选项" width="400px" v-model="dialogContentVisible">
      <el-checkbox-group v-model="showflds.items" @change="setShowFlds">
        <el-checkbox
          v-for="item in allflds.data"
          :label="item.descs"
          :value="item.fld"
          size="small"
        >
        </el-checkbox
      ></el-checkbox-group>
    </el-dialog>
    <el-dialog title="合计设置" width="400px" v-model="dialogSetSumVisible">
      <el-checkbox-group v-model="sumflds.items" @change="setSumFlds">
        <el-checkbox
          v-for="item in allflds.data"
          :label="item.descs"
          :value="item.fld"
          :disabled="item.show == 1 ? false : true"
          size="small"
        >
        </el-checkbox
      ></el-checkbox-group>
    </el-dialog>
    <el-dialog title="数组设置" width="400px" v-model="dialogSetGrpVisible">
      <el-checkbox-group v-model="grpflds.items">
        <el-checkbox
          v-for="item in allflds.data"
          :label="item.descs"
          :value="item.fld"
          size="small"
          @change="doSearch()"
        >
        </el-checkbox
      ></el-checkbox-group>
    </el-dialog>

    <el-dialog title="更多选项" width="260px" v-model="dialogSettingVisible">
      <el-form>
        <el-form-item label="显示明细" label-width="100px">
          <el-switch
            v-model="otheropts.showData"
            class="ml-2"
            size="small"
            active-text="是"
            inactive-text="否"
            :active-value="true"
            :inactive-value="false"
            @change="doSearch()"
            style="
              --el-switch-on-color: #13ce66;
              --el-switch-off-color: #ff4949;
            "
          ></el-switch>
        </el-form-item>
        <el-form-item label="显示组头" label-width="100px">
          <el-switch
            v-model="otheropts.showGrpHead"
            class="ml-2"
            size="small"
            active-text="是"
            inactive-text="否"
            :active-value="true"
            :inactive-value="false"
            @change="doSearch()"
            style="
              --el-switch-on-color: #13ce66;
              --el-switch-off-color: #ff4949;
            "
          ></el-switch>
        </el-form-item>
        <el-form-item label="显示组尾" label-width="100px">
          <el-switch
            v-model="otheropts.showGrpFoot"
            class="ml-2"
            size="small"
            active-text="是"
            inactive-text="否"
            :active-value="true"
            :inactive-value="false"
            @change="doSearch()"
            style="
              --el-switch-on-color: #13ce66;
              --el-switch-off-color: #ff4949;
            "
          ></el-switch>
        </el-form-item>
        <el-form-item label="显示组头标题" label-width="100px">
          <el-switch
            v-model="otheropts.showGrpHeadTitle"
            class="ml-2"
            size="small"
            active-text="是"
            inactive-text="否"
            :active-value="true"
            :inactive-value="false"
            @change="doSearch()"
            style="
              --el-switch-on-color: #13ce66;
              --el-switch-off-color: #ff4949;
            "
          ></el-switch>
        </el-form-item>
        <el-form-item label="显示组尾标题" label-width="100px">
          <el-switch
            v-model="otheropts.showGrpFootTitle"
            class="ml-2"
            size="small"
            active-text="是"
            inactive-text="否"
            :active-value="true"
            :inactive-value="false"
            @change="doSearch()"
            style="
              --el-switch-on-color: #13ce66;
              --el-switch-off-color: #ff4949;
            "
          ></el-switch>
        </el-form-item>
        <el-form-item label="工资条样式" label-width="100px">
          <el-switch
            v-model="otheropts.eachRowHead"
            class="ml-2"
            size="small"
            active-text="是"
            inactive-text="否"
            :active-value="true"
            :inactive-value="false"
            @change="doSearch()"
            style="
              --el-switch-on-color: #13ce66;
              --el-switch-off-color: #ff4949;
            "
          ></el-switch>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="另存为" width="400px" v-model="dialogSaveVisible">
      <el-form>
        <el-form-item label="文件名" label-width="80">
          <el-input
            v-model="file.repname"
            placeholder="请输入文件名"
            @change="nameChange()"
          ></el-input>
        </el-form-item>
        <el-form-item label="报表抬头" label-width="80">
          <el-input
            v-model="file.title"
            placeholder="请输入报表抬头"
          ></el-input>
        </el-form-item>
        <el-form-item label="使用权限" label-width="80">
          <el-radio-group v-model="file.right">
            <el-radio
              v-for="item in rightOpen"
              :label="item.itemname"
              :value="item.itemid"
            ></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="固化查询" label-width="80">
          <el-checkbox
            label="固化查询将不能更改已经设置的查询条件。"
            v-model="isforzencondi"
          ></el-checkbox
        ></el-form-item>

        <el-form-item label=""></el-form-item>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-button
              type="primary"
              @click="handlesaveother"
              :disabled="savedisabled"
              >保存</el-button
            >
            <el-button @click="dialogSaveVisible = false">离开</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>

    <el-dialog title="表头，签名" width="400px" v-model="dialogSignVisible">
      <el-form>
        <el-form-item label="报表头">
          <el-input
            v-model="file.title"
            placeholder="请输入表头"
            @change="doSearch()"
          ></el-input>
        </el-form-item>
        <el-form-item label="签名[逗号,分隔]" label-width="120">
          <el-input
            v-model="file.signs"
            placeholder="请输入签名，多个签名用逗号','分割"
            :rows="4"
            type="textarea"
            @change="signChange"
          ></el-input>
        </el-form-item>
        <el-form-item label="每行签名数" label-width="120">
          <el-input-number
            size="small"
            v-model="file.signbyrow"
            placeholder="0"
            :min="1"
            :max="10"
          ></el-input-number>
        </el-form-item>
        <el-form-item label=""></el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="数据源" width="400px" v-model="dialogDBSVisible">
      <el-form>
        <el-form-item label="数据源" label-width="100">
          <el-input
            v-model="file.dbs"
            placeholder="请输入数据源"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-divider>字段描述</el-divider>
        <el-row :gutter="24">
          <el-col :span="12" v-for="item in allflds.data" :key="item.fld">
            <el-form-item :label="item.fld" label-width="80" size="small">
              <el-input
                v-model="item.descs"
                placeholder="请输入名称"
                @change="doSearch()"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref, nextTick, reactive, watch, toRaw, inject } from "vue";
import { ElMessage } from "element-plus";
import { rightOpen, chkName } from "../../../utils/comdata";
import tmpdata from "./../TMPData01";
import { AX } from "../../../utils/api";
import { v4 as uuidv4 } from "uuid";
import rep from "../../../utils/rep";
import * as moment from "moment";
import * as $ from "jquery";
import { useRightStore, useUserStore } from "../../../store/index";
import { ElLoading } from "element-plus";

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  file: {
    type: Object,
    required: true,
  },
  flds: {
    type: Object,
    required: true,
  },
  ischanged: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["loaddata"]);

const rightstore = useRightStore();
const userstore = useUserStore();

let dialogPropVisible = ref(false);
let dialogMoreVisible = ref(false);
let dialogContentVisible = ref(false);
let dialogSetSumVisible = ref(false);
let dialogSetGrpVisible = ref(false);
let dialogSettingVisible = ref(false);
let dialogCellVisible = ref(false);
let dialogColVisible = ref(false);
let dialogSaveVisible = ref(false);
let dialogDBSVisible = ref(false);
let dialogSignVisible = ref(false);

let dosearchTYPE = 0;

let savedisabled = ref(false);
let isforzencondi = ref(false);

let findbox = reactive({ data: [] });
let findname = ref("");

let showflds = reactive({ items: [] });
let sumflds = reactive({ items: [] });
let grpflds = reactive({ items: [] });

let default_showflds = ["rtc"];
let default_grpflds = [];
let default_sumflds = [];

let allflds = reactive({ data: [] });

let fldprop = [
  { fld: "rct", descs: "#", width: 0, sort: 0, grpsum: 0, grp: 0 },
];

let prdata = reactive({ items: [] });
let findchk = reactive({ items: [] });
let filterOpts = {};
const fbs = reactive({ items: [] });
let loading = false;

const btns = {
  condi: !false,
  conten: !false,
  size: !false,
  order: !false,
  size: !false,
  sum: !false,
  sign: !false,
  setting: !false,
  dbs: !false,
  refresh: !false,
  printer: !false,
  save: !false,
  grp: !false,
  setDefault: false,
};

let file = ref({
  //数据源
  dbs: "pr",
  //表头
  title: "报表头",
  //薪资明细报表
  repname: "报表1",
  //保存时候的权限
  right: "0",
  //保存时候的签名
  signs: ["制表人", "审核人", "人事部", "财务部", "业主代表", "总经理"].join(
    ","
  ),
  //一行有几个签名，多个签名的时候，可以控制一行有几个签名，比如默认是3，就是一行3个，一共2行
  signbyrow: 3,
  rowheight: 0,
});

let otheropts = ref({
  sumgrp: "foot",
  showData: true,
  showGrpHead: true,
  showGrpFoot: true,
  eachRowHead: false,
  showGrpFootTitle: true,
  showGrpHeadTitle: true,
});

const printObj = {
  id: "printArea", //id
  popTitle: "", //自定义设置标题
  extraHead: "", //最上方的头部文字，附加在head标签上的额外标签,使用逗号分隔
  preview: false, // 是否启动预览模式，默认是false（开启预览模式，可以先预览后打印）
  previewTitle: "", // 打印预览的标题（开启预览模式后出现）,
  previewPrintBtnLabel: "", // 打印预览的标题的下方按钮文本，点击可进入打印（开启预览模式后出现）
  zIndex: "", // 预览的窗口的z-index，默认是 20002（此值要高一些，这涉及到预览模式是否显示在最上面）
  previewBeforeOpenCallback: () => {}, //预览窗口打开之前的callback（开启预览模式调用）
  previewOpenCallback: () => {}, // 预览窗口打开之后的callback（开启预览模式调用）
  beforeOpenCallback: () => {}, // 开启打印前的回调事件
  openCallback: () => {}, // 调用打印之后的回调事件
  closeCallback: () => {}, //关闭打印的回调事件（无法确定点击的是确认还是取消）
  url: "",
  standard: "",
  extraCss: "",
};

const filterData = (data, condi) => {
  let newdata = [];
  //将data数据中的值全部给newdata.
  for (let i = 0; i < data.length; i++) {
    newdata.push(toRaw(data[i]));
  }

  //根据condi条件进行筛选

  Object.keys(condi).forEach((k) => {
    for (let i = 0; i < newdata.length; i++) {
      //遍历condi对象，找到其中每个对象的K,并找到newdata[k]的值是否和该对象的的值匹配
      //如果不匹配，就把newdata响应的值去掉。
      if (newdata[i][k] && condi[k].indexOf(newdata[i][k]) == -1) {
        newdata.splice(i, 1);
        i--;
      }
    }
  });

  return newdata;
};
const ini_data = () => {
  // $("#rep").empty();
  // console.log("这是进来的prop data ===", props.data);
  const data = filterData(props.data, props.flds.condi);

  let rtype = 0;

  if (!data) {
    return rtype;
  }

  prdata.items.splice(0, prdata.items.length);
  prdata.items.push(...data);

  file.value = { ...file.value, ...props.file };

  otheropts.value = { ...otheropts.value, ...props.flds.otheropts };

  if (props.flds.flds && props.flds.flds.length > 0) {
    allflds.data.splice(0, allflds.data.length);
    allflds.data.push(...props.flds.flds);
    //-----------------------------------------------------------------
    showflds.items.splice(0, showflds.items.length);
    allflds.data.filter((fld) => {
      if (fld.show == 1) {
        showflds.items.push(fld.fld);
      }
    });

    //-----------------------------

    grpflds.items.splice(0, grpflds.items.length);
    let tmpdata = [];

    tmpdata = allflds.data.filter((fld) => {
      return fld.grp > -1;
    });
    tmpdata.sort((a, b) => {
      a.grp - b.grp;
    });

    tmpdata.filter((fld) => {
      grpflds.items.push(fld.fld);
    });

    //----------------------------------------------

    sumflds.items.splice(0, sumflds.items.length);
    allflds.data.filter((fld) => {
      if (fld.grpsum == 1) {
        sumflds.items.push(fld.fld);
      }
    });
    // console.log("##############################", sumflds.items);
    //----------------------------------------------------------
    rtype = 2;
  } else {
    rtype = 1;

    // console.log("这是进来的prop===", props.flds, props.data);

    default_showflds.splice(0, default_showflds.length);
    default_showflds.push(...props.flds.showflds);

    default_grpflds.splice(0, default_grpflds.length);
    default_grpflds.push(...props.flds.grpflds);

    default_sumflds.splice(0, default_sumflds.length);
    default_sumflds.push(...props.flds.sumflds);

    fldprop.splice(0, fldprop.length);
    fldprop.push(...props.flds.fldprop);

    //-----------------------------------------------------------------
    showflds.items.splice(0, showflds.items.length);
    showflds.items.push(...default_showflds);

    grpflds.items.splice(0, grpflds.items.length);
    grpflds.items.push(...default_grpflds);

    sumflds.items.splice(0, sumflds.items.length);
    sumflds.items.push(...default_sumflds);

    const newflds = rep.IntegrateFlds(
      prdata.items,
      showflds.items,
      grpflds.items,
      sumflds.items,
      fldprop
    );
    // console.log("风风风风风风风风风风风风风风风风风风风风风", props.flds);
    // console.log("1----1:", aflds.data);
    // aflds.data.splice(0, aflds.data.length);
    // aflds.data.push(...newflds);
    // console.log("2----2:", aflds.data);
    allflds.data.splice(0, allflds.data.length);
    allflds.data.push(...newflds);
    // console.log("3----3:", allflds.data);
    // console.log("newfldprop2", newflds);
  }
  //---------------------------------------------------------

  // console.log("allflds2:", allflds.data);
  return rtype;
};

watch(
  () => [props.ischanged],
  (newVal, oldVal) => {
    console.log("模版监听");
    console.log("new", newVal);
    console.log("old", oldVal);

    //如果检测到数据是小于100的，那么
    //就是这个页面被打开了，第一件事就是
    //先把table中的原始数据清空，这个很重要。
    if (newVal <= 100) {
      //使用jquery 来清空 table 表单的所有内容
      $("#rep").empty();
      console.log("clear old data");
      return;
    }
    //-如果随机数不是大于100，那么就等于点了刷新按钮
    //这时候需要把数据给下载下来。就可以执行下面的语句了。

    dosearchTYPE = ini_data();
    console.log("dosearchType", dosearchTYPE);
    if (dosearchTYPE != 0) {
      doSearch(dosearchTYPE);
    }
  },
  {
    //必须有这个东西，如果监控的是对象的话。
    deep: true,
    immediate: true,
  }
);

const nameChange = () => {
  file.value.title = file.value.repname;
};

const findboxChange = (val) => {
  let vals = [];
  let fn = findname.value;
  if (Object.keys(filterOpts).indexOf(fn) >= 0) {
    if (filterOpts[fn].includes(val)) {
      // console.log(val, filterOpts[fn].indexOf(val));
      filterOpts[fn].splice(filterOpts[fn].indexOf(val), 1);
    } else {
      vals = filterOpts[fn].push(val);
    }
  } else {
    vals.push(val);
    filterOpts[fn] = vals;
  }

  // console.log("---", filterOpts, "================", findchk.items);
  drawfb();
  doSearch();
};

const drawfb = () => {
  fbs.items = [];
  Object.keys(filterOpts).forEach((k) => {
    const obj = {};
    obj.fld = k;
    obj.descs = filterOpts[k];
    fbs.items.push(obj);
  });
};

const setShowFlds = () => {
  doSearch();
};

const setSumFlds = () => {
  //如果合计中出现了该值，那么show中也应该存在
  //相反不行。因为show中存在非合计项目，比如工号和姓名，显然不能存在
  //sumflds 中。
  sumflds.items.forEach((s) => {
    if (!showflds.items.includes(s)) {
      showflds.items.push(s);
    }
  });
  doSearch();
};

const setBodyTrH = () => {
  $("table td").css("--trh", file.value.rowheight);
};
const showSignForm = () => {
  dialogSignVisible.value = true;
};
const showDBSForm = () => {
  dialogDBSVisible.value = true;
};
const showSaveForm = () => {
  if ($("#rep").html().length <= 0) {
    ElMessage({
      message: "请先刷新数据，再做设置！",
      type: "error",
    });
    return;
  }
  savedisabled.value = false;
  dialogSaveVisible.value = true;
};

const showCondiForm = () => {
  if ($("#rep").html().length <= 0) {
    ElMessage({
      message: "请先刷新数据，再做设置！",
      type: "error",
    });
    return;
  }
  dialogMoreVisible.value = true;
};

const showColForm = () => {
  if ($("#rep").html().length <= 0) {
    ElMessage({
      message: "请先刷新数据，再做设置！",
      type: "error",
    });
    return;
  }
  dialogColVisible.value = true;
};

const showSetSumForm = () => {
  if ($("#rep").html().length <= 0) {
    ElMessage({
      message: "请先刷新数据，再做设置！",
      type: "error",
    });
    return;
  }
  dialogSetSumVisible.value = true;
};

const showSetGrpForm = () => {
  if ($("#rep").html().length <= 0) {
    ElMessage({
      message: "请先刷新数据，再做设置！",
      type: "error",
    });
    return;
  }
  dialogSetGrpVisible.value = true;
};

const showCellForm = () => {
  if ($("#rep").html().length <= 0) {
    ElMessage({
      message: "请先刷新数据，再做设置！",
      type: "error",
    });
    return;
  }
  dialogCellVisible.value = true;
};

const showContenForm = () => {
  if ($("#rep").html().length <= 0) {
    ElMessage({
      message: "请先刷新数据，再做设置！",
      type: "error",
    });
    return;
  }
  dialogContentVisible.value = true;
};

const showSettingForm = () => {
  if ($("#rep").html().length <= 0) {
    ElMessage({
      message: "请先刷新数据，再做设置！",
      type: "error",
    });
    return;
  }
  dialogSettingVisible.value = true;
};

const signChange = () => {};

const getDataByFld = (fld) => {
  if (!fld || fld == "rct") {
    return;
  }

  findname.value = fld;
  //--------------------------------findbox
  //-所有字段
  findbox.data.splice(0, findbox.data.length);

  prdata.items.map((el) => {
    //查找对应字段，并把该字段的所有数据放到findbox.data 中。
    if (!findbox.data.includes(el[fld])) {
      findbox.data.push(el[fld]);
    }
  });
  findbox.data.sort();

  //-------------------------------------------

  //这里是判断如果打开的时候，如果该项目已经存在选项，那么需要把选项加入
  //到findchk的items中，因为这里表示项目是否被选中，非常重要。
  findchk.items.splice(0, findchk.items.length);
  if (filterOpts[fld] && filterOpts[fld].length > 0) {
    findchk.items.push(...filterOpts[fld]);
  }
  //-------------------------------------------------------
  dialogPropVisible.value = true;
};

const delfb = (fb) => {
  fbs.items.forEach((el, idx) => {
    if (el.fld == fb.fld) {
      fbs.items.splice(idx, 1);
    }
  });
  //清除对应的条件
  delete filterOpts[fb.fld];
  doSearch();
};

const sortShowFlds = (allflds, showflds) => {
  let data = [];
  allflds.data.sort((a, b) => {
    return a.sort - b.sort;
  });

  allflds.data.forEach((el) => {
    if (showflds.items.includes(el.fld)) {
      data.push(el);
    }
  });

  //清空showflds
  showflds.items.splice(0, showflds.items.length);
  data.forEach((el) => {
    showflds.items.push(el.fld);
  });
};
// const clkrep = inject("clkrep");
const loaddata = () => {
  // console.log("kkkkkkkkdddddddddddddd", clkrep);

  if ($("#rep").html().length > 0) {
    ElMessage({
      message: "数据已经下载完毕！",
      type: "error",
    });
    return;
  }
  loading = true;
  emit("loaddata");
};

const handlesaveother = () => {
  // console.log($("#rep").html());
  savedisabled.value = true;
  if (!chkName(file.value.repname.trim())) {
    ElMessage({
      message: "文件名不符合要求！",
      type: "error",
    });
    savedisabled.value = false;
    return;
  }

  if ($("#rep").html().length <= 0) {
    ElMessage({
      message: "保存失败，请先刷新数据，并保证有有效数据显示！",
      type: "error",
    });
    savedisabled.value = false;
    return;
  }

  //保存的内容一共如下：
  //1:全字段(包括，字段，字段描述，尺寸大小，列序,组，合计)
  //2:条件的对象{a:1,b:2,c:3,d:[]}
  //3:组字段['部门','级别']
  //综合下来的结果为：
  //{flds:[{id:'a',descs:'aa',width:4,sort:12,grpsum:1},
  //{ id: 'a', descs: 'aa', width: 4, sort: 12, grpsum: 1 }],opts: { }, condi: { },file:{}}
  //

  const saveObj = {
    itemid: uuidv4(),
    itemname: file.value.repname,
    type: file.value.dbs,
    itemfees: file.value.right,
    dicmid: "cusrep",
    rid: userstore.getUser(false).rid,
    comid: userstore.getUser(false).comid,
    code1: {
      flds: allflds.data,
      sumflds: sumflds.items,
      grpflds: grpflds.items,
      showflds: showflds.items,
      opts: otheropts.value,
      condi: filterOpts,
      file: file.value,
    },
    createdby:
      userstore.getUser(false).usrname + "_" + userstore.getUser(false).tele,
    updatedby:
      userstore.getUser(false).usrname + "_" + userstore.getUser(false).tele,
  };

  // console.log(saveObj, filterOpts, userstore.getUser(false));

  AX("post", "dic", saveObj).then((res) => {
    dialogSaveVisible.value = false;
  });
};

const setDefault = () => {};

function doSearch(type = 1) {
  //--------------------------------------------
  // sortShowFlds(allflds, showflds);

  let html = "";

  if (![1, 2].includes(dosearchTYPE)) {
    return;
  }
  // console.log("===================", allflds);
  if (dosearchTYPE == 1) {
    // console.log(showflds.items);
    // console.log(grpflds.items);
    // console.log(sumflds.items);
    // console.log(allflds.data);

    const newflds = rep.IntegrateFlds(
      prdata.items,
      showflds.items,
      grpflds.items,
      sumflds.items,
      fldprop
    );
    // console.log("do---------newflds:", type, newflds);
    allflds.data.splice(0, allflds.data.length);
    allflds.data.push(...newflds);
  }
  if (dosearchTYPE == 2) {
    const newflds = rep.IntegrateFlds(
      prdata.items,
      showflds.items,
      grpflds.items,
      sumflds.items,
      allflds.data
    );
    // console.log("do---------newflds:", type, newflds);
    allflds.data.splice(0, allflds.data.length);
    allflds.data.push(...newflds);
  }

  rep
    .drawRep(prdata.items, allflds.data, {
      filterOpts,
      ...otheropts.value,
    })
    .then((html) => {
      // console.log(html);
      if (html) {
        $("#rep").html(html);
        $(".header").html(file.value.title);
        $(".printdate").html(moment().format("YYYY-MM-DD HH:mm"));
        $(".pgnum").html("#" + Date.now());
      }
      loading = false;
      setInterval(function () {
        //这里有问题，如果本身就没有任何数据，那不是要等死
        //后面再想想其他办法，这个主要是为了不让使用者频繁点击。
        //目的达到就行。
        // const html = $("#rep").html();
        // if (html && html.length > 0) {
        clearInterval();
        // }
      }, 1000);
    });

  console.log($(".hclk"));

  $(".hclk").click(function (e) {
    let $this = $(this);
    let fld = $this.attr("data");
    console.log(Math.random(), fld);
    getDataByFld(fld);
  });
}
$(() => {
  $("span.fb").click(function (e) {
    console.log(e);
  });
});
</script>

<style>
@page {
  size: A4 landscape;
  margin: 10mm;
}

* {
  font-family: 微软雅黑, 宋体, Arial, Helvetica, sans-serif;
  font-size: 12px;
}

body {
  margin: 0px;
  padding: 45px auto 0px auto;
  counter-reset: page;
}

@media print {
  #printArea {
    position: relative;
  }
  .print-header {
    display: block;
    text-align: center;
    display: block;
    /* position: fixed; */
    top: 0;
    left: 0;
    width: 100%;
    height: 20px;
  }
  print-content {
    page-break-after: always; /* 确保每个print-content后都有分页 */
    height: 90%;
  }
  .print-footer {
    display: block;
    text-align: center;
    position: fixed;
    background-color: #c91212;
    top: 0;
    left: 0;
    width: 100%;
    height: 20px;
  }
  thead {
    display: table-header-group !important ;
  }

  tfoot {
    display: table-footer-group !important ;
  }
  /* 显示页脚和页码 */
  #page-footer,
  #page-footer .page-number {
    visibility: visible;
  }

  /* 设定页码样式 */
  .page-number:before {
    content: "Page " counter(page);
  }
}
table {
  /**- "width: 100%;" sets the width of the table to 100% of its container.
- "border-collapse: collapse;" collapses the borders between table cells, creating a seamless look.
- "table-layout: fixed;" fixes the table layout, which means the browser will render the table once it has all the data, rather than gradually as it receives it.
- "word-break: break-all;" breaks words that are too long to fit in a cell, preventing them from overflowing and disrupting the layout. */
  width: 100%;
  border-collapse: collapse;
  /* table-layout: fixed; */
  word-break: break-all;
  margin-top: 20px;
}
thead {
  background-color: lightgrey;
}
.header,
.footer {
  height: 20px;
}

thead {
  display: table-header-group;
}

tfoot {
  display: table-footer-group;
}
tr {
  page-break-inside: avoid;
}
td {
  text-align: center;
}
table {
  counter-reset: rc;
}

td.rct {
  counter-increment: rc;
}

td.rct::after {
  content: counter(rc);
}
.repfooter {
  width: 90%;
  padding-left: 100px;
}

.sign {
  margin-top: 60px;
  display: flex;
  justify-content: space-between;
}
.sign span {
  display: block;
  width: 400px;
}
.headtr,
.foottr {
  background-color: white;
  border: 1px solid transparent;
  border-bottom: 1px solid black;
}
.foottr {
  border: 1px solid transparent;
}

.header {
  font-weight: 700;
}

body tr {
  border: 1px solid black;
}

body td {
  --trh: 0;
  padding-top: calc(var(--trh, 1px) * 1px);
  padding-bottom: calc(var(--trh, 1px) * 1px);
}

table .printdate,
.pgnum {
  float: right !important;
  margin-top: -10px;
  background-color: transparent !important;
  border: 0;
}
table .pgnum {
  margin-top: 0px;
  float: left;
  font-size: 12px;
}
.hclk {
  cursor: pointer;
}
.hclk:hover {
  color: white;
}
.el-checkbox__label {
  width: 50px;
}
.optsblock {
  margin-top: 10px;
  background-color: #e2e2e2;
  border: 1px solid #ccc;
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: flex-start;
}
.fb {
  font-size: 7px;
  display: block;
  width: fit-content;
  border: 0px dotted #ccc;
  background-color: #e4e3e3;
  padding-left: 2px;
  margin-left: 2px;
  margin-top: 0;
  margin-bottom: 0;
  cursor: pointer;
}
.el-tag {
  cursor: pointer;
  margin: 4px;
}
.example-showcase .el-loading-mask {
  z-index: 9;
}
</style>
filename
