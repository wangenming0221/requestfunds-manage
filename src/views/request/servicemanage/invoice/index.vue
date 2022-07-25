<template>
  <div class="app-container">
    <el-row>
      <!--查询条件-->
      <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px">
        <el-form-item label="申请人" prop="userName">
          <el-input
              v-model="queryParams.userName"
              placeholder="请输入申请人"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
              @clear="queryParams.userName = undefined"/>
        </el-form-item>
        <el-form-item label="申请时间" prop="createTime">
          <el-date-picker
              value-format="yyyy-MM-dd"
              clearable
              v-model="createDateRange"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              @change="changePicker">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="申请人手机号" prop="phoneNumber">
          <el-input
              v-model="queryParams.phoneNumber"
              placeholder="请输入申请人手机号"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
              @clear="queryParams.phoneNumber = undefined"/>
        </el-form-item>
        <el-form-item label="申请人公司" prop="pname">
          <el-select
            v-model="queryParams.deptId"
            placeholder="请输入申请人公司"
            clearable
            size="small"
            style="width: 240px"
            @clear="queryParams.pname = undefined">
            <el-option
              v-for="com in companyList"
              :key="com.id"
              :label="com.pname"
              :value="com.id"
            />
          </el-select>

        </el-form-item>
        <el-form-item label="发票状态" prop="status">
          <el-select
              v-model="queryParams.status"
              placeholder="请选择发票状态"
              clearable
              size="small"
              style="width: 240px"
              @clear="queryParams.status = undefined">
            <el-option
                v-for="dict in statusOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <!-- 表格按钮 -->
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              :disabled="multiple"
              @click="handleOpenVoice"
          >批量已开
          </el-button>
        </el-col>
        <el-col :span="1.5">
<!--          <el-button-->
<!--              type="primary"-->
<!--              plain-->
<!--              icon="el-icon-plus"-->
<!--              size="mini"-->
<!--              :disabled="multiple"-->
<!--              @click="handleExport"-->
<!--          >根据筛选条件导出-->
<!--          </el-button>-->
          <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleExport"
          >根据筛选条件导出
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleImport"
          >导入批量修改
          </el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>
      <!-- 表格 -->
      <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" :selectable="selectable"/>
        <el-table-column label="编号" align="center" key="id" prop="id" v-if="columns[0].visible"/>
        <el-table-column label="申请人" align="center" key="userName" prop="userName" v-if="columns[1].visible"
                         :show-overflow-tooltip="true"/>
        <el-table-column label="申请人手机号" align="center" key="phoneNumber" prop="phoneNumber" v-if="columns[1].visible"
                         :show-overflow-tooltip="true"/>
        <el-table-column label="所代表公司" align="center" key="deptName" prop="deptName" v-if="columns[2].visible"/>
        <el-table-column label="发票总金额" align="center" key="totalAmount" prop="totalAmount" v-if="columns[3].visible"/>
        <el-table-column label="申请时间" align="center" prop="createTime" v-if="columns[4].visible"/>
        <el-table-column label="发票状态" align="center" prop="status" v-if="columns[5].visible">
          <template slot-scope="scope">
            {{ scope.row.status | filterStatusOptions(that) }}
          </template>
        </el-table-column>
        <el-table-column label="发票类型" align="center" prop="invoiceType"/>
        <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
                size="mini"
                type="text"
                icon="el-icon-reading"
                @click="lookInvoice(scope.row)"
            >查看详情
            </el-button>
            <el-button
                v-show="Number(scope.row.status) === 0"
                size="mini"
                type="text"
                icon="el-icon-reading"
                @click="handleStatusChange(scope.row)"
            >开票
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.current"
          :limit.sync="queryParams.size"
          @pagination="getList"/>
    </el-row>

    <el-dialog title="发票详情" :visible.sync="dialogTableVisible" v-if="dialogTableVisible">
      <el-descriptions title="发票详情">
        <el-descriptions-item label="申请人">{{dialogTableData.userName}}</el-descriptions-item>
        <el-descriptions-item label="所代表公司">{{dialogTableData.deptName}}</el-descriptions-item>
        <el-descriptions-item label="发票总金额">{{dialogTableData.totalAmount}}</el-descriptions-item>
        <el-descriptions-item label="申请时间">{{dialogTableData.createTime}}</el-descriptions-item>
        <el-descriptions-item label="发票状态">{{dialogTableData.status | filterStatusOptions(that)}}</el-descriptions-item>
      </el-descriptions>
      <el-table v-loading="invoiceloading" :data="invoiceDetailList">
        <el-table-column label="服务费类型" align="center" key="title" prop="orderName"/>
        <el-table-column label="缴纳时间" align="center" key="typeName" prop="payBackTime"/>
        <el-table-column label="金额" align="center" key="statusName" prop="orderMoney"/>
      </el-table>
      <pagination
          v-show="dialogTotal>0"
          :total="dialogTotal"
          :page.sync="dialogQueryParams.current"
          :limit.sync="dialogQueryParams.size"
          @pagination="getInvoiceDetailList"/>
    </el-dialog>

    <!-- 导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
          ref="upload"
          :limit="1"
          accept=".xlsx, .xls"
          :headers="upload.headers"
          :action="upload.url"
          :disabled="upload.isUploading"
          :on-progress="handleFileUploadProgress"
          :on-success="handleFileSuccess"
          :auto-upload="false"
          drag
      >
        <em class="el-icon-upload"></em>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
