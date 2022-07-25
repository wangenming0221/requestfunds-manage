const state = {
  waitDoneCount: 0,
  isCheckDetailShow: false
}

const mutations = {
  CHANGE_COUNT: (state, count) => {
    state.waitDoneCount = count
  },
  CHANGE_SHOW: (state, isShow) => {
    state.isCheckDetailShow = isShow
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
