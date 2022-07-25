<template>
    <div>
        <!-- 物料管理左侧树 -->
        <el-card shadow="never">
            <div style="margin-bottom:10px">
                <el-input v-model="filterText" placeholder="输入关键字进行过滤" style="width:100%">
                    <i slot="prefix" class="el-input__icon el-icon-search"/>
                </el-input>
            </div>
            <el-scrollbar class="scroll-list" ref="scrollbar">
                <el-tree ref="tree" node-key="materialCategoryId" class="font-tree" :filter-node-method="filterNode"
                         :expand-on-click-node="false" :data="treeData" :props="defaultProps" default-expand-all
                         :highlight-current="true" @node-click="onTreeClick"
                         @node-expand="recalculateScrollbar" @node-collapse="recalculateScrollbar"
                >
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span>{{ node.label }}</span>
<!--            <span v-if="data.data !== null && data.data !== ''" class="remark">-->
<!--              ({{ data.data }})-->
<!--            </span>-->
          </span>
                </el-tree>
            </el-scrollbar>
        </el-card>
    </div>
</template>

<script>
  import { getTotalMaterial } from "@/api/material/materialCateGory.js";
  export default {
    components: {},
    data() {
      return {
        treeData: [], // 树结构数据载体
        defaultProps: {
          label: 'materialCategoryName',
          children: 'childs'
        },
        // cid: Number(this.$route.query.id),
        filterText: '' // 关键字过滤
      }
    },
    created() {},
    mounted() {
      this.getTreeData()
    },
    watch: {
      // 模糊搜索
      filterText(val) {
        this.$refs.tree.filter(val)
      }
    },
    methods: {
      refreshTree({ higtLightNode } = {}) {
        this.getTreeData(higtLightNode)
      },

      /**
       *
       // 获取树数据
       * @param {*} higtLightNode 高亮节点的id
       */
      getTreeData: function(higtLightNode) {
        let param = {
          params: {
            cid: this.cid
          }
        }
        getTotalMaterial().then(response => {
            let treeData = [{
              'childs': [],
              'materialCategoryId': 0,
              'materialCategoryName': '平台物料类别',
              'pid': 0,
              data: null
            }]
          console.log("response",response)
            treeData[0].childs = response.data
            this.treeData = treeData
            this.$nextTick(() => {
              if (this.$refs.tree) {
                this.$refs.tree.filter(this.filterText)
                if (!higtLightNode) {
                  //根节点高亮
                  this.$refs.tree.setCurrentKey(0)
                  this.$emit('onTreeClick', this.treeData[0])
                } else {
                  this.$refs.tree.setCurrentKey(higtLightNode)
                }
              }

            })
          console.log("treeData",treeData)
        });
        // this.$http.get('/api/zcpt_material_class/buildTree', param).then((response) => {
        //   let treeData = [{
        //     'childs': [],
        //     'materialCategoryId': 0,
        //     'materialCategoryName': '平台物料类别',
        //     'pid': 0,
        //     data: null
        //   }]
        //   treeData[0].childs = response.data.data
        //   this.treeData = treeData
        //   this.$nextTick(() => {
        //     if (this.$refs.tree) {
        //       this.$refs.tree.filter(this.filterText)
        //       if (!higtLightNode) {
        //         //根节点高亮
        //         this.$refs.tree.setCurrentKey(0)
        //         this.$emit('onTreeClick', this.treeData[0])
        //       } else {
        //         this.$refs.tree.setCurrentKey(higtLightNode)
        //       }
        //     }
        //
        //   })
        // })
      },
      // 显示模糊搜索节点
      filterNode(value, data) {
        if (!value) return true
        return data.materialCategoryName.indexOf(value) !== -1
      },
      // 点击事件
      onTreeClick: function(data) {
        this.$emit('onTreeClick', data)
      },
      // 展开或关闭节点时重新计算宽度
      recalculateScrollbar: function() {
        this.$nextTick(() => {
          setTimeout(() => {
            this.$refs.scrollbar.update()
            // 展开动画有300毫秒 必须等动画结束后才能更新宽度
          }, 400)
        })
      }
    }
  }


</script>

<style lang="scss" scoped>
.remark {
    color: #c0c4cc;
    font-size: 13px;
}

.font-tree {
    font-size: 14px;
    //保持包裹性，让树可以横行滚动
    //display: inline-block; 使用最下面的css实现滚动
}

.scroll-list {
    height: calc(100vh - 210px);

    /deep/.el-scrollbar__bar.is-vertical,
    /deep/.el-scrollbar__bar.is-horizontal {
        opacity: 1 !important;
    }
}

/deep/.el-scrollbar__wrap {
    overflow-x: hidden;
}

/* 横向滚动 */
/deep/.el-tree-node > .el-tree-node__children {
    overflow: visible;
}
</style>
