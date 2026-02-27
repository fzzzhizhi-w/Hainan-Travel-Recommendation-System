<template>
  <div class="admin-config-page">
    <div class="config-notice">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      当前页面仅支持配置推荐算法基础规则权重，不支持修改算法核心逻辑，保障推荐公平性
    </div>

    <!-- Seasonal Weights -->
    <div class="config-card">
      <h3 class="config-title">季节性权重调整</h3>
      <p class="config-desc">基于当前季节调整不同类型线路的推荐权重，影响推荐排序，不影响算法基础逻辑</p>
      <div class="weight-list">
        <div v-for="item in seasonWeights" :key="item.key" class="weight-item">
          <div class="weight-info">
            <span class="weight-name">{{ item.name }}</span>
            <span class="weight-desc">{{ item.desc }}</span>
          </div>
          <div class="weight-control">
            <input type="range" v-model="item.value" min="0" max="100" step="5" class="weight-slider" />
            <span class="weight-val">{{ item.value }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Special Event Rules -->
    <div class="config-card">
      <h3 class="config-title">特殊场景规则</h3>
      <p class="config-desc">针对节假日、台风、特殊活动等场景的临时推荐策略</p>
      <div class="rule-list">
        <div v-for="rule in specialRules" :key="rule.key" class="rule-item">
          <div class="rule-info">
            <span class="rule-name">{{ rule.name }}</span>
            <span class="rule-desc">{{ rule.desc }}</span>
          </div>
          <label class="switch">
            <input type="checkbox" v-model="rule.enabled" />
            <span class="slider"></span>
          </label>
        </div>
      </div>
    </div>

    <!-- Quality Filter -->
    <div class="config-card">
      <h3 class="config-title">质量过滤阈值</h3>
      <p class="config-desc">低于以下阈值的线路将被从推荐结果中过滤，不影响用户手动搜索</p>
      <div class="threshold-list">
        <div class="threshold-item">
          <label class="threshold-label">最低推荐评分</label>
          <div class="threshold-control">
            <input type="number" v-model="thresholds.minRating" min="1" max="5" step="0.1" class="threshold-input" />
            <span class="threshold-unit">/ 5分</span>
          </div>
        </div>
        <div class="threshold-item">
          <label class="threshold-label">最低评价数量</label>
          <div class="threshold-control">
            <input type="number" v-model="thresholds.minReviews" min="0" max="50" class="threshold-input" />
            <span class="threshold-unit">条</span>
          </div>
        </div>
      </div>
    </div>

    <div class="save-row">
      <button class="save-btn" @click="saveConfig">保存配置</button>
      <button class="reset-btn" @click="resetConfig">恢复默认</button>
    </div>

    <div v-if="toast" class="toast">{{ toast }}</div>
  </div>
</template>

<script>
export default {
  name: 'AdminConfig',
  data() {
    return {
      toast: '',
      seasonWeights: [
        { key: 'beach', name: '海滩类线路', desc: '夏季适当提高，冬季海南仍适合', value: 80 },
        { key: 'rainforest', name: '雨林类线路', desc: '全年适合，台风季适当提高', value: 70 },
        { key: 'cultural', name: '人文历史类线路', desc: '全年适合', value: 60 },
        { key: 'sports', name: '户外运动类线路', desc: '冬季适当降低权重', value: 50 },
        { key: 'family', name: '亲子类线路', desc: '寒暑假期间提高', value: 65 },
        { key: 'food', name: '美食探店类线路', desc: '全年适合', value: 60 },
      ],
      specialRules: [
        { key: 'holiday_minor', name: '节假日小众线路提权', desc: '节假日期间降低热门景点线路权重，提升小众线路，避免用户拥堵', enabled: true },
        { key: 'typhoon_outdoor', name: '台风季户外限制', desc: '台风预警期间自动降低户外海滩类线路权重', enabled: true },
        { key: 'rainy_indoor', name: '雨天室内优先', desc: '当日降雨概率超过60%时，提升室内景点和雨林线路权重', enabled: true },
        { key: 'low_stock_hide', name: '低库存自动降权', desc: '剩余库存低于5%时自动降低该线路在推荐中的权重', enabled: false },
      ],
      thresholds: {
        minRating: 4.0,
        minReviews: 5,
      }
    }
  },
  methods: {
    saveConfig() {
      this.showToast('推荐规则配置已保存，将在下次推荐计算时生效')
    },
    resetConfig() {
      this.seasonWeights.forEach(w => w.value = 60)
      this.specialRules.forEach(r => { r.enabled = r.key === 'holiday_minor' || r.key === 'typhoon_outdoor' || r.key === 'rainy_indoor' })
      this.thresholds = { minRating: 4.0, minReviews: 5 }
      this.showToast('已恢复默认配置')
    },
    showToast(msg) {
      this.toast = msg
      setTimeout(() => { this.toast = '' }, 2500)
    }
  }
}
</script>

<style scoped>
.admin-config-page { display: flex; flex-direction: column; gap: 16px; }
.config-notice { display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: #EBF4F8; border-radius: var(--radius-md); font-size: 13px; color: var(--color-primary); }
.config-card { background: var(--color-white); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 20px; }
.config-title { font-size: 15px; color: var(--color-text); margin-bottom: 6px; }
.config-desc { font-size: 13px; color: var(--color-text-light); margin-bottom: 16px; }
.weight-list { display: flex; flex-direction: column; gap: 12px; }
.weight-item { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 10px 0; border-bottom: 1px solid var(--color-border); }
.weight-item:last-child { border-bottom: none; }
.weight-info { flex: 1; }
.weight-name { font-size: 14px; color: var(--color-text); display: block; margin-bottom: 2px; }
.weight-desc { font-size: 12px; color: var(--color-text-light); }
.weight-control { display: flex; align-items: center; gap: 10px; }
.weight-slider { width: 160px; accent-color: var(--color-primary); }
.weight-val { font-size: 13px; color: var(--color-primary); font-weight: var(--font-weight-medium); width: 36px; text-align: right; }
.rule-list { display: flex; flex-direction: column; gap: 0; }
.rule-item { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 12px 0; border-bottom: 1px solid var(--color-border); }
.rule-item:last-child { border-bottom: none; }
.rule-info { flex: 1; }
.rule-name { font-size: 14px; color: var(--color-text); display: block; margin-bottom: 2px; }
.rule-desc { font-size: 12px; color: var(--color-text-light); }
.switch { position: relative; display: inline-block; width: 44px; height: 24px; flex-shrink: 0; }
.switch input { opacity: 0; width: 0; height: 0; }
.slider { position: absolute; inset: 0; background: #E5E7EB; border-radius: 24px; transition: 0.3s; cursor: pointer; }
.slider::before { content: ''; position: absolute; width: 18px; height: 18px; left: 3px; bottom: 3px; background: white; border-radius: 50%; transition: 0.3s; }
input:checked + .slider { background: var(--color-primary); }
input:checked + .slider::before { transform: translateX(20px); }
.threshold-list { display: flex; flex-direction: column; gap: 12px; }
.threshold-item { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.threshold-label { font-size: 14px; color: var(--color-text); }
.threshold-control { display: flex; align-items: center; gap: 8px; }
.threshold-input { width: 80px; height: 36px; border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 0 10px; font-size: 14px; text-align: center; }
.threshold-input:focus { outline: none; border-color: var(--color-primary); }
.threshold-unit { font-size: 13px; color: var(--color-text-light); }
.save-row { display: flex; gap: 12px; }
.save-btn { padding: 10px 24px; background: var(--color-primary); color: white; border: none; border-radius: var(--radius-md); font-size: 14px; font-weight: var(--font-weight-medium); }
.reset-btn { padding: 10px 24px; background: white; color: var(--color-text-light); border: 1px solid var(--color-border); border-radius: var(--radius-md); font-size: 14px; }
.toast { position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%); background: #27AE60; color: white; padding: 10px 24px; border-radius: var(--radius-md); font-size: 14px; z-index: 3000; }
</style>
