<template>
  <div class="c-tab">
    <div class="tab-item tab-item_selected">
      <i class="el-icon-tickets icon-size" />
      <div class="tab-item-option">
        <div class="tab-item-option-title">产值完成率</div>
        <div id="tab-item-option-chart-1" style="width: 150px;height: 150px" />
      </div>
      <div class="tab-item-value">
        <p class="tab-item-value-title">总包合同金额(万元)</p>
        <div class="tab-item-value-price">{{ tabPrice.generalContractMoney }}</div>
        <p class="tab-item-value-title">对甲实际完成产值(万元)</p>
        <div class="tab-item-value-price">{{ tabPrice.partyActualOutputValueA }}</div>
      </div>
    </div>
    <div class="tab-item">
      <i class="el-icon-tickets icon-size" />
      <div class="tab-item-option">
        <div class="tab-item-option-title">回款率</div>
        <div id="tab-item-option-chart-2" style="width: 150px;height: 150px" />
      </div>
      <div class="tab-item-value">
        <p class="tab-item-value-title">总包合同回款(万元)</p>
        <div class="tab-item-value-price">{{ tabPrice.generalContractReturn }}</div>
        <p class="tab-item-value-title">甲审产值(万元)</p>
        <div class="tab-item-value-price">{{ tabPrice.auditOutputValueA }}</div>
      </div>
    </div>
    <div class="tab-item">
      <i class="el-icon-tickets icon-size" />
      <div class="tab-item-option">
        <div class="tab-item-option-title">责任成本占比</div>
        <div id="tab-item-option-chart-3" style="width: 150px;height: 150px" />
      </div>
      <div class="tab-item-value">
        <p class="tab-item-value-title">责任成本总额(万元)</p>
        <div class="tab-item-value-price">{{ tabPrice.totalLiabilityCost }}</div>
        <p class="tab-item-value-layout-title">目标利润(万元)</p>
        <div class="tab-item-value-layout-price">{{ tabPrice.targetProfit }}</div>
        <p class="tab-item-value-layout-title">目标利润率</p>
        <div class="tab-item-value-layout-price">{{ tabPrice.targetProfitMargin + '%' }}</div>
      </div>
    </div>
    <div class="tab-item">
      <i class="el-icon-tickets icon-size" />
      <div class="tab-item-option">
        <div class="tab-item-option-title"></div>
        <div id="tab-item-option-chart-4" style="width: 150px;height: 150px" />
      </div>
      <div class="tab-item-value">
        <p class="tab-item-value-title">静态实际成本(万元)</p>
        <div class="tab-item-value-price">{{ tabPrice.actualMoney }}</div>
        <p class="tab-item-value-title">动态实际成本(万元)</p>
        <div class="tab-item-value-price">1000</div>
      </div>
    </div>
    <div class="tab-item">
      <i class="el-icon-tickets icon-size" />
      <div class="tab-item-option">
        <div class="tab-item-option-title">付款率</div>
        <div id="tab-item-option-chart-5" style="width: 150px;height: 150px" />
      </div>
      <div class="tab-item-value">
        <p class="tab-item-value-title">财务已付(万元)</p>
        <div class="tab-item-value-price">{{ tabPrice.overPay }}</div>
        <p class="tab-item-value-layout-title">财务应付(万元)</p>
        <div class="tab-item-value-layout-price">{{ tabPrice.reallyMoney }}</div>
        <p class="tab-item-value-layout-title">财务应付未付(万元)</p>
        <div class="tab-item-value-layout-price">{{ tabPrice.noPay }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import api from '@/api/work/cockpit'
export default {
  name: "Tab",
  props: {
    projectCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
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
      projectCodeParams: {
        projectCode: 'HB1-2021-001-BD'
      }
    }
  },
  mounted() {
    // this.init()
    this.getCockpitInfo(this.projectCodeParams.projectCode)
    this.initProductionValue()
  },
  methods: {
    init() {
      let cockPitInfo = this.getCockpitInfo()
      let p = Promise.all([cockPitInfo])

      p.then(res => {
        console.log(res)
        if (res.length) {
          let [cockPitInfoRes] = res
        }
      })
    },
    // 静态实际成本
    initStaticPay(item) {
      let data = []
      data.push(item.actualMoney)
      data.push(200)
      let chartDom = document.getElementById('tab-item-option-chart-4')
      let myChart = echarts.init(chartDom)
      let option = {
        color: ['#003366', '#4cabce'],
        legend: {
          show: false
        },
        xAxis: {
          show: false
        },
        yAxis: {
          show: false,
          type: 'category',
          data: ['静态实际成本', '动态实际成本'],
          inverse: true,
          animationDuration: 300,
          animationDurationUpdate: 300,
          max: 1
        },
        series: [
          {
            realtimeSort: true,
            name: '静态实际成本',
            type: 'bar',
            data: data,
            label: {
              show: true,
              position: 'right',
              valueAnimation: true
            }
          }
        ]
      }

      myChart.setOption(option)
    },
    // 责任成本占比
    initTotalLiabilityCost(data) {
      let chartDom = document.getElementById('tab-item-option-chart-3')
      let myChart = echarts.init(chartDom)
      let option = {
        color: ['#5470c6', '#eeeeee'],
        tooltip: {
          trigger: 'item',
          show: false
        },
        legend: {
          show: false
        },
        series: [
          {
            name: 'Access From',
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
                fontSize: '10',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: Number(data), name: data + '%' },
              { value: 100 - Number(data), name: (100 - Number(data)) + '%' }
            ]
          }
        ]
      }
      myChart.setOption(option)
    },
    // 付款率
    initPay(data) {
      let chartDom = document.getElementById('tab-item-option-chart-5')
      let myChart = echarts.init(chartDom)
      let option = {
        color: ['#5470c6', '#eeeeee'],
        tooltip: {
          trigger: 'item',
          show: false
        },
        legend: {
          show: false
        },
        series: [
          {
            name: 'Access From',
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
                fontSize: '10',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: Number(data), name: data + '%' },
              { value: 100 - Number(data), name: (100 - Number(data)) + '%' }
            ]
          }
        ]
      }
      myChart.setOption(option)
    },
    // 回款率
    initPaymentCollection(data) {
      let chartDom = document.getElementById('tab-item-option-chart-2')
      let myChart = echarts.init(chartDom)
      let option = {
        color: ['#5470c6', '#eeeeee'],
        tooltip: {
          trigger: 'item',
          show: false
        },
        legend: {
          show: false
        },
        series: [
          {
            name: 'Access From',
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
                fontSize: '10',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: Number(data), name: data + '%' },
              { value: 100 - Number(data), name: (100 - Number(data)) + '%' }
            ]
          }
        ]
      }
      myChart.setOption(option)
    },
    // 获取产值完成率
    initProductionValue(data) {
      let chartDom = document.getElementById('tab-item-option-chart-1')
      let myChart = echarts.init(chartDom)
      let option = {
        color: ['#5470c6', '#eeeeee'],
        tooltip: {
          trigger: 'item',
          show: false
        },
        legend: {
          show: false
        },
        series: [
          {
            name: 'Access From',
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
                fontSize: '10',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: Number(data), name: data + '%' },
              { value: 100 - Number(data), name: (100 - Number(data)) + '%' }
            ]
          }
        ]
      }
      myChart.setOption(option)
    },

    getCockpitInfo(code) {
      this.projectCodeParams.projectCode = code
      api.getCockpitInfo(this.projectCodeParams).then(res => {
        if (res.code === 0) {
          console.log(res)
          if (res.data) {
            this.tabPrice.generalContractMoney = res.data.generalContractMoney
            this.tabPrice.partyActualOutputValueA = res.data.partyActualOutputValueA
            this.tabPrice.generalContractReturn = res.data.generalContractReturn
            this.tabPrice.auditOutputValueA = res.data.auditOutputValueA
            this.tabPrice.totalLiabilityCost = res.data.totalLiabilityCost
            this.tabPrice.targetProfit = res.data.targetProfit
            this.tabPrice.outputCompletion = res.data.outputCompletion
            this.tabPrice.paymentCollection = res.data.paymentCollection
            this.tabPrice.targetProfitMargin = res.data.targetProfitMargin
            this.tabPrice.noPay = res.data.noPay
            this.tabPrice.overPay = res.data.overPay
            this.tabPrice.actualMoney = res.data.actualMoney
            this.tabPrice.reallyMoney = res.data.reallyMoney
            this.tabPrice.totalLiabilityProgress = res.data.totalLiabilityProgress
            this.tabPrice.biddingCost = res.data.biddingCost

            this.initProductionValue(res.data.outputCompletion)
            this.initPaymentCollection(res.data.paymentCollection)
            // 责任成本占比
            this.initTotalLiabilityCost(res.data.totalLiabilityProgress)
            // 静态实际成本
            this.initStaticPay(res.data)
            // 付款率
            this.initPay(res.data.paymentCollection)
          }
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.c-tab{
  width: 100%;
  display: flex;
  flex-direction: row;
  padding: 15px;
  .tab-item_selected{
    box-shadow: 0px 0px 15px -5px #eeeeee !important;
  }
  .tab-item{
    width: calc((100% - 60px) / 5);
    height: 200px;
    margin-right: 15px;
    position: relative;
    display: flex;
    flex-direction: row;
    box-shadow: 0px 0px 10px -5px #eeeeee;
    border: 1px solid #eeeeee;
    border-radius: 10px;
    .icon-size{
      font-size: 20px;
      font-weight: bolder;
      position: absolute;
      top: 10px;
      left: 10px;
    }
    .tab-item-option{
      display: flex;
      flex-direction: column;
      .tab-item-option-title{
        font-size: 15px;
        color: #333333;
        margin: 30px 20px 10px 40px;
        font-weight: bolder;
      }
      .tab-item-option-chart-1{

      }
    }
    .tab-item-value{
      display: flex;
      flex-direction: column;
      .tab-item-value-title{
        font-size: 14px;
        font-weight: bolder;
        margin: 25px 0px 0px 0px;
      }
      .tab-item-value-price{
        font-size: 17px;
        font-weight: bolder;
        color: #333333;
        margin: 5px 0px 0px 0px;
      }
      .tab-item-value-layout-title{
        font-size: 14px;
        font-weight: bolder;
        margin: 5px 0px 0px 0px;
      }
      .tab-item-value-layout-price{
        font-size: 17px;
        font-weight: bolder;
        color: #333333;
        margin: 5px 0px 0px 0px;
      }
    }
  }
  .tab-item:last-child{
    margin-right: 0 !important;
  }
}
</style>
