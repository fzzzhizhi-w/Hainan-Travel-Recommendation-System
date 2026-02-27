<template>
  <div class="admin-orders-page">
    <!-- Toolbar -->
    <div class="toolbar">
      <div class="toolbar-left">
        <input v-model="searchKeyword" class="search-input" placeholder="订单号 / 线路名称..." type="text" />
        <select v-model="filterStatus" class="filter-select">
          <option value="">全部状态</option>
          <option value="pending">待支付</option>
          <option value="upcoming">待出行</option>
          <option value="completed">已完成</option>
          <option value="cancelled">已取消</option>
        </select>
        <input v-model="filterDate" class="filter-date" type="date" />
      </div>
      <div class="toolbar-right">
        <span class="total-info">共 {{ filteredOrders.length }} 条订单 · 总金额 ¥{{ totalAmount.toLocaleString() }}</span>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="table-card">
      <table class="data-table">
        <thead>
          <tr>
            <th>订单号</th>
            <th>线路</th>
            <th>用户</th>
            <th>出行日期</th>
            <th>人数</th>
            <th>金额</th>
            <th>状态</th>
            <th>下单时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredOrders" :key="order.id" :class="{ 'alert-row': order.hasAlert }">
            <td class="mono">
              {{ order.id }}
              <span v-if="order.hasAlert" class="alert-badge">!</span>
            </td>
            <td>{{ order.route }}</td>
            <td>{{ order.user }}</td>
            <td>{{ order.tripDate }}</td>
            <td>{{ order.count }}人</td>
            <td class="price-cell">¥{{ order.amount.toLocaleString() }}</td>
            <td><span class="status-tag" :class="order.status">{{ statusLabels[order.status] }}</span></td>
            <td class="time-cell">{{ order.createdAt }}</td>
            <td class="action-cell">
              <button class="action-btn view-btn" @click="viewOrder(order)">详情</button>
              <button v-if="order.status === 'upcoming' || order.status === 'pending'" class="action-btn cancel-btn" @click="cancelOrder(order)">取消</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="filteredOrders.length === 0" class="empty-state">暂无符合条件的订单</div>
    </div>

    <!-- Order Detail Modal -->
    <div v-if="selectedOrder" class="modal-overlay" @click.self="selectedOrder = null">
      <div class="modal">
        <div class="modal-header">
          <h3>订单详情</h3>
          <button class="close-btn" @click="selectedOrder = null">✕</button>
        </div>
        <div class="modal-body">
          <div class="detail-grid">
            <div class="detail-row"><span class="detail-label">订单号</span><span class="detail-val mono">{{ selectedOrder.id }}</span></div>
            <div class="detail-row"><span class="detail-label">线路名称</span><span class="detail-val">{{ selectedOrder.route }}</span></div>
            <div class="detail-row"><span class="detail-label">用户手机</span><span class="detail-val">{{ selectedOrder.phone }}</span></div>
            <div class="detail-row"><span class="detail-label">出行日期</span><span class="detail-val">{{ selectedOrder.tripDate }}</span></div>
            <div class="detail-row"><span class="detail-label">出行人数</span><span class="detail-val">{{ selectedOrder.count }} 人</span></div>
            <div class="detail-row"><span class="detail-label">订单金额</span><span class="detail-val price-val">¥{{ selectedOrder.amount.toLocaleString() }}</span></div>
            <div class="detail-row"><span class="detail-label">支付方式</span><span class="detail-val">{{ selectedOrder.payMethod }}</span></div>
            <div class="detail-row"><span class="detail-label">订单状态</span><span class="status-tag" :class="selectedOrder.status">{{ statusLabels[selectedOrder.status] }}</span></div>
            <div class="detail-row"><span class="detail-label">下单时间</span><span class="detail-val">{{ selectedOrder.createdAt }}</span></div>
          </div>
          <div v-if="selectedOrder.hasAlert" class="alert-block">
            <strong>⚠ 异常标记：</strong>{{ selectedOrder.alertMsg }}
          </div>
        </div>
        <div class="modal-footer">
          <button v-if="selectedOrder.status === 'upcoming'" class="refund-btn" @click="processRefund(selectedOrder)">处理改期/退款</button>
          <button class="close-modal-btn" @click="selectedOrder = null">关闭</button>
        </div>
      </div>
    </div>

    <div v-if="toast" class="toast">{{ toast }}</div>
  </div>
</template>

