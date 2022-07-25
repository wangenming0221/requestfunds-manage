<template>
    <div class="eidt_class">
      <!--  采购制单-系统  -->
      <el-dialog :title="title" :close-on-click-modal="false" :visible="showDialog" width="94%" class="company-dialog" @close="showDialog=false">
        <!--  审批情况      -->
        <approval_status :info="info"></approval_status>
        <!--  基本信息      -->
        <basie_info :info="info" ></basie_info>
        <!--  采购订单信息      -->
        <material_information ref="material_information" :info="info" :conProvideOptions="conProvideOptions" :warehouse="warehouse" :editable="!showEndButton"></material_information>
        <!--    材料信息    -->
        <material_modal ref="material_modal" :templetJson="templetJson" :templetData="info" @allRowIsFull="allRowIsFullHandle" :show="false" @celcPrice="celcPriceHandle"></material_modal>
        <!--   申购附件     -->
        <purchase_attachment :info="info"></purchase_attachment>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeDialg()">取 消</el-button>
          <el-button type="primary" @click="submitHandle()" :loading="loading">确 定</el-button>
        </span>
      </el-dialog>


    </div>
</template>

<script>
    import { getPurchaseDetailById, addMaterialPurchase } from '@/api/material/purchaseRequisitionList'
    import { allConProvide, allWarehouse } from '@/api/material/dictionary';

    import approval_status from "./component/approval_status";
    import basie_info from "./component/basie_info";
    import material_information from "./component/material_information";
    import purchase_attachment from "./component/purchase_attachment";
    import dataList from './component/dataList.json'
    import material_modal from "../components/material_modal";
    export default {
        name: 'eidt_class',
        components:{
          approval_status,
          basie_info,
          material_information,
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
              templetJson:dataList,
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
            return '制单信息'
          }
        },

        //监控data中的数据变化",
        watch: {},

        methods: {
          //确定制单
          async submitHandle(){
            console.log("909090909")
            try {
              //所有输入的必填项
              await this.$refs['material_information'].$refs['info'].validate()
            } catch (e) {
              return
            }
            if(!this.flag) return this.$notify.error({ title: '错误', message: '材料信息必填项未填写' })
            // 判断实收数量
            for(let i=0;i<this.info.childs.length;i++){
              let scope = [];
              scope.row = this.info.childs[i];
              if(!this.$refs['material_modal'].inputBlur('totalQuotaSum',scope)) return
            }
            this.loading = true;
            this.info.applyCode = this.info.sequenceNo  //申购单编号
            this.info.applyDate = this.info.createdTime  //申购时间
            this.info.applyId = this.info.id  //申购主键
            this.info.applyType = this.info.purchaseType  //申购类型
            this.info.shopPersonName = this.info.creater  //申请人名称
            this.info.shopPersonPhone = this.info.mobileNumber  //申请人电话
            this.info.purchaseArchName = this.info.projectName //项目名称
            this.info.shopOrg = this.info.purchaseTeam  //申购队伍名称
            this.info.arrivalDate = this.info.requiredArrivalTime  //到货时间
            this.info.constructionArea = this.info.constructionGardenArea  //施工苑区
            this.info.constructionType = this.info.constructionType  //施工类型
            this.info.isPartya = this.info.materialsProvided  //是否甲方提供材料
            this.info.fileChilds = this.info.ossFilePathList  //附件
            this.info.purchaseArchCode = this.info.projectCode  //项目编码
            this.info.purchaseOrg = '沈阳腾越建筑有限公司';

            addMaterialPurchase(this.info).then(async response=>{
              await this.closeDialg();
              await this.$emit('onQuery')
              await this.$notify({title: '操作成功', message: '制单成功'});
              setTimeout(()=>{
                this.loading = false;
              },0.5)

            }).catch(response => {
              this.loading = false;
            })
          },
          closeDialg(){
            this.showDialog = false;
          },
          //获取供应商
          getConProvide(){
            allConProvide().then(response=>{
              console.log("response",response)
              this.conProvideOptions = response.data
              console.log("this.conProvideOptions",this.conProvideOptions)
            })
          },
          //获取仓库
          getAllWarehouse(){
            allWarehouse().then(response=>{
              console.log("response",response)
              this.warehouse = response.data
            })
          },
          // 是否填充完毕
          allRowIsFullHandle (val) {
            // let index = this.editableTabsValue * 1
            // this.editableTabs[index].dataVerify = val
            this.flag = val;
            console.log(val)
          },
          celcPriceHandle(){

          },
          //查询制单信息
          eidtUpdateHandle(edit,row){
            getPurchaseDetailById(row.id).then(response=>{
              this.info = response.data;
              // 整理物料字段
              let totalMaterialInformationInfoList = response.data.totalMaterialInformationInfoList;
              for(let i=0;i<totalMaterialInformationInfoList.length;i++){
                totalMaterialInformationInfoList[i].totalQuotaSign = totalMaterialInformationInfoList[i].totalPurchaseQuantity;//申购量
                totalMaterialInformationInfoList[i].totalPurchaseQuantityCopy = totalMaterialInformationInfoList[i].quantityAvailable;//制单余量
                totalMaterialInformationInfoList[i].parentInfoId = totalMaterialInformationInfoList[i].id;
                totalMaterialInformationInfoList[i].createDate = response.data.createdTime;
                totalMaterialInformationInfoList[i].createUsername = response.data.creater;
              }
              // 整理oss字段
              let ossFilePathList = response.data.ossFilePathList;

              for(let i=0;i<ossFilePathList.length;i++){
                delete ossFilePathList[i].enclosureId
                ossFilePathList[i].createDate = response.data.createdTime;
                ossFilePathList[i].createUsername = response.data.creater;
              }
              console.log("ossFilePathList",ossFilePathList)

              this.info.childs = totalMaterialInformationInfoList;
              this.info.fileChilds = ossFilePathList;

              this.info.supplyCompanyUserName = '';
              this.info.supplyCompanyUserPhone = '';
              this.info.collectionName = '';
              this.info.cardNumber = '';

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
