<template>
  <div class="body-box">
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="project-progress">
          <div class="pp-top">
            <div><i class="el-icon-s-operation" /></div>
            <div class="pp-top-title">项目形象进度</div>
          </div>
          <div class="pp-middle">
            <div class="pp-m-area">总建筑面积: {{ projectProgressObject.builtArea }}</div>
            <div class="pp-m-time">开工时间: {{ projectProgressObject.startTime }}</div>
          </div>
          <div class="pp-table">
            <el-table
              size="mini"
              :data="projectProgressObject.progressTable"
              style="width: 100%"
              border>
              <el-table-column
                prop="address"
                label="MDGI楼栋编码栋号"
                width="200"
              >
              </el-table-column>
              <el-table-column
                prop="projectnum"
                label="栋号"
                width="50">
              </el-table-column>
              <el-table-column
                prop="name"
                label="建筑面积"
                width="100">
              </el-table-column>
              <el-table-column
                prop="xxjd"
                label="形象进度"
                width="200">
                <template slot-scope="scope">
                  <span v-if="scope.row.xxjd === ''">未开工</span>
                  <span v-else>{{ scope.row.xxjd }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="project-progress">
          <div class="pp-top">
            <div><i class="el-icon-s-operation" /></div>
            <div class="pp-top-title">成本与资金分析</div>
          </div>
          <div class="pp-table">
            <div id="pay-cost" style="width: 100%;height: 300px"></div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="project-progress">
          <div class="pp-top">
            <div><i class="el-icon-s-operation" /></div>
            <div class="pp-top-title">支出合同类型</div>
          </div>
          <div class="pp-table">
            <div id="pay-contract-type" style="width: 100%;height: 300px"></div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import api from '@/api/work/cockpit'
export default {
  name: "Body",
  data() {
    return {
      projectCodeParams: {
        projectCode: 'HB1-2021-001-BD'
      },
      tabPrice: {
        generalContractMoney: null,
        partyActualOutputValueA: null,
        generalContractReturn: null,
        auditOutputValueA: null,
        totalLiabilityCost: null,
        targetProfit: null,
        outputCompletion: null,
        paymentCollection: null,
        targetProfitMargin: null,
        noPay: null,
        overPay: null,
        actualMoney: null,
        reallyMoney:null,
        totalLiabilityProgress: null,
        biddingCost: null
      },
      projectProgressObject: {
        builtArea: null,
        startTime: null,
        progressTable: []
      }
    }
  },
  mounted() {
    this.getPayContractType(this.projectCodeParams.projectCode)
    this.getCockpitInfo(this.projectCodeParams.projectCode)
    this.getProjectProgress(this.projectCodeParams.projectCode)
  },
  methods: {
    getCockpitInfo(code) {
      this.projectCodeParams.projectCode = code
      api.getCockpitInfo(this.projectCodeParams).then(res => {
        if (res.code === 0) {
          console.log(res)
          if (res.data) {
            this.initCost(res.data)
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getPayContractType(code) {
      this.projectCodeParams.projectCode = code
      api.getContractTotalAndClassifyName(this.projectCodeParams).then(res => {
        if (res.code === 0) {
          // debugger
          this.initPayContractType(res.data)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取项目形象进度
    getProjectProgress(code) {
      this.projectCodeParams.projectCode = code
      api.getProjectProgress(this.projectCodeParams).then(res => {
        if (res.code === 0) {
          this.projectProgressObject.builtArea = res.data.builtArea
          this.projectProgressObject.startTime = res.data.startTime
          this.projectProgressObject.progressTable = res.data.conProjectJdbList
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 支出合同类型
    initPayContractType(data) {
      let serisOptions = []

      if (data && data.length) {
        serisOptions = data.map(item => {
          return {
            value: item.number,
            name: item.classifyName
          }
        })
      }
      let chartDom = document.getElementById('pay-contract-type')
      let myChart = echarts.init(chartDom)
      let option = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          // top: '5%',
          left: 'left'
        },
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '20',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: serisOptions
          }
        ]
      }

      myChart.setOption(option)
    },

    // 成本与资金分析
    initCost(item) {
      const arr = []

      arr.push(item.biddingCost)
      arr.push(item.totalLiabilityCost)
      arr.push(item.actualMoney)
      arr.push(item.generalContractReturn)
      arr.push(item.overPay)

      let chartDom = document.getElementById('pay-cost')
      let myChart = echarts.init(chartDom)
      let option = {
        color: ['#003366'],
        xAxis: {
          type: 'category',
          data: ['投标成本', '责任成本总额', '动态实际成本', '静态实际成本', '总包合同收入', '已付款']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: arr,
            type: 'bar'
          }
        ]
      }

      myChart.setOption(option)
    }
  }
}
</script>

<style lang="scss" scoped>
.body-box{
  width: 100%;
  padding: 15px;

  .project-progress{
    width: 100%;
    height: 350px;
    display: flex;
    flex-direction: column;
    box-shadow: 0px 0px 10px -5px #eeeeee;
    border: 1px solid #eeeeee;
    border-radius: 10px;
    .pp-top{
      display: flex;
      flex-direction: row;
      .el-icon-s-operation{
        font-size: 20px;
        font-weight: bolder;
        margin: 10px 10px 0px 10px;
      }
      .pp-top-title{
        font-size: 15px;
        font-weight: bolder;
        margin-top: 8px;
      }
    }
    .pp-middle{
      display: flex;
      justify-content: space-around;
      font-size: 15px;
      font-weight: bolder;
      margin: 10px 0px 10px 0px;
      .pp-m-area{

      }
    }
    .pp-table{
      padding: 10px;
    }
  }
}
</style>
