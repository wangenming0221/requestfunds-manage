<template>

  <div class="app-container">

    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">

      <el-form-item label="发起人姓名">
        <el-input  v-model="queryParams.userName"  placeholder="请输入发起人姓名" clearable size="small" @keyup.enter.native="handleQuery" style="width: 200px"/>
      </el-form-item>

      <el-form-item label="发起时间" label-width="120px">
        <el-date-picker v-model="queryParams.timeRange"  type="datetimerange"  range-separator="至" start-placeholder="开始日期"   end-placeholder="结束日期" style="width: 350px"/>
      </el-form-item>

      <el-form-item label="发起人手机号" label-width="140px">
        <el-input  v-model="queryParams.phone"  placeholder="请输入发起人手机号" clearable size="small" @keyup.enter.native="handleQuery" style="width: 200px"/>
      </el-form-item>

      <el-form-item label="代表公司">
        <el-autocomplete
          @keyup.enter.native="handleQuery"
          style="width: 240px"
          size="small"
          clearable
          v-model="queryParams.companyName"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入所代表公司"
          @clear="queryParams.companyName = undefined"
        ></el-autocomplete>
      </el-form-item>

      <el-form-item label="发起人角色">
        <el-select v-model="queryParams.roleCode" placeholder="请选择发起人角色" clearable style="width: 200px">
          <el-option v-for="item in roleList" :key="item.title"
                     :label="item.name"
                     :value="item.id"
                     :disabled="item.disabled">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="项目名称">
        <el-input  v-model="queryParams.projectName"  placeholder="请输入项目名称" clearable size="small" style="width: 200px"/>
      </el-form-item>

      <el-form-item label="项目编码">
        <el-input  v-model="queryParams.projectCode"  placeholder="请输入项目编码" clearable size="small" style="width: 200px"/>
      </el-form-item>

      <el-form-item label="合同分类">
        <el-cascader
          v-model="cascaderData"
          clearable
          :props="{value: 'classifyCode', label: 'title'}"
          :options="treeData"/>
      </el-form-item>

      <el-form-item label="合同名称">
        <el-autocomplete
          @keyup.enter.native="handleQuery"
          style="width: 240px"
          size="small"
          clearable
          v-model="queryParams.contractName"
          :fetch-suggestions="(queryString, cb) =>queryContractNameSearchAsync(queryString,cb)"
          placeholder="请输入合同名称"
          @clear="queryParams.contractName = undefined"
        ></el-autocomplete>
      </el-form-item>

      <el-form-item label="合同编码">
        <el-autocomplete
          @keyup.enter.native="handleQuery"
          style="width: 240px"
          size="small"
          clearable
          v-model="queryParams.contractCode"
          :fetch-suggestions="(queryString, cb) =>queryContractCodeSearchAsync(queryString,cb)"
          placeholder="请输入合同名称"
          @clear="queryParams.contractCode = undefined"
        ></el-autocomplete>
      </el-form-item>

      <el-form-item label="请款审核状态">
        <el-select v-model="queryParams.approvalStatus" placeholder="请选择审批状态" clearable style="width: 200px">
          <el-option v-for="item in approvalList" :key="item.title"
                     :label="item.name"
                     :value="item.id"
                     :disabled="item.disabled">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="付款状态">
        <el-select v-model="queryParams.payStatus" placeholder="请选择付款状态" clearable style="width: 200px">
          <el-option v-for="item in payList" :key="item.title"
                     :label="item.payName"
                     :value="item.payStatus"
                     :disabled="item.disabled">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <el-button type="primary"  icon="el-icon-download" size="mini" @click="handleExport()">导出</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="requestList"  style="width: 100%" class="examine-table">
      <el-table-column fixed="left" prop="contractName"  label="合同名称" align="center" :show-overflow-tooltip="true" width="240"/>
      <el-table-column fixed="left" prop="contractCode"  label="合同编码" align="center" :show-overflow-tooltip="true" width="240"/>
      <el-table-column
          width="160"
          prop="approvalStatus"
          align="center"
          label="请款审核状态">
        <template slot-scope="scope">
          <span v-if="scope.row.approvalStatus ==='DRAFT'">草稿</span>
          <span v-if="scope.row.approvalStatus ==='PROCESSING'">进行中</span>
          <span v-if="scope.row.approvalStatus ==='COMPLETED'">已完成</span>
          <span v-if="scope.row.approvalStatus ==='CANCELED'">作废</span>
          <span v-if="scope.row.approvalStatus ==='CANCELLED'">作废</span>
        </template>
      </el-table-column>
      <el-table-column prop="workFlowName"  label="流程名称" align="center" :show-overflow-tooltip="true" width="220"/>
      <el-table-column prop="periods"  label="期数" align="center" :show-overflow-tooltip="true" width="220"/>
      <el-table-column prop="userName"  label="发起人" align="center" :show-overflow-tooltip="true" width="220"/>
      <el-table-column prop="accountingArea"  label="核算苑区" align="center" :show-overflow-tooltip="true" width="220"/>
      <el-table-column prop="branchOffice"  label="分公司" align="center" :show-overflow-tooltip="true" width="220"/>
      <el-table-column prop="projectName"  label="项目名称" align="center" :show-overflow-tooltip="true" width="220"/>
      <el-table-column prop="projectCode"  label="项目编码" align="center" :show-overflow-tooltip="true" width="220"/>
      <el-table-column prop="busName"  label="请款类型" align="center" :show-overflow-tooltip="true" width="220"/>
      <el-table-column prop="createTime"  label="申请时间" align="center" :show-overflow-tooltip="true" width="220"/>
      <el-table-column prop="approvalMoney"  label="申请产值" align="center" :show-overflow-tooltip="true" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.cumulativeMoney | formatThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="settlementMoney"  label="结算产值" align="center" :show-overflow-tooltip="true" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.settlementMoney | formatThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="reserveMoney"  label="预留金额" align="center" :show-overflow-tooltip="true" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.reserveMoney | formatThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="provisionMoney"  label="计提管理费" align="center" :show-overflow-tooltip="true" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.provisionMoney | formatThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="deductionMoney"  label="扣款金额" align="center" :show-overflow-tooltip="true" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.deductionMoney | formatThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="actualMoney"  label="实付金额" align="center" :show-overflow-tooltip="true" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.actualMoney | formatThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="payMoney"  label="付款金额" align="center" :show-overflow-tooltip="true" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.payMoney | formatThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button
              type="text"
              size="small"
              @click="openBpm(scope.row.bpmUrl)">
            查看详情
          </el-button>
          <el-button
              type="text"
              size="small"
              @click="openBpm(scope.row.applyPayUrl)">
            查看付款
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.current" :limit.sync="queryParams.size" @pagination="getList" />
  </div>
