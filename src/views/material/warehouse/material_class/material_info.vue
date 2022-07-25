<template>
  <div>
    <el-form :inline="true" :rules="rules" :model="searchFrom" ref="searchFrom" size="small" @keyup.enter.native="getDataList()">
      <el-form-item label="物料编号" prop="materialCode">
        <el-input v-model="searchFrom.materialCode" placeholder="请输入物料编号" clearable />
      </el-form-item>
      <el-form-item label="物料名称" prop="materialName">
        <el-input v-model="searchFrom.materialName" placeholder="请选择物料名称" clearable />
      </el-form-item>
      <el-form-item label="材料规格" prop="specification">
        <el-input v-model="searchFrom.specification" placeholder="请选择材料规格" clearable />
      </el-form-item>
      <el-form-item v-if="editTye==='search'">
        <el-button type="primary" @click="getDataList(pageIndex = 1)"> <i class="fa fa-search" /> 搜索</el-button>
        <el-button type="primary" @click="resetList()"> <i class="fa fa-search" /> 重置</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()"> <i class="fa fa-plus" /> 新增</el-button>
        <el-button type="danger" :disabled="dataListSelections.length <= 0" @click="deleteHandle()"><i class="fa fa-trash" /> 删除</el-button>
      </el-form-item>
      <el-form-item v-else-if="editTye==='choose'">
        <el-button type="primary" @click="getDataList(pageIndex = 1)"> <i class="fa fa-search" /> 搜索</el-button>
        <el-button type="primary" @click="returnCheck()"> <i class="fa fa-search" /> 确认</el-button>
      </el-form-item>
    </el-form>

    <el-table style="width: 100%;" border ref="dataList" :data="dataList" @selection-change="selectionChangeHandle">
      <el-table-column type="selection" header-align="center" align="center" width="50" />
      <el-table-column type="index" width="50" header-align="center" align="center" label="序号" />
      <el-table-column prop="materialCode" header-align="center" align="center" label="物料编号" />
      <el-table-column prop="materialName" header-align="center" align="center" label="物料名称" />
      <el-table-column prop="specification" header-align="center" align="center" label="材料规格" />
      <el-table-column prop="unit" header-align="center" align="center" label="单位" />
      <el-table-column prop="remark" header-align="center" align="center" label="描述备注" />
      <el-table-column prop="materialName" header-align="center" align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="sizeChangeHandle" @current-change="currentChangeHandle" />

    <AddMaterialInfo ref="AddMaterialInfo" @refresh="refresh" />
  </div>
</template>

<script>
  import { getMaterialPage, removeMaterialMaterial } from "@/api/material/materialInfo.js";
  export default {
    components: {
      AddMaterialInfo: () => import('./add_material_info.vue'),
    },
    props:{
      editTye:{ // search 页面所搜  add 弹窗添加
        type: String,
        default: 'search'
      },
      chooseType:{ // single 单选 multiple 多选
        type: String,
        default: 'multiple'
      }
    },
    data() {
      return {
        /**
         * //左侧树节点
         * treeItem:{
         * materialCategoryId:物料类别id
         * }
         */
        treeItem: null,
        cid: Number(this.$route.query.id),
        searchFrom: {
          materialCode:'',
          materialName:'',
          specification:'',
        },
        pageIndex: 1, // 翻页 当前页
        pageSize: 10, // 翻页 页面大小
        total: 0, // 翻页 总页数
        /**
         * dataList=[{
         * isAlive:1 启用 2停用
         * materialId:物料id
         * }]
         */
        dataList: [],
        dataListSelections: [], // 多选操作
        rules:{
          materialCode:[],
          materialName:[],
          specification:[],
        }
      }
    },
    created() {
      console.log('MaterialInfo');
    },
    computed: {
      /**
       * 启用按钮是否可以点击
       */
      enableButtonDisabled() {
        return this.dataListSelections.length < 1
      },
      /**
       * 禁用按钮是否可以点击
       */
      disableButtonDisabled() {
        return this.dataListSelections.length < 1
      },
    },
    methods: {
      /**
       * 刷新树和表格
       */
      refresh() {
        this.refreshTableAndTree()
      },
      initPage(treeItem) {
        this.treeItem = treeItem
        this.getDataList(this.pageIndex = 1)
      },
      // 重置
      resetList(){
        this.$refs['searchFrom'].resetFields();
        this.pageIndex = 1;
        this.pageSize = 10;
        this.getDataList()
      },
      // 读取数据
      getDataList: function () {
        if (!this.treeItem) {
          this.$notify.error({ title: '错误', message: '请选择物料类别树节点' })
          return
        }

        let param = {
          "materialTypeId": this.treeItem.materialCategoryId,
          "materialCode": this.searchFrom.materialCode,
          "materialName": this.searchFrom.materialName,
          "specification": this.searchFrom.specification,
        }
        if(!param.materialCode) delete param.materialCode;
        if(!param.materialName) delete param.materialName;
        if(!param.materialTypeId) delete param.materialTypeId;
        if(!param.specification) delete param.specification;

        getMaterialPage(param,this.pageIndex,this.pageSize).then(response=>{
            this.dataList = response.data.records
            this.total = response.data.total
        })
      },
      // 新增 / 修改
      addOrUpdateHandle: function (materialInfo) {
        this.$refs.AddMaterialInfo.addOrUpdateHandle(this.treeItem, materialInfo)
      },

      // 修改页码
      sizeChangeHandle: function (num) {
        this.pageSize = num
        this.pageIndex = 1
        this.getDataList()
      },
      // 切换页面
      currentChangeHandle: function (num) {
        this.pageIndex = num
        this.getDataList()
      },
      // 多选
      // selectionChangeHandle: function (val) {
      //   console.log('chooseType',this.chooseType)material/orderStoreKeeper
      //   return
      //   //单选
      //   if(this.chooseType === 'single'){
      //     this.$refs.dataList.clearSelection();
      //     this.$refs.dataList.toggleRowSelection(val.pop());
      //   }else{
      //     this.dataListSelections = val
      //   }
      // },
      // 多选
      selectionChangeHandle: function (val) {
        if (this.chooseType === 'single') {
          if(val.length > 1){
            this.$refs.dataList.clearSelection();
            this.$refs.dataList.toggleRowSelection(val.pop());
          }else{
            this.dataListSelections = val
          }
        } else {
          this.dataListSelections = val
        }
        // this.dataListSelections = val;
        // this.$refs.dataList.clearSelection()
      },
      /**
       * 刷新表格和树
       */
      refreshTableAndTree() {
        this.getDataList()
        this.$emit('refreshTree', {
          higtLightNode: this.treeItem.materialCategoryId
        })
      },
      // 删除
      deleteHandle: function (id) {
        // 处理IDS
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.materialId
        })
        // 提示用户删除
        this.$confirm(`确定删除操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params =  ids.join(',');
          console.log(params);

          removeMaterialMaterial(params).then(response=>{
            if(response.success){
              this.$notify({ title: 'OK', message: '删除成功!' })
              this.refreshTableAndTree()
            }else{
              this.$notify({ title: 'OK', message: '删除失败!' })
            }


          })
        }).catch(() => { })
      },
      // 弹窗状态回显
      returnCheck(){
        this.dataListSelections;
        console.log("this.dataListSelections",this.dataListSelections)
        this.$emit('returnCheck',this.dataListSelections[0])
      }
    }
  }


</script>

<style lang="scss" scoped>

</style>
