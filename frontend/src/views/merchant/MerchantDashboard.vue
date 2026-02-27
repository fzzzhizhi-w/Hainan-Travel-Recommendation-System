<template>
  <div class="merchant-dashboard">
    <!-- Stats -->
    <div class="stats-grid">
      <div v-for="stat in stats" :key="stat.label" class="stat-card">
        <div class="stat-val">{{ stat.value }}</div>
        <div class="stat-label">{{ stat.label }}</div>
        <div class="stat-trend" :class="stat.trend >= 0 ? 'up' : 'down'">
          {{ stat.trend >= 0 ? '↑' : '↓' }} {{ Math.abs(stat.trend) }}% 较上月
        </div>
      </div>
    </div>

    <!-- Today's Orders -->
    <div class="section-card">
      <div class="section-header">
        <h3 class="section-title">今日待处理订单</h3>
        <router-link to="/merchant/orders" class="view-all">查看全部 →</router-link>
      </div>
      <div v-if="todayOrders.length === 0" class="empty-state">今日暂无待处理订单</div>
      <div v-else class="order-list">
        <div v-for="order in todayOrders" :key="order.id" class="order-item">
          <div class="order-info">
            <span class="order-id">{{ order.id }}</span>
            <span class="order-product">{{ order.product }}</span>
            <span class="order-time">{{ order.tripDate }} · {{ order.count }}人</span>
          </div>
          <div class="order-right">
            <span class="order-price">¥{{ order.amount }}</span>
            <span class="order-status" :class="order.status">{{ statusLabels[order.status] }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Low Stock Warning -->
    <div class="section-card">
      <h3 class="section-title" style="margin-bottom: 16px">库存预警</h3>
      <div v-if="lowStockItems.length === 0" class="empty-state">当前无库存预警</div>
      <div v-else class="stock-list">
        <div v-for="item in lowStockItems" :key="item.id" class="stock-item">
          <div class="stock-info">
            <span class="stock-name">{{ item.name }}</span>
            <span class="stock-date">{{ item.date }}</span>
          </div>
          <div class="stock-right">
            <div class="stock-bar-wrap">
              <div class="stock-bar" :class="item.pct < 20 ? 'danger' : 'warning'" :style="{ width: item.pct + '%' }"></div>
            </div>
            <span class="stock-text" :class="item.pct < 20 ? 'danger-text' : ''">剩余 {{ item.remaining }}/{{ item.total }}</span>
            <router-link to="/merchant/inventory" class="stock-action">补充</router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Reviews -->
    <div class="section-card">
      <div class="section-header">
        <h3 class="section-title">最新用户评价</h3>
        <router-link to="/merchant/reviews" class="view-all">查看全部 →</router-link>
      </div>
      <div class="review-list">
        <div v-for="review in recentReviews" :key="review.id" class="review-item">
          <div class="review-top">
            <span class="review-user">{{ review.user }}</span>
            <span class="review-product">{{ review.product }}</span>
            <div class="star-row">
              <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= review.rating }">★</span>
            </div>
          </div>
          <p class="review-text">{{ review.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MerchantDashboard',
  data() {
    return {
      stats: [
        { label: '本月订单数', value: '186', trend: 12 },
        { label: '本月核销数', value: '148', trend: 8 },
        { label: '本月营收', value: '¥554,280', trend: 15 },
        { label: '用户评分均值', value: '4.8', trend: 0.2 },
      ],
      statusLabels: { pending: '待确认', confirmed: '已确认', checkout: '待核销' },
      todayOrders: [
        { id: 'HN20240320001', product: '三亚5日精华游（2人）', tripDate: '2024-04-15', count: 2, amount: '5960', status: 'checkout' },
        { id: 'HN20240320004', product: '五指山雨林7日行（4人）', tripDate: '2024-04-20', count: 4, amount: '14720', status: 'confirmed' },
      ],
      lowStockItems: [
        { id: 1, name: '三亚5日精华游 · 4月20日', date: '2024-04-20', remaining: 3, total: 20, pct: 15 },
        { id: 2, name: '蜈支洲岛一日游 · 4月18日', date: '2024-04-18', remaining: 8, total: 30, pct: 27 },
      ],
      recentReviews: [
        { id: 1, user: '刘**', product: '三亚5日精华游', rating: 5, content: '行程安排非常合理，导游专业热情，海水超级清澈，下次还会来！' },
        { id: 2, user: '陈**', product: '五指山雨林7日行', rating: 4, content: '雨林体验很震撼，黎族文化体验也很有特色，行程节奏适中。' },
      ]
    }
  }
}
</script>

<style scoped>
.merchant-dashboard { display: flex; flex-direction: column; gap: 20px; }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.stat-card { background: var(--color-white); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 20px; }
.stat-val { font-size: 24px; font-weight: var(--font-weight-semibold); color: var(--color-text); }
.stat-label { font-size: 13px; color: var(--color-text-light); margin: 4px 0; }
.stat-trend { font-size: 12px; }
.stat-trend.up { color: #27AE60; }
.stat-trend.down { color: #E74C3C; }
.section-card { background: var(--color-white); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 20px; }
.section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.section-title { font-size: 15px; color: var(--color-text); }
.view-all { font-size: 13px; color: var(--color-primary); }
.empty-state { text-align: center; padding: 24px; color: var(--color-text-light); font-size: 14px; }
.order-list { display: flex; flex-direction: column; gap: 0; }
.order-item { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--color-border); }
.order-item:last-child { border-bottom: none; }
.order-info { display: flex; flex-direction: column; gap: 3px; }
.order-id { font-size: 11px; color: var(--color-text-light); }
.order-product { font-size: 14px; color: var(--color-text); }
.order-time { font-size: 12px; color: var(--color-text-light); }
.order-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
.order-price { font-size: 15px; color: var(--color-accent); font-weight: var(--font-weight-semibold); }
.order-status { padding: 2px 8px; border-radius: 20px; font-size: 12px; }
.order-status.pending { background: #FEF0E7; color: var(--color-accent); }
.order-status.confirmed { background: #EBF4F8; color: var(--color-primary); }
.order-status.checkout { background: #E8F8EF; color: #27AE60; }
.stock-list { display: flex; flex-direction: column; gap: 12px; }
.stock-item { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.stock-info { flex: 0 0 200px; }
.stock-name { font-size: 14px; color: var(--color-text); display: block; }
.stock-date { font-size: 12px; color: var(--color-text-light); }
.stock-right { display: flex; align-items: center; gap: 10px; flex: 1; }
.stock-bar-wrap { flex: 1; height: 6px; background: #F3F4F6; border-radius: 3px; }
.stock-bar { height: 100%; border-radius: 3px; }
.stock-bar.warning { background: #F5A623; }
.stock-bar.danger { background: #E74C3C; }
.stock-text { font-size: 12px; color: var(--color-text-light); white-space: nowrap; }
.danger-text { color: #E74C3C; }
.stock-action { font-size: 12px; color: var(--color-primary); white-space: nowrap; }
.review-list { display: flex; flex-direction: column; gap: 0; }
.review-item { padding: 12px 0; border-bottom: 1px solid var(--color-border); }
.review-item:last-child { border-bottom: none; }
.review-top { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
.review-user { font-size: 13px; font-weight: var(--font-weight-medium); color: var(--color-text); }
.review-product { font-size: 12px; color: var(--color-text-light); }
.star-row { display: flex; gap: 2px; }
.star { color: var(--color-border); font-size: 13px; }
.star.filled { color: #F5A623; }
.review-text { font-size: 13px; color: var(--color-text-light); line-height: 1.5; }
@media (max-width: 1100px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
</style>
