<template>
  <div class="merchant-layout">
    <aside class="merchant-sidebar">
      <div class="sidebar-brand">
        <span class="brand-icon">🏪</span>
        <span class="brand-text">商户管理中心</span>
      </div>
      <nav class="sidebar-nav">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: $route.path === item.path }"
        >
          <span class="nav-icon" v-html="item.icon"></span>
          <span class="nav-label">{{ item.label }}</span>
        </router-link>
      </nav>
      <div class="sidebar-footer">
        <div class="merchant-info">
          <div class="merchant-name">{{ merchantName }}</div>
          <div class="merchant-type">{{ merchantType }}</div>
        </div>
        <router-link to="/" class="back-link">← 返回前台</router-link>
      </div>
    </aside>
    <div class="merchant-main">
      <header class="merchant-header">
        <h2 class="page-heading">{{ currentPageTitle }}</h2>
        <div class="header-right">
          <span class="verified-badge">✓ 已认证商户</span>
        </div>
      </header>
      <div class="merchant-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MerchantLayout',
  data() {
    return {
      merchantName: '三亚海景旅游服务有限公司',
      merchantType: '综合旅游服务商',
      navItems: [
        { path: '/merchant/dashboard', label: '商户概览', icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>' },
        { path: '/merchant/inventory', label: '库存管理', icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>' },
        { path: '/merchant/orders', label: '订单管理', icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>' },
        { path: '/merchant/checkout', label: '核销管理', icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>' },
        { path: '/merchant/settlement', label: '结算对账', icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>' },
        { path: '/merchant/reviews', label: '评价查看', icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' },
      ]
    }
  },
  computed: {
    currentPageTitle() {
      const item = this.navItems.find(n => this.$route.path === n.path)
      return item ? item.label : '商户管理'
    }
  }
}
</script>

<style scoped>
.merchant-layout {
  display: flex;
  min-height: 100vh;
  background: var(--color-bg);
}
.merchant-sidebar {
  width: 220px;
  flex-shrink: 0;
  background: #2C3E50;
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
.brand-icon { font-size: 20px; }
.brand-text { font-size: 14px; color: #FFFFFF; font-weight: var(--font-weight-semibold); }
.sidebar-nav { flex: 1; padding: 12px 0; overflow-y: auto; }
.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  color: rgba(255,255,255,0.65);
  font-size: 14px;
  transition: all 0.2s;
}
.nav-item:hover { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.9); }
.nav-item.active { background: var(--color-accent); color: #FFFFFF; }
.nav-icon { flex-shrink: 0; display: flex; align-items: center; }
.sidebar-footer {
  padding: 16px;
  border-top: 1px solid rgba(255,255,255,0.1);
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.merchant-info { }
.merchant-name { font-size: 12px; color: rgba(255,255,255,0.8); line-height: 1.4; }
.merchant-type { font-size: 11px; color: rgba(255,255,255,0.4); }
.back-link { font-size: 12px; color: rgba(255,255,255,0.4); transition: color 0.2s; }
.back-link:hover { color: rgba(255,255,255,0.8); }
.merchant-main { flex: 1; margin-left: 220px; display: flex; flex-direction: column; min-height: 100vh; }
.merchant-header {
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
.page-heading { font-size: 16px; color: var(--color-text); }
.verified-badge { font-size: 13px; color: #27AE60; }
.merchant-content { flex: 1; padding: 24px; }
</style>
