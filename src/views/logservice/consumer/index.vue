<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="操作人名称" prop="userName">
        <el-input
            v-model="queryParams.portalName"
            placeholder="请输入操作人名称"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
            v-model="dateRange"
            size="small"
            style="width: 240px"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table
        v-loading="loading"
        :data="menuList"
        row-key="id">
      <el-table-column label="序号" type="index" align="center" width="100" >
        <template slot-scope="scope">
          <span>{{(queryParams.current - 1) * queryParams.size + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="portalName" label="操作人" width="300" align="center"></el-table-column>
      <el-table-column prop="operation" label="操作种类" align="center" width="400"></el-table-column>
<!--      <el-table-column prop="requestParams" label="操作参数" align="center" width="300"></el-table-column>-->
      <el-table-column prop="createDate" label="操作时间" align="center"></el-table-column>
    </el-table>
    <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.current"
        :limit.sync="queryParams.size"
        @pagination="getList"
    />
  </div>
</template>

<script>
  import { logService } from '@/api/work'
  export default {
    name: "admin",
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
          portalName: undefined,
          current: 1,
          size: 10,
        },
        total: 0,
        menuList: [],
        // 日期范围
        dateRange: [],
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询菜单列表 */
      getList() {
        this.loading = true;
        logService.getPorLogList(this.addDateRange(this.queryParams, this.dateRange)).then(res => {
          this.menuList = res.data.records;
          this.total = res.data.total;
          this.loading = false;
        });
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          portalName: undefined
        };
        this.resetForm("queryForm");
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
        this.queryParams.portalName=undefined;
        this.handleQuery();
      }
    }
  };
</script>
