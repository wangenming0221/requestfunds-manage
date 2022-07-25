<template>
  <!-- 材料信息  -->
  <div class="material_information">
    <div>
      <span class="line"></span>
      <span class="head"> 采购订单信息</span>
    </div>
    <div>
      <el-form :inline="true" ref="info" :model="info" :rules="rules" size="mini" class="demo-form-inline">
        <el-row>
          <el-col :span="4">
            <el-form-item label="采购组织" class="null-border">
              <el-input v-model="info.pageDisplay.purchaseOrg" placeholder="" :disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-tooltip class="item" effect="dark" :content="info.pageDisplay.purchaseCode" placement="top-start">
              <el-form-item label="采购单号" class="null-border">
                <el-input v-model="info.pageDisplay.purchaseCode" placeholder="" :disabled="disabled"></el-input>
              </el-form-item>
            </el-tooltip>
          </el-col>
          <el-col :span="4">
            <el-form-item label="供应商" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.pageDisplay.supplyCompany" placement="top-start">
                <el-input v-model="info.pageDisplay.supplyCompany" placeholder="" :disabled="disabled"></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="采购员姓名" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.pageDisplay.purchasePersonName" placement="top-start">
                <el-input v-model="info.pageDisplay.purchasePersonName" placeholder="" :disabled="disabled"></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="采购员电话" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.pageDisplay.purchasePersonPhone" placement="top-start">
                <el-input v-model="info.pageDisplay.purchasePersonPhone" placeholder="" :disabled="disabled"></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="甲供材料" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.pageDisplay.isPartya" placement="top-start">
                <el-input v-model="info.pageDisplay.isPartya" placeholder="" :disabled="disabled"></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="请购公司" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.pageDisplay.purchaseCompany" placement="top-start">
                <el-input v-model="info.pageDisplay.purchaseCompany" placeholder="" :disabled="disabled"></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="请购员姓名" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.pageDisplay.shopPersonName" placement="top-start">
                <el-input v-model="info.pageDisplay.shopPersonName" placeholder="" :disabled="disabled"></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="请购员电话" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.pageDisplay.shopPersonPhone" placement="top-start">
                <el-input v-model="info.pageDisplay.shopPersonPhone" placeholder="" :disabled="disabled"></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="采购单日期" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.pageDisplay.shopCreateDate" placement="top-start">
                <el-input v-model="info.pageDisplay.shopCreateDate" placeholder="" :disabled="disabled"></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="仓库负责人姓名" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.pageDisplay.wareHouseCharge" placement="top-start">
                <el-input v-model="info.pageDisplay.wareHouseCharge" placeholder="" :disabled="disabled"></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="仓库负责人电话" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.pageDisplay.wareHousePhone" placement="top-start">
                <el-input v-model="info.pageDisplay.wareHousePhone" placeholder="" :disabled="disabled"></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="部门负责人" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.pageDisplay.orgName" placement="top-start">
                <el-input v-model="info.pageDisplay.orgName" placeholder="" :disabled="disabled"></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="采购类型" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.pageDisplay.purchaseType" placement="top-start">
                <el-input v-model="info.pageDisplay.purchaseType" placeholder="" :disabled="disabled"></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="总数量" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.pageDisplay.totalSum" placement="top-start">
                <el-input v-model="info.pageDisplay.totalSum" placeholder="" :disabled="disabled"></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="价税合计(元)" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.pageDisplay.totalCount" placement="top-start">
                <el-input v-model="info.pageDisplay.totalCount" placeholder="" :disabled="disabled"></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="项目" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.pageDisplay.purchaseArchName" placement="top-start">
                <el-input v-model="info.pageDisplay.purchaseArchName" placeholder="" :disabled="disabled"></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="户名" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.pageDisplay.bankName" placement="top-start">
                <el-input v-model="info.pageDisplay.bankName" placeholder="" :disabled="disabled"></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="银行账户" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.pageDisplay.bank" placement="top-start">
                <el-input v-model="info.pageDisplay.bank" placeholder="" :disabled="disabled"></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="供应商联系人" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.pageDisplay.supplyCompanyUserName" placement="top-start">
                <el-input v-model="info.pageDisplay.supplyCompanyUserName" placeholder="" :disabled="disabled"></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="发票类型" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.pageDisplay.bankType" placement="top-start">
                <el-input v-model="info.pageDisplay.bankType" placeholder="" :disabled="disabled"></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <el-form-item label="备注" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.pageDisplay.remark" placement="top-start">
                <el-input v-model="info.pageDisplay.remark" placeholder="备注" :disabled="disabled"></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>

    </div>
  </div>
</template>

<script>

  export default {
    name: 'material_information',
    data() {
      return {
        rules: {},
        strCompony:'沈阳腾越建筑有限公司'//暂时写死，只有腾跃
      }
    },

    props: {
      info:{ type: Object, default () { return {} } },
      conProvideOptions:{ type: Array, default () { return [] } },
      warehouse:{ type: Array, default () { return [] } },
      editable:{ type:Boolean, default: false }
    },

    //监听属性 类似于data概念",
    computed: {
      disabled(){
        return this.editable;
      }
    },

    //监控data中的数据变化",
    watch: {},

    methods: {
      async changeRules(){
        return await this.$refs['info'].validate
      },
      // selectChange(event) {
      //   console.log("event",event)
      //   let obj = {};
      //   obj = this.conProvideOptions.find((item)=>{
      //     return item.id === event;
      //   });
      //   this.info.supplyCompanyName = obj.pname;
      //   this.info.supplyCompanyUserName = obj.ppeople;
      //   this.info.supplyCompanyUserPhone = obj.legalTelephone;
      //   this.info.supplyCompanyId = obj.id;
      //   this.info.creditCode = obj.pcode;
      //   this.info.collectionName = obj.collectionName;
      //   this.info.cardNumber = obj.cardNumber;
      //   this.info.pnameCopy = obj.pname;
      // }
    },

    //生命周期 - 创建完成（可以访问当前this实例）",数据模型已加载，方法已加载,html模板已加载,html模板未渲染
    created() {
    },

    //生命周期 - 挂载之前",html模板未渲染
    beforeMount() {
    },

    //生命周期 - 挂载完成（可以访问DOM元素）",html模板已渲染
    mounted() {
    },

    //生命周期 - 更新之前",数据模型已更新,html模板未更新
    beforeUpdate() {
    },

    // 生命周期 - 销毁之前调用
    beforeDestroy() {
    },

    //生命周期 - 更新之后",数据模型已更新,html模板已更新
    updated() {
    },

    //生命周期 - 销毁完成"
    destroyed() {
    },

    //如果页面有keep-alive缓存功能，这个函数会触发",
    activated() {
    }
  }
</script>

<style scoped lang="scss">
  .material_information{
    margin-top: 30px;
    margin-bottom: 30px;
  }
</style>
