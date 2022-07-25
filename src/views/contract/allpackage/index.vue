<template>
  <div class="contract-container">
    <div class="cc-top">
      <el-form ref="allContractParams" :inline="true" :model="allContractParams" class="demo-form-inline" size="mini">
        <el-form-item label="合同名称" prop="contractName">
          <el-input v-model="allContractParams.contractName" clearable placeholder="请输入合同名称" />
        </el-form-item>
        <el-form-item label="项目编码" prop="projectCode">
          <el-input v-model="allContractParams.projectCode" clearable placeholder="请输入项目编码" />
        </el-form-item>
        <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="allContractParams.projectName" clearable placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="合同编号" prop="contractCode">
          <el-input v-model="allContractParams.contractCode" clearable placeholder="请输入合同编号" />
        </el-form-item>
        <el-form-item label="所属分公司" prop="parentRegion">
          <!-- @change="handleSubCompanyChange" -->
          <el-select clearable filterable @clear="clearSubCompany" v-model="allContractParams.parentRegion" placeholder="请选择所属分公司">
            <el-option
              v-for="item in tableData"
              :key="item.id"
              :label="item.branchOffice"
              :value="item.branchOffice"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onQuery">查询</el-button>
          <el-button icon="el-icon-refresh" @click="onReset('allContractParams')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="cc-data">
      <div class="cc-table-head">
        <div class="cc-th-left">
          <span class="cc-th-left-icon"></span>
          <span class="cc-th-left-title">数据列表</span>
        </div>
        <div class="cc-th-right">
          <el-button icon="el-icon-plus" size="small" :style="{ background: '#409EFF', color: '#fff' }" @click="addAll">添加总包合同</el-button>
        </div>
      </div>
      <div class="cc-table">
        <el-table
          :data="tableData"
          border
          style="width: 100%"
        >
