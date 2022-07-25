<template>
    <div class="sj-table">
        <el-table
            :data="tableData"
            style="width: 100%"
            :header-cell-style="tableHeaderColor"
            class="tableView"
            v-loading="tableLoading"
            element-loading-text="拼命加载中"
            >   
                <el-table-column prop="a" label="年份" align="center" />
                <el-table-column prop="b" label="增值税税率" align="center" />
                <el-table-column prop="c" label="企税税率" align="center" />
                <el-table-column prop="d" label="开票金额" align="center" />
                <el-table-column prop="e" label="不含税金额" align="center" />
                <el-table-column prop="f" label="销项税" align="center" />
                <el-table-column label="项目所在地预交税金" align="center">
                    <el-table-column prop="g" label="增值税（2%）" align="center" />
                    <el-table-column prop="h" label="城建税（7%/5%）" align="center" />
                    <el-table-column prop="i" label="教育费附加（3%）" align="center" />
                    <el-table-column prop="z" label="地方教育附加（2%）" align="center" />
                    <el-table-column prop="k" label="企业所得税（0.2%）" align="center" />
                    <el-table-column prop="l" label="印花税（0.03%）" align="center" />
                    <el-table-column prop="m" label="其他（个税、资源税、堤围费、环保税）" align="center" />
                    <el-table-column prop="n" label="预交合计" align="center" />
                </el-table-column>
                <el-table-column prop="o" label="进项税额" align="center" />
                <el-table-column prop="p" label="滞后金额可开具进项税额" align="center" />
                <el-table-column label="申报税金" align="center">
                    <el-table-column prop="q" label="增值税" align="center" />
                    <el-table-column prop="r" label="城建税（7%）" align="center" />
                    <el-table-column prop="s" label="教育费附加（3%）" align="center" />
                    <el-table-column prop="t" label="地方教育附加（2%）" align="center" />
                    <el-table-column prop="u" label="企业所得税（18年前1.8%，18年后按0.8%）" align="center" />
                    <el-table-column prop="v" label="印花税（0.03%）" align="center" />
                    <el-table-column prop="w" label="其他（2018-1之前资源税0.04%，2017-3之前堤围费0.1%）" align="center" />
                    <el-table-column prop="x" label="申报合计" align="center" />
                </el-table-column>
                <el-table-column prop="y" label="税金合计" align="center" />
                <el-table-column prop="z" label="增值税税负" align="center" />
                <el-table-column prop="aa" label="整体税负" align="center" />
       </el-table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tableLoading: false,
            tableData:[

            ],
        }
    },
    methods: {
        //设置表头行的样式
        tableHeaderColor() {
           return "background-color:white;";
        },
    }
}
</script>


<style lang="scss">
 .sj-table{

         .tableView{
            width: 100%;
            height: 600px;
            overflow-y: auto;
            background: #ebeef5;
            padding: 20px;
        }
    }
</style>