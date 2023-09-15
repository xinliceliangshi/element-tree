import { createStore } from 'vuex'

export default createStore({
  state: {
    parentData: []
  },
  mutations: {
    updateParentData(state, parentData) {
      state.parentData = parentData
    }
  },
  actions: {
  },
  modules: {
  }
})
