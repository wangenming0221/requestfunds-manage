<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="订单编号">
        <el-input  v-model="queryParams.tradeNumber"  placeholder="请输入订单编号" clearable size="small"  />
      </el-form-item>
      <el-form-item label="接口名称" prop="userName">
        <el-cascader
          v-model="cascaderData"
          clearable
          :props="{value: 'id', label: 'title'}"
          :options="treeData"/>
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
      <el-table-column prop="tradeNumber" label="订单编号" width="200" align="center"></el-table-column>
      <el-table-column prop="name" label="接口名称" width="200" align="center"></el-table-column>
      <el-table-column prop="apiUrl" label="调用接口地址" align="center" width="600"></el-table-column>
      <el-table-column prop="createTime" label="调用时间" align="center" width="300"></el-table-column>
      <el-table-column prop="status" label="是否成功" align="center" width="100"></el-table-column>
      <el-table-column label="详情" align="center">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     @click="showPop(scope.row)"
          >详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.current"
        :limit.sync="queryParams.size"
        @pagination="getList"
    />
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-row :gutter="20">
        <el-col>接口名:{{details.name}}</el-col>
        <el-col>调用地址、时间、请求头和参数、返回头和参数:{{details.paramData}}</el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { logService,request} from '@/api/work'
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
          tradeNumber:undefined,
          current: 1,
          size: 10,
        },
        total: 0,
        menuList: [],
        // 日期范围
        dateRange: [],
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
      showPop(value) {
        this.open = true;
        this.details = value;
      },
      getTree() {
        request.getPayTypeTree().then(res => {
          this.treeData = this.deleteChild(res.data);
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
      /** 查询菜单列表 */
      getList() {
        this.loading = true;
        logService.getPayLogList({...this.addDateRange(this.queryParams, this.dateRange),
          ...{payBusId: this.cascaderData.length ? this.cascaderData[1] : undefined}}).then(res => {
          this.menuList = res.data.records;
          this.total = res.data.total;
          this.loading = false;
        });
      },
      // 取消按钮
      cancel() {
        this.open = false;
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.current = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.dateRange = [];
        this.queryParams={
          userName: undefined,
          tradeNumber:undefined,
          current: 1,
          size: 10,
        }
        this.cascaderData = [];
        this.handleQuery();
      }
    }
  };
</script>
