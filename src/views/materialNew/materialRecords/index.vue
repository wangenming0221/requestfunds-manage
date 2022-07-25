<template>
  <div class="supplier-container">
    <!--    材料验收记录   -->
    <div class="sc-top">
      <el-form ref="inRule" :inline="true" :model="info" class="demo-form-inline" size="mini">
        <el-form-item label="入库单号" prop="inWareHouseCode">
          <el-input v-model="info.inWareHouseCode"  placeholder="请输入入库单号" clearable />
        </el-form-item>
        <el-form-item label="供应商">
          <el-select v-model="info.supplyCompanyId" filterable clearable placeholder="请选择供应商">
            <el-option
              v-for="item in conProvideOptions"
              :key="item.id"
              :label="item.pname"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入库时间">
          <el-col :span="11">
            <el-date-picker clearable type="date" placeholder="请输入开始日期" v-model="info.inWareHouseDateStart" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col :span="1">至</el-col>
          <el-col :span="11">
            <el-date-picker clearable type="date" placeholder="请输入结束日期" v-model="info.inWareHouseDateEnd" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="项目名称" prop="purchaseArchName">
          <el-input v-model="info.purchaseArchName"  placeholder="请输入项目名称" clearable />
        </el-form-item>
<!--        <el-form-item label="仓库名称" prop="purchaseWareHouseName">-->
<!--          <el-input v-model="info.purchaseWareHouseName"  placeholder="请输入仓库名称" clearable />-->
<!--        </el-form-item>-->
        <el-form-item label="入库状态" prop="states">
          <el-select v-model="info.states" filterable placeholder="请选择入库状态" clearable >
            <el-option
              v-for="item in statesStockOut"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button  type="primary" @click="onReset('inRule')">重置</el-button>
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
          prop="inWareHouseCode"
          align="center"
          label="入库单号"
        />
        <el-table-column
          prop="supplyCompanyName"
          align="center"
          label="供应商"
        />
        <el-table-column
          prop="purchaseArchName"
          align="center"
          label="项目名称"
          show-overflow-tooltip
        />
<!--        <el-table-column-->
<!--          prop="purchaseWareHouseName"-->
<!--          align="center"-->
<!--          label="仓库名称"-->
<!--          show-overflow-tooltip-->
<!--        />-->
<!--        <el-table-column
          prop="purchaseSum"
          align="center"
          label="采购数量"
        />-->
        <el-table-column
          prop="inHouseSum"
          align="center"
          label="已入库"
        />
        <el-table-column
          prop="makeHouseDate"
          align="center"
          label="最近入库时间"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.makeHouseDate">{{ scope.row.makeHouseDate }}</div>
            <div v-else>-</div>
          </template>
        </el-table-column>
<!--        <el-table-column
          prop="purchaseCreatdate"
          align="center"
          label="制单时间"
        />-->
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
            <el-button type="text" @click="editSupplierInfo(scope.row,'edit')">查看详情</el-button>
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
    <records_eidt_class ref="records_eidt_class" :conProvideOptions="conProvideOptions"></records_eidt_class>
  </div>
</template>

<script>
  import { getMaterialRecord } from '@/api/material/materialRecords';

  import { getRecordById } from '@/api/material/materialRecords';
  import { allConProvide } from '@/api/material/dictionary';
  import records_eidt_class from "./records_eidt_class";

  export default {
    name: 'order',
    props: {
      deptCode: {
        type: String,
        default: ''
      }
    },
    components:{
      records_eidt_class
    },
    data() {
      return {
        loading: true,
        info: {
          inWareHouseCode:'',
          inWareHouseDateStart:'',
          inWareHouseDateEnd:'',
          materialName: '',
          states: '全部',
          pageSize: 10,
          pageIndex: 1
        },
        total: null,
        dataList: [],
        statesStockOut: [
          { value: '全部', label: '全部' },
          { value: '未入库', label: '未入库' },
          { value: '已完成', label: '已完成' },
          { value: '进行中', label: '进行中' },
        ],
        conProvideOptions:[],
        inRule:{

        }
      }
    },
    mounted() {
      this.getDataList();
      this.getConProvide();
    },
    methods: {
      // 查看详情
      editSupplierInfo(row,edit) {
        console.log("1212")
        this.$refs.records_eidt_class.eidtUpdateHandle(row, edit)
      },
      getConProvide(){
        allConProvide().then(response=>{
          this.conProvideOptions = response.data
          console.log("conProvideOptions",this.conProvideOptions)
        })
      },
      // 读取数据
      getDataList() {
        let param = {
          "inWareHouseCode": this.info.inWareHouseCode,
          "supplyCompanyId": this.info.supplyCompanyId,
          "inWareHouseDateStart": this.info.inWareHouseDateStart,
          "inWareHouseDateEnd": this.info.inWareHouseDateEnd,
          "purchaseArchName": this.info.purchaseArchName,
          "purchaseWareHouseName": this.info.purchaseWareHouseName,
          "states": this.info.states,
        }
        if(!param.inWareHouseCode) delete param.inWareHouseCode;
        if(!param.supplyCompanyId) delete param.supplyCompanyId;
        if(!param.inWareHouseDateStart) delete param.inWareHouseDateStart;
        if(!param.inWareHouseDateEnd) delete param.inWareHouseDateEnd;
        if(!param.purchaseArchName) delete param.purchaseArchName;
        if(!param.purchaseWareHouseName) delete param.purchaseWareHouseName;
        if(param.states ==='全部') delete param.states;
        console.log(param);
        this.loading = true;
        getMaterialRecord(param,this.info.pageIndex,this.info.pageSize).then(response=>{
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
        this.info = {
          inWareHouseCode:'',
          inWareHouseDateStart:'',
          inWareHouseDateEnd:'',
          materialName: '',
          states: '全部',
          pageSize: 10,
          pageIndex: 1
        },
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
      height: 110px;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 10px 10px 30px 10px #eeeeee;
      padding-top: 15px;
      padding-left: 25px;
      padding-right: 25px;
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
