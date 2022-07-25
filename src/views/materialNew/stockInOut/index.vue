<template>
  <div class="supplier-container stockInOut">
    <div class="sc-top">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="入库单" name="first">
          <stockInList :project="project"></stockInList>
        </el-tab-pane>
        <el-tab-pane label="出库单" name="second">
          <stockOutList :project="project"></stockOutList>
        </el-tab-pane>
      </el-tabs>
    </div>



  </div>
</template>

<script>
    import stockInList from "./component/stockInList";
    import stockOutList from "./component/stockOutList";
    import { getProject } from '@/api/materialNew/order'
    export default {
        name: 'stockInOut',
        components:{
          stockInList,
          stockOutList
        },
      data() {
        return {
          activeName:'first',
          project:[]
        }
      },
      mounted() {

      },

        //监听属性 类似于data概念",
        computed: {},

        //监控data中的数据变化",
        watch: {},

      methods: {
        handleClick(tab, event){
          console.log(tab, event);
        },
        getProjectList(){
          getProject().then(response=>{
            console.log("response.data",response.data)
            this.project = response.data;
          })
        },
      },

        //生命周期 - 创建完成（可以访问当前this实例）",数据模型已加载，方法已加载,html模板已加载,html模板未渲染
        created() {
          this.getProjectList();
        },

        //生命周期 - 挂载之前",html模板未渲染
        beforeMount() {
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
  .supplier-container{
    width: 100%;
    height: 100%;
  .sc-top{
    width: 100%;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 10px 10px 30px 10px #eeeeee;
    padding-top: 15px;
    padding-left: 25px;
    padding-right: 25px;
    padding-bottom: 15px;
  }
  .sc-table{
    width: 100%;
    margin-top: 20px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 10px 10px 30px 10px #eeeeee;
    padding: 20px 20px;
  }
  }
  .new-add-contain{
    width: 50%;
    height: 500px;
    overflow-y: scroll;
  }
  .new-add-contain::-webkit-scrollbar{
    display: none;
  }
  .supply-info{
    width: 100%;
    font-size: 20px;
    font-weight: bolder;
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
  .supply-info-title{

  }
  .el-icon-circle-plus-outline, .el-icon-remove-outline{
    cursor: pointer;
  }
  }
  .payee{
    margin: 0;
    padding: 0;
    list-style-type: none;
  }
  .stockInOut{
    /deep/.pagination{
      width: 100%;
      display: flex;
      flex-direction: row-reverse;
      margin-top: 20px;
    }
  }

</style>
