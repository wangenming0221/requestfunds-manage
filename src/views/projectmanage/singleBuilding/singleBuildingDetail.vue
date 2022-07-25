<template>
  <div class="app-container">
    <div class="common-nav">
      <div>

      </div>
      <div>
        <el-button type="primary" @click="openSet()">展示项设置</el-button>
        <el-button type="primary" @click="goProjectForm()">查看详情</el-button>
        <el-button  @click="goBack()">返回</el-button>
      </div>
    </div>
    <v-table
      :titleText="titleText"
      :titleData="titleData"
      :tableData="tableData"
      columnWidth="180"/>

      <!-- 展示项设置 -->
       <el-dialog  title="展示项设置"  :visible.sync="visible"  width="560px" :before-close="cancelSet">
         <div>
          <el-checkbox-group v-model="checkedSet" :min="1" >
            <el-checkbox v-for="item in sets" :label="item" :key="item.id">{{item.name}}</el-checkbox>
          </el-checkbox-group>
         </div>
         <div slot="footer" class="dialog-footer">
           <el-button  @click="cancelSet()">取 消</el-button>
           <el-button type="primary"  @click="getList()">确 定</el-button>
         </div>
       </el-dialog>
  </div>
</template>

<script>
  import VTable from '../components/vTable'
  import { projectInfo } from '@/api/work'
  export default {
    name: "index",
    data() {
      return {
        visible:false,
        titleText: [],
        titleData: [],
        tableData: [],
        checkedSet:[],
        sets:[{
          id:'projectCode',
          name:'项目编码'
        },{
          id:'projectName',
          name:'项目名称'
        },{
          id:'buildingName',
          name:'楼栋名称'
        },{
          id:'mdgCode',
          name:'集团MDG编码'
        },{
          id:'buildingCode',
          name:'楼栋编号'
        },{
          id:'buildingContractor',
          name:'楼栋承包人'
        }],

        buildingMdmId:undefined
      }
    },
    components: {
      VTable
    },
    mounted() {
      this.buildingMdmId = this.$route.query.id;
      this.checkedSet = [...this.sets];
      this.getList();
    },
    methods: {
      async getList(){
        let rowList = '';
        let fileList = '';
        this.checkedSet.forEach(item =>{
          rowList += (item.name + ',');
          fileList += (item.id + ',');
        });

        let res = await projectInfo.singleBuildingVersion({buildingMdmId:this.buildingMdmId,rowList,fileList});
        this.cancelSet();
        this.titleText = ['信息', '阶段版本'];
        this.titleData = res.data.topList;
        this.tableData = res.data.bodyList;

      },
      openSet(){
        this.visible = true;
      },
      cancelSet(){
        this.visible = false;

      },

      goProjectForm() {
        this.$router.push({ path: '/projectmanage/singleBuildingForm', query: { id: this.buildingMdmId } })
      },
      goBack(){
        this.$router.back();
      },

    }
  }
</script>

<style scoped lang="scss">
  .common-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

  }
</style>
