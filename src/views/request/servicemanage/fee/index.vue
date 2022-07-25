<template>

  <div class="app-container">
    <!-- 列表 -->
    <el-form :model="queryParams" ref="queryForm" :inline="true"> </el-form>

    <el-table v-loading="loading" :data="moneyList" >
      <el-table-column prop="id" label="ID" align="center" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="name" label="支付名称" align="center" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="money" label="支付金额(元)" align="center" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="updateTime" label="修改时间" align="center" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit"  @click="handleUpdate(scope.row)" v-hasPermi="['servicemanage:fee:list']" >修改</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--  修改 配置文件 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="支付名称"><el-input v-model="form.name" placeholder="请输入支付名称" :disabled="true"/></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="支付金额"  prop="money" ><el-input v-model="form.money" placeholder="请输入支付金额(元)"/></el-form-item>
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

  import { request } from '@/api/work'
  export default {
    name: "Menu",
    data() {
      return {
        rules: {
          money: [
            { required: true, message: "支付金额不能为空"},
            { message: "支付金额必须为大于零的数字,且只能输入两位小数", pattern:/^0\.([1-9]|\d[1-9])$|^[1-9]\d{0,8}\.\d{0,2}$|^[1-9]\d{0,8}$/,trigger: "blur"}
            // { message: "支付金额必须为数字,且只能输入两位小数", pattern:/^[0-9]+([.]{1}[0-9]{1,2})?$/,trigger: "blur"}
          ]
        },
        form:{
          id:"",
          name: "",
          money: ""
        },
        // 遮罩层
        loading: true,
        // 菜单表格树数据
        moneyList: [],
        // 菜单树选项
        menuOptions: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 显示状态数据字典
        visibleOptions: [],
        // 菜单状态数据字典
        statusOptions: [],
        // 查询参数,
        queryParams:{}
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询菜单列表 */
      getList() {
        this.loading = true;
        request.getPayCategoryList().then(response => {
          this.moneyList = response.data;
          this.loading = false;
        });
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.pushData(row);
        this.open = true;
        this.title = "修改支付信息";
      },
      submitForm(){
        this.$refs["form"].validate(valid => {
          if (valid) {
            request.updateMoney(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          }
        });

      },
      // 取消按钮
      cancel() {
        this.open = false;
        // this.reset();
      },
      pushData(row) {
        this.form = {
          id:row.id,
          name: row.name,
          money:row.money
        };
      },
      // 加载表单
      reset() {
        this.form = {
          id:undefined,
          name: "",
          money:undefined
        };
      }

    }
  };
</script>
