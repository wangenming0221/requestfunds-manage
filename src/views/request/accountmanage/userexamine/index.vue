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
            v-model="queryParams.companyName"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入所代表公司"
            @clear="queryParams.companyName = undefined"
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
      <el-form-item prop="serviceName" label="审核状态">
        <el-select v-model="queryParams.auditStatus" placeholder="请选择审核状态" clearable  @clear="queryParams.auditStatus = undefined">
          <el-option v-for="item in examineList" :key="item.name"
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
      <el-table-column prop="companyName" label="代表公司" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
      <el-table-column prop="roleName" label="角色" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
      <el-table-column prop="roleCode" label="合同权限" align="center" :show-overflow-tooltip="true" width="180">
        <template slot-scope="scope">
          {{scope.row.roleCode === '04' ? '部分合同' : '全部合同'}}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="申请时间" align="center" :show-overflow-tooltip="true" width="180"/>
      <el-table-column prop="entrustmentStatus" label="委托协议状态" align="center" :show-overflow-tooltip="true" width="180">
        <template slot-scope="scope">
          <div v-if="scope.row.roleCode !== '01' && scope.row.roleCode !== '02' && scope.row.entrustmentStatus">
            <el-button
                size="mini"
                type="text"
                @click="getEntrustment(scope.row)"
            > {{scope.row.entrustmentStatus | agreeFilter}}</el-button>
          </div>
          <div v-else>— —</div>
        </template>
      </el-table-column>
      <el-table-column prop="entrustmentMsg" label="行一印状态" align="center" :show-overflow-tooltip="true" width="240">
        <template slot-scope="scope">
          <div v-if="scope.row.roleCode !== '01' && scope.row.roleCode !== '02'">
            {{scope.row.entrustmentMsg}}
          </div>
          <div v-else>— —</div>
        </template>
      </el-table-column>
      <el-table-column prop="auditTime" label="审核时间" align="center" :show-overflow-tooltip="true" width="180"/>
      <el-table-column prop="auditStatus" label="审核状态" align="center" :show-overflow-tooltip="true" width="180">
        <template slot-scope="scope">
          {{scope.row.auditStatus | auditStatusFilter}}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleExaMine(scope.row)"
            >审核</el-button>
          </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.current" :limit.sync="queryParams.size" @pagination="getList" />


    <!-- 查看详情 -->
    <el-dialog :title="title" :visible.sync="open" width="1200px" append-to-body>
      <el-form ref="detailForm" :model="detailForm" label-width="100px">
        <el-row>
          <el-col :span="8"><el-form-item label="姓名">{{detailForm.userName}}</el-form-item></el-col>
          <el-col :span="8"><el-form-item label="性别">{{Number(detailForm.sex) === 1 ? '男' : '女'}}</el-form-item></el-col>
          <el-col :span="8"><el-form-item label="身份证号码">{{detailForm.idCardNumber}}</el-form-item></el-col>
          <el-col :span="8"><el-form-item label="手机号">{{detailForm.phone}}</el-form-item></el-col>
          <el-col :span="8"><el-form-item label="邮箱">{{detailForm.email}}</el-form-item> </el-col>
          <el-col :span="8"><el-form-item label="申请人角色">{{detailForm.roleName}}</el-form-item></el-col>
          <template v-if="detailForm.roleCode !== '02'">
            <el-col :span="24">
              <div style="font-weight: 600;padding-bottom: 18px;padding-left: 32px;">所代表的公司:{{detailForm.pname}}</div>
            </el-col>
            <el-col :span="8"><el-form-item label="公司代码">{{detailForm.companyCode}}</el-form-item></el-col>
            <el-col :span="8"><el-form-item label="公司法人代表">{{detailForm.ppeople}}</el-form-item></el-col>
            <el-col :span="8"><el-form-item label-width="160px" label="公司法人代表联系方式">{{detailForm.ppeopleTel}}</el-form-item></el-col>
          </template>
          <el-col :span="24" v-if="detailForm.roleCode === '02' || detailForm.roleCode === '01'">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>{{detailForm.roleCode === '02' ? '查看身份证扫描件' : '查看营业执照文件'}}</span>
              </div>
              <el-table
                  v-loading="loading"
                  :row-class-name="tableRowClassName"
                  :data="fileData"
                  tooltip-effect="dark"
                  style="width: 100%">
                <el-table-column
                    align="center"
                    prop="name"
                    label="文件名称"
                    width="250">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="stampTime"
                    label="操作">
                  <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        @click="openFilePop(scope.row)"
                    >查看</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-col>
          <el-col :span="24" v-if="detailForm.roleCode === '03' || detailForm.roleCode === '04'">
            <el-link type="primary" v-if="detailForm.auditStatus!=='3'" @click="getEntrustment(detailForm)" :underline="true" style="font-weight: 600;margin-left: 32px;margin-bottom: 32px;">查看委托协议</el-link>
          </el-col>
          <el-col :span="24" v-if="detailForm.roleCode === '04'">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>有权限的合同列表</span>
              </div>
              <div>
                <el-table
                    v-loading="loading"
                    :row-class-name="tableRowClassName"
                    :data="tableData"
                    tooltip-effect="dark"
                    style="width: 100%">
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
                      prop="totalAmount"
                      label="合同金额">
                  </el-table-column>
                </el-table>
              </div>
              <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="tableQueryParams.current" :limit.sync="tableQueryParams.size" @pagination="getTableList" />
            </el-card>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="handelPass" v-if="btnStatus">
          通过
        </el-button>
        <el-button @click="handelFail" v-if="btnStatus">
          不通过
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { host } from '@/utils/host'
  import { accountmanagedic } from "@/utils/dictionary"
  import { request } from '@/api/work'
  export default {
    name: "Userexamine",
    data() {
      return {
        host,
        roleList: accountmanagedic.roleList,
        examineList: accountmanagedic.examineList,
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
          companyName: undefined,
          roleCode: undefined,
          auditStatus: undefined,
        },
        total: 0,
        fileData: [],
        tableQueryParams: {
          current: 1,
          size: 10,
        },
        tableTotal: 0,
        detailForm:{},
        tableData: [],
        btnStatus: false
      };
    },
    created() {
      this.getList();
    },
    filters: {
      auditStatusFilter(v) {
        let text;
        switch (Number(v)) {
          case 0:
            text = '草稿';
            break;
          case 1:
            text = '待审核';
            break;
          case 2:
            text = '审核通过';
            break;
          case 3:
            text = '审核驳回';
            break;
          default:
            break;
        }
        return text;
      },
      agreeFilter(v) {
        let text;
        switch (v) {
          case 'DRAFT':
            text = '草稿';
            break;
          case 'SIGNING':
            text = '签署中';
            break;
          case 'COMPLETE':
            text = '已完成';
            break;
          case 'REJECTED':
            text = '已退回';
            break;
          case 'RECALLED':
            text = '已撤回';
            break;
          case 'EXPIRED':
            text = '已过期';
            break;
          case 'FILLING':
            text = '拟定中';
            break;
          case 'TERMINATING':
            text = '作废确认中';
            break;
          case 'TERMINATED':
            text = '已作废';
            break;
          case 'DELETE':
            text = '已删除';
            break;
          case 'FINISHED':
            text = '强制完成';
            break;
          default:
            break;
        }
        return text;
      }
    },
    methods: {
      querySearchAsync(queryString, cb) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          request.getPorCompanyList({ pName: this.queryParams.companyName }).then(res => {
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
        let params = JSON.parse(JSON.stringify(this.queryParams));
        for (let key in params) {
          if (params[key] === '') {
            delete params[key]
          }
        }
        request.queryPage(params).then(response => {
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
          size: 10,
          userName: undefined,
          idCardNumber: undefined,
          phone: undefined,
          companyName: undefined,
          roleCode: undefined,
          auditStatus: undefined,
        }
        this.resetForm("queryForm");
        this.handleQuery();
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.current = 1;
        this.getList();
      },
      getEntrustment(v) {
        request.getContractUrl({keyCode: v.keyCode}).then(res => {
          window.open(res.data);
        })
      },
      openFilePop(v) {
        window.open(this.host + v.url)
      },
      handleExaMine(row) {
        if (row.roleCode !== '02') {
          request.getPorCompanyByMap({p_code: row.companyCode, id: row.companyId}).then(res => {
            if (res.success) {
              this.$set(this.detailForm, 'pname', res.data.pname)
              this.$set(this.detailForm, 'ppeople', res.data.ppeople)
              this.$set(this.detailForm, 'ppeopleTel', res.data.ppeopleTel)
            } else {
              this.$message.error(res.msg);
            }
          })
        }
        let auditStatus = Number(row.auditStatus);
        if (auditStatus === 1) {
          if (row.roleCode === '01' || row.roleCode === '02' || row.entrustmentStatus === 'COMPLETE') {
            this.btnStatus = true;
          } else {
            this.btnStatus = false;
          }
        } else if (auditStatus === 0) {
          this.btnStatus = true;
        } else {
          this.btnStatus = false;
        }
        this.tableQueryParams = {
          current: 1,
          size: 10,
        };
        this.detailForm = { ...row };
        this.open = true;
        this.title = "审核用户申请";
        if (this.detailForm.roleCode === '02' || this.detailForm.roleCode === '01') {
          request.getAttachInfo({keyCode: row.keyCode}).then(res => {
            this.fileData = res.data;
          })
        }
        if (this.detailForm.roleCode === '04') {
          this.getTableList();
        }
      },
      /** 查询列表 */
      getTableList() {
        this.loading = true;
        request.getContractAccountTempList({id: this.detailForm.id, ...this.tableQueryParams}).then(res => {
          this.tableData = res.data.records;
          this.tableTotal = parseInt(res.data.total);
          this.loading = false;
        })
      },
      tableRowClassName({row, rowIndex}) {
        if (row.checked) {
          return 'success-row';
        }
      },
      handelPass() {
        this.$confirm("确认通过？", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          width:"150px",
          type: "warning",
          closeOnClickModal: false,
          beforeClose: async (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '提交中...';
              const { code } = await request.auditPass(this.detailForm)
              if (code === 0) {
                done();
                setTimeout(() => {
                  instance.confirmButtonLoading = false;
                }, 300);
              }
            } else {
              done();
            }
          }
        }).then(() => {
          this.open = false;
          this.msgSuccess('操作成功');
          this.getList();
        })
      },
      handelFail() {
        this.$confirm("确认不通过？", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          width:"150px",
          type: "warning",
          closeOnClickModal: false,
          beforeClose: async (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '提交中...';
              const { code } = await request.auditNoPass({ id: this.detailForm.id });
              if (code === 0) {
                done();
                setTimeout(() => {
                  instance.confirmButtonLoading = false;
                }, 300);
              }
            } else {
              done();
            }
          }
        }).then(() => {
          this.open = false;
          this.msgSuccess('操作成功');
          this.getList();
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
