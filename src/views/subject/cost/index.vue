<template>
  <div class="cost">
    <div class="c-form">
      <el-form ref="costForm" :inline="true" :model="costForm" class="demo-form-inline">
        <el-form-item label="科目名称" prop="subjectName">
          <el-input v-model="costForm.subjectName" placeholder="请输入科目名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onQuery">查询</el-button>
          <el-button icon="el-icon-refresh" @click="onReset('costForm')">重置</el-button>
          <el-button icon="el-icon-plus" @click="onNewAdd()">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="c-table">
      <el-table  :data="tableData"  style="width: 100%"  row-key="id"  border  lazy  :height="700"  :tree-props="{children: 'child', hasChildren: 'hasChildren'}">
        <el-table-column  prop="subjectName"  align="center" show-overflow-tooltip label="科目名称"></el-table-column>
        <el-table-column  prop="sort"  align="center"  label="排序"></el-table-column>
        <el-table-column  prop="subjectMeaning"  align="center"  label="含义"></el-table-column>
        <el-table-column  prop="status"  align="center"  label="状态">
          <template slot-scope="scope">
            <el-switch  disabled  :value="scope.row.status ? true : false"></el-switch>
          </template>
        </el-table-column>
        <el-table-column  prop="operate"  align="center"  label="操作">
          <template slot-scope="scope">
            <!-- <el-button  @click="onNewAdd(scope.row)"  type="text"  size="small">新增</el-button> -->
            <el-button  @click="edit(scope.row)"  type="text"  size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="600px"
      :before-close="handleClose">
      <div>
        <el-form ref="newForm" :rules="newFormRules" :model="newForm" label-width="100px">
          <el-form-item label="科目名称" prop="subjectName">
            <el-input v-model="newForm.subjectName" placeholder="请输入科目名称"></el-input>
          </el-form-item>
          <el-form-item label="上级科目" prop="pSubjectName">
            <treeselect
              v-model="newForm.pSubjectName"
              :options="parentSubjectOptions"
              :normalizer="normalizer"
              :show-count="true"
              placeholder="选择上级科目"
              @select="selectParentSubject"
            />
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input v-model="newForm.sort" placeholder="请输入排序"></el-input>
          </el-form-item>
          <el-form-item label="含义" prop="subjectMeaning">
            <el-input type="textarea" rows="5" v-model="newForm.subjectMeaning" placeholder="请输入含义"></el-input>
          </el-form-item>
          <el-form-item label="挂接类型">
            <el-radio-group v-model="newForm.hookType">
              <el-radio :label="0">合同挂接</el-radio>
              <el-radio :label="1">费用挂接</el-radio>
              <el-radio :label="2">物料挂接</el-radio>
              <el-radio :label="3">无需挂接</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="newForm.hookType === 0" label="合同分类" prop="contractClassify">
            <el-input placeholder="请选择合同分类" readonly v-model="echoClassify[0]" class="input-with-select">
              <el-button slot="append" icon="el-icon-search" @click="showContractClassifyDialog"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item v-if="newForm.hookType === 1" label="费用分类" prop="feeClassify">
            <el-input placeholder="请选择费用分类" readonly v-model="echoClassify[1]" class="input-with-select">
              <el-button slot="append" icon="el-icon-search" @click="showFeeClassifyDialog"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item v-if="newForm.hookType === 2" label="物料分类" prop="materialClassify">
            <el-input placeholder="请选择物料分类" readonly v-model="echoClassify[2]" class="input-with-select">
              <el-button slot="append" icon="el-icon-search" @click="showMaterialClassifyDialog"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-switch v-model="newForm.status"></el-switch>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="confirm('newForm')">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog  title="合同分类"  :visible.sync="contractForm"  width="900px" :before-close="removeContract">
      <div class="wrap">
        <div class="wrap-aside">
          <el-scrollbar>
            <div v-for="(v, i) in contractOneList" :key="i">
              <span :class="contractOneSelectId === v.id ? 'aside-item active' : 'aside-item'"  @click="handleGetContractList(v)">{{ v.title }}</span>
            </div>
          </el-scrollbar>
        </div>
        <div class="wrap-main">
          <el-table  ref="contractWrap"  v-loading="loading"  border style="width:670px"  height="500"  :data="contractList" >
            <el-table-column  width="60">
              <template slot="header" slot-scope="scope">
                <el-checkbox v-model="checkedAllContract" @change="handleChangeAllContract"/>
              </template>
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.checked" :disabled ="scope.row.disableState"  @change="changeRowContract(scope.row)"/>
              </template>
            </el-table-column>
            <el-table-column  prop="name"  label="合同范本名称"  align="center"></el-table-column>
          </el-table>
          <pagination  v-show="contractTotal > 0"  :total="contractTotal"  :page.sync="queryContract.current"  :limit.sync="queryContract.size"  @pagination="getContractList"/>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button :disabled="loading" @click="removeContract">取 消</el-button>
        <el-button type="primary" :disabled="loading" @click="submitContract">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 物料分类 -->
    <el-dialog title="物料分类"  :visible.sync="materialForm"  width="910px" :before-close="removeMaterial">
      <div class="wrap">
        <div class="wrap-aside">
          <el-scrollbar>
            <el-input  placeholder="输入关键字进行过滤"  v-model="filterText">
            </el-input>
            <el-tree ref="materialTree" :data="materialOneList" :filter-node-method="filterNode"  node-key="id" :default-expanded-keys="materialExpand" :props="materialProps" @node-click="handleGetMaterialList"></el-tree>
          </el-scrollbar>
        </div>
        <div class="wrap-main">
          <el-form ref="queryMaterialForm"  :model="queryMaterial"  :inline="true"  class="demo-form-inline">
            <el-form-item label="物料编号" prop="materialCode">
              <el-input v-model="queryMaterial.materialCode" placeholder="请输入物料编号"  clearable @clear="queryMaterial.materialCode = undefined" style="width:130px"></el-input>
            </el-form-item>
            <el-form-item label="物料名称" prop="materialName">
              <el-input v-model="queryMaterial.materialName" placeholder="请输入物料名称" clearable @clear="queryMaterial.materialName = undefined" style="width:130px"></el-input>
            </el-form-item>
            <el-form-item label="材料规格" prop="specification">
              <el-input v-model="queryMaterial.specification" placeholder="请输入材料规格" clearable @clear="queryMaterial.specification = undefined" style="width:130px"></el-input>
            </el-form-item>
            <el-form-item >
              <el-button type="primary" :disabled="loading" @click="getMaterialList">搜 索</el-button>
            </el-form-item>
          </el-form>

          <el-table  ref="materialWrap"  v-loading="loading"  border style="width:700px"  height="450"  :data="materialList" >
            <el-table-column  width="60">
              <template slot="header" slot-scope="scope">
                <el-checkbox v-model="checkedAllMaterial" @change="handleChangeAllMaterial"/>
              </template>
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.checked" :disabled ="scope.row.disableState"  @change="changeRowMaterial(scope.row)"/>
              </template>
            </el-table-column>

            <el-table-column  prop="materialCode"  label="物料编号"  align="center"></el-table-column>
            <el-table-column  prop="materialName"  label="物料名称"  align="center"></el-table-column>
            <el-table-column  prop="specification"  label="材料规格"  align="center"></el-table-column>
            <el-table-column  prop="unit"  label="单位"  align="center"></el-table-column>
            <el-table-column  prop="materialTypeCode"  label="材料类型编号"  align="center"></el-table-column>
            <el-table-column  prop="materialTypeName"  label="材料类型名称"  align="center"></el-table-column>
          </el-table>
          <pagination  v-show="materialTotal > 0"  :total="materialTotal"  :page.sync="queryMaterial.current"
            :limit.sync="queryMaterial.size"  @pagination="getMaterialList"/>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button :disabled="loading" @click="removeMaterial">取 消</el-button>
        <el-button type="primary" :disabled="loading" @click="submitMaterial">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 费用分类 -->
    <el-dialog title="费用分类"  :visible.sync="feeForm"  width="600px" :before-close="removeFee">
      <div class="wrap">
        <div class="wrap-aside">
          <el-scrollbar>
            <el-tree :data="feeOneList" :props="materialProps" @node-click="handleGetFeeList"></el-tree>
          </el-scrollbar>
        </div>
        <div class="wrap-main">
          <el-table  ref="feeWrap"  v-loading="loading"  border style="width:380px"  height="450"  :data="feeList"  >
            <el-table-column  width="60">
              <template slot="header" slot-scope="scope">
                <el-checkbox v-model="checkedAllFee" @change="handleChangeAllFee"/>
              </template>
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.checked" :disabled ="scope.row.disableState"  @change="changeRowFee(scope.row)"/>
              </template>
            </el-table-column>
            <el-table-column  prop="name"  label="费用类型"  align="center"></el-table-column>
          </el-table>
          <pagination  v-show="feeTotal > 0"  :total="feeTotal"  :page.sync="queryFee.current"
            :limit.sync="queryFee.size"  @pagination="getFeeList"/>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button :disabled="loading" @click="removeFee">取 消</el-button>
        <el-button type="primary" :disabled="loading" @click="submitFee">确 定</el-button>
      </div>
    </el-dialog>



  </div>
