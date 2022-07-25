<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="操作人名称" prop="userName">
        <el-input
            v-model="queryParams.userName"
            placeholder="请输入操作人名称"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作种类" prop="syncModel">
        <el-select
            v-model="queryParams.syncModel"
            placeholder="操作种类"
            clearable
            size="small"
            style="width: 240px"
        >
          <el-option
              v-for="dict in dataOptions"
              :key="dict.id"
              :label="dict.name"
              :value="dict.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="同步时间">
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
      <el-table-column prop="userName" label="操作人" width="200" align="center"></el-table-column>
      <el-table-column prop="status" label="是否成功" align="center" width="100">
        <template slot-scope="scope">
          {{Number(scope.row.status) === 0 ? '否' : '是'}}
        </template>
      </el-table-column>
      <el-table-column prop="syncModel" label="操作种类" align="center" width="250"></el-table-column>
      <el-table-column prop="createTime" label="同步时间" align="center"></el-table-column>
      <el-table-column prop="syncType" label="同步种类" align="center">
        <template slot-scope="scope">
          {{Number(scope.row.status) === 0 ? '自动' : '手动'}}
        </template>
      </el-table-column>
      <el-table-column prop="totalCount" label="同步总数" align="center"></el-table-column>
      <el-table-column prop="insertCount" label="同步新增" align="center"></el-table-column>
      <el-table-column prop="updateCount" label="同步修改" align="center"></el-table-column>
      <el-table-column prop="prDesc" label="描述" align="center"></el-table-column>
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
  import { logservicedic } from '@/utils/dictionary'
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
          userName: undefined,
          current: 1,
          size: 10,
        },
        total: 0,
        menuList: [],
        // 日期范围
        dateRange: [],
        dataOptions: logservicedic.dataOptions
      };
    },
    created() {
      this.getList();
    },
    methods: {
      handle() {
        logService.ManualSyncBaseProjectInfo().then(res => {
          console.log(res);
        })
      },
      /** 查询菜单列表 */
      getList() {
        this.loading = true;
        logService.getSyncLogInfo({...this.queryParams, beginTime: this.dateRange[0], endTime: this.dateRange[1]}).then(res => {
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
