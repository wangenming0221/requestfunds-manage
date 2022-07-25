<template>
  <div class="contract-approve">
    <div class="ca-filter">
      <el-form :inline="true" :model="approveForm" class="demo-form-inline">
        <el-row type="flex" justify="center" gutter="10">
          <el-col :span="5" style="margin-left: 30px">
            <el-form-item label="所属项目">
              <el-select v-model="approveForm.projectName" filterable placeholder="请选择所属项目" @change="handleChangeProjectName">
                <el-option
                  v-for="item in projects"
                  :key="item.id"
                  :label="item.projectName"
                  :value="item.projectName"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="相关方">
              <el-select v-model="approveForm.contractPartyName" filterable placeholder="请选择相关方">
                <el-option
                  v-for="(item, index) in party"
                  :key="index"
                  :label="item.partyBDeputy"
                  :value="item.partyBDeputy"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="创建人">
              <el-input v-model="approveForm.createName" placeholder="请输入创建人姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="流程名称">
              <el-select v-model="approveForm.approveName" filterable clearable placeholder="请选择流程名称" @change="handleChangeApproveName">
                <el-option
                  v-for="(item, index) in tableData"
                  :key="index"
                  :label="item.instanceName"
                  :value="item.instanceName"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="处理状态">
              <el-select v-model="approveForm.contractStatus" placeholder="请选择处理状态">
                <el-option label="全部" :value="''" />
                <el-option label="待办" :value="'待办'" />
                <el-option label="已办" :value="'已办'" />
                <el-option label="完结" :value="'完结'" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center" gutter="10">
          <el-col :span="5" style="margin-left: 30px">
            <el-form-item label="合同分类">
              <el-select v-model="approveForm.classifyName" filterable clearable placeholder="请选择合同分类" @change="handleTypeTreeChange">
                <el-option
                  v-for="(item, index) in flowName"
                  :key="index"
                  :label="item.workflowName"
                  :value="item.workflowName"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="合同编号">
              <el-input v-model="approveForm.contractCode" placeholder="请输入合同编号" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="合同名称">
              <el-input v-model="approveForm.contractName" placeholder="请输入合同名称" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="添加日期">
              <el-date-picker
                v-model="approveForm.stime"
                type="date"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                placeholder="起点时间"
              />
              <el-date-picker
                style="margin-left: 10px"
                v-model="approveForm.etime"
                type="date"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                placeholder="截止时间"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <div class="form-item">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="onQuery">查询</el-button>
            <el-button icon="el-icon-refresh" @click="onReset">重置</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="ca-table">
      <el-table
        :height="500"
        v-loading="loading"
        element-loading-text="拼命加载中"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column
          fixed="left"
          align="center"
          prop="instanceName"
          label="流程名称"
          width="300"
        />
        <el-table-column
          align="center"
          prop="contractName"
          label="合同名称"
          width="600"
        />
        <el-table-column
          align="center"
          prop="contractCode"
          label="合同编号"
          width="300"
        />
        <el-table-column
          align="center"
          prop="classifyCode"
          label="合同分类"
          width="300"
        />
        <el-table-column
          align="center"
          prop="creater"
          label="创建人"
          width="150"
        />
        <el-table-column
          align="center"
          prop="createdTime"
          label="添加时间"
          width="200"
        />
        <el-table-column
          align="center"
          prop="projectName"
          label="所属项目"
          width="300"
        />
        <el-table-column
          align="center"
          prop="sourceName"
          label="当前节点"
          width="300"
        />
        <el-table-column
          align="center"
          prop="workState"
          label="处理状态"
          width="150"
        />
        <el-table-column
          fixed="right"
          align="center"
          prop="address"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button v-if="scope" type="text" @click="checkApproveDetails(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next, jumper"
          :total="totalPage"
          @current-change="currentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api/work/contract'
