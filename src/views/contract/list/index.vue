<template>
  <div class="p-list">
    <div v-if="!isCheckDetailShow" class="p-box">
      <div class="p-box-form">
        <el-form ref="subPackageForm" :inline="true" :model="subPackageForm" class="demo-form-inline">
          <el-form-item label="项目编码" prop="projectCode">
            <el-input v-model="subPackageForm.projectCode" placeholder="请输入项目编码"></el-input>
<!--            <el-autocomplete-->
<!--              @keyup.enter.native="handleQuery"-->
<!--              style="width: 200px"-->
<!--              clearable-->
<!--              v-model="subPackageForm.projectCode"-->
<!--              :fetch-suggestions="querySearchAsyncProjectCode"-->
<!--              placeholder="请选择项目编码"-->
<!--              @clear="subPackageForm.projectCode = null" />-->
<!--            <el-select v-model="subPackageForm.projectCode" clearable filterable placeholder="请选择项目编码">-->
<!--              <el-option v-for="(item, index) in projectList" :key="index" :label="item.projectCode" :value="item.projectCode"></el-option>-->
<!--            </el-select>-->
          </el-form-item>
          <el-form-item label="项目名称" prop="projectName">
            <el-input v-model="subPackageForm.projectName" placeholder="请输入项目名称"></el-input>
<!--            <el-autocomplete-->
<!--              @keyup.enter.native="handleQuery"-->
<!--              style="width: 200px"-->
<!--              clearable-->
<!--              v-model="subPackageForm.projectName"-->
<!--              :fetch-suggestions="querySearchAsyncProjectName"-->
<!--              placeholder="请选择项目名称"-->
<!--              @clear="subPackageForm.projectName = null" />-->
<!--            <el-select v-model="subPackageForm.projectName" clearable filterable placeholder="请选择项目名称">-->
<!--              <el-option v-for="(item, index) in projectList" :key="index" :label="item.projectName" :value="item.projectName"></el-option>-->
<!--            </el-select>-->
          </el-form-item>
<!--          <el-form-item label="是否是承包人范围内" prop="isInternalScope">-->
<!--            <el-select v-model="subPackageForm.isInternalScope" clearable placeholder="请选择是否是承包人范围内">-->
<!--              <el-option label="是" :value="1"></el-option>-->
<!--              <el-option label="否" :value="0"></el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
          <el-form-item label="总包合同名称" prop="generalContractName">
            <el-input v-model="subPackageForm.generalContractName" placeholder="请输入总包合同名称"></el-input>
<!--            <el-autocomplete-->
<!--              @keyup.enter.native="handleQuery"-->
<!--              style="width: 200px"-->
<!--              clearable-->
<!--              v-model="subPackageForm.generalContractName"-->
<!--              :fetch-suggestions="querySearchAsyncGeneralContractName"-->
<!--              placeholder="请选择总包合同名称"-->
<!--              @clear="subPackageForm.generalContractName = null" />-->
<!--            <el-select v-model="subPackageForm.generalContractName" clearable filterable placeholder="请选择总包合同名称">-->
<!--              <el-option v-for="(item, index) in projectList" :key="index" :label="item.generalContractName" :value="item.generalContractName"></el-option>-->
<!--            </el-select>-->
          </el-form-item>
          <el-form-item label="经营模式" prop="contractingMode">
            <el-select v-model="subPackageForm.contractingMode" clearable filterable placeholder="请选择经营模式">
              <el-option v-for="(item, index) in businessPatternList" :key="index" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分公司" prop="branchOfficeCode">
            <el-select v-model="subPackageForm.branchOfficeCode" clearable filterable placeholder="请选择分公司">
              <el-option v-for="(item, index) in deptOptions" :key="index" :label="item.deptName" :value="item.phone"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="onQuery">查询</el-button>
            <el-button icon="el-icon-refresh" @click="onReset('subPackageForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="p-box-table">
        <el-table
          :data="projectList"
          border
          style="width: 100%"
        >
          <el-table-column fixed="left" type="index" width="50" label="序号"></el-table-column>
          <el-table-column fixed="left" prop="projectCode" align="center" label="项目编码" width="200"></el-table-column>
          <el-table-column prop="projectName" align="center" label="项目名称" width="500"></el-table-column>
          <el-table-column prop="generalContractName" align="center" label="总包合同" width="500"></el-table-column>
          <el-table-column prop="generalContractCode" align="center" label="总包合同编码" width="500"></el-table-column>
          <el-table-column prop="contractTotal" align="center" label="合同总数" width="200"></el-table-column>
          <el-table-column prop="signedTotal" align="center" label="已签合同" width="200"></el-table-column>
          <el-table-column
            prop="totalAmount"
            label="总合同金额"
            width="150"
            align="center"
          />
          <el-table-column width="150" prop="applyMoneyString" align="center" label="累计申请金额"></el-table-column>
          <el-table-column width="150" prop="reallyMoneyString" align="center" label="累计实付金额"></el-table-column>
          <el-table-column width="150" prop="overMoneyString" align="center" label="累计已支付金额"></el-table-column>
          <el-table-column width="150" prop="reserveMoneyString" align="center" label="累计预留金额"></el-table-column>
          <el-table-column width="150" prop="copeMoneyString" align="center" label="累计应付金额"></el-table-column>
          <el-table-column width="150" prop="deductionMoneyString" align="center" label="累计扣款金额"></el-table-column>
