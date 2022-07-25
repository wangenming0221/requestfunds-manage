<template>
  <div class="eidt_class">
    <!--    采购订单详情   -->
    <el-dialog :title="title" :close-on-click-modal="false" :visible="showDialog" width="94%" class="company-dialog" @close="closeDialg()">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="采购单详情" name="first">
          <!--  采购订单    -->
          <material_information :warehouse="warehouse" :conProvideOptions="conProvideOptions" ref="material_information" :info="info" :editable="!editable"></material_information>
          <!--    材料信息    -->
          <material_modal :templetJson="templetJson" :templetData="info" @allRowIsFull="allRowIsFullHandle" :show="statesFlag"></material_modal>
          <!--   申购附件     -->
          <purchase_attachment :info="info" :edit="edit"></purchase_attachment>
        </el-tab-pane>
        <el-tab-pane label="关联入库单" name="second" v-if="edit">
          <stockInList ref="stockInList" :tableData="tableData" :loading="loading" :flag="false"></stockInList>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

  </div>
</template>

<script>
  import { getAtInOrder } from '@/api/material/order'
  // import { getPurchaseDetailById } from '@/api/material/purchaseRequisitionList'
  import { getNewMaterialById, addNewMaterialInwareHouse, getStockInPage } from '@/api/materialNew/order'
  import editData from './component/editData.json'

  import approval_status from "./purchaseRequisitionList/approval_status";
  import basie_info from "./purchaseRequisitionList/basie_info";
  import material_information from "./purchaseRequisitionList/material_information";
  import purchase_attachment from "./purchaseRequisitionList/purchase_attachment";
  import material_modal from "../components/material_modal";
  import stockInList from "../stockInOut/component/stockInList";
  export default {
    name: 'purchase_order_detail',
    components:{
      approval_status,
      basie_info,
      material_information,
      purchase_attachment,
      material_modal,
      stockInList
    },
    data() {
      return {
        showDialog: false,
        showEndButton:false,
        activeName: 'first',
        tableData:[],//关联采购单
        info:{},
        templetJson:editData,
        flag: false,
        edit:'',
        loading:true,
        statesFlag: false,
        subBtnload: false
      }
    },

    props: {
      conProvideOptions:{ type: Array, default () { return [] } },
      warehouse:{ type: Array, default () { return [] } },
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
        if(this.activeName==='first' && this.edit === 'update'){
          return true
        }
      },
    },

    //监控data中的数据变化",
    watch: {},

    methods: {
      closeDialg(){
        this.activeName = "first";
        this.showDialog = false;
      },
      getDataList(purchaseCode){
        this.$refs.stockInList.associatedPurchaseOrder(purchaseCode);
      },
      // 是否填充完毕
      allRowIsFullHandle (val) {
        // let index = this.editableTabsValue * 1
        console.log("val",val)
        // this.editableTabs[index].dataVerify = val
        this.flag = val;
      },
      handleClick(tab, event) {
        console.log("this.activeName", )
        if(this.activeName === 'second'){
          this.getDataList(this.info.purchaseCode);
        }
      },
      // 查看信息
      async eidtUpdateHandle(row,edit){
        this.edit = edit;
        getNewMaterialById(row.purchaseId).then(response=>{
          let info = response.data;
          info.pageDisplay = {};
          info.pageDisplay.purchaseOrg = info.purchaseOrg ? info.purchaseOrg : '-'; //采购组织
          info.pageDisplay.purchaseCode = info.purchaseCode ? info.purchaseCode : '-'; //采购单号
          info.pageDisplay.supplyCompany = info.supplyCompany ? info.supplyCompany : '-'; //供应商
          info.pageDisplay.purchasePersonName = info.purchasePersonName ? info.purchasePersonName : '-'; //采购员姓名
          info.pageDisplay.purchasePersonPhone = info.purchasePersonPhone ? info.purchasePersonPhone : '-'; //采购员电话
          info.pageDisplay.isPartya = info.isPartya ? info.isPartya : '-'; //甲供材料
          info.pageDisplay.purchaseCompany = info.purchaseCompany ? info.purchaseCompany : '-'; //请购公司
          info.pageDisplay.shopPersonName = info.shopPersonName ? info.shopPersonName : '-'; //请购员姓名
          info.pageDisplay.shopPersonPhone = info.shopPersonPhone ? info.shopPersonPhone : '-'; //请购员电话
          info.pageDisplay.shopCreateDate = info.shopCreateDate ? info.shopCreateDate : '-'; //采购单日期
          info.pageDisplay.wareHouseCharge = info.wareHouseCharge ? info.wareHouseCharge : '-'; //仓库负责人
          info.pageDisplay.wareHousePhone = info.wareHousePhone ? info.wareHousePhone : '-'; //仓库负责人/电话
          info.pageDisplay.orgName = info.orgName ? info.orgName : '-'; //部门负责人
          info.pageDisplay.purchaseType = info.purchaseType ? info.purchaseType : '-'; //采购类型
          info.pageDisplay.totalSum = info.totalSum ? info.totalSum +'' : '-'; //总数量
          info.pageDisplay.totalCount = info.totalCount ? info.totalCount : '-'; //价税合计(元)
          info.pageDisplay.purchaseArchName = info.purchaseArchName ? info.purchaseArchName : '-'; //项目
          info.pageDisplay.bankName = info.bankName ? info.bankName : '-'; //户名
          info.pageDisplay.bank = info.bank ? info.bank : '-'; //银行账户
          info.pageDisplay.supplyCompanyUserName = info.supplyCompanyUserName ? info.supplyCompanyUserName : '-'; //供应商联系人
          info.pageDisplay.bankType = info.bankType ? info.bankType : '-'; //发票类型
          info.pageDisplay.remark = info.remark ? info.remark : '-'; //备注
          this.info = info;
          console.log("查看详情.info",this.info)
          this.showDialog = true;
        })
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
