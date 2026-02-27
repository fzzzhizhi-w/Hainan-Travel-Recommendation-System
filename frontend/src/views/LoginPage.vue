<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-brand">
        <span class="brand-icon">🌴</span>
        <h1 class="brand-name">海南旅行推荐</h1>
        <p class="brand-desc">个性化线路精准匹配 · 全流程出行服务</p>
      </div>

      <div class="login-card">
        <div class="card-tabs">
          <button class="card-tab" :class="{ active: mode === 'login' }" @click="mode = 'login'">登录</button>
          <button class="card-tab" :class="{ active: mode === 'register' }" @click="mode = 'register'">注册</button>
        </div>

        <!-- Login Form -->
        <form v-if="mode === 'login'" class="auth-form" @submit.prevent="handleLogin">
          <div class="role-selector">
            <button
              v-for="r in roles"
              :key="r.value"
              type="button"
              class="role-btn"
              :class="{ active: login.role === r.value }"
              @click="login.role = r.value"
            >
              <span class="role-icon">{{ r.icon }}</span>
              <span>{{ r.label }}</span>
            </button>
          </div>
          <div class="form-field">
            <label class="form-label">手机号</label>
            <input v-model="login.phone" class="form-input" type="tel" placeholder="请输入手机号" maxlength="11" required />
          </div>
          <div class="form-field">
            <label class="form-label">密码</label>
            <input v-model="login.password" class="form-input" type="password" placeholder="请输入密码" required />
          </div>
          <div class="form-extra">
            <label class="remember-label">
              <input type="checkbox" v-model="login.remember" />
              <span>记住登录状态</span>
            </label>
            <a href="#" class="forgot-link" @click.prevent>忘记密码？</a>
          </div>
          <button type="submit" class="submit-btn" :disabled="submitting">
            {{ submitting ? '登录中...' : '登录' }}
          </button>
          <div v-if="login.role === 'user'" class="divider"><span>或</span></div>
          <div v-if="login.role === 'user'" class="third-party">
            <button type="button" class="third-btn wechat-btn" @click="handleThirdPartyLogin('wechat')">
              <span class="third-icon">💚</span> 微信登录
            </button>
          </div>
        </form>

        <!-- Register Form -->
        <form v-if="mode === 'register'" class="auth-form" @submit.prevent="handleRegister">
          <div class="form-field">
            <label class="form-label">手机号</label>
            <input v-model="register.phone" class="form-input" type="tel" placeholder="请输入手机号" maxlength="11" required />
          </div>
          <div class="form-field">
            <label class="form-label">验证码</label>
            <div class="sms-row">
              <input v-model="register.smsCode" class="form-input sms-input" type="text" placeholder="请输入验证码" maxlength="6" required />
              <button type="button" class="send-sms-btn" :disabled="smsCooldown > 0" @click="sendSmsCode">
                {{ smsCooldown > 0 ? smsCooldown + 's后重发' : '获取验证码' }}
              </button>
            </div>
          </div>
          <div class="form-field">
            <label class="form-label">设置密码</label>
            <input v-model="register.password" class="form-input" type="password" placeholder="8位以上，包含字母和数字" required />
          </div>
          <div class="form-field">
            <label class="form-label">昵称</label>
            <input v-model="register.nickname" class="form-input" type="text" placeholder="请输入昵称" required />
          </div>
          <div class="agreement">
            <label class="agree-label">
              <input type="checkbox" v-model="register.agreed" required />
              <span>我已阅读并同意
                <a href="#" @click.prevent class="policy-link">《用户协议》</a>
                和
                <a href="#" @click.prevent class="policy-link">《隐私政策》</a>
              </span>
            </label>
          </div>
          <button type="submit" class="submit-btn" :disabled="submitting || !register.agreed">
            {{ submitting ? '注册中...' : '注册账号' }}
          </button>
        </form>
      </div>

      <p class="privacy-notice">
        🔒 您的个人信息受严格保护，仅用于提供旅行服务，绝不对外泄露
      </p>
    </div>

    <div v-if="toast" class="toast" :class="toastType">{{ toast }}</div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      mode: 'login',
      submitting: false,
      smsCooldown: 0,
      toast: '',
      toastType: 'success',
      roles: [
        { value: 'user', label: '普通用户', icon: '👤' },
        { value: 'admin', label: '管理员', icon: '🛡️' },
        { value: 'merchant', label: '商家', icon: '🏪' },
      ],
      login: {
        phone: '',
        password: '',
        remember: false,
        role: 'user',
      },
      register: {
        phone: '',
        smsCode: '',
        password: '',
        nickname: '',
        agreed: false,
      },
    }
  },
  methods: {
    handleLogin() {
      if (!this.login.phone || !this.login.password) return
      this.submitting = true
      setTimeout(() => {
        this.submitting = false
        this.showToast('登录成功！正在跳转...', 'success')
        setTimeout(() => {
          if (this.login.role === 'admin') {
            this.$router.push('/admin/dashboard')
          } else if (this.login.role === 'merchant') {
            this.$router.push('/merchant/dashboard')
          } else {
            this.$router.push(this.$route.query.redirect || '/')
          }
        }, 1000)
      }, 800)
    },
    handleRegister() {
      if (!this.register.agreed) {
        this.showToast('请先同意用户协议和隐私政策', 'error')
        return
      }
      this.submitting = true
      setTimeout(() => {
        this.submitting = false
        this.showToast('注册成功！正在跳转...', 'success')
        setTimeout(() => {
          this.$router.push('/')
        }, 1000)
      }, 800)
    },
    handleThirdPartyLogin() {
      this.showToast('微信登录暂未开放，请使用手机号登录', 'error')
    },
    sendSmsCode() {
      if (!this.register.phone || this.register.phone.length !== 11) {
        this.showToast('请先输入正确的手机号', 'error')
        return
      }
      this.smsCooldown = 60
      this.showToast('验证码已发送，请注意查收', 'success')
      const timer = setInterval(() => {
        this.smsCooldown--
        if (this.smsCooldown <= 0) clearInterval(timer)
      }, 1000)
    },
    showToast(msg, type = 'success') {
      this.toast = msg
      this.toastType = type
      setTimeout(() => { this.toast = '' }, 2500)
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #E8F4F8 0%, #F8F7F4 60%, #FEF0E7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
}
.login-container {
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}
.login-brand {
  text-align: center;
}
.brand-icon {
  font-size: 40px;
  display: block;
  margin-bottom: 8px;
}
.brand-name {
  font-size: 24px;
  color: var(--color-primary);
  margin-bottom: 4px;
}
.brand-desc {
  font-size: 13px;
  color: var(--color-text-light);
}
.login-card {
  width: 100%;
  background: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  overflow: hidden;
}
.card-tabs {
  display: flex;
  border-bottom: 1px solid var(--color-border);
}
.card-tab {
  flex: 1;
  padding: 14px 0;
  background: none;
  border: none;
  font-size: 15px;
  color: var(--color-text-light);
  border-bottom: 2px solid transparent;
  position: relative;
  bottom: -1px;
}
.card-tab.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
  font-weight: var(--font-weight-medium);
}
.auth-form {
  padding: 24px;
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
  height: 42px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 0 12px;
  font-size: 14px;
  color: var(--color-text);
  width: 100%;
}
.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
}
.sms-row {
  display: flex;
  gap: 10px;
}
.sms-input {
  flex: 1;
}
.send-sms-btn {
  padding: 0 14px;
  height: 42px;
  border: 1px solid var(--color-primary);
  background: var(--color-white);
  color: var(--color-primary);
  border-radius: var(--radius-sm);
  font-size: 13px;
  white-space: nowrap;
  flex-shrink: 0;
}
.send-sms-btn:disabled {
  border-color: var(--color-border);
  color: var(--color-text-light);
}
.form-extra {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.remember-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--color-text-light);
  cursor: pointer;
}
.role-selector {
  display: flex;
  gap: 8px;
}
.role-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 6px;
  border: 1.5px solid var(--color-border);
  background: var(--color-white);
  border-radius: var(--radius-md);
  font-size: 13px;
  color: var(--color-text-light);
  transition: all 0.2s;
  cursor: pointer;
}
.role-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
.role-btn.active {
  border-color: var(--color-primary);
  background: #EBF4F8;
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
}
.role-icon {
  font-size: 20px;
}
.forgot-link {
  font-size: 13px;
  color: var(--color-primary);
}
.submit-btn {
  height: 44px;
  background: var(--color-primary);
  color: var(--color-white);
  border: none;
  border-radius: var(--radius-md);
  font-size: 15px;
  font-weight: var(--font-weight-medium);
  margin-top: 4px;
  transition: opacity 0.2s;
}
.submit-btn:hover:not(:disabled) {
  opacity: 0.9;
}
.submit-btn:disabled {
  opacity: 0.6;
}
.divider {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--color-text-light);
  font-size: 13px;
}
.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--color-border);
}
.third-party {
  display: flex;
  gap: 10px;
}
.third-btn {
  flex: 1;
  height: 40px;
  border: 1px solid var(--color-border);
  background: var(--color-white);
  border-radius: var(--radius-sm);
  font-size: 14px;
  color: var(--color-text);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.third-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
.agreement {
  font-size: 13px;
}
.agree-label {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  cursor: pointer;
  line-height: 1.5;
  color: var(--color-text-light);
}
.policy-link {
  color: var(--color-primary);
}
.privacy-notice {
  font-size: 12px;
  color: var(--color-text-light);
  text-align: center;
  padding: 0 16px;
}
.toast {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 24px;
  border-radius: var(--radius-md);
  font-size: 14px;
  z-index: 3000;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  white-space: nowrap;
}
.toast.success {
  background: #27AE60;
  color: white;
}
.toast.error {
  background: #E74C3C;
  color: white;
}
</style>
