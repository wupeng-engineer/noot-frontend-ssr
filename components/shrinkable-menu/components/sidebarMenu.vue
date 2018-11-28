<template>
    <Menu ref="sideMenu" accordion :active-name="this.$store.state.app.currentPageName" :open-names="openMenuParentName" :theme="menuTheme" width="auto" @on-select="changeMenu">
        <template v-for="item in menuList">
            <MenuItem v-if="item.children.length < 1" :name="item.children[0].path" :key="'menuitem' + item.name">
                <Icon :type="item.children[0].icon || item.icon" :size="iconSize" :key="'menuicon' + item.name"></Icon>
                <span class="layout-text" :key="'title' + item.path">{{ itemTitle(item.children[0]) }}</span>
            </MenuItem>

            <Submenu v-if="item.children.length >= 1" :name="item.path" :key="item.path">
                <template slot="title">
                    <Icon :type="item.icon" :size="iconSize"></Icon>
                    <span class="layout-text">{{ itemTitle(item) }}</span>
                </template>
                <template v-for="child in item.children">
                    <MenuItem :name="child.path" :key="'menuitem' + child.path">
                        <Icon :type="child.icon" :size="iconSize" :key="'icon' + child.path"></Icon>
                        <span class="layout-text" :key="'title' + child.path">{{ itemTitle(child) }}</span>
                    </MenuItem>
                </template>
            </Submenu>
        </template>
    </Menu>
</template>

<script>
export default {
  name: "sidebarMenu",
  props: {
    menuList: Array,
    iconSize: Number,
    menuTheme: {
      type: String,
      default: "dark"
    },
  },
  computed: {
     openMenuParentName: function() {
         let path = "resource";
         this.$store.state.user.menuList.forEach(menu => {
             if (menu.children.length) {
                 menu.children.forEach(item => {
                     if (item.path === this.$route.path) {
                         path = menu.path;
                     }
                 })
             }
         })
         return [path];
     }
  },
  methods: {
    changeMenu(active) {
      this.$emit("on-change", active);
    },
    itemTitle(item) {
      if (typeof item.title === "object") {
        return 'text';
      } else {
        return item.title;
      }
    },
    getOpenedNamesByActiveName(name) {
      return this.$route.matched
        .map(item => item.name)
        .filter(item => item !== name);
    }
  },
  updated() {
    this.$nextTick(() => {
      if (this.$refs.sideMenu) {
        this.$refs.sideMenu.updateOpened();
      }
    });
  },
  watch: {
    $route(to, from) {
        this.$emit("on-change", to.path);
    }
  },
};
</script>

<style lang="less" scoped>
.ivu-shrinkable-menu{
    height: 100%;
    width: 100%;
}

.ivu-btn-text:hover {
    background-color: rgba(255,255,255,.2) !important;
}
</style>
