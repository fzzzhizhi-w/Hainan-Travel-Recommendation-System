<template>
  <div class="admin-users-page">
    <div class="toolbar">
      <div class="toolbar-left">
        <input v-model="searchKeyword" class="search-input" placeholder="手机号 / 昵称..." type="text" />
        <select v-model="filterStatus" class="filter-select">
          <option value="">全部状态</option>
          <option value="normal">正常</option>
          <option value="restricted">受限</option>
        </select>
      </div>
      <span class="total-info">共 {{ filteredUsers.length }} 名用户</span>
    </div>

    <div class="table-card">
      <table class="data-table">
        <thead>
          <tr>
            <th>用户ID</th>
            <th>昵称</th>
            <th>手机号</th>
            <th>注册时间</th>
            <th>订单数</th>
            <th>状态</th>
            <th>最近活跃</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td class="mono">{{ user.id }}</td>
            <td>{{ user.nickname }}</td>
            <td class="mono">{{ user.phone }}</td>
            <td class="time-cell">{{ user.registeredAt }}</td>
            <td>{{ user.orderCount }}</td>
            <td><span class="status-tag" :class="user.status">{{ user.status === 'normal' ? '正常' : '受限' }}</span></td>
            <td class="time-cell">{{ user.lastActive }}</td>
            <td class="action-cell">
              <button class="action-btn view-btn" @click="viewUser(user)">查看</button>
              <button v-if="user.status === 'normal'" class="action-btn restrict-btn" @click="restrictUser(user)">限制</button>
              <button v-else class="action-btn restore-btn" @click="restoreUser(user)">恢复</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="filteredUsers.length === 0" class="empty-state">暂无相关用户</div>
    </div>

    <!-- User Detail Modal -->
    <div v-if="selectedUser" class="modal-overlay" @click.self="selectedUser = null">
      <div class="modal">
        <div class="modal-header">
          <h3>用户详情</h3>
          <button class="close-btn" @click="selectedUser = null">✕</button>
        </div>
        <div class="modal-body">
          <div class="user-profile">
            <div class="user-avatar">{{ selectedUser.nickname[0] }}</div>
            <div class="user-basic">
              <div class="user-name">{{ selectedUser.nickname }}</div>
              <div class="user-phone">{{ selectedUser.phone }}</div>
              <span class="status-tag" :class="selectedUser.status">{{ selectedUser.status === 'normal' ? '正常' : '受限' }}</span>
            </div>
          </div>
          <div class="user-stats">
            <div class="stat-item"><div class="stat-val">{{ selectedUser.orderCount }}</div><div class="stat-label">累计订单</div></div>
            <div class="stat-item"><div class="stat-val">{{ selectedUser.reviewCount }}</div><div class="stat-label">发布评价</div></div>
            <div class="stat-item"><div class="stat-val">¥{{ selectedUser.totalSpent.toLocaleString() }}</div><div class="stat-label">累计消费</div></div>
          </div>
          <div class="pref-tags">
            <span class="pref-label">偏好标签：</span>
            <span v-for="tag in selectedUser.prefTags" :key="tag" class="pref-tag">{{ tag }}</span>
          </div>
          <p class="privacy-note">🔒 仅展示业务必需信息，严格遵循《个人信息保护法》</p>
        </div>
        <div class="modal-footer">
          <button class="close-modal-btn" @click="selectedUser = null">关闭</button>
        </div>
      </div>
    </div>

    <div v-if="toast" class="toast">{{ toast }}</div>
  </div>
</template>

<script>
export default {
  name: 'AdminUsers',
  data() {
    return {
      searchKeyword: '',
      filterStatus: '',
      selectedUser: null,
      toast: '',
      users: [
        { id: 'U10001', nickname: '旅行达人张三', phone: '138****1234', registeredAt: '2023-06-15', orderCount: 8, reviewCount: 6, totalSpent: 28640, status: 'normal', lastActive: '2024-03-20', prefTags: ['海边度假', '美食探店'] },
        { id: 'U10002', nickname: '闯荡江湖李四', phone: '139****5678', registeredAt: '2023-08-22', orderCount: 3, reviewCount: 2, totalSpent: 9480, status: 'normal', lastActive: '2024-03-18', prefTags: ['雨林探险', '户外运动'] },
        { id: 'U10003', nickname: '亲子游王五', phone: '136****9012', registeredAt: '2023-11-03', orderCount: 5, reviewCount: 4, totalSpent: 21600, status: 'normal', lastActive: '2024-03-19', prefTags: ['亲子遛娃'] },
        { id: 'U10004', nickname: '异常用户', phone: '135****0000', registeredAt: '2024-01-10', orderCount: 0, reviewCount: 12, totalSpent: 0, status: 'restricted', lastActive: '2024-03-15', prefTags: [] },
      ]
    }
  },
  computed: {
    filteredUsers() {
      return this.users.filter(u => {
        if (this.searchKeyword && !u.phone.includes(this.searchKeyword) && !u.nickname.includes(this.searchKeyword)) return false
        if (this.filterStatus && u.status !== this.filterStatus) return false
        return true
      })
    }
  },
  methods: {
    viewUser(user) { this.selectedUser = user },
    restrictUser(user) {
      user.status = 'restricted'
      this.showToast('用户已被限制访问')
    },
    restoreUser(user) {
      user.status = 'normal'
      this.showToast('用户访问权限已恢复')
    },
    showToast(msg) {
      this.toast = msg
      setTimeout(() => { this.toast = '' }, 2000)
    }
  }
}
</script>

