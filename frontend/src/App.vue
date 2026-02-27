<template>
  <div class="app-root">
    <!-- Blank layout: login page and admin/merchant have their own layouts -->
    <router-view v-if="isBlankLayout" />

    <!-- Standard user layout -->
    <div v-else class="app-layout">
      <TopNav @toggle-sidebar="toggleSidebar" />
      <div class="app-body">
        <SideBar :collapsed="sidebarCollapsed" :mobile-open="sidebarOpen" @collapse="sidebarCollapsed = !sidebarCollapsed" @close="sidebarOpen = false" />
        <main class="main-content" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import TopNav from './components/TopNav.vue'
import SideBar from './components/SideBar.vue'

export default {
  name: 'App',
  components: { TopNav, SideBar },
  data() {
    return {
      sidebarCollapsed: false,
      sidebarOpen: false,
    }
  },
  computed: {
    isBlankLayout() {
      const layout = this.$route.meta && this.$route.meta.layout
      return layout === 'blank' || layout === 'admin' || layout === 'merchant'
    }
  },
  methods: {
    toggleSidebar() {
      if (window.innerWidth < 768) {
        this.sidebarOpen = !this.sidebarOpen
      } else {
        this.sidebarCollapsed = !this.sidebarCollapsed
      }
    }
  }
}
</script>

<style>
.app-root {
  height: 100%;
}
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.app-body {
  display: flex;
  flex: 1;
  overflow: hidden;
  margin-top: 48px;
}
.main-content {
  flex: 1;
  overflow-y: auto;
  margin-left: 240px;
  transition: margin-left 0.3s ease;
  background: var(--color-bg);
  min-height: calc(100vh - 48px);
}
.main-content.sidebar-collapsed {
  margin-left: 64px;
}
@media (max-width: 767px) {
  .main-content {
    margin-left: 0 !important;
  }
}
</style>
