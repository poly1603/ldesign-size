<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useSize } from '../../../../src/vue'

const { currentMode } = useSize()

interface FormData {
  username: string
  email: string
  password: string
  confirmPassword: string
  gender: string
  interests: string[]
  bio: string
  agreeTerms: boolean
}

const formData = reactive<FormData>({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  gender: '',
  interests: [],
  bio: '',
  agreeTerms: false
})

const errors = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const submitting = ref(false)

function validateUsername() {
  if (!formData.username) {
    errors.username = '用户名不能为空'
  } else if (formData.username.length < 3) {
    errors.username = '用户名至少3个字符'
  } else {
    errors.username = ''
  }
}

function validateEmail() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!formData.email) {
    errors.email = '邮箱不能为空'
  } else if (!emailRegex.test(formData.email)) {
    errors.email = '邮箱格式不正确'
  } else {
    errors.email = ''
  }
}

function validatePassword() {
  if (!formData.password) {
    errors.password = '密码不能为空'
  } else if (formData.password.length < 6) {
    errors.password = '密码至少6个字符'
  } else {
    errors.password = ''
  }
}

function validateConfirmPassword() {
  if (!formData.confirmPassword) {
    errors.confirmPassword = '请确认密码'
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = '两次密码不一致'
  } else {
    errors.confirmPassword = ''
  }
}

async function handleSubmit() {
  // 验证所有字段
  validateUsername()
  validateEmail()
  validatePassword()
  validateConfirmPassword()

  // 检查是否有错误
  const hasErrors = Object.values(errors).some(error => error !== '')
  if (hasErrors) {
    return
  }

  if (!formData.agreeTerms) {
    alert('请同意服务条款')
    return
  }

  submitting.value = true
  
  // 模拟提交
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  console.log('表单提交:', formData)
  alert('注册成功！')
  
  submitting.value = false
}

function handleReset() {
  Object.assign(formData, {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    interests: [],
    bio: '',
    agreeTerms: false
  })
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
}
</script>

