<template>
  <div class="dialog">
    <el-dialog
      title="四成本详情"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose">
      <div class="detail">
        <div class="tab">
          <el-button type="primary" plain @click="switchTab('投标成本')">投标成本</el-button>
          <el-button type="primary" plain @click="switchTab('责任成本')">责任成本</el-button>
          <el-button type="primary" plain @click="switchTab('动态成本')">动态成本</el-button>
          <el-button type="primary" plain @click="switchTab('后评估')">后评估</el-button>
        </div>
        <div class="data">
          <div class="d-operate">
            <div class="do-inner">
              <el-button type="primary" size="small" @click="newAdd">新增</el-button>
              <el-button type="success" size="small">导入</el-button>
              <el-button type="warning" size="small">导出</el-button>
              <el-button type="info" size="small">模板下载</el-button>
            </div>
          </div>
          <div class="d-table">
            <el-table
              :data="tableData"
              border
              height="500"
              style="width: 100%">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                prop="cycle"
                label="中标时间">
              </el-table-column>
              <el-table-column
                prop="version"
                label="版本">
              </el-table-column>
              <el-table-column
                prop="status"
                label="状态">
                <template slot-scope="scope">
                  <div>
                    <span v-if="scope.row.status === '0'">草稿</span>
                    <span v-else-if="scope.row.status === '1'">提交</span>
                    <span v-else-if="scope.row.status === '2'">确认中</span>
                    <span v-else-if="scope.row.status === '3'">已确认</span>
                    <span v-else>已驳回</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="lastUpdatePeople"
                label="最近更新人">
              </el-table-column>
              <el-table-column
                prop="lastUpdateTime"
                label="最近更新时间">
              </el-table-column>
              <el-table-column
                prop="address"
                label="操作">
                <template slot-scope="scope">
                  <div>
                    <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
                    <el-button type="text" style="color: #F59A23" size="small">详情</el-button>
                    <el-button @click="deleteItem(scope.row)" type="text" style="color: #F59A23" size="small">删除</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <div class="d-pagination">
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
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 新增 -->
    <el-dialog
      :title="newTitle"
      :visible.sync="newDialogVisible"
      width="25%"
      :before-close="handleNewClose">
      <div>
        <div v-if="newTitle === '上报时间周期'">
          <el-form label-position="right" label-width="100px" :model="newForm">
            <el-form-item label="选择上报周期">
              <el-date-picker
                style="width: 100%"
                placeholder="请选择月份范围"
                v-model="newForm.month"
                type="monthrange"
                range-separator="至"
                start-placeholder="开始月份"
                end-placeholder="结束月份">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="版本">
              <el-input v-model="newForm.region" placeholder="请输入版本"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div v-else-if="newTitle === '中标时间'">
          <el-form label-position="right" label-width="100px" :model="newForm">
            <el-form-item label="中标时间">
              <el-date-picker
                style="width: 100%"
                v-model="newForm.month"
                placeholder="请选择月份范围"
                type="monthrange"
                range-separator="至"
                start-placeholder="开始月份"
                end-placeholder="结束月份">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="版本">
              <el-input v-model="newForm.region" placeholder="请输入版本"></el-input>
            </el-form-item>
            <el-form-item label="户型名称">
              <div v-for="(item, index) in newForm.typeName" :key="item" style="margin-bottom: 10px">
                <el-input style="width: 75%; margin-right: 15px" placeholder="请输入户型名称" v-model="newForm.region"></el-input>
                <el-button icon="el-icon-plus" size="mini" circle @click="newAddTypeName(index)"></el-button>
                <el-button icon="el-icon-minus" size="mini" circle @click="newDeleteTypeName"></el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div v-else>
          <el-form label-position="right" label-width="100px" :model="newForm">
            <el-form-item label="上报时间">
              <el-date-picker
                style="width: 100%"
                v-model="newForm.month"
                placeholder="请选择月份范围"
                type="monthrange"
                range-separator="至"
                start-placeholder="开始月份"
                end-placeholder="结束月份">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="版本">
              <el-input v-model="newForm.region" placeholder="请输入版本"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleNewClose">取 消</el-button>
        <el-button type="primary" @click="confirmNew">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/work/collisioncost'
export default {
  name: 'CostDetailDialog',
  data() {
    return {
      dialogVisible: false,
      tableData: [0],

      total: 0,
      form: {
        pageNum: 1,
        pageSize: 10
      },

      newTitle: '上报时间周期',
      newDialogVisible: false,

      newForm: {
        typeName: [0]
      },

      // 详情列表参数
      queryForm: {
        pageNum: 1,
        pageSize: 10,
        projectId: 1,
        type: '1'
      }
    }
  },
  methods: {
    show() {
      this.dialogVisible = true
      this.init()
    },
    handleClose() {
      this.dialogVisible = false
    },
    confirm() {
      this.dialogVisible = false
    },

    init() {
      const p1 = this.queryVersionList()

      Promise.all([p1]).then(res => {
        const [res1] = [...res]
        this.tableData = res1.data.records
        this.total = res1.data.total
      }).catch(err => {
        console.log(err)
      })
    },

    queryVersionList() {
      return new Promise((resolve, reject) => {
        api.queryVersionList(this.queryForm).then(res => {
          if(!res.code) {
            resolve(res)
          }
        }).catch(err => {
          reject(err)
        })
      })
    },

    switchTab(item) {
      switch(item) {
        case '投标成本':
          this.newTitle = '中标时间'
          this.queryForm.type = '1'
          break
        case '责任成本':
          this.newTitle = '上报时间'
          this.queryForm.type = '2'
          break
        case '动态成本':
          this.newTitle = '上报时间周期'
          this.queryForm.type = '3'
          break
        default:
          this.newTitle = '上报时间'
          this.queryForm.type = '4'
          break
      }
      this.init()
    },

    // 新增
    newAdd() {
      this.newDialogVisible = true
    },

    // 编辑
    edit(item) {
      this.$parent.changeIsShowStatus(false)
    },

    // 分页
    handleCurrentChange(val) {

    },
    handleSizeChange(val) {

    },

    handleNewClose() {
      this.newDialogVisible = false
    },
    confirmNew() {
      this.newDialogVisible = false
    },

    // 新增户名
    newAddTypeName(index) {
      this.newForm.typeName.push(index + 1)
    },
    newDeleteTypeName() {
      if(this.newForm.typeName.length > 1) {
        this.newForm.typeName.pop()
      }
    },

    deleteItem(item) {
      let params = {
        id: null
      }
      params.id = item.id
      this.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.deleteVersion(params).then(res => {
          if(!res.code) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.init()
          }
        }).catch(err => {
          console.log(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })        
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog{
  .detail{
    width: 100%;
    display: flex;
    flex-direction: column;
    .data{
      display: flex;
      flex-direction: column;

      .d-operate{
        display: flex;
        flex-direction: row-reverse;
      }

      .d-table{
        padding-top: 10px;
        .d-pagination{
          padding-top: 10px;
        }
      }
    }
  }
}
</style>