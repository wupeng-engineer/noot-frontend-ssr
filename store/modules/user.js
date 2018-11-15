import Cookies from 'js-cookie';

const user = {
    state: {
        info: {}
    },
    mutations: {
        logout (state, vm) {
            Cookies.remove('userInfo');
            Cookies.remove('access');
        },
        setInfo (state, info) {
            state.info = info;
        }
    },
    actions: {
        setInfo({ commit }) {
            commit('setInfo')
        }
    },
};

export default user;
