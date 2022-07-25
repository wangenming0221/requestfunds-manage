<template>
  <div class="home">
    <div v-if="projectMoreShow && checkDetailsShow">
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
          </div>
          <div class="plan-table">
            <el-table
              :data="contractPlanTableData"
              style="width: 100%;margin-bottom: 20px;"
              row-key="id"
              max-height="400"
              border
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
            </el-table>
          </div>
        </div>
      </div>
      <div class="home-heads">
        <div class="hh-titles">当前总包合同</div>
        <div class="hh-selects">
          <el-select v-model="contractName" clearable placeholder="请选择" @change="handleCurrentContract">
            <el-option
              v-for="item in contractOptions"
              :key="item.id"
              :label="item.contractName"
              :value="item.contractName"
            />
          </el-select>
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
        <ul>
          <li>
            <div class="s-more"><div class="s-more-btn"><el-button v-if="deptStatusParams.contractState !== '1'" :style="{ background: '#4C7CF7' }" type="primary" size="small" @click="more">更多</el-button></div></div>
          </li>
          <li v-for="(item, index) in contractsList" :key="index">
            <div v-if="deptStatusParams.contractState === '1'" class="s-list-details">
              <div class="s-list-details-title">{{ item.generalContractName ? item.generalContractName : item.cname }}</div>
              <div class="s-list-details-name">
                <span v-if="item.planStatus === '1'" style="cursor: pointer" @click="toDraft(item)">去起草</span>
                <span v-if="item.planStatus === '3'">已签</span>
                <span v-if="item.planStatus === '4'" style="color: #ff0000">
                  已延误
                  <el-button type="text" @click="toDraft(item)">去起草</el-button>
                </span>
              </div>
              <div class="s-list-details-date">{{ item.createTime }}</div>
            </div>
            <div v-if="deptStatusParams.contractState !== '1'" class="s-list-details">
              <div class="s-list-details-title">{{ item.contractName }}</div>
              <div class="s-list-details-name">
                <span v-if="item.planStatus === '1'" style="cursor: pointer" @click="toDraft(item)">去起草</span>
                <span v-if="item.planStatus === '3'">已签</span>
                <span v-if="item.planStatus === '4'" style="color: #ff0000">
                  已延误
                  <el-button type="text" @click="toDraft(item)">去起草</el-button>
                </span>
              </div>
              <div class="s-list-details-date">{{ item.createtime }}</div>
            </div>
          </li>
        </ul>
      </div>
<!--      <div class="project-list">-->
<!--        <div class="project-list-title">-->
<!--          <div class="project-list-title-top">-->
<!--            <span class="project-list-title-icon" />-->
<!--            <span class="project-list-title-text">项目列表</span>-->
<!--          </div>-->
<!--          <div class="project-list-title-more-btn">-->
<!--            <el-button :style="{ background: '#4C7CF7' }" type="primary" size="small" @click="showMoreProject">更多</el-button>-->
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
<!--              fixed="left"-->
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
<!--              <template slot="header">-->
<!--                <el-tooltip class="item" effect="dark" content="请款平台提交申请的金额" placement="top">-->
<!--                  <div>申请金额</div>-->
<!--                </el-tooltip>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              prop="payMoney"-->
<!--              label="实付金额"-->
<!--              align="center"-->
<!--            >-->
<!--              <template slot="header">-->
<!--                <el-tooltip class="item" effect="dark" content="请款平台提交申请后实际付款金额" placement="top">-->
<!--                  <div>实付金额</div>-->
<!--                </el-tooltip>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              prop="actualMoney"-->
<!--              label="已支付金额"-->
<!--              align="center"-->
<!--            >-->
<!--              <template slot="header">-->
<!--                <el-tooltip class="item" effect="dark" content="该合同已经支付的金额" placement="top">-->
<!--                  <div>已支付金额</div>-->
<!--                </el-tooltip>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              prop="date"-->
<!--              label="操作"-->
<!--              align="center"-->
<!--              fixed="right"-->
<!--            >-->
<!--              <template slot-scope="scope">-->
<!--                <el-button type="text" size="small" @click="handleCheckDetails(scope.row)">查看详情</el-button>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--          </el-table>-->
<!--        </div>-->
<!--      </div>-->
    </div>
    <div v-if="!checkDetailsShow">
      <check-details :project-code="projectCode" />
    </div>
    <div v-if="!projectMoreShow">
      <project-table />
    </div>
  </div>
</template>

