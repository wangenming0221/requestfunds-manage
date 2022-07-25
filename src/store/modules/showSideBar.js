const state = {
  isSideBarShow: false
}

const mutations = {
  CHANGE_SHOW: (state, isShow) => {
    state.isSideBarShow = isShow
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
