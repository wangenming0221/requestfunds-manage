<template>
  <div class="purchase_order_information">
  <div>
    <span class="line"></span>
    <span class="head" >
      材料信息
        <el-select v-model="templetData.materialLimit" size="mini" placeholder="请选择" class="select" v-if="!showModal">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      <span class="text" v-if="!showModal">钢筋\铝材单项物料实收数量可＞采购量，（不可超过采购量总数 <span class="pertance">5%</span> ）</span>
    </span>
  </div>
  <div>
    <slot></slot>
    <el-table style="width: 100%" id="tb-edit" :show-summary="showSummary" :summary-method="getSummaries" @selection-change="selectionChangeHandle" v-if="dataTempletList.length > 0" :data="dataList" border class="tb-edit list-table" :class="key" highlight-current-row :cell-class-name="rowClass" :header-cell-class-name="rowHeaderClass" :row-class-name="tableRowClassName" @cell-click="tabClick">
      <el-table-column type="index" header-align="center" align="center" width="50" label="序号" />
      <template v-for="(item, index) in dataTempletList">
        <el-table-column  :key="index" :show-overflow-tooltip="true" :prop="item.columnProp" :width="item.columnWidth" :label="item.columnName">
          <template slot-scope="scope">
                        <span v-if="scope.row.index === tabClickIndex && tabClickLabel === item.columnName && item.componentType !== 'el-button' && item.modifyVisable">
                            <el-input v-if="item.componentType === 'el-input'" :ref="'_'+item.columnProp + tabClickIndex" v-model="scope.row[item.columnProp]" placeholder="请输入.." @blur="inputBlur(item.columnProp,scope)" />
                          <!-- 物料编码  -->
                          <el-input v-else-if="item.componentType === 'el-materialCode'" :ref="'_'+item.columnProp + tabClickIndex" v-model="scope.row[item.columnProp]" placeholder="请选择物料编码" @focus="checkMaterial(scope.row.index)" @blur="inputBlur(item.columnProp,scope)" readonly>
                                <i slot="suffix" class="el-input__icon el-icon-more" @click="checkMaterial(scope.row.index)" />
                          </el-input>
                          <el-input-number v-else-if="item.componentType === 'el-input-number'" :controls="false" type="number" :min="0" :precision="precision(item)" @blur="inputBlur(item.columnProp,scope)"
                                v-model.number="scope.row[item.columnProp]" placeholder="请输入.." style="width:100%" :ref="'_'+item.columnProp + tabClickIndex" />
                          <!-- 质量评级   -->
                          <el-select v-else-if="item.componentType==='el-level'" :ref="'_' +item.columnProp + tabClickIndex" v-model="scope.row[item.columnProp]" style="width:100%" placeholder="请选择" clearable  @change="inputBlur(item.columnProp,scope)" >
                            <el-option label="好" value="好"></el-option>
                            <el-option label="中" value="中"></el-option>
                            <el-option label="差" value="差"></el-option>
                          </el-select>
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

  </div>
</template>

