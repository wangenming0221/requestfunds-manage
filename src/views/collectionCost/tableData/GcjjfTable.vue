<template>
    <div class="gcjjf-table">
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
                <el-table-column label="投标成本" width="200" align="center">
                    <el-table-column label="项目整体建筑面积（m2）" width="200" align="center">
                         <el-table-column prop="c" label="不含税造价（元）" width="200" align="center" />    
                    </el-table-column> 
                    <el-table-column label="500000" width="200" align="center">
                         <el-table-column prop="不含税单方（元/m2）" label="不含税造价（元）" width="200" align="center" />    
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
                    a:'工程间接费小计',
                    b:'/',
                    c:'',
                    d:''
                },
                {
                    a:'项目现场管理费',
                    b:'项',
                    c:'',
                    d:''
                },
                {
                    a:'分公司管理费',
                    b:'项',
                    c:'',
                    d:''
                },
                {
                    a:'总公司管理费',
                    b:'项',
                    c:'',
                    d:''
                },
                {
                    a:'检测费',
                    b:'项',
                    c:'',
                    d:''
                },
                {
                    a:'现场水电费用',
                    b:'项',
                    c:'',
                    d:''
                },
                {
                    a:'工程保险费用',
                    b:'项',
                    c:'',
                    d:''
                },
                {
                    a:'测量放线费用',
                    b:'项',
                    c:'',
                    d:''
                },
                {
                    a:'造价咨询费',
                    b:'项',
                    c:'',
                    d:''
                },
                {
                    a:'档案编制费',
                    b:'项',
                    c:'',
                    d:''
                },
                {
                    a:'外联费（现场经费）',
                    b:'项',
                    c:'',
                    d:''
                },
                {
                    a:'投标打印费',
                    b:'项',
                    c:'',
                    d:''
                },
                {
                    a:'挂靠费',
                    b:'项',
                    c:'',
                    d:''
                },
                {
                    a:'不可预见成本',
                    b:'项',
                    c:'',
                    d:''
                },
                {
                    a:'进项税（如有）',
                    b:'项',
                    c:'',
                    d:''
                }
            ],
        }
    },
    methods:{
        //设置表头行的样式
        tableHeaderColor() {
           return "background-color:white;";
        },
    }
}
</script>


<style lang="scss">
    .gcjjf-table{

        .tableView{
            width: 100%;
            height: 600px;
            overflow-y: auto;
            background: #ebeef5;
            padding: 20px;
        }
    }
</style>