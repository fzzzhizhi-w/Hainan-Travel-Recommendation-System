<template>
  <div class="route-detail-page">
    <div class="page-layout">
      <!-- Left Content -->
      <div class="main-content">
        <!-- Hero -->
        <div class="hero-placeholder" :style="{ background: route.color }">
          <h1 class="hero-title">{{ route.title }}</h1>
        </div>

        <div class="content-section">
          <div class="route-meta">
            <span v-for="tag in route.tags" :key="tag" class="tag">{{ tag }}</span>
            <span class="duration-badge">{{ route.days }}天{{ route.nights }}晚</span>
          </div>
          <p class="route-desc">{{ route.description }}</p>
        </div>

        <!-- Itinerary -->
        <div class="content-section">
          <h2 class="section-title">行程安排</h2>
          <div class="timeline">
            <div v-for="day in route.itinerary" :key="day.day" class="timeline-item">
              <div class="day-badge">D{{ day.day }}</div>
              <div class="day-content">
                <h3 class="day-title">第{{ day.day }}天 · {{ day.title }}</h3>
                <ul class="activity-list">
                  <li v-for="(activity, i) in day.activities" :key="i" class="activity-item">
                    <span class="activity-time">{{ activity.time }}</span>
                    <span class="activity-desc">{{ activity.desc }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Cost Table -->
        <div class="content-section">
          <h2 class="section-title">费用说明</h2>
          <div class="cost-table">
            <div class="cost-col">
              <h4 class="cost-title included">✓ 费用包含</h4>
              <ul>
                <li v-for="item in route.costIncluded" :key="item">{{ item }}</li>
              </ul>
            </div>
            <div class="cost-col">
              <h4 class="cost-title excluded">✗ 费用不含</h4>
              <ul>
                <li v-for="item in route.costExcluded" :key="item">{{ item }}</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Reviews -->
        <div class="content-section">
          <h2 class="section-title">用户评价</h2>
          <div v-for="review in route.reviews" :key="review.name" class="review-card">
            <div class="review-header">
              <div class="review-avatar">{{ review.name[0] }}</div>
              <div>
                <div class="review-name">{{ review.name }}</div>
                <div class="star-row">
                  <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= review.rating }">★</span>
                </div>
              </div>
              <span class="review-date">{{ review.date }}</span>
            </div>
            <p class="review-text">{{ review.text }}</p>
          </div>
        </div>
      </div>

      <!-- Right Booking Bar -->
      <div class="booking-bar">
        <div class="price-display">
          <span class="price-label">参考价格</span>
          <div class="price-main">¥<span class="price-num">{{ totalPrice }}</span><small>/人起</small></div>
        </div>

        <div class="booking-fields">
          <div class="field-group">
            <label class="field-label">出发日期</label>
            <input v-model="booking.date" type="date" class="field-input" />
          </div>
          <div class="field-group">
            <label class="field-label">出行人数</label>
            <div class="counter">
              <button class="counter-btn" @click="decreaseCount">−</button>
              <span class="counter-num">{{ booking.count }}</span>
              <button class="counter-btn" @click="increaseCount">+</button>
            </div>
          </div>
          <div class="total-row">
            <span>总价</span>
            <span class="total-price">¥{{ route.price * booking.count }}</span>
          </div>
        </div>

        <button class="book-btn" @click="showPayment = true">立即预订</button>
        <button class="favorite-btn" @click="favorited = !favorited">
          {{ favorited ? '已加入收藏 ♥' : '加入收藏 ♡' }}
        </button>
        <div class="trust-text">🔒 安全保障 · 正规授权</div>
      </div>
    </div>

    <!-- Payment Modal -->
    <div v-if="showPayment" class="modal-overlay" @click.self="showPayment = false">
      <div class="payment-modal">
        <div class="modal-header">
          <h2>确认预订</h2>
          <button class="close-btn" @click="showPayment = false">✕</button>
        </div>
        <div class="order-summary">
          <h3>{{ route.title }}</h3>
          <p>出发日期：{{ booking.date || '待定' }}</p>
          <p>出行人数：{{ booking.count }} 人</p>
          <p class="summary-price">应付金额：<strong>¥{{ route.price * booking.count }}</strong></p>
        </div>
        <div class="payment-methods">
          <h4>选择支付方式</h4>
          <label class="payment-option">
            <input type="radio" v-model="paymentMethod" value="wechat" />
            <span class="pay-icon">💚</span>
            <span>微信支付</span>
          </label>
          <label class="payment-option">
            <input type="radio" v-model="paymentMethod" value="alipay" />
            <span class="pay-icon">💙</span>
            <span>支付宝</span>
          </label>
        </div>
        <button class="confirm-pay-btn" @click="confirmPayment">确认支付 ¥{{ route.price * booking.count }}</button>
      </div>
    </div>

    <!-- Success Toast -->
    <div v-if="showSuccess" class="toast">✓ 预订成功！订单已生成</div>
  </div>
