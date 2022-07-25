<template>
  <div class="app-container">
    <el-form ref="contractorForm" :model="form" label-width="150px" :rules="rules">
      <div class="common-nav">
        <div class="common-nav_title">承包人管理</div>
        <div>
          <el-button type="primary" @click="verifySubmitForm()">提交</el-button>
          <el-button  @click="goBack()">返回</el-button>
        </div>
      </div>
      <el-row :gutter="24">

        <el-col :span="8">
          <el-form-item prop="maintainer" label="维护人">
            <el-input v-model="maintainer"  placeholder="请输入维护人"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="mintenanceTime" label="维护时间">
            <el-input v-model="mintenanceTime"  placeholder="请输入维护时间"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="generalContractProjectCode" label="总包项目编码">
            <el-input v-model="form.generalContractProjectCode"  placeholder="请输入总包项目编码"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="generalContractProjectName" label="总包项目">
            <el-input v-model="form.generalContractProjectName"  placeholder="请输入总包项目"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="buildingContractorProjectCode" label="楼承包人项目编码">
            <el-input v-model="form.buildingContractorProjectCode"  placeholder="请输入楼承包人项目编码"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="projectContractMode" label="项目承包模式">
            <el-input v-model="form.projectContractMode"  placeholder="请输入项目承包模式"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="companyName" label="所属分公司">
            <el-input v-model="form.companyName"  placeholder="请输入所属分公司"/>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item prop="projectManager" label="项目经理">
            <el-input v-model="form.projectManager"  placeholder="请输入项目经理"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="projectManagerPhone" label="项目经理联系电话">
            <el-input v-model="form.projectManagerPhone"  placeholder="请输入项目经理联系电话"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="constructionDirector" label="施工负责人">
            <el-input v-model="form.constructionDirector"  placeholder="请输入施工负责人"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="constructionDirectorPhone" label="施工负责人联系电话">
            <el-input v-model="form.constructionDirectorPhone"  placeholder="请输入施工负责人联系电话"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="constructionDirectorIdcard" label="施工负责人身份信息">
            <el-input v-model="form.constructionDirectorIdcard"  placeholder="请输入施工负责人身份信息"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="financeParkName" label="财务苑区">
            <el-input v-model="form.financeParkName"  placeholder="请输入财务苑区" @focus = "openDialog()"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 财务苑区弹框 -->
    <el-dialog  title="选择财务苑区" :visible.sync="open" width="800px" >
      <el-table ref="selectList" v-loading="loading" :data="financeParkList"  style="width: 100%"   @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" align="center">
        </el-table-column>
        <el-table-column prop="parkName" label="财务苑区" align="center" :show-overflow-tooltip="true" ></el-table-column>
        <el-table-column prop="projectCode" label="总包项目编码" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
        <el-table-column prop="projectName" label="项目名称" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
        <el-table-column prop="contractCode" label="总包合同编码" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { projectInfo } from '@/api/work'
  import { projectmanagedic } from '@/utils/dictionary'
  import store from '@/store'
  import { parseTime } from "@/utils/ruoyi"
  export default {
    name: "contractorForm",
    data() {
      return {
        timer:null,
        loading:false,
        maintainer:store.getters.name,
        mintenanceTime:parseTime(new Date()),
        type:'add',
        //财务苑区列表
        financeParkList:[],
        financeSelected:{
          id:undefined,
          name:undefined,
        },
        selectList:[],
        //弹框标题
        title: "",
        // 是否显示弹出层
        open: false,
        rules: {
          generalContractProjectCode: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          generalContractProjectName: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          buildingContractorProjectCode: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          projectContractMode: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          companyName: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          projectManager: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          projectManagerPhone: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          constructionDirector: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          constructionDirectorPhone: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          constructionDirectorIdcard: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          financeParkName: [
            { required: true, message: '请输入', trigger: 'change' },
          ],


        },
        form:{

        },


      }
    },
    mounted() {


      if (this.$route.query.id) {
        this.type = 'edit';
        projectInfo.getContractorDetail({ id: this.$route.query.id }).then(res => {
          this.mintenanceTime = res.data.updateTime;
          this.form = {
            ...res.data,
          }
          this.$nextTick(() => {
            this.clearForm('contractorForm');
          })
        })
      } else {
        this.type = 'add';
        this.form = {
        };
      }
    },
    methods: {
      //拉取财务苑区列表
      getFinanceParkList(){
        this.loading = true;
        projectInfo.financeParkSelectAllPage().then(response => {
          this.financeParkList = response.data.records;
          this.loading = false;

          this.$nextTick(()=>{
            this.$refs.selectList.toggleRowSelection(this.financeParkList.find(item =>{
              return item.id == this.form.financeParkCode;
            }),true);

          })
        });
      },


      verifySubmitForm(){
        if(!this.timer){
          this.$refs['contractorForm'].validate((valid) => {
            if (valid) {
              const params = {
                ...this.form
              }
              if(this.type == 'add'){
                this.addForm(params);
              }else{
                this.editForm(params);
              }
            } else {
              return false;
            }
          });
          this.timer = setTimeout(()=>{
            this.timer = null;
          },3000)
        }

      },

      clearForm(value) {
        this.$refs[value].clearValidate();
      },
      addForm(value) {
        projectInfo.addContractor(value).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '操作成功'
            });
            this.$router.back();
          }
        })
      },
      editForm(value) {
        projectInfo.editContractor(value).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '操作成功'
            });
            this.$router.back();
          }
        })
      },
      //打开弹框
      openDialog(){
        this.getFinanceParkList();
        this.open = true;
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.financeParkList = [];
      },
      /** 提交按钮 */
      submitForm: function() {
        if(this.selectList.length == 0){
          this.msgError('请选择财务苑区');
          return false;
        }else{
           this.form.financeParkName = this.selectList[0].parkName;
           this.form.financeParkCode = this.selectList[0].id;
           this.cancel();
        }

      },
      handleSelectionChange(selection){
        this.selectList = [];
        if (selection.length > 1) {
          this.$refs.selectList.clearSelection();
          this.$refs.selectList.toggleRowSelection(
            selection[selection.length - 1]
          );
        }
        this.selectList = [selection[selection.length - 1]];
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
    margin-bottom:15px;
    .common-nav_title {
      font-weight: 600;
      font-size: 18px;
    }
  }
  .common-title {
    background: rgb(242, 242, 242);
    padding: 10px 0;
    margin: 14px 0;
  }
  /deep/ .el-table__header-wrapper .el-checkbox {
    //找到表头那一行，然后把里面的复选框隐藏掉
    display: none;
  }
</style>
