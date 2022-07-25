<template>
  <div class="app-container">
    <el-form ref="contractorDetail" :model="form" label-width="150px" :rules="rules">
      <div class="common-nav">
        <div class="common-nav_title">承包人管理详情</div>
        <div>
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
            <el-input v-model="form.financeParkName"  placeholder="请输入财务苑区" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>


  </div>
</template>

<script>
  import { projectInfo } from '@/api/work'
  import { projectmanagedic } from '@/utils/dictionary'
  import store from '@/store'
  import { parseTime } from "@/utils/ruoyi"
  export default {
    name: "contractorDetail",
    data() {
      return {

        maintainer:store.getters.name,
        mintenanceTime:parseTime(new Date()),


        rules: {



        },
        form:{

        },


      }
    },
    mounted() {

      if (this.$route.query.id) {

        projectInfo.getContractorDetail({ id: this.$route.query.id }).then(res => {
          this.mintenanceTime = res.data.updateTime;
          this.form = {
            ...res.data,
          }
          this.$nextTick(() => {
            this.clearForm('contractorDetail');
          })
        })
      } else {

        this.form = {
        };
      }
    },
    methods: {

      clearForm(value) {
        this.$refs[value].clearValidate();
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
</style>
