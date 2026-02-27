<template>
  <div class="attractions-page">
    <div class="page-layout">
      <!-- Left Filter Sidebar -->
      <aside class="filter-sidebar">
        <h3 class="filter-title">筛选条件</h3>

        <div class="filter-section">
          <div class="filter-section-title">地区</div>
          <label v-for="area in areas" :key="area" class="check-label">
            <input type="checkbox" v-model="filters.areas" :value="area" />
            <span>{{ area }}</span>
          </label>
        </div>

        <div class="filter-section">
          <div class="filter-section-title">类型</div>
          <label v-for="type in types" :key="type" class="check-label">
            <input type="checkbox" v-model="filters.types" :value="type" />
            <span>{{ type }}</span>
          </label>
        </div>

        <div class="filter-section">
          <div class="filter-section-title">价格区间</div>
          <label v-for="price in priceRanges" :key="price.value" class="check-label">
            <input type="radio" v-model="filters.price" :value="price.value" />
            <span>{{ price.label }}</span>
          </label>
        </div>

        <div class="filter-section">
          <div class="filter-section-title">评分</div>
          <label v-for="r in ratingOptions" :key="r.value" class="check-label">
            <input type="radio" v-model="filters.rating" :value="r.value" />
            <span>{{ r.label }}</span>
          </label>
        </div>

        <div class="filter-actions">
          <button class="reset-btn" @click="resetFilters">重置</button>
          <button class="confirm-btn" @click="applyFilters">确认筛选</button>
        </div>
      </aside>

      <!-- Right Content -->
      <div class="content-area">
        <div class="content-header">
          <span class="result-count">共 {{ filteredAttractions.length }} 个景点</span>
          <div class="sort-bar">
            <button
              v-for="s in sortOptions"
              :key="s.value"
              class="sort-btn"
              :class="{ active: sort === s.value }"
              @click="sort = s.value"
            >{{ s.label }}</button>
          </div>
        </div>

        <div class="attraction-list">
          <div v-for="attraction in sortedAttractions" :key="attraction.id" class="attraction-card">
            <div class="card-image" :style="attraction.image ? {} : { background: attraction.color }">
              <img v-if="attraction.image" :src="attraction.image" :alt="attraction.name" class="card-img" />
              <span v-else class="img-label">{{ attraction.name[0] }}</span>
            </div>
            <div class="card-info">
              <div class="card-top">
                <h3 class="card-name">{{ attraction.name }}</h3>
                <div class="card-tags">
                  <span class="area-tag">{{ attraction.area }}</span>
                  <span v-for="t in attraction.types" :key="t" class="type-tag">{{ t }}</span>
                </div>
              </div>
              <div class="card-rating">
                <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= attraction.rating }">★</span>
                <span class="rating-text">{{ attraction.rating }}.{{ attraction.ratingDecimal }}</span>
              </div>
              <p class="card-desc">{{ attraction.description }}</p>
              <div class="card-footer">
                <span class="price-text">
                  {{ attraction.price === 0 ? '免费' : '¥' + attraction.price }}
                </span>
                <div class="card-actions">
                  <button class="action-btn primary-btn" @click="openDetail(attraction)">查看详情</button>
                  <button class="action-btn outline-btn" @click="toggleFavorite(attraction)">
                    {{ attraction.favorited ? '已收藏' : '收藏' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <div v-if="selectedAttraction" class="modal-overlay" @click.self="selectedAttraction = null">
      <div class="modal">
        <div class="modal-header">
          <h2>{{ selectedAttraction.name }}</h2>
          <button class="close-btn" @click="selectedAttraction = null">✕</button>
        </div>
        <div class="modal-body">
          <div class="modal-image" :style="selectedAttraction.image ? {} : { background: selectedAttraction.color }">
            <img v-if="selectedAttraction.image" :src="selectedAttraction.image" :alt="selectedAttraction.name" class="modal-img" />
            <button class="carousel-btn prev">‹</button>
            <span class="modal-img-label">{{ selectedAttraction.name }}</span>
            <button class="carousel-btn next">›</button>
          </div>
          <div class="modal-sections">
            <div class="info-section">
              <h4>基本信息</h4>
              <p>地区：{{ selectedAttraction.area }} | 类型：{{ selectedAttraction.types.join('、') }}</p>
              <p>{{ selectedAttraction.description }}</p>
            </div>
            <div class="info-section">
              <h4>开放时间</h4>
              <p>{{ selectedAttraction.openTime }}</p>
            </div>
            <div class="info-section">
              <h4>门票价格</h4>
              <p>{{ selectedAttraction.price === 0 ? '免费开放' : '成人票：¥' + selectedAttraction.price + '元' }}</p>
            </div>
            <div class="info-section">
              <h4>交通指南</h4>
              <p>{{ selectedAttraction.transport }}</p>
            </div>
            <div class="info-section">
              <h4>用户评价</h4>
              <div v-for="r in selectedAttraction.reviews" :key="r.name" class="modal-review">
                <div class="review-header">
                  <span class="review-name">{{ r.name }}</span>
                  <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= r.rating }">★</span>
                </div>
                <p class="review-text">{{ r.text }}</p>
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
  name: 'AttractionsPage',
  data() {
    return {
      areas: ['海口', '三亚', '万宁', '文昌', '陵水', '琼海'],
      types: ['海滩', '景区', '博物馆', '公园', '购物'],
      priceRanges: [
        { label: '免费', value: 'free' },
        { label: '0-50元', value: '0-50' },
        { label: '50-200元', value: '50-200' },
        { label: '200元以上', value: '200+' },
      ],
      ratingOptions: [
        { label: '4星以上', value: 4 },
        { label: '3星以上', value: 3 },
        { label: '全部', value: 0 },
      ],
      sortOptions: [
        { label: '综合排序', value: 'default' },
        { label: '评分最高', value: 'rating' },
        { label: '价格最低', value: 'price' },
      ],
      filters: {
        areas: [],
        types: [],
        price: '',
        rating: 0,
      },
      sort: 'default',
      selectedAttraction: null,
      attractions: [
        {
          id: 1, name: '亚龙湾', area: '三亚', types: ['海滩'], rating: 5, ratingDecimal: 0,
          price: 0, color: '#4A8FA8', image: 'https://picsum.photos/seed/yalong/240/180',
          description: '被誉为"天下第一湾"，海水清澈，沙质细腻，是三亚最美的海滩之一。',
          openTime: '全天开放（景区内设施8:00-18:00）',
          transport: '从三亚市区乘坐25路公交车约40分钟可达，也可打车约30元。',
          favorited: false,
          reviews: [
            { name: '王小红', rating: 5, text: '海水超级清澈，沙滩特别细，是我见过最美的海湾！' },
            { name: '李明', rating: 5, text: '风景绝美，设施完善，强烈推荐！' }
          ]
        },
        {
          id: 2, name: '天涯海角', area: '三亚', types: ['景区'], rating: 4, ratingDecimal: 5,
          price: 81, color: '#5B9E6E', image: 'https://picsum.photos/seed/tianya/240/180',
          description: '中国传统文化中爱情的象征，奇石矗立于海边，景色壮观。',
          openTime: '7:30-18:00（旺季延至19:00）',
          transport: '从三亚市区乘坐26路公交车可直达，车程约50分钟。',
          favorited: false,
          reviews: [
            { name: '张丽', rating: 4, text: '天涯海角的石头很有特色，和爱人一起来很浪漫。' },
            { name: '赵刚', rating: 5, text: '景色非常壮观，黄昏时分来最美。' }
          ]
        },
        {
          id: 3, name: '蜈支洲岛', area: '三亚', types: ['海滩', '景区'], rating: 5, ratingDecimal: 0,
          price: 210, color: '#A84A8F', image: 'https://picsum.photos/seed/wuzhizhou/240/180',
          description: '三亚最美小岛，珊瑚礁丰富，是潜水爱好者的天堂。',
          openTime: '8:00-17:00，票含快艇来回',
          transport: '从海棠湾乘坐快艇约10分钟，景区有统一摆渡船。',
          favorited: false,
          reviews: [
            { name: '陈小华', rating: 5, text: '岛上景色美不胜收，潜水看到了很多热带鱼！' }
          ]
        },
        {
          id: 4, name: '骑楼老街', area: '海口', types: ['景区', '购物'], rating: 4, ratingDecimal: 0,
          price: 0, color: '#E8824A', image: 'https://picsum.photos/seed/qilou/240/180',
          description: '海口历史文化名片，保存完好的南洋骑楼建筑群，美食云集。',
          openTime: '全天开放',
          transport: '市区内步行或乘公交均可到达，B2路公交中山路站下车。',
          favorited: false,
          reviews: [
            { name: '吴小敏', rating: 4, text: '骑楼建筑很有特色，椰子鸡火锅超好吃！' }
          ]
        },
        {
          id: 5, name: '五公祠', area: '海口', types: ['博物馆', '景区'], rating: 4, ratingDecimal: 0,
          price: 20, color: '#8B6E4A', image: 'https://picsum.photos/seed/wugongci/240/180',
          description: '海南省最大的历史类展览馆，纪念被贬至琼的五位历史名臣。',
          openTime: '8:30-17:30，周一闭馆',
          transport: '乘坐海口市内公交12路、33路至五公祠站下车。',
          favorited: false,
          reviews: [
            { name: '刘历史迷', rating: 5, text: '了解海南历史的好地方，展品丰富，值得一游。' }
          ]
        },
        {
          id: 6, name: '石梅湾', area: '万宁', types: ['海滩'], rating: 4, ratingDecimal: 5,
          price: 0, color: '#4A6EA8', image: 'https://picsum.photos/seed/shimei/240/180',
          description: '万宁最美的海湾，拥有中国最完整的原始热带海岸森林。',
          openTime: '全天开放',
          transport: '从万宁市区打车约25分钟，车程约30元。',
          favorited: false,
          reviews: [
            { name: '冲浪爱好者', rating: 5, text: '浪特别好，是冲浪的圣地！海湾景色也很美。' }
          ]
        },
        {
          id: 7, name: '东郊椰林', area: '文昌', types: ['景区', '公园'], rating: 4, ratingDecimal: 0,
          price: 30, color: '#6E8B4A', image: 'https://picsum.photos/seed/dongjiao/240/180',
          description: '文昌椰子之乡，万亩椰林连片，可骑行穿越椰林，品尝新鲜椰子。',
          openTime: '8:00-18:00',
          transport: '从文昌市区乘坐公交约40分钟，或打车约25元。',
          favorited: false,
          reviews: [
            { name: '骑行达人', rating: 4, text: '骑着小车穿越椰林，椰子超级甜，很惬意！' }
          ]
        },
        {
          id: 8, name: '分界洲岛', area: '陵水', types: ['海滩', '景区'], rating: 4, ratingDecimal: 5,
          price: 180, color: '#4A8F6E', image: 'https://picsum.photos/seed/fenjie/240/180',
          description: '中国首个热带海洋性气候的分界线，岛屿景色独特，潜水资源丰富。',
          openTime: '8:00-17:00',
          transport: '从牛岭隧道北侧乘坐游船约20分钟到达。',
          favorited: false,
          reviews: [
            { name: '潜水发烧友', rating: 5, text: '珊瑚礁完整，能见度高，是潜水圣地！' }
          ]
        },
      ],
    }
  },
  computed: {
    filteredAttractions() {
      return this.attractions.filter(a => {
        if (this.filters.areas.length && !this.filters.areas.includes(a.area)) return false
        if (this.filters.types.length && !this.filters.types.some(t => a.types.includes(t))) return false
        if (this.filters.price) {
          if (this.filters.price === 'free' && a.price !== 0) return false
          if (this.filters.price === '0-50' && (a.price === 0 || a.price > 50)) return false
          if (this.filters.price === '50-200' && (a.price < 50 || a.price > 200)) return false
          if (this.filters.price === '200+' && a.price <= 200) return false
        }
        if (this.filters.rating && a.rating < this.filters.rating) return false
        return true
      })
    },
    sortedAttractions() {
      const list = [...this.filteredAttractions]
      if (this.sort === 'rating') list.sort((a, b) => b.rating - a.rating || b.ratingDecimal - a.ratingDecimal)
      else if (this.sort === 'price') list.sort((a, b) => a.price - b.price)
      return list
    }
  },
  methods: {
    resetFilters() {
      this.filters = { areas: [], types: [], price: '', rating: 0 }
    },
    applyFilters() {
      // filters are reactive, already applied
    },
    openDetail(attraction) {
      this.selectedAttraction = attraction
    },
    toggleFavorite(attraction) {
      attraction.favorited = !attraction.favorited
    }
  }
}
</script>