export default {
  name: 'ContractApprove',
  data() {
    return {
      approveForm: {
        contractName: '',
        contractCode: '',
        classifyCode: '',
        projectCode: '',
        contractPartyName: '',
        approveName: '',
        createName: '',
        stime: '',
        etime: '',
        pageSize: 10,
        pageNum: 1,
        contractStatus: '',
        // 附加
        projectName: '',
        classifyName: ''
      },
      tableData: [],
      classifyParams: {
        classifyId: ''
      },
      // 所属项目
      projects: [],
      // 相关方
      party: [],
      // 流程名称
      flowName: [],
      // 分类树
      typeTree: [],
      typeProps: {
        checkStrictly: true,
        value: 'cname',
        label: 'cname'
      },
      loading: false,
      totalPage: 0,
      bpmToken: ''
    }
  },
  created() {
    this.getApproveContract()
    // 所属项目
    this.getProjects()
    // 相关方
    this.getParty()
    // 流程名称
    this.getFlowName()
    // 分类树
    this.getTypeTree()
  },
  methods: {
    // 查看
    checkApproveDetails(item) {
      window.open(item.url + '&T=' + this.bpmToken)
    },
    currentChange(val) {
      this.approveForm.pageNum = val
      this.getApproveContract()
    },
    // 查询
    onQuery() {
      this.approveForm.pageNum = 1
      this.getApproveContract()
    },
    handleChangeProjectName(val) {
      for (let i = 0, len = this.projects.length; i < len; i++) {
        if (val === this.projects[i].projectName) {
          this.approveForm.projectCode = this.projects[i].projectCode
        }
      }
    },
    handleChangeApproveName() {

    },
    //
    handleTypeTreeChange(val) {
      for (let i = 0, len = this.flowName.length; i < len; i++) {
        if (this.flowName[i].workflowName === val[0]) {
          this.approveForm.classifyCode = this.flowName[i].workflowCode
        }
      }
    },
    // 重置
    onReset() {
      this.approveForm.projectName = ''
      this.approveForm.contractPartyName = ''
      this.approveForm.approveName = ''
      this.approveForm.contractStatus = ''
      this.approveForm.classifyName = ''
      this.approveForm.stime = ''
      this.approveForm.etime = ''
      this.approveForm.createName = ''
      this.approveForm.projectCode = ''
      this.approveForm.contractName = ''
      this.approveForm.contractCode = ''
      this.getApproveContract()
    },
    // 所属项目
    getProjects() {
      api.getProjects().then(res => {
        if (res.code === 0) {
          this.projects = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 相关方
    getParty() {
      api.getParty().then(res => {
        if (res.code === 0) {
          this.party = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 流程名称
    getFlowName() {
      api.getFlowName().then(res => {
        if (res.code === 0) {
          this.flowName = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 分类树
    getTypeTree() {
      api.getTypeTree().then(res => {
        if (res.code === 0) {
          this.typeTree = this.hasChildren(res.data)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    hasChildren(data) {
      for (let i = 0, len = data.length; i < len; i++) {
        if (data[i].children.length === 0) {
          data[i].children = undefined
        } else {
          this.hasChildren(data[i].children)
        }
      }
      return data
    },
    // 获取合同审批
    getApproveContract() {
      if (!this.approveForm.stime) {
        delete this.approveForm.stime
      }
      if (!this.approveForm.etime) {
        delete this.approveForm.etime
      }
      this.loading = true
      api.getApproveContract(this.approveForm).then(res => {
        if (res.code === 0) {
          this.tableData = res.data.pageList
          this.bpmToken = res.data.bpmToken
          this.loading = false
          this.totalPage = res.data.totalcount
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
.contract-approve{
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
}
.ca-filter{
  width: 100%;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 0px 10px -5px #eeeeee;
  border: 1px solid #eeeeee;
  padding-top: 20px;
}
.ca-table{
  width: 100%;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 0px 10px -5px #eeeeee;
  border: 1px solid #eeeeee;
  padding: 20px;
  margin-top: 20px;
}
.demo-form-inline{
  width: 100%;
  height: 200px;
}
.form-item{
  display: flex;
  justify-content: center;
}
.pagination{
  display: flex;
  flex-direction: row-reverse;
  margin-top: 10px;
}
</style>
