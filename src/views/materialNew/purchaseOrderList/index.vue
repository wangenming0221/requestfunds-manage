<template>
  <div class="supplier-container">
    <!--   采购订单列表-NC同步   -->
    <div class="sc-top">
      <el-form ref="info" :inline="true" :model="info" class="demo-form-inline" size="mini">
        <el-form-item label="采购单号" prop="purchaseCode">
          <el-input v-model="info.purchaseCode"  placeholder="请输入采购单号" />
        </el-form-item>
        <el-form-item label="项目名称" prop="purchaseArchCode">
          <el-select v-model="info.purchaseArchCode" filterable placeholder="请选择项目名称">
            <el-option
              v-for="item in project"
              :key="item.projectCode"
              :label="item.deptName"
              :value="item.projectCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="采购类型" prop="purchaseType">
          <el-input v-model="info.purchaseType"  placeholder="请输入采购类型" />
<!--          <el-select v-model="info.states" filterable placeholder="请选择采购类型">-->
<!--            <el-option-->
<!--              v-for="item in statesStockOut"-->
<!--              :key="item.value"-->
<!--              :label="item.label"-->
<!--              :value="item.value">-->
<!--            </el-option>-->
<!--          </el-select>-->
        </el-form-item>
        <el-form-item label="订单日期" >
          <el-col :span="11">
            <el-form-item prop="startTime">
              <el-date-picker type="date" placeholder="请输入开始日期" v-model="info.startTime" style="width: 100%;" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="1">至</el-col>
          <el-col :span="11">
            <el-form-item prop="endTime">
              <el-date-picker type="date" placeholder="请输入结束日期" v-model="info.endTime" style="width: 100%;" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
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
          prop="applyCode"
          align="center"
          label="请购单号"
        />
        <el-table-column
          prop="purchaseCode"
          align="center"
          label="采购单号"
          show-overflow-tooltip
        />
        <el-table-column
          prop="purchaseArchName"
          align="center"
          label="项目名称"
          show-overflow-tooltip
        />
        <el-table-column
          prop="purchaseType"
          align="center"
          label="采购类型"
        />
        <el-table-column
          prop="orderDate"
          align="center"
          label="订单日期"
        />
        <el-table-column
          prop="purchasePersonName"
          align="center"
          label="采购员"
        />
        <el-table-column
          prop=""
          align="center"
          label="入库数量/采购数量"
        >
          <template slot-scope="scope">
            {{ scope.row.inSum }} / {{ scope.row.totalSum }}
          </template>
        </el-table-column>
        <el-table-column
          prop="shopCreateDate"
          align="center"
          label="预计送达日期"
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
<!--            <el-button type="text" v-if="scope.row.ncStates =='已完成'" disabled>入库</el-button>-->
<!--            <el-button type="text" v-else-if="scope.row.ncStates" @click="editSupplierInfo('update',scope.row)">入库</el-button>-->
            <el-button type="text" v-if="scope.row.ncStates =='已完成'" disabled>入库</el-button>
            <el-button type="text" v-else-if="scope.row.ncStates" @click="editSupplierInfo('update',scope.row)">入库</el-button>
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

    <!-- 采购订单入库-材料验收   -->
    <eidt_class ref="eidt_class" @onQuery="onQuery"></eidt_class>

    <!--   采购订单详情    -->
    <purchase_order_detail ref="purchase_order_detail" :warehouse="warehouse" :conProvideOptions="conProvideOptions"></purchase_order_detail>
  </div>
</template>

<script>
  import { getNewPurchasePage, getProject } from '@/api/materialNew/order'
  // import { allConProvide, allWarehouse } from '@/api/material/dictionary'

  import eidt_class from "./eidt_class"; //采购订单入库-材料验收
  import purchase_order_detail from './purchase_order_detail' //采购订单详情
  export default {
    name: 'purchaseOrderList',
    props: {
      deptCode: {
        type: String,
        default: ''
      }
    },
    components:{
      eidt_class,
      purchase_order_detail
    },
    data() {
      return {
        info: {
          purchaseCode:'',
          startTime:'',
          endTime:'',
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
        warehouse:[],
        project:[]
      }
    },
    mounted() {
      this.getDataList()
      // this.getConProvide();
      // this.getAllWarehouse();
      this.getProjectList();
    },
    methods: {
      getProjectList(){
        getProject().then(response=>{
          console.log("fgfgfhdgsffdsfghfd",response)
          this.project = response.data;
        })
      },
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
        if(edit=='update'){
          this.$refs.eidt_class.eidtUpdateHandle(edit,row)
        }else{
          this.$refs.purchase_order_detail.eidtUpdateHandle(row,edit)
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
          "purchaseArchCode": this.info.purchaseArchCode,
          "startTime": this.info.startTime,
          "endTime": this.info.endTime,
          "purchaseType": this.info.purchaseType,
        }
        if(!param.purchaseCode) delete param.purchaseCode;
        if(!param.purchaseArchCode) delete param.purchaseArchCode;
        if(!param.startTime) delete param.startTime;
        if(!param.endTime) delete param.endTime;
        if(!param.purchaseArchCode) delete param.purchaseArchCode;
        if(!param.purchaseType) delete param.purchaseType;
        this.loading = true;
        getNewPurchasePage(param,this.info.pageIndex,this.info.pageSize).then(response=>{
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
    .user-box{
      color: #5a5e66;
      font-size: 14px;
      margin-right: 14px;
      .change{
        text-decoration: underline;
        cursor: pointer;
        margin-right: 10px;
      }
    }
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
