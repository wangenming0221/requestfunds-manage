<template>
  <div class="app-container">
    <div class="common-nav">
      <div class="common-nav_title">驾驶舱填报</div>
      <div>
        <el-button type="primary" @click = "goCockpitForm()">新增</el-button>
        <el-button type="primary" @click = "deleteCockpit()">删除</el-button>
      </div>
    </div>


    <el-table v-loading="loading" :data="recordList"  style="width: 100%"  @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center"></el-table-column>
      <el-table-column prop="projectName" label="项目名称" align="center" :show-overflow-tooltip="true" width="180">
      </el-table-column>
      <el-table-column prop="projectCode" label="项目编码" align="center" :show-overflow-tooltip="true" width="180">
      </el-table-column>
      <el-table-column prop="partyActualOutputValueA" label="对甲实际完成产值" align="center" :show-overflow-tooltip="true" width="180">
        <template slot-scope="scope">{{scope.row.partyActualOutputValueA| formatThousands}}</template>
      </el-table-column>
      <el-table-column prop="generalContractReturn" label="应收" align="center" :show-overflow-tooltip="true" width="180">
        <template slot-scope="scope">{{scope.row.generalContractReturn| formatThousands}}</template>
      </el-table-column>
      <el-table-column prop="auditOutputValueA" label="甲审产值" align="center" :show-overflow-tooltip="true" width="180">
        <template slot-scope="scope">{{scope.row.auditOutputValueA| formatThousands}}</template>
      </el-table-column>
      <el-table-column prop="totalLiabilityCost" label="责任成本总额" align="center" :show-overflow-tooltip="true" width="180">
        <template slot-scope="scope">{{scope.row.totalLiabilityCost| formatThousands}}</template>
      </el-table-column>
      <el-table-column prop="targetProfit" label="目标利润" align="center" :show-overflow-tooltip="true" width="180">
        <template slot-scope="scope">{{scope.row.targetProfit| formatThousands}}</template>
      </el-table-column>
      <!-- <el-table-column prop="biddingCost" label="投标成本" align="center" :show-overflow-tooltip="true" width="180">
        <template slot-scope="scope">{{scope.row.biddingCost| formatThousands}}</template>
      </el-table-column>
 -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" >
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="goCockpitForm(scope.row)">编辑</el-button>

        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.current" :limit.sync="queryParams.size" @pagination="getList" />

    <!-- 新增/编辑弹框 -->
    <el-dialog  :title="title"  :visible.sync="updateVisible"  width="620px" :before-close="cancelUpdate">
      <div class="wrap">
        <el-form ref="queryMaterialForm"  :model="updateQueryParams"    class="demo-form-inline">
          <el-form-item label="项目编码" prop="projectCode" label-width="125px">
            <el-cascader
              v-model:value="projectValue"
              :show-all-levels="false"
              :options="requestProjectOptions"
              :props="{ label: 'deptName', value: 'projectCode', children: 'children' }"
              placeholder="请选择项目"
              style="width: 400px"
              @change="projectValueChange"
            />
            <!-- <el-input v-model="updateQueryParams.projectCode" placeholder="请输入项目编码"  clearable @clear="updateQueryParams.projectCode = undefined" style="width:400px"></el-input> -->
          </el-form-item>
          <el-form-item label="对甲实际完成产值" prop="partyActualOutputValueA" label-width="125px">
            <el-input v-model="updateQueryParams.partyActualOutputValueA" placeholder="请输入对甲实际完成产值" clearable @clear="updateQueryParams.partyActualOutputValueA = undefined" style="width:400px"></el-input>
          </el-form-item>
          <el-form-item label="应收" prop="generalContractReturn" label-width="125px">
            <el-input v-model="updateQueryParams.generalContractReturn" placeholder="请输入应收"  clearable @clear="updateQueryParams.generalContractReturn = undefined" style="width:400px"></el-input>
          </el-form-item>
          <el-form-item label="甲审产值" prop="auditOutputValueA" label-width="125px">
            <el-input v-model="updateQueryParams.auditOutputValueA" placeholder="请输入甲审产值"  clearable @clear="updateQueryParams.auditOutputValueA = undefined" style="width:400px"></el-input>
          </el-form-item>
          <el-form-item label="责任成本总额" prop="totalLiabilityCost" label-width="125px">
            <el-input v-model="updateQueryParams.totalLiabilityCost" placeholder="请输入责任成本总额"  clearable @clear="updateQueryParams.totalLiabilityCost = undefined" style="width:400px"></el-input>
          </el-form-item>
          <el-form-item label="目标利润" prop="targetProfit" label-width="125px">
            <el-input v-model="updateQueryParams.targetProfit" placeholder="请输入目标利润"  clearable @clear="updateQueryParams.targetProfit = undefined" style="width:400px"></el-input>
          </el-form-item>
          <!-- <el-form-item label="投标成本" prop="biddingCost" label-width="125px">
            <el-input v-model="updateQueryParams.biddingCost" placeholder="请输入投标成本"  clearable @clear="updateQueryParams.biddingCost = undefined" style="width:400px"></el-input>
          </el-form-item> -->


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
  import api from '@/api/work/cockpit'

  export default {
    name: "cockpitList",
    data() {
      return {
        requestProjectOptions:[],
        projectValue:'',
        // 遮罩层
        loading: true,
        title:'',
        updateVisible:false,
        updateQueryParams:{
          //1新增2编辑
          type:undefined,
          id:undefined,
          projectCode :undefined,
          partyActualOutputValueA :undefined,
          generalContractReturn :undefined,
          auditOutputValueA :undefined,
          totalLiabilityCost :undefined,
          targetProfit :undefined,
          biddingCost :undefined,
        },
        ids:[],
        recordList:[],
        queryParams: {
          current: 1,
          size: 10,

        },
        total: 0,
      }
    },
    mounted() {
      this.getList();
      this.getDeptAndProjectTree();
    },
    methods: {
      // 获取 项目列表树
      getDeptAndProjectTree() {
        api.getDeptAndProjectTree().then(res => {
          if (res.code === 0) {
            this.requestProjectOptions = [
              {
                deptName: '沈阳腾越建筑工程有限公司',
                projectCode: '',
                children: this.filterNode(res.data)
              }
            ]
          }
        }).catch(err => {
          console.log(err)
        })
      },
      // 过滤节点数
      filterNode(data) {
        for (let i = 0, len = data.length; i < len; i++) {
          if (data[i].children.length === 0) {
            data[i].children = undefined;
            data[i].deptName+=('('+data[i].projectCode+')');
            data[i].projectCode=data[i].projectName+'('+data[i].projectCode+')';
            // continue
          } else {
            this.filterNode(data[i].children)
          }
        }
        return data
      },
      projectValueChange(e){
        let arr = e[e.length-1].split('(');
        this.updateQueryParams.projectName = arr[0];
        this.updateQueryParams.projectCode = arr[1].split(')')[0];
      },
      //拉取列表
      getList(){
        this.loading = true;
        api.getCockpitList(this.queryParams).then(response => {

          this.recordList = response.data.records;
          this.total = response.data.total;
          this.loading = false;
        });
      },

      //打开新增、编辑
      goCockpitForm(row){
        if (row) {
          this.title = '编辑驾驶舱填报';
          this.getDetail(row);
        } else {
          this.title = '新增驾驶舱填报';
        }
        this.updateVisible = true;
      },


      //获取详情
      getDetail({id}){
        api.getCockpitDetail({id}).then(response => {
          this.updateQueryParams.id = response.data.id;
          this.updateQueryParams.projectCode = response.data.projectCode;
          this.updateQueryParams.projectName = response.data.projectName;
          this.updateQueryParams.partyActualOutputValueA = response.data.partyActualOutputValueA;
          this.updateQueryParams.generalContractReturn = response.data.generalContractReturn;
          this.updateQueryParams.auditOutputValueA = response.data.auditOutputValueA;
          this.updateQueryParams.totalLiabilityCost = response.data.totalLiabilityCost;
          this.updateQueryParams.targetProfit = response.data.targetProfit;
          this.projectValue = ['', null, response.data.projectName+'('+response.data.projectCode+')'];
          // this.updateQueryParams.biddingCost = response.data.biddingCost;

        }).catch(err =>{
          console.log(err);
        });
      },
      handleSelectionChange(selection){
        this.ids = selection.map(item => item.id);
      },
      /** 删除按钮操作 */
      deleteCockpit(){
        if(this.ids.length==0){
          this.msgError('请先选择要删除的选项');
          return false;
        }

        this.$confirm('是否确认删除?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          return api.deleteCockpit(this.ids);
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
        this.projectValue='';

      },
      //确定编辑/新增
      saveUpdate(){
        api.saveCockpit(this.updateQueryParams).then(response => {
          this.cancelUpdate();
          this.getList();
        }).catch(err =>{
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