</template>

<script>
import api from '@/api/work/subject'
// 下拉树
import Treeselect from "@riophae/vue-treeselect"
import "@riophae/vue-treeselect/dist/vue-treeselect.css"
import { requestprocessdic } from "@/utils/dictionary"
import { request } from '@/api/work'

export default {
  name: "Cost",
  components: {
    Treeselect
  },
  data() {
    return {
      filterText:'',
      costForm: {
        subjectName: null
      },
      tableData: [],
      dialogVisible: false,
      title: '新增',
      newForm: {
        id: null,
        type:null,
        subjectName: null,
        pid: null,
        status: true,
        sort: null,
        subjectMeaning: null,
        pSubjectName: undefined,
        hookType: 0,
        // 合同分类
        contractClassify: null,
        feeClassify: null,
        materialClassify: null,
        modelIdList: [],
        selectContractArr: []
      },
      echoClassify: [null,null,null,null],
      modelIdListArr:[[],[],[],[]],
      newFormRules: {
        subjectName: [
          { required: true, message: '请输入科目名称', trigger: 'blur' }
        ],
        pSubjectName: [
          { required: true, message: '请选择上级科目', trigger: 'change' }
        ],
        sort: [
          { required: true, message: '请输入排序', trigger: 'blur' }
        ],
        contractClassify: [
          { required: true, message: '请选择分类', trigger: 'blur' }
        ],
        feeClassify: [
          { required: true, message: '请选择分类', trigger: 'blur' }
        ],
        materialClassify: [
          { required: true, message: '请选择分类', trigger: 'blur' }
        ],


      },
      parentSubjectOptions: [],
      editParams: {
        id: null
      },
      defaultProps: {
        children: 'child',
        label: 'subjectName'
      },
      // 合同分类
      contractForm: false,

      // 侧边栏选中分类 list
      contractOneList: [],

      // 侧边栏选中分类id
      contractOneSelectId: null,
      // 合同分类 数据表
      contractList: [],
      checkedAllCon: false,
      contractTotal: 0,
      queryContract: {
        current: null,
        size: null,
        subjectId:undefined,
      },
      materialProps: {
        children: 'children',
        label: 'title'
      },
      //合同
      checkedAllContract:false,
      selectedContract:[],
      //物料分类
      materialExpand:[],
      checkedAllMaterial:false,
      materialForm:false,
      materialOneList:[],
      queryMaterial: {
        current: 1,
        size: 10,
        materialTypeId:undefined,
        materialCode:undefined,
        materialName:undefined,
        specification:undefined,
        subjectId:undefined,
      },
      materialTotal:0,
      materialList:[],
      selectedMaterial:[],
      //费用分类
      checkedAllFee:false,
      feeForm:false,
      feeOneList:[],
      queryFee: {
        current: 1,
        size: 10,
        feeId:undefined,
        subjectId:undefined,
      },
      feeTotal:0,
      feeList:[],
      selectedFee:[],
      // 遮罩层
      loading: true,
      // 表单参数
      form: {},
      echoContractClassify: [],
    }
  },
  mounted() {
    this.init()
    this.getParentSubject()
  },
  watch: {
    filterText(val) {
      this.$refs.materialTree.filter(val);
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.title.indexOf(value) !== -1;
    },
    normalizer(node) {
      // console.log(node, 111)
      if (node.child && !node.child.length) {
        delete node.child
      }
      return {
        id: node.id,
        label: node.subjectName,
        children: node.child
      }
    },
    init() {
      api.queryToSubjectList(this.costForm).then(res => {
        if (res.code === 0) {
          this.tableData = res.data
          this.getParentSubject()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getParentSubject() {
      api.getFirstSubjectList().then(res => {
        if (res.code === 0) {
          this.parentSubjectOptions = []
          this.parentSubjectOptions.push(res.data)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handleChangeSubject(val) {
      this.parentSubjectOptions.forEach((item, index) => {
        if (item.subjectName === val) {
          this.newForm.pid = item.id
        }
      })
    },
    selectParentSubject(node) {
      this.newForm.pid = node.id
    },
    // 取消编辑
    handleClose() {
      // 已勾选回显 赋空
      this.echoContractClassify = [];
      this.dialogVisible = false;
      this.newForm.modelIdList = [];
      this.modelIdListArr = [[],[],[],[]];
      this.newForm.selectContractArr = [];
      this.$refs.newForm.resetFields();
      this.queryFee = {};
      this.queryMaterial = {};
      this.newForm.contractClassify = null;
      this.newForm.feeClassify = null;
      this.newForm.materialClassify = null;

    },
    //确认编辑
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //true 转为1/0
          let status = this.newForm.status ? 1 : 0;
          this.newForm.modelIdList = this.modelIdListArr[this.newForm.hookType];

          api.insertOrUpdateSubject({...this.newForm,status}).then(res => {
            if (res.code === 0) {
              // 已勾选回显 赋空
              this.handleClose();
              this.init();
            } else {
              this.$message({
                type: 'warning',
                message: res.msg
              })
            }
          }).catch(err => {
          })
        } else {
          return false
        }
      })
    },
    onQuery() {
      this.init()
    },
    onReset(formName) {
      this.$refs[formName].resetFields()
      this.init()
    },
    onNewAdd(row) {
      this.newForm.pid = (row?row.id:this.parentSubjectOptions[0].id);
      this.newForm.pSubjectName = (row?row.id:this.parentSubjectOptions[0].id);
      this.newForm.hookType = 0;
      this.echoClassify = [null,null,null,null];

      this.newForm.contractClassify = null;
      this.newForm.feeClassify = null;
      this.newForm.materialClassify = null;

      this.newForm.selectContractArr = [];
      this.title = '新增';
      this.newForm.type = 1;
      this.dialogVisible = true;

      delete this.newForm.id;
    },

    // 编辑
    edit(item) {

      this.title = '编辑';
      this.newForm.type = 2;
      this.dialogVisible = true;
      this.queryMaterial.subjectId = item.id;
      this.queryFee.subjectId = item.id;
      this.queryContract.subjectId = item.id;
      this.editParams.id = item.id;
      this.newForm.id = item.id;


      // 上级科目
      this.getParentSubject()

      api.getSubjectById(this.editParams).then(res => {
        // console.log(res)
        if (res.code === 0) {
          // 回显
          this.newForm.subjectName = res.data.subjectName;
          this.newForm.subjectMeaning = res.data.subjectMeaning;
          this.newForm.sort = res.data.sort;
          this.newForm.status = res.data.status ? true : false;
          this.newForm.pid = res.data.pid;
          this.newForm.hookType = res.data.hookType;
          this.modelIdListArr[res.data.hookType] = res.data.modelIdList;
          this.newForm.contractClassify = this.modelIdListArr[0];
          this.newForm.feeClassify = this.modelIdListArr[1];
          this.newForm.materialClassify = this.modelIdListArr[2];


          this.echoClassify = [null,null,null,null]
          this.echoClassify[res.data.hookType] = res.data.classifyDesc;
          // 回显上级科目
          if (res.data.pid === 0) {
            this.newForm.pSubjectName = res.data.pid
          } else {
            this.parentSubjectOptions[0].child.forEach(item => {
              if (item.id === res.data.pid) {
                this.newForm.pSubjectName = item.id
              }
            })
          }
        }
      }).catch(err => {

      })
    },

    // 显示合同分类
    showContractClassifyDialog() {
      this.getContractOneList()
      this.selectedContract = [...this.modelIdListArr[0]];
      this.contractForm = true;

    },
    // 合同分类 侧边栏
    getContractOneList() {
      request.selectContractModel().then(res =>{
        this.contractOneList = res.data
        if (res.data && res.data.length) {
          this.handleGetContractList(res.data[0])
        }
      })
    },
    // 合同分类 侧边栏选中分类
    handleGetContractList(value) {
      // 侧边栏选中 id
      this.contractOneSelectId = value.id


      this.queryContract.contractName = undefined;
      this.queryContract.current = 1;
      this.queryContract.size = 10;

      this.getContractList()
    },
    /** 获取合同列表*/
    getContractList() {
      this.loading = true
      request.selectContractModelById2({ ...this.queryContract,classifyId:this.contractOneSelectId,type:this.newForm.type}).then(res =>{
        this.contractTotal = parseInt(res.data.total)
        res.data.records.forEach(v => {
          if (this.selectedContract.find(item => v.modelId === item)) {
            v.checked = true;
          } else {
            v.checked = false;
          }
        })
        this.contractList = res.data.records
        this.getCheckedAllContractStatus();
        this.loading = false;

      })
    },


    // 选择
    changeRowContract(row){
      if(row.checked){
        if(!this.selectedContract.find(item =>row.modelId == item)){
          this.selectedContract.push(row.modelId);
        }
      }else{
        this.selectedContract.splice(this.selectedContract.findIndex(item =>row.modelId == item),1)
      }
      this.getCheckedAllContractStatus();
    },
    //根据选择情况  看全选按钮是否勾选
    getCheckedAllContractStatus(){
      this.checkedAllContract = this.contractList.every(item =>item.checked||item.disableState)&&this.contractList.some(item => item.checked)
    },
    //全选
    handleChangeAllContract(checked){
      if(checked){
        this.contractList.forEach(item =>{
          if(!item.disableState){
            item.checked = true;
            this.changeRowContract(item);
          }
        })
      }else{
        this.contractList.forEach(item =>{
          if(!item.disableState){
            item.checked = false;
            this.changeRowContract(item);
          }
        })
      }
    },


    //合同取消按钮
    removeContract() {
      this.contractForm = false;
      this.$refs.contractWrap.clearSelection();
      this.contractList = [];
      this.checkedAllContract = false;
    },

    /** 合同分类 确定按钮 */
    submitContract() {

      this.modelIdListArr[0] = this.selectedContract;
      this.newForm.contractClassify = this.modelIdListArr[0];
      this.echoClassify[0] = '共' + this.modelIdListArr[0].length + '个合同范本';
      this.removeContract();
    },



    //以下为物料部分
    //显示物料分类
    showMaterialClassifyDialog(){
      this.materialForm = true;
      this.selectedMaterial = [...this.modelIdListArr[2]];
      this.getMaterialOneList();
    },
    // 物料分类 侧边栏
    getMaterialOneList() {
      request.selectMaterialModel().then(res =>{
        this.materialOneList = res.data;

        this.materialExpand = [];
        this.materialOneList.forEach(item =>{
          if(item.children&&item.children.length>0){
            this.materialExpand.push(item.id);
          }
        })
        if (res.data && res.data.length) {
          this.handleGetMaterialList(res.data[0].children[0])
        }
      })
    },
    // 物料分类 侧边栏选中分类
    handleGetMaterialList(row) {

      this.queryMaterial.materialTypeId = row.id;
      this.queryMaterial.current = 1;
      this.queryMaterial.size = 10;
      this.getMaterialList()
    },
    //获取物料列表
    getMaterialList(){
      this.loading = true;
      request.selectMaterialModelById({...this.queryMaterial,type:this.newForm.type}).then(res =>{
        this.materialTotal = parseInt(res.data.total);
        // this.$refs.materialWrap.clearSelection();
        res.data.records.forEach(v => {
          if (this.selectedMaterial.find(item => v.materialId === item)) {
            v.checked = true;
          } else {
            v.checked = false;
          }
        })
        this.materialList = res.data.records;
        this.getCheckedAllMaterialStatus();
        this.loading = false;
      })
    },

    // 选择
    changeRowMaterial(row){
      if(row.checked){
        if(!this.selectedMaterial.find(item =>row.materialId == item)){
          this.selectedMaterial.push(row.materialId);
        }
      }else{
        this.selectedMaterial.splice(this.selectedMaterial.findIndex(item =>row.materialId == item),1)
      }
      this.getCheckedAllMaterialStatus();
    },
    //根据选择情况  看全选按钮是否勾选
    getCheckedAllMaterialStatus(){
      this.checkedAllMaterial = this.materialList.every(item =>item.checked||item.disableState)&&this.materialList.some(item => item.checked)
    },
    //全选
    handleChangeAllMaterial(checked){
      if(checked){
        this.materialList.forEach(item =>{
          if(!item.disableState){
            item.checked = true;
            this.changeRowMaterial(item);
          }
        })
      }else{
        this.materialList.forEach(item =>{
          if(!item.disableState){
            item.checked = false;
            this.changeRowMaterial(item);
          }
        })
      }
    },

    //物料取消
    removeMaterial(){
      this.materialForm = false;
      this.queryMaterial.materialCode = undefined;
      this.queryMaterial.materialName = undefined;
      this.queryMaterial.specification = undefined;
      this.filterText = '';
      this.$refs.materialWrap.clearSelection();
      this.materialList = [];
      this.checkedAllMaterial = false;
    },
    //物料提交
    submitMaterial(){
      this.modelIdListArr[2] = this.selectedMaterial;
      this.newForm.materialClassify = this.modelIdListArr[2];
      this.echoClassify[2] = '共' + this.modelIdListArr[2].length + '个物料范本';
      this.removeMaterial();
    },

    //以下为费用部分
    //显示费用分类
    showFeeClassifyDialog(){
      this.feeForm = true;
      this.selectedFee = [...this.modelIdListArr[1]];
      this.getFeeOneList()
    },
    // 费用分类 侧边栏
    getFeeOneList() {
      request.selectFeeModel().then(res =>{
        this.feeOneList = res.data
        if (res.data && res.data.length) {
          this.handleGetFeeList(res.data[0])
        }
      })
    },
    // 费用分类 侧边栏选中分类
    handleGetFeeList(row) {

      this.queryFee.feeId = row.id;
      this.queryFee.current = 1;
      this.queryFee.size = 10;
      this.getFeeList()
    },
    //获取费用列表
    getFeeList(){
      this.loading = true;
      request.selectFeeModelById({...this.queryFee,type:this.newForm.type}).then(res =>{
        this.loading = false;

        this.feeTotal = parseInt(res.data.total);
        res.data.records.forEach(v => {
          if (this.selectedFee.find(item => v.feeId === item)) {
            v.checked = true;
          } else {
            v.checked = false;
          }
        })

        this.feeList = res.data.records;
        this.getCheckedAllFeeStatus();

      })
    },


    // 选择
    changeRowFee(row){
      if(row.checked){
        if(!this.selectedFee.find(item =>row.feeId == item)){
          this.selectedFee.push(row.feeId);
        }
      }else{
        this.selectedFee.splice(this.selectedFee.findIndex(item =>row.feeId == item),1)
      }
      this.getCheckedAllFeeStatus();
    },
    //根据选择情况  看全选按钮是否勾选
    getCheckedAllFeeStatus(){
      this.checkedAllFee = this.feeList.every(item =>item.checked||item.disableState)&&this.feeList.some(item => item.checked)
    },
    //全选
    handleChangeAllFee(checked){
      if(checked){
        this.feeList.forEach(item =>{
          if(!item.disableState){
            item.checked = true;
            this.changeRowFee(item);
          }
        })
      }else{
        this.feeList.forEach(item =>{
          if(!item.disableState){
            item.checked = false;
            this.changeRowFee(item);
          }
        })
      }
    },

    //费用取消
    removeFee(){
      this.feeForm = false;
      this.$refs.feeWrap.clearSelection();
      this.feeList = [];
      this.checkedAllFee = false;
    },
    //费用提交
    submitFee(){
      this.modelIdListArr[1] = this.selectedFee;
      this.newForm.feeClassify = this.modelIdListArr[1];
      this.echoClassify[1] = '共' + this.modelIdListArr[1].length + '个费用范本'
      this.removeFee();
    },


  }
}
</script>

<style lang="scss" scoped>
.cost{
  width: 100%;
  height: 100%;
  padding: 15px;
  display: flex;
  flex-direction: column;
  .wrap {
    width: 100%;
    height: 550px;
    display: flex;
    flex-direction: row;
    .wrap-aside {
      width: 140px;
      max-height: 700px;
      .el-scrollbar {
        height: 100%;
        .el-scrollbar__wrap {
          overflow-x: hidden;
          .aside-item {
            display: inline-block;
            padding: 20px;
            cursor: pointer;
          }
          .active {
            color: #1890ff
          }
        }
      }
    }
    .wrap-main {
      margin-left: 14px;
      flex: 1;
    }
  }
}
</style>
