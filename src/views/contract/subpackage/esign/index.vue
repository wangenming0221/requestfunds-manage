<template>
  <div>
<!--    <el-button type="primary" @click="jumbTo">跳转</el-button>-->
  </div>
</template>

<script>
import api from '@/api/work/contract'
export default {
  name: 'Index',
  created() {
    this.jumbTo()
  },
  methods: {
    jumbTo() {
      api.pageToXingYiYin().then(res => {
        console.log(res)
        const a = document.createElement('a')
        a.setAttribute('target', '_blank')
        if (res.code === 0) {
          window.open(res.data)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>

</style>
