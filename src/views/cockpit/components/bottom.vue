<template>
  <div class="bottom">
    <el-row :gutter="20">
      <el-col :span="16">
        <div class="project-progress">
          <div class="pp-top">
            <div><i class="el-icon-s-operation" /></div>
            <div class="pp-top-title">成本对比分析</div>
          </div>
          <div class="pp-table">
            <div id="costAnalysis" style="width: 100%; height: 300px" />
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="project-progress">
          <div class="pp-top">
            <div><i class="el-icon-s-operation" /></div>
            <div class="pp-top-title">实际成本占比</div>
          </div>
          <div class="pp-table">
            <div id="realCostAnalysis" style="width: 50%; height: 300px" />
            <div class="real-list">
              <ul>
                <li v-for="(item, index) in seriesActualMoney" :key="index">
                  <span class="li-percent">{{ item.percent + '%' }}</span>
                  <span class="li-actual">{{ item.actualMoney + '万元' }}</span>
                  <span class="li-money">{{ item.money + '元/m2' }}</span>
                </li>
              </ul>
            </div>
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
  name: "Bottom",
  data() {
    return {
      projectCodeParams: {
        projectCode: 'HB1-2021-001-BD'
      },
      eCharts: require('echarts'),
      seriesActualMoney: []
    }
  },
  mounted() {
    this.getCostAnalysisList(this.projectCodeParams.projectCode)
  },
  methods: {
    getCostAnalysisList(code) {
      // console.log(code)
      // debugger
      this.projectCodeParams.projectCode = code
      api.getCostAnalysisList(this.projectCodeParams).then(res => {
        if (res.code === 0) {
          this.initCostAnalysisECharts(res.data)
          this.initRealCostAnalysisECharts(res.data)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 成本对比分析 eCharts
    initCostAnalysisECharts(data) {
      const aXisOptions = []
      const seriesArr = []
      const seriesOptions = ['type']
      const actualMoney = ['静态实际成本']
      const reallyPay = ['财务应付']
      const overPay = ['财务已付']

      const seriesActualMoney = actualMoney
      const seriesReallyPay = reallyPay
      const seriesOverPay = overPay

      const percent = []
      const money = []


      if (data !== null) {

        seriesOptions.push(data.analysisDtoA.subjectName)
        actualMoney.push(data.analysisDtoA.actualMoney)
        reallyPay.push(data.analysisDtoA.reallyPay)
        overPay.push(data.analysisDtoA.overPay)
        aXisOptions.push(data.analysisDtoA.subjectName)
        percent.push(data.actualDto.percentA)
        money.push(data.actualDto.moneyA)

        seriesOptions.push(data.analysisDtoB.subjectName)
        actualMoney.push(data.analysisDtoB.actualMoney)
        reallyPay.push(data.analysisDtoB.reallyPay)
        overPay.push(data.analysisDtoB.overPay)
        aXisOptions.push(data.analysisDtoB.subjectName)
        percent.push(data.actualDto.percentB)
        money.push(data.actualDto.moneyB)

        seriesOptions.push(data.analysisDtoC.subjectName)
        actualMoney.push(data.analysisDtoC.actualMoney)
        reallyPay.push(data.analysisDtoC.reallyPay)
        overPay.push(data.analysisDtoC.overPay)
        aXisOptions.push(data.analysisDtoC.subjectName)
        percent.push(data.actualDto.percentC)
        money.push(data.actualDto.moneyC)

        seriesOptions.push(data.analysisDtoD.subjectName)
        actualMoney.push(data.analysisDtoD.actualMoney)
        reallyPay.push(data.analysisDtoD.reallyPay)
        overPay.push(data.analysisDtoD.overPay)
        aXisOptions.push(data.analysisDtoD.subjectName)
        percent.push(data.actualDto.percentD)
        money.push(data.actualDto.moneyD)

        seriesOptions.push(data.analysisDtoE.subjectName)
        actualMoney.push(data.analysisDtoE.actualMoney)
        reallyPay.push(data.analysisDtoE.reallyPay)
        overPay.push(data.analysisDtoE.overPay)
        aXisOptions.push(data.analysisDtoE.subjectName)
        percent.push(data.actualDto.percentE)
        money.push(data.actualDto.moneyE)

        seriesOptions.push(data.analysisDtoF.subjectName)
        actualMoney.push(data.analysisDtoF.actualMoney)
        reallyPay.push(data.analysisDtoF.reallyPay)
        overPay.push(data.analysisDtoF.overPay)
        aXisOptions.push(data.analysisDtoF.subjectName)
        percent.push(data.actualDto.percentF)
        money.push(data.actualDto.moneyF)

        seriesOptions.push(data.analysisDtoG.subjectName)
        actualMoney.push(data.analysisDtoG.actualMoney)
        reallyPay.push(data.analysisDtoG.reallyPay)
        overPay.push(data.analysisDtoG.overPay)
        aXisOptions.push(data.analysisDtoG.subjectName)
        percent.push(data.actualDto.percentG)
        money.push(data.actualDto.moneyG)

      }

      seriesArr.push(seriesOptions)
      seriesArr.push(actualMoney)
      seriesArr.push(reallyPay)
      seriesArr.push(overPay)

      seriesActualMoney.shift()
      seriesReallyPay.shift()
      seriesOverPay.shift()

      this.seriesActualMoney = seriesActualMoney.map((item, index) => {
        return {
          percent: percent[index],
          actualMoney: item,
          money: money[index]
        }
      })


      let chartDom = document.getElementById('costAnalysis')
      let myChart = echarts.init(chartDom)

      let option = {
        color: ['#003366', '#006699', '#4cabce'],
        dataset: {
          source: seriesArr
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['静态实际成本', '财务应付', '财务已付']
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar', 'stack'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        xAxis: [
          {
            type: 'category',
            axisTick: { show: false },
            data: aXisOptions
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '静态实际成本',
            type: 'bar',
            data: seriesActualMoney
          },
          {
            name: '财务应付',
            type: 'bar',
            data: seriesReallyPay
          },
          {
            name: '财务已付',
            type: 'bar',
            data: seriesOverPay
          }
        ]
      }

      myChart.setOption(option)
    },

    // 实际成本分析 eCharts
    initRealCostAnalysisECharts(data) {
      const aXisOptions = []
      const seriesOptions = []

      if (data !== null) {
        seriesOptions.push({
          value: data.actualDto.percentA,
          name: data.analysisDtoA.subjectName
        })
        seriesOptions.push({
          value: data.actualDto.percentB,
          name: data.analysisDtoB.subjectName
        })
        seriesOptions.push({
          value: data.actualDto.percentC,
          name: data.analysisDtoC.subjectName
        })
        seriesOptions.push({
          value: data.actualDto.percentD,
          name: data.analysisDtoD.subjectName
        })
        seriesOptions.push({
          value: data.actualDto.percentE,
          name: data.analysisDtoE.subjectName
        })
        seriesOptions.push({
          value: data.actualDto.percentF,
          name: data.analysisDtoF.subjectName
        })
        seriesOptions.push({
          value: data.actualDto.percentG,
          name: data.analysisDtoG.subjectName
        })
      }

      let chartDom = document.getElementById('realCostAnalysis')
      let myChart = echarts.init(chartDom)
      let option = {
        title: {
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'right',
          itemWidth: 15,
          itemHeight: 10
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '45%',
            label: {
              normal: {
                show: false,
                position: 'center'
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: seriesOptions,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }

      myChart.setOption(option)
    }
  }
}
</script>

<style lang="scss" scoped>
.bottom{
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
        margin-top: 10px;
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
      display: flex;
      flex-direction: row;
      .real-list{
        width: 50%;
        display: flex;
        flex-direction: column;
        padding-left: 20px;
        ul{
          margin: 0;
          padding: 0;
          list-style-type: none;
          li{
            display: flex;
            flex-direction: row;
            span{
              width: 60px;
              color: #333333;
              font-size: 12px;
              text-align: center;
              margin-bottom: 15px;
            }
          }
        }
      }
    }
  }
}
</style>
