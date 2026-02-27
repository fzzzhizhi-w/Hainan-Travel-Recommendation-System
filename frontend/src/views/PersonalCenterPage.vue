<template>
  <div class="personal-center">
    <div class="page-container">
      <h1 class="page-title">个人中心</h1>

      <!-- Top Tabs -->
      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="tab-btn"
          :class="{ active: currentTab === tab.key }"
          @click="currentTab = tab.key"
        >{{ tab.label }}</button>
      </div>

      <!-- 我的订单 -->
      <div v-if="currentTab === 'orders'" class="tab-content">
        <div class="sub-tabs">
          <button
            v-for="st in orderSubTabs"
            :key="st.key"
            class="sub-tab-btn"
            :class="{ active: orderSubTab === st.key }"
            @click="orderSubTab = st.key"
          >{{ st.label }}</button>
        </div>
        <div class="order-list">
          <div v-for="order in filteredOrders" :key="order.id" class="order-card">
            <div class="order-header">
              <span class="order-id">订单号：{{ order.id }}</span>
              <span class="order-status" :class="order.status">{{ statusLabels[order.status] }}</span>
            </div>
            <div class="order-body">
              <div class="order-cover" :style="{ background: order.color }">
                <span>{{ order.routeName[0] }}</span>
              </div>
              <div class="order-info">
                <h3 class="order-route">{{ order.routeName }}</h3>
                <p class="order-meta">出发日期：{{ order.date }}</p>
                <p class="order-meta">出行人数：{{ order.count }} 人</p>
                <p class="order-meta">下单时间：{{ order.createdAt }}</p>
              </div>
              <div class="order-price-col">
                <div class="order-price">¥{{ order.price }}</div>
                <div class="order-actions">
                  <button v-if="order.status === 'pending'" class="order-btn primary" @click="payOrder(order)">支付</button>
                  <button v-if="order.status === 'pending'" class="order-btn outline" @click="cancelOrder(order)">取消</button>
                  <button v-if="order.status === 'completed'" class="order-btn primary" @click="openReview(order)">写评价</button>
                  <button v-if="order.status === 'upcoming'" class="order-btn outline" @click="cancelOrder(order)">取消订单</button>
                </div>
              </div>
            </div>
          </div>
          <div v-if="filteredOrders.length === 0" class="empty-state">暂无相关订单</div>
        </div>
      </div>

      <!-- 我的收藏 -->
      <div v-if="currentTab === 'favorites'" class="tab-content">
        <div class="favorites-grid">
          <div v-for="item in favorites" :key="item.id" class="fav-card">
            <div class="fav-cover" :style="{ background: item.color }">
              <span>{{ item.name }}</span>
            </div>
            <div class="fav-body">
              <h3 class="fav-title">{{ item.title }}</h3>
              <div class="fav-tags">
                <span v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
              <p class="fav-desc">{{ item.desc }}</p>
              <div class="fav-footer">
                <span class="fav-price">¥{{ item.price }}<small>/人起</small></span>
                <button class="unfav-btn" @click="removeFavorite(item)">取消收藏</button>
              </div>
            </div>
          </div>
          <div v-if="favorites.length === 0" class="empty-state">暂无收藏</div>
        </div>
      </div>

      <!-- 个人信息 -->
      <div v-if="currentTab === 'profile'" class="tab-content">
        <div class="profile-card">
          <div class="avatar-section">
            <div class="profile-avatar">{{ profile.nickname[0] }}</div>
            <button class="change-avatar-btn">更换头像</button>
          </div>
          <div class="profile-form">
            <div class="form-field">
              <label class="form-label">昵称</label>
              <input v-model="profile.nickname" class="form-input" type="text" />
            </div>
            <div class="form-field">
              <label class="form-label">手机号</label>
              <input v-model="profile.phone" class="form-input" type="tel" />
            </div>
            <div class="form-field">
              <label class="form-label">邮箱</label>
              <input v-model="profile.email" class="form-input" type="email" />
            </div>
            <div class="form-field">
              <label class="form-label">所在城市</label>
              <input v-model="profile.city" class="form-input" type="text" />
            </div>
            <button class="save-btn" @click="saveProfile">保存修改</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Review Modal -->
    <div v-if="reviewModal.show" class="modal-overlay" @click.self="reviewModal.show = false">
      <div class="review-modal">
        <div class="modal-header">
          <h2>写评价</h2>
          <button class="close-btn" @click="reviewModal.show = false">✕</button>
        </div>
        <div class="modal-body">
          <p class="review-route-name">{{ reviewModal.order ? reviewModal.order.routeName : '' }}</p>
          <div class="star-rating">
            <span
              v-for="i in 5"
              :key="i"
              class="star-btn"
              :class="{ filled: i <= reviewModal.rating }"
              @click="reviewModal.rating = i"
            >★</span>
          </div>
          <textarea
            v-model="reviewModal.text"
            class="review-textarea"
            placeholder="分享您的旅行感受..."
            rows="4"
          ></textarea>
          <button class="upload-img-btn">�� 上传图片</button>
          <button class="submit-review-btn" @click="submitReview">提交评价</button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div v-if="toast" class="toast">{{ toast }}</div>
  </div>
