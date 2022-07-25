<template>
    <!-- 基本信心  -->
    <div class="basie_info">
      <div>
        <span class="line"></span>
        <span class="head">基本信息</span>
      </div>
      <div>
        <el-form :inline="true" :model="info" size="mini" class="demo-form-inline">
        <el-row>
          <el-col :span="4">
            <el-form-item label="出库单号：" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.pageDisplay.outWareHouseCode" placement="top-start">
                <el-input v-model="info.pageDisplay.outWareHouseCode" placeholder="" disabled></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="采购类型：" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.pageDisplay.applyType" placement="top-start">
                <el-input v-model="info.pageDisplay.applyType" placeholder="" disabled></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <!--<div>仓库：{{ info.pageDisplay.purchaseWareHouseName }}</div>-->
            <el-form-item label="仓库：" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.pageDisplay.purchaseWareHouseName" placement="top-start">
                <el-input v-model="info.pageDisplay.purchaseWareHouseName" placeholder="" disabled></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="4">
           <!-- <div >库管员：{{ info.pageDisplay.purchaseWareHouseChargeName }}/{{ info.pageDisplay.purchaseWareHouseChargePhone }}</div>-->
            <el-form-item label="库管员：" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.pageDisplay.wareHouseChargeName+ '/' + info.pageDisplay.wareHouseChargePhone" placement="top-start">
                <el-input v-model="info.pageDisplay.wareHouseChargeName + '/' + info.pageDisplay.wareHouseChargePhone" placeholder="" disabled></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="单据日期：" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.pageDisplay.outWareHouseCreatedate" placement="top-start">
                <el-input v-model="info.pageDisplay.outWareHouseCreatedate" placeholder="" disabled></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="采购员姓名：" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.pageDisplay.purchasePersonName" placement="top-start">
                <el-input v-model="info.pageDisplay.purchasePersonName" placeholder="" disabled></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="采购员电话：" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.pageDisplay.purchasePersonPhone" placement="top-start">
                <el-input v-model="info.pageDisplay.purchasePersonPhone" placeholder="" disabled></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="原始单据号：" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.pageDisplay.purchaseCode" placement="top-start">
                <el-input v-model="info.pageDisplay.purchaseCode" placeholder="" disabled></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="采购部门：" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.pageDisplay.purchaseOrg" placement="top-start">
                <el-input v-model="info.pageDisplay.purchaseOrg" placeholder="" disabled></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="收货时间：" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.pageDisplay.outWareHouseDelimanDate" placement="top-start">
                <el-input v-model="info.pageDisplay.outWareHouseDelimanDate" placeholder="" disabled></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="1">
          <el-col :span="6">
            <el-form-item label="备注：" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.pageDisplay.remark" placement="top-start">
                <el-input v-model="info.pageDisplay.remark" placeholder="" disabled style="width: 150%"></el-input>
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
        name: 'basie_info',
        data() {
            return {}
        },

        props: {
          info:{ type: Object, default () { return {} } },
          title:{ type: String, default: '出库单' }
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
  .basie_info{
    /deep/.el-col{
      margin-bottom: 15px;
    }
  }
  .head{
    display: inline-block;
    font-weight: 600;
    font-size: 18px;
    margin-bottom: 20px;
  }
</style>
