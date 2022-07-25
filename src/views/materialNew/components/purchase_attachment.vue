<template>
    <!--  请购附件-->
    <div class="purchase_attachment">
      <div>
        <span class="line"></span>
        <span class="head">请购附件</span>
        <el-button type="primary" @click="downLoadExcelHandle" size="mini" v-if="flag" class="btnUpload">下载</el-button>
      </div>
      <div>
        <el-table
          style="width:100%" size="small" border
          :data="tableData"
          ref="dataList"
          @selection-change="selectionChangeHandle"
        >
          <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
          <el-table-column header-align="center" show-overflow-tooltip align="center" type="index" label="序号" width="50"></el-table-column>
          <el-table-column header-align="center" show-overflow-tooltip align="center" prop="name" label="文件名" >
            <template slot-scope="scope">
              <el-button type="text" @click="downUpload(scope.row)">{{ scope.row.name }}</el-button>
            </template>
          </el-table-column>
          <el-table-column header-align="center" show-overflow-tooltip align="center" prop="creater" label="提交人" ></el-table-column>
          <el-table-column header-align="center" show-overflow-tooltip align="center" prop="createdTime" label="提交时间" ></el-table-column>
        </el-table>
      </div>
    </div>
</template>

<script>
    import { downLoadBlob } from "@/utils/downLoad.js";
    export default {
        name: 'purchase_attachment',
        data() {
            return {
              tableData:[],
              flag:false,
              dataListSelections:[]
            }
        },

        props: {
          info: { type: Object, default () { return {} } },
          edit:{ type: String, default: '' }
        },

        //监听属性 类似于data概念",
        computed: {},

        //监控data中的数据变化",
        watch: {
          info: {
            immediate: true,
            deep: true,
            handler: function (val) {
              if(val){
                if(val.ossFilePathList){
                  this.tableData = val.ossFilePathList;
                }
                if(val.offerChilds){
                  this.tableData = val.offerChilds;
                }
              }
            }
          },
          edit: {
            immediate: true,
            deep: true,
            handler: function (val) {
              if(val){
                this.flag = val =='edit' ? false: true;
              }
            }
          }
        },

      methods: {
        // 获取选中行
        selectionChangeHandle(val) {
          if (val.length > 1) {
            this.$refs.dataList.clearSelection();
            this.$refs.dataList.toggleRowSelection(val.pop());
          } else {
            this.dataListSelections = val
          }
        },
        downLoadExcelHandle(){
          if(this.dataListSelections.length==0) return this.$notify.error({ title: '错误', message: '请选择附件' })
          this.dataListSelections.forEach((item) => {
             downLoadBlob(item.path, item.name, '')
          });
        },
        downUpload(row){
          downLoadBlob(row.path, row.name, '')
        }
      },

        //生命周期 - 创建完成（可以访问当前this实例）",数据模型已加载，方法已加载,html模板已加载,html模板未渲染
        created() {
        },

        //生命周期 - 挂载之前",html模板未渲染
        beforeMount() {
        },

        //生命周期 - 挂载完成（可以访问DOM元素）",html模板已渲染
        mounted() {
        },

        //生命周期 - 更新之前",数据模型已更新,html模板未更新
        beforeUpdate() {
        },

        // 生命周期 - 销毁之前调用
        beforeDestroy() {
        },

        //生命周期 - 更新之后",数据模型已更新,html模板已更新
        updated() {
        },

        //生命周期 - 销毁完成"
        destroyed() {
        },

        //如果页面有keep-alive缓存功能，这个函数会触发",
        activated() {
        }
    }
</script>

<style scoped lang="scss">
  .purchase_attachment{
    margin-bottom: 30px;
    margin-top: 30px;
  }
  .btnUpload{
    float: right;
  }
</style>
