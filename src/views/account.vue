<template>
  <div class="about">
    <el-container>
      <el-tabs type="border-card" style="width:99%;" v-model="activeTab">
        <el-tab-pane label="用户管理" name="user">
          <user></user>
        </el-tab-pane>
      </el-tabs>
    </el-container>
  </div>
</template>


<script>
import user from '../components/user.vue'
// import policy from '../components/policy.vue'
// import role from '../components/role.vue'

export default {
  data() {
    return {
      activeTab: "user",
    }
  },

  components: { user, },

}


</script>
