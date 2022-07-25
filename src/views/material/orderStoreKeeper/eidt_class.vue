<template>
    <div class="eidt_class">
      <!--    采购订单-仓管员   -->
      <el-dialog :title="title" :close-on-click-modal="false" :visible="showDialog" width="94%" class="company-dialog" @close="showDialog=false">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="材料验收" name="first">
            <!--  采购信息   -->
            <basie_info :info="info"></basie_info>
            <!--  验收信息  -->
            <material_information ref="material_information" :info="info" :editable="!showEndButton"></material_information>
            <!--  验收照片   -->
            <acceptance_information ref="acceptance_information" :info="info" :showButton="!showEndButton"></acceptance_information>
            <!--  材料信息  -->
            <material_modal ref="material_modal" :templetJson="templetJson" :templetData="info" @allRowIsFull="allRowIsFullHandle"></material_modal>
          </el-tab-pane>
<!--          <el-tab-pane label="关联采购单" name="second">-->
<!--          </el-tab-pane>-->
        </el-tabs>
        <span slot="footer" class="dialog-footer" v-if="activeName === 'first'">
          <el-checkbox v-model="checked2" disabled class="inOutCheck">即入即出</el-checkbox>
          <el-button @click="closeDialg()">取 消</el-button>
          <el-button type="primary" @click="submitHandle()" :loading="btnLoading">确 定</el-button>
        </span>
      </el-dialog>

    </div>
</template>

<script>
  import { getMaterialById, updateMaterialById, getStockInPage } from '@/api/material/order'
  import { addInwareHouse, getInStockById } from '@/api/material/stockInOut'

    import dataList from './component/dataList.json'
    import basie_info from "./component/basie_info";
    import material_information from "./component/material_information";
    import purchase_order_information from "./component/purchase_order_information";
    import acceptance_information from "./component/acceptance_information";
    import material_modal from "../components/material_modal";
    export default {
        name: 'eidt_class',
        components:{
          basie_info,
          material_information,
          acceptance_information,
          purchase_order_information,
          material_modal
        },
        data() {
            return {
              showDialog: false,
              quoteList:[],
              quoteInfo:{
                ioioTaxRate:{}
              },
              showEndButton:false,
              activeName: 'first',
              templetJson: dataList,
              info:{
                childs:[
                  { materialTypeName:'123', materialType:'1', totalQuotaSum: 10 },
                  { materialTypeName:'234', materialType:'2', totalQuotaSum: 7 },
                ]
              },
              infoLiYue:{},
              allRowflag: false,
              checked2: true,
              btnLoading: false
            }
        },

        props: {},

        //监听属性 类似于data概念",
        computed: {
          title() {
            // return this.info.materialclassId ? '编辑物料类别' : '新增物料类别'
          }
        },

        //监控data中的数据变化",
        watch: {},

        methods: {
          allRowIsFullHandle(val){
            this.allRowflag = val;
          },
          handleClick(tab, event) {
            console.log(tab, event);
          },
          eidtUpdateHandle(edit,row){
            console.log("edit",edit)
            // 查看详情和入库id查询接口
            if(edit == '入库'){
              getMaterialById(row.purchaseId).then(response=>{
                let info = response.data;

                let childs = info.childs;

                for(let i=0;i<childs.length;i++){
                    childs[i].materialId = info.childs[i].materialId;//材料主键
                    childs[i].materialCode = info.childs[i].materialCode;//材料编号
                    childs[i].materialName = info.childs[i].materialName;//材料名称
                    childs[i].materialTypeName = info.childs[i].materialTypeName;//材料分类
                    childs[i].type = info.childs[i].specification;//规格型号
                    childs[i].unit = info.childs[i].unit;//单位
                    childs[i].unitPrice = info.childs[i].taxratePrice;//单价
                    childs[i].tax = info.childs[i].taxrate;//税率
                    childs[i].totalQuotaSum = info.childs[i].totalQuotaSum;//采购数量
                    childs[i].totalQuotaInSum = info.childs[i].totalQuotaInSum;//入库数量/实收数量
                    childs[i].remark = info.childs[i].free;//备注
                }
                info.childs = childs;
                this.info = info;
                console.log("查看详情.info",this.info)
                this.showDialog = true;
              })
            }


          },
          closeDialg(){
            this.showDialog = false;
          },
          async submitHandle(){
            try {
              //所有输入的必填项
              await this.$refs['material_information'].$refs['info'].validate()
              await this.$refs['acceptance_information'].$refs['info'].validate()
            } catch (e) {
              return
            }
            if(!this.allRowflag)return this.$notify.error({ title: '错误', message: '材料信息有必填项未填写' })
            // 判断实收数量
            for(let i=0;i<this.info.childs.length;i++){
              let scope = [];
              scope.row = this.info.childs[i];
              if(!this.$refs['material_modal'].inputBlur('totalQuotaInSumCopy',scope)) return
            }
            let info = this.info;
            for(let i=0;i<info.childs.length;i++){
              // 可入库数量
              info.childs[i].totalQuotaSum = info.childs[i].totalQuotaInSum;
              // 实收数量
              info.childs[i].totalQuotaInSum = info.childs[i].totalQuotaInSumCopy;
              // 单价
              info.childs[i].price = info.childs[i].taxratePrice;
              // 含税单价
              info.childs[i].unitPrice = info.childs[i].cashTaxratePrice;
            }
            console.log("info",info)
            this.btnLoading = true;
            addInwareHouse(info).then(response=>{
              this.$emit('onQuery');
              this.closeDialg();
              this.btnLoading = false;
              this.$notify({title: '操作成功', message: '入库成功'});
            }).catch(e=>{
              this.btnLoading = false;
            })
          },
          // //验证不同组件的表单
          // getFormPromise(form) {
          //   return new Promise(resolve => {
          //     //传入callback函数
          //     form.validate(res => {
          //       resolve(res);
          //     });
          //   });
          // }
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
    .acceptance_information{
      /deep/.el-upload--picture-card{
        margin-left: 20px;
      }
      /deep/.el-form-item--mini .el-form-item__error{
        margin-left: 20px;
        padding-top: 5px;
      }
    }
    .inOutCheck{
      margin-right: 20px;
    }
  }

</style>
