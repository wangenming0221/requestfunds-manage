<template>
  <div class="auth">
    <div class="tab-type">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="合同计划权限:">
          <el-switch
            v-model="form.authPlanValue"
            @change="handleAuthPlanStatus"
            active-color="#13ce66"
            inactive-color="#f6f6f6">
          </el-switch>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import api from '@/api/work/contract'
export default {
  name: 'AuthSwitch',
  data() {
    return {
      form: {
        authPlanValue: false
      },
      authParams: {
        ifFirstPlan: 0
      }
    }
  },
  methods: {
    handleAuthPlanStatus(val) {
      console.log(val)
      if (val) {
        this.authParams.ifFirstPlan = 1
      } else {
        this.authParams.ifFirstPlan = 0
      }
      api.isOpenApprove(this.authParams).then(res => {
        if (res.code === 0) {
          console.log(res)
          if (this.form.authPlanValue) {
            this.$message({
              type: 'success',
              message: '合同计划权限已开启'
            })
          } else {
            this.$message({
              type: 'warning',
              message: '合同计划权限已关闭'
            })
          }
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .auth{
    padding: 20px;
    .tab-type {
      width: 100%;
      height: 70px;
      border-radius: 10px;
      background-color: #fff;
      box-shadow: 10px 10px 30px 10px #eeeeee;
      margin-top: 5px;
      padding-top: 15px;
      padding-left: 40px;
    }
  }
</style>
