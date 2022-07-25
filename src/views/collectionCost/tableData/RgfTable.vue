<template>
    <div class="rgf-table">
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
      <el-table-column prop="bbb" label="计量单位" width="80" align="center" />
      <!-- 投标成本 -->
      <el-table-column label="投标成本" align="center" v-if="tableData[0]">
        <!-- 可多层 (循环嵌套) -->
        <el-table-column
          v-for="(item, i) in tableData[0].array"
          :key="i"
          class-name="columnNone"
        >
          <el-table-column label="合计" align="center" v-if="i == 0">
            <el-table-column label="模拟工程量" width="130" align="center">
              <template slot-scope="scope">
                <span>{{ tableData[scope.$index].sum }}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="建筑面积(m2)" align="center">
            <el-table-column
              label="不含税综合单价(元)"
              width="130"
              align="center"
            >
          
            </el-table-column>
            <el-table-column label="不含税造价(元)" width="130" align="center">
            
            </el-table-column>
          </el-table-column>
          <el-table-column :label="tableTiele[i].value" align="center">
            <el-table-column
              label="不含税单方(元/m2)"
              width="130"
              align="center"
            >
             
            </el-table-column>
          </el-table-column>
          <!-- 户型 -->
          <el-table-column :label="'户型:' + tableTiele[i].name" align="center">
            <el-table-column label="模拟工程量" width="130" align="center">
             
            </el-table-column>
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <!-- 备注 -->
      <el-table-column label="备注" width="200" align="center">
       
      </el-table-column>
    </el-table>
    </div>
</template>