<script>
import api from '@/api/work/contract'
import projectTable from './projectTable'
import checkDetails from './checkDetails'
import moment from 'moment'
export default {
  name: 'Filiale',
  components: {
    'project-table': projectTable,
    'check-details': checkDetails
  },
  data() {
    return {
      // 项目列表 更多 展示
      projectMoreShow: true,
      // 项目列表 查看详情 展示
      checkDetailsShow: true,
      value: new Date(),
      isIndex: 0,
      // 项目列表
      projectData: [],
      approveYear: '2021',
      approveYearOptions: ['2020', '2021'],
      contractOptions: [],
      contractName: '',
      deptStatus: [{ status: '计划中', count: 0 }, { status: '待审批', count: 0 }, { status: '已拒绝', count: 0 }, { status: '待生效', count: 0 }, { status: '已完成', count: 0 }, { status: '已终止', count: 0 }],
      deptStatusParams: {
        contractState: '1',
        projectCode: ''
      },
      contractsList: [],
      // 查看详情
      projectCode: '',
      getPlanListParams: {
        searchTime: new Date()
      },
      filialePartyParams: {
        deptName: '',
        PlanSignTotal: null,
        SignedTotal: null,
        delayedTotal: null,
        notSignedTotal: null
      },
      contractPlanTableData: [],
      includesDateData: [],
      includesPlanData: []
    }
  },
  created() {
    this.listAllGeneralContract()
    // 项目状态列表
    this.listProjectByStatus()
    this.getContractTips()
    // 项目列表
    this.getProjectAuthList()
    this.getContractPlanList()
  },
  methods: {
    // 获取项目列表
    getProjectAuthList() {
      const params = {
        requestType: 1,
        projectCode: ''
      }
      if (!this.deptStatusParams.projectCode) {
        delete params.projectCode
      } else {
        params.projectCode = this.deptStatusParams.projectCode
      }
      api.listCenterAuthList(params).then(res => {
        if (res.code === 0) {
          this.projectData = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    checkDetails(type, item) {
      this.projectCode = item.projectCode
      this.projectMoreShow = type
      this.checkDetailsShow = !type
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
    onPanelChange(value) {
      console.log(moment(value._d).format('YYYY-MM-DD'))
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
    showMoreProject() {
      this.projectMoreShow = false
    },
    // 查看详情
    handleCheckDetails(item) {
      this.projectCode = item.projectCode
      this.checkDetailsShow = false
    },
    // 子组件 返回首页
    showProjectMore(type) {
      this.projectMoreShow = type
      this.checkDetailsShow = type
    },
    more() {
      switch (this.deptStatusParams.contractState) {
        case '1':
        case '2':
        case '3':
          this.$router.push({
            path: '/example1/contractApprove'
          })
          break
        case '4':
        case '5':
        case '6':
          this.$router.push({
            path: '/example1/Hetonglvyue'
          })
      }
    },
    // 变更项目列表状态
    listProjectByStatus() {
      if (!this.deptStatusParams.projectCode) {
        delete this.deptStatusParams.projectCode
      }
      api.listProjectAuthListByProjectStatus(this.deptStatusParams).then(res => {
        if (res.code === 0) {
          this.deptStatus[0].count = res.data.hasOwnProperty('plan') ? res.data.plan : 0
          this.deptStatus[1].count = res.data.hasOwnProperty('pendingApproval') ? res.data.pendingApproval : 0
          this.deptStatus[2].count = res.data.hasOwnProperty('rejected') ? res.data.rejected : 0
          this.deptStatus[3].count = res.data.hasOwnProperty('effective') ? res.data.effective : 0
          this.deptStatus[4].count = res.data.hasOwnProperty('completed') ? res.data.completed : 0
          // 已终止 待确认
          this.deptStatus[5].count = res.data.hasOwnProperty('terminating') ? res.data.terminating : 0
          this.contractsList = res.data.contracts
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 选择当前合同总包
    handleCurrentContract(val) {
      const arr = this.contractOptions
      for (let i = 0, len = arr.length; i < len; i++) {
        if (val === arr[i].contractName) {
          this.deptStatusParams.projectCode = arr[i].projectCode
        }
      }
      // 项目状态列表
      this.listProjectByStatus()
      // 项目列表
      this.getProjectAuthList()
    },
    //
    listAllGeneralContract() {
      api.getGeneralContract().then(res => {
        console.log(res)
        if (res.code === 0) {
          this.contractOptions = res.data
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
      this.listProjectByStatus()
    }
  }
}
</script>

<style lang="scss" scoped>
  /deep/.ant-fullcalendar-value{
    color: #ffffff !important;
  }
  /deep/.ant-fullcalendar{
    color: #ffffff !important;
  }
  .home{
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
    .home-heads{
      width: 100%;
      height: 64px;
      display: flex;
      flex-direction: row;
      border-radius: 10px;
      background-color: #fff;
      box-shadow: 10px 10px 30px 10px #eeeeee;
      margin-top: 20px;
      .hh-titles{
        margin-left: 30px;
        font-size: 14px;
        color: #5C5C5C;
        line-height: 64px;
      }
      .hh-selects{
        margin-left: 10px;
        padding-top: 12px;
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
    .status-list{
      width: 100%;
      border-radius: 10px;
      background-color: #fff;
      box-shadow: 10px 10px 30px 10px #eeeeee;
      margin-top: 20px;
      ul{
        width: 100%;
        margin: 0;
        padding: 0;
        list-style-type: none;
        display: flex;
        flex-direction: column;
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
              width: 20%;
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
