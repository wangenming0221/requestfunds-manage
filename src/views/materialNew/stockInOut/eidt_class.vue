<template>
    <div class="eidt_class">
      <el-dialog :title="title" :close-on-click-modal="false" :visible="showDialog" width="90%" class="company-dialog"  append-to-body @close="showDialog=false">
        <basie_info :info="info" :title="title"></basie_info>
        <material_modal :templetJson="templetJson" :templetData="info"  :show="false"></material_modal>
      </el-dialog>


    </div>
</template>

<script>
    import { getInStockById, getOutStockById } from '@/api/material/stockInOut';

    import dataList from './component/dataList.json'
    import material_modal from "../components/material_modal";
    import basie_info from "./component/basie_info";
    export default {
        name: 'eidt_class',
        components:{
          basie_info,
          material_modal
        },
        data() {
            return {
              showDialog: false,
              showEndButton:false,
              showEachDialog: true,
              templetJson: dataList,
              info:{}
            }
        },

        props: {
        },

        //监听属性 类似于data概念",
        computed: {
          title() {
            return this.info.inWareHouseId ? '入库单' : '出库单'
          }
        },

        //监控data中的数据变化",
        watch: {},

        methods: {
          // 是否填充完毕
          allRowIsFullHandle (val) {
            // let index = this.editableTabsValue * 1
            // this.editableTabs[index].dataVerify = val
          },
          async eidtUpdateHandle(edit,row){
            console.log(edit)
            console.log(row)
              getOutStockById(row.outWareHouseId).then(response=>{
                let info = response.data;
                info.pageDisplay = {};
                info.pageDisplay.outWareHouseCode = info.outWareHouseCode ? info.outWareHouseCode : '-'; //出库单号
                info.pageDisplay.applyType = info.applyType ? info.applyType : '-'; //采购类型
                info.pageDisplay.purchaseWareHouseName = info.purchaseWareHouseName ? info.purchaseWareHouseName : '-'; //仓库
                info.pageDisplay.wareHouseChargeName = info.wareHouseChargeName ? info.wareHouseChargeName : '-'; //库管员姓名
                info.pageDisplay.wareHouseChargePhone = info.wareHouseChargePhone ? info.wareHouseChargePhone : '-'; //库管员电话
                info.pageDisplay.outWareHouseCreatedate = info.outWareHouseCreatedate ? info.outWareHouseCreatedate : '-'; //单据日期
                info.pageDisplay.purchasePersonName = info.purchasePersonName ? info.purchasePersonName : '-'; //采购员姓名
                info.pageDisplay.purchasePersonPhone = info.purchasePersonPhone ? info.purchasePersonPhone : '-'; //采购员电话
                info.pageDisplay.purchaseCode = info.purchaseCode ? info.purchaseCode : '-'; //原始单据号
                info.pageDisplay.purchaseOrg = info.purchaseOrg ? info.purchaseOrg : '-'; //采购部门
                info.pageDisplay.outWareHouseDelimanDate = info.outWareHouseDelimanDate ? info.outWareHouseDelimanDate : '-'; //收货时间
                info.pageDisplay.remark = info.remark ? info.remark : '-'; //备注
                this.info = info;
              })


            console.log("info",this.info)
            console.log("row",row)
            this.showDialog = true;
          },

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
  }

</style>
