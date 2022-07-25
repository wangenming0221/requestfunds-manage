<template>
    <div class="app-container">
      <el-row :gutter="20">
        <el-col :span="4">
          <tree_com key="materialInfo" ref="materialInfoTree"
                   @onTreeClick="onTreeClickMaterialInfo"
          />
        </el-col>
        <el-col :span="20">
          <material_info  @returnCheck="returnCheck" @refreshTree="refreshTree" :chooseType="'single'" ref="MaterialInfo" :editTye="'choose'"/>
        </el-col>
      </el-row>
    </div>
</template>

<script>
  import tree_com from '../../../warehouse/material_class/tree_com'
  import material_info from "../../../warehouse/material_class/material_info";
  export default {
    components: {
      tree_com,
      material_info
    },
    name: 'planEachSubsidiary',
    props: {
      openEachDialog: { type: Boolean, default: false }
    },
    data () {
      return {

      }

    },
    watch: {

    },
    methods: {
      refreshTree(param) {
          //刷新物料tab页，防止物料类别tab页和物料信息tab页中的物料类别树不一样
          this.$refs.materialInfoTree.refreshTree(param)
          this.$refs.materialInfoTree.refreshTree()
      },
      onTreeClickMaterialInfo(treeItem) {
        this.$refs.MaterialInfo.initPage(treeItem)
      },
      returnCheck(val){
        console.log("1223434")
        this.$emit('returnCheck',val)
      }
    }
  }
</script>

<style>
.overSpecification {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 180px;
}
.overSpecification-tag {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 170px;
    display: inline-flex;
}
</style>
