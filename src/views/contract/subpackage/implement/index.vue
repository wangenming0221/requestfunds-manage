<template>
  <div class="htlyBox">
    <div class="search">
      <el-form :inline="true" :model="condition" class="demo-form-inline" label-width="100">
        <el-row :gutter="10" type="flex" justify="center">
          <el-col :span="4">
            <el-form-item  label="合同编号">
              <el-input v-model="condition.contractCode" placeholder="请输入合同编号" clearable style="margin-top: 10px;" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="合同名称">
              <el-input v-model="condition.contractName" placeholder="请输入合同名称" clearable style="margin-top: 10px;" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="所属项目">
              <el-select v-model="condition.projectCode" filterable placeholder="请选择所属项目" clearable style="margin-top: 10px;">
                <el-option
                  v-for="item in withProjectOptions"
                  :key="item.id"
                  :label="item.projectName"
                  :value="item.projectCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="供应商">
              <el-select v-model="condition.gys" clearable filterable placeholder="请选择供应商" clearable style="margin-top: 10px;">
                <el-option
                  v-for="item in listprovidecompany"
                  :key="item.id"
                  :label="item.pName"
                  :value="item.pName"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="合同状态">
              <el-select  v-model="condition.contractStatus" placeholder="请选择合同状态" clearable style="margin-top: 10px;">
                <el-option
                  v-for="item in contractState"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="合同分类">
              <el-select  v-model="condition.classifyCode" placeholder="请选择合同分类" clearable style="margin-top: 10px;">
                <el-option v-for="(item, index) in contractClassify" :key="index" :label="item.cname" :value="item.classifyCode"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="gettableData('search')" style="margin-top: 10px;">查询</el-button>
            <el-button icon="el-icon-refresh" @click="resetSearch" style="margin-top: 10px;">重置</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="tableData">
      <!-- @row-click="handleClickRow" -->
      <el-table
        :data="tableData"
        border
        :height="500"
        style="width: 100%"
      >
        <el-table-column
          fixed="left"
          prop="contractCode"
          label="合同编号"
          width="300"
        />
        <el-table-column
          fit="true"
          prop="contractName"
          label="合同名称"
          width="500"
        />
        <el-table-column
          prop="partyBDeputy"
          label="供应商"
          width="300"
        />
        <el-table-column
          prop="contractAmount"
          label="总合同金额"
          width="150"
        />
        <el-table-column
          prop="applyMoneyString"
          label="累计申请金额"
          width="150"
        />
        <el-table-column
          prop="reallyMoneyString"
          label="累计实付金额"
          width="150"
        />
        <el-table-column
          prop="overMoneyString"
          label="累计已支付金额"
          width="150"
        />
        <el-table-column
          prop="reserveMoneyString"
          label="累计预留金额"
          width="150"
        />
        <el-table-column
          prop="copeMoneyString"
          label="累计应付金额"
          width="150"
        />
        <el-table-column
          prop="deductionMoneyString"
          label="累计扣款金额"
          width="150"
        />
        <el-table-column
          prop="prop"
          label="合同"
          width="150"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.contractSealUrl">
              <el-button type="text" @click="downloadContract(scope.row)">下载查看</el-button>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="prop"
          label="补充协议"
          width="150"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.supplementSealUrl">
              <el-button type="text" @click="downloadSupplementSealUrl(scope.row)">下载查看</el-button>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="prop"
          label="附件"
          width="150"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.otherAttachmentUrl">
              <el-button type="text" @click="downloadContractSealUrl(scope.row)">下载查看</el-button>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="合同状态"
          width="150"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.keepStatus == 'SIGNING'">签订中</div>
            <div v-if="scope.row.keepStatus == 'COMPLETE'">履约中</div>
            <div v-if="scope.row.keepStatus == 'FILLING'">变更中</div>
            <div v-if="scope.row.keepStatus == 'TERMINATING'">解除</div>
            <div v-if="scope.row.keepStatus == 'TERMINATED'">终止</div>
            <div v-if="scope.row.keepStatus == 'FINISHED'">已完成</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="createtime"
          label="签订时间"
          width="200"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.createtime }}</span>
<!--            <span>{{ new Date(scope.row.createtime).getFullYear() + '-' + (new Date(scope.row.createtime).getMonth() + 1) + '-' + new Date(scope.row.createtime).getDate() }}</span>-->
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="180"
        >
          <template slot-scope="scope">
            <el-button type="text" @click="showUpdateStatus(scope.row)">修改状态</el-button>
            <el-button type="text" @click="checkDetails(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :total="pagination.total"
          @current-change="changeCurrentPage"
        />
      </div>
      <el-dialog
        title="合同状态"
        :visible.sync="contractStatusDialogVisible"
        width="30%"
        :before-close="cancel">
        <div>
          <el-select v-model="selectedContractStatus" placeholder="请选择合同状态">
            <el-option
              v-for="item in changeContractState"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="changeType">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import api from '@/api/work/contract'
