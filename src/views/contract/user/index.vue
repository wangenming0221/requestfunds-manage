<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据树-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="deptName"
            placeholder="请输入部门名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container" style="height: 800px;overflow-y: scroll">
          <el-tree
            :data="deptTreeOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="用户名称" prop="userName">
            <el-input
              v-model="queryParams.userName"
              placeholder="请输入用户名称"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="用户昵称" prop="nickName">
            <el-input
              v-model="queryParams.nickName"
              placeholder="请输入用户昵称"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="手机号码" prop="phonenumber">
            <el-input
              v-model="queryParams.phonenumber"
              placeholder="请输入手机号码"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="用户状态"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option
                v-for="dict in statusOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="dateRange"
              size="small"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="50"
            align="center"
          />
          <el-table-column
            label="用户编号"
            align="center"
            key="userId"
            prop="userId"
          />
          <el-table-column
            label="用户名称"
            align="center"
            key="userName"
            prop="userName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="用户昵称"
            align="center"
            key="nickName"
            prop="nickName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="部门"
            align="center"
            key="deptName"
            prop="dept.deptName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="手机号码"
            align="center"
            key="phonenumber"
            prop="phonenumber"
            width="120"
          />
          <el-table-column
            label="创建时间"
            align="center"
            prop="createTime"
            width="160"
          >
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="160"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.current"
          :limit.sync="queryParams.size"
          @pagination="getList"
        />
      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog title="合同管理权限配置" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-form-item label="项目权限">
            <el-radio-group v-model="form.authType" @change="changeProjectAuth">
              <el-radio :label="1">中心</el-radio>
              <el-radio :label="2">分公司</el-radio>
              <el-radio :label="3">项目</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row v-show="form.authType !== 1">
          <el-form-item label="分公司">
            <div v-show="form.authType === 3">
              <el-tree
                ref="tree"
                :data="deptOptions"
                :props="props"
                node-key="projectCode"
                show-checkbox
                @check="handleCheckChange">
              </el-tree>
              <!-- <el-select v-model="form.deptId" placeholder="请选择分公司">
                <el-option v-for="(item, index) in deptOptions" :key="index" :label="item.deptName" :value="item.deptId"></el-option>
              </el-select> -->
            </div>
            <div v-show="form.authType === 2">
              <el-select v-model="form.deptCode" style="width: 100%" placeholder="请选择分公司">
                <el-option
                  v-for="item in deptOptions"
                  :key="item.deptId"
                  :label="item.deptName"
                  :value="item.phone">
                </el-option>
              </el-select>
<!--              <el-cascader-->
<!--                style="width: 100%"-->
<!--                v-model="form.deptId"-->
<!--                :disabled="form.userType"-->
<!--                :options="deptOptions"-->
<!--                placeholder="请选择分公司"-->
<!--                @change="handleChange"></el-cascader>-->
<!--              <treeselect v-model="form.deptId" :options="deptOptions" :normalizer="normalizer" :show-count="true" placeholder="请选择分公司" :disabled="form.userType"/>-->
            </div>
          </el-form-item>
        </el-row>
        <!-- <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listUser, getUser, delUser, addUser, updateUser, resetUserPwd, changeUserStatus } from "@/api/system/user";
import { getToken } from "@/utils/auth";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { system } from "@/utils/dictionary"
import contractApi from '@/api/work/contract'
import contract from "../../../api/work/contract";

