<template>
    <div class="gcbxf-table">
        <el-form ref="form">
            <el-table
                :data="tableData"
                :header-cell-style="tableHeaderColor"
                v-loading="tableLoading"
                element-loading-text="拼命加载中"
                > 
                <el-table-column label="名称" width="200" align="center">
                    <template slot-scope="scope">
                        <el-form-item class="my-form-item">
                            <el-input v-model="scope.row.name"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>

                <el-table-column label="计量单位" width="150" align="center">
                    <template slot-scope="scope">
                        <el-form-item class="my-form-item">
                            <el-input v-model="scope.row.costType"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="投标成本" align="center">
                    <el-table-column label="数量" align="center">
                        <template slot-scope="scope">
                            <el-form-item class="my-form-item">
                                <el-input v-model="scope.row.totalCount"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>    

                    <el-table-column label="综合单价"  align="center" >
                        <template slot-scope="scope">
                            <el-form-item class="my-form-item">
                                <el-input v-model="scope.row.singlePrice"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>  

                    <el-table-column label="合价" align="center" >
                        <template slot-scope="scope">
                            <el-form-item class="my-form-item">
                                <el-input v-model="scope.row.totalPrice"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column> 

                    <el-table-column label="平米单价"  align="center" >
                        <template slot-scope="scope">
                            <el-form-item class="my-form-item">
                                <el-input v-model="scope.row.squarePrice"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>    
                </el-table-column> 
            </el-table>
        </el-form>   
    </div>
</template>

<script>
import api from '@/api/work/collisioncost'
export default {
    data () {
        return {
            tableData:[],
            tableLoading: false,
            queryForm:{
                type: "1",
                totalId: 1,
                versionId: 1
            }
        }
    },
    created(){
        this.queryGcbxflist();
    },
    methods:{
        queryGcbxflist() {
            return new Promise((resolve, reject) => {
                api.queryGcbxflist(this.queryForm).then(res => {
                if(!res.code) {
                    this.tableData = res.data
                    resolve(res)
                }
                }).catch(err => {
                    reject(err)
                })
            })
        },
        //设置表头行的样式
        tableHeaderColor() {
            return "background-color:white;";
        },
    },
}

</script>

<style lang="scss">
    .gcbxf-table{  
        padding: 20px; 
        height: 600px;
        overflow-y: auto;
        background: #ebeef5;

            .columnNone {
                display: none;
            }

            .my-form-item{
                margin-top:20px;
            }
    }
</style>
