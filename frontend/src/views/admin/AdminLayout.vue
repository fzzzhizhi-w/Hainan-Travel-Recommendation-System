<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <div class="sidebar-brand">
        <span class="brand-icon">🌴</span>
        <span class="brand-text">运营管理后台</span>
      </div>
      <nav class="sidebar-nav">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: $route.path === item.path || $route.path.startsWith(item.path + '/') }"
        >
          <span class="nav-icon" v-html="item.icon"></span>
          <span class="nav-label">{{ item.label }}</span>
        </router-link>
      </nav>
      <div class="sidebar-footer">
        <router-link to="/" class="back-link">← 返回前台</router-link>
      </div>
    </aside>
    <div class="admin-main">
      <header class="admin-header">
        <div class="header-left">
          <h2 class="page-heading">{{ currentPageTitle }}</h2>
        </div>
        <div class="header-right">
          <span class="admin-user">管理员</span>
        </div>
      </header>
      <div class="admin-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminLayout',
  data() {
    return {
      navItems: [
        { path: '/admin/dashboard', label: '数据统计', icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>' },
        { path: '/admin/content', label: '内容管理', icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>' },
        { path: '/admin/orders', label: '订单管理', icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>' },
        { path: '/admin/users', label: '用户管理', icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
        { path: '/admin/reviews', label: '评价管理', icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' },
        { path: '/admin/config', label: '推荐规则', icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>' },
        { path: '/admin/system', label: '系统管理', icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>' },
      ]
    }
  },
  computed: {
    currentPageTitle() {
      const item = this.navItems.find(n => this.$route.path === n.path || this.$route.path.startsWith(n.path + '/'))
      return item ? item.label : '管理后台'
    }
  }
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: var(--color-bg);
}
.admin-sidebar {
  width: 220px;
  flex-shrink: 0;
  background: #1A2B3C;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
}
.sidebar-brand {
  padding: 20px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  gap: 10px;
}
.brand-icon {
  font-size: 20px;
}
.brand-text {
  font-size: 14px;
  color: #FFFFFF;
  font-weight: var(--font-weight-semibold);
}
.sidebar-nav {
  flex: 1;
  padding: 12px 0;
  overflow-y: auto;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  color: rgba(255,255,255,0.65);
  font-size: 14px;
  transition: all 0.2s;
}
.nav-item:hover {
  background: rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.9);
}
.nav-item.active {
  background: var(--color-primary);
  color: #FFFFFF;
}
.nav-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}
.sidebar-footer {
  padding: 16px;
  border-top: 1px solid rgba(255,255,255,0.1);
}
.back-link {
  font-size: 13px;
  color: rgba(255,255,255,0.5);
  transition: color 0.2s;
}
.back-link:hover {
  color: rgba(255,255,255,0.9);
}
.admin-main {
  flex: 1;
  margin-left: 220px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.admin-header {
  height: 56px;
  background: var(--color-white);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 50;
}
.page-heading {
  font-size: 16px;
  color: var(--color-text);
}
.admin-user {
  font-size: 14px;
  color: var(--color-text-light);
}
.admin-content {
  flex: 1;
  padding: 24px;
}
</style>
