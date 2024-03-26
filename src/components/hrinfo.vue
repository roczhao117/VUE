<template>
  <el-container direction="vertical">
    <!-- 查询头 -->
    <div style="display: flex; margin: 1px; margin-right: 20px">
      <el-tooltip content="新加员工" placement="top">
        <el-button type="primary" @click="handleNew()"
          ><el-icon><Plus /></el-icon>加人</el-button
        >
      </el-tooltip>
      <el-tooltip content="刷新数据" placement="top">
        <el-button type="primary" @click="listMain()"
          ><el-icon><Refresh /></el-icon>刷新</el-button
        >
      </el-tooltip>
      <el-input
        placeholder="请输入查找的人名"
        v-model="inputsearch"
        class="input-with-select"
        v-on:keydown.enter="listMain()"
      >
        <template #append>
          <el-button @click="listMain()">查询</el-button>
        </template>
      </el-input>
      <el-tooltip content="高级查询" placement="top">
        <el-button
          type="primary"
          style="margin-left: 20px"
          @click="dialogMSVisible = true"
          ><el-icon><View /></el-icon>更多查询</el-button
        >
      </el-tooltip>
      <el-tooltip content="导出EXCEL" placement="top">
        <el-button type="primary" @click="exportexcel"
          ><el-icon><Download /></el-icon>导出X</el-button
        >
      </el-tooltip>
      <el-tooltip content="导入数据" placement="top">
        <el-button
          type="primary"
          @click="importexcel"
          style="margin: 1px; margin-left: 10px"
          ><el-icon><Upload /></el-icon>导入X</el-button
        >
      </el-tooltip>
      <input
        id="inexc"
        type="file"
        accept="excel2003/xls, excel2007/xlsx"
        style="position: absolute; clip: rect(0 0 0 0)"
        :onchange="fileonchange"
      /><el-tooltip content="人事报表" placement="top">
        <div class="flex flex-wrap items-center">
          <el-dropdown>
            <el-button
              type="primary"
              icon="Document-copy"
              style="margin-left: 10px"
              >报表<el-icon class="el-icon--right"><arrow-down /></el-icon
            ></el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="item of diccusrepData"
                  :key="item.id"
                  @click="openrep(item)"
                  >{{ item.itemname }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-tooltip>
      <el-tooltip content="报表设计" placement="top">
        <el-button
          type="primary"
          icon="edit"
          @click="cmd_designrep"
          style="margin-left: 10px"
          >报表设计</el-button
        >
      </el-tooltip>
    </div>
    <div style="display: flex; margin: 1px; margin-right: 20px">
      <el-checkbox
        label="在职员工"
        v-model="SF.showInstaff"
        true-label="1"
        false-label="0"
      ></el-checkbox>
      <el-checkbox
        label="激活员工"
        v-model="SF.showIsactive"
        true-label="1"
        false-label="0"
      ></el-checkbox>

      <el-checkbox
        label="社保信息"
        v-model="SF.showBenefit"
        true-label="1"
        false-label="0"
      ></el-checkbox>
      <el-checkbox
        label="附加信息"
        v-model="SF.showOther"
        true-label="1"
        false-label="0"
      ></el-checkbox>
    </div>
    <div class="demo-collapse">
      <el-collapse accordion>
        <el-collapse-item name="1">
          <template #title>
            提醒信息<el-icon class="header-icon">
              <info-filled />
            </el-icon>
          </template>
        </el-collapse-item>
      </el-collapse>
    </div>
    <!-- 人事表格子 -->
    <div style="display: flex; margin-top: 10px; height: 650px">
      <div style="border-right: 1px solid rgb(239, 239, 239); margin-left: 1px">
        <el-tree
          :data="deptData"
          show-checkbox
          node-key="id"
          ref="deptTree"
          :props="dpProps"
          :default-expand-all="true"
          @check="check"
          style="width: 250px; overflow-x: scroll; height: 715px"
        >
          <template #default="{ node, data }">
            <span :class="{ ispos: data.deptlevel == 2 }">
              {{ node.label }}
              <span class="pdmsg" v-if="data.deptlevel == 2">职位</span>

              <span class="pdmsg" v-if="data.deptlevel == 1">部门</span>
              <span class="companyflag" v-if="data.deptlevel == 0"
                ><el-icon><HomeFilled /></el-icon
              ></span>
            </span>
          </template>
        </el-tree>
      </div>
      <div style="margin-left: 20px; width: 100%; min-width: 800px">
        <el-table
          :data="tableData"
          style="width: 95%"
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          stripe
        >
          <el-table-column prop="id" fixed width="80" type="index">
            <template #default="scope">
              <span>{{
                (page.cpg - 1) * page.limit + (scope.$index + 1)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="comid" fixed="left" label="单位" width="120">
            <template #default="scope">
              <el-tag>{{
                dpList
                  .dicDescs(scope.row.comid, "dpid", "dpname")
                  .substring(0, 5)
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="isactive" fixed="left" label="激活" width="60"
            ><template #default="scope">
              <el-tag type="success" v-if="scope.row.isactive == 1"> ✔ </el-tag>
              <el-tag type="danger" v-if="scope.row.isactive == 0">✘</el-tag>
            </template></el-table-column
          >

          <el-table-column
            prop="emid"
            label="工号"
            width="100"
          ></el-table-column>
          <el-table-column
            prop="cname"
            fixed="left"
            label="中文名"
            width="80"
          ></el-table-column>
          <el-table-column prop="cname" fixed="left" label="状态" width="80"
            ><template #default="scope">
              <el-tag type="danger" v-if="scope.row.hrstatus == 1">{{
                dichrstatusData.dicDescs(scope.row.hrstatus)
              }}</el-tag>
              <el-tag type="success" v-if="scope.row.hrstatus == 0">{{
                dichrstatusData.dicDescs(scope.row.hrstatus)
              }}</el-tag>
            </template></el-table-column
          >
          <el-table-column
            prop="ename"
            label="英文名"
            width="120"
          ></el-table-column>
          <el-table-column prop="sex" label="性别" width="60">
            <template #default="scope">
              <span v-if="scope.row.sex == 1">男</span>

              <span v-else type="success">女</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="mz"
            label="民族"
            width="80"
            v-if="SF.showOther == '1'"
          ></el-table-column>
          <el-table-column
            prop="nation"
            label="籍贯"
            width="120"
            v-if="SF.showOther == '1'"
          ></el-table-column>
          <el-table-column
            prop="political"
            label="政治面貌"
            width="120"
            v-if="SF.showOther == '1'"
          >
            <template #default="scope">
              <span>{{
                dichrpoliticalData.dicDescs(scope.row.political)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="birthshow"
            label="生日"
            width="100"
          ></el-table-column>

          <el-table-column prop="dept" label="部门" width="120">
            <template #default="scope">
              <span>{{
                dpList.dicDescs(scope.row.dept, "dpid", "dpname")
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="position" label="职位" width="180">
            <template #default="scope">
              <span>{{
                dpList.dicDescs(scope.row.position, "dpid", "dpname")
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="datejoined"
            label="入职日期"
            width="100"
          ></el-table-column>

          <el-table-column
            prop="regualdate"
            label="转正日期"
            width="100"
          ></el-table-column>

          <el-table-column prop="type" label="类型" width="120">
            <template #default="scope">
              <span>{{ dichrtypeData.dicDescs(scope.row.type) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="grade" label="级别" width="80">
            <template #default="scope">
              <span>{{ dichrgradeData.dicDescs(scope.row.grade) }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="marry"
            label="婚姻"
            width="80"
            v-if="SF.showOther == '1'"
          >
            <template #default="scope">
              <span>{{ dichrmarryData.dicDescs(scope.row.marry) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="education"
            label="学历"
            width="100"
            v-if="SF.showOther == '1'"
          >
            <template #default="scope">
              <span>{{
                dichreducationData.dicDescs(scope.row.education)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="school"
            label="毕业学校"
            width="180"
            v-if="SF.showOther == '1'"
          ></el-table-column>
          <el-table-column
            prop="speciality"
            label="主修专业"
            width="120"
            v-if="SF.showOther == '1'"
          ></el-table-column>
          <el-table-column
            prop="reqleavedate"
            label="离职申请日期"
            width="120"
          ></el-table-column>
          <el-table-column
            prop="checkout"
            label="最后工作日"
            width="100"
          ></el-table-column>
          <el-table-column
            prop="bank1"
            label="银行卡号"
            width="180"
            v-if="SF.showOther == '1'"
          ></el-table-column>
          <el-table-column
            prop="idcard"
            label="身份证号"
            width="180"
            v-if="SF.showOther == '1'"
          ></el-table-column>

          <el-table-column
            prop="mtele"
            label="手机"
            width="120"
            v-if="SF.showOther == '1'"
          ></el-table-column>
          <el-table-column
            prop="address"
            label="现居住地"
            width="300"
            v-if="SF.showOther == '1'"
          ></el-table-column>
          <el-table-column
            prop="email"
            label="电子邮箱"
            width="200"
            v-if="SF.showOther == '1'"
          ></el-table-column>
          <el-table-column
            prop="qq"
            label="QQ"
            width="120"
            v-if="SF.showOther == '1'"
          ></el-table-column>
          <el-table-column
            prop="wechat"
            label="微信"
            width="120"
            v-if="SF.showOther == '1'"
          ></el-table-column>
          <el-table-column
            prop="sb7val"
            label="养老个人"
            width="120"
            v-if="SF.showBenefit == '1'"
          ></el-table-column>
          <el-table-column
            prop="sb0val"
            label="养老单位"
            width="120"
            v-if="SF.showBenefit == '1'"
          ></el-table-column>

          <el-table-column
            prop="sb8val"
            label="医疗个人"
            width="120"
            v-if="SF.showBenefit == '1'"
          ></el-table-column>
          <el-table-column
            prop="sb1val"
            label="医疗单位"
            width="120"
            v-if="SF.showBenefit == '1'"
          ></el-table-column>

          <el-table-column
            prop="sb9val"
            label="失业个人"
            width="120"
            v-if="SF.showBenefit == '1'"
          ></el-table-column>
          <el-table-column
            prop="sb3val"
            label="失业单位"
            width="120"
            v-if="SF.showBenefit == '1'"
          ></el-table-column>
          <el-table-column
            prop="sb10val"
            label="公积金个人"
            width="120"
            v-if="SF.showBenefit == '1'"
          ></el-table-column>
          <el-table-column
            prop="sb6val"
            label="公积金单位"
            width="120"
            v-if="SF.showBenefit == '1'"
          ></el-table-column>
          <el-table-column
            prop="sb2val"
            label="大病单位"
            width="120"
            v-if="SF.showBenefit == '1'"
          ></el-table-column>
          <el-table-column
            prop="sb4val"
            label="工伤单位"
            width="120"
            v-if="SF.showBenefit == '1'"
          ></el-table-column>
          <el-table-column
            prop="sb5val"
            label="生育单位"
            width="120"
            v-if="SF.showBenefit == '1'"
          ></el-table-column>
          <el-table-column
            prop="sb11val"
            label="残保金单位"
            width="120"
            v-if="SF.showBenefit == '1'"
          ></el-table-column>

          <el-table-column prop="id" fixed="right" label="操作" width="120">
            <template #default="scope">
              <span class="butgrp">
                <el-button
                  size="small"
                  icon="Edit"
                  @click="handleEdit(scope.$index, scope.row)"
                ></el-button>

                <el-button
                  size="small"
                  type="danger"
                  icon="Delete"
                  @click="handleDelete(scope.$index, scope.row)"
                ></el-button>
              </span>
            </template>
          </el-table-column>

          <el-table-column prop="id" label="更多" fixed="right" width="80">
            <template #default="scope">
              <el-dropdown trigger="click" @command="morecommand">
                <el-button type="primary" size="small">
                  <el-icon><arrow-down /></el-icon>
                </el-button>

                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      icon="User"
                      @click="cmd_family(scope.$index, scope.row)"
                      >家庭成员</el-dropdown-item
                    >
                    <el-dropdown-item
                      icon="OfficeBuilding"
                      @click="cmd_works(scope.$index, scope.row)"
                      >职业经历</el-dropdown-item
                    >
                    <el-dropdown-item
                      icon="School"
                      @click="cmd_education(scope.$index, scope.row)"
                      >教育背景</el-dropdown-item
                    >
                    <el-dropdown-item
                      icon="Medal"
                      @click="cmd_cert(scope.$index, scope.row)"
                      >资质证书</el-dropdown-item
                    >
                    <el-dropdown-item :divided="true"></el-dropdown-item>
                    <el-dropdown-item
                      icon="Document"
                      @click="cmd_contract(scope.$index, scope.row)"
                      >签订合同</el-dropdown-item
                    >
                    <el-dropdown-item
                      icon="DocumentChecked"
                      @click="cmd_passport(scope.$index, scope.row)"
                      >办理证件</el-dropdown-item
                    >
                    <el-dropdown-item
                      icon="Switch"
                      @click="cmd_transform(scope.$index, scope.row)"
                      >内部变动</el-dropdown-item
                    >

                    <el-dropdown-item
                      icon="Star"
                      @click="cmd_award(scope.$index, scope.row)"
                      >奖惩管理</el-dropdown-item
                    >

                    <el-dropdown-item
                      icon="Cpu"
                      @click="cmd_receipt(scope.$index, scope.row)"
                      >领用物品</el-dropdown-item
                    >
                    <el-dropdown-item :divided="true"></el-dropdown-item>
                    <el-dropdown-item
                      icon="moon"
                      @click="cmd_otlist(scope.$index, scope.row)"
                      >加班申请</el-dropdown-item
                    >
                    <el-dropdown-item
                      icon="headset"
                      @click="cmd_levlist(scope.$index, scope.row)"
                      >假单申请</el-dropdown-item
                    >
                    <el-dropdown-item
                      icon="ship"
                      disabled="true"
                      @click="cmd_levlist(scope.$index, scope.row)"
                      >长假申请</el-dropdown-item
                    >
                    <el-dropdown-item :divided="true"></el-dropdown-item>
                    <el-dropdown-item
                      disabled="true"
                      icon="list"
                      @click="cmd_expense(scope.$index, scope.row)"
                      >报销申请</el-dropdown-item
                    >
                    <el-dropdown-item :divided="true"></el-dropdown-item>
                    <el-dropdown-item
                      icon="Ship"
                      command="commandcheckout"
                      @click="cmd_checkout(scope.$index, scope.row)"
                      v-if="
                        scope.row.ifcheckout != 1 || scope.row.hrstatus != 1
                      "
                      >离职处理</el-dropdown-item
                    >
                    <el-dropdown-item
                      icon="CaretLeft"
                      command="commandcheckout"
                      @click="cmd_checkout(scope.$index, scope.row)"
                      v-if="
                        scope.row.ifcheckout == 1 || scope.row.hrstatus == 1
                      "
                      >撤销离职</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 翻页控件 -->
    <div style="margin-top: 17px; margin-left: 280px; height: 20px">
      <el-pagination
        background
        layout="total,prev, pager, next"
        :page-size="page.limit"
        @current-change="changePage"
        :current-page="page.cpg"
        :total="page.total"
      ></el-pagination>
    </div>

    <!-- 人事表单 -->
    <div class="dialogform">
      <el-dialog title="人事信息" width="1200px" v-model="dialogFormVisible">
        <el-form
          :rules="rules"
          :model="form"
          ref="form"
          class="margin:0 20px;display:flex;"
        >
          <el-row :gutter="20">
            <el-col :span="6">
              <div>
                <el-popover
                  placement="bottom"
                  title="部门职位选择（选蓝色标记的职位项目）"
                  :width="400"
                  trigger="manual"
                  :visible="deptVisible"
                >
                  <el-tree
                    :data="dpData"
                    node-key="id"
                    ref="deptTree1"
                    :props="dpProps"
                    :default-expand-all="true"
                    style="
                      overflow-x: scroll;
                      height: 600px;
                      font-size: 12px;
                      border: 1px solid gray;
                    "
                    @node-click="newdeptnodeclick"
                  >
                    <template #default="{ node, data }">
                      <span :class="{ ispos: data.deptlevel == 2 }">{{
                        node.label
                      }}</span>
                    </template>
                  </el-tree>
                  <template #reference>
                    <el-form-item
                      label="部门职位"
                      prop="dpname"
                      :label-width="formLabelWidth"
                      @click="deptVisible = !deptVisible"
                    >
                      <el-input
                        size="default"
                        v-model="form.dpname"
                        autocomplete="off"
                        readonly
                      ></el-input>
                    </el-form-item>
                  </template>
                </el-popover>
              </div>
            </el-col>

            <el-col :span="6">
              <div>
                <el-form-item
                  label="级别"
                  :label-width="formLabelWidth"
                  prop="grade"
                >
                  <el-select
                    id="selhrgrade"
                    v-model="form.grade"
                    placeholder="请选择"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in dichrgradeData"
                      :key="item.itemid"
                      :label="item.itemname"
                      :value="item.itemid"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item
                  style="width: 100%"
                  label="员工状态"
                  :label-width="formLabelWidth"
                  prop="hrstatus"
                >
                  <el-select
                    id="selhrstatus"
                    v-model="form.hrstatus"
                    placeholder="请选择"
                    style="width: 100%"
                    :disabled="true"
                  >
                    <el-option
                      v-for="item in dichrstatusData"
                      :key="item.itemid"
                      :label="item.itemname"
                      :value="item.itemid"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>

            <el-col :span="6">
              <div>
                <el-form-item
                  label="员工类型"
                  :label-width="formLabelWidth"
                  prop="type"
                >
                  <el-select
                    id="selhrtype"
                    v-model="form.type"
                    placeholder="请选择"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in dichrtypeData"
                      :key="item.itemid"
                      :label="item.itemname"
                      :value="item.itemid"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>

            <el-col :span="6">
              <div>
                <el-form-item
                  label="入职日期"
                  :label-width="formLabelWidth"
                  prop="datejoined"
                >
                  <el-date-picker
                    v-model="form.datejoined"
                    type="date"
                    placeholder="选择日期"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                    @change="datejoinedChange"
                  ></el-date-picker>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item
                  label="转正日期"
                  :label-width="formLabelWidth"
                  prop="regulardate"
                >
                  <el-date-picker
                    v-model="form.regulardate"
                    type="date"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                    placeholder="选择日期"
                    @change="regulardateChange"
                  ></el-date-picker>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item
                  label="银行卡号"
                  :label-width="formLabelWidth"
                  prop="bank1"
                >
                  <el-input
                    style="font-size: 12px"
                    size="default"
                    v-model="form.bank1"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="更衣箱号" :label-width="formLabelWidth">
                  <el-input
                    size="default"
                    v-model="form.lockid"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-tooltip content="入职前工龄，月份数" placement="bottom">
                  <el-form-item label="前工龄月" :label-width="formLabelWidth">
                    <el-input-number
                      size="default"
                      v-model="form.serveryear"
                      autocomplete="off"
                      :min="0"
                      :max="720"
                    ></el-input-number> </el-form-item
                ></el-tooltip>
              </div>
            </el-col>

            <el-col :span="6">
              <div>
                <el-form-item label="员工来源" :label-width="formLabelWidth">
                  <el-select
                    id="selhrsource"
                    v-model="form.source"
                    placeholder="请选择"
                    size="default"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in dichrsurData"
                      :key="item.itemid"
                      :label="item.itemname"
                      :value="item.itemid"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>

            <el-col :span="6">
              <div>
                <el-form-item label="工作地" :label-width="formLabelWidth">
                  <el-input
                    size="default"
                    v-model="form.locate"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="档案号码" :label-width="formLabelWidth">
                  <el-input
                    size="default"
                    v-model="form.profileno"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item
                  label="考勤卡号"
                  :label-width="formLabelWidth"
                  prop="workid"
                >
                  <el-tooltip content="请和工号保持一致！" placement="bottom">
                    <el-input
                      size="default"
                      v-model="form.workid"
                      autocomplete="off"
                    ></el-input
                  ></el-tooltip>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item
                  label="考勤卡编码"
                  :label-width="formLabelWidth"
                  prop="cardid"
                >
                  <el-tooltip
                    content="射频卡背面编号，一般10位以上！"
                    placement="bottom"
                  >
                    <el-input
                      size="default"
                      v-model="form.cardid"
                      autocomplete="off"
                    ></el-input
                  ></el-tooltip>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <el-form-item label="停止考勤？" :label-width="formLabelWidth">
                <el-switch
                  v-model="form.stopkq"
                  active-color="#F56C6C"
                  inactive-color="#409EFF"
                  active-text="是"
                  inactive-text="否"
                  :active-value="1"
                  :inactive-value="0"
                ></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="停发工资？" :label-width="formLabelWidth">
                <el-switch
                  v-model="form.stoppr"
                  active-color="#F56C6C"
                  inactive-color="#409EFF"
                  active-text="是"
                  inactive-text="否"
                  :active-value="1"
                  :inactive-value="0"
                ></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="非编员工？" :label-width="formLabelWidth">
                <el-switch
                  v-model="form.nothr"
                  active-color="#F56C6C"
                  inactive-color="#409EFF"
                  active-text="非编"
                  inactive-text="编制"
                  :active-value="1"
                  :inactive-value="0"
                ></el-switch>
              </el-form-item>
            </el-col>
          </el-row>
          <el-divider content-position="left">
            <i class="Edit-outline"></i>
          </el-divider>

          <el-row :gutter="20">
            <el-col :span="6">
              <div>
                <el-form-item
                  label="工号"
                  :label-width="formLabelWidth"
                  prop="emid"
                >
                  <el-input
                    size="default"
                    v-model="form.emid"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item
                  label="中文名"
                  :label-width="formLabelWidth"
                  prop="cname"
                >
                  <el-input
                    size="default"
                    v-model="form.cname"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="英文名" :label-width="formLabelWidth">
                  <el-input
                    size="default"
                    v-model="form.ename"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item
                  label="身份证号"
                  :label-width="formLabelWidth"
                  prop="idcard"
                >
                  <el-input
                    size="default"
                    v-model="form.idcard"
                    autocomplete="off"
                    @change="idcardChange"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <div>
                <el-form-item
                  label="性别"
                  :label-width="formLabelWidth"
                  prop="sex"
                >
                  <el-switch
                    v-model="form.sex"
                    active-color="#13ce66"
                    inactive-color="#409EFF"
                    active-text="女"
                    inactive-text="男"
                    active-value="0"
                    inactive-value="1"
                  ></el-switch>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item
                  label="生日"
                  :label-width="formLabelWidth"
                  prop="datejoined"
                >
                  <el-date-picker
                    v-model="form.birth"
                    type="date"
                    placeholder="选择日期"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                  ></el-date-picker>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item
                  label="婚况"
                  :label-width="formLabelWidth"
                  prop="marry"
                >
                  <el-select
                    v-model="form.marry"
                    placeholder="请选择"
                    style="width: 100%"
                    id="selhrmarry"
                  >
                    <el-option
                      v-for="item in dichrmarryData"
                      :key="item.itemid"
                      :label="item.itemname"
                      :value="item.itemid"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="籍贯" :label-width="formLabelWidth">
                  <el-input
                    size="default"
                    v-model="form.nation"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="民族" :label-width="formLabelWidth">
                  <el-input
                    size="default"
                    v-model="form.mz"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <div>
                <el-form-item
                  label="学历"
                  :label-width="formLabelWidth"
                  prop="education"
                >
                  <el-select
                    id="selhreducation"
                    v-model="form.education"
                    placeholder="请选择"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in dichreducationData"
                      :key="item.itemid"
                      :label="item.itemname"
                      :value="item.itemid"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item
                  label="毕业院校"
                  :label-width="formLabelWidth"
                  prop="school"
                >
                  <el-input
                    size="default"
                    v-model="form.school"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="主修专业" :label-width="formLabelWidth">
                  <el-input
                    size="default"
                    v-model="form.speciality"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item
                  label="政治面貌"
                  :label-width="formLabelWidth"
                  prop="political"
                >
                  <el-select
                    id="selhrpolitical"
                    v-model="form.political"
                    placeholder="请选择"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in dichrpoliticalData"
                      :key="item.itemid"
                      :label="item.itemname"
                      :value="item.itemid"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>

            <el-col :span="6">
              <div>
                <el-form-item label="电子邮箱" :label-width="formLabelWidth">
                  <el-input
                    size="default"
                    v-model="form.email"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item
                  label="QQ"
                  :label-width="formLabelWidth"
                  prop="qq"
                >
                  <el-input
                    size="default"
                    v-model="form.qq"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="微信" :label-width="formLabelWidth">
                  <el-input
                    size="default"
                    v-model="form.wechat"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item
                  label="移动电话"
                  :label-width="formLabelWidth"
                  prop="mtele"
                >
                  <el-input
                    size="default"
                    v-model="form.mtele"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <div>
                <el-form-item
                  label="居住地址"
                  :label-width="formLabelWidth"
                  prop="address"
                >
                  <el-input
                    size="default"
                    v-model="form.address"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-divider content-position="left">
            <i class="Edit-outline">试用信息</i>
          </el-divider>
          <el-row :gutter="20">
            <el-col :span="6">
              <div>
                <el-form-item label="试用期？" :label-width="formLabelWidth">
                  <el-switch
                    v-model="form.if_proba"
                    active-text="有"
                    inactive-text="没"
                    active-value="1"
                    inactive-value="0"
                  ></el-switch>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="试用期从" :label-width="formLabelWidth">
                  <el-date-picker
                    v-model="form.probafrom"
                    type="date"
                    placeholder="选择日期"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                  ></el-date-picker>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item
                  label="试用期到"
                  :label-width="formLabelWidth"
                  prop="probato"
                >
                  <el-date-picker
                    v-model="form.probato"
                    type="date"
                    placeholder="选择日期"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                  ></el-date-picker>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item
                  label="试用期工资"
                  :label-width="formLabelWidth"
                  prop="prosalary"
                >
                  <el-input
                    size="default"
                    v-model="form.prosalary"
                    autocomplete="off"
                    @change="prosalarychange"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-divider content-position="left">
            <i class="Edit-outline">健康证信息</i>
          </el-divider>
          <el-row :gutter="20">
            <el-col :span="6">
              <div>
                <el-form-item label="健康证开始" :label-width="formLabelWidth">
                  <el-date-picker
                    v-model="form.healfrom"
                    type="date"
                    placeholder="选择日期"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                    @change="healfromChange"
                  ></el-date-picker>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="健康证结束" :label-width="formLabelWidth">
                  <el-date-picker
                    v-model="form.healto"
                    type="date"
                    placeholder="选择日期"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                  ></el-date-picker>
                </el-form-item>
              </div>
            </el-col>
          </el-row>

          <el-divider content-position="left">
            <i class="Edit-outline">合同信息</i>
          </el-divider>
          <el-row :gutter="20">
            <el-col :span="6">
              <div>
                <el-form-item
                  label="合同类型"
                  :label-width="formLabelWidth"
                  prop="contype"
                >
                  <el-select
                    id="selhrcontype"
                    v-model="form.contype"
                    placeholder="请选择"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in diccontypeData"
                      :key="item.itemid"
                      :label="item.itemname"
                      :value="item.itemid"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item
                  label="合同开始"
                  :label-width="formLabelWidth"
                  prop="confrom"
                >
                  <el-date-picker
                    v-model="form.confrom"
                    type="date"
                    placeholder="选择日期"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                    @change="confromChange"
                  ></el-date-picker>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item
                  label="合同结束"
                  :label-width="formLabelWidth"
                  prop="conto"
                >
                  <el-date-picker
                    v-model="form.conto"
                    type="date"
                    placeholder="选择日期"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                  ></el-date-picker>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item
                  label="合同工资"
                  :label-width="formLabelWidth"
                  prop="consalary"
                >
                  <el-input
                    size="default"
                    v-model="form.consalary"
                    autocomplete="off"
                    @change="consalaryChange"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>

          <el-divider content-position="left">
            <i class="Edit-outline"></i>
          </el-divider>
          <el-row :gutter="20">
            <el-col :span="6">
              <div>
                <el-form-item
                  label="当前工资"
                  :label-width="formLabelWidth"
                  prop="currsalary"
                >
                  <el-input
                    size="default"
                    v-model="form.currsalary"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>

            <el-col :span="6">
              <div>
                <el-form-item label="社保账号" :label-width="formLabelWidth">
                  <el-input
                    size="default"
                    v-model="form.socialid"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>

            <el-col :span="6">
              <div>
                <el-form-item
                  label="社保基数"
                  :label-width="formLabelWidth"
                  prop="socialbase"
                >
                  <el-input
                    size="default"
                    v-model="form.socialbase"
                    autocomplete="off"
                    @change="socialbaseChange"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>

            <el-col :span="6">
              <div>
                <el-form-item
                  label="公积金基数"
                  :label-width="formLabelWidth"
                  prop="housefund"
                >
                  <el-input
                    size="default"
                    v-model="form.housefund"
                    autocomplete="off"
                    @change="housefundChange"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>

          <div class="demo-collapse">
            <el-collapse accordion>
              <el-collapse-item name="1">
                <template #title
                  ><el-icon style="font-size: 24px; color: #ffa600"
                    ><CaretBottom /></el-icon
                  >&nbsp;&nbsp;<i class="collapsebar">社保，公积金明细...</i>
                </template>
                <el-divider content-position="left">
                  <i class="Edit-outline">企业社保，公积金基数</i>
                </el-divider>
                <el-row :gutter="24">
                  <el-col :span="6">
                    <div>
                      <el-form-item
                        label="养老0"
                        :label-width="formLabelWidth"
                        prop="sb0"
                      >
                        <el-input
                          size="default"
                          v-model="form.sb0"
                          autocomplete="off"
                          @change="sbChange"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <div>
                      <el-form-item
                        label="医疗1"
                        :label-width="formLabelWidth"
                        prop="sb1"
                      >
                        <el-input
                          size="default"
                          v-model="form.sb1"
                          autocomplete="off"
                          @change="sbChange"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <div>
                      <el-form-item
                        label="大病2"
                        :label-width="formLabelWidth"
                        prop="sb2"
                      >
                        <el-input
                          size="default"
                          v-model="form.sb2"
                          autocomplete="off"
                          @change="sbChange"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <div>
                      <el-form-item
                        label="失业3"
                        :label-width="formLabelWidth"
                        prop="sb3"
                      >
                        <el-input
                          size="default"
                          v-model="form.sb3"
                          autocomplete="off"
                          @change="sbChange"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <div>
                      <el-form-item
                        label="工伤4"
                        :label-width="formLabelWidth"
                        prop="sb4"
                      >
                        <el-input
                          size="default"
                          v-model="form.sb4"
                          autocomplete="off"
                          @change="sbChange"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <div>
                      <el-form-item
                        label="生育5"
                        :label-width="formLabelWidth"
                        prop="sb5"
                      >
                        <el-input
                          size="default"
                          v-model="form.sb5"
                          autocomplete="off"
                          @change="sbChange"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <div>
                      <el-form-item
                        label="公积金6"
                        :label-width="formLabelWidth"
                        prop="sb6"
                      >
                        <el-input
                          size="default"
                          v-model="form.sb6"
                          autocomplete="off"
                          @change="sbChange"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <div>
                      <el-form-item
                        label="残保金11"
                        :label-width="formLabelWidth"
                        prop="sb11"
                      >
                        <el-input
                          size="default"
                          v-model="form.sb11"
                          autocomplete="off"
                          @change="sbChange"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                </el-row>
                <el-divider content-position="left">
                  <i class="Edit-outline">企业社保，公积金缴纳数</i>
                </el-divider>
                <el-row :gutter="24">
                  <el-col :span="6">
                    <div>
                      <el-form-item
                        label="养老0"
                        :label-width="formLabelWidth"
                        prop="sb0val"
                      >
                        <el-input
                          size="default"
                          v-model="form.sb0val"
                          autocomplete="off"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <div>
                      <el-form-item
                        label="医疗1"
                        :label-width="formLabelWidth"
                        prop="sb1val"
                      >
                        <el-input
                          size="default"
                          v-model="form.sb1val"
                          autocomplete="off"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <div>
                      <el-form-item
                        label="大病2"
                        :label-width="formLabelWidth"
                        prop="sb2val"
                      >
                        <el-input
                          size="default"
                          v-model="form.sb2val"
                          autocomplete="off"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <div>
                      <el-form-item
                        label="失业3"
                        :label-width="formLabelWidth"
                        prop="sb3val"
                      >
                        <el-input
                          size="default"
                          v-model="form.sb3val"
                          autocomplete="off"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <div>
                      <el-form-item
                        label="工伤4"
                        :label-width="formLabelWidth"
                        prop="sb4val"
                      >
                        <el-input
                          size="default"
                          v-model="form.sb4val"
                          autocomplete="off"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <div>
                      <el-form-item
                        label="生育5"
                        :label-width="formLabelWidth"
                        prop="sb5val"
                      >
                        <el-input
                          size="default"
                          v-model="form.sb5val"
                          autocomplete="off"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <div>
                      <el-form-item
                        label="公积金6"
                        :label-width="formLabelWidth"
                        prop="sb6val"
                      >
                        <el-input
                          size="default"
                          v-model="form.sb6val"
                          autocomplete="off"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <div>
                      <el-form-item
                        label="残保金11"
                        :label-width="formLabelWidth"
                        prop="sb11val"
                      >
                        <el-input
                          size="default"
                          v-model="form.sb11val"
                          autocomplete="off"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                </el-row>
                <el-divider content-position="left">
                  <i class="Edit-outline">个人社保，公积金基数</i>
                </el-divider>
                <el-row :gutter="24">
                  <el-col :span="6">
                    <div>
                      <el-form-item
                        label="养老7"
                        :label-width="formLabelWidth"
                        prop="sb7"
                      >
                        <el-input
                          size="default"
                          v-model="form.sb7"
                          autocomplete="off"
                          @change="sbChange"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <div>
                      <el-form-item
                        label="医疗8"
                        :label-width="formLabelWidth"
                        prop="sb8"
                      >
                        <el-input
                          size="default"
                          v-model="form.sb8"
                          autocomplete="off"
                          @change="sbChange"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </el-col>

                  <el-col :span="6">
                    <div>
                      <el-form-item
                        label="失业9"
                        :label-width="formLabelWidth"
                        prop="sb9"
                      >
                        <el-input
                          size="default"
                          v-model="form.sb9"
                          autocomplete="off"
                          @change="sbChange"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </el-col>

                  <el-col :span="6">
                    <div>
                      <el-form-item
                        label="公积金10"
                        :label-width="formLabelWidth"
                        prop="sb10"
                      >
                        <el-input
                          size="default"
                          v-model="form.sb10"
                          autocomplete="off"
                          @change="sbChange"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                </el-row>

                <el-divider content-position="left">
                  <i class="Edit-outline">个人社保，公积金缴纳数</i>
                </el-divider>
                <el-row :gutter="24">
                  <el-col :span="6">
                    <div>
                      <el-form-item
                        label="养老7"
                        :label-width="formLabelWidth"
                        prop="sb7val"
                      >
                        <el-input
                          size="default"
                          v-model="form.sb7val"
                          autocomplete="off"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <div>
                      <el-form-item
                        label="医疗8"
                        :label-width="formLabelWidth"
                        prop="sb8val"
                      >
                        <el-input
                          size="default"
                          v-model="form.sb8val"
                          autocomplete="off"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </el-col>

                  <el-col :span="6">
                    <div>
                      <el-form-item
                        label="失业9"
                        :label-width="formLabelWidth"
                        prop="sb9val"
                      >
                        <el-input
                          size="default"
                          v-model="form.sb9val"
                          autocomplete="off"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </el-col>

                  <el-col :span="6">
                    <div>
                      <el-form-item
                        label="公积金10"
                        :label-width="formLabelWidth"
                        prop="sb10val"
                      >
                        <el-input
                          size="default"
                          v-model="form.sb10val"
                          autocomplete="off"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                </el-row>
              </el-collapse-item>
            </el-collapse>
          </div>
          <el-divider content-position="left">
            <i class="Edit-outline optionsinfo">人事选项信息</i>
          </el-divider>
          <el-row :gutter="20">
            <el-col :span="6">
              <div style="display: block; width: 960px">
                <el-checkbox-group
                  v-model="hrcheckedshow"
                  style="display: flex; flex-wrap: wrap"
                >
                  <el-checkbox
                    v-for="item in dichrcheckedData"
                    :key="item.itemid"
                    :value="item.itemid"
                    :label="item.itemid"
                    style="width: 210px; text-align: left"
                    >{{ item.itemname }}</el-checkbox
                  >
                </el-checkbox-group>
              </div>
            </el-col>
          </el-row>
          <el-divider content-position="left">
            <i class="Edit-outline">紧急联系人信息</i>
          </el-divider>
          <el-row :gutter="24">
            <el-col :span="8">
              <div>
                <el-form-item
                  label="紧急联系人"
                  :label-width="formLabelWidth"
                  prop="jjname"
                >
                  <el-input
                    size="default"
                    v-model="form.jjname"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="8">
              <div>
                <el-form-item label="关系" :label-width="formLabelWidth">
                  <el-input
                    size="default"
                    v-model="form.jjrelation"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="8">
              <div>
                <el-form-item
                  label="联系电话"
                  :label-width="formLabelWidth"
                  prop="jjtele"
                >
                  <el-input
                    size="default"
                    v-model="form.jjtele"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="24">
              <div>
                <el-form-item label="联系地址" :label-width="formLabelWidth">
                  <el-input
                    size="default"
                    v-model="form.jjaddress"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-divider content-position="left">
            <i class="Edit-outline">户口类型</i>
          </el-divider>
          <el-row :gutter="20">
            <el-col :span="6">
              <div>
                <el-form-item
                  label="户口类型"
                  :label-width="formLabelWidth"
                  prop="hktype"
                >
                  <el-select
                    id="selhrhktype"
                    v-model="form.hktype"
                    placeholder="请选择"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in dichktypeData"
                      :key="item.itemid"
                      :label="item.itemname"
                      :value="item.itemid"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <div>
                <el-form-item
                  label="户口地址"
                  :label-width="formLabelWidth"
                  prop="hkaddress"
                >
                  <el-input
                    size="default"
                    v-model="form.hkaddress"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="户口所属地" :label-width="formLabelWidth">
                  <el-input
                    size="default"
                    v-model="form.hkfield"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="20"></el-row>

          <el-form-item label="备注" :label-width="formLabelWidth">
            <el-input
              size="default"
              v-model="form.remark"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <div class="demo-collapse">
            <el-collapse accordion>
              <el-collapse-item name="1">
                <template #title
                  ><el-icon style="font-size: 24px; color: #ffa600"
                    ><CaretBottom /></el-icon
                  ><i class="collapsebar">尺码信息...</i>
                </template>
                <el-form
                  :rules="rules"
                  :model="msform"
                  ref="refmsform"
                  class="margin:0 20px;display:flex;"
                >
                  <el-row :gutter="24">
                    <el-col :span="5">
                      <el-form-item
                        label="身高(CM)"
                        :label-width="formLabelWidth"
                      >
                        <el-input-number
                          size="default"
                          v-model="form.height"
                          autocomplete="off"
                          :min="140"
                          :max="240"
                        ></el-input-number>
                      </el-form-item>
                    </el-col>
                    <el-col :span="5">
                      <el-form-item
                        label="体重(KG)"
                        :label-width="formLabelWidth"
                      >
                        <el-input-number
                          size="default"
                          v-model="form.weight"
                          autocomplete="off"
                          :min="35"
                          :max="140"
                        ></el-input-number>
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item
                        label="视力左"
                        :label-width="formLabelWidth"
                      >
                        <el-input
                          size="default"
                          v-model="form.lsight"
                          autocomplete="off"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item
                        label="视力右"
                        :label-width="formLabelWidth"
                      >
                        <el-input
                          size="default"
                          v-model="form.rsight"
                          autocomplete="off"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item
                        label="鞋码(国)"
                        :label-width="formLabelWidth"
                      >
                        <el-input
                          size="default"
                          v-model="form.shoe"
                          autocomplete="off"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item
                        label="上衣尺寸"
                        :label-width="formLabelWidth"
                      >
                        <el-input
                          size="default"
                          v-model="form.dress"
                          autocomplete="off"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item
                        label="裤子尺寸"
                        :label-width="formLabelWidth"
                      >
                        <el-input
                          size="default"
                          v-model="form.pants"
                          autocomplete="off"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item
                        label="吸烟？"
                        :label-width="formLabelWidth"
                      >
                        <el-switch
                          v-model="form.smoke"
                          active-color="#13ce66"
                          inactive-color="#F56C6C"
                          active-text="否"
                          inactive-text="是"
                          active-value="0"
                          inactive-value="1"
                        ></el-switch>
                      </el-form-item> </el-col></el-row
                ></el-form>
              </el-collapse-item>
            </el-collapse>
          </div>

          <template v-if="form.checkout && form.checkout.length > 4">
            <el-divider content-position="left">
              <i class="Edit-outline optionsinfo">离职信息</i>
            </el-divider>
            <el-row :gutter="24">
              <el-col :span="6">
                <div>
                  <el-form-item label="辞职日期" :label-width="formLabelWidth">
                    <el-date-picker
                      v-model="form.reqleavedate"
                      type="date"
                      placeholder="选择日期"
                      format="YYYY-MM-DD"
                      value-format="YYYY-MM-DD"
                      @change="reqleavedateChange"
                    ></el-date-picker>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="6">
                <div>
                  <el-form-item
                    label="最后工作日"
                    :label-width="formLabelWidth"
                  >
                    <el-date-picker
                      v-model="form.lastdate"
                      type="date"
                      placeholder="选择日期"
                      format="YYYY-MM-DD"
                      value-format="YYYY-MM-DD"
                    ></el-date-picker>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="6">
                <div>
                  <el-form-item label="离职日期" :label-width="formLabelWidth">
                    <el-date-picker
                      v-model="form.checkout"
                      type="date"
                      placeholder="选择日期"
                      format="YYYY-MM-DD"
                      value-format="YYYY-MM-DD"
                    ></el-date-picker>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="6">
                <div>
                  <el-form-item
                    label="结余年假(H)"
                    :label-width="formLabelWidth"
                    prop="alhoursm"
                  >
                    <el-input
                      size="default"
                      v-model="form.alhoursm"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="6">
                <div>
                  <el-form-item
                    label="年假到期日"
                    :label-width="formLabelWidth"
                    prop="aledate"
                  >
                    <el-date-picker
                      v-model="form.aledate"
                      type="date"
                      placeholder="选择日期"
                      format="YYYY-MM-DD"
                      value-format="YYYY-MM-DD"
                      @change="alhsmChange"
                    ></el-date-picker>
                  </el-form-item>
                </div>
              </el-col>

              <el-col :span="6">
                <div>
                  <el-form-item
                    label="结余积假(H)"
                    :label-width="formLabelWidth"
                    prop="acclhoursm"
                  >
                    <el-input
                      size="default"
                      v-model="form.acclhoursm"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="6">
                <div>
                  <el-form-item
                    label="积假到期日"
                    :label-width="formLabelWidth"
                    prop="accledate"
                  >
                    <el-date-picker
                      v-model="form.accledate"
                      type="date"
                      placeholder="选择日期"
                      format="YYYY-MM-DD"
                      value-format="YYYY-MM-DD"
                    ></el-date-picker>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>

            <el-divider content-position="left">
              <i class="Edit-outline optionsinfo">离职选项信息</i>
            </el-divider>
            <el-row :gutter="20">
              <el-col :span="6">
                <div style="display: block; width: 960px">
                  <el-checkbox-group
                    v-model="ary_ckc"
                    style="display: flex; flex-wrap: wrap"
                  >
                    <el-checkbox
                      v-for="item in checkoutcheckedData"
                      :key="item.itemid"
                      :value="item.itemname"
                      :label="item.itemid"
                      style="width: 210px; text-align: left"
                      >{{ item.itemname }}</el-checkbox
                    >
                  </el-checkbox-group>
                </div>
              </el-col>
            </el-row>

            <el-divider content-position="left">
              <i class="Edit-outline optionsinfo">离职类型</i>
            </el-divider>
            <el-row :gutter="20">
              <el-col :span="6">
                <div style="display: block; width: 960px">
                  <el-checkbox-group
                    v-model="ary_ckt"
                    style="display: flex; flex-wrap: wrap"
                  >
                    <el-checkbox
                      v-for="item in checkouttypeData"
                      :key="item.itemid"
                      :value="item.itemname"
                      :label="item.itemid"
                      style="width: 210px; text-align: left"
                      >{{ item.itemname }}</el-checkbox
                    >
                  </el-checkbox-group>
                </div>
              </el-col>
            </el-row>
            <el-divider content-position="left">
              <i class="Edit-outline optionsinfo">离职原因</i>
            </el-divider>
            <el-row :gutter="20">
              <el-col :span="6">
                <div style="display: block; width: 960px">
                  <el-checkbox-group
                    v-model="ary_ckr"
                    style="display: flex; flex-wrap: wrap"
                  >
                    <el-checkbox
                      v-for="item in checkoutreasonData"
                      :key="item.itemid"
                      :value="item.itemname"
                      :label="item.itemid"
                      style="width: 210px; text-align: left"
                      >{{ item.itemname }}</el-checkbox
                    >
                  </el-checkbox-group>
                </div>
              </el-col>
            </el-row>
            <el-divider content-position="left">
              <i class="Edit-outline optionsinfo">其他</i>
            </el-divider>
            <el-form-item label="离职备注" :label-width="formLabelWidth">
              <el-input
                size="default"
                v-model="form.checkoutremark"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </template>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button
              type="primary"
              @click="saveForm"
              v-if="form.ifcheckout != 1 || form.hrstatus != 1"
              :disabled="dissaveformbtn == true"
              >保 存</el-button
            >
          </span>
        </template>
      </el-dialog>
    </div>
    <!-- 离职表单 -->
    <div class="dialogform">
      <el-dialog
        title="离职处理"
        width="1000px"
        v-model="dialogCheckoutVisible"
      >
        <el-form
          :rules="checkoutrules"
          :model="form"
          ref="checkoutform"
          class="margin:0 20px;display:flex;"
        >
          <el-row :gutter="20">
            <el-col :span="6">
              <div>
                <el-form-item
                  label="申请日期"
                  :label-width="formLabelWidth"
                  prop="reqleavedate"
                >
                  <el-date-picker
                    v-model="form.reqleavedate"
                    type="date"
                    placeholder="选择日期"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                    @change="reqleavedateChange"
                  ></el-date-picker>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item
                  label="最后工作日"
                  :label-width="formLabelWidth"
                  prop="lastdate"
                >
                  <el-date-picker
                    v-model="form.lastdate"
                    type="date"
                    placeholder="选择日期"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                  ></el-date-picker>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item
                  label="离职日期"
                  :label-width="formLabelWidth"
                  prop="checkout"
                >
                  <el-date-picker
                    v-model="form.checkout"
                    type="date"
                    placeholder="选择日期"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                  ></el-date-picker>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <div>
                <el-form-item
                  label="结余年假(H)"
                  :label-width="formLabelWidth"
                  prop="alhoursm"
                >
                  <el-input
                    size="default"
                    v-model="form.alhoursm"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item
                  label="年假到期日"
                  :label-width="formLabelWidth"
                  prop="aledate"
                >
                  <el-date-picker
                    v-model="form.aledate"
                    type="date"
                    placeholder="选择日期"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                  ></el-date-picker>
                </el-form-item>
              </div>
            </el-col>

            <el-col :span="6">
              <div>
                <el-form-item
                  label="结余积假(H)"
                  :label-width="formLabelWidth"
                  prop="acclhoursm"
                >
                  <el-input
                    size="default"
                    v-model="form.acclhoursm"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item
                  label="积假到期日"
                  :label-width="formLabelWidth"
                  prop="accledate"
                >
                  <el-date-picker
                    v-model="form.accledate"
                    type="date"
                    placeholder="选择日期"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                  ></el-date-picker>
                </el-form-item>
              </div>
            </el-col>
          </el-row>

          <el-divider content-position="left">
            <i class="Edit-outline">离职选项信息</i>
          </el-divider>
          <el-row :gutter="20">
            <el-col :span="6">
              <div style="display: block; width: 960px">
                <el-checkbox-group
                  v-model="ary_ckc"
                  style="display: flex; flex-wrap: wrap"
                >
                  <el-checkbox
                    v-for="item in checkoutcheckedData"
                    :key="item.itemid"
                    :value="item.itemid"
                    :label="item.itemid"
                    style="width: 210px; text-align: left"
                    >{{ item.itemname }}</el-checkbox
                  >
                </el-checkbox-group>
              </div>
            </el-col>
          </el-row>

          <el-divider content-position="left">
            <i class="Edit-outline">离职类型</i>
          </el-divider>
          <el-row :gutter="20">
            <el-col :span="6">
              <div style="display: block; width: 960px">
                <el-checkbox-group
                  v-model="ary_ckt"
                  style="display: flex; flex-wrap: wrap"
                >
                  <el-checkbox
                    v-for="item in checkouttypeData"
                    :key="item.itemid"
                    :value="item.itemid"
                    :label="item.itemid"
                    style="width: 210px; text-align: left"
                    >{{ item.itemname }}</el-checkbox
                  >
                </el-checkbox-group>
              </div>
            </el-col>
          </el-row>
          <el-divider content-position="left">
            <i class="Edit-outline">离职原因</i>
          </el-divider>
          <el-row :gutter="20">
            <el-col :span="6">
              <div style="display: block; width: 960px">
                <el-checkbox-group
                  v-model="ary_ckr"
                  style="display: flex; flex-wrap: wrap"
                >
                  <el-checkbox
                    v-for="item in checkoutreasonData"
                    :key="item.itemid"
                    :value="item.itemid"
                    :label="item.itemid"
                    style="width: 210px; text-align: left"
                    >{{ item.itemname }}</el-checkbox
                  >
                </el-checkbox-group>
              </div>
            </el-col>
          </el-row>
          <el-divider content-position="left">
            <i class="Edit-outline">其他离职信息</i>
          </el-divider>
          <el-form-item label="离职信息备注" :label-width="formLabelWidth">
            <el-input
              size="default"
              v-model="form.checkoutremark"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogCheckoutVisible = false">取 消</el-button>
            <el-button
              type="primary"
              @click="savecheckoutForm(0)"
              v-if="form.ifcheckout == 1 || form.hrstatus == 1"
              >撤销离职</el-button
            >
            <el-button
              type="primary"
              @click="savecheckoutForm(1)"
              v-if="form.ifcheckout != 1 || form.hrstatus != 1"
              >确定离职</el-button
            >
          </span>
        </template>
      </el-dialog>
    </div>
    <!-- 家庭成员表单 -->
    <div class="dialogform">
      <el-dialog title="家庭成员" width="1000px" v-model="dialogFamilyVisible">
        <el-form
          :rules="familyrules"
          :model="familyform"
          ref="familyform"
          class="margin:0 20px;display:flex;"
        >
          <el-row :gutter="20">
            <el-col :span="6">
              <div>
                <el-form-item
                  label="姓名"
                  :label-width="formLabelWidth"
                  prop="name"
                >
                  <el-input
                    size="default"
                    v-model="familyform.name"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item
                  label="关系"
                  :label-width="formLabelWidth"
                  prop="relation"
                >
                  <el-input
                    size="default"
                    v-model="familyform.relation"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="身份证" :label-width="formLabelWidth">
                  <el-input
                    size="default"
                    v-model="familyform.idcard"
                    @change="idcardChange"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item
                  label="出生日期"
                  :label-width="formLabelWidth"
                  prop="datejoined"
                >
                  <el-date-picker
                    v-model="familyform.birth"
                    type="date"
                    placeholder="选择日期"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                  ></el-date-picker>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item
                  label="联系电话"
                  :label-width="formLabelWidth"
                  prop="mtele"
                >
                  <el-input
                    size="default"
                    v-model="familyform.mtele"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="18">
              <div>
                <el-form-item
                  label="工作单位"
                  :label-width="formLabelWidth"
                  prop="company"
                >
                  <el-input
                    size="default"
                    v-model="familyform.company"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="备注" :label-width="formLabelWidth">
                <el-input
                  size="default"
                  v-model="familyform.remark"
                  autocomplete="off"
                ></el-input> </el-form-item
            ></el-col>
            <el-col :span="6">
              <el-form-item label="有效？" :label-width="formLabelWidth">
                <el-switch
                  v-model="familyform.isactive"
                  active-color="#409EFF"
                  inactive-color="#F56C6C"
                  active-text="是"
                  inactive-text="否"
                  :active-value="1"
                  :inactive-value="0"
                ></el-switch>
              </el-form-item> </el-col
          ></el-row>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button
              type="success"
              icon="Plus"
              @click="changeToplus_family"
              v-if="neworedit == false"
              >新 建</el-button
            >
            <el-button
              type="success"
              @click="saveFamilyForm"
              v-if="neworedit == true"
              >新 增</el-button
            >
            <el-button
              type="primary"
              @click="saveFamilyForm(false)"
              v-if="neworedit == false"
              >保 存</el-button
            >
            <el-button @click="dialogFamilyVisible = false">离 开</el-button>
          </span>
        </template>

        <el-divider content-position="left">
          <i class="Edit-outline">家庭成员信息</i>
        </el-divider>

        <div style="margin-left: 20px; width: 100%; min-width: 800px">
          <el-table
            :data="familyData"
            style="width: 100%"
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            stripe
          >
            <el-table-column label="有效">
              <template #default="scope">
                <el-tag type="success" v-if="scope.row.isactive == 1">{{
                  "是"
                }}</el-tag>

                <el-tag type="danger" v-else>{{ "否" }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="姓名"
              fixed="left"
              width="100"
            ></el-table-column>
            <el-table-column
              prop="relation"
              label="关系"
              width="100"
            ></el-table-column>

            <el-table-column
              prop="mtele"
              label="联系电话"
              width="150"
            ></el-table-column>
            <el-table-column
              prop="idcard"
              label="身份证"
              width="180"
            ></el-table-column>
            <el-table-column
              prop="birth"
              label="出生日期"
              width="100"
            ></el-table-column>

            <el-table-column
              prop="company"
              label="工作单位"
              width="180"
            ></el-table-column>
            <el-table-column
              prop="remark"
              label="备注"
              width="180"
            ></el-table-column>
            <el-table-column prop="id" fixed="right" label="操作" width="120">
              <template #default="scope">
                <span class="butgrp">
                  <el-button
                    size="small"
                    icon="Edit"
                    @click="editfamily(scope.$index, scope.row)"
                  ></el-button>

                  <el-button
                    size="small"
                    type="danger"
                    icon="Delete"
                    @click="delfamily(scope.$index, scope.row)"
                  ></el-button>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-dialog>
    </div>
    <!-- 职业经历 -->
    <div class="dialogform">
      <el-dialog title="职业经历" width="1000px" v-model="dialogWorksVisible">
        <works :fsysid="fsysid" @closeworksForm="closeWorksForm"></works>
      </el-dialog>
    </div>
    <!-- 学历教育 -->
    <div class="dialogform">
      <el-dialog
        title="教育学历"
        width="1000px"
        v-model="dialogEducationVisible"
      >
        <education
          :fsysid="fsysid"
          @closeeducationForm="closeEducationForm"
        ></education>
      </el-dialog>
    </div>
    <!-- 资质证书 -->
    <div class="dialogform">
      <el-dialog title="资质证书" width="1000px" v-model="dialogCertVisible">
        <cert :fsysid="fsysid" @closecertForm="closeCertForm"></cert>
      </el-dialog>
    </div>
    <!-- 签署合同 -->
    <div class="dialogform">
      <el-dialog
        title="签署合同"
        width="1000px"
        v-model="dialogContractVisible"
      >
        <contract
          :fsysid="fsysid"
          :diccontypeData="diccontypeData"
          @closecontractForm="closeContractForm"
        ></contract>
      </el-dialog>
    </div>
    <!-- 办理证件 -->
    <div class="dialogform">
      <el-dialog title="办理证件" width="1000px" v-model="dialogPPVisible">
        <passport
          :fsysid="fsysid"
          :diccerttypeData="diccerttypeData"
          @closepassportForm="closePassportForm"
        ></passport>
      </el-dialog>
    </div>
    <!-- 内部变动 -->
    <div class="dialogform">
      <el-dialog
        title="内部变动"
        width="1000px"
        v-model="dialogTransformVisible"
      >
        <transform
          :fsysid="fsysid"
          :hrData="hrData"
          :dichrtypeData="dichrtypeData"
          :dichrgradeData="dichrgradeData"
          :dpData="dpData"
          :dpList="dpList"
          @closetransformForm="closeTransformForm"
        ></transform>
      </el-dialog>
    </div>
    <!-- 奖励管理 -->
    <div class="dialogform">
      <el-dialog title="奖励管理" width="1000px" v-model="dialogAwardVisible">
        <award
          :fsysid="fsysid"
          :diccerttypeData="diccerttypeData"
          @closeapForm="closeAwardForm"
        ></award>
      </el-dialog>
    </div>
    <!-- 加班管理 -->
    <div class="dialogform">
      <el-dialog title="加班管理" width="1000px" v-model="dialogOTlistVisible">
        <otlist
          :fsysid="fsysid"
          :diccerttypeData="diccerttypeData"
          @closeotlistForm="closeOTlistForm"
        ></otlist>
      </el-dialog>
    </div>
    <!-- 请加管理 -->
    <div class="dialogform">
      <el-dialog title="请假管理" width="1000px" v-model="dialogLevlistVisible">
        <levlist
          :fsysid="fsysid"
          :diccerttypeData="diccerttypeData"
          @closelevlistForm="closeLevlistForm"
        ></levlist>
      </el-dialog>
    </div>
    <!-- 长假管理 -->
    <div class="dialogform">
      <el-dialog title="长假管理" width="1000px" v-model="dialogLevlistVisible">
        <levlist
          :fsysid="fsysid"
          :diccerttypeData="diccerttypeData"
          @closelevlistForm="closeLevlistForm"
        ></levlist>
      </el-dialog>
    </div>
    <!-- 领用物品管理 -->
    <div class="dialogform">
      <el-dialog title="领用物品" width="1000px" v-model="dialogReceiptVisible">
        <receipt
          :fsysid="fsysid"
          @closereceiptForm="closeReceiptForm"
        ></receipt>
      </el-dialog>
    </div>
    <!-- 更多查询 -->
    <div class="dialogform">
      <el-dialog title="高级查询" width="1000px" v-model="dialogMSVisible">
        <moresearch
          :fsysid="fsysid"
          :dichrgradeData="dichrgradeData"
          :dichrtypeData="dichrtypeData"
          :dichreduData="dichreducationData"
          :dichrstatusData="dichrstatusData"
          :dichrpropsData="dichrpropsData"
          :dichrpoliticalData="dichrpoliticalData"
          :dplimit="dplimit"
          @moreSearch="moreSearch"
          @closemoresearchForm="closeMoresearchForm"
        ></moresearch>
      </el-dialog>
    </div>
    <!--人事报表 -->
    <div class="dialogform">
      <el-dialog title="" width="1200px" v-model="dialogRepVisible">
        <reps :data="repitem" :ischanged="ischanged"></reps>
      </el-dialog>
    </div>
  </el-container>
</template>
<script>
import { AX, chkBtdt } from "../utils/api";
import { ref, toRaw } from "vue";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import works from "../components/works";
import education from "../components/education";
import cert from "../components/cert";
import contract from "../components/contract";
import passport from "../components/passport";
import transform from "../components/transform";
import award from "../components/award";
import otlist from "../components/otlist";
import levlist from "../components/levlist";
import receipt from "../components/receipt";
import moresearch from "../components/moresearch";
import { hrStatus } from "../utils/comdata.js";
import $ from "jquery";
import * as XLSX from "xlsx/xlsx.mjs";
import reps from "./reps/replst.vue";

import {
  useDeptPosStore,
  useDicStore,
  useUserStore,
  useEmidStore,
  usePermissionStore,
  useRightStore,
} from "../store/index";

import {
  ArrowDown,
  Check,
  CircleCheck,
  CirclePlus,
  CirclePlusFilled,
  Plus,
  Document,
  DocumentChecked,
  Switch,
  Star,
  Cpu,
} from "@element-plus/icons-vue";

export default {
  setup() {
    const deptstore = useDeptPosStore();
    const dicstore = useDicStore();
    const userstore = useUserStore();
    const emidstore = useEmidStore();
    const pmsStore = usePermissionStore();
    const rightstore = useRightStore();
    return { deptstore, dicstore, userstore, emidstore, pmsStore, rightstore };
  },
  components: {
    reps,
    works,
    education,
    cert,
    contract,
    passport,
    transform,
    award,
    otlist,
    levlist,
    moresearch,
    receipt,
    ArrowDown,
    Check,
    CircleCheck,
    CirclePlus,
    CirclePlusFilled,
    Plus,
    Document,
    DocumentChecked,
    Switch,
    Star,
    Cpu,
  },

  data() {
    return {
      dplimit: [],
      fsysid: "123",
      hrData: {},

      tableData: [],
      roleData: [],
      familyData: [],

      loading: false,
      deptVisible: false,

      dichrgradeData: [],
      dichrtypeData: [],
      dichrstatusData: [],
      dichreducationData: [],
      dichrmarryData: [],
      diccontypeData: [],
      dichrsurData: [],
      diccerttypeData: [],
      dichrpropsData: [],

      dichrpoliticalData: [],
      dichrcheckedData: [],

      dichrsbgjjData: [],

      checkoutcheckedData: [],
      checkouttypeData: [],
      checkoutreasonData: [],
      diccusrepData: [],

      hrcheckedshow: [],
      deptChecked: [],

      dichktypeData: [],

      fileaction: "http://localhost:8810/files/post",
      filelist: [
        {
          name: "food.jpeg",
          url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        },
        {
          name: "food2.jpeg",
          url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        },
      ],

      deptData: [],
      dpData: [],
      dpList: [],
      dpProps: {
        label: "deptname",
        level: "deptlevel",
        children: "children",
      },

      selval: [],

      ary_ckr: [],
      ary_ckt: [],
      ary_ckc: [],

      inputsearch: "",
      counts: 1,
      cp1: 1,
      formLabelWidth: "100px",

      cmppwd: "",

      dissaveformbtn: false,

      dialogFormVisible: false,
      dialogCheckoutVisible: false,
      dialogFamilyVisible: false,
      dialogWorksVisible: false,
      dialogEducationVisible: false,
      dialogCertVisible: false,
      dialogContractVisible: false,
      dialogPPVisible: false,
      dialogTransformVisible: false,
      dialogAwardVisible: false,
      dialogOTlistVisible: false,
      dialogLevlistVisible: false,
      dialogMSVisible: false,

      dialogReceiptVisible: false,
      dialogRepVisible: ref(false),
      ischanged: 0,

      neworedit: true,

      size: "small",

      page: {
        limit: ref(10),
        cpg: ref(1),
        total: ref(1),
      },

      SF: {
        showInstaff: ref("1"),
        showBenefit: ref("0"),
        showOther: ref("0"),
        showIsactive: ref("1"),
      },
      //历史form，为了日志用。
      histform: {},
      form: {
        id: "",
        sysid: ref(""),
        comid: "",
        dept: "",
        position: "",

        hrchecked: ref(""),
        emid: "12345",
        cname: "",
        ename: "",
        sex: "0",
        grade: "",
        type: "",
        hrstatus: "",
        datejoined: "",
        regulardate: "",
        idcard: "530102199907111555",
        nothr: 0,

        mtele: "",
        qq: "",
        wechat: "",
        email: "",
        marry: "",
        education: "",

        birth: "",
        birthmonth: "",
        lockid: "",
        mz: "",
        bank1: "",
        address: "",
        political: "",
        nation: "",

        school: "",
        speciality: "",
        serveryear: 0,
        joblessdays: "0",

        //probation:'',
        if_proba: "0",
        //probationdate:'',
        //probationenddate:'',
        probafrom: "",
        probato: "",

        prosalary: "0",

        healfrom: ref(""),
        healto: ref(""),

        confrom: "",
        conto: "",
        contype: "",

        consalary: "0",

        currsalary: "0",

        housefund: "",
        socialbase: "",
        socialid: "",

        locate: "",
        source: "",
        jjname: "",
        jjtele: "",
        jjmtele: "",
        jjpostcode: "",
        jjrelation: "",
        jjaddress: "",

        hktype: "",
        hkaddress: "",
        hkfield: "",
        remark: "",
        profileno: "",

        cardid: "",
        workid: "",
        stopkq: 0,
        stoppr: 0,

        //------------------------------------------------
        //离职信息
        //------------------------------------------------

        checkoutremark: "",
        reqleavedate: "",
        holdays: "0",
        reqdays: "0",
        checkout: "",
        lastdate: "",
        accledate: "",
        acclhoursm: "0",
        aledate: "",
        alhoursm: "0",
        checkoutreason: ref(""),
        checkouttype: ref(""),
        checkoutchecked: ref(""),

        ifcheckout: "0", //必须是0
        //---------------------------------
        height: ref(168),
        weight: ref(60),
        lsight: ref("2.1"),
        rsight: ref("2.1"),
        shoe: ref("36"),
        dress: ref("XL"),
        pants: ref("XL"),
        smoke: ref("0"),
        //-----------------------------------------------
        sb0: 0,
        sb1: 0,
        sb2: 0,
        sb3: 0,
        sb4: 0,
        sb5: 0,
        sb6: 0,
        sb7: 0,
        sb8: 0,
        sb9: 0,
        sb10: 0,
        sb11: 0,
        sb0val: 0,
        sb1val: 0,
        sb2val: 0,
        sb3val: 0,
        sb4val: 0,
        sb5val: 0,
        sb6val: 0,
        sb7val: 0,
        sb8val: 0,
        sb9val: 0,
        sb10val: 0,
        sb11val: 0,
      },
      msform: {
        datejoined: ref(""),
        hrstatus: ref("0"),
        condate: ref(""),
        probadata: ref(""),
        certdate: ref(""),
        checkoutdate: ref(""),
      },
      rules: {
        emid: [{ required: true, message: "请输入 工号", trigger: "blur" }],

        cardid: [
          {
            required: false,
            message: "字数和字母组成",
            pattern: /^[0-9A-Za-z]{5,20}$/,
            trigger: "blur",
          },
        ],

        jjname: [
          { required: true, message: "请输入 紧急联系人", trigger: "blur" },
        ],

        jjtele: [
          { required: true, message: "请输入 紧急联系人电话", trigger: "blur" },
        ],

        mtele: [
          { required: true, message: "请输入 电话号码", trigger: "blur" },
        ],

        cname: [
          {
            required: true,
            message: "请输入 中文名",
            trigger: "blur",
            min: 1,
            max: 32,
          },
        ],

        dpname: [
          { required: true, message: "请输入 部门职位", trigger: "blur" },
        ],

        idcard: [
          {
            required: true,
            message: "请输入 身份证号(18位)",
            trigger: "blur",
            min: 15,
            max: 18,
          },
        ],

        datejoined: [
          { required: true, message: "请输入 入职日期", trigger: "blur" },
        ],

        birth: [
          { required: true, message: "请输入 出生日期", trigger: "blur" },
        ],

        grade: [
          { required: true, message: "请输入 员工级别", trigger: "blur" },
        ],
        type: [{ required: true, message: "请输入 员工类型", trigger: "blur" }],

        hrstatus: [
          { required: true, message: "请输入员工状态", trigger: "blur" },
        ],

        hktype: [
          { required: true, message: "请输入户口类型", trigger: "blur" },
        ],

        hkaddress: [
          { required: true, message: "请输入户口地址", trigger: "blur" },
        ],

        contype: [
          { required: true, message: "请输入合同类型", trigger: "blur" },
        ],

        confrom: [
          { required: true, message: "请输入合同开始日期", trigger: "blur" },
        ],

        conto: [
          { required: true, message: "请输入合同结束日期", trigger: "blur" },
        ],

        address: [
          { required: true, message: "请输入居住地址", trigger: "blur" },
        ],

        education: [{ required: true, message: "请输入学历", trigger: "blur" }],
        political: [
          { required: true, message: "请输入政治面貌", trigger: "blur" },
        ],
        marry: [{ required: true, message: "请输入婚姻状况", trigger: "blur" }],

        sb0: [
          {
            required: true,
            message: "请输入数字",
            trigger: "blur",
            pattern: /^(0|0(.)?\d+|[1-9]\d*(.)?\d*)$/,
          },
        ],
        sb1: [
          {
            required: true,
            message: "请输入数字",
            trigger: "blur",
            pattern: /^(0|0(.)?\d+|[1-9]\d*(.)?\d*)$/,
          },
        ],
        sb2: [
          {
            required: true,
            message: "请输入数字",
            trigger: "blur",
            pattern: /^(0|0(.)?\d+|[1-9]\d*(.)?\d*)$/,
          },
        ],
        sb3: [
          {
            required: true,
            message: "请输入数字",
            trigger: "blur",
            pattern: /^(0|0(.)?\d+|[1-9]\d*(.)?\d*)$/,
          },
        ],
        sb4: [
          {
            required: true,
            message: "请输入数字",
            trigger: "blur",
            pattern: /^(0|0(.)?\d+|[1-9]\d*(.)?\d*)$/,
          },
        ],
        sb5: [
          {
            required: true,
            message: "请输入数字",
            trigger: "blur",
            pattern: /^(0|0(.)?\d+|[1-9]\d*(.)?\d*)$/,
          },
        ],
        sb6: [
          {
            required: true,
            message: "请输入数字",
            trigger: "blur",
            pattern: /^(0|0(.)?\d+|[1-9]\d*(.)?\d*)$/,
          },
        ],
        sb7: [
          {
            required: true,
            message: "请输入数字",
            trigger: "blur",
            pattern: /^(0|0(.)?\d+|[1-9]\d*(.)?\d*)$/,
          },
        ],
        sb8: [
          {
            required: true,
            message: "请输入数字",
            trigger: "blur",
            pattern: /^(0|0(.)?\d+|[1-9]\d*(.)?\d*)$/,
          },
        ],
        sb9: [
          {
            required: true,
            message: "请输入数字",
            trigger: "blur",
            pattern: /^(0|0(.)?\d+|[1-9]\d*(.)?\d*)$/,
          },
        ],
        sb10: [
          {
            required: true,
            message: "请输入数字",
            trigger: "blur",
            pattern: /^(0|0(.)?\d+|[1-9]\d*(.)?\d*)$/,
          },
        ],
        sb11: [
          {
            required: true,
            message: "请输入数字",
            trigger: "blur",
            pattern: /^(0|0(.)?\d+|[1-9]\d*(.)?\d*)$/,
          },
        ],
        sb0val: [
          {
            required: true,
            message: "请输入数字",
            trigger: "blur",
            pattern: /^(0|0(.)?\d+|[1-9]\d*(.)?\d*)$/,
          },
        ],
        sb1val: [
          {
            required: true,
            message: "请输入数字",
            trigger: "blur",
            pattern: /^(0|0(.)?\d+|[1-9]\d*(.)?\d*)$/,
          },
        ],
        sb2val: [
          {
            required: true,
            message: "请输入数字",
            trigger: "blur",
            pattern: /^(0|0(.)?\d+|[1-9]\d*(.)?\d*)$/,
          },
        ],
        sb3val: [
          {
            required: true,
            message: "请输入数字",
            trigger: "blur",
            pattern: /^(0|0(.)?\d+|[1-9]\d*(.)?\d*)$/,
          },
        ],
        sb4val: [
          {
            required: true,
            message: "请输入数字",
            trigger: "blur",
            pattern: /^(0|0(.)?\d+|[1-9]\d*(.)?\d*)$/,
          },
        ],
        sb5val: [
          {
            required: true,
            message: "请输入数字",
            trigger: "blur",
            pattern: /^(0|0(.)?\d+|[1-9]\d*(.)?\d*)$/,
          },
        ],
        sb6val: [
          {
            required: true,
            message: "请输入数字",
            trigger: "blur",
            pattern: /^(0|0(.)?\d+|[1-9]\d*(.)?\d*)$/,
          },
        ],
        sb7val: [
          {
            required: true,
            message: "请输入数字",
            trigger: "blur",
            pattern: /^(0|0(.)?\d+|[1-9]\d*(.)?\d*)$/,
          },
        ],
        sb8val: [
          {
            required: true,
            message: "请输入数字",
            trigger: "blur",
            pattern: /^(0|0(.)?\d+|[1-9]\d*(.)?\d*)$/,
          },
        ],
        sb9val: [
          {
            required: true,
            message: "请输入数字",
            trigger: "blur",
            pattern: /^(0|0(.)?\d+|[1-9]\d*(.)?\d*)$/,
          },
        ],
        sb10val: [
          {
            required: true,
            message: "请输入数字",
            trigger: "blur",
            pattern: /^(0|0(.)?\d+|[1-9]\d*(.)?\d*)$/,
          },
        ],
        sb11val: [
          {
            required: true,
            message: "请输入数字",
            trigger: "blur",
            pattern: /^(0|0(.)?\d+|[1-9]\d*(.)?\d*)$/,
          },
        ],
        benefitbase: [
          {
            required: true,
            message: "请输入数字",
            trigger: "blur",
            pattern: /^(0|0(.)?\d+|[1-9]\d*(.)?\d*)$/,
          },
        ],

        prosalary: [
          {
            required: true,
            message: "请输入 试用期工资",
            trigger: "blur",
            pattern: /^(0|0(.)?\d+|[1-9]\d*(.)?\d*)$/,
          },
        ],
        consalary: [
          {
            required: true,
            message: "请输入 合同工资,没有输入0",
            trigger: "blur",
            pattern: /^(0|0(.)?\d+|[1-9]\d*(.)?\d*)$/,
          },
        ],
        currsalary: [
          {
            required: true,
            message: "请输入 当前工资，没有输入0",
            trigger: "blur",
            pattern: /^(0|0(.)?\d+|[1-9]\d*(.)?\d*)$/,
          },
        ],
        serveryear: [
          {
            required: true,
            message: "请输入 入职前工龄月份数，没有输入0",
            trigger: "blur",
            pattern: /^(0|([1-9]{1}[0-9]*))$/,
          },
        ],
        housefund: [
          {
            required: true,
            message: "请输入 公积金基数，没有输入0",
            trigger: "blur",
            pattern: /^(0|0(.)?\d+|[1-9]\d*(.)?\d*)$/,
          },
        ],
        socialbase: [
          {
            required: true,
            message: "请输入 社保基数",
            trigger: "blur",
            pattern: /^(0|0(.)?\d+|[1-9]\d*(.)?\d*)$/,
          },
        ],
      },

      checkoutrules: {
        reqleavedate: [
          { required: true, message: "请输入 离职申请日期", trigger: "blur" },
        ],

        checkout: [
          { required: true, message: "请输入 离职工作日", trigger: "blur" },
        ],

        lastdate: [
          { required: true, message: "请输入 最后工作日", trigger: "blur" },
        ],

        accledate: [
          { required: true, message: "请输入 积假到期日", trigger: "blur" },
        ],

        aledate: [
          { required: true, message: "请输入 年假到期日", trigger: "blur" },
        ],

        acclhoursm: [
          {
            required: true,
            message: "请输入 结余积假小时数",
            trigger: "blur",
            pattern: /^-?(0|0\.\d*|[1-9]\d*\.?\d*)$/, //正负数
          },
        ],

        alhoursm: [
          {
            required: true,
            message: "请输入 结余年假小时数",
            trigger: "blur",
            pattern: /^-?(0|0\.\d*|[1-9]\d*\.?\d*)$/, //正负数
          },
        ],
      },
      familyform: {
        id: "",
        sysid: "",
        birth: "",
        idcard: "",
        remark: "",
        mtele: "",
        name: "",
        relation: "",
        company: "",
        isactive: 1,
        sort: 100,
      },
      familyrules: {
        name: [{ required: true, message: "请输入 家属姓名", trigger: "blur" }],
        relation: [{ required: true, message: "请输入 关系", trigger: "blur" }],
        mtele: [
          { required: true, message: "请输入 电话号码", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.getdic();
  },
  methods: {
    prosalarychange() {
      this.form.consalary = this.form.prosalary;
      this.form.currsalary = this.form.prosalary;
    },
    datejoinedChange() {
      this.form.regulardate = moment(this.form.datejoined)
        .add(3, "months")
        .add(0, "days")
        .format("YYYY-MM-DD");
      this.form.probafrom = this.form.datejoined;
      this.form.probato = moment(this.form.datejoined)
        .add(3, "months")
        .add(-1, "days")
        .format("YYYY-MM-DD");
      this.form.confrom = this.form.datejoined;
      this.form.conto = moment(this.form.datejoined)
        .add(2, "years")
        .add(-1, "days")
        .format("YYYY-MM-DD");
      this.form.healfrom = this.form.datejoined;
      this.form.healto = moment(this.form.datejoined)
        .add(1, "years")
        .add(-1, "days")
        .format("YYYY-MM-DD");
    },
    consalaryChange() {
      this.form.currsalary = this.form.consalary;
    },

    calsbgjj() {
      for (let r of this.dichrsbgjjData) {
        // console.log(r.itemid, r.itemrate, r.itemname);
        let sb = this.form["sb" + r.itemid];
        let ful = r.itemrate
          .replace(/x/g, sb)
          .replace(/round/g, "Math.round")
          .replace(/ceil/g, "Math.ceil")
          .replace(/floor/g, "Math.floor");

        this.form["sb" + r.itemid + "val"] = eval(ful);
      }
    },

    socialbaseChange() {
      this.form.housefund = this.form.socialbase;
      this.form.sb0 = this.form.socialbase;
      this.form.sb1 = this.form.socialbase;
      this.form.sb2 = this.form.socialbase;
      this.form.sb3 = this.form.socialbase;
      this.form.sb4 = this.form.socialbase;
      this.form.sb5 = this.form.socialbase;
      this.form.sb6 = this.form.socialbase;
      this.form.sb7 = this.form.socialbase;
      this.form.sb8 = this.form.socialbase;
      this.form.sb9 = this.form.socialbase;
      this.form.sb10 = this.form.socialbase;
      this.form.sb11 = this.form.socialbase;
      this.calsbgjj();
    },
    housefundChange() {
      this.form.sb6 = this.form.housefund;
      this.form.sb10 = this.form.housefund;
      this.calsbgjj();
    },

    sbChange() {
      this.calsbgjj();
    },

    regulardateChange() {
      this.form.probato = moment(this.form.regulardate).add(-1, "days");
    },
    healfromChange() {
      if (this.form.healfrom) {
        this.form.healto = moment(this.form.healfrom)
          .add(1, "years")
          .add(-1, "days")
          .format("YYYY-MM-DD");
      } else {
        this.form.healto = "";
      }
    },

    reqleavedateChange() {
      this.form.lastdate = moment(this.form.reqleavedate)
        .add(1, "months")
        .add(-1, "days")
        .format("YYYY-MM-DD");
      this.form.checkout = moment(this.form.reqleavedate)
        .add(1, "months")
        .add(0, "days")
        .format("YYYY-MM-DD");

      this.form.accledate = this.form.checkout;
      this.form.aledate = this.form.checkout;
    },
    alhsmChange() {
      this.form.accledate = this.form.aledate;
    },
    confromChange() {
      this.form.conto = moment(this.form.confrom)
        .add(2, "years")
        .add(-1, "days")
        .format("YYYY-MM-DD");
    },
    idcardChange() {
      if (this.form.idcard) {
        let year = this.form.idcard.substring(6, 10);
        let mon = this.form.idcard.substring(10, 12);
        let day = this.form.idcard.substring(12, 14);
        let sex = this.form.idcard.substring(16, 17);
        this.form.birth = year + "-" + mon + "-" + day;
        if (["1", "3", "5", "7", "9"].includes(sex)) {
          this.form.sex = 1;
        } else {
          this.form.sex = 0;
        }
      }
    },

    fileonchange(file) {
      let error = false;
      // 2.如果没有选中文件则取消
      if (!file.target.files) {
        return;
      }
      //3.获得选择的文件对象
      var f = file.target.files[0];
      //4.初始化新的文件读取对象，浏览器自带，不用导入
      var reader = new FileReader();
      //5.绑定FileReader对象读取文件对象时的触发方法
      reader.onload = (e) => {
        //7.获取文件二进制数据流
        let data = e.currentTarget.result;
        //8.利用XLSX解析二进制文件为xlsx对象
        const workbook = XLSX.read(data, { type: "binary" });
        //9.利用XLSX把wb第一个sheet转换成JSON对象
        //wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
        const sheetName = workbook.SheetNames[0];
        //wb.Sheets[Sheet名]获取第一个Sheet的数据
        const sheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(sheet);
        //----------------------------
        // console.log("excel", sheetName);
        //10.在终端输出查看结果
        console.log(jsonData);

        if (jsonData) {
          for (let ele of jsonData) {
            if (!ele.emid) {
              error = true;
              return;
            } else {
              console.log(ele.emid);
            }
          }
        } else {
          error = true;
        }
      };
      if (error) {
        this.$message({
          type: "error",
          message:
            '导入文件中必须有"emid"或者"工号"为名称的字段，并且不能为空！',
          duration: 0,
        });
      } else {
        this.$confirm(
          "导入将依据系统中存在的人员工号进行数据更新,而且不可逆, 是否继续?",
          "提示",
          {
            confirmButtonText: "我明白风险，继续导入",
            cancelButtonText: "我先静静",
            type: "warning",
          }
        )
          .then(() => {
            AX("DELETE", "prstaff/" + "123").then((res) => {
              if (res) {
                //this.listFamily();
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消导入",
            });
          });
      }
      //6.使用reader对象以二进制读取文件对象f，
      reader.readAsBinaryString(f);
    },

    exportexcel() {
      let worksheet = XLSX.utils.json_to_sheet(this.tableData);
      let workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "first page");
      XLSX.writeFile(workbook, "exportEXCELdemo.xls");

      console.log(XLSX.utils, WorkSheet);
    },

    importexcel() {
      $("#inexc").click();
    },

    closeWorksForm(data) {
      this.dialogWorksVisible = data;
    },
    closeEducationForm(data) {
      this.dialogEducationVisible = data;
    },
    closeCertForm(data) {
      this.dialogCertVisible = data;
    },
    closeContractForm(data) {
      this.dialogContractVisible = data;
    },
    closePassportForm(data) {
      this.dialogPPVisible = data;
    },
    closeTransformForm(data) {
      this.dialogTransformVisible = data;
    },
    closeAwardForm(data) {
      this.dialogAwardVisible = data;
    },
    closeOTlistForm(data) {
      this.dialogOTlistVisible = data;
    },
    closeLevlistForm(data) {
      this.dialogLevlistVisible = data;
    },
    closeMoresearchForm(data) {
      this.dialogMSVisible = data;
    },
    closeReceiptForm(data) {
      this.dialogReceiptVisible = data;
    },

    init_familyform() {
      this.neworedit = true;
      const keyitems = [
        "id",
        "name",
        "company",
        "mtele",
        "remark",
        "relation",
        "birth",
        "idcard",
      ];

      for (let item in this.familyform) {
        if (keyitems.includes(item.toString().toLowerCase()) == true) {
          this.familyform[item] = "";
        }
      }
      this.familyform.sort = 100;
      this.familyform.isactive = 1;
    },

    changeToplus_family() {
      this.init_familyform();
    },

    delfamily(idx, row) {
      this.$confirm("此操作将设置其为失效记录,并不能恢复。是否继续?", "提示", {
        confirmButtonText: "我知道风险，确定将其失效",
        cancelButtonText: "我再考虑下。",
        type: "warning",
      })
        .then(() => {
          AX("delete", "family/" + row.id).then((res) => {
            if (res) {
              this.listFamily();
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

    editfamily(idx, row) {
      //  console.log(idx, row);
      this.neworedit = false;
      this.familyform = Object.assign({}, row);
    },

    cmd_works(idx, row) {
      this.fsysid = row.sysid;
      this.dialogWorksVisible = true;
    },
    cmd_education(idx, row) {
      this.fsysid = row.sysid;
      this.dialogEducationVisible = true;
    },
    cmd_cert(idx, row) {
      this.fsysid = row.sysid;
      this.dialogCertVisible = true;
    },
    cmd_contract(idx, row) {
      this.fsysid = row.sysid;
      this.dialogContractVisible = true;
    },
    cmd_passport(idx, row) {
      this.fsysid = row.sysid;
      this.dialogPPVisible = true;
    },
    cmd_transform(idx, row) {
      this.fsysid = row.sysid;
      this.hrData = Object.assign({}, row);
      this.dialogTransformVisible = true;
    },

    cmd_award(idx, row) {
      this.fsysid = row.sysid;
      this.dialogAwardVisible = true;
    },
    cmd_otlist(idx, row) {
      this.fsysid = row.sysid;
      this.dialogOTlistVisible = true;
    },
    cmd_levlist(idx, row) {
      this.fsysid = row.sysid;
      this.dialogLevlistVisible = true;
    },
    cmd_receipt(idx, row) {
      this.fsysid = row.sysid;
      this.dialogReceiptVisible = true;
    },
    cmd_family(idx, row) {
      // console.log(idx, row)
      this.neworedit = true;
      AX("get", "family/" + row.sysid).then((res) => {
        console.log(res);
        if (res) {
          this.familyData = res.data;
        }

        this.familyform.sysid = row.sysid;
        this.familyform.isactive = 1;
        this.dialogFamilyVisible = true;
      });
    },

    cmd_checkout(idx, row) {
      this.fixForm(row);
      //这里HRSTATUS必须0是在职，1是离职，和ifcheckout 保持一致
      //考虑是未离职的状态
      // console.log("row", row);
      if (row.hrstatus && 0 == parseInt(row.hrstatus)) {
        this.form.reqleavedate = moment().format("YYYY-MM-DD");
        this.form.checkout = moment().format("YYYY-MM-DD");
        this.form.lastdate = moment().format("YYYY-MM-DD");
        this.form.aledate = moment().format("YYYY-MM-DD");
        this.form.accledate = moment().format("YYYY-MM-DD");
      }

      if (row.checkoutchecked) {
        this.ary_ckc = row.checkoutchecked.split(",");
      } else {
        this.ary_ckc = ["-1"];
      }
      if (row.checkouttype) {
        this.ary_ckt = row.checkouttype.split(",");
      } else {
        this.ary_ckt = ["-1"];
      }
      if (row.checkoutreason) {
        this.ary_ckr = row.checkoutreason.split(",");
      } else {
        this.ary_ckr = ["-1"];
      }
      this.dialogCheckoutVisible = true;
      // console.log(idx, row)
    },
    morecommand(cmd) {
      console.log(cmd);
      //  fixForm(row);
    },

    check() {
      this.deptChecked.splice("0", this.deptChecked.length);
      this.deptChecked = this.$refs.deptTree.getCheckedNodes();
    },
    /**
     * 这里非常秒关键在return这里，双return；否则无法返回
     */
    findComid(el) {
      for (let it of this.dpList) {
        if (it.dpid == el.fid) {
          if (it.deptlevel != "0") {
            //下面这个写法尤其重要，否则无法返回迭代的值，而是总是初始值。秒
            return this.findComid(it);
          } else {
            return it;
          }
        }
      }
    },

    async newdeptnodeclick(data) {
      // console.log(data);
      if (data.deptlevel == 2) {
        this.deptVisible = false;
        this.form.dpname = data.deptname;
        this.form.dept = data.fid;
        this.form.position = data.deptid;
        const comnode = this.findComid(data);
        this.form.comid = comnode.dpid;
        await this.getNewEmid(this.form.comid);
      }
    },
    test() {
      console.log("deptvisible:", this.deptVisible);
      this.deptVisible = !this.deptVisible;
    },
    handleDelete(idx, row) {
      this.$confirm("该操作将设置其为失效记录,并不能恢复。是否继续?", "提示", {
        confirmButtonText: "我知道风险，并坚持使其失效。",
        cancelButtonText: "容我思量下",
        type: "warning",
      })
        .then(() => {
          AX("patch", "hrinfo/" + row.id, {
            isactive: row.isactive == 1 ? 0 : 1,
          }).then((res) => {
            if (res) {
              this.listMain();
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

    logCheckout() {
      const checkoutkey = [
        "reqleavedate",
        "checkout",
        "lastdate",
        "accledate",
        "aledate",
        "acclhoursm",
        "alhoursm",
        "checkoutchecked",
        "checkouttype",
        "checkoutreason",
        "checkoutremark",
        "id",
        "hrstatus",
      ];
      let saveform = {};
      let logform = [];

      // console.log("ddddddddddddddddd", this.histform);
      Object.keys(this.form).forEach((k) => {
        if (checkoutkey.includes(k)) {
          saveform[k] = this.form[k];

          if (this.form[k] != this.histform[k]) {
            let logobj = {};
            logobj["item"] = k;
            logobj["from"] = this.histform[k];
            logobj["to"] = this.form[k];
            logobj["opeartor"] =
              this.userstore.getUser(false).usrname +
              "_" +
              this.userstore.getUser(false).tele;
            logobj["sysid"] = this.form.sysid;
            logobj["object"] = this.form.emid + "_" + this.form.cname;
            logobj["type"] = "Hrinfo_Edit";
            logobj["remark"] = "人事离职/撤销处理";
            logform.push(logobj);
          }
        }
      });

      return { saveform, logform };
    },

    savecheckoutForm(ifcheckout = 1) {
      if (ifcheckout == 0) {
        /**************************************** */
        this.$confirm("此操作将永久清空离职信息, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            /**
             * ifcheckout=0 ,只要按撤销就算回到在职
             */
            this.form.ifcheckout = "0";
            this.form.hrstatus = 0;
            /**
             * 而且需要把申请日期和离职日期清空
             */
            this.form.reqleavedate = null;
            this.form.checkout = null;
            this.form.lastdate = null;
            this.form.accledate = null;
            this.form.aledate = null;
            this.form.acclhoursm = "0";
            this.form.alhoursm = "0";
            this.form.checkoutchecked = "";
            this.form.checkouttype = "";
            this.form.checkoutreason = "";
            this.form.checkoutremark = "";

            const log = this.logCheckout();
            const { saveform, logform } = log;

            //把更改人写入。
            saveform["updateby"] =
              this.userstore.getUser(false).usrname +
              "_" +
              this.userstore.getUser(false).tele;

            // console.log(saveform, logform);

            AX("patch", "hrinfo/" + this.form.id, saveform).then((res) => {
              if (res) {
                AX("post", `loglist`, logform).then((logres) => {
                  this.dialogCheckoutVisible = false;
                  this.listMain();
                });
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "撤销失败",
            });
          });
      }

      if (ifcheckout == 1) {
        this.$refs.checkoutform.validate((valid) => {
          if (valid) {
            this.chkary();
            /**
             * ifcheckout=1 ,只要按保存就算离职处理,
             * ifcheckout 0:在职，1:离职 2：已提离职
             * 需要判断。
             */

            this.form.ifcheckout = chkBtdt(this.form.checkout);
            // this.form.ifcheckout = ifcheckout;
            this.form.hrstatus = ifcheckout;

            const log = this.logCheckout();
            const { saveform, logform } = log;

            // console.log(saveform, logform);

            AX("patch", "hrinfo/" + this.form.id, saveform).then((res) => {
              if (res) {
                AX("post", `loglist`, logform).then((logres) => {
                  this.dialogCheckoutVisible = false;
                  this.listMain();
                });
              }
            });
          }
        });
      }
    },

    chkary() {
      if (this.ary_ckc && toRaw(this.ary_ckc.length > 0)) {
        this.form.checkoutchecked = toRaw(this.ary_ckc).join(",");
      }
      if (this.ary_ckt && toRaw(this.ary_ckt.length > 0)) {
        this.form.checkouttype = toRaw(this.ary_ckt).join(",");
      }
      if (this.ary_ckr && toRaw(this.ary_ckr.length > 0)) {
        this.form.checkoutreason = toRaw(this.ary_ckr).join(",");
      }
    },
    saveForm() {
      let sellist = [
        "selhrgrade",
        "selhrstatus",
        "selhrtype",
        "selhrsource",
        "selhrmarry",
        "selhreducation",
        "selhrpolitical",
        "selhrcontype",
        "selhrhktype",
      ];

      let eleobj = {};
      sellist.forEach((ele) => {
        eleobj[ele] = $("#" + ele).val();
        this.selval.push(eleobj);
      });

      //if (a) return;
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.form.hrchecked = this.hrcheckedshow.flat().toString();

          this.chkary();

          this.form.birthmonth = moment(this.form.birth).format("M");

          if (!this.neworedit) {
            /**这一步很重要，只保存改变的值，不改变的值不提交 */
            let saveform = {};
            let logform = [];
            Object.keys(this.form).forEach((k) => {
              if (this.form[k] != this.histform[k]) {
                saveform[k] = this.form[k];

                //loginfo 这是日志信息，不需要做成通用的，
                //因为日志只在主要的地方即可，关键信息即可
                //大部分关键信息都是来自hrinfo这个模块。
                let logobj = {};
                logobj["item"] = k;
                logobj["from"] = this.histform[k];
                logobj["to"] = this.form[k];
                logobj["opeartor"] =
                  this.userstore.getUser(false).usrname +
                  "_" +
                  this.userstore.getUser(false).tele;
                logobj["sysid"] = this.form.sysid;
                logobj["object"] = this.form.emid + "_" + this.form.cname;
                logobj["type"] = "Hrinfo_Edit";
                logform.push(logobj);
                //---------------
              }
            });

            //如果没有任何修改，那么直接关闭即可，无需刷新数据库
            // console.log(saveform);
            if (Object.keys(saveform).length < 1) {
              this.dialogFormVisible = false;
              this.listMain();
            }
            //把更改人写入。
            saveform["updateby"] =
              this.userstore.getUser(false).usrname +
              "_" +
              this.userstore.getUser(false).tele;
            //--------------------------------------------------------------------
            AX(
              "patch",
              `hrinfo/${this.form.id}`, //这里必须用form.id,因为存储的变化中ID从未变，所有不包含再saveform中。
              saveform
            ).then((res) => {
              if (res) {
                AX("post", `loglist`, logform).then((logres) => {
                  this.dialogFormVisible = false;
                  this.listMain();
                });
              }
            });
          } else {
            this.form["createdby"] =
              this.userstore.getUser(false).usrname +
              "_" +
              this.userstore.getUser(false).tele;
            this.dissaveformbtn = true;
            //再新建的时候需要再来一次，这样确保每次数据进去的时候sysid不同
            this.form.sysid = uuidv4();
            AX("post", "hrinfo", this.form).then((res) => {
              if (res) {
                this.dialogFormVisible = false;
                this.listMain();
              }
            });
          }
        }
      });
    },
    saveFamilyForm() {
      this.$refs["familyform"].validate((valid) => {
        if (valid) {
          if (!this.neworedit) {
            AX("patch", "family/" + this.familyform.id, this.familyform).then(
              (res) => {
                if (res) {
                  this.listFamily();
                  this.init_familyform();
                }
              }
            );
          } else {
            AX("post", "family", this.familyform).then((res) => {
              if (res) {
                this.listFamily();
                this.init_familyform();
              }
            });
          }
        }
      });
    },

    listFamily() {
      AX("get", "family/" + this.familyform.sysid).then((res) => {
        if (res) {
          this.familyData = res.data;
        }
      });
    },

    formatisstop(row) {
      return row.is_stop == 0 ? "No" : "STOP";
    },
    handleNew() {
      this.neworedit = true;
      this.dialogFormVisible = true;
      this.dissaveformbtn = false;
      // this.getdic();
      Object.keys(this.form).forEach((key) => {
        this.form[key] = "";
      });
      this.form.updatedat = moment();
      this.form.createdat = moment();
      this.form.updatedby = this.userstore.getUser(false).usrname;
      this.form.createdby = this.userstore.getUser(false).usrname;

      /**临时测试用的数据 */
      this.form.cname = "李逍遥";
      this.form.idcard = "530102198711111555";
      //----------

      this.form.id = "";
      this.form.ifcheckout = "0";
      this.form.holdays = "0";
      this.form.reqdays = "0";
      this.form.alhoursm = "0";
      this.form.acclhoursm = "0";
      this.form.sysid = uuidv4();
      this.form.joblessdays = 0;
      this.form.hrstatus = "0";

      //-------------------------------------

      this.form.prosalary = 0;
      this.form.consalary = 0;
      this.form.currsalary = 0;
      this.form.acclhoursm = 0;
      this.form.alhoursm = 0;
      this.form.sex = 1;
      this.form.if_proba = 0;
      this.form.serveryear = 0;
      this.form.housefund = 0;
      this.form.socialbase = 0;
      this.form.outhr = 0;
      this.form.nothr = 0;
      //-----------------------------
      this.form.height = 168;
      this.form.weight = 58;
      this.form.lsight = 2.1;
      this.form.rsight = 2.1;
      this.form.shoe = 38;
      this.form.dress = "XL";
      this.form.pants = "XL";
      this.form.smoke = 0;
      this.form.stopkq = 0;
      this.form.stoppr = 0;

      //-----------------------------

      //-------------------------------
      this.form.sb0 = 0;
      this.form.sb1 = 0;
      this.form.sb2 = 0;
      this.form.sb3 = 0;
      this.form.sb4 = 0;
      this.form.sb5 = 0;
      this.form.sb6 = 0;
      this.form.sb7 = 0;
      this.form.sb8 = 0;
      this.form.sb9 = 0;
      this.form.sb10 = 0;
      this.form.sb11 = 0;
      this.form.sb0val = 0;
      this.form.sb1val = 0;
      this.form.sb2val = 0;
      this.form.sb3val = 0;
      this.form.sb4val = 0;
      this.form.sb5val = 0;
      this.form.sb6val = 0;
      this.form.sb7val = 0;
      this.form.sb8val = 0;
      this.form.sb9val = 0;
      this.form.sb10val = 0;
      this.form.sb11val = 0;

      //-----------------------------------------------

      this.form.comid = this.userstore.getUser(false).comid;

      this.hrcheckedshow.splice(0, this.hrcheckedshow.length);
    },

    getNewEmid(comid) {
      /**
       * 以后需要改进：
       * 1：部门必须有工号的区间，比如 10000-12500。
       * 2：工号长注内存，拿一个，少一个。
       */
      AX("get", `hrinfo/maxemid/${comid}`).then((res) => {
        if (res) {
          this.form.emid = res.data.emid;
          this.form.workid = res.data.emid;
        }
      });
    },
    fixForm(row) {
      Object.keys(this.form).forEach((key) => {
        this.form[key] = row[key];
        this.histform[key] = row[key];
      });
    },

    handleEdit(index, row) {
      //  this.getdic();
      this.neworedit = false;
      this.dialogFormVisible = true;
      this.dissaveformbtn = false;

      //---------------这里需要把row中非formKEY的删除掉，必须保持按FORM为准-----------------
      this.fixForm(row);
      //------------------------------------------------------------------------------
      /**不能适用下面方式赋值，因为数据库中的字段可能比form的字段多，那么就会造成存储的时候，
       * 有些是数字字段，或者根本没有赋值，特别是修改以后，再新建数据，这时候form的内容已经变成
       * 上次修改时候从数据库中调出的值，比如。outhr这些字段，他是历史问题。但啊并不存在现在的form中。
       */
      //fixForm(row);

      //——————————————————————————————————————————————————————————————————————
      //数字或者boolean 其实都是数字，ui中的任意内容都是字符，所以需要转化
      this.form.sex = this.form.sex.toString(); //数据字段是数字 smallint
      this.form.if_proba = this.form.if_proba.toString(); //数据字段是真假boolean

      //——————————————————————————————————————————————————————————————————————

      this.hrcheckedshow.splice(0, this.hrcheckedshow.length);

      if (this.form.hrchecked) {
        this.hrcheckedshow = this.form.hrchecked.split(",");
      }

      // console.log(this.dpList);

      let c = 0;
      let dpname = "";
      for (let element of this.dpList) {
        if (c < 2) {
          if (element.dpid == row.dept) {
            dpname += element.dpname;
            c++;
          }
          if (element.dpid == row.position) {
            dpname += element.dpname;
            c++;
          }
        } else {
          this.form.dpname = dpname;
          break;
        }
      }
    },

    changePage(idx) {
      //  console.log(idx)
      this.page.cpg = idx;
      this.listMain();
    },

    getdic(type = "hr") {
      this.loading = true;

      if (type == "hr") {
        // AX("get", "/dicm/hrgrade")
        //   .then((res) => {
        //     this.dichrgradeData = res.data;
        //     // console.log(res.data)
        //     //this.showdesc(res.data, 'hrgrade_13', 'itemid', 'itemname')
        //     // console.log(res.data.dicDescs('hrgrade_13'));
        //   })
        //   .catch((e) => console.log(e.message));
        this.dichrsbgjjData = this.dicstore.getDic("sbgjj"); // console.log(this.dichrsbgjjData);

        // const gdata = this.dicstore.getDic("hrgrade");
        this.dichrgradeData = this.rightstore.getRightStore("hrgrade");
        // rdata.map((el, idx) => {
        //   if (el.type != "hrgrade") {
        //     delete rdata[idx];
        //   }
        // });
        // console.log("--------------------------------", this.dichrgradeData);

        // AX("get", "/dicm/hrtype")
        //   .then((res) => {
        //     this.dichrtypeData = res.data;
        //   })
        //     .catch((e) => console.log(e.message));
        this.dichrtypeData = this.dicstore.getDic("hrtype");

        // AX("get", "/dicm/hrsur")
        //   .then((res) => {
        //     this.dichrsurData = res.data;
        //   })
        //   .catch((e) => console.log(e.message));
        this.dichrsurData = this.dicstore.getDic("hrsur");

        // AX("get", "/dicm/contype")
        //   .then((res) => {
        //     this.diccontypeData = res.data;
        //   })
        //   .catch((e) => console.log(e.message));
        this.diccontypeData = this.dicstore.getDic("contype");

        // AX("get", "/dicm/hrchecked")
        //   .then((res) => {
        //     this.dichrcheckedData = res.data;
        //   })
        //   .catch((e) => console.log(e.message));
        this.dichrcheckedData = this.dicstore.getDic("hrchecked");

        // AX("get", "/dicm/hktype")
        //   .then((res) => {
        //     this.dichktypeData = res.data;
        //   })
        //   .catch((e) => console.log(e.message));
        this.dichktypeData = this.dicstore.getDic("hktype");

        // AX("get", "/dicm/certtype")
        //   .then((res) => {
        //     this.diccerttypeData = res.data;
        //   })
        //     .catch((e) => console.log(e.message));
        this.diccerttypeData = this.dicstore.getDic("certtype");

        // AX("get", "/dicm/hrstatus")
        //   .then((res) => {
        //     this.dichrstatusData = res.data;
        //   })
        //   .catch((e) => console.log(e.message));
        // this.dichrstatusData = this.dicstore.getDic("hrstatus");

        this.dichrstatusData.push(...hrStatus);

        // AX("get", "/dicm/hrpolitical")
        //   .then((res) => {
        //     this.dichrpoliticalData = res.data;
        //   })
        //   .catch((e) => console.log(e.message));

        this.dichrpoliticalData = this.dicstore.getDic("hrpolitical");
        this.diccusrepData = this.dicstore.getDic("cusrep");
        this.diccusrepData = this.diccusrepData.filter((el) => {
          if (el.type == "hr") {
            return el;
          }
        });
        // AX("get", "/dicm/1")
        //   .then((res) => {
        //     this.dichrmarryData = res.data;
        //   })
        //   .catch((e) => console.log(e.message));

        this.dichrmarryData = this.dicstore.getDic("1");

        // AX("get", "/dicm/5")
        //   .then((res) => {
        //     this.dichreducationData = res.data;
        //   })
        //   .catch((e) => console.log(e.message));
        this.dichreducationData = this.dicstore.getDic("5");

        // AX("get", "/dept")
        //   .then((res) => {
        //     this.dpData = res.data;
        //     this.flattenTree(res.data);
        //   })
        //     .catch((e) => console.log(e.message));

        this.deptData = this.deptstore.deptData.data;

        this.dpData = this.deptstore.deptposData.data;
        this.flattenTree(this.dpData);
        // AX("get", "/dicm/hrprops")
        //   .then((res) => {
        //     this.dichrpropsData = res.data;
        //   })
        //   .catch((e) => console.log(e.message));
        this.dichrpropsData = this.dicstore.getDic("hrporps");
      }

      // if (this.form.checkout.length > 4) {
      //   AX("get", "/dicm/checkoutchecked")
      //     .then((res) => {
      //       this.checkoutcheckedData = res.data;
      //     })
      //       .catch((e) => console.log(e.message));
      this.checkoutcheckedData = this.dicstore.getDic("checkoutchecked");

      //   AX("get", "/dicm/leatype")
      //     .then((res) => {
      //       this.checkouttypeData = res.data;
      //     })
      //       .catch((e) => console.log(e.message));
      this.checkouttypeData = this.dicstore.getDic("leatype");

      //   AX("get", "/dicm/leareason")
      //     .then((res) => {
      //       this.checkoutreasonData = res.data;
      //     })
      //       .catch((e) => console.log(e.message));
      this.checkoutreasonData = this.dicstore.getDic("leareaso");
      // }
      this.loading = false;
    },

    async tree(data, val, id, descs) {
      if (!val) {
        return;
      }
      let r = "";
      for (let item of data) {
        // console.log("tree:", val, item[id]);
        if (val != item[id]) {
          if (item.children) {
            await this.tree(item.children, val, id, descs);
          }
        } else {
          // console.log("find......................." + item[descs]);
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
        node.deptlevel = item.deptlevel;

        this.dpList.push(node);
        if (item.children) {
          this.flattenTree(item.children);
        }
      }
    },

    cmd_moresearch() {
      if (this.deptChecked.length < 1) {
        this.$message.error("请选择需要查询的部门！");
        return;
      } else {
        this.deptChecked.forEach((item) => {
          let dpobj = {};
          dpobj.dpid = item.deptid;
          this.dplimit.push(dpobj);
        });

        this.dialogMSVisible = true;
      }
    },

    moreSearch(data) {
      // console.log("================================================");
      // console.log(data);

      this.dialogMSVisible = true;
      this.loading = true;

      let block = encodeURI(JSON.stringify(data));

      console.log("blockencodeURI", block.length, block);

      AX(
        "get",
        `hrinfo/msf?page=${this.page.cpg}&pagesize=${this.page.limit}&block=${block} `
      ).then((res) => {
        this.tableData = res.data;
        this.counts = res.total;

        if (res) {
          this.tableData.forEach((item) => {
            item.birthshow = moment(item.birth).format("MM-DD");
          });
        }
        this.loading = false;
      });
    },

    listMain() {
      if (this.deptChecked.length < 1) {
        this.$message.error("请选择需要查询的部门！");
        return;
      }

      // if (!this.inputsearch) {
      //   this.$message.error("请输入需要查找的人名！");
      //   return;
      // }

      // console.log(this.deptChecked);
      this.loading = true;
      let block = {};

      let depts = [];

      this.deptChecked.forEach((item) => {
        let dpobj = {};
        dpobj.dpid = item.deptid;
        depts.push(dpobj);
      });

      block.dept = depts;
      // console.log("block", JSON.stringify(block));

      block.instaff = this.SF.showInstaff;
      block.isactive = this.SF.showIsactive;
      block.name = this.inputsearch;
      block = encodeURI(JSON.stringify(block));

      // console.log('blockencodeURI', block.length)

      AX(
        "get",
        `hrinfo/find?page=${this.page.cpg}&pagesize=${this.page.limit}&block=${block}`
        // this.page.limit +
        // "/" +
        // this.page.cpg +
        // "/" +
        // block +
        // "/" +
        // this.inputsearch
      ).then((res) => {
        // console.log(res);
        if (res) {
          this.tableData = res.data;
          this.page.total = res.total;

          this.tableData.forEach((item) => {
            item.birthshow = moment(item.birth).format("MM-DD");

            //console.log(item.birthmonth)
          });
          this.loading = false;
        }
      });
    },
    cmd_designrep() {
      let file = {
        //数据源
        dbs: "hr",
        //表头
        title: "人事表",
        //薪资明细报表
        repname: "人事报表",
        //保存时候的权限
        right: "0",
        //保存时候的签名
        signs: [
          "制表人",
          "审核人",
          "人事部",
          "财务部",
          "业主代表",
          "总经理",
        ].join(","),
        //一行有几个签名，多个签名的时候，可以控制一行有几个签名，比如默认是3，就是一行3个，一共2行
        signbyrow: 3,
        rowheight: 0,
      };
      this.ischanged = Math.random() * 100;
      this.repitem = { file };
      this.dialogRepVisible = true;
    },
    openrep(repitem) {
      this.ischanged = Math.random() * 100;
      this.repitem = repitem;
      this.dialogRepVisible = true;
    },
  },
};
</script>
<style scoped>
.dialogform {
  display: flex;
  margin: 0 0;
}

.input-with-select {
  width: 360px;
  margin-left: 10px;
}
.ispos {
  padding: 2px 6px;
  cursor: pointer;
  font-size: 12px;
  background-color: #3186f5;
  color: rgb(255, 255, 255);

  border-radius: 5px;
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

.demo-date-picker {
  display: flex;
  width: 100%;
  padding: 0;
  flex-wrap: wrap;
}
.demo-date-picker .block {
  padding: 2px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  flex: 1;
}
.demo-date-picker .block:last-child {
  border-right: none;
}
.optionsinfo {
  font-size: 16px;
  font-weight: bold;
  font-style: normal;
}
.collapsebar {
  font-size: 16px;
  font-weight: bold;
  font-style: normal;
  color: #3186f5;
}

.companyflag {
  margin-left: 1px;

  color: #ebb563;
  font-weight: normal;
  font-size: 14px;
}
</style>
