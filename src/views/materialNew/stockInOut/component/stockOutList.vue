<template>
    <div class="stockOutList">
      <div class="sc-top">
        <el-form ref="searchFrom" :inline="true" :model="searchFrom" size="mini">
          <el-form-item label="出库编码" prop="inWareHouseCode">
            <el-input v-model="searchFrom.inWareHouseCode" placeholder="请输入库编码" clearable/>
          </el-form-item>
          <el-form-item label="入库日期" >
            <el-col :span="11">
              <el-form-item prop="inWareHouseDateStart">
                <el-date-picker type="date" placeholder="请输入开始日期" v-model="searchFrom.inWareHouseDateStart" style="width: 100%;" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="1">至</el-col>
            <el-col :span="11">
              <el-form-item prop="inWareHouseDateEnd">
                <el-date-picker type="date" placeholder="请输入结束日期" v-model="searchFrom.inWareHouseDateEnd" style="width: 100%;" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="项目名称" prop="purchaseArchCode">
            <el-select v-model="searchFrom.purchaseArchCode" filterable placeholder="请选择项目名称">
              <el-option
                v-for="item in project"
                :key="item.projectCode"
                :label="item.deptName"
                :value="item.projectCode">
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
            label="出库单号"
          />
          <el-table-column
            prop="purchaseArchName"
            align="center"
            label="项目名称"
          />
          <el-table-column
            prop="purchaseWareHouseName"
            align="center"
            label="仓库"
            show-overflow-tooltip
          />
          <el-table-column
            prop="outWareHouseCreatedate"
            align="center"
            label="出库时间"
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
                inWareHouseCode: '',
                inWareHouseDateStart: '',
                inWareHouseDateEnd: '',
                purchaseArchCode:'',
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

        props: {
          project: { type: Array, default(){ return []}, },
        },
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
          console.log("this.searchFrom",this.searchFrom)
          let param = {
            "inWareHouseCode": this.searchFrom.inWareHouseCode,
            "inWareHouseDateStart": this.searchFrom.inWareHouseDateStart,
            "inWareHouseDateEnd": this.searchFrom.inWareHouseDateEnd,
            "purchaseArchCode": this.searchFrom.purchaseArchCode,
          }
          if(!param.inWareHouseCode) delete param.inWareHouseCode;
          if(!param.inWareHouseDateStart) delete param.inWareHouseDateStart;
          if(!param.inWareHouseDateEnd) delete param.inWareHouseDateEnd;
          if(!param.purchaseArchCode) delete param.purchaseArchCode;
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
