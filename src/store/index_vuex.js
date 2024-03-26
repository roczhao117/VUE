import {
  createStore
} from 'vuex'


export default createStore({
  state: {


    userid: '',
    token: '',


  },
  mutations: {
    setToken(state, token) {
      state.token = token;
      window.localStorage.setItem('token', token);
    },

    setUser(state, userid) {
      state.userid = userid;
      window.localStorage.setItem('userid', userid);
    },

  },

  actions: {},
  modules: {},
  getters: {



    token: state => {

      if (!state.token) {
        state.token = window.localStorage.getItem('token').replace(/"/g, '');
      }
      return state.token;
    },
    userid: state => {

      if (!state.userid) {
        state.userid = window.localStorage.getItem('userid').replace(/"/g, '');
      }
      return state.userid;
    }

  }




})