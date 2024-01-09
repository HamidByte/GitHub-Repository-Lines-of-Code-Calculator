import { createStore } from 'vuex'

const store = createStore({
  state() {
    return {
      searchQuery: ''
    }
  },
  mutations: {
    setSearchQuery(state, query) {
      state.searchQuery = query
    }
  }
})

export default store
