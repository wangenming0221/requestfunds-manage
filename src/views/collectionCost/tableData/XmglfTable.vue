<template>
    <div class="xmglf-table">
        <el-form ref="form">
            <el-table
                :data="tableData"
                :header-cell-style="tableHeaderColor"
                v-loading="tableLoading"
                element-loading-text="拼命加载中"
                >   
                <el-table-column label="岗位" width="200" align="center">
                    <template slot-scope="scope">
                        <el-form-item class="my-form-item">
                            <el-input v-model="scope.row.postName"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>   

                <el-table-column label="投标成本" align="center">

                    <el-table-column width="130" label="人数" align="center">
                        <template slot-scope="scope">
                            <el-form-item class="my-form-item">
                                <el-input v-model="scope.row.personCount"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>    

                    <el-table-column width="130" label="在项目工作期限（月）" align="center">
                        <template slot-scope="scope">
                            <el-form-item class="my-form-item">
                                <el-input v-model="scope.row.workMonths"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>  


                    <el-table-column width="130" label="月薪资标准（人/月）" align="center">
                        <template slot-scope="scope">
                            <el-form-item class="my-form-item">
                                <el-input v-model="scope.row.salary"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>


                    <el-table-column width="130" label="社保公积金（人/月）" align="center">
                        <template slot-scope="scope">
                            <el-form-item class="my-form-item">
                                <el-input v-model="scope.row.socialSecurityFund"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>


                    <el-table-column width="130" label="证件补贴（人/月）" align="center">
                        <template slot-scope="scope">
                            <el-form-item class="my-form-item">
                                <el-input v-model="scope.row.documentSubsidy"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>

                    <el-table-column width="130" label="餐费补贴（人/月）" align="center" >
                        <template slot-scope="scope">
                            <el-form-item class="my-form-item">
                                <el-input v-model="scope.row.mealAllowance"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>

                    <el-table-column width="130" label="话费补贴（人/月）" align="center">
                        <template slot-scope="scope">
                            <el-form-item class="my-form-item">
                                <el-input v-model="scope.row.phoneAllowance"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>

                    <el-table-column width="130" label="车辆补贴（人/月）" align="center">
                        <template slot-scope="scope">
                            <el-form-item class="my-form-item">
                                <el-input v-model="scope.row.carAllowance"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>

                    <el-table-column width="130" label="日常办公费（人/月）" align="center">
                        <template slot-scope="scope">
                            <el-form-item class="my-form-item">
                                <el-input v-model="scope.row.officeExpenses"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>


                    <el-table-column width="130" label="管理费合计（元）" align="center">
                        <template slot-scope="scope">
                            <el-form-item class="my-form-item">
                                <el-input v-model="scope.row.totalPrice"></el-input>
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
    data() {
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
        this.queryXmglflist();
    },
    methods:{
        queryXmglflist() {
            return new Promise((resolve, reject) => {
                api.queryXmglflist(this.queryForm).then(res => {
                if(!res.code) {
                    this.tableData = res.data
                    console.log(this.tableData)
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
     .xmglf-table{  
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