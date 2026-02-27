<template>
  <div class="merchant-orders-page">
    <div class="toolbar">
      <div class="toolbar-left">
        <input v-model="searchKeyword" class="search-input" placeholder="订单号..." type="text" />
        <select v-model="filterStatus" class="filter-select">
          <option value="">全部状态</option>
          <option value="upcoming">待出行</option>
          <option value="checkedIn">已核销</option>
          <option value="completed">已完成</option>
          <option value="cancelled">已取消</option>
        </select>
        <input v-model="filterDate" type="date" class="filter-date" />
      </div>
    </div>

    <div class="table-card">
      <table class="data-table">
        <thead>
          <tr>
            <th>订单号</th>
            <th>产品</th>
            <th>用户</th>
            <th>出行日期</th>
            <th>人数</th>
            <th>金额</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredOrders" :key="order.id">
            <td class="mono">{{ order.id }}</td>
            <td>{{ order.product }}</td>
            <td>{{ order.user }}</td>
            <td>{{ order.tripDate }}</td>
            <td>{{ order.count }}人</td>
            <td class="price-cell">¥{{ order.amount.toLocaleString() }}</td>
            <td><span class="status-tag" :class="order.status">{{ statusLabels[order.status] }}</span></td>
            <td class="action-cell">
              <button class="action-btn view-btn" @click="viewOrder(order)">查看</button>
              <button v-if="order.status === 'upcoming'" class="action-btn confirm-btn" @click="confirmOrder(order)">确认接待</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="filteredOrders.length === 0" class="empty-state">暂无相关订单</div>
    </div>

    <!-- Order Detail Modal -->
    <div v-if="selectedOrder" class="modal-overlay" @click.self="selectedOrder = null">
      <div class="modal">
        <div class="modal-header">
          <h3>订单详情</h3>
          <button class="close-btn" @click="selectedOrder = null">✕</button>
        </div>
        <div class="modal-body">
          <div class="detail-list">
            <div class="detail-item"><span class="detail-label">订单号</span><span class="detail-val mono">{{ selectedOrder.id }}</span></div>
            <div class="detail-item"><span class="detail-label">产品</span><span class="detail-val">{{ selectedOrder.product }}</span></div>
            <div class="detail-item"><span class="detail-label">出行日期</span><span class="detail-val">{{ selectedOrder.tripDate }}</span></div>
            <div class="detail-item"><span class="detail-label">出行人数</span><span class="detail-val">{{ selectedOrder.count }} 人</span></div>
            <div class="detail-item"><span class="detail-label">联系手机</span><span class="detail-val mono">{{ selectedOrder.phone }}</span></div>
            <div class="detail-item"><span class="detail-label">订单金额</span><span class="detail-val price-val">¥{{ selectedOrder.amount.toLocaleString() }}</span></div>
            <div class="detail-item"><span class="detail-label">当前状态</span><span class="status-tag" :class="selectedOrder.status">{{ statusLabels[selectedOrder.status] }}</span></div>
          </div>
          <div class="verify-code-box">
            <div class="code-label">核销码</div>
            <div class="code-val">{{ selectedOrder.verifyCode }}</div>
            <div class="code-tip">用户出行当日出示此码，扫码或手动核销</div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="close-modal-btn" @click="selectedOrder = null">关闭</button>
        </div>
      </div>
    </div>

    <div v-if="toast" class="toast">{{ toast }}</div>
  </div>
</template>

<script>
export default {
  name: 'MerchantOrders',
  data() {
    return {
      searchKeyword: '',
      filterStatus: '',
      filterDate: '',
      selectedOrder: null,
      toast: '',
      statusLabels: { upcoming: '待出行', checkedIn: '已核销', completed: '已完成', cancelled: '已取消' },
      orders: [
        { id: 'HN20240320001', product: '三亚5日精华游', user: '张**', phone: '138****1234', tripDate: '2024-04-15', count: 2, amount: 5960, status: 'upcoming', verifyCode: 'HN2024041501' },
        { id: 'HN20240318004', product: '五指山雨林7日行', user: '陈**', phone: '137****3456', tripDate: '2024-04-20', count: 4, amount: 14720, status: 'upcoming', verifyCode: 'HN2024042004' },
        { id: 'HN20240315008', product: '三亚5日精华游', user: '刘**', phone: '135****7890', tripDate: '2024-03-15', count: 2, amount: 5960, status: 'checkedIn', verifyCode: 'HN2024031508' },
        { id: 'HN20240310011', product: '蜈支洲岛一日游', user: '王**', phone: '136****4321', tripDate: '2024-03-10', count: 3, amount: 630, status: 'completed', verifyCode: 'HN2024031011' },
        { id: 'HN20240305015', product: '三亚5日精华游', user: '赵**', phone: '132****0987', tripDate: '2024-04-05', count: 2, amount: 5960, status: 'cancelled', verifyCode: 'HN2024040515' },
      ]
    }
  },
  computed: {
    filteredOrders() {
      return this.orders.filter(o => {
        if (this.searchKeyword && !o.id.includes(this.searchKeyword)) return false
        if (this.filterStatus && o.status !== this.filterStatus) return false
        if (this.filterDate && o.tripDate !== this.filterDate) return false
        return true
      })
    }
  },
  methods: {
    viewOrder(order) { this.selectedOrder = order },
    confirmOrder(order) {
      order.status = 'checkedIn'
      this.showToast('已确认接待，状态已同步用户')
    },
    showToast(msg) {
      this.toast = msg
      setTimeout(() => { this.toast = '' }, 2000)
    }
  }
}
</script>

