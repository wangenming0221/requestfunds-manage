<template>
    <div class="purchase_order_information">
      <!-- 验收信息 -->
      <div>
        <span class="line"></span>
        <span class="head">验收信息</span>
      </div>
      <div>
        <el-form :inline="true" :model="info" ref="info" :rules="rules" size="mini" class="demo-form-inline">
          <el-row>
            <el-col :span="4" v-for="item in info.notes" :key="item.id">
              <span v-for="(item1,key) in item" v-if="item['type'] ==='采购员' || item['type'] ==='送货人' || item['type'] ==='领用人' || item['type'] ==='评级人'">
                  <el-form-item v-if="key==='name'" :label="item['type']" :prop="item['name']" class="null-border" :rules="[
                    { required: true, trigger: 'blur' }
                  ]">
                    <el-input v-model="item['name']" :placeholder="'请输入'+item['type']+'姓名'" :disabled="disabled"></el-input>
                  </el-form-item>
                  <el-form-item v-else-if="key==='phone'" :label="item['type']" :prop="item['type']" class="null-borer" :rules="[
                    { required: true, trigger: 'blur' }
                  ]">
                    <el-input v-model="item['phone']" :placeholder="'请输入'+item['type']+'电话'" :disabled="disabled"></el-input>
                  </el-form-item>
              </span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">
              <el-form-item label="送货车牌号" prop="inWareHouseDelimanCarCode" class="null-border">
                <el-tooltip class="item" effect="dark" :content="info.inWareHouseDelimanCarCode" placement="top-start">
                <el-input v-model="info.inWareHouseDelimanCarCode" placeholder="请输入送货车牌号" :disabled="disabled"></el-input>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="送货单号" prop="inWareHouseDelimanCode" class="null-border">
                <el-tooltip class="item" effect="dark" :content="info.inWareHouseDelimanCode" placement="top-start">
                <el-input v-model="info.inWareHouseDelimanCode" placeholder="请输入送货单号" :disabled="disabled"></el-input>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="意见建议" class="null-border">
                <el-tooltip class="item" effect="dark" :content="info.remarks" placement="top-start">
                <el-input v-model="info.remarks" placeholder="（包括质量、服务、时间、数量）" style="width: 250%;"  :disabled="disabled"></el-input>
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
        name: 'purchase_order_information',
        data() {
            return {
              flag: false,
              rules:{
                inWareHouseBuyerName: [{ required: true, message: '请输入采购员姓名', trigger: 'blur' },],
                inWareHouseBuyerPhone: [{ required: true, message: '请输入采购员电话', trigger: 'blur' },],
                inWareHouseDelimanName: [{ required: true, message: '请输入送货人姓名', trigger: 'blur' },],
                inWareHouseDelimanPhone: [{ required: true, message: '请输入送货人电话', trigger: 'blur' },],
                inWareHouseReceiverName: [{ required: true, message: '请输入领用人姓名', trigger: 'blur' },],
                inWareHouseReceiverPhone: [{ required: true, message: '请输入领用人电话', trigger: 'blur' },],
                inWareHouseEvaluatorName: [{ required: true, message: '请输入评级人姓名', trigger: 'blur' },],
                inWareHouseEvaluatorPhone: [{ required: true, message: '请输入评级人手机', trigger: 'blur' },],
                // inWareHouseDelimanCarCode: [{ required: true, message: '请输入送货车牌号', trigger: 'blur' },],
                // inWareHouseDelimanCode: [{ required: true, message: '请输入送货单号', trigger: 'blur' },],
                shopAddress: [{ required: true, message: '请输入送货地址', trigger: 'blur' }]
              },
              arr:[
                {"apple":[{"color":"red","num":"265"}]},
                {"banana":[{"color":"yellow","num":"366"}]},
                {"pear":[{"color":"green","num":"896"}]}
              ]
            }
        },

        props: {
          isShow:{ type: Boolean, default: false },
          info:{ type: Object, default () { return {} } },
        },

        //监听属性 类似于data概念",
        computed: {
          disabled(){
            return this.isShow
          }
        },

        //监控data中的数据变化",
        watch: {},

        methods: {
          changeRules(){
            this.$refs['info'].validate(valid => { return valid })
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

<style scoped>
</style>
