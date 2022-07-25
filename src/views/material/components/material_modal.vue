<template>
  <!-- 清单标段模板 -->
  <div class="purchase_order_information">
  <div>
    <span class="line"></span>
    <span class="head">材料信息</span>
  </div>
  <div>
    <el-table style="width: 100%" id="tb-edit" :show-summary="showSummary" :summary-method="getSummaries" @selection-change="selectionChangeHandle" v-if="dataTempletList.length > 0" :data="dataList" border class="tb-edit list-table" highlight-current-row :cell-class-name="rowClass" :header-cell-class-name="rowHeaderClass" :row-class-name="tableRowClassName" @cell-click="tabClick">
<!--      <el-table-column :selectable="checkboxDis" type="selection" header-align="center" align="center" width="50" v-if="showModal"/>-->
      <el-table-column type="index" header-align="center" align="center" width="50" label="序号" />
      <template v-for="(item, index) in dataTempletList">
        <el-table-column v-if="isPlan ? item.planVisable : item.listVisable" :key="index" :show-overflow-tooltip="true" :prop="item.columnProp" :width="item.columnWidth" :label="item.columnName">
          <template slot-scope="scope">
                        <span v-if="scope.row.index === tabClickIndex && tabClickLabel === item.columnName && item.componentType !== 'el-button' && item.modifyVisable">
                            <el-input v-if="item.componentType === 'el-input'" :ref="'_'+item.columnProp + tabClickIndex" v-model="scope.row[item.columnProp]" placeholder="请输入.." @blur="inputBlur(item.columnProp,scope)" />
                          <!-- 物料编码  -->
                          <el-input v-else-if="item.componentType === 'el-materialCode'" :ref="'_'+item.columnProp + tabClickIndex" v-model="scope.row[item.columnProp]" placeholder="请选择物料编码" @focus="checkMaterial(scope.row.index)" @blur="inputBlur(item.columnProp,scope)" readonly>
                                <i slot="suffix" class="el-input__icon el-icon-more" @click="checkMaterial(scope.row.index)" />
                          </el-input>
                          <el-input-number v-else-if="item.componentType === 'el-input-number'" :controls="false" type="number" :min="0" :precision="precision(item)" @blur="inputBlur(item.columnProp,scope)"
                                v-model.number="scope.row[item.columnProp]" placeholder="请输入.." style="width:100%" :ref="'_'+item.columnProp + tabClickIndex" />
                        </span>
                        <!-- 含税总价  -->
                        <span v-else-if="item.columnProp === 'totalPriceIncludingTax'">{{ scope.row['unitPrice'] * scope.row['totalQuotaInSum'] }}</span>
                        <span v-else>{{scope.row[item.columnProp]}}</span>
          </template>
          <template slot="header" slot-scope="scope">
            <div :class="scopeHeader(scope.$index,item.require)">{{item.columnName}}</div>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>

        <el-dialog title="选取物料1" @close="showEachDialog=false" :close-on-click-modal="false" :visible="showEachDialog" width="1366px" append-to-body>
          <prepar_each_ware @returnCheck="returnCheck" ref="prepar_each_ware"></prepar_each_ware>
        </el-dialog>

  </div>
</template>

