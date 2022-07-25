<template>
  <div class="waitDone">
    <el-link :underline="false" class="wait">待办 : <span :style="{ color: '#9079fd' }" @click="toWait">{{ $store.state.wait.waitDoneCount }}</span></el-link>
    <el-link target="_blank" :underline="false" type="primary" href="http://sso.sytyjz.com/?#/feedback/index">意见反馈</el-link>
  </div>
</template>

<script>
export default {
  name: "WaitDone",
  methods: {
    toWait() {
      this.$store.commit('wait/CHANGE_SHOW', true)
      this.$router.push({
        path: '/cooperative'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.waitDone{
  .wait{
    margin-right: 50px;
  }
}
</style>
