<template>
  <div class="app-container">
    <el-tabs v-model="queryParams.status" @tab-click="handleQuery()">
      <el-tab-pane label="单体楼栋信息管理" name="T"></el-tab-pane>
      <!-- <el-tab-pane label="草稿" name="A"></el-tab-pane> -->
    </el-tabs>

    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="楼栋编号">
        <el-input  @clear="queryParams.buildingCode = undefined" v-model="queryParams.buildingCode"  placeholder="请输入楼栋编号" clearable/>
      </el-form-item>
      <el-form-item label="MDG楼栋编码">
        <el-input  @clear="queryParams.mdgCode = undefined" v-model="queryParams.mdgCode"  placeholder="请输入MDG楼栋编码" clearable/>
      </el-form-item>
      <el-form-item label="楼栋名称">
       <el-input  @clear="queryParams.buildingName = undefined" v-model="queryParams.buildingName"  placeholder="请输入楼栋名称" clearable/>
      </el-form-item>
      <el-form-item label="项目编码">
        <el-input  @clear="queryParams.projectCode = undefined" v-model="queryParams.projectCode"  placeholder="请输入项目编码" clearable/>
      </el-form-item>

      <el-form-item label="楼栋施工状态">
        <el-select v-model="queryParams.buildingConstructStatus" placeholder="请选择楼栋施工状态" clearable  @clear="queryParams.buildingConstructStatus = undefined">
          <el-option v-for="item in buildingConstructStatusOptions"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
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
      <el-form-item label="楼栋状态">
        <el-select v-model="queryParams.buildingStatus" placeholder="请选择楼栋状态" clearable  @clear="queryParams.buildingStatus = undefined">
          <el-option v-for="item in statusOptions" :key="item.name"
                     :label="item.name"
                     :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="楼栋阶段">
        <el-select v-model="queryParams.buildingPhase" placeholder="请选择楼栋阶段" clearable  @clear="queryParams.buildingPhase = undefined">
          <el-option v-for="item in buildingPhaseData.options" :key="item.name"
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



    <el-table v-loading="loading" :data="recordList"  style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center"></el-table-column>
      <el-table-column prop="buildingCode" label="楼栋编号" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
      <el-table-column prop="mdgCode" label="MDG楼栋编码" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
      <el-table-column prop="buildingName" label="楼栋名称" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
      <el-table-column prop="projectCode" label="项目编码" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>

      <el-table-column prop="buildingConstructStatusCode" label="楼栋状态" align="center" :show-overflow-tooltip="true" width="180">
        <template slot-scope="scope">
          {{scope.row.buildingConstructStatusCode?buildingConstructMapStatus[scope.row.buildingConstructStatusCode]:'未开工'}}
        </template>
      </el-table-column>
      <el-table-column prop="buildingConstructStatus" label="楼栋施工状态" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
      <el-table-column prop="updateTime" label="维护时间" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
      <el-table-column prop="buildingPhase" label="楼栋阶段" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="goSingleBuildingDetail(scope.row)"
            >查看</el-button>
          <el-button
            size="mini"
            type="text"
            @click="openBuildingPhase(scope.row)"
          >编辑楼栋阶段</el-button>
          <el-button
            size="mini"
            type="text"
          @click = "goStratWorkForm(scope.row)" :disabled = "scope.row.buildingConstructStatusCode&&scope.row.buildingConstructStatusCode>2">开工</el-button>
          <el-button
            size="mini"
            type="text"
           @click = "goStopWorkForm(scope.row)"
            :disabled = "!scope.row.buildingConstructStatusCode||!(scope.row.buildingConstructStatusCode==3||scope.row.buildingConstructStatusCode==4||scope.row.buildingConstructStatusCode==7||scope.row.buildingConstructStatusCode==8)"
           >停工</el-button>

          <!-- <el-button
            size="mini"
            type="text"
          >复工</el-button> -->
          </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.current" :limit.sync="queryParams.size" @pagination="getList" />
    <!-- 编辑楼栋阶段 -->
    <el-dialog  title="编辑楼栋阶段"  :visible.sync="buildingPhaseData.visible"  width="560px" :before-close="cancelBuildingPhase">
      <div class="wrap">
        <el-form ref="buildingPhaseData"  :model="buildingPhaseData"    class="demo-form-inline">
          <el-form-item label="楼栋阶段" prop="parkName">
            <el-select v-model="buildingPhaseData.buildingPhase" placeholder="请选择楼栋阶段" clearable  @clear="buildingPhaseData.buildingPhase = undefined" style="width:400px">
              <el-option v-for="item in buildingPhaseData.options" :key="item.name"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>

          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button :disabled="loading" @click="cancelBuildingPhase()">取 消</el-button>
        <el-button type="primary" :disabled="loading" @click="saveBuildingPhase()">确 定</el-button>
      </div>
    </el-dialog>
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
        buildingPhaseData:{
          visible:false,
          buildingPhase:undefined,

          row:{},
          options:[{
            id:'投标阶段',
            name:'投标阶段'
          },{
            id:'立项阶段',
            name:'立项阶段'
          },{
            id:'基础阶段',
            name:'基础阶段'
          },{
            id:'主体阶段',
            name:'主体阶段'
          },{
            id:'砌筑抹灰阶段',
            name:'砌筑抹灰阶段'
          },{
            id:'粗装修阶段',
            name:'粗装修阶段'
          },{
            id:'精装阶段',
            name:'精装阶段'
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
        // 日期范围
        dateRange: [],
        //选中的id集合
        mdmIds:[],

        buildingConstructMapStatus:[],
        buildingConstructStatusOptions:projectmanagedic.buildingConstructStatusOptions,
        statusOptions:projectmanagedic.buildingConstructStatus,
        // 遮罩层
        loading: true,
        // 菜单表格树数据
        recordList: [],
        // 查询参数
        queryParams: {
          current: 1,
          size: 10,
          status: 'T',
          buildingCode: undefined,
          mdgCode: undefined,
          buildingName: undefined,
          projectCode: undefined,
          buildingConstructStatus:undefined,
          buildingStatus:undefined,
          buildingPhase:undefined,

        },
        total: 0,
      };
    },
    components: { Treeselect },
    mounted() {
      projectmanagedic.buildingConstructStatus2.forEach(item=>{
        this.buildingConstructMapStatus[item.id] = item.name;
        console.log(this.buildingConstructMapStatus)
      })
      this.getList();
    },
    activated() {
      this.getList();
    },
    methods: {
      /** 查询列表 */
      getList() {
        this.loading = true;
        projectInfo.singleBuildingSelectAllPage(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          console.dir(response.data.records)
            this.recordList = response.data.records;
            this.total = response.data.total;
            this.loading = false;
          }
        );
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
          buildingCode: undefined,
          mdgCode: undefined,
          buildingName: undefined,
          projectCode: undefined,
          buildingConstructStatus:undefined,
          buildingStatus:undefined,
          buildingPhase:undefined,
        }
        this.dateRange = [];
        this.getList();
      },

      /** 删除按钮操作 */
      deleteSingleBuilding(){
        if(this.mdmIds.length==0){
          this.msgError('请先选择要删除的选项');
          return false;
        }

        this.$confirm('是否确认删除?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          return projectInfo.singleBuildingLogicalDeletion(this.mdmIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
      },


      //编辑楼栋阶段
      openBuildingPhase(row) {
        this.buildingPhaseData.row = row;
        this.buildingPhaseData.buildingPhase = row.buildingPhase;
        this.buildingPhaseData.visible = true;

      },
      cancelBuildingPhase(){
        this.buildingPhaseData.buildingPhase = undefined;
        this.buildingPhaseData.visible = false;
      },
      saveBuildingPhase(){
        projectInfo.updateBuildingPhase({buildingPhase:this.buildingPhaseData.buildingPhase, buildingMdmId:this.buildingPhaseData.row.buildingMdmId}).then(response => {
          this.cancelBuildingPhase();
          this.getList();
        }).catch(err =>{
        });
      },




      goSingleBuildingDetail(row){
        this.$router.push({ path: '/projectmanage/singleBuildingDetail', query: { id:row.buildingMdmId } })
      },
      //选择多选框触发
      handleSelectionChange(selection){
        this.mdmIds = selection.map(item => item.buildingMdmId);
      },

      //跳转到开工
      goStratWorkForm(row){
        if(row.buildingConstructStatusCode&&row.buildingConstructStatusCode==2){
          projectInfo.selectWorkBuildingId({buildingMdmId:row.buildingMdmId,buildingConstructStatusCode:row.buildingConstructStatusCode}).then(response => {
            this.$router.push({ path: '/projectmanage/startWorkForm', query: { buildingMdmId:row.buildingMdmId,row:JSON.stringify(row),startWorkId:response.data.id}});
          });

        }else{
          this.$router.push({ path: '/projectmanage/startWorkForm', query: { buildingMdmId:row.buildingMdmId,row:JSON.stringify(row)} });
        }

      },
      goStopWorkForm(row){
        if(row.buildingConstructStatusCode==4||row.buildingConstructStatusCode==8){
          projectInfo.selectStopWorkBuildingId({buildingMdmId:row.buildingMdmId,buildingConstructStatusCode:row.buildingConstructStatusCode}).then(response => {
            this.$router.push({ path: '/projectmanage/stopWorkForm', query: { buildingMdmId:row.buildingMdmId,row:JSON.stringify(row),stopWorkId:response.data.id}});
          });

        }else{
          this.$router.push({ path: '/projectmanage/stopWorkForm', query: { buildingMdmId:row.buildingMdmId,row:JSON.stringify(row)} });
        }
      },




    }
  };
</script>

<style lang="scss" scoped>
</style>
