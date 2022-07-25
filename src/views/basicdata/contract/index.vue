<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="所属公司" >
        <el-input  v-model="queryParams.parentRegion" placeholder="请输入所属分公司" clearable size="small" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="合同编码" >
        <el-input  v-model="queryParams.contractCode" placeholder="请输入合同编码" clearable size="small" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="项目编码" >
        <el-input  v-model="queryParams.projectCode" placeholder="请输入项目编码" clearable size="small" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading"  :data="menuList" row-key="id">
      <el-table-column prop="parentRegion" label="所属公司" width="200" align="center"></el-table-column>
      <el-table-column prop="contractName" label="合同名称" align="center" width="250"></el-table-column>
      <el-table-column prop="contractCode" label="合同编码" align="center" width="250"></el-table-column>
      <el-table-column prop="projectCode" label="项目编码" align="center" width="250"></el-table-column>
      <el-table-column prop="contractor" label="项目承包人" align="center" width="250"></el-table-column>
      <el-table-column prop="contractorTel" label="承包人电话" align="center" width="250"></el-table-column>
      <el-table-column prop="contractingMode" label="项目承包模式" align="center" width="250"></el-table-column>
      <el-table-column prop="contractModelName" label="所属范本名称" align="center" width="250"></el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.current" limit.sync="queryParams.size" @pagination="getList" />
  </div>
</template>

<script>
  import { logservicedic } from '@/utils/dictionary'
  import { request, basedata } from '@/api/work'
  export default {
    name: "index",
    data() {
      return {
        // 遮罩层
        loading: true,
        // 显示搜索条件
        showSearch: true,
        // 菜单树选项
        menuOptions: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          parentRegion: undefined,
          projectCode: undefined,
          contractCode:undefined,
          current: 1,
          size: 10,
        },
        total: 0,
        menuList: [],
        // 日期范围
        dateRange: [],
        dataOptions: logservicedic.dataOptions,
        companyList: [],
        restaurants: [],
        timeout:  null
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询菜单列表 */
      getList() {
        this.loading = true;
        basedata.getContractInfo({...this.queryParams}).then(res => {
          console.log(res);
          this.menuList = res.data.records;
          this.total = res.data.total;
          this.loading = false;
        });
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.current = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.dateRange = [];
        this.handleQuery();
      }
    }
  };
</script>
