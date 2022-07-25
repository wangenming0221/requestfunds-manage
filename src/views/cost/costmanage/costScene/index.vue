<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">

      <el-form-item label="业务场景" prop="businessScene" label-width="90px">
        <el-input v-model="queryParams.businessScene" placeholder="请输入业务场景"  clearable @clear="queryParams.businessScene = null" style="width:240px"></el-input>
      </el-form-item>
      <el-form-item label="业务范围" prop="businessScope" label-width="90px">
        <el-input v-model="queryParams.businessScope" placeholder="请输入业务范围"  clearable @clear="queryParams.businessScope = null" style="width:240px"></el-input>
      </el-form-item>


      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="getList()">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" @click = "goCostSceneForm()">添加场景</el-button>
        <!-- <el-button type="primary" @click = "exportCostExcel()">导出</el-button> -->

      </el-col>
    </el-row>

    <el-table  ref="costScene" v-loading="loading" :data="recordList"  style="width: 100%"  lazy row-key="id" :tree-props="{children: 'child', hasChildren: 'hasChildren'}"
      >

      <el-table-column prop="businessScene" label="业务场景" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
      <el-table-column prop="businessScope" label="业务范围" align="center" :show-overflow-tooltip="true" width="300"></el-table-column>
      <el-table-column prop="isDeleteStatus" label="状态" align="center" :show-overflow-tooltip="true" width="180">
        <template slot-scope="scope">
          {{scope.row.isDeleteStatus=='1'?'禁用':'启用'}}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" >
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="goCostSceneForm(scope.row)">编辑</el-button>
          <el-button size="mini" type="text" @click="deleteCostScene(scope.row)">删除</el-button>

        </template>
      </el-table-column>
    </el-table>
    <pagination v-if="total>0" :total="total" :page.sync="queryParams.current" :limit.sync="queryParams.size" @pagination="getList" />

    <!-- 新增/编辑弹框 -->
    <el-dialog  :title="title"  :visible.sync="updateVisible"  width="600px" :before-close="cancelUpdate">
      <div class="wrap">
        <el-form ref="queryMaterialForm"  :model="updateQueryParams"    class="demo-form-inline">
          <el-form-item label="业务场景" prop="businessScene" label-width="100px">
            <el-input v-model="updateQueryParams.businessScene" placeholder="请输入业务场景"  clearable @clear="updateQueryParams.businessScene = undefined" ></el-input>
          </el-form-item>

          <el-form-item label="上级场景分类" prop="pid" label-width="100px">
            <treeselect
              v-model="updateQueryParams.pid"
              :options="costSceneTree"
              :normalizer="normalizer"
              :show-count="true"
              placeholder="选择上级场景分类"
            />
          </el-form-item>
          <el-form-item label="业务范围" prop="businessScope" label-width="100px">
            <el-input type="textarea" :rows="4" v-model="updateQueryParams.businessScope" placeholder="请输入业务范围"  clearable @clear="updateQueryParams.businessScope = undefined" ></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="isDeleteStatus" label-width="100px">
            <el-switch v-model="updateQueryParams.isDeleteStatusBoolean"></el-switch>
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
  // 下拉树
  import Treeselect from "@riophae/vue-treeselect"
  import "@riophae/vue-treeselect/dist/vue-treeselect.css"
  import { costmanage } from '@/api/work'


  export default {
    name: "cockpitList",
    components: {
      Treeselect
    },
    data() {
      return {
        selectArr: [],
        costSceneTree:[],
        //费用项类别
        costItemTypeOptions:[{
          id:"X",name:"行政费"},{
          id:"Y",name:"业务费"},
        ],
        //管控标准
        controlStandardOptions:[{
          id:"0",name:"提示"},{
          id:"1",name:"限制"},
        ],
        // 遮罩层
        loading: true,
        title:'',
        updateVisible:false,
        updateQueryParams:{
          //1新增2编辑
          type:undefined,
          id:undefined,
          businessScene:undefined,
          pid:undefined,
          businessScope:undefined,
          isDeleteStatus:undefined,
          isDeleteStatusBoolean:false,
        },
        ids:[],
        recordList:[],
        queryParams: {
          current: 1,
          size: 10,
          businessScene :null,
          businessScope :null,
        },
        total: 0,
        checkedKeys:false,
      }
    },
    mounted() {
      this.getList();
      this.getCostSceneTree();
    },
    methods: {



      normalizer(node) {
        if (node.child && !node.child.length) {
          delete node.child
        }
        return {
          id: node.id,
          label: node.businessScene,
          children: node.child
        }
      },
      //获取上级场景分类
      getCostSceneTree(){
        this.loading = true;
        costmanage.getCostSceneTree().then(response => {
          this.costSceneTree = [response.data];
          this.loading = false;
        });
      },
      //拉取列表
      getList(){
        this.loading = true;
        
        costmanage.getCostSceneList(this.queryParams).then(response => {
          this.recordList = response.data.child;
          // this.recordList = response.data.records;
          // this.total = response.data.total;
          this.loading = false;
        });
      },
      resetQuery(){
        this.queryParams= {
          current: 1,
          size: 10,
          costItemCode :null,
          costItemName :null,
        };
      },
      //导出
      exportCostExcel(){
        costmanage.exportCostExcel().then(response => {

        });
      },
      //打开新增、编辑
      goCostSceneForm(row){
        if (row) {
          this.title = '编辑场景管理';
          this.updateQueryParams.type = 2;
          this.getDetail(row);
        } else {
          this.title = '新增场景管理';
          this.updateQueryParams.type = 1;
          this.updateQueryParams.pid = this.costSceneTree[0].id;
        }
        this.updateVisible = true;
      },
      //获取详情
      getDetail({id}){
        costmanage.getCostSceneDetail({id}).then(response => {
          this.updateQueryParams.id = response.data.id;
          this.updateQueryParams.businessScene = response.data.businessScene;
          this.updateQueryParams.pid = response.data.pid;
          this.updateQueryParams.businessScope = response.data.businessScope;
          this.updateQueryParams.isDeleteStatus = response.data.isDeleteStatus;
          this.updateQueryParams.isDeleteStatusBoolean = response.data.isDeleteStatus==1?false:true;


        }).catch(err =>{
          console.log(err);
        });
      },

      /** 删除按钮操作 */
      deleteCostScene(row){
        this.$confirm('是否确认删除?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          return costmanage.deleteCostScene([row.id]);
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
        this.updateQueryParams.isDeleteStatusBoolean = false;
      },
      //确定编辑/新增
      saveUpdate(){
        this.updateQueryParams.isDeleteStatus = (this.updateQueryParams.isDeleteStatusBoolean?'0':'1');
        if(this.updateQueryParams.type==1){
          costmanage.addCostScene(this.updateQueryParams).then(response => {
            this.cancelUpdate();
            this.getList();
          }).catch(err =>{
          });
        }else if(this.updateQueryParams.type ==2){
          costmanage.editCostScene(this.updateQueryParams).then(response => {
            this.cancelUpdate();
            this.getList();
          }).catch(err =>{
          });
        }
      },



    }
  }
</script>

<style scoped lang="scss">
  .vue-treeselect{
    width: 400px;
  }
  .el-input--medium {
    width: 400px;
  }
  .el-select {
    width: 400px;
  }
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
