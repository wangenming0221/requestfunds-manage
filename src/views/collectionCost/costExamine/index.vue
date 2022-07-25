<template>
  <div class="e-cost">
    <el-tabs v-model="activeName" type="card" @tab-click="handleSwitchTab">
      <el-tab-pane label="待办" name="waitDone">
        <examine-query v-if="showSearch" />
        <div class="e-table">
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
              label="上报周期"
              width="180">
            </el-table-column>
            <el-table-column
              prop="name"
              label="版本"
              width="180">
            </el-table-column>
            <el-table-column
              prop="address"
              label="所属工程名称"
              width="180">
            </el-table-column>
            <el-table-column
              prop="address"
              label="所属项目编码"
              width="180">
            </el-table-column>
            <el-table-column
              prop="address"
              label="所属合同名称"
              width="180">
            </el-table-column>
            <el-table-column
              prop="address"
              label="所属合同编号"
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
              label="成本类型"
              width="180">
            </el-table-column>
            <el-table-column
              prop="address"
              label="提交人"
              width="180">
            </el-table-column>
            <el-table-column
              prop="address"
              label="提交时间"
              width="180">
            </el-table-column>
            <el-table-column
              fixed="right"
              prop="address"
              label="操作"
              width="180">
              <template slot-scope="scope">
                <div>
                  <el-button @click="pass(scope.row)" type="text" size="small">通过</el-button>
                  <el-button @click="reject(scope.row)" style="color: #FF0000" type="text" size="small">驳回</el-button>
                  <el-button type="text" style="color: #F59A23" size="small">详情</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryForm.pageNum"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="queryForm.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="已办" name="done">
        <examine-query />
        <div class="e-table">
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
              label="上报周期"
              width="180">
            </el-table-column>
            <el-table-column
              prop="name"
              label="版本"
              width="180">
            </el-table-column>
            <el-table-column
              prop="address"
              label="所属工程名称"
              width="180">
            </el-table-column>
            <el-table-column
              prop="address"
              label="所属项目编码"
              width="180">
            </el-table-column>
            <el-table-column
              prop="address"
              label="所属合同名称"
              width="180">
            </el-table-column>
            <el-table-column
              prop="address"
              label="所属合同编号"
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
              label="成本类型"
              width="180">
            </el-table-column>
            <el-table-column
              prop="address"
              label="提交人"
              width="180">
            </el-table-column>
            <el-table-column
              prop="address"
              label="提交时间"
              width="180">
            </el-table-column>
            <el-table-column
              fixed="right"
              prop="address"
              label="操作"
              width="180">
              <template slot-scope="scope">
                <div>
                  <el-button @click="pass(scope.row)" type="text" size="small">通过</el-button>
                  <el-button @click="reject(scope.row)" style="color: #FF0000" type="text" size="small">驳回</el-button>
                  <el-button type="text" style="color: #F59A23" size="small">详情</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryForm.pageNum"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="queryForm.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 驳回弹窗 -->
    <el-dialog
      title="驳回"
      :visible.sync="rejectDialogVisible"
      width="30%"
      :before-close="handleRejectDialogClose">
      <div>
        <el-form ref="rejectForm" :model="rejectForm" label-width="80px">
          <el-form-item label="驳回原因">
            <el-input type="textarea" v-model="rejectForm.desc"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleRejectDialogClose">取 消</el-button>
        <el-button type="primary" @click="confirmReject">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ExamineQuery from '../components/examineQuery.vue'
export default {
  name: 'CostExamine',
  components: {
    'examine-query': ExamineQuery
  },
  data() {
    return {
      activeName: 'waitDone',
      showSearch: true,
      rejectDialogVisible: false,
      tableData: [0],

      queryForm: {
        pageNum: 1,
        pageSize: 10
      },
      rejectForm: {

      },
      total: 0,
    }
  },
  mounted() {

  },
  methods: {
    // 选项卡
    handleSwitchTab() {

    },
    initTable() {},
    // 通过
    pass(item) {
      console.log(item)
    },
    // 驳回
    reject(item) {
      console.log(item)
      this.rejectDialogVisible = true
    },

    // 关闭驳回
    handleRejectDialogClose() {
      this.rejectDialogVisible = false
    },
    // 确认驳回
    confirmReject() {
      this.rejectDialogVisible = false
    },

    handleSizeChange(val) {

    },
    handleCurrentChange(val) {

    }
  }
}
</script>

<style lang="scss" scoped>
.e-cost{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 15px;

  .e-table{
    padding: 15px;

    .mb8{
      padding: 0 5px;
    }

    .pagination{
      display: flex;
      flex-direction: row-reverse;
      padding-top: 10px;
    }
  }
}
</style>
