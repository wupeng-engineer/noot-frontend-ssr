import util from '~/libs/util'
export default function ({ app, req, res, store, redirect, route }) {
    const userInfo = store.state.user.info;
    let token = '';
    // 如果token存在 但是 没有用户信息
    const currentPath = route.path;
    // 如果是server
    if (typeof window === 'undefined') {
        const cookieName = 'access_token';
        const stringCookie = decodeURI(req.headers.cookie);
        if (!stringCookie || stringCookie.indexOf('access_token') === -1) {
            store.commit('logout');
            store.commit('removeMenuList');
            if (currentPath !== '/login') {
                return redirect('/login')
            } else {
                return false;
            }
        }
        const strCookie = new RegExp('' + cookieName + '[^;]+').exec(stringCookie)[0]
        token = unescape(strCookie ? strCookie.toString().replace(/^[^=]+./, '') : '')
        store.commit('setToken', token);
    } else {
        token = store.state.token;
    }

    if (userInfo.id && store.state.user.menuList.length) {
        if (currentPath === '/login' || currentPath === '/') return redirect('/sys/home');
    }
    if (!userInfo.id) {
        return app.$axios.api.userInfo().then(res => {
            if (res.message !== 'success') {
                if (currentPath !== '/login') {
                    store.commit('setTokenValid', false);
                    return redirect('/login');
                }
            } else {
                store.commit('setInfo', res.data);
                store.commit('setTokenValid', true);
                return app.$axios.api.getMenuList().then(res => {
                    let menuData = res.data || [];
                    const constRoutes = [];
                    util.initRouterNode(constRoutes, menuData);
                    store.commit('setMenulist', constRoutes.filter(item => item.children.length > 0));
        
                    let tagsList = [];
                    store.state.app.routers.map((item) => {
                        if (item.children.length <= 1) {
                            tagsList.push(item.children[0]);
                        } else {
                            tagsList.push(...item.children);
                        }
                    });
                    store.commit('setTagsList', tagsList);
                    return;
                });
            }
        });
    } else {
        // 加载菜单
        return app.$axios.api.getMenuList().then(res => {
            let menuData = res.data || [];
            const constRoutes = [];
            util.initRouterNode(constRoutes, menuData);
            store.commit('setMenulist', constRoutes.filter(item => item.children.length > 0));

            let tagsList = [];
            store.state.app.routers.map((item) => {
                if (item.children.length <= 1) {
                    tagsList.push(item.children[0]);
                } else {
                    tagsList.push(...item.children);
                }
            });
            store.commit('setTagsList', tagsList);
            return;
        });
    }
}