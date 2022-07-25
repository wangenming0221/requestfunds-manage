<template>
  <div class="rgfmx-table">
      <el-table
      :data="tableData"
      style="width: 100%"
      :header-cell-style="tableHeaderColor"
      class="tableView"
      v-loading="tableLoading"
      element-loading-text="拼命加载中"
    >
       <!-- 项目名称 -->
      <el-table-column prop="aaa" label="项目名称" width="200" align="center" />
      <!-- 计量单位 -->
      <el-table-column prop="bbb" label="单位" width="80" align="center" />
      <!-- 投标成本 -->
      <el-table-column prop="bbb" label="投标成本" align="center">
         <!-- 可多层 (循环嵌套) -->
        <el-table-column
          v-for="(item, i) in tableTitle"
          :key="i"
          class-name="columnNone"
        >
            <el-table-column :label="i === 0 ?'合计' : '户型:'" align="center">
              <el-table-column label="工程量" width="130" align="center">
                <el-table-column label="A1" width="130" align="center"> </el-table-column>
              </el-table-column>
              <el-table-column label="工不含税分项综合单价（元）程量" width="130" align="center">
                <el-table-column label="B" width="130" align="center"> </el-table-column>
              </el-table-column>
            </el-table-column>

            <el-table-column label="建筑面积(m2)" align="center">
              <el-table-column label="不含税分项综合单价拆分明细（元）" width="130" align="center">
                  <el-table-column label="C" width="130" align="center"> </el-table-column>
              </el-table-column>
              <el-table-column label="不含税综合总价（元）" width="130" align="center">
                <el-table-column label="D" width="130" align="center"> </el-table-column>
              </el-table-column>
            </el-table-column>

            <el-table-column label="500000" align="center">
              <el-table-column label="不含税单方（元/m2）" width="130" align="center">
                  <el-table-column label="F" width="130" align="center"> </el-table-column>
              </el-table-column>
            </el-table-column>
        </el-table-column>
        <!-- 循环嵌套结束 -->
      </el-table-column>   

    </el-table>
  </div>
</template>

<script>
export default {
  // form绑定数组
  data() {
    return {
      tableTitle:[
        {

        },
        {

        }
      ],
      tableData:[
          {
            aaa: "人工费(实体)小计",
            bbb: "元",
            ccc: "",
            sum: "",
            array: [
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
            ],
          },
      ],
      tableLoading: false,
    };
  },
  methods: {
    //设置表头行的样式
    tableHeaderColor() {
      return "background-color:white;";
    },
  },
  mounted() {
   
  },
};
</script>

<style lang="scss" >
    .rgfmx-table{

      .tableView{
        width: 100%;
        height: 600px;
        overflow-y: auto;
        background: #ebeef5;
        padding: 20px;

        .columnNone {
          display: none;
        }
      }
    }
</style>