<!--        <div class="el-upload__tip" slot="tip">-->
<!--          <el-checkbox v-model="upload.updateSupport"/>-->
<!--          是否更新已经存在的数据-->
<!--        </div>-->
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="cancelFileForm">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {request, basedata} from '@/api/work';
  import {baseURL} from "@/config";
  import {getToken} from "@/utils/auth";
  import {addDateRange} from "@/utils/ruoyi";

  export default {
    name: 'Invoice',
    filters: {
      filterStatusOptions(value, that) {
        return that.statusOptions.find(v => v.dictValue === Number(value)).dictLabel
      },
    },
    data() {
      return {
        timeout: null,
        that: this,
        // 遮罩层
        loading: true,
        baseURL,
        invoiceloading: false,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 显示搜索图标
        showSearchIcon: "el-icon-plus",
        // 总条数
        total: 0,
        // 表格数据
        dataList: null,
        exportInvoiceList: null,
        //发票详情表格数据
        invoiceDetailList: null,
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 日期范围
        createDateRange: [],
        // 状态数据字典
        statusOptions: [{
          'dictLabel': '全部',
          'dictValue': '',
        }, {
          'dictLabel': '待开票',
          'dictValue': 0,
        }, {
          'dictLabel': '已开票',
          'dictValue': 1,
        }],
        companyList:[],
        // 表单参数
        form: {
          // typeName: undefined,
          // docContent: undefined,
          // userName: undefined
        },
        dialogTableVisible: false,
        dialogTableData: {},
        selection: [],
        // 用户导入参数
        upload: {
          // 是否显示弹出层（用户导入）
          open: false,
          // 弹出层标题（用户导入）
          title: "",
          // 是否禁用上传
          isUploading: false,
          // 是否更新已经存在的用户数据
          // updateSupport: 0,
          // 设置上传的请求头部
          headers: {Authorization: getToken()},
          // 上传的地址
          url: baseURL + "/request-funds-operatemanage/invoice/importInvoiceExcel"
        },
        // 查询参数
        queryParams: {
          current: 1,
          size: 10,
          userName: undefined,
          phoneNumber: undefined,
          deptId: undefined,
          status: undefined
        },
        dialogQueryParams: {
          current: 1,
          size: 10,
        },
        dialogTotal: 0,
        // 列信息
        columns: [
          {key: 0, label: `编号`, visible: false},
          {key: 1, label: `申请人`, visible: true},
          {key: 2, label: `代表公司`, visible: true},
          {key: 3, label: `发票总金额`, visible: true},
          {key: 4, label: `申请时间`, visible: true},
          {key: 5, label: `状态`, visible: true}
        ],
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      };
    },
    created() {
      this.getList();
      this.getCompanyParamList();
    },
    methods: {
      delUndefinedAndEmptyString(data) {
        let obj = JSON.parse(JSON.stringify(data));
        for (let key in obj) {
          if (obj[key] === '' || obj[key] === undefined) {
            delete obj[key];
          }
        }
        return obj;
      },
      /** 查询列表 */
      getList() {
        this.loading = true;
        let queryParams = this.delUndefinedAndEmptyString(this.queryParams);
        let params = this.createDateRange.length ? addDateRange(queryParams, this.createDateRange) : queryParams;
        request.listInvoiceInfo(params).then(response => {
            this.dataList = response.data.records;
            this.total = parseInt(response.data.total);
            this.loading = false;
          }
        );
        // 导出全部数据
        request.listInvoiceInfo(Object.assign({}, params, { size: -1 })).then(response => {
            this.exportInvoiceList = response.data.records;
          }
        );
      },
      /** 查询公司列表 */
      getCompanyParamList() {
        this.loading = true;
        request.getCompanyList().then(response => {
            this.companyList = response.data;
          }
        );
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.queryParams = {
          current: 1,
          size: this.queryParams.size,
          userName: undefined,
          phoneNumber: undefined,
          deptName: undefined,
          status: undefined
        }
        this.createDateRange = [];
        this.resetForm("queryForm");
        this.handleQuery();
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.current = 1;
        this.getList();
      },
      changePicker(v) {
        if (v == null) {
          this.$nextTick(() => {
            this.createDateRange = [];
          })
        }
      },
      /** 预览 */
      lookInvoice(row) {
        this.dialogTableData = row;
        this.dialogQueryParams = {
          current: 1,
          size: this.dialogQueryParams.size,
        };
        this.dialogTableVisible = true;
        this.getInvoiceDetailList();
      },
      /** 查询发票详情列表 */
      getInvoiceDetailList() {
        this.invoiceloading = true;
        request.queryInvoiceDetails({invoiceId: this.dialogTableData.id, ...this.dialogQueryParams}).then(response => {
            this.invoiceDetailList = response.data.records;
            this.dialogTotal = parseInt(response.data.total);
            this.invoiceloading = false;
          }
        );
      },
      //发票状态修改
      handleStatusChange(row) {
        this.$confirm('确认要开发票?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          closeOnClickModal: false
        }).then(function () {
          return request.updateStatus({id: row.id});
        }).then(() => {
          this.getList();
          this.msgSuccess("操作成功");
        })
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.selection = selection;
        this.multiple = !selection.length;
      },
      selectable(row, index) {
        return Number(row.status) === 1 ? false : true;
      },
      //批量已开发票
      handleOpenVoice() {
        this.$confirm('确认批量已开发票?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          closeOnClickModal: false
        }).then(() => {
          let data = {};
          data.params = {};
          data.params.invoiceIds = this.selection.map(v => v.id).join(',');
          return request.updateAllStatus(data)
        }).then((res) => {
          if (Number(res.code) === 0) {
            this.msgSuccess("操作成功");
            this.getList();
          }
        })
      },
      //根据筛选条件导出
      handleExport() {
        const that = this;
        this.$confirm('确认导出?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          closeOnClickModal: false
        }).then(() => {
          const params = this.exportInvoiceList.map(v => {
            return {
              "id": v.id,
              "invoiceType": v.invoiceType,
              "invoiceNumber": v.invoiceNumber,
              "totalAmount": v.totalAmount,
              "status": v.status,
              "comTaxNumber": v.comTaxNumber,
              "comAddress": v.comAddress,
              "comPhone": v.comPhone,
              "comBankName": v.comBankName,
              "comBankAccount": v.comBankAccount,
              "comEmail": v.comEmail
            }
          })
          let url = baseURL + '/request-funds-operatemanage/invoice/exportInvoiceExcel';
          let xhr = new XMLHttpRequest();
          xhr.open('POST', url, true);
          xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
          xhr.send(JSON.stringify(params));
          xhr.responseType = 'blob';
          xhr.onload = function (e) {
            if (this.status === 200) {
              let name = xhr.getResponseHeader('Content-Disposition');
              name = decodeURIComponent(name);
              let fileName = name.substring(29, name.length);
              let blob = new Blob([xhr.response]);
              let eLink = document.createElement('a');
              eLink.style.display = 'none';
              eLink.href = URL.createObjectURL(blob);
              document.body.appendChild(eLink);
              eLink.download = fileName;
              eLink.click();
              document.body.removeChild(eLink);
              that.msgSuccess("操作成功");
            }
          };
        })
      },
      querySearchAsync(queryString, cb) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          request.listInvoiceInfo().then(res => {
            const data = res.data.records.map(v => {
              return {'value': v.deptName};
            })
            cb(data);
          })
        }, 2000 * Math.random());
      },
      //导入批量修改
      handleImport() {
        this.upload.title = "导入批量修改";
        this.upload.open = true;
      },
      // 文件上传中处理
      handleFileUploadProgress(event, file, fileList) {
        this.upload.isUploading = true;
      },
      // 文件上传成功处理
      handleFileSuccess(response, file, fileList) {
        this.upload.open = false;
        this.upload.isUploading = false;
        this.$refs.upload.clearFiles();
        this.$alert(response.msg, "导入结果", {dangerouslyUseHTMLString: true});
        this.getList();
      },
      // 提交上传文件
      submitFileForm() {
        this.$refs.upload.submit();
      },
      // 取消按钮
      cancelFileForm() {
        this.$refs.upload.clearFiles();
        this.upload.open = false;
      },
    }
  };
</script>
<style lang="scss" scoped>
</style>
