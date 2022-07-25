<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="通知时间" prop="createTime">
        <el-date-picker
            v-model="createDateRange"
            size="small"
            style="width: 240px"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="通知类别" prop="noticeId">
         <el-cascader
            placeholder="请选择类别"
            v-model="cascaderData"
            clearable
            :props="{value: 'id', label: 'title'}"
            :options="treeData"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading":data="menuList">
      <el-table-column prop="userName" label="用户" width="200"  align="center"></el-table-column>
      <el-table-column prop="name" label="类别" align="center" width="300"></el-table-column>
      <el-table-column prop="createTime" label="时间" align="center" width="400"></el-table-column>
      <el-table-column prop="readStatus" label="状态" align="center" width="300"></el-table-column>
      <el-table-column prop="content" label="内容" align="center" :show-overflow-tooltip="true"></el-table-column>
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
  import { noticeManage } from '@/api/work'
  import {addDateRange} from "@/utils/ruoyi";
  export default {
    name: "admin",
    data() {
      return {
        // 遮罩层
        loading: true,
        // 显示搜索条件
        showSearch: true,
        // 菜单树选项
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          porUserCompanyId: undefined,
          noticeId: undefined,
          params:{beginTime:undefined,endTime:undefined},
          dateRange:[],
          current: 1,
          size: 10,
        },
        total: 0,
        menuList: [],
        // 日期范围
        createDateRange: [],
        treeData: [],
        cascaderData: [],
        details: {}
      };
    },
    created() {
      this.getList();
      this.getTree();
    },
    methods: {
      delUndefinedAndEmptyString(data) {
        let obj = JSON.parse(JSON.stringify(data));
        for (let key in obj) {
          if (obj[key] === '' || obj[key] === undefined) {
            delete obj[key];
          }
        }
        return obj;
      },
      /** 查询菜单列表 */
      getList() {
        this.loading = true;
        let queryParams = this.delUndefinedAndEmptyString(this.queryParams);
        noticeManage.getNoticManageList({...this.createDateRange.length ? addDateRange(queryParams, this.createDateRange) : queryParams,
          ...{noticeId: this.cascaderData.length ? this.cascaderData[1] : undefined}}).then(res => {
          this.menuList = res.data.data.records;
          this.total = parseInt(res.data.data.total);
          this.loading = false;
        });
      },
      getTree() {
        noticeManage.getTypeTree().then(res => {
          this.treeData = this.deleteChild(res.data);
          console.log(this.treeData)
        })
      },
      deleteChild(data) {
        let arr = [];
        arr = data.map(value => {
          if (value.children && value.children.length) {
            let _value = {...value};
            _value.children = this.deleteChild(_value.children);
            return _value;
          } else {
            if (value.children === null || value.children.length === 0) {
              delete value.children;
            }
            return value;
          }
        });
        return arr;
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          porUserCompanyId: undefined
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
        this.createDateRange = [];
        this.queryParams.portalName=undefined;
        this.cascaderData = [];
        this.handleQuery();
      }
    }
  };
</script>
