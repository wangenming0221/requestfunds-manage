<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="contractor" :inline="true">
      <el-form-item label="总包项目编码">
        <el-input  @clear="queryParams.generalContractProjectCode = undefined" v-model="queryParams.generalContractProjectCode"  placeholder="请输入总包项目编码" clearable/>
      </el-form-item>
      <el-form-item label="承包人项目编码">
        <el-input  @clear="queryParams.buildingContractorProjectCode = undefined" v-model="queryParams.buildingContractorProjectCode"  placeholder="请输入承包人项目编码" clearable/>
      </el-form-item>
      <el-form-item label="项目经理">
       <el-input  @clear="queryParams.projectManager = undefined" v-model="queryParams.projectManager"  placeholder="请输入项目经理" clearable/>
      </el-form-item>
      <el-form-item label="施工负责人">
        <el-input  @clear="queryParams.constructionDirector = undefined" v-model="queryParams.constructionDirector"  placeholder="请输入施工负责人" clearable/>
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
          @click="goContractorForm()"
        >新增
        </el-button>
        <el-button
          type="primary"
          plain
          icon="el-icon-delete"
          size="mini"
          @click="deleteContractor()"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="recordList"  style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center"></el-table-column>
      <el-table-column prop="generalContractProjectCode" label="总包项目编码" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
      <el-table-column prop="buildingContractorProjectCode" label="承包人项目编码" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
      <el-table-column prop="projectManager" label="项目经理" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
      <el-table-column prop="constructionDirector" label="施工负责人" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
      <el-table-column prop="constructionDirectorPhone" label="施工负责人联系电话" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
      <el-table-column prop="constructionDirectorIdcard" label="施工负责人身份信息" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="goContractorDetail(scope.row)"
            >查看</el-button>
          <el-button
            size="mini"
            type="text"
            @click="goContractorForm(scope.row)"
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
  export default {
    name: "contractor",
    data() {
      return {

        //选中的id集合
        ids:[],
        // 遮罩层
        loading: true,
        // 菜单表格树数据
        recordList: [],
        // 查询参数
        queryParams: {
          current: 1,
          size: 10,
          generalContractProjectCode: undefined,
          buildingContractorProjectCode: undefined,
          projectManager: undefined,
          constructionDirector: undefined,
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
        projectInfo.contractorSelectAllPage(this.queryParams).then(response => {
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
         generalContractProjectCode: undefined,
         buildingContractorProjectCode: undefined,
         projectManager: undefined,
         constructionDirector: undefined,
        }
        this.getList();
      },

      /** 删除按钮操作 */
      deleteContractor(){
        console.log(this.ids);
        if(this.ids.length==0){
          this.msgError('请先选择要删除的选项');
          return false;
        }

        this.$confirm('是否确认删除?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          return projectInfo.deleteContractor(this.ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
      },

      //跳转到新增/编辑
      goContractorForm(row){
        if (row) {
          this.$router.push({ path: '/projectmanage/contractorForm', query: { id: row.id } })
        } else {
          this.$router.push({ path: '/projectmanage/contractorForm' })
        }
      },
      goContractorDetail(row){
        this.$router.push({ path: '/projectmanage/contractorDetail', query: { id:row.id } })
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