</template>

<script>
export default {
  name: 'PersonalCenterPage',
  props: {
    initialTab: {
      type: String,
      default: 'orders'
    }
  },
  data() {
    return {
      currentTab: this.initialTab || 'orders',
      orderSubTab: 'all',
      toast: '',
      tabs: [
        { key: 'orders', label: '我的订单' },
        { key: 'favorites', label: '我的收藏' },
        { key: 'profile', label: '个人信息' },
      ],
      orderSubTabs: [
        { key: 'all', label: '全部' },
        { key: 'pending', label: '待支付' },
        { key: 'upcoming', label: '待出行' },
        { key: 'completed', label: '已完成' },
        { key: 'cancelled', label: '已取消' },
      ],
      statusLabels: {
        pending: '待支付',
        upcoming: '待出行',
        completed: '已完成',
        cancelled: '已取消',
      },
      orders: [
        { id: 'HN20240301001', routeName: '三亚5日精华游', date: '2024-04-15', count: 2, price: 5960, status: 'upcoming', createdAt: '2024-03-01', color: '#4A8FA8' },
        { id: 'HN20240220002', routeName: '海口人文3日游', date: '2024-03-10', count: 2, price: 3160, status: 'completed', createdAt: '2024-02-20', color: '#5B9E6E' },
        { id: 'HN20240115003', routeName: '五指山雨林7日行', date: '2024-02-05', count: 4, price: 14720, status: 'completed', createdAt: '2024-01-15', color: '#8B6E4A' },
        { id: 'HN20240310004', routeName: '万宁亲子5日游', date: '2024-05-01', count: 3, price: 9840, status: 'pending', createdAt: '2024-03-10', color: '#A84A8F' },
        { id: 'HN20240205005', routeName: '全岛美食5日探店', date: '2024-03-20', count: 2, price: 4360, status: 'cancelled', createdAt: '2024-02-05', color: '#E8824A' },
      ],
      favorites: [
        { id: 1, name: '三亚精华', title: '三亚5日精华游', tags: ['海边', '度假'], desc: '亚龙湾·天涯海角·蜈支洲岛三大必游地', price: 2980, color: '#4A8FA8' },
        { id: 2, name: '雨林探秘', title: '五指山雨林7日行', tags: ['雨林', '探险'], desc: '五指山国家公园·黎族村寨·热带植物园', price: 3680, color: '#8B6E4A' },
        { id: 3, name: '亲子乐园', title: '万宁亲子5日游', tags: ['亲子', '海边'], desc: '石梅湾·日月湾·冲浪体验·神州半岛', price: 3280, color: '#A84A8F' },
      ],
      profile: {
        nickname: '旅行者',
        phone: '138****8888',
        email: 'traveler@example.com',
        city: '北京',
      },
      reviewModal: {
        show: false,
        order: null,
        rating: 5,
        text: '',
      }
    }
  },
  computed: {
    filteredOrders() {
      if (this.orderSubTab === 'all') return this.orders
      return this.orders.filter(o => o.status === this.orderSubTab)
    }
  },
  methods: {
    payOrder(order) {
      order.status = 'upcoming'
      this.showToast('支付成功！')
    },
    cancelOrder(order) {
      order.status = 'cancelled'
      this.showToast('订单已取消')
    },
    openReview(order) {
      this.reviewModal = { show: true, order, rating: 5, text: '' }
    },
    submitReview() {
      this.reviewModal.show = false
      this.showToast('评价提交成功！')
    },
    removeFavorite(item) {
      const idx = this.favorites.indexOf(item)
      if (idx > -1) this.favorites.splice(idx, 1)
      this.showToast('已取消收藏')
    },
    saveProfile() {
      this.showToast('个人信息保存成功！')
    },
    showToast(msg) {
      this.toast = msg
      setTimeout(() => { this.toast = '' }, 2000)
    }
  }
}
</script>

