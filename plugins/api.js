import { Message } from 'iview';
import urlCompare from 'path-to-regexp'
import { getStore, setStore } from '~/libs/storage'
import qs from 'query-string'

const commonApi = [{
    url: '/api/v1/account/info'
}, {
    url: '/api/v1/permission/menu'
}]
export default function ({ $axios, store, route }) {
    const did = getStore('did')
    if (!did) { setStore('did', (new Date()).valueOf()) } $axios.defaults.headers.common['x-af-did'] = getStore('did');
    $axios.defaults.headers.common['x-af-lang'] = getStore('lang') || 'zh-cn';

    $axios.defaults.timeout = 15000;
    const getRequest = (url, params) => {
        return $axios.get(url, { ...params });
    };
    const postRequest = (url, params) => {
        return $axios.post(url, qs.stringify(params), {headers: { 'Content-Type': 'application/x-www-form-urlencoded' }});
    };

    const putRequest = (url, params) => {
        return $axios.put(url, { ...params });
    };

    const deleteRequest = (url, params) => {
        return $axios.delete(url, { ...params });
    };
    $axios.url = {
        codeUrl: 'https://pc.assetfort.com:8099/cmsserver/getAuthCodePic'
    }

    $axios.api = {
        code: () => {
            return getRequest('/cmsserver/getAuthCodePic', { responseType: 'arraybuffer' })
        },
        login: (params) => {
            return postRequest('/cmsserver/login', params)
        },
        userInfo: (params) => {
            return postRequest('/cmsserver/getUserInfo', params)
        },
        imageList: (params) => {
            return postRequest('/cmsserver/getImageList', params)
        },
        articleList: (params) => {
            return postRequest('/cmsserver/getArticleList', params)
        },
        deleteArticle: (params) => {
            return postRequest('/cmsserver/saveArticleInfo', params)
        },
        initCaptcha: (params) => {
            return getRequest('/api/v1/common/captcha/init', params)
        },
        sendSms: (phone, params) => {
            getRequest(`/common/captcha/sendSms/${phone}`, params)
        },
        smsLogin: (params) => {
            return postRequest('/api/v1/user/smsLogin', params)
        },
        userInfoEdit: (params) => {
            return postRequest('/api/v1/user/edit', params)
        },
        changePass: (params) => {
            return postRequest('/api/v1/user/modifyPass', params)
        },
        getUserListData: (params) => {
            return getRequest('/api/v1/permission/user/admin', params)
        },
        getAllUserData: (params) => {
            return getRequest('/api/v1/user/getAll', params)
        },
        addUser: (params) => {
            return postRequest('/api/v1/permission/user/admin', params)
        },
        editUser: (params) => {
            return putRequest('/api/v1/permission/user/admin', params)
        },
        userUpdatePassword: (params) => {
            return putRequest('/api/v1/user/password', params)
        },
        enableUser: (id, params) => {
            return putRequest(`/permission/user/admin/enable/${id}`, params)
        },
        disableUser: (id, params) => {
            return putRequest(`/permission/user/admin/disable/${id}`, params)
        },
        deleteUser: (ids, params) => {
            return deleteRequest(`/permission/user/admin/${ids}`)
        },
        initDepartment: (params) => {
            return getRequest('/api/v1/permission/department/by/parent/0', params)
        },
        loadDepartment: (id, params) => {
            return getRequest(`/permission/department/by/parent/${id}`, params)
        },
        addDepartment: (params) => {
            return postRequest('/api/v1/permission/department', params)
        },
        editDepartment: (params) => {
            return putRequest('/api/v1/permission/department', params)
        },
        deleteDepartment: (ids, params) => {
            return deleteRequest(`/department/delByIds/${ids}`, params)
        },
        searchDepartment: (params) => {
            return getRequest('/api/v1/department/search', params)
        },
        getAllRoleList: (params) => {
            return getRequest('/api/v1/permission/role/all', params)
        },
        getRoleList: (params) => {
            return getRequest('/api/v1/permission/role', params)
        },
        // 添加角色
        addRole: (params) => {
            return postRequest('/api/v1/permission/role', params)
        },
        // 编辑角色
        editRole: (params) => {
            return putRequest('/api/v1/permission/role', params)
        },
        // 设为或取消注册角色
        setDefaultRole: (params) => {
            return putRequest('/api/v1/permission/role/default', params)
        },
        // 分配角色权限
        editRolePerm: (params) => {
            return postRequest('/api/v1/permission/role/menu', params)
        },
        // 分配角色数据权限
        editRoleDep: (params) => {
            return postRequest('/api/v1/permission/role/department', params)
        },
        // 删除角色
        deleteRole: (ids) => {
            return deleteRequest(`/permission/role/${ids}`)
        },
        // 获取全部权限数据
        getAllPermissionList: (params) => {
            return getRequest('/api/v1/permission/menu/all', params)
        },
        // 
        getMenuList: (params) => {
            return getRequest('/api/v1/permission/menu', params)
        },
        // 添加权限
        addPermission: (params) => {
            return postRequest('/api/v1/permission/menu', params)
        },
        // 编辑权限
        editPermission: (params) => {
            return putRequest('/api/v1/permission/menu', params)
        },
        // 删除权限
        deletePermission: (ids) => {
            return deleteRequest(`/api/v1/permission/menu/${ids}`)
        },
        // 搜索权限
        searchPermission: (params) => {
            return getRequest('/api/v1/permission/menu/search', params)
        },
    }
}
