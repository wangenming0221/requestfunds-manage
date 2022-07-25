<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="项目名称" prop="projectName">
        <el-autocomplete
            clearable
            class="autocomplete"
            v-model="queryParams.projectName"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入内容"
            @select="handleSelect"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="项目编码" prop="projectCode">
        <el-input
            v-model="queryParams.projectCode"
            placeholder="请输入项目编码"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属分公司" prop="branchOffice">
        <el-select
            v-model="queryParams.branchOffice"
            placeholder="所属分公司"
            clearable
            size="small"
            style="width: 240px"
        >
          <el-option
              v-for="dict in companyList"
              :key="dict.code"
              :label="dict.name"
              :value="dict.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="立项时间">
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
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleSync"
        >同步</el-button>
      </el-col>
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
      <el-table-column prop="projectName" label="项目名称" width="200" align="center"></el-table-column>
      <el-table-column prop="projectCode" label="项目编码" align="center" width="100">
      </el-table-column>
      <el-table-column prop="branchOffice" label="分公司" align="center" width="250"></el-table-column>
      <el-table-column prop="projectApprovalTime" label="立项时间" align="center" width="250">

      </el-table-column>
      <el-table-column prop="constructionSite" label="地址" align="center" width="250"></el-table-column>
      <el-table-column prop="isReqFund" label="是否已接入请款平台" align="center">
        <template slot-scope="scope">
          {{Number(scope.row.isReqFund) === 0 ? '否' : '是'}}
        </template>
      </el-table-column>
      <el-table-column label="总包合同" align="center"></el-table-column>
      <el-table-column label="合同数量" align="center"></el-table-column>
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
  import { logService, basedata, request } from '@/api/work'
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
          projectName: undefined,
          projectCode: undefined,
          branchOffice: undefined,
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
      request.getCompanyCodeList().then(res => {
        this.companyList = res.data;
      });
    },
    methods: {
      querySearchAsync(queryString, cb) {
        // var restaurants = this.restaurants;
        // var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          basedata.getProjectCodeAndName({projectName: this.queryParams.projectName}).then(res => {
            const data = res.data.map(v => {
              return { 'value': v.projectName };
            })
            cb(data);
          })
        }, 2000 * Math.random());
      },
      // createStateFilter(queryString) {
      //   return (state) => {
      //     return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      //   };
      // },
      handleSelect(item) {
        console.log(item);
      },
      handleSync() {
        logService.ManualSyncBaseProjectInfo().then(res => {
          if (res.code == 0) {
            this.msgSuccess(res.msg);
          }
        })
      },
      /** 查询菜单列表 */
      getList() {
        this.loading = true;
        basedata.getProjectInfo({...this.queryParams, beginTime: this.dateRange[0], endTime: this.dateRange[1]}).then(res => {
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
