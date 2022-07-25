<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item prop="userName" label="姓名">
        <el-input  @clear="queryParams.userName = undefined" v-model="queryParams.userName"  placeholder="请输入姓名" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item prop="idCardNumber" label="身份证号">
        <el-input  @clear="queryParams.idCardNumber = undefined" v-model="queryParams.idCardNumber"  placeholder="请输入身份证号" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item prop="phone" label="手机号">
        <el-input  @clear="queryParams.phone = undefined" v-model="queryParams.phone"  placeholder="请输入手机号" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item prop="pName" label="所代表公司">
        <el-autocomplete
            @keyup.enter.native="handleQuery"
            style="width: 240px"
            size="small"
            clearable
            v-model="queryParams.pName"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入所代表公司"
            @clear="queryParams.pName = undefined"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item prop="roleCode" label="角色">
        <el-select v-model="queryParams.roleCode" placeholder="请选择角色" clearable  @clear="queryParams.roleCode = undefined">
          <el-option v-for="item in roleList" :key="item.id"
           :label="item.name"
           :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="serviceName" label="是否开通请款服务">
        <el-select v-model="queryParams.accountName" placeholder="请选择是否开通请款服务" clearable  @clear="queryParams.accountName = undefined">
          <el-option v-for="item in accountList" :key="item.name"
           :label="item.name"
           :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="projectName" label="是否在服务期内">
        <el-select v-model="queryParams.serviceName" placeholder="请选择是否在服务期内" clearable  @clear="queryParams.serviceName = undefined">
          <el-option v-for="item in serviceList" :key="item.name"
                     :label="item.name"
                     :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="projectName">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="recordList"  style="width: 100%">
      <el-table-column prop="userName" label="姓名" align="center" width="180"></el-table-column>
      <el-table-column prop="phone" label="手机号" align="center" width="180"></el-table-column>
      <el-table-column prop="idCardNumber" label="身份证号" align="center" width="200"></el-table-column>
      <el-table-column prop="pname" label="代表公司" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
      <el-table-column prop="roleName" label="角色" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
      <el-table-column prop="contractAuthority" label="合同权限" align="center" :show-overflow-tooltip="true" width="180">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     @click="handleDetail(scope.row)"
          >{{scope.row.contractAuthorityCount}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="accountName" label="已开通请款服务" align="center" width="180">
        <template slot-scope="scope">
          <el-switch
            :disabled="scope.row.serviceName === '是'"
            @change="handleStatusChange(scope.row)"
            active-value="已开通"
            inactive-value="未开通"
            v-model="scope.row.accountName"
            active-text="已开通"
            inactive-text="未开通">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="serviceName" label="是否在服务期内" align="center" width="180"></el-table-column>
      <el-table-column prop="expirationTime" label="年服务费到期时间" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.current" :limit.sync="queryParams.size" @pagination="getList" />


    <!-- 查看详情 -->
    <el-dialog :title="title" :visible.sync="open" width="1200px" append-to-body>
      <el-form ref="detailForm" :model="detailForm" label-width="100px">
        <el-row>
          <el-col :span="8"> <el-form-item label="所代表公司"> {{detailForm.pname}} </el-form-item> </el-col>
          <el-col :span="8"> <el-form-item label="公司代码"> {{detailForm.pcode}} </el-form-item> </el-col>
          <el-col :span="8"> <el-form-item label="法定代表人">  {{detailForm.ppeople}} </el-form-item> </el-col>
          <el-col :span="8"> <el-form-item label="用户姓名"> {{detailForm.userName}} </el-form-item> </el-col>
          <el-col :span="8"> <el-form-item label="用户手机号"> {{detailForm.phone}}  </el-form-item>  </el-col>
          <el-col :span="8"> <el-form-item label="用户角色(法定代表人/业务委托人)" label-width="230px"> {{detailForm.roleName}} </el-form-item> </el-col>
          <el-col :span="8"> <el-form-item label="合同总算"> {{detailForm.contractCount}} </el-form-item> </el-col>
          <el-col :span="8"> <el-form-item label="有权限合同"> {{detailForm.contractAuthorityCount}} </el-form-item>  </el-col>
        </el-row>
      </el-form>
      <el-table
          v-loading="loading"
          :row-class-name="tableRowClassName"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%">
        <el-table-column  width="60">
          <template slot="header" slot-scope="scope">
            <el-checkbox v-model="checkedAll" @change="changeAll"/>
          </template>
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.checked" @change="changeRow(scope.row)"/>
          </template>
        </el-table-column>
        <el-table-column
            align="center"
            prop="contractName"
            label="合同名称"
            width="250">
        </el-table-column>
        <el-table-column
            align="center"
            prop="contractCode"
            label="合同编码"
            width="250">
        </el-table-column>
        <el-table-column
            align="center"
            prop="stampTime"
            label="签订时间">
        </el-table-column>
        <el-table-column
            align="center"
            prop="contractAmount"
            label="合同金额">
        </el-table-column>
        <el-table-column
          align="center"
          prop="keepStatus"
          label="合同状态">
          <template slot-scope="scope">
            <span v-if="scope.row.keepStatus=='SIGNING'">签订中</span>
            <span v-if="scope.row.keepStatus=='COMPLETE'">履约中</span>
            <span v-if="scope.row.keepStatus=='FILLING'">变更中</span>
            <span v-if="scope.row.keepStatus=='TERMINATING'">解除</span>
            <span v-if="scope.row.keepStatus=='TERMINATED'">终止</span>
            <span v-if="scope.row.keepStatus=='FINISHED'">已完成</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="popTotal>0" :total="popTotal" :page.sync="popQueryParams.current" :limit.sync="popQueryParams.size" @pagination="getPopList" />
      <div slot="footer">
        <el-button type="primary" @click="handelConfirm" v-hasPermi="['request:accountmanage:usermanage:save']" v-if="detailForm.roleCode === '04'">
          保存
        </el-button>
        <el-button @click="open = false">
          取消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { accountmanagedic } from "@/utils/dictionary"
import { request } from '@/api/work'
export default {
  name: "Usermanage",
  data() {
    return {
      roleList: accountmanagedic.roleList,
      accountList: accountmanagedic.accountList,
      serviceList: accountmanagedic.serviceList,
      // 遮罩层
      loading: true,
      // 菜单表格树数据
      recordList: [],
      // 是否显示弹出层
      open: false,
      title:"",
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
        userName: undefined,
        idCardNumber: undefined,
        phone: undefined,
        pName: undefined,
        roleCode: undefined,
        serviceName: undefined,
        accountName: undefined,
      },
      total: 0,
      popQueryParams: {
        current: 1,
        size: 10,
        businessId: undefined,
        pCode: undefined,
      },
      popTotal: 0,
      detailForm:{},
      tableData: [],
      selection: [],
      checkedAll: false,
      deleteJurisdictionId: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleStatusChange(row){
      let param={ id:row.id, accountStatus: row.accountName === '已开通' ? 2 : 0 };
      let text="确认要关闭开通请款服务？";
      if(row.accountName === '已开通'){
        text="确认要开通请款服务？";
      }
      this.$confirm(text, "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        width:"150px",
        type: "warning",
        closeOnClickModal: false
      }).then(function() {
        return request.updateAccountStatus(param);
      }).then(() => {
        this.msgSuccess('操作成功');
      }).catch(function() {
        row.accountName = row.accountName === '已开通' ? '未开通' : '已开通';
      });
    },
    querySearchAsync(queryString, cb) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        request.getPorCompanyList({ pName: this.queryParams.pName }).then(res => {
          const data = res.data.map(v => {
            return {'value': v.pname};
          })
          cb(data);
        })
      }, 2000 * Math.random());
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      request.getPorCompanyListPage(this.queryParams).then(response => {
          this.recordList = response.data.records;
          this.total = parseInt(response.data.total);
          this.loading = false;
        }
      );
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        current: 1,
        size: this.queryParams.size,
        userName: undefined,
        idCardNumber: undefined,
        phone: undefined,
        companyName: undefined,
        roleCode: undefined,
        serviceName: undefined,
        accountName: undefined,
      }
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.current = 1;
      this.getList();
    },
    handleDetail(row) {
      this.detailForm = { ...row };
      this.open = true;
      this.title = "合同信息";
      this.popQueryParams = {
        current: 1,
        size: this.popQueryParams.size,
        businessId: row.id,
        pCode: row.pcode,
        roleCode: row.roleCode,
        idCardNumber:row.idCardNumber
      };
      this.selection = [];
      this.deleteJurisdictionId = [];
      this.getPopList();
    },
    /** 查询列表 */
    getPopList() {
      this.loading = true;
      request.getPorContractListPage(this.popQueryParams).then(res => {
        res.data.records.forEach(v => {
          v.jurisdiction = parseInt(v.jurisdiction);
          if (v.jurisdiction !== 0) {
            if (this.deleteJurisdictionId.includes(v.id)) {
              v.checked = false;
            } else {
              v.checked = true;
              if (!this.selection.find(value => value.id === v.id)) {
                this.selection.push(v);
              }
            }
          } else {
            if (this.selection.find(value => value.id === v.id)) {
              v.checked = true;
            } else {
              v.checked = false;
            }
          }
        })
        this.tableData = res.data.records;
        this.checkedAll = this.getCheckedAllStatus(this.selection);
        this.popTotal = parseInt(res.data.total);
        this.loading = false;
      })
    },
    tableRowClassName({row, rowIndex}) {
      if (row.checked) {
        return 'success-row';
      }
    },
    changeRow(data) {
      let selection = JSON.parse(JSON.stringify(this.selection));
      if (data.checked) {
        if (!selection.find(value => value.id === data.id)) {
          selection.push(data);
        }
        // 记录自己勾掉的数据，移除选中的
        if (data.jurisdiction !== 0 && this.deleteJurisdictionId.includes(data.id)) {
          this.deleteJurisdictionId.splice(this.deleteJurisdictionId.indexOf(data.id), 1);
        }
      } else {
        if (selection.find(value => value.id === data.id)) {
          let index = selection.findIndex(value => value.id === data.id);
          selection.splice(index, 1);
          // 记录自己勾掉的数据，避免翻页初始化重新被勾选上
          if (data.jurisdiction !== 0 && !this.deleteJurisdictionId.includes(data.id)) {
            this.deleteJurisdictionId.push(data.id);
          }
        }
      }
      this.checkedAll = this.getCheckedAllStatus(selection);
      this.selection = selection;
    },
    getCheckedAllStatus(selection) {
      // console.log(selection, this.deleteJurisdictionId)
      if (selection.map(v => v.id).sort().join(',') === '') {
        return false;
      } else {
        return selection.map(v => v.id).sort().join(',').includes(this.tableData.map(v => v.id).sort().join(','))
      }
    },
    uniqueFunc(arr, key) {
      let res = new Map();
      return arr.filter(v => !res.has(v[key]) && res.set(v[key], true))
    },
    changeAll() {
      let tableData = JSON.parse(JSON.stringify(this.tableData));
      let selection = JSON.parse(JSON.stringify(this.selection));
      let deleteJurisdictionId = JSON.parse(JSON.stringify(this.deleteJurisdictionId));
      tableData.forEach(v => v.checked = this.checkedAll ? true : false);
      this.tableData = tableData;
      if (this.checkedAll) {
        this.selection = this.uniqueFunc(selection.concat(tableData), 'id');
        tableData.forEach(v => {
          if (v.jurisdiction !== 0) {
            if (deleteJurisdictionId.includes(v.id)) {
              deleteJurisdictionId.splice(deleteJurisdictionId.indexOf(v.id), 1);
            }
          }
        });
        this.deleteJurisdictionId = deleteJurisdictionId;
      } else {
        for (let v of tableData) {
          if (v.jurisdiction !== 0 && !this.deleteJurisdictionId.includes(v.id)) {
            this.deleteJurisdictionId.push(v.id);
          }
          for (let key in selection) {
            if (selection[key].id === v.id) {
              selection.splice(key, 1);
              break;
            }
          }
        }
        this.selection = selection;
      }
      // console.log(this.selection, this.deleteJurisdictionId);
    },
    handelConfirm() {
      let params = {
        businessId: this.detailForm.id,
        contractId: this.selection.map(v => v.contractId).join(',')
      }
      request.updatePorContractBatch(params).then(res => {
        if (res.code === 0) {
          this.msgSuccess(res.msg);
          this.open = false;
          this.getList();
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
  ::v-deep .success-row {
    background: #ecf5ff;
  }
</style>