<script>
  import prepar_each_ware from "@/views/material/purchaseRequisitionList/component/ware/prepar_each_ware"
  export default {
    name: 'material_modal',
    components: {
      prepar_each_ware
    },
    props: {
      templetJson: { type: Array, default(){ return []}, },
      templetData: { type: Object, default () { return {} } },
      dataInfo: { type: Object, default () { return {} } },
      show: { type: Boolean, default: false },
      isPlan: { type: Boolean, default: false },
      modalType: { type: String, default: '' },
    },
    data () {
      return {
        dataTempletList: [],
        dataList: [],
        info: {},
        showSummary: false,
        editSectionDialog: false,
        isfullscreen: false,
        planmaterialid: '',
        checkRowIndex: '',
        editRow: {},
        checkRow: {},
        tureChange: true,
        changeProjectNameDio: false,
        changePersonDialog: false,
        personDialogTitle: '',
        procModal: '',
        tabClickIndex: null, // 点击的单元格
        tabClickLabel: '', // 当前点击的列名
        dataListSelections: [],//多选操作
        showModal: false,
        showEachDialog:false
      }
    },
    watch: {
      templetJson: {
        immediate: true,
        handler: function (val) {
          this.showSummary = false
          if (val.some(v => v.totalEnable === true)) {
            this.showSummary = true
          }
          this.dataTempletList = val
        }
      },
      templetData: {
        immediate: true,
        deep: true,
        handler: function (val) {
          this.dataList = val.childs;
        }
      },
      modalType: {
        immediate: true,
        handler: function (val) {
          this.procModal = val
        }
      },
      show: {
        immediate: true,
        handler: function (val) {
          console.log("val4545454",val)
          this.showModal = val;
          console.log("showModal1212",this.showModal)
        }
      },
      dataList: {
        immediate: true,
        deep: true,
        handler: function (val) {
          if (this.isPlan) this.$emit('procjectValue', val)
        }
      }
    },
    methods: {
      precision(item){
        console.log("item.columnProp",item.columnProp)
        switch (item.columnProp) {
          case 'taxrate':
            return 2;
          case 'totalQuotaSum':
            return 4;
          case 'cashTaxratePrice':
            return 4;
          case 'taxratePrice':
            return 4;
          case 'totalQuotaInSum':
            return 4;
          case 'totalQuotaInSumCopy':
            return 4;
          default:
            return 0
        }
      },
      checkMaterial (index) {
        this.checkRowIndex = index
        this.showEachDialog = true
      },
      // 选择物料
      returnCheck(val) {
        console.log("val",val)
        if (val) {
          this.$set(this.dataList[this.checkRowIndex], 'materialId', val.materialId) //物料ID
          this.$set(this.dataList[this.checkRowIndex], 'materialCode', val.materialCode) //物料编码
          this.$set(this.dataList[this.checkRowIndex], 'materialName', val.materialName) //物料名称
          this.$set(this.dataList[this.checkRowIndex], 'materialType', val.materialTypeId) //物料分类ID
          this.$set(this.dataList[this.checkRowIndex], 'materialTypeName', val.materialTypeName) //物料分类名称
          this.$set(this.dataList[this.checkRowIndex], 'specification', val.specification) //规格型号
          this.$set(this.dataList[this.checkRowIndex], 'unit', val.unit) //单位
          this.showEachDialog = false;
        } else {
          this.$notify.error({ title: '错误', message: '请选择物料' })
        }
      },
      editSectionHandle (row) {
        if (!row.templateId) {
          let a = this.dataList.filter(item => item.templateId)
          if (a.length > 0) row.templateId = a[0].templateId
        }
        this.editRow = row
        this.editSectionDialog = true
      },
      // 计算列和
      getSummaries ({ columns, data }) {
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          if (index === 1) {
            sums[index] = ' ';
            return;
          }
          if (index > 1) {
            let numIndex = ''
            // if(this.showModal){
            //   numIndex = index - 2;
            // }else{
              numIndex = index - 1;
            // }
            if (!this.dataTempletList[numIndex].totalEnable) {
              sums[index] = ' ';
              return;
            } else {
              const values = data.map(item => Number(item[column.property]));
              if (!values.every(value => isNaN(value))) {
                sums[index] = values.reduce((prev, curr) => {
                  const value = Number(curr);
                  console.log("value",value)
                  if (!isNaN(value)) {
                    return prev + curr;
                  } else {
                    return prev;
                  }
                }, 0);
                if(sums[11] && columns[11].property == "cashTaxratePrice"){
                  sums[11] = sums[11].toFixed(4)
                }
              } else {
                sums[index] = ' ';
              }
            }
          }
        })
        console.log("sums",sums)
        return sums;
      },
      // 多选
      checkboxDis (row) {
        return false
      },
      // 添加选中单元配置 row 当前行 column 当前列
      tabClick (row, column) {
        if (!this.showModal) {
          this.tabClickIndex = row.index
          this.tabClickLabel = column.label
          this.$nextTick(function () {
            let input = column.property + this.tabClickIndex
            if (this.$refs[input]) this.$refs[input].focus()
          })
        }
      },
      // 失去焦点初始化
      inputBlur (columnProp, scope) {
        console.log("121252",columnProp)
        this.tabClickIndex = null

        this.tabClickLabel = ''
        let calculateParams = ['taxrate', 'cashTaxratePrice'];
        if (calculateParams.includes(columnProp)) {
          let taxrate = scope.row.taxrate === undefined || scope.row.taxrate === null ? 0 : scope.row.taxrate
          let cashTaxratePrice = scope.row.cashTaxratePrice === undefined || scope.row.cashTaxratePrice === null ? 0 : scope.row.cashTaxratePrice
          let tenderprice = scope.row.tenderprice === undefined || scope.row.tenderprice === null ? 0 : scope.row.tenderprice
          this.$set(scope.row, 'taxratePrice', ((1 - taxrate * 0.01) * cashTaxratePrice).toFixed(4))
          this.$emit('celcPrice')
        }

        // 仓管员入库实收 钢筋实收允许超过5%   totalQuotaInSumCopy 实收数量  totalQuotaInSum 可入库数量
        if(columnProp=='totalQuotaInSumCopy'){
          let totalQuotaInSumCopy = scope.row.totalQuotaInSumCopy === undefined || scope.row.totalQuotaInSumCopy === null ? 0 : scope.row.totalQuotaInSumCopy
          //如果是钢筋
          if(scope.row.materialType === '3'){
            if(scope.row.totalQuotaInSumCopy > scope.row.totalQuotaInSum * (1+0.05)){
              this.$notify.error({ title: '错误', message:'钢筋分类实收数量不能大于可入库量的5%' });
              return false
            }
          }else{
            //不是钢筋
            if(scope.row.totalQuotaInSumCopy > scope.row.totalQuotaInSum){
              this.$notify.error({ title: '错误', message:'实收数量不能大于可入库量' });
              return false
            }
          }
          if(scope.row.totalQuotaInSumCopy == 0){
            this.$notify.error({ title: '错误', message:'实收数量不能为 0' });
            return false
          }
          return true
        }
        if(columnProp=='totalQuotaSum'){
          //制单的时候  采购数量不能大于制单余量   totalPurchaseQuantityCopy 制单余量  totalQuotaSum 采购量
          if(scope.row.totalQuotaSum > scope.row.totalPurchaseQuantityCopy){
            this.$notify.error({ title: '错误', message:'采购数量不能大于制单余量' });
            return false
          }
          //制单的时候  采购数量不能为 0

          if(scope.row.totalQuotaSum == 0){
            this.$notify.error({ title: '错误', message:'采购数量不能为 0' });
            return false
          }
          return true
        }

      },

      selectionChangeHandle: function (val) {
        this.dataListSelections = val
        this.$emit('dataListSelections', val)
      },
      tableRowClassName ({ row, rowIndex }) {
        // 把每一行的索引放进row
        row.index = rowIndex
      },
      rowClass ({ row, column, rowIndex, columnIndex }) {
        if (columnIndex > 0) {
          let numIndex = ''
          // if(this.showModal){
          //   numIndex = columnIndex - 2;
          // }else{
            numIndex = columnIndex - 1;
          // }
          let coln = this.dataTempletList[numIndex]
          if (coln.require && (row[column.property] === null || row[column.property] === '' || row[column.property] === undefined)) {
            if (!this.showModal) return 'redRow'
          }
          if (coln.modifyVisable && column.property !== 'extdata' && (row[column.property] === null || row[column.property] === '' || row[column.property] === undefined)) {
            if (!this.showModal) return 'blueRow'
          }
        }
        this.$nextTick(function () {
          let isHas = document.querySelector('.tb-edit.list-table .redRow') === null
          //是否还有未填写全的单元格数据
          this.$emit('allRowIsFull', isHas)
        })
      },
      rowHeaderClass ({ row }) {
        if (row.require) {
          return 'redHeader'
        }
      },
      scopeHeader (row, show) {
        if (show) return 'redHeader'
      },
    }
  }
</script>

<style scoped lang="scss">
  .head{
    display: inline-block;
    font-weight: 600;
    font-size: 18px;
    margin-bottom: 20px;
  }
</style>