<!--          <el-table-column-->
<!--            fixed="left"-->
<!--            type="selection"-->
<!--            label="全选"-->
<!--            width="55">-->
<!--          </el-table-column>-->
          <el-table-column
            prop="contractName"
            align="center"
            label="合同名称"
            width="600"
            fixed="left"
          />
          <el-table-column
            prop="contractCode"
            align="center"
            label="合同编号"
            width="600"
          />
          <el-table-column
            prop="proName"
            align="center"
            label="项目名称"
            width="600"
          />
          <el-table-column
            prop="projectCode"
            align="center"
            label="项目编码"
            width="200"
          />
          <el-table-column
            prop="accountingArea"
            align="center"
            label="MDG项目编码"
            width="150"
          />
          <el-table-column
            prop="branchOffice"
            align="center"
            label="所属分公司"
            width="150"
          />
          <el-table-column
            prop="contractor"
            align="center"
            label="项目承包人"
            width="150"
          />
          <el-table-column
            prop="contractingMode"
            align="center"
            label="项目承包模式"
            width="200"
          >
          </el-table-column>
          <el-table-column
            prop="contractAmount"
            align="center"
            label="合同涉及金额"
            width="200"
          />
          <el-table-column
            prop="contractAmount"
            align="center"
            label="累计合同涉及金额"
            width="200"
          />
          <el-table-column
            prop="structuralStyle"
            align="center"
            label="结构形式"
            width="150"
          />
          <el-table-column
            prop="totalArea"
            align="center"
            label="总建筑面积"
            width="150"
          />
          <el-table-column
            prop="contractSealUrl"
            align="center"
            label="合同文件"
            width="150"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.contractSealUrl">
                <el-button type="text" @click="downloadFile(scope.row.contractSealUrl)">下载查看</el-button>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="contractStateTime"
            align="center"
            label="签订时间"
            width="200"
          >
            <!-- <template slot-scope="scope">
              <span>{{ moment(scope.row.stampTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
            </template> -->
          </el-table-column>
          <el-table-column
            fixed="right"
            align="center"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="checkDetails(scope.row)"
              >
                查看详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            background
            :current-page="allContractParams.pageNum"
            :page-size="allContractParams.pageSize"
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
import moment from 'moment'
export default {
  name: 'AllContract',
  data() {
    return {
      moment: moment,
      queryForm: {
        cname: '',
        pageSize: 10,
        pageNum: 1
      },
      total: null,
      tableData: [],
      dialogTitle: '',
      newAddShow: false,
      newForm: {
        pid: '',
        type: null,
        cname: '',
        process_name: '',
        sortNum: null,
        modelId: '',
        modelTwoId: '',
        status: 0,
        // 关联合同范本
        contractName: '',
        // 关联补充协议范本
        cmsmall: ''
      },
      newFormRuleForm: {
        cname: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ],
        sortNum: [
          { required: true, message: '请输入权重排序', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请输入分类属性', trigger: 'change' }
        ],
        contractName: [
          { required: true, message: '请关联合同范本', trigger: 'change' }
        ],
        cmsmall: [
          { required: true, message: '请关联补充协议范本', trigger: 'change' }
        ]
        // pathName: [
        //   { required: true, message: '请选择路径', trigger: 'change' },
        // ]
      },
      // 路径选择
      pathName: '',
      recordId: {
        id: ''
      },
      classificationValue: [],
      classificationOptions: [],
      type1: '',
      type2: '',
      contractTemplateOptions: [],
      contractSupplyOptions: [],
      // 初始化列表参数
      allContractParams: {
        contractName: null,
        projectCode: '',
        contractCode: '',
        parentRegion: '',
        projectName: null,
        pageSize: 10,
        pageNum: 1
      },
      blockOptions: [],
      subCompanyOptions: []
    }
  },
  computed: {
    // 选中终点分类 显示 关联范本
    typeShow() {
      return this.newForm.type === 2
    }
  },
  created() {
    this.getAllContract()
    this.getParentRegion()
    this.getSubCompany()
  },
  methods: {
    handleSubCompanyChange(val) {
      console.log(val)
      this.subCompanyOptions.forEach((item, index) => {
        if(item.label === val) {
          this.allContractParams.parentRegion = item.id
        }
      })
    },
    clearSubCompany() {
      this.getAllContract()
    },
    // 获取所属分公司
    getSubCompany() {
      contractApi.getSubCompany().then(res => {
        console.log(res)
        if(res.code === 0) {
          this.subCompanyOptions = res.data[0].children
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取所属分区
    getParentRegion() {
      contractApi.getParentRegion().then(res => {
        console.log(res)
        if(res.code === 0) {
          this.blockOptions = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    downloadFile(item) {
      window.open(item)
    },
    addAll(item) {
      contractApi.addAll().then(res => {
        console.log(res)
        if (res.code === 0) {
          window.open(res.data);
        } else {
          this.$message({
            type: 'warning',
            message: res.msg
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取总包合同列表
    getAllContract() {
      let allContractParams = JSON.parse(JSON.stringify(this.allContractParams))
      contractApi.getAllContract(allContractParams).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.tableData = res.data.records
          this.total = res.data.total
        }
      }).catch(err => {
        console.log(err);
      })

    },
    // 查询
    onQuery() {
      this.allContractParams.pageNum = 1
      this.getAllContract()
    },
    // 重置
    onReset(formName) {
      this.$refs[formName].resetFields()
      this.allContractParams.pageNum = 1
      this.allContractParams.pageSize = 10
      this.getAllContract()
    },
    // 查看详情
    checkDetails(item) {
      const params = {
        id: null
      }
      params.id = item.id
      contractApi.checkDetailWithAllContract(params).then(res => {
        console.log(res)
        if (res.code === 0) {
          window.open(res.data.url + '&T=' + res.data.token)
        } else {
          this.$message({
            type: 'warning',
            message: res.msg
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    currentPageChange(val) {
      this.allContractParams.pageNum = val
      this.getAllContract()
    }
  }
}
</script>

<style lang="scss" scoped>
  .contract-container{
    width: 100%;
    height: 100%;
    padding: 20px;
    .cc-top{
      width: 100%;
      height: 60px;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0px 0px 10px -5px #eeeeee;
      border: 1px solid #eeeeee;
      padding-top: 13px;
      padding-left: 20px;
    }
    .cc-data{
      width: 100%;
      margin-top: 20px;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0px 0px 10px -5px #eeeeee;
      border: 1px solid #eeeeee;
      display: flex;
      flex-direction: column;
      .cc-table-head{
        height: 50px;
        display: flex;
        justify-content: space-between;
        .cc-th-left{
          display: flex;
          flex-direction: row;
          margin-left: 20px;
          margin-top: 20px;
          .cc-th-left-icon{
            width: 5px;
            height: 15px;
            background-color: #3A78F1;
          }
          .cc-th-left-title{
            font-size: 16px;
            color: #333333;
            margin-left: 10px;
          }
        }
        .cc-th-right{
          padding-right: 20px;
          padding-top: 15px;
        }
      }
      .cc-table{
        padding: 20px 20px;
      }
    }
  }
  .pagination{
    width: 100%;
    display: flex;
    flex-direction: row-reverse;
    margin-top: 20px;
  }
</style>
