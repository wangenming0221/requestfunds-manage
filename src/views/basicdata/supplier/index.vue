<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="公司名称" >
        <el-input  v-model="queryParams.pName" placeholder="请输入公司名称" clearable size="small" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="公司编码" >
        <el-input  v-model="queryParams.pCode" placeholder="请输入公司编码" clearable size="small" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading"  :data="menuList" row-key="id">
      <el-table-column prop="pname" label="公司名称" width="200" align="center"></el-table-column>
      <el-table-column prop="pcode" label="公司编码" align="center" width="250"></el-table-column>
      <el-table-column prop="ppeople" label="负责人" align="center" width="250"></el-table-column>
      <el-table-column prop="business" label="业务范围" align="center" width="250"></el-table-column>
      <el-table-column prop="address" label="地址" align="center" width="550"></el-table-column>
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
          pName: undefined,
          pCode: undefined,
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
        basedata.getPorCompanyInfo({...this.queryParams}).then(res => {
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
