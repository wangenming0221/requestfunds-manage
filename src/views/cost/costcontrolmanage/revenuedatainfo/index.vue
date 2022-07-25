<template>
  <div class="app-container">
    <div class="common-nav">
      <div class="common-nav_title">分公司营收数据</div>
    </div>
    <el-form :model="queryParams" ref="queryForm" :inline="true">

      <el-form-item label="月份" prop="costItemName">
        <el-date-picker value-format="yyyy-MM"  v-model="queryParams.createTime"  type="month"  placeholder="选择月份" @change="getList"></el-date-picker>
      </el-form-item>


      <el-form-item>
       <el-button type="primary" @click = "goRevenuedataForm()">添加分公司</el-button>
       <el-button type="primary" @click = "openUploadTip()">上传</el-button>
       <el-button type="primary" @click = "exportRevenueExcel()">导出</el-button>
       <el-button type="primary" @click = "deleteRevenuedata()">删除</el-button>
      </el-form-item>
    </el-form>


    <el-table v-loading="loading" :data="recordList"  style="width: 100%"  @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center"></el-table-column>
      <el-table-column prop="companyName" label="分公司" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
      <el-table-column prop="createTime" label="月份" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
      <el-table-column prop="revenueAccumulate" label="累积营收(不含税）" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
      <el-table-column prop="revenuelAccumulateTax" label="累积营收(含税）" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" >
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="goRevenuedataForm(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.current" :limit.sync="queryParams.size" @pagination="getList" />

    <!-- 新增/编辑弹框 -->
    <el-dialog  :title="title"  :visible.sync="updateVisible"  width="600px" :before-close="cancelUpdate">
      <div class="wrap">
        <el-form ref="revenuedataForm"  :model="updateQueryParams"   :rules="rules">
          <el-form-item prop="companyCode" label="分公司" label-width="160px">
            <el-select v-model="updateQueryParams.companyCode" placeholder="请选择分公司" @change="changeCompanyCode" style="width:300px">
              <el-option v-for="item in companyOptions"
                         :key="item.deptId"
                         :label="item.deptName"
                         :value="item.phone">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label=" 累积营收（不含税）" prop="revenueAccumulate" label-width="160px">
            <el-input v-model="updateQueryParams.revenueAccumulate" placeholder="请输入 累积营收（不含税）"  clearable @clear="updateQueryParams.revenueAccumulate = undefined" style="width:300px">
            </el-input>
          </el-form-item>
          <el-form-item label="累积营收（含税）" prop="revenuelAccumulateTax" label-width="160px">
            <el-input v-model="updateQueryParams.revenuelAccumulateTax" placeholder="请输入累积营收（含税）"  clearable @clear="updateQueryParams.revenuelAccumulateTax = undefined" style="width:300px">
            </el-input>
          </el-form-item>
          <el-form-item  label-width="160px">
            注：新建的数据将计为当月数据计算额度
          </el-form-item>



        </el-form>

      </div>
      <div slot="footer" class="dialog-footer">
        <el-button :disabled="loading" @click="cancelUpdate">取 消</el-button>
        <el-button type="primary" :disabled="loading" @click="saveUpdate">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 上传提示弹框 -->
    <el-dialog  title="title"  :visible.sync="uploadTip.visible"  width="500px" >
      <span slot="title" class="title-class"><i class="el-icon-warning orange"></i>上传数据</span>
      <div class="wrap">
        <div>
          <span class="red">请选择上传数据影响的月份</span>，选择本月则刷新当前费用额度，选择下月将在下月1日计算额度
        </div>
        <div>
          请先<span class="blue" @click = "downloadTemplate()">下载模板</span>再上传文件
        </div>


      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="loading" >上传（下月生效）</el-button>
        <el-button :disabled="loading" >上传（本月替换）</el-button>
        <el-button :disabled="loading" >取 消</el-button>

      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { costmanage } from '@/api/work'
  import { projectInfo } from '@/api/work'
  import { parseTime } from '@/utils/ruoyi.js'
  import { baseURL } from "@/config";
  import { getToken } from '@/utils/auth'

  export default {
    name: "financePark",
    data() {
      return {
        uploadTip:{
          visible:false,
        },
        companyOptions:[],
        // 遮罩层
        loading: true,
        title:'',
        updateVisible:false,
        updateQueryParams:{
          //1新增2编辑
          type:undefined,
          id:undefined,
          companyCode:undefined,
          companyName:undefined,
          revenueAccumulate:undefined,
          revenuelAccumulateTax:undefined,
        },
        ids:[],
        recordList:[],
        queryParams: {
          current: 1,
          size: 10,
          createTime:this.initMonth(),

        },
        total: 0,
        rules: {
          companyCode: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          revenueAccumulate: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          revenuelAccumulateTax: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
        },


      }
    },
    mounted() {
      this.getList();
      this.getCompanyList();
    },
    methods: {
      //打开上传提示
      openUploadTip(){
        this.uploadTip.visible = true;
      },
      //下载模板
      downloadTemplate(){
        this.$confirm('确认下载?', "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          closeOnClickModal: false
        }).then(() => {
          let url = baseURL + '/request-funds-expensemanage/revenuedatainfo/downloadTemplate';
          let xhr = new XMLHttpRequest();
          xhr.open('POST', url, true);
          xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
          if (getToken()) {
            xhr.setRequestHeader("Authorization", getToken());
          };
          xhr.send(JSON.stringify({ }));
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
      //导出
      exportRevenueExcel(){
        this.$confirm('确认导出?', "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          closeOnClickModal: false
        }).then(() => {
          let url = baseURL + '/request-funds-expensemanage/revenuedatainfo/exportRevenueExcel';
          let xhr = new XMLHttpRequest();
          xhr.open('POST', url, true);
          xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
          if (getToken()) {
            xhr.setRequestHeader("Authorization", getToken());
          };
          xhr.send(JSON.stringify({ }));
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
      initMonth(){
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth()+1;
        if(month<10) month='0'+month;
        return year+'-'+month
      },
      getCompanyList(){
        projectInfo.projectInfoList().then(response => {
          this.companyOptions = response.data;
        });
      },
      changeCompanyCode(value) {
        this.updateQueryParams.companyName = this.companyOptions.find(v => v.phone == value).deptName;
      },
      //拉取列表
      getList(){
        console.log(this.queryParams)
        this.loading = true;
        costmanage.getRevenuedata(this.queryParams).then(response => {
          response.data.records.forEach(item => {
            item.statusBoolean = (item.status==1?true:false);
            item.createTime = new Date(item.createTime).getMonth()+1;
          });

          this.recordList = response.data.records;
          this.total = response.data.total;
          this.loading = false;
        });
      },

      //打开新增、编辑
      goRevenuedataForm(row){
        if (row) {
          this.title = '编辑分公司管控';
          this.updateQueryParams.type = 2;
          this.getDetail(row);
        } else {
          this.title = '新增分公司管控';
          this.updateQueryParams.type = 1;
        }


        this.updateVisible = true;
      },
      //获取详情
      getDetail({id}){
        costmanage.getRevenuedataDetail({id}).then(response => {
          this.updateQueryParams.id = response.data.id;
          this.updateQueryParams.companyCode = response.data.companyCode;
          this.updateQueryParams.companyName = response.data.companyName;
          this.updateQueryParams.revenueAccumulate = response.data.revenueAccumulate;
          this.updateQueryParams.revenuelAccumulateTax = response.data.revenuelAccumulateTax;
        }).catch(err =>{
          console.log(err);
        });
      },
      handleSelectionChange(selection){
        this.ids = selection.map(item => parseInt(item.id));
      },
      /** 删除按钮操作 */
      deleteRevenuedata(){
        if(this.ids.length==0){
          this.msgError('请先选择要删除的选项');
          return false;
        }

        this.$confirm('是否确认删除?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          return costmanage.deleteRevenuedata(this.ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
      },

      //取消编辑/新增
      cancelUpdate(){
        this.updateVisible = false;
        for(let i in this.updateQueryParams){
          this.updateQueryParams[i] = undefined;
        }
        this.$nextTick(()=>{
          this.clearForm('revenuedataForm');
        });

      },
      //确定编辑/新增
      saveUpdate(){

        this.$refs['revenuedataForm'].validate((valid) => {
          if (valid) {
            if(this.updateQueryParams.type == 2){
              costmanage.editRevenuedata(this.updateQueryParams).then(response => {
                this.cancelUpdate();
                this.getList();
              }).catch(err =>{
              });
            }else if(this.updateQueryParams.type == 1){
              costmanage.addRevenuedata(this.updateQueryParams).then(response => {
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
      clearForm(value) {
        this.$refs[value].clearValidate();
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
  .title-class{
    font-size:18px;
    .orange{
      color : rgb(250,173,20);
    }
  }
  .wrap{
    font-size:16px;
    margin-left:20px;
    div:nth-child(n+2){
      margin-top:20px;
    }
    .red{
      color : rgb(240,65,52);
    }
    .blue{
      color : rgb(2,175,244);
      text-decoration:underline;
      padding:0 5px;
      cursor:pointer ;
    }
  }


</style>
