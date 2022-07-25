<template>
  <div class="vtable">
    <el-table :data="tableData" border>
      <el-table-column
        align="center"
        v-for="(item, index) in vTitleData"
        :resizable="index !== 0"
        :width="index === 0 ? 200 : columnWidth" :key="index">
        <template slot="header" slot-scope="scope">
          <div v-if="scope.$index === 0" class="header-box">
            <span class="header-box_left">{{titleText[0]}}</span>
            <span class="header-box_line"></span>
            <span class="header-box_right">{{titleText[1]}}</span>
          </div>
          <div v-else>
            <div class="header-text">{{item}}</div>
          </div>
        </template>
        <template slot-scope="scope">
          <div v-html="scope.row[index]"></div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: "index",
    props: {
      columnWidth: {
        type: String,
        default: () => 150
      },
      titleText: {
        type: Array,
        default: () => [null, null]
      },
      titleData: {
        type: Array,
        default: () => []
      },
      tableData: {
        type: Array,
        default: () => []
      },
    },
    data() {
      return {
        vTitleData: [],
      };
    },
    watch: {
      titleData(n, o) {
        let newTitleData = [...n];
        newTitleData.unshift('');
        this.vTitleData = [];
        this.$nextTick(() => {
          this.vTitleData = newTitleData;
        })
      },
      deep: true,
      immediate: true
    }
  };
</script>

<style lang="scss" scoped>
  .vtable {
    .header-box {
      height: 22px;
      .header-box_left {
        position: absolute;
        top: -6px;
        left: 6px;
      }
      .header-box_line {
        position: absolute;
        width: 202px;
        height: 1px;
        background: #dfe6ec;
        left: -2px;
        top: 11px;
        transform: rotate(-12deg);
      }
      .header-box_right {
        position: absolute;
        right: 6px;
        bottom: -6px;
      }
    }
    .header-text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    ::v-deep th:nth-child(1) {
      position: relative;
      .cell {
        overflow: initial;
      }
    }
  }
</style>
