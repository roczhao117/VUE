<template>
  <div style="min-width: 100px">
    <el-container>
      <el-tabs type="border-card" style="width: 100%" v-model="activeTab">
        <el-tab-pane label="人事信息" name="HR">
          <hrinfo></hrinfo>
        </el-tab-pane>
        <el-tab-pane label="奖惩管理">
          <awardmgr></awardmgr>
        </el-tab-pane>
        <el-tab-pane label="证件管理">
          <passportmgr></passportmgr>
        </el-tab-pane>
        <el-tab-pane label="调动管理">
          <transformmgr></transformmgr>
        </el-tab-pane>
        <el-tab-pane label="合同管理">
          <contractmgr></contractmgr>
        </el-tab-pane>
        <el-tab-pane label="领用管理">
          <receiptmgr></receiptmgr>
        </el-tab-pane>
        <el-tab-pane label="面试信息"></el-tab-pane>
      </el-tabs>
    </el-container>
  </div>
</template>

<script>
import hrinfo from "../components/hrinfo.vue";
import awardmgr from "../components/awardmgr";
import contractmgr from "../components/contractmgr";
import passportmgr from "../components/passportmgr";
import transformmgr from "../components/transformmgr";
import receiptmgr from "../components/receiptmgr";

export default {
  data() {
    return {
      activeTab: "HR",
    };
  },
  components: {
    hrinfo,
    awardmgr,
    contractmgr,
    passportmgr,
    transformmgr,
    receiptmgr,
  },
};
</script>
