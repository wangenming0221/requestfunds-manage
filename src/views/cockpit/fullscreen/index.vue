<template>
  <div class="contain containCockpit">
    <div class="cc-top">
      <div class="cc-top-right">
        <div class="cc-top-r-select">
          <el-cascader
            popper-class= "cockpit-cascader-popper"
            class="cc-cas"
            v-model:value="requestProjectValue"
            :show-all-levels="false"
            :options="requestProjectOptions"
            :props="{ label: 'deptName', value: 'projectCode', children: 'children' }"
            placeholder="请选择项目"
            style="width: 100%"
            @change="handleRequestProjectValueChange"
          />
         <!-- <a-cascader
            class="cc-cas"
            v-model:value="requestProjectValue"
            :show-all-levels="false"
            :options="requestProjectOptions"
            :field-names="{ label: 'deptName', value: 'projectCode', children: 'children' }"
            placeholder="请选择项目"
            style="width: 100%"
            @change="handleRequestProjectValueChange"
          /> -->
        </div>
        <div class="screen-icon" @click="showFullScreen">
          <img src="../../../assets/images/bi_screen_icon.png" alt="">
        </div>
      </div>
    </div>
    <div class="cc-head">
      <!-- 产值完成率 -->
      <div class="cc-h-item">
        <!-- <div class="chi-left">
          <div id="tab-item-option-chart-1" style="width: 132px;height: 98px" />
          <div class="chi-title">产值完成率</div>
        </div> -->
        <div class="chi-right"  style="margin:0 auto">
          <div class="cr-layout" @click="toProject()">
            <span class="cl-icon" style="margin-top: 30px">总包合同金额(万元)</span>
            <span class="ci-value">{{ tabPrice.generalContractMoney }}</span>
          </div>
          <div class="cr-layout">
            <span class="cl-icon" style="margin-top: 20px">对甲实际完成产值(万元)</span>
            <span class="ci-value">{{ tabPrice.partyActualOutputValueA }}</span>
          </div>
        </div>
        <div class="chi-right"  style="margin:0 auto">
          <div class="cr-layout" >
            <span class="cl-icon" style="margin-top: 30px">总包合同完成率</span>
            <span class="ci-value">{{ tabPrice.generalContractCompletionRate + '%' }}</span>
          </div>
          <div class="cr-layout" >
            <span class="cl-icon" style="margin-top: 20px">产值回款率</span>
            <span class="ci-value">{{ tabPrice.contractReturnRate + '%' }}</span>
          </div>
        </div>
      </div>
      <!-- 回款率 -->
      <div class="cc-h-item">
        <!-- <div class="chi-left">
          <div id="tab-item-option-chart-2" style="width: 132px;height: 98px" />
          <div class="chi-title">回款率</div>
        </div> -->
        <div class="chi-right">
          <div class="cr-layout">
            <span class="cl-icon" style="margin-top: 30px">营收(万元)</span>
            <span class="ci-value">{{ tabPrice.generalContractReturn }}</span>
          </div>
          <div class="cr-layout">
            <span class="cl-icon" style="margin-top: 20px">甲审产值(万元)</span>
            <span class="ci-value">{{ tabPrice.auditOutputValueA }}</span>
          </div>
        </div>
        <div class="chi-right">
          <div class="cr-layout">
            <span class="cl-icon" style="margin-top: 30px">合同回款率</span>
            <span class="ci-value">{{ tabPrice.contractPaymentCollection + '%' }}</span>
          </div>
          <div class="cr-layout">
            <span class="cl-icon" style="margin-top: 20px">甲审产值回款率</span>
            <span class="ci-value">{{ tabPrice.outputPaymentCollection + '%' }}</span>
          </div>
        </div>
      </div>
      <!-- 责任成本占比 -->
      <div class="cc-h-item">
        <!-- <div class="chi-left">
          <div id="tab-item-option-chart-3" style="width: 132px;height: 98px" />
          <div class="chi-title">责任成本占比</div>
        </div> -->
        <div class="chi-right">
          <div class="cr-layout">
            <span class="cl-icon" style="margin-top: 30px">责任成本总额(万元)</span>
            <span class="ci-value">{{ tabPrice.totalLiabilityCost }}</span>
          </div>
          <div class="cr-layout">
            <span class="cl-icon" style="margin-top: 20px">目标利润(万元)</span>
            <span class="ci-value">{{ tabPrice.targetProfit }}</span>
          </div>

        </div>
        <div class="chi-right">

          <div class="cr-layout">
            <span class="cl-icon" style="margin-top: 102px">目标利润率(万元)</span>
            <span class="ci-value">{{ tabPrice.targetProfitMargin + '%' }}</span>
          </div>
        </div>
      </div>
      <!-- 静态、动态 -->
      <div class="cc-h-item">
        <div class="chi-right" style="margin:0 auto">
          <div class="cr-layout">
            <span class="cl-icon" style="margin-top: 30px">静态实际成本(万元)</span>
            <span class="ci-values">{{ tabPrice.actualMoney| formatThousands }}</span>
          </div>
          <div class="cr-layout">
            <span class="cl-icon" style="margin-top: 20px">静态实际利润(万元)</span>
            <span class="ci-values">{{ actualProfit| formatThousands }}</span>
          </div>
        </div>
      </div>
      <!-- 付款率 -->
      <div class="cc-h-item">
        <!-- <div class="chi-left">
          <div id="tab-item-option-chart-5" style="width: 132px;height: 98px" />
          <div class="chi-title">付款率</div>
        </div> -->
        <div class="chi-right">
          <div class="cr-layout" style="cursor: pointer" @click="toPay(0)">
            <span class="cl-icon" style="margin-top: 30px">财务已付(万元)</span>
            <span class="ci-value">{{ tabPrice.overPay }}</span>
          </div>
          <div class="cr-layout" style="cursor: pointer" @click="toPay(1)">
            <span class="cl-icon" style="margin-top: 20px">财务应付(万元)</span>
            <span class="ci-value">{{ tabPrice.reallyMoney }}</span>
          </div>

        </div>
        <div class="chi-right">
          <div class="cr-layout" style="cursor: pointer">
            <span class="cl-icon" style="margin-top: 30px">付款率</span>
            <span class="ci-value">{{ tabPrice.ifPayProgress + '%'}}</span>
          </div>

          <div class="cr-layout">
            <span class="cl-icon" style="margin-top: 20px">财务应付未付(万元)</span>
            <span class="ci-value">{{ tabPrice.noPay }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="c-body">
      <div class="cb-box" style="margin-right: 20px">
        <div class="cb-top">
          <span class="cbt-icon">
            <img src="../../../assets/images/bi_icon.png" alt="">
          </span>
          <span class="cbt-title">项目形象进度</span>
          <span class="cbt-title" style="margin-left: auto;">上报时间2022-05-01</span>
        </div>
        <div class="cb-btm">
          <div class="cbm-top">
            <div class="cbm-t-1">
              <el-image :src="projectImage1" :preview-src-list="srcList"></el-image>
            </div>
            <div class="cbm-t-1">
              <el-image :src="projectImage2" :preview-src-list="srcList"></el-image>
            </div>
          </div>
          <div class="cbm-list">
            <marquee direction = up  scrollamount=1>
              26#楼：屋面机房混凝土浇筑完成，外架拆除完成。</br>
              27#楼：基础浇筑完成，地下一层墙柱浇筑完成。</br>
              28#楼：一层顶板浇筑完成。</br>
              29#楼：屋面机房浇筑完成，外架拆除完成，砌筑2-15层完成。</br>
              30#楼：屋面机房浇筑完成，外架拆除完成，砌筑2-12层完成。</br>
              31#楼：17层顶板浇筑完成。</br>
              32#楼：12层顶板浇筑完成。</br>
              车库：剩余约1000平方底板浇筑完成，墙柱梁顶板正在支模；其他部分顶板全部浇筑完成。</br>
            </marquee>
          </div>
        </div>
      </div>
      <div class="cb-box" style="margin-right: 20px">
        <div class="cb-top">
          <span class="cbt-icon">
            <img src="../../../assets/images/bi_icon.png" alt="">
          </span>
          <span class="cbt-title">成本与资金分析(万元)</span>
        </div>
        <div class="cb-btm">
<!--          <dv-conical-column-chart :config="config" style="width:400px;height:300px;" />-->
          <div id="pay-cost" style="width: 100%;height: 300px"></div>
        </div>
      </div>
      <div class="cb-box">
        <div class="cb-top">
          <span class="cbt-icon">
            <img src="../../../assets/images/bi_icon.png" alt="">
          </span>
          <span class="cbt-title">支出合同类型</span>
        </div>
        <div class="cb-btm">
<!--          <div ref="chart" style="width: 100%;height: 300px"></div>-->
          <div id="pay-contract-type" style="width: 100%;height: 300px"></div>
        </div>
      </div>
    </div>

    <el-row :gutter="20">
      <el-col :span="16" style="padding: 0px 15px 15px 25px">
        <div class="cb-box-1">
          <div class="cb-top">
            <span class="cbt-icon">
              <img src="../../../assets/images/bi_icon.png" alt="">
            </span>
            <span class="cbt-title">成本对比分析</span>
          </div>
          <div class="cb-btm">
            <div id="costAnalysis" style="width: 100%; height: 300px" />
          </div>
        </div>
      </el-col>
      <el-col :span="8" style="padding: 0px 25px 15px 5px">
        <div class="cb-box-2">
          <div class="cb-top">
            <span class="cbt-icon">
              <img src="../../../assets/images/bi_icon.png" alt="">
            </span>
            <span class="cbt-title">实际成本占比( 合计：{{seriesActualMoney.actualMoney| formatThousands}}万元--{{seriesActualMoney.money| formatThousands}}元/m2)</span>
          </div>
          <div class="cb-btm">
            <div id="realCostAnalysis" style="width: 50%; height: 300px" />
            <div class="real-list">
              <ul>
                <li v-for="(item, index) in seriesActualMoney.arr" :key="index">
                  <span class="li-percent" style="color: #FFFFFF">{{ item.percent + '%' }}</span>
                  <span class="li-actual" style="color: #3BFDFF">{{ item.actualMoney + '万元' }}</span>
                  <span class="li-money" style="color: #D9E7FF">{{ item.money + '元/m2' }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-dialog
      :title="costAnalysisTitle"
      :visible.sync="machineDialogVisible"
      width="45%"
      top="200px"
      :before-close="handleMachineClose">
      <span class="slot-title" slot="title">
        <span class="st-icon">
          <img src="../../../assets/images/bi_icon.png" alt="">
        </span>
        <span class="st-title">{{ costAnalysisTitle }}</span>
      </span>
      <div class="d-box">
        <div id="costDetailAnalysis" style="width: 100%; height: 300px" />
      </div>
    </el-dialog>
    <el-dialog
      title="税金成本分析"
      :visible.sync="taxDialogVisible"
      width="600px"
      top="200px"
      :before-close="handletaxClose">
      <span class="slot-title" slot="title">
        <span class="st-icon">
          <img src="../../../assets/images/bi_icon.png" alt="">
        </span>
        <span class="st-title">税金成本分析</span>
      </span>
      <div class="d-box">
        <div style="color:#fff;display:flex; justify-content:space-between;">
          <div>税金合计：{{taxList.jxSjhj | formatThousands}}</div>
          <div>整体税负：{{taxList.ztsf | formatThousands}}</div>
        </div >
        <div style="color:#fff;margin-bottom: 10px;">明细表(元)</div>
        <div  style="width: 100%;height:300px;color:#fff;overflow:auto;" >

          <table border="1" width ="510">
            <tr><td>开票金额</td><td>{{taxList.xxKpje | formatThousands}}</td></tr>
            <tr><td>不含税金额</td><td>{{taxList.xxBhsje | formatThousands}}</td></tr>
            <tr><td>销项税</td><td>{{taxList.xxXxs | formatThousands}}</td></tr>
            <tr><td>分包抵扣金额</td><td>{{taxList.xxFbdkje | formatThousands}}</td></tr>
            <tr><td>预缴增值税（2%）</td><td>{{taxList.xxZzs | formatThousands}}</td></tr>
            <tr><td>预缴城建税（7%/5%）</td><td>{{taxList.xxCjs | formatThousands}}</td></tr>
            <tr><td>预缴教育费附加（3%）</td><td>{{taxList.xxJyffj | formatThousands}}</td></tr>
            <tr><td>预缴地方教育附加（2%）</td><td>{{taxList.xxDfjyfj | formatThousands}}</td></tr>
            <tr><td>预缴企业所得税（0.2%）</td><td>{{taxList.xxQysds | formatThousands}}</td></tr>
            <tr><td>预缴印花税（0.03%）</td><td>{{taxList.xxYhs | formatThousands}}</td></tr>
            <tr><td>预缴堤围费</td><td>{{taxList.xxYjDws | formatThousands}}</td></tr>
            <tr><td>预缴资源税</td><td>{{taxList.xxYjZys | formatThousands}}</td></tr>
            <tr><td>预缴个税</td><td>{{taxList.xxYjGs | formatThousands}}</td></tr>
            <tr><td>预缴环境保护税</td><td>{{taxList.xxYjHbs | formatThousands}}</td></tr>
            <tr><td>预缴其他税费</td><td>{{taxList.xxQt | formatThousands}}</td></tr>
            <tr><td>预缴合计</td><td>{{taxList.xxYjhj | formatThousands}}</td></tr>
            <tr><td>进项税额</td><td>{{taxList.jxJxse | formatThousands}}</td></tr>
            <tr><td>增值税</td><td>{{taxList.jxZzs | formatThousands }}</td></tr>
            <tr><td>城建税（7%）</td><td>{{taxList.jxCjs | formatThousands}}</td></tr>
            <tr><td>教育费附加（3%）</td><td>{{taxList.jxJyffj | formatThousands}}</td></tr>
            <tr><td>地方教育附加（2%）</td><td>{{taxList.jxDfjyfj | formatThousands}}</td></tr>
            <tr><td>企业所得税（18年前1.8%，18年后按0.8%）</td><td>{{taxList.jxQysds | formatThousands}}</td></tr>
            <tr><td>印花税（0.03%）</td><td>{{taxList.jxYhs | formatThousands}}</td></tr>
            <tr><td>申报合计</td><td>{{taxList.jxSbhj | formatThousands}}</td></tr>
            <tr><td>税金合计</td><td>{{taxList.jxSjhj | formatThousands}}</td></tr>
            <tr><td>增值税税负</td><td>{{taxList.zzssf | formatThousands }}</td></tr>
            <tr><td>整体税负</td><td>{{taxList.ztsf | formatThousands }}</td></tr>
          </table>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import projectImage1 from '../../../assets/images/project-image1.jpg'
import projectImage2 from '../../../assets/images/project-image2.jpg'
import screenfull from "screenfull"
import api from '@/api/work/cockpit'
import * as echarts from "echarts"
// import 'echarts-gl'
import { getPie3D, getParametricEquation } from '@/utils/chart'
import qSelect from "./components/qSelect"
import Treeselect from "@riophae/vue-treeselect"
import "@riophae/vue-treeselect/dist/vue-treeselect.css"
import numTool from '@/utils/numTool'
// 引入 highcharts
import Highcharts from 'highcharts/highstock';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsDrilldown from 'highcharts/modules/drilldown';
import Highcharts3D from 'highcharts/highcharts-3d';
import Highmaps from 'highcharts/modules/map';

HighchartsMore(Highcharts)
HighchartsDrilldown(Highcharts);
Highcharts3D(Highcharts);
Highmaps(Highcharts);

export default {
  name: "index",
  components: {
    'q-select': qSelect,
    'treeselect': Treeselect
  },
  data() {
    return {
      // 产值完成率
      productValueConfig: {
        data: [],
        lineWidth: 5
      },
      //项目形象图片
      srcList: [
                projectImage1,
                projectImage2
              ],
      projectImage1 :projectImage1,
      projectImage2 :projectImage2,
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
        projectCode:'HB1-2021-001-BD'
        // projectCode: 'DB-2021-010-HHHT'
      },
      projectProgressObject: {
        builtArea: null,
        startTime: null,
        progressTable: []
      },
      seriesActualMoney: {
        arr:[],
        actualMoney:0,
        money:0
      },
      machineDialogVisible: false,
      // 成本对比分析 弹窗标题
      costAnalysisTitle: '',
      config: {
        data: [],
        img: []
      },
      // 成本对比分析 id 列表
      idList: [],
      requestProjectValue: ['', null, 'HB1-2021-001-BD'],
      requestProjectOptions: [],
      defaultProps: {
        label: 'deptName',
        children: 'children',
        value: 'projectCode'
      },
      optionData: [],
      option: {},
      statusChart: [],
      actualMoneyPercent: 0,
      costAnalysisList:[],
      routerContractType:'',
      taxList:[],
      taxDialogVisible:false
    }
  },
  computed:{
    actualProfit:function(){
      let actualMoney = parseFloat(this.tabPrice.actualMoney)||0;
      let partyActualOutputValueA;
      if(this.tabPrice.partyActualOutputValueA){
        partyActualOutputValueA = parseFloat(this.tabPrice.partyActualOutputValueA.replace(/,/g,''))
      }else{
        partyActualOutputValueA = 0;
      }
      let actualProfit = partyActualOutputValueA - actualMoney;
      return actualProfit.toFixed(2);
    }
  },
  mounted() {
    this.getDeptAndProjectTree()
    this.getCockpitInfo();
    this.queryTwoSubject();
    this.getProjectProgress()
    this.getCostAnalysisList()
    this.getPayContractType();

    screenfull.on('change', this.escExit);
  },

  beforeDestroy(){
    screenfull.off('change',this.escExit);
  },

  created() {

  },
  methods: {
    escExit(){
      let element = document.querySelector('.containCockpit');

      if (element&&element.style.position == 'fixed'&&!screenfull.isFullscreen) {
        element.style.position = 'static';
        element.style['z-index'] = 0;
        element.style.height = 'auto';
      }
    },

    queryTwoSubject(){
      api.queryTwoSubject(this.projectCodeParams).then(res => {
        if (res.code === 0) {
          if (res.data) {
            this.initCostAnalysisECharts(res.data);
            this.initRealCostAnalysisECharts(res.data);

          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    toPay(item) {
      this.$router.push({
        path: '/collectionPayment/'+process.env.VUE_APP_ENV_BPM+'.jiuzhangdigit.com/application/paymentManagement/application-list/yfsqd',

      })
    },
    toProject(){
      this.$router.push({
        path: '/contract/list',
        query:{
          projectCode:this.projectCodeParams.projectCode,
          contractType:'detail',
          from:'cockpit'
        }
      });
    },
    normalizer(node) {
      console.log(node, 111)
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.deptName,
        children: node.children
      }
    },
    showFullScreen() {
      if (!screenfull.isEnabled) {
        this.$message({ message: '你的浏览器不支持全屏', type: 'warning' })
        return false
      }
      let element = document.querySelector('.contain');

      if(!screenfull.isFullscreen){

        element.style.position = 'fixed';
        element.style.left = 0;
        element.style.top = 0;
        element.style['z-index'] = 9999;
        element.style.height = '100vh';


      }else{
        element.style.position = 'static';
        element.style['z-index'] = 0;
        element.style.height = 'auto';
      }
      screenfull.toggle();


    },
    // 初始化label
    setLabel () {
      this.optionData.forEach((item, index) => {
        item.itemStyle = {
          color: color[index]
        }
        item.label = {
          normal: {
            show: true,
            color: color[index],
            formatter: [
              '{b|{b}}',
              '{c|{c}}{b|台}',
              '{d|{d}%}'
            ].join('\n'), // 用\n来换行
            rich: {
              b: {
                color: '#fff',
                lineHeight: 25,
                align: 'left'
              },
              c: {
                fontSize: 22,
                color: '#fff',
                textShadowColor: '#1c90a6',
                textShadowOffsetX: 0,
                textShadowOffsetY: 2,
                textShadowBlur: 5
              },
              d: {
                color: color[index],
                align: 'left'
              }
            }
          }
        }
        item.labelLine = {
          normal: {
            lineStyle: {
              width: 1,
              color: 'rgba(255,255,255,0.7)'
            }
          }
        }
      })
    },
    // 图表初始化
    initChart () {
      this.statusChart = echarts.init(this.$refs.chart)
      console.log('111', this.optionData)
      // 传入数据生成 option, 构建3d饼状图, 参数工具文件已经备注的很详细
      this.option = getPie3D(this.optionData, 0.8, 240, 28, 26, 0.5)
      this.statusChart.setOption(this.option)
      // 是否需要label指引线，如果要就添加一个透明的2d饼状图并调整角度使得labelLine和3d的饼状图对齐，并再次setOption
      this.option.series.push({
        name: '电梯状态', //自己根据场景修改
        backgroundColor: 'transparent',
        type: 'pie',
        label: {
          opacity: 1,
          fontSize: 13,
          lineHeight: 20
        },
        startAngle: -40, // 起始角度，支持范围[0, 360]。
        clockwise: false, // 饼图的扇区是否是顺时针排布。上述这两项配置主要是为了对齐3d的样式
        radius: ['20%', '50%'],
        center: ['50%', '50%'],
        data: this.optionData,
        itemStyle: {
          opacity: 0  //这里必须是0，不然2d的图会覆盖在表面
        }
      })
      this.statusChart.setOption(this.option)
      this.bindListen(this.statusChart)
    },
    // 监听鼠标事件，实现饼图选中效果（单选），近似实现高亮（放大）效果。
    // optionName是防止有多个图表进行定向option传递，单个图表可以不传，默认是opiton
    bindListen (myChart, optionName = 'option') {
      let selectedIndex = ''
      let hoveredIndex = ''
      // 监听点击事件，实现选中效果（单选）
      myChart.on('click', (params) => {
        // 从 option.series 中读取重新渲染扇形所需的参数，将是否选中取反。
        const isSelected = !this[optionName].series[params.seriesIndex].pieStatus
          .selected
        const isHovered =
          this[optionName].series[params.seriesIndex].pieStatus.hovered
        const k = this[optionName].series[params.seriesIndex].pieStatus.k
        const startRatio =
          this[optionName].series[params.seriesIndex].pieData.startRatio
        const endRatio =
          this[optionName].series[params.seriesIndex].pieData.endRatio
        // 如果之前选中过其他扇形，将其取消选中（对 option 更新）
        if (selectedIndex !== '' && selectedIndex !== params.seriesIndex) {
          this[optionName].series[
            selectedIndex
            ].parametricEquation = getParametricEquation(
            this[optionName].series[selectedIndex].pieData.startRatio,
            this[optionName].series[selectedIndex].pieData.endRatio,
            false,
            false,
            k,
            this[optionName].series[selectedIndex].pieData.value
          )
          this[optionName].series[selectedIndex].pieStatus.selected = false
        }
        // 对当前点击的扇形，执行选中/取消选中操作（对 option 更新）
        this[optionName].series[
          params.seriesIndex
          ].parametricEquation = getParametricEquation(
          startRatio,
          endRatio,
          isSelected,
          isHovered,
          k,
          this[optionName].series[params.seriesIndex].pieData.value
        )
        this[optionName].series[params.seriesIndex].pieStatus.selected = isSelected
        // 如果本次是选中操作，记录上次选中的扇形对应的系列号 seriesIndex
        selectedIndex = isSelected ? params.seriesIndex : null
        // 使用更新后的 option，渲染图表
        myChart.setOption(this[optionName])
      })
      // 监听 mouseover，近似实现高亮（放大）效果
      myChart.on('mouseover', (params) => {
        // 准备重新渲染扇形所需的参数
        let isSelected
        let isHovered
        let startRatio
        let endRatio
        let k
        // 如果触发 mouseover 的扇形当前已高亮，则不做操作
        if (hoveredIndex === params.seriesIndex) {
          // 否则进行高亮及必要的取消高亮操作
        } else {
          // 如果当前有高亮的扇形，取消其高亮状态（对 option 更新）
          if (hoveredIndex !== '') {
            // 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 false。
            isSelected = this[optionName].series[hoveredIndex].pieStatus.selected
            isHovered = false
            startRatio = this[optionName].series[hoveredIndex].pieData.startRatio
            endRatio = this[optionName].series[hoveredIndex].pieData.endRatio
            k = this[optionName].series[hoveredIndex].pieStatus.k
            // 对当前点击的扇形，执行取消高亮操作（对 option 更新）
            this[optionName].series[
              hoveredIndex
              ].parametricEquation = getParametricEquation(
              startRatio,
              endRatio,
              isSelected,
              isHovered,
              k,
              this[optionName].series[hoveredIndex].pieData.value
            )
            this[optionName].series[hoveredIndex].pieStatus.hovered = isHovered
            // 将此前记录的上次选中的扇形对应的系列号 seriesIndex 清空
            hoveredIndex = ''
          }
          // 如果触发 mouseover 的扇形不是透明圆环，将其高亮（对 option 更新）
          if (
            params.seriesName !== 'mouseoutSeries' &&
            params.seriesName !== 'pie2d'
          ) {
            // 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 true。
            isSelected =
              this[optionName].series[params.seriesIndex].pieStatus.selected
            isHovered = true
            startRatio =
              this[optionName].series[params.seriesIndex].pieData.startRatio
            endRatio = this[optionName].series[params.seriesIndex].pieData.endRatio
            k = this[optionName].series[params.seriesIndex].pieStatus.k
            // 对当前点击的扇形，执行高亮操作（对 option 更新）
            this[optionName].series[
              params.seriesIndex
              ].parametricEquation = getParametricEquation(
              startRatio,
              endRatio,
              isSelected,
              isHovered,
              k,
              this[optionName].series[params.seriesIndex].pieData.value + 60
            )
            this[optionName].series[
              params.seriesIndex
              ].pieStatus.hovered = isHovered
            // 记录上次高亮的扇形对应的系列号 seriesIndex
            hoveredIndex = params.seriesIndex
          }
          // 使用更新后的 option，渲染图表
          myChart.setOption(this[optionName])
        }
      })
      // 修正取消高亮失败的 bug
      myChart.on('globalout', () => {
        // 准备重新渲染扇形所需的参数
        let isSelected
        let isHovered
        let startRatio
        let endRatio
        let k
        if (hoveredIndex !== '') {
          // 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 true。
          isSelected = this[optionName].series[hoveredIndex].pieStatus.selected
          isHovered = false
          k = this[optionName].series[hoveredIndex].pieStatus.k
          startRatio = this[optionName].series[hoveredIndex].pieData.startRatio
          endRatio = this[optionName].series[hoveredIndex].pieData.endRatio
          // 对当前点击的扇形，执行取消高亮操作（对 option 更新）
          this[optionName].series[
            hoveredIndex
            ].parametricEquation = getParametricEquation(
            startRatio,
            endRatio,
            isSelected,
            isHovered,
            k,
            this[optionName].series[hoveredIndex].pieData.value
          )
          this[optionName].series[hoveredIndex].pieStatus.hovered = isHovered
          // 将此前记录的上次选中的扇形对应的系列号 seriesIndex 清空
          hoveredIndex = ''
        }
        // 使用更新后的 option，渲染图表
        myChart.setOption(this[optionName])
      })
    },
    // 自适应宽高
    changeSize () {
      this.statusChart.resize()
    },
    // 获取 项目列表树
    getDeptAndProjectTree() {
      api.getDeptAndProjectTree().then(res => {
        if (res.code === 0) {
          console.log(res)
          this.requestProjectOptions = [
            {
              deptName: '沈阳腾越建筑工程有限公司',
              projectCode: '',
              children: this.filterNode(res.data)
            }
          ]
        }
      }).catch(err => {
        console.log(err)
      })
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
    handleRequestProjectValueChange(value, selectedOptions) {
      // console.log(this.requestProjectValue);
      // console.log(value, selectedOptions)
      this.projectCodeParams.projectCode = value[value.length - 1]
      this.getDeptAndProjectTree()
      this.getCockpitInfo();
      this.queryTwoSubject();
      this.getProjectProgress()
      this.getCostAnalysisList()
      this.getPayContractType()
    },
    // 获取产值、回款、责任、付款信息
    getCockpitInfo() {
      api.getCockpitInfo(this.projectCodeParams).then(res => {
        if (res.code === 0) {
          console.log(res)
          if (res.data) {

            this.tabPrice.generalContractMoney = res.data.generalContractMoney||0
            this.tabPrice.partyActualOutputValueA = res.data.partyActualOutputValueA||0
            this.tabPrice.generalContractReturn = res.data.generalContractReturn||0
            this.tabPrice.auditOutputValueA = res.data.auditOutputValueA||0
            this.tabPrice.totalLiabilityCost = res.data.totalLiabilityCost||0
            this.tabPrice.targetProfit = res.data.targetProfit||0
            this.tabPrice.outputCompletion = res.data.outputCompletion||0
            this.tabPrice.paymentCollection = res.data.paymentCollection||0
            this.tabPrice.targetProfitMargin = res.data.targetProfitMargin||0
            this.tabPrice.noPay = res.data.noPay||0
            this.tabPrice.overPay = res.data.overPay||0
            // this.tabPrice.actualMoney = res.data.actualMoney||0
            this.tabPrice.reallyMoney = res.data.reallyMoney||0
            this.tabPrice.totalLiabilityProgress = res.data.totalLiabilityProgress||0
            this.tabPrice.biddingCost = res.data.biddingCost||0
            this.tabPrice.contractPaymentCollection = res.data.contractPaymentCollection||0
            this.tabPrice.outputPaymentCollection = res.data.outputPaymentCollection||0
            // this.tabPrice.actualProfit = res.data.actualProfit||0
            this.tabPrice.ifPayProgress = res.data.ifPayProgress||0

            if(this.tabPrice.generalContractMoney&&this.tabPrice.partyActualOutputValueA){
              let generalContractMoney = parseFloat(this.tabPrice.generalContractMoney.replace(/,/g,''));
              let partyActualOutputValueA = parseFloat(this.tabPrice.partyActualOutputValueA.replace(/,/g,''));
              this.tabPrice.generalContractCompletionRate = ((partyActualOutputValueA/generalContractMoney)*100).toFixed(2);
            }else{
              this.tabPrice.generalContractCompletionRate =0;
            }
            if(this.tabPrice.partyActualOutputValueA&&this.tabPrice.generalContractReturn){
              let partyActualOutputValueA = parseFloat(this.tabPrice.partyActualOutputValueA.replace(/,/g,''));
              let generalContractReturn = parseFloat(this.tabPrice.generalContractReturn.replace(/,/g,''));
              this.tabPrice.contractReturnRate = ((generalContractReturn/partyActualOutputValueA)*100).toFixed(2);
            }else{
              this.tabPrice.contractReturnRate =0;
            }

            // 成本与资金分析
            this.initCost(res.data)

            this.initProductionValue(res.data.outputCompletion)
            this.initPaymentCollection(res.data.paymentCollection)
            // 责任成本占比
            this.initTotalLiabilityCost(res.data.totalLiabilityProgress)
            // 静态实际成本
            this.initStaticPay(res.data)
            // 付款率
            this.initPay(res.data.ifPayProgress)

          }else{
            this.tabPrice.generalContractMoney = 0;
            this.tabPrice.partyActualOutputValueA = 0;
            this.tabPrice.generalContractReturn = 0;
            this.tabPrice.auditOutputValueA = 0;
            this.tabPrice.totalLiabilityCost = 0;
            this.tabPrice.targetProfit = 0;
            this.tabPrice.outputCompletion = 0;
            this.tabPrice.paymentCollection = 0;
            this.tabPrice.targetProfitMargin = 0;
            this.tabPrice.noPay = 0;
            this.tabPrice.overPay = 0;
            // this.tabPrice.actualMoney = 0;
            this.tabPrice.reallyMoney = 0;
            this.tabPrice.totalLiabilityProgress = 0;
            this.tabPrice.biddingCost = 0;
            this.tabPrice.contractPaymentCollection = 0;
            this.tabPrice.outputPaymentCollection = 0;
            // this.tabPrice.actualProfit = 0;
            this.tabPrice.ifPayProgress = 0;
            if(this.tabPrice.generalContractMoney&&this.tabPrice.partyActualOutputValueA){
              let generalContractMoney = parseFloat(this.tabPrice.generalContractMoney.replace(/,/g,''));
              let partyActualOutputValueA = parseFloat(this.tabPrice.partyActualOutputValueA.replace(/,/g,''));
              this.tabPrice.generalContractCompletionRate = ((partyActualOutputValueA/generalContractMoney)*100).toFixed(2);
            }else{
              this.tabPrice.generalContractCompletionRate =0;
            }
            if(this.tabPrice.partyActualOutputValueA&&this.tabPrice.generalContractReturn){
              let partyActualOutputValueA = parseFloat(this.tabPrice.partyActualOutputValueA.replace(/,/g,''));
              let generalContractReturn = parseFloat(this.tabPrice.generalContractReturn.replace(/,/g,''));
              this.tabPrice.contractReturnRate = ((generalContractReturn/partyActualOutputValueA)*100).toFixed(2);
            }else{
              this.tabPrice.contractReturnRate =0;
            }
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },

    // 静态实际成本
    initStaticPay(item) {
      let data = []
      this.actualMoneyPercent = item.actualMoneyNumber * 100 / 1000
      // data.push(item.actualMoney)
      // data.push(200)
      // let chartDom = document.getElementById('tab-item-option-chart-4')
      // let myChart = echarts.init(chartDom)
      // let option = {
      //   color: ['#00DAFC', '#677E90'],
      //   legend: {
      //     show: false
      //   },
      //   xAxis: {
      //     show: false
      //   },
      //   yAxis: {
      //     show: false,
      //     type: 'category',
      //     data: ['静态实际成本', '动态实际成本'],
      //     inverse: true,
      //     animationDuration: 300,
      //     animationDurationUpdate: 300,
      //     max: 1
      //   },
      //   series: [
      //     {
      //       realtimeSort: true,
      //       name: '静态实际成本',
      //       type: 'bar',
      //       data: data,
      //       label: {
      //         show: true,
      //         position: 'right',
      //         valueAnimation: true
      //       }
      //     }
      //   ]
      // }
      //
      // myChart.setOption(option)
    },
    // 责任成本占比
    initTotalLiabilityCost(data) {
      let chartDom = document.getElementById('tab-item-option-chart-3')
      let myChart = echarts.init(chartDom)
      let option = {
        color: ['#00DAFC', '#677E90'],
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
            radius: ['76%', '86%'],
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
              { value: data, name: data + '%' },
              { value: numTool.numSub(100, data), name: numTool.numSub(100, data) + '%' }
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
        color: ['#00DAFC', '#677E90'],
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
            radius: ['76%', '86%'],
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
              { value: data, name: data + '%' },
              { value: numTool.numSub(100, data), name: numTool.numSub(100, data) + '%' }
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
        color: ['#00DAFC', '#677E90'],
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
            radius: ['76%', '86%'],
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
              { value: data, name: data + '%' },
              { value: numTool.numSub(100, data), name: numTool.numSub(100, data) + '%' }
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
        color: ['#00DAFC', '#677E90'],
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
            radius: ['76%', '86%'],
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
              { value: data, name: data + '%' },
              { value: numTool.numSub(100, data), name: numTool.numSub(100, data) + '%' }
            ]
          }
        ]
      }
      myChart.setOption(option)
    },

    getPayContractType() {
      api.getContractTotalAndClassifyName(this.projectCodeParams).then(res => {
        if (res.code === 0) {
          // debugger
          if (res.data && res.data.length) {
            this.optionData = res.data.map(item => {
              return [
                item.classifyName ? item.classifyName+'('+item.number+')' : '无',
                item.number,
              ]
            })
          }
          this.initPayContractType(this.optionData)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取项目形象进度
    getProjectProgress() {
      api.getProjectProgress(this.projectCodeParams).then(res => {
        if (res.code === 0) {
          this.projectProgressObject.builtArea = res.data.builtArea
          this.projectProgressObject.startTime = res.data.startTime
          this.projectProgressObject.progressTable = res.data.projectsMdmBuildingList
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 支出合同类型
    initPayContractType(data) {
      // debugger
      let arr = []
      arr.push(data)
      console.log(arr, '3d')
      let chart = Highcharts.chart('pay-contract-type', {
        chart: {
          type: 'pie',
          backgroundColor: 'rgba(255, 255, 255, 0)',
          options3d: {
            enabled: true,
            alpha: 45
          }
        },
        legend: {
          align: 'right'
        },
        credits: {
          enabled: false
        },
        title: {
          text: '支出合同类型',
          style: {
            color: '#FFFFFF'
          }
        },
        // subtitle: {
        //   text: 'Highcharts 中的3D环形图'
        // },
        plotOptions: {
          pie: {
            innerSize: 100,
            depth: 45,
            events: {
              click: e=>{

                this.$router.push({
                  path: '/contract/list',
                  query:{
                    projectCode:this.projectCodeParams.projectCode,
                    contractType:e.point.name.split('(')[0],//需要用code
                    from:'cockpit'
                  }
                });
                // console.log(111,this.projectCodeParams.projectCode,e.point);
              }
            }

          }
        },
        series: [{
          name: '支出合同类型',
          data: data
        }]
      });

      // let serisOptions = []
      //
      // if (data && data.length) {
      //   serisOptions = data.map(item => {
      //     return {
      //       value: item.number,
      //       name: item.classifyName
      //     }
      //   })
      // }
      // let chartDom = document.getElementById('pay-contract-type')
      // let myChart = echarts.init(chartDom)
      // let option = {
      //   tooltip: {
      //     trigger: 'item'
      //   },
      //   textStyle: {
      //     color: '#ffffff'
      //   },
      //   legend: {
      //     // top: '5%',
      //     left: 'left',
      //     textStyle: {
      //       color: '#ffffff'
      //     },
      //   },
      //   series: [
      //     {
      //       type: 'pie',
      //       radius: ['40%', '70%'],
      //       avoidLabelOverlap: false,
      //       label: {
      //         show: false,
      //         position: 'center'
      //       },
      //       emphasis: {
      //         label: {
      //           show: true,
      //           fontSize: '20',
      //           fontWeight: 'bold'
      //         }
      //       },
      //       labelLine: {
      //         show: false
      //       },
      //       data: serisOptions
      //     }
      //   ]
      // }
      //
      // myChart.setOption(option)
    },

    // 成本与资金分析
    initCost(item) {
      let arr = []
      arr.push(item.moneyA)
      arr.push(item.moneyB)
      arr.push(item.moneyC)
      arr.push(item.moneyD)
      arr.push(item.moneyE)
      arr.push(item.moneyF)

      let chartDom = document.getElementById('pay-cost')
      let myChart = echarts.init(chartDom)
      let option = {
        color: ['#00DAFC'],

        textStyle: {
          color: '#D7DDE8'
        },
        dataZoom: [
          {
            type: 'slider',
            show: true,
            start: 0,
            end: 50,
            xAxisIndex: [0]
          }
        ],

        legend: {
          // data: ['静态实际成本', '财务应付', '财务已付'],
          textStyle: {
            color: '#D7DDE8'
          },
        },

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
            type: 'pictorialBar',
            symbol: 'triangle',
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: '#00DAFC'
              }, {
                offset: 1, color: 'rgba(232, 119, 169, 0.31)'
              }]
            }
          }
        ]
      }

      myChart.setOption(option)
    },

    getCostAnalysisList() {
      api.getCostAnalysisList(this.projectCodeParams).then(res => {
        if (res.code === 0) {
          // this.initCostAnalysisECharts(res.data)
          this.initRealCostAnalysisECharts(res.data)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 成本对比分析 eCharts
    initCostAnalysisECharts(costAnalysisData) {
      const aXisOptions = [];
      const seriesActualMoney = ['静态实际成本'];
      const seriesReallyPay = ['财务应付'];
      const seriesOverPay = ['财务已付'];
      this.costAnalysisList = [];


      const idList = [];
      const percent = [];
      const money = [];

      costAnalysisData.forEach((item,index) =>{
        //假数据
        // item.actualMoney = item.reallyPay = item.overPay =1452654;
        seriesActualMoney.push(item.actualMoney);
        seriesReallyPay.push(item.reallyPay);
        seriesOverPay.push(item.overPay);
        aXisOptions.push(item.subjectName);
        let row = {name:item.subjectName,analysisList:item.analysisTwoDTOList||item.taxesResp};
        this.costAnalysisList.push(row);
        this.idList.push(item.id)
        percent.push(item.percentA)
        money.push(item.moneyA)
      });
      seriesActualMoney.shift();
      seriesReallyPay.shift();
      seriesOverPay.shift();

      this.tabPrice.actualMoney = 0;
      seriesActualMoney.forEach(item =>this.tabPrice.actualMoney+=item);
      this.tabPrice.actualMoney=this.tabPrice.actualMoney.toFixed(2);

      this.seriesActualMoney.arr = seriesActualMoney.map((item, index) => {
        return {
          percent: percent[index],
          actualMoney: item,
          money: money[index]
        }
      })
      this.seriesActualMoney.actualMoney = 0;
      this.seriesActualMoney.money = 0;
      this.seriesActualMoney.arr.forEach(item =>{
        this.seriesActualMoney.actualMoney += item.actualMoney;
        this.seriesActualMoney.money += parseFloat(item.money);
      });
      this.seriesActualMoney.actualMoney = this.seriesActualMoney.actualMoney.toFixed(2);
      this.seriesActualMoney.money = this.seriesActualMoney.money.toFixed(2);



      let chartDom = document.getElementById('costAnalysis')
      let myChart = echarts.init(chartDom)

      let option = {
        color: ['#E0C189', '#D7DDE8', '#37DDBA'],
        textStyle: {
          color: '#D7DDE8'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['静态实际成本', '财务应付', '财务已付'],
          textStyle: {
            color: '#D7DDE8'
          },
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
      myChart.on('click', (params) => {
        this.costAnalysisTitle = params.name + '成本分析（万元）';
        this.routerContractType = params.name;
        if(params.name === '税金'){
          this.taxDialogVisible = true;
          for(let i in this.costAnalysisList){
            if(this.costAnalysisList[i].name == params.name){
              this.taxList = this.costAnalysisList[i].analysisList;
              return false;
            }
          }
        }else if(params.name === '人工费'){
          this.$router.push({
            path: '/contract/list',
            query:{
              projectCode:this.projectCodeParams.projectCode,
              contractType:'劳务分包',//需要用code
              from:'cockpit'
            }
          });
        }else{
          this.machineDialogVisible = true;
          this.$nextTick(()=>{
            for(let i in this.costAnalysisList){
              if(this.costAnalysisList[i].name == params.name){
                this.initDialogAnalysisCharts(this.costAnalysisList[i].analysisList);
                return false;
              }
            }
          })
        }
        // if (params.name === '间接费' || params.name === '税金') {
        //   if (params.name === '间接费') {
        //     this.getFullCostMiddleOrTaxes(1)
        //   } else if (params.name === '税金') {
        //     this.getFullCostMiddleOrTaxes(2)
        //   }
        // } else {
        //   this.getSecondSubjectMoney(params.dataIndex)
        // }
        // this.machineDialogVisible = true
    })
    },

    //关闭税金弹框
    handletaxClose(){
      this.taxDialogVisible = false;
      this.taxList = [];
    },

    // 实际成本分析 eCharts
    initRealCostAnalysisECharts(data) {
      // const { actualDtoList, analysisDtoAList } = data
      const aXisOptions = []
      const seriesOptions = []

      for (let i = 0, len = data.length; i < len; i++) {
        seriesOptions.push({
          value: data[i].percentA,
          name: data[i].subjectName
        })
      }

      let chartDom = document.getElementById('realCostAnalysis')
      let myChart = echarts.init(chartDom)
      let option = {
        title: {
          left: 'center'
        },
        textStyle: {
          color: '#ffffff'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'right',
          top:'25px',
          itemWidth: 15,
          itemHeight: 10,
          textStyle: {
            color: '#ffffff'
          },
        },

        series: [
          {
            name: '实际成本占比',
            type: 'pie',
            radius: ['36%', '46%'],
            center: ["70px", "120px"],
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
    },

    // 税金、间接费
    getFullCostMiddleOrTaxes(type) {
      let params = {
        projectCode: null,
        requestType: null
      }
      params.projectCode = this.projectCodeParams.projectCode
      params.requestType = type
      api.getFullCostMiddleOrTaxes(params).then(res => {
        if (res.code === 0) {
          console.log(res)
          this.initDialogAnalysisCharts2(res.data)
        }
      }).catch(err => {
        console.log(err)
      })
    },

    getSecondSubjectMoney(index) {
      let params = {
        id: null,
        projectCode: null
      }
      params.id = this.idList[index]
      params.projectCode = this.projectCodeParams.projectCode
      api.getSecondSubjectMoney(params).then(res => {
        if (res.code === 0) {
          console.log(res)
          this.initDialogAnalysisCharts(res.data)
        }
      }).catch(err => {
        console.log(err)
      })
    },

    initDialogAnalysisCharts2(data) {
      const aXisOptions = []
      const seriesArr = []
      const seriesOptions = ['type']
      const actualMoney = ['静态实际成本']
      const reallyPay = ['财务应付']
      const overPay = ['财务已付']

      data.forEach((item, index) => {
        seriesOptions.push(item.subjectName)
        actualMoney.push(item.actualMoney)
        reallyPay.push(item.reallyPay)
        overPay.push(item.overPay)
        aXisOptions.push(item.subjectName)
      })
      console.log(aXisOptions)
      seriesArr.push(seriesOptions)
      seriesArr.push(actualMoney)
      // seriesArr.push(reallyPay)
      // seriesArr.push(overPay)

      const seriesActualMoney = actualMoney
      const seriesReallyPay = reallyPay
      const seriesOverPay = overPay
      seriesActualMoney.shift()
      seriesReallyPay.shift()
      seriesOverPay.shift()

      let chartDom = document.getElementById('costDetailAnalysis')
      let myChart = echarts.init(chartDom)

      let option = {
        color: ['#E0C189'],
        textStyle: {
          color: '#D7DDE8'
        },
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
          data: ['静态实际成本'],
          textStyle: {
            color: '#D7DDE8'
          },
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
            axisLabel: {
              interval: 0,
              rotate: 45,
              textStyle: {
                color: 'white',
                fontSize: 12
              }
            },
            // axisTick: { show: false },
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
          }
        ]
      }

      myChart.setOption(option)
    },

    initDialogAnalysisCharts(data) {

      const aXisOptions = []
      const seriesActualMoney = ['静态实际成本']
      const seriesReallyPay = ['财务应付']
      const seriesOverPay = ['财务已付']

      data.forEach((item, index) => {
        //假数据 要删除
        // item.overPay =  item.actualMoney =item.reallyPay =1338.45;
        seriesActualMoney.push({value:item.actualMoney,hookType:item.hookType})
        seriesReallyPay.push({value:item.reallyPay,hookType:item.hookType})
        seriesOverPay.push({value:item.overPay,hookType:item.hookType})
        aXisOptions.push(item.subjectName)
      })

      seriesActualMoney.shift()
      seriesReallyPay.shift()
      seriesOverPay.shift()



      let chartDom = document.getElementById('costDetailAnalysis')
      let myChart = echarts.init(chartDom)

      let option = {
        color: ['#E0C189', '#D7DDE8', '#37DDBA'],
        textStyle: {
          color: '#D7DDE8'
        },

        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['静态实际成本', '财务应付', '财务已付'],
          textStyle: {
            color: '#D7DDE8'
          },
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
            axisLabel: {
              interval: 0,
              rotate: 45,
              textStyle: {
                color: 'white',
                fontSize: 12
              }
            },
            // axisTick: { show: false },
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

      myChart.setOption(option);
      myChart.on('click',(e)=>{

        switch(this.routerContractType){
          case '机械设备费':
                          // if(e.data.hookType!==0)return false;
                          this.machineDialogVisible = false;
                          this.$router.push({
                            path: '/contract/list',
                            query:{
                              projectCode:this.projectCodeParams.projectCode,
                              contractType:'设备租赁',//需要用code
                              from:'cockpit'
                            }
                          });
                          break;
          case '分项措施费':
                          // if(e.data.hookType!==0)return false;
                          this.machineDialogVisible = false;
                          this.$router.push({
                            path: '/contract/list',
                            query:{
                              projectCode:this.projectCodeParams.projectCode,
                              contractType:'设备租赁',//需要用code
                              from:'cockpit'
                            }
                          });
                          break;
          case '专业分包费':
                          // if(e.data.hookType!==0)return false;
                          this.machineDialogVisible = false;
                          this.$router.push({
                            path: '/contract/list',
                            query:{
                              projectCode:this.projectCodeParams.projectCode,
                              contractType:'专业分包',//需要用code
                              from:'cockpit'
                            }
                          });
                          break;
          case '临建、安措费':

                          break;
          case '工程间接费':
                          this.machineDialogVisible = false;
                          this.$router.push({
                            path: '/refundsManage/claim/'+process.env.VUE_APP_ENV_BPM+'.jiuzhangdigit.com/application/cost_system/application-list/expenseAccount',
                          });
                          break;
           case '材料费':

                          break;

        };



      })
    },

    handleMachineClose() {
      this.machineDialogVisible = false
    }
  }
}
</script>
<style lang="scss">
   .cockpit-cascader-popper {
    background: #000 !important;
    border: none;
    color: white;
  }
</style>
<style lang="scss" scoped>
  /deep/.cc-cas .el-input .el-input__inner{
    background: rgba(255,255,255,0.1);
    border: none;
    color: white;
    height: 20px;
  }
  // >>>.el-popper[x-placement^="bottom"]{
  //   background:red !important;
  // }



/deep/.el-dialog{
  background: url(../../../assets/images/bi_dialog_bkg.png) !important;
  background-size: 100% 100%;
}
/deep/.el-dialog__title{
  color: #FFFFFF !important;
  font-size: 20px;
}
/deep/.vue-treeselect__control{
  background-color: #151D22 !important;
  opacity: 0.3 !important;
  outline: none;
  border: none;
  color: #ffffff !important;
}
/deep/.vue-treeselect__menu{
  background-color: #151D22 !important;
  color: #ffffff !important;
}
/deep/.vue-treeselect__menu-container:hover{
  background-color: #151D22 !important;
}
/deep/.vue-treeselect__menu::-webkit-scrollbar{
  display: none;
}
/deep/.vue-treeselect div:hover, .vue-treeselect span:hover{
  background-color: #151D22 !important;
}
/deep/.ant-cascader-picker{
  background-color: #151D22 !important;
  /*opacity: 0.8 !important;*/
  border: none !important;
  outline: none !important;
}
/deep/.ant-cascader-picker-arrow{
  color: #ffffff !important;
}
/deep/.ant-cascader-picker-clear:hover{
  color: #ffffff !important;
}
/deep/.ant-input{
  border: none !important;
  color: #ffffff !important;
}
/deep/.ant-cascader-picker-label{
  color: #ffffff !important;
}
/deep/.ant-input::-webkit-input-placeholder{
  color: #ffffff !important;
}
/deep/.ant-cascader-menus{
  background-color: #151D22 !important;
  color: #ffffff !important;
  opacity: 0.3 !important;
}
/deep/.el-progress__text{
  color: #ffffff !important;
  font-size: 25px !important;
}
.contain{
  width: 100%;
  // height: 100vh;
  background-image: url(../../../assets/images/bi_bkg_3.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  .cc-top{
    width: 100%;
    height: 100px;
    display: flex;
    flex-direction: row-reverse;
    padding-top: 20px;
    .cc-top-right{
      padding-right: 20px;
      display: flex;
      flex-direction: row;
      .cc-top-r-select{
        width: 260px;
        padding-top: 10px;
      }
      .screen-icon{
        width: 40px;
        height: 40px;
        margin-left: 50px;
        img{
          width: 100%;
          height: 100%;
          cursor: pointer;
        }
      }
    }
  }
  .cc-head{
    width: 100%;
    display: flex;
    flex-direction: row;
    padding-left: 15px;
    padding-right: 15px;
    .cc-h-item{
      width: calc((100% - 60px) / 5);
      height: 202px;
      margin-right: 15px;
      /*border: 1px solid #1b767b;*/
      display: flex;
      flex-direction: row;
      padding-top: 10px;
      background: url(../../../assets/images/bi_bkg_1.png);
      .chi-left{
        width: 150px;
        #tab-item-option-chart-1, #tab-item-option-chart-2, #tab-item-option-chart-3, #tab-item-option-chart-5{
          width: 132px;
          height: 98px;
          background: url(../../../assets/images/bi_y.png);
          background-size: 100% 100%;
          margin-top: 20px;
          margin-left: 15px;
        }
        .chi-title{
          width: 100%;
          text-align: center;
          font-size: 15px;
          color: #FFD03B;
          margin-top: 15px;
          padding-left: 15px;
        }
      }
      .chi-right{
        display: flex;
        flex-direction: column;
        margin-left: 10px;
        .cr-layout{
          display: flex;
          flex-direction: column;
          .cl-icon{
            width: 150px;
            height: 24.8px;
            background: url(../../../assets/images/bi_bkg_4.png);
            background-size: 100% 100%;
            font-size: 10px;
            text-align: center;
            line-height: 24.8px;
            color: #D9E7FF;
          }
          .ci-value{
            font-size: 18px;
            color: #ffffff;
            font-weight: 800;
            text-align: center;
          }
          .ci-values{
            font-size: 18px;
            color: #ffffff;
            font-weight: 800;
            padding-left: 10px;
          }
        }
      }
    }
    .cc-h-item:last-child{
      margin-right: 0 !important;
    }
  }

  .c-body{
    width: 100%;
    display: flex;
    flex-direction: row;
    /*padding: 15px;*/
    padding-left: 15px;
    padding-right: 15px;

    .cb-box{
      width: calc((100% - 40px) / 3);
      height: 325px;
      display: flex;
      flex-direction: column;
      background: url(../../../assets/images/bi_bkg_2.png);

      .cb-top{
        width: 100%;
        height: 41px;
        display: flex;
        flex-direction: row;
        .cbt-icon{
          width: 25px;
          height: 25px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 9px 14px 2px 13px;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .cbt-title{
          line-height: 41px;
          font-size: 15px;
          color: #ffffff;
        }
      }
      .cb-btm{
        width: 100%;
        height: 284px;
        display: flex;
        flex-direction: column;
        .cbm-top{
          width: 100%;
          height: 100px;
          display: flex;
          flex-direction: row;
          justify-content: center;
          margin-top: 20px;
          .cbm-t-1{
            width: calc((100% - 120px) / 2);
            height: 100%;
            display: flex;
            margin-left:20px;
            flex-direction: row;
            img{
              width:100%;
            }

          }
          .cbm-t-2{
            width: calc((100% - 60px) / 2);
            height: 36px;
            background: url(../../../assets/images/bi_bkg_5.png);
            background-size: 100% 100%;
            margin-left: 20px;
            margin-top: 7px;
            display: flex;
            flex-direction: row;
            .cbm-t-1icon{
              width: 30px;
              height: 30px;
              margin-top: 3px;
            }
            .cbm-t-1text{
              font-size: 12px;
              color: #ffffff;
              line-height: 36px;
              margin-left: 10px;
            }
            .cbm-t-1value{
              color: #3BEFFF;
              font-size: 12px;
              margin-left: 10px;
              line-height: 36px;
              font-weight: bolder;
            }
          }
        }
        .cbm-list{
          width: calc(100% - 30px);
          color: #D9E7FF;
          height:140px;
          box-sizing: border-box;
          overflow:hidden;
          margin: 10px 10px 10px 20px;
          ul{
            height: 140px;
            margin: 0;
            padding: 0;
            list-style-type: none;
            overflow-y: scroll;
            li{
              width: 100%;
              display: flex;
              flex-direction: row;
              span{
                width: calc(100% / 4);
                height: 50px;
                text-align: center;
                line-height: 50px;
                color: #D9E7FF;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
            }
          }
          ul::-webkit-scrollbar{
            display: none;
          }
        }
      }

    }
  }
  .cb-box-1{
    width: 100%;
    height: 325px;
    display: flex;
    flex-direction: column;
    background: url(../../../assets/images/bi_bkg_6.png);
    background-size: 100% 100%;
    margin-top: 10px;
    .cb-top{
      width: 100%;
      height: 41px;
      display: flex;
      flex-direction: row;
      .cbt-icon{
        width: 25px;
        height: 25px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 9px 14px 2px 13px;
        img{
          width: 100%;
          height: 100%;
        }
      }
      .cbt-title{
        line-height: 41px;
        font-size: 15px;
        color: #ffffff;
      }
    }
    .cb-btm{
      width: 100%;
      height: 250px;
      border: 1px solid #1b767b;
    }
  }
  .cb-box-2{
    width: 100%;
    height: 325px;
    display: flex;
    flex-direction: column;
    background: url(../../../assets/images/bi_bkg_2.png);
    margin-top: 10px;

    .cb-top{
      width: 100%;
      height: 41px;
      display: flex;
      flex-direction: row;
      .cbt-icon{
        width: 25px;
        height: 25px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 9px 14px 2px 13px;
        img{
          width: 100%;
          height: 100%;
        }
      }
      .cbt-title{
        line-height: 41px;
        font-size: 15px;
        color: #ffffff;
      }
    }
    .cb-btm{
      width: 100%;
      height: 250px;
      border: 1px solid #1b767b;
      display: flex;
      flex-direction: row;
      #realCostAnalysis{
        background: url(../../../assets/images/bi_circle.png) no-repeat 2px 40px;
        background-size: 150px;
      }
      .real-list{
        width: 50%;
        display: flex;
        flex-direction: column;
        padding-left: 20px;
        margin-top:20px;
        ul{
          margin: 0;
          padding: 0;
          list-style-type: none;
          li{
            display: flex;
            flex-direction: row;
            span{
              width: 70px;
              font-size: 12px;
              text-align: center;
              margin-bottom: 5px;
              margin-right: 3px;
            }
          }
        }
      }
    }
  }

  .slot-title{
    display: flex;
    flex-direction: row;
    .st-icon{
      width: 25px;
      height: 25px;
      display: flex;
      justify-content: center;
      align-items: center;
      /*margin: 9px 14px 2px 13px;*/
      img{
        width: 100%;
        height: 100%;
      }
    }
    .st-title{
      font-size: 15px;
      color: #ffffff;
      font-weight: bolder;
    }
  }

  .d-box{
    width: 100%;
    height: 400px;
    padding: 15px;
  }
}

</style>
