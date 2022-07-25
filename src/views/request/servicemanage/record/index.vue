<template>

  <div class="app-container">

    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">

      <el-form-item label="缴纳人">
        <el-input  v-model="queryParams.porName"  placeholder="请输入缴纳人" clearable size="small" @keyup.enter.native="handleQuery" style="width: 240px"/>
      </el-form-item>
      <el-form-item label="缴纳人手机号" label-width="120px">
        <el-input  v-model="queryParams.porPhone"  placeholder="请输入缴纳人手机号" clearable size="small" @keyup.enter.native="handleQuery" style="width: 240px"/>
      </el-form-item>
      <el-form-item label="缴纳人绑定的公司" label-width="140px">
        <el-input  v-model="queryParams.porCompany"  placeholder="请输入缴纳人绑定的公司" clearable size="small" @keyup.enter.native="handleQuery" style="width: 240px"/>
      </el-form-item>
      <el-form-item label="订单编号">
        <el-input  v-model="queryParams.tradeNumber"  placeholder="请输入订单编号" clearable size="small" style="width: 240px"/>
      </el-form-item>
      <el-form-item label="服务费类型">
        <el-select v-model="queryParams.payCategoryId" placeholder="请选择服务费类型" clearable style="width: 260px">
          <el-option v-for="item in payTypeList" :key="item.title"
                     :label="item.name"
                     :value="item.id"
                     :disabled="item.disabled">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="支付状态">
        <el-select v-model="queryParams.tradeStatus" placeholder="请选择支付状态" clearable style="width: 260px">
          <el-option v-for="item in typeList" :key="item.title"
                     :label="item.payName"
                     :value="item.payStatus"
                     :disabled="item.disabled">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="缴纳时间">
        <el-date-picker v-model="queryParams.timeRange"  type="datetimerange"  range-separator="至" start-placeholder="开始日期"   end-placeholder="结束日期"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <template>

      <el-row :gutter="40" class="panel-group" >
        <el-col :xs="12" :sm="8" :lg="8" class="card-panel-col">
          <div class="card-panel" >
            <div class="card-panel-icon-wrapper icon-message">
              <svg-icon icon-class="money" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description" style="font-size: 20px">
              <div class="card-panel-text">
                已缴纳
              </div>
              {{statistics.payAll}}
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="8" :lg="8" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-money">
              <svg-icon icon-class="money" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description" style="font-size: 20px">
              <div class="card-panel-text">
                已退款
              </div>
              {{statistics.refundAll}}
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="8" :lg="8" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-people">
              <svg-icon icon-class="money" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description" style="font-size: 20px">
              <div class="card-panel-text">
                实收金额
              </div>
              {{statistics.incomeAll}}
            </div>
          </div>
        </el-col>
      </el-row>
      <!-- 查看详情 -->
      <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
        <el-form ref="detailForm" :model="detailForm" label-width="100px">
          <el-row>
            <el-col :span="12"> <el-form-item label="订单编号"> {{detailForm.tradeNumber}} </el-form-item> </el-col>
            <el-col :span="12"> <el-form-item label="缴纳人姓名"> {{detailForm.porName}} </el-form-item> </el-col>
          </el-row>
          <el-row>
            <el-col :span="12"> <el-form-item label="代表公司">  {{detailForm.porCompany}} </el-form-item> </el-col>
            <el-col :span="12"> <el-form-item label="服务费类型"> {{detailForm.orderName}} </el-form-item> </el-col>
          </el-row>
          <el-row>
            <el-col :span="12"> <el-form-item label="金额"> {{detailForm.prMoney}}  </el-form-item>  </el-col>
            <el-col :span="12"> <el-form-item label="缴纳时间"> {{detailForm.payBackTime}} </el-form-item> </el-col>
          </el-row>
          <el-row>
            <el-col :span="12"> <el-form-item label="支付状态"> {{detailForm.tradeStatusName}} </el-form-item> </el-col>
            <el-col :span="12"> <el-form-item label="缴纳平台"> {{detailForm.payName}} </el-form-item>  </el-col>
          </el-row>

          <el-row >
            <el-col :span="12"> <el-form-item label="发票状态"> {{detailForm.invoiceStatus}} </el-form-item> </el-col>
            <el-col :span="12" v-if="detailForm.tradeStatus===5"> <el-form-item label="退款时间"> {{detailForm.refundBackTime}} </el-form-item>  </el-col>
          </el-row>
          <el-row v-if="detailForm.tradeStatus===5">
            <el-col :span="24"> <el-form-item label="退款原因"> {{detailForm.refundReason}} </el-form-item> </el-col>
          </el-row>

        </el-form>
      </el-dialog>

      <!-- 退款原因 -->
      <el-dialog :title="refundTitle" :visible.sync="openRefund" width="600px" center append-to-body>
        <el-form ref="refundForm" :model="refundForm":rules="refundRules" label-width="100px">
          <el-row>
            <el-col :span="24">
              <el-form-item label="退款原因"  prop="refundReason" >
                <el-input type="textarea" v-model="refundForm.refundReason" placeholder="请输入退款原因"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="refundSubmmit">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>


    </template>



    <el-table v-loading="loading" :data="recordList"  style="width: 100%">
      <el-table-column fixed="left" prop="tradeNumber"  label="订单编号" align="center" :show-overflow-tooltip="true" width="220"></el-table-column>
      <el-table-column fixed="left" prop="porName"    label="缴纳人" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
      <el-table-column fixed="left" prop="porPhone"    label="缴纳人手机号" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
      <el-table-column prop="porCompany" label="所代表公司" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
      <el-table-column prop="orderName"  label="服务费类型" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
      <el-table-column prop="prMoney"    label="金额(元)" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
      <el-table-column prop="payBackTime"       label="缴纳时间" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
      <el-table-column prop="refundBackTime"    label="退款时间" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
      <el-table-column prop="tradeStatus"       label="支付回调请求" align="center" :show-overflow-tooltip="true" width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.notifyPayStatus=='0'">成功</span>
          <span v-else="scope.row.notifyPayStatus=='1'">失败</span>
        </template>
      </el-table-column>
      <el-table-column prop="tradeStatus"       label="支付状态" align="center" :show-overflow-tooltip="true" width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.tradeStatus=='2'">支付成功</span>
          <span v-if="scope.row.tradeStatus=='5'">退款成功</span>
        </template>
      </el-table-column>
      <el-table-column prop="payName" label="缴纳平台" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
      <el-table-column prop="invoiceStatus" label="服务费发票" align="center" :show-overflow-tooltip="true" width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.invoiceStatus=='0'">未开</span>
          <span v-if="scope.row.invoiceStatus=='1'">待开</span>
          <span v-if="scope.row.invoiceStatus=='2'">已开</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" prop="zfName" label="操作" align="center" :show-overflow-tooltip="true" width="180">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-view"  @click="handleDetail(scope.row)" v-hasPermi="['servicemanage:configure:list']" >查看详情</el-button>
          <span v-if="scope.row.tradeStatus=='2'">
            <el-button size="mini" type="text" icon="el-icon-edit"  @click="handleRefund(scope.row)" v-hasPermi="['servicemanage:configure:refund']" >退款</el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.current" :limit.sync="queryParams.size" @pagination="getList" />
  </div>
