<template>
  <div class="home">
    <div v-show="projectMoreShow && checkDetailsShow && addContractTypeDialogVisible && planShow">
      <!-- 日历 / 合同计划 -->
      <div class="home-head">
        <div class="calendar">
          <div class="c-top">
            <div class="c-top-box">
              <div class="c-t-b">
                <div class="c-t-b-left">
                  <span class="icon-circle" />
                  <span class="icon-text">部门：{{ filialePartyParams.deptName }}</span>
                </div>
              </div>
              <div class="c-t-b">
                <span class="c-t-b-o-left">计划签订：{{ filialePartyParams.PlanSignTotal }}</span>
                <span class="c-t-b-o-right">已签：{{ filialePartyParams.SignedTotal }}</span>
              </div>
              <div class="c-t-b">
                <span class="c-t-b-o-left">未签：{{ filialePartyParams.notSignedTotal }}</span>
                <span class="c-t-b-o-right" style="color: #ff0000">已延误：{{ filialePartyParams.delayedTotal }}</span>
              </div>
            </div>
          </div>
          <div class="c-bottom">
            <a-calendar :fullscreen="false" @select="onPanelChange">
              <template slot="dateCellRender" slot-scope="value">
                <div v-if="includesDateData.includes( value.year() + '-' + (value.month() + 1) + '-' +  value.date() )">
                  <a-badge status="error" :content="value" />
                </div>
                <div v-if="includesPlanData.includes( value.year() + '-' + (value.month() + 1) + '-' +  value.date() )">
                  <a-badge status="success" :content="value" />
                </div>
              </template>
            </a-calendar>
          </div>
        </div>
        <div class="plan">
          <div class="plan-top">
            <div class="plan-top-left">
              <span class="plan-top-left-icon" />
              <span class="plan-top-left-title">合同计划</span>
            </div>
            <div class="plan-top-right-btn">
              <el-button size="small" @click="newCreateContractPlan">添加合同计划</el-button>
            </div>
          </div>
          <div class="plan-table">
            <el-table
              :data="contractPlanTableData"
              style="width: 100%;margin-bottom: 20px;"
              row-key="id"
              border
              max-height="400"
              default-expand-all
              :tree-props="{children: 'subContractList', hasChildren: 'hasChildren'}"
            >
              <el-table-column
                prop="generalContractName"
                width="180"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.hasOwnProperty('generalContractName')">{{ scope.row.generalContractName }}</span>
                  <span v-else>{{ scope.row.cname }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="generalUserName"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.hasOwnProperty('generalUserName')">{{ scope.row.generalUserName }}</span>
                  <span v-else>{{ scope.row.subUserName }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="planStatus"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.planStatus === '1'" style="cursor: pointer" @click="toDraft(scope.row)">去起草</span>
<!--                  <span v-if="scope.row.plan_status === 3"></span>-->
                  <span v-if="scope.row.planStatus === '3'">已签</span>
                  <span v-if="scope.row.planStatus === '4'" style="color: #ff0000">
                    已延误
                    <el-button type="text" @click="toDraft(scope.row)">去起草</el-button>
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                prop="address"
                align="center"
              >
                <template slot-scope="scope">
                  <el-button type="text" @click="editContractPlan(scope.row)">编辑</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <!-- 状态列表 -->
      <div class="status">
        <ul>
          <li v-for="(item, index) in deptStatus" :key="index" :class="{ 's-options-selected': isIndex === index }" @click="selectItem(item, index)">
            <div class="s-box">
              <div class="s-box-status" :class="{ 's-options-selected-color': isIndex === index }">{{ item.status }}</div>
              <div class="s-box-count" :class="{ 's-options-selected-color': isIndex === index }">{{ item.count }}</div>
            </div>
          </li>
        </ul>
      </div>
      <div class="status-list">
        <div class="s-more">
          <div class="s-more-btn">
            <el-button v-if="deptStatusParams.contractState !== '1'" :style="{ background: '#4C7CF7' }" type="primary" size="small" @click="more">更多</el-button>
          </div>
        </div>
        <el-empty v-if="!filialeList.length" :image-size="200"></el-empty>
        <ul v-else :class="{ 'status-list-expand': isExpand, 'status-list-not-expand': !isExpand }">
          <li v-for="(item, index) in filialeList" :key="index">
            <div v-if="deptStatusParams.contractState === '1'" class="s-list-details">
              <div class="s-list-details-title">{{ item.generalContractName ? item.generalContractName : item.cname }}</div>
              <div class="s-list-details-name">{{ item.createPeople }}</div>
              <div class="s-list-details-date">{{ item.createtime }}</div>
              <div class="s-list-details-btn">
                <span><el-button type="text" @click="handleCheckDetails(item)">查看详情</el-button></span>
              </div>
            </div>
            <div v-if="deptStatusParams.contractState !== '1'" class="s-list-details">
              <div class="s-list-details-title">{{ item.contractName }}</div>
              <div class="s-list-details-name">{{ item.promoter }}</div>
              <div class="s-list-details-date">{{ item.createtime }}</div>
              <div class="s-list-details-btn">
                <span><el-button type="text" @click="handleCheckDetails(item)">查看详情</el-button></span>
              </div>
            </div>
          </li>
          <li>
            <div style="padding-left: 20px;padding-top:7px">
              <el-button type="text" @click="showContractPlan">更多</el-button>
            </div>
          </li>
        </ul>
      </div>
      <!-- 项目列表 -->
<!--      <div class="project-list">-->
<!--        <div class="project-list-title">-->
<!--          <div class="project-list-title-top">-->
<!--            <span class="project-list-title-icon" />-->
<!--            <span class="project-list-title-text">项目列表</span>-->
<!--          </div>-->
<!--          <div class="project-list-title-more-btn">-->
<!--            <el-button :style="{ background: '#4C7CF7' }" type="primary" size="small" @click="showProjectMoreList">更多</el-button>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="project-list-table">-->
<!--          <el-table-->
<!--            :data="projectData"-->
<!--            border-->
<!--            max-height="500"-->
<!--            style="width: 100%"-->
<!--          >-->
<!--            <el-table-column-->
<!--              type="index"-->
<!--              label="序号"-->
<!--              align="center"-->
<!--            />-->
<!--            <el-table-column-->
<!--              prop="projectCode"-->
<!--              label="项目编码"-->
<!--              align="center"-->
<!--            />-->
<!--            <el-table-column-->
<!--              prop="projectName"-->
<!--              label="项目名称"-->
<!--              align="center"-->
<!--            />-->
<!--            <el-table-column-->
<!--              prop="generalContractName"-->
<!--              label="总包合同"-->
<!--              align="center"-->
<!--            />-->
<!--            <el-table-column-->
<!--              prop="generalContractCode"-->
<!--              label="总包合同编码"-->
<!--              align="center"-->
<!--            />-->
<!--            <el-table-column-->
<!--              prop="generalContractAmount"-->
<!--              label="总包合同金额"-->
<!--              align="center"-->
<!--            />-->
<!--            <el-table-column-->
<!--              prop="contractTypeStr"-->
<!--              label="承包模式"-->
<!--              align="center"-->
<!--            />-->
<!--            <el-table-column-->
<!--              prop="contractTotal"-->
<!--              label="合同总数"-->
<!--              align="center"-->
<!--            />-->
<!--            <el-table-column-->
<!--              prop="signedTotal"-->
<!--              label="已签合同"-->
<!--              align="center"-->
<!--            />-->
<!--            <el-table-column-->
<!--              prop="approvalMoney"-->
<!--              label="申请金额"-->
<!--              align="center"-->
<!--            >-->
<!--              <template slot="header" slot-scope="scope">-->
<!--                <el-tooltip class="item" effect="dark" content="请款平台提交申请的金额" placement="top">-->
<!--                  <div>申请金额</div>-->
<!--                </el-tooltip>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              prop="reallyMoney"-->
<!--              label="实付金额"-->
<!--              align="center"-->
<!--            >-->
<!--              <template slot="header" slot-scope="scope">-->
<!--                <el-tooltip class="item" effect="dark" content="请款平台提交申请后实际付款金额" placement="top">-->
<!--                  <div>实付金额</div>-->
<!--                </el-tooltip>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              prop="overMoney"-->
<!--              label="已支付金额"-->
<!--              align="center"-->
<!--            >-->
<!--              <template slot="header" slot-scope="scope">-->
<!--                <el-tooltip class="item" effect="dark" content="该合同已经支付的金额" placement="top">-->
<!--                  <div>已支付金额</div>-->
<!--                </el-tooltip>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              prop="date"-->
<!--              label="操作"-->
<!--              align="center"-->
<!--            >-->
<!--              <template slot-scope="scope">-->
<!--                <el-button type="text" size="small" @click="handleCheckDetails(scope.row)">查看详情</el-button>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--          </el-table>-->
<!--        </div>-->
<!--      </div>-->
      <!-- 审批趋势 -->
      <!-- <div class="approve">
        <div class="a-left">
          <div class="a-left-top">
            <span class="a-left-top-icon" />
            <span class="a-left-top-text">我方签约主体统计</span>
          </div>
          <div id="a-left-mine-statistic" style="width: 100%;height: 100%;" />
        </div>
        <div class="a-right">
          <div class="a-right-top">
            <div class="a-right-top-left">
              <span class="a-right-top-left-icon" />
              <span class="a-right-top-left-text">合同审批趋势</span>
            </div>
            <div class="a-right-top-right">
              <el-select v-model="approveYear" size="mini" placeholder="请选择">
                <el-option
                  v-for="item in approveYearOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </div>
          </div>
          <div id="trend-my-statistic" style="width: 100%;height: 100%;" />
        </div>
      </div> -->
      <!-- 审批趋势 -->
      <!-- <div class="approve">
        <div class="a-left">
          <div class="a-left-top">
            <span class="a-left-top-icon" />
            <span class="a-left-top-text">乙方签约主体统计</span>
          </div>
          <div id="party-sign-statistic" style="width: 100%;height: 100%;" />
        </div>
        <div class="a-right">
          <div class="a-right-top">
            <div class="a-right-top-left">
              <span class="a-right-top-left-icon" />
              <span class="a-right-top-left-text">合同范本使用趋势</span>
            </div>
            <div class="a-right-top-right">
              <el-select v-model="partySelect" size="mini" placeholder="请选择" @change="selectClassify">
                <el-option
                  v-for="item in classifyData"
                  :key="item.id"
                  :label="item.cname"
                  :value="item.cname"
                />
              </el-select>
            </div>
          </div>
          <div id="trend-yi-statistic" style="width: 100%;height: 100%;" />
        </div>
      </div> -->
    </div>
    <div v-show="!projectMoreShow">
      <project-table :deptCode="projectListParams.deptCode" />
    </div>
    <div v-show="!checkDetailsShow">
      <check-details :projectCode="projectCode"></check-details>
    </div>
    <div v-show="!addContractTypeDialogVisible">
      <create-contract-plan ref="editContract" :deptCode="projectListParams.deptCode"></create-contract-plan>
    </div>
    <div v-show="!planShow">
      <contract-plan @contract-plan-edit="editContractPlan"></contract-plan>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import api from '@/api/work/contract'
import projectTable from './projectTable'
import checkDetails from './checkDetails'
import createContractPlan from './createContractPlan'
import contractPlan from './contractPlan'
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import moment from 'moment'
export default {
  name: 'Filiale',
  components: {
    'project-table': projectTable,
    'check-details': checkDetails,
    'create-contract-plan': createContractPlan,
    'contract-plan': contractPlan
  },
  data() {
    return {
      locale: zhCN,
      // 添加合同计划
      addContractTypeDialogVisible: true,
      contractType: [''],
      // 项目列表 更多 展示
      projectMoreShow: true,
      // 项目列表 查看详情 展示
      checkDetailsShow: true,
      value: new Date(),
      isIndex: 0,
      // 项目列表
      projectData: [],
      // 分公司权限项目列表参数
      projectListParams: {
        deptCode: '',
        pageNum: 1,
        pageSize: 10,
        requestType: '1'
      },
      // 合同审批趋势年份选择
      approveYear: '2021',
      approveYearOptions: ['2019', '2020', '2021'],
      // 乙方合同趋势分类选择
      partySelect: '',
      partySelectDept: {
        classifyId: 0
      },
      classifyData: [],
      deptStatus: [{ status: '计划中', count: 0 }, { status: '待审批', count: 0 }, { status: '已拒绝', count: 0 }, { status: '待生效', count: 0 }, { status: '已完成', count: 0 }, { status: '已终止', count: 0 }],
      deptStatusParams: {
        contractState: '1'
      },
      // 合同统计列表
      filialeList: [],
      // 合同计划列表
      contractPlanTableData: [],
      getPlanListParams: {
        searchTime: new Date()
      },
      signParams: {
        deptCode: ''
      },
      // 项目列表 查看详情 传参
      projectCode: '',
      // 更多展开
      isExpand: false,
      filialePartyParams: {
        deptName: '',
        PlanSignTotal: null,
        SignedTotal: null,
        delayedTotal: null,
        notSignedTotal: null
      },
      includesDateData: [],
      includesPlanData: [],
      month: '',
      date: '',
      // 计划列表
      planShow: true
    }
  },
  mounted() {
    // 获取我方、乙方签约主体统计
    // this.initMineStatistic()
    // 获取合同审批趋势分类
    this.getCenterAuthContractClassify()
    // 我方合同审批趋势
    // this.listContractTrend()
    // 乙方合同审批趋势
    // this.getContractApprovalTrend()
    // 合同统计列表
    this.listCompanyStatistic()
    // 获取提示
    this.getContractTips()
    // 初始化合同计划列表
    this.getContractPlanList()
    // 获取项目列表
    this.listCenterAuthList()
  },
  methods: {
    showContractPlan() {
      this.planShow = false
    },
    onPanelChange(value) {
      // console.log(moment(value._d).format('YYYY-MM-DD'))
      this.getPlanListParams.searchTime = moment(value._d).format('YYYY-MM-DD')
      this.getContractPlanList()
    },
    // 去起草
    toDraft(item) {
      console.log(item)
      if (item.pid === 0) {
        const params = {
          id: null
        }
        params.id = item.id
        api.addAll(params).then(res => {
          if (res.code === 0) {
            // window.open('http://60.16.16.90:8215/form/detail?workitemId=' + res.data.workitemId + '&workflowInstanceId=' + res.data.workflowInstanceId + '&T=' + res.data.token)

            if(window.location.href.includes('rfp.jiuzhangdigit.com')) {
              // console.log('dev')
              window.open('https://bpm.jiuzhangdigit.com/form/detail?workitemId=' + res.data.workitemId + '&workflowInstanceId=' + res.data.workflowInstanceId + '&T=' + res.data.token)
            } else if(window.location.href.includes('10.20.16.37')) {
              // console.log('beta')
              window.open('http://60.16.16.90:8215/form/detail?workitemId=' + res.data.workitemId + '&workflowInstanceId=' + res.data.workflowInstanceId + '&T=' + res.data.token)
            }
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
        const params = {
          planId: null,
          classifyId: null,
          contractModelId: null
        }
        params.planId = item.id
        params.classifyId = item.classifyCode
        params.contractModelId = item.contractModelId
        api.addAllTo(params).then(res => {
          if (res.code === 0) {
            // window.open('http://60.16.16.90:8215/form/detail?workitemId=' + res.data.workitemId + '&workflowInstanceId=' + res.data.workflowInstanceId + '&T=' + res.data.token)

            if(window.location.href.includes('rfp.jiuzhangdigit.com')) {
              // console.log('dev')
              window.open('https://bpm.jiuzhangdigit.com/form/detail?workitemId=' + res.data.workitemId + '&workflowInstanceId=' + res.data.workflowInstanceId + '&T=' + res.data.token)
            } else if(window.location.href.includes('10.20.16.37')) {
              // console.log('beta')
              window.open('http://60.16.16.90:8215/form/detail?workitemId=' + res.data.workitemId + '&workflowInstanceId=' + res.data.workflowInstanceId + '&T=' + res.data.token)
            }
          } else {
            this.$message({
              type: 'warning',
              message: res.msg
            })
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    // 编辑合同计划
    editContractPlan(item) {
      this.addContractTypeDialogVisible = false
      this.$nextTick(() => {
        this.$refs.editContract.getPartContract()
        setTimeout(() => {
          this.$refs.editContract.echoContractInformation(item)
        }, 1000)
      })
    },
    more() {
      if (this.deptStatusParams.contractState === '2' || this.deptStatusParams.contractState === '3') {
        this.$router.push({
          path: '/example1/contractApprove'
        })
      } else {
        this.$router.push({
          path: '/example1/Hetonglvyue'
        })
      }
    },
    // 显示添加合同计划
    newCreateContractPlan() {
      this.addContractTypeDialogVisible = false
      this.$nextTick(() => {
        this.$refs.editContract.getPartContract()
        setTimeout(() => {
          this.$refs.editContract.checkAllContractInformation()
        }, 1000)
      })
    },
    showProjectMoreList() {
      this.projectMoreShow = false
    },
    // 子组件 返回首页
    showProjectMore(type) {
      this.projectMoreShow = type
      this.checkDetailsShow = type
      this.addContractTypeDialogVisible = type
      this.planShow = type
    },
    checkDetails(type, item) {
      this.projectCode = item.projectCode
      this.projectMoreShow = type
      this.checkDetailsShow = !type
      this.addContractTypeDialogVisible = type
    },
    // 获取项目列表
    listCenterAuthList() {
      if (!this.projectListParams.deptCode) {
        delete this.projectListParams.deptCode
      }
      api.listCenterAuthList(this.projectListParams).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.projectData = res.data.projectMsgDtoList
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取合同计划列表
    getContractPlanList() {
      api.getContractPlanList(this.getPlanListParams).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.contractPlanTableData = res.data.listContractPlans
          this.filialePartyParams.deptName = res.data.deptName ? res.data.deptName : ''
          this.filialePartyParams.PlanSignTotal = res.data.PlanSignTotal ? res.data.PlanSignTotal : 0
          this.filialePartyParams.notSignedTotal = res.data.notSignedTotal ? res.data.notSignedTotal : 0
          this.filialePartyParams.SignedTotal = res.data.SignedTotal ? res.data.SignedTotal : 0
          this.filialePartyParams.delayedTotal = res.data.delayedTotal ? res.data.delayedTotal : 0
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 合同统计
    listCompanyStatistic() {
      api.listCompanyStatistic(this.deptStatusParams).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.filialeList = res.data.conStiDtoList
          this.deptStatus[0].count = res.data.hasOwnProperty('plan') ? res.data.plan : 0
          this.deptStatus[1].count = res.data.hasOwnProperty('pendingApproval') ? res.data.pendingApproval : 0
          this.deptStatus[2].count = res.data.hasOwnProperty('rejected') ? res.data.rejected : 0
          this.deptStatus[3].count = res.data.hasOwnProperty('effective') ? res.data.effective : 0
          this.deptStatus[4].count = res.data.hasOwnProperty('completed') ? res.data.completed : 0
          // 已终止 待确认
          this.deptStatus[5].count = res.data.hasOwnProperty('terminating') ? res.data.terminating : 0
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取提示
    getContractTips() {
      api.getContractTips().then(res => {
        console.log(res)
        if (res.code === 0) {
          this.includesDateData = res.data.red.map(item => item.dayTime)
          this.includesPlanData = res.data.green.map(item => item.dayTime)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    selectItem(item, index) {
      this.isIndex = index
      if (item.status === '待生效') {
        this.deptStatusParams.contractState = '5'
      } else if (item.status === '已完成') {
        this.deptStatusParams.contractState = '4'
      } else {
        this.deptStatusParams.contractState = '' + (index + 1)
      }
      this.listCompanyStatistic()
    },
    // 获取合同审批趋势分类 (乙方合同审批趋势)
    getCenterAuthContractClassify() {
      api.getCenterAuthContractClassify().then(res => {
        console.log(res)
        if (res.code === 0) {
          this.classifyData = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    selectClassify(val) {
      console.log(val)
      for (let i = 0, len = this.classifyData.length; i < len; i++) {
        if (this.classifyData[i].cname === val) {
          this.partySelectDept.classifyId = this.classifyData[i].hasOwnProperty('id') ? this.classifyData[i].id : 0
        }
      }
      this.getContractApprovalTrend()
    },
    // 获取合同审批趋势下拉选
    getContractApprovalTrend() {
      const chartDom = document.getElementById('trend-yi-statistic')
      const mineChart = echarts.init(chartDom)
      const dimensions = []
      const series = []
      const source = []
      api.getContractApprovalTrend(this.partySelectDept).then(res => {
        console.log(res)
        if (res.code === 0) {
          for (let i = 0, len = res.data.length; i < len; i++) {
            dimensions.push(res.data[i].deptName)
            series.push({ type: 'bar' })
            const arrSource = []
            for (let j = 0, lens = res.data[i].deptList.length; j < lens; j++) {
              arrSource.push(res.data[i].deptList[j].contractTotal)
            }
            source.push([res.data[i].deptName].concat(arrSource))
          }
          console.log(dimensions)
          console.log(source)
          console.log(series)
          const options = {
            legend: {},
            tooltip: {},
            dataset: {
              dimensions: ['沈阳腾越', ...dimensions],
              source: source
            },
            xAxis: { type: 'category' },
            yAxis: {},
            series: series
          }
          mineChart.setOption(options)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 合同审批趋势 年份
    listContractTrend() {
      const params = {
        year: ''
      }
      params.year = this.approveYear
      const chartDom = document.getElementById('trend-my-statistic')
      const mineChart = echarts.init(chartDom)
      api.listContractTrend(params).then(res => {
        console.log(res)
        if (res.code === 0) {
          const options = {
            legend: {},
            tooltip: {},
            dataset: {
              dimensions: ['month', 'total'],
              source: res.data
            },
            xAxis: { type: 'category' },
            yAxis: {},
            series: [{ type: 'bar' }]
          }
          mineChart.setOption(options)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 查看详情
    handleCheckDetails(item) {
      this.projectCode = item.projectCode
      this.checkDetailsShow = false
    },
    // 我方统计
    initMineStatistic() {
      if (!this.signParams.deptCode) {
        delete this.signParams.deptCode
      }
      const chartDomMine = document.getElementById('a-left-mine-statistic')
      const mineChart = echarts.init(chartDomMine)
      const chartDomParty = document.getElementById('party-sign-statistic')
      const partyChart = echarts.init(chartDomParty)

      api.getSignalMainInfo(this.signParams).then(res => {
        if (res.code === 0) {
          const optionMineData = res.data.aCompanyDTOList.map(item => {
            return {
              value: item.contractNumber,
              name: item.companyName
            }
          })
          const optionPartyData = res.data.bCompanyDTOList.map(item => {
            return {
              value: item.contractNumber,
              name: item.companyName
            }
          })
          const optionMine = {
            tooltip: {
              trigger: 'item'
            },
            legend: {
              top: '5%',
              left: 'center'
            },
            series: [
              {
                name: 'Access From',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                  borderRadius: 10,
                  borderColor: '#fff',
                  borderWidth: 2
                },
                label: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  label: {
                    show: false,
                    fontSize: '10',
                    fontWeight: 'bold'
                  }
                },
                labelLine: {
                  show: false
                },
                data: optionMineData
              }
            ]
          }
          const optionParty = {
            tooltip: {
              trigger: 'item'
            },
            legend: {
              top: '5%',
              left: 'center'
            },
            series: [
              {
                name: 'Access From',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                  borderRadius: 10,
                  borderColor: '#fff',
                  borderWidth: 2
                },
                label: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  label: {
                    show: false,
                    fontSize: '10',
                    fontWeight: 'bold'
                  }
                },
                labelLine: {
                  show: false
                },
                data: optionPartyData
              }
            ]
          }
          mineChart.setOption(optionMine)
          partyChart.setOption(optionParty)
        }
      }).then(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  /deep/.el-calendar{
    background-color: #3A78F1 !important;
    color: #ffffff !important;
  }
  /deep/.el-calendar-table thead th{
    color: #ffffff !important;
  }
  /deep/.el-calendar-table .el-calendar-day:hover{
    cursor: pointer;
    background-color: #fff !important;
    color: #3A78F1 !important;
  }
  /deep/.el-backtop, .el-calendar-table td.is-today{
    color: #3A78F1 !important;
  }
  /deep/.el-calendar-table td.is-selected{
    background-color: #ffffff !important;
    color: #3A78F1 !important;
  }
  /deep/.el-calendar__title{
    color: #ffffff !important;
  }
  /deep/.ant-fullcalendar-value{
    color: #ffffff !important;
  }
  /deep/.ant-fullcalendar{
    color: #ffffff !important;
  }
  .home{
    width: 100%;
    padding: 20px;
    .home-head{
      width: 100%;
      height: 500px;
      display: flex;
      flex-direction: row;
      .calendar{
        width: 30%;
        /*height: 600px;*/
        border-radius: 10px;
        background-color: #3A78F1;
        box-shadow: 10px 10px 30px 10px #eeeeee;
        margin-right: 20px;
        display: flex;
        flex-direction: column;
        .c-top{
          width: 100%;
          /*height: 150px;*/
          .c-top-box{
            width: calc(100% - 40px);
            /*height: 100px;*/
            margin-left: 20px;
            margin-top: 20px;
            display: flex;
            flex-direction: column;
            background: rgba(255, 255, 255, 0.22);
            border: 1px solid #FFFFFF;
            opacity: 0.9;
            border-radius: 10px;
            padding-bottom: 20px;
            .c-t-b{
              display: flex;
              justify-content: space-between;
              .c-t-b-left{
                display: flex;
                flex-direction: row;
                .icon-circle{
                  width: 12px;
                  height: 12px;
                  background-color: #fff;
                  border-radius: 50%;
                  margin-top: 20px;
                  margin-left: 20px;
                }
                .icon-text{
                  font-size: 18px;
                  color: #ffffff;
                  padding-top: 15px;
                  padding-left: 10px;
                }
              }
              .c-t-b-o-left{
                font-size: 15px;
                color: #ffffff;
                margin-left: 20px;
                margin-top: 10px;
              }
              .c-t-b-o-right{
                font-size: 15px;
                color: #ffffff;
                margin-right: 20px;
                margin-top: 10px;
              }
            }
          }
        }
        .c-bottom{
          width: 100%;
          /*height: 450px;*/
          overflow: scroll;
          padding: 20px 20px;
        }
        .c-bottom::-webkit-scrollbar{
          display: none;
        }
      }
      .plan{
        width: calc(70% - 20px);
        /*height: 600px;*/
        border-radius: 10px;
        background-color: #fff;
        box-shadow: 10px 10px 30px 10px #eeeeee;
        display: flex;
        flex-direction: column;
        .plan-top{
          width: 100%;
          display: flex;
          justify-content: space-between;
          .plan-top-left{
            padding-left: 20px;
            display: flex;
            flex-direction: row;
            margin-top: 10px;
            .plan-top-left-icon{
              width: 6px;
              height: 15px;
              background-color: #3A78F1;
              margin-top: 20px;
            }
            .plan-top-left-title{
              font-size: 15px;
              padding-top: 20px;
              margin-left: 10px;
            }
          }
          .plan-top-right-btn{
            padding-right: 20px;
            padding-top: 20px;
          }
        }
        .plan-table{
          width: 100%;
          padding: 20px 20px;
        }
      }
    }
    .status{
      width: 100%;
      ul{
        width: 100%;
        margin: 0;
        padding: 0;
        list-style-type: none;
        display: flex;
        flex-direction: row;
        padding-top: 20px;
        .s-options-selected{
          background-color: #3A78F1;
          color: #ffffff !important;
        }
        .s-options-selected-color{
          color: #ffffff !important;
        }
        li{
          width: calc((100% - 50px) / 6);
          height: 100px;
          border-radius: 10px;
          background-color: #fff;
          box-shadow: 10px 10px 30px 10px #eeeeee;
          cursor: pointer;
          .s-box{
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
          }
          .s-box-count{
            font-size: 26px;
            padding-left: 33px;
            padding-top: 15px;
            color: #4C7CF7;
            font-weight: bolder;
          }
          .s-box-status{
            font-size: 16px;
            padding-top: 20px;
            padding-left: 33px;
            color: #7A7C80;
          }
        }
        li:nth-child(1){
          margin-right: 10px;
        }
        li:nth-child(2){
          margin-right: 10px;
        }
        li:nth-child(3){
          margin-right: 10px;
        }
        li:nth-child(4){
          margin-right: 10px;
        }
        li:nth-child(5){
          margin-right: 10px;
        }
      }
    }
    .status-list::-webkit-scrollbar{
      display: none;
    }
    .status-list{
      width: 100%;
      height: 500px;
      border-radius: 10px;
      background-color: #fff;
      box-shadow: 10px 10px 30px 10px #eeeeee;
      margin-top: 20px;
      overflow-y: scroll;
      ul{
        width: 100%;
        margin: 0;
        padding: 0;
        list-style-type: none;
        display: flex;
        flex-direction: column;
        transition: height 1000ms;
        overflow: hidden;
        li{
          width: 100%;
          display: flex;
          .s-list-details{
            width: 100%;
            height: 60px;
            display: flex;
            flex-direction: row;
            .s-list-details-title{
              width: 60%;
              line-height: 60px;
              padding-left: 20px;
              font-size: 15px;
            }
            .s-list-details-name{
              width: 10%;
              line-height: 60px;
              text-align: center;
              font-size: 15px;
            }
            .s-list-details-date{
              width: 20%;
              line-height: 60px;
              text-align: center;
              font-size: 15px;
              color: #4C7CF7;
            }
            .s-list-details-btn{
              width: 10%;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          }
        }
      }
      .s-more{
        width: 100%;
        height: 60px;
        display: flex;
        flex-direction: row-reverse;
        .s-more-btn{
          margin-right: 20px;
          margin-top: 20px;
        }
      }
    }
    .project-list{
      width: 100%;
      border-radius: 10px;
      background-color: #fff;
      box-shadow: 10px 10px 30px 10px #eeeeee;
      display: flex;
      flex-direction: column;
      margin-top: 20px;
      .project-list-title{
        width: 100%;
        display: flex;
        justify-content: space-between;
        .project-list-title-top{
          padding-left: 20px;
          display: flex;
          flex-direction: row;
          margin-top: 10px;
          .project-list-title-icon{
            width: 6px;
            height: 15px;
            background-color: #3A78F1;
            margin-top: 20px;
          }
          .project-list-title-text{
            font-size: 15px;
            padding-top: 20px;
            margin-left: 10px;
          }
        }
        .project-list-title-more-btn{
          padding-right: 20px;
          padding-top: 20px;
        }
      }
      .project-list-table{
        width: 100%;
        padding: 20px 20px;
      }
    }
    .approve{
      width: 100%;
      display: flex;
      flex-direction: row;
      margin-top: 20px;
      .a-left{
        width: 550px;
        height: 350px;
        border-radius: 10px;
        background-color: #fff;
        box-shadow: 10px 10px 30px 10px #eeeeee;
        display: flex;
        flex-direction: column;
        .a-left-top{
          height: 80px;
          display: flex;
          flex-direction: row;
          .a-left-top-icon{
            width: 3px;
            height: 19px;
            background-color: #3A78F1;
            margin-top: 30px;
            margin-left: 20px;
          }
          .a-left-top-text{
            font-size: 15px;
            line-height: 80px;
            color: #000000;
            margin-left: 10px;
          }
        }
        .a-left-mine-statistic{
          width: 100%;
          height: 270px;
        }
      }
      .a-right{
        width: calc(100% - 570px);
        height: 350px;
        border-radius: 10px;
        background-color: #fff;
        box-shadow: 10px 10px 30px 10px #eeeeee;
        margin-left: 20px;
        display: flex;
        flex-direction: column;
        .a-right-top{
          width: 100%;
          height: 80px;
          display: flex;
          justify-content: space-between;
          .a-right-top-left{
            height: 80px;
            display: flex;
            flex-direction: row;
            .a-right-top-left-icon{
              width: 3px;
              height: 19px;
              background-color: #3A78F1;
              margin-top: 30px;
              margin-left: 20px;
            }
            .a-right-top-left-text{
              font-size: 15px;
              line-height: 80px;
              color: #000000;
              margin-left: 10px;
            }
          }
          .a-right-top-right{
            padding-top: 20px;
            padding-right: 20px;
          }
        }
      }
    }
  }
</style>
