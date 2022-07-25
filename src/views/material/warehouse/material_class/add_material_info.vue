<template>
    <div>
        <!-- 新增窗口 -->
        <el-dialog :title="title" :close-on-click-modal="false" :visible="showDialog" width="1000px" class="company-dialog" @close="showDialog=false">
            <el-button type="primary" size="small" @click="submitHandle()"> <i class="fa fa-check" /> 保存</el-button>
            <el-form ref="dataForm" :model="info" :rules="rules" label-width="80px" size="small" style="margin-top:25px">
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="物料类别" prop="materialTypeName">
                            <el-input v-model="info.materialTypeName" placeholder="" readonly @click.native="openTree()"/>
                        </el-form-item>
                        <el-form-item label="物料名称" prop="materialName">
                            <el-input v-model="info.materialName" placeholder="" />
                        </el-form-item>
                        <el-form-item label="规格" prop="specification">
                            <el-input v-model="info.specification" placeholder="" />
                        </el-form-item>
                        <el-form-item label="单位" prop="unit">
                            <el-input v-model="info.unit" placeholder="" />
                        </el-form-item>
                        <el-form-item label="" prop="">
                            <div class="unitContainer">
                                <div class="unitArea">
                                    <el-tag class="tagCSS" effect="plain" @click="chooseUnit(unit,index)" :key="unit.name" :type="unitType(unit,index)" v-for="(unit,index) in unitListShow">{{unit.name}}</el-tag>
                                </div>
                                <div class="buttonArea">
                                    <el-button type="text" size="small" @click="expend">{{expendOrShrink}}</el-button>
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item label="价格(元)" prop="price">
                            <el-input-number :precision="2" class="inputNumberCSS" style="width:100%" v-model="info.price" controls-position="right" :min="0"></el-input-number>
                        </el-form-item>
                        <el-form-item label="备注" prop="remark">
                            <el-input v-model="info.remark" placeholder="" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-dialog>
        <el-dialog title="选择物料分类" :close-on-click-modal="false" :visible="showTree" width="624px" top="5vh" @close="showTree=false">
            <el-alert title="提示：只能选择叶子节点" type="warning" style="margin-bottom: 10px;"></el-alert>
            <TreeCom key="materialInfo" ref="materialInfoTree" @onTreeClick="onTreeClickMaterialInfo"/>
        </el-dialog>
    </div>
</template>

