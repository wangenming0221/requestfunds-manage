<template>
  <div class="supplier-container">
    <div class="sc_table_operate">
      <div>
        <el-button type="primary" @click="submitContractPlan" style="margin-right: 15px;">提交</el-button>
        <el-button type="primary" @click="addAllPackage" style="margin-right: 15px;">添加总包合同</el-button>
        <el-button icon="el-icon-back" @click="onBack" style="margin-right: 15px;">返回</el-button>
      </div>
    </div>
    <div class="sc-table">
      <div class="sc-list-title">
        <div class="sc-list-title-top">
          <span class="sc-list-title-icon" />
          <span class="sc-list-title-text">总包合同信息</span>
        </div>
      </div>
      <div class="sc-table-list">
        <el-table
          :data="tableData"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="generalProjectCode"
            align="center"
            label="总包项目编码"
          >
<!--            <template slot-scope="scope">-->
<!--              <el-button v-if="!projectCodeSelectionShow && !submitContractParams.generalProjectCode" type="text" @click="selectProjectCode">请选择总包项目编码</el-button>-->
<!--              <div v-else-if="!projectCodeSelectionShow && submitContractParams.generalProjectCode">-->
<!--                {{ submitContractParams.generalProjectCode }}-->
<!--                <i class="el-icon-edit" style="cursor: pointer;color: #3A78F1" @click="selectProjectCode"></i>-->
<!--              </div>-->
<!--              <div v-else>-->
<!--                <el-select v-model="submitContractParams.generalProjectCode" clearable placeholder="请选择总包项目编码" @change="handleSelectProjectCode">-->
<!--                  <el-option-->
<!--                    v-for="item in projectCodeOptions"-->
<!--                    :key="item"-->
<!--                    :label="item"-->
<!--                    :value="item"-->
<!--                  />-->
<!--                </el-select>-->
<!--                <el-button type="success" size="mini" icon="el-icon-check" circle @click="editProjectCode" />-->
<!--                <el-button type="info" size="mini" icon="el-icon-close" circle @click="editProjectCode" />-->
<!--              </div>-->
<!--            </template>-->
          </el-table-column>
          <el-table-column
            prop="generalProjectName"
            align="center"
            label="总包项目名称"
          >
<!--            <template slot-scope="scope">-->
<!--              <div>{{ submitContractParams.generalProjectName }}</div>-->
<!--            </template>-->
          </el-table-column>
          <el-table-column
            prop="generalContractName"
            align="center"
            label="总包合同名称"
          >
<!--            <template slot-scope="scope">-->
<!--              <el-button v-if="!contractNameInputShow && !submitContractParams.generalContractName" type="text" @click="inputContractName">填写总包项目名称</el-button>-->
<!--              <div v-else-if="!contractNameInputShow && submitContractParams.generalContractName">-->
<!--                {{ submitContractParams.generalContractName }}-->
<!--                <i class="el-icon-edit" style="cursor: pointer;color: #3A78F1" @click="inputContractName"></i>-->
<!--              </div>-->
<!--              <div v-else style="display: flex;flex-direction: row">-->
<!--                <div style="width: 70%">-->
<!--                  <el-input v-model="submitContractParams.generalContractName" placeholder="请输入总包合同名称" />-->
<!--                </div>-->
<!--                <div style="padding-top: 5px;padding-left: 5px">-->
<!--                  <el-button type="success" size="mini" icon="el-icon-check" circle @click="editContractName" />-->
<!--                </div>-->
<!--                <div style="padding-top: 5px;padding-left: 10px">-->
<!--                  <el-button type="info" size="mini" icon="el-icon-close" circle @click="editContractName" />-->
<!--                </div>-->
<!--              </div>-->
<!--            </template>-->
          </el-table-column>
          <el-table-column
            prop="generalUserName"
            align="center"
            label="合同相关人员"
          >
