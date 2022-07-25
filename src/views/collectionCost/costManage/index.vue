<template>
  <div class="costM">
    <div v-if="isShow">
      <query v-if="showSearch" />
      <div class="cost-table">
        <el-row :gutter="10" class="mb8">
          <el-button icon="el-icon-plus" @click="newAdd">新增</el-button>
          <right-toolbar
            :showSearch.sync="showSearch"
            @queryTable="initTable"
          ></right-toolbar>
        </el-row>
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column fixed="left" type="selection" width="55">
          </el-table-column>
          <el-table-column prop="date" label="工程名称" width="180">
          </el-table-column>
          <el-table-column prop="name" label="工程地点" width="180">
          </el-table-column>
          <el-table-column prop="address" label="项目编码" width="180">
          </el-table-column>
          <el-table-column prop="address" label="合同名称" width="180">
          </el-table-column>
          <el-table-column prop="address" label="合同编号" width="180">
          </el-table-column>
          <el-table-column prop="address" label="分公司" width="180">
          </el-table-column>
          <el-table-column prop="address" label="经营模式" width="180">
          </el-table-column>
          <el-table-column
            prop="address"
            label="总建筑面积（平米）"
            width="180"
          >
          </el-table-column>
          <el-table-column prop="address" label="楼栋数量" width="180">
          </el-table-column>
          <el-table-column prop="address" label="动态成本上报次数" width="180">
          </el-table-column>
          <el-table-column
            prop="address"
            label="动态成本最近上报周期"
            width="180"
          >
          </el-table-column>
          <el-table-column prop="address" label="责任成本上报次数" width="180">
          </el-table-column>
          <el-table-column
            prop="address"
            label="责任成本最近上报周期"
            width="180"
          >
          </el-table-column>
          <el-table-column prop="address" label="投标成本上报次数" width="180">
          </el-table-column>
          <el-table-column
            prop="address"
            label="投标成本最近上报周期"
            width="180"
          >
          </el-table-column>
          <el-table-column prop="address" label="后评估上报次数" width="180">
          </el-table-column>
          <el-table-column
            prop="address"
            label="后评估最近上报周期"
            width="180"
          >
          </el-table-column>
          <el-table-column prop="address" label="最近更新人" width="180">
          </el-table-column>
          <el-table-column prop="address" label="最近更新时间" width="180">
          </el-table-column>
          <el-table-column
            fixed="right"
            prop="address"
            label="操作"
            width="180"
          >
            <template slot-scope="scope">
              <div>
                <el-button
                  @click="handleCostManageDetails(scope.row)"
                  type="text"
                  size="small"
                  >四成本详情</el-button
                >
                <el-button type="text" style="color: #f59a23" size="small"
                  >附件</el-button
                >
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
            :total="total"
          >
          </el-pagination>
        </div>
      </div>

      <el-dialog
        title="新增"
        :visible.sync="newAddDialogVisible"
        width="20%"
        :before-close="handleNewAddDialogClose"
      >
        <div>
          <el-form label-position="right" label-width="80px" :model="newForm">
            <el-form-item label="工程名称">
              <el-select
                style="width: 100%"
                v-model="newForm"
                placeholder="请选择工程名称"
              >
                <el-option
                  v-for="item in engineerOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="工程编码">
              <el-input
                v-model="newForm.name"
                placeholder="请输入工程编码"
              ></el-input>
            </el-form-item>
            <el-form-item label="合同名称">
              <el-select
                style="width: 100%"
                v-model="newForm"
                placeholder="请选择合同名称"
              >
                <el-option
                  v-for="item in contractOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="合同编号">
              <el-input
                v-model="newForm.name"
                placeholder="请输入合同编号"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleNewAddDialogClose">取 消</el-button>
          <el-button type="primary" @click="confirmNewAdd">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 四成本详情 -->
      <cost-detail-dialog ref="costDetails" />
    </div>
    <div v-else>
      <m-table />
    </div>
  </div>
</template>

<script>
import Query from "../components/query.vue";
import CostDetailDialog from "../components/costDetailDialog.vue";
import Mtable from "../components/mTable.vue";
export default {
  name: "CostManage",
  components: {
    query: Query,
    "cost-detail-dialog": CostDetailDialog,
    "m-table": Mtable,
  },
  data() {
    return {
      isShow: true,
      tableData: [0],
      showSearch: true,
      newAddDialogVisible: false,
      queryForm: {
        pageNum: 1,
        pageSize: 10,
      },
      newForm: {},
      total: 0,
      // 工程名称
      engineerOptions: [],
      // 合同名称
      contractOptions: [],
    };
  },
  mounted() {},
  methods: {
    changeIsShowStatus(type) {
      this.isShow = type
    },
    // 四成本详情
    handleCostManageDetails(item) {
      this.$refs.costDetails.show();
    },
    initTable() {},
    // 新增
    newAdd() {
      this.newAddDialogVisible = true;
    },
    // 关闭新增弹框
    handleNewAddDialogClose() {
      this.newAddDialogVisible = false;
    },
    // 确认新增
    confirmNewAdd() {
      this.newAddDialogVisible = false;
    },

    handleSizeChange(val) {},
    handleCurrentChange(val) {},
  },
};
</script>

<style lang="scss" scoped>
.costM {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .cost-table {
    padding: 15px;

    .mb8 {
      padding: 0 5px;
    }

    .pagination {
      display: flex;
      flex-direction: row-reverse;
      padding-top: 10px;
    }
  }
}
</style>
