<template>
  <div class="merchant-reviews-page">
    <div class="review-notice">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      商户仅可合规回复用户评价，无权修改或删除用户评价内容，保障评价真实性
    </div>

    <!-- Stats -->
    <div class="rating-stats">
      <div class="avg-rating">
        <div class="avg-num">4.8</div>
        <div class="avg-stars">
          <span v-for="i in 5" :key="i" class="star filled">★</span>
        </div>
        <div class="avg-label">综合评分</div>
      </div>
      <div class="rating-dist">
        <div v-for="item in ratingDist" :key="item.star" class="dist-item">
          <span class="dist-label">{{ item.star }}星</span>
          <div class="dist-bar-wrap"><div class="dist-bar" :style="{ width: item.pct + '%' }"></div></div>
          <span class="dist-num">{{ item.count }}</span>
        </div>
      </div>
    </div>

    <!-- Filter -->
    <div class="filter-row">
      <select v-model="filterRating" class="filter-select">
        <option value="">全部评分</option>
        <option value="5">5星</option>
        <option value="4">4星</option>
        <option value="3">3星及以下</option>
      </select>
      <select v-model="filterProduct" class="filter-select">
        <option value="">全部产品</option>
        <option v-for="p in products" :key="p" :value="p">{{ p }}</option>
      </select>
    </div>

    <!-- Review List -->
    <div class="review-list">
      <div v-for="review in filteredReviews" :key="review.id" class="review-card">
        <div class="review-top">
          <div class="review-meta">
            <div class="reviewer">
              <div class="avatar">{{ review.user[0] }}</div>
              <div>
                <span class="reviewer-name">{{ review.user }}</span>
                <div class="star-row">
                  <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= review.rating }">★</span>
                </div>
              </div>
            </div>
            <div class="review-product-date">
              <span class="review-product">{{ review.product }}</span>
              <span class="review-date">{{ review.date }}</span>
            </div>
          </div>
        </div>
        <p class="review-content">{{ review.content }}</p>
        <div v-if="review.reply" class="merchant-reply">
          <span class="reply-label">商家回复：</span>
          <span class="reply-content">{{ review.reply }}</span>
        </div>
        <div v-else class="reply-area">
          <textarea v-if="review.replyMode" v-model="review.replyText" class="reply-input" rows="2" placeholder="请输入回复内容，保持友好专业的态度..."></textarea>
          <div class="reply-actions">
            <button v-if="!review.replyMode" class="reply-btn" @click="review.replyMode = true">回复用户</button>
            <template v-else>
              <button class="submit-reply-btn" @click="submitReply(review)">提交回复</button>
              <button class="cancel-reply-btn" @click="review.replyMode = false; review.replyText = ''">取消</button>
            </template>
          </div>
        </div>
      </div>
      <div v-if="filteredReviews.length === 0" class="empty-state">暂无相关评价</div>
    </div>

    <div v-if="toast" class="toast">{{ toast }}</div>
  </div>
</template>

