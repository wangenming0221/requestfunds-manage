<template>
  <!-- 材料信息  -->
  <div class="material_information">
    <div>
      <span class="line"></span>
      <span class="head">验收信息</span>
    </div>
    <div>
      <el-form :inline="true" :model="info" ref="info" :rules="rules" size="mini" class="demo-form-inline">
        <el-row>
          <el-col :span="4">
            <el-form-item label="送货人姓名" prop="inWareHouseDelimanName">
              <el-input v-model="info.inWareHouseDelimanName" placeholder="请输入送货人姓名" :disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="送货人电话" prop="inWareHouseDelimanPhone" >
              <el-input v-model="info.inWareHouseDelimanPhone" placeholder="请输入送货人电话" :disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
            <el-col :span="4">
              <el-form-item label="收货人姓名" prop="inWareHouseBuyerName">
                <el-input v-model="info.inWareHouseBuyerName" placeholder="请输入采购员姓名" :disabled="disabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="收货人电话" prop="inWareHouseBuyerPhone">
                <el-input v-model="info.inWareHouseBuyerPhone" placeholder="请输入采购员电话" :disabled="disabled"></el-input>
              </el-form-item>
            </el-col>

          <el-col :span="4">
            <el-form-item label="领用人姓名" prop="inWareHouseReceiverName">
              <el-input v-model="info.inWareHouseReceiverName" placeholder="请输入领用人姓名" :disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="领用人电话" prop="inWareHouseReceiverPhone">
              <el-input v-model="info.inWareHouseReceiverPhone" placeholder="请输入领用人电话" :disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <el-form-item label="评级人姓名" prop="inWareHouseEvaluatorName">
              <el-input v-model="info.inWareHouseEvaluatorName" placeholder="请输入评级人姓名" :disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="评级人手机" prop="inWareHouseEvaluatorPhone">
              <el-input v-model="info.inWareHouseEvaluatorPhone" placeholder="请输入评级人手机" :disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="送货车牌号" prop="inWareHouseDelimanCarCode">
              <el-input v-model="info.inWareHouseDelimanCarCode" placeholder="请输入送货车牌号" :disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="送货单号" prop="inWareHouseDelimanCode">
              <el-input v-model="info.inWareHouseDelimanCode" placeholder="请输入送货单号" :disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="送货时间" prop="inWareHouseDelimanDate">
              <el-date-picker type="datetime" placeholder="请输入送货时间" v-model="info.inWareHouseDelimanDate" style="width: 100%;" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
<!--          <el-col :span="8">-->
<!--            <el-form-item label="送货地址" prop="shopAddress">-->
<!--              <el-input v-model="info.shopAddress" placeholder="请输入送货地址" style="width: 190%;"  :disabled="disabled"></el-input>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
          <el-col :span="8">
            <el-form-item label="意见建议">
              <el-input v-model="info.remarks" placeholder="（包括质量、服务、时间、数量）" style="width: 190%;"  :disabled="disabled"></el-input>
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
      const checkPhone = function (rule, value, callback) {
        if (!value) {
          callback(new Error('请输入'+this.name+'电话'));
        } else {
          let regPone = null;
          let mobile = /^1(3|4|5|6|7|8|9)\d{9}$/; //最新16手机正则
          // let tel = /^(0[0-9]{2,3}\-)([2-9][0-9]{4,7})+(\-[0-9]{1,4})?$/; //座机  行一印短信不需要校验座机
          // if (value.charAt(0) == 0) {    // charAt查找第一个字符方法，用来判断输入的是座机还是手机号
          //   regPone = tel;
          // } else {
            regPone = mobile;
          // }
          if (!regPone.test(value)) {
            return callback(
              new Error(this.name + "电话格式错误")
            );
          }
          callback();
        }
      }
      console.log("9090909",this)
      const houseBuyer = { name:'采购员' }
      const houseDeliman = { name:'送货人' }
      const houseReceiver = { name:'领用人电话' }
      const houseEvaluator = { name:'评级人' }
      return {
        flag: false,
        rules:{
          inWareHouseBuyerName: [{ required: true, message: '请输入采购员姓名', trigger: 'blur' },],
          inWareHouseBuyerPhone: [{ required: true, validator: checkPhone.bind(houseBuyer), trigger: 'blur' },],
          inWareHouseDelimanName: [{ required: true, message: '请输入送货人姓名', trigger: 'blur' },],
          inWareHouseDelimanPhone: [{ required: true, validator: checkPhone.bind(houseDeliman), trigger: 'blur' },],
          inWareHouseReceiverName: [{ required: true, message: '请输入领用人姓名', trigger: 'blur' },],
          inWareHouseReceiverPhone: [{ required: true, validator: checkPhone.bind(houseReceiver), trigger: 'blur' },],
          inWareHouseEvaluatorName: [{ required: true, message: '请输入评级人姓名', trigger: 'blur' },],
          inWareHouseEvaluatorPhone: [{ required: true, validator: checkPhone.bind(houseEvaluator), trigger: 'blur' },],
          inWareHouseDelimanCarCode: [{ required: true, message: '请输入送货车牌号', trigger: 'blur' },],
          inWareHouseDelimanCode: [{ required: true, message: '请输入送货单号', trigger: 'blur' },],
          shopAddress: [{ required: true, message: '请输入送货地址', trigger: 'blur' }],
          inWareHouseDelimanDate:[{ required: true, message: '请选择送货日期', trigger: 'blur' }]
        }
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

<style scoped lang="scss">
  .material_information{
    margin-top: 30px;
    margin-bottom: 30px;
  }
</style>
