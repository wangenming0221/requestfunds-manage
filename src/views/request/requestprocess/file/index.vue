<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="附件名称" prop="enclosureName">
        <el-input
            v-model="queryParams.enclosureName"
            placeholder="请输入附件名称"
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
            @click="handleAdd"
        >新增
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table
        :row-class-name="tableRowClassName"
        v-loading="loading"
        :data="menuList"
        row-key="id">
      <el-table-column label="序号" type="index" align="center" width="100">
        <template slot-scope="scope">
          <span>{{(queryParams.current - 1) * queryParams.size + scope.$index + 1}}</span>
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
      <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="text"
              @click="handleUpdate(scope.row)"
          >编辑
          </el-button>
<!--          <el-button-->
<!--              size="mini"-->
<!--              type="text"-->
<!--              @click="handleDelete(scope.row)"-->
<!--          >-->
<!--            {{Number(scope.row.enableStatus) !== 0 ? '启用' : '停用'}}-->
<!--          </el-button>-->
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
    <!-- 添加或修改部门对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="附件名称" prop="enclosureName">
              <el-input v-model="form.enclosureName" placeholder="请输入附件名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="!form.id">
            <el-form-item label="附件文件" prop="enclosureUrl" ref="fileUrlUpload">
              <el-upload
                  accept=".doc, .xls"
                  :before-upload="beforeUpload"
                  v-loading="uploadLoading"
                  :show-file-list="false"
                  :file-list="fileList"
                  ref="upload"
                  :headers="upload.headers"
                  :action="upload.url"
                  :disabled="upload.isUploading"
                  :data="upload.data"
                  :on-progress="handleFileUploadProgress"
                  :on-success="handleFileSuccess"
                  :auto-upload="true"
                  drag>
                <em class="el-icon-upload"></em>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip text-center" slot="tip">
                  <span>重复导入将覆盖原附件文件。</span>
                </div>
              </el-upload>
              <ul class="el-upload-list el-upload-list--text" v-if="fileList.length">
                <li tabindex="0" class="el-upload-list__item is-success">
                  <a class="el-upload-list__item-name"><em class="el-icon-document"></em>{{fileList[0].name}}</a>
                  <label class="el-upload-list__item-status-label">
                    <em class="el-icon-upload-success el-icon-circle-check"></em>
                  </label>
                  <em class="el-icon-close" @click="handleFileRemove"></em>
                </li>
              </ul>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {baseURL} from "@/config";
  import {host} from '@/utils/host';
  import {getToken} from "@/utils/auth";
  import {request} from '@/api/work';

  export default {
    name: "File",
    data() {
      return {
        uploadLoading: false,
        fileList: [],
        baseURL,
        host,
        // 遮罩层
        loading: true,
        // 显示搜索条件
        showSearch: true,
        // 菜单树选项
        menuOptions: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          enclosureName: '',
          current: 1,
          size: 10,
        },
        total: 0,
        menuList: [],
        form: {
          enclosureName: undefined,
          enclosureType: undefined,
          enclosureUrl: undefined,
        },
        rules: {
          enclosureName: [
            {required: true, message: "请输入附件名称", trigger: "blur"}
          ],
          enclosureUrl: [
            {required: true, message: "请上传附件文件", trigger: "change"}
          ],
        },
        // 用户导入参数
        upload: {
          data: {},
          // 是否显示弹出层（用户导入）
          open: false,
          // 弹出层标题（用户导入）
          title: "",
          // 是否禁用上传
          isUploading: false,
          // 是否更新已经存在的用户数据
          updateSupport: 0,
          // 设置上传的请求头部
          headers: {Authorization: getToken()},
          // 上传的地址
          url: baseURL + "/request-funds-operatemanage/enclosure/uploadEnclosureFile"
        },
      }
    },
    created() {
      this.getList();
    },
    methods: {
      tableRowClassName({row, rowIndex}) {
        if (Number(row.enableStatus) !== 0) {
          return 'warning-row';
        } else {
          return '';
        }
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.current = 1;
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
        request.getRequestEnclosureListPage({ ...this.queryParams, apiType: 1 }).then(res => {
          this.menuList = res.data.records;
          this.total = res.data.total;
          this.loading = false;
        });
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加附件";
      },
      // 表单重置
      reset() {
        this.form = {
          enclosureName: undefined,
          enclosureUrl: undefined,
          enclosureType: undefined,
        };
        this.fileList = [];
        this.resetForm("form");
      },
      beforeUpload(file) {
        const enclosureType = file.name.substring(file.name.lastIndexOf('.') + 1);
        this.upload.data = {
          enclosureType
        }
        return new Promise(resolve => {
          this.$nextTick(() => {
            resolve(true);
          })
        })
      },
      // 文件上传成功处理
      handleFileSuccess(response, file, fileList) {
        this.$alert(response.msg, "导入结果", {dangerouslyUseHTMLString: true});
        this.form.enclosureUrl = response.data;
        this.form.enclosureType =  this.upload.data.enclosureType;
        this.$refs.fileUrlUpload.clearValidate();
        this.upload.isUploading = false;
        this.uploadLoading = false;
        this.fileList = [{ name: file.name }];
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id) {
              request.updateRequestEnclosure(this.form).then(response => {
                  this.loading = false;
                  this.open = false;
                  this.msgSuccess("保存成功");
                  this.getList();
                }
              );
            } else {
              request.addRequestEnclosure(this.form).then(response => {
                  this.loading = false;
                  this.open = false;
                  this.msgSuccess("保存成功");
                  this.getList();
                }
              );
            }
          }
        });
      },
      // 取消按钮
      cancel() {
        this.open = false;
      },
      handleFile(value) {
        window.open(value.visitUrl);
      },
      /** 修改按钮操作 */
      handleUpdate({ enclosureName, enclosureUrl, enclosureType, id }) {
        this.reset();
        this.form = {
          id,
          enclosureName,
          enclosureUrl,
          enclosureType,
        }
        this.open = true;
        this.title = "编辑附件";
        this.fileList = [{name: enclosureName + '.' + enclosureType}];
      },
      // 文件上传中处理
      handleFileUploadProgress(event, file, fileList) {
        this.uploadLoading = true;
        this.upload.isUploading = true;
      },
      // 文件移除
      handleFileRemove(file, fileList) {
        this.fileList = [];
        this.form.enclosureUrl = undefined;
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const enableStatus = Number(row.enableStatus) === 0 ? 1 : 0;
        this.$confirm(`确认${Number(row.enableStatus) === 0 ? '停用?' : '启用?'}`, {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          closeOnClickModal: false
        }).then(function () {
          return request.deleteRequestEnclosure({ id: row.id, enableStatus });
        }).then(() => {
          this.getList();
          this.msgSuccess("操作成功");
        });
      },
    }
  };
</script>
<style lang="scss" scoped>
  ::v-deep {
    .warning-row {
      background: rgba(245, 108, 108, .5);
    }
  }
</style>
