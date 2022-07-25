<template>
  <div class="office">
    <div v-if="!$store.state.wait.isCheckDetailShow" class="o-home">
      <div class="o-head">
        <div class="oh-l">
          <div class="oh-l-1">欢迎您, {{ user ? user.nickName : '' }}, 工作辛苦了</div>
          <div class="oh-l-2">您有<span class="wait-count">{{ waitCount.all }}</span>条审批待办需处理, 请及时查看</div>
        </div>
        <div class="oh-r">
          <div class="o-date">{{ currentDate }}</div>
          <div class="o-week">{{ currentWeek }}</div>
        </div>
      </div>
      <div class="o-tab">
        <div class="o-tab-inner">
          <div class="spanRow">
            <div @click="selectItem(1)" :class="{ 'o-tab-item': true, 'o-tab-item-selected': selectedItem === 0 }">
              <div class="oti-l">
                <div class="oti-l-title">项目管理</div>
                <div class="oti-l-count" :style="{ color: '#5a9efe' }">
                  <div class="oti-l-count_num">{{ waitCount.project }}</div>
                  <div class="oti-l-count_num">{{ waitCount.projectReadCount }}</div>
                </div>
                <div class="oti-l-t">
                  <div class="oti-l-t_text">我的待办</div>
                  <div class="oti-l-t_text">我的待阅</div>
                </div>
              </div>
              <div></div>
            </div>
          </div>
          <div class="spanRow">
            <div @click="selectItem(2)" :class="{ 'o-tab-item': true, 'o-tab-item-selected': selectedItem === 1 }">
              <div class="oti-l">
                <div class="oti-l-title">合同管理</div>
                <div class="oti-l-count" :style="{ color: '#00d1f7' }">
                  <div class="oti-l-count_num">{{ waitCount.contract }}</div>
                  <div class="oti-l-count_num">{{ waitCount.contractReadCount }}</div>
                </div>
                <div class="oti-l-t">
                  <div class="oti-l-t_text">我的待办</div>
                  <div class="oti-l-t_text">我的待阅</div>
                </div>
              </div>
              <div></div>
            </div>
          </div>
          <div class="spanRow">
            <div @click="selectItem(3)" :class="{ 'o-tab-item': true, 'o-tab-item-selected': selectedItem === 2 }">
              <div class="oti-l">
                <div class="oti-l-title">请款管理</div>
                <div class="oti-l-count" :style="{ color: '#2bcbbf' }">
                  <div class="oti-l-count_num">{{ waitCount.requestFunds }}</div>
                  <div class="oti-l-count_num">{{ waitCount.requestFundsReadCount }}</div>
                </div>
                <div class="oti-l-t">
                  <div class="oti-l-t_text">我的待办</div>
                  <div class="oti-l-t_text">我的待阅</div>
                </div>
              </div>
              <div></div>
            </div>
          </div>
          <div class="spanRow">
            <div @click="selectItem(4)" :class="{ 'o-tab-item': true, 'o-tab-item-selected': selectedItem === 3 }">
              <div class="oti-l">
                <div class="oti-l-title">付款管理</div>
                <div class="oti-l-count" :style="{ color: '#ffd666' }">
                  <div class="oti-l-count_num">{{ waitCount.pay }}</div>
                  <div class="oti-l-count_num">{{ waitCount.payReadCount }}</div>
                </div>
                <div class="oti-l-t">
                  <div class="oti-l-t_text">我的待办</div>
                  <div class="oti-l-t_text">我的待阅</div>
                </div>
              </div>
              <div></div>
            </div>
          </div>
          <div class="spanRow">
            <div @click="selectItem(5)" :class="{ 'o-tab-item': true, 'o-tab-item-selected': selectedItem === 4 }">
              <div class="oti-l">
                <div class="oti-l-title">费用管理</div>
                <div class="oti-l-count" :style="{ color: '#ffaa66' }">
                  <div class="oti-l-count_num">{{ waitCount.fee }}</div>
                  <div class="oti-l-count_num">{{ waitCount.feeReadCount }}</div>
                </div>
                <div class="oti-l-t">
                  <div class="oti-l-t_text">我的待办</div>
                  <div class="oti-l-t_text">我的待阅</div>
                </div>
              </div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
      <div class="o-list">
        <div class="ol-top">
          <div class="ol-t-l">
            <div></div>
            <div class="ol-t-l-text">{{ leftTitle }}</div>
          </div>
          <div class="ol-t-r">
            <el-button type="text" @click="checkMore">查看更多</el-button>
          </div>
        </div>
        <div class="ol-list">
          <ul>
            <li v-for="(item, index) in tableData" :key="index">
              <div class="oll-box">
                <div class="oll-box-left">
                  <div class="oll-box-left-row">
                    <div class="oll-box-left-row-icon"></div>
                    <div class="oll-box-left-row-text" @click="toBpmOption(item)">{{ item.instanceName }}</div>
                  </div>
                  <div class="oll-box-right-row">
                    <div class="oll-box-item-row">当前节点:   {{ item.activityName }}</div>
                    <div class="oll-box-item-row">处理人:   {{ item.participantName }}</div>
                    <div class="oll-box-item-row">停留时间:   {{ item.stayTime }}</div>
                    <div class="oll-box-item-row">发起人:  {{ item.originatorName }}</div>
                    <!--                  <div class="oll-box-left-row">合同分类:  {{ item.cname }}</div>-->
                  </div>
                </div>
                <div class="oll-box-right">发起时间: {{ item.startTime }}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div v-else class="o-details">
      <wait-details :appCode="form.appCode" :waitCounts="waitCounts" />
    </div>
  </div>
