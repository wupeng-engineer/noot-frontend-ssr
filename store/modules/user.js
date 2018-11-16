import Cookies from 'js-cookie';

const user = {
    state: {
        info: {},
        token: '',
        tokenValid: true
    },
    mutations: {
        logout (state, vm) {
            Cookies.remove('access_token');
            state.info = {};
        },
        setInfo (state, info) {
            console.log(info);
            state.info = info;
        },
        setToken (state, token) {
            state.token = token
         },
         setTokenValid (state, bool) {
             state.tokenValid = bool
         }
    },
    actions: {
        setInfo({ commit }) {
            commit(setInfo)
        },
        logout({ commit }) {
            commit(logout)
        },
        setToken({ commit }) {
            commit(setToken)
        },
        setTokenValid({ commit }) {
            commit(setTokenValid)
        }
    },
};

export default user;