<!--          <el-table-column-->
<!--            prop="deductionMoneyString"-->
<!--            label="项目总金额"-->
<!--            width="150"-->
<!--            align="center"-->
<!--          />-->
          <el-table-column prop="contractTypeStr" align="center" label="经营模式" width="200"></el-table-column>
          <el-table-column fixed="right" prop="ppeople" align="center" label="操作" width="200">
            <template slot-scope="scope">
              <el-button
                @click="checkDetail(scope.row,'detail')"
                type="text"
                size="small">
                查看详情
              </el-button>
              <el-button
                  @click="$router.push({path: '/request/requestmanage', query: {projectCode: scope.row.projectCode, approvalStatus: 'COMPLETED'}})"
                  type="text"
                  size="small">
                查看请款详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="p-box-pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :total="projectListTotal"
          @current-change="changePagination">
        </el-pagination>
      </div>
    </div>
    <!-- 详情 -->
    <div v-else>
      <el-tabs v-if="projectOptions && projectOptions.length !== 0 " type="card" v-model="activeProjectName" @tab-click="handleActiveProjectNameClick">
        <el-tab-pane v-for="(item, index) in projectOptions" :key="index" :label="item.contractName" :name="'' + index">
        </el-tab-pane>
      </el-tabs>
      <div class="sc-table">
        <div class="sc-list-title">
          <div class="sc-list-title-top">
            <span class="sc-list-title-icon" />
            <span class="sc-list-title-text">总包合同信息</span>
          </div>
        </div>
        <div class="sc-table-list">
          <el-table
            :data="contractList"
            border
            style="width: 100%"
          >
            <el-table-column
              prop="projectCode"
              align="center"
              label="总包项目编码"
              width="200"
              fixed="left"
            >
            </el-table-column>
            <el-table-column
              prop="projectName"
              align="center"
              label="总包项目名称"
              width="500"
            >
            </el-table-column>
            <el-table-column
              prop="generalContractName"
              align="center"
              label="总包合同名称"
              width="500"
            >
            </el-table-column>
            <el-table-column prop="generalContractCode" align="center" label="总包合同编号" width="200"></el-table-column>
            <el-table-column prop="generalContractAmount" align="center" label="总包合同金额" width="200"></el-table-column>
