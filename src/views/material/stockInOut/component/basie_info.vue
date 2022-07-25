<template>
    <!-- 基本信心  -->
    <div class="basie_info">
      <div>
        <span class="line"></span>
        <span class="head">基本信息</span>
      </div>
      <div>
        <el-form :inline="true" :model="info" size="mini" class="demo-form-inline">
        <el-row :gutter="1">
          <el-col :span="4">
<!--            <div>出库单号：{{ info.outWareHouseCode }}</div>-->
            <el-form-item label="出库单号：" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.outWareHouseCode" placement="top-start">
                <el-input v-model="info.outWareHouseCode" placeholder="" disabled></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="4">
<!--            <div>采购类型：{{ info.applyType }}</div>-->
            <el-form-item label="出库单号：" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.applyType" placement="top-start">
                <el-input v-model="info.applyType" placeholder="" disabled></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <!--<div>仓库：{{ info.purchaseWareHouseName }}</div>-->
            <el-form-item label="仓库：" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.purchaseWareHouseName" placement="top-start">
                <el-input v-model="info.purchaseWareHouseName" placeholder="" disabled></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="4">
           <!-- <div >库管员：{{ info.purchaseWareHouseChargeName }}/{{ info.purchaseWareHouseChargePhone }}</div>-->
            <el-form-item label="库管员：" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.purchaseWareHouseChargeName+ '/' + info.purchaseWareHouseChargePhone" placement="top-start">
                <el-input v-model="info.purchaseWareHouseChargeName + '/' + info.purchaseWareHouseChargePhone" placeholder="" disabled></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="4">
<!--            <div >单据日期：{{ info.outWareHouseCreatedate }}</div>-->
            <el-form-item label="单据日期：" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.outWareHouseCreatedate" placement="top-start">
                <el-input v-model="info.outWareHouseCreatedate" placeholder="" disabled></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="采购员：" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.purchasePersonName + '/' + info.purchasePersonPhone" placement="top-start">
                <el-input v-model="info.purchasePersonName + '/' + info.purchasePersonPhone" placeholder="" disabled></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="1">
<!--          <el-col :span="4">-->
<!--            <div>采购员：{{ info.purchasePersonName }}/{{ info.purchasePersonPhone }}</div>-->
<!--          </el-col>-->
<!--            <div>采购单据号：{{ info.purchaseCode }}</div>-->
          <el-col :span="4">
            <el-form-item label="采购员：" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.purchasePersonName+ '/' + info.purchasePersonPhone" placement="top-start">
                <el-input v-model="info.purchasePersonName+ '/' + info.purchasePersonPhone" placeholder="" disabled></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="5">
<!--            <div>开始收货时间：{{ info.outWareHouseCreatedate }}</div>-->
            <el-form-item label="开始收货时间：" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.outWareHouseCreatedate" placement="top-start">
                <el-input v-model="info.outWareHouseCreatedate" placeholder="" disabled></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="1">
          <el-col :span="4">
<!--            <div>申请部门：{{ info.purchaseOrg }}</div>-->
            <el-form-item label="申请部门：" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.purchaseOrg" placement="top-start">
                <el-input v-model="info.purchaseOrg" placeholder="" disabled></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="1">
          <el-col :span="6">
<!--            <div>备注：{{ info.outWareHouseCreatedate }}/{{ info.applyType }}</div>-->
            <el-form-item label="备注：" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.outWareHouseCreatedate + '/' +info.applyType" placement="top-start">
                <el-input v-model="info.outWareHouseCreatedate + '/' +info.applyType" placeholder="" disabled style="width: 150%"></el-input>
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
