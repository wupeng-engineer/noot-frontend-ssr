import util from '~/libs/util'
export default ({ store, redirect, route }) => {
    // 判断是否有权限
    let validFlag = false;
    const breadcrumb = [];
    const currentPath = route.path;
    store.state.app.menuList.forEach(menu => {
        if (currentPath.indexOf(menu.path) !== -1) {
            breadcrumb.push({
                title: menu.title,
                path: menu.path,
                name: menu.name
            });
        }
        if (menu.children.length) {
            menu.children.forEach(item => {
                if (item.path === route.path) {
                    validFlag = true;

                    breadcrumb.push({
                        title: item.title,
                        path: item.path,
                        name: item.name
                    });
                    return;
                }
            })
        }
    })
    if (!validFlag) {
        redirect('/404');
    }
    store.commit('setCurrentPath', breadcrumb);
}