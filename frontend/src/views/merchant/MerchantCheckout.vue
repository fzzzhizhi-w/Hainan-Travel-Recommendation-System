<template>
  <div class="merchant-checkout-page">
    <div class="checkout-notice">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      核销操作实时同步系统，核销后用户将收到履约确认通知。如遇问题请及时联系平台客服
    </div>

    <!-- Scan Mode -->
    <div class="checkout-modes">
      <div class="mode-card active-mode">
        <h3 class="mode-title">扫码核销</h3>
        <p class="mode-desc">扫描用户订单二维码完成核销</p>
        <div class="scan-area">
          <div class="scan-placeholder">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
              <rect x="5" y="5" width="3" height="3" fill="currentColor"/>
              <rect x="16" y="5" width="3" height="3" fill="currentColor"/>
              <rect x="5" y="16" width="3" height="3" fill="currentColor"/>
            </svg>
            <p>点击开启摄像头扫码</p>
          </div>
          <button class="scan-btn" @click="showToast('摄像头扫码功能需在真实设备上运行')">开启扫码</button>
        </div>
      </div>

      <div class="mode-card">
        <h3 class="mode-title">验证码核销</h3>
        <p class="mode-desc">手动输入用户核销码</p>
        <div class="manual-checkout">
          <input v-model="manualCode" class="code-input" placeholder="请输入6位核销码" maxlength="20" type="text" />
          <button class="verify-btn" @click="verifyCode">验证核销</button>
        </div>
        <div v-if="verifyResult" class="verify-result" :class="verifyResult.success ? 'success' : 'fail'">
          <div v-if="verifyResult.success" class="result-info">
            <div class="result-icon success-icon">✓</div>
            <div class="result-detail">
              <div class="result-title">核销成功</div>
              <div class="result-row">订单：{{ verifyResult.orderId }}</div>
              <div class="result-row">产品：{{ verifyResult.product }}</div>
              <div class="result-row">用户：{{ verifyResult.user }} · {{ verifyResult.count }}人</div>
              <div class="result-row">出行日期：{{ verifyResult.tripDate }}</div>
            </div>
          </div>
          <div v-else class="result-fail">
            <div class="result-icon fail-icon">✗</div>
            <div>{{ verifyResult.message }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Checkouts -->
    <div class="section-card">
      <h3 class="section-title">今日核销记录</h3>
      <div class="checkout-list">
        <div v-for="record in checkoutRecords" :key="record.id" class="checkout-item">
          <div class="checkout-left">
            <span class="checkout-time">{{ record.time }}</span>
            <div class="checkout-info">
              <span class="checkout-order">{{ record.orderId }}</span>
              <span class="checkout-product">{{ record.product }}</span>
            </div>
          </div>
          <div class="checkout-right">
            <span class="checkout-count">{{ record.count }}人</span>
            <span class="checkout-status success-badge">已核销</span>
          </div>
        </div>
        <div v-if="checkoutRecords.length === 0" class="empty-state">今日暂无核销记录</div>
      </div>
    </div>

    <div v-if="toast" class="toast">{{ toast }}</div>
  </div>
</template>

<script>
export default {
  name: 'MerchantCheckout',
  data() {
    return {
      manualCode: '',
      verifyResult: null,
      toast: '',
      checkoutRecords: [
        { id: 1, orderId: 'HN20240315008', product: '三亚5日精华游', count: 2, time: '09:15' },
        { id: 2, orderId: 'HN20240315009', product: '蜈支洲岛一日游', count: 3, time: '10:32' },
        { id: 3, orderId: 'HN20240315012', product: '三亚5日精华游', count: 2, time: '13:48' },
      ],
      validCodes: {
        'HN2024041501': { orderId: 'HN20240320001', product: '三亚5日精华游', user: '张**', count: 2, tripDate: '2024-04-15' },
        'HN2024042004': { orderId: 'HN20240318004', product: '五指山雨林7日行', user: '陈**', count: 4, tripDate: '2024-04-20' },
      }
    }
  },
  methods: {
    verifyCode() {
      if (!this.manualCode.trim()) {
        this.showToast('请输入核销码')
        return
      }
      const data = this.validCodes[this.manualCode.trim().toUpperCase()]
      if (data) {
        this.verifyResult = { success: true, ...data }
        this.checkoutRecords.unshift({
          id: Date.now(),
          orderId: data.orderId,
          product: data.product,
          count: data.count,
          time: new Date().toTimeString().slice(0, 5)
        })
        this.manualCode = ''
      } else {
        this.verifyResult = { success: false, message: '核销码无效或已核销，请检查后重试' }
      }
    },
    showToast(msg) {
      this.toast = msg
      setTimeout(() => { this.toast = '' }, 2000)
    }
  }
}
</script>

<style scoped>
.merchant-checkout-page { display: flex; flex-direction: column; gap: 20px; }
.checkout-notice { display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: #EBF4F8; border-radius: var(--radius-md); font-size: 13px; color: var(--color-primary); }
.checkout-modes { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.mode-card { background: var(--color-white); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 20px; }
.active-mode { border-color: var(--color-primary); }
.mode-title { font-size: 15px; color: var(--color-text); margin-bottom: 4px; }
.mode-desc { font-size: 13px; color: var(--color-text-light); margin-bottom: 20px; }
.scan-area { display: flex; flex-direction: column; align-items: center; gap: 16px; }
.scan-placeholder { width: 180px; height: 180px; border: 2px dashed var(--color-border); border-radius: var(--radius-md); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; color: var(--color-border); }
.scan-placeholder p { font-size: 13px; color: var(--color-text-light); }
.scan-btn { padding: 10px 32px; background: var(--color-primary); color: white; border: none; border-radius: var(--radius-md); font-size: 14px; }
.manual-checkout { display: flex; gap: 10px; margin-bottom: 16px; }
.code-input { flex: 1; height: 44px; border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 0 14px; font-size: 16px; letter-spacing: 2px; }
.code-input:focus { outline: none; border-color: var(--color-primary); }
.verify-btn { height: 44px; padding: 0 20px; background: var(--color-accent); color: white; border: none; border-radius: var(--radius-sm); font-size: 14px; white-space: nowrap; }
.verify-result { padding: 16px; border-radius: var(--radius-md); }
.verify-result.success { background: #E8F8EF; }
.verify-result.fail { background: #FEF0E7; }
.result-info { display: flex; gap: 14px; align-items: flex-start; }
.result-icon { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: bold; flex-shrink: 0; }
.success-icon { background: #27AE60; color: white; }
.fail-icon { background: #E74C3C; color: white; }
.result-detail { flex: 1; }
.result-title { font-size: 15px; font-weight: var(--font-weight-semibold); color: #27AE60; margin-bottom: 8px; }
.result-row { font-size: 13px; color: var(--color-text); line-height: 1.8; }
.result-fail { display: flex; align-items: center; gap: 10px; font-size: 14px; color: #E74C3C; }
.section-card { background: var(--color-white); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 20px; }
.section-title { font-size: 15px; color: var(--color-text); margin-bottom: 16px; }
.checkout-list { display: flex; flex-direction: column; }
.checkout-item { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--color-border); }
.checkout-item:last-child { border-bottom: none; }
.checkout-left { display: flex; align-items: center; gap: 14px; }
.checkout-time { font-size: 13px; color: var(--color-text-light); font-weight: var(--font-weight-medium); white-space: nowrap; }
.checkout-info { display: flex; flex-direction: column; gap: 2px; }
.checkout-order { font-size: 11px; color: var(--color-text-light); }
.checkout-product { font-size: 13px; color: var(--color-text); }
.checkout-right { display: flex; align-items: center; gap: 10px; }
.checkout-count { font-size: 13px; color: var(--color-text-light); }
.success-badge { padding: 2px 8px; background: #E8F8EF; color: #27AE60; border-radius: 20px; font-size: 12px; }
.empty-state { text-align: center; padding: 24px; color: var(--color-text-light); font-size: 14px; }
.toast { position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%); background: #27AE60; color: white; padding: 10px 24px; border-radius: var(--radius-md); font-size: 14px; z-index: 3000; }
@media (max-width: 768px) { .checkout-modes { grid-template-columns: 1fr; } }
</style>
