<template>
  <div class="app-container">
    <el-tabs v-model="queryParams.status" @tab-click="handleQuery()">
      <el-tab-pane label="项目信息维护管理" name="T"></el-tab-pane>
      <!-- <el-tab-pane label="草稿" name="A"></el-tab-pane> -->
    </el-tabs>
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="总包项目编码">
        <el-input  @clear="queryParams.code = undefined" v-model="queryParams.code"  placeholder="请输入总包项目编码" clearable/>
      </el-form-item>
      <el-form-item label="立项名称">
        <el-input  @clear="queryParams.projectApproveName = undefined" v-model="queryParams.projectApproveName"  placeholder="请输入项目名称" clearable/>
      </el-form-item>
      <el-form-item label="所属分公司">
        <treeselect
          :normalizer="normalizer"
          style="width: 200px"
          v-model="queryParams.companyCode"
          :options="companyOptions"
          placeholder="请选择所属分公司"
          @select="selectCompany"
         :beforeClearAll="clearCompany"/>
      </el-form-item>
      <el-form-item label="投标工程项目编码">
        <el-input  @clear="queryParams.projectGeneralCode = undefined" v-model="queryParams.projectGeneralCode"  placeholder="请输入投标工程项目编码" clearable/>
      </el-form-item>
      <el-form-item label="投标工程项目名称">
        <el-input  @clear="queryParams.projectGeneralName = undefined" v-model="queryParams.projectGeneralName"  placeholder="请输入投标工程项目名称" clearable/>
      </el-form-item>
      <el-form-item label="项目经理">
        <el-input  @clear="queryParams.projectManagerName = undefined" v-model="queryParams.projectManagerName"  placeholder="请输入项目经理" clearable/>
      </el-form-item>
      <el-form-item label="经营模式">
        <el-select v-model="queryParams.managementModel" placeholder="请选择经营模式" clearable  @clear="queryParams.managementModel = undefined">
          <el-option v-for="item in managementOptions" :key="item.name"
                     :label="item.name"
                     :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="项目阶段">
        <el-select v-model="queryParams.projectPhase" placeholder="请选择项目阶段" clearable  @clear="queryParams.projectPhase = undefined" >
          <el-option v-for="item in projectPhaseData.options" :key="item.name"
                     :label="item.name"
                     :value="item.id">
          </el-option>
        </el-select>
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
          @click="goProjectForm()"
        >新增
        </el-button>

      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="recordList"  style="width: 100%">
      <el-table-column prop="code" label="总包项目编码" align="center" :show-overflow-tooltip="true" width="180"/>
      <el-table-column prop="name" label="项目名称" align="center" :show-overflow-tooltip="true" width="180"/>
      <el-table-column prop="companyName" label="所属分公司" align="center" :show-overflow-tooltip="true" width="200"></el-table-column>
      <el-table-column prop="projectGeneralCode" label="投标工程项目编码" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
      <el-table-column prop="projectGeneralName" label="投标工程项目名称" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>

      <el-table-column prop="basicType" label="基础类型" align="center" :show-overflow-tooltip="true" width="180"/>
      <el-table-column prop="mdgName" label="MDG项目名称" align="center" :show-overflow-tooltip="true" width="180"/>
      <el-table-column prop="projectManagerName" label="项目经理" align="center" :show-overflow-tooltip="true" width="180"/>
      <el-table-column prop="projectType" label="项目承接类型" align="center" :show-overflow-tooltip="true" width="180"/>
      <el-table-column prop="managementModel" label="经营模式" align="center" :show-overflow-tooltip="true" width="180">

      </el-table-column>
      <el-table-column prop="regionName" label="所属甲方区域" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
      <el-table-column prop="projectCodePartyA" label="甲方项目编码" align="center" :show-overflow-tooltip="true" width="180"/>
      <el-table-column prop="homeArea" label="建筑面积（㎡）" align="center" :show-overflow-tooltip="true" width="180"/>
      <el-table-column prop="projectPhase" label="项目阶段" align="center" :show-overflow-tooltip="true" width="100"/>
      <el-table-column label="操作" align="center"  width="200" fixed="right">
        <template slot-scope="scope">

          <el-button
            size="mini"
            type="text"
            @click="goProjecDetail(scope.row)"
            >查看</el-button>
          <el-button
            size="mini"
            type="text"
            @click="openProjectPhase(scope.row)"
          >编辑项目阶段</el-button>
          <el-button
            size="mini"
            type="text"
            @click="deleteProject(scope.row)"
          >删除</el-button>
          </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.current" :limit.sync="queryParams.size" @pagination="getList" />
    <!-- 编辑项目阶段 -->
    <el-dialog  title="编辑项目阶段"  :visible.sync="projectPhaseData.visible"  width="560px" :before-close="cancelProjectPhase">
      <div class="wrap">
        <el-form ref="projectPhaseData"  :model="projectPhaseData"    class="demo-form-inline">
          <el-form-item label="项目阶段" prop="parkName">
            <el-select v-model="projectPhaseData.projectPhase" placeholder="请选择项目阶段" clearable  @clear="projectPhaseData.projectPhase = undefined" style="width:400px">
              <el-option v-for="item in projectPhaseData.options" :key="item.name"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>

          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button :disabled="loading" @click="cancelProjectPhase()">取 消</el-button>
        <el-button type="primary" :disabled="loading" @click="saveProjectPhase()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  import { projectInfo } from '@/api/work'
  import { projectmanagedic } from '@/utils/dictionary'
  export default {
    name: "Projectinfo",

    data() {
      return {

        projectPhaseData:{
          visible:false,
          projectPhase:undefined,
          row:{},
          options:[{
            id:'投标阶段',
            name:'投标阶段'
          },{
            id:'立项阶段',
            name:'立项阶段'
          },{
            id:'施工阶段',
            name:'施工阶段'
          },{
            id:'竣工验收阶段',
            name:'竣工验收阶段'
          },{
            id:'交楼阶段',
            name:'交楼阶段'
          },{
            id:'维保阶段',
            name:'维保阶段'
          }],

        },
        companyOptions: [],
        managementOptions: projectmanagedic.contractModeOptions,
        // 遮罩层
        loading: true,
        // 菜单表格树数据
        recordList: [],
        // 查询参数
        queryParams: {
          current: 1,
          size: 10,
          status: 'T',
          projectGeneralCode: undefined,
          projectGeneralName: undefined,
          companyCode: undefined,
          code: undefined,
          projectApproveName: undefined,
          projectManagerName: undefined,
          managementModel: undefined,
          projectPhase:undefined,

        },
        total: 0,
      };
    },
    components: { Treeselect },
    mounted() {
      projectInfo.projectInfoList().then(response => {
        this.companyOptions = response.data;
      });
      this.getList();
    },
    activated() {
      this.getList();
    },
    methods: {
      normalizer(node) {
        if (node.children && !node.children.length) {
          delete node.children
        }
        return {
          id: node.phone,
          label: node.deptName,
          children: node.children
        }
      },
      selectCompany({ label }) {
        this.queryParams.companyName = label;
      },
      clearCompany() {
        this.queryParams.companyName = undefined;
        return true;
      },
      //编辑项目阶段
      openProjectPhase(row) {
        this.projectPhaseData.row = row;
        this.projectPhaseData.projectPhase = row.projectPhase;
        this.projectPhaseData.visible = true;

      },
      cancelProjectPhase(){
        this.projectPhaseData.projectPhase = undefined;
        this.projectPhaseData.visible = false;
      },
      saveProjectPhase(){
        projectInfo.updateProjectPhase({projectPhase:this.projectPhaseData.projectPhase, projectMdmId:this.projectPhaseData.row.projectMdmId}).then(response => {
          this.cancelProjectPhase();
          this.getList();
        }).catch(err =>{
        });
      },
      goProjectForm(){
        this.$router.push({ path: '/projectmanage/projectform'})
      },
      goProjecDetail(value) {
        this.$router.push({ path: '/projectmanage/projectdetail', query: { id: value.projectMdmId } })
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
          projectGeneralCode: undefined,
          projectGeneralName: undefined,
          companyCode: undefined,
          code: undefined,
          projectApproveName: undefined,
          projectManagerName: undefined,
          managementModel: undefined,
          projectPhase: undefined,
        }
        this.getList();
      },
      /** 查询列表 */
      getList() {
        this.loading = true;
        projectInfo.projectInfoSelectAllPage(this.queryParams).then(response => {
            this.recordList = response.data.records;
            this.total = response.data.total;
            this.loading = false;
          }
        );
      },
      /** 删除按钮操作 */
      deleteProject({projectMdmId}) {
        this.$confirm('是否确认删除?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return projectInfo.projectInfoLogicalDeletion({mdmId:projectMdmId});
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
      },
    }
  };
</script>

<style lang="scss" scoped>
</style>
