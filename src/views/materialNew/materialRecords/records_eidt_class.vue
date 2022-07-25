<template>
    <div class="">
      <!--    采购制单员   -->
      <el-dialog :title="title" :close-on-click-modal="false" class="eidt_class" :visible="showDialog" append-to-body width="94%"  @close="closeDialg()">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="入库单详情" name="first">
            <!--  电子签      -->
            <electronic_signature :info="info"></electronic_signature>
            <!--  采购信息      -->
            <purchasing_information :info="info"></purchasing_information>
            <!--  验收信息      -->
            <purchase_order_information :info="info" :isShow="true"></purchase_order_information>
            <!--  验收照片      -->
            <acceptance_information ref="acceptance_information" :info="info"></acceptance_information>
            <!--    材料信息    -->
            <material_modal :templetJson="templetJson" :templetData="info" @allRowIsFull="allRowIsFullHandle" :show="true"></material_modal>
          </el-tab-pane>
        </el-tabs>
        <span slot="footer" class="dialog-footer" v-if="btnShow">
          <el-button @click="closeDialg()">取 消</el-button>
          <el-button type="primary" @click="submitHandle()">撤 回</el-button>
        </span>
      </el-dialog>

    </div>
</template>

<script>
    import { getMaterialAndEnclosure } from '@/api/material/materialRecords'
    import { recallContract } from '@/api/material/stockInOut';
    import dataList from './component/dataList.json'

    import electronic_signature from "./component/electronic_signature";
    import purchasing_information from "./component/purchasing_information";
    import purchase_order_information from './component/purchase_order_information'
    import acceptance_information from "./component/acceptance_information";
    import material_modal from "../components/material_modal";

    export default {
        name: 'records_eidt_class',
        components:{
          electronic_signature,
          purchasing_information,
          acceptance_information,
          material_modal,
          purchase_order_information
        },
        data() {
            return {
              showDialog: false,
              showEndButton:false,
              activeName: 'first',
              tableData:[],//关联采购单
              info:{},
              templetJson:dataList,
              flag: false,
              edit:''
            }
        },

        props: {
          conProvideOptions:{ type: Array, default () { return [] } },
          allWare:{ type: Array, default () { return [] } },
        },

        //监听属性 类似于data概念",
        computed: {
          title(){
            // return this.info.materialclassId ? '编辑物料类别' : '新增物料类别'
          },
          editable(){
            if(this.edit ==='update'){
              return true
            }else if(this.edit==='edit'){
              return false
            }
          },
          btnShow(){
            if(this.info.states =='已完成' || this.info.states=='已入库' || this.info.states=='已撤回'){
              return false
            }
            return true
          }
        },

        //监控data中的数据变化",
        watch: {},

        methods: {
          closeDialg(){
            this.activeName = "first";
            this.showDialog = false;
          },
          getDataList(purchaseId){
            getStockInPage(purchaseId).then(response=>{
              this.tableData = response.data.records;
              console.log("this.tableData",this.tableData.records)
            })
          },
          // 是否填充完毕
          allRowIsFullHandle (val) {
            console.log("val",val)
            // this.editableTabs[index].dataVerify = val
            this.flag = val;
          },
          handleClick(tab, event) {

          },
          // 查看信息
          async eidtUpdateHandle(row){
            // 查询 材料验收记录 单条信息 物料信息和附件
            await getMaterialAndEnclosure(row.inWareHouseId).then(response=>{
              let info = response.data;
              info.pageDisplay = {};
              info.pageDisplay.supplyCompanyName = info.supplyCompanyName ? info.supplyCompanyName : '-'; //采购供应商
              info.pageDisplay.supplyCompanyUserName = info.supplyCompanyUserName ? info.supplyCompanyUserName : '-'; //供应商联系人
              info.pageDisplay.supplyCompanyUserPhone = info.supplyCompanyUserPhone ? info.supplyCompanyUserPhone : '-'; //供应商联系人
              info.pageDisplay.purchasePersonName = info.purchasePersonName ? info.purchasePersonName : '-'; //采购员姓名
              info.pageDisplay.purchasePersonPhone = info.purchasePersonPhone ? info.purchasePersonPhone : '-'; //采购员电话
              info.pageDisplay.inWareHouseDelimanDate = info.inWareHouseDelimanDate ? info.inWareHouseDelimanDate : '-'; //要求到货日期
              info.pageDisplay.orderDate = info.orderDate ? info.orderDate : '-'; //采购订单日期
              info.pageDisplay.shopAddress = info.shopAddress ? info.shopAddress : '-'; //送货地址
              info.pageDisplay.wareHouse = info.wareHouse ? info.wareHouse : '-'; //采购供应商
              info.pageDisplay.supplyCompanyName = info.supplyCompanyName ? info.supplyCompanyName : '-'; //收货仓库
              info.pageDisplay.shopPersonName = info.shopPersonName ? info.shopPersonName : '-'; //申购人姓名
              info.pageDisplay.remarks = info.remarks ? info.remarks : '-'; //备注
              this.info = info;
            })
            console.log("info",this.info)
            this.showDialog = true;
          },
          //撤销确认
          submitHandle(){
            recallContract(this.info.inWareHouseId).then(response=>{
              this.closeDialg();
              this.$emit("onQuery")
              this.$notify({title: '操作成功', message: '撤销成功'});
            })
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
  .eidt_class{
    /deep/.line{
      height: 18px;
      background-color: #00afff;
      width: 4px;
      display: inline-block;
      position: relative;
      top: 3px;
      margin-right: 7px;
    }
    /deep/.head{
      display: inline-block;
      font-weight: 600;
      font-size: 18px;
      margin-bottom: 20px;
    }
    .material_information{
      /deep/.el-form--inline .el-form-item{
        margin-right: 0px;
      }
      /deep/.el-select{
        width: 92%;
      }
    }
    /deep/.el-form-item__label{
      font-weight: 500;
    }
    /deep/.el-form--inline .el-form-item__label,
    /deep/.el-form--label-top .el-form-item__label{
      font-weight: 500;
      font-size: 16px;
      transform: scale(0.75);
      padding: 0 0 0 0;
    }
    /deep/.el-form--inline .el-form-item{
      margin-right:0px;
    }
  }

</style>
