<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSize } from '../../../../src/vue'

const { currentMode } = useSize()

interface TableData {
  id: number
  name: string
  email: string
  role: string
  status: 'active' | 'inactive' | 'pending'
  joinDate: string
}

const tableData = ref<TableData[]>([
  { id: 1, name: '张三', email: 'zhangsan@example.com', role: '管理员', status: 'active', joinDate: '2024-01-01' },
  { id: 2, name: '李四', email: 'lisi@example.com', role: '编辑', status: 'active', joinDate: '2024-01-05' },
  { id: 3, name: '王五', email: 'wangwu@example.com', role: '用户', status: 'pending', joinDate: '2024-01-10' },
  { id: 4, name: '赵六', email: 'zhaoliu@example.com', role: '用户', status: 'active', joinDate: '2024-01-15' },
  { id: 5, name: '孙七', email: 'sunqi@example.com', role: '编辑', status: 'inactive', joinDate: '2024-01-20' }
])

const statusLabels = {
  active: '激活',
  inactive: '停用',
  pending: '待审核'
}

const statusColors = {
  active: '#52c41a',
  inactive: '#999',
  pending: '#faad14'
}

// 根据尺寸模式调整表格密度
const tableClass = computed(() => [
  'data-table',
  `data-table--${currentMode.value}`
])
</script>

<template>
  <div class="table-demo">
    <div class="table-header">
      <h2 class="table-title">数据表格示例</h2>
      <div class="table-actions">
        <button class="action-btn">导出</button>
        <button class="action-btn primary">添加用户</button>
      </div>
    </div>

    <div class="table-container">
      <table :class="tableClass">
        <thead>
          <tr>
            <th class="checkbox-cell">
              <input type="checkbox" />
            </th>
            <th>ID</th>
            <th>姓名</th>
            <th>邮箱</th>
            <th>角色</th>
            <th>状态</th>
            <th>加入日期</th>
            <th class="actions-cell">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in tableData" :key="row.id">
            <td class="checkbox-cell">
              <input type="checkbox" />
            </td>
            <td class="id-cell">{{ row.id }}</td>
            <td class="name-cell">{{ row.name }}</td>
            <td class="email-cell">{{ row.email }}</td>
            <td>{{ row.role }}</td>
            <td>
              <span
                class="status-badge"
                :style="{ background: statusColors[row.status] }"
              >
                {{ statusLabels[row.status] }}
              </span>
            </td>
            <td class="date-cell">{{ row.joinDate }}</td>
            <td class="actions-cell">
              <button class="table-action-btn">编辑</button>
              <button class="table-action-btn danger">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="table-footer">
      <div class="pagination">
        <button class="pagination-btn">上一页</button>
        <button class="pagination-btn active">1</button>
        <button class="pagination-btn">2</button>
        <button class="pagination-btn">3</button>
        <button class="pagination-btn">下一页</button>
      </div>
      <div class="pagination-info">
        显示 1-5 条，共 5 条
      </div>
    </div>
  </div>
</template>

<style scoped>
.table-demo {
  background: white;
  border-radius: var(--ls-border-radius-lg);
  padding: var(--ls-spacing-lg);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--ls-spacing-lg);
}

.table-title {
  font-size: var(--ls-font-size-h2);
  font-weight: 600;
  margin: 0;
}

.table-actions {
  display: flex;
  gap: var(--ls-spacing-sm);
}

.action-btn {
  height: var(--ls-button-height-medium);
  padding: 0 var(--ls-spacing-base);
  font-size: var(--ls-font-size-sm);
  border: 1px solid #d9d9d9;
  border-radius: var(--ls-border-radius-base);
  background: white;
  cursor: pointer;
  transition: all var(--ls-duration-base);
}

.action-btn:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.action-btn.primary {
  background: #1890ff;
  color: white;
  border-color: #1890ff;
}

.action-btn.primary:hover {
  background: #40a9ff;
}

.table-container {
  overflow-x: auto;
  margin-bottom: var(--ls-spacing-lg);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--ls-font-size-base);
}

/* 不同尺寸模式下的表格样式 */
.data-table--small {
  font-size: var(--ls-font-size-sm);
}

.data-table--small th,
.data-table--small td {
  padding: var(--ls-spacing-xs) var(--ls-spacing-sm);
}

.data-table--medium th,
.data-table--medium td {
  padding: var(--ls-spacing-sm) var(--ls-spacing-base);
}

.data-table--large th,
.data-table--large td {
  padding: var(--ls-spacing-base) var(--ls-spacing-lg);
}

.data-table thead th {
  background: #fafafa;
  font-weight: 600;
  text-align: left;
  border-bottom: 2px solid #f0f0f0;
  white-space: nowrap;
}

.data-table tbody tr {
  border-bottom: 1px solid #f0f0f0;
  transition: all var(--ls-duration-fast);
}

.data-table tbody tr:hover {
  background: #fafafa;
}

.checkbox-cell {
  width: 40px;
  text-align: center;
}

.checkbox-cell input[type="checkbox"] {
  cursor: pointer;
}

.id-cell {
  width: 60px;
  color: #1890ff;
  font-weight: 500;
}

.name-cell {
  font-weight: 500;
}

.email-cell {
  color: #666;
}

.date-cell {
  color: #999;
  font-size: var(--ls-font-size-sm);
}

.status-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: var(--ls-border-radius-sm);
  color: white;
  font-size: var(--ls-font-size-xs);
  font-weight: 500;
}

.actions-cell {
  text-align: right;
  white-space: nowrap;
}

.table-action-btn {
  padding: 4px 8px;
  font-size: var(--ls-font-size-xs);
  border: none;
  border-radius: var(--ls-border-radius-sm);
  background: #f0f0f0;
  color: #333;
  cursor: pointer;
  margin-left: var(--ls-spacing-xs);
  transition: all var(--ls-duration-fast);
}

.table-action-btn:hover {
  background: #e0e0e0;
}

.table-action-btn.danger {
  background: #fff1f0;
  color: #ff4d4f;
}

.table-action-btn.danger:hover {
  background: #ffccc7;
}

.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination {
  display: flex;
  gap: var(--ls-spacing-xs);
}

.pagination-btn {
  height: var(--ls-button-height-small);
  padding: 0 var(--ls-spacing-sm);
  font-size: var(--ls-font-size-sm);
  border: 1px solid #d9d9d9;
  border-radius: var(--ls-border-radius-base);
  background: white;
  cursor: pointer;
  transition: all var(--ls-duration-fast);
}

.pagination-btn:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.pagination-btn.active {
  background: #1890ff;
  color: white;
  border-color: #1890ff;
}

.pagination-info {
  font-size: var(--ls-font-size-sm);
  color: #999;
}

@media (max-width: 768px) {
  .table-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--ls-spacing-base);
  }

  .table-footer {
    flex-direction: column;
    gap: var(--ls-spacing-base);
  }
}
</style>

