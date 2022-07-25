<template>
  <div class="app-container">
    <el-form ref="projectForm" :model="form" label-width="150px" :rules="rules">
      <div class="common-nav">
        <div class="common-nav_title">项目管理</div>
        <div>
          <span >阶段版本</span>
          <el-select v-model="projectVersionId" placeholder="请选择阶段版本" @change="changeVersion" style="margin:0 10px 0 5px">
            <el-option v-for="item in versionOptions" :key="item.projectVersionId"
                       :label="item.versionName"
                       :value="item.projectVersionId">
            </el-option>
          </el-select>
          <el-button type="primary" @click="editForm()" :disabled="isEditing==1||onlyReadEdit||(!businessRole&&!financeRole&&!costRole)">编辑</el-button>
          <el-button type="primary" @click="verifySubmitForm()" :disabled="isEditing==1||(!businessRole&&!financeRole&&!costRole)">提交版本</el-button>
          <el-button  @click="goBack()">返回</el-button>
        </div>
      </div>
      <el-row :gutter="24" class="row-style">
        <el-col :span="24" class="common-title">项目基本信息</el-col>
        <el-col :span="8">
          <el-form-item prop="isSettlement" label="是否是结算版本">
            <el-select v-model="form.isSettlement" placeholder="请选择是否是结算版本"  :disabled="!isFormEditing||!businessRole">
              <el-option v-for="item in trueOrFalseOptions" :key="item.name"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="projectGeneralCode" label="投标工程项目编码">
            <el-input v-model="form.projectGeneralCode"  placeholder="请输入投标工程项目编码" :disabled="!isFormEditing||!businessRole"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="projectGeneralName" label="投标工程项目名称">
            <el-input v-model="form.projectGeneralName"  placeholder="请输入投标工程项目名称" :disabled="!isFormEditing||!businessRole"/>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item prop="projectApproveName" label="立项名称">
            <el-input v-model="form.projectApproveName"  placeholder="请输入立项名称" :disabled="!isFormEditing||!businessRole"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="companyName" label="所属分公司">
            <el-select v-model="form.companyCode" placeholder="请选择所属分公司" @change="changeCompanyCode" :disabled="!isFormEditing||!businessRole">
              <el-option v-for="item in companyOptions"
                         :key="item.deptId"
                         :label="item.deptName"
                         :value="item.phone">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="code" label="总包项目编码" >
            <el-input v-model="form.code"  placeholder="请输入总包项目编码" :disabled="!isFormEditing||!businessRole"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="name" label="总包项目名称">
            <el-input v-model="form.name"  placeholder="请输入总包项目名称" :disabled="!isFormEditing||!businessRole"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="mdgCode" label="集团MDG编码">
            <el-input v-model="form.mdgCode"  placeholder="请输入集团MDG编码" :disabled="!isFormEditing||!businessRole"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="mdgName" label="集团MDG项目名称">
            <el-input v-model="form.mdgName"  placeholder="请输入集团MDG项目名称" :disabled="!isFormEditing||!businessRole"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="isNewPartyOpen" label="是否为新开拓区域（甲方）">
            <el-select v-model="form.isNewPartyOpen" placeholder="请选择是否为新开拓区域（甲方）" :disabled="!isFormEditing||!businessRole">
              <el-option v-for="item in trueOrFalseOptions" :key="item.name"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="tenderingCompanyName" label="投标公司名头">
            <el-input v-model="form.tenderingCompanyName"  placeholder="请输入投标公司名头" :disabled="!isFormEditing||!businessRole"/>
          </el-form-item>

        </el-col>
        <el-col :span="8">
          <el-form-item prop="isNewOpneUp" label="是否是新开拓区域">
            <el-select v-model="form.isNewOpneUp" placeholder="请选择是否是新开拓区域" :disabled="!isFormEditing||!businessRole">
              <el-option v-for="item in trueOrFalseOptions" :key="item.name"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="managementModel" label="经营模式">
            <el-select v-model="form.managementModel" placeholder="请选择经营模式" :disabled="!isFormEditing||!businessRole">
              <el-option v-for="item in managementModelOptions" :key="item.name"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="projectType" label="项目类型">
            <el-select v-model="form.projectType" placeholder="请选择项目类型" :disabled="!isFormEditing||!businessRole">
              <el-option v-for="item in projectTypeOptions" :key="item.name"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="isLaterTakeOver" label="是否是后期接手">
            <el-select v-model="form.isLaterTakeOver" placeholder="请选择是否是后期接手" :disabled="!isFormEditing||!businessRole">
              <el-option v-for="item in trueOrFalseOptions" :key="item.name"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="totalBuildingNumber" label="合同范围内楼栋总数">
            <el-input v-model.number="form.totalBuildingNumber"  placeholder="请输入合同范围内楼栋总数" :disabled="!isFormEditing||!businessRole"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-col :span="4" style="line-height: 100px;font-weight: 700;text-align: center;">
            项目地点
          </el-col>
          <el-col :span="20">
            <el-col :span="5">
              <el-form-item prop="provinceName" label="省" label-width="55px">
                <el-input v-model="form.provinceName"  placeholder="请输入省" :disabled="!isFormEditing||!businessRole"/>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item prop="cityName" label="市" label-width="37px">
                <el-input v-model="form.cityName"  placeholder="请输入市" :disabled="!isFormEditing||!businessRole"/>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item prop="areaName" label="县/区" label-width="57px">
                <el-input v-model="form.areaName"  placeholder="请输入县/区" :disabled="!isFormEditing||!businessRole"/>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item prop="address" label="详细地址" label-width="90px">
                <el-input v-model="form.address"  placeholder="请输入详细地址" :disabled="!isFormEditing||!businessRole"/>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item prop="longitude" label="经度" label-width="55px">
                <el-input v-model="form.longitude"  placeholder="请输入经度" :disabled="!isFormEditing||!businessRole"/>
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item prop="latitude" label="纬度" label-width="55px">
                <el-input v-model="form.latitude"  placeholder="请输入纬度" :disabled="!isFormEditing||!businessRole"/>
              </el-form-item>
            </el-col>
          </el-col>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="buildingTypeName" label="建筑类型">
            <el-input v-model="form.buildingTypeName"  placeholder="请输入建筑类型" :disabled="!isFormEditing||!businessRole"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="homeArea" label="建筑面积（㎡）">
            <el-input v-model.number="form.homeArea"  placeholder="请输入建筑面积（㎡）" :disabled="!isFormEditing||!businessRole"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="showArea" label="展示面积（㎡）">
            <el-input v-model.number="form.showArea"  placeholder="请输入展示面积（㎡）" :disabled="!isFormEditing||!businessRole"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="basicType" label="基础类型">
            <el-input v-model="form.basicType"  placeholder="请输入基础类型" :disabled="!isFormEditing||!businessRole"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="projectStartDate" label="施工预计开始日期" >
            <el-date-picker
                v-model="form.projectStartDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择施工预计开始日期"
                :disabled="!isFormEditing||!businessRole"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="projectEndDate" label="施工预计结束日期">
            <el-date-picker
                v-model="form.projectEndDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择施工预计结束日期"
                :disabled="!isFormEditing||!businessRole"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="filingProjectName" label="备案项目名称">
            <el-input v-model="form.filingProjectName"  placeholder="请输入备案项目名称" :disabled="!isFormEditing||!businessRole"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="deliveryStandard" label="交付标准">
            <el-select v-model="form.deliveryStandard" placeholder="请选择交付标准" :disabled="!isFormEditing||!businessRole">
              <el-option v-for="item in deliveryStandardOptions" :key="item.name"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="isContainShowRegion" label="是否包含展示区">
            <el-select v-model="form.isContainShowRegion" placeholder="请选择是否包含展示区" :disabled="!isFormEditing||!businessRole">
              <el-option v-for="item in trueOrFalseOptions" :key="item.name"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="common-title">甲方相关信息</el-col>
        <el-col :span="8">
          <el-form-item prop="regionName" label="建设单位（甲方）对应区域">
            <el-input v-model="form.regionName"  placeholder="请输入建设单位（甲方）对应区域" :disabled="!isFormEditing||!businessRole"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="biddingCompanyName" label="招标公司名头">
            <el-input v-model="form.biddingCompanyName"  placeholder="请输入招标公司名头" :disabled="!isFormEditing||!businessRole"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="projectHeadPartyA" label="甲方项目总">
            <el-input v-model="form.projectHeadPartyA"  placeholder="请输入甲方项目总" :disabled="!isFormEditing||!businessRole"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="projectEngineerPartyA" label="甲方项目工程师">
            <el-input v-model="form.projectEngineerPartyA"  placeholder="请输入甲方项目工程师" :disabled="!isFormEditing||!businessRole"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="filingProjectNamePartyA" label="甲方备案项目名称">
            <el-input v-model="form.filingProjectNamePartyA"  placeholder="请输入甲方备案项目名称" :disabled="!isFormEditing||!businessRole"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="projectCodePartyA" label="甲方项目编码">
            <el-input v-model="form.projectCodePartyA"  placeholder="请输入甲方项目编码" :disabled="!isFormEditing||!businessRole"/>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="common-title">履约保证金缴纳情况</el-col>
        <el-col :span="8">
          <el-form-item prop="generalContractMoneyCost" label="总包合同预估金额(造价填写)">
            <el-input v-model.number="form.generalContractMoneyCost"  placeholder="请输入总包合同预估金额" :disabled="!isFormEditing||!costRole"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="paidBondInitiationCost" label="履约保证金/启动金（按立项内包含计算）应缴纳金额(造价填写)">
            <el-input v-model.number="form.paidBondInitiationCost"  placeholder="请输入履约保证金/启动金（按立项内包含计算）应缴纳金额" :disabled="!isFormEditing||!costRole"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="paidBondPartyACost" label="履约保证金/启动金（按甲方开发节奏计算）应缴纳金额(造价填写)">
            <el-input v-model.number="form.paidBondPartyACost"  placeholder="请输入履约保证金/启动金（按甲方开发节奏计算）应缴纳金额" :disabled="!isFormEditing||!costRole"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="paidBondCashFinance" label="履约保证金/启动金实缴纳金额（现金）(财务填写)">
            <el-input v-model.number="form.paidBondCashFinance"  placeholder="请输入履约保证金/启动金实缴纳金额（现金）" :disabled="!isFormEditing||!financeRole"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="paymentMethodCashFinance" label="缴纳方式(财务填写)">
            <el-input v-model="form.paymentMethodCashFinance"  placeholder="请输入缴纳方式" :disabled="!isFormEditing||!financeRole"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="paidBondSystemCost" label="履约保证金/启动金缴纳是否已符合制度要求(造价填写)">
            <el-select v-model="form.paidBondSystemCost" placeholder="请选择履约保证金/启动金缴纳是否已符合制度要求(造价填写)" :disabled="!isFormEditing||!costRole">
              <el-option v-for="item in trueOrFalseOptions" :key="item.name"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="paidBondNotCashFinance" label="履约保证金/启动金实缴纳金额（非现金）(财务填写)">
            <el-input v-model.number="form.paidBondNotCashFinance"  placeholder="请输入履约保证金/启动金实缴纳金额（非现金）" :disabled="!isFormEditing||!financeRole"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="paymentMethodNotCashFinance" label="缴纳方式（非现金）(财务填写)">
            <el-input v-model="form.paymentMethodNotCashFinance"  placeholder="请输入缴纳方式（非现金）" :disabled="!isFormEditing||!financeRole"/>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item prop="paidBondSystemFinance" label="履约保证金/启动金缴纳是否已符合制度要求(财务填写)">
            <el-select v-model="form.paidBondSystemFinance" placeholder="请选择履约保证金/启动金缴纳是否已符合制度要求(财务填写)" :disabled="!isFormEditing||!financeRole">
              <el-option v-for="item in trueOrFalseOptions" :key="item.name"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="common-title" style="text-align: center;background-color: rgb(206,206,206);">
          填写说明：<br/>
          重点提示：关于履约保证金审批一定要严格按照"履约保证金、启动金缴纳方案推行制度"执行，分公司财务、造价审批时共同执行！！！否则流程立即驳回。该节点审批步骤：造价、财务、运营。
        </el-col>
        <el-col :span="24" class="common-title">其他应用信息</el-col>
        <el-col :span="8">
          <el-form-item prop="performanceReserve" label="业绩储备">
            <el-select v-model="form.performanceReserve" placeholder="请选择业绩储备" :disabled="!isFormEditing||!businessRole">
              <el-option v-for="item in performanceReserveOptions" :key="item.name"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="extendedRange" label="扩展范围">
            <el-select v-model="form.extendedRange" placeholder="请选择扩展范围" :disabled="!isFormEditing||!businessRole">
              <el-option v-for="item in extendedRangeOptions" :key="item.name"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="isConstructionSystem" label="是否是科技建造体系">
            <el-select v-model="form.isConstructionSystem" placeholder="请选择是否是科技建造体系" :disabled="!isFormEditing||!businessRole">
              <el-option v-for="item in trueOrFalseOptions" :key="item.name"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="governmentExcellenceGoal" label="政府级创优目标">
            <el-select v-model="form.governmentExcellenceGoal" placeholder="请选择政府级创优目标" :disabled="!isFormEditing||!businessRole">
              <el-option v-for="item in governmentExcellenceGoalOptions" :key="item.name"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="governmentExcellenceGoalSecurity" label="政府级安全类创优目标">
            <el-select v-model="form.governmentExcellenceGoalSecurity" placeholder="请选择政府级安全类创优目标" :disabled="!isFormEditing||!businessRole">
              <el-option v-for="item in governmentExcellenceGoalSecurityOptions" :key="item.name"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="governmentExcellenceGoalQuality" label="政府级质量类创优目标">
            <el-select v-model="form.governmentExcellenceGoalQuality" placeholder="请选择政府级质量类创优目标" :disabled="!isFormEditing||!businessRole">
              <el-option v-for="item in governmentExcellenceGoalQualityOptions" :key="item.name"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="governmentExcellenceGoalTime" label="预计创优获奖时间">
            <el-date-picker
                v-model="form.governmentExcellenceGoalTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择预计创优获奖时间"
                :disabled="!isFormEditing||!businessRole"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="excellenceGoalBuildingNumber" label="创优对应楼栋号">
            <el-input v-model="form.excellenceGoalBuildingNumber"  placeholder="请输入创优对应楼栋号" :disabled="!isFormEditing||!businessRole"/>
          </el-form-item>
        </el-col>

        <table border=1 style="width:calc(100% - 50px);margin:0 25px 0 25px;box-sizing: border-box;" >
          <tr class="titleBgColor">
            <td colspan="6">科技建造应用情况</td>
          </tr>
          <tr>
            <td>模板体系</td>
            <td><el-checkbox v-model="applicationArrayVarchar[0].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[0].value}}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td rowspan = "4">已上市建筑机器人（非装修类）</td>
            <td><el-checkbox v-model="applicationArrayVarchar[1].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[1].value}}</td>
            <td><el-checkbox v-model="applicationArrayVarchar[2].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[2].value}}</td>
            <td><el-checkbox v-model="applicationArrayVarchar[3].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[3].value}}</td>
            <td><el-checkbox v-model="applicationArrayVarchar[4].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[4].value}}</td>
            <td><el-checkbox v-model="applicationArrayVarchar[5].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[5].value}}</td>
          </tr>
          <tr>
            <td><el-checkbox v-model="applicationArrayVarchar[6].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[6].value}}</td>
            <td><el-checkbox v-model="applicationArrayVarchar[7].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[7].value}}</td>
            <td><el-checkbox v-model="applicationArrayVarchar[8].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[8].value}}</td>
            <td><el-checkbox v-model="applicationArrayVarchar[9].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[9].value}}</td>
            <td><el-checkbox v-model="applicationArrayVarchar[10].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[10].value}}</td>
          </tr>
          <tr>
            <td><el-checkbox v-model="applicationArrayVarchar[11].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[11].value}}</td>
            <td><el-checkbox v-model="applicationArrayVarchar[12].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[12].value}}</td>
            <td><el-checkbox v-model="applicationArrayVarchar[13].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[13].value}}</td>
            <td><el-checkbox v-model="applicationArrayVarchar[14].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[14].value}}</td>
            <td><el-checkbox v-model="applicationArrayVarchar[15].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[15].value}}</td>
          </tr>
          <tr>
            <td><el-checkbox v-model="applicationArrayVarchar[16].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[16].value}}</td>
            <td><el-checkbox v-model="applicationArrayVarchar[17].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[17].value}}</td>
            <td><el-checkbox v-model="applicationArrayVarchar[18].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[18].value}}</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td  rowspan = "2">装修类机器人（多机联动）</td>
            <td><el-checkbox v-model="applicationArrayVarchar[19].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[19].value}}</td>
            <td><el-checkbox v-model="applicationArrayVarchar[20].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[20].value}}</td>
            <td><el-checkbox v-model="applicationArrayVarchar[21].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[21].value}}</td>
            <td><el-checkbox v-model="applicationArrayVarchar[22].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[22].value}}</td>
            <td><el-checkbox v-model="applicationArrayVarchar[23].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[23].value}}</td>
          </tr>
          <tr>
            <td><el-checkbox v-model="applicationArrayVarchar[24].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[24].value}}</td>
            <td><el-checkbox v-model="applicationArrayVarchar[25].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[25].value}}</td>
            <td><el-checkbox v-model="applicationArrayVarchar[26].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[26].value}}</td>
            <td></td>
            <td></td>
          </tr>

          <tr class="titleBgColor">
            <td colspan="6">智慧工地应用情况</td>
          </tr>
          <tr>
            <td  rowspan = "3">智慧工地选型</td>
            <td><el-checkbox v-model="applicationArrayVarchar[27].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[27].value}}</td>
            <td><el-checkbox v-model="applicationArrayVarchar[28].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[28].value}}</td>
            <td><el-checkbox v-model="applicationArrayVarchar[29].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[29].value}}</td>
            <td><el-checkbox v-model="applicationArrayVarchar[30].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[30].value}}</td>
            <td><el-checkbox v-model="applicationArrayVarchar[31].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[31].value}}</td>
          </tr>
          <tr>
            <td><el-checkbox v-model="applicationArrayVarchar[32].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[32].value}}</td>
            <td><el-checkbox v-model="applicationArrayVarchar[33].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[33].value}}</td>
            <td><el-checkbox v-model="applicationArrayVarchar[34].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[34].value}}</td>
            <td><el-checkbox v-model="applicationArrayVarchar[35].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[35].value}}</td>
            <td><el-checkbox v-model="applicationArrayVarchar[36].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[36].value}}</td>
          </tr>
          <tr>
            <td><el-checkbox v-model="applicationArrayVarchar[37].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[37].value}}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>

          <tr class="titleBgColor">
            <td colspan="6">四新应用情况</td>
          </tr>
          <tr>
            <td  rowspan = "4">四新选用类型</td>
            <td><el-checkbox v-model="applicationArrayVarchar[38].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[38].value}}</td>
            <td><el-checkbox v-model="applicationArrayVarchar[39].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[39].value}}</td>
            <td><el-checkbox v-model="applicationArrayVarchar[40].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[40].value}}</td>
            <td><el-checkbox v-model="applicationArrayVarchar[41].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[41].value}}</td>
            <td><el-checkbox v-model="applicationArrayVarchar[42].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[42].value}}</td>
          </tr>
          <tr>
            <td><el-checkbox v-model="applicationArrayVarchar[43].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[43].value}}</td>
            <td><el-checkbox v-model="applicationArrayVarchar[44].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[44].value}}</td>
            <td><el-checkbox v-model="applicationArrayVarchar[45].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[45].value}}</td>
            <td><el-checkbox v-model="applicationArrayVarchar[46].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[46].value}}</td>
            <td><el-checkbox v-model="applicationArrayVarchar[47].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[47].value}}</td>
          </tr>
          <tr>
            <td><el-checkbox v-model="applicationArrayVarchar[48].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[48].value}}</td>
            <td><el-checkbox v-model="applicationArrayVarchar[49].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[49].value}}</td>
            <td><el-checkbox v-model="applicationArrayVarchar[50].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[50].value}}</td>
            <td><el-checkbox v-model="applicationArrayVarchar[51].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[51].value}}</td>
            <td><el-checkbox v-model="applicationArrayVarchar[52].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[52].value}}</td>
          </tr>
          <tr>
            <td><el-checkbox v-model="applicationArrayVarchar[53].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[53].value}}</td>
            <td><el-checkbox v-model="applicationArrayVarchar[54].checked" :disabled="!isFormEditing||!businessRole"/>{{applicationArrayVarchar[54].value}}</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </table>



        <el-col :span="24" class="common-title">项目人员</el-col>
        <el-col :span="12">
          <el-form-item prop="projectManagerName" label="项目经理（建造师）">
            <el-autocomplete
                clearable
                class="autocomplete"
                v-model="form.projectManagerName"
                :fetch-suggestions="(queryString, cb) => querySearchAsyncBranch(queryString, cb, form.projectManagerName)"
                placeholder="请选择项目经理（建造师）"
                :disabled="!isFormEditing||!businessRole"
            ></el-autocomplete>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="projectManagerPhone" label="项目经理联系方式">
            <el-input v-model="form.projectManagerPhone"  placeholder="请输入项目经理联系方式" :disabled="!isFormEditing||!businessRole"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="constructionDirectorName" label="施工负责人">
            <el-autocomplete
                clearable
                class="autocomplete"
                v-model="form.constructionDirectorName"
                :fetch-suggestions="(queryString, cb) => querySearchAsyncBranch(queryString, cb, form.constructionDirectorName)"
                placeholder="请选择施工负责人"
                :disabled="!isFormEditing||!businessRole"
            ></el-autocomplete>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="constructionDirectorPhone" label="施工负责人联系方式">
            <el-input v-model="form.constructionDirectorPhone"  placeholder="请输入施工负责人联系方式" :disabled="!isFormEditing||!businessRole"/>
          </el-form-item>
        </el-col>

        <el-col :span="24" class="common-title">财务苑区</el-col>
        <el-col :span="24" class="mb20">
          <el-button type="primary" @click="getFinanceList()" :disabled="!isFormEditing||!businessRole">添加</el-button>
          <el-button type="primary" @click="createFinance.visible=true" :disabled="!isFormEditing||!businessRole">新增</el-button>
          <el-button type="primary" @click="delFinance()" :disabled="!isFormEditing||!businessRole">删除</el-button>
        </el-col>
        <el-table :data="form.projectFinanceList" class="mb20"  style="width: 100%" border @selection-change="changeFinanceList">
          <el-table-column type="selection" width="50" align="center"></el-table-column>
          <el-table-column prop="parkName" label="财务苑区名称" align="center" :show-overflow-tooltip="true" ></el-table-column>
          <el-table-column prop="parkCode" label="财务苑区编码" align="center" :show-overflow-tooltip="true" ></el-table-column>
        </el-table>

        <el-col :span="24" class="common-title">管理人员信息</el-col>
        <el-col :span="24" class="mb20">
          <el-button type="primary" @click="addPerson()" :disabled="!isFormEditing||!businessRole">
            添加
          </el-button>
          <el-button type="primary" @click="delPerson()" :disabled="!isFormEditing||!businessRole">
            删除
          </el-button>
        </el-col>
        <el-table :data="form.projectUserList" class="mb20"  style="width: 100%" border @selection-change="changeUserRelations">
          <el-table-column type="selection" width="50" align="center"></el-table-column>
          <el-table-column label="人员姓名" align="center" >
            <template slot-scope="scope">
              <el-autocomplete
                  clearable
                  class="autocomplete"
                  v-model="scope.row.userName"
                  :fetch-suggestions="(queryString, cb) => querySearchAsyncBranch(queryString, cb, scope.row.userName)"
                  placeholder="请输入"
              ></el-autocomplete>
            </template>
          </el-table-column>
          <el-table-column label="人员岗位" align="center" >
            <template slot-scope="scope">
              <el-select v-model="scope.row.positionName" placeholder="请输入">
                <el-option v-for="item in positionNameOptions" :key="item.name"
                           :label="item.name"
                           :value="item.id">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>


        <el-col :span="24" class="common-title">楼栋信息</el-col>
        <el-col :span="24" class="mb20">
          <el-button type="primary" @click="addtfloor()" :disabled="!isFormEditing||!businessRole">
            添加
          </el-button>
        </el-col>
        <el-table :data="form.projectBuildingList"  style="width: 100%" border>
          <el-table-column label="序号" align="center">
            <template slot-scope="scope">
              {{scope.$index + 1}}
            </template>
          </el-table-column>
          <el-table-column prop="buildingName" label="楼栋名称" align="center" width="160" />
          <el-table-column prop="buildingCode" label="楼栋编号" align="center" width="160" />
          <el-table-column prop="mdgCode" label="MDG楼栋编码" align="center" width="160" />
          <el-table-column prop="buildingContractor" label="楼栋承包人" align="center" width="160" />
          <el-table-column prop="houseTypeCode" label="户型编码" align="center" width="160" />
          <el-table-column prop="houseTypeName" label="户型" align="center" width="160" />
          <el-table-column prop="unitCount" label="单元数" align="center" width="160" />
          <el-table-column prop="aboveFloorCount" label="层数" align="center" width="160" />
          <el-table-column prop="area" label="面积" align="center" width="160" />
          <el-table-column prop="mobilizationTime" label="预计进场时间" align="center" width="160" />
          <el-table-column prop="isMobilization" label="是否已进场（截至立项发起日)" align="center" width="160">
            <template slot-scope="scope">{{scope.row.isMobilization=='1'?'否':'是'}}</template>
          </el-table-column>

          <el-table-column label="操作" align="center" width="180">
            <template slot-scope="scope">
              <el-button
                  type="text"
                  size="small"
                  @click="editFloor(scope.row)"
                  :disabled="!isFormEditing||!businessRole">
                编辑
              </el-button>
              <el-button
                  type="text"
                  size="small"
                  @click="deleteFloor(scope.$index)"
                  :disabled="!isFormEditing||!businessRole||scope.row.buildingMdmId">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-form>



    <!-- 添加财务苑区 -->
    <el-dialog  title="财务苑区"  :visible.sync="addFinance.visible"  width="800px" :before-close="cancelAddFinance">
      <div class="wrap">
        <el-table v-loading="loading" :data="financeList" border style="width: 750px" >
          <el-table-column  width="60">
            <template slot="header" slot-scope="scope">
              <el-checkbox v-model="addFinance.checkedAll" @change="changeAllFinance"/>
            </template>
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.checked"  @change="changeFinance(scope.row)"/>
            </template>
          </el-table-column>
          <el-table-column prop="parkName" label="财务苑区名称" align="center" :show-overflow-tooltip="true" ></el-table-column>
          <el-table-column prop="parkCode" label="财务苑区编码" align="center" :show-overflow-tooltip="true" ></el-table-column>
        </el-table>
        <pagination v-show="addFinance.total>0" :total="addFinance.total" :page.sync="addFinance.current" :limit.sync="addFinance.size" @pagination="getFinanceList" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button :disabled="loading" @click="cancelAddFinance()">取 消</el-button>
        <el-button type="primary" :disabled="loading" @click="saveAddFinance()">确 定</el-button>
      </div>
    </el-dialog>

   <!-- 新增/编辑弹框 -->
    <el-dialog  title="新增财务苑区"  :visible.sync="createFinance.visible"  width="560px" :before-close="cancelCreateFinance">
      <div class="wrap">
        <el-form ref="queryMaterialForm"  :model="createFinance"    class="demo-form-inline">
          <el-form-item label="财务苑区名称" prop="parkName">
            <el-input v-model="createFinance.parkName" placeholder="请输入财务苑区名称"  clearable @clear="createFinance.parkName = undefined" style="width:400px"></el-input>
          </el-form-item>
          <el-form-item label="财务苑区编码" prop="parkCode">
            <el-input v-model="createFinance.parkCode" placeholder="请输入财务苑区编码" clearable @clear="createFinance.parkCode = undefined" style="width:400px"></el-input>
          </el-form-item>
          <el-form-item label="财务苑区状态" prop="statusBoolean">
            <el-switch v-model="createFinance.statusBoolean"></el-switch>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button :disabled="loading" @click="cancelCreateFinance">取 消</el-button>
        <el-button type="primary" :disabled="loading" @click="saveCreateFinance">确 定</el-button>
      </div>
    </el-dialog>
    <edit-single-building :visible="editSingleBuildingData.visible" :form="editSingleBuildingData.form" @commitFloor="commitFloor" @cancelFloor="cancelFloor"></edit-single-building>
  </div>
