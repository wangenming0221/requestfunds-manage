<template>
    <div>
      <!--    采购订单 材料入库   -->
      <el-dialog :title="title" :close-on-click-modal="false" :visible="showDialog" width="94%" append-to-body class="company-dialog eidt_class" @close="showDialog=false">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="材料验收" name="first">
            <!--  采购信息   -->
            <basie_info :info="info"></basie_info>
            <!--  材料信息  -->
            <material_modal ref="material_modal" :templetJson="templetJson" :templetData="info" @allRowIsFull="allRowIsFullHandle" >
              <div style="margin-bottom: 25px;">
                <el-select v-model="levelValue" size="mini" placeholder="请选择" class="select">
                  <el-option
                    v-for="item in levelOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-button size="mini" @click="setAll">批量设置</el-button>
              </div>
            </material_modal>
            <!--  验收信息  -->
            <material_information ref="material_information" :info="info" :editable="!showEndButton"></material_information>
            <!--  验收照片   -->
            <acceptance_information ref="acceptance_information" :info="info" :showButton="!showEndButton"></acceptance_information>
            <!--   申购附件     -->
            <purchase_attachment :info="info" :edit="edit"></purchase_attachment>
          </el-tab-pane>
<!--          <el-tab-pane label="关联采购单" name="second">-->
<!--          </el-tab-pane>-->
        </el-tabs>
        <span slot="footer" class="dialog-footer" v-if="activeName === 'first'">
          <el-checkbox v-model="checked2" disabled class="inOutCheck">即入即出</el-checkbox>
          <el-button @click="closeDialg()">取 消</el-button>
          <el-button type="primary" @click="submitHandle()" :loading="btnLoading">提 交</el-button>
        </span>
      </el-dialog>

    </div>
</template>

