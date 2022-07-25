<template>
    <div class="eidt_class">
      <!--  请请购单列表  -->
      <el-dialog :title="title" :close-on-click-modal="false" :visible="showDialog" width="94%" class="company-dialog" @close="showDialog=false">
        <!--  请购单信息      -->
        <basie_info :info="info" ></basie_info>
        <!--    材料信息    -->
        <material_modal ref="material_modal" :templetJson="templetJson" :templetData="info" @allRowIsFull="allRowIsFullHandle" :show="true" @celcPrice="celcPriceHandle"></material_modal>
        <!--   申购附件     -->
        <purchase_attachment :info="info"></purchase_attachment>
<!--        <span slot="footer" class="dialog-footer">-->
<!--          <el-button @click="closeDialg()">取 消</el-button>-->
<!--          <el-button type="primary" @click="submitHandle()" :loading="loading">确 定</el-button>-->
<!--        </span>-->
      </el-dialog>


    </div>
</template>

<script>
    import { getNewPurchaseDetailById, addMaterialPurchase } from '@/api/materialNew/purchaseRequisitionList'
    import { allConProvide, allWarehouse } from '@/api/material/dictionary';

    import basie_info from "./component/basie_info";
    import purchase_attachment from "./component/purchase_attachment";
    import porderecInfoList from './component/porderecInfoList.json'; //费用类，固定资产类材料列表
    import porderInfoList from './component/porderInfoList.json'; //成本类材料列表
    import material_modal from "../components/material_modal";
    export default {
        name: 'eidt_class',
        components:{
          basie_info,
          purchase_attachment,
          material_modal
        },
        data() {
            return {
              showDialog: false,
              quoteList:[],
              quoteInfo:{
                ioioTaxRate:{}
              },
              showEndButton:true,
              showEachDialog: true,
              templetJson:[],
              flag:false,
              info:{},
              conProvideOptions:[],
              warehouse:[],
              loading:false,
            }
        },

        props: {
        },

        //监听属性 类似于data概念",
        computed: {
          title() {
            return '查看详情'
          }
        },

        //监控data中的数据变化",
        watch: {},

        methods: {
          //确定制单
          async submitHandle(){
            // console.log("909090909")
            // try {
            //   //所有输入的必填项
            //   await this.$refs['material_information'].$refs['info'].validate()
            // } catch (e) {
            //   return
            // }
            // if(!this.flag) return this.$notify.error({ title: '错误', message: '材料信息必填项未填写' })
            // // 判断实收数量
            // for(let i=0;i<this.info.childs.length;i++){
            //   let scope = [];
            //   scope.row = this.info.childs[i];
            //   if(!this.$refs['material_modal'].inputBlur('totalQuotaSum',scope)) return
            // }
            // this.loading = true;
            // this.info.applyCode = this.info.sequenceNo  //申购单编号
            // this.info.applyDate = this.info.createdTime  //申购时间
            // this.info.applyId = this.info.id  //申购主键
            // this.info.applyType = this.info.purchaseType  //申购类型
            // this.info.shopPersonName = this.info.creater  //申请人名称
            // this.info.shopPersonPhone = this.info.mobileNumber  //申请人电话
            // this.info.purchaseArchName = this.info.projectName //项目名称
            // this.info.shopOrg = this.info.purchaseTeam  //申购队伍名称
            // this.info.arrivalDate = this.info.requiredArrivalTime  //到货时间
            // this.info.constructionArea = this.info.constructionGardenArea  //施工苑区
            // this.info.constructionType = this.info.constructionType  //施工类型
            // this.info.isPartya = this.info.materialsProvided  //是否甲方提供材料
            // this.info.fileChilds = this.info.ossFilePathList  //附件
            // this.info.purchaseArchCode = this.info.projectCode  //项目编码
            // this.info.purchaseOrg = '沈阳腾越建筑有限公司';
            //
            // addMaterialPurchase(this.info).then(async response=>{
            //   await this.closeDialg();
            //   await this.$emit('onQuery')
            //   await this.$notify({title: '操作成功', message: '制单成功'});
            //   setTimeout(()=>{
            //     this.loading = false;
            //   },0.5)
            //
            // }).catch(response => {
            //   this.loading = false;
            // })
          },
          closeDialg(){
            this.$set();
            this.showDialog = false;
          },
          //获取供应商
          getConProvide(){
            allConProvide().then(response=>{
              this.conProvideOptions = response.data;
            })
          },
          //获取仓库
          getAllWarehouse(){
            allWarehouse().then(response=>{
              this.warehouse = response.data;
            })
          },
          // 是否填充完毕
          allRowIsFullHandle (val) {
            // let index = this.editableTabsValue * 1
            // this.editableTabs[index].dataVerify = val
            this.flag = val;
          },
          celcPriceHandle(){

          },
          //查询制单信息
          eidtUpdateHandle(edit,row){
            let param = {
              id:row.id,
              requisitiontype:row.requisitiontype
            }
            getNewPurchaseDetailById(param).then(response=>{
              let info = response.data;
              // 页面显示的是另一个对象,防止存的时候改变数据库
              info.pageDisplay = {};
              info.pageDisplay.ncCode = info.ncCode ? info.ncCode : '-'; //请购单号
              info.pageDisplay.inventoryorg = info.inventoryorg ? info.inventoryorg : '-'; //库存组织
              info.pageDisplay.demandwarehouse = info.demandwarehouse ? info.demandwarehouse : '-'; //需求仓库
              info.pageDisplay.requisitiontype = info.requisitiontype ? info.requisitiontype : '-'; //请购类型
              info.pageDisplay.procurementorg = info.procurementorg ? info.procurementorg : '-'; //采购组织
              info.pageDisplay.expensetype = info.expensetype ? info.expensetype : '-'; //费用类型
              info.pageDisplay.warehouseprincipal = info.warehouseprincipal ? info.warehouseprincipal : '-'; //仓库负责人
              info.pageDisplay.depthead = info.depthead ? info.depthead : '-'; //部门负责人
              info.pageDisplay.sequenceno = info.sequenceno ? info.sequenceno : '-'; //申购单号
              info.pageDisplay.useassets = info.useassets ? info.useassets : '-'; //资产用途
              info.pageDisplay.remarks = info.remarks ? info.remarks : '-'; //备注


              if(info.requisitiontype==='成本类请购'){
                info.childs = info.totalBpmPorderInfoList;
                this.templetJson = porderInfoList;
              }else{
                // 费用类，固定资产类材料列表
                info.childs = info.totalBpmPorderecInfoList;
                this.templetJson = porderecInfoList;
              }
              this.info = info;

              this.showDialog = true;
              console.log("this.info",this.info)
            })
          }
        },

        //生命周期 - 创建完成（可以访问当前this实例）",数据模型已加载，方法已加载,html模板已加载,html模板未渲染
        created() {
          this.getConProvide();
          this.getAllWarehouse();
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
