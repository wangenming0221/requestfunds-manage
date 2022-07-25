<template>
  <div class="app-container">
    <el-form :model="refreshParams" ref="queryForm" :inline="true" label-width="100px" @submit.prevent.native>
      <el-form-item label="项目编码">
        <el-autocomplete
          @keyup.enter.native="refreshQuery"
          style="width: 240px"
          size="small"
          clearable
          v-model="refreshParams.projectCode"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入项目编码"
          @clear="refreshParams.projectCode = ''"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="核算苑区">
        <el-input  v-model="refreshParams.accountingArea"  placeholder="请输入核算苑区" clearable size="small" @keyup.enter.native="refreshQuery"/>
      </el-form-item>

      <el-form-item label="合同编码">
        <el-autocomplete
          @keyup.enter.native="refreshQuery"
          style="width: 240px"
          size="small"
          clearable
          v-model="refreshParams.contractCode"
          :fetch-suggestions="queryContractCodeSearchAsync"
          placeholder="请输入合同名称"
          @clear="refreshParams.contractCode = undefined"
        ></el-autocomplete>
      </el-form-item>

      <el-form-item label="代表公司">
        <el-autocomplete
          @keyup.enter.native="refreshQuery"
          style="width: 240px"
          size="small"
          clearable
          v-model="refreshParams.pName"
          :fetch-suggestions="querySearchAsyncCompany"
          placeholder="请输入所代表公司"
          @clear="refreshParams.pName = undefined"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="refreshQuery">查询</el-button>
        <el-button type="primary" size="mini" @click="handleExport()">导出</el-button>
      </el-form-item>
    </el-form>
    <div class="card">
      <div class="card-box" v-for="(v, i) in requestRecordData" :key="i">
        <div class="box-title">
          <div class="title-left">
            <img :src="require('@/assets/images/tj-1.png')" alt="">
            <span>{{v.busName}}</span><span style="display: inline-block; margin-left: 20px">单位: 万元</span>
          </div>
          <div class="title-right" @click="handleExport(v.busName)">导出明细</div>
        </div>
        <div class="box-section">
          <div class="section-left">
            <div class="section-left_text">累计申请产值</div>
            <div class="section-left_num"> {{v.cumulativeMoney | formatThousands}}</div>
          </div>
          <div class="section-right">
            <div class="section-right_process">
              <div class="process-label">产值占比</div>
              <div class="process-progress">
                <el-progress :percentage="parseFloat(v.proportion) || 0" :stroke-width="10"></el-progress>
              </div>
            </div>
            <div class="section-right_sum">
              <div class="sum-wrap">
                <div class="wrap-item">
                  <div class="item-label">
                    结算产值
                  </div>
                  <div class="item-text">
                    {{v.settlementMoney | formatThousands}}
                  </div>
                </div>
                <div class="wrap-item">
                  <div class="item-label">
                    预留质保金
                  </div>
                  <div class="item-text">
                    {{v.reserveMoney | formatThousands}}
                  </div>
                </div>
                <div class="wrap-item">
                  <div class="item-label">
                    累计应付
                  </div>
                  <div class="item-text">
                    {{v.copeMoney | formatThousands}}
                  </div>
                </div>
              </div>
              <div class="sum-wrap">
                <div class="wrap-item">
                  <div class="item-label">
                    计提管理费
                  </div>
                  <div class="item-text">
                    {{v.provisionMoney | formatThousands}}
                  </div>
                </div>
                <div class="wrap-item">
                  <div class="item-label">
                    累计扣款
                  </div>
                  <div class="item-text">
                    {{v.deductionMoney | formatThousands}}
                  </div>
                </div>
                <div class="wrap-item">
                  <div class="item-label">
                    累计实付
                  </div>
                  <div class="item-text">
                    {{v.actualMoney | formatThousands}}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="background: #fff; padding: 18px 16px">
      <el-table
          highlight-current-row
          @row-click="handleRowClick"
          v-loading="loading" :data="contractList"  style="width: 100%" class="examine-table" :header-cell-style="{background:'#EEF5FF'}" :cell-style="cellStyle">
        <el-table-column fixed="left" prop="contractCode"  label="合同编号" align="center" :show-overflow-tooltip="true" width="300" >
          <template slot-scope="scope">
            <span class="blue-font-color">
              {{scope.row.contractCode}}
            </span>
          </template>
        </el-table-column>
        <el-table-column fixed="left" prop="contractName" label="合同名称" align="center" :show-overflow-tooltip="true" width="250"/>
        <el-table-column prop="accountingArea" label="核算苑区" align="center" :show-overflow-tooltip="true" width="180"/>
        <el-table-column prop="proportion" label="产值占比" align="center" :show-overflow-tooltip="true" width="180"/>
        <el-table-column prop="settlementMoney" label="结算产值" align="center" :show-overflow-tooltip="true" width="180">
          <template slot-scope="scope">
            <span>￥{{scope.row.settlementMoney | formatThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="reserveMoney" label="预留质保金" align="center" :show-overflow-tooltip="true" width="180">
          <template slot-scope="scope">
            <span>￥{{scope.row.reserveMoney | formatThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cumulativeMoney" label="累计申请产值" align="center" :show-overflow-tooltip="true" width="180">
          <template slot-scope="scope">
            <span>￥{{scope.row.cumulativeMoney | formatThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="copeMoney" label="累计应付" align="center" :show-overflow-tooltip="true" width="180">
          <template slot-scope="scope">
            <span>￥{{scope.row.copeMoney | formatThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="provisionMoney" label="计提管理费" align="center" :show-overflow-tooltip="true" width="180">
          <template slot-scope="scope">
            <span>￥{{scope.row.provisionMoney | formatThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="deductionMoney" label="累计扣款" align="center" :show-overflow-tooltip="true" width="180">
          <template slot-scope="scope">
            <span>￥{{scope.row.deductionMoney | formatThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="actualMoney" label="累计实付" align="center" :show-overflow-tooltip="true" width="180">
          <template slot-scope="scope">
            <span>￥{{scope.row.actualMoney | formatThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" align="center" :show-overflow-tooltip="true" width="180"/>
        <el-table-column prop="pname" label="乙方" align="center" :show-overflow-tooltip="true" width="180"/>
        <el-table-column prop="ppeople" label="负责人" align="center" :show-overflow-tooltip="true" width="180"/>
        <el-table-column prop="ppeopleTel" label="联系电话" align="center" :show-overflow-tooltip="true" width="180"/>
        <el-table-column prop="contractAmount" label="暂定金额" align="center" :show-overflow-tooltip="true" width="180">
          <template slot-scope="scope">
            <span>￥{{scope.row.contractAmount | formatThousands}}</span>
          </template>
        </el-table-column>
<!--        <el-table-column label="操作" align="center" width="100">-->
<!--          <template slot-scope="scope">-->
<!--            <el-button-->
<!--                type="text"-->
<!--                size="small"-->
<!--                @click="$router.push({path: '/request/requestmanage', query: {contractCode: scope.row.contractCode, approvalStatus: 'COMPLETED'}})">-->
<!--              查看明细-->
<!--            </el-button>-->
<!--          </template>-->
<!--        </el-table-column>-->
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="refreshParams.current" :limit.sync="refreshParams.size" @pagination="getList" />
    </div>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";
  import { request } from '@/api/work'
  import { baseURL } from "@/config";
  export default {
    name: "Statistics",
    components: {},
    data() {
      return {
        refreshParams: {
          projectCode: '',
          accountingArea: '',
          contractCode: '',
          pName: '',
          current: 1,
          size: 10,
        },
        requestRecordData: [],
        contractList: [],
        loading: true,
        total: 0
      };
    },
    computed: {
      ...mapGetters(["token"]),
    },
    mounted() {
      request.getProjectCode({ projectCode: this.refreshParams.projectCode }).then(res => {
        // this.refreshParams = {
        //   ...this.refreshParams,
        //   projectCode: res.data[0].projectCode
        // }
        this.getList();
      })
    },
    methods: {
      handleRowClick(row, column, event) {
        if (column.label === '合同编号') {
          this.$router.push({path: '/contract/subpackage/implement', query: {contractCode: row.contractCode}})
        } else {
          this.$router.push({path: '/request/requestmanage', query: {contractCode: row.contractCode, approvalStatus: 'COMPLETED'}})
        }
      },
      cellStyle(data) {
        if(data.columnIndex===0){
          return "cursor:pointer;"
        }
      },
      querySearchAsync(queryString, cb) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          request.getProjectCode({ projectCode: this.refreshParams.projectCode }).then(res => {
            const data = res.data.map(v => {
              return {'value': v.projectCode};
            })
            cb(data);
          })
        }, 2000 * Math.random());
      },
      queryContractCodeSearchAsync(queryString, cb) {
        this.timeout = setTimeout(() => {
          request.selectContract({contractCode: this.refreshParams.contractCode}).then(res => {
            const data = res.data.records.map(v => {
              return {'value': v.contractCode};
            })
            cb(data);
          })
        }, 2000 * Math.random());
      },
      querySearchAsyncCompany(queryString, cb) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          request.getPorCompanyList({ pName: this.refreshParams.pName}).then(res => {
            const data = res.data.map(v => {
              return {'value': v.pname};
            })
            cb(data);
          })
        }, 2000 * Math.random());
      },
      refreshQuery() {
        this.refreshParams.current = 1;
        this.getList();
      },
      getList() {
          this.loading = true;
          let params = {
            ...this.refreshParams
          }
          request.getProjectStatisticsMoney(params).then(res => {
            this.requestRecordData = res.data.requestRecordData;
            this.contractList = res.data.data.records;
            this.total = parseInt(res.data.data.total);
          }).finally(e => {
            this.loading = false;
          });
      },
      //根据筛选条件导出
      handleExport(busName) {
        const that = this;
        this.$confirm('确认导出?', "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          closeOnClickModal: false
        }).then(() => {
          let url = baseURL + '/request-funds-operatemanage/request/exportProjectStatisticsMoneyList';
          let xhr = new XMLHttpRequest();
          xhr.open('POST', url, true);
          xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
          xhr.setRequestHeader('Authorization', this.token);
          let params = {
            ...this.refreshParams
          }
          xhr.send(JSON.stringify({ busName, ...this.refreshParams }));
          xhr.responseType = 'blob';
          xhr.onload = function (e) {
            if (this.status === 200) {
              let name = xhr.getResponseHeader('Content-Disposition');
              name = decodeURIComponent(name);
              let fileName = name.substring(29, name.length);
              let blob = new Blob([xhr.response]);
              let eLink = document.createElement('a');
              eLink.style.display = 'none';
              eLink.href = URL.createObjectURL(blob);
              document.body.appendChild(eLink);
              eLink.download = fileName;
              eLink.click();
              document.body.removeChild(eLink);
              that.msgSuccess("操作成功");
            }
          };
        })
      },
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../../assets/styles/element-variables";
  .app-container {
    background: rgb(240, 242, 245);
  }
  .card {
    overflow: hidden;
    .card-box {
      border-radius: 4px;
      border: 1px solid #e4e4e4;
      float: left;
      background: #fff;
      margin-bottom: 24px;
      padding: 14px 16px;
      width: 49%;
      .box-title {
        display: flex;
        justify-content: space-between;
        margin-bottom: 16px;
        align-items: center;
        .title-left {
          display: flex;
          align-items: center;
          color: rgba(0, 0, 0, 0.427);
          img {
            width: 24px;
            margin-right: 8px;
          }
        }
        .title-right {
          cursor: pointer;
          color: $--color-primary;
        }
      }
      .box-section {
        overflow: hidden;
        .section-left {
          float: left;
          width: 40%;
          background: url("../../../assets/images/tj-2.png");
          background-size: 100% 100%;
          padding: 18px 14px;
          .section-left_text {
            font-weight: 600;
            margin-bottom: 20px;
          }
          .section-left_num {
            font-weight: 700;
            font-size: 28px;
          }
        }
        .section-right {
          margin-left: 42%;
          .section-right_process {
            overflow: hidden;
            margin-bottom: 20px;
            .process-label {
              float: left;
              width: 70px;
              font-weight: 600;
            }
            .process-progress {
              margin-left: 86px;
              ::v-deep .el-progress-bar {
                padding-right: 65px;
                margin-right: -65px;
              }
            }
          }
          .section-right_sum {
            overflow: hidden;
            .sum-wrap {
              padding-right: 16px;
              float: left;
              width: 50%;
              border-right: 1px solid rgba(0, 0, 0, 0.427);
              .wrap-item {
                color: rgba(0, 0, 0, 0.6);
                display: flex;
                justify-content: space-between;
                margin-bottom: 6px;
              }
            }
            .sum-wrap:nth-child(2) {
              padding-left: 16px;
              padding-right: 0;
              border: none;
            }
          }
        }
      }
    }
    .card-box:nth-child(2n - 1) {
      margin-right: 2%;
    }
  }
  /deep/ tbody tr:hover > td {
    cursor: pointer;
  }
</style>
