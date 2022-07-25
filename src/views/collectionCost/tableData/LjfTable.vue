<template>
    <div class="ljf-table">
        <el-table
            :data="tableData"
            style="width: 100%"
            :header-cell-style="tableHeaderColor"
            class="tableView"
            v-loading="tableLoading"
            element-loading-text="拼命加载中"
            >
            <el-table-column prop="a" label="项目名称" width="200" align="center" />
            <el-table-column prop="b" label="计量单位" width="200" align="center" />
            <el-table-column label="投标成本"  align="center">
                <el-table-column label="项目整体建筑面积（m2）："  align="center">
                    <el-table-column prop="c" label="不含税造价（元/m2）"  align="center" />    
                </el-table-column>
                <el-table-column label="500000"  align="center">
                    <el-table-column prop="d" label="不含税单方（元/m2）"  align="center" />    
                </el-table-column>
            </el-table-column> 
            <el-table-column prop="e" label="备注" width="200" align="center" />       
        </el-table>   
    </div>
</template>


<script>
    export default {
        data() {
            return {
                tableLoading: false,
                tableData:[
                    {
                        a:'临建、安措费',
                        b:'项',
                        c:'',
                        d:'',
                        e:''
                    },
                    {
                        a:'CI费用',
                        b:'项',
                        c:'临建、安措费明细表，各类型项目的不含税投入金额',
                        d:''
                    },
                    {
                        a:'临建费用施费',
                        b:'项',
                        c:'临建、安措费明细表，各类型项目的不含税投入金额',
                        d:''
                    },
                    {
                        a:'定型化',
                        b:'项',
                        c:'临建、安措费明细表，各类型项目的不含税投入金额',
                        d:''
                    },
                     {
                        a:'安全文明措施费',
                        b:'项',
                        c:'临建、安措费明细表，各类型项目的不含税投入金额',
                        d:''
                    },
                    {
                        a:'现场非主体杂工费',
                        b:'项',
                        c:'临建、安措费明细表，各类型项目的不含税投入金额',
                        d:''
                    },
                    {
                        a:'其他措施费',
                        b:'项',
                        c:'临建、安措费明细表，各类型项目的不含税投入金额',
                        d:''
                    },
                    {
                        a:'进项税',
                        b:'项',
                        c:'临建、安措费明细表，各类型项目的不含税投入金额',
                        d:''
                    }
                ]
            }
        }
    }
</script>

<style scoped lang="scss">
    .ljf-table{

         .tableView{
            width: 100%;
            height: 600px;
            overflow-y: auto;
            background: #ebeef5;
            padding: 20px;
        }
    }
</style>
