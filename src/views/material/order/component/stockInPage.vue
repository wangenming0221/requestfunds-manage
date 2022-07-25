<template>
    <div class="stockInPage">
      <el-table
        :data="tableData"
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
          prop="purchaseCode"
          align="center"
          label="入库编号"
        />
        <el-table-column
          prop="supplyCompanyName"
          align="center"
          label="供应商"
        />
        <el-table-column
          prop="purchaseArchName"
          align="center"
          label="项目名称"
        />
        <el-table-column
          prop="purchaseWareHouseChargeName"
          align="center"
          label="入库仓库负责人"
        />
        <el-table-column
          prop="purchaseSum"
          align="center"
          label="采购数量"
        />
        <el-table-column
          prop="inWareHouseSum"
          align="center"
          label="入库数量"
        />
        <el-table-column
          prop="inWareHouseCreatedate"
          align="center"
          label="最近入库时间"
        />
        <el-table-column
          prop="states"
          align="center"
          label="入库状态"
        />
        <el-table-column
          fixed="right"
          align="center"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="editSupplierInfo(scope.row)"
            >
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--  入库单弹窗  -->
      <records_eidt_class ref="records_eidt_class" ></records_eidt_class>
    </div>
</template>

<script>
    import records_eidt_class from "../../materialRecords/records_eidt_class";
    export default {
        name: 'stockInPage',
        data() {
            return {

            }
        },
        components:{
          records_eidt_class
        },
        props: {
          tableData:{ type: Array, default () { return [] } },
          loading:{ type: Boolean, default: true },
        },

        //监听属性 类似于data概念",
        computed: {},

        //监控data中的数据变化",
        watch: {},

        methods: {
          // 查看详情
          editSupplierInfo(row) {
            this.$refs.records_eidt_class.eidtUpdateHandle(row, 'edit')
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

<style scoped>
</style>
