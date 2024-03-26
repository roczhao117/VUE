<template>
  <div class="about">
    <el-container>
      <el-tabs type="border-card" v-model="activeTab">
        <el-tab-pane label="角色设置" name="role">
          <role></role>
        </el-tab-pane>
      </el-tabs>
    </el-container>
  </div>
</template>


<script>
import role from '../components/role.vue';

export default {
  data() {
    return {
      activeTab: "role",
    }
  },

  components: { role, },

}


</script>
