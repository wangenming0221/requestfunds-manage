<template>
  <div class="supplier-container">
    <!--    采购订单-仓管员   -->
    <div class="sc-top">
      <el-form ref="info" :inline="true" :model="info" class="demo-form-inline" size="mini">
        <el-form-item label="采购编号" prop="purchaseCode">
          <el-input v-model="info.purchaseCode"  placeholder="请输入采购编号" />
        </el-form-item>
        <el-form-item label="供应商" prop="supplyCompanyId">
          <el-select v-model="info.supplyCompanyId" filterable placeholder="请选择供应商">
            <el-option
              v-for="item in conProvideOptions"
              :key="item.id"
              :label="item.pname"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入库状态" prop="states">
          <el-select v-model="info.states" filterable placeholder="请选择入库状态">
            <el-option
              v-for="item in statesStockOut"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入库时间" >
          <el-col :span="11">
            <el-form-item prop="inHouseDateStart">
            <el-date-picker type="date" placeholder="请输入开始日期" v-model="info.inHouseDateStart" style="width: 100%;" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="1">至</el-col>
          <el-col :span="11">
            <el-form-item prop="inHouseDateEnd">
            <el-date-picker type="date" placeholder="请输入结束日期" v-model="info.inHouseDateEnd" style="width: 100%;" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
<!--        <el-form-item label="审核状态">-->
<!--          <el-select v-model="info.states" placeholder="请选择审核状态">-->
<!--            <el-option-->
<!--              v-for="item in options"-->
<!--              :key="item.value"-->
<!--              :label="item.label"-->
<!--              :value="item.value">-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <el-form-item label="">
          <el-button  type="primary" @click="onReset('info')">重置</el-button>
          <el-button  type="primary" @click="onQuery">搜索</el-button>
        </el-form-item>
      </el-form>

    </div>
    <div class="sc-table">
      <el-table
        :data="dataList"
        border
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column
          type="index"
          align="center"
          label="序号"
        />
        <el-table-column
          prop="purchaseCode"
          align="center"
          label="采购编号"
        />
        <el-table-column
          prop="supplyCompanyName"
          align="center"
          label="供应商"
          show-overflow-tooltip
        />
        <el-table-column
          prop="purchaseArchName"
          align="center"
          label="项目名称"
          show-overflow-tooltip
        />
        <el-table-column
          prop="purchaseWareHouseName"
          align="center"
          label="仓库名称"
          show-overflow-tooltip
        />
        <el-table-column
          prop="purchaseSum"
          align="center"
          label="采购数量"
        />
<!--        <el-table-column-->
<!--          prop="purchaseSum"-->
<!--          align="center"-->
<!--          label="已入库"-->
<!--        />-->
        <el-table-column
          prop="makeHouseDate"
          align="center"
          label="最近入库时间"
        />
        <el-table-column
          prop="purchaseCreatdate"
          align="center"
          label="制单时间"
        />
        <el-table-column
          prop="states"
          align="center"
          label="入库状态"
        />
        <el-table-column
          fixed="right"
          align="center"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button type="text" v-if="scope.row.states =='已完成'" disabled>入库</el-button>
            <el-button type="text" v-else="scope.row.states" @click="editSupplierInfo('入库',scope.row)">入库</el-button>

            <el-button type="text" @click="editSupplierInfo('edit',scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          :current-page="info.pageIndex"
          :page-size="info.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, prev, pager, next"
          :total="total"
          @current-change="currentPageChange"
          @size-change="sizeChangeHandle"
        />
      </div>
    </div>
    <eidt_class ref="eidt_class" @onQuery="onQuery"></eidt_class>
    <order_eidt_class ref="order_eidt_class" :warehouse="warehouse" :conProvideOptions="conProvideOptions"></order_eidt_class>
  </div>
</template>