<style scoped>
.personal-center {
  min-height: 100%;
  padding: 24px;
}
.page-container {
  max-width: 1100px;
  margin: 0 auto;
}
.page-title {
  font-size: 22px;
  color: var(--color-text);
  margin-bottom: 20px;
}
.tabs {
  display: flex;
  gap: 0;
  border-bottom: 2px solid var(--color-border);
  margin-bottom: 24px;
}
.tab-btn {
  padding: 10px 24px;
  background: none;
  border: none;
  font-size: 15px;
  color: var(--color-text-light);
  position: relative;
  bottom: -2px;
  border-bottom: 2px solid transparent;
}
.tab-btn.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
  font-weight: var(--font-weight-medium);
}
.tab-btn:hover { color: var(--color-primary); }
.sub-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.sub-tab-btn {
  padding: 5px 14px;
  border: 1px solid var(--color-border);
  background: var(--color-white);
  border-radius: 20px;
  font-size: 13px;
  color: var(--color-text-light);
}
.sub-tab-btn.active {
  background: var(--color-primary);
  color: var(--color-white);
  border-color: var(--color-primary);
}
.order-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.order-card {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}
.order-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  font-size: 13px;
}
.order-id { color: var(--color-text-light); }
.order-status {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 20px;
  font-weight: var(--font-weight-medium);
}
.order-status.pending { background: #FEF0E7; color: var(--color-accent); }
.order-status.upcoming { background: #EBF4F8; color: var(--color-primary); }
.order-status.completed { background: #E8F8EF; color: #27AE60; }
.order-status.cancelled { background: #F3F4F6; color: var(--color-text-light); }
.order-body {
  display: flex;
  gap: 16px;
  padding: 16px;
  align-items: center;
}
.order-cover {
  width: 80px;
  height: 60px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-white);
  font-size: 20px;
  font-weight: var(--font-weight-semibold);
  flex-shrink: 0;
}
.order-info {
  flex: 1;
}
.order-route {
  font-size: 15px;
  margin-bottom: 6px;
}
.order-meta {
  font-size: 13px;
  color: var(--color-text-light);
  line-height: 1.6;
}
.order-price-col {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}
.order-price {
  font-size: 18px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-accent);
}
.order-actions {
  display: flex;
  gap: 8px;
}
.order-btn {
  padding: 6px 14px;
  border-radius: var(--radius-sm);
  font-size: 13px;
}
.order-btn.primary {
  background: var(--color-primary);
  color: var(--color-white);
  border: none;
}
.order-btn.outline {
  background: var(--color-white);
  color: var(--color-text-light);
  border: 1px solid var(--color-border);
}
.favorites-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.fav-card {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
}
.fav-cover {
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-white);
  font-size: 18px;
  font-weight: var(--font-weight-semibold);
}
.fav-body { padding: 14px; }
.fav-title {
  font-size: 14px;
  font-weight: var(--font-weight-semibold);
  margin-bottom: 8px;
}
.fav-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}
.tag {
  padding: 2px 8px;
  background: #EBF4F8;
  color: var(--color-primary);
  border-radius: 20px;
  font-size: 12px;
}
.fav-desc {
  font-size: 12px;
  color: var(--color-text-light);
  margin-bottom: 12px;
  line-height: 1.5;
}
.fav-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.fav-price {
  font-size: 16px;
  color: var(--color-accent);
  font-weight: var(--font-weight-semibold);
}
.fav-price small {
  font-size: 12px;
  color: var(--color-text-light);
  font-weight: var(--font-weight-normal);
}
.unfav-btn {
  padding: 5px 10px;
  border: 1px solid #E5E7EB;
  background: var(--color-white);
  border-radius: var(--radius-sm);
  font-size: 12px;
  color: var(--color-text-light);
}
.unfav-btn:hover { color: #E74C3C; border-color: #E74C3C; }
.profile-card {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 32px;
  max-width: 600px;
}
.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 28px;
}
.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--color-primary);
  color: var(--color-white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: var(--font-weight-semibold);
}
.change-avatar-btn {
  background: none;
  border: 1px solid var(--color-border);
  padding: 5px 14px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  color: var(--color-text-light);
}
.profile-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.form-label {
  font-size: 13px;
  color: var(--color-text-light);
  font-weight: var(--font-weight-medium);
}
.form-input {
  height: 40px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 0 12px;
  font-size: 14px;
  color: var(--color-text);
  font-family: inherit;
}
.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
}
.save-btn {
  margin-top: 8px;
  padding: 10px 32px;
  background: var(--color-primary);
  color: var(--color-white);
  border: none;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: var(--font-weight-medium);
  align-self: flex-start;
}
.save-btn:hover { opacity: 0.9; }
.empty-state {
  text-align: center;
  padding: 48px 0;
  color: var(--color-text-light);
  font-size: 15px;
}
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.review-modal {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  width: 500px;
  max-width: 100%;
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border);
}
.modal-header h2 { font-size: 16px; }
.close-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: var(--color-text-light);
  padding: 4px 8px;
}
.modal-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.review-route-name {
  font-size: 14px;
  color: var(--color-text-light);
}
.star-rating {
  display: flex;
  gap: 6px;
}
.star-btn {
  font-size: 28px;
  cursor: pointer;
  color: var(--color-border);
  transition: color 0.2s;
}
.star-btn.filled { color: #F5A623; }
.star-btn:hover { color: #F5A623; }
.review-textarea {
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 10px 12px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  color: var(--color-text);
}
.review-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}
.upload-img-btn {
  padding: 8px 16px;
  border: 1px dashed var(--color-border);
  background: var(--color-bg);
  border-radius: var(--radius-sm);
  font-size: 13px;
  color: var(--color-text-light);
  align-self: flex-start;
}
.submit-review-btn {
  padding: 10px 0;
  background: var(--color-primary);
  color: var(--color-white);
  border: none;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: var(--font-weight-medium);
}
.submit-review-btn:hover { opacity: 0.9; }
.toast {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  background: #27AE60;
  color: white;
  padding: 10px 24px;
  border-radius: var(--radius-md);
  font-size: 14px;
  z-index: 3000;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
@media (max-width: 900px) {
  .favorites-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 600px) {
  .favorites-grid {
    grid-template-columns: 1fr;
  }
  .personal-center {
    padding: 16px;
  }
}
</style>
