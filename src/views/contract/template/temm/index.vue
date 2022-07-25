<template>
  <div class="contract-container">
    <div class="title">
      <div class="titleText">模板类型</div>
      <div class="titleBtn">
        <el-button icon="el-icon-plus" @click="onNewAdd">新建</el-button>
        <el-button icon="el-icon-edit" @click="editContractTemplateInfo">编辑</el-button>
      </div>
    </div>
    <div class="t-content">
      <div class="t-tree">
        <div class="userTitle">
          <el-input v-model="templateType" clearable placeholder="请输入合同分类" @input="handleSearchTemplateType" />
        </div>
        <div v-for="(item, index) in contractTemplateOptions" :key="item.id" :class="{ userItem: true, userItemSelected: isShow === index}" @click="selectRole(index)">
          <div class="userRole">
            <span>{{ item.cname }}</span>
          </div>
        </div>
      </div>
      <div class="template-contain">
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          row-key="id"
          default-expand-all
          :tree-props="{children: 'childList', hasChildren: 'hasChildren'}"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="contractName"
            align="center"
            label="合同范本名称"
          />
          <el-table-column
            prop="approveName"
            align="center"
            label="关联审批流程名称"
          />
          <!-- <el-table-column
            prop="approveCode"
            align="center"
            label="关联审批流程编号"
          /> -->
          <el-table-column
            prop="state"
            align="center"
            label="使用状态"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.state === 1">开启</span>
              <span v-if="scope.row.state === 0">关闭</span>
              <span v-if="scope.row.state === 3">历史数据</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="createPeople"
            align="center"
            label="创建人"
          />
          <el-table-column
            prop="createTime"
            align="center"
            label="创建时间"
          />
        </el-table>
        <div class="pagination">
          <el-pagination
            background
            :current-page="queryForm.pageNum"
            :page-size="queryForm.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total"
            @current-change="currentPageChange"
          />
        </div>
      </div>
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="newAddShow"
      width="30%"
      :before-close="handleClose"
    >
      <div class="new-add-contain">
        <el-form ref="newForm" :rules="newFormRules" :model="newForm" label-width="120px">
          <el-form-item label="合同范本名称" prop="contractName">
            <el-input v-model="newForm.contractName" maxlength="50" />
          </el-form-item>
          <el-form-item label="关联审批流程" prop="approveName">
            <el-select v-model="newForm.approveName" style="width: 100%" filterable placeholder="请选择关联审批流程" @change="selectApproveCode">
              <el-option
                v-for="(item, index) in options"
                :key="index"
                :label="item.workflowName"
                :value="item.workflowName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="范本类型" prop="contractState">
            <el-radio-group v-model="newForm.contractState">
              <el-radio :label="0" border size="medium">合同范本</el-radio>
              <el-radio :label="1" border size="medium">补充协议范本</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="newForm.contractState === 0" label="关联补充协议">
            <el-select v-model="relevanceSupplementAgreementName" filterable clearable placeholder="请选择关联补充协议" @change="handleSupplyRelevance">
              <el-option
                v-for="(item, index) in relevanceSupplementAgreement"
                :key="index"
                :label="item.contractName"
                :value="item.contractName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="使用状态">
            <el-switch
              v-model="newForm.state"
              active-color="#13ce66"
              inactive-color="#dddddd"
            />
          </el-form-item>
          <el-form-item label="文件上传" prop="file">
            <el-upload
              action=""
              class="upload-demo"
              :auto-upload="false"
              :on-change="uploadFile"
              :on-remove="removeFile"
              :file-list="fileList"
              :limit="1"
              accept=".doc"
              :on-exceed="handleExceed"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传word格式文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveContractTemplate('newForm')">保 存</el-button>
        <el-button @click="cancel('newForm')">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/work/contract'
