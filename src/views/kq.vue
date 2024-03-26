<template>
  <div style="min-width:100px;">
    <el-container>
      <el-tabs type="border-card" style="width:100%">
        <el-tab-pane label="考勤人员" name="kq">
          <kqinfo></kqinfo>
        </el-tab-pane>
        <el-tab-pane label="班次设置">
          <kqshift></kqshift>
        </el-tab-pane>
        <el-tab-pane label="考勤报表">></el-tab-pane>
      </el-tabs>
    </el-container>
  </div>
</template>


<script>
import kqinfo from '../components/kqinfo.vue'
import kqshift from '../components/kqshift'


export default {
  components: { kqinfo, kqshift, },


}


</script>