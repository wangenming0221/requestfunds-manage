<template>
  <div class="supplier-container">
    <div class="sc-top">
      <el-form ref="queryForm" :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="项目编码" prop="pName">
          <el-input v-model="queryForm.pName" size="small" placeholder="请输入项目编码" />
        </el-form-item>
        <el-form-item label="项目名称" prop="pPeople">
          <el-input v-model="queryForm.pPeople" size="small" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="onQuery">查询</el-button>
          <el-button size="small" type="primary" @click="onReset('queryForm')">重置</el-button>
          <el-button size="small" type="primary" @click="onBack">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="sc-table">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column
          type="index"
          align="center"
          label="序号"
        />
        <el-table-column
          prop="projectCode"
          align="center"
          label="项目编码"
        />
        <el-table-column
          prop="projectName"
          align="center"
          label="项目名称"
        />
        <el-table-column
          prop="generalContractName"
          align="center"
          label="总包合同名称"
        />
        <el-table-column
          prop="generalContractCode"
          align="center"
          label="总包合同编号"
        />
        <el-table-column
          prop="generalContractAmount"
          align="center"
          label="总包合同金额"
        />
        <el-table-column
          prop="contractTypeStr"
          align="center"
          label="经营模式"
        />
        <el-table-column
          prop="contractTotal"
          align="center"
          label="合同总数"
        />
        <el-table-column
          prop="signedTotal"
          align="center"
          label="已签合同"
        />
        <el-table-column
          prop="projectAmount"
          align="center"
          label="项目总金额"
        />
        <el-table-column
          prop="applyAmount"
          align="center"
          label="申请金额"
        />
        <el-table-column
          prop="payAmount"
          align="center"
          label="应付金额"
        />
        <el-table-column
          prop="overPayAmount"
          align="center"
          label="已支付金额"
        />
        <el-table-column
          fixed="right"
          align="center"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="editSupplierInfo(scope.row)"
            >
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          :current-page="queryForm.pageNum"
          :page-size="queryForm.pageSize"
          layout="total, prev, pager, next"
          :total="total"
          @current-change="currentPageChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api/work/contract'
export default {
  name: 'ProjectTable',
  props: {
    deptCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      recordId: {
        id: ''
      },
      queryForm: {
        pName: '',
        pType: '',
        pPeople: '',
        pageSize: 10,
        pageNum: 1
      },
      total: null,
      tableData: [],
      // 参数
      moreParams: {
        requestType: 1,
        pageSize: 10,
        pageNum: 1,
        projectCode: '',
        projectName: '',
        deptCode: ''
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 查看详情
    editSupplierInfo(item) {
      this.$parent.checkDetails(true, item)
    },
    // 返回
    onBack() {
      this.$parent.showProjectMore(true)
    },
    init() {
      this.moreParams.deptCode = this.deptCode
      api.listMoreProjectList(this.moreParams).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.tableData = res.data.projectMsgDtoList
          this.total = res.data.total
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 换页
    currentPageChange(page) {
      this.moreParams.pageNum = page
      this.init()
    },
    // 条件查询
    onQuery() {
      this.moreParams.projectCode = this.queryForm.pName
      this.moreParams.projectName = this.queryForm.pPeople
      this.moreParams.pageNum = 1
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
      height: 50px;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 10px 10px 30px 10px #eeeeee;
      padding-top: 5px;
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
