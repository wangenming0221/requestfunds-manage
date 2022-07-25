<template>
  <div class="supplier-container">
    <div class="sc-top">
      <el-form ref="queryForm" :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="合同编号" prop="pName">
          <el-select v-model="moreParams.contractCode" placeholder="请选择合同编号">
            <el-option
              v-for="item in optionsContractCode"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合同名称" prop="pPeople">
          <el-select v-model="moreParams.contractName" placeholder="请选择合同名称">
            <el-option
              v-for="item in optionsContractName"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="onQuery">查询</el-button>
          <el-button icon="el-icon-refresh" @click="onReset('queryForm')">重置</el-button>
          <el-button icon="el-icon-back" @click="onBack">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="sc-table">
      <div class="sc-list-title">
        <div class="sc-list-title-top">
          <span class="sc-list-title-icon" />
          <span class="sc-list-title-text">总包合同信息</span>
        </div>
      </div>
      <div class="sc-table-list">
        <el-table
          :data="projectMsgDtoList"
          border
          :height="500"
          style="width: 100%"
        >
          <el-table-column
            type="index"
            align="center"
            label="序号"
            width="55"
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
            label="项目承包模式"
          />
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
    <div class="sc-table">
      <div class="sc-list-title">
        <div class="sc-list-title-top">
          <span class="sc-list-title-icon" />
          <span class="sc-list-title-text">承包人/专业分包合同信息</span>
        </div>
      </div>
      <div class="sc-table-list">
        <el-table
          :data="contractList"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="contractName"
            align="center"
            label="合同名称"
          />
          <el-table-column
            prop="classifyName"
            align="center"
            label="合同分类"
          />
<!--          <el-table-column-->
<!--            prop="projectName"-->
<!--            align="center"-->
<!--            label="下游分包工程名称"-->
<!--          />-->
<!--          <el-table-column-->
<!--            prop="contractCode"-->
<!--            align="center"-->
<!--            label="分包名称"-->
<!--          />-->
          <el-table-column
            prop="approvalMoney"
            align="center"
            label="申请金额"
          />
          <el-table-column
            prop="subContractFinishTime"
            align="center"
            label="计划合同签订完成时间"
          />
          <el-table-column
            prop="reallyMoney"
            align="center"
            label="实付金额"
          />
          <el-table-column
            prop="overMoney"
            align="center"
            label="已付金额"
          />
          <el-table-column
            prop="isInternalScope"
            align="center"
            label="是否是承包人范围内"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.isInternalScope === 0">否</span>
              <span v-else>是</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="contractor"
            align="center"
            label="承包人"
          />
          <el-table-column
            prop="stampTime"
            align="center"
            label="完成时间"
          />
          <el-table-column
            prop="contractState"
            align="center"
            label="合同状态"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.contractState === '1'">草稿</span>
              <span v-if="scope.row.contractState === '2'">审批中</span>
              <span v-if="scope.row.contractState === '3'">变更中</span>
              <span v-if="scope.row.contractState === '4'">已完成</span>
              <span v-if="scope.row.contractState === '5'">待生效</span>
              <span v-if="scope.row.contractState === '6'">已终止</span>
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
  </div>
</template>

<script>
import contractApi from '@/api/work/contract'
export default {
  name: 'ProjectTable',
  props: {
    projectCode: {
      type: String
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
      contractList: [],
      projectMsgDtoList: [],
      moreParams: {
        projectCode: '',
        // 合同编号
        contractCode: '',
        // 合同名称
        contractName: ''
      },
      optionsContractCode: [],
      optionsContractName: []
    }
  },
  mounted() {
    this.moreParams.projectCode = this.projectCode
    this.init()
    this.listContractNameOptions()
    this.listContractCodeOptions()
  },
  methods: {
    // 查看详情
    editSupplierInfo(item) {
      this.$parent.checkDetails(true)
    },
    // 合同名称下拉选
    listContractNameOptions() {
      contractApi.listContractNameOptions().then(res => {
        if (res.code === 0) {
          this.optionsContractName = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 合同编码下拉选
    listContractCodeOptions() {
      contractApi.listContractCodeOptions().then(res => {
        if (res.code === 0) {
          this.optionsContractCode = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 返回
    onBack() {
      this.$parent.showProjectMore(true)
    },
    init() {
      // debugger
      // this.moreParams.projectCode = projectCode
      contractApi.checkProjectListDetails(this.moreParams).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.contractList = res.data.contractList
          this.projectMsgDtoList = res.data.projectMsgDtoList
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 换页
    currentPageChange(page) {
      console.log(page)
      this.queryForm.pageNum = page
      this.init()
    },
    // 条件查询
    onQuery() {
      delete this.moreParams.projectCode
      this.init()
    },
    // 重置
    onReset(formName) {
      this.moreParams.contractCode = ''
      this.moreParams.contractName = ''
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
      height: 80px;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 10px 10px 30px 10px #eeeeee;
      padding-top: 20px;
      padding-left: 20px;
    }
    .sc-table{
      width: 100%;
      margin-top: 20px;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 10px 10px 30px 10px #eeeeee;
      padding: 20px 20px;
      display: flex;
      flex-direction: column;
      .sc-list-title{
        width: 100%;
        display: flex;
        justify-content: space-between;
        .sc-list-title-top{
          padding-left: 20px;
          display: flex;
          flex-direction: row;
          margin-top: 10px;
          .sc-list-title-icon{
            width: 6px;
            height: 15px;
            background-color: #3A78F1;
            margin-top: 20px;
          }
          .sc-list-title-text{
            font-size: 15px;
            padding-top: 20px;
            margin-left: 10px;
          }
        }
      }
      .sc-table-list{
        width: 100%;
        padding: 20px 20px;
      }
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
