<template>
  <div class="admin-content-page">
    <!-- Tabs -->
    <div class="content-tabs">
      <button v-for="tab in tabs" :key="tab.key" class="tab-btn" :class="{ active: currentTab === tab.key }" @click="currentTab = tab.key">
        {{ tab.label }}
      </button>
    </div>

    <!-- Toolbar -->
    <div class="toolbar">
      <div class="toolbar-left">
        <input v-model="searchKeyword" class="search-input" placeholder="搜索名称..." type="text" />
        <select v-model="filterStatus" class="filter-select">
          <option value="">全部状态</option>
          <option value="published">已上架</option>
          <option value="pending">待审核</option>
          <option value="offline">已下架</option>
        </select>
      </div>
      <button class="add-btn" @click="openAddModal">+ 新增{{ tabLabel }}</button>
    </div>

    <!-- Table -->
    <div class="table-card">
      <table class="data-table">
        <thead>
          <tr>
            <th>名称</th>
            <th v-if="currentTab === 'routes'">天数</th>
            <th v-if="currentTab === 'routes'">价格</th>
            <th v-if="currentTab !== 'routes'">区域</th>
            <th v-if="currentTab !== 'routes'">类型</th>
            <th>状态</th>
            <th>评分</th>
            <th>更新时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredItems" :key="item.id">
            <td class="name-cell">{{ item.name }}</td>
            <td v-if="currentTab === 'routes'">{{ item.days }}天</td>
            <td v-if="currentTab === 'routes'" class="price-cell">¥{{ item.price }}</td>
            <td v-if="currentTab !== 'routes'">{{ item.area }}</td>
            <td v-if="currentTab !== 'routes'">{{ item.type }}</td>
            <td><span class="status-tag" :class="item.status">{{ statusLabels[item.status] }}</span></td>
            <td class="rating-cell">{{ item.rating }}分</td>
            <td class="time-cell">{{ item.updatedAt }}</td>
            <td class="action-cell">
              <button class="action-btn edit-btn" @click="editItem(item)">编辑</button>
              <button v-if="item.status === 'published'" class="action-btn offline-btn" @click="toggleStatus(item)">下架</button>
              <button v-else-if="item.status === 'pending'" class="action-btn approve-btn" @click="approveItem(item)">审核通过</button>
              <button v-else class="action-btn online-btn" @click="toggleStatus(item)">上架</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="filteredItems.length === 0" class="empty-state">暂无相关内容</div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ modalMode === 'add' ? '新增' : '编辑' }}{{ tabLabel }}</h3>
          <button class="close-btn" @click="showModal = false">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-field">
            <label>名称</label>
            <input v-model="form.name" class="form-input" type="text" placeholder="请输入名称" />
          </div>
          <div class="form-field" v-if="currentTab !== 'routes'">
            <label>区域</label>
            <select v-model="form.area" class="form-input">
              <option v-for="a in areas" :key="a" :value="a">{{ a }}</option>
            </select>
          </div>
          <div class="form-field" v-if="currentTab === 'routes'">
            <label>行程天数</label>
            <input v-model="form.days" class="form-input" type="number" min="1" placeholder="天数" />
          </div>
          <div class="form-field" v-if="currentTab === 'routes'">
            <label>参考价格（元/人）</label>
            <input v-model="form.price" class="form-input" type="number" min="0" placeholder="价格" />
          </div>
          <div class="form-field">
            <label>简介描述</label>
            <textarea v-model="form.description" class="form-textarea" rows="3" placeholder="请输入简介..."></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="showModal = false">取消</button>
          <button class="save-btn" @click="saveItem">保存并提交审核</button>
        </div>
      </div>
    </div>

    <div v-if="toast" class="toast">{{ toast }}</div>
  </div>
</template>

