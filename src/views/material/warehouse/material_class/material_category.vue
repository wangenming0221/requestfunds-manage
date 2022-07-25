<template>
  <div>
    <el-form :inline="true" :rules="rules" ref="searchFrom" :model="searchFrom" @keyup.enter.native="getDataList()" size="small">

      <el-form-item>
        <el-button @click="addOrUpdateHandle()" type="primary"> <i class="fa fa-plus" /> 新增</el-button>
        <el-button :disabled="dataListSelections.length <= 0" @click="deleteHandle()" type="danger"><i class="fa fa-trash" /> 删除</el-button>
      </el-form-item>
      <el-form-item class="small-item" label="分类编号" prop="materialCategoryCode">
        <el-input clearable placeholder="" v-model="searchFrom.materialCategoryCode" />
      </el-form-item>
      <el-form-item class="small-item" label="分类名称" prop="materialCategoryName">
        <el-input clearable placeholder="" v-model="searchFrom.materialCategoryName" />
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList(pageIndex = 1)" type="primary"> <i class="fa fa-search" /> 搜索</el-button>
        <el-button type="primary" @click="resetList()"> <i class="fa fa-search" /> 重置</el-button>
      </el-form-item>

    </el-form>

    <el-table :data="dataList" @selection-change="selectionChangeHandle" border style="width: 100%;">
      <el-table-column align="center" header-align="center" type="selection" width="50" />
      <el-table-column align="center" header-align="center" label="序号" type="index" width="50" />
      <el-table-column align="center" header-align="center" label="分类编号" prop="materialCategoryCode" />
      <el-table-column align="center" header-align="center" label="分类名称" prop="materialCategoryName"/>
      <el-table-column align="center" header-align="center" label="分类级别" prop="depth">
        <template slot-scope="scope">
          <span v-if="scope.row.depth ===0">一级分类</span>
          <span v-else-if="scope.row.depth ===1">二级分类</span>
        </template>
      </el-table-column>
      <el-table-column align="center" header-align="center" label="操作">
        <template slot-scope="scope">
          <el-button @click="addOrUpdateHandle(scope.row)" size="small" type="text">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="pageIndex" :page-size="pageSize" :page-sizes="[10, 20, 50, 100]" :total="total" @current-change="currentChangeHandle" @size-change="sizeChangeHandle" layout="total, sizes, prev, pager, next, jumper" />

    <AddMaterialCategory @refresh="refresh" ref="AddMaterialCategory" />
<!--    <upLoadExcel :show="uploadExcelDialog" @close="uploadExcelDialog=false" @fileList="uploadExcelHandle" />-->
  </div>
</template>

