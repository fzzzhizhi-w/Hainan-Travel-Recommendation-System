<template>
  <div class="admin-system-page">
    <!-- Role Management -->
    <div class="section-card">
      <div class="section-header">
        <h3 class="section-title">角色权限管理</h3>
        <button class="add-btn" @click="showAddRoleModal = true">+ 新增角色</button>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>角色名称</th>
            <th>可访问模块</th>
            <th>账号数量</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="role in roles" :key="role.id">
            <td class="role-name">{{ role.name }}</td>
            <td>
              <div class="perm-tags">
                <span v-for="p in role.permissions" :key="p" class="perm-tag">{{ p }}</span>
              </div>
            </td>
            <td>{{ role.accountCount }}</td>
            <td><span class="status-tag" :class="role.status">{{ role.status === 'active' ? '启用' : '禁用' }}</span></td>
            <td class="action-cell">
              <button class="action-btn edit-btn">编辑</button>
              <button v-if="!role.isSystem" class="action-btn delete-btn">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Admin Accounts -->
    <div class="section-card">
      <div class="section-header">
        <h3 class="section-title">运营人员账号</h3>
        <button class="add-btn" @click="showAddAccountModal = true">+ 新增账号</button>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>账号</th>
            <th>姓名</th>
            <th>角色</th>
            <th>最近登录</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="account in accounts" :key="account.id">
            <td class="mono">{{ account.username }}</td>
            <td>{{ account.name }}</td>
            <td><span class="role-tag">{{ account.role }}</span></td>
            <td class="time-cell">{{ account.lastLogin }}</td>
            <td><span class="status-tag" :class="account.status">{{ account.status === 'active' ? '正常' : '禁用' }}</span></td>
            <td class="action-cell">
              <button class="action-btn edit-btn">编辑</button>
              <button v-if="!account.isRoot" class="action-btn delete-btn" @click="disableAccount(account)">
                {{ account.status === 'active' ? '禁用' : '启用' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Operation Logs -->
    <div class="section-card">
      <div class="section-header">
        <h3 class="section-title">操作日志</h3>
        <input v-model="logSearch" class="log-search" placeholder="搜索操作..." type="text" />
      </div>
      <div class="log-list">
        <div v-for="log in filteredLogs" :key="log.id" class="log-item">
          <div class="log-left">
            <span class="log-operator">{{ log.operator }}</span>
            <span class="log-action">{{ log.action }}</span>
          </div>
          <span class="log-time">{{ log.time }}</span>
        </div>
        <div v-if="filteredLogs.length === 0" class="empty-state">暂无日志记录</div>
      </div>
    </div>

    <div v-if="toast" class="toast">{{ toast }}</div>
  </div>
</template>

<script>
export default {
  name: 'AdminSystem',
  data() {
    return {
      showAddRoleModal: false,
      showAddAccountModal: false,
      logSearch: '',
      toast: '',
      roles: [
        { id: 1, name: '超级管理员', permissions: ['全部模块'], accountCount: 1, status: 'active', isSystem: true },
        { id: 2, name: '内容运营', permissions: ['内容管理', '评价管理'], accountCount: 3, status: 'active', isSystem: false },
        { id: 3, name: '客服专员', permissions: ['订单管理', '用户管理'], accountCount: 5, status: 'active', isSystem: false },
        { id: 4, name: '数据分析', permissions: ['数据统计'], accountCount: 2, status: 'active', isSystem: false },
      ],
      accounts: [
        { id: 1, username: 'admin', name: '系统管理员', role: '超级管理员', lastLogin: '2024-03-20 15:30', status: 'active', isRoot: true },
        { id: 2, username: 'ops_zhang', name: '张运营', role: '内容运营', lastLogin: '2024-03-20 11:20', status: 'active', isRoot: false },
        { id: 3, username: 'cs_li', name: '李客服', role: '客服专员', lastLogin: '2024-03-19 16:45', status: 'active', isRoot: false },
        { id: 4, username: 'data_wang', name: '王分析', role: '数据分析', lastLogin: '2024-03-18 09:10', status: 'active', isRoot: false },
      ],
      logs: [
        { id: 1, operator: '张运营', action: '审核通过线路「陵水清水湾3日休闲游」', time: '2024-03-20 14:52' },
        { id: 2, operator: '李客服', action: '处理退款申请 HN20240316006', time: '2024-03-20 14:30' },
        { id: 3, operator: '张运营', action: '隐藏违规评价 ID:4（违规广告信息）', time: '2024-03-20 11:15' },
        { id: 4, operator: '系统管理员', action: '更新推荐规则配置：台风季户外限制已启用', time: '2024-03-20 10:00' },
        { id: 5, operator: '李客服', action: '取消订单 HN20240317005', time: '2024-03-19 16:50' },
        { id: 6, operator: '王分析', action: '导出本月订单数据报表', time: '2024-03-19 09:30' },
      ]
    }
  },
  computed: {
    filteredLogs() {
      if (!this.logSearch) return this.logs
      return this.logs.filter(l => l.action.includes(this.logSearch) || l.operator.includes(this.logSearch))
    }
  },
  methods: {
    disableAccount(account) {
      account.status = account.status === 'active' ? 'disabled' : 'active'
      this.toast = account.status === 'active' ? '账号已启用' : '账号已禁用'
      setTimeout(() => { this.toast = '' }, 2000)
    }
  }
}
</script>

<style scoped>
.admin-system-page { display: flex; flex-direction: column; gap: 20px; }
.section-card { background: var(--color-white); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 20px; }
.section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.section-title { font-size: 15px; color: var(--color-text); }
.add-btn { height: 34px; padding: 0 14px; background: var(--color-primary); color: white; border: none; border-radius: var(--radius-sm); font-size: 13px; }
.data-table { width: 100%; border-collapse: collapse; font-size: 14px; }
.data-table th { text-align: left; padding: 10px 14px; font-size: 12px; color: var(--color-text-light); font-weight: var(--font-weight-medium); border-bottom: 1px solid var(--color-border); background: var(--color-bg); }
.data-table td { padding: 12px 14px; border-bottom: 1px solid var(--color-border); }
.data-table tr:last-child td { border-bottom: none; }
.role-name { font-weight: var(--font-weight-medium); }
.perm-tags { display: flex; gap: 4px; flex-wrap: wrap; }
.perm-tag { padding: 2px 8px; background: #EBF4F8; color: var(--color-primary); border-radius: 20px; font-size: 11px; }
.role-tag { padding: 2px 8px; background: #F3F4F6; color: var(--color-text-light); border-radius: 20px; font-size: 12px; }
.status-tag { padding: 2px 8px; border-radius: 20px; font-size: 12px; }
.status-tag.active { background: #E8F8EF; color: #27AE60; }
.status-tag.disabled { background: #F3F4F6; color: var(--color-text-light); }
.mono { font-size: 12px; color: var(--color-text-light); }
.time-cell { font-size: 12px; color: var(--color-text-light); }
.action-cell { display: flex; gap: 6px; }
.action-btn { padding: 4px 10px; border-radius: var(--radius-sm); font-size: 12px; border: 1px solid; }
.edit-btn { border-color: var(--color-primary); color: var(--color-primary); background: white; }
.delete-btn { border-color: #E74C3C; color: #E74C3C; background: white; }
.log-search { height: 34px; border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 0 12px; font-size: 13px; width: 200px; }
.log-search:focus { outline: none; border-color: var(--color-primary); }
.log-list { display: flex; flex-direction: column; }
.log-item { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--color-border); gap: 16px; }
.log-item:last-child { border-bottom: none; }
.log-left { display: flex; align-items: center; gap: 10px; }
.log-operator { font-size: 13px; color: var(--color-primary); font-weight: var(--font-weight-medium); white-space: nowrap; }
.log-action { font-size: 13px; color: var(--color-text); }
.log-time { font-size: 12px; color: var(--color-text-light); white-space: nowrap; flex-shrink: 0; }
.empty-state { text-align: center; padding: 32px; color: var(--color-text-light); font-size: 14px; }
.toast { position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%); background: #27AE60; color: white; padding: 10px 24px; border-radius: var(--radius-md); font-size: 14px; z-index: 3000; }
</style>
