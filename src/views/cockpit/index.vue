<template>
  <div id="data-cockpit-view">
    <!-- $store.state.showSideBar.isSideBarShow -->
    <div v-if="$store.state.showSideBar.isSideBarShow">
      <dcv-head />
      <dcv-tab ref="tab" />
      <dcv-body ref="body" />
      <dcv-bottom ref="bottom" />
    </div>
    <div v-else>
      <full-screen />
    </div>
  </div>
</template>

<script>
import Loading from './components/loading'
import Head from './components/head'
import Tab from './components/tab'
import Body from './components/body'
import Bottom from './components/bottom'
import FullScreen from './fullscreen/index'
import screenfull from "screenfull";
export default {
  name: "Cockpit",
  components: {
    'loading': Loading,
    'dcv-head': Head,
    'dcv-tab': Tab,
    'dcv-body': Body,
    'dcv-bottom': Bottom,
    'full-screen': FullScreen
  },
  data() {
    return {

    }
  },
  mounted() {
    // screenfull.on('change', () => {
    //   if (this.$store.state.showSideBar.isSideBarShow) {
    //     this.$store.commit('showSideBar/CHANGE_SHOW', false)
    //   } else {
    //     this.$store.commit('showSideBar/CHANGE_SHOW', true)
    //   }
    //   console.log(this.$store.state.showSideBar.isSideBarShow)
    //
    // })
  },
  methods: {

    refreshPage(code) {
      this.$refs.tab.getCockpitInfo(code)
      this.$refs.bottom.getCostAnalysisList(code)
      this.$refs.body.getPayContractType(code)
      this.$refs.body.getProjectProgress(code)
    }
  }
}
</script>

<style lang="scss" scoped>
#data-cockpit-view{
  width: 100%;
  // height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