<!--            <el-table-column prop="contractTypeStr" align="center" label="经营模式" width="200"></el-table-column>-->
            <el-table-column prop="contractTypeStr" align="center" label="项目承包模式" width="200"></el-table-column>
          </el-table>
        </div>
      </div>
      <div class="sub-pkg">
        <div class="sub-pkg-form">
          <el-form ref="subPackageForm" :inline="true" :model="subPackageForm" class="demo-form-inline">
            <el-form-item label="合同名称" prop="contractName">
              <el-select v-model="subPackageForm.contractName" clearable filterable placeholder="请选择合同名称">
                <el-option v-for="(item, index) in projectMsgDtoList" :key="index" :label="item.contractName" :value="item.contractName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="合同分类" prop="classifyCode">
              <el-select v-model="subPackageForm.classifyCode" clearable filterable placeholder="请选择合同分类">
                <el-option v-for="(item, index) in contractClassify" :key="index" :label="item.cname" :value="item.classifyCode"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否是承包人范围内" prop="isInternalScope">
              <el-select v-model="subPackageForm.isInternalScope" clearable placeholder="请选择是否是承包人范围内">
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="onSubQuery">查询</el-button>
              <el-button icon="el-icon-refresh" @click="onSubReset('subPackageForm')">重置</el-button>
              <el-button icon="el-icon-back" @click="onBack">返回</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="sc-list-title">
          <div class="sc-list-title-top">
            <span class="sc-list-title-icon" />
            <span class="sc-list-title-text">承包人/专业分包合同信息</span>
          </div>
        </div>
        <div class="sc-table-list">
          <el-table
            :data="projectMsgDtoList"
            border
            height="600"
            style="width: 100%"
          >
            <el-table-column
              fixed="left"
              prop="contractName"
              align="center"
              label="合同名称"
              width="500" />
            <el-table-column
              prop="contractCode"
              align="center"
              label="合同编号"
              width="300"
            />
            <el-table-column
              prop="classifyName"
              align="center"
              label="合同分类"
              width="150"
            />
            <el-table-column prop="projectName" align="center" label="下游分包工程名称" width="500"></el-table-column>
            <el-table-column width="150" prop="contractAmount" align="center" label="总合同金额"></el-table-column>
            <el-table-column width="150" prop="applyMoneyString" align="center" label="累计申请金额"></el-table-column>
            <el-table-column width="150" prop="reallyMoneyString" align="center" label="累计实付金额"></el-table-column>
            <el-table-column width="150" prop="overMoneyString" align="center" label="累计已支付金额"></el-table-column>
            <el-table-column width="150" prop="reserveMoneyString" align="center" label="累计预留金额"></el-table-column>
            <el-table-column width="150" prop="copeMoneyString" align="center" label="累计应付金额"></el-table-column>
            <el-table-column width="150" prop="deductionMoneyString" align="center" label="累计扣款金额"></el-table-column>

            <el-table-column prop="subContractFinishTime" align="center" label="计划合同签订完成时间" width="200"></el-table-column>
            <el-table-column prop="isInternalScope" align="center" label="是否是承包人范围内" width="200">
              <template slot-scope="scope">
                <span v-if="scope.row.isInternalScope === 0">否</span>
                <span v-else>是</span>
              </template>
            </el-table-column>
            <el-table-column prop="contractor" align="center" label="承包人"></el-table-column>
            <el-table-column prop="stampTime" align="center" label="完成时间"></el-table-column>
            <el-table-column fixed="right" prop="contractState" align="center" label="合同状态" width="150">
              <template slot-scope="scope">
                <span v-if="scope.row.contractState === '1'">草稿</span>
                <span v-if="scope.row.contractState === '2'">审批中</span>
                <span v-if="scope.row.contractState === '3'">变更中</span>
                <span v-if="scope.row.contractState === '4'">已完成</span>
                <span v-if="scope.row.contractState === '5'">履约中</span>
                <span v-if="scope.row.contractState === '6'">已终止</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="100" fixed="right">
              <template slot-scope="scope">
                <el-button
                    type="text"
                    size="small"
                    @click="$router.push({path: '/request/requestmanage', query: {contractCode: scope.row.contractCode}})">
                  查看请款详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { treeselect } from "@/api/system/dept";