<script>
  import { getMaterialPage, removeMaterialCategory } from "@/api/material/materialCateGory.js";
  export default {
    components: {
      AddMaterialCategory: () => import('./add_material_category.vue'),
    },

    data() {
      return {
        fileList:[],
        requested:false,
        /**
         * //左侧树节点
         * treeItem:{
         * materialCategoryId:物料类别id
         * }
         */
        treeItem: null,
        cid: Number(this.$route.query.id),
        searchFrom: {
          materialCategoryName:'',
          materialCategoryCode:''
        },
        pageIndex: 1, // 翻页 当前页
        pageSize: 10, // 翻页 页面大小
        total: 0, // 翻页 总页数
        dataList: [],
        dataListSelections: [], // 多选操作
        uploadExcelDialog: false, // 上传excel对话框
        rules:{
          materialCategoryName:[],
          materialCategoryCode:[],
        }

      }
    },
    created() {
    },

    methods: {
      // 重置
      resetList(){
        this.$refs['searchFrom'].resetFields();
        this.pageIndex = 1;
        this.pageSize = 10;
        this.getDataList()
      },
      beforeUpload(file){
        // console.log(file,'文件');
        this.files = file;
        const extension = file.name.split('.')[1] === 'xls'
        const extension2 = file.name.split('.')[1] === 'xlsx'
        const isLt5M = file.size / 1024 / 1024 < 10
        if (!extension && !extension2) {
          this.$message.warning('上传模板只能是 xls、xlsx格式!')
          return
        }
        if (!isLt5M) {
          this.$message.warning('上传模板大小不能超过 10MB!')
          return
        }
        this.fileName = file.name;
        setTimeout(() => {
          this.submitUpload();
        },500);
        return false; // 返回false不会自动上传
      },

      // 上传excel
      submitUpload() {
        console.log('上传'+this.files.name)
        if(this.fileName == ""){
          this.$message.warning('请选择要上传的文件！')
          return false
        }
        let fileFormData = new FormData();
        fileFormData.append("code", "t_pathology_info_excel");
        fileFormData.append("description", "excel上传测试");
        //filename是键，file是值，就是要传的文件，test是要传的文件名
        fileFormData.append('file', this.files, this.fileName);
        let requestConfig = {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
        }
        // 执行上传excel
        let id = '';
        this.$http.post('/api/excelImport', fileFormData, requestConfig).then(resp => {
          if (resp.data.success) {
            this.$message.success("excel上传成功");
            this.refreshTableAndTree();
          } else {
            this.$message.error("excel上传失败，请重新上传");
          }
        }).catch((e) => {
          // console.log(e);
          this.$message.error("excel上传失败，请重新上传");
        }).finally(() => {

        });

      },

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

      // 读取数据
      getDataList: function () {
        if (!this.treeItem) {
          this.$notify.error({ title: '错误', message: '请选择物料类别树节点' })
          return
        }
        let param = {
          // cid: this.cid,
          materialCategoryName: this.searchFrom.materialCategoryName,
          materialCategoryCode: this.searchFrom.materialCategoryCode,
          pid: this.treeItem.materialCategoryId,
        }
        if(!param.materialCategoryName){
          delete param.materialCategoryName
        }
        if(!param.materialCategoryCode){
          delete param.materialCategoryCode
        }
        console.log("this.treeItem",this.treeItem)
        getMaterialPage(param,this.pageIndex,this.pageSize).then(response=>{
            this.dataList = response.data.records
            this.total = response.data.total
        })
      },
      // 新增 / 修改
      addOrUpdateHandle: function (materialCategory) {
        if (!this.treeItem) {
          this.$notify.error({ title: '错误', message: '请选择物料类别树节点' })
          return
        }

        if (this.treeItem.depth >= 1) {
          this.$notify.error({ title: '错误', message: '最多键2级节点' })
          return
        }


        this.$refs.AddMaterialCategory.addOrUpdateHandle(this.treeItem, materialCategory)
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
        this.dataListSelections = val
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
      uploadExcelHandle(fileList) {
        const formData = new FormData()
        formData.append('file', fileList[0].raw)
        formData.append('pid', this.treeItem.materialCategoryId)
        this.$http.post('/api/zcpt_material_class/importExcel', formData).then((response) => {
          if (response.data.success) {
            this.refreshTableAndTree()
            this.$notify({ title: 'ok', message: response.data.msg })
          } else {
            this.$notify.error({ title: '错误', message: response.data.msg })
          }
        })
      },
      // 上传excel
      uploadExcel: function (val) {
        if (!this.treeItem) {
          this.$message({
            message: '请选择物料类别树节点',
            type: 'warning'
          });
          return
        }
        this.uploadExcelDialog = true
      },
      // 下载excel
      downLoadExcelHandle: function () {
        let timestamp = (new Date()).getTime();
        downLoadBlob('/api/zcpt_material_class/exportExcel', `物料类别${timestamp}.xls`).then((response) => {
        })

      },
      // 删除
      deleteHandle: function (id) {
        // 处理IDS
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.materialCategoryId
        })
        // let param = { params: { categoryIds: this.dataListSelections.join(',') } }
        // 提示用户删除
        this.$confirm(`确定删除操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // this.$http.get('/api/zcpt_material_class/removeByIds', { params: { materialCategoryIds: ids.join(',') } }).then((response) => {
          //   this.$notify({ title: 'OK', message: '删除成功!' })
          //   this.refreshTableAndTree()
          // })
          console.log("ids",ids.join(','))
          // let param = {
          //   // params:{
          //     ids:ids.join(',')
          //   // }
          // }
          let param = ids.join(',')
          // let param = { params: { categoryIds: ids.join(',') } }
          removeMaterialCategory(param).then(response=>{
            if(response.success){
              this.$notify({ title: 'OK', message: '删除成功!' })
              this.refreshTableAndTree()
            }else{
              this.$notify({ title: 'OK', message: '删除失败!' })
            }


          })
        }).catch(() => { })
      }
    }
  }


</script>

<style lang="scss" scoped>

</style>
