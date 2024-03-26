<template>
  <div>
    <!-- 查询头 -->

    <div style="display: flex">
      <el-form-item label="">
        <span style="margin-left: 0px; width: 340px">
          <el-tag
            type="success"
            style="
              font-size: 16px;
              padding: 10px;
              height: 24px;

              color: rgb(163, 163, 163);
            "
            >当前薪资周期: {{ prinfo.period }} 区间 [ {{ prinfo.fromdate }} To
            {{ prinfo.todate }}]</el-tag
          ></span
        >
      </el-form-item>
      <el-form-item label="">
        <span style="margin-left: 10px; width: 120px">
          <el-select
            v-model="prinfo.prcalgrp"
            placeholder="薪资帐套选择"
            style="width: 100%"
            size="small"
            @change="changeacc"
          >
            <el-option
              v-for="item in dicpraccountgrp"
              :key="item.itemid"
              :label="item.itemname"
              :value="item.itemid"
            ></el-option>
          </el-select>
        </span>
      </el-form-item>

      <el-form-item label="">
        <span style="margin-left: 10px; width: 120px">
          <el-select
            v-model="prtype"
            placeholder="薪资员工类型选择"
            style="width: 100%"
            size="small"
            @change="changeprtype"
          >
            <el-option
              v-for="item in prtypes"
              :key="item.itemid"
              :label="item.itemname"
              :value="item.itemid"
            ></el-option>
          </el-select> </span
      ></el-form-item>
    </div>
    <div style="display: flex; margin: 1px; margin-right: 20px">
      <el-tooltip content="新加员工" placement="top">
        <el-button type="primary" icon="Plus" @click="handleNew()"
          >加人</el-button
        >
      </el-tooltip>
      <el-tooltip content="刷新数据" placement="top">
        <el-button type="primary" icon="Refresh" @click="listMain()"
          >刷新</el-button
        >
      </el-tooltip>
      <el-input
        placeholder="查询内容"
        v-model="inputsearch"
        class="input-with-select"
        v-on:keydown.enter="listMain()"
      >
        <template #append>
          <el-button icon="Search" @click="listMain()">查询</el-button>
        </template>
      </el-input>

      <input
        id="inexc"
        type="file"
        accept=" application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        style="position: absolute; clip: rect(0 0 0 0)"
        :onchange="fileonchange"
      />

      <el-tooltip content="导出EXCEL" placement="top">
        <el-button type="primary" style="margin-left: 10px" @click="exportClick"
          ><el-icon><Download /></el-icon>导出X</el-button
        >
      </el-tooltip>
      <el-tooltip content="导入数据" placement="top">
        <el-button type="primary" @click="importexcel" style="margin-left: 10px"
          ><el-icon><Upload /></el-icon>导入X
        </el-button>
      </el-tooltip>

      <el-tooltip content="批量更新" placement="top">
        <el-button
          type="primary"
          icon="CircleCheck"
          @click="cmd_batchupt()"
          style="margin-left: 10px"
          >批量</el-button
        >
      </el-tooltip>
      <el-tooltip content="计算薪资" placement="top">
        <el-button
          type="primary"
          icon="CaretRight"
          @click="cmd_calculate()"
          style="margin-left: 10px"
          >计算</el-button
        >
      </el-tooltip>
      <el-tooltip content="薪资对比" placement="top">
        <el-button
          type="primary"
          icon="DocumentChecked"
          @click="cmd_prcompare()"
          style="margin-left: 10px"
          >对比</el-button
        >
      </el-tooltip>
      <el-tooltip content="薪资报表" placement="top">
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
      <el-tooltip content="薪资过账，不可恢复" placement="top">
        <el-button
          type="primary"
          icon="BottomRight"
          @click="cmd_tohist"
          style="margin-left: 10px"
          >过账</el-button
        >
      </el-tooltip>
    </div>
    <!-- 人事表格子 -->
    <div style="display: flex; margin-top: 10px; height: 650px">
      <div style="border-right: 0px solid rgb(239, 239, 239); margin-left: 1px">
        <el-tree
          :data="deptData"
          show-checkbox
          node-key="id"
          ref="deptTree"
          :props="dpProps"
          :default-expand-all="true"
          @check="check"
          style="width: 250px; overflow-x: scroll; height: 715px"
          class="dept"
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
      <div style="margin-left: 2px; width: 1200px; min-width: 1200px">
        <el-table
          :data="tableData"
          style="width: 1200px; margin-left: 2px; font-size: 12px"
          v-loading="loading"
          :element-loading-text="loadingContent"
          element-loading-spinner="el-icon-loading"
          :element-loading-background="loadingBackground"
          stripe
        >
          <el-table-column prop="id" fixed="left" type="index">
            <template #default="scope">
              <span>{{
                (page.cpg - 1) * page.limit + (scope.$index + 1)
              }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="emid"
            label="工号"
            fixed="left"
            width="80"
          ></el-table-column>
          <el-table-column
            prop="cname"
            fixed="left"
            label="中文名"
            width="80"
          ></el-table-column>
          <el-table-column
            prop="ename"
            label="英文名"
            width="120"
          ></el-table-column>
          <el-table-column prop="sex" label="性别" width="60">
            <template #default="scope">
              <span v-if="scope.row.sex == 1">男</span>

              <span v-else>女</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="datejoined"
            label="入职日期"
            width="100"
          ></el-table-column>

          <el-table-column
            prop="regulardate"
            label="转正日期"
            width="100"
          ></el-table-column>
          <el-table-column prop="type" label="类型" width="120">
            <template #default="scope">
              <span>{{ dichrtypeData.dicDescs(scope.row.type) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="grade" label="级别" width="60">
            <template #default="scope">
              <span>{{ dichrgradeData.dicDescs(scope.row.grade) }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="ifcheckout"
            :formatter="formatisstop"
            width="120"
            show-overflow-tooltip
            label="离职状态"
          >
            <template #default="scope">
              <el-tag v-if="scope.row.ifcheckout == 1" type="danger"
                >离职</el-tag
              >
              <el-tag v-else-if="scope.row.ifcheckout == 0" type="success"
                >在职</el-tag
              >
              <el-tag v-else type="warning">离职申请递交</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="reqleavedate"
            label="离职申请日"
            width="100"
          ></el-table-column>
          <el-table-column
            prop="checkout"
            label="最后工作日"
            width="100"
          ></el-table-column>
          <el-table-column prop="calperiod" label="停薪周期" width="100">
            <template #default="scope">
              <span v-if="scope.row.if_stop == '1'">{{
                scope.row.calperiod
              }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="bank1"
            label="银行卡号"
            width="180"
          ></el-table-column>
          <el-table-column
            prop="idcard"
            label="身份证号"
            width="180"
          ></el-table-column>

          <el-table-column
            prop="currsalary"
            label="当前工资"
            width="100"
          ></el-table-column>
          <el-table-column
            v-for="pritem in pritemDataShow"
            :key="pritem.prid"
            :prop="pritem.prid"
            :label="pritem.prname"
            width="120"
          >
            <template #default="scope">
              <span>{{
                scope.row[pritem.prid] == "0.0000"
                  ? "."
                  : scope.row[pritem.prid]
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="id" fixed="right" label="操作" width="120">
            <template #default="scope">
              <span class="butgrp">
                <el-tooltip
                  content="修改"
                  placement="bottom"
                  v-if="scope.row.stop == 0"
                >
                  <el-button
                    size="small"
                    icon="Edit"
                    @click="handleEdit(scope.$index, scope.row)"
                    v-if="scope.row.stop == 0"
                  ></el-button>
                </el-tooltip>

                <el-tooltip
                  content="停止薪资"
                  placement="top"
                  v-if="scope.row.stop == 0"
                >
                  <el-button
                    size="small"
                    type="danger"
                    icon="Video-pause"
                    @click="handleDelete(scope.$index, scope.row, 1)"
                  ></el-button>
                </el-tooltip>
                <el-tooltip
                  content="发放薪资"
                  placement="top"
                  v-if="scope.row.stop == 1"
                >
                  <el-button
                    size="small"
                    type="success"
                    icon="Caret-right"
                    @click="handleDelete(scope.$index, scope.row, 0)"
                  ></el-button>
                </el-tooltip>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 翻页控件 -->
    <div style="margin-top: 25px; margin-left: 280px">
      <el-pagination
        background
        layout="total,prev, pager, next"
        :page-size="page.limit"
        @current-change="changePage"
        :current-page="page.cpg"
        :total="page.counts"
      ></el-pagination>
    </div>
    <!-- 人事表单 -->
    <div class="dialogform">
      <el-dialog title="薪酬信息" width="1000px" v-model="dialogFormVisible">
        <el-form :rules="rules" :model="form" ref="form" class="margin:0 10px;">
          <el-row :gutter="24">
            <el-col :span="8">
              <div>
                <el-form-item
                  label="工号"
                  :label-width="formLabelWidth"
                  prop="emid"
                  size="small"
                >
                  <el-input
                    size="small"
                    :disabled="!neworedit"
                    v-model="form.emid"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="8">
              <div>
                <el-form-item
                  label="中文名"
                  :label-width="formLabelWidth"
                  prop="cname"
                  size="small"
                >
                  <el-input
                    size="small"
                    v-model="form.cname"
                    :disabled="!neworedit"
                    autocomplete="off"
                    prefix-icon="Edit"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="8">
              <div>
                <el-form-item
                  label="英文名"
                  :label-width="formLabelWidth"
                  size="small"
                >
                  <el-input
                    size="small"
                    v-model="form.ename"
                    :disabled="!neworedit"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="8">
              <div>
                <el-form-item
                  label="入职日期"
                  :label-width="formLabelWidth"
                  prop="datejoined"
                  size="small"
                >
                  <el-input
                    size="small"
                    v-model="form.datejoined"
                    :disabled="!neworedit"
                    autocomplete="off"
                    prefix-icon="Edit"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="8">
              <div>
                <el-form-item
                  label="转正日期"
                  :label-width="formLabelWidth"
                  prop="regulardate"
                  size="small"
                >
                  <el-input
                    size="small"
                    v-model="form.regulardate"
                    :disabled="!neworedit"
                    autocomplete="off"
                    prefix-icon="Edit"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="8">
              <div>
                <el-form-item
                  label="最后工作日"
                  :label-width="formLabelWidth"
                  prop="lastdead"
                  size="small"
                >
                  <el-input
                    size="small"
                    v-model="form.lastdate"
                    :disabled="!neworedit"
                    autocomplete="off"
                    prefix-icon="Edit"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="8">
              <div>
                <el-form-item
                  label="身份证号"
                  :label-width="formLabelWidth"
                  prop="idcard"
                  size="small"
                >
                  <el-input
                    size="small"
                    v-model="form.idcard"
                    :disabled="!neworedit"
                    autocomplete="off"
                    prefix-icon="Edit"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="8">
              <div>
                <el-form-item
                  label="银行卡号"
                  :label-width="formLabelWidth"
                  prop="idcard"
                  size="small"
                >
                  <el-input
                    size="small"
                    v-model="form.bank1"
                    :disabled="!neworedit"
                    autocomplete="off"
                    prefix-icon="Edit"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="8">
              <div>
                <el-form-item
                  label="当前工资"
                  :label-width="formLabelWidth"
                  size="small"
                >
                  <el-input
                    size="small"
                    :disabled="!neworedit"
                    v-model="form.currsalary"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-divider content-position="left">
            <i class="Edit-outline">薪酬项目</i>
          </el-divider>
          <el-row :gutter="24" style="font-size: 9px">
            <el-col :span="6" v-for="item in pritemDataShow" :key="item.prid">
              <div>
                <el-form-item
                  :label="item.prname + '[' + item.prid + ']'"
                  :label-width="formLabelWidth"
                  size="small"
                  :prop="item.prid"
                  :key="item.prid"
                >
                  <el-input
                    v-model="form[item.prid]"
                    :ref="item.prid"
                    :id="item.prid"
                    size="small"
                    :disabled="item.prtype != 0"
                    autocomplete="off"
                    @change="pritemChange(form[item.prid])"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="24"></el-row>

          <el-form-item label="备注" :label-width="formLabelWidth">
            <el-input
              size="default"
              v-model="form.remark"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="success" @click="calculateforsysid"
              >试 算</el-button
            >
            <el-button type="primary" @click="savepritemvalForm"
              >保 存</el-button
            >
          </span>
        </template>
      </el-dialog>
    </div>
    <!-- 人事新人表单 -->
    <div>
      <el-dialog title="薪资人员" width="630px" v-model="dialogAddVisible">
        <el-select
          v-model="prinfo.prcalgrp"
          placeholder="请选择帐套"
          size="small"
          style="width: 100%; margin: 10px 0"
        >
          <el-option
            v-for="item in dicpraccountgrp"
            :key="item.itemid"
            :label="item.itemname"
            :value="item.itemid"
          ></el-option>
        </el-select>
        <div class="eltransfer">
          <el-transfer
            class="transfer"
            v-model="addvalue"
            :data="hrnewData"
            size="small"
            :titles="['人事库', '薪资库 [每次10条]']"
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
          />
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogAddVisible = false">离 开</el-button>
            <el-button
              type="primary"
              @click="saveForm"
              :disabled="addbutdisabled"
              >确 定</el-button
            >
          </span>
        </template>
      </el-dialog>
    </div>
    <!-- 批量更新表单 -->
    <div>
      <div class="dialogform">
        <el-dialog title="导出" width="400px" v-model="dialogFormImpVisible">
          <el-form ref="refimpform">
            <el-row :gutter="24">
              <el-col :span="24">
                <div>
                  <el-form-item
                    label="导个导出模版"
                    :label-width="formLabelWidth"
                    prop="prid"
                  >
                    <el-button
                      type="primary"
                      @click="exportexcel(0)"
                      :disabled="disimpbtn"
                      >导 出 模 版</el-button
                    >
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="24">
                <div>
                  <el-form-item
                    label="导出当前月"
                    :label-width="formLabelWidth"
                    prop="prid"
                  >
                    <el-button
                      type="primary"
                      @click="exportexcel(1)"
                      :disabled="disimpbtn"
                      >导 出 当 前</el-button
                    >
                  </el-form-item>
                </div>
              </el-col>
              <el-divider></el-divider>
              <el-col :span="24">
                <div>
                  <el-form-item
                    label="历史月份从"
                    :label-width="formLabelWidth"
                    prop="histfrom"
                  >
                    <el-select
                      v-model="histfrom"
                      placeholder="历史月份选择"
                      style="width: 100%"
                      @change="histfromChange"
                    >
                      <el-option
                        v-for="item in prhistPeriodData"
                        :key="item.p"
                        :label="item.p"
                        :value="item.p"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="24">
                <div>
                  <el-form-item
                    label="历史月份到"
                    :label-width="formLabelWidth"
                    prop="histto"
                  >
                    <el-select
                      v-model="histto"
                      placeholder="历史月份选择"
                      style="width: 100%"
                      @change="histtoChange"
                    >
                      <el-option
                        v-for="item in prhistPeriodData"
                        :key="item.p"
                        :label="item.p"
                        :value="item.p"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-button
              type="primary"
              @click="exportexcel(2)"
              :disabled="disimpbtn"
              >导 出 历 史</el-button
            >
            <el-divider></el-divider>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogFormImpVisible = false">离 开</el-button>
            </span>
          </template>
        </el-dialog>
      </div>
      <el-dialog
        title="批 量 更 新"
        width="400px"
        v-model="dialogBatchUptVisible"
      >
        <el-form
          :rules="batchformrules"
          :model="batchform"
          ref="refbatchform"
          class="margin:0 20px;display:flex;"
        >
          <el-select
            id="pid"
            v-model="batchform.pid"
            placeholder="请选择项目"
            size="small"
            style="width: 100%; margin: 10px 0"
          >
            <el-option
              v-for="pritem in pritemData0"
              :key="pritem.prid"
              :value="pritem.prid"
              :label="pritem.prname"
            ></el-option>
          </el-select>

          <el-select
            id="symbol"
            v-model="batchform.symbol"
            placeholder="请选择符号"
            size="small"
            style="width: 100%; margin: 10px 0"
          >
            <el-option
              v-for="it in optsData"
              :key="it.itemid"
              :value="it.itemid"
              :label="it.itemname"
            ></el-option>
          </el-select>

          <el-input
            v-model="batchform.val"
            placeholder="请输入批量值"
          ></el-input>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogBatchUptVisible = false">离 开</el-button>
            <el-button
              type="primary"
              @click="batchUpdate"
              :disabled="addbutdisabled"
              >更 新</el-button
            >
          </span>
        </template>
      </el-dialog>
    </div>
    <!-- 薪资对比 -->
    <div>
      <div class="dialogform">
        <el-dialog title="薪资对比" width="400px" v-model="dialogCompVisible">
          <el-form :model="compform" ref="refcompform">
            <el-row :gutter="24">
              <el-col :span="24">
                <div>
                  <el-form-item
                    label="当前对比上期"
                    :label-width="formLabelWidth"
                  >
                    <el-button
                      type="primary"
                      @click="prCompare(1)"
                      :disabled="disimpbtn"
                      >对比上期</el-button
                    >
                  </el-form-item>
                </div>
              </el-col>

              <el-col :span="24">
                <div>
                  <el-form-item
                    label="对比去年同期"
                    :label-width="formLabelWidth"
                  >
                    <el-button
                      type="primary"
                      @click="prCompare(2)"
                      :disabled="disimpbtn"
                      >当前对比去年同期</el-button
                    >
                  </el-form-item>
                </div>
              </el-col>
              <el-divider>当前对比任意历史</el-divider>
              <el-col :span="24">
                <div>
                  <el-form-item label="历史月份" :label-width="formLabelWidth">
                    <el-select
                      v-model="compform.cushist"
                      placeholder="历史月份选择"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="item in prhistPeriodData"
                        :key="item.p"
                        :label="item.p"
                        :value="item.p"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-col>

              <el-col :span="24">
                <div>
                  <el-form-item label="对比历史" :label-width="formLabelWidth">
                    <el-button
                      type="primary"
                      @click="prCompare(3)"
                      :disabled="disimpbtn"
                      >对比历史</el-button
                    >
                  </el-form-item>
                </div>
              </el-col>
              <el-divider>历史对比历史</el-divider>
              <el-col :span="24">
                <div>
                  <el-form-item
                    label="历史月份从"
                    :label-width="formLabelWidth"
                  >
                    <el-select
                      v-model="compform.histfrom"
                      placeholder="历史月份选择"
                      style="width: 100%"
                      @change="histfromChange"
                    >
                      <el-option
                        v-for="item in prhistPeriodData"
                        :key="item.p"
                        :label="item.p"
                        :value="item.p"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="24">
                <div>
                  <el-form-item
                    label="历史月份到"
                    :label-width="formLabelWidth"
                  >
                    <el-select
                      v-model="compform.histto"
                      placeholder="历史月份选择"
                      style="width: 100%"
                      @change="histtoChange"
                    >
                      <el-option
                        v-for="item in prhistPeriodData"
                        :key="item.p"
                        :label="item.p"
                        :value="item.p"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-button
              type="primary"
              @click="prCompare(4)"
              :disabled="disimpbtn"
              >历史对比</el-button
            >
            <el-divider></el-divider>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogCompVisible = false">离 开</el-button>
            </span>
          </template>
        </el-dialog>
      </div>
      <el-dialog
        title="批 量 更 新"
        width="400px"
        v-model="dialogBatchUptVisible"
      >
        <el-form
          :rules="batchformrules"
          :model="batchform"
          ref="refbatchform"
          class="margin:0 20px;display:flex;"
        >
          <el-select
            id="pid"
            v-model="batchform.pid"
            placeholder="请选择项目"
            size="small"
            style="width: 100%; margin: 10px 0"
          >
            <el-option
              v-for="pritem in pritemData0"
              :key="pritem.prid"
              :value="pritem.prid"
              :label="pritem.prname"
            ></el-option>
          </el-select>

          <el-select
            id="symbol"
            v-model="batchform.symbol"
            placeholder="请选择符号"
            size="small"
            style="width: 100%; margin: 10px 0"
          >
            <el-option
              v-for="it in optsData"
              :key="it.itemid"
              :value="it.itemid"
              :label="it.itemname"
            ></el-option>
          </el-select>

          <el-input
            v-model="batchform.val"
            placeholder="请输入批量值"
          ></el-input>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogBatchUptVisible = false">离 开</el-button>
            <el-button
              type="primary"
              @click="batchUpdate"
              :disabled="addbutdisabled"
              >更 新</el-button
            >
          </span>
        </template>
      </el-dialog>
    </div>
    <!-- 薪资报表 -->
    <el-dialog title="" width="1200px" v-model="dialogRepVisible">
      <reps :data="repitem" :ischanged="ischanged"></reps>
    </el-dialog>
  </div>
</template>
<script>
import { AX } from "../utils/api";
import { ref, provide, watch } from "vue";
import * as moment from "moment";
import { opeartorSymbol, chkMoney } from "../utils/comdata";
import * as XLSX from "xlsx/xlsx.mjs";
import $ from "jquery";
import reps from "./reps/replst.vue";
// import { hiPrintPlugin } from "vue-plugin-hiprint";

const iconv = require("iconv-lite");
import {
  useDeptPosStore,
  useDicStore,
  useUserStore,
  useEmidStore,
  useRightStore,
} from "../store/index";
import { duration } from "vue-moment";

export default {
  setup() {
    const deptstore = useDeptPosStore();
    const dicstore = useDicStore();
    const userstore = useUserStore();
    const emidstore = useEmidStore();
    const rightstore = useRightStore();
    provide("clkrep", "1111111");
    return { deptstore, dicstore, userstore, emidstore, rightstore };
  },
  components: { reps },
  data() {
    return {
      dplimit: [],
      fsysid: "123",
      error: false,
      hrData: {},
      canRun: true,
      //y---
      refresh: true,
      repitem: {},
      ischanged: ref(0),

      loadingContent: "拼命加载中",
      loadingBackground: "rgba(0, 0, 0, 0.8)",

      histfrom: "",
      histto: "",

      tableData: [],
      roleData: [],
      familyData: [],

      pritemData: [],
      pritemData0: [],
      pritemDataShow: [],

      pritems_ids_0: [],
      pritems_ids_not0: [],

      compareData: [],
      dialogCompDataVisible: false,

      optsData: [],

      loading: false,
      deptVisible: false,

      dialogFormImpVisible: false,
      dialogCompVisible: false,
      disimpbtn: false,

      dichrgradeData: [],
      dichrtypeData: [],
      dichrstatusData: [],
      dichreducationData: [],
      dichrmarryData: [],
      diccontypeData: [],
      dichrsurData: [],
      diccerttypeData: [],
      dichrpropsData: [],
      diccusrepData: [],

      dichrpoliticalData: [],
      dichrcheckedData: [],

      checkoutcheckedData: [],
      checkouttypeData: [],
      checkoutreasonData: [],

      hrcheckedshow: [],
      deptChecked: [],

      addbutdisabled: false,

      dichktypeData: [],

      hrnewData: [],
      addvalue: [],
      dicpraccountgrp: [],
      prhistPeriodData: [],

      deptData: [],
      dpData: [],
      dpList: [],
      dpProps: {
        label: "deptname",
        level: "deptlevel",
        children: "children",
      },

      inputsearch: "",
      counts: 1,
      cp1: 1,
      formLabelWidth: "120",

      compform: {
        cushist: "",
        histfrom: "",
        histto: "",
      },

      prinfo: {
        period: "202101",
        fromdate: "2021-01-01",
        todate: "2021-01-01",
        prcalgrp: "1",
      },

      prtypes: [
        { itemid: "0", itemname: "发薪员工" },
        { itemid: "1", itemname: "停薪员工" },
      ],
      prtype: "0",

      cmppwd: "",

      dialogFormVisible: true,

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

      dialogAddVisible: false,

      dialogBatchUptVisible: false,
      dialogRepVisible: ref(false),

      neworedit: true,

      batchform: {
        pid: "",
        val: 0,
        symbol: "=",
      },

      page: {
        limit: 10,
        cpg: 1,
        counts: 1,
      },
      s003: "1",
      form: {
        calperiod: "",
        fromdate: "",
        todate: "",
        if_stop: "",
        remark: "",
        s01: 0,
        s02: 0,
        s03: 0,
        s04: 0,
        s05: 0,
        s06: 0,
        s07: 0,
        s08: 0,
        s09: 0,
        s10: 0,
        s11: 0,
        s12: 0,
        s13: 0,
        s14: 0,
        s15: 0,
        s16: 0,
        s17: 0,
        s18: 0,
        s19: 0,
        s20: 0,
        s21: 0,
        s22: 0,
        s23: 0,
        s24: 0,
        s25: 0,
        s26: 0,
        s27: 0,
        s28: 0,
        s29: 0,
        s30: 0,
        s31: 0,
        s32: 0,
        s33: 0,
        s34: 0,
        s35: 0,
        s36: 0,
        s37: 0,
        s38: 0,
        s39: 0,
        s40: 0,
        s41: 0,
        s42: 0,
        s43: 0,
        s44: 0,
        s45: 0,
        s46: 0,
        s47: 0,
        s48: 0,
        s49: 0,
        s50: 0,
        s51: 0,
        s52: 0,
        s53: 0,
        s54: 0,
        s55: 0,
        s56: 0,
        s57: 0,
        s58: 0,
        s59: 0,
        s60: 0,
        s61: 0,
        s62: 0,
        s63: 0,
        s64: 0,
        s65: 0,
        s66: 0,
        s67: 0,
        s68: 0,
        s69: 0,
        s70: 0,
        s71: 0,
        s72: 0,
        s73: 0,
        s74: 0,
        s75: 0,
        s76: 0,
        s77: 0,
        s78: 0,
        s79: 0,
        s80: 0,
        s81: 0,
        s82: 0,
        s83: 0,
        s84: 0,
        s85: 0,
        s86: 0,
        s87: 0,
        s88: 0,
        s89: 0,
        s90: 0,
        s91: 0,
        s92: 0,
        s93: 0,
        s94: 0,
        s95: 0,
        s96: 0,
        s97: 0,
        s98: 0,
        s99: 0,
        s001: 0,
        s002: 0,
        s003: 0,
        s004: 0,
        s005: 0,
        s006: 0,
        s007: 0,
        s008: 0,
        s009: 0,
        s010: 0,
        s011: 0,
        s012: 0,
        s013: 0,
        s014: 0,
        s015: 0,
        s016: 0,
        s017: 0,
        s018: 0,
        s019: 0,
        s020: 0,
        s021: 0,
        s022: 0,
        s023: 0,
        s024: 0,
        s025: 0,
        s026: 0,
        s027: 0,
        s028: 0,
        s029: 0,
        s030: 0,
        s031: 0,
        s032: 0,
        s033: 0,
        s034: 0,
        s035: 0,
        s036: 0,
        s037: 0,
        s038: 0,
        s039: 0,
        s040: 0,
        s041: 0,
        s042: 0,
        s043: 0,
        s044: 0,
        s045: 0,
        s046: 0,
        s047: 0,
        s048: 0,
        s049: 0,
        s050: 0,
        s051: 0,
        s052: 0,
        s053: 0,
        s054: 0,
        s055: 0,
        s056: 0,
        s057: 0,
        s058: 0,
        s059: 0,
        s060: 0,
        s061: 0,
        s062: 0,
        s063: 0,
        s064: 0,
        s065: 0,
        s066: 0,
        s067: 0,
        s068: 0,
        s069: 0,
        s070: 0,
        s071: 0,
        s072: 0,
        s073: 0,
        s074: 0,
        s075: 0,
        s076: 0,
        s077: 0,
        s078: 0,
        s079: 0,
        s080: 0,
        s081: 0,
        s082: 0,
        s083: 0,
        s084: 0,
        s085: 0,
        s086: 0,
        s087: 0,
        s088: 0,
        s089: 0,
        s090: 0,
        s091: 0,
        s092: 0,
        s093: 0,
        s094: 0,
        s095: 0,
        s096: 0,
        s097: 0,
        s098: 0,
        s099: 0,
        s100: 0,
        s101: 0,
        s102: 0,
        s103: 0,
        s104: 0,
        s105: 0,
        s106: 0,
        s107: 0,
        s108: 0,
        s109: 0,
        s110: 0,
        s111: 0,
        s112: 0,
        s113: 0,
        s114: 0,
        s115: 0,
        s116: 0,
        s117: 0,
        s118: 0,
        s119: 0,
        s120: 0,
        s121: 0,
        s122: 0,
        s123: 0,
        s124: 0,
        s125: 0,
        s126: 0,
        s127: 0,
        s128: 0,
        s129: 0,
        s130: 0,
        s131: 0,
        s132: 0,
        s133: 0,
        s134: 0,
        s135: 0,
        s136: 0,
        s137: 0,
        s138: 0,
        s139: 0,
        s140: 0,
        s141: 0,
        s142: 0,
        s143: 0,
        s144: 0,
        s145: 0,
        s146: 0,
        s147: 0,
        s148: 0,
        s149: 0,
        s150: 0,
        s151: 0,
        s152: 0,
        s153: 0,
        s154: 0,
        s155: 0,
        s156: 0,
        s157: 0,
        s158: 0,
        s159: 0,
        s160: 0,
        s161: 0,
        s162: 0,
        s163: 0,
        s164: 0,
        s165: 0,
        s166: 0,
        s167: 0,
        s168: 0,
        s169: 0,
        s170: 0,
        s171: 0,
        s172: 0,
        s173: 0,
        s174: 0,
        s175: 0,
        s176: 0,
        s177: 0,
        s178: 0,
        s179: 0,
        s180: 0,
        s181: 0,
        s182: 0,
        s183: 0,
        s184: 0,
        s185: 0,
        s186: 0,
        s187: 0,
        s188: 0,
        s189: 0,
        s190: 0,
        s191: 0,
        s192: 0,
        s193: 0,
        s194: 0,
        s195: 0,
        s196: 0,
        s197: 0,
        s198: 0,
        s199: 0,
        s200: 0,
        r001: "",
        r002: "",
        r003: "",
        r004: "",
        r005: "",
        r006: "",
        r007: "",
        r008: "",
        r009: "",
        r010: "",
        r011: "",
        r012: "",
        r013: "",
        r014: "",
        r015: "",
        r016: "",
        r017: "",
        r018: "",
        r019: "",
        r020: "",
        r021: "",
        r022: "",
        r023: "",
        r024: "",
        r025: "",
        r026: "",
        r027: "",
        r028: "",
        r029: "",
        r030: "",
        r031: "",
        r032: "",
        r033: "",
        r034: "",
        r035: "",
        r036: "",
        r037: "",
        r038: "",
        r039: "",
        r040: "",
        r041: "",
        r042: "",
        r043: "",
        r044: "",
        r045: "",
        r046: "",
        r047: "",
        r048: "",
        r049: "",
        r050: "",

        h: {
          sysid: ref(""),
          dpname: "",
          dept: "",
          position: "",

          hrchecked: [],

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
          serveryear: "",

          //probation:'',
          if_proba: "0",
          //probationdate:'',
          //probationenddate:'',
          probafrom: "",
          probato: "",

          prosalary: "0",

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
          checkoutreason: ["-1"],
          checkouttype: ["-1"],
          checkoutchecked: ["-1"],
          ifcheckout: "0", //必须是0
          //-----------------------------------------------
        },
      },
      rules: {
        // emid: [{ required: true, message: '请输入 工号', trigger: 'blur' }],
        // jjname: [{ required: true, message: '请输入 紧急联系人', trigger: 'blur' }],
        // jjtele: [{ required: true, message: '请输入 紧急联系人电话', trigger: 'blur' }],
        // mtele: [{ required: true, message: '请输入 电话号码', trigger: 'blur' }],
        // cname: [{ required: true, message: '请输入 中文名', trigger: 'blur', min: 1, max: 32 }],
        // dpname: [{ required: true, message: '请输入 部门职位', trigger: 'blur' }],
        // idcard: [{ required: true, message: '请输入 身份证号(18位)', trigger: 'blur', min: 15, max: 18 }],
        // prosalary: [{
        //     required: true, message: '请输入 试用期工资', trigger: 'blur', pattern: /^(0(.)?\d+|[1-9]\d*(.)?\d*)$/,
        // }],
        // consalary: [{
        //     required: true, message: '请输入 合同工资', trigger: 'blur', pattern: /^(0(.)?\d+|[1-9]\d*(.)?\d*)$/,
        // }],
        // currsalary: [{
        //     required: true, message: '请输入 当前工资', trigger: 'blur', pattern: /^(0(.)?\d+|[1-9]\d*(.)?\d*)$/,
        // }],
        // serveryear: [{
        //     required: true, message: '请输入 入职前工龄月份数', trigger: 'blur', pattern: /^((0)([1-9]{1}[0-9]*))$/,
        // }],
        // housefund: [{
        //     required: true, message: '请输入 公积金基数', trigger: 'blur', pattern: /^(0(.)?\d+|[1-9]\d*(.)?\d*)$/,
        // }],
        // socialbase: [{
        //     required: true, message: '请输入 社保基数', trigger: 'blur', pattern: /^(0(.)?\d+|[1-9]\d*(.)?\d*)$/,
        // }],
      },

      checkoutrules: {
        // reqleavedate: [{ required: true, message: '请输入 离职申请日期', trigger: 'blur' }],
        // checkout: [{ required: true, message: '请输入 离职工作日', trigger: 'blur', }],
        // lastdate: [{ required: true, message: '请输入 最后工作日', trigger: 'blur', }],
        // accledate: [{ required: true, message: '请输入 积假到期日', trigger: 'blur', }],
        // aledate: [{ required: true, message: '请输入 年假到期日', trigger: 'blur', }],
        // acclhoursm: [{
        //     required: true, message: '请输入 结余积假小时数', trigger: 'blur', pattern: /^-?(0|0\.\d*|[1-9]\d*\.?\d*)$/,//正负数
        // }],
        // alhoursm: [{
        //     required: true, message: '请输入 结余年假小时数', trigger: 'blur', pattern: /^-?(0|0\.\d*|[1-9]\d*\.?\d*)$/,//正负数
        // }],
      },
      familyform: {
        sysid: "",
        birth: "",
        idcard: "",
        remark: "",
        mtele: "",
        name: "",
        relation: "",
        company: "",
      },
      familyrules: {
        name: [{ required: true, message: "请输入 家属姓名", trigger: "blur" }],

        mtele: [
          { required: true, message: "请输入 家属电话号码", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    // s33() { return this.form.s015 }
  },
  mounted() {
    /**这里必须定义为假，默认情况是真，真的意思是让他显示至少一次，这样可以吧组件构建完成，不会导致第一次打开的时候是空 */

    this.dialogFormVisible = false;
    /***************************************************************** */
    this.getdic();
  },
  watch: {
    // form(val) {
    // }
  },
  methods: {
    cusRules() {
      let done = true;
      for (let ele of this.pritemData) {
        const reg = /[sS]{1}\d{3}/g;
        const moneyreg =
          /(^[1-9]([0-9]+)?(\.[0-9]{1,4})?$)|(^(0){1}$)|(^(0){1}\.[0-9]+$)|(^[0-9]\.[0-9]([0-9])?$)/;
        if (ele.prid.match(reg)) {
          let v = this.form[ele.prid];
          if (!v.match(moneyreg) && !ele.prfur) {
            $("#" + ele.prid).css("background-color", "red");
            done = false;
            break;
          } else if (v.match(moneyreg) && !ele.prfur) {
            $("#" + ele.prid).css("background-color", "white");
          }
        }
      }
      return done;
    },

    changeprtype() {
      //   this.listMain();
    },

    changeacc() {
      //   this.listMain();
    },
    cmd_designrep() {
      let file = {
        //数据源
        dbs: "pr",
        //表头
        title: "薪资表",
        //薪资明细报表
        repname: "薪资报表",
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
    print() {
      this.print({
        template: "<h1>hello,hiprint!</h1></h1>",
        style: `
        h1{
          color:red;
          width: '100%';
          height: '100%';
        }`,
      });
    },
    cmd_prcompare() {
      this.disimpbtn = false;
      this.dialogCompVisible = true;
      this.getPrhistPeriod();
    },
    prCompare(type = 1) {
      if (!this.checkTableData()) {
        return;
      }

      this.disimpbtn = false;
      let data = {};
      data.calgrp = this.prinfo.prcalgrp;
      data.period = this.prinfo.period;
      data.type = type;

      if (type == 3) {
        data.cushist = this.compform.cushist;
        if (!this.compform.cushist) {
          this.$message.error("请选择历史月份，否则无法比较！");
          return;
        }
      }
      if (type == 4) {
        data.histfrom = this.compform.histfrom;
        data.histto = this.compform.histto;
        if (!this.compform.histfrom || !this.compform.histto) {
          this.$message.error("请选择历史月份的开始和结束，否则无法比较！");
          return;
        }
      }
      // console.log(this.dpData);
      AX("post", `prstaff/prcompare`, data).then((res) => {
        //这里需要把sysid这种类型的字段删除掉
        res.data.forEach((ele) => {
          delete ele.sysid;

          this.dpList.forEach((d) => {
            if (ele.dept == d.dpid) {
              ele.dept = d.dpname;
            }
            if (ele.position == d.dpid) {
              ele.position = d.dpname;
            }
          });

          //------------
          if (ele["period_0"] && !ele["period_1"]) {
            ele.type = "+";
          }
          if (!ele["period_0"] && ele["period_1"]) {
            ele.type = "-";
          }
        });

        this.compareData = res.data;

        this.exportcompexcel(res.data);
        this.dialogCompDataVisible = true;
      });
    },

    importexcel() {
      if (!this.checkTableData()) {
        return;
      }

      $("#inexc").click();
    },

    histfromChange() {
      this.compform.histto = this.compform.histfrom;
    },
    histtoChange() {
      if (parseInt(this.histto) < parseInt(this.histfrom)) {
        this.$message.error("开始日期大于结束日期，系统自动校正日期！");
        this.compform.histfrom = this.compform.histto;
      }
    },

    checkTableData() {
      console.log(this.tableData.length);
      if (this.tableData.length <= 0) {
        this.$message({
          type: "error",
          message: "没有数据在列表中，如果有权限，请先通过点击查询按钮来确定！",
          duration: 4000,
        });
        return false;
      }
      return true;
    },

    exportClick() {
      if (!this.checkTableData()) {
        return;
      }

      this.dialogFormImpVisible = true;
      this.disimpbtn = false;

      this.getPrhistPeriod();
    },

    getPrhistPeriod() {
      if (this.prhistPeriodData.length == 0) {
        this.$nextTick(() => {
          AX("post", `prhist/getperiod/${this.prinfo.prcalgrp}`).then((res) => {
            if (res) {
              this.prhistPeriodData = res.data;
            }
          });
        });
      }
    },

    /**
     *
     * @param {*} curr
     * 0:是导出一个导入模版
     * 1：是导出当前
     * 2：导出历史
     */

    exportexcel(curr = 1) {
      this.disimpbtn = true;
      const date = new Date();
      const timestamp = date.getTime();
      const calfrom = this.histfrom;
      const calto = this.histto;

      if ((!calfrom || !calto) && curr == 2) {
        this.$message({
          type: "error",
          message: "✘历史导出需要选择日期区间！",
          duration: 4000,
        });
        return;
      }

      let url = `prstaff/exportpr/${this.prinfo.prcalgrp}`;
      let xlsname = `exportXLS_${timestamp}.xlsx`;

      //2
      if (curr == 2) {
        url = `prstaff/exporthistpr/${this.prinfo.prcalgrp}`;
        url += `?calfrom=${calfrom}&calto=${calto}`;
        xlsname = `exportXLS_${calfrom}_${calto}_${timestamp}.xlsx`;
      }

      AX("get", url).then((res) => {
        if (res) {
          //0的前提是先把参数为1的导出来，然后再过滤项目和数据。
          //项目为只能导入的，其实就是手工类型的，数据可以保留，也可全部清零
          // console.log("---------", this.pritems_ids_0);
          let wsname = "export page 1st";
          if (curr == 0) {
            res.data.forEach((el) => {
              Object.keys(el).forEach((k) => {
                if (!this.pritems_ids_0.includes(k)) {
                  //保留EMID,CNAME
                  if (!["emid", "cname"].includes(k.toLowerCase().trim())) {
                    delete el[k];
                  }
                }
              });
            });
            wsname = "export pr template page 1st";
          }

          let WorkSheet = XLSX.utils.json_to_sheet(res.data);
          let WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(WorkBook, WorkSheet, wsname);
          XLSX.writeFile(WorkBook, `${xlsname}`);
          this.dialogFormImpVisible = false;
        }
      });

      // console.log(XLSX.utils, WorkSheet);
    },
    exportcompexcel(data) {
      this.disimpbtn = true;
      const date = new Date();
      const timestamp = date.getTime();

      let xlsname = `exportXLScomp_${timestamp}.xlsx`;

      let WorkSheet = XLSX.utils.json_to_sheet(data);
      let WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(
        WorkBook,
        WorkSheet,
        "specic export page 1st"
      );
      XLSX.writeFile(WorkBook, `${xlsname}`);
    },
    fileonchange(file) {
      const MAX_FILE_SIZE = 4 * 1024 * 1024;
      this.error = true;

      const jsonData1 = [];
      // 2.如果没有选中文件则取消
      if (!file.target.files) {
        return;
      }
      //3.获得选择的文件对象
      var f = file.target.files[0];

      if (f.size > MAX_FILE_SIZE) {
        this.$message.error("文件限制限制为4M内,改文件打过4M.");
        return;
      }

      //4.初始化新的文件读取对象，浏览器自带，不用导入
      var reader = new FileReader();
      //5.绑定FileReader对象读取文件对象时的触发方法
      reader.onload = (e) => {
        //7.获取文件二进制数据流
        let data = e.currentTarget.result;
        //8.利用XLSX解析二进制文件为xlsx对象
        const workbook = XLSX.read(data, { type: "binary", codepage: 65001 });
        //9.利用XLSX把wb第一个sheet转换成JSON对象
        //wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
        const sheetName = workbook.SheetNames[0];
        //wb.Sheets[Sheet名]获取第一个Sheet的数据
        const sheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(sheet);
        //----------------------------
        // console.log("excel", sheetName);
        //10.在终端输出查看结果
        // console.log(jsonData);
        //----------------

        // console.log(pritems_ids_0);
        //这里整理数据，把没有emid的所有值删除。

        let ishas = false;
        jsonData.map((item) => {
          if (item.emid && item.emid + "".trim().length > 0) {
            const obj = {};

            Object.keys(item).forEach((k) => {
              // console.log(pritems_ids_0, k, pritems_ids_0.includes(k));
              if (pritems_ids_0.includes(k)) {
                for (let el of this.pritemData) {
                  if (el.prname == k) {
                    obj[el.prid] = chkMoney(item[k]) ? item[k] : 0;
                    ishas = true;
                    break;
                  }
                }
              }
            });

            if (ishas) {
              obj.emid = item.emid;
              jsonData1.push(obj);
            }
          }
        });

        // console.log(jsonData, jsonData1);
        //-------------------------------------------
        if (jsonData1.length > 0) {
          this.error = false;
        }
        // console.log("errorroror", this.error);
        if (this.error) {
          this.$message({
            type: "error",
            message: `✘ 导入文件中必须包含 [emid,${pritems_ids_0.join(
              ","
            )} ] 之一 !，并且不能为空！`,
            duration: 4000,
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
              AX("post", "prstaff/importpr", jsonData1).then((res) => {
                if (res) {
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
      };
      //6.使用reader对象以二进制读取文件对象f，
      reader.readAsBinaryString(f);
      //必须有这句，否则第二次没法子弄。
      file.target.value = "";
    },
    cmd_tohist() {
      if (!this.checkTableData()) {
        return;
      }

      const data = {};
      data.rid = this.userstore.getUser().data[0].usrgrpid;
      data.comid = this.userstore.getUser().data[0].comid;
      data.tele = this.userstore.getUser().data[0].tele;
      data.fromdate = this.prinfo.fromdate;
      data.todate = this.prinfo.todate;
      data.period = this.prinfo.period;
      data.prcalgrp = this.prinfo.prcalgrp;

      this.$confirm(
        "此操作为过账，将把当前薪资数据转化为历史数据，并清零项目。 是否继续?",
        "重要信息",
        {
          confirmButtonText: "当前月度薪资已结清，请继续过账。",
          cancelButtonText: "容朕再思量下",
          type: "warning",
        }
      )
        .then(async () => {
          if (!this.canRun) {
            return;
          }
          this.canRun = false;

          await AX("post", "prstaff/prtohist", data).then((res) => {
            if (res) {
              setTimeout(() => {
                this.canRun = true;
              }, 5000);
              if (res.code == 200) {
                // this.getdic();

                setTimeout(() => {
                  this.canRun = true;
                  this.listMain();
                }, 2000);
              }
            } else {
              setTimeout(() => {
                this.canRun = true;
              }, 5000);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },

    funsReg(str) {
      let rid = this.userstore.getUser().data[0].usrgrpid;
      let comid = this.userstore.getUser().data[0].comid;
      rid = rid.replace(/-/g, "_");
      comid = comid.replace(/-/g, "_");
      //-----------
      let newstr = str.replace(/\bround\b/gim, "Math.round");
      newstr = newstr.replace(/\bceil\b/gim, "Math.ceil");
      newstr = newstr.replace(/\bfloor\b/gim, "Math.floor");
      newstr = newstr.replace(/\babs\b/gim, "Math.abs");
      newstr = newstr.replace(/\btrunc\b/gim, "Math.trunc");
      newstr = newstr.replace(/\b:fromdate\b/gim, `'${this.prinfo.fromdate}'`);
      newstr = newstr.replace(/\b:todate\b/gim, `'${this.prinfo.todate}'`);
      newstr = newstr.replace(
        /\b':calfromdate'\b/gim,
        `${this.prinfo.fromdate}`
      );
      newstr = newstr.replace(/\b':caltodate'\b/gim, `${this.prinfo.todate}`);
      newstr = newstr.replace(/\b':rid'\b/gim, rid);
      newstr = newstr.replace(/\b':comid'\b/gim, comid);
      return newstr;
    },

    //实施计算中只计算计算类项目，另外累计和连接项目不计算，
    //所以在计算项目中不应该包括非数字类型或者连接类型的写法。切记。
    async calulate_realtime() {
      const reg = /[sS]{1}\d{2,3}/gim;
      for (let el of this.pritemData) {
        // console.log(el.prid, el.prtype, el.sort);
        let val = 0;
        //1：这里只处理计算项目,所以在计算项目中不能直接出现日期的。比如   ":todate"
        if (el.prtype == 1) {
          //将公式通过s表示为数组
          let pts = el.prfur.match(reg);
          if (pts) {
            let furstr = el.prfur;
            furstr = this.funsReg(furstr);
            console.log("--", furstr);

            for (let it of pts) {
              val = this.form[it];
              var regex = new RegExp(`\\b${it}\\b`, "gim");
              // console.log(furstr, regex, it, this.form[it]);
              furstr = furstr.replace(regex, val);
              // console.log(el.prid, "=", furstr);
            }
            this.form[el.prid] = eval(furstr);
          }
          // console.log("i=", el.prid, el.prfur, el.prtype, el.sort);
        }
        //2这是链接项目，一般情况，链接项目都是select 开头的，比如:
        //select extract(day from age(datejoined::date,current_date))+1 as z from hrinfo;
        //也有另外一种情况，就是只有表和相应字段的，比如：
        //hrinfo.currsalry
        //前提是必须有sysid这个项目来链接到prstaff这个表里，或者prlist_1的表里。

        //1:表明 字段名_账套
        // let tabid = el.prid + "_" + el.prcalgrp;
      }
    },
    /****************************************************************
     * sysid=- 1 表示所有人
     */
    async cmd_calculate(sysid = "-1") {
      // console.log(this.tableData.length);
      if (!this.checkTableData()) {
        return;
      }

      this.loadingContent =
        "薪资数据正在玩命计算中，请主公稍加休息，耐心等待～";
      this.loadingBackground = "rgba(0, 0, 0, 0.8)";
      this.loading = true;

      //--------------------------------------listmain----------------------
      // 计算实时工资
      //------------------------------------------------------------
      // 计算实时工资，这里是直接计算链接和历史合计的，不应该再这个地方，
      //他应该再实时计算之前操作，可以称为统计数据。
      let block = {};
      block.rid = this.userstore.getUser().data[0].usrgrpid;
      block.comid = this.userstore.getUser().data[0].comid;
      block.fromdate = this.prinfo.fromdate;
      block.todate = this.prinfo.todate;
      block.period = this.prinfo.period;

      if (!block.rid || !block.comid) {
        this.$message.error("请重新登录！");
        return;
      }
      if (this.prinfo.prcalgrp) {
        this.$message.error("没有有效的薪资账套，或没有权限进行该操作！");
        return;
      }

      block = encodeURI(JSON.stringify(block));

      AX(
        "get",
        `pritem/dolinkitems/${this.prinfo.prcalgrp}?block=${block}`
      ).then((e) => {
        // console.log("-------------", e);
        //暂时停用，为了调试，正式版中必须启用
        this.listMain();
        // //
        this.loading = false;
      });
    },
    /**************************************************************** */
    async calculateforsysid() {
      this.calulate_realtime();

      // if (!this.cusRules()) {
      //   return;
      // }
      // let done = false;
      // if (this.savepritembyStaff()) {
      //   this.cmd_calculate(this.form.sysid).then(() => {
      //     done = true;
      //   });
      // }

      // return done;
    },

    cmd_batchupt() {
      if (!this.checkTableData()) {
        return;
      }
      this.dialogBatchUptVisible = true;
    },
    batchUpdate() {
      console.log(this.batchform);
      if (
        !this.batchform.pid ||
        !this.batchform.symbol ||
        !this.batchform.val
      ) {
        this.$message.error("请填写完整！");
        return;
      }

      const isnumber = /^(0|0.00|0\.\d{1,2}|\d+|\d+\.\d{1,2})$/.test(
        this.batchform.val
      );
      if (!isnumber) {
        this.$message.error("值必须是数字或者0");
        return;
      }

      this.batchform.rid = this.userstore.getUser().data[0].usrgrpid;
      this.batchform.prcalgrp = this.prinfo.prcalgrp;

      console.log(this.batchform);

      if (!this.batchform.rid || !this.batchform.prcalgrp) {
        this.$message.error("权限异常，请重新登录");
        return;
      }

      AX("post", "pritem/batch", this.batchform).then((res) => {
        if (res) {
          this.dialogBatchUptVisible = false;
          this.listMain();
        }
      });
    },

    pritemChange(val) {
      //实时计算的前提是不能列数据。
      //  this.cmd_calculate(this.form.sysid)
      if (chkMoney(val)) {
        this.calulate_realtime();
      }
    },

    init_familyform() {
      this.neworedit = true;
      const keyitems = ["sysid", "createdat", "updatedat", "deletedat"];

      for (let item in this.familyform) {
        if (keyitems.includes(item.toString().toLowerCase()) == false) {
          //   console.log('-1', item);
          this.familyform[item] = "";
        }
      }
    },

    changeToplus_family() {
      this.init_familyform();
    },

    check() {
      this.deptChecked.splice("0", this.deptChecked.length);
      this.deptChecked = this.$refs.deptTree.getCheckedNodes();
    },

    newdeptnodeclick(data) {
      console.log(data);
      if (data.is_pos == 1) {
        this.deptVisible = false;
        this.form.dpname = data.dpname;
        this.form.dept = data.fid;
        this.form.position = data.dpid;
      }
    },
    test() {
      console.log("deptvisible:", this.deptVisible);
      this.deptVisible = !this.deptVisible;
    },
    handleDelete(idx, row, if_stop) {
      let if_stop_mesg = "停发";
      if (if_stop == "0") {
        if_stop_mesg = "发放";
      }

      this.$confirm(
        "此操作将" + if_stop_mesg + "该人当月的薪资, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          AX("patch", "prinfo/" + row.id, { if_stop: if_stop }).then((res) => {
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

    saveForm() {
      let data = [];

      this.addbutdisabled = true;

      this.addvalue.forEach((ele) => {
        data.push({ sysid: ele, calgrp: this.prinfo.prcalgrp });
      });

      if (data.length > 11) {
        this.$message({
          type: "error",
          message: "一次最多只能保存10条数据！",
        });
        this.loading = false;
        return false;
      }
      AX("post", "prstaff/addnewstaff", data).then((res) => {
        if (res) {
          this.dialogAddVisible = false;
          this.addvalue = [];
          this.listMain();
          this.addbutdisabled = false;
        }
      });
    },

    async savepritembyStaff() {
      let done = false;

      let updateitem = {};
      updateitem.id = this.form.id;
      updateitem.remark = this.form.remark;

      for (let item of this.pritemData) {
        //是链接类型的话，不需要判断，因为链接类型有字符，或者为空的情况
        //这里只能不等于2，因为计算和累计虽然也改变不了，但是他们是需要保存的。
        if (item.prtype == "2") {
          continue;
        }
        if (this.form[item.prid] == "") {
          this.form[item.prid] = 0.0;
        }
        if (!chkMoney(this.form[item.prid])) {
          this.$message.error(
            `薪资项目代码为: ${item.prid} 的录入类型必须是数字，或为0 ！`
          );
          return done;
        }

        updateitem[item.prid] = this.form[item.prid];
      }

      AX("patch", "prstaff/" + this.form.id, updateitehiPrintPluginm).then(
        () => {
          done = true;
          this.listMain();
          this.dialogFormVisible = false;
        }
      );
      return done;
    },

    savepritemvalForm() {
      this.savepritembyStaff();
    },

    formatisstop(row) {
      return row.is_stop == 0 ? "No" : "STOP";
    },
    handleNew() {
      this.neworedit = true;
      this.dialogAddVisible = true;
      this.hrnewData = [];
      this.loading = true;

      const rid = this.userstore.getUser().data[0].usrgrpid;

      AX("get", `prstaff/hrnewstaff/${rid}`)
        .then((res) => {
          // console.log(res);
          if (res && res.data.length > 0) {
            res.data.forEach((ele) => {
              let hr = {};
              hr.key = ele.sysid;
              hr.label = ele.cname;
              this.hrnewData.push(hr);
            });
          }
          this.loading = false;
        })
        .catch((e) => console.log(e.message));
    },

    handleEdit(index, row) {
      //  this.getdic();
      this.neworedit = false;

      console.log(row);

      //非常非常重要，在有自定义dom下，又是弹出框下进行操作这些dom，利用form是不能自动读取内容的
      //这里目前用jquery的方法非常好用。
      //更新form，如果有弹出框的情况下，必须更新。

      this.form = Object.assign({}, row);

      this.dialogFormVisible = true;

      //——————————————————————————————————————————————————————————————————————
      //数字或者boolean 其实都是数字，ui中的任意内容都是字符，所以需要转化
      // this.form.sex = this.form.sex.toString();//数据字段是数字 smallint
      // this.form.if_proba = this.form.if_proba.toString();//数据字段是真假boolean
      //——————————————————————————————————————————————————————————————————————

      // this.hrcheckedshow.splice(0, this.hrcheckedshow.length);

      // this.hrcheckedshow = this.form.hrchecked.split(',')

      // console.log(this.form.hrcheckedshow)

      // let c = 0;
      // let dpname = '';
      // for (let element of this.dpList) {

      //     if (c < 2) {
      //         if (element.dpid == row.dept) {
      //             dpname += element.dpname;
      //             c++;
      //         }
      //         if (element.dpid == row.position) {
      //             dpname += element.dpname;
      //             c++;
      //         }
      //     } else {
      //         this.form.dpname = dpname;
      //         break;
      //     }
      // }
    },

    changePage(idx) {
      //  console.log(idx)
      this.page.cpg = idx;

      this.listMain();
    },

    getdic(type = "hr") {
      this.loading = true;
      this.optsData.push(...opeartorSymbol);

      this.prinfo.period = this.userstore.getperiod().period;
      this.prinfo.fromdate = this.userstore.getperiod().sdate;
      this.prinfo.todate = this.userstore.getperiod().edate;
      this.prhistPeriodData = [];

      if (type == "hr") {
        this.dichrgradeData = this.dicstore.getDic("hrgrade");
        // AX("get", "/dicm/hrgrade")
        //   .then((res) => {
        //     this.dichrgradeData = res.data;
        //     // console.log(res.data)
        //     //this.showdesc(res.data, 'hrgrade_13', 'itemid', 'itemname')
        //     // console.log(res.data.dicDescs('hrgrade_13'));
        //   })
        //   .catch((e) => console.log(e.message));
        this.dichrtypeData = this.dicstore.getDic("hrtype");
        // AX("get", "/dicm/hrtype")
        //   .then((res) => {
        //     this.dichrtypeData = res.data;
        //   })
        //   .catch((e) => console.log(e.message));
        this.dichrstatusData = this.dicstore.getDic("hrstatus");

        this.diccusrepData = this.dicstore.getDic("cusrep");

        this.diccusrepData = this.diccusrepData.filter((el) => {
          if (el.type == "pr") {
            return el;
          }
        });

        // AX("get", "/dicm/hrstatus")

        //   .then((res) => {
        //     this.dichrstatusData = res.data;
        //   })
        //   .catch((e) => console.log(e.message));
        this.deptData = this.deptstore.deptData.data;
        this.dpData = this.deptstore.deptposData.data;
        this.flattenTree(this.dpData);

        this.dichrpropsData = this.dicstore.getDic("hrporps");
        // AX("get", "/dicm/hrprops")
        //   .then((res) => {
        //     this.dichrpropsData = res.data;
        //   })
        //   .catch((e) => console.log(e.message));

        // AX("post", "/pritemlst", { prcalgrp: this.prinfo.prcalgrp })
        //   .then((res) => {
        //     this.pritemData = res.data;
        //   })
        //   .catch((e) => console.log(e.message));

        // AX("get", "/getprperiod")
        //   .then((res) => {
        //     this.prinfo = res.data;
        //   })
        //   .catch((e) => console.log(e.message));
        this.dicpraccountgrp = this.dicstore.getDic("pritemgcalgrp");
        this.dicpraccountgrp = this.rightstore.getRightStore(
          "pritemgcalgrp",
          true
        );

        console.log("----------------", this.dicpraccountgrp);
        this.prinfo.prcalgrp = this.dicpraccountgrp[0].itemid;
        // AX("get", "/dicm/pritemgcalgrp")
        //   .then((res) => {
        //     this.dicpraccountgrp = res.data;
        //     this.prinfo.prcalgrp = res.data[0].itemid;
        //   })
        //   .catch((e) => console.log(e.message));
      }

      this.loading = false;
    },

    async tree(data, val, id, descs) {
      if (!val) {
        return;
      }
      let r = "";
      for (let item of data) {
        console.log("tree:", val, item[id]);
        if (val != item[id]) {
          if (item.children) {
            await this.tree(item.children, val, id, descs);
          }
        } else {
          // console.log('find.......................' + item[descs])
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
        node.is_pos = item.deptlevel;

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
          dpobj.dpid = item.dpid;
          this.dplimit.push(dpobj);
        });

        this.dialogMSVisible = true;
      }
    },

    moreSearch(data) {
      //console.log(data;
      this.loading = true;

      let block = encodeURI(JSON.stringify(data));

      // console.log('blockencodeURI', block.length)

      AX(
        "get",
        "/hrinfo/" +
          this.page.limit +
          "/" +
          this.page.cpg +
          "/" +
          block +
          "/" +
          this.inputsearch
      ).then((res) => {
        this.tableData = res.data.rows;
        this.counts = res.data.count;

        this.tableData.forEach((item) => {
          item.birthshow = moment(item.birth).format("MM-DD");
        });

        this.loading = false;
      });
    },

    async listMain() {
      //  console.log('33333333333333')
      let block = {};
      this.pritemData.splice(0, this.pritemData.length);
      this.pritemDataShow.splice(0, this.pritemDataShow.length);

      //  let api = ''
      if (this.deptChecked.length < 1) {
        this.$message.error("请选择需要查询的部门！");
        return;
      }
      if (!this.prinfo.prcalgrp) {
        this.$message.error("请选择薪资帐套！");
        return;
      }
      block.accgrp = this.prinfo.prcalgrp;
      block.rid = this.userstore.getUser().data[0].usrgrpid;
      await AX(
        "get",
        `pritem/find?page=1&pagesize=400&block=${encodeURI(
          JSON.stringify(block)
        )}`
      )
        .then((res) => {
          this.pritemData = res.data;

          //--获取pritems的字段，判断是否有该数据，如果没有就不更新。
          //就是检查数据的完整性

          if (
            this.pritems_ids_0.length == 0 ||
            this.pritems_ids_not0.length == 0
          ) {
            this.pritemData.map((el) => {
              if (el.prtype == "0") {
                this.pritems_ids_0.push(el.prname);
              } else {
                this.pritems_ids_not0.push(el.prname);
              }
            });
          }

          if (this.pritemData0.length == 0) {
            this.pritemData.forEach((el) => {
              if (el.is_show == 1) {
                this.pritemDataShow.push(el);
              }
              if (el.prtype == "0") {
                this.pritemData0.push(el);
              }
            });
          }
        })
        .catch((e) => console.log(e.message));
      // console.log(this.deptChecked)
      this.loadingContent = "拼命加载中";
      this.loadingBackground = "rgba(0, 0, 0, 0.8)";
      this.loading = true;

      let depts = [];

      this.deptChecked.forEach((item) => {
        let dpobj = {};
        dpobj.dpid = item.dpid;
        depts.push(dpobj);
      });

      block.dept = depts;
      block.prcalgrp = this.prinfo.prcalgrp;
      block.prstop = this.prtype;
      block.name = this.inputsearch;

      //console.log('block', JSON.stringify(block))
      block = encodeURI(JSON.stringify(block));

      // console.log('blockencodeURI', block.length)

      this.tableData = [];

      AX(
        "get",
        "prstaff?page=" +
          this.page.cpg +
          "&pagesize=" +
          this.page.limit +
          "&block=" +
          block
      ).then((res) => {
        // console.log(res);
        this.tableData = this.tableData.splice(0, this.tableData.length);
        if (res && res.total > 0) {
          //   console.log(res);
          this.tableData = res.data;
          this.page.counts = parseInt(res.total);

          //   //非常非常重要，在有自定义dom下，又是弹出框下进行操作这些dom，利用form是不能自动读取内容的
          //   //这里目前用jquery的方法非常好用。
          //   if (this.form.sysid) {
          //     //更新form，如果有弹出框的情况下，必须更新。
          //     for (let item of this.tableData) {
          //       if (item.sysid == this.form.sysid) {
          //         for (let i in item) {
          //           this.form[i] = item[i];
          //           // console.log(i)
          //         }
          //         break;
          //       }
          //     }
          //   }
        }
        //=========================================================================

        this.loading = false;
      });
    },
  },
};
</script>
<style scoped>
.example-showcase .el-dropdown + .el-dropdown {
  margin-left: 15px;
}
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}

.eltransfer >>> .el-transfer-panel__item {
  font-size: 12px;
}
.transfer {
  color: red;
  text-align: left;
  font-size: 9px;
}
.el-form-item {
  margin-bottom: 10px;
}
.input-with-select {
  width: 360px;
  margin-left: 4px;
}
.ispos {
  padding: 2px 6px;
  cursor: pointer;
  font-size: 14px;
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

.companyflag {
  margin-left: 1px;
  color: #ebb563;
  font-weight: normal;
  font-size: 14px;
}
.ispos {
  padding: 2px 6px;
  cursor: pointer;
  font-size: 12px;
  background-color: #3186f5;
  color: rgb(255, 255, 255);

  border-radius: 5px;
}
</style>