export default {

  data() {
    return {
      labelPosition: 'top',
      selectedContractStatus: '',
      recordContractItem: null,
      contractStatusDialogVisible: false,
      fileList: [],
      input3: '',
      formDetails: {
        name: '',
        region: ''
      },
      dialogFormVisible: false,
      condition: {
        contractCode: null,
        contractName: null,
        projectCode: null,
        gys: null,
        contractStatus: null,
        classifyCode: '',
      },
      pagination: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      listprovidecompany: [],
      contractState: [
        // { name: '全部', value: '' },
        { name: '签订中', value: 'SIGNING' },
        { name: '履约中', value: 'COMPLETE' },
        { name: '变更中', value: 'FILLING' },
        { name: '解除', value: 'TERMINATING' },
        { name: '终止', value: 'TERMINATED' },
        { name: '已完成', value: 'FINISHED' }
      ],
      changeContractState: [
        // { name: '全部', value: '' },
        { name: '签订中', value: 'SIGNING' },
        { name: '履约中', value: 'COMPLETE' },
        { name: '变更中', value: 'FILLING' },
        { name: '解除', value: 'TERMINATING' },
        { name: '终止', value: 'TERMINATED' },
        { name: '已完成', value: 'FINISHED' }
      ],
      tableData: [],
      radio: '',
      detailsParams: {
        id: ''
      },
      withProjectOptions: [],
      contractClassify: []
    }
  },

  mounted() {
    this.init();
  },

  methods: {
    init() {
      this.condition.contractCode = this.$route.query.contractCode ? this.$route.query.contractCode : '';
      this.gettableData()
      this.getlistprovidecompany()
      this.getProjects()
      this.getContractTemplateTypeClassify()
    },
    // 获取合同分类下拉选
    getContractTemplateTypeClassify() {
      api.getContractTemplateTypeClassify().then(res => {
        console.log(res)
        if (res.code === 0) {
          this.contractClassify = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    checkDetails(item) {
      console.log(item)
      const params = {
        contractCode: null
      }
      params.contractCode = item.contractCode
      api.checkDetails(params).then(res => {
        console.log(res)
        if(res.code === 0) {
          window.open(res.data.contractUrl + '&T=' + res.data.token)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    downloadContract(item) {
      const params = {
        contractCode: null
      }
      params.contractCode = item.contractCode
      api.checkDetails(params).then(res => {
        console.log(res)
        if(res.code === 0) {
          window.open('https://bpm.jiuzhangdigit.com/api/api/aliyun/download_multi?multiVO=' + item.contractSealUrl + '&access_token=' + res.data.token)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    downloadSupplementSealUrl(item) {
      const params = {
        contractCode: null
      }
      params.contractCode = item.contractCode
      api.checkDetails(params).then(res => {
        console.log(res)
        if(res.code === 0) {
          window.open('https://bpm.jiuzhangdigit.com/api/api/aliyun/download_multi?multiVO=' + item.supplementSealUrl + '&access_token=' + res.data.token)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    downloadContractSealUrl(item) {
      const params = {
        contractCode: null
      }
      params.contractCode = item.contractCode
      api.checkDetails(params).then(res => {
        console.log(res)
        if(res.code === 0) {
          window.open('https://bpm.jiuzhangdigit.com/api/api/aliyun/download_multi?multiVO=' + item.otherAttachmentUrl + '&access_token=' + res.data.token)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 所属项目
    getProjects() {
      api.getProjects().then(res => {
        if (res.code === 0) {
          this.withProjectOptions = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    listContractDetails() {
      api.getContractDetails(this.detailsParams).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.formDetails = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },

    handleClickRow(item) {
      console.log('item', item)
      this.detailsParams.id = item.id
      this.dialogFormVisible = true
      this.listContractDetails()
    },
    handleCancel() {
      this.dialogFormVisible = false
    },
    handleConfirm() {
      this.dialogFormVisible = false
    },

    getlistprovidecompany() {
      api.listprovidecompany().then(res => {
        this.listprovidecompany = res.data.records
      })
    },

    gettableData(search = '') {
      if (search === 'search') {
        this.pagination = {
          pageSize: 10,
          pageNum: 1,
          total: 0
        }
      }
      const data = {
        ...this.condition,
        ...this.pagination
      }
      api.listcontract(data).then(res => {
        this.tableData = res.data.contracts
        this.pagination.total = res.data.total
      })
    },

    showUpdateStatus(item) {
      this.recordContractItem = item
      this.selectedContractStatus = item.keepStatus
      this.contractStatusDialogVisible = true
    },

    changeType() {
      const option = {
        contractCode: this.recordContractItem.contractCode,
        keepStatus: this.selectedContractStatus
      }
      api.updateKeepStatus(option).then(res => {
        if (res.code === 0) {
          this.contractStatusDialogVisible = false
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          this.gettableData('')
        }
      })
    },

    cancel() {
      this.contractStatusDialogVisible = false
    },

    resetSearch() {
      this.condition = { contractStatus: '' }
      this.gettableData()
    },

    changeCurrentPage(current) {
      console.log(current)
      this.pagination.pageNum = current
      this.gettableData()
    }
  }
}
</script>

<style lang="scss" scoped>
.htlyBox{
  width: 100%;
  height: 100%;
  padding: 20px;
}
.title{
    width: 100%;
    height: 50px;
    background-color: #ffffff;
    font-size: 18px;
    font-weight: 600;
    padding-left: 20px;
    line-height: 50px;
    display: flex;
    justify-content: space-between;
    border-radius: 10px;
    box-shadow: 10px 10px 30px 10px #eeeeee;
}
.titleBtn{
    padding-right: 20px;
}
.search{
  width: 100%;
  margin-bottom: 20px;
  padding-top: 20px;
  background-color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  padding-left: 20px;
  line-height: 50px;
  display: flex;
  border-radius: 10px;
  box-shadow: 0px 0px 10px -5px #eeeeee;
  border: 1px solid #eeeeee;
}
.tableData{
  width: 100%;
  margin-bottom: 20px;
  margin-top: 20px;
  background-color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  border-radius: 10px;
  box-shadow: 0px 0px 10px -5px #eeeeee;
  border: 1px solid #eeeeee;
  padding: 20px;
  box-sizing: border-box;
  position: relative;
}
.pagination{
  display: flex;
  flex-direction: row-reverse;
  padding-top: 20px;
}
.selectBox{
    width: 100%;
    height: 150px;
    position: relative;
}
.btnBox{
    position: absolute;
    bottom: 10px;
    right: 10px;
}
</style>