<!--            <template slot-scope="scope">-->
<!--              <el-button v-if="!relevancePersonShow && !submitContractParams.generalUserName" type="text" @click="addRelevancePerson">添加相关人员</el-button>-->
<!--              <div v-else-if="!relevancePersonShow && submitContractParams.generalUserName">-->
<!--                {{ submitContractParams.generalUserName }}-->
<!--                <i class="el-icon-edit" style="cursor: pointer;color: #3A78F1" @click="addRelevancePerson"></i>-->
<!--              </div>-->
<!--              <div v-else>-->
<!--                <el-select v-model="submitContractParams.generalUserName" filterable placeholder="请选择总包相关人员" @change="handleSelectContractAboutPerson">-->
<!--                  <el-option-->
<!--                    v-for="item in contractPersonOptions"-->
<!--                    :key="item.id"-->
<!--                    :label="item.personName"-->
<!--                    :value="item.personName"-->
<!--                  />-->
<!--                </el-select>-->
<!--                <el-button type="success" size="mini" icon="el-icon-check" circle @click="editRelevancePerson" />-->
<!--                <el-button type="info" size="mini" icon="el-icon-close" circle @click="editRelevancePerson" />-->
<!--              </div>-->
<!--            </template>-->
          </el-table-column>
          <el-table-column
            prop="generalContractFinishTime"
            align="center"
            label="计划合同签订完成时间"
          >