<script>
export default {
  name: 'AdminOrders',
  data() {
    return {
      searchKeyword: '',
      filterStatus: '',
      filterDate: '',
      selectedOrder: null,
      toast: '',
      statusLabels: { pending: '待支付', upcoming: '待出行', completed: '已完成', cancelled: '已取消' },
      orders: [
        { id: 'HN20240320001', route: '三亚5日精华游', user: '张**', phone: '138****1234', tripDate: '2024-04-15', count: 2, amount: 5960, payMethod: '微信支付', status: 'upcoming', createdAt: '2024-03-20 14:32', hasAlert: false },
        { id: 'HN20240320002', route: '万宁亲子5日游', user: '李**', phone: '139****5678', tripDate: '2024-05-01', count: 3, amount: 9840, payMethod: '支付宝', status: 'pending', createdAt: '2024-03-20 13:18', hasAlert: false },
        { id: 'HN20240319003', route: '海口人文3日游', user: '王**', phone: '136****9012', tripDate: '2024-03-10', count: 2, amount: 3160, payMethod: '微信支付', status: 'completed', createdAt: '2024-03-19 11:45', hasAlert: false },
        { id: 'HN20240318004', route: '五指山雨林7日行', user: '陈**', phone: '137****3456', tripDate: '2024-02-05', count: 4, amount: 14720, payMethod: '微信支付', status: 'completed', createdAt: '2024-03-18 10:20', hasAlert: false },
        { id: 'HN20240317005', route: '全岛美食5日探店', user: '刘**', phone: '135****7890', tripDate: '2024-03-20', count: 2, amount: 4360, payMethod: '支付宝', status: 'cancelled', createdAt: '2024-03-17 09:55', hasAlert: false },
        { id: 'HN20240316006', route: '三亚5日精华游', user: '赵**', phone: '132****2345', tripDate: '2024-04-20', count: 2, amount: 5960, payMethod: '微信支付', status: 'upcoming', createdAt: '2024-03-16 16:30', hasAlert: true, alertMsg: '用户申请退款，需处理' },
      ]
    }
  },
  computed: {
    filteredOrders() {
      return this.orders.filter(o => {
        if (this.searchKeyword && !o.id.includes(this.searchKeyword) && !o.route.includes(this.searchKeyword)) return false
        if (this.filterStatus && o.status !== this.filterStatus) return false
        if (this.filterDate && o.tripDate !== this.filterDate) return false
        return true
      })
    },
    totalAmount() {
      return this.filteredOrders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.amount, 0)
    }
  },
  methods: {
    viewOrder(order) {
      this.selectedOrder = order
    },
    cancelOrder(order) {
      order.status = 'cancelled'
      this.showToast('订单已取消')
    },
    processRefund(order) {
      this.selectedOrder = null
      this.showToast('已处理退款申请，将在3个工作日内原路退款')
    },
    showToast(msg) {
      this.toast = msg
      setTimeout(() => { this.toast = '' }, 2000)
    }
  }
}
</script>

<style scoped>
.admin-orders-page { display: flex; flex-direction: column; gap: 16px; }
.toolbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.toolbar-left { display: flex; gap: 10px; flex-wrap: wrap; }
.search-input { height: 36px; border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 0 12px; font-size: 13px; width: 220px; }
.search-input:focus { outline: none; border-color: var(--color-primary); }
.filter-select, .filter-date { height: 36px; border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 0 10px; font-size: 13px; color: var(--color-text); }
.total-info { font-size: 13px; color: var(--color-text-light); }
.table-card { background: var(--color-white); border: 1px solid var(--color-border); border-radius: var(--radius-md); overflow: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 14px; min-width: 900px; }
.data-table th { text-align: left; padding: 10px 14px; font-size: 12px; color: var(--color-text-light); font-weight: var(--font-weight-medium); border-bottom: 1px solid var(--color-border); background: var(--color-bg); }
.data-table td { padding: 12px 14px; border-bottom: 1px solid var(--color-border); color: var(--color-text); }
.data-table tr:last-child td { border-bottom: none; }
.alert-row td { background: #FFFAF0; }
.mono { font-size: 12px; color: var(--color-text-light); }
.alert-badge { display: inline-block; width: 16px; height: 16px; background: #E74C3C; color: white; border-radius: 50%; font-size: 10px; font-weight: bold; text-align: center; line-height: 16px; margin-left: 4px; }
.price-cell { color: var(--color-accent); font-weight: var(--font-weight-medium); }
.time-cell { font-size: 12px; color: var(--color-text-light); }
.status-tag { padding: 2px 8px; border-radius: 20px; font-size: 12px; }
.status-tag.pending { background: #FEF0E7; color: var(--color-accent); }
.status-tag.upcoming { background: #EBF4F8; color: var(--color-primary); }
.status-tag.completed { background: #E8F8EF; color: #27AE60; }
.status-tag.cancelled { background: #F3F4F6; color: var(--color-text-light); }
.action-cell { display: flex; gap: 6px; }
.action-btn { padding: 4px 10px; border-radius: var(--radius-sm); font-size: 12px; border: 1px solid; }
.view-btn { border-color: var(--color-primary); color: var(--color-primary); background: var(--color-white); }
.cancel-btn { border-color: #E74C3C; color: #E74C3C; background: var(--color-white); }
.empty-state { text-align: center; padding: 40px; color: var(--color-text-light); font-size: 14px; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px; }
.modal { background: var(--color-white); border-radius: var(--radius-lg); width: 520px; max-width: 100%; }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--color-border); }
.modal-header h3 { font-size: 15px; }
.close-btn { background: none; border: none; font-size: 16px; color: var(--color-text-light); cursor: pointer; }
.modal-body { padding: 20px; }
.detail-grid { display: flex; flex-direction: column; gap: 12px; }
.detail-row { display: flex; gap: 16px; align-items: center; }
.detail-label { font-size: 13px; color: var(--color-text-light); width: 80px; flex-shrink: 0; }
.detail-val { font-size: 14px; color: var(--color-text); }
.price-val { color: var(--color-accent); font-weight: var(--font-weight-semibold); }
.alert-block { margin-top: 16px; padding: 12px 16px; background: #FFF3CD; border-radius: var(--radius-sm); font-size: 14px; color: #856404; }
.modal-footer { display: flex; gap: 10px; justify-content: flex-end; padding: 16px 20px; border-top: 1px solid var(--color-border); }
.refund-btn { padding: 8px 20px; background: var(--color-accent); color: white; border: none; border-radius: var(--radius-sm); font-size: 14px; }
.close-modal-btn { padding: 8px 20px; border: 1px solid var(--color-border); background: var(--color-white); border-radius: var(--radius-sm); font-size: 14px; color: var(--color-text-light); }
.toast { position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%); background: #27AE60; color: white; padding: 10px 24px; border-radius: var(--radius-md); font-size: 14px; z-index: 3000; }
</style>
