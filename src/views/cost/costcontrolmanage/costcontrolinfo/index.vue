<template>
  <div class="app-container">
    <div class="common-nav">
      <div class="common-nav_title">分公司费用管控</div>
      <!-- <div>
        <el-button type="primary" @click = "goCostcontrolForm()">添加分公司</el-button>
        <el-button type="primary" @click = "deleteCostcontrol()">删除</el-button>
      </div> -->
    </div>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" @click = "goCostcontrolForm()">添加分公司</el-button>
        <el-button type="primary" @click = "exportControlExcel()">导出</el-button>
        <el-button type="primary" @click = "deleteCostcontrol()">删除</el-button>

      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="recordList"  style="width: 100%"  @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center"></el-table-column>
      <el-table-column prop="companyName" label="分公司" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
      <el-table-column prop="controlStandard" label="管控标准" align="center" :show-overflow-tooltip="true" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.controlStandard==1?'启用':'提示'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="rate" label="行政及业务费费率" align="center" :show-overflow-tooltip="true" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.rate}}%</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" >
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="goCostcontrolForm(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.current" :limit.sync="queryParams.size" @pagination="getList" />

    <!-- 新增/编辑弹框 -->
    <el-dialog  :title="title"  :visible.sync="updateVisible"  width="600px" :before-close="cancelUpdate">
      <div class="wrap">
        <el-form ref="costcontrolForm"  :model="updateQueryParams"   :rules="rules">
          <el-form-item prop="companyCode" label="所属分公司" label-width="100px">
            <el-select v-model="updateQueryParams.companyCode" placeholder="请选择所属分公司" @change="changeCompanyCode" style="width:300px">
              <el-option v-for="item in companyOptions"
                         :key="item.deptId"
                         :label="item.deptName"
                         :value="item.phone">
              </el-option>
            </el-select>
            <el-checkbox v-model="updateQueryParams.functionalCenterBoolean" style="margin-left: 10px;">职能中心</el-checkbox>
          </el-form-item>
          <el-form-item label="费率" prop="rate" label-width="100px">
            <el-input v-model="updateQueryParams.rate" placeholder="请输入费率"  clearable @clear="updateQueryParams.rate = undefined" style="width:300px">
              <i slot="suffix" style="font-style: normal; margin-right: 10px">%</i>
            </el-input>
          </el-form-item>
          <el-form-item prop="controlStandard" label="管控标准" label-width="100px" >
            <el-radio-group v-model="updateQueryParams.controlStandard">
              <el-radio-button label="1">限制</el-radio-button>
              <el-radio-button label="0">提示</el-radio-button>
            </el-radio-group>
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
  import { costmanage } from '@/api/work'
  import { projectInfo } from '@/api/work'
  import { baseURL } from "@/config";
  import { getToken } from '@/utils/auth'

  export default {
    name: "financePark",
    data() {
      return {
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
          controlStandard:1,
          rate:undefined,
          functionalCenter:undefined,
          functionalCenterBoolean:false,
        },
        ids:[],
        recordList:[],
        queryParams: {
          current: 1,
          size: 10,

        },
        total: 0,
        rules: {
          companyCode: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          rate: [
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
      //导出
      exportControlExcel(){
        this.$confirm('确认导出?', "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          closeOnClickModal: false
        }).then(() => {
          let url = baseURL + '/request-funds-expensemanage/costcontrolinfo/exportControlExcel';
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
        this.loading = true;
        costmanage.getCostcontrol(this.queryParams).then(response => {
          response.data.records.forEach(item => item.statusBoolean = (item.status==1?true:false));
          this.recordList = response.data.records;
          this.total = response.data.total;
          this.loading = false;
        });
      },

      //打开新增、编辑
      goCostcontrolForm(row){
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
        costmanage.getCostcontrolDetail({id}).then(response => {
          this.updateQueryParams.id = response.data.id;
          this.updateQueryParams.companyCode = response.data.companyCode;
          this.updateQueryParams.companyName = response.data.companyName;
          this.updateQueryParams.controlStandard = response.data.controlStandard;
          this.updateQueryParams.rate = response.data.rate;
          this.updateQueryParams.functionalCenter = response.data.functionalCenter;
          this.updateQueryParams.functionalCenterBoolean = (response.data.functionalCenter==1?true:false);
        }).catch(err =>{
          console.log(err);
        });
      },
      handleSelectionChange(selection){
        this.ids = selection.map(item => parseInt(item.id));
      },
      /** 删除按钮操作 */
      deleteCostcontrol(){
        if(this.ids.length==0){
          this.msgError('请先选择要删除的选项');
          return false;
        }

        this.$confirm('是否确认删除?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          return costmanage.deleteCostcontrol(this.ids);
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
          this.clearForm('costcontrolForm');
        });
        this.updateQueryParams.controlStandard = 1;
        this.updateQueryParams.functionalCenterBoolean = false;
      },
      //确定编辑/新增
      saveUpdate(){
        this.updateQueryParams.functionalCenter = (this.updateQueryParams.functionalCenterBoolean?'1':'0');
        this.$refs['costcontrolForm'].validate((valid) => {
          if (valid) {
            if(this.updateQueryParams.type == 2){
              costmanage.editCostcontrol(this.updateQueryParams).then(response => {
                this.cancelUpdate();
                this.getList();
              }).catch(err =>{
              });
            }else if(this.updateQueryParams.type == 1){
              costmanage.addCostcontrol(this.updateQueryParams).then(response => {
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
</style>
