<template>
  <div class="about">
    <el-container>
      <el-tabs type="border-card" style="width:99%;" v-model="activeTab">
        <el-tab-pane label="账号策略" name="policy">
          <policy></policy>
        </el-tab-pane>
      </el-tabs>
    </el-container>
  </div>
</template>


<script>
import policy from '../components/policy.vue'
// import policy from '../components/policy.vue'
// import role from '../components/role.vue'

export default {
  data() {
    return {
      activeTab: "policy",
    }
  },

  components: { policy, },

}


</script>


