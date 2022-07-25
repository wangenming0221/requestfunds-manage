<template>
  <div>
    <iframe :src="url" frameborder="0" width="100%" height="830px"></iframe>
  </div>
</template>

<script>
  import Cookies from 'js-cookie'
  import { getBmpUserName } from '@/utils/bpmSingle'

  export default {
    name: 'expensesFixedAssets',
    data(){
      return {
        url: `http://bpmuat.jiuzhangdigit.com/api/sso/getToken?userCode=${getBmpUserName()}&redirectUrl=http%3A%2F%2Fbpmuat.jiuzhangdigit.com%2Fapplication%2FMaterialSystem%2Fapplication-list%2FDemandPurchaseOrderEC%3FparentId%3D8a9490bd801e16a601803b6a2b460da9%26code%3DDemandPurchaseOrderEC%26%26openMode%26pcUrl%26queryCode%3D%26removeListMenu%3Dtrue`,
      }
    }
  }
</script>

<style scoped>

</style>