<script>
export default {
  name: 'AdminContent',
  data() {
    return {
      currentTab: 'routes',
      searchKeyword: '',
      filterStatus: '',
      showModal: false,
      modalMode: 'add',
      toast: '',
      form: { name: '', area: '', days: '', price: '', description: '' },
      areas: ['海口', '三亚', '万宁', '文昌', '陵水', '琼海', '五指山市'],
      tabs: [
        { key: 'routes', label: '线路管理' },
        { key: 'attractions', label: '景点管理' },
        { key: 'hotels', label: '酒店管理' },
        { key: 'restaurants', label: '餐饮管理' },
      ],
      statusLabels: { published: '已上架', pending: '待审核', offline: '已下架' },
      allItems: {
        routes: [
          { id: 1, name: '三亚5日精华游', days: 5, price: 2980, area: '', type: '', status: 'published', rating: 4.9, updatedAt: '2024-03-18' },
          { id: 2, name: '海口人文3日游', days: 3, price: 1580, area: '', type: '', status: 'published', rating: 4.6, updatedAt: '2024-03-15' },
          { id: 3, name: '五指山雨林7日行', days: 7, price: 3680, area: '', type: '', status: 'pending', rating: 4.7, updatedAt: '2024-03-20' },
        ],
        attractions: [
          { id: 1, name: '亚龙湾', area: '三亚', type: '海滩', days: null, price: null, status: 'published', rating: 5.0, updatedAt: '2024-03-10' },
          { id: 2, name: '天涯海角', area: '三亚', type: '景区', days: null, price: null, status: 'published', rating: 4.5, updatedAt: '2024-03-10' },
          { id: 3, name: '骑楼老街', area: '海口', type: '购物', days: null, price: null, status: 'offline', rating: 4.0, updatedAt: '2024-02-28' },
        ],
        hotels: [
          { id: 1, name: '三亚亚特兰蒂斯酒店', area: '三亚', type: '五星级', days: null, price: null, status: 'published', rating: 4.8, updatedAt: '2024-03-12' },
          { id: 2, name: '海口金龙大酒店', area: '海口', type: '四星级', days: null, price: null, status: 'published', rating: 4.4, updatedAt: '2024-03-08' },
        ],
        restaurants: [
          { id: 1, name: '海鲜大排档（三亚湾店）', area: '三亚', type: '海鲜', days: null, price: null, status: 'published', rating: 4.6, updatedAt: '2024-03-14' },
          { id: 2, name: '骑楼椰子鸡火锅', area: '海口', type: '本地菜', days: null, price: null, status: 'pending', rating: 4.3, updatedAt: '2024-03-19' },
        ],
      }
    }
  },
  computed: {
    tabLabel() {
      const labels = { routes: '线路', attractions: '景点', hotels: '酒店', restaurants: '餐饮' }
      return labels[this.currentTab]
    },
    filteredItems() {
      return (this.allItems[this.currentTab] || []).filter(item => {
        if (this.searchKeyword && !item.name.includes(this.searchKeyword)) return false
        if (this.filterStatus && item.status !== this.filterStatus) return false
        return true
      })
    }
  },
  methods: {
    openAddModal() {
      this.modalMode = 'add'
      this.form = { name: '', area: '', days: '', price: '', description: '' }
      this.showModal = true
    },
    editItem(item) {
      this.modalMode = 'edit'
      this.form = { ...item }
      this.showModal = true
    },
    approveItem(item) {
      item.status = 'published'
      this.showToast('审核通过，内容已上架')
    },
    toggleStatus(item) {
      item.status = item.status === 'published' ? 'offline' : 'published'
      this.showToast(item.status === 'published' ? '已上架' : '已下架')
    },
    saveItem() {
      this.showModal = false
      this.showToast('已提交审核，审核通过后将自动上架')
    },
    showToast(msg) {
      this.toast = msg
      setTimeout(() => { this.toast = '' }, 2000)
    }
  }
}
</script>