<!--            <template slot-scope="scope">-->
<!--              <el-button v-if="!signTimeShow && !submitContractParams.generalContractFinishTime" type="text" @click="addSignTime">添加计划签订完成时间</el-button>-->
<!--              <div v-else-if="!signTimeShow && submitContractParams.generalContractFinishTime">-->
<!--                {{ submitContractParams.generalContractFinishTime }}-->
<!--                <i class="el-icon-edit" style="cursor: pointer;color: #3A78F1" @click="addSignTime"></i>-->
<!--              </div>-->
<!--              <div v-else style="display: flex;flex-direction: row">-->
<!--                <div style="width: 70%;display: flex">-->
<!--                  <el-date-picker-->
<!--                    v-model="submitContractParams.generalContractFinishTime"-->
<!--                    type="date"-->
<!--                    value-format="yyyy-MM-dd"-->
<!--                    format="yyyy-MM-dd"-->
<!--                    placeholder="选择计划合同签订完成时间"-->
<!--                  />-->
<!--                </div>-->
<!--                <div style="padding-top: 5px;padding-left: 5px">-->
<!--                  <el-button type="success" size="mini" icon="el-icon-check" circle @click="editSignTime" />-->
<!--                </div>-->
<!--                <div style="padding-top: 5px;padding-left: 10px">-->
<!--                  <el-button type="info" size="mini" icon="el-icon-close" circle @click="editSignTime" />-->
<!--                </div>-->
<!--              </div>-->
<!--            </template>-->
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="sc-table">
      <div class="sc-list-title">
        <div class="sc-list-title-top">
          <span class="sc-list-title-icon" />
          <span class="sc-list-title-text">分包合同信息</span>
        </div>
        <div class="sc-list-title-search">
          <span class="is"><el-input v-model="partyContractSearch.searchName" placeholder="请输入分包合同信息"></el-input></span>
          <span class="is"><el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button></span>
          <span><el-button icon="el-icon-refresh" @click="clearSearch">重置</el-button></span>
        </div>
      </div>
      <div class="sc-table-list">
        <el-table
          ref="partTable"
          :data="partContract"
          max-height="800"
          border
          style="width: 100%"
          @select="selectItem"
          @selection-all="selectAllPartyContract"
        >
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            align="center"
            label="名称"
          >
            <template slot="header">
              <div>名称</div>
            </template>
            <template slot-scope="scope">
              <span v-if="scope.row.hasOwnProperty('cname')">{{ scope.row.cname }}</span>
              <span v-if="!scope.row.hasOwnProperty('cname')">{{ scope.row.contractName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="pcode"
            align="center"
            label="合同相关人员"
          >
            <template slot-scope="scope">
              <el-button v-if="!isShowPerson.includes(scope.row.id) && !scope.row.generalUserName" type="text" @click="addPartyRelevancePerson(scope.row)">添加相关人员</el-button>
              <div v-else-if="isShowPerson.includes(scope.row.id) && scope.row.generalUserName">
                {{ scope.row.generalUserName }}
                <i class="el-icon-edit" style="cursor: pointer;color: #3A78F1" @click="addPartyRelevancePerson(scope.row)"></i>
              </div>
              <div v-else>
                <el-select v-model="scope.row.generalUserName" filterable placeholder="请选择总包相关人员">
                  <el-option
                    v-for="item in contractPersonOptions"
                    :key="item.id"
                    :label="item.personName"
                    :value="item.personName"
                  />
                </el-select>
                <el-button type="success" size="mini" icon="el-icon-check" circle @click="editPartyRelevancePerson(scope.row)" />
                <el-button type="info" size="mini" icon="el-icon-close" circle @click="editPartyRelevancePerson(scope.row)" />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="ppeople"
            align="center"
            label="计划合同签订完成时间"
          >
            <template slot-scope="scope">
              <el-button v-if="!isShowSignTime.includes(scope.row.id) && !scope.row.generalContractFinishTime" type="text" @click="addPartySignTime(scope.row)">添加计划签订完成时间</el-button>
              <div v-else-if="isShowSignTime.includes(scope.row.id) && scope.row.generalContractFinishTime">
                {{ scope.row.generalContractFinishTime }}
                <i class="el-icon-edit" style="cursor: pointer;color: #3A78F1" @click="addPartySignTime(scope.row)"></i>
              </div>
              <div v-else style="display: flex;flex-direction: row">
                <div style="width: 70%;display: flex">
                  <el-date-picker
                    v-model="scope.row.generalContractFinishTime"
                    type="date"
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                    placeholder="选择计划合同签订完成时间"
                  />
                </div>
                <div style="padding-top: 5px;padding-left: 5px">
                  <el-button type="success" size="mini" icon="el-icon-check" circle @click="editPartySignTime(scope.row)" />
                </div>
                <div style="padding-top: 5px;padding-left: 10px">
                  <el-button type="info" size="mini" icon="el-icon-close" circle @click="editPartySignTime(scope.row)" />
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            align="center"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                v-if="!scope.row.hasOwnProperty('childrenTag')"
                @click="newAddPartyPackage(scope.row)"
              >
                新增
              </el-button>
              <el-button
                v-if="scope.row.hasOwnProperty('childrenTag')"
                type="text"
                size="small"
                @click="deleteNewAddItem(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog
      title="添加总包合同"
      :visible.sync="addAllPackageContractDialogVisible"
      width="20%"
      :before-close="handleClose">
      <div>
        <el-form label-position="top" ref="submitContractParams" :model="submitContractParams" label-width="150px">
          <el-form-item label="总包项目编码" prop="generalProjectCode">
            <el-select style="width: 100%" v-model="submitContractParams.generalProjectCode" clearable placeholder="请选择总包项目编码" @clear="clearSelectProjectCode" @change="handleSelectProjectCode">
              <el-option
                v-for="item in projectCodeOptions"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="总包项目名称" prop="generalProjectName">
            <el-input v-model="submitContractParams.generalProjectName" readonly></el-input>
          </el-form-item>
          <el-form-item label="总包合同名称" prop="generalContractName">
            <el-input v-model="submitContractParams.generalContractName" placeholder="请输入总包合同名称" />
          </el-form-item>
          <el-form-item label="合同相关人员" prop="generalUserName">
            <el-select style="width: 100%" v-model="submitContractParams.generalUserName" filterable placeholder="请选择总包相关人员" @change="handleSelectContractAboutPerson">
              <el-option
                v-for="item in contractPersonOptions"
                :key="item.id"
                :label="item.personName"
                :value="item.personName"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="计划合同签订完成时间" prop="generalContractFinishTime">
            <el-date-picker
              style="width: 100%"
              v-model="submitContractParams.generalContractFinishTime"
              type="date"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              placeholder="选择计划合同签订完成时间"
            />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="confirmAdd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import contractApi from '@/api/work/contract'
export default {
  name: 'ProjectTable',
  props: {
    deptCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      addAllPackageContractDialogVisible: false,
      queryForm: {
        pName: '',
        pType: '',
        pPeople: '',
        pageSize: 10,
        pageNum: 1
      },
      total: null,
      tableData: [],
      moreParams: {
        requestType: 1,
        pageSize: 10,
        pageNum: 1
      },
      optionsContractCode: [],
      optionsContractName: [],
      contractPersonOptions: [],
      // 总包项目编码下拉框展示
      projectCodeSelectionShow: false,
      // 总包合同名称输入框展示
      contractNameInputShow: false,
      // 添加相关人员下拉框展示
      relevancePersonShow: false,
      signTimeShow: false,
      // 提交总包合同计划参数
      submitContractParams: {
        generalProjectCode: '',
        generalProjectName: '',
        generalContractName: '',
        generalUserCode: '',
        generalUserName: '',
        generalContractFinishTime: '',
        subContractList: []
      },
      // 分包合同列表
      partContract: [],
      // 分包合同控制相关人员、签订时间显隐
      isShowPerson: [],
      isShowSignTime: [],
      recordAddNewArr: [],
      // 分包选中项
      selectedOptions: [],
      partyContractSearch: {
        searchName: ''
      },
      // 获取项目列表参数
      moreParams: {
        requestType: 1,
        pageSize: 10,
        pageNum: 1,
        projectCode: '',
        projectName: '',
        deptCode: ''
      }
    }
  },
  mounted() {
    this.getAllContractProjectCodeList()
    this.getContractAboutPerson()
    // this.listMoreProjectList()
  },
  methods: {
    handleClose() {
      this.$refs.submitContractParams.resetFields()
      this.addAllPackageContractDialogVisible = false
    },
    confirmAdd() {
      this.tableData.push({
        generalProjectCode: this.submitContractParams.generalProjectCode,
        generalProjectName: this.submitContractParams.generalProjectName,
        generalContractName: this.submitContractParams.generalContractName,
        generalUserName: this.submitContractParams.generalUserName,
        generalContractFinishTime: this.submitContractParams.generalContractFinishTime
      })
      this.$refs.submitContractParams.resetFields()
      this.addAllPackageContractDialogVisible = false
    },
    // 添加总包合同
    addAllPackage() {
      this.addAllPackageContractDialogVisible = true
      // console.log(this.tableData)
    },
    // 回显
    echoContractInformation(item) {
      const params = {
        planId: null
      }
      params.planId = item.id
      contractApi.getContractDetailsByPlanId(params).then(res => {
        if (res.code === 0) {
          let recordIndex = 0
          // console.log(res)
          this.submitContractParams.generalProjectName = res.data.generalProjectName
          this.submitContractParams.generalProjectCode = res.data.generalProjectCode
          this.submitContractParams.generalContractName = res.data.generalContractName
          this.submitContractParams.generalUserName = res.data.generalUserName
          this.submitContractParams.generalContractFinishTime = res.data.generalContractFinishTime
          this.submitContractParams.subContractList = res.data.subContractList
          for (let i = 0, len = this.partContract.length; i < len; i++) {
            for (let j = 0, lens = res.data.subContractList.length; j < lens; j++) {
              if (this.partContract[i].contractName === res.data.subContractList[j].cname) {
                this.$refs.partTable.toggleRowSelection(this.partContract[i], true)
                recordIndex = i + 1
                this.isShowPerson.push(this.partContract[i].id)
                this.isShowSignTime.push(this.partContract[i].id)
                this.partContract[i].generalUserName = res.data.subContractList[j].subUserName
                this.partContract[i].generalContractFinishTime = res.data.subContractList[j].subContractFinishTime
                res.data.subContractList.splice(j, 1)
              }
            }
          }
          for (let j = 0, lens = res.data.subContractList.length; j < lens; j++) {
            this.partContract.splice(recordIndex, 0, res.data.subContractList[j])
            this.isShowPerson.push(this.partContract[recordIndex].id)
            this.isShowSignTime.push(this.partContract[recordIndex].id)
            this.partContract[recordIndex].generalUserName = res.data.subContractList[j].subUserName
            this.partContract[recordIndex].generalContractFinishTime = res.data.subContractList[j].subContractFinishTime
            this.$refs.partTable.toggleRowSelection(this.partContract[recordIndex], true)
            recordIndex += 1
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    checkAllContractInformation() {
      for (let i = 0, len = this.partContract.length; i < len; i++) {
        this.$refs.partTable.toggleRowSelection(this.partContract[i], true)
      }
    },
    selectItem(selection) {
      const selectedLocalSelection = []
      this.submitContractParams.subContractList = selection
      for (let i = 0, len = selection.length; i < len; i++) {
        selectedLocalSelection.push(selection[i].id)
      }
      window.sessionStorage.setItem('selectedPlan', selectedLocalSelection.join('-'))
    },
    // 全选
    selectAllPartyContract(selection) {
      const selectedLocalSelection = []
      this.submitContractParams.subContractList = selection
      for (let i = 0, len = selection.length; i < len; i++) {
        selectedLocalSelection.push(selection[i].id)
      }
      window.sessionStorage.setItem('selectedPlan', selectedLocalSelection.join('-'))
    },
    clearSearch() {
      this.partyContractSearch.searchName = ''
      this.getPartContract()
      setTimeout(() => {
        const selectKey = window.sessionStorage.getItem('selectedPlan')
        const arr = selectKey.split('-')
        for (let i = 0, len = arr.length; i < len; i++) {
          for (let j = 0, lens = this.partContract.length; j < lens; j++) {
            if (this.partContract[j].id === Number(arr[i])) {
              console.log(11111)
              this.$refs.partTable.toggleRowSelection(this.partContract[j], true)
            }
          }
        }
      }, 1000)
    },
    // 新增分包合同信息
    newAddPartyPackage(item) {
      const newItem = Object.assign({}, item)
      newItem.contractName = item.contractName + '-' + (this.recordAddNewArr.length + 1)
      newItem.childrenTag = true
      for (let i = 0, len = this.partContract.length; i < len; i++) {
        if (item.id === this.partContract[i].id) {
          newItem.id = Math.random() * 10
          this.partContract.splice(i + 1, 0, newItem)
          this.recordAddNewArr.push(newItem)
        }
      }
    },
    // 删除指定项
    deleteNewAddItem(item) {
      console.log(item)
      for (let i = 0, len = this.partContract.length; i < len; i++) {
        if (item.id === this.partContract[i].id) {
          this.partContract.splice(i, 1)
          this.recordAddNewArr.pop()
        }
      }
    },
    handleSearch() {
      this.getPartContract()
    },
    // 获取分包合同
    getPartContract() {
      contractApi.getPartyPackageInformation(this.partyContractSearch).then(res => {
        if (res.code === 0) {
          this.partContract = res.data
          // console.log(this.partContract, 'partContract')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 设置checked
    setChecked(arr) {
      for (let i = 0, len = arr.length; i < len; i++) {
        if (arr[i].hasOwnProperty('contractModelList') && arr[i].contractModelList.length !== 0) {
          this.setChecked(arr[i].contractModelList)
        } else {
          this.$set(arr[i], 'isChecked', false)
        }
      }
      return arr
    },
    // 获取合同相关人员
    getContractAboutPerson() {
      contractApi.getContractAboutPerson().then(res => {
        console.log(res)
        if (res.code === 0) {
          this.contractPersonOptions = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取总包项目编码列表
    getAllContractProjectCodeList() {
      contractApi.getAllContractProjectCodeList().then(res => {
        if (res.code === 0) {
          this.projectCodeOptions = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 根据项目编码返显项目名称
    getFilialeProjectNameByProjectCode(code) {
      const params = {
        projectCode: ''
      }
      params.projectCode = code
      contractApi.getFilialeProjectNameByProjectCode(params).then(res => {
        if (res.code === 0) {
          this.submitContractParams.generalProjectName = res.data.projectName
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handleSelectContractAboutPerson(val) {
      for (let i = 0, len = this.contractPersonOptions.length; i < len; i++) {
        if (this.contractPersonOptions[i].personName === val) {
          this.submitContractParams.generalUserCode = this.contractPersonOptions[i].personCode
        }
      }
    },
    handleSelectProjectCode(val) {
      this.getFilialeProjectNameByProjectCode(val)
    },
    clearSelectProjectCode() {
      this.submitContractParams.generalProjectName = null
    },
    addPartyRelevancePerson(item) {
      this.isShowPerson.push(item.id)
    },
    editPartyRelevancePerson(item) {
      for (let i = 0, len = this.isShowPerson.length; i < len; i++) {
        if (item.id === this.isShowPerson[i]) {
          this.isShowPerson.splice(i, 1)
        }
      }
    },
    addPartySignTime(item) {
      this.isShowSignTime.push(item.id)
    },
    editPartySignTime(item) {
      for (let i = 0, len = this.isShowSignTime.length; i < len; i++) {
        if (item.id === this.isShowSignTime[i]) {
          this.isShowSignTime.splice(i, 1)
        }
      }
    },
    selectProjectCode() {
      this.projectCodeSelectionShow = true
    },
    editProjectCode() {
      this.projectCodeSelectionShow = false
    },
    inputContractName() {
      this.contractNameInputShow = true
    },
    editContractName() {
      this.contractNameInputShow = false
    },
    addRelevancePerson() {
      this.relevancePersonShow = true
    },
    editRelevancePerson() {
      this.relevancePersonShow = false
    },
    addSignTime() {
      this.signTimeShow = true
    },
    editSignTime() {
      this.signTimeShow = false
    },
    // 返回
    onBack() {
      this.echoShow = false
      this.$parent.showProjectMore(true)
    },
    isCheckSelection(arr) {
      for (let i = 0, len = arr.length; i < len; i++) {
        if (arr[i].hasOwnProperty('contractModelList') && arr[i].contractModelList.length !== 0) {
          this.isCheckSelection(arr[i].contractModelList)
        } else {
          if (arr[i].isChecked === true) {
            this.selectedOptions.push(arr[i])
          }
        }
      }
    },
    // 提交总包合同计划
    submitContractPlan() {
      this.$confirm('请确认当前总包合同下的分包合同信息是否完成匹配', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        let params = {
          generalContractList: [],
          subContractList: []
        }
        this.submitContractParams.subContractList = this.submitContractParams.subContractList.map((item) => {
          if (!item.generalUserName) {
            this.getPartContract()
            return this.$message({
              type: 'warning',
              message: '请添加合同相关人员'
            })
          } else {
            return {
              contractModelId: item.id,
              classifyCode: item.classifyId,
              cname: item.contractName,
              subUserCode: this.findSubUserCode(item.generalUserName),
              subUserName: item.generalUserName,
              subContractFinishTime: item.generalContractFinishTime
            }
          }
        })
        contractApi.submitContractPlan(this.submitContractParams).then(res => {
          console.log(res)
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: res.msg
            })
            this.$parent.showProjectMore(true)
            this.$parent.getContractPlanList()
            this.$parent.listCenterAuthList()
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
    },
    findSubUserCode(targetName) {
      for (let i = 0, len = this.contractPersonOptions.length; i < len; i++) {
        if (targetName === this.contractPersonOptions[i].personName) {
          return this.contractPersonOptions[i].personCode
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .supplier-container{
    width: 100%;
    height: 100%;
    .sc_table_operate{
      width: 100%;
      margin-top: 20px;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 10px 10px 30px 10px #eeeeee;
      padding: 20px 20px;
      display: flex;
      flex-direction: row-reverse;
    }
    .sc-table{
      width: 100%;
      margin-top: 20px;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 10px 10px 30px 10px #eeeeee;
      padding: 20px 20px;
      display: flex;
      flex-direction: column;
      .sc-list-title{
        width: 100%;
        display: flex;
        justify-content: space-between;
        .sc-list-title-top{
          padding-left: 20px;
          display: flex;
          flex-direction: row;
          margin-top: 10px;
          .sc-list-title-icon{
            width: 6px;
            height: 15px;
            background-color: #3A78F1;
            margin-top: 20px;
          }
          .sc-list-title-text{
            font-size: 15px;
            padding-top: 20px;
            margin-left: 10px;
          }
        }
        .sc-list-title-search{
          display: flex;
          flex-direction: row;
          padding-right: 20px;
          padding-top: 20px;
          .is{
            margin-right: 15px;
          }
        }
        .sc-list-submit{
          margin-top: 20px;
          margin-right: 18px;
        }
      }
      .sc-table-list{
        width: 100%;
        padding: 20px 20px;
      }
    }
  }
  .new-add-contain{
    width: 50%;
    height: 500px;
    overflow-y: scroll;
  }
  .new-add-contain::-webkit-scrollbar{
    display: none;
  }
  .supply-info{
    width: 100%;
    font-size: 20px;
    font-weight: bolder;
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
    .supply-info-title{

    }
    .el-icon-circle-plus-outline, .el-icon-remove-outline{
      cursor: pointer;
    }
  }
  .payee{
    margin: 0;
    padding: 0;
    list-style-type: none;
  }
  .pagination{
    width: 100%;
    display: flex;
    justify-content: center;
    /*flex-direction: row-reverse;*/
    margin-top: 20px;
  }
</style>
