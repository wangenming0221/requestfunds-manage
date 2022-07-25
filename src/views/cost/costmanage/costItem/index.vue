<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item prop="costItemCode" label="费用项类别" label-width="90px" >
        <el-select v-model="queryParams.costItemCode" placeholder="请选择费用项类别" style="width:240px">
          <el-option v-for="item in costItemTypeOptions" :key="item.name"
                     :label="item.name"
                     :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="费用项名称" prop="costItemName" label-width="90px">
        <el-input v-model="queryParams.costItemName" placeholder="请输入费用项名称"  clearable @clear="queryParams.costItemName = undefined" style="width:240px"></el-input>
      </el-form-item>


      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="getList()">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" @click = "goCostItemForm()">新增</el-button>
        <el-button type="primary" @click = "exportItemExcel()">导出</el-button>
        <el-button type="primary" @click = "deleteCostItem()">删除</el-button>

      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="recordList"  style="width: 100%"  @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center"></el-table-column>
      <el-table-column prop="costItemCode" label="费用项类别" align="center" :show-overflow-tooltip="true" width="180">
        <template slot-scope="scope">
          {{scope.row.costItemCode=='X'?'行政费':'业务费'}}
        </template>
      </el-table-column>
      <el-table-column prop="costItemName" label="费用项名称" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
      <!-- <el-table-column prop="sceneCode" label="场景编码" align="center" :show-overflow-tooltip="true" width="180"></el-table-column> -->
      <el-table-column prop="sceneName" label="业务场景" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
      <el-table-column prop="mattersNeedingAttention" label="注意事项" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
      <el-table-column prop="controlStandard" label="管控标准" align="center" :show-overflow-tooltip="true" width="180">
        <template slot-scope="scope">
          {{scope.row.controlStandard=='1'?'限制':'提示'}}
        </template>
      </el-table-column>
      <el-table-column prop="rate" label="费率" align="center" :show-overflow-tooltip="true" width="180"></el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" >
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="goCostItemForm(scope.row)">编辑</el-button>

        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.current" :limit.sync="queryParams.size" @pagination="getList" />

    <!-- 新增/编辑弹框 -->
    <el-dialog  :title="title"  :visible.sync="updateVisible"  width="600px" :before-close="cancelUpdate">
      <div class="wrap">
        <el-form ref="queryMaterialForm"  :model="updateQueryParams"    class="demo-form-inline">

          <el-form-item prop="costItemCode" label="费用项类别" label-width="110px" >
            <el-radio-group v-model="updateQueryParams.costItemCode">
              <el-radio-button label="X">行政费</el-radio-button>
              <el-radio-button label="Y">业务费</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="费用项名称" prop="costItemName" label-width="110px">
            <el-input v-model="updateQueryParams.costItemName" placeholder="请输入费用项名称"  clearable @clear="updateQueryParams.costItemName = undefined" ></el-input>
          </el-form-item>
          <el-form-item label="费率" prop="rate" label-width="110px">
            <el-input v-model="updateQueryParams.rate" placeholder="请输入费率"  clearable @clear="updateQueryParams.rate = undefined"></el-input>
          </el-form-item>

          <el-form-item label="关联业务场景" prop="sceneName" label-width="110px">
            <el-select v-model="updateQueryParams.sceneName" placeholder="请选择场景" multiple  filterable @change="selectScene">
              <el-input  placeholder="输入关键字进行过滤"  v-model="costSceneName" @input="changeCostSceneName" style="margin: 10px 0 20px 20px;width: 340px;"></el-input>
              <el-option  :value="tree.sceneValue" style="height: auto;background-color: #fff;">

                <el-tree ref="costSceneTree" :data="tree.costSceneList"   node-key="id"  :props="tree.costSceneProps" show-checkbox
                @check-change="checkSceneTree" :filter-node-method="filterNode" default-expand-all></el-tree>
              </el-option>
            </el-select>
          </el-form-item>


          <el-form-item prop="controlStandard" label="管控标准" label-width="110px">
            <el-radio-group v-model="updateQueryParams.controlStandard">
              <el-radio-button label="0">提示</el-radio-button>
              <el-radio-button label="1">限制</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="(选填)注意事项" prop="mattersNeedingAttention" label-width="110px">
            <el-input type="textarea" :rows="4" v-model="updateQueryParams.mattersNeedingAttention" placeholder="请输入注意事项"  clearable @clear="updateQueryParams.mattersNeedingAttention = undefined" ></el-input>
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
  import { baseURL } from "@/config";
  import { getToken } from '@/utils/auth'

  export default {
    name: "cockpitList",
    data() {
      return {
        costSceneName:'',
        tree:{
          costSceneList:[],
          sceneValue:[],
          costSceneProps: {
            children: 'child',
            label: 'businessScene'
          },
        },


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
          costItemCode :"X",
          costItemName :undefined,
          rate :undefined,
          sceneCode :undefined,
          sceneName :undefined,
          controlStandard :"0",
          mattersNeedingAttention :undefined,
        },
        ids:[],
        recordList:[],
        queryParams: {
          current: 1,
          size: 10,
          costItemCode :undefined,
          costItemName :undefined,
        },
        total: 0,
      }
    },
    mounted() {
      this.getList();
      this.getCostSceneList();
    },

    methods: {
      //导出
      exportItemExcel(){
        this.$confirm('确认导出?', "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          closeOnClickModal: false
        }).then(() => {
          let url = baseURL + '/request-funds-expensemanage/costitemmanage/exportItemExcel';
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
      changeCostSceneName(val){
        console.log(5555);
        this.$refs.costSceneTree.filter(val);
      },
      filterNode(value, data) {
        // console.log(data);
        // console.log(value);

        if (!value) return true;
        return data.businessScene.includes(value);
      },
      deepFind(arr, condition, children){
        let main = [];
        try {
          (function poll(arr, level) {
            if (!Array.isArray(arr)) return;
            for (let i = 0; i < arr.length; i++) {
              const item = arr[i];
              if(item[children]&&item[children].length>0){
                poll(item[children], level + 1);
              }else{
                let isFind = (condition && condition(item, i, level)) || false;
                if(isFind){
                  main.push(item);
                }
              }
            }
          })(arr, 0);


        } catch (err) {}
        return main;
      },

      selectScene(e){
        let arrNew = this.tree.sceneValue.map(item =>{
          if(e.includes(item.businessScene)) return item
        }).filter(item =>item!=undefined)
        this.$refs.costSceneTree.setCheckedNodes(arrNew)//设置勾选的值
      },
      checkSceneTree(){

        let res = this.$refs.costSceneTree.getCheckedNodes(true, true) //这里两个true，1. 是否只是叶子节点 2. 是否包含半选节点（就是使得选择的时候不包含父节点）
        let arrLabel = [];
        let arr = [];
        let arrIds = [];
        res.forEach(item => {
          arrLabel.push(item.businessScene);
          arrIds.push(item.id);
          arr.push(item);
        });
        this.tree.sceneValue = arr;
        this.updateQueryParams.sceneName = arrLabel;
        this.updateQueryParams.sceneCode = arrIds;
        console.log(this.tree.sceneValue )
      },
      //拉取场景列表
      getCostSceneList(){
        // this.tree.costSceneList=[{
        //   businessScene: "差旅",
        //   businessScope: "",
        //   child: [{
        //     businessScene: "差旅1",
        //     businessScope: "",
        //     child: null,
        //     createTime: null,
        //     creator: null,
        //     id: 11,
        //     isDelete: 0,
        //     pid: 1,
        //     updateTime: "2022-06-07 14:50:13",
        //     updator: "若依",
        //   },
        //   {
        //     businessScene: "差旅2",
        //     businessScope: "",
        //     child: [
        //       {
        //         businessScene: "差旅21",
        //         businessScope: "",
        //         child: null,
        //         createTime: null,
        //         creator: null,
        //         id: 121,
        //         isDelete: 0,
        //         pid: 12,
        //         updateTime: "2022-06-07 14:50:13",
        //         updator: "若依",
        //       },
        //       {
        //         businessScene: "差旅22",
        //         businessScope: "",
        //         child: null,
        //         createTime: null,
        //         creator: null,
        //         id: 122,
        //         isDelete: 0,
        //         pid: 12,
        //         updateTime: "2022-06-07 14:50:13",
        //         updator: "若依",
        //       },
        //     ],
        //     createTime: null,
        //     creator: null,
        //     id: 12,
        //     isDelete: 0,
        //     pid: 1,
        //     updateTime: "2022-06-07 14:50:13",
        //     updator: "若依",
        //   },
        //   {
        //     businessScene: "差旅3",
        //     businessScope: "",
        //     child: null,
        //     createTime: null,
        //     creator: null,
        //     id: 13,
        //     isDelete: 0,
        //     pid: 1,
        //     updateTime: "2022-06-07 14:50:13",
        //     updator: "若依",
        //   },{
        //     businessScene: "差旅4",
        //     businessScope: "",
        //     child: null,
        //     createTime: null,
        //     creator: null,
        //     id: 14,
        //     isDelete: 0,
        //     pid: 1,
        //     updateTime: "2022-06-07 14:50:13",
        //     updator: "若依",
        //   }],
        //   createTime: null,
        //   creator: null,
        //   id: 1,
        //   isDelete: 0,
        //   pid: 0,
        //   updateTime: "2022-06-07 14:50:13",
        //   updator: "若依",
        // },{
        //   businessScene: "接待",
        //   businessScope: "",
        //   child: [{
        //     businessScene: "接待1",
        //     businessScope: "",
        //     child: null,
        //     createTime: null,
        //     creator: null,
        //     id: 21,
        //     isDelete: 0,
        //     pid: 2,
        //     updateTime: "2022-06-07 14:50:13",
        //     updator: "若依",
        //   },
        //   {
        //     businessScene: "接待2",
        //     businessScope: "",
        //     child: null,
        //     createTime: null,
        //     creator: null,
        //     id: 22,
        //     isDelete: 0,
        //     pid: 2,
        //     updateTime: "2022-06-07 14:50:13",
        //     updator: "若依",
        //   }],
        //   createTime: null,
        //   creator: null,
        //   id: 2,
        //   isDelete: 0,
        //   pid: 0,
        //   updateTime: "2022-06-07 14:50:13",
        //   updator: "若依",
        // }];
        this.loading = true;
        costmanage.getCostSceneList({current: 1,  size: 10}).then(response => {

          this.tree.costSceneList = response.data.child;
          console.log(this.tree.costSceneList )
          this.loading = false;
        });
      },
      //拉取列表
      getList(){
        this.loading = true;
        costmanage.getCostItemList(this.queryParams).then(response => {

          this.recordList = response.data.records;
          this.total = response.data.total;
          this.loading = false;
        });
      },
      resetQuery(){
        this.queryParams= {
          current: 1,
          size: 10,
          costItemCode :undefined,
          costItemName :undefined,
        };
      },
      //打开新增、编辑
      goCostItemForm(row){
        if (row) {
          this.title = '编辑费用项管理';
          this.updateQueryParams.type = 2;
          this.getDetail(row);
        } else {
          this.title = '新增费用项管理';
          this.updateQueryParams.type = 1;
        }
        this.updateVisible = true;
      },
      //获取详情
      getDetail({id}){
        costmanage.getCostItemDetail({id}).then(response => {
          this.updateQueryParams.id = response.data.id;
          this.updateQueryParams.costItemCode = response.data.costItemCode;
          this.updateQueryParams.costItemName = response.data.costItemName;
          this.updateQueryParams.rate = response.data.rate;
          this.updateQueryParams.sceneCode = response.data.sceneCode.split(',');
          this.updateQueryParams.sceneName = response.data.sceneName.split(',');
          this.updateQueryParams.controlStandard = response.data.controlStandard;
          this.updateQueryParams.mattersNeedingAttention = response.data.mattersNeedingAttention;
          this.defaultCheckEvent();

        }).catch(err =>{
          console.log(err);
        });
      },
      defaultCheckEvent(){
        let defaultData = [];
        this.updateQueryParams.sceneName.forEach(name => {
          let myarr = this.deepFind(
            this.tree.costSceneList,
            (item, index, level) => item.businessScene == name,
            this.tree.costSceneProps.children
          );
          defaultData.push(...myarr);
        });
        this.tree.sceneValue = [...defaultData];
        this.$refs.costSceneTree.setCheckedNodes(this.tree.sceneValue);
      },
      handleSelectionChange(selection){
        this.ids = selection.map(item => item.id);
      },
      /** 删除按钮操作 */
      deleteCostItem(){
        if(this.ids.length==0){
          this.msgError('请先选择要删除的选项');
          return false;
        }

        this.$confirm('是否确认删除?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          return costmanage.deleteCostItem(this.ids);
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
        this.tree.sceneValue = [];
        this.$refs.costSceneTree.setCheckedNodes(this.tree.sceneValue);
        this.costSceneName = "";
        this.updateQueryParams.costItemCode = "X";
        this.updateQueryParams.controlStandard = "0";
      },
      //确定编辑/新增
      saveUpdate(){
        let query ={
          ...this.updateQueryParams,
          sceneCode:this.updateQueryParams.sceneCode.toString(),
          sceneName:this.updateQueryParams.sceneName.toString(),
        }
        if(this.updateQueryParams.type==1){
          costmanage.addCostItem(query).then(response => {
            this.cancelUpdate();
            this.getList();
          }).catch(err =>{
          });
        }else if(this.updateQueryParams.type ==2){
          costmanage.editCostItem(query).then(response => {
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
