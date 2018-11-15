export default function ({ $axios, store }) {
    const getRequest = (url, params) => {
        const token = store.state.token;
        $axios.defaults.headers.get['Content-Type'] = 'application/json';
        $axios.defaults.headers.get['Authorization'] = `Bearer ${token}`;
        return $axios.get(url, { params: { ...params }});
    };

    const postRequest = (url, params) => {
        const token = store.state.token;
        $axios.defaults.headers.post['Content-Type'] = 'application/json';
        $axios.defaults.headers.post['Authorization'] = `Bearer ${token}`;
        return $axios.post(url, { ...params });
    };

    const putRequest = (url, params) => {
        const token = store.state.token;
        $axios.defaults.headers.put['Content-Type'] = 'application/json';
        $axios.defaults.headers.put['Authorization'] = `Bearer ${token}`;
        return $axios.put(url, { ...params });
    };

    const deleteRequest = (url, params) => {
        const token = store.state.token;
        $axios.defaults.headers.delete['Content-Type'] = 'application/json';
        $axios.defaults.headers.delete['Authorization'] = `Bearer ${token}`;
        return $axios.delete(url, { ...params });
    };

    $axios.api = {
        login: (params) => {
            return postRequest('/passport/token/by/code', params)
        },
        userInfo: (params) => {
            return getRequest('/account/info', params)
        },
        regist: (params) => {
            return postRequest('/account/register', params)
        },
        initCaptcha: (params) => {
            return getRequest('/common/captcha/init', params)
        },
        sendSms: (phone, params) => {
            getRequest(`/common/captcha/sendSms/${phone}`, params)
        },
        smsLogin: (params) => {
            return postRequest('/user/smsLogin', params)
        },
        userInfoEdit: (params) => {
            return postRequest('/user/edit', params)
        },
        changePass: (params) => {
            return postRequest('/user/modifyPass', params)
        },
        getUserListData: (params) => {
            return getRequest('/permission/user/admin', params)
        },
        getAllUserData: (params) => {
            return getRequest('/user/getAll', params)
        },
        addUser: (params) => {
            return postRequest('/permission/user/admin', params)
        },
        editUser: (params) => {
            return putRequest('/permission/user/admin', params)
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
            return getRequest('/permission/department/by/parent/0', params)
        },
        loadDepartment: (id, params) => {
            return getRequest(`/permission/department/by/parent/${id}`, params)
        },
        addDepartment: (params) => {
            return postRequest('/permission/department', params)
        },
        editDepartment: (params) => {
            return putRequest('/permission/department', params)
        },
        deleteDepartment: (ids, params) => {
            return deleteRequest(`/department/delByIds/${ids}`, params)
        },
        searchDepartment: (params) => {
            return getRequest('/department/search', params)
        },
        getAllRoleList: (params) => {
            return getRequest('/permission/role/all', params)
        },
        getRoleList: (params) => {
            return getRequest('/permission/role', params)
        },
        // 添加角色
        addRole: (params) => {
            return postRequest('/permission/role', params)
        },
        // 编辑角色
        editRole: (params) => {
            return putRequest('/permission/role', params)
        },
        // 设为或取消注册角色
        setDefaultRole: (params) => {
            return putRequest('/permission/role/default', params)
        },
        // 分配角色权限
        editRolePerm: (params) => {
            return postRequest('/permission/role/menu', params)
        },
        // 分配角色数据权限
        editRoleDep: (params) => {
            return postRequest('/permission/role/department', params)
        },
        // 删除角色
        deleteRole: (ids) => {
            return deleteRequest(`/permission/role/${ids}`)
        },
        // 获取全部权限数据
        getAllPermissionList: (params) => {
            return getRequest('/permission/menu/all', params)
        },
        // 
        getMenuList: (params) => {
            return getRequest('/permission/menu', params)
        },
        // 添加权限
        addPermission: (params) => {
            return postRequest('/permission/menu', params)
        },
        // 编辑权限
        editPermission: (params) => {
            return putRequest('/permission/menu', params)
        },
        // 删除权限
        deletePermission: (ids) => {
            return deleteRequest(`/permission/menu/${ids}`)
        },
        // 搜索权限
        searchPermission: (params) => {
            return getRequest('/permission/menu/search', params)
        },
    }
}