<script>
  import TreeCom from './tree_com.vue'
  import { addMaterialMaterial,getMaterialMaterial, updateMaterialMaterial } from "@/api/material/materialInfo.js";
  export default {
    components: {
      TreeCom
    },
    data() {
      return {
        showIndex: 19,//单位list显示到的索引
        chooseIndex: null,//当前选择的单位tag的索引
        /**
         * 单位list
         * unitList = {
         *    name: unit,//单位名称
         *    type: 'info',//单位tag的颜色  info 是黑白的  空字符串是蓝色的
         * }
         */
        unitList: [],
        /**
         * info = {
         *     materialId：物料id，有这个materialId的时候代表编辑
         *     unit；单位
         *     price价格
         * }
         */
        info: {},
        /**
         * 左侧树节点
         * treeitem = {
         *     materialCategoryId:物料类别id
         * }
         */
        treeItem: {},
        cid: Number(this.$route.query.id),
        showDialog: false, // 新增修改对话框
        showTree: false, // 新增修改对话框选择类别
        rules: {
          materialTypeName: [
            { required: true, message: '物料类别不能为空', trigger: 'change' }
          ],
          materialName: [
            { required: true, message: '物料名称不能为空', trigger: 'blur' }
          ],
          specification: [
            { required: true, message: '规格不能为空', trigger: 'blur' }
          ],
          unit: [
            { required: true, message: '单位不能为空', trigger: 'change' }
          ]
        },
      }
    },
    computed: {
      /**
       * 收缩展开按钮文字
       */
      expendOrShrink() {
        if (this.unitListShow.length === this.unitList.length) {
          return '收缩'
        }
        return '展开'
      },
      title() {
        return this.info.materialId ? '编辑物料信息' : '新增物料信息'
      },
      /**
       * 显示在页面上的单位list
       */
      unitListShow() {
        let unitList = this.unitList.slice(0, this.showIndex)
        return unitList
      }
    },
    created() {
      let unitList = ['把', '包', '本', '部', '层', '串', '床', '袋', '顶', '对',
        '吨', '幅', '付', '副', '个', '根', '公斤', '罐', '盒', '架', '件', '节', '斤', '卷',
        '块', '捆', '立方米', '辆', '米', '面', '排', '盘', '片', '平方米', '瓶', '千块',
        '千瓦', '扇', '升', '双', '台', '台套', '樘', '套', '提', '条', '桶', '瓦', '箱', '项', '延米', '扎', '盏',
        '张', '支', '只', '组', '座'
      ]
      unitList = unitList.map(unit => {
        return {
          name: unit,
          type: 'info'
        }
      })

      this.unitList = unitList
    },

    methods: {
      /**
       * 单位tag的type
       * @param {*} unit
       * @param {*} index 单位tag的索引
       */
      unitType(unit, index) {
        if (this.chooseIndex === index) {
          //让tag变成蓝色
          return ''
        }
        //变成黑白
        return 'info'
      },
      /**
       * 点击单位tag
       * @param {*} unit 单位tag对象
       * @param {*} index 单位tag的索引
       */
      chooseUnit(unit, index) {
        this.chooseIndex = index

        this.$set(this.info, 'unit', unit.name)
      },
      /**
       * 收缩或者展开
       */
      expend() {
        if (this.unitListShow.length === this.unitList.length) {
          this.showIndex = 19
          return
        }
        this.showIndex = this.unitList.length
      },
      breadthQuery: function (tree, id) {
        let stark = []
        stark = stark.concat(tree)
        while (stark.length) {
          let temp = stark.shift()
          if (temp.childs) {
            stark = stark.concat(temp.childs)
          }
          if (temp.materialCategoryId === id) {
            return temp
          }
        }
      },
      // 新增 / 修改
      addOrUpdateHandle: function(treeItem, materialInfo) {
        if (this.$refs['dataForm'] !== undefined) {
          this.$refs['dataForm'].resetFields()
        }
        this.info = {
          //如果价格输入的是非数字，光标离开input框的时候，会自动变成0.00
          price: 0.00
        }
        this.showIndex = 19
        this.chooseIndex = null
        this.treeItem = treeItem
        if (materialInfo) {
          let params = { materialId:materialInfo.materialId };
          getMaterialMaterial(params).then(response=>{
              if (response.success) {
                this.info = response.data
                this.showDialog = true
              } else {
                this.$notify.error({ title: '错误', message: response.data.msg })
              }
          })
        } else {
          this.showDialog = true
        }
      },
      // 新增保存
      submitHandle: function() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (!this.info.materialId) {

              let param = {
                'materialName': this.info.materialName,
                'materialTypeName': this.info.materialTypeName,
                'materialTypeId': this.info.materialTypeId,
                'materialTypeCode': this.info.materialTypeCode,
                'price': this.info.price,
                'remark': this.info.remark,
                'specification': this.info.specification,
                'unit': this.info.unit
              }
              if(!param.unit) delete param.unit;

              // 新建
              addMaterialMaterial(param).then(response=>{
                  if (response.success) {
                    this.showDialog = false
                    this.$emit('refresh')
                    this.$notify({ title: 'ok', message: response.msg })
                  } else {
                    this.$notify.error({ title: '错误', message: response.msg })
                  }
              })
            } else {
              // 修改
              updateMaterialMaterial(this.info).then(response => {
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
      // 打开物料类别树 让用户修改类别
      openTree: function () {
        this.showTree = true
      },
      // 点击选择一个物料类别
      onTreeClickMaterialInfo: function (treeItem) {
        // 物料类别根节点不可添加物料信息
        if (treeItem.materialCategoryId === 0 || treeItem.materialCategoryId === '0') {
          return
        }
        // 物料类别有子节点,不可添加物料信息
        if (treeItem.childs && treeItem.childs.length > 0) {
          return
        }
        this.$set(this.info, 'materialTypeId', treeItem.materialCategoryId)
        this.$set(this.info, 'materialTypeCode', treeItem.materialCategoryCode)
        this.$set(this.info, 'materialTypeName', treeItem.materialCategoryName)
        this.showTree = false
      }
    }

  }


</script>


<style lang="scss" scoped>
    //单位列表
    .unitContainer {
        overflow: hidden;

        //单位列表区域
        &>.unitArea {
            float: left;
            //展开收缩区域宽度
            $buttonAreaWidth: 28px;
            width: calc(100% - #{$buttonAreaWidth});

            //单位tag
            &>.tagCSS {
                margin-right: 10px;
                margin-bottom: 8px;
                cursor: pointer;
            }
        }

        //展开收缩区域
        &>.buttonArea {
            float: left;
        }
    }

    .inputNumberCSS {
        & /deep/>.el-input {
            &>.el-input__inner {
                //让计数器的光标从最左侧开始
                text-align: unset;
            }
        }
    }
</style>
