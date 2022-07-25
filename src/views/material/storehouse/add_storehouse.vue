<template>
  <div>
    <!-- 新增窗口 -->
    <el-dialog :title="title" :close-on-click-modal="false" :visible="showDialog" width="1000px" class="company-dialog" @close="showDialog=false">
      <el-button type="primary" size="small" @click="submitHandle()" v-if="!disabled"> <i class="fa fa-check" /> 确定</el-button>
      <el-form ref="dataForm" :model="info" :rules="rules" label-width="120px" size="small" style="margin-top:25px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="仓库名称" prop="totalMaterialWarehouseName">
              <el-input v-model="info.totalMaterialWarehouseName" placeholder="" :disabled="disabled"/>
            </el-form-item>
            <el-form-item label="仓库负责人" prop="createUserName">
              <el-input v-model="info.createUserName" placeholder="" :disabled="disabled"/>
            </el-form-item>
            <el-form-item label="联系方式" prop="createUserPhone">
              <el-input v-model="info.createUserPhone" placeholder="" :disabled="disabled"/>
            </el-form-item>
            <el-form-item label="仓库地址" prop="address">
              <el-input v-model="info.address" placeholder="" :disabled="disabled"/>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="info.remark" placeholder="" type="" :disabled="disabled"/>
            </el-form-item>
<!--            <el-form-item label="关联项目" prop="materialCategoryName">-->
<!--              <el-select v-model="info.projectIdCopy" multiple placeholder="请选择" filterable style="width: 100%;">-->
<!--                <el-option-->
<!--                  v-for="item in projectSelect"-->
<!--                  :key="item.id"-->
<!--                  :label="item.projectname"-->
<!--                  :value="item.id">-->
<!--                </el-option>-->
<!--              </el-select>-->
<!--            </el-form-item>-->
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import { addMaterialStore, getMaterialStore, updateMaterialStore } from "@/api/material/storeInfo.js";
  export default {
    components: {
    },
    props:{
      projectSelect:{ type: Array, default () { return [] } },
    },
    data() {
      return {
        info: {},
        /**
         * 左侧树节点
         * treeitem={
         * materialCategoryId:物料类别id
         * }
         */
        treeItem: {},
        cid: Number(this.$route.query.id),
        showDialog: false, // 新增修改对话框
        rules: {
          totalMaterialWarehouseName: [ { required: true, message: '仓库名称不能为空', trigger: 'blur' } ],
          createUserName: [ { required: true, message: '仓库负责人不能为空', trigger: 'blur' } ],
          createUserPhone: [ { required: true, message: '联系方式不能为空', trigger: 'blur' } ],
          address: [ { required: true, message: '仓库地址不能为空', trigger: 'blur' } ],
        },
        value1: [],
        editType:'add'
      }
    },
    computed: {
      title() {
        if(this.editType === 'add'){
          return '新增仓库'
        }else if(this.editType === 'update'){
          return '修改仓库'
        }else if(this.editType === 'edit'){
          return '查看仓库'
        }
      },
      disabled(){
        if(this.editType === 'add' || this.editType === 'update'){
          return false;
        }else if(this.editType === 'edit'){
          return true;
        }
      }
    },
    created() {
    },

    methods: {

      // 新增 / 修改
      addOrUpdateHandle: function (materialCategory,editType) {
        this.editType = editType;
        if (this.$refs['dataForm'] !== undefined) {
          this.$refs['dataForm'].resetFields()
        }
        this.info = {}
        if (materialCategory) {
          getMaterialStore({totalMaterialWarehouseId: materialCategory.totalMaterialWarehouseId}).then(response =>{
              if (response.success) {
                let info = response.data
                // 不要关联仓库了
                // console.log("relationProjectId",info.relationProjectId)
                // info.projectIdCopy = info.relationProjectId.split(",");
                // for(let i=0;i<info.projectIdCopy.length;i++){
                //   info.projectIdCopy[i] = Number(info.projectIdCopy[i]);
                // }
                this.info = info;
                console.log("this.info",this.info)
              } else {
                this.$notify.error({ title: '错误', message: response.msg })
              }
          })
          // this.$http.get(`/api/zcpt_material_class/${materialCategory.materialCategoryId}`,).then((response) => {
          //
          //   if (response.success) {
          //     this.info = response.data.data
          //   } else {
          //     this.$notify.error({ title: '错误', message: response.data.msg })
          //   }
          // })
        }
        this.showDialog = true
      },
      // 新增保存
      submitHandle: function () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            // //后台关联项目id 要字符串
            // if(this.info.projectIdCopy){
            //   this.info.relationProjectId = this.info.projectIdCopy.join(',');
            // }
            // //后台关联项目name 要字符串
            // let arr = []
            // this.projectSelect.map(name=>{
            //   this.info.projectIdCopy.map(id=>{
            //     if(name.id == id){
            //       arr.push(name.projectname)
            //     }
            //   })
            // })
            // this.info.relationProjectName = arr.join(',');
            console.log("this.info",this.info)
            if (!this.info.totalMaterialWarehouseId) {
              // let param = {
              //   "materialCategoryName": this.info.materialCategoryName,
              //   "pid": this.treeItem.materialCategoryId,
              //   "materialclassCode": this.cid,
              // }
              // if (!param.materialclassCode && (param.materialclassCode !== 0 || param.materialclassCode !== '0')) {
              //   this.$notify.error({ title: '错误', message: '缺materialclassCode' })
              //   return
              // }
              //
              // console.log(param);

              // 新建
              addMaterialStore(this.info).then(response => {
                // this.$http.post('/api/zcpt_material_class/add', param).then((response) => {
                if (response.success) {
                  this.showDialog = false
                  this.$emit('refresh')
                  this.$notify({ title: 'ok', message: response.msg })
                } else {
                  this.$notify.error({ title: '错误', message: response.msg })
                }
                // })
              })

            } else {
              // 修改
              // this.$http.post('/api/zcpt_material_class/updateById', this.info).then((response) => {
              updateMaterialStore(this.info).then(response => {
                if (response.success) {
                  this.showDialog = false
                  this.$emit('refresh',)
                  this.$notify({ title: 'ok', message: response.msg })
                } else {
                  this.$notify.error({ title: '错误', message: response.msg })
                }
              })
              // })
            }
          }
        })
      },
    }
  }


</script>

<style lang="scss" scoped>

</style>
