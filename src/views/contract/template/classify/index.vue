<template>
  <div class="contract-container">
    <el-form :inline="true" :model="queryForm" class="demo-form-inline">
      <el-form-item label="合同分类名称">
        <el-input v-model="queryForm.searchName" placeholder="请输入合同分类名称" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onQuery">查询</el-button>
        <el-button icon="el-icon-refresh" @click="onReset">重置</el-button>
        <el-button icon="el-icon-plus" @click="onNewAdd">新增</el-button>
        <el-button icon="el-icon-edit" @click="onEdit">编辑</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="cname"
        align="center"
        label="分类名称"
      />
<!--      <el-table-column-->
<!--        prop="contractName"-->
<!--        align="center"-->
<!--        label="关联合同范本"-->
<!--      />-->
<!--      <el-table-column-->
<!--        prop="approveName"-->
<!--        align="center"-->
<!--        label="关联审批流程名称"-->
<!--      />-->
<!--      <el-table-column-->
<!--        prop="approveCode"-->
<!--        align="center"-->
<!--        label="关联审批流程编号"-->
<!--      />-->
<!--      <el-table-column-->
<!--        prop="status"-->
<!--        align="center"-->
<!--        label="使用状态"-->
<!--      >-->
<!--        <template slot-scope="scope">-->
<!--          <span v-if="scope.row.status === 0">停用</span>-->
<!--          <span v-if="scope.row.status === 1">启用</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="createPerson"-->
<!--        align="center"-->
<!--        label="创建人"-->
<!--      />-->
      <el-table-column
        prop="createTime"
        align="center"
        label="创建时间"
      />
      <el-table-column
        prop="sortNum"
        align="center"
        label="显示顺序"
      />
<!--      <el-table-column-->
<!--        prop="updatePerson"-->
<!--        align="center"-->
<!--        label="修改人"-->
<!--      />-->
<!--      <el-table-column-->
<!--        prop="updateTime"-->
<!--        align="center"-->
<!--        label="修改时间"-->
<!--      />-->
<!--      <el-table-column-->
<!--        fixed="right"-->
<!--        align="center"-->
<!--        label="操作"-->
<!--      >-->
<!--        <template slot-scope="scope">-->
<!--          <el-button-->
<!--            type="text"-->
<!--            size="small"-->
<!--            @click="editClassificationInfo(scope.row.id)"-->
<!--          >-->
<!--            修改-->
<!--          </el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
    </el-table>
    <div class="pagination">
      <el-pagination
        background
        :current-page="queryForm.pageNum"
        :page-size="queryForm.pageSize"
        layout="total, prev, pager, next"
        :total="total"
        @current-change="currentPageChange"
      />
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="newAddShow"
      width="20%"
      :before-close="handleClose"
    >
      <div class="new-add-contain">
        <el-form ref="newForm" :rules="newFormRuleForm" :model="newForm" class="demo-ruleForm" label-width="90px">
          <el-form-item label="分类名称" prop="cname">
            <el-input
              v-model="newForm.cname"
              placeholder="请输入分类名称"
              maxlength="50"
            />
          </el-form-item>
          <el-form-item label="权重排序" prop="sortNum">
            <el-input
              v-model="newForm.sortNum"
              placeholder="请输入权重排序"
              maxlength="50"
            />
          </el-form-item>
          <el-form-item label="使用状态">
            <el-switch
              v-model="status"
              active-color="#13ce66"
              @change="handleStatusChange"
              inactive-color="#eeeeee">
            </el-switch>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveContractClassification('newForm')">保 存</el-button>
        <el-button @click="cancel">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/work/contract'
