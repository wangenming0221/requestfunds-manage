<template>
  <div class="office">
    <div class="ol-top">
      <div class="ol-t-l">
        <div class="ol-t-icon"></div>
        <div class="ol-t-l-text">{{ leftTitle }}</div>
      </div>
    </div>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabClick">
      <el-tab-pane style="padding: 15px" v-for="(item, index) in tabCardOptions" :key="index" :label="item.label" :name="item.name">
        <span slot="label">
          <el-badge :value="item.total" :hidden="item.total === 0" class="item" style="z-index: 50">
            <span>{{ item.label }}</span>
          </el-badge>
        </span>
        <div class="o-list">
          <div class="ol-list">
            <div v-if="appCode === 'RequestPayoutManagement'">
              <!-- 请款管理 -->
              <el-form :model="form" v-show="showSearch"  ref="form" label-width="100px" @submit.prevent.native>
                <el-row type="flex" justify="end" style="margin-bottom: 20px">
                  <el-col :span="2" style="text-align: right">
                    <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
                  </el-col>
                  <el-col :span="2" style="text-align: right">
                    <el-button icon="el-icon-refresh" @click="resetQuery('form')">重置</el-button>
                  </el-col>
                  <el-col :span="2" style="text-align: right">
                    <el-button icon="el-icon-back" @click="onBack">返回</el-button>
                  </el-col>
                </el-row>
                <el-row :gutter="14">
                  <el-col :span="5">
                    <el-form-item label="分公司" prop="branchOffice">
                      <el-input v-model="form.branchOffice"  placeholder="请输入分公司" clearable @keyup.enter.native="handleQuery"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item label="项目名称" prop="projectName">
                      <el-autocomplete
                        @keyup.enter.native="handleQuery"
                        clearable
                        v-model="form.projectName"
                        :fetch-suggestions="querySearchAsyncProjectName"
                        placeholder="请输入项目名称"
                        @clear="form.projectName = undefined"
                      ></el-autocomplete>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item label="项目编码" prop="projectCode">
                      <el-autocomplete
                        @keyup.enter.native="handleQuery"
                        clearable
                        v-model="form.projectCode"
                        :fetch-suggestions="querySearchAsyncProjectCode"
                        placeholder="请输入项目编码"
                        @clear="form.projectCode = undefined"
                      ></el-autocomplete>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item label="乙方公司" prop="companyName">
                      <el-autocomplete
                        @keyup.enter.native="handleQuery"
                        clearable
                        v-model="form.companyName"
                        :fetch-suggestions="querySearchAsyncCompanyName"
                        placeholder="请输入乙方公司"
                        @clear="form.companyName = undefined"
                      ></el-autocomplete>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="合同分类" prop="cascaderData">
                      <el-cascader
                          style="width: 97%"
                          v-model="form.cascaderData"
                          clearable
                          :props="{value: 'classifyCode', label: 'title'}"
                          :options="treeData"
                          @change="handleCascaderContractClassify"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item label="合同名称" prop="contractName">
                      <el-autocomplete
                          @keyup.enter.native="handleQuery"
                          clearable
                          v-model="form.contractName"
                          :fetch-suggestions="querySearchAsyncContractName"
                          placeholder="请输入合同名称"
                          @clear="form.contractName = undefined"
                      ></el-autocomplete>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item label="合同编码" prop="contractCode">
                      <el-autocomplete
                          @keyup.enter.native="handleQuery"
                          clearable
                          v-model="form.contractCode"
                          :fetch-suggestions="querySearchAsyncContractCode"
                          placeholder="请输入合同编码"
                          @clear="form.contractCode = undefined"
                      ></el-autocomplete>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item label="发起人角色" prop="roleCode">
                      <el-select v-model="form.roleCode" placeholder="请选择发起人角色" clearable >
                        <el-option v-for="item in roleList" :key="item.title"
                                   :label="item.name"
                                   :value="item.id"
                                   :disabled="item.disabled">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item label="发起人姓名" prop="userName">
                      <el-input  v-model="form.userName"  placeholder="请输入发起人姓名" clearable @keyup.enter.native="handleQuery" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="流程名称" prop="workFlowName">
                      <el-input  v-model="form.workFlowName"  placeholder="请输入流程名称" clearable @keyup.enter.native="handleQuery" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item label="发起人手机号" prop="loginUser">
                      <el-input  v-model="form.loginUser"  placeholder="请输入发起人手机号" clearable @keyup.enter.native="handleQuery" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item label="请款类别" prop="loginUser">
                      <el-cascader
                          v-model="form.busId"
                          clearable
                          filterable
                          placeholder="请选择请款类别"
                          :options="requestPayTypeOptions"
                          :props="{ label: 'title', value: 'id', children: 'children' }"
                          @change="handleRequestPayChange"></el-cascader>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <div v-else-if="appCode === 'AllAppCode'">
              <!-- 全部待办 -->
              <el-form ref="form" v-show="showSearch" :model="form" class="demo-form-inline" label-width="100px">
                <el-row type="flex" justify="end" style="margin-bottom: 20px">
                  <el-col :span="2" style="text-align: right">
                    <el-button type="primary" icon="el-icon-search" @click="onQuery">查询</el-button>
                  </el-col>
                  <el-col :span="2" style="text-align: right">
                    <el-button icon="el-icon-refresh" @click="onReset('form')">重置</el-button>
                  </el-col>
                  <el-col :span="2" style="text-align: right">
                    <el-button icon="el-icon-back" @click="onBack">返回</el-button>
                  </el-col>
                </el-row>
                <el-row :gutter="14">
                  <el-col :span="5">
                    <el-form-item label="流程名称" prop="projectName">
                      <el-input  v-model="form.workflowName"  placeholder="请输入流程名称" clearable @keyup.enter.native="handleQuery" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item label="发起人" prop="workFlowName">
                      <el-input  v-model="form.originator"  placeholder="请输入发起人" clearable @keyup.enter.native="handleQuery" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item label="发起时间" prop="classifyCode">
                      <el-date-picker
                        style="width: 230px"
                        v-model="form.timeRange"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <div v-else>
              <!-- 其他 -->
              <el-form ref="form" v-show="showSearch" :model="form" class="demo-form-inline" label-width="70px">
                <el-row type="flex" justify="end"  style="margin-bottom: 20px">
                  <el-col :span="2" style="text-align: right">
                    <el-button type="primary" icon="el-icon-search" @click="onQuery">查询</el-button>
                  </el-col>
                  <el-col :span="2" style="text-align: right">
                    <el-button icon="el-icon-refresh" @click="onReset('form')">重置</el-button>
                  </el-col>
                  <el-col :span="2" style="text-align: right">
                    <el-button icon="el-icon-back" @click="onBack">返回</el-button>
                  </el-col>
                </el-row>
                <el-row :gutter="14">
                  <el-col :span="5">
                    <el-form-item label="所属项目" prop="projectName">
                      <!--                      <el-select v-model="form.projectName" placeholder="请选择所属项目">-->
                      <!--                        <el-option v-for="(item, index) in tableData" :key="index" :label="item.projectName" :value="item.projectName"></el-option>-->
                      <!--                      </el-select>-->
                      <el-autocomplete
                        @keyup.enter.native="handleQuery"
                        clearable
                        v-model="form.projectName"
                        :fetch-suggestions="querySearchAsyncProjectName"
                        placeholder="请选择所属项目"
                        @clear="form.projectName = undefined"
                      ></el-autocomplete>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item label="乙方公司" prop="pName">
                      <el-autocomplete
                        @keyup.enter.native="handleQuery"
                        clearable
                        v-model="form.companyName"
                        :fetch-suggestions="querySearchAsyncCompanyName"
                        placeholder="请输入乙方公司"
                        @clear="form.companyName = undefined"
                      ></el-autocomplete>
                      <!--                      <el-input v-model="form.pName" placeholder="请输入乙方公司"></el-input>-->
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item label="流程名称" prop="workFlowName">
                      <el-input  v-model="form.workFlowName"  placeholder="请输入流程名称" clearable @keyup.enter.native="handleQuery"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item label="合同分类" prop="classifyCode">
                      <el-select v-model="form.classifyCode" clearable filterable placeholder="请选择合同分类">
                        <el-option v-for="(item, index) in treeData" :key="index" :label="item.title" :value="item.classifyCode"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="合同编号" prop="contractCode">
                      <!--                      <el-select v-model="form.contractCode" placeholder="请选择合同编号">-->
                      <!--                        <el-option v-for="(item, index) in tableData" :key="index" :label="item.contractCode" :value="item.contractCode"></el-option>-->
                      <!--                      </el-select>-->
                      <el-autocomplete
                          @keyup.enter.native="handleQuery"
                          clearable
                          v-model="form.contractCode"
                          :fetch-suggestions="querySearchAsyncContractCode"
                          placeholder="请选择合同编号"
                          @clear="form.contractCode = undefined"
                      ></el-autocomplete>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item label="创建人" prop="promoter">
                      <el-input v-model="form.promoter" placeholder="请输入创建人"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item label="合同名称" prop="contractName">
                      <!--                      <el-select v-model="form.contractName" placeholder="请选择合同名称">-->
                      <!--                        <el-option v-for="(item, index) in tableData" :key="index" :label="item.contractName" :value="item.contractName"></el-option>-->
                      <!--                      </el-select>-->
                      <el-autocomplete
                          @keyup.enter.native="handleQuery"
                          clearable
                          v-model="form.contractName"
                          :fetch-suggestions="querySearchAsyncContractName"
                          placeholder="请输入合同名称"
                          @clear="form.contractName = undefined"
                      ></el-autocomplete>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item label="添加日期">
                      <el-date-picker
                          style="width: 230px"
                          v-model="form.timeRange"
                          type="datetimerange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <!-- 数据表 -->
            <!-- 合同管理 -->
            <div v-if="appCode === 'ContractManagemet'">
              <el-row :gutter="10" class="mb8">
                <right-toolbar :showSearch.sync="showSearch"></right-toolbar>
              </el-row>
              <el-table
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column
                  fixed="left"
                  prop="workflowName"
                  label="全流程名称"
                  align="center"
                  width="180">
                </el-table-column>
                <el-table-column
                  fixed="left"
                  prop="stayTime"
                  label="停留时间"
                  align="center"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="contractName"
                  label="合同名称"
                  align="center"
                  width="500">
                </el-table-column>
                <el-table-column
                  prop="contractCode"
                  align="center"
                  label="合同编号"
                  width="500">
                </el-table-column>
                <el-table-column
                  prop="cname"
                  align="center"
                  label="合同分类">
                </el-table-column>
                <el-table-column
                  prop="projectName"
                  align="center"
                  label="所属项目"
                  width="500">
                </el-table-column>
                <el-table-column
                  prop="promoter"
                  align="center"
                  label="创建人">
                </el-table-column>
                <el-table-column
                  prop="createtime"
                  align="center"
                  label="添加时间"
                  width="200">
                </el-table-column>
                <el-table-column
                  prop="activityName"
                  align="center"
                  label="当前节点"
                  width="200">
                </el-table-column>
