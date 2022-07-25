<template>
  <div class="app-container">
    <el-row>
      <!--查询条件-->
      <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="80px">

        <el-form-item label="公文标题" prop="title">
          <el-input
            v-model="queryParams.title"
            placeholder="请输入公文标题"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter.native="handleQuery"
            @clear="queryParams.title = undefined"
          />
        </el-form-item>

        <el-form-item label="分类" prop="typeCode">
          <el-select
            @clear="queryParams.typeCode = undefined"
            v-model="queryParams.typeCode"
            placeholder="请选择分类"
            clearable
            size="small"
            style="width: 240px"
          >
            <el-option
              v-for="dict in typeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="发布时间" prop="publishTime">
          <el-date-picker
            @change="changePicker"
            v-model="publishDateRange"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发布状态" prop="statusCode">
          <el-select
            @clear="queryParams.statusCode = undefined"
            v-model="queryParams.statusCode"
            placeholder="请选择发布状态"
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

        <el-form-item label="发布人" prop="publisher">
          <el-input
            v-model="queryParams.publisher"
            placeholder="请输入发布人"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter.native="handleQuery"
            @clear="queryParams.publisher = undefined"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>

      </el-form>
      <!-- 表格按钮 -->
      <el-row class="mb8">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增
        </el-button>
      </el-row>

      <!-- 表格 -->
      <el-table v-loading="loading" :data="dataList">
        <el-table-column label="编号" align="center" key="documentId" prop="id" v-if="columns[0].visible"/>
        <el-table-column label="公文标题" align="center" key="title" prop="title" v-if="columns[1].visible"
                         :show-overflow-tooltip="true"/>
        <el-table-column label="分类" align="center" key="typeName" prop="typeName" v-if="columns[2].visible"
                         width="160"/>
        <el-table-column label="状态" align="center" key="statusName" prop="statusName" v-if="columns[3].visible"
                         width="160"/>
        <el-table-column label="发布人" align="center" key="publisher" prop="publisher" v-if="columns[4].visible"
                         width="120"/>
        <el-table-column label="发布时间" align="center" prop="publishTime" v-if="columns[5].visible" width="160">
          <template slot-scope="scope">
            <span>{{ parseTime(new Date(scope.row.publishTime).getTime()) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" v-if="columns[6].visible" width="160">
          <template slot-scope="scope">
            <span>{{ parseTime(new Date(scope.row.createTime).getTime()) }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              v-show="scope.row.statusCode==='01'||scope.row.statusCode==='03'"
              size="mini"
              type="text"
              icon="el-icon-upload"
              @click="handleStatusChange(scope.row,'02')"
            >发布
            </el-button>
            <el-button
              v-show="scope.row.statusCode==='02'"
              size="mini"
              type="text"
              icon="el-icon-sold-out"
              @click="handleStatusChange(scope.row,'03')"
            >下架
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-reading"
              @click="lookDoc(scope.row)"
            >查看
            </el-button>
            <el-button
              v-show="scope.row.statusCode==='01'||scope.row.statusCode==='03'"
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="changeDoc(scope.row)"
            >编辑
            </el-button>
            <el-button
              v-show="scope.row.statusCode==='01'||scope.row.statusCode==='03'"
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleStatusChange(scope.row,'04')"
            >删除
            </el-button>
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
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="open" width="800px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入公文标题"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分类" prop="typeCode">
              <el-select v-model="form.typeCode" placeholder="请选择" @change="handleTypeCodeChange">
                <el-option
                  v-for="dict in typeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="摘要" prop="summary">
              <el-input
                  type="textarea"
                  placeholder="请输入摘要"
                  v-model="form.summary"
                  maxlength="120"
                  show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <div class="Tinymce_box">
            <editor-vue v-model="form.docContent"></editor-vue>
          </div>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">保 存</el-button>
        <el-button type="primary" @click="handleStatusChangePop('02')">发 布</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="查看公文内容" :visible.sync="dialogTableVisible">
      <div>标题：{{dialogTableData.title}}</div><br/>
      <div>分类：{{dialogTableData.typeCode === '01' ? typeOptions[0].dictLabel : typeOptions[1].dictLabel}}</div><br/>
      <div>摘要：{{dialogTableData.summary}}</div>
      <div style="height: 600px;overflow: auto;" v-html="doc"></div>
    </el-dialog>
  </div>
</template>

<script>
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

import {request} from "@/api/work";
import editorVue from "@/components/Tinymce/index";
import {addQueryDateRange} from "@/utils/ruoyi";

export default {
  name: "Official",
  components: {editorVue},
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
      // 显示搜索文字
      showSearchText: "展开查询条件",
      // 显示搜索图标
      showSearchIcon: "el-icon-plus",
      // 总条数
      total: 0,
      // 表格数据
      dataList: null,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 日期范围
      publishDateRange: [],
      // 状态数据字典
      statusOptions: [{
        'dictLabel': '草稿',
        'dictValue': "01",
      }, {
        'dictLabel': '已发布',
        'dictValue': "02",
      }, {
        'dictLabel': '已下架',
        'dictValue': "03",
      }, {
        'dictLabel': '已删除',
        'dictValue': "04",
      }],
      statusMaps: {'01': ["新建", "草稿"], '02': ["发布", "已发布"], '03': ["下架", "已下架"], '04': ["删除", "已删除"]},
      // 分类数据字典
      typeOptions: [{
        'dictLabel': '沈腾新闻',
        'dictValue': '01',
      }, {
        'dictLabel': '请款公文',
        'dictValue': '02',
      }],
      // 表单参数
      form: {
        typeCode: undefined,
        typeName: undefined,
        docContent: undefined,
        title: undefined,
      },
      dialogTableVisible: false,
      doc:'',
      dialogTableData: {},
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
        title: undefined,
        typeCode: undefined,
        statusCode: undefined,
        publisher: undefined
      },
      // 列信息
      columns: [
        {key: 0, label: `编码`, visible: false},
        {key: 1, label: `公文标题`, visible: true},
        {key: 2, label: `分类`, visible: true},
        {key: 3, label: `状态`, visible: true},
        {key: 4, label: `发布人`, visible: true},
        {key: 5, label: `发布时间`, visible: true},
        {key: 6, label: `创建时间`, visible: true}
      ],
      // 表单校验
      rules: {
        title: [
          {required: true, message: "公文标题不能为空", trigger: "blur"}
        ],
        typeCode: [
          {required: true, message: "请选择分类", trigger: "blur"}
        ],
        summary: [
          {required: true, message: "摘要不能为空", trigger: "blur"}
        ],
      },
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
    this.handleQuery();
  },
  methods: {
    changePicker(value) {
      if (value === null) {
        this.$nextTick(() => {
          this.publishDateRange = [];
        })
      }
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      let queryParams = JSON.parse(JSON.stringify(this.queryParams))
      request.listDocumentInfo(addQueryDateRange(queryParams, this.publishDateRange, "PublishTime")).then(response => {
          this.dataList = response.data.records;
          this.total = parseInt(response.data.total);
          this.loading = false;
        }
      );
    },
    handleStatusChangePop(code) {
      this.$refs["form"].validate(valid => {
        if (valid) {
          const row = JSON.parse(JSON.stringify(this.form));
          this.handleStatusChange(row, code, true);
        }
      });
    },
    // 用户状态修改
    handleStatusChange(row, code, closePop = false) {
      let array = this.statusMaps[code];
      this.$confirm('确认要【' + array[0] + '】此公文吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        closeOnClickModal: false
      }).then(() => {
        row.statusCode = code;
        row.statusName = array[1];
        if (row.statusName.indexOf("发布") != -1) {
          row.publishTime = this.parseTime(new Date());
          row.publisher = this.$store.getters.name;
        }
        request.saveDocumentInfo(row).then(response => {
          if (closePop) {
            this.open = false;
          }
          this.msgSuccess(array[0] + "成功");
          this.getList();
        }).catch(() => {
          this.msgError(array[0] + "失败");
        });
      })
    },
    // 取消按钮
    cancel() {
      this.$confirm('是否确认退出?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        closeOnClickModal: false
      }).then(() => {
        this.open = false;
        this.reset();
      })
    },
    // 表单重置
    reset() {
      this.form = {
        docContent: undefined,
        createTime: undefined,
        modifyTime: undefined,
        statusCode: undefined,
        statusName: undefined,
        typeCode: undefined,
        typeName: undefined,
        title: undefined,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.current = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        current: 1,
        size: 10,
        title: undefined,
        typeCode: undefined,
        // publishDateRange: undefined,
        statusCode: undefined,
      }
      this.publishDateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加公文";
      this.form.statusName = "草稿";
      this.form.statusCode = "01";
    },
    /** 编辑公文 */
    changeDoc(row) {
      if (row.publishTime === null) {
        delete row.publishTime;
      }
      this.title = "编辑公文";
      this.form = {
        ...row
      }
      this.form.typeCode = row.typeCode
      this.form.typeName = row.typeName
      this.form.docContent = row.docContent
      this.form.title = row.title
      this.open = true;
    },
    /** 预览 */
    lookDoc(row){
      this.dialogTableData = row;
      this.doc = row.docContent
      this.dialogTableVisible = true
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          request.saveDocumentInfo(this.form).then(response => {
              this.loading = false;
              this.open = false;
              this.msgSuccess("保存成功");
              this.handleQuery();
            }
          );
        }
      });
    },
    /** 类型变动监听 */
    handleTypeCodeChange: function (val) {
      let obj = {}
      obj = this.typeOptions.find(function (item) {
        return item.dictValue === val
      })
      this.form.typeName = obj.dictLabel;
    },
  }
};
</script>
<style lang="scss" scoped>
.Tinymce_box {
  display: flex;
}

.editor-content {
  margin-left: 30px;
  flex-grow: 1;
  border: 2px dashed #f1f1f1;
  padding: 0 20px;
}

h3 {
  color: #808080;
}
</style>
