<template>
  <div class="admin-reviews-page">
    <div class="toolbar">
      <div class="toolbar-left">
        <input v-model="searchKeyword" class="search-input" placeholder="线路 / 用户..." type="text" />
        <select v-model="filterStatus" class="filter-select">
          <option value="">全部状态</option>
          <option value="visible">已展示</option>
          <option value="hidden">已隐藏</option>
          <option value="pending">待审核</option>
        </select>
        <select v-model="filterRating" class="filter-select">
          <option value="">全部评分</option>
          <option value="5">5星</option>
          <option value="4">4星</option>
          <option value="3">3星及以下</option>
        </select>
      </div>
      <span class="total-info">共 {{ filteredReviews.length }} 条评价</span>
    </div>

    <div class="review-list">
      <div v-for="review in filteredReviews" :key="review.id" class="review-card">
        <div class="review-top">
          <div class="review-meta">
            <div class="reviewer-info">
              <div class="avatar">{{ review.user[0] }}</div>
              <div>
                <span class="reviewer-name">{{ review.user }}</span>
                <div class="star-row">
                  <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= review.rating }">★</span>
                  <span class="rating-num">{{ review.rating }}分</span>
                </div>
              </div>
            </div>
            <div class="route-info">
              <span class="route-name">{{ review.route }}</span>
              <span class="review-time">{{ review.createdAt }}</span>
            </div>
          </div>
          <div class="review-actions">
            <span class="status-tag" :class="review.status">{{ statusLabels[review.status] }}</span>
            <button v-if="review.status === 'pending'" class="action-btn approve-btn" @click="approveReview(review)">通过</button>
            <button v-if="review.status === 'visible'" class="action-btn hide-btn" @click="hideReview(review)">隐藏</button>
            <button v-if="review.status === 'hidden'" class="action-btn restore-btn" @click="restoreReview(review)">恢复展示</button>
          </div>
        </div>
        <p class="review-content">{{ review.content }}</p>
        <div v-if="review.status === 'hidden'" class="hide-reason">
          <span class="reason-label">隐藏原因：</span>{{ review.hideReason || '违规广告/恶意差评' }}
        </div>
        <div class="review-note">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          仅可对违规评价进行隐藏，无权修改或删除用户真实评价内容
        </div>
      </div>
      <div v-if="filteredReviews.length === 0" class="empty-state">暂无相关评价</div>
    </div>

    <div v-if="toast" class="toast">{{ toast }}</div>
  </div>
</template>

<script>
export default {
  name: 'AdminReviews',
  data() {
    return {
      searchKeyword: '',
      filterStatus: '',
      filterRating: '',
      toast: '',
      statusLabels: { visible: '已展示', hidden: '已隐藏', pending: '待审核' },
      reviews: [
        { id: 1, user: '张**', route: '三亚5日精华游', rating: 5, createdAt: '2024-03-15', status: 'visible', content: '行程安排得非常合理，导游很专业热情，海水超级清澈，下次还会选择这个线路！', hideReason: '' },
        { id: 2, user: '李**', route: '万宁亲子5日游', rating: 4, createdAt: '2024-03-12', status: 'visible', content: '第一次带孩子来海南，亲子活动非常丰富，孩子玩得很开心，服务也很贴心。', hideReason: '' },
        { id: 3, user: '王**', route: '海口人文3日游', rating: 5, createdAt: '2024-03-10', status: 'pending', content: '海口的骑楼老街充满了历史感，各种热带水果和小吃物美价廉，强烈推荐！', hideReason: '' },
        { id: 4, user: '某广告号', route: '五指山雨林7日行', rating: 1, createdAt: '2024-03-08', status: 'hidden', content: '推荐xxx平台，比这里便宜一半，快来抢购...', hideReason: '违规广告信息' },
        { id: 5, user: '陈**', route: '五指山雨林7日行', rating: 4, createdAt: '2024-03-05', status: 'visible', content: '五指山的雨林非常震撼，空气清新，适合逃离城市喧嚣，体验黎族文化也很有特色。', hideReason: '' },
      ]
    }
  },
  computed: {
    filteredReviews() {
      return this.reviews.filter(r => {
        if (this.searchKeyword && !r.route.includes(this.searchKeyword) && !r.user.includes(this.searchKeyword)) return false
        if (this.filterStatus && r.status !== this.filterStatus) return false
        if (this.filterRating) {
          if (this.filterRating === '5' && r.rating !== 5) return false
          if (this.filterRating === '4' && r.rating !== 4) return false
          if (this.filterRating === '3' && r.rating >= 4) return false
        }
        return true
      })
    }
  },
  methods: {
    approveReview(review) {
      review.status = 'visible'
      this.showToast('评价已通过审核，前台展示中')
    },
    hideReview(review) {
      review.status = 'hidden'
      review.hideReason = '违规广告/恶意差评'
      this.showToast('评价已隐藏，注意：无法修改评价内容，仅可隐藏')
    },
    restoreReview(review) {
      review.status = 'visible'
      review.hideReason = ''
      this.showToast('评价已恢复展示')
    },
    showToast(msg) {
      this.toast = msg
      setTimeout(() => { this.toast = '' }, 2500)
    }
  }
}
</script>

