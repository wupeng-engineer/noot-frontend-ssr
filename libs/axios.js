import axios from 'axios';
import { getStore, setStore } from './storage';
import { Message } from 'iview';
import Cookies from 'js-cookie';
let base = 'http://localhost:7001/api/v1';
// 超时设定
axios.defaults.timeout = 15000;

axios.interceptors.request.use(config => {
    return config;
}, err => {
    Message.error('请求超时');
    return Promise.resolve(err);
});

// http response 拦截器
axios.interceptors.response.use(response => {
    if (!response) return;
    const data = response.data;

    // 根据返回的code值来做不同的处理(和后端约定)
    switch (data.code) {
        case 401:
            if (typeof window === 'undefined') return;
            // 未登录 清除已登录状态
            Cookies.remove('access_token');
            router.push('/login');
            break;
        case 403:
            if (typeof window === 'undefined') return;
            // 没有权限
            if (data.message !== null) {
                Message.error(data.message);
            } else {
                Message.error("未知错误");
            }
            break;
        case 500:
            // 错误
            if (typeof window === 'undefined') return;
            if (data.message !== null) {
                Message.error(data.message);
            } else {
                Message.error("未知错误");
            }
            break;
        default:
            return data;
    }

    return data;
}, (err) => {
    if (typeof window === 'undefined') return Promise.resolve(err);
    // 返回状态码不为200时候的错误处理
    Message.error(err.toString());
    return Promise.resolve(err);
});

