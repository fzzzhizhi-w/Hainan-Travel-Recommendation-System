<template>
  <div class="merchant-inventory-page">
    <div class="toolbar">
      <select v-model="selectedProduct" class="filter-select">
        <option value="">全部产品</option>
        <option v-for="p in products" :key="p.id" :value="p.id">{{ p.name }}</option>
      </select>
      <input v-model="selectedDate" type="date" class="filter-date" />
      <button class="add-btn" @click="showAddModal = true">+ 新增库存</button>
    </div>

    <div class="inv-notice">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      库存更新实时同步前台，杜绝超售。如需停售某日期产品，请将库存设置为0
    </div>

    <div class="inventory-table-card">
      <table class="data-table">
        <thead>
          <tr>
            <th>产品名称</th>
            <th>出行日期</th>
            <th>总量</th>
            <th>已售</th>
            <th>剩余</th>
            <th>状态</th>
            <th>参考价格（元/人）</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredInventory" :key="item.id" :class="{ 'low-stock': item.remaining <= 5 }">
            <td>{{ item.productName }}</td>
            <td>{{ item.date }}</td>
            <td>{{ item.total }}</td>
            <td>{{ item.sold }}</td>
            <td>
              <span :class="item.remaining <= 5 ? 'stock-danger' : item.remaining <= 10 ? 'stock-warn' : ''">
                {{ item.remaining }}
              </span>
            </td>
            <td><span class="status-tag" :class="item.status">{{ statusLabels[item.status] }}</span></td>
            <td>
              <div class="price-edit">
                <span v-if="!item.editing" class="price-display">¥{{ item.price }}</span>
                <input v-else v-model="item.price" type="number" class="price-input" min="0" />
                <button class="edit-price-btn" @click="togglePriceEdit(item)">
                  {{ item.editing ? '保存' : '改价' }}
                </button>
              </div>
            </td>
            <td class="action-cell">
              <button class="action-btn edit-btn" @click="editInventory(item)">修改库存</button>
              <button v-if="item.status === 'available'" class="action-btn stop-btn" @click="stopSale(item)">停售</button>
              <button v-else class="action-btn resume-btn" @click="resumeSale(item)">恢复</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="filteredInventory.length === 0" class="empty-state">暂无库存记录</div>
    </div>

    <!-- Edit Inventory Modal -->
    <div v-if="editModal.show" class="modal-overlay" @click.self="editModal.show = false">
      <div class="modal">
        <div class="modal-header">
          <h3>修改库存 · {{ editModal.item ? editModal.item.productName : '' }}</h3>
          <button class="close-btn" @click="editModal.show = false">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-field">
            <label>出行日期</label>
            <span class="field-val">{{ editModal.item ? editModal.item.date : '' }}</span>
          </div>
          <div class="form-field">
            <label>总库存数量</label>
            <input v-model="editModal.newTotal" type="number" min="0" class="form-input" />
          </div>
          <p class="form-note">注意：已售出 {{ editModal.item ? editModal.item.sold : 0 }} 份，修改总量不能小于已售量</p>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="editModal.show = false">取消</button>
          <button class="save-btn" @click="saveInventory">保存并同步</button>
        </div>
      </div>
    </div>

    <div v-if="toast" class="toast">{{ toast }}</div>
  </div>
</template>

<script>
export default {
  name: 'MerchantInventory',
  data() {
    return {
      selectedProduct: '',
      selectedDate: '',
      showAddModal: false,
      toast: '',
      editModal: { show: false, item: null, newTotal: 0 },
      statusLabels: { available: '销售中', stopped: '已停售', full: '已售罄' },
      products: [
        { id: 1, name: '三亚5日精华游' },
        { id: 2, name: '蜈支洲岛一日游' },
        { id: 3, name: '五指山雨林7日行' },
      ],
      inventory: [
        { id: 1, productId: 1, productName: '三亚5日精华游', date: '2024-04-15', total: 20, sold: 17, remaining: 3, price: 2980, status: 'available', editing: false },
        { id: 2, productId: 1, productName: '三亚5日精华游', date: '2024-04-20', total: 20, sold: 14, remaining: 6, price: 2980, status: 'available', editing: false },
        { id: 3, productId: 1, productName: '三亚5日精华游', date: '2024-05-01', total: 20, sold: 8, remaining: 12, price: 3280, status: 'available', editing: false },
        { id: 4, productId: 2, productName: '蜈支洲岛一日游', date: '2024-04-18', total: 30, sold: 22, remaining: 8, price: 210, status: 'available', editing: false },
        { id: 5, productId: 2, productName: '蜈支洲岛一日游', date: '2024-04-19', total: 30, sold: 30, remaining: 0, price: 210, status: 'full', editing: false },
        { id: 6, productId: 3, productName: '五指山雨林7日行', date: '2024-04-22', total: 15, sold: 8, remaining: 7, price: 3680, status: 'available', editing: false },
      ]
    }
  },
  computed: {
    filteredInventory() {
      return this.inventory.filter(item => {
        if (this.selectedProduct && item.productId !== this.selectedProduct) return false
        if (this.selectedDate && item.date !== this.selectedDate) return false
        return true
      })
    }
  },
  methods: {
    togglePriceEdit(item) {
      if (item.editing) {
        item.editing = false
        this.showToast('价格已更新，实时同步前台')
      } else {
        item.editing = true
      }
    },
    editInventory(item) {
      this.editModal = { show: true, item, newTotal: item.total }
    },
    saveInventory() {
      if (this.editModal.newTotal < this.editModal.item.sold) {
        this.showToast('总库存不能小于已售量')
        return
      }
      this.editModal.item.total = Number(this.editModal.newTotal)
      this.editModal.item.remaining = this.editModal.item.total - this.editModal.item.sold
      this.editModal.item.status = this.editModal.item.remaining === 0 ? 'full' : 'available'
      this.editModal.show = false
      this.showToast('库存已更新，实时同步前台')
    },
    stopSale(item) {
      item.status = 'stopped'
      this.showToast('该日期产品已停售')
    },
    resumeSale(item) {
      item.status = item.remaining === 0 ? 'full' : 'available'
      this.showToast('已恢复销售')
    },
    showToast(msg) {
      this.toast = msg
      setTimeout(() => { this.toast = '' }, 2000)
    }
  }
}
</script>

