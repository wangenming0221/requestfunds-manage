<template>
  <div class="m-table">
    <div class="mt-top">
      <div></div>
      <div>
        <el-button type="primary">提交</el-button>
        <el-button type="success">撤回</el-button>
        <el-button type="info">暂存</el-button>
        <el-button type="warning">复制历史版本</el-button>
        <el-button type="danger">流程流转信息</el-button>
        <el-button @click="onBack">返回</el-button>
      </div>
    </div>
    <div class="mt-main">
      <div class="m-tree">
        <el-input
          placeholder="输入关键字进行过滤"
          v-model="filterKey">
        </el-input>

        <el-tree
          class="filter-tree"
          :data="treeData"
          :props="defaultProps"
          default-expand-all
          :filter-node-method="filterNode"
          ref="tree">
          <template #icon-class></template>
        </el-tree>
      </div>
      <div class="m-content">
        <div class="mc-top">
          <div>
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
              <el-breadcrumb-item>活动列表</el-breadcrumb-item>
              <el-breadcrumb-item>活动详情</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div>
            <el-button type="success" size="small">编辑项目</el-button>
            <el-button type="info" size="small">附件管理</el-button>
          </div>
        </div>
        <div class="mc-table">
          <!-- <person-fee-detail-table /> -->
          <!-- <rgf-table /> -->
          <!-- <rgfmx-table /> -->
          <xmglf-table />
          <!-- <gcbxf-table /> -->
          <!-- <tbbjfysm-table /> -->
          <!-- <sj-table /> -->
          <!-- <qtcbtzx-table /> -->
          <!-- <gcjjf-table /> -->
          <!-- <ljf-table /> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 人工费（实体）明细
// import PersonFeeDetailsTable from '../tableData/personFeeDetailsTable.vue'
import RgfTable from '../tableData/RgfTable.vue'; // 人工费（实体）
import RgfmxTable from '../tableData/RgfmxTable.vue'; // 人工费（实体）明细
import XmglfTable from '../tableData/XmglfTable.vue'; // 项目管理费
import GcbxfTable from '../tableData/GcbxfTable.vue'; // 工程保险费用
import TbbjfysmTable from '../tableData/TbbjfysmTable.vue'; //投标报价取费说明
import SjTable from '../tableData/SjTable.vue'; //税金
import QtcbtzxTable from '../tableData/QtcbtzxTable.vue'; //其他成本调整项
import GcjjfTable from '../tableData/GcjjfTable.vue'; //工程间接费
import LjfTable from '../tableData/LjfTable.vue'; //临建、安措费


export default {
  name: 'MTable',
  components: {
    RgfTable,
    RgfmxTable,
    XmglfTable,
    GcbxfTable,
    TbbjfysmTable,
    SjTable,
    QtcbtzxTable,
    GcjjfTable,
    LjfTable
  },
  data() {
    return {
      filterKey: '',
      treeData: [],
      defaultProps: {

      }
    }
  },
  methods: {
    filterNode() {

    },
    // 返回
    onBack() {
      this.$parent.changeIsShowStatus(true)
    }
  }
}
</script>

<style lang="scss" scoped>
.m-table{
  width: 100%;
  display: flex;
  flex-direction: column;

  .mt-top{
    width: 100%;
    height: 100px;
    display: flex;
    justify-content: space-between;
    line-height: 100px;
    padding: 0 20px;
  }

  .mt-main{
    width: 100%;
    display: flex;
    flex-direction: row;
    padding: 0 20px;

    .m-tree{
      width: 250px;
      height: 700px;
      border-radius: 5px;
      border: 1px solid #eee;
      padding: 5px;
    }

    .m-content{
      width: calc(100% - 260px);
      display: flex;
      flex-direction: column;
      border-radius: 5px;
      border: 1px solid #eee;
      margin-left: 10px;

      .mc-top{
        display: flex;
        justify-content: space-between;
        padding: 10px 10px 10px 10px;
      }
    }
  }
}
</style>