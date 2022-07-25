<template>
  <!-- 材料信息  -->
  <div class="material_information">
    <div>
      <span class="line"></span>
      <span class="head">采购订单信息</span>
    </div>
    <div>
      <el-form :inline="true" ref="info" :model="info" :rules="rules" size="mini" class="demo-form-inline">
        <el-row :gutter="1">
          <!--        <el-row  :gutter="3">-->
          <el-col :span="4">
            <el-form-item label="采购单号" prop="purchaseCode">
              <el-input v-model="info.purchaseCode" placeholder="" :disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-tooltip class="item" effect="dark" :content="info.supplyCompanyName" placement="top-start">
              <el-form-item label="采购供应商" prop="supplyCompanyIdCopy">
                <el-select v-model="info.supplyCompanyIdCopy" filterable placeholder="" :disabled="disabled"
                           @change="selectChange($event)">
                  <el-option
                    v-for="item in conProvideOptions"
                    :key="item.id"
                    :label="item.pname"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-tooltip>
          </el-col>
          <el-col :span="4">
            <el-form-item label="供应商联系人" class="null-border">
              <el-tooltip class="item" effect="dark" :content="info.supplyCompanyUserName + '/' + info.supplyCompanyUserPhone" placement="top-start">
                <el-input v-model="info.supplyCompanyUserName + '/' + info.supplyCompanyUserPhone" placeholder="" :disabled="disabled"></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-tooltip class="item" effect="dark" :content="info.collectionName +'/'+info.cardNumber" placement="top-start">
              <el-form-item label="收款账号" class="null-border">
                <el-input v-model="info.collectionName +'/'+info.cardNumber" placeholder="" :disabled="disabled"></el-input>
              </el-form-item>
            </el-tooltip>
          </el-col>
          <el-col :span="4">

            <el-form-item label="收货仓库">
              <el-select v-model="info.purchaseWareHouseId" filterable :disabled="disabled">
                <el-option
                  v-for="item in warehouse"
                  :key="item.totalMaterialWarehouseId"
                  :label="item.totalMaterialWarehouseName"
                  :value="item.totalMaterialWarehouseId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="采购组织">
              <el-input v-model="strCompony" placeholder="" :disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
          <!--          <el-col :span="4">-->
          <!--            <el-form-item label="部门负责人">-->
          <!--              <el-input v-model="info.purchaseOrg" placeholder=""></el-input>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
        </el-row>
        <!--        type="flex" justify="space-between" -->
        <el-row >
          <el-col :span="4">
            <el-form-item label="采购员姓名">
              <el-input v-model="info.purchasePersonName" placeholder="" :disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="采购员电话" prop="purchasePersonPhone">
              <el-input v-model="info.purchasePersonPhone" placeholder="" :disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="部门负责人">
              <el-input v-model="info.purchaseOrgPersonName" placeholder="" :disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="订单日期">
              <el-date-picker type="datetime" placeholder="选择时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
                              :disabled="disabled" v-model="info.orderDate" style="width:85%"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="计税类别">
              <el-select v-model="info.taxCategory" placeholder="" :disabled="disabled">
                <el-option label="一般计税（专用发票）" value="一般计税（专用发票）"></el-option>
                <el-option label="一般计税（普用发票）" value="一般计税（普用发票）"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <el-tooltip class="item" effect="dark" :content="info.remark" placement="top-start">
              <el-form-item label="备注">
                <el-input v-model="info.remark" placeholder="备注" :disabled="disabled"></el-input>
              </el-form-item>
            </el-tooltip>
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
          callback();
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
      const purchasePerPhone = { name:'采购员' }
      return {
        rules:{
          supplyCompanyIdCopy:[
            { required: true, message: '请选择采购供应商', trigger: 'change' }
          ],
          purchaseCode:[
            { required: true, message: '请选择采购供应商', trigger: 'change' }
          ],
          purchasePersonPhone: [
            { validator: checkPhone.bind(purchasePerPhone), trigger: 'blur' }
          ],
        },
        strCompony:'沈阳腾越建筑有限公司'//暂时写死，只有腾跃
      }
    },

    props: {
      info:{ type: Object, default () { return {} } },
      conProvideOptions:{ type: Array, default () { return [] } },
      warehouse:{ type: Array, default () { return [] } },
      editable:{ type:Boolean, default: false }
    },

    //监听属性 类似于data概念",
    computed: {
      disabled(){
        return this.editable;
      }
    },

    //监控data中的数据变化",
    watch: {},

    methods: {
      async changeRules(){
        return await this.$refs['info'].validate
      },
      selectChange(event) {
        console.log("event",event)
        let obj = {};
        obj = this.conProvideOptions.find((item)=>{
          return item.id === event;
        });
        this.info.supplyCompanyName = obj.pname;
        this.info.supplyCompanyUserName = obj.ppeople;
        this.info.supplyCompanyUserPhone = obj.legalTelephone;
        this.info.supplyCompanyId = obj.id;
        this.info.creditCode = obj.pcode;
        this.info.collectionName = obj.collectionName;
        this.info.cardNumber = obj.cardNumber;
        this.info.pnameCopy = obj.pname;
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