<style scoped>
.admin-users-page { display: flex; flex-direction: column; gap: 16px; }
.toolbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.toolbar-left { display: flex; gap: 10px; }
.search-input { height: 36px; border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 0 12px; font-size: 13px; width: 220px; }
.search-input:focus { outline: none; border-color: var(--color-primary); }
.filter-select { height: 36px; border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 0 10px; font-size: 13px; color: var(--color-text); }
.total-info { font-size: 13px; color: var(--color-text-light); }
.table-card { background: var(--color-white); border: 1px solid var(--color-border); border-radius: var(--radius-md); overflow: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 14px; }
.data-table th { text-align: left; padding: 10px 14px; font-size: 12px; color: var(--color-text-light); font-weight: var(--font-weight-medium); border-bottom: 1px solid var(--color-border); background: var(--color-bg); }
.data-table td { padding: 12px 14px; border-bottom: 1px solid var(--color-border); }
.data-table tr:last-child td { border-bottom: none; }
.mono { font-size: 12px; color: var(--color-text-light); }
.time-cell { font-size: 12px; color: var(--color-text-light); }
.status-tag { padding: 2px 8px; border-radius: 20px; font-size: 12px; }
.status-tag.normal { background: #E8F8EF; color: #27AE60; }
.status-tag.restricted { background: #FEF0E7; color: #E74C3C; }
.action-cell { display: flex; gap: 6px; }
.action-btn { padding: 4px 10px; border-radius: var(--radius-sm); font-size: 12px; border: 1px solid; }
.view-btn { border-color: var(--color-primary); color: var(--color-primary); background: var(--color-white); }
.restrict-btn { border-color: #E74C3C; color: #E74C3C; background: var(--color-white); }
.restore-btn { border-color: #27AE60; color: #27AE60; background: var(--color-white); }
.empty-state { text-align: center; padding: 40px; color: var(--color-text-light); font-size: 14px; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px; }
.modal { background: var(--color-white); border-radius: var(--radius-lg); width: 480px; max-width: 100%; }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--color-border); }
.modal-header h3 { font-size: 15px; }
.close-btn { background: none; border: none; font-size: 16px; color: var(--color-text-light); cursor: pointer; }
.modal-body { padding: 20px; display: flex; flex-direction: column; gap: 16px; }
.user-profile { display: flex; align-items: center; gap: 16px; }
.user-avatar { width: 56px; height: 56px; border-radius: 50%; background: var(--color-primary); color: white; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: var(--font-weight-semibold); flex-shrink: 0; }
.user-name { font-size: 16px; font-weight: var(--font-weight-semibold); margin-bottom: 2px; }
.user-phone { font-size: 13px; color: var(--color-text-light); margin-bottom: 6px; }
.user-stats { display: flex; gap: 0; border: 1px solid var(--color-border); border-radius: var(--radius-md); overflow: hidden; }
.stat-item { flex: 1; text-align: center; padding: 12px; border-right: 1px solid var(--color-border); }
.stat-item:last-child { border-right: none; }
.stat-val { font-size: 18px; font-weight: var(--font-weight-semibold); color: var(--color-text); }
.stat-label { font-size: 12px; color: var(--color-text-light); margin-top: 2px; }
.pref-tags { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.pref-label { font-size: 13px; color: var(--color-text-light); }
.pref-tag { padding: 2px 10px; background: #EBF4F8; color: var(--color-primary); border-radius: 20px; font-size: 12px; }
.privacy-note { font-size: 12px; color: var(--color-text-light); }
.modal-footer { display: flex; justify-content: flex-end; padding: 16px 20px; border-top: 1px solid var(--color-border); }
.close-modal-btn { padding: 8px 20px; border: 1px solid var(--color-border); background: var(--color-white); border-radius: var(--radius-sm); font-size: 14px; color: var(--color-text-light); }
.toast { position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%); background: #27AE60; color: white; padding: 10px 24px; border-radius: var(--radius-md); font-size: 14px; z-index: 3000; }
</style>
