<template>
  <div class="merchant-settlement-page">
    <!-- Summary -->
    <div class="summary-bar">
      <div v-for="s in summary" :key="s.label" class="summary-item">
        <div class="summary-val" :class="s.colorClass">{{ s.value }}</div>
        <div class="summary-label">{{ s.label }}</div>
      </div>
    </div>

    <!-- Bill Period -->
    <div class="toolbar">
      <select v-model="billPeriod" class="filter-select">
        <option value="2024-03">2024年3月</option>
        <option value="2024-02">2024年2月</option>
        <option value="2024-01">2024年1月</option>
      </select>
      <span class="bill-status-text">
        账单状态：<span :class="billConfirmed ? 'confirmed-text' : 'pending-text'">{{ billConfirmed ? '已确认' : '待确认' }}</span>
      </span>
      <button v-if="!billConfirmed" class="confirm-bill-btn" @click="confirmBill">确认账单</button>
      <button class="export-btn" @click="showToast('账单导出功能开发中')">导出账单</button>
    </div>

    <!-- Settlement Notice -->
    <div class="settlement-notice">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      账单完全透明，无隐性费用。确认账单后平台将在每月15日前完成结算打款
    </div>

    <!-- Bill Detail Table -->
    <div class="table-card">
      <div class="table-header">
        <h3 class="table-title">订单明细</h3>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>订单号</th>
            <th>产品</th>
            <th>出行日期</th>
            <th>人数</th>
            <th>订单金额</th>
            <th>平台手续费(5%)</th>
            <th>实际结算</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="bill in billItems" :key="bill.id">
            <td class="mono">{{ bill.orderId }}</td>
            <td>{{ bill.product }}</td>
            <td>{{ bill.tripDate }}</td>
            <td>{{ bill.count }}人</td>
            <td>¥{{ bill.amount.toLocaleString() }}</td>
            <td class="fee-cell">¥{{ bill.fee.toLocaleString() }}</td>
            <td class="settle-cell">¥{{ bill.settle.toLocaleString() }}</td>
            <td><span class="status-tag" :class="bill.payStatus">{{ payStatusLabels[bill.payStatus] }}</span></td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="total-row">
            <td colspan="4"><strong>合计</strong></td>
            <td><strong>¥{{ totalAmount.toLocaleString() }}</strong></td>
            <td class="fee-cell"><strong>¥{{ totalFee.toLocaleString() }}</strong></td>
            <td class="settle-cell"><strong>¥{{ totalSettle.toLocaleString() }}</strong></td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>

    <div v-if="toast" class="toast">{{ toast }}</div>
  </div>
</template>

<script>
export default {
  name: 'MerchantSettlement',
  data() {
    return {
      billPeriod: '2024-03',
      billConfirmed: false,
      toast: '',
      payStatusLabels: { settled: '已结算', pending: '待结算' },
      summary: [
        { label: '本月订单金额', value: '¥554,280', colorClass: '' },
        { label: '平台手续费', value: '¥27,714', colorClass: 'fee-color' },
        { label: '实际结算金额', value: '¥526,566', colorClass: 'settle-color' },
        { label: '结算状态', value: '待确认', colorClass: 'pending-color' },
      ],
      billItems: [
        { id: 1, orderId: 'HN20240320001', product: '三亚5日精华游', tripDate: '2024-04-15', count: 2, amount: 5960, fee: 298, settle: 5662, payStatus: 'pending' },
        { id: 2, orderId: 'HN20240318004', product: '五指山雨林7日行', tripDate: '2024-04-20', count: 4, amount: 14720, fee: 736, settle: 13984, payStatus: 'pending' },
        { id: 3, orderId: 'HN20240315008', product: '三亚5日精华游', tripDate: '2024-03-15', count: 2, amount: 5960, fee: 298, settle: 5662, payStatus: 'settled' },
        { id: 4, orderId: 'HN20240310011', product: '蜈支洲岛一日游', tripDate: '2024-03-10', count: 3, amount: 630, fee: 32, settle: 598, payStatus: 'settled' },
        { id: 5, orderId: 'HN20240308013', product: '三亚5日精华游', tripDate: '2024-03-08', count: 2, amount: 5960, fee: 298, settle: 5662, payStatus: 'settled' },
      ]
    }
  },
  computed: {
    totalAmount() { return this.billItems.reduce((s, b) => s + b.amount, 0) },
    totalFee() { return this.billItems.reduce((s, b) => s + b.fee, 0) },
    totalSettle() { return this.billItems.reduce((s, b) => s + b.settle, 0) },
  },
  methods: {
    confirmBill() {
      this.billConfirmed = true
      this.summary[3].value = '已确认'
      this.summary[3].colorClass = 'settle-color'
      this.showToast('账单已确认，平台将于本月15日前完成打款')
    },
    showToast(msg) {
      this.toast = msg
      setTimeout(() => { this.toast = '' }, 2500)
    }
  }
}
</script>

