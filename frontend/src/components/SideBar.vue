<template>
  <aside class="sidebar" :class="{ collapsed, 'mobile-open': mobileOpen }">
    <div class="overlay" @click="$emit('close')"></div>
    <div class="sidebar-inner">
      <nav class="sidebar-nav">
        <router-link v-for="item in navItems" :key="item.path" :to="item.path" class="nav-item" :class="{ active: $route.path === item.path }" @click="$emit('close')">
          <span class="nav-icon" v-html="item.icon"></span>
          <span class="nav-label" v-if="!collapsed">{{ item.label }}</span>
        </router-link>
      </nav>
      <button class="collapse-btn" @click="$emit('collapse')">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline v-if="!collapsed" points="15 18 9 12 15 6"/>
          <polyline v-else points="9 18 15 12 9 6"/>
        </svg>
        <span v-if="!collapsed">收起菜单</span>
      </button>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'SideBar',
  emits: ['collapse', 'close'],
  props: {
    collapsed: Boolean,
    mobileOpen: Boolean,
  },
  data() {
    return {
      navItems: [
        {
          path: '/',
          label: '首页',
          icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>'
        },
        {
          path: '/attractions',
          label: '景点查询',
          icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>'
        },
        {
          path: '/routes',
          label: '线路推荐',
          icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/></svg>'
        },
        {
          path: '/orders',
          label: '我的订单',
          icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>'
        },
        {
          path: '/profile',
          label: '个人中心',
          icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
        },
        {
          path: '/reviews',
          label: '评价管理',
          icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'
        },
      ]
    }
  }
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 48px;
  left: 0;
  bottom: 0;
  width: 240px;
  z-index: 900;
  transition: width 0.3s ease;
}
.sidebar.collapsed {
  width: 64px;
}
.overlay {
  display: none;
}
.sidebar-inner {
  width: 100%;
  height: 100%;
  background: var(--color-white);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.sidebar-nav {
  flex: 1;
  padding: 12px 0;
  overflow-y: auto;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 20px;
  color: var(--color-text);
  font-size: 14px;
  font-weight: var(--font-weight-normal);
  white-space: nowrap;
  overflow: hidden;
  transition: background 0.2s, color 0.2s;
}
.nav-item:hover {
  background: var(--color-bg);
  color: var(--color-primary);
}
.nav-item.active {
  background: #EBF4F8;
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
}
.nav-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}
.nav-label {
  flex: 1;
}
.collapse-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: none;
  border: none;
  border-top: 1px solid var(--color-border);
  color: var(--color-text-light);
  font-size: 13px;
  white-space: nowrap;
  width: 100%;
}
.collapse-btn:hover {
  color: var(--color-primary);
}
@media (max-width: 767px) {
  .sidebar {
    width: 240px !important;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  .sidebar.mobile-open {
    transform: translateX(0);
  }
  .sidebar.mobile-open .overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.4);
    z-index: -1;
  }
}
</style>
