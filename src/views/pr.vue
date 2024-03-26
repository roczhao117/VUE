<template>
  <div style="min-width:100px;">
    <el-container>
      <el-tabs type="border-card" style="width:100%">
        <el-tab-pane label="薪资人员" name="PR">
          <prinfo></prinfo>
        </el-tab-pane>
        <el-tab-pane label="薪资对比">
          <prcompare></prcompare>
        </el-tab-pane>
        <el-tab-pane label="薪资帐套">
          <pritem></pritem>
        </el-tab-pane>
      </el-tabs>
    </el-container>
  </div>
</template>


<script>
import prcompare from '../components/prcompare.vue'
import prinfo from '../components/prinfo.vue'
import pritem from '../components/pritem.vue'

export default {
  components: { prinfo, pritem, prcompare },


}


</script>