</template>

<script>
import api from '@/api/work/cooperative'
// 详情组件
import Wait from '../components/index'
import { getUserProfile } from "@/api/system/user"
export default {
  name: "CooperativeOffice",
  components: {
    'wait-details': Wait
  },
  data() {
    return {
      spanGutter: 40,
      spanRow: 4,
      // isCheckDetailShow: false,
      waitCount: {
        all: 0,
        project: 0,
        projectReadCount: 0,
        contract: 0,
        contractReadCount: 0,
        requestFunds: 0,
        requestFundsReadCount: 0,
        pay: 0,
        payReadCount: 0,
        fee: 0,
        feeReadCount: 0
      },
      waitCounts: null,
      selectedItem: 0,
      user: null,
      // 查询参数
      form: {
        projectName: null,
        pName: null,
        workFlowName: null,
        classifyCode: null,
        contractCode: null,
        contractName: null,
        promoter: null,
        beginTime: null,
        endTime: null,
        appCode: 'AllAppCode',
        current: 1,
        size: 10
      },
      tabOptions: [],
      tableData: [],
      leftTitle: '全部待办',
      currentDateTime: new Date(),
      currentWeek: null,
      currentDate: null
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('wait/CHANGE_SHOW', false)
    next()
  },
  mounted() {
    // console.log(this.currentDateTime.getFullYear())
    this.getDateTime()
    // console.log(this.currentWeek)
    this.getMyWorkInstanceCountFromBpm()
    this.getUser()
    this.getMyAgentFromBpm()
  },
  methods: {
    toBpmOption(item) {
      window.open(item.bpmUrl)
    },
    getDateTime() {
      console.log(this.currentDateTime.getFullYear(), this.currentDateTime.getMonth(), this.currentDateTime.getDate())
      this.currentDate = this.currentDateTime.getFullYear() + ' 年 ' + (this.currentDateTime.getMonth() + 1) + ' 月 ' + this.currentDateTime.getDate() + ' 日'
      switch (this.currentDateTime.getDay()) {
        case 0:
          this.currentWeek = '星期日'
          break
        case 1:
          this.currentWeek = '星期一'
          break
        case 2:
          this.currentWeek = '星期二'
          break
        case 3:
          this.currentWeek = '星期三'
          break
        case 4:
          this.currentWeek = '星期四'
          break
        case 5:
          this.currentWeek = '星期五'
          break
        default:
          this.currentWeek = '星期六'
          break
      }
    },
    getUser() {
      getUserProfile().then(response => {
        console.log(response)
        this.user = response.data
      })
    },
    getMyWorkInstanceCountFromBpm() {
      api.getMyWorkInstanceCountFromBpm().then(res => {
        console.log(res)
        if (res.code === 0) {
          this.tabOptions = res.data
          res.data.forEach(item => {
            switch (item.appName) {
              case '全部待办':
                this.waitCount.all = item.needCount
                // this.waitCounts = item.needCount
                this.$store.commit('wait/CHANGE_COUNT', item.needCount)
                break
              case '项目管理':
                this.waitCount.project = item.needCount
                this.waitCount.projectReadCount = item.readCount
                // this.waitCounts = item.needCount
                break
              case '合同管理':
                this.waitCount.contract = item.needCount
                this.waitCount.contractReadCount = item.readCount
                // this.waitCounts = item.needCount
                break
              case '请款管理':
                this.waitCount.requestFunds = item.needCount
                this.waitCount.requestFundsReadCount = item.readCount
                // this.waitCounts = item.needCount
                break
              case '付款管理':
                this.waitCount.pay = item.needCount
                this.waitCount.payReadCount = item.readCount
                // this.waitCounts = item.needCount
                break
              case '费用管理':
                this.waitCount.fee = item.needCount
                this.waitCount.feeReadCount = item.readCount
                // this.waitCounts = item.needCount
                break
              default:
                break
            }
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    selectItem(item) {
      this.selectedItem = item - 1
      if (this.tabOptions.length > 0) {
        this.form.appCode = this.tabOptions[item].appCode
      } else {
        return
      }
      this.$store.commit('wait/CHANGE_SHOW', true)
    },
    // 查看更多
    checkMore() {
      this.form.appCode = this.tabOptions[0].appCode
      this.$store.commit('wait/CHANGE_SHOW', true)
    },
    // 返回
    backHome() {
      this.$store.commit('wait/CHANGE_SHOW', false)
    },
    getMyAgentFromBpm() {
      api.getMyAgentFromBpm(this.form).then(res => {
        if (res.code === 0) {
          console.log(res)
          this.tableData = res.data ? res.data.records : []
        }
      }).catch(err => {
        console.log(err)
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.office{
  width: 100%;
  height: 100%;
  padding: 15px;
  /*background-color: #f2f3fa;*/
  display: flex;
  flex-direction: column;
  .o-home{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .o-head{
      width: 100%;
      height: 120px;
      background-color: #4758e7;
      border-radius: 10px;
      display: flex;
      justify-content: space-between;
      box-shadow: 0px 0px 20px 10px #eeeeee;
      .oh-l{
        display: flex;
        flex-direction: column;
        color: #ffffff;
        margin-top: 25px;
        margin-left: 70px;
        .oh-l-1{
          font-size: 25px;
          font-weight: bolder;
          font-family: monospace;
        }
        .oh-l-2{
          font-size: 18px;
          font-weight: 500;
          font-family: monospace;
          .wait-count{
            margin: 0 10px;
            color: #ffc000;
            font-family: 'Open Sans', Arial, sans-serif;
            font-style: italic;
          }
        }
      }
      .oh-r{
        display: flex;
        flex-direction: row;
        align-items: center;
        .o-date{
          color: #ffffff;
          font-size: 40px;
          font-weight: bolder;
          font-style: italic;
          font-family: 'Open Sans', Arial, sans-serif;
          margin-right: 20px;
        }
        .o-week{
          color: #ffffff;
          font-size: 40px;
          font-weight: bolder;
          font-style: italic;
          font-family: 'Open Sans', Arial, sans-serif;
          margin-right: 60px;
        }
      }
    }
    .o-tab{
      width: 100%;
      margin-top: 15px;
      .o-tab-inner{
        width: 100%;
        display: flex;
        flex-direction: row;
        .spanRow{
          width: calc(100% - 60px);
          margin-right: 15px;
          .o-tab-item-selected{
            box-shadow: 0px 0px 15px 0px #999999 !important;
          }
          .o-tab-item:hover{
            box-shadow: 0px 0px 5px 0px #999999 !important;
          }
          .o-tab-item{
            cursor: pointer;
            width: 100%;
            height: 120px;
            border-radius: 7px;
            background-color: #ffffff;
            box-shadow: 0px 0px 15px 5px #eeeeee;
            display: flex;
            justify-content: space-between;
            transition: box-shadow 0.2s;
            .oti-l{
              display: flex;
              flex-direction: column;
              width: 100%;
              padding: 14px 18px;
              .oti-l-title{
                font-size: 15px;
                font-weight: bolder;
                /*margin-top: 15px;*/
                /*margin-left: 30px;*/
              }
              .oti-l-count{
                font-size: 30px;
                font-weight: bolder;
                /*margin-top: 5px;*/
                /*margin-left: 30px;*/
                display: flex;
                justify-content: space-between;
                .oti-l-count_num {
                  width: 60px;
                  text-align: left;
                }
              }
              .oti-l-t{
                font-size: 15px;
                font-weight: bolder;
                color: #999999;
                display: flex;
                justify-content: space-between;
                /*margin-left: 30px;*/
                /*magin-top: 15px;*/
              }
            }
          }
        }
        .spanRow:last-child{
          margin-right: 0 !important;
        }
      }
    }
    .o-list{
      width: 100%;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0px 0px 20px 10px #eeeeee;
      margin-top: 15px;
      display: flex;
      flex-direction: column;
      .ol-top{
        display: flex;
        justify-content: space-between;
        .ol-t-l{
          display: flex;
          flex-direction: row;
          padding-left: 15px;
          padding-top: 15px;
          .ol-t-l-text{
            font-size: 15px;
            font-weight: bolder;
            /*margin-top: 10px;*/
          }
        }
        .ol-t-r{
          padding-top: 10px;
          padding-right: 15px;
        }
      }
      .ol-list{
        ul{
          margin: 0;
          padding: 0;
          list-style-type: none;
          li:last-child{
            margin-bottom: 20px;
          }
          li{
            margin-top: 15px;
            .oll-box{
              display: flex;
              justify-content: space-between;
              .oll-box-left{
                display: flex;
                flex-direction: column;
                margin-left: 20px;
                .oll-box-left-row{
                  display: flex;
                  font-size: 15px;
                  color: #999999;
                  font-weight: 500;
                  margin-top: 5px;
                  .oll-box-left-row-icon{
                    width: 10px;
                    height: 10px;
                    background-color: #4758e7;
                    border-radius: 50%;
                    margin-top: 10px;
                  }
                  .oll-box-left-row-text{
                    font-size: 20px;
                    font-weight: bolder;
                    color: #333333;
                    margin-left: 10px;
                  }
                  .oll-box-left-row-text:hover{
                    color: #4758e7;
                    cursor: pointer;
                  }
                }
                .oll-box-right-row{
                  display: flex;
                  flex-direction: row;
                  padding-top: 5px;
                  .oll-box-item-row{
                    font-size: 15px;
                    color: #999999;
                    font-weight: 500;
                    margin-right: 25px;
                  }
                }
              }
              .oll-box-right{
                margin-right: 15px;
                font-size: 15px;
                color: #999999;
                margin-right: 20px;
                margin-top: 15px;
              }
            }
          }
        }
      }
    }
  }
  .o-details{

  }
}
</style>
