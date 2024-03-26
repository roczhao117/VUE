<script setup>
import { useDeptPosStore, useDicStore } from "../../store/index";
import { onMounted, getCurrentInstance, ref } from "vue";
import { hiprint, defaultElementTypeProvider } from "vue-plugin-hiprint";
import template from "./templates/template_std";

import pd from "./printData";
// 组合式函数 hooks
import { usePaper } from "../../hooks/use-paper";
import { useZoom } from "../../hooks/use-zoom";

// 工具
import { newHiprintPrintTemplate } from "../../utils/template-helper";

const TEMPLATE_KEY = getCurrentInstance().type.name; // 存储模板对象的 key
const {
  paperTypes,
  curPaperType,
  paperPopVisible,
  paperWidth,
  paperHeight,
  showPaperPop,
  setPaper,
  setPaperOther,
} = usePaper(TEMPLATE_KEY);
const { scaleValue, changeScale } = useZoom(TEMPLATE_KEY);

const dicstore = useDicStore();
const deptstore = useDeptPosStore();

// 自定义传入 provider 的参数
let options = {
  config: {
    tid: "providerModule1.config",
    title: "参数provider示例",
    type: "text",
    options: {
      testData: "单据表头",
      height: 30,
      fontSize: 16,
    },
  },
};

let pd1 = {};
pd1.table = [
  { name: "jack", emid: "1001" },
  { name: "kindy", emid: "1002" },
  { name: "tom", emid: "1003" },
  { name: "john", emid: "1004" },
];
let pd2 = {};
// 初始化 provider
hiprint.init({
  providers: [new defaultElementTypeProvider()],
});
/**
 * 这里必须要在 onMounted 中去构建 左侧可拖拽元素 或者 设计器
 * 因为都是把元素挂载到对应容器中, 必须要先找到该容器
 */
onMounted(() => {
  // console.log("################", pd1, pd);
  buildLeftElement();
  buildByProvider();
  buildDesigner();
  pd2.table = dicstore.getDic("prstaff");
  pd2.table = deptstore.deptData.data;
  // console.log(pd2.table, pd);
});
/**
 * 构建左侧可拖拽元素
 * 注意: 可拖拽元素必须在 hiprint.init() 之后调用
 * 而且 必须包含 class="ep-draggable-item" 否则无法拖拽进设计器
 */
const buildLeftElement = () => {
  // eslint-disable-next-line no-undef
  hiprint.PrintElementTypeManager.buildByHtml($(".ep-draggable-item"));
};

const buildByProvider = () => {
  $("#providerBox").empty(); // 先清空, 避免重复构建
  hiprint.PrintElementTypeManager.build(
    $("#providerBox"),
    "defaultModule" // 元素参数容器
  );
};
/**
 * 构建设计器
 * 注意: 必须要在 onMounted 中去构建
 * 因为都是把元素挂载到对应容器中, 必须要先找到该容器
 */
