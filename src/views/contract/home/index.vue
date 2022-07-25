<template>
  <div class="home">
    <filiale v-if="authType === 2"></filiale>
    <center-auth v-if="authType === 1" @returnData="getData"></center-auth>
    <project v-if="authType === 3"></project>
  </div>
</template>

<script>
import api from '@/api/work/contract'
import Filiale from './component/filiale'
import Center from './component/center'
import Project from './component/project'
export default {
  name: 'Home',
  components: {
    'filiale': Filiale,
    'center-auth': Center,
    'project': Project
  },
  data() {
    return {
      authType: -1,
      tableData: {}
    }
  },
  mounted() {
    this.getAuth()
  },
  methods: {
    getData(data) {
      this.tableData = data
      this.authType = '3'
    },
    getAuth() {
      api.getContractAuth().then(res => {
        console.log(res)
        if(res.code === 0) {
          this.authType = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.home{
  width: 100%;
  height: 100%;
  padding: 15px;
}
</style>
