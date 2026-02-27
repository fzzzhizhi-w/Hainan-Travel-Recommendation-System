<template>
  <div class="admin-dashboard">
    <!-- Stats Cards -->
    <div class="stats-grid">
      <div v-for="stat in stats" :key="stat.label" class="stat-card">
        <div class="stat-icon" :style="{ background: stat.bg }">
          <span v-html="stat.icon"></span>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-trend" :class="stat.trend > 0 ? 'up' : 'down'">
            {{ stat.trend > 0 ? '↑' : '↓' }} {{ Math.abs(stat.trend) }}% 较上{{ period === 'day' ? '日' : period === 'week' ? '周' : '月' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Period Selector -->
    <div class="section-header">
      <h3 class="section-title">数据趋势</h3>
      <div class="period-tabs">
        <button v-for="p in periods" :key="p.value" class="period-btn" :class="{ active: period === p.value }" @click="period = p.value">{{ p.label }}</button>
      </div>
    </div>

    <!-- Charts Placeholder -->
    <div class="charts-row">
      <div class="chart-card">
        <h4 class="chart-title">订单量趋势</h4>
        <div class="chart-area">
          <div class="bar-chart">
            <div v-for="(bar, i) in orderTrend" :key="i" class="bar-wrap">
              <div class="bar" :style="{ height: bar.pct + '%' }" :title="bar.value + '单'"></div>
              <div class="bar-label">{{ bar.label }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="chart-card">
        <h4 class="chart-title">线路预订排行</h4>
        <div class="rank-list">
          <div v-for="(item, i) in routeRank" :key="item.name" class="rank-item">
            <span class="rank-num" :class="{ top: i < 3 }">{{ i + 1 }}</span>
            <div class="rank-info">
              <span class="rank-name">{{ item.name }}</span>
              <div class="rank-bar-wrap">
                <div class="rank-bar" :style="{ width: item.pct + '%' }"></div>
              </div>
            </div>
            <span class="rank-val">{{ item.count }}单</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Orders -->
    <div class="section-card">
      <div class="section-header">
        <h3 class="section-title">最新订单</h3>
        <router-link to="/admin/orders" class="view-all">查看全部 →</router-link>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>订单号</th>
            <th>线路</th>
            <th>用户</th>
            <th>金额</th>
            <th>状态</th>
            <th>下单时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in recentOrders" :key="order.id">
            <td class="mono">{{ order.id }}</td>
            <td>{{ order.route }}</td>
            <td>{{ order.user }}</td>
            <td class="price-cell">¥{{ order.amount }}</td>
            <td><span class="status-tag" :class="order.status">{{ statusLabels[order.status] }}</span></td>
            <td class="time-cell">{{ order.time }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminDashboard',
  data() {
    return {
      period: 'week',
      periods: [
        { label: '今日', value: 'day' },
        { label: '本周', value: 'week' },
        { label: '本月', value: 'month' },
        { label: '本季', value: 'quarter' },
      ],
      stats: [
        { label: '用户访问量', value: '12,480', trend: 8.2, bg: '#EBF4F8', icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#4A8FA8" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></svg>' },
        { label: '订单总量', value: '1,032', trend: 12.5, bg: '#E8F8EF', icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#27AE60" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/></svg>' },
        { label: '成交金额', value: '¥3,282,400', trend: 9.8, bg: '#FEF0E7', icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#E8824A" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>' },
        { label: '用户评分均值', value: '4.7', trend: 0.3, bg: '#FEF9E7', icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#F5A623" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' },
      ],
      orderTrend: [
        { label: '周一', value: 128, pct: 58 },
        { label: '周二', value: 145, pct: 65 },
        { label: '周三', value: 112, pct: 50 },
        { label: '周四', value: 189, pct: 85 },
        { label: '周五', value: 220, pct: 100 },
        { label: '周六', value: 198, pct: 90 },
        { label: '周日', value: 176, pct: 80 },
      ],
      routeRank: [
        { name: '三亚5日精华游', count: 312, pct: 100 },
        { name: '万宁亲子5日游', count: 248, pct: 79 },
        { name: '五指山雨林7日行', count: 186, pct: 60 },
        { name: '全岛美食5日探店', count: 142, pct: 45 },
        { name: '海口人文3日游', count: 124, pct: 40 },
      ],
      statusLabels: {
        pending: '待支付', upcoming: '待出行', completed: '已完成', cancelled: '已取消'
      },
      recentOrders: [
        { id: 'HN20240320001', route: '三亚5日精华游', user: '张**', amount: '5960', status: 'upcoming', time: '2024-03-20 14:32' },
        { id: 'HN20240320002', route: '万宁亲子5日游', user: '李**', amount: '9840', status: 'pending', time: '2024-03-20 13:18' },
        { id: 'HN20240320003', route: '海口人文3日游', user: '王**', amount: '3160', status: 'completed', time: '2024-03-20 11:45' },
        { id: 'HN20240320004', route: '五指山雨林7日行', user: '陈**', amount: '14720', status: 'upcoming', time: '2024-03-20 10:20' },
        { id: 'HN20240320005', route: '全岛美食5日探店', user: '刘**', amount: '4360', status: 'cancelled', time: '2024-03-20 09:55' },
      ],
    }
  }
}
</script>

<style scoped>
.admin-dashboard {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.stat-card {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 20px;
  display: flex;
  gap: 16px;
  align-items: flex-start;
}
.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.stat-info {
  flex: 1;
}
.stat-value {
  font-size: 22px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  line-height: 1.2;
}
.stat-label {
  font-size: 13px;
  color: var(--color-text-light);
  margin: 4px 0;
}
.stat-trend {
  font-size: 12px;
}
.stat-trend.up { color: #27AE60; }
.stat-trend.down { color: #E74C3C; }
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.section-title {
  font-size: 15px;
  color: var(--color-text);
}
.period-tabs {
  display: flex;
  gap: 4px;
}
.period-btn {
  padding: 4px 12px;
  border: 1px solid var(--color-border);
  background: var(--color-white);
  border-radius: var(--radius-sm);
  font-size: 13px;
  color: var(--color-text-light);
}
.period-btn.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-white);
}
.charts-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.chart-card {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 20px;
}
.chart-title {
  font-size: 14px;
  color: var(--color-text);
  margin-bottom: 16px;
}
.chart-area {
  height: 160px;
  display: flex;
  align-items: flex-end;
}
.bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  width: 100%;
  height: 100%;
}
.bar-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  height: 100%;
  justify-content: flex-end;
}
.bar {
  width: 100%;
  background: var(--color-primary);
  border-radius: 2px 2px 0 0;
  min-height: 4px;
  transition: opacity 0.2s;
}
.bar:hover {
  opacity: 0.8;
}
.bar-label {
  font-size: 11px;
  color: var(--color-text-light);
  white-space: nowrap;
}
.rank-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.rank-item {
  display: flex;
  align-items: center;
  gap: 10px;
}
.rank-num {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #F3F4F6;
  color: var(--color-text-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  flex-shrink: 0;
}
.rank-num.top {
  background: var(--color-primary);
  color: var(--color-white);
}
.rank-info {
  flex: 1;
}
.rank-name {
  font-size: 13px;
  color: var(--color-text);
  display: block;
  margin-bottom: 4px;
}
.rank-bar-wrap {
  height: 4px;
  background: #F3F4F6;
  border-radius: 2px;
}
.rank-bar {
  height: 100%;
  background: var(--color-primary);
  border-radius: 2px;
}
.rank-val {
  font-size: 13px;
  color: var(--color-text-light);
  white-space: nowrap;
  flex-shrink: 0;
}
.section-card {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 20px;
}
.view-all {
  font-size: 13px;
  color: var(--color-primary);
}
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.data-table th {
  text-align: left;
  padding: 10px 12px;
  font-size: 12px;
  color: var(--color-text-light);
  font-weight: var(--font-weight-medium);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg);
}
.data-table td {
  padding: 12px;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
}
.data-table tr:last-child td {
  border-bottom: none;
}
.mono { font-size: 12px; color: var(--color-text-light); }
.price-cell { color: var(--color-accent); font-weight: var(--font-weight-medium); }
.time-cell { font-size: 12px; color: var(--color-text-light); }
.status-tag {
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 12px;
}
.status-tag.pending { background: #FEF0E7; color: var(--color-accent); }
.status-tag.upcoming { background: #EBF4F8; color: var(--color-primary); }
.status-tag.completed { background: #E8F8EF; color: #27AE60; }
.status-tag.cancelled { background: #F3F4F6; color: var(--color-text-light); }
@media (max-width: 1200px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .charts-row { grid-template-columns: 1fr; }
}
</style>
