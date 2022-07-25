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
            <!--            <div>申购名称：{{ info.createdTime }} - {{ info.purchaseType }}</div>-->
            <el-form-item label="申购名称：" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.createdTime +'/'+ info.purchaseType" placement="top-start">
                <el-input v-model="info.createdTime +'/'+ info.purchaseType" placeholder="" disabled></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="申购单号：" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.sequenceNo" placement="top-start">
                <el-input v-model="info.sequenceNo" placeholder="" disabled></el-input>
              </el-tooltip>
            </el-form-item>
            <!--            <div>申购单号：{{ info.sequenceNo }}</div>-->
          </el-col>
          <el-col :span="4">
            <el-tooltip class="item" effect="dark" :content="info.creater + '/' + info.mobileNumber" placement="top-start">
              <el-form-item label="申购人：" class="null-border">
                <el-input v-model="info.creater + '/' + info.mobileNumber" placeholder="" disabled></el-input>
              </el-form-item>
            </el-tooltip>
            <!--<div>申购人：{{  info.creater }}-{{ info.mobileNumber }}</div>-->
          </el-col>
          <el-col :span="4">
            <el-tooltip class="item" effect="dark" :content="info.purchaseType" placement="top-start">
              <el-form-item label="申购类型：" class="null-border">
                <el-input v-model="info.purchaseType" placeholder="" disabled></el-input>
              </el-form-item>
            </el-tooltip>
            <!--<div>计划类型：{{ info.purchaseType }}</div>-->
          </el-col>
          <el-col :span="4">
            <el-tooltip class="item" effect="dark" :content="info.projectName" placement="top-start">
              <el-form-item label="申购项目：" class="null-border">
                <el-input v-model="info.projectName" placeholder="" disabled></el-input>
              </el-form-item>
            </el-tooltip>
            <!--<div>申购项目：{{ info.projectName }}</div>-->
          </el-col>
          <el-col :span="4">
            <el-tooltip class="item" effect="dark" :content="info.constructionGardenArea" placement="top-start">
              <el-form-item label="施工苑区：" class="null-border">
                <el-input v-model="info.constructionGardenArea" placeholder="" disabled></el-input>
              </el-form-item>
            </el-tooltip>
            <!--<div>施工苑区：{{ info.constructionGardenArea }}</div>-->
          </el-col>
        </el-row>
        <el-row :gutter="1">
          <el-col :span="4">
            <el-tooltip class="item" effect="dark" :content="info.createdTime" placement="top-start">
              <el-form-item label="申购日期：" class="null-border">
                <el-input v-model="info.createdTime" placeholder="" disabled></el-input>
              </el-form-item>
            </el-tooltip>
            <!--<div>申购日期：<el-col>{{ info.createdTime }}</el-col></div>-->
          </el-col>
          <el-col :span="4">
            <el-form-item label="施工类型：" class="null-border">
              <el-input v-model="info.constructionType" placeholder="" disabled></el-input>
            </el-form-item>
            <!--<div>施工类型：{{ info.constructionType }}</div>-->
          </el-col>
          <el-col :span="5">
            <el-form-item label="是否甲供材料：" class="null-border">
              <el-input v-model="info.materialsProvided" placeholder="" disabled></el-input>
            </el-form-item>
            <!--<div>是否甲供材料：{{ info.materialsProvided }}</div>-->
          </el-col>
          <el-col :span="5">
            <el-tooltip class="item" effect="dark" :content="info.requiredArrivalTime" placement="top-start">
              <el-form-item label="要求到货时间：" class="null-border">
                <el-input v-model="info.requiredArrivalTime" placeholder="" disabled></el-input>
              </el-form-item>
            </el-tooltip>
            <!-- <div>要求到货时间：{{ info.requiredArrivalTime }}</div>-->
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
    /*  margin-top: 15px;*/
    /*}*/
    /*/deep/.el-col:first-child{*/
    /*  margin-top: 0px;*/
    /*}*/
  }
</style>
