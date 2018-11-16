import util from '~/libs/util'
export default ({ $axios, store, redirect, app, $router, route }) => {
    // 加载菜单
    if (!store.state.user.info.id) return;
    if (store.state.app.menuList.length > 0) return;
    return $axios.api.getMenuList().then(res => {
        let menuData = res.data || [];
        const constRoutes = [];
        util.initRouterNode(constRoutes, menuData);
        store.commit('updateMenulist', constRoutes.filter(item => item.children.length > 0));

        let tagsList = [];
        store.state.app.routers.map((item) => {
            if (item.children.length <= 1) {
                tagsList.push(item.children[0]);
            } else {
                tagsList.push(...item.children);
            }
        });
        store.commit('setTagsList', tagsList);
        redirect('/sys/user')
    });
}