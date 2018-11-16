export default function({ app, req, res, store, redirect, route }) {
    const userInfo = store.state.user.info;
    let token = '';
    // 如果是server
    if (typeof window === 'undefined' && !store.state.token) {
        const cookieName = 'access_token';
        const stringCookie = decodeURI(req.headers.cookie);
        if (!stringCookie || stringCookie.indexOf('access_token') === -1) {
            return redirect('/login')
        }
        const strCookie = new RegExp('' + cookieName + '[^;]+').exec(stringCookie)[0]
        token = unescape(strCookie ? strCookie.toString().replace(/^[^=]+./, '') : '')
        // 如果没有设置token
        if (!store.state.token) {
            store.commit('setToken', token);
        }
    } else {
        token = store.state.token;
    }
    app.$axios.defaults.timeout = 15000;

    // 如果token存在 但是 没有用户信息
    const currentPath = route.path;

    if (!userInfo.id && store.state.tokenValid && token) {
        return app.$axios.api.userInfo().then(res => {
            if (res.message !== 'success') {
                if (currentPath !== '/login') {
                    store.commit('setTokenValid', false);
                    redirect('/login');
                }
            } else {
                store.commit('setInfo', res.data);
                store.commit('setTokenValid', true);
            }
        });
    }
}