<style scoped>
.admin-content-page { display: flex; flex-direction: column; gap: 16px; }
.content-tabs { display: flex; gap: 0; border-bottom: 1px solid var(--color-border); background: var(--color-white); border-radius: var(--radius-md) var(--radius-md) 0 0; }
.tab-btn { padding: 12px 20px; background: none; border: none; font-size: 14px; color: var(--color-text-light); border-bottom: 2px solid transparent; position: relative; bottom: -1px; }
.tab-btn.active { color: var(--color-primary); border-bottom-color: var(--color-primary); font-weight: var(--font-weight-medium); }
.toolbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.toolbar-left { display: flex; gap: 10px; }
.search-input { height: 36px; border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 0 12px; font-size: 13px; width: 200px; }
.search-input:focus { outline: none; border-color: var(--color-primary); }
.filter-select { height: 36px; border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 0 10px; font-size: 13px; color: var(--color-text); }
.add-btn { height: 36px; padding: 0 16px; background: var(--color-primary); color: var(--color-white); border: none; border-radius: var(--radius-sm); font-size: 13px; }
.table-card { background: var(--color-white); border: 1px solid var(--color-border); border-radius: var(--radius-md); overflow: hidden; }
.data-table { width: 100%; border-collapse: collapse; font-size: 14px; }
.data-table th { text-align: left; padding: 10px 16px; font-size: 12px; color: var(--color-text-light); font-weight: var(--font-weight-medium); border-bottom: 1px solid var(--color-border); background: var(--color-bg); }
.data-table td { padding: 12px 16px; border-bottom: 1px solid var(--color-border); color: var(--color-text); }
.data-table tr:last-child td { border-bottom: none; }
.name-cell { font-weight: var(--font-weight-medium); }
.price-cell { color: var(--color-accent); }
.rating-cell { color: #F5A623; }
.time-cell { font-size: 12px; color: var(--color-text-light); }
.status-tag { padding: 2px 8px; border-radius: 20px; font-size: 12px; }
.status-tag.published { background: #E8F8EF; color: #27AE60; }
.status-tag.pending { background: #FEF0E7; color: var(--color-accent); }
.status-tag.offline { background: #F3F4F6; color: var(--color-text-light); }
.action-cell { display: flex; gap: 6px; }
.action-btn { padding: 4px 10px; border-radius: var(--radius-sm); font-size: 12px; border: 1px solid; }
.edit-btn { border-color: var(--color-border); color: var(--color-text-light); background: var(--color-white); }
.offline-btn { border-color: #E74C3C; color: #E74C3C; background: var(--color-white); }
.online-btn { border-color: #27AE60; color: #27AE60; background: var(--color-white); }
.approve-btn { border-color: var(--color-primary); color: var(--color-primary); background: var(--color-white); }
.empty-state { text-align: center; padding: 40px; color: var(--color-text-light); font-size: 14px; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px; }
.modal { background: var(--color-white); border-radius: var(--radius-lg); width: 520px; max-width: 100%; }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--color-border); }
.modal-header h3 { font-size: 15px; }
.close-btn { background: none; border: none; font-size: 16px; color: var(--color-text-light); cursor: pointer; padding: 4px 8px; }
.modal-body { padding: 20px; display: flex; flex-direction: column; gap: 14px; }
.form-field { display: flex; flex-direction: column; gap: 6px; }
.form-field label { font-size: 13px; color: var(--color-text-light); }
.form-input { height: 38px; border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 0 10px; font-size: 14px; }
.form-input:focus { outline: none; border-color: var(--color-primary); }
.form-textarea { border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 8px 10px; font-size: 14px; resize: vertical; }
.form-textarea:focus { outline: none; border-color: var(--color-primary); }
.modal-footer { display: flex; gap: 10px; justify-content: flex-end; padding: 16px 20px; border-top: 1px solid var(--color-border); }
.cancel-btn { padding: 8px 20px; border: 1px solid var(--color-border); background: var(--color-white); border-radius: var(--radius-sm); font-size: 14px; color: var(--color-text-light); }
.save-btn { padding: 8px 20px; background: var(--color-primary); color: var(--color-white); border: none; border-radius: var(--radius-sm); font-size: 14px; }
.toast { position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%); background: #27AE60; color: white; padding: 10px 24px; border-radius: var(--radius-md); font-size: 14px; z-index: 3000; }
</style>