</template>

<script>
export default {
  name: 'RouteDetailPage',
  data() {
    return {
      showPayment: false,
      showSuccess: false,
      favorited: false,
      paymentMethod: 'wechat',
      booking: {
        date: '',
        count: 2,
      },
      route: {
        id: 1,
        title: '三亚5日精华游',
        tags: ['海边', '度假', '亲子'],
        days: 5,
        nights: 4,
        price: 2980,
        color: '#4A8FA8',
        description: '深度探索三亚最美海湾与人文景观，从繁华的亚龙湾到浪漫的天涯海角，再到神秘的蜈支洲岛，五天四夜带您体验最美海南。',
        itinerary: [
          {
            day: 1,
            title: '抵达三亚',
            activities: [
              { time: '14:00', desc: '抵达三亚凤凰国际机场，专车接送至酒店' },
              { time: '16:00', desc: '入住三亚海景酒店，休息整理' },
              { time: '18:30', desc: '前往大东海海鲜广场享用晚餐' },
              { time: '20:00', desc: '三亚湾夜游，感受椰城夜景' },
            ]
          },
          {
            day: 2,
            title: '亚龙湾·天涯海角',
            activities: [
              { time: '08:30', desc: '早餐后前往亚龙湾，享受白沙碧海' },
              { time: '11:00', desc: '亚龙湾热带天堂森林公园游览' },
              { time: '14:00', desc: '前往天涯海角景区参观' },
              { time: '17:00', desc: '返回市区，大茅远洋生态村晚餐' },
            ]
          },
          {
            day: 3,
            title: '蜈支洲岛一日游',
            activities: [
              { time: '08:00', desc: '早起出发，前往海棠湾乘船至蜈支洲岛' },
              { time: '09:30', desc: '岛上自由活动：游泳、浮潜、玻璃底船' },
              { time: '12:00', desc: '岛上餐厅享用午餐' },
              { time: '14:00', desc: '下午继续岛上项目：摩托艇、香蕉船' },
              { time: '17:00', desc: '乘船返回，前往三亚湾海鲜广场晚餐' },
            ]
          },
          {
            day: 4,
            title: '南山文化苑·大小洞天',
            activities: [
              { time: '09:00', desc: '前往南山文化苑，参观108米海上观音' },
              { time: '12:00', desc: '南山素斋体验' },
              { time: '14:00', desc: '大小洞天景区游览，崖壁石刻' },
              { time: '17:30', desc: '返回市区，免税店购物' },
            ]
          },
          {
            day: 5,
            title: '返程',
            activities: [
              { time: '09:00', desc: '酒店享用早餐，办理退房' },
              { time: '10:00', desc: '前往三亚市内特色小店，购买伴手礼' },
              { time: '12:00', desc: '专车接送至机场' },
              { time: '14:00', desc: '乘机返回，美好旅程结束' },
            ]
          }
        ],
        costIncluded: [
          '全程双人间酒店住宿（4晚）',
          '蜈支洲岛船票及景区门票',
          '南山文化苑门票',
          '天涯海角景区门票',
          '全程专车接送',
          '专业导游服务',
        ],
        costExcluded: [
          '往返机票及保险',
          '个人消费及购物',
          '景区内可选游乐项目',
          '午晚餐（除特别注明）',
          '个人旅游意外险',
        ],
        reviews: [
          { name: '刘婷婷', rating: 5, date: '2024-03-15', text: '行程安排得非常合理，导游很专业热情，海水超级清澈，下次还会选择这个线路！' },
          { name: '陈建国', rating: 4, date: '2024-02-28', text: '整体体验很好，酒店位置不错，蜈支洲岛是亮点，就是人有点多。' },
          { name: '王芳', rating: 5, date: '2024-01-20', text: '带父母来的，老人家玩得很开心，行程不累，景点选择很精华，推荐！' },
        ]
      }
    }
  },
  computed: {
    totalPrice() {
      return this.route.price
    }
  },
  methods: {
    decreaseCount() {
      if (this.booking.count > 1) this.booking.count--
    },
    increaseCount() {
      this.booking.count++
    },
    confirmPayment() {
      this.showPayment = false
      this.showSuccess = true
      setTimeout(() => { this.showSuccess = false }, 3000)
    }
  }
}
</script>

