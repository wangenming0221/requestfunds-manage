<template>
  <div class="home">
    <div v-if="projectMoreShow && checkDetailsShow && planShow" class="home-top">
      <!-- 状态列表 -->
      <div class="status">
<!--        <div class="status-head">-->
<!--          <span><el-button :style="{ background: '#4C7CF7' }" type="primary" size="small">查看更多分公司</el-button></span>-->
<!--        </div>-->
        <ul :class="{ notExpandHeight: !isExpand, expandHeight: isExpand }">
          <li v-for="(item, index) in centerTableData" :key="index" :class="{ 's-options-selected': isIndex === index }" @click="selectItem(item, index)">
            <div class="s-box">
              <div class="s-box-count">
                <div class="sc-top" :class="{ 's-options-selected': isIndex === index }">{{ item.deptName }}</div>
                <div class="sc-middle" :class="{ 's-options-selected': isIndex === index }">已签合同数量：{{ item.signedTotal ? item.signedTotal : 0 }}</div>
                <div class="sc-middle" :class="{ 's-options-selected': isIndex === index }">未签合同数量：{{ item.notSignedTotal ? item.notSignedTotal : 0 }}</div>
              </div>
              <div class="s-box-status">
                <img src="../../../../assets/contract/com.png" alt="">
              </div>
            </div>
          </li>
        </ul>
        <div class="check-more-btn" @click="checkMoreFiliale">{{ isExpand ? '收起' : '查看更多分公司' }}</div>
      </div>
      <div class="project-list">
        <div class="project-list-title">
          <div class="project-list-title-top">
            <span class="project-list-title-icon" />
            <span class="project-list-title-text">合同统计</span>
          </div>
        </div>
        <div class="project-tab">
          <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
            <el-tab-pane v-for="(item, index) in classifyData" :key="item.id" :label="item.cname" :name="'' + index">
              <div v-if="index === 0" class="p-contract">
                <div class="pc-head">
                  <div>
                    <el-button :type="getStatisticParams.contractState === '1' ? 'primary': ''" size="small" @click="selectStatus('1')">计划中</el-button>
                    <el-button :type="getStatisticParams.contractState === '2' ? 'primary': ''" size="small" @click="selectStatus('2')">待审批</el-button>
                    <el-button :type="getStatisticParams.contractState === '3' ? 'primary': ''" size="small" @click="selectStatus('3')">已拒绝</el-button>
                    <el-button :type="getStatisticParams.contractState === '4' ? 'primary': ''" size="small" @click="selectStatus('4')">已完成</el-button>
                    <el-button :type="getStatisticParams.contractState === '5' ? 'primary': ''" size="small" @click="selectStatus('5')">待生效</el-button>
                    <el-button :type="getStatisticParams.contractState === '6' ? 'primary': ''" size="small" @click="selectStatus('6')">已终止</el-button>
                  </div>
                  <div><el-button v-if="getStatisticParams.contractState !== '1'" type="primary" size="small">更多</el-button></div>
                </div>
                <div>
                  <el-table
                    v-if="getStatisticParams.contractState === '1'"
                    :data="tableData"
                    style="width: 100%">
                    <el-table-column
                      prop="generalContractName"
                      label="合同名称">
                    </el-table-column>
                    <el-table-column
                      label="姓名"
                      width="180">
                      <template slot-scope="scope">
                        <span v-if="scope.row.generalUserName">{{ scope.row.generalUserName }}</span>
                        <span v-if="scope.row.subUserName">{{ scope.row.subUserName }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="createTime"
                      label="日期"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      prop="createTime"
                      label="操作"
                      width="180">
                      <template slot-scope="scope">
                        <el-button v-if="getStatisticParams.contractState === '1'" type="text" @click="handleCheckPlaningDetails(scope.row)">查看详情</el-button>
                        <el-button v-else type="text" @click="handleCheckDetails(scope.row)">查看详情</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-table
                    v-else
                    :data="tableData"
                    style="width: 100%">
                    <el-table-column
                      prop="contractName"
                      label="合同名称">
                    </el-table-column>
                    <el-table-column
                      prop="promoter"
                      label="姓名"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      prop="createtime"
                      label="日期"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      prop="createTime"
                      label="操作"
                      width="180">
                      <template slot-scope="scope">
                        <el-button v-if="getStatisticParams.contractState === '1'" type="text" @click="handleCheckPlaningDetails(scope.row)">查看详情</el-button>
                        <el-button v-else type="text" @click="handleCheckDetails(scope.row)">查看详情</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
                <div style="padding-left: 7px;padding-top:7px">
                  <el-button type="text" @click="showContractPlan">更多</el-button>
                </div>
              </div>
              <div v-else class="p-contract">
                <div class="pc-head">
                  <div>
                    <el-button :type="getStatisticParams.contractState === '1' ? 'primary': ''" size="small" @click="selectStatus('1')">计划中</el-button>
                    <el-button :type="getStatisticParams.contractState === '2' ? 'primary': ''" size="small" @click="selectStatus('2')">待审批</el-button>
                    <el-button :type="getStatisticParams.contractState === '3' ? 'primary': ''" size="small" @click="selectStatus('3')">已拒绝</el-button>
                    <el-button :type="getStatisticParams.contractState === '5' ? 'primary': ''" size="small" @click="selectStatus('5')">待生效</el-button>
                    <el-button :type="getStatisticParams.contractState === '4' ? 'primary': ''" size="small" @click="selectStatus('4')">已完成</el-button>
                    <el-button :type="getStatisticParams.contractState === '6' ? 'primary': ''" size="small" @click="selectStatus('6')">已终止</el-button>
                  </div>
                  <div><el-button v-if="getStatisticParams.contractState !== '1'" type="primary" size="small">更多</el-button></div>
                </div>
                <div>
                  <el-table
                    v-if="getStatisticParams.contractState === '1'"
                    :data="tableData"
                    style="width: 100%">
                    <el-table-column
                      prop="cname"
                      label="合同名称">
                    </el-table-column>
                    <el-table-column
                      label="姓名"
                      width="180">
                      <template slot-scope="scope">
                        <span v-if="scope.row.generalUserName">{{ scope.row.generalUserName }}</span>
                        <span v-if="scope.row.subUserName">{{ scope.row.subUserName }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="createTime"
                      label="日期"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      prop="createTime"
                      label="操作"
                      width="180">
                      <template slot-scope="scope">
                        <el-button v-if="getStatisticParams.contractState === '1'" type="text" @click="handleCheckPlaningDetails(scope.row)">查看详情</el-button>
                        <el-button v-else type="text" @click="handleCheckDetails(scope.row)">查看详情</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-table
                    v-else
                    :data="tableData"
                    style="width: 100%">
                    <el-table-column
                      prop="contractName"
                      label="合同名称">
                    </el-table-column>
                    <el-table-column
                      prop="promoter"
                      label="姓名"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      prop="createtime"
                      label="日期"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      prop="createTime"
                      label="操作"
                      width="180">
                      <template slot-scope="scope">
                        <el-button v-if="getStatisticParams.contractState === '1'" type="text" @click="handleCheckPlaningDetails(scope.row)">查看详情</el-button>
                        <el-button v-else type="text" @click="handleCheckDetails(scope.row)">查看详情</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div style="padding-left: 7px;padding-top:7px">
                    <el-button type="text" @click="showContractPlan">更多</el-button>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div>
<!--          <div class="check-more-btn" @click="checkMoreContract">{{ isExpand ? '收起' : '查看更多分公司' }}</div>-->
        </div>
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
<!--            >-->
<!--            </el-table-column>-->
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
          <div id="mine-trend" style="width: 100%;height: 100%;"></div>
        </div>
      </div> -->
      <!-- 审批趋势 -->
      <!-- <div class="approve">
        <div class="a-left">
          <div class="a-left-top">
            <span class="a-left-top-icon" />
            <span class="a-left-top-text">乙方签约主体统计</span>
          </div>
          <div id="a-left-yi-statistic" style="width: 100%;height: 100%;" />
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
          <div id="a-right-yi-trend" style="width: 100%; height: 100%;" />
        </div>
      </div> -->
    </div>
    <div v-if="!planShow">
      <contract-plan></contract-plan>
    </div>
    <div v-if="!checkDetailsShow" class="home-details">
      <check-details ref="check" :projectCode="projectCode"></check-details>
    </div>
    <div v-if="!projectMoreShow">
      <project-table :deptCode="approvalTrendParams.deptCode" />
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import contractApi from '@/api/work/contract'
import projectTable from './projectTable'
import checkDetails from './checkDetails'
import contractPlan from './contractPlan'
export default {
  name: 'Center',
  components: {
    'project-table': projectTable,
    'check-details': checkDetails,
    'contract-plan': contractPlan
  },
  data() {
    return {
      // 计划列表
      planShow: true,
      // 项目列表 更多 展示
      projectMoreShow: true,
      // 项目列表 查看详情 展示
      checkDetailsShow: true,
      projectCode: '',
      value: new Date(),
      isIndex: 0,
      // 项目列表
      projectData: [],
      approveYear: '2021',
      approveYearOptions: ['2020', '2021'],
      activeName: '0',
      tableData: [],
      allTableData: [],
      // 分公司数据
      centerTableData: [],
      approvalTrendParams: {
        deptCode: '',
        year: '2021'
      },
      // 中心权限项目列表参数
      projectListParams: {
        deptCode: '',
        pageNum: 1,
        pageSize: 10,
        requestType: '2'
      },
      classifyData: [],
      signParams: {
        deptCode: ''
      },
      // 乙方合同趋势分类选择
      partySelect: '',
      partySelectDept: {
        classifyId: 0
      },
      // 获取合同统计列表参数
      getStatisticParams: {
        contractType: '1',
        contractState: '1',
        pageNum: 1,
        pageSize: 10,
        id: null,
        deptCode: ''
      },
      isExpand: false
    }
  },
  mounted() {
    // this.initMineStatistic()
    // 获取中心权限合同列表
    this.listAllContract()
    // 获取审批趋势
    // this.listApprovalTrend()
    // 中心权限项目列表
    this.listCenterAuthList()
    this.getCenterAuthContractClassify()
    // this.getContractApprovalTrend()
    // 获取合同统计列表
    this.getContractStatisticTableData()
  },
  methods: {
    checkMoreFiliale() {
      if (this.isExpand) {
        this.isExpand = false
      } else {
        this.isExpand = true
      }
    },
    showContractPlan() {
      this.planShow = false
    },
    showProjectMoreList() {
      this.projectMoreShow = false
    },
    // 子组件 返回首页
    showProjectMore(type) {
      this.projectMoreShow = type
      this.checkDetailsShow = type
      this.planShow = type
    },
    checkDetails(type, item) {
      this.projectCode = item.projectCode
      this.projectMoreShow = type
      this.checkDetailsShow = !type
      this.addContractTypeDialogVisible = type
    },
    // 选中合同统计状态
    selectStatus(status) {
      this.getStatisticParams.contractState = status
      this.getContractStatisticTableData()
    },
    more() {
      if (this.getStatisticParams.contractState === '2' || this.getStatisticParams.contractState === '3') {
        this.$router.push({
          path: '/example1/contractApprove'
        })
      } else {
        this.$router.push({
          path: '/example1/Hetonglvyue'
        })
      }
    },
    // 获取合同统计列表
    getContractStatisticTableData() {
      contractApi.listCenterContractList(this.getStatisticParams).then(res => {
        console.log(res)
        if (res.code === 0) {
          // debugger
          this.tableData = res.data.records
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
    // 获取乙方合同审批趋势
    getContractApprovalTrend() {
      const chartDom = document.getElementById('a-right-yi-trend')
      const mineChart = echarts.init(chartDom)
      const dimensions = []
      const series = []
      const source = []
      contractApi.getContractApprovalTrend(this.partySelectDept).then(res => {
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
          // console.log(dimensions)
          // console.log(source)
          // console.log(series)
          const options = {
            legend: {
              type: 'scroll'
            },
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
    handleClick(item) {
      // debugger
      console.log(item)
      console.log(this.classifyData[Number(item.index)])
      this.activeName = item.name
      this.getStatisticParams.contractType = '' + (Number(item.name) + 1)
      if (Number(item.index) !== 0) {
        this.getStatisticParams.id = this.classifyData[Number(item.index)].id
      }
      this.getContractStatisticTableData()
    },
    // 获取合同审批趋势分类 (乙方合同审批趋势)
    getCenterAuthContractClassify() {
      contractApi.getCenterAuthContractClassify().then(res => {
        console.log(res)
        if (res.code === 0) {
          this.classifyData = res.data
          // this.classifyData.unshift({
          //   cname: '总包合同',
          //   id: '1122312321321'
          // })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 查询所有分公司合同列表
    listAllContract(deptCode) {
      const params = {
        deptCode: ''
      }
      params.deptCode = deptCode
      contractApi.listAllContract(params).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.centerTableData = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取合同审批趋势
    listApprovalTrend() {
      if (!this.approvalTrendParams.deptCode) {
        delete this.approvalTrendParams.deptCode
      }
      const chartDom = document.getElementById('mine-trend')
      const mineChart = echarts.init(chartDom)
      contractApi.listApprovalTrend(this.approvalTrendParams).then(res => {
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
    // 中心权限 项目列表
    listCenterAuthList() {
      if (!this.projectListParams.deptCode) {
        delete this.projectListParams.deptCode
      }
      contractApi.listCenterAuthList(this.projectListParams).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.projectData = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    selectItem(item, index) {
      // debugger
      this.isIndex = index
      if (item.deptName !== '全部分公司') {
        this.approvalTrendParams.deptCode = item.deptCode
        this.projectListParams.deptCode = item.deptCode
        this.signParams.deptCode = item.deptCode
        this.getStatisticParams.deptCode = item.deptCode
      } else {
        delete this.approvalTrendParams.deptCode
        delete this.projectListParams.deptCode
        delete this.signParams.deptCode
        delete this.getStatisticParams.deptCode
      }
      this.listCenterAuthList()
      this.getContractStatisticTableData()
    },
    // 合同统计 计划中查看详情
    handleCheckPlaningDetails(item) {
      this.planShow = false
    },
    // 查看详情
    handleCheckDetails(item) {
      // debugger
      this.projectCode = item.projectCode
      // this.checkDetailsShow = false
      console.log(item)
      const params = {
        contractCode: null
      }
      params.contractCode = item.contractCode
      contractApi.checkDetails(params).then(res => {
        if(res.code === 0) {
          window.open(res.data.contractUrl + '&T=' + res.data.token)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .home{
    padding: 20px;
    .home-top{
      .status{
        width: 100%;
        display: flex;
        flex-direction: column;
        .check-more-btn{
          height: 40px;
          text-align: center;
          line-height: 40px;
          color: #333333;
          font-size: 15px;
          font-weight: bolder;
          transition: font-size 2ms;
          cursor: pointer;
        }
        .check-more-btn:hover{
          color: #3A78F1;
          font-size: 17px;
        }
        .status-head{
          height: 40px;
          display: flex;
          flex-direction: row-reverse;
        }
        .notExpandHeight{
          height: 380px;
        }
        .expandHeight{
          height: auto;
        }
        ul{
          width: 100%;
          margin: 0;
          padding: 20px 0 0 0;
          list-style-type: none;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          overflow: hidden;
          transition: height 2000ms;
          .s-options-selected{
            background-color: #3A78F1;
            color: #ffffff !important;
          }
          .s-options-selected-color{
            color: #ffffff !important;
          }
          li{
            width: calc((100% - 60px) / 6);
            /*height: 144px;*/
            border-radius: 10px;
            border: 1px solid #eeeeee;
            /*background-color: #fff;*/
            box-shadow: 0px 0px 15px 0px #eeeeee;
            cursor: pointer;
            margin-right: 10px;
            margin-bottom: 10px;
            .s-box{
              width: 100%;
              height: 100%;
              display: flex;
              flex-direction: row;
            }
            .s-box-count{
              width: calc(100% - 108px);
              margin-left: 33px;
              padding-top: 32px;
              padding-bottom: 32px;
              display: flex;
              flex-direction: column;
              .sc-top{
                font-size: 18px;
                color: #000000;
                font-weight: bolder;
              }
              .sc-middle{
                font-size: 16px;
                color: #7A7C80;
                margin-top: 15px;
              }
            }
            .s-box-status{
              margin-left: 5px;
              img{
                width: 50px;
                height: 50px;
                margin-top: 32px;
              }
            }
          }
        }
      }
      .status-list{
        width: 100%;
        border-radius: 10px;
        background-color: #fff;
        box-shadow: 10px 10px 30px 10px #eeeeee;
        margin-top: 20px;
      }
      .project-list{
        width: 100%;
        border-radius: 10px;
        background-color: #fff;
        box-shadow: 0px 0px 10px -5px #eeeeee;
        border: 1px solid #eeeeee;
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
        .project-tab{
          width: 100%;
          padding: 20px 20px;
          .p-contract{
            width: 100%;
            display: flex;
            flex-direction: column;
            .pc-head{
              display: flex;
              justify-content: space-between;
              margin: 0 0 15px 0;
            }
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
    .home-details{

    }
  }
</style>
