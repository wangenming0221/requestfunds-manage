<template>

  <div class="app-container">

    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">

      <el-form-item label="发起人姓名">
        <el-input  v-model="queryParams.userName"  placeholder="请输入缴纳人" clearable size="small" @keyup.enter.native="handleQuery" style="width: 200px"/>
      </el-form-item>

      <el-form-item label="发起时间" label-width="120px">
        <el-date-picker v-model="queryParams.timeRange"  type="datetimerange"  range-separator="至" start-placeholder="开始日期"   end-placeholder="结束日期" style="width: 350px"/>
      </el-form-item>

      <el-form-item label="发起人手机号" label-width="140px">
        <el-input  v-model="queryParams.phone"  placeholder="请输入缴纳人绑定的公司" clearable size="small" @keyup.enter.native="handleQuery" style="width: 200px"/>
      </el-form-item>

      <el-form-item label="代表公司">
        <el-input  v-model="queryParams.projectName"  placeholder="请输入订单编号" clearable size="small" style="width: 200px"/>
      </el-form-item>

      <el-form-item label="发起人角色">
        <el-select v-model="queryParams.roleCode" placeholder="请选择服务费类型" clearable style="width: 200px">
          <el-option v-for="item in payTypeList" :key="item.title"
                     :label="item.name"
                     :value="item.id"
                     :disabled="item.disabled">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="项目名称">
        <el-input  v-model="queryParams.projectName"  placeholder="请输入订单编号" clearable size="small" style="width: 200px"/>
      </el-form-item>

      <el-form-item label="项目编码">
        <el-input  v-model="queryParams.projectCode"  placeholder="请输入订单编号" clearable size="small" style="width: 200px"/>
      </el-form-item>

      <el-form-item label="合同分类">
        <el-input  v-model="queryParams.projectName"  placeholder="请输入订单编号" clearable size="small" style="width: 200px"/>
      </el-form-item>

      <el-form-item label="合同名称">
        <el-input  v-model="queryParams.contractName"  placeholder="请输入订单编号" clearable size="small" style="width: 200px"/>
      </el-form-item>

      <el-form-item label="合同编码">
        <el-input  v-model="queryParams.contractCode"  placeholder="请输入订单编号" clearable size="small" style="width: 200px"/>
      </el-form-item>

      <el-form-item label="请款审批状态">
        <el-input  v-model="queryParams.approvalStatus"  placeholder="请输入订单编号" clearable size="small" style="width: 200px"/>
      </el-form-item>

      <el-form-item label="付款状态">
        <el-input  v-model="queryParams.payStatus"  placeholder="请输入订单编号" clearable size="small" style="width: 200px"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="requestList"  style="width: 100%" @row-click="clickRow" class="examine-table">
      <el-table-column fixed="left" prop="requestNumber"  label="业务编号" align="center" :show-overflow-tooltip="true" width="220"></el-table-column>
      <el-table-column fixed="left" prop="userName"    label="发起人" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
      <el-table-column fixed="left" prop="createTime"    label="发起时间" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
      <el-table-column prop="phone" label="手机号码" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
      <el-table-column prop="companyName"  label="代表公司" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
      <el-table-column prop="roleCode"    label="发起人角色" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
      <el-table-column prop="projectName"       label="项目名称" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
      <el-table-column prop="projectCode"    label="项目编码" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
      <el-table-column prop="contractCode"       label="合同类型" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
      <el-table-column prop="contractName"       label="合同名称" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
      <el-table-column prop="busName" label="请款类型" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
      <el-table-column prop="approvalStatus" label="请款状态" align="center" :show-overflow-tooltip="true" width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.invoiceStatus=='0'">未开</span>
          <span v-if="scope.row.invoiceStatus=='1'">待开</span>
          <span v-if="scope.row.invoiceStatus=='2'">已开</span>
        </template>
      </el-table-column>
    </el-table>
    <el-table-column prop="invoiceStatus" label="填报方式" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.current" :limit.sync="queryParams.size" @pagination="getList" />
  </div>
</template>

<script>

  import { request } from '@/api/work'
  import { dateToSecond } from '@/utils/uidate.js'
  export default {
    name: "Menu",
    components: {},
    data() {
      return {
        refundRules: {
          refundReason: [
            { required: true, message: "退款原因不能为空",trigger: "blur"}
          ]
        },
        // 遮罩层
        loading: true,
        // 菜单表格树数据
        requestList: [],
        typeList:[
          {payStatus:0,payName:'全部'},
          {payStatus:2,payName:'支付成功'},
          {payStatus:5,payName:'退款成功'}
        ],
        // 菜单树选项
        payTypeList:[],
        // 是否显示弹出层
        open: false,
        openRefund: false,
        title:"",
        refundTitle:"",
        // 查询参数
        queryParams: {
          userName:undefined,
          porPhone: undefined,
          phone: undefined,
          roleCode: undefined,
          tradeStatus: undefined,
          projectName:undefined,
          params:{beginTime:undefined,endTime:undefined},
          timeRange:[],
          current: 1,
          size: 10,
        },
        statistics:{
          payAll:undefined,
          refundAll:undefined,
          incomeAll:undefined
        },
        detailForm:{},
        refundForm:{},
        total: 0
      };
    },
    created() {
      this.getList();
      //this.getPayTypeList();
    },
    methods: {
      /*获取支付列表*/
      getList() {
        this.loading = true;
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
      clickRow(row){
        window.open(row.bpmUrl)
      },
      // 取消按钮
      cancel() {
        this.openRefund = false;
        this.reset();
        this.resetForm("refundForm");
      },
      reset() {
        this.refundForm = {
          oId:undefined,
          refundForm:undefined
        };
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.queryParams={
          userName:undefined,
          porPhone: undefined,
          phone: undefined,
          roleCode: undefined,
          tradeStatus: undefined,
          params:{startTime:undefined,endTime:undefined},
          timeRange:[],
          current: 1,
          size: 10
        };
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