import api from '@/api/work/contract'
import contract from "../../../api/work/contract";
export default {
  name: 'List',
  data() {
    return {
      isCheckDetailShow: false,
      activeProjectName: '0',
      // 获取项目tab列表参数
      moreParams: {
        requestType: 1,
        pageSize: 10,
        pageNum: 1,
        projectCode: '',
        projectName: '',
        deptCode: ''
      },
      projectOptions: [],
      // 分包合同form
      subPackageForm: {
        requestType: '1',
        pageSize: 10,
        pageNum: 1,
        projectName: null,
        projectCode: null,
        classifyCode: null,
        isInternalScope: null,
        generalContractName: null,
        contractingMode: null,
        branchOfficeCode: null
      },
      listContractByProjectCodeParams: {
        projectCode: '',
        // 合同编号
        contractCode: '',
        // 合同名称
        contractName: ''
      },
      // 查看详情参数
      checkDetailParams: {
        projectCode: null
      },
      // 获取项目表格参数
      projectListParams: {
        deptCode: '',
        pageNum: 1,
        pageSize: 10,
        requestType: '1'
      },
      // 项目表格
      projectList: [],
      projectListTotal: 0,
      // 总包表格
      contractList: [],
      projectMsgDtoList: [],
      contractClassify: [],
      businessPatternList: [],
      deptOptions: []
    }
  },
  mounted() {
    if(this.$route.path == '/contract/list'){
      if(this.$route.query.from == 'cockpit'){
        this.checkContractDetail();
      }else{
         this.listCenterAuthList()
         this.listMoreProjectList()
         this.getContractTemplateTypeClassify()
         this.listBusinessPatternTreeSelect()
         this.getDeptAndProjectTree()
      }
    }

  },
  watch:{

    $route(route) {
      if(this.$route.path == '/contract/list'){
        if(this.$route.query.from == 'cockpit'){
          this.checkContractDetail();
        }
      }
    },

  },

  methods: {
    //驾驶仓合同类型跳转
    checkContractDetail(){
      this.subPackageForm.projectCode = this.$route.query.projectCode;
      let contractType;
      api.getContractTemplateTypeClassify().then(res => {
        if (res.code === 0) {
          this.contractClassify = res.data;
          contractType = this.contractClassify.find(item =>item.cname == this.$route.query.contractType);
        }
        return api.listCenterAuthList(this.subPackageForm)
      }).then(res => {
        if(res.code === 0) {
          this.projectList = res.data.projectMsgDtoList;
          this.projectListTotal = res.data.total;
          if(this.$route.query.contractType == 'detail'){
            this.checkDetail(this.projectList[0],'detail');
          }else{
            this.checkDetail(this.projectList[0],contractType.classifyCode);
          }

        }
      }).catch(err => {

      })


    },
    handleQuery() {

    },
    // 项目编码模糊查询
    querySearchAsyncProjectCode() {

    },
    // 项目名称 模糊查询
    querySearchAsyncProjectName() {

    },
    querySearchAsyncGeneralContractName() {

    },
    // 经营模式
    listBusinessPatternTreeSelect() {
      api.listBusinessPatternTreeSelect().then(res => {
        if (res.code === 0) {
          this.businessPatternList = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getDeptAndProjectTree() {
      contract.getDeptAndProjectTree().then(res => {
        if(res.code === 0) {
          this.deptOptions = res.data
        }
      })
    },
    onSubReset(formName) {
      this.subPackageForm.pageNum = 1
      this.subPackageForm.pageSize = 10
      this.subPackageForm.contractName = null
      this.subPackageForm.classifyCode = null
      this.subPackageForm.isInternalScope = null
      this.$refs[formName].resetFields()
      this.onSubQuery()
    },
    // 获取合同分类下拉选
    getContractTemplateTypeClassify() {
      api.getContractTemplateTypeClassify().then(res => {
        if (res.code === 0) {
          this.contractClassify = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    changePagination(val) {
      this.subPackageForm.pageNum = val
      this.listCenterAuthList()
    },
    // 获取 项目列表数据
    listCenterAuthList() {
      api.listCenterAuthList(this.subPackageForm).then(res => {
        if(res.code === 0) {
          this.projectList = res.data.projectMsgDtoList
          this.projectListTotal = res.data.total
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取项目tab 列表
    listMoreProjectList() {
      api.listMoreProjectList(this.moreParams).then(res => {
        if(res.code === 0) {
          // this.projectOptions = res.data.projectMsgDtoList
          this.checkDetailParams.projectCode = this.projectOptions[0].projectCode
          this.checkProjectListItem()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取 分包列表
    getContractProjectList() {
      api.getContractProjectListByProjectCode(this.subPackageForm).then(res => {
        if(res.code === 0) {
          this.projectMsgDtoList = res.data.contractList
          this.contractList = res.data.projectMsgDtoList
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 切换项目 tab
    handleActiveProjectNameClick(tab, event) {
      const { index } = tab
      this.activeProjectName = index
      this.checkDetailParams.projectCode = this.projectOptions[Number(index)].projectCode
      this.subPackageForm.projectCode = this.projectOptions[Number(index)].projectCode
      this.checkProjectListItem()
      this.getContractProjectList()
    },
    // 查询
    onQuery() {
      this.subPackageForm.pageNum = 1
      this.listCenterAuthList()
    },
    // 重置
    onReset(formName) {
      this.$refs[formName].resetFields()
      this.listCenterAuthList()
    },
    onSubQuery() {
      this.getContractProjectList()
    },
    // 详情 返回
    onBack() {
      this.isCheckDetailShow = false
      this.subPackageForm.projectCode = null
      this.listCenterAuthList()
    },
    // 项目列表 查看详情
    checkDetail(item,contractType) {
      if(contractType){
        if(contractType == 'detail'){
          this.subPackageForm.classifyCode = null
        }else{
          this.subPackageForm.classifyCode = contractType
        }
      }else{
        return false;
      }
      // contractType&&(this.subPackageForm.classifyCode = contractType);
      this.isCheckDetailShow = true
      this.checkDetailParams.projectCode = item.projectCode
      this.subPackageForm.projectCode = item.projectCode
      this.checkProjectListItem()
      this.getContractProjectList()
    },
    // 获取详情列表 --- 总包
    checkProjectListItem() {
      api.checkProjectListItem(this.checkDetailParams).then(res => {
        if(res.code === 0) {
          this.projectOptions = res.data
          // this.projectMsgDtoList = res.data.projectMsgDtoList
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss">
.p-list{
  width: 100%;
  height: 100%;
  padding: 15px;
  display: flex;
  flex-direction: column;
  .p-box{
    display: flex;
    flex-direction: column;
    .p-box-pagination{
      display: flex;
      flex-direction: row-reverse;
      /*padding-right: 20px;*/
      padding-top: 10px;
    }
  }
  .sc-table{
    width: 100%;
    background-color: #fff;
    // border-radius: 10px;
    // box-shadow: 10px 10px 30px 10px #eeeeee;
    // padding: 20px 20px;
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
        // margin-top: 10px;
        .sc-list-title-icon{
          width: 6px;
          height: 15px;
          background-color: #3A78F1;
          margin-top: 5px;
        }
        .sc-list-title-text{
          font-size: 15px;
          // padding-top: 20px;
          margin-left: 10px;
        }
      }
    }
    .sc-table-list{
      width: 100%;
      padding: 20px;
    }
  }
  .sub-pkg{
    width: 100%;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    .sub-pkg-form{
      padding-left: 20px;
    }
    .sc-list-title{
      width: 100%;
      display: flex;
      justify-content: space-between;
      .sc-list-title-top{
        padding-left: 20px;
        display: flex;
        flex-direction: row;
        // margin-top: 10px;
        .sc-list-title-icon{
          width: 6px;
          height: 15px;
          background-color: #3A78F1;
          margin-top: 5px;
        }
        .sc-list-title-text{
          font-size: 15px;
          // padding-top: 20px;
          margin-left: 10px;
        }
      }
    }
    .sc-table-list{
      width: 100%;
      padding: 20px;
    }
  }
}
</style>
