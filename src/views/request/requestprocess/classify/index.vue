<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="分类名称" prop="name">
        <el-input
            v-model="queryParams.name"
            placeholder="请输入分类名称"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd()"
            v-hasPermi="['request:requestmanage:classify:add']"
        >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
        v-loading="loading"
        :data="menuList"
        row-key="id"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="title" label="分类名称" width="250"></el-table-column>
      <el-table-column prop="business" label="所属业务" align="center" width="200"></el-table-column>
      <el-table-column prop="introduce" label="简介" align="center" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="userName" label="变更人" align="center" width="200"></el-table-column>
      <el-table-column prop="updateTime" label="变更时间" align="center" width="240"></el-table-column>
      <el-table-column label="状态" align="center" width="200">
        <template slot-scope="scope">
          <el-switch
              @change="handleStatusChange(scope.row)"
              :active-value="0"
              :inactive-value="1"
              v-model="scope.row.enableStatus"
              active-text="启用"
              inactive-text="停用">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleUpdate(scope.row)"
                     v-hasPermi="['request:requestmanage:classify:edit']"
          >修改</el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-plus"
              @click="handleAdd(scope.row)"
              v-hasPermi="['request:requestmanage:classify:add']"
          >新增</el-button>
          <!--          <el-button-->
          <!--              size="mini"-->
          <!--              type="text"-->
          <!--              icon="el-icon-delete"-->
          <!--              @click="handleDelete(scope.row)"-->
          <!--              v-hasPermi="['requestmanage:classify:remove']"-->
          <!--          >删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="分类名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入分类名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="序号" prop="sort">
              <el-input v-model.number="form.sort" placeholder="请输入序号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属业务" prop="business">
              <el-input v-model="form.business" placeholder="请输入所属业务" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.enableStatus">
                <el-radio
                    v-for="dict in statusOptions"
                    :key="dict.id"
                    :label="dict.id"
                >{{dict.name}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="简介" prop="introduce">
              <el-input type="textarea" :rows="3" v-model="form.introduce" placeholder="请输入简介"/>
            </el-form-item>
          </el-col>
          <template v-if="form.id ? form.level >= 3 : form.level - 1 >= 3">
            <el-col :span="20">
              <el-form-item label="合同分类" prop="contractName">
                <el-input v-model="form.contractName" readonly/>
                <el-button type="primary" plain icon="el-icon-search" size="mini" @click="handleContract" style="position: absolute; top: 4px; right: -60px"/>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="BPM审批流程" prop="workFlowName">
                <el-input v-model="form.workFlowName" readonly/>
                <el-button type="primary" plain icon="el-icon-search" size="mini" @click="handleApprove" style="position: absolute; top: 4px; right: -60px"/>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-for="(v, i) in form.selectEnclosureArr" :key="i">
              <el-form-item :label="`附件${i + 1}`" class="file-item">
                <el-input v-model="v.enclosureName" readonly/>
                <el-button type="primary" plain icon="el-icon-search" size="mini" @click="handleEnclosure(v, i)"/>
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="addEnclosure(v, i)"
                           v-if="i === form.selectEnclosureArr.length - 1">增加</el-button>
                <el-button type="primary" plain icon="el-icon-minus" size="mini" @click="minusEnclosure(v, i)">删除</el-button>
              </el-form-item>
            </el-col>
          </template>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!--合同分类对话框-->
    <el-dialog :title="titleContract" :visible.sync="contractForm" width="900px" append-to-body custom-class="contract-dialog">
      <div class="wrap">
        <div class="wrap-aside">
          <el-scrollbar>
            <div v-for="(v, i) in contractOneList" :key="i">
              <span :class="contractOneSelectId === v.id ? 'aside-item active' : 'aside-item'"  @click="handleGetContractList(v)">{{v.title}}</span>
            </div>
          </el-scrollbar>
        </div>
        <div class="wrap-main">
          <el-table
              v-loading="loading"
              :data="contractList">
            <el-table-column  width="60">
              <template slot="header" slot-scope="scope">
                <el-checkbox v-model="checkedAllCon" @change="handleChangeAllCon"/>
              </template>
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.checked" @change="changeRowCon(scope.row)"/>
              </template>
            </el-table-column>
            <el-table-column prop="contractName" label="合同范本名称" align="center"></el-table-column>
          </el-table>
          <pagination
              v-show="contractTotal>0"
              :total="contractTotal"
              :page.sync="queryContract.current"
              :limit.sync="queryContract.size"
              @pagination="getContractList"
          />
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitContract">确 定</el-button>
        <el-button @click="remove">取 消</el-button>
      </div>
    </el-dialog>
    <!--BPM审批流程对话框-->
    <el-dialog :title="titleApprove" :visible.sync="approveForm" width="800px" append-to-body>
      <el-form :model="queryBpm" :inline="true">
        <el-form-item label="流程名称查询" label-width="100px" prop="name">
          <el-input v-model="queryBpm.workFlowName" placeholder="流程名称查询" clearable size="small"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini"  @click="handleQueryBpm">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table
          v-loading="loading"
          :data="approveListLocal">
        <el-table-column  width="60">
          <template slot-scope="scope">
            <div :class="scope.row.checked ? 'radio active' : 'radio'" @click="changeRowApprove(scope.row)"></div>
          </template>
        </el-table-column>
        <el-table-column prop="workflowCode" label="流程id" width="250"></el-table-column>
        <el-table-column prop="workflowName" label="流程名称" align="center"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitBpm">确 定</el-button>
        <el-button @click="close">取 消</el-button>
      </div>
    </el-dialog>
    <!--附件对话框-->
    <el-dialog :title="titleEnclosure" :visible.sync="enclosureForm" width="800px" append-to-body>
      <el-form :model="queryEnclosure" ref="queryForm" :inline="true">
        <el-form-item label="分类名称" label-width="100px" prop="name">
          <el-input  v-model="queryEnclosure.enclosureName" placeholder="附件名称查询" clearable size="small"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryEnclosure">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table
          v-loading="loading"
          :data="enclosureList">
        <el-table-column  width="60">
          <template slot-scope="scope">
            <div :class="scope.row.checked ? 'radio active' : 'radio'" @click="changeRowEnclosure(scope.row)"></div>
          </template>
        </el-table-column>
        <el-table-column prop="enclosureName" label="附件名称" align="center">
          <template slot-scope="scope">
            <el-button
                size="mini"
                type="text"
                @click="handleFile(scope.row)"
            >{{scope.row.enclosureName}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="enclosureType" label="文件格式" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
      </el-table>
      <pagination
          v-show="enclosureTotal>0"
          :total="enclosureTotal"
          :page.sync="queryEnclosure.current"
          :limit.sync="queryEnclosure.size"
          @pagination="getEnclosureList"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitEnclosure">确 定</el-button>
        <el-button @click="cancleEnclosure">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

  import { requestprocessdic } from "@/utils/dictionary"
  import { request } from '@/api/work'
  export default {
    name: "classify",
    data() {
      return {
        checkedAllCon: false,
        selectContractArr: [],
        // 遮罩层
        loading: true,
        // 显示搜索条件
        showSearch: true,
        // 菜单表格树数据
        menuList: [],
        contractOneSelectId: undefined,
        queryContract: {
          contractName: undefined,
          current: 1,
          size: 10,
        },
        contractOneList: [],
        contractList: [],
        approveList: [],
        approveListLocal: [],
        // 菜单树选项
        menuOptions: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        contractForm: false,
        approveForm: false,
        titleContract:'',
        titleApprove:'',
        // 菜单状态数据字典
        statusOptions: requestprocessdic.statusOptions,
        // 查询参数
        queryParams: {
          name: undefined
        },
        contractTotal: 0,
        queryBpm:{
          workFlowName: ''
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          name: [
            { required: true, message: "分类名称不能为空", trigger: "blur" }
          ],
          business: [
            { required: true, message: "所属业务不能为空", trigger: "blur" }
          ],
          sort: [
            { required: true, message: "序号不能为空", trigger: "blur" },
            { type: 'number', message: '序号必须为数字值'}
          ],
          introduce:[
            { max: 50, message: "简介长度不能超多50个字符", trigger: "blur" }
          ]
        },
        queryEnclosure: {
          enclosureName: '',
          current: 1,
          size: 10,
        },
        enclosureTotal: 0,
        titleEnclosure: '',
        enclosureList: [],
        enclosureForm: false,
        currentEnclosure: null,
        currentEnclosureIndex: null,
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 搜索按钮操作 */
      handleQuery() {
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      /** 查询菜单列表 */
      getList() {
        this.loading = true;
        request.getRequestBusinessDicTree(this.queryParams).then(res => {
          this.menuList = res.data;
          this.loading = false;
        });
      },
      // 状态修改
      handleStatusChange(row) {
        let text = Number(row.enableStatus) === 0 ? "启用" : "停用";
        this.$confirm('确认要' + text + '?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          closeOnClickModal: false
        }).then(function() {
          return request.deleteRequestBusinessDicTree({id: row.id, enableStatus: row.enableStatus});
        }).then(() => {
          this.getList();
          this.msgSuccess(text + "成功");
        }).catch(function() {
          row.enableStatus = Number(row.enableStatus) === 1 ? 0 : 1;
        });
      },
      /** 新增按钮操作 */
      handleAdd(row) {
        this.reset();
        if (!row) {
          this.form = {
            parentId: 0,
            level: 1,
            selectContractArr: [],
            workFlowCode: '',
            selectEnclosureArr: [
              { enclosureName: null, id: null }
            ],
          }
        } else {
          this.form = {
            parentId: row.id,
            level: row.level + 1,
            selectContractArr: [],
            workFlowCode: '',
            selectEnclosureArr: [
              { enclosureName: null, id: null }
            ],
          }
        }
        this.$set(this.form, 'enableStatus', 0);
        this.open = true;
        this.title = "添加分类";
      },
      /** 合同分类 */
      handleContract() {
        this.contractForm = true;
        this.titleContract = "合同分类";
        this.getContractOneList();
      },
      getContractOneList() {
        request.selectContractModel().then(res =>{
          this.contractOneList = res.data;
          if (res.data && res.data.length) {
            for(let v of this.form.selectContractArr) {
              for (let _v of this.contractOneList) {
                if (v.id === _v.id) {
                  this.handleGetContractList(_v);
                  return
                }
              }
            }
            this.handleGetContractList(res.data[0]);
          }
        })
      },
      handleGetContractList(value) {
        this.contractOneSelectId = value.id;
        this.queryContract = {
          contractName: undefined,
          current: 1,
          size: this.queryContract.size,
        };
        this.getContractList();
      },
      /** 合同 */
      getContractList() {
        this.loading = true;
        let selectOne = this.form.selectContractArr.find(v => v.id === this.contractOneSelectId);
        request.selectContractModelById({ ...this.queryContract, id: this.contractOneSelectId }).then(res =>{
          res.data.records.forEach(v => {
            if (selectOne) {
              if (selectOne.children.find(item => v.id === item.id)) {
                v.checked = true;
              } else {
                v.checked = false;
              }
            } else {
              v.checked = false;
            }
          })
          this.contractList = res.data.records;
          this.checkedAllCon = this.getCheckedAllStatus(this.form.selectContractArr);
          this.contractTotal = parseInt(res.data.total);
          this.loading = false;
        })
      },
      changeRowCon(data) {
        let selectContractArr = JSON.parse(JSON.stringify(this.form.selectContractArr));
        let selectOne = selectContractArr.find(v => v.id === this.contractOneSelectId)
        let selectOneIndex = selectContractArr.findIndex(v => v.id === this.contractOneSelectId)
        if (data.checked) {
          if (selectOne) {
            if (!selectOne.children.find(v => v.id === data.id)) {
              selectContractArr[selectOneIndex].children.push({ id: data.id, contractName: data.contractName });
            }
          } else {
            selectContractArr.push({
              id: this.contractOneSelectId,
              children: [
                { id: data.id, contractName: data.contractName }
              ]
            })
          }
        } else {
          if (selectOne) {
            if (selectOne.children.find(v => v.id === data.id)) {
              selectContractArr[selectOneIndex].children.splice(selectOne.children.findIndex(v => v.id === data.id), 1);
              if (!selectContractArr[selectOneIndex].children.length) {
                selectContractArr.splice(selectOneIndex, 1)
              }
            }
          }
        }
        this.checkedAllCon = this.getCheckedAllStatus(selectContractArr);
        this.form.selectContractArr = selectContractArr;
      },
      getCheckedAllStatus(selection) {
        let currentSelection = selection.find(v => v.id === this.contractOneSelectId);
        if (currentSelection) {
          return currentSelection.children.map(v => v.id).sort().join(',').includes(this.contractList.map(v => v.id).sort().join(','))
        } else {
          return false
        }
      },
      //合同取消按钮
      remove(){
        this.contractForm = false;
      },
      uniqueFunc(arr, key) {
        let _map = new Map();
        return arr.filter(v => !_map.has(v[key]) && _map.set(v[key], true))
      },
      handleChangeAllCon() {
        let contractList = JSON.parse(JSON.stringify(this.contractList));
        let selectContractArr = JSON.parse(JSON.stringify(this.form.selectContractArr));
        contractList.forEach(v => v.checked = this.checkedAllCon ? true : false);
        this.contractList = contractList;
        let selectOne = selectContractArr.find(v => v.id === this.contractOneSelectId)
        let selectOneIndex = selectContractArr.findIndex(v => v.id === this.contractOneSelectId)
        if (this.checkedAllCon) {
          if (selectOne) {
            selectContractArr[selectOneIndex].children = this.uniqueFunc(selectContractArr[selectOneIndex].children.concat(contractList), 'id')
          } else {
            selectContractArr.push({
              id: this.contractOneSelectId,
              children: contractList.map(v => {
                return { id: v.id, contractName: v.contractName }
              })
            })
          }
        } else {
          selectContractArr.splice(selectOneIndex, 1)
        }
        this.form.selectContractArr = selectContractArr;
      },
      /** 合同提交按钮 */
      submitContract() {
        let contractName = '';
        if (this.form.selectContractArr.length) {
          this.form.selectContractArr.forEach(v => {
            v.children.forEach(item => {
              contractName = contractName + item.contractName + ','
            })
          })
          this.$set(this.form, 'contractName', contractName.substr(0, contractName.length - 1))
        } else {
          this.$set(this.form, 'contractName', '')
        }
        this.remove();
      },
      // 表单重置
      reset() {
        this.form = {};
        this.resetForm("form");
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        request.selectContractBindingModel({ busId: row.id }).then(res => {
          let selectContractArr = [];
          let contractName = '';
          if (res.data && res.data.length) {
            selectContractArr = res.data.map(v => {
              return {
                id: v.classifyId,
                children: v.data.map(_v => {
                  return {
                    id: _v.modelId,
                    contractName: _v.contractName,
                  }
                })
              }
            })
            selectContractArr.forEach(v => {
              v.children.forEach(item => {
                contractName = contractName + item.contractName + ','
              })
            })
            contractName = contractName.substr(0, contractName.length - 1)
          }
          let selectEnclosureArr = [];
          if (row.enclosureIds) {
            for (let key in row.enclosureIds.split(',')) {
              selectEnclosureArr[key] = {
                id: Number(row.enclosureIds.split(',')[key]),
                enclosureName: row.enclosureName.split(',')[key],
              }
            }
          } else {
            selectEnclosureArr = [
              { enclosureName: null, id: null }
            ]
          }
          this.form = {
            name: row.title,
            parentId: row.parentId,
            level: row.level,
            id: row.id,
            enableStatus: row.enableStatus,
            business: row.business,
            introduce: row.introduce,
            sort: row.sort,
            contractName,
            workFlowCode: row.workFlowCode,
            workFlowName: row.workFlowName,
            selectContractArr,
            selectEnclosureArr,
          }
          this.open = true;
          this.title = "修改分类";
        })
      },
      /** BPM审批流程 */
      handleApprove() {
        this.approveForm = true;
        this.queryBpm = {
          workFlowName: ''
        };
        this.titleApprove = "BPM审批流程";
        this.getApproveList();
      },
      handleQueryBpm() {
        this.approveListLocal = this.approveList.filter(v => v.workflowName.includes(this.queryBpm.workFlowName))
      },
      /** BPM流程 */
      getApproveList() {
        this.loading = true;
        request.getSelectApprove(this.queryBpm).then(response => {
          let data = response.data.data
          this.loading = false;
          data.forEach(v => {
            if (v.workflowCode ===  this.form.workFlowCode) {
              v.checked = true;
            } else {
              v.checked = false;
            }
          });
          this.approveList = response.data.data;
          this.approveListLocal = response.data.data;
        });
      },
      changeRowApprove(data) {
        let approveListLocal = JSON.parse(JSON.stringify(this.approveListLocal));
        approveListLocal.forEach(v => {
          if (v.workflowCode === data.workflowCode) {
            v.checked = true;
          } else {
            v.checked = false;
          }
        })
        this.approveList = approveListLocal;
        this.approveListLocal = approveListLocal;
      },
      /** BPM审批流程提交按钮 */
      submitBpm() {
        let data = this.approveList.find(v => v.checked);
        this.$set(this.form, 'workFlowCode', data.workflowCode);
        this.$set(this.form, 'workFlowName', data.workflowName);
        this.close();
      },
      // BPM取消按钮
      close() {
        this.approveForm = false;
      },
      cancleEnclosure() {
        this.enclosureForm = false;
      },
      handleFile(value) {
        window.open(value.visitUrl);
      },
      addEnclosure(value) {
        if (value.enclosureName) {
          this.form.selectEnclosureArr.push({ enclosureName: null, id: null });
        } else {
          this.$message.error('请选择附件');
        }
      },
      minusEnclosure(value, index) {
        if (index === 0 && this.form.selectEnclosureArr.length === 1) {
          this.form.selectEnclosureArr = [
            { enclosureName: null, id: null }
          ]
        } else if (index === 0 && this.form.selectEnclosureArr.length !== 1) {
          this.form.selectEnclosureArr.splice(index, 1);
        } else {
          this.form.selectEnclosureArr.splice(index, 1);
        }
        this.$message.success('操作成功');
      },
      handleEnclosure(value, index){
        this.enclosureForm = true;
        this.queryEnclosure = {
          enclosureName: '',
          current: 1,
          size: this.queryEnclosure.size,
        };
        this.titleEnclosure = "关联附件";
        this.currentEnclosure = { ...value };
        this.currentEnclosureIndex = index;
        this.getEnclosureList();
      },
      /** 搜索按钮操作 */
      handleQueryEnclosure() {
        this.queryEnclosure.current = 1;
        this.getEnclosureList();
      },
      /** 查询菜单列表 */
      getEnclosureList() {
        this.loading = true;
        request.getRequestEnclosureListPage({ ...this.queryEnclosure, apiType: 2 }).then(res => {
          res.data.records.forEach(v => {
            v.checked = false;
          })
          this.enclosureList = res.data.records;
          this.enclosureTotal = res.data.total;
          this.loading = false;
        });
      },
      changeRowEnclosure(data) {
        let enclosureList = JSON.parse(JSON.stringify(this.enclosureList));
        this.currentEnclosure = { ...data };
        enclosureList.forEach(v => {
          if (v.id === data.id) {
            v.checked = true;
          } else {
            v.checked = false;
          }
        })
        this.enclosureList = enclosureList;
      },
      submitEnclosure() {
        if (this.currentEnclosure && this.currentEnclosure.id) {
          let selectEnclosureArr = JSON.parse(JSON.stringify(this.form.selectEnclosureArr));
          selectEnclosureArr[this.currentEnclosureIndex] = { ...this.currentEnclosure };
          this.form.selectEnclosureArr = selectEnclosureArr;
        } else {
          this.$message.error('请选择附件');
        }
        this.cancleEnclosure();
      },
      //取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      /** 提交按钮 */
      submitForm: function() {
        let modelList;
        this.$refs["form"].validate(valid => {
          if (valid) {
            let params = JSON.parse(JSON.stringify(this.form));
            if (params.selectEnclosureArr[0].id) {
              let arr = params.selectEnclosureArr.filter(v => v.id);
              params.enclosureIds = arr.map(v => v.id).join(',');
              params.enclosureName = arr.map(v => v.id).join(',');
            } else {
              params.enclosureIds = null;
              params.enclosureName = null;
            }
            if (params.selectContractArr.length) {
              modelList = params.selectContractArr.map(v => {
                return {
                  busId: params.id ? params.id : undefined,
                  classifyId: v.id,
                  busParentId: params.parentId,
                  modelId: v.children.map(item => item.id)
                }
              })
              params.modelList = modelList;
            }
            if (params.id) {
              request.updateRequestBusinessDicTree(params).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }).catch(err=>{console.log(err)});
            } else {
              request.saveRequestBusinessDicTree(params).then(response => {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              }).catch(err=>{console.log(err)});
            }
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        this.$confirm('是否确认删除分类名称为"' + row.title + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          closeOnClickModal: false
        }).then(function() {
          return request.deleteRequestBusinessDicTree({id: row.id});
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
      },
    }
  };
</script>
<style lang="scss" scoped>
  ::v-deep .contract-dialog {
    .wrap {
      display: flex;
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
              &.active {
                color: #1890ff
              }
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
  .file-item {
    position: relative;
    .el-input {
      width: 430px;
      margin-right: 10px;
    }
  }
  .radio {
    margin-top: 6px;
    border: 1px solid #DCDFE6;
    border-radius: 100%;
    width: 14px;
    height: 14px;
    background-color: #FFFFFF;
    position: relative;
    cursor: pointer;
    display: inline-block;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    &.active {
      background: #1890ff;
    }
    &.disabled {
      background: #c0c4cc;
    }
  }
</style>
