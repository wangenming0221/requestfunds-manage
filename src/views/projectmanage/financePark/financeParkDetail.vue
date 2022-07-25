<template>
  <div class="app-container">
    <el-form ref="financeParkDetail" :model="form" label-width="150px" :rules="rules">
      <div class="common-nav">
        <div class="common-nav_title">苑区选择器</div>
        <div>
          <el-button  @click="goBack()">返回</el-button>
        </div>
      </div>
      

      <el-row :gutter="24" class="row">
        <el-col :span="4" class="col">
          录入人
        </el-col>
        <el-col :span="8" class="col">
          {{name}}
        </el-col>
        <el-col :span="4" class="col">
          录入时间
        </el-col>
        <el-col :span="8" class="col">
          {{createTime}}
        </el-col>
        <el-col :span="24" class="common-title" >表单信息</el-col>
        <el-col :span="4" class="col">
          总包项目编码
        </el-col>
        <el-col :span="20" class="col">
          {{form.projectCode}}
        </el-col>
        <el-col :span="4" class="col">
          项目名称
        </el-col>
        <el-col :span="20" class="col">
          {{form.projectName}}
        </el-col>
        <el-col :span="4" class="col">
          总包合同编码
        </el-col>
        <el-col :span="20" class="col">
          {{form.contractCode}}
        </el-col>
        <el-col :span="4" class="col">
          财务苑区
        </el-col>
        <el-col :span="20" class="col">
          {{form.parkName}}
        </el-col>
      </el-row>
    </el-form>



  </div>
</template>

<script>
  import { projectInfo } from '@/api/work'
  import store from '@/store'
  import { parseTime } from "@/utils/ruoyi"

  export default {
    name: "financeParkDetail",
    data() {
      return {
        name:store.getters.name,
        createTime:undefined,

        form:{
          projectCode:undefined,
          projectName:undefined,
          contractCode:undefined,
          parkName:undefined,
        },
        rules:{

        },


      }
    },
    mounted() {
      if (this.$route.query.id) {

        projectInfo.getFinanceParkDetail({ id: this.$route.query.id }).then(res => {
          this.createTime = res.data.createTime;
          this.form = {
            ...res.data,
          }
          this.$nextTick(() => {
            this.clearForm('financeParkDetail');
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
    margin:0 120px 15px 120px !important;

    display: flex;
    justify-content: space-between;
    align-items: center;
    .common-nav_title {
      font-weight: 600;
      font-size: 20px;
    }
  }
  .row{
    margin:0 120px 0 120px !important;
    .common-title {
      height:50px;
      line-height:50px;
      font-weight: 600;
      font-size: 16px;
    }
    .col{
      height:40px;
      line-height: 40px;
      border-left:1px solid rgb(208,208,208);
      border-top:1px solid rgb(208,208,208);
    }
    .col:nth-child(4){
      border-right:1px solid rgb(208,208,208);
    }
    .col:nth-child(-n+4){
      border-bottom:1px solid rgb(208,208,208);
    }
    .col:nth-child(n+12){
      border-bottom:1px solid rgb(208,208,208);
    }
    .col:nth-child(2n+5){
      border-right:1px solid rgb(208,208,208);
    }
    .col:nth-of-type(2n+6){
      background-color: rgb(249,249,249);
    }
    .col:nth-of-type(-2n+3){
      background-color: rgb(249,249,249);
    }
    /deep/.el-input__inner{
      height:38px !important;
      border:0
    }



  }


</style>
