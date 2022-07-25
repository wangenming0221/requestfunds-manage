<template>
    <div class="eidt_class">
      <!--    采购制单员   -->
      <el-dialog :title="title" :close-on-click-modal="false" :visible="showDialog" width="94%" class="company-dialog" @close="closeDialg()">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="采购单详情" name="first">
            <!--  审批情况      -->
            <approval_status :info="info"></approval_status>
            <!--  基本信息      -->
            <basie_info :info="info"></basie_info>
            <!--  采购订单信息      -->
            <material_information :warehouse="warehouse" :conProvideOptions="conProvideOptions" ref="material_information" :info="info" :editable="!editable"></material_information>
            <!--    材料信息    -->
            <material_modal :templetJson="templetJson" :templetData="info" @allRowIsFull="allRowIsFullHandle" :show="statesFlag"></material_modal>
            <!--   申购附件     -->
            <purchase_attachment :info="info" :edit="edit"></purchase_attachment>
          </el-tab-pane>
          <el-tab-pane label="关联入库单" name="second" v-if="edit">
            <stockInPage :tableData="tableData" :loading="loading"></stockInPage>
          </el-tab-pane>
        </el-tabs>
        <span slot="footer" class="dialog-footer" v-if="btnShow">
          <el-button @click="closeDialg()">取 消</el-button>
          <el-button type="primary" @click="submitHandle()" :loading="subBtnload">确 定</el-button>
        </span>
      </el-dialog>

    </div>
</template>

<script>
    import { getMaterialById, updateMaterialById, getAtInOrder } from '@/api/material/order'
    import { getPurchaseDetailById } from '@/api/material/purchaseRequisitionList'

    import dataList from './component/dataList.json'

    import approval_status from "../purchaseRequisitionList/component/approval_status";
    import basie_info from "../purchaseRequisitionList/component/basie_info";
    import material_information from "../purchaseRequisitionList/component/material_information";
    import purchase_attachment from "../purchaseRequisitionList/component/purchase_attachment";
    import material_modal from "../components/material_modal";
    import stockInPage from "./component/stockInPage";
    export default {
          name: 'eidt_class',
        components:{
          approval_status,
          basie_info,
          material_information,
          purchase_attachment,
          material_modal,
          stockInPage
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
          getDataList(purchaseId){
            this.loading = true;
            getAtInOrder(purchaseId).then(response=>{
              this.tableData = response.data.records;
              this.loading = false;
              console.log("this.tableData",this.tableData.records)
            }).catch(()=>{
              this.loading = false;
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

            let bpmInfo = {};
            let wareInfo = {};
            // 制单查询
            await getMaterialById(row.purchaseId).then(response=>{
                wareInfo = response.data;
                wareInfo.supplyCompanyIdCopy = Number(wareInfo.supplyCompanyId);
            })
            // bpm信息
            await getPurchaseDetailById(row.applyId).then(response=>{
                bpmInfo = response.data;
            })
            this.info = {...wareInfo, ...bpmInfo};
            if(this.edit ==='update'){
              this.statesFlag = true //物料信息不让修改，特意这么写的，false可以修改
            }else if(this.edit ==='edit'){
              this.statesFlag = true
            }
            this.showDialog = true;
          },
          //确认修改
          async submitHandle(){
            try {
              await this.$refs['material_information'].$refs['info'].validate()
            } catch (e) {
              return
            }

            if(!this.flag) return this.$notify.error({ title: '错误', message: '材料信息有必填项未填写' })
            this.subBtnload = true;
            for(let i=0;i<this.info.childs.length;i++){
              delete this.info.childs[i].purchaseInfoId
            }
            updateMaterialById(this.info).then(response=>{
              this.$emit("onQuery")
              this.closeDialg();
              this.$notify({title: '操作成功', message: '修改成功'});
              setTimeout(()=>{
                this.subBtnload = false;
              },0.5)
            }).catch(()=>{
              this.subBtnload = false;
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