<script>
  import { getNewMaterialById, addNewMaterialInwareHouse, getStockInPage } from '@/api/materialNew/order'
  import { addNewInwareHouse, updateFromDataNC } from '@/api/materialNew/stockInOut'

  import dataList from './component/dataList.json'
  import updateFromNCList from '../stockInOut/component/updateFromNCList.json'
  import basie_info from "./component/basie_info";
  import material_information from "./component/material_information";
  import purchase_order_information from "./component/purchase_order_information";
  import acceptance_information from "./component/acceptance_information";
  import material_modal from "../components/material_modal"
  import purchase_attachment from "../components/purchase_attachment";
  import { getMaterialAndEnclosure } from '@/api/material/materialRecords'
    export default {
        name: 'eidt_class',
        components:{
          basie_info,
          material_information,
          acceptance_information,
          purchase_order_information,
          material_modal,
          purchase_attachment
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
              templetJson: [],
              info:{},
              infoLiYue:{},
              allRowflag: false,
              checked2: true,
              btnLoading: false,
              edit:'edit',
              levelOption:[
                { value: '好', label: '好' },
                { value: '中', label: '中' },
                { value: '差', label: '差' },
              ],
              levelValue:'',
              wareHousingStatus: 0, // 0第一次入库,1撤销重新发起入库
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
          setAll(){
            this.info.childs.map(item=>{
              item.mass = this.levelValue;
            })
          },
          editable(){
            if(this.edit ==='update'){
              return true
            }else if(this.edit==='edit'){
              return false
            }
          },
          allRowIsFullHandle(val){
            this.allRowflag = val;
          },
          handleClick(tab, event) {
            console.log(tab, event);
          },
          //再次签署查看
          async updateFromNCInfo(row){
            this.wareHousingStatus = 1;
            await getMaterialAndEnclosure(row.inWareHouseId).then(response=>{
              let info = response.data;
              this.templetJson = updateFromNCList;
              // 页面显示的是另一个对象,防止存的时候改变数据库
              info.pageDisplay = {};
              info.pageDisplay.supplyCompany = info.supplyCompany ? info.supplyCompany : '-'; //采购供应商
              info.pageDisplay.supplyCompanyUserPhone = info.supplyCompanyUserPhone ? info.supplyCompanyUserPhone : '-'; //供应商联系人电话
              info.pageDisplay.purchasePersonName = info.purchasePersonName ? info.purchasePersonName : '-'; //采购员姓名
              info.pageDisplay.purchasePersonPhone = info.purchasePersonPhone ? info.purchasePersonPhone : '-'; //采购员电话
              info.pageDisplay.arrivalDate = info.arrivalDate ? info.arrivalDate : '-'; //要求到货日期
              info.pageDisplay.orderDate = info.orderDate ? info.orderDate : '-'; //采购订单日期
              info.pageDisplay.purchaseArchName = info.purchaseArchName ? info.purchaseArchName : '-'; //项目档案
              info.pageDisplay.address = info.address ? info.address : '-'; //送货地址
              info.pageDisplay.shopPersonName = info.shopPersonName ? info.shopPersonName : '-'; //申购人姓名
              info.pageDisplay.shopPersonPhone = info.shopPersonPhone ? info.shopPersonPhone : '-'; //申购人电话
              info.pageDisplay.shopOrg = info.shopOrg ? info.shopOrg : '-'; //申购部门
              info.pageDisplay.remark = info.remark ? info.remark : '-'; //备注
              info.ossFilePathList = info.quotaChilds; //附件
              info.arr = info.notes.splice(4); //arr是材料验收中新增的签署人
              info.notes.map(item=>{
                for(let key in item){
                  if(key == 'type' && item[key]=='送货人'){
                    info.delimanName = item['name'];
                    info.delimanPhone = item['phone'];
                  }else if(key == 'type' && item[key]=='领用人'){
                    info.receiverName = item['name'];
                    info.receiverPhone = item['phone'];
                  }
                  else if(key == 'type' && item[key]=='评级人'){
                    info.evaluatorName = item['name'];
                    info.evaluatorPhone = item['phone'];
                  }
                  else if(key == 'type' && item[key]=='采购员'){
                    info.buyerName = item['name'];
                    info.buyerPhone = item['phone'];
                  }
                }
              })
              console.log("info.childs",info.childs)
              this.info = info;
            })
            console.log("info",this.info)
            this.showDialog = true;
          },
          eidtUpdateHandle(edit,row){
            // 查看详情和入库id查询接口
            console.log("editqweqweqweqweqweqweqwe2343453463446346",edit)
            this.wareHousingStatus = 0;
            if(edit == 'update'){
              getNewMaterialById(row.purchaseId).then(response=>{
                let info = response.data;
                this.templetJson = dataList;
                console.log("info",info)
                let childs = info.childs;
                // 页面显示的是另一个对象,防止存的时候改变数据库
                info.pageDisplay = {};
                info.pageDisplay.supplyCompany = info.supplyCompany ? info.supplyCompany : '-'; //采购供应商
                info.pageDisplay.supplyCompanyUserPhone = info.supplyCompanyUserPhone ? info.supplyCompanyUserPhone : '-'; //供应商联系人
                info.pageDisplay.purchasePersonName = info.purchasePersonName ? info.purchasePersonName : '-'; //采购员姓名
                info.pageDisplay.purchasePersonPhone = info.purchasePersonPhone ? info.purchasePersonPhone : '-'; //采购员电话
                info.pageDisplay.arrivalDate = info.arrivalDate ? info.arrivalDate : '-'; //要求到货日期
                info.pageDisplay.orderDate = info.orderDate ? info.orderDate : '-'; //采购订单日期
                info.pageDisplay.shopOrg = info.shopOrg ? info.shopOrg : '-'; //项目档案
                info.pageDisplay.address = info.address ? info.address : '-'; //送货地址
                info.pageDisplay.shopPersonName = info.shopPersonName ? info.shopPersonName : '-'; //申购人姓名
                info.pageDisplay.shopPersonPhone = info.shopPersonPhone ? info.shopPersonPhone : '-'; //申购人电话
                info.pageDisplay.purchaseArchName = info.purchaseArchName ? info.purchaseArchName : '-'; //申购部门
                info.pageDisplay.remark = info.remark ? info.remark : '-'; //项目档案
                for(let i=0;i<childs.length;i++){
                    childs[i].totalQuotaSum = info.childs[i].totalSum;//材料主键
                }
                info.arr = [];
                info.childs.map(item=>{
                  item.mass = '';
                })
                // info.path
                // info.notes
                // info.notes
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
              if(!this.$refs['material_modal'].inputBlur('totalQuotaInSum',scope)) return
            }

            let info = this.info;

            info.notes = [
              { type:'送货人', name:info.delimanName, phone:info.delimanPhone },
              { type:'领用人', name:info.receiverName, phone:info.receiverPhone },
              { type:'评级人', name:info.evaluatorName, phone:info.evaluatorPhone },
              { type:'采购员', name:info.buyerName, phone:info.buyerPhone },
            ]
            info.notes = [...info.notes,...info.arr]
            console.log("info",info)
            this.btnLoading = true;

            if(this.wareHousingStatus==1){
              info.liveChilds = info.liveChilds.map((item,index) =>{
                return Object.assign({},{'path':item.path})
              })
              info.orderChilds = info.orderChilds.map((item,index) =>{
                return Object.assign({},{'path':item.path})
              })
              info.otherChilds = info.otherChilds.map((item,index) =>{
                return Object.assign({},{'path':item.path})
              })
              this.info = info;
              updateFromDataNC(info).then(response=>{
                this.$emit('onQuery');
                this.closeDialg();
                this.btnLoading =   false;
                this.$notify({title: '操作成功', message: '入库成功'});
              }).catch(e=>{
                this.btnLoading = false;
              })
            }else{
              for(let i=0;i<info.childs.length;i++){
                info.childs[i].purchaseInfoId = info.childs[i].id;
                info.childs[i].price = info.childs[i].taxratePrice;
                info.childs[i].remark = info.childs[i].remarks;
                info.childs[i].totalQuotaRemainSum = info.childs[i].totalFutureSum;
              }
              info.remark = info.remarks;
              addNewInwareHouse(info).then(response=>{
                this.$emit('onQuery');
                this.closeDialg();
                this.btnLoading = false;
                this.$notify({title: '操作成功', message: '入库成功'});
              }).catch(e=>{
                this.btnLoading = false;
              })
            }
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
        //height: 30px;
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
