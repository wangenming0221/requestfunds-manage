<template>
  <div>
    <div class="p-box-form">
      <el-form ref="contractPlanForm" :inline="true" :model="contractPlanForm" class="demo-form-inline">
        <el-form-item label="总包项目名称" prop="projectName">
          <el-select v-model="contractPlanForm.projectName" placeholder="请选择总包项目名称">
            <el-option v-for="(item, index) in projectList" :key="index" :label="item.projectName" :value="item.projectName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="总包项目编码" prop="projectCode">
          <el-select v-model="contractPlanForm.projectCode" placeholder="请选择总包项目编码">
            <el-option v-for="(item, index) in projectList" :key="index" :label="item.projectCode" :value="item.projectCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="总包合同名称" prop="generalContractName">
          <el-select v-model="contractPlanForm.generalContractName" placeholder="请选择总包合同名称">
            <el-option v-for="(item, index) in projectList" :key="index" :label="item.generalContractName" :value="item.generalContractName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合同员/相关负责人" prop="peopleName">
          <el-select v-model="contractPlanForm.peopleName" placeholder="请选择合同员/相关负责人">
            <el-option v-for="(item, index) in projectList" :key="index" :label="item.peopleName" :value="item.peopleName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="onQuery">查询</el-button>
          <el-button icon="el-icon-refresh" @click="onReset('contractPlanForm')">重置</el-button>
          <el-button icon="el-icon-back" @click="onBack">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="p-box-table">
      <el-table
        :data="projectList"
        border
        style="width: 100%"
      >
        <el-table-column fixed type="index" width="50" label="序号"></el-table-column>
        <el-table-column prop="generalProjectName" align="center" label="总包项目名称" width="500"></el-table-column>
        <el-table-column prop="generalProjectCode" align="center" label="总包项目编码" width="500"></el-table-column>
        <el-table-column prop="generalContractName" align="center" label="总包合同名称" width="500"></el-table-column>
        <el-table-column prop="contractTotal" align="center" label="分包合同数量" width="500"></el-table-column>
        <el-table-column
          prop="generalUserName"
          label="合同员/相关负责人"
          width="150"
          align="center"
        />
        <el-table-column
          prop="generalContractFinishTime"
          label="计划合同签订完成时间"
          width="150"
          align="center"
        />
        <el-table-column fixed="right" prop="ppeople" align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              @click="edit(scope.row)"
              type="text"
              size="small">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import api from '@/api/work/contract'
export default {
  name: 'ContractPlan',
  data() {
    return {
      contractPlanForm: {
        pageSize: 10,
        pageNum: 1,
        projectName: null,
        projectCode: null,
        generalContractName: null,
        peopleName: null
      },
      projectList: []
    }
  },
  mounted() {
    this.getContractProjectList()
  },
  methods: {
    getContractProjectList() {
      api.getContractProjectList(this.contractPlanForm).then(res => {
        console.log(res)
        if(res.code === 0) {
          this.projectList = res.data.records
        }
      }).catch(err => {
        console.log(err)
      })
    },
    onBack() {
      this.$parent.showProjectMore(true)
    },
    onQuery() {

    },
    onReset(formName) {

    },
    edit(item) {
      this.$emit('contract-plan-edit', item)
    }
  }
}
</script>

<style lang="scss">

</style>