<style scoped>
.merchant-orders-page { display: flex; flex-direction: column; gap: 16px; }
.toolbar { display: flex; gap: 12px; }
.toolbar-left { display: flex; gap: 10px; flex-wrap: wrap; }
.search-input { height: 36px; border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 0 12px; font-size: 13px; width: 180px; }
.search-input:focus { outline: none; border-color: var(--color-primary); }
.filter-select, .filter-date { height: 36px; border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 0 10px; font-size: 13px; color: var(--color-text); }
.table-card { background: var(--color-white); border: 1px solid var(--color-border); border-radius: var(--radius-md); overflow: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 14px; min-width: 750px; }
.data-table th { text-align: left; padding: 10px 14px; font-size: 12px; color: var(--color-text-light); font-weight: var(--font-weight-medium); border-bottom: 1px solid var(--color-border); background: var(--color-bg); }
.data-table td { padding: 12px 14px; border-bottom: 1px solid var(--color-border); }
.data-table tr:last-child td { border-bottom: none; }
.mono { font-size: 12px; color: var(--color-text-light); }
.price-cell { color: var(--color-accent); font-weight: var(--font-weight-medium); }
.status-tag { padding: 2px 8px; border-radius: 20px; font-size: 12px; }
.status-tag.upcoming { background: #EBF4F8; color: var(--color-primary); }
.status-tag.checkedIn { background: #E8F8EF; color: #27AE60; }
.status-tag.completed { background: #E8F8EF; color: #27AE60; }
.status-tag.cancelled { background: #F3F4F6; color: var(--color-text-light); }
.action-cell { display: flex; gap: 6px; }
.action-btn { padding: 4px 10px; border-radius: var(--radius-sm); font-size: 12px; border: 1px solid; }
.view-btn { border-color: var(--color-primary); color: var(--color-primary); background: white; }
.confirm-btn { border-color: #27AE60; color: #27AE60; background: white; }
.empty-state { text-align: center; padding: 40px; color: var(--color-text-light); font-size: 14px; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px; }
.modal { background: var(--color-white); border-radius: var(--radius-lg); width: 460px; max-width: 100%; }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--color-border); }
.modal-header h3 { font-size: 15px; }
.close-btn { background: none; border: none; font-size: 16px; color: var(--color-text-light); cursor: pointer; }
.modal-body { padding: 20px; display: flex; flex-direction: column; gap: 16px; }
.detail-list { display: flex; flex-direction: column; gap: 10px; }
.detail-item { display: flex; gap: 16px; align-items: center; }
.detail-label { font-size: 13px; color: var(--color-text-light); width: 72px; flex-shrink: 0; }
.detail-val { font-size: 14px; color: var(--color-text); }
.price-val { color: var(--color-accent); font-weight: var(--font-weight-semibold); }
.verify-code-box { background: var(--color-bg); border-radius: var(--radius-md); padding: 16px; text-align: center; border: 1px dashed var(--color-border); }
.code-label { font-size: 12px; color: var(--color-text-light); margin-bottom: 8px; }
.code-val { font-size: 24px; font-weight: var(--font-weight-semibold); color: var(--color-primary); letter-spacing: 3px; margin-bottom: 6px; }
.code-tip { font-size: 12px; color: var(--color-text-light); }
.modal-footer { display: flex; justify-content: flex-end; padding: 16px 20px; border-top: 1px solid var(--color-border); }
.close-modal-btn { padding: 8px 20px; border: 1px solid var(--color-border); background: white; border-radius: var(--radius-sm); font-size: 14px; color: var(--color-text-light); }
.toast { position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%); background: #27AE60; color: white; padding: 10px 24px; border-radius: var(--radius-md); font-size: 14px; z-index: 3000; }
</style>
