<template>
    <!-- 材料验收记录 采购订单入库-查看详情 电子签 -->
    <div class="electronic_signature">
      <div>
        <span class="line"></span>
        <span class="inline-block head">电子签</span>
        <span @click="downXYY" class="xyyBtn">下载电子签文件</span>
      </div>
      <div class="steps">
        <el-steps :active="active" finish-status="success" >
          <el-step :title="step.tenantName" :description="step.status" v-for="(step, index) in info.xyy" :key="step.id">
            <template slot="title" >
              <span v-if="index === 0">送货人：{{step.tenantName}}</span>
              <span v-else-if="index === 1">收货人：{{step.tenantName}}</span>
              <span v-else-if="index === 2">领用人：{{step.tenantName}}</span>
              <span v-else-if="index === 3">评级人：{{step.tenantName}}</span>
            </template>
            <template slot="description" >
              <!--      DRAFT（草稿），SIGNING（签署中），COMPLETE（已完成），WAITING(等待他人处理)-->
              <span v-if="step.status ==='DRAFT'">草稿</span>
              <span v-else-if="step.status ==='SIGNING'">签署中</span>
              <span v-else-if="step.status ==='COMPLETE'">已完成</span>
              <span v-else-if="step.status ==='WAITING'">等待他人处理</span>
            </template>
          </el-step>
        </el-steps>
      </div>

    </div>
</template>

<script>
  // import { getFlie } from '@/api/material/materialRecords'

  import { download } from '@/utils/Bolb'

    export default {
        name: 'electronic_signature',
        data() {
            return {
              active: 0
            }
        },

        props: {
          info:{ type: Object, default () { return {} } }
        },

        //监听属性 类似于data概念",
        computed: {},

        //监控data中的数据变化",
        watch: {
          info:{
            immediate: true,
            deep: true,
            handler: function (val) {
              console.log(val)
              let arr = [];
              val.xyy.map(item=>{
                arr.push(item.status)
              })
              // DRAFT（草稿），SIGNING（签署中），COMPLETE（已完成），WAITING(等待他人处理)

              console.log("arr",arr)

              //如果行一印已完成
              if(arr.every(item => item =='COMPLETE')){
                return this.active = arr.length;
              }

              // 正在签署中时得进度条显示
              let index = arr.lastIndexOf('SIGNING')
              if(index!==-1){
                return this.active = index;
              }

            }
          }
        },

        methods: {
          downXYY(){
            download(`/total-material/totalmaterial/inwarehouse/getXyyContract?xyyContractId=${this.info.fileId}`,'收料单.pdf')
          }
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
  .inline-block{
    display: inline-block;
    margin-right: 30px;
  }
  .adopt{
    color: #13ce66;
    margin-right: 30px;
  }
  no-adopt{
    color: #ff6d6d;

  }
  .steps{
    width: 700px;
  }
  .xyyBtn{
    color: #409eff;
  }
</style>
