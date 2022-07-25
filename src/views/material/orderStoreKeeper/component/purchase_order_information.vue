<template>
    <!-- 采购订单信息  -->
    <div class="purchase_order_information">
      <div>
        <span class="line"></span>
        <span class="head">材料信息</span>
      </div>
      <div>
        <el-table
          style="width:100%" size="small" border
          :data="quoteList"
          :row-class-name="tableRowClassName"
          :cell-class-name="rowClass"
          :header-cell-class-name="rowHeaderClass"
          show-summary :summary-method="getSummaries"
          @cell-click="tabClick"
          @selection-change="selectionChangeHandle"
        >
<!--          <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>-->
          <el-table-column header-align="center" show-overflow-tooltip align="center" type="index" label="序号" width="50"></el-table-column>
          <el-table-column header-align="center" show-overflow-tooltip align="center" prop="projectName" label="物料编码" width="200"></el-table-column>
          <el-table-column header-align="center" show-overflow-tooltip align="center" prop="materialName" label="材料名称" width="120"></el-table-column>
          <el-table-column header-align="center" show-overflow-tooltip align="center" prop="specification" label="物料分类" width="120"></el-table-column>
          <el-table-column header-align="center" show-overflow-tooltip align="center" prop="brand" label="规格型号" width="100"></el-table-column>
          <el-table-column header-align="center" show-overflow-tooltip align="center" prop="unit" label="单位" width="80"></el-table-column>
          <el-table-column header-align="center" show-overflow-tooltip align="center" prop="planNum" label="采购量" width="80"></el-table-column>
          <el-table-column header-align="center" show-overflow-tooltip align="center" prop="remark" label="含税单价" width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.index === tabClickIndex && tabClickLabel === '含税单价(元)' && editable">
                <el-input-number v-model.number="scope.row.ioddTaxUnitPrice" type="number" :min="0" placeholder="请输填写" :precision="2"  :controls="false" size="mini" @blur="inNumBlur(scope)" style="width: 100%;"/>
              </span>
              <span v-else>{{ scope.row.ioddTaxUnitPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column header-align="center" show-overflow-tooltip align="center" prop="remark" label="实收数量"></el-table-column>
<!--          <el-table-column header-align="center" show-overflow-tooltip align="center" prop="ioddTaxAllPrice" label="含税总价(元)" width="120"></el-table-column>-->
<!--          <el-table-column header-align="center" show-overflow-tooltip align="center" prop="ioddNtaxAllPrice" label="不含税总价(元)" width="120"></el-table-column>-->
<!--          <el-table-column header-align="center" show-overflow-tooltip align="center" prop="ioddTaxTotal" label="总税金(元)" width="120"></el-table-column>-->
          <el-table-column header-align="center" show-overflow-tooltip align="center" prop="ioddOfferRemark" label="存货备注&自由项">
            <template slot-scope="scope">
          <span v-if="scope.row.index === tabClickIndex && tabClickLabel === '报价备注' && editable">
            <el-input v-model="scope.row.ioddOfferRemark" maxlength="300" placeholder="请输填写" size="mini" @blur="inputBlur" style="width: 100%;"/>
          </span>
              <span v-else>{{ scope.row.ioddOfferRemark }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
</template>

<script>
    export default {
        name: 'purchase_order_information',
        props: {
          quoteList: { type: Array, default () { return [] } },
          ioioTaxRate:{type: Number, default: 0 },
          editable: {
            type: Boolean,
            defautl: true
          }
        },
        data() {
          return {
            show: false,
            isShow: true,
            tabClickIndex: null, // 点击的单元格
            tabClickLabel: '', // 当前点击的列名
            dataListSelections: [], // 当前选中行
          }
        },

        //监听属性 类似于data概念",
        computed: {},

        //监控data中的数据变化",
        watch: {},

      methods: {
        // 把每一行的索引放进row
        tableRowClassName({ row, rowIndex }) {
          row.index = rowIndex
        },

        rowClass({ row, column, rowIndex, columnIndex }) {
          //第一列是序号列，不需要计算css
          if (columnIndex > 1) {
            //从表格列集合中找到当前列的对象
            let coln = this.quoteList.find(item => {
              return item.columnProp === column.property
            })
            if (!coln) {
              return ''
            }
            if (coln.require && row[column.property] === undefined) {
              //爆红
              return 'redRow'
            }
            if (coln.require && (row[column.property] === null || row[column.property] === '')) {
              return 'redRow'
            }
            // 含税单价必须大于0元
            if (coln.require && coln.columnProp === 'price' && +row[column.property] <= 0) {
              return 'redRow'
            }
          }
        },
        rowHeaderClass({ row }) {
          if (row.property === 'ioddTaxUnitPrice') {
            //爆红列
            return 'redHeader'
          }
        },
        // 含税单价（元） row 当前行 column 当前列
        tabClick(row, column, cell, event) {
          this.tabClickIndex = row.index
          this.tabClickLabel = column.label
        },
        // 失去焦点初始化
        inputBlur(row, event, column) {
          this.tabClickIndex = null;
          this.tabClickLabel = ''
        },
        inNumBlur(scope){
          let planNum = scope.row.planNum;
          //含税总价：自动算出，含税总价=计划数量*含税单价（若计划数量未填写，则默认为1）
          if(planNum == '' || planNum == null) planNum = 1
          this.quoteList[scope.$index].ioddTaxAllPrice = planNum * this.quoteList[scope.$index].ioddTaxUnitPrice;
          // 不含税单价=含税单价/（1+税率）
          this.quoteList[scope.$index].ioddNtaxUnitPrice = (this.quoteList[scope.$index].ioddTaxUnitPrice / ( 1 + this.ioioTaxRate * 0.01 )).toFixed(2);
          // 不含税总价：自动算出=含税总价/（1+税率）
          this.quoteList[scope.$index].ioddNtaxAllPrice = (this.quoteList[scope.$index].ioddTaxAllPrice / (1 + this.ioioTaxRate * 0.01)).toFixed(2);
          // 总税金：自动算出=不含税总价*税率
          this.quoteList[scope.$index].ioddTaxTotal = (this.quoteList[scope.$index].ioddNtaxAllPrice * (this.ioioTaxRate * 0.01)).toFixed(2);
          this.tabClickIndex = null;
          this.tabClickLabel = '';
        },
        // 计算合计
        getSummaries(param) {
          const { columns, data } = param;
          const sums = [];
          columns.forEach((column, index) => {
            if (index === 9 || index === 10 || index === 11 || index === 12 || index === 13) {
              if (index === 0) {
                sums[index] = '总价';
                return;
              }
              const values = data.map(item => Number(item[column.property]));

              if (!values.every(value => isNaN(value))) {
                sums[index] = values.reduce((prev, curr) => {
                  const value = Number(curr);
                  if (!isNaN(value)) {
                    return prev + curr;
                  } else {
                    return prev;
                  }
                }, 0).toFixed(2);
                sums[index] += '';
              } else {
                sums[index] = '';
              }
            }
          });
          return sums.toFixed(4);
        },
        // 获取选中行
        selectionChangeHandle: function (val) {
          this.dataListSelections = val
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
  .purchase_order_information{
    margin-bottom: 30px;
  }
</style>