<style scoped>
.attractions-page {
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
.filter-sidebar {
  width: 280px;
  flex-shrink: 0;
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 20px;
}
.filter-title {
  font-size: 16px;
  margin-bottom: 16px;
  color: var(--color-text);
}
.filter-section {
  margin-bottom: 20px;
}
.filter-section-title {
  font-size: 13px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-light);
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.check-label {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  font-size: 14px;
  cursor: pointer;
}
.check-label input {
  accent-color: var(--color-primary);
}
.filter-actions {
  display: flex;
  gap: 10px;
}
.reset-btn {
  flex: 1;
  padding: 8px 0;
  border: 1px solid var(--color-border);
  background: var(--color-white);
  border-radius: var(--radius-sm);
  font-size: 14px;
  color: var(--color-text-light);
}
.confirm-btn {
  flex: 1;
  padding: 8px 0;
  border: none;
  background: var(--color-primary);
  color: var(--color-white);
  border-radius: var(--radius-sm);
  font-size: 14px;
}
.content-area {
  flex: 1;
  min-width: 0;
}
.content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.result-count {
  font-size: 14px;
  color: var(--color-text-light);
}
.sort-bar {
  display: flex;
  gap: 4px;
}
.sort-btn {
  padding: 5px 12px;
  border: 1px solid var(--color-border);
  background: var(--color-white);
  border-radius: var(--radius-sm);
  font-size: 13px;
  color: var(--color-text-light);
}
.sort-btn.active {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: #EBF4F8;
}
.attraction-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.attraction-card {
  display: flex;
  gap: 16px;
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: box-shadow 0.2s;
}
.attraction-card:hover {
  box-shadow: var(--shadow-hover);
}
.card-image {
  width: 120px;
  min-height: 90px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}
.card-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.img-label {
  color: var(--color-white);
  font-size: 28px;
  font-weight: var(--font-weight-semibold);
}
.card-info {
  flex: 1;
  padding: 14px 16px 14px 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.card-top {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.card-name {
  font-size: 15px;
  font-weight: var(--font-weight-semibold);
}
.card-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.area-tag {
  padding: 2px 8px;
  background: #EBF4F8;
  color: var(--color-primary);
  border-radius: 20px;
  font-size: 12px;
}
.type-tag {
  padding: 2px 8px;
  background: #F3F4F6;
  color: var(--color-text-light);
  border-radius: 20px;
  font-size: 12px;
}
.card-rating {
  display: flex;
  align-items: center;
  gap: 2px;
}
.star {
  color: var(--color-border);
  font-size: 14px;
}
.star.filled {
  color: #F5A623;
}
.rating-text {
  font-size: 13px;
  color: var(--color-text-light);
  margin-left: 4px;
}
.card-desc {
  font-size: 13px;
  color: var(--color-text-light);
  line-height: 1.5;
  flex: 1;
}
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.price-text {
  font-size: 16px;
  color: var(--color-accent);
  font-weight: var(--font-weight-semibold);
}
.card-actions {
  display: flex;
  gap: 8px;
}
.action-btn {
  padding: 6px 14px;
  border-radius: var(--radius-sm);
  font-size: 13px;
}
.primary-btn {
  background: var(--color-primary);
  color: var(--color-white);
  border: none;
}
.outline-btn {
  background: var(--color-white);
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
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
.modal {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  width: 800px;
  max-width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border);
}
.modal-header h2 {
  font-size: 18px;
}
.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: var(--color-text-light);
  padding: 4px 8px;
}
.modal-image {
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  position: relative;
  overflow: hidden;
}
.modal-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}
.carousel-btn {
  background: rgba(255,255,255,0.7);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 22px;
  color: var(--color-text);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  z-index: 1;
}
.modal-img-label {
  color: var(--color-white);
  font-size: 22px;
  font-weight: var(--font-weight-semibold);
  text-shadow: 0 1px 4px rgba(0,0,0,0.5);
  position: relative;
  z-index: 1;
}
.modal-sections {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.info-section h4 {
  font-size: 14px;
  color: var(--color-primary);
  margin-bottom: 6px;
  font-weight: var(--font-weight-semibold);
}
.info-section p {
  font-size: 14px;
  color: var(--color-text);
  line-height: 1.6;
}
.modal-review {
  padding: 10px 0;
  border-bottom: 1px solid var(--color-border);
}
.modal-review:last-child {
  border-bottom: none;
}
.review-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}
.review-name {
  font-size: 14px;
  font-weight: var(--font-weight-medium);
}
.review-text {
  font-size: 13px;
  color: var(--color-text-light);
}
@media (max-width: 768px) {
  .page-layout {
    flex-direction: column;
    padding: 16px;
  }
  .filter-sidebar {
    width: 100%;
  }
}
</style>
