import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import user from './modules/user';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        // 状态
        token: '',
        tokenValid: true
    },
    mutations: {
        // 改变方法
        setToken (state, token) {
            state.token = token
         },
         setTokenValid (state, bool) {
             state.tokenValid = bool
         }
    },
    actions: {
        setToken({ commit }) {
            commit(setToken)
        },
        setTokenValid({ commit }) {
            commit(setTokenValid)
        }
    },
    modules: {
        app,
        user
    }
});

export default () => store;