<style scoped>
.route-detail-page {
  min-height: 100%;
}
.page-layout {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  padding: 24px;
  max-width: 1440px;
  margin: 0 auto;
}
.main-content {
  flex: 1;
  min-width: 0;
}
.hero-placeholder {
  height: 360px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: flex-end;
  padding: 32px;
  margin-bottom: 24px;
}
.hero-title {
  color: var(--color-white);
  font-size: 28px;
}
.content-section {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 24px;
  margin-bottom: 20px;
}
.route-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}
.tag {
  padding: 3px 10px;
  background: #EBF4F8;
  color: var(--color-primary);
  border-radius: 20px;
  font-size: 13px;
}
.duration-badge {
  padding: 3px 10px;
  background: #FEF0E7;
  color: var(--color-accent);
  border-radius: 20px;
  font-size: 13px;
}
.route-desc {
  font-size: 14px;
  color: var(--color-text-light);
  line-height: 1.7;
}
.section-title {
  font-size: 16px;
  color: var(--color-text);
  margin-bottom: 20px;
}
.timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
}
.timeline-item {
  display: flex;
  gap: 16px;
  padding-bottom: 20px;
  position: relative;
}
.timeline-item::before {
  content: '';
  position: absolute;
  left: 19px;
  top: 40px;
  bottom: 0;
  width: 2px;
  background: var(--color-border);
}
.timeline-item:last-child::before {
  display: none;
}
.day-badge {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-primary);
  color: var(--color-white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: var(--font-weight-semibold);
  flex-shrink: 0;
  z-index: 1;
}
.day-content {
  flex: 1;
}
.day-title {
  font-size: 15px;
  margin-bottom: 10px;
  font-weight: var(--font-weight-semibold);
}
.activity-list {
  list-style: none;
}
.activity-item {
  display: flex;
  gap: 12px;
  padding: 4px 0;
  font-size: 14px;
}
.activity-time {
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
  min-width: 50px;
}
.activity-desc {
  color: var(--color-text);
}
.cost-table {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
.cost-col ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.cost-col li {
  font-size: 14px;
  color: var(--color-text);
  padding-left: 4px;
}
.cost-title {
  font-size: 14px;
  font-weight: var(--font-weight-semibold);
  margin-bottom: 12px;
}
.cost-title.included { color: #27AE60; }
.cost-title.excluded { color: #E74C3C; }
.review-card {
  padding: 16px 0;
  border-bottom: 1px solid var(--color-border);
}
.review-card:last-child { border-bottom: none; }
.review-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}
.review-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-primary);
  color: var(--color-white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
}
.review-name {
  font-size: 14px;
  font-weight: var(--font-weight-medium);
}
.star-row {
  display: flex;
  gap: 2px;
  margin-top: 2px;
}
.star { color: var(--color-border); font-size: 13px; }
.star.filled { color: #F5A623; }
.review-date {
  margin-left: auto;
  font-size: 12px;
  color: var(--color-text-light);
}
.review-text {
  font-size: 14px;
  color: var(--color-text-light);
  line-height: 1.6;
}
.booking-bar {
  width: 300px;
  flex-shrink: 0;
  position: sticky;
  top: 24px;
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.price-display {
  text-align: center;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border);
}
.price-label {
  font-size: 12px;
  color: var(--color-text-light);
  display: block;
  margin-bottom: 4px;
}
.price-main {
  font-size: 16px;
  color: var(--color-accent);
  font-weight: var(--font-weight-semibold);
}
.price-num {
  font-size: 28px;
}
.price-main small {
  font-size: 12px;
  font-weight: var(--font-weight-normal);
  color: var(--color-text-light);
}
.booking-fields {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.field-label {
  font-size: 13px;
  color: var(--color-text-light);
}
.field-input {
  height: 36px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 0 10px;
  font-size: 14px;
  font-family: inherit;
}
.field-input:focus {
  outline: none;
  border-color: var(--color-primary);
}
.counter {
  display: flex;
  align-items: center;
  gap: 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  overflow: hidden;
  width: fit-content;
}
.counter-btn {
  width: 36px;
  height: 36px;
  background: var(--color-bg);
  border: none;
  font-size: 18px;
  color: var(--color-text);
  display: flex;
  align-items: center;
  justify-content: center;
}
.counter-btn:hover {
  background: var(--color-border);
}
.counter-num {
  width: 40px;
  text-align: center;
  font-size: 15px;
  font-weight: var(--font-weight-medium);
}
.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: var(--color-text-light);
  padding-top: 4px;
  border-top: 1px solid var(--color-border);
}
.total-price {
  font-size: 18px;
  color: var(--color-accent);
  font-weight: var(--font-weight-semibold);
}
.book-btn {
  padding: 12px 0;
  background: var(--color-accent);
  color: var(--color-white);
  border: none;
  border-radius: var(--radius-md);
  font-size: 16px;
  font-weight: var(--font-weight-medium);
  transition: opacity 0.2s;
}
.book-btn:hover { opacity: 0.9; }
.favorite-btn {
  padding: 10px 0;
  background: var(--color-white);
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-md);
  font-size: 14px;
}
.favorite-btn:hover { background: #EBF4F8; }
.trust-text {
  text-align: center;
  font-size: 12px;
  color: var(--color-text-light);
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
.payment-modal {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  width: 480px;
  max-width: 100%;
  padding: 0 0 24px;
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
  color: var(--color-text-light);
  cursor: pointer;
  padding: 4px 8px;
}
.order-summary {
  padding: 16px 20px;
  background: var(--color-bg);
  margin: 0 20px;
  border-radius: var(--radius-md);
  margin-top: 16px;
}
.order-summary h3 {
  font-size: 15px;
  margin-bottom: 8px;
}
.order-summary p {
  font-size: 13px;
  color: var(--color-text-light);
  margin-bottom: 4px;
}
.summary-price {
  font-size: 14px !important;
  color: var(--color-text) !important;
  margin-top: 8px;
}
.summary-price strong {
  color: var(--color-accent);
  font-size: 16px;
}
.payment-methods {
  padding: 16px 20px;
}
.payment-methods h4 {
  font-size: 14px;
  margin-bottom: 12px;
  color: var(--color-text-light);
}
.payment-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  margin-bottom: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: border-color 0.2s;
}
.payment-option:hover {
  border-color: var(--color-primary);
}
.pay-icon { font-size: 20px; }
.confirm-pay-btn {
  display: block;
  width: calc(100% - 40px);
  margin: 0 20px;
  padding: 12px 0;
  background: var(--color-accent);
  color: var(--color-white);
  border: none;
  border-radius: var(--radius-md);
  font-size: 15px;
  font-weight: var(--font-weight-medium);
}
.confirm-pay-btn:hover { opacity: 0.9; }
.toast {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  background: #27AE60;
  color: white;
  padding: 12px 24px;
  border-radius: var(--radius-md);
  font-size: 14px;
  z-index: 3000;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
@media (max-width: 900px) {
  .page-layout {
    flex-direction: column;
  }
  .booking-bar {
    width: 100%;
    position: static;
  }
  .cost-table {
    grid-template-columns: 1fr;
  }
}
</style>
