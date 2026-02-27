<template>
  <div class="home-page">
    <!-- Filter Hero Section -->
    <section class="hero-section">
      <div class="filter-card">
        <h2 class="filter-title">定制您的海南之旅</h2>
        <div class="filter-row">
          <div class="filter-group">
            <label class="filter-label">行程天数</label>
            <select v-model="filters.days" class="filter-select">
              <option value="">请选择</option>
              <option value="3">3天</option>
              <option value="5">5天</option>
              <option value="7">7天</option>
              <option value="10">10天</option>
            </select>
          </div>
          <div class="filter-group">
            <label class="filter-label">出发城市</label>
            <input v-model="filters.city" class="filter-input" placeholder="请输入出发城市" type="text" />
          </div>
          <div class="filter-group">
            <label class="filter-label">出行日期</label>
            <input v-model="filters.date" class="filter-input" type="date" />
          </div>
        </div>
        <div class="filter-group pref-group">
          <label class="filter-label">旅行偏好</label>
          <div class="pref-tags">
            <button
              v-for="pref in preferences"
              :key="pref"
              class="pref-tag"
              :class="{ selected: filters.preferences.includes(pref) }"
              @click="togglePref(pref)"
            >{{ pref }}</button>
          </div>
        </div>
        <button class="generate-btn" @click="generateRoute">生成我的专属线路</button>
      </div>
    </section>

    <!-- Route Cards Grid -->
    <section class="section">
      <div class="section-header">
        <h2 class="section-title">推荐线路</h2>
        <router-link to="/routes" class="view-more">查看更多 →</router-link>
      </div>
      <div class="route-grid">
        <div v-for="route in routes" :key="route.id" class="route-card">
          <div class="card-cover" :style="route.image ? {} : { background: route.color }">
            <img v-if="route.image" :src="route.image" :alt="route.title" class="card-img" />
            <span class="card-cover-title">{{ route.name }}</span>
          </div>
          <div class="card-body">
            <h3 class="card-title">{{ route.title }}</h3>
            <div class="card-tags">
              <span v-for="tag in route.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
            <p class="card-desc">{{ route.highlights }}</p>
            <div class="card-footer">
              <span class="card-price">¥{{ route.price }}<small>/人起</small></span>
              <router-link :to="'/route/' + route.id" class="detail-btn">查看详情</router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Bottom Two Columns -->
    <section class="section two-col-section">
      <div class="col-left">
        <h2 class="section-title">热门景点速览</h2>
        <ul class="attraction-list">
          <li v-for="a in topAttractions" :key="a.id" class="attraction-item">
            <div class="attraction-info">
              <span class="attraction-name">{{ a.name }}</span>
              <span class="attraction-area">{{ a.area }}</span>
            </div>
            <div class="star-row">
              <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= a.rating }">★</span>
              <span class="rating-num">{{ a.rating }}.0</span>
            </div>
          </li>
        </ul>
      </div>
      <div class="col-right">
        <h2 class="section-title">用户真实评价</h2>
        <div v-for="review in reviews" :key="review.id" class="review-card">
          <div class="review-header">
            <div class="review-avatar">{{ review.name ? review.name[0] : '?' }}</div>
            <div>
              <div class="review-name">{{ review.name || '匿名用户' }}</div>
              <div class="star-row">
                <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= (review.rating || 0) }">★</span>
              </div>
            </div>
          </div>
          <p class="review-text">{{ review.text || '' }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      preferences: ['海边度假', '雨林探险', '人文古迹', '亲子遛娃', '美食探店'],
      filters: {
        days: '',
        city: '',
        date: '',
        preferences: [],
      },
      routes: [
        { id: 1, name: '三亚精华', title: '三亚5日精华游', tags: ['海边', '度假'], highlights: '亚龙湾·天涯海角·蜈支洲岛三大必游地', price: 2980, color: '#4A8FA8', image: 'https://picsum.photos/seed/sanya/400/360' },
        { id: 2, name: '海口文化', title: '海口人文3日游', tags: ['人文', '美食'], highlights: '骑楼老街·五公祠·冯小刚电影公社', price: 1580, color: '#5B9E6E', image: 'https://picsum.photos/seed/haikou/400/360' },
        { id: 3, name: '雨林探秘', title: '五指山雨林7日行', tags: ['雨林', '探险'], highlights: '五指山国家公园·黎族村寨·热带植物园', price: 3680, color: '#8B6E4A', image: 'https://picsum.photos/seed/wuzhishan/400/360' },
        { id: 4, name: '亲子乐园', title: '万宁亲子5日游', tags: ['亲子', '海边'], highlights: '石梅湾·日月湾·冲浪体验·神州半岛', price: 3280, color: '#A84A8F', image: 'https://picsum.photos/seed/wanning/400/360' },
        { id: 5, name: '美食之旅', title: '全岛美食5日探店', tags: ['美食', '文化'], highlights: '文昌鸡·加积鸭·东山羊·海鲜大排档', price: 2180, color: '#E8824A', image: 'https://picsum.photos/seed/hainanfood/400/360' },
        { id: 6, name: '环岛骑行', title: '海南环岛10日骑行', tags: ['运动', '自然'], highlights: '沿海公路骑行·环岛最美公路·民宿体验', price: 4580, color: '#4A6EA8', image: 'https://picsum.photos/seed/cycling/400/360' },
      ],
      topAttractions: [
        { id: 1, name: '亚龙湾', area: '三亚', rating: 5 },
        { id: 2, name: '天涯海角', area: '三亚', rating: 4 },
        { id: 3, name: '蜈支洲岛', area: '三亚', rating: 5 },
        { id: 4, name: '骑楼老街', area: '海口', rating: 4 },
        { id: 5, name: '五指山', area: '五指山市', rating: 4 },
      ],
      reviews: [
        { id: 1, name: '张小明', rating: 5, text: '三亚的海水真的太美了，清澈见底，沙滩洁白细腻，下次还会来！推荐蜈支洲岛。' },
        { id: 2, name: '李晓华', rating: 4, text: '第一次带孩子来海南，万宁的亲子活动非常丰富，孩子玩得很开心，服务也很贴心。' },
        { id: 3, name: '王芳', rating: 5, text: '海口的骑楼老街充满了历史感，各种热带水果和小吃物美价廉，强烈推荐！' },
        { id: 4, name: '陈志远', rating: 4, text: '五指山的雨林非常震撼，空气清新，适合逃离城市喧嚣，体验黎族文化也很有特色。' },
      ],
    }
  },
  methods: {
    togglePref(pref) {
      const idx = this.filters.preferences.indexOf(pref)
      if (idx > -1) {
        this.filters.preferences.splice(idx, 1)
      } else {
        this.filters.preferences.push(pref)
      }
    },
    generateRoute() {
      this.$router.push('/routes')
    }
  }
}
</script>

