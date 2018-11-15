/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
    if (!name) return;
    if (typeof content !== 'string') {
        content = JSON.stringify(content);
    }
    if (typeof window !== 'undefined') {
        window.localStorage.setItem(name, content);
    }
}

/**
 * 获取localStorage
 */
export const getStore = name => {
    if (!name || typeof window === 'undefined') return;
    return window.localStorage.getItem(name);
}

/**
 * 删除localStorage
 */
export const removeStore = name => {
    if (!name) return;
    window.localStorage.removeItem(name);
}
