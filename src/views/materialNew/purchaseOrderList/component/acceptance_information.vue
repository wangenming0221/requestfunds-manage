<template>
    <!--  验收照片  -->
    <div class="acceptance_information">
      <div>
        <span class="line"></span>
          <span class="head">验收照片 <span class="discapnsce">（请上传小于100M的图片，最多20张，支持JPG\PNG格式）</span></span>
      </div>
      <div>
        <el-form ref="info" :label-position="'top'" :model="info" :rules="rules" size="mini">
          <el-form-item label="验收现场照片：" prop="liveChilds">
            <upload class="upload" :fileType="['jpg', 'png', 'pdf']" v-model="info.liveChilds" :limit="20" :showButton="showButton"></upload>
          </el-form-item>
          <el-form-item label="送货单：" prop="orderChilds">
            <upload :fileType="['jpg', 'png', 'pdf']" v-model="info.orderChilds" :limit="20" :showButton="showButton"></upload>
          </el-form-item>
          <el-form-item label="其它附件照片：" prop="otherChilds">
            <upload :fileType="['jpg', 'png', 'pdf']" v-model="info.otherChilds" :limit="20" :showButton="showButton"></upload>
          </el-form-item>
        </el-form>
      </div>
    </div>
</template>

<script>
    import upload from '@/views/material/components/upload'
    export default {
        name: 'acceptance_information',
        components:{
          upload
        },
        data() {
            return {
              realtimeState:true,
              sysAttachmentList:[],
              dialogImageUrl: '',
              dialogVisible: false,
              hideUpload:false,
              rules:{
                liveChilds:[{ required: true, message: '请输入验收现场照片', trigger: 'blur' }],
                orderChilds:[{ required: true, message: '请输入送货单', trigger: 'blur' }, ]

              },
            }
        },

        props: {
          info:{ type: Object, default () { return {} } },
          showButton:{ type: Boolean, default: false },
        },

        //监听属性 类似于data概念",
        computed: {},

        //监控data中的数据变化",
        watch: {},

        methods: {
          async changeRules(){
            return await this.$refs['info'].validate(async valid => { return valid })
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
  .discapnsce{
    color: #c0c4cc;
    font-size: 16px;
  }
</style>
