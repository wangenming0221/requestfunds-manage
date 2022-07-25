<template>
  <div class="b-cost">
    <query v-if="showSearch" />
    <div class="cost-table">
      <el-row :gutter="10" class="mb8">
        <right-toolbar :showSearch.sync="showSearch" @queryTable="initTable"></right-toolbar>
      </el-row>
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          fixed="left"
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="date"
          label="工程名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="工程地点"
          width="180">
        </el-table-column>
        <el-table-column
          prop="address"
          label="项目编码"
          width="180">
        </el-table-column>
        <el-table-column
          prop="address"
          label="合同名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="address"
          label="合同编号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="address"
          label="分公司"
          width="180">
        </el-table-column>
        <el-table-column
          prop="address"
          label="经营模式"
          width="180">
        </el-table-column>
        <el-table-column
          prop="address"
          label="总建筑面积（平米）"
          width="180">
        </el-table-column>
        <el-table-column
          prop="address"
          label="楼栋数量"
          width="180">
        </el-table-column>
        <el-table-column
          prop="address"
          label="上报周期"
          width="180">
        </el-table-column>
        <el-table-column
          prop="address"
          label="版本"
          width="180">
        </el-table-column>
        <el-table-column
          prop="address"
          label="状态"
          width="180">
        </el-table-column>
        <el-table-column
          prop="address"
          label="最近更新人"
          width="180">
        </el-table-column>
        <el-table-column
          prop="address"
          label="最近更新时间"
          width="180">
        </el-table-column>
        <el-table-column
          fixed="right"
          prop="address"
          label="操作"
          width="180">
          <template slot-scope="scope">
            <div>
              <el-button @click="handleCostManageDetails(scope.row)" type="text" size="small">详情</el-button>
              <el-button type="text" style="color: #F59A23" size="small">附件</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import Query from '../components/query.vue'
export default {
  name: 'BidCost',
  components: {
    'query': Query
  },
  data() {
    return {
      tableData: [0],
      showSearch: true
    }
  },
  mounted() {

  },
  methods: {
    // 四成本详情
    handleCostManageDetails(item) {

    },
    initTable() {

    }
  }
}
</script>

<style lang="scss" scoped>
.b-cost{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .cost-table{
    padding: 15px;
  }
}
</style>
