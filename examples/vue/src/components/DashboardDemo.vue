<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSize, useSizeConfig } from '../../../../src/vue'

const { currentMode } = useSize()
const config = useSizeConfig()

// 模拟数据
const stats = ref([
  { label: '总销售额', value: '¥126,560', trend: '+12.5%', positive: true },
  { label: '访问量', value: '8,426', trend: '+8.2%', positive: true },
  { label: '支付笔数', value: '1,234', trend: '-3.1%', positive: false },
  { label: '运营活动效果', value: '78%', trend: '+5.0%', positive: true }
])

const recentOrders = ref([
  { id: '001', customer: '张三', amount: 1250, status: '已完成', time: '2024-01-20 10:30' },
  { id: '002', customer: '李四', amount: 3200, status: '进行中', time: '2024-01-20 11:15' },
  { id: '003', customer: '王五', amount: 890, status: '已完成', time: '2024-01-20 12:00' },
  { id: '004', customer: '赵六', amount: 2100, status: '待处理', time: '2024-01-20 13:45' }
])

const activities = ref([
  { type: 'order', content: '新订单 #12345 待处理', time: '5分钟前' },
  { type: 'user', content: '用户 张三 完成了支付', time: '15分钟前' },
  { type: 'system', content: '系统更新完成', time: '1小时前' },
  { type: 'order', content: '订单 #12340 已发货', time: '2小时前' }
])

// 根据尺寸模式调整图表大小
const chartSize = computed(() => {
  const sizeMap = {
    small: { width: 300, height: 200 },
    medium: { width: 400, height: 250 },
    large: { width: 500, height: 300 }
  }
  return sizeMap[currentMode.value]
})
</script>

<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1 class="dashboard-title">仪表盘示例</h1>
      <p class="dashboard-subtitle">展示不同尺寸模式下的仪表盘布局</p>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="stat-card"
      >
        <div class="stat-label">{{ stat.label }}</div>
        <div class="stat-value">{{ stat.value }}</div>
        <div class="stat-trend" :class="{ positive: stat.positive, negative: !stat.positive }">
          <span class="trend-icon">{{ stat.positive ? '↑' : '↓' }}</span>
          {{ stat.trend }}
        </div>
      </div>
    </div>

    <!-- 主要内容区 -->
    <div class="dashboard-content">
      <!-- 图表区域 -->
      <div class="chart-section">
        <div class="section-card">
          <h2 class="section-title">销售趋势</h2>
          <div class="chart-placeholder" :style="{ width: chartSize.width + 'px', height: chartSize.height + 'px' }">
            <svg viewBox="0 0 100 50" class="simple-chart">
              <polyline
                points="0,40 20,35 40,25 60,30 80,15 100,20"
                fill="none"
                stroke="#1890ff"
                stroke-width="2"
              />
              <circle cx="0" cy="40" r="2" fill="#1890ff" />
              <circle cx="20" cy="35" r="2" fill="#1890ff" />
              <circle cx="40" cy="25" r="2" fill="#1890ff" />
              <circle cx="60" cy="30" r="2" fill="#1890ff" />
              <circle cx="80" cy="15" r="2" fill="#1890ff" />
              <circle cx="100" cy="20" r="2" fill="#1890ff" />
            </svg>
          </div>
        </div>
      </div>

      <!-- 侧边栏 -->
      <div class="sidebar-section">
        <!-- 最近订单 -->
        <div class="section-card">
          <h2 class="section-title">最近订单</h2>
          <div class="orders-list">
            <div
              v-for="order in recentOrders"
              :key="order.id"
              class="order-item"
            >
              <div class="order-info">
                <div class="order-id">#{{ order.id }}</div>
                <div class="order-customer">{{ order.customer }}</div>
              </div>
              <div class="order-details">
                <div class="order-amount">¥{{ order.amount }}</div>
                <div class="order-status" :class="order.status">
                  {{ order.status }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 活动日志 -->
        <div class="section-card">
          <h2 class="section-title">活动日志</h2>
          <div class="activities-list">
            <div
              v-for="(activity, index) in activities"
              :key="index"
              class="activity-item"
            >
              <div class="activity-icon" :class="activity.type">
                {{ activity.type === 'order' ? '📦' : activity.type === 'user' ? '👤' : '⚙️' }}
              </div>
              <div class="activity-content">
                <div class="activity-text">{{ activity.content }}</div>
                <div class="activity-time">{{ activity.time }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding: var(--ls-spacing-lg);
  background: #f5f5f5;
  min-height: 100vh;
}

.dashboard-header {
  margin-bottom: var(--ls-spacing-xl);
}

.dashboard-title {
  font-size: var(--ls-font-size-h1);
  margin-bottom: var(--ls-spacing-xs);
  font-weight: 600;
}

.dashboard-subtitle {
  font-size: var(--ls-font-size-base);
  color: #666;
}

/* 统计卡片网格 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--ls-spacing-base);
  margin-bottom: var(--ls-spacing-lg);
}

.stat-card {
  background: white;
  padding: var(--ls-spacing-lg);
  border-radius: var(--ls-border-radius-lg);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all var(--ls-duration-base);
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.stat-label {
  font-size: var(--ls-font-size-sm);
  color: #999;
  margin-bottom: var(--ls-spacing-xs);
}

.stat-value {
  font-size: var(--ls-font-size-h2);
  font-weight: 600;
  margin-bottom: var(--ls-spacing-xs);
}

.stat-trend {
  font-size: var(--ls-font-size-sm);
  font-weight: 500;
}

.stat-trend.positive {
  color: #52c41a;
}

.stat-trend.negative {
  color: #ff4d4f;
}

.trend-icon {
  margin-right: 4px;
}

/* 主要内容区 */
.dashboard-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--ls-spacing-base);
}

