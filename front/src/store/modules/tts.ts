import axios from 'axios'

const api = process.env.VUE_APP_API_URL
export default {
  namespaced: true,
  methods: {
  },
  state: {
    D1: [],
  },
  mutations: {
    API_1 (state: any, payload: any) {
      state.D1 = payload.D1;
    }
  },
  actions: {
    async API_1 ({ commit }: any, payload: any) {
      const response = await axios({
        method: 'get',
        url: `${api}/TTS`
      })
        
      await commit('API_1', response.data )
    }
  }
}