let hiprintTemplate;
// ref 创建的模板json
const templateRef = ref(template);
console.log("templateRef 数据格式:");
console.log("templateRef", templateRef);
console.log("templateRef.value", templateRef.value);
const buildDesigner = () => {
  // eslint-disable-next-line no-undef
  $("#designerBox").empty(); // 先清空, 避免重复构建
  // hiprintTemplate = new hiprint.PrintTemplate({
  //   template: {
  //     panels: [
  //       {
  //         width: 210,
  //         height: 297,
  //         printElements: [
  //           {
  //             options: {
  //               title: "文本1",
  //               left: 10,
  //               top: 10,
  //               width: 100,
  //               height: 100,
  //               field: "itemname",
  //             },
  //             printElementType: {
  //               title: "文本",
  //               type: "text",
  //             },
  //           },
  //           {
  //             options: {
  //               left: 60,
  //               top: 60,
  //               height: 56,
  //               width: 511.5,
  //               field: "table",
  //               tableFooterRepeat: "",
  //               fields: [
  //                 { text: "id", field: "itemid" },
  //                 { text: "姓名", field: "itemname" },
  //               ],
  //               columns: [
  //                 [
  //                   { width: 85.25, colspan: 1, rowspan: 1, checked: true },
  //                   {
  //                     title: "ID",
  //                     field: "itemid",
  //                     align: "center",
  //                     width: 24.25,
  //                     colspan: 1,
  //                     rowspan: 1,
  //                     checked: true,
  //                   },
  //                   {
  //                     title: "名称",
  //                     field: "itemname",
  //                     align: "center",
  //                     width: 60.0,
  //                     colspan: 1,
  //                     rowspan: 1,
  //                     checked: true,
  //                   },
  //                   {
  //                     title: "费用",
  //                     field: "itemfees",
  //                     align: "center",
  //                     width: 60.0,
  //                     colspan: 1,
  //                     rowspan: 1,
  //                     checked: true,
  //                     tableSummary: "sum",
  //                   },
  //                   {
  //                     title: "姓名",
  //                     field: "itemname ",
  //                     width: 40.25,
  //                     align: "center",
  //                     colspan: 1,
  //                     rowspan: 1,
  //                     checked: true,
  //                     tableSummary: "count",
  //                   },
  //                   {
  //                     title: "数量",
  //                     field: "count",
  //                     width: 85.25,
  //                     align: "center",
  //                     colspan: 1,
  //                     rowspan: 1,
  //                     checked: true,
  //                     tableSummary: "sum",
  //                   },
  //                   {
  //                     width: 85.25,
  //                     colspan: 1,
  //                     rowspan: 1,
  //                     checked: true,
  //                   },
  //                   { width: 85.25, colspan: 1, rowspan: 1, checked: true },
  //                 ],
  //               ],
  //             },
  //             printElementType: {
  //               title: "表格",
  //               type: "table",
  //             },
  //           },
  //         ],
  //       },
  //     ],
  //   },
  //   settingContainer: "#optionsBox", // 元素参数容器
  //   paginationContainer: "#optionsBox",
  //   paperNumberLeft: 565.5,
  //   paperNumberTop: 819,
  // });

  // hiprintTemplate = new hiprint.PrintTemplate();
  // hiprintTemplate.settingContainer = "optionsBox";
  // hiprintTemplate.paginationContainer = "optionsBox";

  // const panel = hiprintTemplate.addPrintPanel({
  //   width: 210,
  //   height: 297,
  //   pageFooter: 340,
  //   pageHeader: 10,
  // });
  // panel.addPrintText({
  //   options: {
  //     width: 140,
  //     height: 15,
  //     top: 20,
  //     left: 20,
  //     title: "hiprint插件手动添加text",
  //     textAlign: "center",
  //   },
  // });
  // panel.addPrintLongText({
  //   options: { width: 180, height: 35, top: 90, left: 20, title: "长文本：" },
  // });
  // panel.addPrintTable({
  //   options: {
  //     width: 252,
  //     height: 35,
  //     top: 130,
  //     left: 20,
  //     content: $("#testTable").html(),
  //   },
  // });

  // 构建 并填充到 容器中
  hiprintTemplate = newHiprintPrintTemplate(TEMPLATE_KEY, {
    template: templateRef.value, // 模板json(object)
    settingContainer: "#optionsBox", // 元素参数容器
  });

  hiprintTemplate.design("#designerBox", { grid: true });
};

/**
 * 旋转纸张
 */
const rotatePaper = () => {
  hiprintTemplate.rotatePaper();
};

const print = () => {
  // printData.push(...hrStatus);
  // let printData = [
  //   { name: "abc", age: 12 },
  //   { name: "efg", age: 49 },
  // ];
  // console.log("--------------", pd2, pd);
  // console.log("**************", pd, pd.table);
  // 参数: 打印时设置 左偏移量，上偏移量
  let options = { leftOffset: -1, topOffset: -1 };
  // 扩展
  let ext = {
    callback: () => {
      console.log("浏览器打印窗口已打开");
    },
    styleHandler: () => {
      // 重写 文本 打印样式
      return "<style>.hiprint-printElement-text{color:red !important;}</style>";
    },
  };
  // 调用浏览器打印
  hiprintTemplate.print(pd, options, ext);
  // hiprintTemplate.print(pd);
};

