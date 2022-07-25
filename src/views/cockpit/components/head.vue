<template>
  <div class="head">
    <el-cascader
      v-model="requestProjectValue"
      :options="requestProjectOptions"
      placeholder="请选择项目"
      :props="defaultProps"
      clearable
      filterable
      style="width: 350px"
      @change="handleRequestProjectValueChange"
    />
    <i class="el-icon-full-screen" @click="showFullScreen" />
  </div>
</template>

<script>
import api from '@/api/work/cockpit'
import screenfull from 'screenfull'
export default {
  name: "Head",
  data() {
    return {
      requestProjectValue: [null, 'HB1-2021-001-BD'],
      requestProjectOptions: [],
      defaultProps: {
        label: 'deptName',
        children: 'children',
        value: 'projectCode'
      }
    }
  },
  mounted() {
    this.getDeptAndProjectTree()
  },
  methods: {
    showFullScreen() {
      this.$store.commit('showSideBar/CHANGE_SHOW', false)
      // debugger
      // if (!screenfull.isEnabled) {
      //   this.$message({ message: '你的浏览器不支持全屏', type: 'warning' })
      //   return false
      // }
      // screenfull.toggle()
      // this.$store.commit('showSideBar/CHANGE_SHOW', false)
    },
    getDeptAndProjectTree() {
      api.getDeptAndProjectTree().then(res => {
        if (res.code === 0) {
          console.log(res)
          this.requestProjectOptions = this.filterNode(res.data)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 过滤节点数
    filterNode(data) {
      for (let i = 0, len = data.length; i < len; i++) {
        if (data[i].children.length === 0) {
          data[i].children = undefined
          // continue
        } else {
          this.filterNode(data[i].children)
        }
      }
      return data
    },
    handleRequestProjectValueChange(node) {
      // debugger
      this.$parent.refreshPage(this.requestProjectValue[this.requestProjectValue.length - 1])
    }
  },
}
</script>

<style lang="scss" scoped>
.head{
  display: flex;
  justify-content: space-between;
  padding: 15px;
  .el-icon-full-screen{
    cursor: pointer;
    font-size: 25px;
    font-weight: bolder;
    margin-top: 6px;
  }
}
</style>