</template>

<script>
  import { baseURL } from "@/config";
  import { request} from '@/api/work'
  import { dateToSecond } from '@/utils/uidate.js'
  import { accountmanagedic } from "@/utils/dictionary"
  export default {
    name: "Requestmanage",
    components: {},
    data() {
      return {
        // 遮罩层
        loading: true,
        // 菜单表格树数据
        requestList: [],
        treeData:[],
        cascaderData:[],
        payList:[
          {payStatus:'',payName:'全部'},
          {payStatus:'未付款',payName:'未付款'},
          {payStatus:'已付款(部分)',payName:'已付款(部分)'},
          {payStatus:'已付款(全部)',payName:'已付款(全部)'}
        ],
        approvalList:[
          {id:'',name:'全部'},
          {id:'DRAFT',name:'草稿'},
          {id:'PROCESSING',name:'进行中'},
          {id:'COMPLETED',name:'已完成'},
          {id:'CANCELED',name:'作废'}
        ],
        roleList:accountmanagedic.roleList,
        // 菜单树选项
        // 是否显示弹出层
        open: false,
        title:"",
        // 查询参数
        queryParams: {
          userName:undefined,
          contractCode:undefined,
          projectCode:undefined,
          porPhone: undefined,
          phone: undefined,
          roleCode: undefined,
          tradeStatus: undefined,
          projectName:undefined,
          approvalStatus:undefined,
          payStatus: undefined,
          params:{beginTime:undefined,endTime:undefined},
          timeRange:[],
          current: 1,
          size: 10,
        },
        total: 0
      };
    },
    mounted() {
      this.init();
    },
    activated() {
      this.init();
    },
    methods: {
      init() {
        this.queryParams.contractCode = this.$route.query.contractCode ? this.$route.query.contractCode : undefined;
        this.queryParams.projectCode = this.$route.query.projectCode ? this.$route.query.projectCode : undefined;
        this.queryParams.approvalStatus = this.$route.query.approvalStatus ? this.$route.query.approvalStatus : undefined;
        this.getTree();
        this.getList();
        //this.getPayTypeList();
      },
      openBpm(value) {
        window.open(value)
      },
      //根据筛选条件导出
      handleExport() {
        const that = this;
        this.$confirm('确认导出?', "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          closeOnClickModal: false
        }).then(() => {
          let url = baseURL + '/request-funds-operatemanage/request/exportRequestRecordListPage';
          let xhr = new XMLHttpRequest();
          xhr.open('POST', url, true);
          xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
          xhr.send(JSON.stringify(this.queryParams));
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
      querySearchAsync(queryString, cb) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          request.getPorCompanyList({ pName: this.queryParams.companyName }).then(res => {
            const data = res.data.map(v => {
              return {'value': v.pname};
            })
            cb(data);
          })
        }, 2000 * Math.random());
      },
      queryContractCodeSearchAsync(queryString, cb) {
        var param={contractCode: this.queryParams.contractCode};
        this.timeout = setTimeout(() => {
          request.selectContract(param).then(res => {
            const data = res.data.records.map(v => {
              return {'value': v.contractCode};
             })
            cb(data);
          })
        }, 2000 * Math.random());
      },
      queryContractNameSearchAsync(queryString, cb) {
        var param={ contractName: this.queryParams.contractName};
        this.timeout = setTimeout(() => {
          request.selectContract(param).then(res => {
            const data = res.data.records.map(v => {
              return {'value': v.contractName};
            })
            cb(data);
          })
        }, 2000 * Math.random());
      },
      getTree() {
        request.getContractTypeDic().then(res => {
          this.treeData = this.deleteChild(res.data);
        })
      },
      deleteChild(data) {
        let arr = [];
        arr = data.map(value => {
          if (value.children && value.children.length) {
            let _value = {...value};
            _value.children = this.deleteChild(_value.children);
            return _value;
          } else {
            if (value.children === null || value.children.length === 0) {
              delete value.children;
            }
            return value;
          }
        });
        return arr;
      },
      /*获取支付列表*/
      getList() {
        this.loading = true;
        this.queryParams.classifyCode=this.cascaderData.length ? this.cascaderData[this.cascaderData.length-1] : undefined;
        if(this.queryParams.timeRange.length>0){
          this.queryParams.params.beginTime=dateToSecond(0,this.queryParams.timeRange);
          this.queryParams.params.endTime=dateToSecond(1,this.queryParams.timeRange);
        }
        request.getRequestRecordListPage(this.queryParams).then(response => {
          this.requestList = response.data.records
          this.total = parseInt(response.data.total);
          this.loading = false;
        });
      },
      // getPayTypeList(){
      //   servicemanage.getPayCategoryList().then(response => {
      //     this.payTypeList=response.data;
      //     this.payTypeList.push({id:0,name:"全部"});
      //     this.payTypeList.sort(function(a,b){
      //       return a.id-b.id;
      //     })
      //   });
      // },
      /** 搜索按钮操作 */
      handleQuery() {
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.queryParams={
          userName:undefined,
          contractCode:undefined,
          projectCode:undefined,
          porPhone: undefined,
          phone: undefined,
          roleCode: undefined,
          tradeStatus: undefined,
          projectName:undefined,
          approvalStatus:undefined,
          payStatus: undefined,
          params:{beginTime:undefined,endTime:undefined},
          timeRange:[],
          current: 1,
          size: 10,
        };
        this.cascaderData=[];
        this.resetForm("queryForm");
        this.handleQuery();
      }
    }
  };
