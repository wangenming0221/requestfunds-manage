<template>
  <div class="app-container">
    <el-form ref="singleBuildingForm" :model="form" label-width="150px" :rules="rules">
      <div class="common-nav">
        <div class="common-nav_title">楼栋单体信息</div>
        <div>
          <span >阶段版本</span>
          <el-select v-model="singleBuildingVersionId" placeholder="请选择阶段版本" @change="changeVersion" style="margin:0 10px 0 5px">
            <el-option v-for="item in versionOptions" :key="item.buildingVersionId"
                       :label="item.versionName"
                       :value="item.buildingVersionId">
            </el-option>
          </el-select>
          <el-button type="primary" @click="editForm()" :disabled="isEditing==1||onlyReadEdit||readOnly">编辑</el-button>

          <el-button type="primary" @click="verifySubmitForm()" :disabled="isEditing==1||readOnly">提交</el-button>
          <el-button  @click="goBack()">返回</el-button>
        </div>
      </div>
      <el-row :gutter="24" class="row-style">
        <el-col :span="24" class="common-title">楼栋状态</el-col>
        <el-col :span="8">
          <el-form-item prop="projectName" label="项目名称">
            <el-autocomplete
                disabled
                clearable
                class="autocomplete"
                v-model="form.projectName"
                :fetch-suggestions="querySearchAsync"
                :trigger-on-focus="false"
                placeholder="请输入项目名称"
                @select="handleSelect"
            ></el-autocomplete>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="projectCode" label="项目编码">
            <el-input v-model="form.projectCode"  placeholder="请输入项目编码" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="buildingName" label="楼栋名称">
            <el-input v-model="form.buildingName"  placeholder="请输入楼栋名称" :disabled="!isFormEditing"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="buildingCode" label="楼栋编号">
            <el-input v-model="form.buildingCode"  placeholder="请输入楼栋编号" :disabled="!isFormEditing"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="area" label="总面积">
            <el-input v-model.number="form.area"  placeholder="请输入总面积" :disabled="!isFormEditing"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="isMobilization" label="是否已进场(截至立项发起日)">
            <el-select v-model="form.isMobilization" placeholder="请选择是否已进场(截至立项发起日)" :disabled="!isFormEditing">
              <el-option v-for="item in trueOrFalseOptions"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="buildingContractor" label="楼栋承包人">
            <el-input v-model="form.buildingContractor"  placeholder="请输入楼栋承包人" :disabled="!isFormEditing"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="phaseStatus" label="所处阶段">
            <el-select v-model="form.phaseStatus" placeholder="请选择所处阶段" :disabled="!isFormEditing">
              <el-option v-for="item in phaseStatusOptions"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="generalContractorProjectName" label="总包项目名称">
            <el-input v-model="form.generalContractorProjectName"  placeholder="请输入总包项目名称" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="planBuildingName" label="规划楼栋名称">
            <el-input v-model="form.planBuildingName"  placeholder="请输入规划楼栋名称" :disabled="!isFormEditing"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="stageName" label="分期名称">
            <el-input v-model="form.stageName"  placeholder="请输入分期名称" :disabled="!isFormEditing"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="unitCount" label="单元数">
            <el-input v-model.number="form.unitCount"  placeholder="请输入单元数" :disabled="!isFormEditing"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="formworkExpansionCoefficient" label="模板展开系数">
            <el-input v-model="form.formworkExpansionCoefficient"  placeholder="请输入模板展开系数" :disabled="!isFormEditing"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="aboveFloorCount" label="地上总层数">
            <el-input v-model.number="form.aboveFloorCount"  placeholder="请输入地上总层数" :disabled="!isFormEditing"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="underFloorCount" label="地下总层数">
            <el-input v-model.number="form.underFloorCount"  placeholder="请输入地下总层数" :disabled="!isFormEditing"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="businessType" label="产品类型/业态">
            <el-input v-model="form.businessType"  placeholder="请输入产品类型/业态" :disabled="!isFormEditing"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="houseTypeCode" label="户型编码">
            <el-input v-model="form.houseTypeCode"  placeholder="请输入户型编码" :disabled="!isFormEditing"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="houseTypeName" label="户型名称">
            <el-input v-model="form.houseTypeName"  placeholder="请输入户型名称" :disabled="!isFormEditing"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="stopWorkDate" label="停工时间">
            <el-date-picker
                v-model="form.stopWorkDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择停工时间"
                :disabled="!isFormEditing"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="totalStopHours" label="累计停工时长(小时)">
            <el-input v-model.number="form.totalStopHours"  placeholder="请输入累计停工时长(小时)" :disabled="!isFormEditing"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="completedFloorCount" label="施工完成层数">
            <el-input v-model.number="form.completedFloorCount"  placeholder="请输入施工完成层数" :disabled="!isFormEditing"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="masonryFloorCount" label="当前砌筑施工层数">
            <el-input v-model.number="form.masonryFloorCount"  placeholder="请输入当前砌筑施工层数" :disabled="!isFormEditing"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="internalPlasterFloorCount" label="当前内抹施工层数">
            <el-input v-model.number="form.internalPlasterFloorCount"  placeholder="请输入当前内抹施工层数" :disabled="!isFormEditing"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="subjectFloorCount" label="当前主体施工层数">
            <el-input v-model.number="form.subjectFloorCount"  placeholder="请输入当前主体施工层数" :disabled="!isFormEditing"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="buildingStandardArea" label="楼栋标准层面积(m²)">
            <el-input v-model.number="form.buildingStandardArea"  placeholder="请输入楼栋标准层面积" :disabled="!isFormEditing"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="buildingCompletedArea" label="楼栋已完成施工面积(m²)">
            <el-input v-model.number="form.buildingCompletedArea"  placeholder="请输入楼栋已完成施工面积" :disabled="!isFormEditing"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="completedTotalProportion" label="主体施工完成层数/总层数">
            <el-input v-model.number="form.completedTotalProportion"  placeholder="请输入主体施工完成层数/总层数" :disabled="!isFormEditing"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="templateSystem" label="模板体系">
            <el-select v-model="form.templateSystem" placeholder="请选择模板体系" :disabled="!isFormEditing">
              <el-option v-for="item in templateSystemOptions"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="outerFrameSystem" label="外架体系">
            <el-select v-model="form.outerFrameSystem" placeholder="请选择外架体系" :disabled="!isFormEditing">
              <el-option v-for="item in outerFrameSystemOptions"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="singleFloorBuildArea" label="单层建筑面积（标准/非标准层平均面积)">
            <el-input v-model.number="form.singleFloorBuildArea"  placeholder="请输入单层建筑面积" :disabled="!isFormEditing"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="isRobotConstruction" label="机器人施工">
            <el-select v-model="form.isRobotConstruction" placeholder="请选择机器人施工" :disabled="!isFormEditing">
              <el-option v-for="item in isRobotConstructionOptions"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="threeGuaranteeType" label="三保类型">
            <el-select v-model="form.threeGuaranteeType" placeholder="请选择三保类型" :disabled="!isFormEditing">
              <el-option v-for="item in threeGuaranteeTypeOptions"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="innerFrameSystem" label="内架体系">
            <el-input v-model="form.innerFrameSystem"  placeholder="请输入内架体系" :disabled="!isFormEditing"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="decorationStandard" label="装修标准">
            <el-input v-model="form.decorationStandard"  placeholder="请输入装修标准" :disabled="!isFormEditing"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="deliveryStageParta" label="甲方交楼分期">
            <el-input v-model="form.deliveryStageParta"  placeholder="请输入甲方交楼分期" :disabled="!isFormEditing"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="hasNewSystemCondition" label="是否具备新体系施工条件">
            <el-select v-model="form.hasNewSystemCondition" placeholder="请选择是否具备新体系施工条件" :disabled="!isFormEditing">
              <el-option v-for="item in trueOrFalseOptions"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="scheduleManagement" label="进度管理人员">
            <el-input v-model="form.scheduleManagement"  placeholder="请输入进度管理人员" :disabled="!isFormEditing"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="buildingConstructStatus" label="楼栋施工状态">
            <el-select v-model="form.buildingConstructStatus" placeholder="请选择楼栋施工状态" :disabled="!isFormEditing">
              <el-option v-for="item in buildingConstructStatusOptions"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="yearPlanFloors" label="本年度计划施工层数">
            <el-input v-model.number="form.yearPlanFloors"  placeholder="请输入本年度计划施工层数" :disabled="!isFormEditing"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="yearPlanArea" label="本年度计划施工面积">
            <el-input v-model.number="form.yearPlanArea"  placeholder="请输入本年度计划施工面积" :disabled="!isFormEditing"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="buildingNowProcedureName" label="当前工序">
            <el-input v-model="form.buildingNowProcedureName"  placeholder="请输入当前工序" :disabled="!isFormEditing"/>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="common-title">甲方相关信息</el-col>
        <el-col :span="8">
          <el-form-item prop="projectPlanOutput" label="甲方项目部计划输出">
            <el-input v-model="form.projectPlanOutput"  placeholder="请输入甲方项目部计划输出" :disabled="!isFormEditing"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="projectPlanOutputRemark" label="甲方项目部计划输出(备注)">
            <el-input v-model="form.projectPlanOutputRemark"  placeholder="请输入甲方项目部计划输出(备注)" :disabled="!isFormEditing"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="regionPlanOutput" label="甲方区域大运营计划输出">
            <el-input v-model="form.regionPlanOutput"  placeholder="请输入甲方区域大运营计划输出" :disabled="!isFormEditing"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="launchNode" label="开售节点">
            <el-date-picker
                v-model="form.launchNode"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择开售节点"
                :disabled="!isFormEditing"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="blackWarningDate" label="黑色预警时间">
            <el-date-picker
                v-model="form.blackWarningDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择黑色预警时间"
                :disabled="!isFormEditing"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="contractDeliveryDate" label="合同交楼时间">
            <el-date-picker
                v-model="form.contractDeliveryDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择合同交楼时间"
                :disabled="!isFormEditing"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24" class="common-title">时间节点</el-col>
        <el-col :span="8">
          <el-form-item prop="actualCommenceDate" label="实际开工时间">
            <el-date-picker
                v-model="form.actualCommenceDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择实际开工时间"
                :disabled="!isFormEditing"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="commenceOrderDate" label="开工令时间">
            <el-date-picker
                v-model="form.commenceOrderDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择开工令时间"
                :disabled="!isFormEditing"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="mobilizationTime" label="预计进场时间">
            <el-date-picker
              v-model="form.mobilizationTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择预计进场时间"
              :disabled="!isFormEditing"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="preSaleDate" label="预售时间">
            <el-date-picker
                v-model="form.preSaleDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择预售时间"
                :disabled="!isFormEditing"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="completionDate" label="竣备时间">
            <el-date-picker
                v-model="form.completionDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择竣备时间"
                :disabled="!isFormEditing"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="preSaleImage" label="预售形象">
            <el-input v-model="form.preSaleImage"  placeholder="请输入预售形象" :disabled="!isFormEditing"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="jointInspectDate" label="联合验收时间">
            <el-date-picker
                v-model="form.jointInspectDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择联合验收时间"
                :disabled="!isFormEditing"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="openShowDate" label="展示区开放时间">
            <el-date-picker
                v-model="form.openShowDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择展示区开放时间"
                :disabled="!isFormEditing"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="deliverOwnerDate" label="交付小业主时间">
            <el-date-picker
                v-model="form.deliverOwnerDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择交付小业主时间"
                :disabled="!isFormEditing"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="currentCompletionStatus" label="当前竣备完成情况">
            <el-input v-model="form.currentCompletionStatus"  placeholder="请输入当前竣备完成情况" :disabled="!isFormEditing"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="currentInspectStatus" label="当前联验完成情况">
            <el-input v-model="form.currentInspectStatus"  placeholder="请输入当前联验完成情况" :disabled="!isFormEditing"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="currentDeliverEvaluationStatus" label="当前交付测评完成情况">
            <el-input v-model="form.currentDeliverEvaluationStatus"  placeholder="请输入当前交付测评完成情况" :disabled="!isFormEditing"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="currentDeliverOwerStatus" label="当前交付小业主完成情况">
            <el-input v-model="form.currentDeliverOwerStatus"  placeholder="请输入当前交付小业主完成情况" :disabled="!isFormEditing"/>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="common-title">MDG楼栋信息</el-col>
        <el-col :span="8">
          <el-form-item prop="mdgName" label="MDG楼栋名称">
            <el-input v-model="form.mdgName"  placeholder="请输入MDG楼栋名称" :disabled="!isFormEditing"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="mdgCode" label="MDG楼栋编码">
            <el-input v-model="form.mdgCode"  placeholder="请输入MDG楼栋编码" :disabled="!isFormEditing"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="mdgNameProject" label="MDG项目名称">
            <el-input v-model="form.mdgNameProject"  placeholder="请输入MDG项目名称" :disabled="!isFormEditing"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import { projectInfo } from '@/api/work'
  import { projectmanagedic } from '@/utils/dictionary'
  export default {
    name: "singleBuildingForm",
    data() {
      return {

        //公用是否
        trueOrFalseOptions:[{id:'0',name:'是'},{id:'1',name:'否'}],
        timer:null,
        loading:false,
        versionOptions:[],
        singleBuildingVersionId: undefined,
        //true可改  false不可改
        readOnly:false,
        //0可编辑1不可以  这里指编辑按钮
        isEditing:1,
        onlyReadEdit:false,
        isFormEditing:false,

        flag:false,
        projectCodeOptions:[],
        buildingConstructStatusOptions:projectmanagedic.buildingConstructStatusOptions,
        phaseStatusOptions:projectmanagedic.phaseStatusOptions,
        templateSystemOptions:projectmanagedic.templateSystemOptions,
        outerFrameSystemOptions:projectmanagedic.outerFrameSystemOptions,
        isRobotConstructionOptions:projectmanagedic.isRobotConstructionOptions,
        threeGuaranteeTypeOptions:projectmanagedic.threeGuaranteeTypeOptions2,
        rules: {
          projectName: [
            { required: true, message: '请输入', trigger: 'change' },
          ],
          projectCode: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          buildingName: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          buildingCode: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          area: [
            { required: true, message: '请输入', trigger: 'blur' },
            { type: 'number', message: '该值必须为数字值', trigger: 'blur'}
          ],
          isMobilization: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          buildingContractor: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          phaseStatus: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          generalContractorProjectName:[
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          planBuildingName: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          stageName: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          unitCount: [
            { required: true, message: '请输入', trigger: 'blur' },
            { type: 'number', message: '该值必须为数字值', trigger: 'blur'}
          ],
          formworkExpansionCoefficient: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          aboveFloorCount: [
            { required: true, message: '请输入', trigger: 'blur' },
            { type: 'number', message: '该值必须为数字值', trigger: 'blur'},
            { validator: this.validateFloor, trigger: 'blur' }
          ],
          underFloorCount: [
            { required: true, message: '请输入', trigger: 'blur' },
            { type: 'number', message: '该值必须为数字值', trigger: 'blur'},
            { validator: this.validateFloor, trigger: 'blur' }
          ],
          businessType: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          houseTypeCode: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          houseTypeName: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          totalStopHours: [
            { type: 'number', message: '该值必须为数字值', trigger: 'blur'}
          ],
          completedFloorCount: [
            { required: true, message: '请输入', trigger: 'blur' },
            { type: 'number', message: '该值必须为数字值', trigger: 'blur'},
            { validator: this.validateFloor, trigger: 'blur' }
          ],
          masonryFloorCount: [
            { type: 'number', message: '该值必须为数字值', trigger: 'blur'},
            { validator: this.validateFloor, trigger: 'blur' }
          ],
          internalPlasterFloorCount: [
            { required: true, message: '请输入', trigger: 'blur' },
            { type: 'number', message: '该值必须为数字值', trigger: 'blur'},
            { validator: this.validateFloor, trigger: 'blur' }
          ],
          subjectFloorCount: [
            { required: true, message: '请输入', trigger: 'blur' },
            { type: 'number', message: '该值必须为数字值', trigger: 'blur'},
            { validator: this.validateFloor, trigger: 'blur' }
          ],
          buildingStandardArea: [
            { required: true, message: '请输入', trigger: 'blur' },
            { type: 'number', message: '该值必须为数字值', trigger: 'blur'}
          ],
          buildingCompletedArea: [
            { required: true, message: '请输入', trigger: 'blur' },
            { type: 'number', message: '该值必须为数字值', trigger: 'blur'}
          ],
          completedTotalProportion: [
            { required: true, message: '请输入', trigger: 'blur' },
            { type: 'number', message: '该值必须为数字值', trigger: 'blur'},
            { validator: this.validateFloor, trigger: 'blur' }
          ],
          templateSystem: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          outerFrameSystem: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          singleFloorBuildArea: [
            { required: true, message: '请输入', trigger: 'blur' },
            { type: 'number', message: '该值必须为数字值', trigger: 'blur'}
          ],
          isRobotConstruction: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          threeGuaranteeType: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          innerFrameSystem: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          decorationStandard: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          deliveryStageParta: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          hasNewSystemCondition: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          scheduleManagement: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          yearPlanFloors: [
            { required: true, message: '请输入', trigger: 'blur' },
            { type: 'number', message: '该值必须为数字值', trigger: 'blur'},
            { validator: this.validateFloor, trigger: 'blur' }
          ],
          yearPlanArea: [
            { required: true, message: '请输入', trigger: 'blur' },
            { type: 'number', message: '该值必须为数字值', trigger: 'blur'}
          ],
          actualCommenceDate: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          commenceOrderDate: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          mobilizationTime: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          preSaleDate: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          completionDate: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],

          preSaleImage: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          jointInspectDate: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          openShowDate: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          deliverOwnerDate: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          currentCompletionStatus: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          currentInspectStatus: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          currentDeliverEvaluationStatus: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          currentDeliverOwerStatus: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          mdgName: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          mdgCode: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          mdgNameProject: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
        },
        form:{},
      }
    },
    mounted() {
      if (this.$route.query.id) {
        this.singleBuildingDropDownSelect(this.$route.query.id);
      }
      if(this.$route.query.readOnly){
        this.readOnly = true;
      }


    },
    methods: {
      validateFloor(rule, value, callback){
        if (value > 127) {
          callback(new Error('层高不能高于127层'));
        } else {
          callback();
        }
      },
      //点击编辑按钮触发
      editForm(){
        // this.isEditing = 1;
        this.onlyReadEdit = true;
        this.isFormEditing = true;
      },
      singleBuildingDropDownSelect(id){
        projectInfo.singleBuildingDropDownSelect({ buildingMdmId: id }).then(res => {
          this.versionOptions = res.data;
          let item = res.data.find(v =>v.isEditing===0);
          if(!item) item = res.data[res.data.length-1];
          this.singleBuildingVersionId = item.buildingVersionId;
          this.isEditing = item.isEditing;
          this.singleBuildingSelectOne(item.buildingVersionId);
        })
      },
      //选择版本触发
      changeVersion(item){
        this.isFormEditing = false;
        this.singleBuildingSelectOne(item);
        this.isEditing = this.versionOptions.find(v => v.buildingVersionId == item).isEditing;
      },
      singleBuildingSelectOne(buildingVersionId){
        projectInfo.singleBuildingSelectOne({ buildingVersionId }).then(res => {
          this.form = {
            ...res.data,
          }
          this.$nextTick(() => {
            this.clearForm('singleBuildingForm');
          })

        })
      },
      querySearchAsync(queryString, cb) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          projectInfo.queryProjectLikeProjectName({name: this.form.projectName}).then(res => {
            const data = res.data.map(v => {
              return { 'value': v.name,'projectCode':v.code,'projectMdmId':v.mdmId};
            })
            cb(data);
          })
        }, 2000 * Math.random());
      },
      handleSelect(e){
        this.form.projectCode = e.projectCode;
        this.form.projectMdmId = parseInt(e.projectMdmId);
      },

      verifySubmitForm(){
        if(!this.timer){
          this.$refs['singleBuildingForm'].validate((valid) => {
            if (valid) {
              const params = {
                ...this.form
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
      submitForm(value) {
        projectInfo.singleBuildingSave(value).then(res => {
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
    .el-autocomplete {
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
</style>
