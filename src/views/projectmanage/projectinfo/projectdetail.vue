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
          <el-checkbox-group v-model="checkedSet" :min="1">
            <el-checkbox  v-for="item in sets" :label="item" :key="item.id">{{item.name}}</el-checkbox>
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
          id:'companyName',
          name:'所属分公司'
        },{
          id:'projectApproveName',
          name:'立项名称'
        },{
          id:'code',
          name:'总包项目编码'
        },{
          id:'name',
          name:'总包项目名称'
        },{
          id:'regionName',
          name:'甲方区域'
        },{
          id:'filingProjectNamePartyA',
          name:'甲方备案项目名称'
        },{
          id:'filingProjectName',
          name:'备案项目名称'
        },{
          id:'projectType',
          name:'项目类型'
        },{
          id:'buildingTypeName',
          name:'建筑类型'
        },{
          id:'totalBuildingNumber',
          name:'合同范围内楼栋总数'
        },{
          id:'homeArea',
          name:'建筑面积（㎡）'
        },{
          id:'projectStartDate',
          name:'施工预计开始日期'
        },{
          id:'projectEndDate',
          name:'施工预计结束日期'
        },{
          id:'projectManagerName',
          name:'项目经理（建造师）'
        },{
          id:'constructionDirectorName',
          name:'施工负责人'
        },{
          id:'projectHeadPartyA',
          name:'甲方项目总'
        },{
          id:'projectEngineerPartyA',
          name:'甲方项目工程师'
        }],

        projectMdmId:undefined
      }
    },
    components: {
      VTable
    },
    mounted() {
      this.projectMdmId = this.$route.query.id;
      this.checkedSet = [...this.sets];
      this.getList();

      // setTimeout(() => {
      //   this.titleText = ['信息', '阶段版本'];
      //   this.titleData = [
      //     '投标阶项目信1',
      //     '投标阶项目信2',
      //   ];
      //   this.tableData = [
      //     ['所属分公司', '辽宁分公司1', '辽宁分公司2'],
      //     ['立项名称', '辽阳热电1', '辽阳热电2'],
      //   ]
      // }, 500)
    },
    // destroyed() {
    //   this.checkedSet = [];
    // },
    methods: {
      async getList(){
        let rowList = '';
        let fileList = '';
        this.checkedSet.forEach(item =>{
          rowList += (item.name + ',');
          fileList += (item.id + ',');
        });

        let res = await projectInfo.projectVersion({projectMdmId:this.projectMdmId,rowList,fileList});
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
        this.$router.push({ path: '/projectmanage/projectform', query: { id: this.projectMdmId } })
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
