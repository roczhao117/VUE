<template>
  <div>
    <el-container>
      <el-header>Header</el-header>
      <el-container>
        <el-aside width="200px">
        <el-menu :default-openeds="['1', '3']" router>
          <div v-for="(item,index) in this.$router.options.routes" 
          :key="index"
          >
          <el-submenu index="1" v-if="!item.hidden">
              <template #title> 
                <i class="el-icon-user-solid"></i>
                <span>{{item.name}}</span>

              </template>
              <el-menu-item :index="children.path" v-for="(children,index) in item.children" :key="index">{{children.name}}</el-menu-item>
            </el-submenu>
          </div>
          </el-menu>
        </el-aside>
        <el-container>
          <el-main>
           
            <router-view />
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Home",
  methods: {
    menuClick(index) {
      this.$router.push(index);
    }
  }

};
</script>

<style>
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>