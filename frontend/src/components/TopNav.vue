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
      <div class="user-info">
        <div class="avatar">旅</div>
        <span class="user-name">旅行者</span>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'TopNav',
  emits: ['toggle-sidebar'],
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
