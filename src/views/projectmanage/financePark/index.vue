<template>
  <div class="app-container">
    <div class="common-nav">
      <div class="common-nav_title">苑区选择器</div>
      <div>
        <el-button type="primary" @click = "goFinanceParkForm()">新增</el-button>
        <el-button type="primary" @click = "deleteFinancePark()">删除</el-button>
      </div>
    </div>

    <el-table v-loading="loading" :data="recordList"  style="width: 100%"  @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center"></el-table-column>
      <el-table-column prop="parkName" label="财务苑区" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
      <el-table-column prop="parkCode" label="财务苑区编码" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
      <el-table-column prop="status" label="财务苑区状态" align="center" :show-overflow-tooltip="true" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.status==1?'启用':'停用'}}</span>
        </template>
      </el-table-column>


      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" >
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="goFinanceParkForm(scope.row)">编辑</el-button>
          <el-switch v-model="scope.row.statusBoolean" @change="changeStatus(scope.row)" style="margin-left: 10px;"></el-switch>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.current" :limit.sync="queryParams.size" @pagination="getList" />

    <!-- 新增/编辑弹框 -->
    <el-dialog  :title="title"  :visible.sync="updateVisible"  width="560px" :before-close="cancelUpdate">
      <div class="wrap">
        <el-form ref="financeParkForm"  :model="updateQueryParams"    class="demo-form-inline" :rules="rules">
          <el-form-item label="财务苑区名称" prop="parkName">
            <el-input v-model="updateQueryParams.parkName" placeholder="请输入财务苑区名称"  clearable @clear="updateQueryParams.parkName = undefined" style="width:400px"></el-input>
          </el-form-item>
          <el-form-item label="财务苑区编码" prop="parkCode">
            <el-input v-model="updateQueryParams.parkCode" placeholder="请输入财务苑区编码" clearable @clear="updateQueryParams.parkCode = undefined" style="width:400px"></el-input>
          </el-form-item>
          <el-form-item label="财务苑区状态" prop="statusBoolean">
            <el-switch v-model="updateQueryParams.statusBoolean"></el-switch>
          </el-form-item>

        </el-form>

      </div>
      <div slot="footer" class="dialog-footer">
        <el-button :disabled="loading" @click="cancelUpdate">取 消</el-button>
        <el-button type="primary" :disabled="loading" @click="saveUpdate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { projectInfo } from '@/api/work'

  export default {
    name: "financePark",
    data() {
      return {
        // 遮罩层
        loading: true,
        title:'',
        updateVisible:false,
        updateQueryParams:{
          //1新增2编辑
          type:undefined,
          id:undefined,
          parkName:undefined,
          parkCode:undefined,
          status:undefined,
          statusBoolean:false
        },
        ids:[],
        recordList:[],
        queryParams: {
          current: 1,
          size: 10,

        },
        total: 0,
        rules: {
          parkName: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          parkCode: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
        },


      }
    },
    mounted() {
      this.getList();
    },
    methods: {
      //拉取列表
      getList(){
        this.loading = true;
        projectInfo.financeParkSelectAllPage(this.queryParams).then(response => {
          response.data.records.forEach(item => item.statusBoolean = (item.status==1?true:false));
          this.recordList = response.data.records;
          this.total = response.data.total;
          this.loading = false;
        });
      },

      //打开新增、编辑
      goFinanceParkForm(row){
        if (row) {
          this.title = '编辑财务苑区';
          this.updateQueryParams.type = 2;
          this.getDetail(row);
        } else {
          this.title = '新增财务苑区';
          this.updateQueryParams.type = 1;
        }
        this.updateVisible = true;
      },
      //获取详情
      getDetail({id}){
        projectInfo.getFinanceParkDetail({id}).then(response => {
          this.updateQueryParams.id = response.data.id;
          this.updateQueryParams.parkName = response.data.parkName;
          this.updateQueryParams.parkCode = response.data.parkCode;
          this.updateQueryParams.status = response.data.status;
          this.updateQueryParams.statusBoolean = (response.data.status==1?true:false);
        }).catch(err =>{
          console.log(err);
        });
      },
      handleSelectionChange(selection){
        this.ids = selection.map(item => parseInt(item.id));
      },
      /** 删除按钮操作 */
      deleteFinancePark(){
        if(this.ids.length==0){
          this.msgError('请先选择要删除的选项');
          return false;
        }

        this.$confirm('是否确认删除?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          return projectInfo.deleteFinancePark(this.ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
      },
      //编辑财务苑区状态
      changeStatus(row){
        let queryParams={
          id:row.id,
          parkName:row.parkName,
          parkCode:row.parkCode,
        };
        queryParams.status = (row.statusBoolean?'1':'0');
        projectInfo.editFinancePark(queryParams).then(response => {
          row.status = (row.statusBoolean?'1':'0');
        }).catch(err =>{
          row.statusBoolean =! row.statusBoolean;
        });
      },
      //取消编辑/新增
      cancelUpdate(){
        this.updateVisible = false;
        for(let i in this.updateQueryParams){
          this.updateQueryParams[i] = undefined;
        }
        this.updateQueryParams.statusBoolean = false;
      },
      //确定编辑/新增
      saveUpdate(){
        this.updateQueryParams.status = (this.updateQueryParams.statusBoolean?'1':'0');
        this.$refs['financeParkForm'].validate((valid) => {
          if (valid) {
            if(this.updateQueryParams.type == 2){
              projectInfo.editFinancePark(this.updateQueryParams).then(response => {
                this.cancelUpdate();
                this.getList();
              }).catch(err =>{
              });
            }else if(this.updateQueryParams.type == 1){
              projectInfo.addFinancePark(this.updateQueryParams).then(response => {
                this.cancelUpdate();
                this.getList();
              }).catch(err =>{
              });
            }
          } else {
            return false;
          }
        });
        

      },



    }
  }
</script>

<style scoped lang="scss">
  .common-nav {
    display: flex;
    justify-content: space-between;
    margin-bottom:15px;
    align-items: center;
    .common-nav_title {
      font-weight: 600;
      font-size: 18px;
    }
  }
  .common-title {
    background: rgb(242, 242, 242);
    padding: 10px 0;
    margin: 14px 0;
  }
</style>