<script>
export default {
  name: 'MerchantReviews',
  data() {
    return {
      filterRating: '',
      filterProduct: '',
      toast: '',
      products: ['三亚5日精华游', '五指山雨林7日行', '蜈支洲岛一日游'],
      ratingDist: [
        { star: 5, count: 86, pct: 90 },
        { star: 4, count: 24, pct: 25 },
        { star: 3, count: 6, pct: 6 },
        { star: 2, count: 1, pct: 1 },
        { star: 1, count: 0, pct: 0 },
      ],
      reviews: [
        { id: 1, user: '刘**', product: '三亚5日精华游', rating: 5, date: '2024-03-15', content: '行程安排非常合理，导游很专业热情，海水超级清澈，下次还会选择！', reply: '感谢您的好评！欢迎下次再来，我们会继续提升服务质量。', replyMode: false, replyText: '' },
        { id: 2, user: '陈**', product: '三亚5日精华游', rating: 4, date: '2024-03-12', content: '整体体验很好，酒店位置不错，蜈支洲岛是亮点，就是人有点多。', reply: '', replyMode: false, replyText: '' },
        { id: 3, user: '王**', product: '五指山雨林7日行', rating: 5, date: '2024-03-08', content: '五指山雨林非常震撼，黎族文化体验很有特色，导游讲解生动，推荐！', reply: '', replyMode: false, replyText: '' },
        { id: 4, user: '张**', product: '蜈支洲岛一日游', rating: 3, date: '2024-03-05', content: '岛上风景确实美，但等船的时间太长了，希望能优化一下。', reply: '', replyMode: false, replyText: '' },
      ]
    }
  },
  computed: {
    filteredReviews() {
      return this.reviews.filter(r => {
        if (this.filterProduct && r.product !== this.filterProduct) return false
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
    submitReply(review) {
      if (!review.replyText.trim()) {
        this.showToast('请输入回复内容')
        return
      }
      review.reply = review.replyText
      review.replyMode = false
      review.replyText = ''
      this.showToast('回复已提交，将在审核后展示')
    },
    showToast(msg) {
      this.toast = msg
      setTimeout(() => { this.toast = '' }, 2000)
    }
  }
}
</script>

<style scoped>
.merchant-reviews-page { display: flex; flex-direction: column; gap: 16px; }
.review-notice { display: flex; align-items: center; gap: 8px; padding: 10px 16px; background: #EBF4F8; border-radius: var(--radius-sm); font-size: 13px; color: var(--color-primary); }
.rating-stats { display: flex; gap: 32px; background: var(--color-white); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 20px; }
.avg-rating { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; min-width: 100px; }
.avg-num { font-size: 48px; font-weight: var(--font-weight-semibold); color: #F5A623; line-height: 1; }
.avg-stars { display: flex; gap: 2px; }
.avg-label { font-size: 13px; color: var(--color-text-light); }
.rating-dist { flex: 1; display: flex; flex-direction: column; gap: 8px; justify-content: center; }
.dist-item { display: flex; align-items: center; gap: 10px; }
.dist-label { font-size: 13px; color: var(--color-text-light); width: 28px; text-align: right; flex-shrink: 0; }
.dist-bar-wrap { flex: 1; height: 6px; background: #F3F4F6; border-radius: 3px; }
.dist-bar { height: 100%; background: #F5A623; border-radius: 3px; }
.dist-num { font-size: 13px; color: var(--color-text-light); width: 24px; flex-shrink: 0; }
.filter-row { display: flex; gap: 10px; }
.filter-select { height: 36px; border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 0 10px; font-size: 13px; color: var(--color-text); }
.review-list { display: flex; flex-direction: column; gap: 12px; }
.review-card { background: var(--color-white); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 16px; display: flex; flex-direction: column; gap: 10px; }
.review-top { }
.review-meta { }
.reviewer { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
.avatar { width: 32px; height: 32px; border-radius: 50%; background: var(--color-primary); color: white; display: flex; align-items: center; justify-content: center; font-size: 13px; flex-shrink: 0; }
.reviewer-name { font-size: 14px; font-weight: var(--font-weight-medium); display: block; margin-bottom: 2px; }
.star-row { display: flex; gap: 2px; }
.star { color: var(--color-border); font-size: 13px; }
.star.filled { color: #F5A623; }
.review-product-date { display: flex; align-items: center; gap: 12px; }
.review-product { font-size: 13px; color: var(--color-primary); }
.review-date { font-size: 12px; color: var(--color-text-light); }
.review-content { font-size: 14px; color: var(--color-text); line-height: 1.6; }
.merchant-reply { background: var(--color-bg); padding: 10px 14px; border-radius: var(--radius-sm); font-size: 13px; line-height: 1.6; }
.reply-label { color: var(--color-primary); font-weight: var(--font-weight-medium); }
.reply-content { color: var(--color-text-light); }
.reply-area { }
.reply-input { width: 100%; border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 8px 10px; font-size: 13px; resize: vertical; margin-bottom: 8px; }
.reply-input:focus { outline: none; border-color: var(--color-primary); }
.reply-actions { display: flex; gap: 8px; }
.reply-btn { padding: 5px 14px; border: 1px solid var(--color-primary); background: white; color: var(--color-primary); border-radius: var(--radius-sm); font-size: 13px; }
.submit-reply-btn { padding: 5px 14px; background: var(--color-primary); color: white; border: none; border-radius: var(--radius-sm); font-size: 13px; }
.cancel-reply-btn { padding: 5px 14px; border: 1px solid var(--color-border); background: white; color: var(--color-text-light); border-radius: var(--radius-sm); font-size: 13px; }
.empty-state { text-align: center; padding: 40px; color: var(--color-text-light); font-size: 14px; }
.toast { position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%); background: #27AE60; color: white; padding: 10px 24px; border-radius: var(--radius-md); font-size: 14px; z-index: 3000; }
</style>