<script>
  export default {
    name: 'material_modal',
    components: {

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
        key: 'key' + Math.floor(Math.random() * 100000), // 给表格个随机class 防止querySelector时抓到其他实例
        dataTempletList: [],
        dataList: [],
        info: {},
        showSummary: false,
        editSectionDialog: false,
        checkRowIndex: '',
        editRow: {},
        checkRow: {},
        procModal: '',
        tabClickIndex: null, // 点击的单元格
        tabClickLabel: '', // 当前点击的列名
        dataListSelections: [],//多选操作
        showModal: false,
        showEachDialog:false,
        options:[
          { value: '其它', label: '其它' },
          { value: '钢筋', label: '钢筋' },
          { value: '铝材', label: '铝材' },
        ],
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
          let materialLimit = val.materialLimit ? val.materialLimit : '其它';
          this.$set(this.templetData,'materialLimit',materialLimit);
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
        deep: true,
        immediate: true,
        handler: function (val) {
          this.showModal = val;
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
      // editSectionHandle (row) {
      //   if (!row.templateId) {
      //     let a = this.dataList.filter(item => item.templateId)
      //     if (a.length > 0) row.templateId = a[0].templateId
      //   }
      //   this.editRow = row
      //   this.editSectionDialog = true
      // },
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
            numIndex = index - 1;
            if (!this.dataTempletList[numIndex].totalEnable) {
              sums[index] = ' ';
              return;
            } else {
              const values = data.map(item => Number(item[column.property]));
              if (!values.every(value => isNaN(value))) {
                sums[index] = values.reduce((prev, curr) => {
                  const value = Number(curr);
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
        console.log("row2",row)
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
        this.tabClickIndex = null;
        this.tabClickLabel = '';

        console.log(this.$route.path.includes('materialNew'))
        /**
         *  物料二期的物料限定开始
         * */
        if(this.$route.path.includes('materialNew')){
          let calculateParams = ['totalQuotaInSum'];
          let totalQuotaSum = scope.row.totalQuotaSum === undefined || scope.row.totalQuotaSum === null ? 0 : scope.row.totalQuotaSum; // 采购数量
          let totalFutureSum = scope.row.totalFutureSum === undefined || scope.row.totalFutureSum === null ? 0 : scope.row.totalFutureSum; // 可入库数量
          if (calculateParams.includes(columnProp)) {
            if(this.templetData.materialLimit === '其它'){
              // 其它：可入库数量 >= 实收数量；
              if(scope.row.totalFutureSum < scope.row.totalQuotaInSum){
                this.$notify.error({ title: '错误', message:'其它类型可入库数量应大等实收数量' });
                return false;
              }
            }else{
              // 钢筋/铝材：采购数量*1.05 -（采购数量-可入库数量） >= 实收数量；
              if((totalQuotaSum*1.05 - (totalQuotaSum-totalFutureSum)).toFixed(4) < scope.row.totalQuotaInSum){
                this.$notify.error({ title: '错误', message:'钢筋\\铝材单项物料实收数量可＞采购量，（不可超过采购量总数 5% ）' });
                return false;
              }
            }
          }
          return true;
        }
        /**  物料二期的物料限定结束 * */

        /**
         *  物料一期的物料限定开始
         * */
        let calculateParams = ['taxrate', 'cashTaxratePrice'];
        if (calculateParams.includes(columnProp)) {
          let taxrate = scope.row.taxrate === undefined || scope.row.taxrate === null ? 0 : scope.row.taxrate
          let cashTaxratePrice = scope.row.cashTaxratePrice === undefined || scope.row.cashTaxratePrice === null ? 0 : scope.row.cashTaxratePrice
          let tenderprice = scope.row.tenderprice === undefined || scope.row.tenderprice === null ? 0 : scope.row.tenderprice
          this.$set(scope.row, 'taxratePrice', ((1 - taxrate * 0.01) * cashTaxratePrice).toFixed(4))
          this.$emit('celcPrice')
        }
        // 为钢筋和铝材的时候 实收数量允许超过5%   totalQuotaInSumCopy 实收数量  totalQuotaInSum 可入库数量
        if(columnProp=='totalQuotaInSumCopy'){
          if(this.value != '其它'){
            // 如果是钢筋和铝材
            let totalQuotaInSumCopy = scope.row.totalQuotaInSumCopy === undefined || scope.row.totalQuotaInSumCopy === null ? 0 : scope.row.totalQuotaInSumCopy
            //如果是钢筋
            if(scope.row.materialType === '3'){
              if(scope.row.totalQuotaInSumCopy > scope.row.totalQuotaInSum * (1+0.05)){
                this.$notify.error({ title: '错误', message:'钢筋铝材实收数量不能大于可入库量的5%' });
                return false
              }
            }
          }else{
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
        /**  物料一期的物料限定结束  **/
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
          numIndex = columnIndex - 1;
          let coln = this.dataTempletList[numIndex]
          if (coln.require && (row[column.property] === null || row[column.property] === '' || row[column.property] === undefined)) {
            if (!this.showModal) return 'redRow'
          }
          if (coln.modifyVisable && column.property !== 'extdata' && (row[column.property] === null || row[column.property] === '' || row[column.property] === undefined)) {
            if (!this.showModal) return 'blueRow'
          }
        }
        this.$nextTick(function () {
          let isHas = document.querySelector('.tb-edit.list-table.' + this.key + ' .redRow') === null
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
    .select{
      margin-left: 10px;
      margin-right: 10px;
      width: 80px;
    }
    .text{
      font-size: 12px;
      color: black;
      font-weight: 100;
    }
    .pertance{
      color: red;
    }
  }
</style>