<script>
export default {
  // form绑定数组
  computed: {
    formData: function () {
      const formData = {};
      this.tableData.map((item, index) => {
        formData[index] = item;
      });
      return formData;
    },
  },
  data() {
    return {
      //表格loading
      tableLoading: false,
      // 表格是否可编辑
      tableEditorshow: true,
      // 建筑面积数据
      tableTiele: [],
      // 表格数据
      tableData: [],
      // 模拟返回的数据
      mapObj: {
        tableTiele: [
          { name: "三室俩厅", value: "5000" },
          { name: "俩室一厅", value: "1000" },
          { name: "一室一厅", value: "1000" },
        ],
        tableData: [
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
          {
            aaa: "钢筋工程(含二次结构)",
            bbb: "t/m2",
            ccc: "",
            sum: "",
            array: [
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
            ],
          },
          {
            aaa: "钢筋工程(不含二次结构)",
            bbb: "t/m2",
            ccc: "",
            sum: "",
            array: [
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
            ],
          },
          {
            aaa: "混凝土工程",
            bbb: "m2",
            ccc: "",
            sum: "",
            array: [
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
            ],
          },
          {
            aaa: "砌筑工程(普通加气块、水泥砖等除高精砌块外的所有砌筑工程)",
            bbb: "m3",
            ccc: "",
            sum: "",
            array: [
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
            ],
          },
          {
            aaa: "砌筑工程(高精砌块)",
            bbb: "m3",
            ccc: "",
            sum: "",
            array: [
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
            ],
          },
          {
            aaa: "外墙抹灰（含挂网）",
            bbb: "m2",
            ccc: "",
            sum: "",
            array: [
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
            ],
          },
          {
            aaa: "内墙普通抹灰（含挂网）",
            bbb: "m2",
            ccc: "",
            sum: "",
            array: [
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
            ],
          },
          {
            aaa: "楼梯踏步段抹灰",
            bbb: "m2",
            ccc: "",
            sum: "",
            array: [
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
            ],
          },
          {
            aaa: "门窗边塞缝",
            bbb: "m",
            ccc: "",
            sum: "",
            array: [
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
            ],
          },
          {
            aaa: "天棚抹灰工程",
            bbb: "m2",
            ccc: "",
            sum: "",
            array: [
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
            ],
          },
          {
            aaa: "其他抹灰工程",
            bbb: "m2",
            ccc: "",
            sum: "",
            array: [
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
            ],
          },
          {
            aaa: "地面找平",
            bbb: "m2",
            ccc: "",
            sum: "",
            array: [
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
            ],
          },
          {
            aaa: "屋面找平",
            bbb: "m2",
            ccc: "",
            sum: "",
            array: [
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
            ],
          },
          {
            aaa: "内墙保温工程",
            bbb: "m2",
            ccc: "",
            sum: "",
            array: [
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
            ],
          },
          {
            aaa: "外墙内夹心保温一体板",
            bbb: "m2",
            ccc: "",
            sum: "",
            array: [
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
            ],
          },
          {
            aaa: "外墙外贴保温一体化模板",
            bbb: "m2",
            ccc: "",
            sum: "",
            array: [
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
            ],
          },
          {
            aaa: "隔墙板工程",
            bbb: "m2/m3",
            ccc: "",
            sum: "",
            array: [
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
            ],
          },
          {
            aaa: "叠合板工程",
            bbb: "m3",
            ccc: "",
            sum: "",
            array: [
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
            ],
          },
          {
            aaa: "PC楼梯制作安装（现场制作）",
            bbb: "m3",
            ccc: "",
            sum: "",
            array: [
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
            ],
          },
          {
            aaa: "PC楼梯制作安装（工厂制作）",
            bbb: "m3",
            ccc: "",
            sum: "",
            array: [
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
            ],
          },
          {
            aaa: "外墙砖铺贴",
            bbb: "m2",
            ccc: "",
            sum: "",
            array: [
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
            ],
          },
          {
            aaa: "屋面瓦铺贴（湿贴）工程",
            bbb: "m2",
            ccc: "",
            sum: "",
            array: [
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
            ],
          },
          {
            aaa: "屋面瓦铺贴（干挂）工程",
            bbb: "m2",
            ccc: "",
            sum: "",
            array: [
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
            ],
          },
          {
            aaa: "基础砖工程",
            bbb: "m3",
            ccc: "",
            sum: "",
            array: [
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
            ],
          },
          {
            aaa: "房心回填（含设计标高以上300mm内土方清槽）",
            bbb: "m3",
            ccc: "",
            sum: "",
            array: [
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
            ],
          },
          {
            aaa: "截桩头（混凝土灌注桩）",
            bbb: "根",
            ccc: "",
            sum: "",
            array: [
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
            ],
          },
          {
            aaa: "凿桩头（混凝土灌注桩）",
            bbb: "m3",
            ccc: "",
            sum: "",
            array: [
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
            ],
          },
          {
            aaa: "垃圾道、通风道、烟道工程",
            bbb: "m",
            ccc: "",
            sum: "",
            array: [
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
            ],
          },
          {
            aaa: "零星用工",
            bbb: "m2",
            ccc: "",
            sum: "",
            array: [
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
            ],
          },
          {
            aaa: "劳务管理费",
            bbb: "m2",
            ccc: "",
            sum: "",
            array: [
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
            ],
          },
          {
            aaa: "承包人利润",
            bbb: "m2",
            ccc: "",
            sum: "",
            array: [
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
            ],
          },
          {
            aaa: "进项税",
            bbb: "项",
            ccc: "",
            sum: "",
            array: [
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
              { a1: "", a2: "", a3: "", a4: "" },
            ],
          },
        ],
      },
    };
  },
  methods: {
    //设置表头行的样式
    tableHeaderColor() {
      return "background-color:white;";
    },
  },
  mounted() {
    this.tableData = this.mapObj.tableData;
    this.tableTiele = this.mapObj.tableTiele;
  },
};
</script>

<style lang="scss" >
.rgf-table{

    .tableView {
        width: 100%;
        height: 600px;
        overflow-y: auto;
        background: #ebeef5;
        padding: 20px;
        .columnNone {
            display: none;
        }
        .cell {
            // padding: 25px;
        }
        .el-form-item__error {
            // top: 5%;
            // left: 40px;
            // opacity: 0.5;
        }
    }
}

</style>