export default {
  name: 'ContractTemplate',
  data() {
    return {
      queryForm: {
        classifyId: '',
        contractName: '',
        pageSize: 10,
        pageNum: 1
      },
      isShow: 0,
      total: null,
      tableData: [],
      dialogTitle: '',
      newAddShow: false,
      newForm: {
        modelTwoId: '',
        contractName: '',
        approveName: '合同申请',
        approveCode: '',
        contractState: null,
        state: null,
        file: null,
        classifyId: null
      },
      newFormRules: {
        contractName: [
          { required: true, message: '请输入合同范本名称', trigger: 'blur' }
        ],
        approveName: [
          { required: true, message: '请选择关联审批流程', trigger: 'change' }
        ],
        contractState: [
          { required: true, message: '请选择范本类型', trigger: 'change' }
        ]
      },
      recordId: {
        id: ''
      },
      fileList: [],
      options: [],
      contractTemplateOptions: [],
      selectClassifyParams: {
        classifyId: null,
        pageNum: 1,
        pageSize: 10
      },
      // 范本类型搜索关键字
      templateType: '',
      // 选中编辑项
      selectedType: [],
      // 关联补充协议
      relevanceSupplementAgreement: [],
      relevanceSupplementAgreementName: ''
    }
  },
  mounted() {
    this.selectApprove()
    this.getContractTemplate()
    // this.init()
    this.getRelevanceSupplement()
    console.log(this.newForm)
  },
  methods: {
    // 获取补充协议下拉选
    getRelevanceSupplement() {
      api.getRelevanceSupplement().then(res => {
        if (res.code === 0) {
          this.relevanceSupplementAgreement = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handleSupplyRelevance(val) {
      for (let i = 0, len = this.relevanceSupplementAgreement.length; i < len; i++) {
        if (val === this.relevanceSupplementAgreement[i].contractName) {
          this.newForm.modelTwoId = this.relevanceSupplementAgreement[i].id
        }
      }
    },
    // 文件上传限制
    handleExceed(files, fileList) {
      console.log('limit')
      console.log(files)
      console.log(fileList)
      if (files.raw.size > 500 * 1024) {
        return this.$message({
          type: 'warning',
          message: '当前文件已超过500KB'
        })
      }
    },
    handleSearchTemplateType() {
      for (let i = 0, len = this.contractTemplateOptions.length; i < len; i++) {
        if (this.templateType === this.contractTemplateOptions[i].cname) {
          this.contractTemplateOptions = [this.contractTemplateOptions[i]]
        } else if (this.templateType === '') {
          this.getContractTemplate()
        }
      }
    },
    handleSelectionChange(val) {
      this.selectedType = val
    },
    // 选择范本类型
    selectRole(index) {
      console.log(this.contractTemplateOptions[index])
      this.isShow = index
      this.selectClassifyParams.classifyId = this.contractTemplateOptions[index].id
      this.queryForm.classifyId = this.contractTemplateOptions[index].id
      // debugger
      this.newForm.classifyId = this.contractTemplateOptions[index].id
      this.queryForm.pageNum = 1;
      api.getContractTemplate(this.selectClassifyParams).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.tableData = res.data.records
          this.total = res.data.total
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取关联合同分类
    getContractTemplate() {
      api.getContractTemplateTypeClassify().then(res => {
        // console.log(res)
        if (res.code === 0) {
          this.contractTemplateOptions = res.data
          this.queryForm.classifyId = res.data[this.isShow].id
          this.newForm.classifyId = res.data[this.isShow].id
          this.init()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    init() {
      api.getContractTemplate(this.queryForm).then(res => {
        if (res.code === 0) {
          this.tableData = res.data.records
          // this.queryForm.pageNum = res.data.current
          this.total = res.data.total
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 点选关联
    selectApprove() {
      api.getApprove().then(res => {
        console.log(res)
        if (res.code === 0) {
          this.options = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    selectApproveCode(val) {
      console.log(val)
      this.options.forEach((item, index) => {
        if (item.workflowName === val) {
          this.newForm.approveName = item.workflowName
          this.newForm.approveCode = item.workflowCode
        }
      })
    },
    currentPageChange(page) {
      this.queryForm.pageNum = page
      this.init()
    },
    // 查询
    onQuery() {
      this.init()
    },
    // 重置
    onReset() {
      this.queryForm.contractName = ''
      this.init()
    },
    // 新增
    onNewAdd() {
      this.dialogTitle = '新增'
      this.newAddShow = true
      console.log(this.newForm)
    },
    // 修改合同范本信息
    editContractTemplateInfo() {
      if (this.selectedType.length > 1) {
        return this.$message({
          type: 'warning',
          message: '仅能选中一项'
        })
      } else if (this.selectedType.length === 0) {
        return this.$message({
          type: 'warning',
          message: '至少选中一项'
        })
      }
      if (this.selectedType[0].state === 3) {
        return this.$message({
          type: 'warning',
          message: '历史数据不支持编辑'
        })
      }
      this.dialogTitle = '修改'
      // debugger
      console.log(this.selectedType, '修改')
      this.recordId.id = this.selectedType[0].id
      this.newForm.classifyId = this.selectedType[0].classifyId
      this.newForm.modelTwoId = this.selectedType[0].modelTwoId

      const fileObject = {
        name: '',
        url: ''
      }

      api.getContractTemplateDetails(this.recordId).then(res => {
        if (res.code === 0) {
          this.newForm.contractName = res.data.contractName
          this.newForm.approveCode = res.data.approveCode
          this.newForm.approveName = res.data.approveName
          this.newForm.contractState = res.data.contractState
          this.newForm.state = Boolean(res.data.state)
          this.relevanceSupplementAgreementName = res.data.modelName
          fileObject.name = res.data.url.split('/')[1]
          fileObject.url = 'https://jindubao.oss-cn-beijing.aliyuncs.com/' + res.data.url
          this.fileList.push(fileObject)
        }
      }).catch(err => {
        console.log(err)
      })

      this.newAddShow = true
    },
    handleClose() {
      this.resetForm(this.newForm)
      this.fileList = []
      this.newAddShow = false
    },
    // 保存
    saveContractTemplate(formName) {
      // 判断被编辑范本是否上传文件
      if (this.fileList.length === 0 && this.newForm.file === null) {
        return this.$message({
          type: 'warning',
          message: '没有上传文件'
        })
      }

      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.dialogTitle === '新增') {
            // debugger
            this.newForm.state = Number(this.newForm.state)

            if (this.newForm.hasOwnProperty('id')) {
              delete this.newForm.id
            }
            console.log(this.newForm)
            const formData = new FormData()
            for (const newFormKey in this.newForm) {
              formData.append(newFormKey, this.newForm[newFormKey])
            }

            api.contractTemplateNewAdd(formData).then(res => {
              if (res.code === 0) {
                this.getContractTemplate()
                this.$message({
                  type: 'success',
                  message: '操作成功'
                })
                this.fileList = []
                this.newAddShow = false
                this.newForm.file = null
                this.newForm.state = null
              }
            }).catch(err => {
              console.log(err)
            })
          } else {
            // 判断被编辑范本的使用状态
            if (this.newForm.state === true) {
              this.newForm.state = 1
            } else {
              this.newForm.state = 0
            }

            if (this.newForm.file === null) {
              delete this.newForm.file
            }

            if (this.newForm.modelTwoId === null) {
              delete this.newForm.modelTwoId
            }

            const target = Object.assign(this.newForm, this.recordId)
            const formData = new FormData()
            for (const newFormKey in target) {
              formData.append(newFormKey, target[newFormKey])
            }
            api.updateContractTemplate(formData).then(res => {
              if (res.code === 0) {
                this.getContractTemplate()
                this.$message({
                  type: 'success',
                  message: '操作成功'
                })
                this.resetForm(this.newForm)
                this.fileList = []
                this.newAddShow = false
                this.newForm.file = null
                this.newForm.state = null
                this.newForm.approveName = '合同申请'
                this.newForm.contractState = 10
              } else {
                return this.$message({
                  type: 'warning',
                  message: res.msg
                })
              }
            }).catch(err => {
              console.log(err)
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 重置表单
    resetForm(formField) {
      for (const formFieldKey in formField) {
        formField[formFieldKey] = null
      }
    },
    // 文件上传
    uploadFile(file) {
      console.log(file)
      this.newForm.file = file.raw
    },
    removeFile(file, fileList) {
      console.log(file)
      console.log(fileList)
      this.fileList = fileList
      this.newForm.file = null
    },
    // 取消
    cancel(formName) {
      this.$refs[formName].resetFields()
      // this.resetForm(this.newForm)
      this.fileList = []
      this.newAddShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
.contract-container{
  width: 100%;
  padding: 20px;
}
.pagination{
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  margin-top: 20px;
}
.userTitle{
  width: 100%;
  height: 60px;
  text-align: center;
  color: #333437;
  font-size: 16px;
  border-bottom: 1px solid #eeeeee;
  padding-bottom: 15px;
}
.userItem{
  width: 100%;
  height: 40px;
  margin-bottom: 15px;
  display: flex;
  justify-content: center;
  cursor: pointer;
  border-radius: 10px;
}
.userRole{
  width: 100%;
  display: flex;
  justify-content: center;
  line-height: 40px;
  font-size: 13px;
  flex-direction: row;
}
// .userRole:first-child{
//   color: #3A78F1;
// }
.userItemSelected{
  /*background-color: #3A78F1;*/
  color: #3A78F1;
  font-weight: bolder;
  /*box-shadow: 2px 2px 10px 2px #3A78F1;*/
}
.t-content{
  width: 100%;
  height: 750px;
  display: flex;
  flex-direction: row;
  margin-top: 20px;
}
.t-tree{
  width: 15%;
  border-radius: 10px;
  box-shadow: 0px 0px 10px -5px #eeeeee;
  border: 1px solid #eeeeee;
  background-color: #ffffff;
  padding: 20px 20px;
  margin-right: 20px;
  overflow-y: scroll;
}
.t-tree::-webkit-scrollbar{
  display: none;
}
.template-contain{
  width: calc(85% - 20px);
  border-radius: 10px;
  box-shadow: 0px 0px 10px -5px #eeeeee;
  border: 1px solid #eeeeee;
  background-color: #ffffff;
  padding: 20px 20px;
  overflow-y: scroll;
}
.template-contain::-webkit-scrollbar{
  display: none;
}
.title{
  width: 100%;
  height: 55px;
  background-color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  padding-left: 20px;
  line-height: 55px;
  display: flex;
  justify-content: space-between;
  border-radius: 10px;
  box-shadow: 0px 0px 10px -5px #eeeeee;
  border: 1px solid #eeeeee;
}
.titleBtn{
  padding-right: 20px;
}
</style>
