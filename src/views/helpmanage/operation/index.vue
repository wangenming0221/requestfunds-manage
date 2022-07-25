<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="操作指引名称" prop="operateName">
        <el-input
            v-model="queryParams.operateName"
            placeholder="请输入操作指引名称"
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
        v-loading="loading"
        :data="menuList"
        row-key="id">
      <el-table-column label="序号" type="index" align="center" width="100">
        <template slot-scope="scope">
          <span>{{(queryParams.current - 1) * queryParams.size + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="operateName" label="名称" width="200" align="center"></el-table-column>
      <el-table-column prop="remark" label="简介" width="200" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="mediaName" label="视频" width="200" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="text"
              @click="handleVideo(scope.row)"
          >{{scope.row.mediaName}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="createPerson" label="创建人" align="center" width="150"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center" width="250"></el-table-column>
      <el-table-column prop="updatePerson" label="修改人" align="center" width="150"></el-table-column>
      <el-table-column prop="updateTime" label="修改时间" align="center" width="250"></el-table-column>
      <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="text"
              @click="handleUpdate(scope.row)"
          >修改
          </el-button>
          <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.row)"
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
    <!-- 添加或修改部门对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="操作指引名称" prop="operateName">
              <el-input v-model="form.operateName" placeholder="请输入操作指引名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="简介">
              <el-input type="textarea" :rows="3" v-model="form.remark" placeholder="请输入简介"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="视频文件" prop="mediaUrl" ref="mediaUrlUpload">
              <el-upload
                  v-loading="uploadLoading"
                  :show-file-list="false"
                  :file-list="fileList"
                  ref="upload"
                  accept=".mp4"
                  :headers="upload.headers"
                  :action="upload.url"
                  :disabled="upload.isUploading"
                  :on-progress="handleFileUploadProgress"
                  :on-success="handleFileSuccess"
                  :auto-upload="true"
                  drag>
                <em class="el-icon-upload"></em>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip text-center" slot="tip">
                  <span>仅允许导入mp4格式视频文件，重复导入将覆盖原视频文件。</span>
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

    <!-- 视频对话框 -->
    <el-dialog :title="videoTitle" :visible.sync="popVideo" width="600px" append-to-body @close="closeVideo">
      <video :src="videoUrl" autoplay controls style="width: 100%" ref="video" v-if="videoUrl"></video>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeVideo">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {baseURL} from "@/config";
  import {host} from '@/utils/host';
  import {getToken} from "@/utils/auth";
  import {helpmanage} from '@/api/work';

  export default {
    name: "admin",
    data() {
      return {
        uploadLoading: false,
        videoTitle: '',
        videoUrl: null,
        popVideo: false,
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
          operateName: '',
          current: 1,
          size: 10,
        },
        total: 0,
        menuList: [],
        form: {
          operateName: undefined,
          remark: undefined,
          mediaUrl: undefined,
          mediaName: undefined,
          mediaSize: undefined,
        },
        rules: {
          operateName: [
            {required: true, message: "请输入问题", trigger: "blur"}
          ],
          mediaUrl: [
            {required: true, message: "请上传视频文件", trigger: "change"}
          ],
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
          headers: {Authorization: getToken()},
          // 上传的地址
          url: baseURL + "/request-funds-operatemanage/helpCenter/uploadMedia"
        },
      }
    },
    created() {
      this.getList();
    },
    methods: {
      handleVideo(value) {
        this.videoUrl = this.host + value.mediaUrl;
        // this.videoUrl = 'http://vjs.zencdn.net/v/oceans.mp4';
        this.videoTitle = value.operateName;
        this.popVideo = true;
      },
      closeVideo() {
        this.popVideo = false;
        this.$refs.video.pause();
        this.videoUrl = null;
      },
      // 文件移除
      handleFileRemove(file, fileList) {
        this.fileList = [];
        this.form.mediaUrl = undefined;
      },
      // 文件上传中处理
      handleFileUploadProgress(event, file, fileList) {
        this.uploadLoading = true;
        this.upload.isUploading = true;
      },
      // 文件上传成功处理
      handleFileSuccess(response, file, fileList) {
        this.$alert(response.msg, "导入结果", {dangerouslyUseHTMLString: true});
        this.form.mediaUrl = response.data.mediaUrl;
        this.form.mediaName = response.data.mediaName;
        this.form.mediaSize = response.data.mediaSize;
        this.$refs.mediaUrlUpload.clearValidate();
        this.upload.open = false;
        this.upload.isUploading = false;
        this.uploadLoading = false;
        this.fileList = [{ name: file.name }];
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加操作指引";
      },
      // 表单重置
      reset() {
        this.form = {
          operateName: undefined,
          remark: undefined,
          mediaUrl: undefined,
          mediaName: undefined,
          mediaSize: undefined,
        };
        this.fileList = [];
        this.resetForm("form");
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        this.form = {
          id: row.id,
          mediaUrl: row.mediaUrl,
          operateName: row.operateName,
          mediaSize: row.mediaSize,
          mediaName: row.mediaName,
          remark: row.remark,
        }
        this.open = true;
        this.title = "修改操作指引";
        this.fileList = [{name: row.mediaName}];
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        this.$confirm('是否确认删除此条数据', {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          closeOnClickModal: false
        }).then(function () {
          return helpmanage.deleteOperate(row.id);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {
              helpmanage.updateOperate(this.form).then(response => {
                  this.loading = false;
                  this.open = false;
                  this.msgSuccess("保存成功");
                  this.getList();
                }
              );
            } else {
              helpmanage.insertOperate(this.form).then(response => {
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
        helpmanage.getOperateListPage(this.queryParams).then(res => {
          this.menuList = res.data.records;
          this.total = res.data.total;
          this.loading = false;
        });
      }
    }
  };
</script>
