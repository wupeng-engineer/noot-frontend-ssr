<template>
    <Menu ref="sideMenu" accordion :active-name="this.$store.state.app.currentPageName" :open-names="openMenuParentName" :theme="menuTheme" width="auto" @on-select="changeMenu">
        <template v-for="item in menuList">
            <MenuItem v-if="item.children.length < 1" :name="item.children[0].name" :key="'menuitem' + item.name">
                <Icon :type="item.children[0].icon || item.icon" :size="iconSize" :key="'menuicon' + item.name"></Icon>
                <span class="layout-text" :key="'title' + item.name">{{ itemTitle(item.children[0]) }}</span>
            </MenuItem>

            <Submenu v-if="item.children.length >= 1" :name="item.name" :key="item.name">
                <template slot="title">
                    <Icon :type="item.icon" :size="iconSize"></Icon>
                    <span class="layout-text">{{ itemTitle(item) }}</span>
                </template>
                <template v-for="child in item.children">
                    <MenuItem :name="child.name" :key="'menuitem' + child.name">
                        <Icon :type="child.icon" :size="iconSize" :key="'icon' + child.name"></Icon>
                        <span class="layout-text" :key="'title' + child.name">{{ itemTitle(child) }}</span>
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
         let name = "sys";
         this.$store.state.app.menuList.forEach(menu => {
             if (menu.children.length) {
                 menu.children.forEach(item => {
                     if (item.path === this.$route.path) {
                         name = menu.name;
                     }
                 })
             }
         })
         return [name];
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
    // 监听路由变化
    $route(to, from) {
    }
  },
  mounted() {
  }
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
