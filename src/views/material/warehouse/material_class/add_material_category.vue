<template>
  <div>
    <!-- 新增窗口 -->
    <el-dialog :title="title" :close-on-click-modal="false" :visible="showDialog" width="1000px" class="company-dialog" @close="showDialog=false">
      <el-button type="primary" size="small" @click="submitHandle()"> <i class="fa fa-check" /> 确定</el-button>
      <el-form ref="dataForm" :model="info" :rules="rules" label-width="120px" size="small" style="margin-top:25px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="物料类别名称" prop="materialCategoryName">
              <el-input v-model="info.materialCategoryName" placeholder="" />
            </el-form-item>
            <el-form-item label="排序" prop="sort">
<!--              <el-input v-model="info.sort" placeholder="" />-->
              <el-input-number style="width:100%" :controls="false" type="number" :min="0" v-model="info.sort"/>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="info.remark" placeholder="" type="textarea"
                        :autosize="{ minRows: 4, maxRows: 8}" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import { addMaterialCategory, updateMaterialCategory, getMaterialCategory } from "@/api/material/materialCateGory.js";
  export default {
    components: {
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
          materialCategoryName: [
            { required: true, message: '物料类别名称不能为空', trigger: 'blur' }
          ],
          materialCategoryCode: [
            { required: true, message: '物料类型编码不能为空', trigger: 'blur' }
          ],
          remark: [],
          sort:[
            { required: true, message: '排序不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      title() {
        return this.info.materialCategoryId ? '编辑物料类别' : '新增物料类别'
      }
    },
    created() {
    },

    methods: {

      // 新增 / 修改
      addOrUpdateHandle: function (treeItem, materialCategory) {
        if (this.$refs['dataForm'] !== undefined) {
          this.$refs['dataForm'].resetFields()
        }
        this.info = {}
        this.treeItem = treeItem
        if (materialCategory) {
          getMaterialCategory({materialCategoryId:materialCategory.materialCategoryId}).then(response =>{
            if (response.success) {
              this.info = response.data
            } else {
              this.$notify.error({ title: '错误', message: response.data.msg })
            }
          })
        }
        this.showDialog = true
      },
      // 新增保存
      submitHandle: function () {
        this.$set(this.info, 'pid', this.treeItem.materialCategoryId);
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (!this.info.materialCategoryId) {
              // if (!param.pid && (param.pid !== 0 && param.pid !== '0')) {
              //   this.$notify.error({ title: '错误', message: '缺pid' })
              //   return
              // }
              // if (!param.materialclassCode && (param.materialclassCode !== 0 || param.materialclassCode !== '0')) {
              //   this.$notify.error({ title: '错误', message: '缺materialclassCode' })
              //   return
              // }
              //
              // console.log(param);

              // 新建
              addMaterialCategory(this.info).then(response => {
                console.log("response",response)
                // this.$http.post('/api/zcpt_material_class/add', param).then((response) => {
                if (response.success) {
                  this.showDialog = false
                  this.$emit('refresh')
                  this.$notify({ title: 'ok', message: response.data.msg })
                } else {
                  this.$notify.error({ title: '错误', message: response.data.msg })
                }
                // })
              })
            } else {
              // 修改
              updateMaterialCategory(this.info).then(response => {
                if (response.success) {
                  this.showDialog = false
                  this.$emit('refresh',)
                  this.$notify({ title: 'ok', message: response.msg })
                } else {
                  this.$notify.error({ title: '错误', message: response.msg })
                }
              })
            }
          }
        })
      },
    }
  }


</script>

<style lang="scss" scoped>
  /deep/.el-input-number.is-without-controls .el-input__inner {
    text-align: left;
    padding-left: 15px;
    padding-right: 15px;
  }
</style>