<script>
  import { getPurchasePage } from '@/api/material/order'
  import { allConProvide, allWarehouse } from '@/api/material/dictionary'

  import eidt_class from "./eidt_class";
  import order_eidt_class from '../order/eidt_class'
  export default {
    name: 'order',
    props: {
      deptCode: {
        type: String,
        default: ''
      }
    },
    components:{
      eidt_class,
      order_eidt_class
    },
    data() {
      return {
        info: {
          purchaseCode:'',
          inHouseDateStart:'',
          inHouseDateEnd:'',
          materialName: '',
          states: '全部',
          pageSize: 10,
          pageIndex: 1
        },
        total: null,
        tableData: [],
        statesStockOut: [
          { value: '全部', label: '全部' },
          { value: '未入库', label: '未入库' },
          { value: '已入库', label: '已入库' },
          { value: '进行中', label: '进行中' },
        ],
        conProvideOptions:[],
        dataList:[],
        options:[
          { value: '通过', label: '通过' },
          { value: '未通过', label: '未通过' },
        ],
        loading: true,
        warehouse:[]
      }
    },
    mounted() {
      this.getDataList()
      this.getConProvide();
      this.getAllWarehouse();
    },
    methods: {
      getConProvide(){
        allConProvide().then(response=>{
          this.conProvideOptions = response.data;
          console.log("this.conProvideOptions",this.conProvideOptions)
        })
      },
      //获取仓库
      getAllWarehouse(){
        allWarehouse().then(response=>{
          this.warehouse = response.data;
          console.log("this.warehouse",this.warehouse)
        })
      },
      // 查看详情
      editSupplierInfo(edit,row) {
        if(edit=='入库'){
          this.$refs.eidt_class.eidtUpdateHandle(edit,row)
        }else{
          this.$refs.order_eidt_class.eidtUpdateHandle(row,edit)
        }
      },
      // 返回
      onBack() {
        this.$parent.showProjectMore(true)
      },
      // 读取数据
      // 读取数据
      getDataList() {
        let param = {
          "purchaseCode": this.info.purchaseCode,
          "supplyCompanyId": this.info.supplyCompanyId,
          "inHouseDateStart": this.info.inHouseDateStart,
          "inHouseDateEnd": this.info.inHouseDateEnd,
          "purchaseArchName": this.info.purchaseArchName,
          "purchaseWareHouseName": this.info.purchaseWareHouseName,
          "states": this.info.states,
        }
        if(!param.purchaseCode) delete param.purchaseCode;
        if(!param.supplyCompanyId) delete param.supplyCompanyId;
        if(!param.inHouseDateStart) delete param.inHouseDateStart;
        if(!param.inHouseDateEnd) delete param.inHouseDateEnd;
        if(!param.purchaseArchName) delete param.purchaseArchName;
        if(!param.purchaseWareHouseName) delete param.purchaseWareHouseName;
        if(param.states ==='全部') delete param.states;
        console.log(param);
        this.loading = true;
        getPurchasePage(param,this.info.pageIndex,this.info.pageSize).then(response=>{
          this.dataList = response.data.records;
          this.total = response.data.total;
          this.loading = false;
        })

      },
      // 修改页码
      sizeChangeHandle(num) {
        this.info.pageSize = num
        this.info.pageIndex = 1
        this.getDataList()
      },
      // 切换页面
      currentPageChange(num) {
        this.info.pageIndex = num
        this.getDataList()
      },
      // 条件查询
      onQuery() {
        this.info.pageIndex = 1
        this.getDataList()
      },
      // 重置
      onReset(formName) {
        this.$refs[formName].resetFields()
        this.getDataList()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .supplier-container{
    width: 100%;
    height: 100%;
    .sc-top{
      width: 100%;
      height: 80px;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 10px 10px 30px 10px #eeeeee;
      padding-top: 22px;
      padding-left: 20px;
    }
    .sc-table{
      width: 100%;
      margin-top: 20px;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 10px 10px 30px 10px #eeeeee;
      padding: 20px 20px;
    }
  }
  .new-add-contain{
    width: 50%;
    height: 500px;
    overflow-y: scroll;
  }
  .new-add-contain::-webkit-scrollbar{
    display: none;
  }
  .supply-info{
    width: 100%;
    font-size: 20px;
    font-weight: bolder;
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
    .supply-info-title{

    }
    .el-icon-circle-plus-outline, .el-icon-remove-outline{
      cursor: pointer;
    }
  }
  .payee{
    margin: 0;
    padding: 0;
    list-style-type: none;
  }
  .pagination{
    width: 100%;
    display: flex;
    flex-direction: row-reverse;
    margin-top: 20px;
  }
</style>
