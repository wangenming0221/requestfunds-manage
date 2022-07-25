<template>
  <!-- 采购信息  -->
  <div class="basie_info">
    <div>
      <span class="line"></span>
      <span class="head">采购信息</span>
    </div>
    <div>
      <div>
        <el-form :inline="true" :model="info" :rules="rules" size="mini">
          <el-row>
            <el-col :span="4">
              <el-form-item label="采购单号" class="">
                <el-input v-model="info.purchaseCode" placeholder="" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="采购供应商" class="null-border">
                <el-tooltip class="item" effect="dark" :content="info.pageDisplay.supplyCompany" placement="top-start">
                <el-input v-model="info.pageDisplay.supplyCompany" placeholder="" size="mini" disabled></el-input>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-tooltip class="item" effect="dark" :content="info.pageDisplay.supplyCompany +'/'+ info.pageDisplay.supplyCompanyUserPhone" placement="top-start">
              <el-form-item label="供应商联系人" class="null-border">
                <el-input v-model="info.pageDisplay.supplyCompany +'/'+ info.pageDisplay.supplyCompanyUserPhone" placeholder="" size="mini" disabled></el-input>
              </el-form-item>
              </el-tooltip>
            </el-col>
            <el-col :span="4">
              <el-tooltip class="item" effect="dark" :content="info.pageDisplay.purchasePersonName +'/'+ info.pageDisplay.purchasePersonPhone" placement="top-start">
              <el-form-item label="采购员姓名电话" class="null-border">
                <el-input v-model="info.pageDisplay.purchasePersonName +'/'+ info.pageDisplay.purchasePersonPhone" placeholder="" size="mini" disabled></el-input>
              </el-form-item>
              </el-tooltip>
            </el-col>
            <el-col :span="4">
              <el-form-item label="要求到货日期" class="null-border">
                <el-tooltip class="item" effect="dark" :content="info.pageDisplay.arrivalDate" placement="top-start">
                <el-input v-model="info.pageDisplay.arrivalDate" placeholder="" size="mini" disabled></el-input>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="采购订单日期" class="null-border">
                <el-tooltip class="item" effect="dark" :content="info.pageDisplay.orderDate" placement="top-start">
                <el-input v-model="info.pageDisplay.orderDate" placeholder="" size="mini" disabled></el-input>
                </el-tooltip>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">
              <el-form-item label="项目档案" class="null-border">
                <el-tooltip class="item" effect="dark" :content="info.pageDisplay.purchaseArchName" placement="top-start">
                <el-input v-model="info.pageDisplay.purchaseArchName" placeholder="" size="mini" disabled></el-input>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="送货地址" class="null-border">
                <el-tooltip class="item" effect="dark" :content="info.pageDisplay.address" placement="top-start">
                <el-input v-model="info.pageDisplay.address" placeholder="" size="mini" disabled></el-input>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-tooltip class="item" effect="dark" :content="info.pageDisplay.shopPersonName +'/'+ info.pageDisplay.shopPersonPhone" placement="top-start">
              <el-form-item label="申购人姓名电话" class="null-border">
                <el-input v-model="info.pageDisplay.shopPersonName + '/' + info.pageDisplay.shopPersonPhone" placeholder="" size="mini" disabled></el-input>
              </el-form-item>
              </el-tooltip>
            </el-col>
            <el-col :span="4">
              <el-form-item label="申购部门" class="null-border">
                <el-tooltip class="item" effect="dark" :content="info.pageDisplay.shopOrg" placement="top-start">
                <el-input v-model="info.pageDisplay.shopOrg" placeholder="" size="mini" disabled></el-input>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-tooltip class="item" effect="dark" :content="info.pageDisplay.remark" placement="top-start">
              <el-form-item label="备注" class="">
                <el-input v-model="info.pageDisplay.remark" placeholder="" size="mini" disabled style="width: 215%"></el-input>
              </el-form-item>
              </el-tooltip>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'basie_info',
    data() {
      return {
        rules:{
          supplyCompanyIdCopy:[
            { required: true, message: '请选择采购供应商', trigger: 'change' }
          ]
        }
      }
    },

    props: {
      info:{ type: Object, default () { return {} } }
    },

    //监听属性 类似于data概念",
    computed: {},

    //监控data中的数据变化",
    watch: {},

    methods: {},

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
  /*.flex{*/
  /*  display: flex;*/
  /*}*/
  .basie_info{
    /*/deep/.el-col{*/
    /*  margin-bottom: 15px;*/
    /*}*/
  }
</style>
