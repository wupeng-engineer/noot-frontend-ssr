import Cookies from 'js-cookie';

const user = {
    state: {
        info: {},
        token: '',
        menuList: [{
            id: '1',
            title: '资源管理',
            name: 'resource-manage',
            icon: 'md-settings',
            children: [{
                id: '1.1',
                title: '首页',
                name: 'resource-home',
                icon: 'md-home',
            },{
                id: '1.2',
                title: '图片上传',
                name: 'resource-upload',
                icon: 'md-images',
            }]
        }],
        tokenValid: true,
        whiteApiList: [],
        fetchedMenu: false,
    },
    mutations: {
        setMenulist(state, routes) {
            state.menuList = routes;
            state.fetchedMenu = true;
            const tmp = [];
            routes.forEach(element => {
                if (element.children && element.children.length > 0) {
                    element.children.forEach(second => {
                        if (second.children && second.children.length > 0) {
                            second.children.forEach(third => {
                                tmp.push({
                                    title: third.title,
                                    url: third.path,
                                    path: second.path
                                });
                            })
                        }
                    })
                }
            });
            state.whiteApiList= tmp;
        },
        logout (state, vm) {
            Cookies.remove('access_token');
            state.info = {};
            state.token = '';
            state.menuList = [];
            state.fetchedMenu = false;
            state.tokenValid = true;
        },
        setInfo (state, info) {
            state.info = info;
        },
        setToken (state, token) {
            state.token = token;
            console.log('set token');
         },
         setTokenValid (state, bool) {
             state.tokenValid = bool
         }
    },
};

export default user;
