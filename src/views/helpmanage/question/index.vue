<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="问题" prop="question">
        <el-input
            v-model="queryParams.question"
            placeholder="请输入问题"
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
        >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table
        v-loading="loading"
        :data="menuList"
        row-key="id">
      <el-table-column label="序号" type="index" align="center" width="100" >
        <template slot-scope="scope">
          <span>{{(queryParams.current - 1) * queryParams.size + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="question" label="问题" width="200" align="center"></el-table-column>
      <el-table-column prop="answer" label="解答" width="200" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createPerson" label="创建人" align="center" width="250"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center" width="250"></el-table-column>
      <el-table-column prop="updatePerson" label="修改人" align="center" width="250"></el-table-column>
      <el-table-column prop="updateTime" label="修改时间" align="center"></el-table-column>
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
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="问题" prop="question">
              <el-input v-model="form.question" placeholder="请输入问题" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="解答" prop="answer">
              <el-input type="textarea" :rows="5" v-model="form.answer" placeholder="请解答"></el-input>
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
  import { helpmanage } from '@/api/work'
  export default {
    name: "admin",
    data() {
      return {
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
          question: '',
          current: 1,
          size: 10,
        },
        total: 0,
        menuList: [],
        form: {
          question: undefined,
          answer: undefined,
        },
        rules: {
          question: [
            { required: true, message: "请输入问题", trigger: "blur" }
          ],
          answer: [
            { required: true, message: "请解答", trigger: "blur" }
          ],
        }
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        this.form = {
          id: row.id,
          question: row.question,
          answer: row.answer,
        }
        this.open = true;
        this.title = "修改常见问题";
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        this.$confirm('是否确认删除此问题', {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          closeOnClickModal: false
        }).then(function() {
          return helpmanage.deleteUsualQuestion(row.id);
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
              helpmanage.updateUsualQuestion(this.form).then(response => {
                  this.loading = false;
                  this.open = false;
                  this.msgSuccess("保存成功");
                  this.getList();
                }
              );
            } else {
              helpmanage.insertUsualQuestion(this.form).then(response => {
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
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加常见问题";
      },
      // 表单重置
      reset() {
        this.form = {
          question: undefined,
          answer: undefined,
        };
        this.resetForm("form");
      },
      /** 查询菜单列表 */
      getList() {
        this.loading = true;
        helpmanage.getUsualQuestionListPage(this.queryParams).then(res => {
          this.menuList = res.data.records;
          this.total = res.data.total;
          this.loading = false;
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
      }
    }
  };
</script>