</template>

<script>

  import { request } from '@/api/work'
  import { dateToSecond } from '@/utils/uidate.js'
  export default {
    name: "Record",
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
        recordList: [],
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
          porName:undefined,
          porPhone: undefined,
          porCompany: undefined,
          payCategoryId: undefined,
          tradeStatus: undefined,
          tradeNumber:undefined,
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
      this.getPayTypeList();
    },
    methods: {
      /*获取支付列表*/
      getList() {
        this.loading = true;
        if(this.queryParams.timeRange.length>0){
          this.queryParams.params.beginTime=dateToSecond(0,this.queryParams.timeRange);
          this.queryParams.params.endTime=dateToSecond(1,this.queryParams.timeRange);
        }
        if(this.queryParams.porName===''){
          this.queryParams.porName=undefined;
        }
        if(this.queryParams.porPhone===''){
          this.queryParams.porPhone=undefined;
        }
        if(this.queryParams.porCompany===''){
          this.queryParams.porCompany=undefined;
        }
        if(this.queryParams.payCategoryId===''){
          this.queryParams.payCategoryId=undefined;
        }
        if(this.queryParams.tradeStatus===''){
          this.queryParams.tradeStatus=undefined;
        }
        request.getPayOrderRecord(this.queryParams).then(response => {
          this.recordList = response.data.serviceChargeList.records
          this.total = parseInt(response.data.serviceChargeList.total);
          this.loading = false;
          this.statistics.payAll=response.data.payRefundTimes+"笔,共"+response.data.payRefundMoney+"元";
          this.statistics.refundAll=response.data.refundTimes+"笔,共"+response.data.refundMoney+"元";
          this.statistics.incomeAll=response.data.incomeMoney+"元";
        });
      },
      getPayTypeList(){
        request.getPayCategoryList().then(response => {
          this.payTypeList=response.data;
          this.payTypeList.push({id:0,name:"全部"});
          this.payTypeList.sort(function(a,b){
            return a.id-b.id;
          })
        });
      },
      /*退款详情*/
      handleDetail(row){
        this.detailForm={
          porName:row.porName,
          tradeNumber:row.tradeNumber,
          porCompany:row.porCompany,
          orderName:row.orderName,
          prMoney:row.prMoney+"(元)",
          payBackTime:row.payBackTime,
          refundBackTime:row.refundBackTime,
          tradeStatus:row.tradeStatus,
          tradeStatusName:row.tradeStatus===2?"支付成功":"退款成功",
          payName:row.payName,
          invoiceStatus:row.invoiceStatus===0?"未开":row.invoiceStatus===1?"待开":"已开",
          refundReason:row.refundReason
        };
        this.open = true;
        this.title = "服务费详情";
      },
      /*退款*/
      handleRefund(row){
        this.resetForm("refundForm");
        this.openRefund=true;
        this.refundTitle="退款原因";
        this.refundForm={
          oId:row.oid
        }
      },
      refundSubmmit(){
        this.$refs["refundForm"].validate(valid => {
          if (valid) {
            request.refundOrder(this.refundForm).then(response => {
              this.openRefund = false;
              this.msgSuccess("退款成功");
              this.getList();
            });
          }
        });
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
            porName:undefined,
            porPhone: undefined,
            porCompany: undefined,
            payCategoryId: undefined,
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
