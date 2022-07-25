<template>
    <div class="stockOutList">
      <div class="sc-top">
        <el-form ref="searchFrom" :inline="true" :model="searchFrom" size="mini">
          <el-form-item label="出库编码" prop="outWareHouseCode">
            <el-input v-model="searchFrom.outWareHouseCode" placeholder="请输入库编码" clearable/>
          </el-form-item>
          <el-form-item label="领用人" prop="outWareHouseReceiverName">
            <el-input v-model="searchFrom.outWareHouseReceiverName" placeholder="请输入领用人" clearable/>
          </el-form-item>
          <el-form-item label="送货人" prop="outWareHouseDelimanName">
            <el-input v-model="searchFrom.outWareHouseDelimanName" placeholder="请输入收货人" clearable/>
          </el-form-item>
          <el-form-item label="选择仓库" prop="purchaseWareHouseId">
            <el-select v-model="searchFrom.purchaseWareHouseId" filterable placeholder="请选择仓库" clearable >
              <el-option
                v-for="item in allWare"
                :key="item.totalMaterialWarehouseId"
                :label="item.totalMaterialWarehouseName"
                :value="item.totalMaterialWarehouseId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onReset('searchFrom')">重置</el-button>
            <el-button type="primary" @click="onQuery">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="sc-table">
        <el-table
          :data="dataList"
          border
          style="width: 100%"
          v-loading="loading"
        >
          <el-table-column
            type="index"
            align="center"
            label="序号"
          />
          <el-table-column
            prop="outWareHouseCode"
            align="center"
            label="单据编号"
          />
          <el-table-column
            prop="purchaseWareHouseName"
            align="center"
            label="仓库"
            show-overflow-tooltip
          />
          <el-table-column
            prop="purchaseArchName"
            align="center"
            label="项目名称"
          />
          <el-table-column
            prop="outWareHouseDelimanName"
            align="center"
            label="送货人"
          />
          <el-table-column
            prop="outWareHouseReceiverName"
            align="center"
            label="领用人"
          />
          <el-table-column
            prop="outWareHouseCreatedate"
            align="center"
            label="更新时间"
          />
          <el-table-column
            fixed="right"
            align="center"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="editSupplierInfo(scope.row)"
              >
                查看详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            background
            :current-page="searchFrom.pageNum"
            :page-size="searchFrom.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, prev, pager, next"
            :total="total"
            @current-change="currentPageChange"
          />
        </div>
      </div>

      <eidt_class ref="eidt_class" :info="info"></eidt_class>
    </div>
</template>

<script>
    import { getStockOutPage } from '@/api/material/stockInOut';
    import { allWarehouse } from '@/api/material/dictionary';

    import eidt_class from "../eidt_class";

    export default {
        name: 'stockOutList',
        data() {
            return {
              searchFrom: {
                outWareHouseCode: '',
                outWareHouseReceiverName: '',
                outWareHouseDelimanName: '',
                purchaseWareHouseId: '',
                pageSize: 10,
                pageIndex: 1
              },
              total: null,
              dataList: [],
              info:{},
              allWare:[],
              loading: true
            }
        },

        props: {},
        components:{
          eidt_class
        },
        //监听属性 类似于data概念",
        computed: {},

        //监控data中的数据变化",
        watch: {},

      methods: {
        getAllWare(){
          allWarehouse().then(response=>{
            console.log("121212",response.data)
            this.allWare = response.data
          })
        },
        // 查看详情
        editSupplierInfo(row) {
          this.$refs.eidt_class.eidtUpdateHandle('update', row)
        },
        getDataList() {
          let param = {
            "outWareHouseCode": this.searchFrom.outWareHouseCode,
            "outWareHouseReceiverName": this.searchFrom.outWareHouseReceiverName,
            "outWareHouseDelimanName": this.searchFrom.outWareHouseDelimanName,
            "purchaseWareHouseId": this.searchFrom.purchaseWareHouseId,
          }
          if(!param.outWareHouseCode) delete param.outWareHouseCode;
          if(!param.outWareHouseReceiverName) delete param.outWareHouseReceiverName;
          if(!param.outWareHouseDelimanName) delete param.outWareHouseDelimanName;
          if(!param.purchaseWareHouseId) delete param.purchaseWareHouseId;
          console.log(param);
          this.loading = true;
          getStockOutPage(param,this.searchFrom.pageIndex,this.searchFrom.pageSize).then(response=>{
            this.dataList = response.data.records;
            this.total = response.data.total;
            this.loading = false;
          })
        },
        // 修改页码
        sizeChangeHandle(num) {
          this.searchFrom.pageSize = num
          this.searchFrom.pageIndex = 1
          this.getDataList()
        },
        // 切换页面
        currentPageChange(num) {
          this.searchFrom.pageIndex = num
          this.getDataList()
        },
        // 条件查询
        onQuery() {
          console.log("1212")
          this.searchFrom.pageNum = 1
          this.getDataList()
        },
        // 重置
        onReset(formName) {
          this.$refs[formName].resetFields()
          this.getDataList()
        }
      },

      //生命周期 - 创建完成（可以访问当前this实例）",数据模型已加载，方法已加载,html模板已加载,html模板未渲染
      created() {
        this.onQuery()
        this.getAllWare()
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

<style scoped>
</style>