export default {
  name: "User",
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户表格数据
      userList: null,
      // 弹出层标题
      title: "",
      // 部门树选项
      deptOptions: [],
      deptTreeOptions: [],
      // 是否显示弹出层
      open: false,
      // 部门名称
      deptName: undefined,
      // 默认密码
      initPassword: '000000',
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: system.sysNormalDisable,
      // 性别状态字典
      sexOptions: system.sysUserSex,
      // 岗位选项
      // postOptions: [],
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {
        authType: null,
        deptCode: null,
        deptCodes: []
      },
      defaultProps: {
        children: "children",
        label: "label"
      },
      props: {
        children: "children",
        label: "deptName",
      },
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/system/user/importData"
      },
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
        userName: undefined,
        nickName:undefined,
        phonenumber: undefined,
        status: undefined,
        deptId: undefined
      },
      // 列信息
      columns: [
        { key: 0, label: `用户编号`, visible: true },
        { key: 1, label: `用户名称`, visible: true },
        { key: 2, label: `用户昵称`, visible: true },
        { key: 3, label: `部门`, visible: true },
        { key: 4, label: `手机号码`, visible: true },
        { key: 5, label: `状态`, visible: true },
        { key: 6, label: `创建时间`, visible: true }
      ],
      // 表单校验
      rules: {
        userName: [
          { required: true, message: "用户名称不能为空", trigger: "blur" }
        ],
        nickName: [
          { required: true, message: "用户昵称不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "用户密码不能为空", trigger: "blur" },
          { min: 5, max: 20, message: '用户密码长度必须介于 5 和 20 之间', trigger: 'blur' }
        ],
        email: [
          {
            type: "email",
            message: "'请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ]
      },
      // 分公司
      subCompanyOptions: []
    };
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getList();
    this.getTreeselect();
    this.getSubCompany()
  },
  methods: {
    handleCheckChange(item, status) {
      this.form.deptCodes = this.$refs.tree.getCheckedNodes(true, false).map(item => item.projectCode)
      console.log(this.form.deptCodes, 999)
    },
    // 分公司列表
    getSubCompanyList() {
      contractApi.getSubCompany().then(res => {
        if(res.code === 0) {
          this.subCompanyOptions = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      listUser(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.userList = response.data.records;
          this.total = response.data.total;
          this.loading = false;
        }
      );
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        // this.deptOptions = response.data
        this.deptTreeOptions = response.data
      })
    },
    getSubCompany() {
      contract.getDeptAndProjectTree().then(res => {
        // debugger
        if(res.code === 0) {
          this.deptOptions = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    changeProjectAuth(val) {
      // debugger
      // contract.getDeptAndProjectTree().then(res => {
      //   // debugger
      //   if(res.code === 0) {
      //     this.deptOptions = res.data
      //   }
      // }).catch(err => {
      //   console.log(err)
      // })
      // if(val === 2) {
      //
      //   treeselect().then(response => {
      //     this.deptOptions = response.data;
      //   })
      // } else if(val === 3) {
      //   contract.getDeptAndProjectTree().then(res => {
      //     // debugger
      //     if(res.code === 0) {
      //       this.deptOptions = res.data
      //     }
      //   }).catch(err => {
      //     console.log(err)
      //   })
      // }
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.deptId = data.id
      this.getList()
    },
    // 取消按钮 合同用户管理
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        userId: undefined,
        deptCode: undefined,
        userName: undefined,
        nickName: undefined,
        password: undefined,
        email: undefined,
        sex: undefined,
        remark: undefined,
        postIds: [],
        roleIds: []
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.current = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const params = {
        personCode: null
      }
      params.personCode = row.phonenumber
      contractApi.getUserDataAuth(params).then(res => {
        if(res.code === 0) {
          console.log(typeof res.data)
          if(typeof res.data === 'string') {
            this.$confirm(res.data, '提示', {
              confirmButtonText: '去设置',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.open = true;
              contract.getDeptAndProjectTree().then(res => {
                if(res.code === 0) {
                  this.deptOptions = res.data;
                  this.form = {
                    authType: 1,
                    deptCode: null,
                    deptCodes: [],
                    personCode: row.phonenumber
                  }
                }
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
          } else {
            this.open = true
            contract.getDeptAndProjectTree().then(_res => {
              this.deptOptions = _res.data;
              this.$nextTick(() => {
                this.$refs.tree.setCheckedKeys([]);
              })
              if (res.data.authType === 1) {
                this.form = {
                  authType: res.data.authType,
                  deptCode: null,
                  deptCodes: [],
                  personCode: row.phonenumber
                }
              } else if (res.data.authType === 2) {
                this.form = {
                  authType: res.data.authType,
                  deptCode: res.data.deptId,
                  deptCodes: [],
                  personCode: row.phonenumber
                }
              } else if (res.data.authType === 3) {
                this.form = {
                  authType: res.data.authType,
                  deptCode: null,
                  deptCodes: res.data.projectCodes,
                  personCode: row.phonenumber
                };
                this.$nextTick(() => {
                  this.$refs.tree.setCheckedKeys(res.data.projectCodes)
                })
              }
            })
          }
        }
      }).catch(err => {
        console.log(err)
      })
      // this.reset()
      // this.getTreeselect()
    },
    handleChange(node) {

    },
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.label,
        children: node.children
      }
    },
    /** 提交按钮 */
    submitForm() {
      console.log(this.form)
      this.$refs["form"].validate(valid => {
        if (valid) {
          // debugger
          contractApi.saveUserDataAuth(this.form).then(res => {
            // console.log(res)
            if(res.code === 0) {
              this.$message({
                type: 'success',
                message: res.msg
              })
              this.open = false
            }
          }).catch(err => {
            console.log(err)
          })
        }
      })
    }
  }
};
</script>

<style lang="scss">

</style>