</template>

<script>
  import editSingleBuilding from "./editSingleBuilding.vue";
  import { projectInfo } from '@/api/work'
  import store from '@/store'
  import { projectmanagedic } from '@/utils/dictionary'
  import {checkPhone} from '@/utils/validate'
  export default {
    name: "index",
    components:{
      'edit-single-building':editSingleBuilding
    },
    data() {

      return {

        timer:null,
        editSingleBuildingData:{
          visible:false,
          form:{},
          row:undefined
        },
        applicationArrayVarchar:[
          {checked:false,value:'塑料模板'},
          {checked:false,value:'测量机器人'},
          {checked:false,value:'智能施工升降机'},
          {checked:false,value:'楼层清洁机器人'},
          {checked:false,value:'智能随动布料机'},
          {checked:false,value:'地面整平机器人'},
          {checked:false,value:'地面抹平机器人'},
          {checked:false,value:'地库抹光机器人'},
          {checked:false,value:'混凝土内墙面打磨机器人'},
          {checked:false,value:'混凝土天花打磨机器人'},
          {checked:false,value:'螺杆洞封堵机器人'},
          {checked:false,value:'4.5米地下车库喷涂机器人'},
          {checked:false,value:'2.4米地下车库喷涂机器人'},
          {checked:false,value:'卷扬式外墙乳胶漆喷涂机器人'},
          {checked:false,value:'卷扬式外墙多彩漆喷涂机器人'},
          {checked:false,value:'爬升式外墙乳胶漆喷涂机器人'},
          {checked:false,value:'爬升式外墙多彩漆喷涂机器人'},
          {checked:false,value:'地坪研磨机器人'},
          {checked:false,value:'地坪漆涂敷机器人'},
          {checked:false,value:'通用物流机器人'},
          {checked:false,value:'墙转铺贴机器人'},
          {checked:false,value:'地砖薄贴机器人'},
          {checked:false,value:'腻子涂覆机器人'},
          {checked:false,value:'腻子打磨机器人'},
          {checked:false,value:'室内辊涂机器人'},
          {checked:false,value:'室内喷涂机器人'},
          {checked:false,value:'墙纸铺贴机器人'},



          {checked:false,value:'实名制考勤（需对接公司劳务管理平台）'},
          {checked:false,value:'扬尘检测'},
          {checked:false,value:'视频监控'},
          {checked:false,value:'吊钩可视化'},
          {checked:false,value:'塔吊安全监测（黑匣子）'},
          {checked:false,value:'人货梯安全监测（黑匣子）'},
          {checked:false,value:'起重设备人脸识别'},
          {checked:false,value:'VR体验馆'},
          {checked:false,value:'太阳能照明'},
          {checked:false,value:'智能地磅+材料管理系统（博智林）'},
          {checked:false,value:'智慧工地管理平台（博智林）'},

          {checked:false,value:'五头弯箍机'},
          {checked:false,value:'砂浆喷涂机'},
          {checked:false,value:'远程电控箱'},
          {checked:false,value:'早拆顶托'},
          {checked:false,value:'数控弯箍机'},
          {checked:false,value:'电梯井防护门'},
          {checked:false,value:'预制排水沟'},
          {checked:false,value:'预警螺母'},
          {checked:false,value:'钢筋电子划线器'},
          {checked:false,value:'三段式止水螺杆'},
          {checked:false,value:'钢管调直除锈机'},
          {checked:false,value:'楼板厚度控制器'},
          {checked:false,value:'智能地磅'},
          {checked:false,value:'钢制洗车台'},
          {checked:false,value:'钢制洗车池'},
          {checked:false,value:'高低标号拦茬气囊'},
          {checked:false,value:'卡栓（工程定型化防护工具）'},
        ],
        loading:false,
        financeIds:[],
        financeList:[],
        addFinance:{
          visible:false,
          total:0,
          current:1,
          size:10,
          status:"1",
          checkedAll:false,
          checkedList:[],
        },
        createFinance:{
          visible:false,
          type:1,
          parkName: undefined,
          parkCode: undefined,
          statusBoolean: false,
          status:undefined,
        },
        versionOptions:[],
        projectVersionId: undefined,
        //0可编辑1不可以  这里指编辑按钮和提交
        isEditing:1,
        onlyReadEdit:false,
        isFormEditing:false,

        financeRole:false,
        businessRole:false,
        costRole:false,

        userRelationsIds:[],
        allData:[],

        //下拉
        //公用是否
        trueOrFalseOptions:[{id:0,name:'是'},{id:1,name:'否'}],
        managementModelOptions:projectmanagedic.contractModeOptions,
        projectTypeOptions: projectmanagedic.projectOptions,
        deliveryStandardOptions:projectmanagedic.deliveryStandardOptions,
        performanceReserveOptions:projectmanagedic.performanceReserveOptions,
        extendedRangeOptions:projectmanagedic.extendedRangeOptions,
        governmentExcellenceGoalOptions:projectmanagedic.governmentExcellenceGoalOptions,
        governmentExcellenceGoalSecurityOptions:projectmanagedic.governmentExcellenceGoalSecurityOptions,
        governmentExcellenceGoalQualityOptions:projectmanagedic.governmentExcellenceGoalQualityOptions,
        companyOptions: [],
        positionNameOptions: projectmanagedic.stationOptions,


        rulesFinance:{
          paidBondCashFinance: [
            { required: true, message: '请输入', trigger: 'blur' },
            { type: 'number', message: '该值必须为数字值', trigger: 'blur'}
          ],
          paymentMethodCashFinance: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          paidBondNotCashFinance: [
            { required: true, message: '请输入', trigger: 'blur' },
            { type: 'number', message: '该值必须为数字值', trigger: 'blur'}
          ],
          paymentMethodNotCashFinance: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          paidBondSystemFinance: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
        },
        rulesBusiness:{

          code: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          isSettlement: [
            { required: true, message: '请选择', trigger: 'change' },
          ],
          name: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          projectApproveName: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          companyName: [
            { required: true, message: '请选择', trigger: 'change' },
          ],
          projectGeneralCode: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          projectGeneralName: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          mdgCode: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          mdgName: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          isNewPartyOpen: [
            { required: true, message: '请选择', trigger: 'change' },
          ],
          tenderingCompanyName: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          isNewOpneUp: [
            { required: true, message: '请选择', trigger: 'change' },
          ],
          managementModel: [
            { required: true, message: '请选择', trigger: 'change' },
          ],
          projectType: [
            { required: true, message: '请选择', trigger: 'change' },
          ],
          isLaterTakeOver: [
            { required: true, message: '请选择', trigger: 'change' },
          ],
          totalBuildingNumber: [
            { required: true, message: '请输入', trigger: 'blur' },
            { type: 'number', message: '该值必须为数字值', trigger: 'blur'}
          ],
          provinceName: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          cityName: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          areaName: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          address: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          longitude: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          latitude: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          buildingTypeName: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          homeArea: [
            { required: true, message: '请输入', trigger: 'blur' },
            { type: 'number', message: '该值必须为数字值', trigger: 'blur'}
          ],
          showArea: [
            { required: true, message: '请输入', trigger: 'blur' },
            { type: 'number', message: '该值必须为数字值', trigger: 'blur'}
          ],
          basicType: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          projectStartDate: [
            { required: true, message: '请选择', trigger: 'change' },
          ],
          projectEndDate: [
            { required: true, message: '请选择', trigger: 'change' },
          ],
          filingProjectName: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          deliveryStandard: [
            { required: true, message: '请选择', trigger: 'change' },
          ],
          isContainShowRegion: [
            { required: true, message: '请选择', trigger: 'change' },
          ],
          regionName: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          biddingCompanyName: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          projectHeadPartyA: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          projectEngineerPartyA: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          filingProjectNamePartyA: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          projectCodePartyA: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          projectManagerName: [
            { required: true, message: '请输入', trigger: 'change' },
          ],
          projectManagerPhone: [
            {required: true,validator: checkPhone, trigger: 'blur' },
          ],

          constructionDirectorName: [
            { required: true, message: '请输入', trigger: 'change' },
          ],
          constructionDirectorPhone: [
            { required: true, validator: checkPhone, trigger: 'blur' },
          ],
        },
        rulesCostRole:{
          paidBondSystemCost: [
            { required: true, message: '请选择', trigger: 'change' },
          ],
          generalContractMoneyCost: [
            { required: true, message: '请输入', trigger: 'blur' },
            { type: 'number', message: '该值必须为数字值', trigger: 'blur'}
          ],
          paidBondInitiationCost: [
            { required: true, message: '请选择', trigger: 'change' },
            { type: 'number', message: '该值必须为数字值', trigger: 'blur'}
          ],
          paidBondPartyACost: [
            { required: true, message: '请输入', trigger: 'blur' },
            { type: 'number', message: '该值必须为数字值', trigger: 'blur'}
          ],

        },
        rules: {

        },
        form: {
          projectFinanceList: [],
          projectBuildingList: [],
          projectUserList: [],
          //table
        },
        show: true,   //  正式数据不允许暂存
      }
    },
    mounted() {

      this.financeRole = store.getters.roles.includes('finance');
      this.businessRole = store.getters.roles.includes('business');
      this.costRole = store.getters.roles.includes('cost');
      // this.financeRole=this.businessRole=this.costRole=true;

      this.rules = {};
      if(this.financeRole) this.rules = {...this.rules,...this.rulesFinance};
      if(this.businessRole) this.rules = {...this.rules,...this.rulesBusiness};
      if(this.costRole) this.rules = {...this.rules,...this.rulesCostRole};


      projectInfo.projectInfoList().then(response => {
        this.companyOptions = response.data;
        if (this.$route.query.id) {
          this.projectDropDownSelect(this.$route.query.id);
        } else {
          this.isFormEditing = true;
          this.isEditing = 0;
          this.onlyReadEdit = true;
          this.form = {
            projectFinanceList: [],
            projectBuildingList: [],
            projectUserList: []
          };
          this.$nextTick(() => {
            this.clearForm('projectForm');
          })
        }
      });
    },
    methods: {

      //点击编辑按钮触发
      editForm(){
        // this.isEditing = 1;
        this.onlyReadEdit = true;
        this.isFormEditing = true;
      },
      projectDropDownSelect(id){
        projectInfo.projectDropDownSelect({ projectMdmId: id }).then(res => {
          this.versionOptions = res.data;
          let item = res.data.find(v =>v.isEditing===0);
          if(!item) item = res.data[res.data.length-1];


          this.projectVersionId = item.projectVersionId;
          this.isEditing = item.isEditing;
          this.projectInfoSelectOne(item.projectVersionId);
        })
      },
      projectInfoSelectOne(projectVersionId){
        projectInfo.projectInfoSelectOne({ projectVersionId }).then(res => {
          this.applicationArrayVarchar.forEach(item => {
              item.checked=false;
            if(res.data.project.applicationArrayVarchar&&res.data.project.applicationArrayVarchar.includes(item.value)){
              item.checked=true;
            }
          });
          // res.data.project.companyCode = parseInt(res.data.project.companyCode);
          this.form = {
            ...res.data.project,
            projectFinanceList: res.data.projectFinanceList?res.data.projectFinanceList:[],
            projectBuildingList: res.data.projectBuildingList?res.data.projectBuildingList:[],
            projectUserList: res.data.projectUserList?res.data.projectUserList:[],
          }



          this.$nextTick(() => {
            this.clearForm('projectForm');
          })

        })
      },
      //选择版本触发
      changeVersion(item){
        this.isFormEditing = false;
        this.projectInfoSelectOne(item);
        this.isEditing = this.versionOptions.find(v => v.projectVersionId == item).isEditing;
      },

      //管理人员管理
      addPerson() {
        this.form.projectUserList.push({
          userName: null,
          positionName: null,
          id: new Date().getTime(),
        })
      },
      delPerson(index) {
        if(this.userRelationsIds.length==0){
          this.$message({
            type: 'error',
            message: '请选择要删除的项'
          });
          return false;
        }

        this.userRelationsIds.forEach(id => {
          this.form.projectUserList.splice(this.form.projectUserList.findIndex(item =>item.id == id),1)
        })
      },
      changeUserRelations(selection){
        this.userRelationsIds = selection.map(item => item.id);
      },


      //以下为财务苑区
      delFinance(){
        if(this.financeIds.length==0){
          this.$message({
            type: 'error',
            message: '请选择要删除的项'
          });
          return false;
        }
        this.financeIds.forEach(id => {
          this.form.projectFinanceList.splice(this.form.projectFinanceList.findIndex(item =>item.id == id),1)
        })
      },
      changeFinanceList(selection){
        this.financeIds = selection.map(item => item.id);
      },
      //拉取财务苑区列表
      getFinanceList(){
        this.loading = true;
        projectInfo.financeParkSelectAllPage(this.addFinance).then(response => {
          this.loading = false;
          this.addFinance.checkedList = [...this.form.projectFinanceList];
          response.data.records.forEach(v => {
            if (this.addFinance.checkedList.find(item => v.id === item.id)) {
              v.checked = true;
            } else {
              v.checked = false;
            }
          })
          this.financeList = response.data.records;
          this.addFinance.total = response.data.total;
          this.addFinance.visible = true;

        });
      },
      changeFinance(row){
        if(row.checked){
          if(!this.addFinance.checkedList.find(item =>row.id == item.id)){
            this.addFinance.checkedList.push(row);
          }
        }else{
          this.addFinance.checkedList.splice(this.addFinance.checkedList.findIndex(item =>row.id == item.id),1)
        }
        this.getCheckedAllFinance();
      },

      //根据选择情况  看全选按钮是否勾选
      getCheckedAllFinance(){
        this.addFinance.checkedAll = this.financeList.every(item =>item.checked)&&this.financeList.some(item => item.checked)
      },
      changeAllFinance(checked){
        if(checked){
          this.financeList.forEach(item =>{
            item.checked = true;
            this.changeFinance(item);
          })
        }else{
          this.financeList.forEach(item =>{
            item.checked = false;
            this.changeFinance(item);
          })
        }
      },
      saveAddFinance(){
        this.form.projectFinanceList = [...this.addFinance.checkedList];
        this.cancelAddFinance();
      },
      cancelAddFinance(){
        this.financeList = [];
        this.addFinance={
          visible:false,
          total:0,
          current:1,
          size:10,
          status:"1",
          checkedAll:false,
          checkedList:[],
        };

      },
      //取消编辑/新增财务苑区
      cancelCreateFinance(){
        this.createFinance={
          visible:false,
          type:1,
          parkName: undefined,
          parkCode: undefined,
          statusBoolean: false,
          status:undefined,
        };
      },
      //确定编辑/新增财务苑区
      saveCreateFinance(){
        this.createFinance.status = (this.createFinance.statusBoolean?'1':'0');
        projectInfo.addFinancePark(this.createFinance).then(response => {
          if(this.createFinance.statusBoolean){
            projectInfo.queryFinanceByCode({parkCode:this.createFinance.parkCode}).then(response => {
              this.form.projectFinanceList.push(response.data)
              this.cancelCreateFinance(this.createFinance.status);
            });
          }else{
            this.cancelCreateFinance(this.createFinance.status);
          }
        }).catch(err =>{
        });
      },

      querySearchAsyncBranch(queryString, cb, value) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          projectInfo.getUserLikeNickName({ nickName: value }).then(res => {
            const data = res.data.map(v => {
              return {'value': v.nickName};
            })
            cb(data);
          })
        }, 2000 * Math.random());
      },
      changeCompanyCode(value) {
        this.$set(this.form, 'companyName', this.companyOptions.find(v => v.phone == value).deptName);
      },


      // 提交
      verifySubmitForm() {
        if(!this.timer){
          let applicationArrayVarchar = "";
          this.applicationArrayVarchar.forEach(item => {
            if(item.checked){
              applicationArrayVarchar += (item.value+',');
            }
          });
          let variableRole = "";
          if(this.financeRole)variableRole+="finance,";
          if(this.businessRole)variableRole+="business,";
          if(this.costRole)variableRole+="cost,";


          this.$refs['projectForm'].validate((valid) => {
            if (valid) {
              const params = {
               projectsMdmProjectinfoVersion:{...this.form,applicationArrayVarchar,variableRole},
               projectsFinanceParkVersionList: this.form.projectFinanceList,
               projectsMdmBuildingVersionList: this.form.projectBuildingList,
               projectsUserRelationsList: this.form.projectUserList,
              }
              this.submitForm(params);
            } else {
              return false;
            }
          });
          this.timer = setTimeout(()=>{
            this.timer = null;
          },3000)
        }

      },

      clearForm(value) {
        this.$refs[value].clearValidate();
      },
      resetForm(value) {
        this.$refs[value].resetFields();
      },
      submitForm(value) {
        console.log(value);
        projectInfo.projectInfoVersionSave(value).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '操作成功'
            });
           this.goBack();
          }
        })
      },
      goBack(){
        this.$router.back();
      },
      deleteFloor(index){
        this.$confirm('是否确认删除?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.form.projectBuildingList.splice(index,1);
        });
      },
      addtfloor() {
        this.editSingleBuildingData.form = {};
        this.editSingleBuildingData.visible = true;
      },
      editFloor(row) {
        this.editSingleBuildingData.row = row;
        this.editSingleBuildingData.form = {...row};
        this.editSingleBuildingData.visible = true;
      },
      commitFloor(item){
        console.log(item);
        if(this.editSingleBuildingData.row){
          let i = this.form.projectBuildingList.findIndex(v =>v == this.editSingleBuildingData.row);
          console.log(i)
          this.form.projectBuildingList.splice(i,1,item);
        }else{
          this.form.projectBuildingList.push({...item});
        }
        this.editSingleBuildingData.form = {};
        this.editSingleBuildingData.visible = false;
      },
      cancelFloor(){
        this.editSingleBuildingData.row = undefined;
        this.editSingleBuildingData.form = {};
        this.editSingleBuildingData.visible = false;
      },


    }
  }
</script>

<style scoped lang="scss">
  .el-date-editor.el-input, .el-date-editor.el-input__inner{
    width:100% !important;
  }
  .row-style{
    .el-select {
        width:100% !important;
    }
  }

  .common-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .common-nav_title {
      font-weight: 600;
      font-size: 18px;
    }
  }
  .common-title {
    background: rgb(242, 242, 242);
    padding: 10px 0;
    margin: 14px 0;
  }
  table{
    .titleBgColor{
      background-color: rgb(206,206,206);
    }
    tr{
      td{
        text-align: center;
        width:16%
      }
    }
  }
</style>