<style scoped>
.merchant-settlement-page { display: flex; flex-direction: column; gap: 16px; }
.summary-bar { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.summary-item { background: var(--color-white); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 16px 20px; }
.summary-val { font-size: 22px; font-weight: var(--font-weight-semibold); color: var(--color-text); margin-bottom: 4px; }
.fee-color { color: #E74C3C; }
.settle-color { color: #27AE60; }
.pending-color { color: var(--color-accent); }
.summary-label { font-size: 13px; color: var(--color-text-light); }
.toolbar { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.filter-select { height: 36px; border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 0 10px; font-size: 13px; color: var(--color-text); }
.bill-status-text { font-size: 14px; color: var(--color-text-light); }
.confirmed-text { color: #27AE60; font-weight: var(--font-weight-medium); }
.pending-text { color: var(--color-accent); font-weight: var(--font-weight-medium); }
.confirm-bill-btn { height: 36px; padding: 0 16px; background: var(--color-accent); color: white; border: none; border-radius: var(--radius-sm); font-size: 13px; }
.export-btn { height: 36px; padding: 0 16px; background: white; color: var(--color-text-light); border: 1px solid var(--color-border); border-radius: var(--radius-sm); font-size: 13px; }
.settlement-notice { display: flex; align-items: center; gap: 8px; padding: 10px 16px; background: #E8F8EF; border-radius: var(--radius-sm); font-size: 13px; color: #27AE60; }
.table-card { background: var(--color-white); border: 1px solid var(--color-border); border-radius: var(--radius-md); overflow: auto; }
.table-header { padding: 16px 20px 0; }
.table-title { font-size: 14px; color: var(--color-text); margin-bottom: 16px; }
.data-table { width: 100%; border-collapse: collapse; font-size: 14px; min-width: 750px; }
.data-table th { text-align: left; padding: 10px 14px; font-size: 12px; color: var(--color-text-light); font-weight: var(--font-weight-medium); border-bottom: 1px solid var(--color-border); background: var(--color-bg); }
.data-table td { padding: 12px 14px; border-bottom: 1px solid var(--color-border); }
.total-row td { border-top: 2px solid var(--color-border); border-bottom: none; background: var(--color-bg); }
.mono { font-size: 12px; color: var(--color-text-light); }
.fee-cell { color: #E74C3C; }
.settle-cell { color: #27AE60; font-weight: var(--font-weight-medium); }
.status-tag { padding: 2px 8px; border-radius: 20px; font-size: 12px; }
.status-tag.settled { background: #E8F8EF; color: #27AE60; }
.status-tag.pending { background: #FEF0E7; color: var(--color-accent); }
.toast { position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%); background: #27AE60; color: white; padding: 10px 24px; border-radius: var(--radius-md); font-size: 14px; z-index: 3000; }
@media (max-width: 900px) { .summary-bar { grid-template-columns: repeat(2, 1fr); } }
</style>
