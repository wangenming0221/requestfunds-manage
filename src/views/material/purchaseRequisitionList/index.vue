<template>
  <div class="supplier-container">
    <!--  采购制单-系统  -->
    <div class="sc-top">
      <el-form ref="searchFrom" :inline="true" :rules="rules" :model="searchFrom" class="demo-form-inline" size="mini">
        <el-form-item label="单据号码" prop="sequenceNo">
          <el-input v-model="searchFrom.sequenceNo" placeholder="请输入单据号码" />
        </el-form-item>
<!--        <el-form-item label="申请材料名称" prop="pPeople">-->
<!--          <el-input v-model="searchFrom.pPeople" placeholder="请输入申请材料名称" />-->
<!--        </el-form-item>-->
        <el-form-item label="申请人姓名" prop="creater">
          <el-input v-model="searchFrom.creater" placeholder="请输入申请人姓名" />
        </el-form-item>
        <el-form-item label="申请时间">
          <el-col :span="11">
            <el-form-item prop="startTime">
            <el-date-picker type="date" placeholder="请输入开始日期" v-model="searchFrom.startTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="1">至</el-col>
          <el-col :span="11">
            <el-form-item prop="endTime">
            <el-date-picker type="date" placeholder="请输入结束日期" v-model="searchFrom.endTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="searchFrom.projectName" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="计划类型" prop="purchaseType">
          <el-select v-model="searchFrom.purchaseType" placeholder="请选择计划类型">
            <el-option v-for="(item, index) in purchaseOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="施工类型" prop="constructionType">
          <el-select v-model="searchFrom.constructionType" placeholder="请选择计划类型">
            <el-option v-for="(item, index) in constructionOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onReset('searchFrom')">重置</el-button>
          <el-button type="primary" @click="onQuery">搜索</el-button>
        </el-form-item>
      </el-form>

    </div>
    <div class="sc-table">
      <el-table
        :data="tableData"
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
          prop="sequenceNo"
          align="center"
          label="申购单号"
        />
        <el-table-column
          prop="projectName"
          align="center"
          show-overflow-tooltip
          label="项目名称"
        />
        <el-table-column
          prop="purchaseType"
          align="center"
          label="计划类型"
        />
        <el-table-column
          prop="constructionType"
          align="center"
          label="施工类型"
        />
        <el-table-column
          prop="requiredArrivalTime"
          align="center"
          label="要求到货时间"
        />
        <el-table-column
          prop="creater"
          align="center"
          label="申请人"
        />
        <el-table-column
          prop="createdTime"
          align="center"
          label="申请时间"
        />
        <el-table-column
          prop="allowance"
          align="center"
          label="制单余量"
        />
        <el-table-column
          prop="aboutTime"
          align="center"
          label="制单时间"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.aboutTime ==''">-</div>
            <div v-else>{{ scope.row.aboutTime }}</div>
            <div></div>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          align="center"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" v-if="scope.row.allowance != 0" @click="editSupplierInfo(scope.row)">制单</el-button>
            <el-button type="text" size="small" v-else disabled>制单</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          :current-page="searchFrom.pageIndex"
          :page-size="searchFrom.pageSize"
          layout="total, prev, pager, next"
          :total="total"
          @current-change="currentPageChange"
        />
      </div>
    </div>
    <eidt_class ref="eidt_class" @onQuery="onQuery"></eidt_class>


  </div>
</template>

<script>
  import { getPurchaseData } from '@/api/material/purchaseRequisitionList'

  import eidt_class from "./eidt_class";

  export default {
    name: 'order',
    components:{
      eidt_class,

    },
    data() {
      return {
        recordId: {
          id: ''
        },
        searchFrom: {
          sequenceNo: '',
          creater: '',
          startTime: '',
          endTime: '',
          projectName: '',
          purchaseType: '',
          constructionType: '',
          pageSize: 10,
          pageIndex: 1
        },
        total: null,
        tableData: [],
        // 参数
        info:{},
        purchaseOption:[ //计划类型
          { label:'一般材料申购', value:'一般材料申购' },
          { label:'代购材料类', value:'代购材料类' },
          { label:'035样板及示范项目（未发立项）', value:'035样板及示范项目（未发立项）' },
          { label:'维修材料', value:'维修材料' },
        ],
        constructionOption:[  //施工类型
          { label:'自营', value:'自营' },
          { label:'机电', value:'机电' },
          { label:'精装修', value:'精装修' },
          { label:'扩大劳务项目经理', value:'扩大劳务项目经理' },
          { label:'扩大劳务自营', value:'扩大劳务自营' },
          { label:'小班组', value:'小班组' },
          { label:'扩大劳务班组', value:'扩大劳务班组' },
          { label:'大劳务', value:'大劳务' },
        ],
        loading: true,
        rules:{}
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      // 查看详情
      editSupplierInfo(row) {
        this.$refs.eidt_class.eidtUpdateHandle('update', row)
      },
      init() {
        let param = {
          "sequenceNo": this.searchFrom.sequenceNo,
          "creater": this.searchFrom.creater,
          "startTime": this.searchFrom.startTime,
          "endTime": this.searchFrom.endTime,
          "projectName": this.searchFrom.projectName,
          "purchaseType": this.searchFrom.purchaseType,
          "constructionType": this.searchFrom.constructionType,
        }
        if(!param.sequenceNo) delete param.sequenceNo;
        if(!param.creater) delete param.creater;
        if(!param.startTime) delete param.startTime;
        if(!param.endTime) delete param.endTime;
        if(!param.projectName) delete param.projectName;
        if(!param.purchaseType) delete param.purchaseType;
        if(!param.constructionType) delete param.constructionType;
        console.log(param);
        this.loading = true;
        getPurchaseData(param,this.searchFrom.pageIndex,this.searchFrom.pageSize).then(res => {
          console.log(res)
            this.tableData = res.data.records
            this.total = res.data.total
            this.loading = false;
        }).catch(err => {
          console.log(err)
        })
      },
      // 切换页面
      currentPageChange(num) {
        this.searchFrom.pageIndex = num
        this.init()
      },
      // 条件查询
      onQuery() {
        this.searchFrom.pageIndex = 1
        this.init()
      },
      // 重置
      onReset(formName) {
        this.$refs[formName].resetFields()
        this.init()
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
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 10px 10px 30px 10px #eeeeee;
      padding-top: 15px;
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
