<template>
  <div class="app-container">
    <el-form ref="startWorkForm" :model="form" label-width="150px" :rules="rules">
      <div class="common-nav">
        <div class="common-nav_title">开工申请单</div>
        <div>
          <el-button v-if="show" type="primary" @click="provisionalSubmitForm()" :disabled="isDisabledForm||disabledEdit">暂存</el-button>
          <el-button type="primary" @click="verifySubmitForm()" :disabled="isDisabledForm">提交</el-button>
          <el-button  @click="goBack()">返回</el-button>
        </div>
      </div>
      <el-row :gutter="24" class="row-style">
        <el-col :span="24" class="common-title">基本信息</el-col>
        <el-col :span="8">
          <el-form-item prop="creator" label="申请人">
            <el-input v-model="form.creator"  placeholder="请输入申请人" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="createTime" label="申请时间" >
            <el-input v-model="form.createTime"  placeholder="请输入申请时间" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="projectCode" label="项目编码">
            <el-autocomplete
                clearable
                class="autocomplete"
                v-model="form.projectCode"
                :fetch-suggestions="(queryString, cb) => querySearchAsyncProjectCode(queryString, cb, form.projectCode)"
                placeholder="请选择项目编码"
                @select="selectProjectCode"
                :disabled="isDisabledForm||singleBuildingFlag"
            ></el-autocomplete>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="mdgProjectName" label="MDG项目名称">
            <el-input v-model="form.mdgProjectName"  placeholder="请输入MDG项目名称" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="companyName" label="所属分公司">
            <el-input v-model="form.companyName"  placeholder="请输入所属分公司" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="buildingConstructStatus" label="楼栋施工状态">
            <el-select v-model="form.buildingConstructStatus" placeholder="请选择楼栋施工状态" disabled>
              <el-option v-for="item in buildingConstructStatusOptions"
                         :key="item.name"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="applyComment" label="开工申请描述">
            <el-input  type="textarea"  :rows="10"  placeholder="请输入开工申请描述"  v-model="form.applyComment" :disabled="isDisabledForm"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24" class="common-title">联系方式</el-col>
        <el-col :span="12">
          <el-form-item prop="projectManagerName" label="项目经理">
            <el-autocomplete
                clearable
                class="autocomplete"
                v-model="form.projectManagerName"
                :fetch-suggestions="(queryString, cb) => querySearchAsyncBranch(queryString, cb, form.projectManagerName)"
                placeholder="请选择项目经理"
                disabled
            ></el-autocomplete>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="projectManagerPhone" label="项目经理手机号">
            <el-input v-model="form.projectManagerPhone"  placeholder="请输入项目经理手机号" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="branchDirector" label="分公司工程负责人">
            <el-input v-model="form.branchDirector"  placeholder="请输入分公司工程负责人" :disabled="isDisabledForm"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="branchDirectorPhone" label="分公司工程负责人手机号">
            <el-input v-model="form.branchDirectorPhone"  placeholder="请输入分公司工程负责人手机号" :disabled="isDisabledForm"/>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="mb20">
          <el-button type="primary" @click="addContractor" :disabled="isDisabledForm">添加</el-button>
          <el-button type="primary" @click="delContractor" :disabled="isDisabledForm">删除</el-button>
        </el-col>
        <el-table :data="form.projectsWorkContractorList" class="mb20"  style="width: 100%" border @selection-change="changeContractor">
          <el-table-column type="selection" width="50" align="center"></el-table-column>
          <el-table-column label="承包人" align="center" >
            <template slot-scope="scope">
              <el-form-item label-width="0px">
                <el-input v-model="scope.row.contractorName"  placeholder="请输入承包人"/>
              </el-form-item>

            </template>
          </el-table-column>
          <el-table-column label="手机号" align="center" >
            <template slot-scope="scope" >
              <el-form-item :prop="'projectsWorkContractorList.'+scope.$index+'.contractorPhoneNumber'" label-width="0px" :rules="rules.contractorPhoneNumber">
                <el-input v-model="scope.row.contractorPhoneNumber"  placeholder="请输入承包人手机号"/>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>

        <el-col :span="24" class="common-title">项目信息</el-col>
        <el-col :span="8">
          <el-form-item prop="projectName" label="项目名称">
            <el-input v-model="form.projectName"  placeholder="请输入项目名称" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="filingProjectNamePartyA" label="甲方备案项目名称">
            <el-input v-model="form.filingProjectNamePartyA"  placeholder="请输入甲方备案项目名称" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="projectType" label="项目类型">
            <el-select v-model="form.projectType" placeholder="请选择项目类型" disabled>
              <el-option v-for="item in projectOptions"
                         :key="item.name"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="projectAddress" label="项目地址">
            <el-input v-model="form.projectAddress"  placeholder="请输入项目地址" disabled/>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item prop="generalContractUnit" label="总包单位">
            <el-input v-model="form.generalContractUnit"  placeholder="请输入总包单位" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="buildingTypeName" label="建筑类型">
            <el-select v-model="form.buildingTypeName" placeholder="请选择建筑类型" disabled>
              <el-option v-for="item in buildingTypeOptions"
                         :key="item.name"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="managementModel" label="经营模式">
            <el-select v-model="form.managementModel" placeholder="请选择经营模式" disabled>
              <el-option v-for="item in managementOptions"
                         :key="item.name"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="branchHeadName" label="分公司总">
            <el-autocomplete
                clearable
                class="autocomplete"
                v-model="form.branchHeadName"
                :fetch-suggestions="(queryString, cb) => querySearchAsyncBranch(queryString, cb, form.branchHeadName)"
                placeholder="请选择分公司总"
                :disabled="isDisabledForm"
            ></el-autocomplete>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="undertakeType" label="项目承接类型">
            <el-select v-model="form.undertakeType" placeholder="请选择项目承接类型" :disabled="isDisabledForm">
              <el-option v-for="item in undertakeTypeOptions"
                         :key="item.name"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="totalBuildingNumber" label="合同范围内楼栋总数">
            <el-input v-model.number="form.totalBuildingNumber"  placeholder="请输入合同范围内楼栋总数" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="deliveredBulidingNumber" label="合同范围内已交付楼栋总数">
            <el-input v-model.number="form.deliveredBulidingNumber"  placeholder="请输入合同范围内已交付楼栋总数" :disabled="isDisabledForm"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="buildingArea" label="建筑面积（㎡）">
            <el-input v-model="form.buildingArea"  placeholder="请输入建筑面积（㎡）" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="showArea" label="展示面积（㎡）">
            <el-input v-model="form.showArea"  placeholder="请输入展示面积（㎡）" disabled/>
          </el-form-item>
        </el-col>

        <el-col :span="24" class="common-title">管理人员到岗</el-col>
        <el-col :span="24" class="mb20">
          <el-button type="primary" @click="addManager()" :disabled="isDisabledForm">添加</el-button>
          <el-button type="primary" @click="delManager()" :disabled="isDisabledForm">删除</el-button>
        </el-col>
        <el-table :data="form.projectsWorkManagerList" class="mb20"  style="width: 100%" border @selection-change="changeManager">
          <el-table-column type="selection" width="50" align="center"></el-table-column>
          <el-table-column label="管理人员姓名" align="center" >
            <template slot-scope="scope">
              <el-form-item label-width="0px">
                <el-autocomplete
                    clearable
                    class="autocomplete"
                    v-model="scope.row.manageName"
                    :fetch-suggestions="(queryString, cb) => querySearchAsyncBranch(queryString, cb, scope.row.manageName)"
                    placeholder="请输入管理人员姓名"
                ></el-autocomplete>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="到岗批次" align="center" >
            <template slot-scope="scope">
              <el-form-item label-width="0px">
                <el-input v-model="scope.row.toPositionBatch"  placeholder="请输入到岗批次"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="到岗时间" align="center" >
            <template slot-scope="scope">
              <el-form-item label-width="0px">
                <el-date-picker
                    v-model="scope.row.toPositionTime"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择到岗时间"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="到岗岗位" align="center" >
            <template slot-scope="scope">
              <el-form-item label-width="0px">
                <el-input v-model="scope.row.toPositionWorkType"  placeholder="请输入到岗岗位"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="到岗人数" align="center" >
            <template slot-scope="scope">
              <el-form-item :prop="'projectsWorkManagerList.'+scope.$index+'.toPositionPersonNumber'" label-width="0px" :rules="rules.toPositionPersonNumber">
                <el-input v-model.number="scope.row.toPositionPersonNumber"  placeholder="请输入到岗人数"/>
              </el-form-item>

            </template>
          </el-table-column>
        </el-table>

        <el-col :span="24" class="common-title">劳务班组到岗计划</el-col>
        <el-col :span="24" class="mb20">
          <el-button type="primary" @click="addLabor" :disabled="isDisabledForm">添加</el-button>
          <el-button type="primary" @click="delLabor" :disabled="isDisabledForm">删除</el-button>
        </el-col>
        <el-table :data="form.projectsWorkLaborList" class="mb20"  style="width: 100%" border @selection-change="changeLabor">
          <el-table-column type="selection" width="50" align="center"></el-table-column>
          <el-table-column label="到岗批次" align="center" >
            <template slot-scope="scope">
              <el-form-item label-width="0px">
                <el-input v-model="scope.row.toPositionBatch"  placeholder="请输入到岗批次"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="到岗时间" align="center" >
            <template slot-scope="scope">
              <el-form-item label-width="0px">
                <el-date-picker
                    v-model="scope.row.toPositionTime"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择到岗时间"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="到岗工种" align="center" >
            <template slot-scope="scope">
              <el-form-item label-width="0px">
                <el-input v-model="scope.row.toPositionWorkType"  placeholder="请输入到岗工种"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="到岗人数" align="center" >
            <template slot-scope="scope">
              <el-form-item :prop="'projectsWorkLaborList.'+scope.$index+'.toPositionPersonNumber'" label-width="0px" :rules="rules.toPositionPersonNumber">
                <el-input v-model.number="scope.row.toPositionPersonNumber"  placeholder="请输入到岗人数"/>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>

        <el-col :span="24" class="common-title">开工楼栋具体信息</el-col>
        <el-col :span="24" class="mb20">
          <el-button type="primary" @click="addUserRelations" :disabled="isDisabledForm">添加</el-button>
          <el-button type="primary" @click="delUserRelations" :disabled="isDisabledForm">删除</el-button>
        </el-col>
        <el-table :data="form.projectsWorkBuildingList" class="mb20"  style="width: 100%" border @selection-change="changeSingleBuildingList">
          <el-table-column type="selection" width="50" align="center"></el-table-column>
          <el-table-column prop="buildingName" label="楼栋名称" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
          <el-table-column prop="buildingCode" label="楼栋编号" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
          <el-table-column prop="buildingContractor" label="楼栋承包人" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
          <el-table-column prop="phaseStatus" label="所处阶段" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
          <el-table-column prop="unitCount" label="单元数" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
          <el-table-column prop="threeGuaranteeType" label="三保类型" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
          <el-table-column prop="subjectFloorCount" label="当前工序施工层数" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
          <el-table-column prop="buildingCompletedArea" label="已完成施工面积（㎡）" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button  size="mini"  type="text" @click="goSingleBuildingDetail(scope.row)">查看</el-button>
              </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-form>

    <!-- 新增开工楼栋具体信息 -->
    <el-dialog  title="开工楼栋"  :visible.sync="singleBuildingVisible"  width="800px" :before-close="cancelAddUserRelations">
      <div class="wrap">
        <el-table v-loading="loading" :data="singleBuildingList" border style="width: 750px;height:500px;overflow-y: auto;" >
          <el-table-column  width="60">
            <template slot="header" slot-scope="scope">
              <el-checkbox v-model="checkedAllSingleBuilding" @change="changeAllSingleBuilding"/>
            </template>
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.checked"  @change="changeSingleBuilding(scope.row)"/>
            </template>
          </el-table-column>
          <el-table-column prop="buildingCode" label="楼栋编号" align="center" :show-overflow-tooltip="true" ></el-table-column>
          <el-table-column prop="mdgCode" label="MDG楼栋编码" align="center" :show-overflow-tooltip="true" ></el-table-column>
          <el-table-column prop="buildingName" label="楼栋名称" align="center" :show-overflow-tooltip="true" ></el-table-column>
          <el-table-column prop="projectCode" label="项目编码" align="center" :show-overflow-tooltip="true" ></el-table-column>
        </el-table>
        <pagination v-show="singleBuildingTotalList>0" :total="singleBuildingTotalList" :page.sync="singleBuilding.current" :limit.sync="singleBuilding.size" @pagination="getSingleBuildingList" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button :disabled="loading" @click="cancelAddUserRelations()">取 消</el-button>
        <el-button type="primary" :disabled="loading" @click="saveAddUserRelations()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {checkPhone} from '@/utils/validate'
  import { projectInfo } from '@/api/work'
  import { projectmanagedic } from '@/utils/dictionary'
  import store from '@/store'
  import { parseTime } from "@/utils/ruoyi"
  export default {
    name: "index",
    data() {
      return {
        timer:null,
        //判断是否从单体楼栋跳进来
        singleBuildingFlag:undefined,
        disabledEdit:false,
        isDisabledForm:false,
        type:'add',
        loading:false,
        contractorIds:[],
        managerIds:[],
        laborIds:[],
        singleBuildingIds:[],
        singleBuildingVisible:false,
        singleBuildingList:[],
        singleBuildingTotalList:0,
        checkedAllSingleBuilding:false,
        checkedBuildingList:[],
        singleBuilding:{
          current:1,
          size:10
        },



        //项目类型
        projectOptions: projectmanagedic.projectOptions,
        //承包模式/经营模式
        managementOptions: projectmanagedic.contractModeOptions,
        //承接类型
        undertakeTypeOptions: projectmanagedic.undertakeTypeOptions,
        //建筑类型
        buildingTypeOptions: projectmanagedic.buildingTypeOptions,
        //楼栋施工状态
        buildingConstructStatusOptions: projectmanagedic.buildingConstructStatusOptions,
        rules: {
          creator: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          projectCode: [
            { required: true, message: '请输入', trigger: 'change' },
          ],
          mdgProjectName: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          buildingConstructStatus: [
            { required: true, message: '请选择', trigger: 'change' },
          ],
          applyComment: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          projectManagerName: [
            { required: true, message: '请输入', trigger: 'change' },
          ],
          projectManagerPhone: [
            { required: true, validator: checkPhone, trigger: 'blur' },
          ],
          branchDirector: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          branchDirectorPhone: [
            { required: true, validator: checkPhone, trigger: 'blur' },
          ],
          contractorPhoneNumber: [
            { required: true, validator: checkPhone, trigger: 'blur' },
          ],
          projectName: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          filingProjectNamePartyA: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          projectType: [
            { required: true, message: '请选择', trigger: 'change' },
          ],
          projectAddress: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          generalContractUnit: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          buildingTypeName: [
            { required: true, message: '请选择', trigger: 'change' },
          ],
          managementModel: [
            { required: true, message: '请选择', trigger: 'change' },
          ],
          branchHeadName: [
            { required: true, message: '请输入', trigger: 'change' },
          ],
          undertakeType: [
            { required: true, message: '请选择', trigger: 'change' },
          ],
          totalBuildingNumber: [
            { required: true, message: '请输入', trigger: 'blur' },
            { type: 'number', message: '该值必须为数字值', trigger: 'blur'}
          ],
          deliveredBulidingNumber: [
            { required: true, message: '请输入', trigger: 'blur' },
            { type: 'number', message: '该值必须为数字值', trigger: 'blur'}
          ],
          buildingArea: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          showArea: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          toPositionPersonNumber:[
            { type: 'number', message: '该值必须为数字值'}
          ],



        },
        form: {
          projectsWorkBuildingList: [],
          projectsWorkContractorList: [],
          projectsWorkLaborList: [],
          projectsWorkManagerList: [],

        },
        show: true,   //  正式数据不允许暂存
      }
    },
    mounted() {
      this.singleBuildingFlag = false;
      if (this.$route.query.id) {
        this.type = 'edit';
        this.isDisabledForm=(this.$route.query.isDisabledForm=='true'?true:false);
        if(this.$route.query.status){
          this.disabledEdit = (this.$route.query.status=='T'?true:false);
        }
        this.getDetail(this.$route.query.id);
      } else {
        this.type = 'add';
        this.disabledEdit = false;
        this.isDisabledForm=false;
        this.form = {
          projectsWorkBuildingList: [],
          projectsWorkContractorList: [],
          projectsWorkLaborList: [],
          projectsWorkManagerList: [],
          creator:store.getters.name,
          createTime:parseTime(new Date()),
          buildingConstructStatus:'未开工',
        };

        if(this.$route.query.buildingMdmId){
          this.form.projectsWorkBuildingList = [JSON.parse(this.$route.query.row)];
          this.singleBuildingFlag = true;
          projectInfo.singleBuildingById({ buildingMdmId: this.$route.query.buildingMdmId }).then(res => {

            this.projectInfoById(res.data.projectMdmId);

          });
        }
      }
    },
    methods: {

      //获取开工详情
      getDetail(id){
        projectInfo.getStartWorkDetail({ id }).then(res => {
          this.form = {
            creator:store.getters.name,
            createTime:parseTime(new Date()),
            ...res.data.projectsStartWorkInfo,
            projectsWorkBuildingList: res.data.projectsWorkBuildingList?res.data.projectsWorkBuildingList:[],
            projectsWorkContractorList: res.data.projectsWorkContractorList?res.data.projectsWorkContractorList:[],
            projectsWorkLaborList: res.data.projectsWorkLaborList?res.data.projectsWorkLaborList:[],
            projectsWorkManagerList: res.data.projectsWorkManagerList?res.data.projectsWorkManagerList:[],

          }

          this.$nextTick(() => {
            this.clearForm('startWorkForm');
          })
        })
      },
      //根据projectMdmId获取项目信息
      projectInfoById(projectMdmId){
        projectInfo.projectInfoById({ projectMdmId}).then(res => {
          this.form = {
            ...this.form,
            ...res.data,
            mdgProjectName:res.data.mdgName,
            projectAddress:res.data.address,
            generalContractUnit:res.data.projectGeneralName,
            buildingArea:res.data.homeArea,
            projectCode:res.data.code,
            projectName:res.data.name,
          }
          if(this.$route.query.startWorkId){
            this.getDetail(this.$route.query.startWorkId);
          }
        })
      },


      //承包人列表
      addContractor(){
        this.form.projectsWorkContractorList.push({
          contractorName: null,
          contractorPhoneNumber: null,
          // id: Number(Math.random().toString().substr(3, 10) + Date.now()).toString(36),
          id:new Date().getTime(),
        })
      },
      delContractor(){
        if(this.contractorIds.length==0){
          this.$message({
            type: 'error',
            message: '请选择要删除的项'
          });
          return false;
        }
        this.contractorIds.forEach(id => {
          this.form.projectsWorkContractorList.splice(this.form.projectsWorkContractorList.findIndex(item =>item.id == id),1)
        })
      },
      changeContractor(selection){
        this.contractorIds = selection.map(item => item.id);
      },

      //管理人员
      addManager(){
        this.form.projectsWorkManagerList.push({
          manageName: null,
          toPositionBatch: null,
          toPositionTime: null,
          toPositionWorkType: null,
          toPositionPersonNumber: null,
          // id: Number(Math.random().toString().substr(3, 10) + Date.now()).toString(36),
          id:new Date().getTime(),
        })
      },
      delManager(){
        if(this.managerIds.length==0){
          this.$message({
            type: 'error',
            message: '请选择要删除的项'
          });
          return false;
        }
        this.managerIds.forEach(id => {
          this.form.projectsWorkManagerList.splice(this.form.projectsWorkManagerList.findIndex(item =>item.id == id),1)
        })
      },
      changeManager(selection){
        this.managerIds = selection.map(item => item.id);
      },

      //劳动班组
      addLabor(){
        this.form.projectsWorkLaborList.push({
          toPositionBatch: null,
          toPositionTime: null,
          toPositionWorkType: null,
          toPositionPersonNumber: null,
          // id: Number(Math.random().toString().substr(3, 10) + Date.now()).toString(36),
          id:new Date().getTime(),
        })
      },
      delLabor(){
        if(this.laborIds.length==0){
          this.$message({
            type: 'error',
            message: '请选择要删除的项'
          });
          return false;
        }

        this.laborIds.forEach(id => {
          this.form.projectsWorkLaborList.splice(this.form.projectsWorkLaborList.findIndex(item =>item.id == id),1)
        })
      },
      changeLabor(selection){
        this.laborIds = selection.map(item => item.id);
      },

      //开工楼栋
      delUserRelations(){
        if(this.singleBuildingIds.length==0){
          this.$message({
            type: 'error',
            message: '请选择要删除的项'
          });
          return false;
        }
        this.singleBuildingIds.forEach(id => {
          this.form.projectsWorkBuildingList.splice(this.form.projectsWorkBuildingList.findIndex(item =>item.buildingMdmId == id),1)
        })
      },
      changeSingleBuildingList(selection){
        this.singleBuildingIds = selection.map(item => item.buildingMdmId);
      },

      addUserRelations(){
        this.getSingleBuildingList();
      },
      goSingleBuildingDetail(row){
        this.$router.push({ path: '/projectmanage/singleBuildingForm', query: { id: row.buildingMdmId ,readOnly:true} });
      },
      //拉取单体楼栋列表
      getSingleBuildingList(){
        this.loading = true;
        if(!this.form.projectMdmId){
          this.$message({
            type: 'error',
            message: '请先选择项目编码'
          });
          return false;
        }
        projectInfo.singleBuildingByProjectMdmId({projectMdmId:this.form.projectMdmId}).then(response => {
          this.loading = false;
          this.checkedBuildingList = [...this.form.projectsWorkBuildingList];
          response.data.forEach(v => {
            if (this.checkedBuildingList.find(item => v.buildingMdmId === item.buildingMdmId)) {
              v.checked = true;
            } else {
              v.checked = false;
            }
          })
          this.singleBuildingList = response.data;

          this.singleBuildingVisible = true;

        });
      },
      changeSingleBuilding(row){

        if(row.checked){
          if(!this.checkedBuildingList.find(item =>row.buildingMdmId == item.buildingMdmId)){
            this.checkedBuildingList.push(row);
          }
        }else{
          this.checkedBuildingList.splice(this.checkedBuildingList.findIndex(item =>row.buildingMdmId == item.buildingMdmId),1)
        }
        this.getCheckedAllSingleBuilding();
      },
      //根据选择情况  看全选按钮是否勾选
      getCheckedAllSingleBuilding(){
        this.checkedAllSingleBuilding = this.singleBuildingList.every(item =>item.checked)&&this.singleBuildingList.some(item => item.checked)
      },
      changeAllSingleBuilding(checked){
        if(checked){
          this.singleBuildingList.forEach(item =>{
            item.checked = true;
            this.changeSingleBuilding(item);
          })
        }else{
          this.singleBuildingList.forEach(item =>{
            item.checked = false;
            this.changeSingleBuilding(item);
          })
        }
      },
      saveAddUserRelations(){
        this.form.projectsWorkBuildingList = [...this.checkedBuildingList];
        this.cancelAddUserRelations();
      },
      cancelAddUserRelations(){
        this.singleBuildingVisible = false;
        this.singleBuildingList = [];
        this.singleBuildingTotalList = 0;
        this.singleBuilding = {
          current:1,
          size:10
        };
        this.checkedBuildingList = [];

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
      //模糊搜索项目编码
      querySearchAsyncProjectCode(queryString, cb, value) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          projectInfo.queryProjectLikeProjectCode({code: value}).then(res => {
            const data = res.data.map(v => {
              return { ...v,'value': v.code};
            })
            cb(data);
          })
        }, 2000 * Math.random());
      },
      //选中项目编码触发
      selectProjectCode(item){
        this.projectInfoById(item.projectMdmId);
      },





      // 提交
      verifySubmitForm() {
        if(!this.timer){
          this.$refs['startWorkForm'].validate((valid) => {
            if (valid) {
              if(this.form.projectsWorkBuildingList.length==0){
                this.$message({
                  type: 'error',
                  message: '楼栋信息不能为空'
                });
                return false;
              }
              const params = {
                ...this.form, status: 'T'
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
      // 暂存
      provisionalSubmitForm() {
        if(!this.timer){
          this.clearForm('startWorkForm');
          const params = {
            ...this.form, status: 'A'
          }
          this.submitForm(params);
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
      goBack(){
        this.$router.back();
      },
      submitForm(value) {

        value.projectsWorkBuildingList.forEach(item =>item.buildingId = item.buildingMdmId)
        let form = {
          projectsStartWorkInfo:value,
          projectsWorkBuildingList:value.projectsWorkBuildingList,
          projectsWorkContractorList:value.projectsWorkContractorList,
          projectsWorkLaborList:value.projectsWorkLaborList,
          projectsWorkManagerList:value.projectsWorkManagerList,
        }
        projectInfo.addStartWork(form).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '操作成功'
            });
            this.$router.back();
          }
        })

      }



    }
  }
</script>

<style scoped lang="scss">
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
