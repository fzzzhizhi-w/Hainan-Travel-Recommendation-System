<template>
  <div class="routes-page">
    <!-- Filter Bar -->
    <div class="filter-bar">
      <div class="filter-inner">
        <div class="filter-group">
          <label class="filter-label">行程天数</label>
          <select v-model="filters.days" class="filter-select">
            <option value="">全部</option>
            <option value="3">3天</option>
            <option value="5">5天</option>
            <option value="7">7天</option>
            <option value="10">10天</option>
          </select>
        </div>
        <div class="filter-group">
          <label class="filter-label">旅行偏好</label>
          <select v-model="filters.preference" class="filter-select">
            <option value="">全部</option>
            <option value="海边度假">海边度假</option>
            <option value="雨林探险">雨林探险</option>
            <option value="人文古迹">人文古迹</option>
            <option value="亲子遛娃">亲子遛娃</option>
            <option value="美食探店">美食探店</option>
            <option value="户外运动">户外运动</option>
          </select>
        </div>
        <div class="filter-group">
          <label class="filter-label">价格区间</label>
          <select v-model="filters.price" class="filter-select">
            <option value="">全部</option>
            <option value="low">2000元以下</option>
            <option value="mid">2000-3500元</option>
            <option value="high">3500元以上</option>
          </select>
        </div>
        <div class="filter-group">
          <label class="filter-label">排序方式</label>
          <select v-model="sort" class="filter-select">
            <option value="default">综合推荐</option>
            <option value="price-asc">价格最低</option>
            <option value="price-desc">价格最高</option>
            <option value="rating">评分最高</option>
          </select>
        </div>
        <button class="reset-btn" @click="resetFilters">重置</button>
      </div>
    </div>

    <!-- Recommendation Notice -->
    <div class="rec-notice">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <span>以下线路根据您的偏好智能匹配，所有推荐无付费竞价、无强制置顶，完全基于用户评分与真实出行数据生成</span>
    </div>

    <!-- Routes Grid -->
    <div class="content-area">
      <div class="result-header">
        <span class="result-count">共 {{ sortedRoutes.length }} 条线路</span>
      </div>

      <div v-if="sortedRoutes.length === 0" class="empty-state">
        暂无符合条件的线路，请调整筛选条件
      </div>

      <div class="routes-grid">
        <div v-for="route in sortedRoutes" :key="route.id" class="route-card">
          <div class="card-cover" :style="route.image ? {} : { background: route.color }">
            <img v-if="route.image" :src="route.image" :alt="route.title" class="card-img" />
            <span class="card-cover-title">{{ route.name }}</span>
            <div class="card-badges">
              <span v-if="route.isRecommended" class="badge rec-badge">个性推荐</span>
              <span v-if="route.isSeasonal" class="badge season-badge">当季热门</span>
            </div>
          </div>
          <div class="card-body">
            <h3 class="card-title">{{ route.title }}</h3>
            <div class="card-meta">
              <span class="duration-tag">{{ route.days }}天{{ route.nights }}晚</span>
              <span v-for="tag in route.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
            <p class="card-desc">{{ route.highlights }}</p>
            <div class="card-rating">
              <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= route.rating }">★</span>
              <span class="rating-text">{{ route.rating }}.{{ route.ratingDecimal }} ({{ route.reviewCount }}条评价)</span>
            </div>
            <div class="card-footer">
              <div>
                <span class="card-price">¥{{ route.price }}<small>/人起</small></span>
                <div class="price-tip">明码标价 · 无隐藏费用</div>
              </div>
              <div class="card-actions">
                <router-link :to="'/route/' + route.id" class="detail-btn">查看详情</router-link>
                <button class="fav-btn" @click="toggleFavorite(route)" :title="route.favorited ? '取消收藏' : '加入收藏'">
                  {{ route.favorited ? '♥' : '♡' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RoutesPage',
  data() {
    return {
      filters: {
        days: '',
        preference: '',
        price: '',
      },
      sort: 'default',
      routes: [
        {
          id: 1, name: '三亚精华', title: '三亚5日精华游', tags: ['海边度假'], days: 5, nights: 4,
          highlights: '亚龙湾·天涯海角·蜈支洲岛三大必游地，全程无强制购物', price: 2980, color: '#4A8FA8', image: 'https://picsum.photos/seed/sanya/400/320',
          rating: 5, ratingDecimal: 0, reviewCount: 128, isRecommended: true, isSeasonal: false, favorited: false,
        },
        {
          id: 2, name: '海口文化', title: '海口人文3日游', tags: ['人文古迹', '美食探店'], days: 3, nights: 2,
          highlights: '骑楼老街·五公祠·冯小刚电影公社，深度体验海南人文历史', price: 1580, color: '#5B9E6E', image: 'https://picsum.photos/seed/haikou/400/320',
          rating: 4, ratingDecimal: 5, reviewCount: 86, isRecommended: false, isSeasonal: false, favorited: false,
        },
        {
          id: 3, name: '雨林探秘', title: '五指山雨林7日行', tags: ['雨林探险'], days: 7, nights: 6,
          highlights: '五指山国家公园·黎族村寨·热带植物园，远离城市的自然疗愈之旅', price: 3680, color: '#8B6E4A', image: 'https://picsum.photos/seed/wuzhishan/400/320',
          rating: 4, ratingDecimal: 5, reviewCount: 64, isRecommended: false, isSeasonal: true, favorited: false,
        },
        {
          id: 4, name: '亲子乐园', title: '万宁亲子5日游', tags: ['亲子遛娃', '海边度假'], days: 5, nights: 4,
          highlights: '石梅湾·日月湾·冲浪体验·神州半岛，亲子友好全程无忧', price: 3280, color: '#A84A8F', image: 'https://picsum.photos/seed/wanning/400/320',
          rating: 5, ratingDecimal: 0, reviewCount: 95, isRecommended: true, isSeasonal: false, favorited: false,
        },
        {
          id: 5, name: '美食之旅', title: '全岛美食5日探店', tags: ['美食探店'], days: 5, nights: 4,
          highlights: '文昌鸡·加积鸭·东山羊·海鲜大排档，舌尖上的海南岛', price: 2180, color: '#E8824A', image: 'https://picsum.photos/seed/hainanfood/400/320',
          rating: 4, ratingDecimal: 0, reviewCount: 73, isRecommended: false, isSeasonal: false, favorited: false,
        },
        {
          id: 6, name: '环岛骑行', title: '海南环岛10日骑行', tags: ['户外运动'], days: 10, nights: 9,
          highlights: '沿海公路骑行·环岛最美公路·民宿体验，挑战自我的旅行方式', price: 4580, color: '#4A6EA8', image: 'https://picsum.photos/seed/cycling/400/320',
          rating: 4, ratingDecimal: 5, reviewCount: 41, isRecommended: false, isSeasonal: false, favorited: false,
        },
        {
          id: 7, name: '陵水休闲', title: '陵水清水湾3日休闲游', tags: ['海边度假'], days: 3, nights: 2,
          highlights: '清水湾·香水湾·新村渔港，小众海湾避开人流高峰', price: 1880, color: '#4A8F6E', image: 'https://picsum.photos/seed/lingshui/400/320',
          rating: 4, ratingDecimal: 5, reviewCount: 52, isRecommended: true, isSeasonal: false, favorited: false,
        },
        {
          id: 8, name: '文昌航天', title: '文昌航天科技5日游', tags: ['人文古迹'], days: 5, nights: 4,
          highlights: '文昌航天发射场·东郊椰林·铜鼓岭，科技与自然的完美融合', price: 2580, color: '#6E4A8B', image: 'https://picsum.photos/seed/wenchang/400/320',
          rating: 4, ratingDecimal: 0, reviewCount: 38, isRecommended: false, isSeasonal: false, favorited: false,
        },
      ],
    }
  },
  computed: {
    filteredRoutes() {
      return this.routes.filter(r => {
        if (this.filters.days && String(r.days) !== this.filters.days) return false
        if (this.filters.preference && !r.tags.includes(this.filters.preference)) return false
        if (this.filters.price) {
          if (this.filters.price === 'low' && r.price >= 2000) return false
          if (this.filters.price === 'mid' && (r.price < 2000 || r.price > 3500)) return false
          if (this.filters.price === 'high' && r.price <= 3500) return false
        }
        return true
      })
    },
    sortedRoutes() {
      const list = [...this.filteredRoutes]
      if (this.sort === 'price-asc') list.sort((a, b) => a.price - b.price)
      else if (this.sort === 'price-desc') list.sort((a, b) => b.price - a.price)
      else if (this.sort === 'rating') list.sort((a, b) => b.rating - a.rating || b.ratingDecimal - a.ratingDecimal)
      else list.sort((a, b) => (b.isRecommended ? 1 : 0) - (a.isRecommended ? 1 : 0))
      return list
    }
  },
  methods: {
    resetFilters() {
      this.filters = { days: '', preference: '', price: '' }
      this.sort = 'default'
    },
    toggleFavorite(route) {
      route.favorited = !route.favorited
    }
  }
}
</script>

<style scoped>
.routes-page {
  min-height: 100%;
}
.filter-bar {
  background: var(--color-white);
  border-bottom: 1px solid var(--color-border);
  padding: 16px 32px;
  position: sticky;
  top: 0;
  z-index: 10;
}
.filter-inner {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  flex-wrap: wrap;
  max-width: 1440px;
  margin: 0 auto;
}
.filter-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.filter-label {
  font-size: 12px;
  color: var(--color-text-light);
}
.filter-select {
  height: 34px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 0 10px;
  font-size: 13px;
  color: var(--color-text);
  background: var(--color-white);
  outline: none;
  min-width: 120px;
}
.filter-select:focus {
  border-color: var(--color-primary);
}
.reset-btn {
  height: 34px;
  padding: 0 16px;
  border: 1px solid var(--color-border);
  background: var(--color-white);
  border-radius: var(--radius-sm);
  font-size: 13px;
  color: var(--color-text-light);
  align-self: flex-end;
}
.reset-btn:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
}
.rec-notice {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 32px;
  background: #EBF4F8;
  font-size: 13px;
  color: var(--color-primary);
}
.content-area {
  padding: 24px 32px;
  max-width: 1440px;
  margin: 0 auto;
}
.result-header {
  margin-bottom: 16px;
}
.result-count {
  font-size: 14px;
  color: var(--color-text-light);
}
.empty-state {
  text-align: center;
  padding: 64px 0;
  color: var(--color-text-light);
  font-size: 15px;
}
.routes-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.route-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--color-white);
  transition: box-shadow 0.2s;
}
.route-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}
.card-cover {
  height: 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  gap: 8px;
  overflow: hidden;
}
.card-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}
.card-cover-title {
  color: var(--color-white);
  font-size: 20px;
  font-weight: var(--font-weight-semibold);
  text-shadow: 0 1px 4px rgba(0,0,0,0.5);
  position: relative;
  z-index: 1;
}
.card-badges {
  display: flex;
  gap: 6px;
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 2;
}
.badge {
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: var(--font-weight-medium);
}
.rec-badge {
  background: rgba(255,255,255,0.9);
  color: var(--color-primary);
}
.season-badge {
  background: rgba(255,255,255,0.9);
  color: var(--color-accent);
}
.card-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.card-title {
  font-size: 15px;
  font-weight: var(--font-weight-semibold);
}
.card-meta {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.duration-tag {
  padding: 2px 8px;
  background: #FEF0E7;
  color: var(--color-accent);
  border-radius: 20px;
  font-size: 12px;
}
.tag {
  padding: 2px 8px;
  background: #EBF4F8;
  color: var(--color-primary);
  border-radius: 20px;
  font-size: 12px;
}
.card-desc {
  font-size: 13px;
  color: var(--color-text-light);
  line-height: 1.5;
}
.card-rating {
  display: flex;
  align-items: center;
  gap: 2px;
}
.star {
  color: var(--color-border);
  font-size: 13px;
}
.star.filled {
  color: #F5A623;
}
.rating-text {
  font-size: 12px;
  color: var(--color-text-light);
  margin-left: 4px;
}
.card-footer {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-top: 4px;
}
.card-price {
  font-size: 18px;
  color: var(--color-accent);
  font-weight: var(--font-weight-semibold);
}
.card-price small {
  font-size: 12px;
  font-weight: var(--font-weight-normal);
  color: var(--color-text-light);
}
.price-tip {
  font-size: 11px;
  color: var(--color-text-light);
  margin-top: 2px;
}
.card-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.detail-btn {
  padding: 6px 16px;
  background: var(--color-primary);
  color: var(--color-white);
  border-radius: var(--radius-sm);
  font-size: 13px;
}
.detail-btn:hover {
  opacity: 0.9;
}
.fav-btn {
  width: 32px;
  height: 32px;
  border: 1px solid var(--color-border);
  background: var(--color-white);
  border-radius: var(--radius-sm);
  font-size: 16px;
  color: var(--color-text-light);
  display: flex;
  align-items: center;
  justify-content: center;
}
.fav-btn:hover {
  color: #E74C3C;
  border-color: #E74C3C;
}
@media (max-width: 1100px) {
  .routes-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 700px) {
  .routes-grid {
    grid-template-columns: 1fr;
  }
  .filter-bar {
    padding: 12px 16px;
  }
  .content-area {
    padding: 16px;
  }
  .rec-notice {
    padding: 10px 16px;
  }
}
</style>