<style scoped>
.merchant-inventory-page { display: flex; flex-direction: column; gap: 16px; }
.toolbar { display: flex; align-items: center; gap: 12px; }
.filter-select, .filter-date { height: 36px; border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 0 10px; font-size: 13px; color: var(--color-text); }
.add-btn { height: 36px; padding: 0 16px; background: var(--color-accent); color: white; border: none; border-radius: var(--radius-sm); font-size: 13px; margin-left: auto; }
.inv-notice { display: flex; align-items: center; gap: 8px; padding: 10px 16px; background: #EBF4F8; border-radius: var(--radius-sm); font-size: 13px; color: var(--color-primary); }
.inventory-table-card { background: var(--color-white); border: 1px solid var(--color-border); border-radius: var(--radius-md); overflow: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 14px; min-width: 800px; }
.data-table th { text-align: left; padding: 10px 14px; font-size: 12px; color: var(--color-text-light); font-weight: var(--font-weight-medium); border-bottom: 1px solid var(--color-border); background: var(--color-bg); }
.data-table td { padding: 12px 14px; border-bottom: 1px solid var(--color-border); }
.data-table tr:last-child td { border-bottom: none; }
.low-stock td { background: #FFF5F5; }
.stock-danger { color: #E74C3C; font-weight: var(--font-weight-medium); }
.stock-warn { color: #F5A623; font-weight: var(--font-weight-medium); }
.status-tag { padding: 2px 8px; border-radius: 20px; font-size: 12px; }
.status-tag.available { background: #E8F8EF; color: #27AE60; }
.status-tag.stopped { background: #F3F4F6; color: var(--color-text-light); }
.status-tag.full { background: #FEF0E7; color: var(--color-accent); }
.price-edit { display: flex; align-items: center; gap: 6px; }
.price-display { font-size: 14px; color: var(--color-accent); font-weight: var(--font-weight-medium); }
.price-input { width: 80px; height: 30px; border: 1px solid var(--color-primary); border-radius: var(--radius-sm); padding: 0 8px; font-size: 13px; }
.edit-price-btn { font-size: 12px; color: var(--color-primary); background: none; border: none; padding: 2px 6px; }
.action-cell { display: flex; gap: 6px; }
.action-btn { padding: 4px 10px; border-radius: var(--radius-sm); font-size: 12px; border: 1px solid; }
.edit-btn { border-color: var(--color-primary); color: var(--color-primary); background: white; }
.stop-btn { border-color: #E74C3C; color: #E74C3C; background: white; }
.resume-btn { border-color: #27AE60; color: #27AE60; background: white; }
.empty-state { text-align: center; padding: 40px; color: var(--color-text-light); font-size: 14px; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px; }
.modal { background: var(--color-white); border-radius: var(--radius-lg); width: 440px; max-width: 100%; }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--color-border); }
.modal-header h3 { font-size: 15px; }
.close-btn { background: none; border: none; font-size: 16px; color: var(--color-text-light); cursor: pointer; }
.modal-body { padding: 20px; display: flex; flex-direction: column; gap: 14px; }
.form-field { display: flex; flex-direction: column; gap: 6px; }
.form-field label { font-size: 13px; color: var(--color-text-light); }
.field-val { font-size: 14px; color: var(--color-text); }
.form-input { height: 38px; border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 0 10px; font-size: 14px; }
.form-input:focus { outline: none; border-color: var(--color-primary); }
.form-note { font-size: 12px; color: #E74C3C; }
.modal-footer { display: flex; gap: 10px; justify-content: flex-end; padding: 16px 20px; border-top: 1px solid var(--color-border); }
.cancel-btn { padding: 8px 20px; border: 1px solid var(--color-border); background: white; border-radius: var(--radius-sm); font-size: 14px; color: var(--color-text-light); }
.save-btn { padding: 8px 20px; background: var(--color-accent); color: white; border: none; border-radius: var(--radius-sm); font-size: 14px; }
.toast { position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%); background: #27AE60; color: white; padding: 10px 24px; border-radius: var(--radius-md); font-size: 14px; z-index: 3000; }
</style>
