<template>
  <div class="app-container">
    <el-tabs v-model="queryParams.status" @tab-click="handleQuery()">
      <el-tab-pane label="开工管理" name="T"></el-tab-pane>
      <el-tab-pane label="草稿" name="A"></el-tab-pane>
    </el-tabs>

    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="项目编码">
        <el-input  @clear="queryParams.projectCode = undefined" v-model="queryParams.projectCode"  placeholder="请输入项目编码" clearable/>
      </el-form-item>
      <el-form-item label="项目名称">
        <el-input  @clear="queryParams.projectName = undefined" v-model="queryParams.projectName"  placeholder="请输入项目名称" clearable/>
      </el-form-item>
      <el-form-item label="申请人">
       <el-input  @clear="queryParams.creator = undefined" v-model="queryParams.creator"  placeholder="请输入申请人" clearable/>
      </el-form-item>
      <el-form-item label="所属分公司">
        <el-input  @clear="queryParams.companyName = undefined" v-model="queryParams.companyName"  placeholder="请输入所属分公司" clearable/>
      </el-form-item>
      <!-- <el-form-item label="状态">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable  @clear="queryParams.status = undefined">
          <el-option v-for="item in statusOptions" :key="item.name"
                     :label="item.name"
                     :value="item.id">
          </el-option>
        </el-select>
      </el-form-item> -->

      <el-form-item label="提交时间">
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
          @click="goStratWorkForm()"
        >新增
        </el-button>
        <el-button
          type="primary"
          plain
          icon="el-icon-delete"
          size="mini"
          @click="deleteStratWork()"
          v-if="queryParams.status=='A'"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="recordList" border style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center"></el-table-column>
      <el-table-column prop="projectCode" label="项目编码" align="center" :show-overflow-tooltip="true" width="140"></el-table-column>
      <el-table-column prop="projectName" label="项目名称" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
      <el-table-column prop="companyName" label="所属分公司" align="center" :show-overflow-tooltip="true" width="120"></el-table-column>
      <el-table-column prop="mdgProjectName" label="MDG项目名称" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
      <el-table-column prop="projectManagerName" label="项目经理" align="center" :show-overflow-tooltip="true" width="100"></el-table-column>
      <el-table-column prop="undertakeType" label="项目承接类型" align="center" :show-overflow-tooltip="true" width="100"></el-table-column>
      <el-table-column prop="managementModel" label="经营模式" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
      <el-table-column prop="projectPhase" label="项目阶段" align="center" :show-overflow-tooltip="true" width="80"></el-table-column>


      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="goStartWorkDetail(scope.row)"
            >查看</el-button>
          <el-button
            size="mini"
            type="text"
            @click="goStratWorkForm(scope.row)"
            v-if="queryParams.status=='A'"
          >编辑</el-button>

          </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.current" :limit.sync="queryParams.size" @pagination="getList" />
  </div>
</template>

<script>
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  import { projectInfo } from '@/api/work'
  import {addDateRange} from "@/utils/ruoyi";
  import { projectmanagedic } from '@/utils/dictionary'
  export default {
    name: "singleBuilding",
    data() {
      return {
        
        // 日期范围
        dateRange: [],
        //选中的id集合
        ids:[],

        buildingConstructMapStatus:[],
        //这个是审批状态 本版本没有
        // statusOptions:projectmanagedic.checkStatus,
        // 遮罩层
        loading: true,
        // 菜单表格树数据
        recordList: [],
        // 查询参数
        queryParams: {
          current: 1,
          size: 10,
          status: 'T',
          projectCode:undefined,
          projectName:undefined,
          creator:undefined,
          companyCode:undefined,
          companyName:undefined,
        },
        total: 0,
      };
    },
    components: { Treeselect },
    mounted() {
      this.getList();
    },
    activated() {
      this.getList();
    },
    methods: {
      /** 查询列表 */
      getList() {
        this.loading = true;
        projectInfo.startWorkSelectAllPage(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.recordList = response.data.records;
          this.total = response.data.total;
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
        this.queryParams = {
          ...this.queryParams,
          current: 1,
          size: 10,
          status: 'T',
          projectCode:undefined,
          projectName:undefined,
          creator:undefined,
          companyCode:undefined,
          companyName:undefined,
        }
        this.dateRange = [];
        this.getList();
      },

      /** 删除按钮操作 */
      deleteStratWork(){
        if(this.ids.length==0){
          this.msgError('请先选择要删除的选项');
          return false;
        }

        this.$confirm('是否确认删除?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          return projectInfo.deleteStartWork(this.ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
      },

      //跳转到新增/编辑
      goStratWorkForm(row){
        if (row) {
          this.$router.push({ path: '/projectmanage/startWorkForm', query: { id: row.id,status:this.queryParams.status,isDisabledForm:'false'} })
        } else {
          this.$router.push({ path: '/projectmanage/startWorkForm' })
        }
      },
      goStartWorkDetail(row){
        this.$router.push({ path: '/projectmanage/startWorkForm', query: { id:row.id,isDisabledForm:'true'} })
      },
      //选择多选框触发
      handleSelectionChange(selection){
        this.ids = selection.map(item => item.id);
      },



    }
  };
</script>

<style lang="scss" scoped>
</style>
