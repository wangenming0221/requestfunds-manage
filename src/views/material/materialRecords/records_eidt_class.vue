<template>
    <div class="eidt_class1">
      <!--    采购制单员   -->
      <el-dialog :title="title" :close-on-click-modal="false" class="eidt_class" :visible="showDialog" append-to-body width="94%"  @close="closeDialg()">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="材料验收" name="first">
            <!--  电子签      -->
            <electronic_signature :info="info"></electronic_signature>
            <!--  采购信息      -->
            <purchasing_information :info="info"></purchasing_information>
            <!--  验收信息      -->
            <purchase_order_information :info="info"></purchase_order_information>
            <!--  验收照片      -->
            <acceptance_information ref="acceptance_information" :info="info"></acceptance_information>
            <!--    材料信息    -->
            <material_modal :templetJson="templetJson" :templetData="info" @allRowIsFull="allRowIsFullHandle" :show="true"></material_modal>
          </el-tab-pane>
        </el-tabs>
        <span slot="footer" class="dialog-footer" v-if="btnShow">
          <el-button @click="closeDialg()">取 消</el-button>
          <el-button type="primary" @click="submitHandle()">确 定</el-button>
        </span>
      </el-dialog>

    </div>
</template>

<script>
    import { getMaterialAndEnclosure, getMaterialNoById, getXYY } from '@/api/material/materialRecords'

    import dataList from './component/dataList.json'

    import electronic_signature from "./component/electronic_signature";
    import purchasing_information from "./component/purchasing_information";
    import purchase_order_information from './component/purchase_order_information'
    import acceptance_information from "../orderStoreKeeper/component/acceptance_information";
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
            if(this.activeName==='first' && this.edit === 'update'){
              return true
            }
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
            // let index = this.editableTabsValue * 1
            console.log("val",val)
            // this.editableTabs[index].dataVerify = val
            this.flag = val;
          },
          handleClick(tab, event) {
            console.log("this.activeName", )
            if(this.activeName === 'second'){
              this.getDataList(this.info.purchaseId);
            }
          },
          // 查看信息
          async eidtUpdateHandle(row,edit){
            this.edit = edit;
            console.log("12323423",this.edit)
            console.log("row",row)
            let materialNoById = {};
            let materialAndEnclosure = {};
            let xyy = {};
            if(row.docId){
              await getXYY(row.docId).then(response=>{
                xyy = response.data;
                console.log("xyy",xyy)
              })
            }

            // 查询 材料验收记录 单条信息 物料信息和附件
            await getMaterialAndEnclosure(row.inWareHouseId).then(response=>{
                materialAndEnclosure = response.data;
                console.log("materialAndEnclosure",materialAndEnclosure)
            })
            // 查询 采购制单信息
            await getMaterialNoById(row.purchaseId).then(response=>{
                materialNoById = response.data;
                console.log("materialNoById",materialNoById)
            })
            // this.info = {...materialNoById, ...materialAndEnclosure};
            this.info = {
              purchaseCode: materialNoById.purchaseCode,
              supplyCompanyName: materialNoById.supplyCompanyName,
              supplyCompanyUserName: materialNoById.supplyCompanyUserName,
              supplyCompanyUserPhone: materialNoById.supplyCompanyUserPhone,
              purchasePersonName: materialNoById.purchasePersonName,
              purchasePersonPhone: materialNoById.purchasePersonPhone,
              arrivalDate: materialNoById.arrivalDate,
              orderDate: materialNoById.orderDate,
              constructionArea: materialNoById.constructionArea,
              purchaseWareHouseName: materialNoById.purchaseWareHouseName,
              shopPersonName: materialNoById.shopPersonName,
              shopPersonPhone: materialNoById.shopPersonPhone,
              remark: materialNoById.remark,
              childs: materialAndEnclosure.childs,
              inWareHouseBuyerName: materialAndEnclosure.inWareHouseBuyerName,
              inWareHouseBuyerPhone: materialAndEnclosure.inWareHouseBuyerPhone,
              inWareHouseDelimanName: materialAndEnclosure.inWareHouseDelimanName,
              inWareHouseDelimanPhone: materialAndEnclosure.inWareHouseDelimanPhone,
              inWareHouseReceiverName: materialAndEnclosure.inWareHouseReceiverName,
              inWareHouseReceiverPhone: materialAndEnclosure.inWareHouseReceiverPhone,
              inWareHouseDelimanCarCode: materialAndEnclosure.inWareHouseDelimanCarCode,
              inWareHouseDelimanCode: materialAndEnclosure.inWareHouseDelimanCode,
              remarks: materialAndEnclosure.remarks,
              liveChilds: materialAndEnclosure.liveChilds,
              orderChilds: materialAndEnclosure.orderChilds,
              otherChilds: materialAndEnclosure.otherChilds,
              xyy:xyy,//电子签进度
              fileId:row.fileId //电子签文件id
            }
            console.log("info",this.info)
            this.showDialog = true;
          },
          //确认修改
          submitHandle(){
            if(!this.flag) return this.$notify.error({ title: '错误', message: '材料信息有必填项未填写' })

            for(let i=0;i<this.info.childs.length;i++){
              delete this.info.childs[i].purchaseInfoId
            }
            updateMaterialById(this.info).then(response=>{
              this.closeDialg();
              this.$notify({title: '操作成功', message: '修改成功'});
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
