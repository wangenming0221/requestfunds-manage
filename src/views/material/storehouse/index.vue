<template>
  <div class="app-container">
    <el-form :inline="true" @keyup.enter.native="getDataList()" size="small" :rules="rules" ref="searchFrom" :model="searchFrom">
      <el-form-item class="small-item" label="仓库编号" prop="totalMaterialWarehouseCode">
        <el-input clearable placeholder="请输入仓库编号" v-model="searchFrom.totalMaterialWarehouseCode" />
      </el-form-item>
      <el-form-item class="small-item" label="仓库名称" prop="totalMaterialWarehouseName">
        <el-input clearable placeholder="请输入仓库名称" v-model="searchFrom.totalMaterialWarehouseName" />
      </el-form-item>
<!--      <el-form-item class="small-item" label="项目名称" prop="relationProjectName">-->
<!--        <el-input clearable placeholder="请输入项目名称" v-model="searchFrom.relationProjectName" />-->
<!--      </el-form-item>-->
      <el-form-item>
        <el-button @click="getDataList(pageIndex = 1)" type="primary"> <i class="fa fa-search" /> 搜索</el-button>
        <el-button @click="resetList()" type="primary"> <i class="fa fa-search" /> 重置</el-button>
      </el-form-item>

    </el-form>
    <el-form :inline="true"  size="small">
      <el-form-item>
        <el-button @click="addOrUpdateHandle(null,'add')" type="primary">新增仓库</el-button>
<!--        <el-button :disabled="dataListSelections.length <= 0" @click="deleteHandle()" type="danger">停用仓库</el-button>-->
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="dataList" ref="dataList" @selection-change="selectionChangeHandle" border style="width: 100%;">
<!--      <el-table-column align="center" header-align="center" type="selection" width="50" />-->
      <el-table-column align="center" header-align="center" label="序号" type="index" width="50" />
      <el-table-column align="center" header-align="center" label="仓库编号" prop="totalMaterialWarehouseCode" />
      <el-table-column align="center" header-align="center" label="仓库名称" prop="totalMaterialWarehouseName"/>
      <el-table-column align="center" header-align="center" label="仓库地址" prop="address"/>
      <el-table-column align="center" header-align="center" label="仓库负责人" prop="createUserName"/>
      <el-table-column align="center" header-align="center" label="仓库负责人电话" prop="createUserPhone"/>
      <el-table-column align="center" header-align="center" label="描述备注" prop="remark"/>
<!--      <el-table-column align="center" header-align="center" label="状态" prop="">-->
<!--        <template slot-scope="scope">-->
<!--          <div v-if="scope.row.status">启用</div>-->
<!--          <div v-else>停用</div>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column align="center" header-align="center" label="操作" prop="">
        <template slot-scope="scope">
          <el-button @click="addOrUpdateHandle(scope.row,'update')" size="small" type="text">修改</el-button>
          <el-button @click="addOrUpdateHandle(scope.row,'edit')" size="small" type="text">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="pageIndex" :page-size="pageSize" :page-sizes="[10, 20, 50, 100]" :total="total" @current-change="currentChangeHandle" @size-change="sizeChangeHandle" layout="total, sizes, prev, pager, next, jumper" />

    <add_storehouse @refresh="refresh" :projectSelect="projectSelect" ref="add_storehouse"/>
  </div>
</template>

<script>
  import { getMaterialPage, removeMaterialCategory, updateMaterialStore } from "@/api/material/storeInfo.js";
  import { baseProjectInfo } from "@/api/material/dictionary.js";
  export default {
    components: {
      add_storehouse: () => import('./add_storehouse.vue'),
    },

    data() {
      return {
        fileList:[],
        requested:false,
        cid: Number(this.$route.query.id),
        searchFrom: {
          totalMaterialWarehouseCode:'',
          totalMaterialWarehouseName:'',
          // relationProjectName:'',
        },
        pageIndex: 1, // 翻页 当前页
        pageSize: 10, // 翻页 页面大小
        total: 0, // 翻页 总页数
        dataList: [],
        dataListSelections: [], // 多选操作
        uploadExcelDialog: false, // 上传excel对话框
        editType:'edit',
        projectSelect:[],
        loading:true
      }
    },
    created() {
      this.getDataList();
      this.getProjectInfo();
    },

    methods: {
      /**
       * 刷新树和表格
       */
      refresh() {
        this.refreshTableAndTree()
      },
      initPage() {
        this.getDataList(this.pageIndex = 1)
      },
      resetList(){
        this.$refs['searchFrom'].resetFields();
        this.pageIndex = 1;
        this.pageSize = 10;
        this.getDataList()
      },
      // 读取数据
      getDataList: function () {

        let param = {
          totalMaterialWarehouseCode: this.searchFrom.totalMaterialWarehouseCode,
          totalMaterialWarehouseName: this.searchFrom.totalMaterialWarehouseName,
          // relationProjectName: this.searchFrom.relationProjectName
        }
        if(!param.totalMaterialWarehouseName) delete param.totalMaterialWarehouseName;
        if(!param.totalMaterialWarehouseCode) delete param.totalMaterialWarehouseCode;
        // if(!param.relationProjectName) delete param.relationProjectName;
        this.loading = true;
        console.log(param);

        getMaterialPage(param,this.pageIndex,this.pageSize).then(response=>{
          this.dataList = response.data.records;
          this.total = response.data.total;
          this.loading = false;
        })
      },
      // 新增 / 修改
      addOrUpdateHandle: function (materialCategory,editType) {
        this.$refs.add_storehouse.addOrUpdateHandle(materialCategory,editType)
      },
      getProjectInfo(){
        baseProjectInfo().then(response=>{
        this.projectSelect = response.data
      })
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
      selectionChangeHandle: function (val) {
        if (val.length > 1) {
          this.$refs.dataList.clearSelection();
          this.$refs.dataList.toggleRowSelection(val.pop());
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
      },
      // 删除
      deleteHandle: function (id) {
        // 处理IDS
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.totalMaterialWarehouseId
        })
        // 提示用户删除
        this.$confirm(`确定停用操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params =  {
            totalMaterialWarehouseId: ids.join(','),
            status: false
          }
          console.log(params);
          updateMaterialStore(params).then(response => {
            if (response.success) {
              this.showDialog = false
              this.initPage();
              this.$notify({ title: 'ok', message: response.msg })
            } else {
              this.$notify.error({ title: '错误', message: response.msg })
            }
          })
        }).catch(() => { })
      }
    }
  }


</script>

<style lang="scss" scoped>

</style>