export default {
  name: 'ContractClassification',
  data() {
    return {
      queryForm: {
        searchName: '',
        pageSize: 10,
        pageNum: 1
      },
      total: null,
      tableData: [],
      dialogTitle: '',
      newAddShow: false,
      newForm: {
        pid: '',
        cname: '',
        process_name: '',
        sortNum: null,
        modelId: '',
        modelTwoId: '',
        status: 0
      },
      status: false,
      newFormRuleForm: {
        cname: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ],
        sortNum: [
          { required: true, message: '请输入权重排序', trigger: 'blur' }
        ]
      },
      recordId: {
        id: ''
      },
      classificationValue: [],
      classificationOptions: [],
      type1: '',
      type2: '',
      contractTemplateOptions: [],
      contractSupplyOptions: [],
      // 已选表格项
      selectionTableItem: []
    }
  },
  computed: {
    // 选中终点分类 显示 关联范本
    typeShow() {
      return this.newForm.type === 2
    }
  },
  created() {
    this.init()
    this.getContractTemplate()
    this.getSupplyTemplate()
  },
  methods: {
    // 选择表格项
    handleSelectionChange(val) {
      this.selectionTableItem = val
    },
    handleStatusChange(val) {
      console.log(val)
      this.status = val
      if (val) {
        this.newForm.status = 1
      } else {
        this.newForm.status = 0
      }
    },
    handleModelIdChange(val) {
      this.contractTemplateOptions.forEach((item, index) => {
        if (item.contractName === val) {
          this.newForm.modelId = item.id
        }
      })
    },
    handleChangeModelTwoId(val) {
      // console.log(val)
      this.contractSupplyOptions.forEach((item, index) => {
        if (item.contractName === val) {
          this.newForm.modelTwoId = item.id
        }
      })
    },
    // 获取关联合同范本
    getContractTemplate() {
      const contractState = {
        contractState: 0
      }
      api.contractModel(contractState).then(res => {
        // console.log(res)
        if (res.code === 0) {
          this.contractTemplateOptions = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取关联协议范本
    getSupplyTemplate() {
      const contractState = {
        contractState: 1
      }
      api.supplymentTemplate(contractState).then(res => {
        // console.log(res)
        if (res.code === 0) {
          this.contractSupplyOptions = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 弃用
    recursionClassificationArr(arr) {
      // console.log(arr)
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].children === undefined || arr[i].children.length === 0) {
          arr[i].children = undefined
        } else {
          this.recursionClassificationArr(arr[i].children)
        }
      }
      return arr
    },
    init() {
      api.getAllClassification(this.queryForm).then(res => {
        // console.log(res)
        if (res.code === 0) {
          this.tableData = res.data.list
          this.total = res.data.total
          this.queryForm.pageNum = res.data.pageNum
          this.newForm.contractName = ''
          this.newForm.cmsmall = ''
        }
      }).catch(err => {
        console.log(err)
      })
    },
    currentPageChange(page) {
      this.queryForm.pageNum = page
      this.init()
    },
    // 查询
    onQuery() {
      this.queryForm.pageNum = 1
      this.init()
    },
    // 重置
    onReset() {
      this.queryForm.searchName = ''
      this.init()
    },
    // 新增
    onNewAdd() {
      this.dialogTitle = '新增'
      this.newAddShow = true
      api.getClassificationTree().then(res => {
        // console.log(res)
        if (res.code === 0) {
          // console.log(this.recursionClassificationArr(res.data))
          this.classificationOptions = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 编辑
    onEdit() {
      if (this.selectionTableItem.length > 1) {
        return this.$message({
          type: 'warning',
          message: '仅能选择一项'
        })
      } else if (this.selectionTableItem.length === 0) {
        return this.$message({
          type: 'warning',
          message: '请选择需要编辑的列表项'
        })
      }
      this.editClassificationInfo(this.selectionTableItem[0].id)
    },
    // 修改合同范本信息
    editClassificationInfo(id) {
      // debugger
      this.dialogTitle = '修改'
      this.recordId.id = id

      api.getClassificationTree().then(res => {
        console.log(res)
        if (res.code === 0) {
          // console.log(this.recursionClassificationArr(res.data))
          this.classificationOptions = res.data
        }
      }).catch(err => {
        console.log(err)
      })

      api.getClassificationDetails(this.recordId).then(res => {
        console.log(res)
        if (res.code === 0) {
          // 回显
          this.newForm.cname = res.data.cname
          this.newForm.sortNum = res.data.sortNum
          this.newForm.type = res.data.type
          this.newForm.status = res.data.status
          this.status = Boolean(res.data.status)
          this.newForm.cmsmall = res.data.cmsmall
          this.newForm.contractName = res.data.contractName
          this.pathName = res.data.pcname
        }
      }).catch(err => {
        console.log(err)
      })

      this.newAddShow = true
    },
    handleClose() {
      this.newAddShow = false
    },
    // 保存
    saveContractClassification(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.dialogTitle === '新增') {
            delete this.newForm.contractName
            delete this.newForm.cmsmall
            if (this.status) {
              this.newForm.status = 1
            } else {
              this.newForm.status = 0
            }
            api.newAddClassification(this.newForm).then(res => {
              // console.log(res)
              if (res.code === 0) {
                this.init()
              }
            }).catch(err => {
              console.log(err)
            })
          } else {
            delete this.newForm.contractName
            delete this.newForm.cmsmall
            const target = Object.assign(this.newForm, this.recordId)
            api.updateClassification(target).then(res => {
              // console.log(res)
              if (res.code === 0) {
                this.init()
              }
            }).catch(err => {
              console.log(err)
            })
          }
          this.resetForm(this.newForm)
          this.fileList = []
          this.newAddShow = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 重置表单
    resetForm(formField) {
      for (const formFieldKey in formField) {
        if (formFieldKey === 'status') {
          formField[formFieldKey] = 0
        } else {
          formField[formFieldKey] = ''
        }
      }
    },
    // 取消
    cancel() {
      this.resetForm(this.newForm)
      this.fileList = []
      this.newAddShow = false
    },
    // 路径选择 赋值pid
    handleChange() {
      // console.log(this.pathName)
      this.classificationOptions.forEach((item, index) => {
        if (item.cname === this.pathName) {
          this.newForm.pid = item.id
        }
      })
    }
  }
}
</script>

<style scoped>
.contract-container{
  width: 100%;
  height: 100%;
  padding: 20px;
}
.pagination{
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  margin-top: 20px;
}
</style>
