<template>
    <!-- 审批情况 -->
    <div class="approval_status">
      <div>
        <span class="line"></span>
        <span class="inline-block head">审批情况</span>
        <span class="inline-block">审批结果：
          <span class="adopt">审批通过</span>
        </span>
        <span class="inline-block time">审批通过时间：
          <span>{{ info.auditPassTime }}</span>
        </span>
      </div>
<!--      -->
        <el-steps :space="60"  direction="vertical" :active="info.totalWorkflowNodeList.length" finish-status="success">
          <el-step :title="step.workflowAuditorName" :description="'通过 ' + step.remarks" v-for="(step, index) in info.totalWorkflowNodeList" :key="step.workflowId"></el-step>
        </el-steps>
    </div>
</template>

<script>
    export default {
        name: 'approval_status',
        data() {
            return {}
        },

        props: {
          info:{ type: Object, default () { return {} } }
        },

        //监听属性 类似于data概念",
        computed: {},

        //监控data中的数据变化",
        watch: {
          // info:{
          //   immediate: true,
          //   deep: true,
          //   handler: function (val) {
          //
          //   }
          // }
        },

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
  .approval_status{
    margin-bottom: 30px;
  }
  .result{
  }
</style>