<style scoped>
.home-page {
  min-height: 100%;
}
.hero-section {
  height: 320px;
  background: #E8F4F8;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}
.filter-card {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  padding: 24px 32px;
  width: 100%;
  max-width: 860px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}
.filter-title {
  font-size: 18px;
  color: var(--color-primary);
  margin-bottom: 16px;
}
.filter-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}
.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 140px;
}
.pref-group {
  flex: none;
  width: 100%;
}
.filter-label {
  font-size: 13px;
  color: var(--color-text-light);
  font-weight: var(--font-weight-medium);
}
.filter-select,
.filter-input {
  height: 36px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 0 10px;
  font-size: 14px;
  color: var(--color-text);
  background: var(--color-white);
  outline: none;
}
.filter-select:focus,
.filter-input:focus {
  border-color: var(--color-primary);
}
.pref-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.pref-tag {
  padding: 5px 14px;
  border: 1px solid var(--color-border);
  border-radius: 20px;
  font-size: 13px;
  background: var(--color-white);
  color: var(--color-text);
  transition: all 0.2s;
}
.pref-tag.selected {
  background: var(--color-primary);
  color: var(--color-white);
  border-color: var(--color-primary);
}
.generate-btn {
  margin-top: 16px;
  padding: 10px 32px;
  background: var(--color-accent);
  color: var(--color-white);
  border: none;
  border-radius: var(--radius-md);
  font-size: 15px;
  font-weight: var(--font-weight-medium);
  transition: opacity 0.2s;
}
.generate-btn:hover {
  opacity: 0.9;
}
.section {
  padding: 32px 32px;
  max-width: 1440px;
  margin: 0 auto;
}
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.section-title {
  font-size: 18px;
  color: var(--color-text);
}
.view-more {
  font-size: 13px;
  color: var(--color-primary);
}
.route-grid {
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
  box-shadow: var(--shadow-hover);
}
.card-cover {
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}
.card-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.card-cover-title {
  color: var(--color-white);
  font-size: 20px;
  font-weight: var(--font-weight-semibold);
  position: relative;
  text-shadow: 0 1px 4px rgba(0,0,0,0.5);
  z-index: 1;
}
.card-body {
  padding: 16px;
}
.card-title {
  font-size: 15px;
  margin-bottom: 8px;
}
.card-tags {
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
.card-desc {
  font-size: 13px;
  color: var(--color-text-light);
  margin-bottom: 12px;
  line-height: 1.5;
}
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
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
.two-col-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}
.col-left, .col-right {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 20px;
}
.attraction-list {
  list-style: none;
  margin-top: 16px;
}
.attraction-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid var(--color-border);
}
.attraction-item:last-child {
  border-bottom: none;
}
.attraction-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.attraction-name {
  font-size: 14px;
  font-weight: var(--font-weight-medium);
}
.attraction-area {
  font-size: 12px;
  color: var(--color-text-light);
}
.star-row {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-top: 4px;
}
.star {
  color: var(--color-border);
  font-size: 14px;
}
.star.filled {
  color: #F5A623;
}
.rating-num {
  font-size: 13px;
  color: var(--color-text-light);
  margin-left: 4px;
}
.review-card {
  padding: 12px 0;
  border-bottom: 1px solid var(--color-border);
}
.review-card:last-child {
  border-bottom: none;
}
.review-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}
.review-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-primary);
  color: var(--color-white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  flex-shrink: 0;
}
.review-name {
  font-size: 14px;
  font-weight: var(--font-weight-medium);
}
.review-text {
  font-size: 13px;
  color: var(--color-text-light);
  line-height: 1.6;
  margin-top: 4px;
}
@media (max-width: 900px) {
  .route-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .two-col-section {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 600px) {
  .route-grid {
    grid-template-columns: 1fr;
  }
  .section {
    padding: 20px 16px;
  }
  .hero-section {
    height: auto;
    padding: 20px 16px;
  }
  .filter-card {
    padding: 16px;
  }
}
</style>