<template>
  <div class="form-demo">
    <div class="form-header">
      <h2 class="form-title">用户注册表单</h2>
      <p class="form-description">展示不同尺寸模式下的表单样式</p>
    </div>

    <form @submit.prevent="handleSubmit" class="registration-form">
      <!-- 用户名 -->
      <div class="form-item" :class="{ error: errors.username }">
        <label class="form-label" for="username">
          <span class="required">*</span>
          用户名
        </label>
        <input
          id="username"
          v-model="formData.username"
          type="text"
          class="form-input"
          placeholder="请输入用户名"
          @blur="validateUsername"
        />
        <div v-if="errors.username" class="form-error">
          {{ errors.username }}
        </div>
      </div>

      <!-- 邮箱 -->
      <div class="form-item" :class="{ error: errors.email }">
        <label class="form-label" for="email">
          <span class="required">*</span>
          邮箱
        </label>
        <input
          id="email"
          v-model="formData.email"
          type="email"
          class="form-input"
          placeholder="请输入邮箱"
          @blur="validateEmail"
        />
        <div v-if="errors.email" class="form-error">
          {{ errors.email }}
        </div>
      </div>

      <!-- 密码 -->
      <div class="form-item" :class="{ error: errors.password }">
        <label class="form-label" for="password">
          <span class="required">*</span>
          密码
        </label>
        <input
          id="password"
          v-model="formData.password"
          type="password"
          class="form-input"
          placeholder="请输入密码"
          @blur="validatePassword"
        />
        <div v-if="errors.password" class="form-error">
          {{ errors.password }}
        </div>
        <div v-else class="form-help">
          密码长度至少6个字符
        </div>
      </div>

      <!-- 确认密码 -->
      <div class="form-item" :class="{ error: errors.confirmPassword }">
        <label class="form-label" for="confirmPassword">
          <span class="required">*</span>
          确认密码
        </label>
        <input
          id="confirmPassword"
          v-model="formData.confirmPassword"
          type="password"
          class="form-input"
          placeholder="请再次输入密码"
          @blur="validateConfirmPassword"
        />
        <div v-if="errors.confirmPassword" class="form-error">
          {{ errors.confirmPassword }}
        </div>
      </div>

      <!-- 性别 -->
      <div class="form-item">
        <label class="form-label">性别</label>
        <div class="radio-group">
          <label class="radio-label">
            <input
              v-model="formData.gender"
              type="radio"
              value="male"
              class="radio-input"
            />
            <span>男</span>
          </label>
          <label class="radio-label">
            <input
              v-model="formData.gender"
              type="radio"
              value="female"
              class="radio-input"
            />
            <span>女</span>
          </label>
          <label class="radio-label">
            <input
              v-model="formData.gender"
              type="radio"
              value="other"
              class="radio-input"
            />
            <span>其他</span>
          </label>
        </div>
      </div>

      <!-- 兴趣爱好 -->
      <div class="form-item">
        <label class="form-label">兴趣爱好</label>
        <div class="checkbox-group">
          <label class="checkbox-label">
            <input
              v-model="formData.interests"
              type="checkbox"
              value="reading"
              class="checkbox-input"
            />
            <span>阅读</span>
          </label>
          <label class="checkbox-label">
            <input
              v-model="formData.interests"
              type="checkbox"
              value="sports"
              class="checkbox-input"
            />
            <span>运动</span>
          </label>
          <label class="checkbox-label">
            <input
              v-model="formData.interests"
              type="checkbox"
              value="music"
              class="checkbox-input"
            />
            <span>音乐</span>
          </label>
          <label class="checkbox-label">
            <input
              v-model="formData.interests"
              type="checkbox"
              value="travel"
              class="checkbox-input"
            />
            <span>旅游</span>
          </label>
        </div>
      </div>

      <!-- 个人简介 -->
      <div class="form-item">
        <label class="form-label" for="bio">个人简介</label>
        <textarea
          id="bio"
          v-model="formData.bio"
          class="form-textarea"
          rows="4"
          placeholder="请输入个人简介"
          maxlength="200"
        />
        <div class="char-count">
          {{ formData.bio.length }} / 200
        </div>
      </div>

      <!-- 服务条款 -->
      <div class="form-item">
        <label class="checkbox-label">
          <input
            v-model="formData.agreeTerms"
            type="checkbox"
            class="checkbox-input"
          />
          <span>我已阅读并同意 <a href="#" class="link">服务条款</a></span>
        </label>
      </div>

      <!-- 提交按钮 -->
      <div class="form-actions">
        <button type="submit" class="submit-btn" :disabled="submitting">
          <span v-if="submitting">提交中...</span>
          <span v-else>提交注册</span>
        </button>
        <button type="button" class="reset-btn" @click="handleReset" :disabled="submitting">
          重置
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.form-demo {
  max-width: 600px;
  margin: 0 auto;
  background: white;
  border-radius: var(--ls-border-radius-lg);
  padding: var(--ls-spacing-xl);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-header {
  margin-bottom: var(--ls-spacing-xl);
  text-align: center;
}

.form-title {
  font-size: var(--ls-font-size-h2);
  font-weight: 600;
  margin-bottom: var(--ls-spacing-xs);
}

.form-description {
  font-size: var(--ls-font-size-base);
  color: #666;
}

.registration-form {
  display: flex;
  flex-direction: column;
  gap: var(--ls-spacing-lg);
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: var(--ls-spacing-xs);
}

.form-item.error .form-input,
.form-item.error .form-textarea {
  border-color: #ff4d4f;
}

.form-label {
  font-size: var(--ls-font-size-sm);
  font-weight: 600;
  color: #333;
}

.required {
  color: #ff4d4f;
  margin-right: 4px;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0 var(--ls-spacing-base);
  font-size: var(--ls-font-size-base);
  color: #333;
  background: white;
  border: var(--ls-border-width-base) solid #d9d9d9;
  border-radius: var(--ls-border-radius-base);
  transition: all var(--ls-duration-base);
  outline: none;
}

.form-input {
  height: var(--ls-input-height-medium);
}

.form-textarea {
  padding: var(--ls-spacing-sm) var(--ls-spacing-base);
  resize: vertical;
  font-family: inherit;
}

.form-input:hover,
.form-textarea:hover {
  border-color: #40a9ff;
}

.form-input:focus,
.form-textarea:focus {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.form-error {
  font-size: var(--ls-font-size-xs);
  color: #ff4d4f;
}

.form-help {
  font-size: var(--ls-font-size-xs);
  color: #999;
}

.char-count {
  text-align: right;
  font-size: var(--ls-font-size-xs);
  color: #999;
}

.radio-group,
.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--ls-spacing-base);
}

.radio-label,
.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--ls-spacing-xs);
  cursor: pointer;
  font-size: var(--ls-font-size-base);
}

.radio-input,
.checkbox-input {
  cursor: pointer;
}

.link {
  color: #1890ff;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

.form-actions {
  display: flex;
  gap: var(--ls-spacing-base);
  margin-top: var(--ls-spacing-base);
}

.submit-btn,
.reset-btn {
  flex: 1;
  height: var(--ls-button-height-large);
  font-size: var(--ls-font-size-base);
  font-weight: 600;
  border: none;
  border-radius: var(--ls-border-radius-base);
  cursor: pointer;
  transition: all var(--ls-duration-base);
}

.submit-btn {
  background: #1890ff;
  color: white;
}

.submit-btn:hover:not(:disabled) {
  background: #40a9ff;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.reset-btn {
  background: white;
  color: #333;
  border: var(--ls-border-width-base) solid #d9d9d9;
}

.reset-btn:hover:not(:disabled) {
  border-color: #1890ff;
  color: #1890ff;
}

@media (max-width: 768px) {
  .form-demo {
    padding: var(--ls-spacing-lg);
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>