</script>

<style lang="scss" scoped>
  .examine-table {
    ::v-deep .el-table__row{
      cursor: pointer;
    }
  }
  .panel-group {
    margin-top: 18px;


    .card-panel-col {
      margin-bottom: 32px;
    }

    .card-panel {
      height: 108px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);

      &:hover {
        .card-panel-icon-wrapper {
          color: #fff;
        }

        .icon-people {
          background: #40c9c6;
        }

        .icon-message {
          background: #36a3f7;
        }

        .icon-money {
          background: #f4516c;
        }

        .icon-shopping {
          background: #34bfa3
        }
      }

      .icon-people {
        color: #40c9c6;
      }

      .icon-message {
        color: #36a3f7;
      }

      .icon-money {
        color: #f4516c;
      }

      .icon-shopping {
        color: #34bfa3
      }

      .card-panel-icon-wrapper {
        float: left;
        margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }

      .card-panel-icon {
        float: left;
        font-size: 48px;
      }

      .card-panel-description {
        float: right;
        font-weight: bold;
        margin: 26px;
        margin-left: 0px;

        .card-panel-text {
          line-height: 18px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px;
          margin-bottom: 12px;
        }

        .card-panel-num {
          font-size: 20px;
        }
      }
    }
  }

  @media (max-width:550px) {
    .card-panel-description {
      display: none;
    }

    .card-panel-icon-wrapper {
      float: none !important;
      width: 100%;
      height: 100%;
      margin: 0 !important;

      .svg-icon {
        display: block;
        margin: 14px auto !important;
        float: none !important;
      }
    }
  }
</style>
