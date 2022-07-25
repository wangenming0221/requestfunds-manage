<template>
  <div class="company">
    <el-form :inline="true" ref="initParams" :model="initParams" class="demo-form-inline">
      <el-form-item label="企业名称" prop="cName">
        <el-input v-model="initParams.cName" placeholder="企业名称" />
      </el-form-item>
      <el-form-item label="企业类型" prop="cType">
        <el-select v-model="initParams.cType" placeholder="请选择企业类型">
          <el-option label="总公司" value="0" />
          <el-option label="外部企业" value="1" />
          <el-option label="子公司" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="法定代表人/负责人" prop="cPeople">
        <el-input v-model="initParams.cPeople" placeholder="请输入法定代表人/负责人" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        <el-button icon="el-icon-refresh" @click="onReset('initParams')">重置</el-button>
        <el-button icon="el-icon-plus" @click="onNewAdd">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="cname"
        align="center"
        label="企业名称"
      />
      <el-table-column
        prop="ctype"
        align="center"
        label="企业类型"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.ctype === '0'">总公司</span>
          <span v-if="scope.row.ctype === '1'">外部企业</span>
          <span v-if="scope.row.ctype === '2'">子公司</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="ccode"
        align="center"
        label="企业代码"
      />
      <el-table-column
        prop="cpeople"
        align="center"
        label="法定代表人/负责人"
      />
      <el-table-column
        prop="createtime"
        align="center"
        label="创建时间"
      />
      <el-table-column
        prop="createPeople"
        align="center"
        label="创建人"
      />
      <el-table-column
        prop="modifyTime"
        align="center"
        label="修改时间"
      />
      <el-table-column
        prop="modifyPeople"
        align="center"
        label="修改人"
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
            @click="editCompanyInfo(scope.row.id)"
          >
            修改
          </el-button>
          <el-button
            type="text"
            size="small"
            @click="deleteCompanyInfo(scope.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        background
        :current-page="initParams.pageNum"
        :page-size="initParams.pageSize"
        layout="total, prev, pager, next"
        :total="total"
        @current-change="currentPageChange"
      />
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="newAddShow"
      width="25%"
      :before-close="handleClose"
    >
      <div class="new-add-contain">
        <el-form ref="newForm" :rules="newFormRules" :model="newForm" label-width="150px">
          <el-form-item label="企业名称" prop="cName">
            <el-input type="text" style="width: 100%" v-model="newForm.cName" maxlength="50" />
          </el-form-item>
          <el-form-item label="企业类型" prop="cType">
            <el-select v-model="newForm.cType" style="width: 100%" placeholder="请选择企业类型">
              <el-option label="总公司" value="0" />
              <el-option label="外部企业" value="1" />
              <el-option label="子公司" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="法定代表人/负责人" prop="cPeople">
            <el-input type="text" v-model="newForm.cPeople" maxlength="50" />
          </el-form-item>
          <el-form-item label="企业代码" prop="cCode">
            <el-input type="text" v-model="newForm.cCode" maxlength="50" />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveCompanyInformation('newForm')">保 存</el-button>
        <el-button @click="reset('newForm')">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/work/contract'
export default {
  name: 'CompanyInformation',
  data() {
    return {
      dialogTitle: '新增',
      newAddShow: false,
      initParams: {
        cName: '',
        cType: '',
        cPeople: '',
        pageSize: 10,
        pageNum: 1
      },
      total: null,
      newForm: {
        cName: '',
        cType: '',
        cPeople: '',
        cCode: ''
      },
      newFormRules: {
        cName: [
          { required: true, message: '请输入企业名称', trigger: 'blur' }
        ],
        cType: [
          { required: true, message: '请选择企业类型', trigger: 'change' }
        ],
        cPeople: [
          { required: true, message: '请输入法定代表人/负责人', trigger: 'blur' }
        ],
        cCode: [
          { required: true, message: '请输入企业代码', trigger: 'blur' }
        ]
      },
      recordId: {
        id: ''
      },
      tableData: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 获取本公司信息
    init() {
      api.getCompanyInformation(this.initParams).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.tableData = res.data.records
          this.total = res.data.total
          this.initParams.pageNum = res.data.current
        }
      }).catch(err => {
        console.log(err)
      })
    },
    currentPageChange(page) {
      this.initParams.pageNum = page
      this.init()
    },
    // 查询
    onSubmit() {
      this.init()
    },

    // 重置
    onReset(formName) {
      this.$refs[formName].resetFields()
      this.init()
    },

    // 新增 dialog
    onNewAdd() {
      this.dialogTitle = '新增'
      this.newAddShow = true
    },
    // 重置 取消
    reset(formName) {
      this.$refs[formName].resetFields()
      this.newAddShow = false
    },

    handleClose() {
      this.newAddShow = false
    },
    saveCompanyInformation(formName) {
      if (this.dialogTitle === '新增') {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            api.newAddCompanyInfo(this.newForm).then(res => {
              console.log(res)
              if (res.code === 0) {
                this.init()
                this.$refs[formName].resetFields()
              }
            }).catch(err => {
              console.log(err)
            })
            this.newAddShow = false
          } else {
            console.log('error submit!!')
            return false
          }
        })
      } else {
        const target = Object.assign(this.newForm, this.recordId)
        api.saveUpdatedCompanyInformation(target).then(res => {
          console.log(res)
          if (res.code === 0) {
            this.init()
          }
          this.newAddShow = false
          for (const key in this.newForm) {
            this.newForm[key] = ''
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    // 修改公司信息
    editCompanyInfo(id) {
      this.dialogTitle = '修改'
      this.recordId.id = id
      this.newAddShow = true

      api.getCompanyDetailsInformation(this.recordId).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.newForm.cName = res.data.cname
          this.newForm.cType = res.data.ctype
          this.newForm.cPeople = res.data.cpeople
          this.newForm.cCode = res.data.ccode
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 删除公司信息
    deleteCompanyInfo(id) {
      this.recordId.id = id
      this.$confirm('确定删除本条数据吗?', '删除提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.deleteCompanyInformation(this.recordId).then(res => {
          console.log(res)
          if (res.code === 0) {
            this.init()
          }
        }).catch(err => {
          console.log(err)
        })
        this.$message({
          type: 'success',
          message: '删除成功!'
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

<style scoped>
.company{
  width: 100%;
  height: 100%;
  padding: 20px;
}
.new-add-contain{
    width: 100%;
}
.pagination{
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  margin-top: 20px;
}
</style>
