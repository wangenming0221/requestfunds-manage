<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px" v-show="showSearch" @submit.prevent.native>
      <el-form-item label="分公司">
        <el-input v-model="queryParams.branchOffice"  placeholder="请输入分公司" clearable size="small" @keyup.enter.native="handleQuery" style="width: 200px"/>
      </el-form-item>
      <el-form-item label="项目名称">
        <el-autocomplete
            @keyup.enter.native="handleQuery"
            style="width: 200px"
            size="small"
            clearable
            v-model="queryParams.projectName"
            :fetch-suggestions="querySearchAsyncProjectName"
            placeholder="请输入项目名称"
            @clear="queryParams.projectName = undefined"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="项目编码">
        <el-autocomplete
            @keyup.enter.native="handleQuery"
            style="width: 200px"
            size="small"
            clearable
            v-model="queryParams.projectCode"
            :fetch-suggestions="querySearchAsyncProjectCode"
            placeholder="请输入项目编码"
            @clear="queryParams.projectCode = undefined"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="代表公司">
        <el-autocomplete
            @keyup.enter.native="handleQuery"
            style="width: 200px"
            size="small"
            clearable
            v-model="queryParams.companyName"
            :fetch-suggestions="querySearchAsyncCompanyName"
            placeholder="请输入所代表公司"
            @clear="queryParams.companyName = undefined"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="合同分类">
        <el-cascader
            size="small"
            v-model="queryParams.cascaderData"
            clearable
            :props="{value: 'classifyCode', label: 'title'}"
            :options="treeData"/>
      </el-form-item>
      <el-form-item label="合同名称">
        <el-autocomplete
            @keyup.enter.native="handleQuery"
            style="width: 200px"
            size="small"
            clearable
            v-model="queryParams.contractName"
            :fetch-suggestions="querySearchAsyncContractName"
            placeholder="请输入合同名称"
            @clear="queryParams.contractName = undefined"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="合同编码">
        <el-autocomplete
            @keyup.enter.native="handleQuery"
            style="width: 200px"
            size="small"
            clearable
            v-model="queryParams.contractCode"
            :fetch-suggestions="querySearchAsyncContractCode"
            placeholder="请输入合同编码"
            @clear="queryParams.contractCode = undefined"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="发起人角色">
        <el-select v-model="queryParams.roleCode" placeholder="请选择发起人角色" clearable size="small" style="width: 200px">
          <el-option v-for="item in roleList" :key="item.title"
                     :label="item.name"
                     :value="item.id"
                     :disabled="item.disabled">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发起人姓名">
        <el-input  v-model="queryParams.userName"  placeholder="请输入发起人姓名" clearable size="small" @keyup.enter.native="handleQuery" style="width: 200px"/>
      </el-form-item>
      <el-form-item label="发起人手机号">
        <el-input  v-model="queryParams.loginUser"  placeholder="请输入发起人手机号" clearable size="small" @keyup.enter.native="handleQuery" style="width: 200px"/>
      </el-form-item>
      <el-form-item label="流程名称">
        <el-input size="small" v-model="queryParams.workFlowName"  placeholder="请输入流程名称" clearable @keyup.enter.native="handleQuery" style="width: 200px"/>
      </el-form-item>
      <el-form-item label="请款类别" prop="loginUser">
        <el-cascader
            size="small"
            v-model="queryParams.busId"
            clearable
            filterable
            placeholder="请选择请款类别"
            :options="requestPayTypeOptions"
            :props="{ label: 'title', value: 'id', children: 'children' }"></el-cascader>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table class="need-table" border v-loading="loading":data="menuList" max-height="450" @row-click="clickRow" >
      <el-table-column prop="workFlowName" label="流程名称" width="400" fixed align="center">
        <template slot-scope="scope">
          <span style="cursor: pointer">{{scope.row.workFlowName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="periods" label="期数" width="400" fixed align="center">
        <template slot-scope="scope">
          <span style="cursor: pointer">{{scope.row.periods}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="stayTime" label="停留时间" width="400" fixed align="center">
        <template slot-scope="scope">
          <span style="cursor: pointer">{{scope.row.stayTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="busName" label="请款类型" align="center" width="300">
        <template slot-scope="scope">
          <span style="cursor: pointer">{{scope.row.busName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="contractCode" label="合同编码" align="center" width="400">
        <template slot-scope="scope">
          <span style="cursor: pointer">{{scope.row.contractCode}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="contractName" label="合同名称" align="center" width="400"></el-table-column>
      <el-table-column prop="createTime" label="申请时间" align="center" width="200"></el-table-column>
      <el-table-column prop="approvalStatus" label="审批状态" align="center" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.approvalStatus=='DRAFT'">草稿</span>
          <span v-if="scope.row.approvalStatus=='PROCESSING'">进行中</span>
          <span v-if="scope.row.approvalStatus=='COMPLETED'">已完成</span>
          <span v-if="scope.row.approvalStatus=='CANCELED'">作废</span>
          <span v-if="scope.row.approvalStatus=='CANCELLED'">作废</span>
        </template>
      </el-table-column>
      <el-table-column prop="companyName" label="分公司" width="200"  align="center"></el-table-column>
      <el-table-column prop="projectName" label="项目名称" width="400"  align="center"></el-table-column>
      <el-table-column prop="projectCode" label="项目编码" width="300"  align="center"></el-table-column>
      <el-table-column prop="userName" label="发起人姓名" width="100"  align="center"></el-table-column>
      <el-table-column prop="loginUser" label="发起人手机号" width="200"  align="center"></el-table-column>
      <el-table-column prop="approvalMoney" label="申请金额" align="center" width="150" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{scope.row.approvalMoney | formatThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="actualMoney" label="实付金额" align="center" width="150" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{scope.row.actualMoney | formatThousands}}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.current" :limit.sync="queryParams.size" @pagination="getList" />
  </div>
</template>

<script>
  import { accountmanagedic } from "@/utils/dictionary"
  import { request, cooperativeApi } from '@/api/work'
  export default {
    name: "Need",
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
          branchOffice: null,
          projectName: null,
          projectCode: null,
          companyName: null,
          cascaderData: [],
          busId: [],
          workFlowName: null,
          contractName: null,
          contractCode: null,
          roleCode: null,
          userName: null,
          loginUser: null,
          payStatus: null,
          current: 1,
          size: 10,
        },
        total: 0,
        menuList: [],
        // 日期范围
        createDateRange: [],
        treeData: [],
        cascaderData: [],
        requestPayTypeOptions: [],
        details: {},
        payList:[
          {payStatus:'',payName:'全部'},
          {payStatus:'未付款',payName:'未付款'},
          {payStatus:'已付款(部分)',payName:'已付款(部分)'},
          {payStatus:'已付款(全部)',payName:'已付款(全部)'}
        ],
        roleList: accountmanagedic.roleList,
      };
    },
    mounted() {
      this.getRequestBusinessDicTree();
      this.getTree();
      this.getList();
    },
    methods: {
      getRequestBusinessDicTree() {
        cooperativeApi.getRequestBusinessDicTree(this.rTypeForm).then(res => {
          if (res.code === 0) {
            this.requestPayTypeOptions = this.filterNode(res.data)
          }
        }).catch(err => {
          console.log(err)
        })
      },
      filterNode(data) {
        for (let i = 0, len = data.length; i < len; i++) {
          if (data[i].children.length === 0) {
            data[i].children = undefined
          } else {
            this.filterNode(data[i].children)
          }
        }
        return data
      },
      getTree() {
        request.getContractTypeDic().then(res => {
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
      querySearchAsyncProjectName(queryString, cb) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          request.getProjectCode({ projectName: this.queryParams.projectName }).then(res => {
            const data = res.data.map(v => {
              return { 'value': v.projectName };
            })
            cb(data);
          })
        }, 2000 * Math.random());
      },
      querySearchAsyncProjectCode(queryString, cb) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          request.getProjectCode({ projectCode: this.queryParams.projectCode }).then(res => {
            const data = res.data.map(v => {
              return { 'value': v.projectCode };
            })
            cb(data);
          })
        }, 2000 * Math.random());
      },
      querySearchAsyncCompanyName(queryString, cb) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          request.getPorCompanyList({ pName: this.queryParams.companyName }).then(res => {
            const data = res.data.map(v => {
              return {'value': v.pname};
            })
            cb(data);
          })
        }, 2000 * Math.random());
      },
      querySearchAsyncContractName(queryString, cb) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          request.getContractCode({ contractName: this.queryParams.contractName, size: -1 }).then(res => {
            const data = res.data.map(v => {
              return { 'value': v.contractName };
            })
            cb(data);
          })
        }, 2000 * Math.random());
      },
      querySearchAsyncContractCode(queryString, cb) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          request.getContractCode({ contractCode: this.queryParams.contractCode, size: -1 }).then(res => {
            const data = res.data.map(v => {
              return { 'value': v.contractCode };
            })
            cb(data);
          })
        }, 2000 * Math.random());
      },
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
        let params = { ...this.queryParams };
        params.classifyCode = params.cascaderData.length ? params.cascaderData[params.cascaderData.length - 1] : null;
        params.busId = params.busId.length ? params.busId[params.busId.length - 1] : null;
        params.appCode='RequestPayoutManagement';
        request.getMyAgentFromBpm(params).then(res => {
          this.menuList = res.data.records;
          this.total = parseInt(res.data.total);
          this.loading = false;
        });
      },
      clickRow(row){
        request.setHandleBpm({ workFlowInstanceId: row.workFlowInstanceId,id:row.id }).then(res => {
          window.open(res.data);
        })
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
        this.queryParams = {
          branchOffice: null,
          projectName: null,
          projectCode: null,
          companyName: null,
          cascaderData: [],
          busId: [],
          workFlowName: null,
          contractName: null,
          contractCode: null,
          roleCode: null,
          userName: null,
          loginUser: null,
          payStatus: null,
          current: 1,
          size: this.queryParams.size,
        };
        this.handleQuery();
      }
    }
  };
</script>

<style scoped lang="scss">
  ::v-deep .el-form-item {
    margin-bottom: 14px;
  }
  .need-table {
    ::v-deep.cell {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
</style>