<style scoped>
.admin-reviews-page { display: flex; flex-direction: column; gap: 16px; }
.toolbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.toolbar-left { display: flex; gap: 10px; flex-wrap: wrap; }
.search-input { height: 36px; border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 0 12px; font-size: 13px; width: 200px; }
.search-input:focus { outline: none; border-color: var(--color-primary); }
.filter-select { height: 36px; border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 0 10px; font-size: 13px; color: var(--color-text); }
.total-info { font-size: 13px; color: var(--color-text-light); }
.review-list { display: flex; flex-direction: column; gap: 12px; }
.review-card { background: var(--color-white); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 16px; display: flex; flex-direction: column; gap: 10px; }
.review-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.review-meta { flex: 1; }
.reviewer-info { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
.avatar { width: 32px; height: 32px; border-radius: 50%; background: var(--color-primary); color: white; display: flex; align-items: center; justify-content: center; font-size: 13px; flex-shrink: 0; }
.reviewer-name { font-size: 14px; font-weight: var(--font-weight-medium); }
.star-row { display: flex; align-items: center; gap: 2px; margin-top: 2px; }
.star { color: var(--color-border); font-size: 13px; }
.star.filled { color: #F5A623; }
.rating-num { font-size: 12px; color: var(--color-text-light); margin-left: 4px; }
.route-info { display: flex; align-items: center; gap: 12px; }
.route-name { font-size: 13px; color: var(--color-primary); }
.review-time { font-size: 12px; color: var(--color-text-light); }
.review-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.status-tag { padding: 2px 8px; border-radius: 20px; font-size: 12px; }
.status-tag.visible { background: #E8F8EF; color: #27AE60; }
.status-tag.hidden { background: #F3F4F6; color: var(--color-text-light); }
.status-tag.pending { background: #FEF0E7; color: var(--color-accent); }
.action-btn { padding: 4px 10px; border-radius: var(--radius-sm); font-size: 12px; border: 1px solid; }
.approve-btn { border-color: #27AE60; color: #27AE60; background: white; }
.hide-btn { border-color: #E74C3C; color: #E74C3C; background: white; }
.restore-btn { border-color: var(--color-primary); color: var(--color-primary); background: white; }
.review-content { font-size: 14px; color: var(--color-text); line-height: 1.6; }
.hide-reason { padding: 8px 12px; background: #FFF3CD; border-radius: var(--radius-sm); font-size: 13px; color: #856404; }
.reason-label { font-weight: var(--font-weight-medium); }
.review-note { display: flex; align-items: center; gap: 5px; font-size: 12px; color: var(--color-text-light); padding-top: 4px; border-top: 1px solid var(--color-border); }
.empty-state { text-align: center; padding: 40px; color: var(--color-text-light); font-size: 14px; }
.toast { position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%); background: #27AE60; color: white; padding: 10px 24px; border-radius: var(--radius-md); font-size: 14px; z-index: 3000; }
</style>
