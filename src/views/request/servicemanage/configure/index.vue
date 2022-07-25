<template>

  <div class="app-container">
    <!-- 列表 -->
    <el-form :model="queryParams" ref="queryForm" :inline="true"> </el-form>

    <el-table v-loading="loading" :data="manageList" >
      <el-table-column prop="id" label="ID" align="center" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="payName" label="支付平台" align="center" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="appId" label="appId" align="center" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="prKey" label="prKey" align="center" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="状态" align="center" key="disabledStatus"  >
          <template slot-scope="scope">
            <el-switch
              @change="handleStatusChange(scope.row)"
              :active-value="0"
              :inactive-value="1"
              v-model="scope.row.disabledStatus"
              active-text="启用"
              inactive-text="停用">
            </el-switch>
          </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="创建时间" align="center" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit"  @click="handleUpdate(scope.row)" v-hasPermi="['servicemanage:configure:list']" >修改</el-button>
        </template>
      </el-table-column>
    </el-table>


    <!--  修改 配置文件 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form"  :rules="rules" :model="form" label-width="80px">

        <el-row>
          <el-col :span="12">
            <el-form-item label="支付平台" > <el-input v-model="form.payName" placeholder="请输入支付平台" :disabled="true"/> </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="disabledStatus" > <el-input v-model="form.disabledStatusName" placeholder="请选择状态" :disabled="true"/> </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="appId" prop="appId" > <el-input v-model="form.appId" placeholder="请输入appId" /> </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="私钥"   prop="prKey" >  <el-input v-model="form.prKey" type="textarea"  placeholder="请输入私钥" /> </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="商户ID" :prop="form.payBusId==1?'mchId':''" v-if="form.payBusId==1"> <el-input v-model="form.mchId"   placeholder="请输入商户ID"   /> </el-form-item>
            <el-form-item label="公钥"   :prop="form.payBusId==2?'puKey':''" v-if="form.payBusId==2"> <el-input v-model="form.puKey"   placeholder="请输入支付宝公钥" type="textarea" /> </el-form-item>
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
          appId: [
            { required: true, message: "appId不能为空"}
          ],
          prKey: [
            { required: true, message: "私钥不能为空"}
          ],
          mchId: [
            { required: true, message: "商户ID不能为空"}
          ],
          puKey: [
            { required: true, message: "公钥不能为空"}
          ]
        },
        form:{
          id:"",
          appId: "",
          disName: "",
          disabledStatusName:"",
          mchId:"",
          pName:"",
          pType:"",
          prKey:"",
          puKey:"",
          pValue:0,
          leavestate:''
        },
        // 遮罩层
        loading: true,
        // 菜单表格树数据
        manageList: [],
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
        // 查询参数
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
        request.getPayManageList().then(response => {
          this.manageList = response.data;
          this.loading = false;
        });
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.pushData(row);
        this.open = true;
        this.title = "修改支付配置";
      },
      submitForm(){
        this.$refs["form"].validate(valid => {
          if (valid) {
            request.updatePayManage(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          }
        });
      },

      handleStatusChange(row){
        let param={id:row.id,disabledStatus:row.disabledStatus};
        let text="确认要启用"+row.payName+"平台吗？";
        if(row.disabledStatus===1){
          text="确认要停用"+row.payName+"平台吗？停用后该支付方式将无法正常进行！";
        }
        this.$confirm(text, "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          width:"150px",
          type: "warning",
          closeOnClickModal: false
        }).then(function() {
          return request.updatePayManageStatus(param);
        }).then(() => {
          this.msgSuccess(row.disabledStatus===0?'启用成功':'停用成功');
        }).catch(function() {
          row.disabledStatus = row.state === 0 ? 1 : 0;
        });
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      pushData(row) {
        this.form = {
          id:row.id,
          appId: row.appId,
          disabledStatusName:row.disabledStatus===0?'启用':'停用',
          mchId:row.mchId,
          payName:row.payName,
          payBusId:row.payBusId,
          prKey:row.prKey,
          puKey:row.puKey
        };
      },
      // 加载表单
      reset() {
        this.form = {
          id:"",
          appId: "",
          disabledStatusName:"",
          mchId:"",
          payName:"",
          pType:"",
          prKey:"",
          puKey:""
        };
      }

    }
  };
</script>
