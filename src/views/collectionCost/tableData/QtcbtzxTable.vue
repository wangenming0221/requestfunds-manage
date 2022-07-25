<template>
    <div class="qtcbtzx-table">
         <el-table
            :data="tableData"
            style="width: 100%"
            :header-cell-style="tableHeaderColor"
            class="tableView"
            v-loading="tableLoading"
            element-loading-text="拼命加载中"
            >
                <el-table-column prop="a" label="项目名称" align="center" />
                <el-table-column prop="b" label="计量单位" align="center" />
                <el-table-column label="投标成本" align="center">
                    <el-table-column label="项目整体建筑面积（m2）" align="center">
                        <el-table-column prop="c" label="不含税造价（元）" align="center" />
                    </el-table-column>
                    <el-table-column label="500000" align="center">
                        <el-table-column prop="d" label="不含税单方（元/m2）" align="center" />
                    </el-table-column>
                </el-table-column>
                <el-table-column prop="e" label="备注" align="center" />
        </el-table>    
    </div>
</template>

<script>
export default {
    data() {
        return {
            tableData:[
                {
                    a:'其他成本调整项',
                    b:'元',
                    c:'-',
                    d:'-',
                    e:''
                },
                {
                    a:'废品出售',
                    b:'元',
                    c:'-',
                    d:'-',
                    e:''
                },
                {
                    a:'让利收入',
                    b:'元',
                    c:'-',
                    d:'-',
                    e:''
                },
                {
                    a:'借支利息',
                    b:'元',
                    c:'-',
                    d:'-',
                    e:''
                },
                {
                    a:'材料代购费',
                    b:'元',
                    c:'-',
                    d:'-',
                    e:''
                },
                {
                    a:'对下游通启及制度奖罚款',
                    b:'元',
                    c:'-',
                    d:'-',
                    e:''
                },
                {
                    a:'违约金',
                    b:'元',
                    c:'-',
                    d:'-',
                    e:''
                },
                {
                    a:'项目所得其他收入',
                    b:'元',
                    c:'-',
                    d:'-',
                    e:''
                }
            ],
            tableLoading: false,
        }
    },
    methods: {
        //设置表头行的样式
        tableHeaderColor() {
           return "background-color:white;";
        },
    },
}
</script>


<style lang="scss">
    .qtcbtzx-table{

         .tableView{
            width: 100%;
            height: 600px;
            overflow-y: auto;
            background: #ebeef5;
            padding: 20px;
        }
    }
</style>