const print2 = () => {
  let printData = { name: "dd", age: !2 };
  hiprintTemplate.print2(printData, { printer: "打印机名字" });
  hiprintTemplate.on("printSuccess", function (e) {
    console.log("打印完成", e);
  });
  hiprintTemplate.on("printError", function (e) {
    console.log("打印失败", e);
  });
};

const exportJson = () => {
  let json = hiprintTemplate.getJson();
  console.log("json", json);
};

const importJson = () => {
  let json = hiprintTemplate.getJson();
  // console.log("json", json);
  hiprintTemplate.update(json);
};
</script>
<template>
  <div></div>
  <!-- 样式完全自定义 -->
  <div class="header">
    <!-- tid 与 defaultElementTypeProvider 中对应 -->
    <!-- 包含 class="ep-draggable-item" 
    <div class="ep-draggable-item item dgi" tid="defaultModule.text">文本</div>
    <div class="ep-draggable-item item dgi" tid="defaultModule.image">图片</div>
    <div class="ep-draggable-item item dgi" tid="defaultModule.table">表格</div>
    <div class="ep-draggable-item item dgi" tid="defaultModule.oval">椭圆</div>

-->
    <!-- 样式完全自定义 -->
    <div class="flex-row justify-center flex-wrap">
      <div class="title">基础元素</div>
      <!-- tid 与 defaultElementTypeProvider 中对应 -->
      <!-- 包含 class="ep-draggable-item" -->
      <div class="ep-draggable-item item" tid="defaultModule.text">
        <i class="iconfont sv-text" />
        <span>文本</span>
      </div>
      <div class="ep-draggable-item item" tid="defaultModule.image">
        <i class="iconfont sv-image" />
        <span>图片</span>
      </div>
      <div class="ep-draggable-item item" tid="defaultModule.table">
        <i class="iconfont sv-table" />
        <span>表格</span>
      </div>
    </div>
    <!-- 纸张大小 A3、A4 等 -->
    <div class="paper">
      <template v-for="(value, type) in paperTypes" :key="type">
        <el-button
          :class="curPaperType === type ? 'api' : 'info'"
          @click="setPaper(type, value)"
        >
          {{ type }}
        </el-button>
      </template>
      <!-- 自定义纸张 -->
      <el-button
        :class="'other' == curPaperType ? 'api' : 'info'"
        class="auto"
        @click="showPaperPop"
      >
        自定义纸张
      </el-button>
      <div class="popover">
        <div class="popover-content flex-col" v-show="paperPopVisible">
          <div style="font-size: 16px; font-weight: bold">设置纸张宽高(mm)</div>
          <div class="flex-row mt-10">
            <input
              class="input"
              :value="paperWidth"
              type="number"
              placeholder="宽(mm)"
            />
            <span class="ml-10 mr-10">x</span>
            <input
              class="input"
              :value="paperHeight"
              type="number"
              placeholder="高(mm)"
            />
          </div>
          <button
            class="primary circle-10"
            style="margin-top: 6px"
            @click.stop="setPaperOther"
          >
            确定
          </button>
        </div>
      </div>
    </div>
    <el-button type="primary" @click.stop="rotatePaper"
      >旋转纸张(宽高互换)</el-button
    >
    <el-button type="primary" @click="print">浏览器打印</el-button>
    <el-button type="primary" @click="print2">直接打印</el-button>
    <el-button type="primary" @click="exportJson">导出模版数据</el-button>
    <el-button type="primary" @click="importJson">导入模版数据</el-button>
  </div>
  <div id="panelsBox"></div>
  <div class="main">
    <!-- 设计器的 容器 -->
    <div class="left rect-printElement-types" id="providerBox"></div>

    <div class="center" id="designerBox"></div>

    <div class="right" id="optionsBox"></div>
  </div>
  <div id="'testTable'"></div>
</template>
<style scoped>
.api {
  background: #00acc1;
  color: blueviolet;
}
.paper {
  margin-right: 10px;
}
.dgi {
  margin-right: 20px;
}
.header {
  height: 50px;
  display: flex;
  justify-content: left;
}
.main {
  display: flex;
  justify-content: left;
}
.left {
  display: flex;
  justify-content: right;
}
.right {
  display: flex;
  justify-content: right;
  width: 300px;
}
</style>
