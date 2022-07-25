<template>
    <div class="tbbjfysm-table">
         <el-form ref="form">
          <el-table
            :data="tableData"
            :header-cell-style="tableHeaderColor"
            v-loading="tableLoading"
            element-loading-text="拼命加载中"
            >   
                <el-table-column label="名称" align="center">
                    <template slot-scope="scope">
                        <el-form-item class="my-form-item">
                            <el-input v-model="scope.row.name"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>

                <el-table-column label="费率" align="center">
                    <template slot-scope="scope">
                        <el-form-item class="my-form-item">
                            <el-input v-model="scope.row.rate"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>


                <el-table-column label="备注" align="center">
                    <template slot-scope="scope">
                        <el-form-item class="my-form-item">
                            <el-input v-model="scope.row.remark"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
            </el-table>
        </el-form>  
    </div>
</template>

<script>
import api from '@/api/work/collisioncost'
    export default {
        data() {
            return {
                tableLoading: false,
                tableData:[],
                queryForm:{
                    type: "1",
                    totalId: 1,
                    versionId: 1
                },
            }
        },
        created() {
            this.queryTbbjfysmlist()
        },
        methods:{
            queryTbbjfysmlist() {
                return new Promise((resolve, reject) => {
                    api.queryTbbjfysmlist(this.queryForm).then(res => {
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
        }
    }
</script>

<style lang="scss">
    .tbbjfysm-table{
        padding: 20px; 
        height: 600px;
        overflow-y: auto;
        background: #ebeef5;

        .my-form-item{
            margin-top:20px;
        }
    }
</style>
