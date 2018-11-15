<style lang="less" scoped>
    .ivu-shrinkable-menu{
    height: 100%;
    width: 100%;
}

.ivu-btn-text:hover {
    background-color: rgba(255,255,255,.2) !important;
}
</style>

<template>
    <div :style="{background: bgColor}" class="ivu-shrinkable-menu">
        <slot name="top"></slot>
        <sidebar-menu 
            v-show="!shrink"
            :menu-theme="theme" 
            :menu-list="menuList" 
            @on-change="handleChange"
        ></sidebar-menu>
        <sidebar-menu-shrink 
            v-show="shrink"
            :menu-theme="theme" 
            :menu-list="menuList" 
            :icon-color="shrinkIconColor"
            @on-change="handleChange"
        ></sidebar-menu-shrink>
    </div>
</template>

<script>
import sidebarMenu from './components/sidebarMenu.vue';
import sidebarMenuShrink from './components/sidebarMenuShrink.vue';
import util from '~/libs/util';
export default {
    name: 'shrinkableMenu',
    components: {
        sidebarMenu,
        sidebarMenuShrink
    },
    props: {
        shrink: {
            type: Boolean,
            default: false
        },
        menuList: {
            type: Array,
            required: true
        },
        theme: {
            type: String,
            default: 'dark',
            validator (val) {
                return util.oneOf(val, ['dark', 'light']);
            }
        },
    },
    computed: {
        bgColor () {
            return this.theme === 'dark' ? '#515a6e' : '#fff';
        },
        shrinkIconColor () {
            return this.theme === 'dark' ? '#fff' : '#515a6e';
        }
    },
    methods: {
        handleChange (name) {
            // 找到name对应的path
            let path = '/404';
            this.$store.state.app.menuList.forEach(menu => {
                if (menu.children.length) {
                    menu.children.forEach(item => {
                        if (item.name === name) {
                            path = item.path;
                            return;
                        }
                    })
                }
            })
            this.$router.push({ path });
        }
    }
};
</script>
