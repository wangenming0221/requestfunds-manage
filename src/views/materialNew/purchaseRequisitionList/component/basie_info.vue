<template>
  <!-- 请购单信息  -->
  <div class="basie_info">
    <div>
      <span class="line"></span>
      <span class="head">请购单信息</span>
    </div>
    <div>
      <el-form :inline="true" :model="info" size="mini" class="demo-form-inline">
        <el-row :gutter="1">
          <el-col :span="4">
            <el-form-item label="请购单号：" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.pageDisplay.ncCode" placement="top-start">
                <el-input v-model="info.pageDisplay.ncCode" placeholder="" disabled></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="库存组织：" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.pageDisplay.inventoryorg" placement="top-start">
                <el-input v-model="info.pageDisplay.inventoryorg" placeholder="" disabled></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="需求仓库：" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.pageDisplay.demandwarehouse" placement="top-start">
                <el-input v-model="info.pageDisplay.demandwarehouse" placeholder="" disabled></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="请购类型：" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.pageDisplay.requisitiontype" placement="top-start">
                <el-input v-model="info.pageDisplay.requisitiontype" placeholder="" disabled></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="采购组织：" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.pageDisplay.procurementorg" placement="top-start">
                <el-input v-model="info.pageDisplay.procurementorg" placeholder="" disabled></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>

          <!--  成本类请购  不显示,费用类型和资产用途      费用类请购和固定资产类请购 显示,费用类型和资产用途  -->
          <el-col :span="4" v-if="requisitionType">
            <el-form-item label="费用类型：" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.pageDisplay.expensetype" placement="top-start">
                <el-input v-model="info.pageDisplay.expensetype" placeholder="" disabled></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="仓库负责人：" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.pageDisplay.warehouseprincipal" placement="top-start">
                <el-input v-model="info.pageDisplay.warehouseprincipal" placeholder="" disabled></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="部门负责人：" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.pageDisplay.depthead" placement="top-start">
                <el-input v-model="info.pageDisplay.depthead" placeholder="" disabled></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="申购单号：" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.pageDisplay.sequenceno" placement="top-start">
                <el-input v-model="info.pageDisplay.sequenceno" placeholder="" disabled></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="4" v-if="requisitionType">
            <el-form-item label="资产用途：" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.pageDisplay.useassets" placement="top-start">
                <el-input v-model="info.pageDisplay.useassets" placeholder="" disabled></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="备注：" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.pageDisplay.remarks" placement="top-start">
                <el-input v-model="info.pageDisplay.remarks" placeholder="" disabled></el-input>
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
      info: {
        type: Object, default() {
          return {}
        }
      }
    },

    //监听属性 类似于data概念",
    computed: {
      requisitionType() {
        return this.info.requisitiontype !== '成本类请购'
      }
    },

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
  .basie_info {
    /*/deep/.el-col{*/
    /*  margin-top: 15px;*/
    /*}*/
    /*/deep/.el-col:first-child{*/
    /*  margin-top: 0px;*/
    /*}*/
  }
</style>