<!--                <el-table-column-->
<!--                  prop="approvalStatus"-->
<!--                  align="center"-->
<!--                  label="处理状态">-->
<!--                  <template slot-scope="scope">-->
<!--                    <span v-if="scope.row.approvalStatus ==='DRAFT'">草稿</span>-->
<!--                    <span v-if="scope.row.approvalStatus ==='PROCESSING'">进行中</span>-->
<!--                    <span v-if="scope.row.approvalStatus ==='COMPLETED'">已完成</span>-->
<!--                    <span v-if="scope.row.approvalStatus ==='CANCELED'">作废</span>-->
<!--                    <span v-if="scope.row.approvalStatus ==='CANCELLED'">作废</span>-->
<!--                  </template>-->
<!--                </el-table-column>-->
                <el-table-column
                  prop="address"
                  align="center"
                  fixed="right"
                  label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" @click="checkDetails(scope.row)">查看详情</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div style="display: flex;flex-direction: row-reverse;padding-top: 15px">
                <el-pagination
                  background
                  layout="prev, pager, next"
                  @current-change="changePage"
                  :total="total">
                </el-pagination>
              </div>
            </div>
            <!-- 请款管理 -->
            <div v-else-if="appCode === 'RequestPayoutManagement'">
              <el-row :gutter="10" class="mb8">
                <right-toolbar :showSearch.sync="showSearch"></right-toolbar>
              </el-row>
              <el-table class="need-table" border :data="tableData" max-height="450" >
                <el-table-column prop="workFlowName" label="流程名称" width="400" fixed align="center">
                  <template slot-scope="scope">
                    <span style="cursor: pointer">{{scope.row.workFlowName}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="stayTime" label="停留时间" width="400" fixed align="center">
                  <template slot-scope="scope">
                    <span style="cursor: pointer">{{scope.row.stayTime}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="busName" label="请款类型" align="center" width="300">
                  <template slot-scope="scope">
                    <span style="cursor: pointer">{{scope.row.busName}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="contractCode" label="合同编码" align="center" width="400">
                  <template slot-scope="scope">
                    <span style="cursor: pointer">{{scope.row.contractCode}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="contractName" label="合同名称" align="center" width="400"></el-table-column>
                <el-table-column prop="createTime" label="申请时间" align="center" width="200"></el-table-column>
                <el-table-column prop="approvalStatus" label="审批状态" align="center" width="100">
                  <template slot-scope="scope">
                    <span v-if="scope.row.approvalStatus=='DRAFT'">草稿</span>
                    <span v-if="scope.row.approvalStatus=='PROCESSING'">进行中</span>
                    <span v-if="scope.row.approvalStatus=='COMPLETED'">已完成</span>
                    <span v-if="scope.row.approvalStatus=='CANCELED'">作废</span>
                    <span v-if="scope.row.approvalStatus=='CANCELLED'">作废</span>
                  </template>
                </el-table-column>
                <el-table-column prop="branchOffice" label="分公司" width="200"  align="center"></el-table-column>
                <el-table-column prop="projectName" label="项目名称" width="400"  align="center"></el-table-column>
                <el-table-column prop="projectCode" label="项目编码" width="300"  align="center"></el-table-column>
                <el-table-column prop="userName" label="发起人姓名" width="100"  align="center"></el-table-column>
                <el-table-column prop="loginUser" label="发起人手机号" width="200"  align="center"></el-table-column>
                <el-table-column prop="approvalMoney" label="申请金额" align="center" width="100" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="actualMoney" label="实付金额" align="center" width="100" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column
                  prop="address"
                  align="center"
                  fixed="right"
                  label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" @click="checkDetails(scope.row)">查看详情</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div style="display: flex;flex-direction: row-reverse;padding-top: 15px">
                <el-pagination
                  background
                  layout="prev, pager, next"
                  @current-change="changePage"
                  :total="total">
                </el-pagination>
              </div>
            </div>
            <!-- 其他 -->
            <div v-else>
              <el-row :gutter="10" class="mb8">
                <right-toolbar :showSearch.sync="showSearch"></right-toolbar>
              </el-row>
              <el-table
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column
                  fixed="left"
                  prop="instanceName"
                  label="流程名称"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="activityName"
                  label="当前节点"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="originatorName"
                  label="发起人"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="startTime"
                  align="center"
                  label="发起时间">
                </el-table-column>
                <el-table-column
                  prop="address"
                  align="center"
                  fixed="right"
                  label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" @click="checkDetails(scope.row)">查看详情</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div style="display: flex;flex-direction: row-reverse;padding-top: 15px">
                <el-pagination
                  background
                  layout="prev, pager, next"
                  @current-change="changePage"
                  :total="total">
                </el-pagination>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import api from '@/api/work/cooperative'
import { request } from '@/api/work'
import { dateToSecond } from '@/utils/uidate.js'
import { accountmanagedic } from "@/utils/dictionary"
// 下拉树
import Treeselect from "@riophae/vue-treeselect"
import "@riophae/vue-treeselect/dist/vue-treeselect.css"
export default {
  name: "Wait",
  props: {
    appCode: {
      type: String,
      default: ''
    },
    waitCounts: {
      type: Number
    }
  },
  components: {
    Treeselect
  },
  data() {
    return {
      showSearch: true,
      activeName: 'wait',
      activeTitle: '我的待办',
      tabCardOptions: [
        { label: '我的待办', name: 'wait', total: 0 },
        { label: '我的已办', name: 'done', total: 0 },
        { label: '我的待阅', name: 'waitRead', total: 0 },
        { label: '我的已阅', name: 'doneRead', total: 0 },
        { label: '我的流程', name: 'workFlow', total: 0 }
      ],
      waitCount: {
        all: 0,
        project: 0,
        contract: 0,
        requestFunds: 0,
        pay: 0,
        fee: 0
      },
      selectedItem: 0,
      tableData: [],
      total: 0,
      // 查询参数
      form: {
        projectName: null,
        pName: null,
        workFlowName: null,
        workflowName: null,
        classifyCode: null,
        contractCode: null,
        contractName: null,
        promoter: null,
        params:{beginTime:undefined,endTime:undefined},
        appCode: 'AllAppCode',
        current: 1,
        size: 10,
        branchOffice: null,
        projectCode: null,
        companyName: null,
        cascaderData: [],
        roleCode: null,
        userName: null,
        loginUser: null,
        payStatus: null,
        timeRange: [],
        busId: null,
        originator: null
      },
      workflowName: [],
      formTime: {
        addTime: null,
      },
      roleList: accountmanagedic.roleList,
      treeData: [],
      // tab项
      tabOptions: [],
      leftTitle: '全部待办',
      // 请款类别
      requestPayTypeOptions: [],
      rTypeForm: {
        name: null,
        enableStatus: 0
      }
    }
  },
  mounted() {
    this.form.appCode = this.appCode
    this.whichTitle(this.appCode)
    this.init()
    this.getTree()
    this.getRequestBusinessDicTree()
  },
  methods: {
    init() {
      this.getMyAgentFromBpm()
      this.getMyDoneFromBpm()
      this.getMyToReadFromBpm()
      this.getMyHaveReadFromBpm()
    },
    whichTitle(code) {
      switch (code) {
        case 'AllAppCode':
          this.leftTitle = '全部待办'
          this.tabCardOptions = [
            { label: '我的全部待办', name: 'wait', total: 0 },
            { label: '我的全部已办', name: 'done', total: 0 },
            { label: '我的全部待阅', name: 'waitRead', total: 0 },
            { label: '我的全部已阅', name: 'doneRead', total: 0 },
            { label: '我的全部流程', name: 'workFlow', total: 0 }
          ]
          break
        case 'projectManegement':
          this.leftTitle = '项目管理'
          break
        case 'ContractManagemet':
          this.leftTitle = '合同管理'
          break
        case 'RequestPayoutManagement':
          this.leftTitle = '请款管理'
          break
        case 'paymentManagement':
          this.leftTitle = '付款管理'
          break
        default:
          this.leftTitle = '费用管理'
          break
      }
    },
    // 过滤节点数
    filterNode(data) {
      for (let i = 0, len = data.length; i < len; i++) {
        if (data[i].children.length === 0) {
          data[i].children = undefined
          // continue
        } else {
          this.filterNode(data[i].children)
        }
      }
      return data
    },
    handleRequestPayChange(node) {
      console.log(node)
      this.form.busId = node[node.length - 1]
    },
    getRequestBusinessDicTree() {
      api.getRequestBusinessDicTree(this.rTypeForm).then(res => {
        if (res.code === 0) {
          console.log(res)
          this.requestPayTypeOptions = this.filterNode(res.data)
          console.log(this.requestPayTypeOptions)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    normalizer(node) {
      if (node.child && !node.child.length) {
        delete node.child
      }
      return {
        id: node.id,
        label: node.subjectName,
        children: node.child
      }
    },
    handleCascaderContractClassify(item) {
      console.log(item)
      this.form.classifyCode = item[0]
    },
    getTree() {
      request.getContractTypeDic().then(res => {
        this.treeData = this.deleteChild(res.data);
        console.log(this.treeData)
      })
    },
    deleteChild(data) {
      let arr = []
      arr = data.map(value => {
        if (value.children && value.children.length) {
          let _value = {...value}
          _value.children = this.deleteChild(_value.children)
          return _value
        } else {
          if (value.children === null || value.children.length === 0) {
            delete value.children
          }
          return value
        }
      })
      return arr
    },
    // 查看详情跳BPM
    checkDetails(item) {
      // debugger
      if (this.activeName === 'wait') {
        console.log(item)
        api.setHandleBpm({ workFlowInstanceId: item.hasOwnProperty('workFlowInstanceId') ? item.workFlowInstanceId : item.instanceId }).then(res => {
          console.log(res)
          if (res.code === 0) {
            window.open(res.data)
          } else {
            this.$message({
              type: 'warning',
              message: res.msg
            })
          }
        }).catch(err => {
          console.log(err)
        })
      } else {
        window.open(item.bpmUrl)
      }
    },
    resetQuery(formName) {
      this.form.branchOffice = null
      this.form.projectName = null
      this.form.projectCode = null
      this.form.companyName = null
      this.form.cascaderData = []
      this.form.contractName = null
      this.form.contractCode = null
      this.form.roleCode = null
      this.form.userName = null
      this.form.workFlowName = null
      this.form.loginUser = null
      this.form.busId = null
      switch (this.activeName) {
        case 'wait':
          // 待办
          this.getMyAgentFromBpm()
          break
        case 'done':
          // 已办
          this.getMyDoneFromBpm()
          break
        case 'waitRead':
          // 待阅
          this.getMyToReadFromBpm()
          break
        case 'doneRead':
          // 已阅
          this.getMyHaveReadFromBpm()
          break
        default:
          // 流程
          break
      }
    },
    handleQuery() {
      this.form.current = 1
      switch (this.activeName) {
        case 'wait':
          // 待办
          this.getMyAgentFromBpm()
          break
        case 'done':
          // 已办
          this.getMyDoneFromBpm()
          break
        case 'waitRead':
          // 待阅
          this.getMyToReadFromBpm()
          break
        case 'doneRead':
          // 已阅
          this.getMyHaveReadFromBpm()
          break
        default:
          // 流程
          break
      }
    },
    querySearchAsyncProjectCode(queryString, cb) {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        request.getProjectCode({ projectCode: this.form.projectCode }).then(res => {
          const data = res.data.map(v => {
            return { 'value': v.projectCode }
          })
          cb(data)
        })
      }, 2000 * Math.random())
    },
    querySearchAsyncCompanyName(queryString, cb) {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        request.getPorCompanyList({ pName: this.form.companyName }).then(res => {
          const data = res.data.map(v => {
            return {'value': v.pname}
          })
          cb(data)
        })
      }, 2000 * Math.random())
    },
    querySearchAsyncContractName(queryString, cb) {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        request.getContractCode({ contractName: this.form.contractName, size: -1 }).then(res => {
          const data = res.data.map(v => {
            return { 'value': v.contractName }
          })
          cb(data)
        })
      }, 2000 * Math.random())
    },
    querySearchAsyncContractCode(queryString, cb) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        request.getContractCode({ contractCode: this.form.contractCode, size: -1 }).then(res => {
          const data = res.data.map(v => {
            return { 'value': v.contractCode };
          })
          cb(data)
        })
      }, 2000 * Math.random());
    },
    delUndefinedAndEmptyString(data) {
      let obj = JSON.parse(JSON.stringify(data))
      for (let key in obj) {
        if (obj[key] === '' || obj[key] === undefined) {
          delete obj[key]
        }
      }
      return obj
    },
    querySearchAsyncProjectName(queryString, cb) {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        request.getProjectCode({ projectName: this.form.projectName }).then(res => {
          const data = res.data.map(v => {
            return { 'value': v.projectName }
          })
          cb(data)
        })
      }, 2000 * Math.random())
    },

    handleTabClick(event) {
      console.log(event)
      this.activeName = event.name
      // this.getMyWorkInstanceCountFromBpm()
      switch (event.name) {
        case 'wait':
          // 待办
          this.activeTitle = '我的待办'
          this.getMyAgentFromBpm()
          break
        case 'done':
          // 已办
          this.activeTitle = '我的已办'
          this.getMyDoneFromBpm()
          break
        case 'waitRead':
          // 待阅
          this.activeTitle = '我的待阅'
          this.getMyToReadFromBpm()
          break
        case 'doneRead':
          // 已阅
          this.activeTitle = '我的已阅'
          this.getMyHaveReadFromBpm()
          break
        default:
          // 流程
          this.activeTitle = '我的流程'
          break
      }
    },
    deArray(arr) {
      return Array.from(new Set(arr))
    },
    // 获取待办详情列表
    getMyAgentFromBpm() {
      api.getMyAgentFromBpm(this.form).then(res => {
        if (res.code === 0) {
          if (this.activeTitle === '我的待办') {
            this.tableData = res.data ? res.data.records : []
            this.total = res.data.total
            this.workflowName = this.deArray(this.tableData.map(item => item.instanceName))
            console.log(this.workflowName)
          }
          this.tabCardOptions[0].total = res.data.total
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取已办详情列表
    getMyDoneFromBpm() {
      api.getMyDoneFromBpm(this.form).then(res => {
        if (res.code === 0) {
          if (this.activeTitle === '我的已办') {
            this.tableData = res.data ? res.data.records : []
            this.total = res.data.total
            this.workflowName = this.deArray(this.tableData.map(item => item.instanceName))
          }
          this.tabCardOptions[1].total = res.data.total
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取待阅详情列表
    getMyToReadFromBpm() {
      api.getMyToReadFromBpm(this.form).then(res => {
        if (res.code === 0) {
          if (this.activeTitle === '我的待阅') {
            this.tableData = res.data ? res.data.records : []
            this.total = res.data.total
            this.workflowName = this.deArray(this.tableData.map(item => item.instanceName))
          }
          this.tabCardOptions[2].total = res.data.total
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取已阅详情列表
    getMyHaveReadFromBpm() {
      api.getMyHaveReadFromBpm(this.form).then(res => {
        if (res.code === 0) {
          if (this.activeTitle === '我的已阅') {
            this.tableData = res.data ? res.data.records : []
            this.total = res.data.total
            this.workflowName = this.deArray(this.tableData.map(item => item.instanceName))
          }
          this.tabCardOptions[3].total = res.data.total
        }
      }).catch(err => {
        console.log(err)
      })
    },
    changePage(val) {
      debugger
      console.log(val)
      this.form.current = val
      switch (this.activeName) {
        case 'wait':
          // 待办
          this.getMyAgentFromBpm()
          break
        case 'done':
          // 已办
          this.getMyDoneFromBpm()
          break
        case 'waitRead':
          // 待阅
          this.getMyToReadFromBpm()
          break
        case 'doneRead':
          // 已阅
          this.getMyHaveReadFromBpm()
          break
        default:
          // 流程
          break
      }
    },
    onQuery() {
      // 格式化时间 秒
      if (this.form.timeRange.length > 0) {
        this.form.params.beginTime = dateToSecond(0, this.form.timeRange)
        this.form.params.endTime = dateToSecond(1, this.form.timeRange)
      }
      switch (this.activeName) {
        case 'wait':
          // 待办
          this.getMyAgentFromBpm()
          break
        case 'done':
          // 已办
          this.getMyDoneFromBpm()
          break
        case 'waitRead':
          // 待阅
          this.getMyToReadFromBpm()
          break
        case 'doneRead':
          // 已阅
          this.getMyHaveReadFromBpm()
          break
        default:
          // 流程
          break
      }
    },
    onReset(formName) {
      this.formTime.addTime = null
      this.form.projectName = null
      this.form.pName = null
      this.form.workFlowName = null
      this.form.classifyCode = null
      this.form.contractCode = null
      this.form.promoter = null
      this.form.contractName = null
      this.form.params.beginTime = null
      this.form.params.endTime = null
      this.form.timeRange = []
      this.form.workflowName = null
      this.form.originator = null
      switch (this.activeName) {
        case 'wait':
          // 待办
          this.getMyAgentFromBpm()
          break
        case 'done':
          // 已办
          this.getMyDoneFromBpm()
          break
        case 'waitRead':
          // 待阅
          this.getMyToReadFromBpm()
          break
        case 'doneRead':
          // 已阅
          this.getMyHaveReadFromBpm()
          break
        default:
          // 流程
          break
      }
    },
    // 返回
    onBack() {
      this.$parent.backHome()
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.el-badge__content.is-fixed{
  top: 8px !important;
}
.office{
  width: 100%;
  height: 100%;
  padding: 5px;
  /*background-color: #f2f3fa;*/
  display: flex;
  flex-direction: column;
  .ol-top{
    display: flex;
    justify-content: space-between;
    .ol-t-l{
      display: flex;
      flex-direction: row;
      margin-bottom: 10px;
      .ol-t-icon{
        width: 5px;
        height: 20px;
        background-color: #4758e7;
        margin-top: 5px;
        margin-right: 10px;
      }
      .ol-t-l-text{
        font-size: 20px;
        font-weight: bolder;
      }
    }
    .ol-t-r{
      padding-top: 10px;
      padding-right: 15px;
    }
  }
  .o-tab{
    width: 100%;
    margin-top: 5px;
    .o-tab-item-selected{
      box-shadow: 0px 0px 15px 0px #999999 !important;
    }
    .o-tab-item:hover{
      box-shadow: 0px 0px 5px 0px #999999 !important;
    }
    .o-tab-item{
      cursor: pointer;
      width: 100%;
      height: 180px;
      border-radius: 3px;
      background-color: #ffffff;
      box-shadow: 0px 0px 15px 5px #eeeeee;
      display: flex;
      justify-content: space-between;
      transition: box-shadow 0.2s;
      .oti-l{
        display: flex;
        flex-direction: column;
        .oti-l-title{
          font-size: 15px;
          font-weight: bolder;
          margin-top: 20px;
          margin-left: 30px;
        }
        .oti-l-count{
          font-size: 40px;
          font-weight: bolder;
          margin-top: 15px;
          margin-left: 30px;
        }
        .oti-l-t{
          font-size: 15px;
          font-weight: bolder;
          color: #999999;
          margin-left: 30px;
          magin-top: 15px;
        }
      }
    }
  }
  .o-list{
    width: 100%;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    .ol-list{
      width: 100%;
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
