<template>
  <nav class="top-nav">
    <div class="nav-left">
      <button class="hamburger" @click="$emit('toggle-sidebar')" aria-label="toggle menu">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
      <span class="logo">🌴 海南旅行推荐</span>
    </div>
    <div class="nav-right">
      <div class="user-info" @click="showMenu = !showMenu" v-click-outside="() => showMenu = false">
        <div class="avatar">旅</div>
        <span class="user-name">旅行者</span>
        <svg class="caret" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        <div v-if="showMenu" class="user-dropdown">
          <router-link to="/profile" class="dropdown-item" @click="showMenu = false">
            <span class="dropdown-icon">👤</span> 个人中心
          </router-link>
          <router-link to="/orders" class="dropdown-item" @click="showMenu = false">
            <span class="dropdown-icon">📋</span> 我的订单
          </router-link>
          <div class="dropdown-divider"></div>
          <router-link to="/admin/dashboard" class="dropdown-item" @click="showMenu = false">
            <span class="dropdown-icon">🛡️</span> 管理员后台
          </router-link>
          <router-link to="/merchant/dashboard" class="dropdown-item" @click="showMenu = false">
            <span class="dropdown-icon">🏪</span> 商家后台
          </router-link>
          <div class="dropdown-divider"></div>
          <router-link to="/login" class="dropdown-item" @click="showMenu = false">
            <span class="dropdown-icon">🔑</span> 登录 / 切换账号
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'TopNav',
  emits: ['toggle-sidebar'],
  directives: {
    'click-outside': {
      mounted(el, binding) {
        el._clickOutsideHandler = (e) => {
          if (!el.contains(e.target)) binding.value(e)
        }
        document.addEventListener('click', el._clickOutsideHandler)
      },
      unmounted(el) {
        document.removeEventListener('click', el._clickOutsideHandler)
      }
    }
  },
  data() {
    return {
      showMenu: false,
    }
  },
}
</script>

<style scoped>
.top-nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 48px;
  background: var(--color-white);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  z-index: 1000;
}
.nav-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.hamburger {
  background: none;
  border: none;
  padding: 4px;
  color: var(--color-text);
  display: flex;
  align-items: center;
  border-radius: var(--radius-sm);
}
.hamburger:hover {
  background: var(--color-bg);
}
.logo {
  font-size: 16px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
}
.nav-right {
  display: flex;
  align-items: center;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  cursor: pointer;
  border-radius: var(--radius-sm);
  padding: 4px 8px;
}
.user-info:hover {
  background: var(--color-bg);
}
.caret {
  color: var(--color-text-light);
}
.user-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  min-width: 180px;
  z-index: 2000;
  overflow: hidden;
}
.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  font-size: 14px;
  color: var(--color-text);
  text-decoration: none;
  transition: background 0.15s;
}
.dropdown-item:hover {
  background: var(--color-bg);
  color: var(--color-primary);
}
.dropdown-icon {
  font-size: 16px;
}
.dropdown-divider {
  height: 1px;
  background: var(--color-border);
  margin: 4px 0;
}
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-primary);
  color: var(--color-white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: var(--font-weight-medium);
}
.user-name {
  font-size: 14px;
  color: var(--color-text);
}
</style>
