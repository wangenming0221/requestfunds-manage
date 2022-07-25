<template>
  <div class="queryC">
    <el-form :inline="true" :model="queryForm" class="demo-form-inline">
      <el-row>
        <el-col :span="4">
          <el-form-item label="工程名称">
            <el-input v-model="queryForm.name" placeholder="请输入工程名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="工程地点">
            <el-input v-model="queryForm.name" placeholder="请输入工程地点"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="项目编码">
            <el-input v-model="queryForm.name" placeholder="请输入项目编码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="合同名称">
            <el-input v-model="queryForm.name" placeholder="请输入合同名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="合同编码">
            <el-input v-model="queryForm.name" placeholder="请输入合同编码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="分公司">
            <el-input v-model="queryForm.name" placeholder="请输入分公司"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="上报周期">
            <el-date-picker
              style="width: 115%"
              v-model="queryForm.name"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="创建时间">
            <el-date-picker
              style="width: 115%"
              v-model="queryForm.name"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="经营模式" style="width: 100%;">
            <el-select v-model="queryForm.name" placeholder="请选择经营模式" style="width: 93%;">
              <el-option label="全部" value="beijing"></el-option>
              <el-option label="待确认" value="shanghai"></el-option>
              <el-option label="已确认" value="beijing"></el-option>
              <el-option label="已驳回" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="创建人">
            <el-input v-model="queryForm.name" placeholder="请输入创建人"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="end">
        <el-col :span="6" style="display: flex;flex-direction:row-reverse;padding-right: 22px">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
            <el-button icon="el-icon-refresh" @click="resetQuery('queryForm')">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  // 查询
  name: 'Query',
  data() {
    return {
      // 查询参数
      queryForm: {
        name: null
      }
    }
  },
  mounted() {

  },
  methods: {
    // 查询
    handleQuery() {

    },
    // 重置
    resetQuery() {

    }
  }
}
</script>

<style lang="scss" scoped>
.queryC{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 15px;
}
</style>