@media (max-width: 1024px) {
  .dashboard-content {
    grid-template-columns: 1fr;
  }
}

.section-card {
  background: white;
  padding: var(--ls-spacing-lg);
  border-radius: var(--ls-border-radius-lg);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: var(--ls-spacing-base);
}

.section-title {
  font-size: var(--ls-font-size-lg);
  font-weight: 600;
  margin-bottom: var(--ls-spacing-base);
}

/* 图表 */
.chart-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
  border-radius: var(--ls-border-radius-base);
  margin: 0 auto;
}

.simple-chart {
  width: 100%;
  height: 100%;
}

/* 订单列表 */
.orders-list {
  display: flex;
  flex-direction: column;
  gap: var(--ls-spacing-sm);
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--ls-spacing-sm);
  background: #fafafa;
  border-radius: var(--ls-border-radius-base);
  transition: all var(--ls-duration-fast);
}

.order-item:hover {
  background: #f0f0f0;
}

.order-info {
  flex: 1;
}

.order-id {
  font-size: var(--ls-font-size-sm);
  font-weight: 600;
  color: #1890ff;
  margin-bottom: 2px;
}

.order-customer {
  font-size: var(--ls-font-size-xs);
  color: #666;
}

.order-details {
  text-align: right;
}

.order-amount {
  font-size: var(--ls-font-size-base);
  font-weight: 600;
  margin-bottom: 2px;
}

.order-status {
  display: inline-block;
  padding: 2px 8px;
  font-size: var(--ls-font-size-xs);
  border-radius: var(--ls-border-radius-sm);
  background: #e6f7ff;
  color: #1890ff;
}

.order-status.已完成 {
  background: #f6ffed;
  color: #52c41a;
}

.order-status.待处理 {
  background: #fff7e6;
  color: #faad14;
}

/* 活动日志 */
.activities-list {
  display: flex;
  flex-direction: column;
  gap: var(--ls-spacing-sm);
}

.activity-item {
  display: flex;
  gap: var(--ls-spacing-sm);
  padding: var(--ls-spacing-sm);
  border-radius: var(--ls-border-radius-base);
  transition: all var(--ls-duration-fast);
}

.activity-item:hover {
  background: #fafafa;
}

.activity-icon {
  flex-shrink: 0;
  width: calc(var(--ls-spacing-base) * 3);
  height: calc(var(--ls-spacing-base) * 3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--ls-font-size-lg);
  border-radius: var(--ls-border-radius-base);
  background: #f0f0f0;
}

.activity-content {
  flex: 1;
}

.activity-text {
  font-size: var(--ls-font-size-sm);
  margin-bottom: 2px;
}

.activity-time {
  font-size: var(--ls-font-size-xs);
  color: #999;
}
</style>

