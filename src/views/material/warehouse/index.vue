<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="物料信息" name="materialInfo"/>
      <el-tab-pane label="分类信息维护" name="category"/>
    </el-tabs>
    <el-row :gutter="20">
      <el-col :span="4">
        <TreeCom key="materialInfo" ref="materialInfoTree" v-show="materialInfoTreeShow"
                 @onTreeClick="onTreeClickMaterialInfo"
        />
          <TreeCom ref="TreeCom" key="category" v-if="categoryTreeShow" @onTreeClick="onTreeClick"/>
      </el-col>
      <el-col :span="20">
        <MaterialInfo @refreshTree="refreshTree" ref="MaterialInfo" v-show="materialInfoShow"/>
        <MaterialCategory @refreshTree="refreshTree" ref="MaterialCategory" v-show="materialCategoryShow"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import MaterialInfo from './material_class/material_info.vue'
  import MaterialCategory from './material_class/material_category.vue'
  import TreeCom from './material_class/tree_com.vue'

  export default {
    name: 'zcpt_material_class',
    components: {
      MaterialInfo,
      MaterialCategory,
      TreeCom
    },
    data() {
      return {
        activeName: 'materialInfo'

      }
    },
    computed: {
      materialInfoShow() {
        return this.activeName == 'materialInfo'
      },
      /**
       * 物料信息树是否显示
       */
      materialInfoTreeShow() {
        return this.activeName == 'materialInfo'
      },
      /**
       * 物料类别表格是否显示
       */
      materialCategoryShow() {
        return this.activeName == 'category'
      },
      /**
       * 物料类别树是否显示
       */
      categoryTreeShow() {
        return this.activeName == 'category'
      }

    },
    created() {},
    watch: {},
    methods: {
      /**
       * 刷新树
       * @param {*} param 刷新树时候需要的入参
       * param={
       *    higtLightNode:树需要高亮的节点的id
       * }
       */
      refreshTree(param) {
        if (this.activeName == 'materialInfo') {
          this.$refs.materialInfoTree.refreshTree(param)
        } else if (this.activeName == 'category') {
          this.$refs.TreeCom.refreshTree(param)
          //刷新物料tab页，防止物料类别tab页和物料信息tab页中的物料类别树不一样
          this.$refs.materialInfoTree.refreshTree()
        }
      },
      /**
       * 加载右侧表格数据
       * @param {*} treeItem 左侧树节点
       */
      onTreeClick: function(treeItem) {
        this.$refs.MaterialCategory.initPage(treeItem)
      },
      onTreeClickMaterialInfo(treeItem) {
        this.$refs.MaterialInfo.initPage(treeItem)
      }
    }
  }


</script>

<style lang="scss" scoped>

</style>
